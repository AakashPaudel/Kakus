# Kakus Restaurant Application: System Design & Architecture

This document explains the architecture that exists in this repository and the
design reasoning behind it. It is intentionally code-grounded: examples use the
actual controllers, services, models, routes, migrations, middleware, and
events in the application.

## 1. System Architecture Overview

### 1.1 Architectural pattern

Kakus is a **modular Laravel monolith** with these layers:

```text
Browser / Mobile API client
          |
          v
Routes (web.php / api.php)
          |
          v
Middleware (web, auth, verified, role, auth:sanctum)
          |
          v
Controllers and Form Requests
          |
          +--> Policies / Gates
          |
          v
Application Services
  CartService, OrderService, ReservationService,
  InventoryService, RestaurantTableService
          |
          v
Eloquent Models and Relationships
          |
          v
Database (SQLite by default; configurable Laravel database)

After commit:
  Domain events -> listeners -> notifications / broadcast / queued work
```

The application is not a strict Repository-pattern implementation. Controllers
and services use Eloquent directly. This is a reasonable choice for a
Laravel-sized domain: Eloquent already provides a repository-like persistence
abstraction, while the service layer protects multi-step business operations.

The most important architectural boundary is the service layer:

- [`OrderService`](app/Services/OrderService.php) owns checkout, inventory
  deduction, status transitions, and status history.
- [`ReservationService`](app/Services/ReservationService.php) owns table
  locking, availability checks, reservation creation, updates, and status
  transitions.
- [`CartService`](app/Services/CartService.php) owns cart-item concurrency and
  cart ownership checks.
- [`InventoryService`](app/Services/InventoryService.php) owns stock locks,
  deduction, restoration, and low-stock events.

This keeps controllers focused on HTTP concerns: accept input, authorize,
validate, call an operation, and choose a response.

### 1.2 Web request-response lifecycle

```text
HTTP request
    |
    v
bootstrap/app.php
    |
    +-- web middleware: encrypted cookies, appearance, Inertia shared props
    +-- auth / verified / role middleware
    |
    v
routes/web.php
    |
    v
Controller method
    |
    +-- FormRequest or Request validation
    +-- Gate::authorize() / Policy
    +-- Service operation
    |       +-- Eloquent queries
    |       +-- DB::transaction()
    |       +-- domain event after commit
    |
    v
Inertia response or redirect with flash data
    |
    v
React page under resources/js/pages
```

For example, `POST /orders` reaches
[`OrderController::store`](app/Http/Controllers/OrderController.php), validates
fulfillment data, calls `OrderService::createOrder`, and redirects back with a
success or error flash message.

### 1.3 API request-response lifecycle

```text
Mobile / external client
    |
    v
routes/api.php (/api/v1/*)
    |
    +-- throttle for login and 2FA
    +-- auth:sanctum for protected routes
    |
    v
Api\V1 controller
    |
    +-- validation
    +-- service / model operation
    +-- API Resource or JSON response
    |
    v
JSON response
```

The API is versioned under `/api/v1`. Public menu and authentication endpoints
are separated from authenticated cart, order, and reservation endpoints.

## 2. Authentication & Authorization Architecture

### 2.1 Web authentication with Fortify

This application uses Laravel Fortify rather than a hand-written login system.
[`config/fortify.php`](config/fortify.php) configures:

- The `web` guard.
- Email as the username.
- Lower-cased usernames.
- Registration, password reset, email verification, two-factor
  authentication, and passkeys.
- Fortify routes using the `web` middleware group.
- Login, 2FA, and passkey rate limiters.

Registration is customized in
[`CreateNewUser`](app/Actions/Fortify/CreateNewUser.php):

```php
return User::create([
    'name' => $input['name'],
    'email' => $input['email'],
    'password' => $input['password'],
    'role' => 'customer',
]);
```

The explicit customer default is a security boundary: self-registration cannot
create an administrator or staff account.

The [`User`](app/Models/User.php) model combines:

- Laravel's session-authenticated `Authenticatable`.
- `TwoFactorAuthenticatable` for TOTP and recovery codes.
- `PasskeyAuthenticatable` for WebAuthn passkeys.
- `HasApiTokens` for Sanctum personal access tokens.
- `Notifiable` for email and other notifications.

