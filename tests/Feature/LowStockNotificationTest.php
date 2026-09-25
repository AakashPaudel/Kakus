<?php

namespace Tests\Feature;

use App\Events\LowStockDetected;
use App\Listeners\SendLowStockNotification;
use App\Models\Inventory;
use App\Models\MenuItem;
use App\Models\User;
use App\Notifications\LowStockNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class LowStockNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_low_stock_notification_is_sent_to_staff_and_admin(): void
    {
        Notification::fake();

        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        User::factory()->create([
            'role' => 'customer',
        ]);

        $menuItem = MenuItem::factory()->create([
            'name' => 'Burger',
        ]);

        $inventory = Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 3,
            'reorder_level' => 5,
        ]);

        $event = new LowStockDetected(
            $menuItem,
            $inventory
        );

        $listener = new SendLowStockNotification();

        $listener->handle($event);

        Notification::assertSentTo(
            $admin,
            LowStockNotification::class
        );

        Notification::assertSentTo(
            $staff,
            LowStockNotification::class
        );

        Notification::assertNotSentTo(
            User::where('role', 'customer')->first(),
            LowStockNotification::class
        );
    }

    public function test_notification_contains_correct_stock_information(): void
    {
        Notification::fake();

        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $menuItem = MenuItem::factory()->create([
            'name' => 'Chicken Momo',
        ]);

        $inventory = Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'reorder_level' => 5,
        ]);

        $event = new LowStockDetected(
            $menuItem,
            $inventory
        );

        $listener = new SendLowStockNotification();

        $listener->handle($event);

        Notification::assertSentTo(
            $staff,
            LowStockNotification::class,
            function (LowStockNotification $notification) use ($menuItem, $inventory) {
                return $notification->menuItem->is($menuItem)
                    && $notification->inventory->is($inventory);
            }
        );
    }
}