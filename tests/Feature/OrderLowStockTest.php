<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Inventory;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Notifications\LowStockNotification;
use Tests\TestCase;
use Illuminate\Support\Facades\Queue;
use App\Events\LowStockDetected;
use Illuminate\Events\CallQueuedListener;
use App\Listeners\SendLowStockNotification;


class OrderLowStockTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_creation_triggers_low_stock_notification(): void
    {
        Notification::fake();

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $menuItem = MenuItem::factory()->create([
            'price' => 450.00,
            'is_available' => true,
        ]);

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 6,
            'reorder_level' => 5,
        ]);

        $cart = Cart::factory()->create([
            'user_id' => $customer->id,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem->id,
            'quantity' => 1,
            'unit_price' => 450.00,
        ]);

        $this->actingAs($customer)
            ->post('/orders')
            ->assertRedirect();

        Notification::assertSentTo(
            $staff,
            LowStockNotification::class
        );
    }


    public function test_low_stock_listener_is_queued(): void
    {
        Queue::fake();

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $menuItem = MenuItem::factory()->create([
            'price' => 450.00,
            'is_available' => true,
        ]);

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 6,
            'reorder_level' => 5,
        ]);

        $cart = Cart::factory()->create([
            'user_id' => $customer->id,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem->id,
            'quantity' => 1,
            'unit_price' => 450.00,
        ]);


        $this->actingAs($customer)
            ->post('/orders')
            ->assertRedirect();

        Queue::assertPushed(
            CallQueuedListener::class,
            function (CallQueuedListener $job): bool {
                return $job->class === SendLowStockNotification::class;
            }

        );
    }

    public function test_low_stock_notification_is_not_processed_when_order_transaction_rolls_back(): void
    {
        Queue::fake();

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $burger = MenuItem::factory()->create([
            'price' => 450.00,
            'is_available' => true,
        ]);

        $fries = MenuItem::factory()->create([
            'price' => 300.00,
            'is_available' => true,
        ]);

        Inventory::create([
            'menu_item_id' => $burger->id,
            'quantity' => 6,
            'reorder_level' => 5,
        ]);

        Inventory::create([
            'menu_item_id' => $fries->id,
            'quantity' => 2,
            'reorder_level' => 1,
        ]);

        $cart = Cart::factory()->create([
            'user_id' => $customer->id,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $burger->id,
            'quantity' => 1,
            'unit_price' => 450.00,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $fries->id,
            'quantity' => 3,
            'unit_price' => 300.00,
        ]);

        $this->actingAs($customer)
            ->post('/orders')
            ->assertRedirect();

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $burger->id,
            'quantity' => 6,
        ]);

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $fries->id,
            'quantity' => 2,
        ]);

        Queue::assertNothingPushed();
    }
}