Passwords are hashed by the model cast, and sensitive authentication fields are
hidden from serialization.

### 2.2 API authentication with Sanctum

The API login endpoint is implemented by
[`AuthenticationController`](app/Http/Controllers/Api/V1/Auth/AuthenticationController.php):

1. Validate email and password.
2. Validate credentials through the `web` guard.
3. If 2FA is enabled, create a short-lived challenge record in the cache.
4. Otherwise, issue a Sanctum token with the `api:access` ability.
5. Return a deliberately limited user representation.

The 2FA API flow is:

```text
POST /api/v1/auth/login
       |
       +-- credentials valid, 2FA disabled -> Sanctum token
       |
       +-- credentials valid, 2FA enabled -> challenge_id (202)
                                             |
                                             v
                         POST /api/v1/auth/two-factor-challenge
                                             |
                         cache lock + user row lock + TOTP/recovery validation
                                             |
                                             v
                                      Sanctum token
```

The cache lock prevents concurrent reuse of the same challenge, while the user
row lock serializes recovery-code mutation. The challenge is hashed in its
cache key and expires after five minutes.

Protected API routes use `auth:sanctum` in
[`routes/api.php`](routes/api.php). Logout deletes the current access token,
which provides token revocation for that device/session.

### 2.3 RBAC implementation

The current RBAC model is intentionally simple:

```text
users.role = customer | staff | admin
```

The role is added by
[`2026_09_19_161303_add_role_to_users_table.php`](database/migrations/2026_09_19_161303_add_role_to_users_table.php).
There is no `roles` table, permissions table, or user-role pivot in the current
schema.

[`RoleMiddleware`](app/Http/Middleware/RoleMiddleware.php) receives one or more
allowed roles:

```php
Route::middleware(['auth', 'verified', 'role:admin,staff'])
    ->group(/* staff operations */);
```

Current responsibility split:

| Role     | Main capabilities                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------- |
| Customer | Browse menu, manage own cart, place orders, view own orders, create/update/cancel own reservations |
| Staff    | View/manage operational orders and reservations, manage tables and inventory                       |
| Admin    | Staff capabilities plus menu/category management and administrative access                         |

Middleware is coarse-grained route protection. Policies provide object-level
authorization:

- [`OrderPolicy`](app/Policies/OrderPolicy.php) restricts order viewing to the
  owner and status changes to staff/admin.
- [`ReservationPolicy`](app/Policies/ReservationPolicy.php) distinguishes
  owner access from staff/admin operational access and blocks edits to
  completed/cancelled reservations.

This two-level model matters:

```text
Role middleware: "May this type of user enter this area?"
Policy:          "May this user act on this particular record?"
```

If permissions become more granular, the next evolution should be a
role/permission model or a well-maintained permission package rather than
adding increasingly complex role strings.

### 2.4 Middleware pipeline

`bootstrap/app.php` registers:

- Web middleware additions for appearance, Inertia shared data, and asset
  preload headers.
- The `role` alias for `RoleMiddleware`.
- JSON exception rendering for `/api/*` and JSON-preferring requests.

Typical protected web pipeline:

```text
web
  -> auth
  -> verified
  -> role:admin,staff
  -> controller
```

Typical protected API pipeline:

```text
api
  -> auth:sanctum
  -> controller
```

Authentication establishes identity; `verified`, role middleware, policies, and
Form Request authorization establish progressively narrower trust.

## 3. Domain Data Modeling & ERD Conceptual Layout

### 3.1 Conceptual ERD

```text
User
 | 1
 +---- 1 Cart --------< CartItem >-------- 1 MenuItem >-------- 1 Category
 |                         |
 |                         +-- snapshots unit_price
 |
 +----< Order --------< OrderItem >------- 1 MenuItem
 |       |
 |       +----< OrderStatusHistory >---- User (changed_by)
 |       |
 |       +---- Payment (planned/scaffolded)
 |
 +----< Reservation >-------- 1 RestaurantTable
 |
 +----< Favorite >----------- 1 MenuItem
 +----< Review >------------- 1 MenuItem

MenuItem
 +----< MenuItemImage
 +---- 1 Inventory
 +----< DailySpecial
```

