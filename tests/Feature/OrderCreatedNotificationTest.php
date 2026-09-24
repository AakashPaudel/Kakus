<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderCreatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class OrderCreatedNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_receives_order_created_notification(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $order = Order::factory()->create([
            'user_id' => $user->id,
        ]);

        $user->notify(
            new OrderCreatedNotification($order)
        );

        Notification::assertSentTo(
            $user,
            OrderCreatedNotification::class,
            function ($notification) use ($order) {
                return $notification->order->id === $order->id;
            }
        );
    }
}
