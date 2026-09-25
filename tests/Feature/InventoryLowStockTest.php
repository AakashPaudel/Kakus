<?php

namespace Tests\Feature;

use App\Models\Inventory;
use App\Models\MenuItem;
use App\Services\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryLowStockTest extends TestCase
{
    use RefreshDatabase;

    public function test_inventory_is_low_stock_when_quantity_reaches_reorder_level(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 5,
            'reorder_level' => 5,
        ]);

        $service = app(InventoryService::class);

        $this->assertTrue(
            $service->isLowStock($menuItem)
        );
    }

    public function test_inventory_is_not_low_stock_when_quantity_is_above_reorder_level(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 10,
            'reorder_level' => 5,
        ]);

        $service = app(InventoryService::class);

        $this->assertFalse(
            $service->isLowStock($menuItem)
        );
    }

    public function test_inventory_is_low_stock_when_quantity_is_below_reorder_level(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'reorder_level' => 5,
        ]);

        $service = app(InventoryService::class);

        $this->assertTrue(
            $service->isLowStock($menuItem)
        );
    }
}