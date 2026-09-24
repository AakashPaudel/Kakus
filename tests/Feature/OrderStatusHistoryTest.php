<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_status_change_creates_history_record(): void
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

        $this->assertDatabaseHas(
            'order_status_histories',
            [
                'order_id' => $order->id,
                'changed_by' => $staff->id,
                'old_status' => 'pending',
                'new_status' => 'confirmed',
            ]
        );
    }

    public function test_each_status_change_creates_a_history_record(): void
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
            ]);

        $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'preparing',
            ]);

        $this->assertDatabaseCount(
            'order_status_histories',
            2
        );

        $this->assertDatabaseHas(
            'order_status_histories',
            [
                'order_id' => $order->id,
                'old_status' => 'pending',
                'new_status' => 'confirmed',
            ]
        );

        $this->assertDatabaseHas(
            'order_status_histories',
            [
                'order_id' => $order->id,
                'old_status' => 'confirmed',
                'new_status' => 'preparing',
            ]
        );
    }

    public function test_history_records_who_changed_the_status(): void
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
            ]);

        $history = OrderStatusHistory::firstOrFail();

        $this->assertSame(
            $staff->id,
            $history->changedBy->id
        );
    }

    public function test_invalid_status_transition_creates_no_history(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $order = Order::factory()->create([
            'status' => 'pending',
        ]);

        $this->actingAs($staff)
            ->patch("/orders/{$order->id}/status", [
                'status' => 'ready',
            ])
            ->assertRedirect();

        $this->assertDatabaseCount(
            'order_status_histories',
            0
        );

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'pending',
        ]);
    }
}
