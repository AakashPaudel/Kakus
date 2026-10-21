<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuItemService
{
    public function create(array $data): MenuItem
    {
        return DB::transaction(function () use ($data): MenuItem {
            $menuItem = MenuItem::create([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'slug' => $this->slug($data['slug'] ?? null, $data['name']),
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'is_available' => $data['is_available'] ?? false,
                'is_featured' => $data['is_featured'] ?? false,
            ]);

            $menuItem->inventory()->create([
                'quantity' => $data['initial_quantity'],
                'reorder_level' => $data['reorder_level'],
            ]);

            return $menuItem;
        });
    }

    public function update(MenuItem $menuItem, array $data): MenuItem
    {
        return DB::transaction(function () use ($menuItem, $data): MenuItem {
            $menuItem->update([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'slug' => $this->slug($data['slug'] ?? null, $data['name'], $menuItem),
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'is_available' => $data['is_available'] ?? false,
                'is_featured' => $data['is_featured'] ?? false,
            ]);

            $menuItem->inventory()->updateOrCreate([], [
                'reorder_level' => $data['reorder_level'],
            ]);

            return $menuItem->fresh(['category', 'inventory']);
        });
    }

    private function slug(?string $slug, string $name, ?MenuItem $menuItem = null): string
    {
        $value = Str::slug($slug ?: $name);
        $query = MenuItem::query()->where('slug', $value);

        if ($menuItem) {
            $query->whereKeyNot($menuItem->id);
        }

        if ($query->exists()) {
            $value .= '-'.Str::lower(Str::random(6));
        }

        return $value;
    }
}
