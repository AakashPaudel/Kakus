<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateInventoryRequest;
use App\Models\Inventory;
use App\Services\InventoryAdminService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class InventoryController extends Controller
{
    public function __construct(
        private readonly InventoryAdminService $inventoryService
    ) {}

    public function index(): Response
    {
        return inertia('admin/inventory/Index', [
            'inventory' => Inventory::query()
                ->with('menuItem')
                ->orderBy('quantity')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function update(
        UpdateInventoryRequest $request,
        Inventory $inventory
    ): RedirectResponse {
        $this->inventoryService->update(
            $inventory,
            $request->integer('quantity'),
            $request->integer('reorder_level')
        );

        return back()->with('success', 'Inventory updated successfully.');
    }
}
