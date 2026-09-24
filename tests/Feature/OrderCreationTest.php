<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Inventory;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_order_from_cart(): void
    {
        $user = User::factory()->create();

        $cart = Cart::factory()->create([
            'user_id' => $user->id,
        ]);

        $menuItem1 = MenuItem::factory()->create([
            'price' => 450.00,
            'is_available' => true,
        ]);

        $menuItem2 = MenuItem::factory()->create([
            'price' => 300.00,
            'is_available' => true,
        ]);

        $inventory1 = Inventory::create([
            'menu_item_id' => $menuItem1->id,
            'quantity' => 10,
            'reorder_level' => 3,
        ]);

        $inventory2 = Inventory::create([
            'menu_item_id' => $menuItem2->id,
            'quantity' => 5,
            'reorder_level' => 2,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem1->id,
            'quantity' => 2,
            'unit_price' => 450.00,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem2->id,
            'quantity' => 1,
            'unit_price' => 300.00,
        ]);

        $response = $this->actingAs($user)
            ->post('/orders');

        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'status' => 'pending',
            'subtotal' => 1200.00,
            'discount' => 0,
            'tax' => 0,
            'delivery_fee' => 0,
            'total' => 1200.00,
        ]);

        $order = Order::where('user_id', $user->id)->firstOrFail();

        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'menu_item_id' => $menuItem1->id,
            'name' => $menuItem1->name,
            'quantity' => 2,
            'unit_price' => 450.00,
            'subtotal' => 900.00,
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'menu_item_id' => $menuItem2->id,
            'name' => $menuItem2->name,
            'quantity' => 1,
            'unit_price' => 300.00,
            'subtotal' => 300.00,
        ]);

        $this->assertDatabaseCount('cart_items', 0);

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem1->id,
            'quantity' => 8,
        ]);

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem2->id,
            'quantity' => 4,
        ]);
    }

    public function test_empty_cart_cannot_create_order(): void
    {
        $user = User::factory()->create();

        Cart::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)
            ->post('/orders');

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            'Your cart is empty.'
        );

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_unavailable_menu_item_cannot_be_ordered(): void
    {
        $user = User::factory()->create();

        $cart = Cart::factory()->create([
            'user_id' => $user->id,
        ]);

        $menuItem = MenuItem::factory()->create([
            'price' => 500.00,
            'is_available' => false,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem->id,
            'quantity' => 1,
            'unit_price' => 500.00,
        ]);

        $response = $this->actingAs($user)
            ->post('/orders');

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            "The menu item '{$menuItem->name}' is no longer available."
        );

        $this->assertDatabaseCount('orders', 0);

        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem->id,
        ]);
    }

    public function test_guest_cannot_create_order(): void
    {
        $response = $this->post('/orders');

        $response->assertRedirect('/login');

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_user_without_cart_cannot_create_order(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post('/orders');

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            'You do not have a cart.'
        );

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_order_is_rolled_back_when_inventory_is_insufficient(): void
    {
        $user = User::factory()->create();

        $cart = Cart::factory()->create([
            'user_id' => $user->id,
        ]);

        $menuItem1 = MenuItem::factory()->create([
            'price' => 450.00,
            'is_available' => true,
        ]);

        $menuItem2 = MenuItem::factory()->create([
            'price' => 300.00,
            'is_available' => true,
        ]);

        Inventory::create([
            'menu_item_id' => $menuItem1->id,
            'quantity' => 10,
            'reorder_level' => 3,
        ]);

        Inventory::create([
            'menu_item_id' => $menuItem2->id,
            'quantity' => 2,
            'reorder_level' => 1,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem1->id,
            'quantity' => 2,
            'unit_price' => 450.00,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem2->id,
            'quantity' => 3,
            'unit_price' => 300.00,
        ]);

        $response = $this->actingAs($user)
            ->post('/orders');

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            "Insufficient stock for menu item {$menuItem2->id}."
        );

        /*
     * Order must not exist.
     */
        $this->assertDatabaseCount('orders', 0);

        /*
     * Order items must not exist.
     */
        $this->assertDatabaseCount('order_items', 0);

        /*
     * Cart must remain untouched.
     */
        $this->assertDatabaseCount('cart_items', 2);

        /*
     * Even though burger stock was deducted BEFORE
     * fries failed, the transaction must roll everything back.
     */
        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem1->id,
            'quantity' => 10,
        ]);

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem2->id,
            'quantity' => 2,
        ]);
    }
}