### 3.2 Core entities

- **User**: identity, role, email verification, password, 2FA/passkey data.
- **Category**: normalized menu grouping with a unique slug and active flag.
- **MenuItem**: product name, description, price, availability, category, and
  featured flag.
- **MenuItemImage**: one-to-many images, including a primary-image marker.
- **Inventory**: one stock row per menu item, protected by a unique
  `menu_item_id`.
- **Cart**: one active cart per user, enforced by a unique `user_id`.
- **CartItem**: quantity and price captured when added to a cart. A composite
  unique key prevents duplicate menu-item rows inside one cart.
- **Order**: financial totals, fulfillment mode/address, and lifecycle status.
- **OrderItem**: immutable order-time name, quantity, unit price, and subtotal
  snapshot. This preserves historical truth if the menu changes later.
- **OrderStatusHistory**: audit trail of status transitions and the user who
  made each change.
- **RestaurantTable**: table number, capacity, and operational status.
- **Reservation**: user, table, date/time range, guest count, status, and
  special request.
- **Payment**: currently only an empty table migration/model; payment processing
  is not implemented yet.

### 3.3 Normalization and foreign-key strategy

The schema generally follows third-normal-form principles:

- Categories, menu items, carts, orders, tables, and users are separate
  entities.
- Relationships use foreign keys rather than repeated descriptive fields.
- One-to-many relationships use child-table foreign keys.
- Unique constraints express invariants such as one cart per user, one
  inventory row per item, and unique slugs/table numbers.
- `cascadeOnDelete` is used for dependent data such as cart items and order
  items.
- `restrictOnDelete` protects business history for users, menu items, orders,
  and reservations.

Deliberate denormalization exists in `order_items.name` and price fields. Those
are snapshots, not duplicated live menu data; they are necessary to render an
order accurately after a menu rename or price change.

## 4. Key Workflows & State Machines

### 4.1 Order lifecycle

The implemented order state machine is:

```text
pending -> confirmed -> preparing -> ready -> completed
    |          |            |          |
    +----------+------------+----------+
                 cancelled
```

`OrderService::updateStatus` is the authoritative transition guard:

```php
$allowedTransitions = [
    'pending' => ['confirmed', 'cancelled'],
    'confirmed' => ['preparing', 'cancelled'],
    'preparing' => ['ready', 'cancelled'],
    'ready' => ['completed', 'cancelled'],
    'completed' => [],
    'cancelled' => [],
];
```

Checkout is currently:

```text
Cart
  -> validate fulfillment and delivery fields
  -> load cart items and menu items
  -> reject unavailable items
  -> calculate subtotal/tax/fees
  -> create pending Order
  -> create OrderItems with price/name snapshots
  -> deduct Inventory
  -> delete CartItems
  -> dispatch OrderCreated after commit
```

There is not yet a `Payment` transition in this workflow. The requested
`Payment/Pending` concept should be modeled as either a payment status/value
object or separate payment state machine before integrating a gateway:

```text
pending payment -> authorized -> paid -> fulfilment states
                \-> failed / expired
```

Keep payment state separate from kitchen fulfillment state so a paid order can
still be preparing and a cancelled order can have a refunded payment.

### 4.2 Reservation lifecycle

```text
pending -> confirmed -> completed
    |
    v
 cancelled

confirmed -> cancelled
```

Creation in `ReservationService`:

1. Start a database transaction.
2. Select the requested `RestaurantTable` with `lockForUpdate()`.
3. Reject inactive tables and guest counts above capacity.
4. Search the same table/date for pending or confirmed reservations whose
   intervals overlap:

```text
existing.start < requested.end
AND existing.end > requested.start
```

5. Insert the reservation as `pending`.

The overlap formula treats touching intervals as non-overlapping, so a
reservation ending at 18:00 can be followed by one beginning at 18:00.

The create and update paths lock rows before checking mutable state. This is
the correct shape for serialization, but the table-row lock is only fully
effective when all writers use the same locking protocol. For stronger
database-level guarantees, add a database-specific exclusion strategy or a
slot-allocation table.

