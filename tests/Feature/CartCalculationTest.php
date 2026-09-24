<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartCalculationTest extends TestCase
{
    use RefreshDatabase;

    public function test_cart_item_subtotal_is_calculated_from_quantity_and_unit_price(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-calculation-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-calculation-test',
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

        $this->assertSame(900.0, $cartItem->subtotal);
    }

    public function test_cart_subtotal_is_sum_of_all_item_subtotals(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-cart-total-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $pizza = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-cart-total-test',
            'description' => 'Test pizza',
            'price' => 450,
            'is_available' => true,
            'is_featured' => false,
        ]);

        $burger = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Burger',
            'slug' => 'chicken-burger-cart-total-test',
            'description' => 'Test burger',
            'price' => 350,
            'is_available' => true,
            'is_featured' => false,
        ]);

        $cart = $user->cart()->create();

        $cart->cartItems()->create([
            'menu_item_id' => $pizza->id,
            'quantity' => 2,
            'unit_price' => 450,
        ]);

        $cart->cartItems()->create([
            'menu_item_id' => $burger->id,
            'quantity' => 1,
            'unit_price' => 350,
        ]);

        $this->assertSame(1250.0, $cart->subtotal);
    }
}
