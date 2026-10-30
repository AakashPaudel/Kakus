<?php

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

test('unauthenticated users cannot access the orders API', function () {
    $this->getJson(route('api.v1.orders.index'))->assertUnauthorized();
    $this->getJson(route('api.v1.orders.show', 1))->assertUnauthorized();
});

test('authenticated users can list only their own orders', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $userOrder = Order::factory()->create(['user_id' => $user->id]);
    $otherOrder = Order::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user, 'sanctum')
        ->getJson(route('api.v1.orders.index'));

    $response
        ->assertOk()
        ->assertJsonPath('meta.total', 1)
        ->assertJsonPath('data.0.id', $userOrder->id)
        ->assertJsonMissing(['id' => $otherOrder->id]);
});

test('customers can view their own order with its items', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    $menuItem = MenuItem::factory()->create();
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'menu_item_id' => $menuItem->id,
        'name' => $menuItem->name,
        'quantity' => 2,
        'unit_price' => $menuItem->price,
        'subtotal' => $menuItem->price * 2,
    ]);

    $response = $this->actingAs($user, 'sanctum')
        ->getJson(route('api.v1.orders.show', $order));

    $response
        ->assertOk()
        ->assertJsonPath('data.id', $order->id)
        ->assertJsonPath('data.order_items.0.menu_item_id', $menuItem->id)
        ->assertJsonPath('data.order_items.0.menu_item.id', $menuItem->id)
        ->assertJsonMissingPath('data.user_id');
});

test('customers cannot view another customers order', function () {
    $user = User::factory()->create();
    $otherOrder = Order::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->getJson(route('api.v1.orders.show', $otherOrder))
        ->assertForbidden();
});

test('orders API pagination respects the requested limit', function () {
    $user = User::factory()->create();
    Order::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user, 'sanctum')
        ->getJson(route('api.v1.orders.index', ['per_page' => 2]));

    $response
        ->assertOk()
        ->assertJsonPath('meta.per_page', 2)
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('meta.total', 3)
        ->assertJsonStructure([
            'data',
            'links',
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ]);
});
