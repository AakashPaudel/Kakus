<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MenuItemController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $perPage = $validated['per_page'] ?? 10;

        $menuItems = MenuItem::query()
            ->where('is_available', true)
            ->whereHas('category', function ($query): void {
                $query->where('is_active', true);
            })
            ->when(
                $validated['search'] ?? null,
                fn ($query, string $search) => $query->where(
                    'name',
                    'like',
                    "%{$search}%"
                )
            )
            ->when(
                $validated['category_id'] ?? null,
                fn ($query, int $categoryId) => $query->where(
                    'category_id',
                    $categoryId
                )
            )
            ->with(['category', 'images'])
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return MenuItemResource::collection($menuItems);
    }
}
