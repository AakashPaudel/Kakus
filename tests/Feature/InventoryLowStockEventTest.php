<?php

namespace Tests\Feature;

use App\Events\LowStockDetected;
use App\Models\Inventory;
use App\Models\MenuItem;
use App\Services\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class InventoryLowStockEventTest extends TestCase
{
    use RefreshDatabase;

    public function test_low_stock_event_is_dispatched_when_stock_crosses_reorder_level(): void
    {
        Event::fake([
            LowStockDetected::class,
        ]);
        
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 6,
            'reorder_level' => 5,
        ]);

        $service = app(InventoryService::class);

        $service->deductStock($menuItem, 1);

        Event::assertDispatched(
            LowStockDetected::class,
            function (LowStockDetected $event) use ($menuItem) {
                return $event->menuItem->is($menuItem)
                    && $event->inventory->quantity === 5;
            }
        );
    }

    public function test_low_stock_event_is_not_dispatched_when_stock_remains_above_reorder_level(): void
    {
        Event::fake([
            LowStockDetected::class,
        ]);

        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 10,
            'reorder_level' => 5,
        ]);

        $service = app(InventoryService::class);

        $service->deductStock($menuItem, 2);

        Event::assertNotDispatched(
            LowStockDetected::class
        );
    }

    public function test_low_stock_event_is_not_repeated_while_inventory_remains_low(): void
    {
        Event::fake([
            LowStockDetected::class,
        ]);

        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 6,
            'reorder_level' => 5,
        ]);

        $service = app(InventoryService::class);

        // 6 -> 5
        $service->deductStock($menuItem, 1);

        // 5 -> 4
        $service->deductStock($menuItem, 1);

        // 4 -> 3
        $service->deductStock($menuItem, 1);

        Event::assertDispatchedTimes(
            LowStockDetected::class,
            1
        );
    }
}
