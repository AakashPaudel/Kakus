<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::create([
            ...$request->validated(),
            'slug' => $this->slug($request->validated('slug'), $request->validated('name')),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ): RedirectResponse {
        $validated = $request->validated();

        $category->update([
            ...$validated,
            'slug' => $this->slug($validated['slug'] ?? null, $validated['name'], $category),
            'is_active' => $request->boolean('is_active'),
        ]);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->menuItems()->exists()) {
            return back()->with('error', 'Move or delete this category’s menu items before deleting it.');
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }

    private function slug(?string $slug, string $name, ?Category $category = null): string
    {
        $value = Str::slug($slug ?: $name);
        $query = Category::query()->where('slug', $value);

        if ($category) {
            $query->whereKeyNot($category->id);
        }

        return $query->exists()
            ? $value.'-'.Str::lower(Str::random(6))
            : $value;
    }
}
