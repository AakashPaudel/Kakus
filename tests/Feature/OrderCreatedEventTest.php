<?php

namespace Tests\Feature;

use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class OrderCreatedEventTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_created_event_is_dispatched(): void
    {
        Event::fake([OrderCreated::class]);

        $user = User::factory()->create();

        $order = Order::factory()->create([
            'user_id' => $user->id,
        ]);

        OrderCreated::dispatch($order);

        Event::assertDispatched(
            OrderCreated::class,
            function ($event) use ($order) {
                return $event->order->id === $order->id;
            }
        );
    }
}
