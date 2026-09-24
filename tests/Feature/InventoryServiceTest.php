<?php

namespace Tests\Feature;

use App\Models\Inventory;
use App\Models\MenuItem;
use App\Services\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

class InventoryServiceTest extends TestCase
{
    use RefreshDatabase;

    private InventoryService $inventoryService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->inventoryService = app(InventoryService::class);
    }

    public function test_it_can_get_inventory(): void
    {
        $menuItem = MenuItem::factory()->create();

        $inventory = Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 20,
            'reorder_level' => 5,
        ]);

        $result = $this->inventoryService
            ->getInventory($menuItem);

        $this->assertEquals(
            $inventory->id,
            $result->id
        );
    }

    public function test_it_can_check_stock_availability(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 10,
            'reorder_level' => 5,
        ]);

        $this->assertTrue(
            $this->inventoryService
                ->hasEnoughStock($menuItem, 5)
        );

        $this->assertFalse(
            $this->inventoryService
                ->hasEnoughStock($menuItem, 11)
        );
    }

    public function test_it_deducts_stock(): void
    {
        $menuItem = MenuItem::factory()->create();

        $inventory = Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 20,
            'reorder_level' => 5,
        ]);

        $this->inventoryService
            ->deductStock($menuItem, 3);

        $this->assertDatabaseHas('inventories', [
            'id' => $inventory->id,
            'quantity' => 17,
        ]);
    }

    public function test_it_restores_stock(): void
    {
        $menuItem = MenuItem::factory()->create();

        $inventory = Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 20,
            'reorder_level' => 5,
        ]);

        $this->inventoryService
            ->restoreStock($menuItem, 4);

        $this->assertDatabaseHas('inventories', [
            'id' => $inventory->id,
            'quantity' => 24,
        ]);
    }

    public function test_it_rejects_deduction_when_stock_is_insufficient(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'reorder_level' => 1,
        ]);

        $this->expectException(RuntimeException::class);

        $this->inventoryService
            ->deductStock($menuItem, 3);
    }

    public function test_it_detects_low_stock(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 5,
            'reorder_level' => 5,
        ]);

        $this->assertTrue(
            $this->inventoryService
                ->isLowStock($menuItem)
        );
    }

    public function test_it_detects_when_stock_is_not_low(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 20,
            'reorder_level' => 5,
        ]);

        $this->assertFalse(
            $this->inventoryService
                ->isLowStock($menuItem)
        );
    }

    public function test_it_rejects_zero_quantity(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 20,
            'reorder_level' => 5,
        ]);

        $this->expectException(RuntimeException::class);

        $this->inventoryService
            ->deductStock($menuItem, 0);
    }

    public function test_it_rejects_negative_quantity(): void
    {
        $menuItem = MenuItem::factory()->create();

        Inventory::create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 20,
            'reorder_level' => 5,
        ]);

        $this->expectException(RuntimeException::class);

        $this->inventoryService
            ->deductStock($menuItem, -1);
    }
}
