<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\Inventory;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderCancellationTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_cancel_order_and_restore_inventory(): void
    {
        $user = User::factory()->create([
            'role' => 'staff',
        ]);

        $menuItem = MenuItem::factory()->create([
            'price' => 450.00,
            'is_available' => true,
        ]);

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 8,
            'reorder_level' => 3,
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'menu_item_id' => $menuItem->id,
            'name' => $menuItem->name,
            'quantity' => 2,
            'unit_price' => 450.00,
            'subtotal' => 900.00,
        ]);

        $response = $this->actingAs($user)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'cancelled',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'cancelled',
        ]);

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem->id,
            'quantity' => 10,
        ]);

        $this->assertDatabaseHas('order_status_histories', [
            'order_id' => $order->id,
            'changed_by' => $user->id,
            'old_status' => 'pending',
            'new_status' => 'cancelled',
        ]);
    }

    public function test_staff_cannot_cancel_already_cancelled_order(): void
    {
        $user = User::factory()->create([
            'role' => 'staff',
        ]);

        $menuItem = MenuItem::factory()->create([
            'price' => 450.00,
            'is_available' => true,
        ]);

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 10,
            'reorder_level' => 3,
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'cancelled',
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'menu_item_id' => $menuItem->id,
            'name' => $menuItem->name,
            'quantity' => 2,
            'unit_price' => 450.00,
            'subtotal' => 900.00,
        ]);

        $response = $this->actingAs($user)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'cancelled',
            ]);

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            'Order cannot move from cancelled to cancelled.'
        );

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem->id,
            'quantity' => 10,
        ]);
    }

    public function test_staff_can_cancel_confirmed_order(): void
    {
        $user = User::factory()->create([
            'role' => 'staff',
        ]);

        $menuItem = MenuItem::factory()->create([
            'price' => 500.00,
            'is_available' => true,
        ]);

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 5,
            'reorder_level' => 2,
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'confirmed',
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'menu_item_id' => $menuItem->id,
            'name' => $menuItem->name,
            'quantity' => 2,
            'unit_price' => 500.00,
            'subtotal' => 1000.00,
        ]);

        $response = $this->actingAs($user)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'cancelled',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'cancelled',
        ]);

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem->id,
            'quantity' => 7,
        ]);
    }

    public function test_staff_cannot_cancel_completed_order(): void
    {
        $user = User::factory()->create([
            'role' => 'staff',
        ]);

        $menuItem = MenuItem::factory()->create([
            'price' => 500.00,
            'is_available' => true,
        ]);

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 5,
            'reorder_level' => 2,
        ]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        OrderItem::factory()->create([
            'order_id' => $order->id,
            'menu_item_id' => $menuItem->id,
            'name' => $menuItem->name,
            'quantity' => 2,
            'unit_price' => 500.00,
            'subtotal' => 1000.00,
        ]);

        $response = $this->actingAs($user)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'cancelled',
            ]);

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            'Order cannot move from completed to cancelled.'
        );

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem->id,
            'quantity' => 5,
        ]);
    }
}
