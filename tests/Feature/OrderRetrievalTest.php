<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderRetrievalTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_their_orders(): void
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
            ->get('/orders');

        $response->assertSuccessful();

        $response->assertInertia(function ($page) use ($order) {
            $page->component('orders/Index')
                ->has('orders', 1)
                ->where('orders.0.id', $order->id)
                ->where('orders.0.status', 'pending')
                ->where('orders.0.total', 900)
                ->has('orders.0.order_items', 1);
        });
    }

    public function test_user_can_only_view_their_own_orders(): void
    {
        $user = User::factory()->create();

        $otherUser = User::factory()->create();

        $userOrder = Order::factory()->create([
            'user_id' => $user->id,
            'total' => 900.00,
        ]);

        $otherUserOrder = Order::factory()->create([
            'user_id' => $otherUser->id,
            'total' => 1500.00,
        ]);

        $response = $this->actingAs($user)
            ->get('/orders');

        $response->assertSuccessful();

        $response->assertInertia(function ($page) use (
            $userOrder

        ) {
            $page->component('orders/Index')
                ->has('orders', 1)
                ->where('orders.0.id', $userOrder->id);
            // ->missing('orders.0.id', $otherUserOrder->id);
        });
    }

    public function test_guest_cannot_view_orders(): void
    {
        $response = $this->get('/orders');

        $response->assertRedirect('/login');
    }

    public function test_user_with_no_orders_receives_empty_order_list(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get('/orders');

        $response->assertSuccessful();

        $response->assertInertia(function ($page) {
            $page->component('orders/Index')
                ->has('orders', 0);
        });
    }
}
