<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddToCartTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_add_menu_item_to_cart(): void
    {
        $user = User::factory()->create();

        $cart = Cart::create([
            'user_id' => $user->id,
        ]);

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-test',
            'description' => 'Test pizza',
            'price' => 450,
            'is_available' => true,
            'is_featured' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('cart.items.store'), [
                'menu_item_id' => $menuItem->id,
                'quantity' => 2,
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'unit_price' => 450,
        ]);
    }

    public function test_adding_same_menu_item_again_increases_quantity(): void
    {
        $user = User::factory()->create();

        $cart = Cart::create([
            'user_id' => $user->id,
        ]);

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-test-2',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-test-2',
            'description' => 'Test pizza',
            'price' => 450,
            'is_available' => true,
            'is_featured' => false,
        ]);

        $this->actingAs($user)
            ->post(route('cart.items.store'), [
                'menu_item_id' => $menuItem->id,
                'quantity' => 2,
            ]);

        $this->actingAs($user)
            ->post(route('cart.items.store'), [
                'menu_item_id' => $menuItem->id,
                'quantity' => 3,
            ]);

        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem->id,
            'quantity' => 5,
        ]);

        $this->assertDatabaseCount('cart_items', 1);
    }

    public function test_guest_cannot_add_item_to_cart(): void
    {
        $response = $this->post(route('cart.items.store'), [
            'menu_item_id' => 1,
            'quantity' => 1,
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_quantity_must_be_at_least_one(): void
    {
        $user = User::factory()->create();

        // $cart = Cart::create([
        //     'user_id' => $user->id,
        // ]);

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-validation-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-validation-test',
            'description' => 'Test pizza',
            'price' => 450,
            'is_available' => true,
            'is_featured' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('cart.items.store'), [
                'menu_item_id' => $menuItem->id,
                'quantity' => 0,
            ]);

        $response->assertSessionHasErrors('quantity');

        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_unavailable_menu_item_cannot_be_added_to_cart(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-unavailable-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Unavailable Pizza',
            'slug' => 'unavailable-pizza-test',
            'description' => 'Test unavailable pizza',
            'price' => 450,
            'is_available' => false,
            'is_featured' => false,
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('cart.items.store'), [
                'menu_item_id' => $menuItem->id,
                'quantity' => 1,
            ]);

        $response->assertRedirect();

        $response->assertSessionHas(
            'error',
            'This menu item is currently unavailable.'
        );

        $this->assertDatabaseCount('cart_items', 0);
    }
}
