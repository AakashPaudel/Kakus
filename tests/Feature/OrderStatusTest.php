<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_confirm_pending_order(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $order = Order::factory()->create([
            'status' => 'pending',
        ]);

        $response = $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'confirmed',
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_staff_can_move_order_through_valid_statuses(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $order = Order::factory()->create([
            'status' => 'pending',
        ]);

        $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'confirmed',
            ])
            ->assertRedirect();

        $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'preparing',
            ])
            ->assertRedirect();

        $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'ready',
            ])
            ->assertRedirect();

        $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'completed',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'completed',
        ]);
    }

    public function test_customer_cannot_change_order_status(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($customer)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'completed',
            ]);

        $response->assertForbidden();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'pending',
        ]);
    }

    public function test_guest_cannot_change_order_status(): void
    {
        $order = Order::factory()->create([
            'status' => 'pending',
        ]);

        $response = $this->patch(
            "/orders/{$order->id}/status",
            [
                'status' => 'confirmed',
            ]
        );

        $response->assertRedirect('/login');
    }

    public function test_invalid_status_is_rejected(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $order = Order::factory()->create([
            'status' => 'pending',
        ]);

        $response = $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'something_invalid',
            ]);

        $response->assertSessionHasErrors('status');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'pending',
        ]);
    }

    public function test_order_cannot_skip_status(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $order = Order::factory()->create([
            'status' => 'pending',
        ]);

        $response = $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'ready',
            ]);

        $response->assertSessionHas('error');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'pending',
        ]);
    }
}
