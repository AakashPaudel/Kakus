<?php

namespace App\Services;

use App\Models\Inventory;
use Illuminate\Support\Facades\DB;

class InventoryAdminService
{
    public function update(Inventory $inventory, int $quantity, int $reorderLevel): Inventory
    {
        return DB::transaction(function () use ($inventory, $quantity, $reorderLevel): Inventory {
            $inventory = Inventory::query()
                ->lockForUpdate()
                ->findOrFail($inventory->id);

            $inventory->update([
                'quantity' => $quantity,
                'reorder_level' => $reorderLevel,
            ]);

            return $inventory->fresh('menuItem');
        });
    }
}