The reservation reminder command is scheduled daily at 18:00 in
[`routes/console.php`](routes/console.php), uses `withoutOverlapping()` and
`onOneServer()`, and locks each reservation before marking
`reminder_sent_at`.

## 5. Data Flow & Transaction Management

### 5.1 Atomic order creation

`OrderService::createOrder` wraps the complete checkout operation in
`DB::transaction`. This provides all-or-nothing behavior:

```text
If any item is unavailable, stock is insufficient, or persistence fails:
  Order + items + stock changes + cart deletion all roll back.
```

`InventoryService::deductStock` obtains the inventory row with
`lockForUpdate()`. Therefore two concurrent checkouts for the same menu item
cannot both read and consume the same stock.

The `OrderCreated` event is dispatched through `DB::afterCommit`, which avoids
notifying consumers about an order that later rolls back.

Cancellation uses another transaction to restore each item’s inventory and
write an order status-history row.

### 5.2 Cart race protection

`CartService::addItem` locks an existing cart-item row before incrementing its
quantity. The database unique key on `(cart_id, menu_item_id)` protects the
create path from duplicate rows. The create-or-retrieve fallback handles a
duplicate-cart race caused by two concurrent requests.

### 5.3 Reservation race protection

`ReservationService` locks the table row before checking conflicts and inserting
the reservation. Reservation indexes on
`(restaurant_table_id, reservation_date)` and
`(user_id, reservation_date)` support the conflict and customer-history
queries.

The remaining risk is that no database constraint directly represents
overlapping time ranges. A production-hardening option is:

1. Store reservations in a database with exclusion constraints, or
2. Allocate fixed time slots in a unique table, or
3. Create a per-table/day lock record and require every reservation writer to
   lock it before checking intervals.

### 5.4 Transaction boundaries

Use one transaction for one business invariant:

- Checkout: order, order items, stock, and cart.
- Cancellation: status, stock restoration, and history.
- Reservation create/update/status: lock, check, mutate, and event.
- 2FA challenge completion: user lock, recovery-code mutation, token issue.

Do not perform slow external HTTP calls or email delivery inside these
transactions. Dispatch after commit and use queued, idempotent handlers.

## 6. Scalability, Caching & Performance Bottlenecks

### 6.1 Current defaults

The default cache and queue drivers are database-backed:

- [`config/cache.php`](config/cache.php): `database`.
- [`config/queue.php`](config/queue.php): `database`.

This is suitable for development and a small deployment, but Redis is the
natural production choice when multiple application instances need fast shared
cache locks, high-throughput queues, and Horizon monitoring.

### 6.2 Recommended cache boundaries

The public menu is a high-read, low-write candidate:

```php
$menu = Cache::remember(
    'menu:available:v1',
    now()->addMinutes(10),
    fn () => MenuItem::query()
        ->with(['category', 'images'])
        ->where('is_available', true)
        ->get()
);
```

Invalidate the key after menu/category/image changes. Do not cache mutable
inventory, cart, order status, or reservation availability without a clear
consistency strategy. For reservation availability, stale data can cause
confusing user experience, although the transaction remains the final
authority.

The existing API 2FA challenge cache is correctly short-lived. Cache locks are
used for challenge serialization and are also appropriate for distributed
coordination after moving to Redis.

### 6.3 Query optimization

Existing code already demonstrates good eager-loading practices:

- `OrderController` loads `orderItems.menuItem`.
- `ReservationController` loads `user` and `restaurantTable`.
- The menu route loads `category` and `images`.
- The reminder command loads `user` and `restaurantTable`.

Continue to:

- Eager load relationships before loops.
- Select only columns needed by list pages.
- Use `withCount` for counts rather than hydrating children.
- Add indexes from measured query patterns.
- Use `chunkById`/`lazyById` for large notification or reporting jobs.
- Enable `Model::preventLazyLoading(! app()->isProduction())` during
  development to expose N+1 regressions.

The largest likely bottlenecks are admin lists, menu image payloads, and
inventory/order reporting as data grows. Paginate those endpoints and return
API Resources or dedicated view models instead of unconstrained full tables.

