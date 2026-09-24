<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViewCartTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_their_cart(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza-cart-test',
            'description' => 'Test category',
            'is_active' => true,
        ]);

        $menuItem = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Chicken Pizza',
            'slug' => 'chicken-pizza-cart-test',
            'description' => 'Test pizza',
            'price' => 450,
            'is_available' => true,
            'is_featured' => false,
        ]);

        $cart = $user->cart()->create();

        $cart->cartItems()->create([
            'menu_item_id' => $menuItem->id,
            'quantity' => 2,
            'unit_price' => 450,
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('cart.index'));

        $response->assertSuccessful();
        // dd($cart->load('cartItems.menuItem')->toArray());

        $response->assertInertia(function ($page) use ($cart, $menuItem) {
            $page
                ->component('cart/Cart')
                ->where('cart.id', $cart->id)
                ->where('cart.cartItems.0.menu_item_id', $menuItem->id)
                ->where('cart.cartItems.0.quantity', 2)
                ->where('cart.cartItems.0.unit_price', 450);

            return $page;
        });
    }
}
