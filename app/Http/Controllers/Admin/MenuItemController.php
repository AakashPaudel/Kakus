<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Models\Category;
use App\Models\MenuItem;
use App\Services\MenuItemService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class MenuItemController extends Controller
{
    public function __construct(
        private readonly MenuItemService $menuItemService
    ) {}

    public function index(): Response
    {
        return inertia('admin/menu/Index', [
            'categories' => Category::query()
                ->withCount('menuItems')
                ->orderBy('name')
                ->get(),
            'items' => MenuItem::query()
                ->with(['category', 'inventory'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return inertia('admin/menu/Create', [
            'categories' => Category::query()->where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function store(StoreMenuItemRequest $request): RedirectResponse
    {
        $this->menuItemService->create($request->validated());

        return to_route('admin.menu.index')
            ->with('success', 'Menu item created successfully.');
    }

    public function edit(MenuItem $menuItem): Response
    {
        return inertia('admin/menu/Edit', [
            'item' => $menuItem->load(['category', 'inventory']),
            'categories' => Category::query()->where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function update(
        UpdateMenuItemRequest $request,
        MenuItem $menuItem
    ): RedirectResponse {
        $this->menuItemService->update($menuItem, $request->validated());

        return to_route('admin.menu.index')
            ->with('success', 'Menu item updated successfully.');
    }

    public function destroy(MenuItem $menuItem): RedirectResponse
    {
        $menuItem->delete();

        return to_route('admin.menu.index')
            ->with('success', 'Menu item deleted successfully.');
    }
}
