<?php

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminReservationController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\MenuItemController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RestaurantTableController;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::post('/contact', [ContactController::class, 'store'])
    ->name('contact.store');

Route::get('/about', function () {
    $featuredItem = MenuItem::query()
        ->where('is_available', true)
        ->where('is_featured', true)
        ->with('images')->skip(1)
        ->first();

    return Inertia::render('About', [
        'featuredItem' => $featuredItem,
    ]);
})->name('about');

Route::get('/menu', function () {
    $categories = Category::query()
        ->where('is_active', true)
        ->orderBy('name')
        ->get(['id', 'name', 'slug']);

    $items = MenuItem::query()
        ->with(['category', 'images']) // Added 'images' relationship
        ->where('is_available', true)
        ->get();

    return Inertia::render('menu/Menu', [
        'categories' => $categories,
        'items' => $items,
    ]);
})->name('menu');
// Route::inertia('/menu', 'menu/Menu')->name('menu');

Route::get('/dashboard', function (Request $request) {
    return match ($request->user()->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'staff' => redirect()->route('staff.dashboard'),
        'customer' => redirect()->route('customer.dashboard'),
        default => abort(403),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('dashboard', function () {
//     return Inertia::render('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:customer'])
    ->get('/customer/dashboard', [DashboardController::class, 'customer'])
    ->name('customer.dashboard');

Route::middleware(['auth', 'verified', 'role:staff'])
    ->get('/staff/dashboard', [DashboardController::class, 'staff'])
    ->name('staff.dashboard');

Route::middleware(['auth', 'verified', 'role:admin,staff'])
    ->get('/admin/dashboard', [DashboardController::class, 'admin'])
    ->name('admin.dashboard');

// cart routes
Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'index'])
        ->name('cart.index');

    Route::post('/cart/items', [CartController::class, 'store'])
        ->name('cart.items.store');

    Route::patch('/cart/items/{cartItem}', [CartController::class, 'update'])
        ->name('cart.items.update');

    Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy'])
        ->name('cart.items.destroy');

    Route::delete('/cart', [CartController::class, 'clear'])
        ->name('cart.clear');
});

// order routes

Route::middleware('auth')->group(function () {

    // Cart routes...

    Route::post('/orders', [OrderController::class, 'store'])
        ->name('orders.store');

    Route::get('/orders', [OrderController::class, 'index'])
        ->name('orders.index');

    Route::get('/orders/{order}', [OrderController::class, 'show'])
        ->name('orders.show');
    Route::patch(
        '/orders/{order}/status',
        [OrderController::class, 'updateStatus']
    )->name('orders.status.update');
});

// for admin and staff to view all orders and reservations, and update their status
Route::middleware(['auth', 'verified', 'role:admin,staff'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/orders', [AdminOrderController::class, 'index'])
            ->name('orders.index');

        Route::get('/reservations', [AdminReservationController::class, 'index'])
            ->name('reservations.index');
    });

// Reservation routes

Route::middleware('auth')->group(function () {

    Route::get(
        '/reservations/create',
        [ReservationController::class, 'create']
    )->name('reservations.create');

    Route::get(
        '/reservations/customer',
        [ReservationController::class, 'indexCustomer']
    )->name('customer.reservations.index');

    Route::post(
        '/reservations',
        [ReservationController::class, 'store']
    )->name('reservations.store');

    Route::get(
        '/reservations',
        [ReservationController::class, 'index']
    )->name('reservations.index');

    Route::get(
        '/reservations/{reservation}',
        [ReservationController::class, 'show']
    )->name('reservations.show');

    Route::get(
        '/reservations/{reservation}/edit',
        [ReservationController::class, 'edit']
    )->name('reservations.edit');

    Route::put(
        '/reservations/{reservation}',
        [ReservationController::class, 'update']
    )->name('reservations.update');

    // Route::get(
    //     '/admin/reservations',
    //     [ReservationController::class, 'index']
    // )->name('admin.reservations.index');

    Route::patch(
        '/reservations/{reservation}/cancel',
        [ReservationController::class, 'cancel']
    )->name('reservations.cancel');
});

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::patch(
        '/admin/reservations/{reservation}/status',
        [ReservationController::class, 'updateStatus']
    )->name('admin.reservations.update-status');
});

Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource(
        'admin/tables',
        RestaurantTableController::class
    )->except(['show'])->parameters([
        'admin/tables' => 'restaurantTable',
    ])->names([
        'index' => 'admin.tables.index',
        'create' => 'admin.tables.create',
        'store' => 'admin.tables.store',
        'edit' => 'admin.tables.edit',
        'update' => 'admin.tables.update',
        'destroy' => 'admin.tables.destroy',
    ]);

    Route::patch(
        'admin/tables/{restaurantTable}/status',
        [RestaurantTableController::class, 'updateStatus']
    )->name('admin.tables.update-status');
});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('menu', MenuItemController::class)
        ->parameters(['menu' => 'menuItem'])
        ->except(['show']);

    Route::post('categories', [CategoryController::class, 'store'])
        ->name('categories.store');
    Route::put('categories/{category}', [CategoryController::class, 'update'])
        ->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])
        ->name('categories.destroy');
});

Route::middleware(['auth', 'verified', 'role:admin,staff'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('inventory', [InventoryController::class, 'index'])
        ->name('inventory.index');
    Route::patch('inventory/{inventory}', [InventoryController::class, 'update'])
        ->name('inventory.update');
});

require __DIR__.'/settings.php';