### 6.4 Queue and asynchronous architecture

The event/listener design already provides an asynchronous seam:

```text
OrderCreated (after commit)
    -> SendOrderCreatedNotification
    -> order notification

LowStockDetected (after commit)
    -> SendLowStockNotification (queued listener)
    -> staff/admin notifications

Scheduled command
    -> reservation reminder notification
```

For production:

- Queue email and external notifications.
- Use Redis plus Horizon for worker balancing and visibility.
- Keep jobs idempotent because a worker can fail after a side effect and before
  acknowledgement.
- Set job timeouts shorter than `retry_after`.
- Use unique jobs for duplicate-prone order/payment processing.
- Keep payment gateway calls outside database transactions and record explicit
  idempotency keys.

## 7. Security & Input Validation

### 7.1 CSRF and session security

State-changing web routes run through the `web` middleware and should use
Laravel's CSRF token mechanism in Blade or the Inertia client's configured
request flow. Fortify's session authentication uses the encrypted web session
and `auth` middleware.

The API uses bearer tokens through Sanctum, not browser session cookies for
these versioned token endpoints. Token logout revokes the current token.

### 7.2 SQL injection and mass assignment

The application uses Eloquent/query-builder bindings rather than interpolated
SQL. Continue to allow-list dynamic sort columns or filters because bindings
protect values, not SQL identifiers.

Models define fillable attributes or PHP attributes such as
`#[Fillable(...)]`. Controllers pass validated data to services, and services
construct explicit persistence arrays. This prevents request fields from
silently setting privileged columns.

### 7.3 Form Request validation

The reservation boundary uses
[`StoreReservationRequest`](app/Http/Requests/StoreReservationRequest.php) and
[`UpdateReservationRequest`](app/Http/Requests/UpdateReservationRequest.php)
for:

- Existing table IDs.
- Future dates.
- `H:i` time formats.
- Positive guest counts.
- Maximum request lengths.
- Cross-field `end_time > start_time`.

The order controller validates fulfillment mode and conditionally requires
delivery fields. Validation is necessary but not sufficient for mutable
invariants: stock and reservation conflicts are checked again inside
transactions.

### 7.4 Policies and authorization

The application uses `Gate::authorize()` in controllers and `authorize()` in
Form Requests. This prevents the common mistake of treating authentication as
permission.

Examples:

```php
Gate::authorize('view', $order);

return $this->user()?->can(
    'update',
    $this->route('reservation')
) ?? false;
```

Route role middleware protects broad areas; policies protect individual
resources. Both are needed for object ownership and staff workflows.

### 7.5 Additional hardening recommendations

- Add explicit authorization to every API mutation, not only
  `auth:sanctum`, especially for order/reservation status endpoints.
- Consider policy checks or scoped bindings for `cartItem`, `order`, and
  `reservation` route parameters to prevent cross-user object access.
- Replace free-form role strings with a backed enum or a role/permission model
  when the permission matrix grows.
- Complete the payment model before accepting real payments: provider,
  provider transaction ID, amount, currency, status, idempotency key, and
  webhook verification are essential.
- Add database checks/constraints for valid statuses, non-negative money,
  positive quantities, and valid reservation intervals where supported.
- Rate-limit login, 2FA, password reset, and expensive API operations.
- Keep secrets in configuration/environment storage, never source code.
- Log security-relevant failures with request/user context without logging
  passwords, tokens, recovery codes, or payment secrets.

## Architectural takeaway

The codebase demonstrates a useful progression for learning system design:

1. **Framework layer**: routing, middleware, Fortify, Sanctum, Inertia.
2. **Application layer**: services express business operations.
3. **Domain model**: Eloquent relationships and state transitions express
   restaurant concepts.
4. **Consistency layer**: transactions, row locks, unique constraints, and
   after-commit events protect invariants.
5. **Scale layer**: cache-aside reads, eager loading, queues, Redis locks, and
   idempotent workers allow the monolith to grow before a service split is
   justified.

The next architectural boundaries to mature are payment processing, stronger
reservation uniqueness at the database level, and finer-grained permissions.
Those are domain-driven extensions of the current design rather than reasons
to prematurely replace the modular monolith.
