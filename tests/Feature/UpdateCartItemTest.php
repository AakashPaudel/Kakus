<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateCartItemTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_update_cart_item_quantity(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-update-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-update-test',
            'description' => 'Test pizza',
            'price' => 450,
            'is_available' => true,
            'is_featured' => false,
        ]);

        $cart = $user->cart()->create();

        $cartItem = $cart->cartItems()->create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'unit_price' => 450,
        ]);

        $response = $this
            ->actingAs($user)
            ->patch(route('cart.items.update', $cartItem), [
                'quantity' => 5,
            ]);

        $response
            ->assertRedirect()
            ->assertSessionHas('success', 'Cart quantity updated.');

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 5,
        ]);
    }

    public function test_quantity_must_be_at_least_one(): void
    {
        $user = User::factory()->create();

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

        $cart = $user->cart()->create();

        $cartItem = $cart->cartItems()->create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'unit_price' => 450,
        ]);

        $response = $this
            ->actingAs($user)
            ->patch(route('cart.items.update', $cartItem), [
                'quantity' => 0,
            ]);

        $response->assertSessionHasErrors('quantity');

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 2,
        ]);
    }

    public function test_user_cannot_update_another_users_cart_item(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-security-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-security-test',
            'description' => 'Test pizza',
            'price' => 450,
            'is_available' => true,
            'is_featured' => false,
        ]);

        $cart = $owner->cart()->create();

        $cartItem = $cart->cartItems()->create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'unit_price' => 450,
        ]);

        $response = $this
            ->actingAs($attacker)
            ->patch(route('cart.items.update', $cartItem), [
                'quantity' => 10,
            ]);

        $response
            ->assertRedirect()
            ->assertSessionHas('error', 'This cart item does not belong to your cart.');

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 2,
        ]);
    }
}
