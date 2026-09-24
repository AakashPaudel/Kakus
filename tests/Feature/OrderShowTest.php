<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_their_order(): void
    {
        $user = User::factory()->create();

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
            'subtotal' => 900.00,
            'discount' => 0,
            'tax' => 0,
            'delivery_fee' => 0,
            'total' => 900.00,
        ]);

        $menuItem = MenuItem::factory()->create([
            'price' => 450.00,
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
            ->get("/orders/{$order->id}");

        $response->assertSuccessful();

        $response->assertInertia(function ($page) use ($order) {
            $page->component('orders/ShowOrder')
                ->where('order.id', $order->id)
                ->where('order.status', 'pending')
                ->where('order.total', 900)
                ->has('order.order_items', 1);
        });
    }

    public function test_user_cannot_view_another_users_order(): void
    {
        $user = User::factory()->create();

        $otherUser = User::factory()->create();

        $order = Order::factory()->create([
            'user_id' => $otherUser->id,
            'total' => 1500.00,
        ]);

        $response = $this->actingAs($user)
            ->get("/orders/{$order->id}");

        $response->assertForbidden();
    }

    public function test_guest_cannot_view_order(): void
    {
        $order = Order::factory()->create();

        $response = $this->get("/orders/{$order->id}");

        $response->assertRedirect('/login');
    }

    public function test_user_cannot_view_nonexistent_order(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get('/orders/999999');

        $response->assertNotFound();
    }
}
