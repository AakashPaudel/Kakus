<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class InventoryService
{
    public function getInventory(MenuItem $menuItem): Inventory
    {
        return $menuItem->inventory()
            ->firstOrFail();
    }

    public function hasEnoughStock(
        MenuItem $menuItem,
        int $quantity
    ): bool {
        if ($quantity <= 0) {
            return false;
        }

        return $this->getInventory($menuItem)->quantity >= $quantity;
    }

    public function deductStock(
        MenuItem $menuItem,
        int $quantity
    ): Inventory {
        if ($quantity <= 0) {
            throw new RuntimeException(
                'Quantity must be greater than zero.'
            );
        }

        $inventory = $menuItem->inventory()
            ->lockForUpdate()
            ->firstOrFail();

        if ($inventory->quantity < $quantity) {
            throw new RuntimeException(
                "Insufficient stock for menu item {$menuItem->id}."
            );
        }

        $inventory->decrement('quantity', $quantity);

        return $inventory->fresh();
    }

    public function restoreStock(
        MenuItem $menuItem,
        int $quantity
    ): Inventory {
        if ($quantity <= 0) {
            throw new RuntimeException(
                'Quantity must be greater than zero.'
            );
        }

        return DB::transaction(function () use ($menuItem, $quantity) {
            $inventory = $menuItem->inventory()
                ->lockForUpdate()
                ->firstOrFail();

            $inventory->increment('quantity', $quantity);

            return $inventory->fresh();
        });
    }

    public function isLowStock(MenuItem $menuItem): bool
    {
        $inventory = $this->getInventory($menuItem);

        return $inventory->quantity <= $inventory->reorder_level;
    }
}
