<?php

namespace Tests\Feature;

use App\Events\OrderCreated;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class LogOrderCreatedTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_created_listener_logs_order(): void
    {
        Log::spy();

        $order = Order::factory()->create();

        // Trigger your event/listener here
        event(new OrderCreated($order));

        Log::shouldHaveReceived('info')
            ->with("Order created: {$order->id}")
            ->once();
    }
}
