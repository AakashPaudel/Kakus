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
}