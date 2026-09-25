<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use App\Events\LowStockDetected;
use App\Models\Order;

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
        int $quantity,
        ?Order $order = null
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

        /*
         * Remember whether the inventory was already
         * in the low-stock state before this deduction.
         */
        $wasLowStock = $inventory->quantity <= $inventory->reorder_level;

        $inventory->decrement('quantity', $quantity);

        $inventory = $inventory->fresh();

        /*
         * Notify only when the stock crosses INTO
         * the low-stock state.
         *
         * Example:
         *
         * 6 -> 5  = notify
         * 5 -> 4  = no notification
         * 4 -> 3  = no notification
         */
        $isLowStock = $inventory->quantity <= $inventory->reorder_level;

        if (!$wasLowStock && $isLowStock) {
            LowStockDetected::dispatch(
                $menuItem,
                $inventory
            );
        }

        return $inventory;
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

        $inventory = $menuItem->inventory()
            ->lockForUpdate()
            ->firstOrFail();

        $inventory->increment('quantity', $quantity);

        return $inventory->fresh();
    }

    public function isLowStock(MenuItem $menuItem): bool
    {
        $inventory = $this->getInventory($menuItem);

        return $inventory->quantity <= $inventory->reorder_level;
    }
}
