<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Inventory;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_access_menu_administration(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $response = $this->actingAs($customer)->get(route('admin.menu.index'));

        $response->assertForbidden();
    }

    public function test_admin_can_create_a_menu_item_with_inventory(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $category = Category::factory()->create();

        $response = $this->actingAs($admin)->post(route('admin.menu.store'), [
            'category_id' => $category->id,
            'name' => 'Spicy Noodles',
            'slug' => 'spicy-noodles',
            'description' => 'A house favorite.',
            'price' => 450,
            'is_available' => true,
            'is_featured' => true,
            'initial_quantity' => 20,
            'reorder_level' => 5,
        ]);

        $response->assertRedirect(route('admin.menu.index'));

        $menuItem = MenuItem::query()->where('slug', 'spicy-noodles')->firstOrFail();

        $this->assertDatabaseHas('inventories', [
            'menu_item_id' => $menuItem->id,
            'quantity' => 20,
            'reorder_level' => 5,
        ]);
    }

    public function test_staff_cannot_create_a_menu_item(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);
        $category = Category::factory()->create();

        $response = $this->actingAs($staff)->post(route('admin.menu.store'), [
            'category_id' => $category->id,
            'name' => 'Unauthorized item',
            'price' => 100,
            'initial_quantity' => 1,
            'reorder_level' => 1,
        ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('menu_items', ['name' => 'Unauthorized item']);
    }

    public function test_staff_can_update_inventory_but_customer_cannot(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);
        $inventory = Inventory::factory()->create([
            'quantity' => 3,
            'reorder_level' => 5,
        ]);

        $response = $this->actingAs($staff)->patch(
            route('admin.inventory.update', $inventory),
            ['quantity' => 25, 'reorder_level' => 8]
        );

        $response->assertRedirect();
        $this->assertDatabaseHas('inventories', [
            'id' => $inventory->id,
            'quantity' => 25,
            'reorder_level' => 8,
        ]);

        $response = $this->actingAs($customer)->patch(
            route('admin.inventory.update', $inventory),
            ['quantity' => 1, 'reorder_level' => 1]
        );

        $response->assertForbidden();
    }

    public function test_category_cannot_be_deleted_while_it_has_menu_items(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $category = Category::factory()->create();
        MenuItem::factory()->create([
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($admin)->delete(
            route('admin.categories.destroy', $category)
        );

        $response
            ->assertRedirect()
            ->assertSessionHas('error');
        $this->assertModelExists($category);
    }
}
