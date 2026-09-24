<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RemoveCartItemTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_remove_cart_item(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-remove-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-remove-test',
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
            ->delete(route('cart.items.destroy', $cartItem));

        $response
            ->assertRedirect()
            ->assertSessionHas(
                'success',
                'Item removed from cart.'
            );

        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
    }

    public function test_user_cannot_remove_another_users_cart_item(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-remove-security-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-remove-security-test',
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
            ->delete(route('cart.items.destroy', $cartItem));

        $response
            ->assertRedirect()
            ->assertSessionHas(
                'error',
                'This cart item does not belong to your cart.'
            );

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 2,
        ]);
    }

    public function test_guest_cannot_remove_cart_item(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-remove-guest-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-remove-guest-test',
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

        $response = $this->delete(
            route('cart.items.destroy', $cartItem)
        );

        $response->assertRedirect();

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
        ]);
    }
}
