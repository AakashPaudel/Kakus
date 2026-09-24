<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClearCartTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_clear_their_cart(): void
    {
        $user = User::factory()->create();

        $cart = Cart::factory()->create([
            'user_id' => $user->id,
        ]);

        $menuItem1 = MenuItem::factory()->create();
        $menuItem2 = MenuItem::factory()->create();

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem1->id,
            'quantity' => 2,
            'unit_price' => $menuItem1->price,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'menu_item_id' => $menuItem2->id,
            'quantity' => 1,
            'unit_price' => $menuItem2->price,
        ]);

        $this->assertDatabaseCount('cart_items', 2);

        $response = $this
            ->actingAs($user)
            ->delete('/cart');

        $response->assertRedirect();

        $this->assertDatabaseCount('cart_items', 0);

        // The Cart itself must remain.
        $this->assertDatabaseHas('carts', [
            'id' => $cart->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_guest_cannot_clear_cart(): void
    {
        $response = $this->delete('/cart');

        $response->assertRedirect();

        $this->assertGuest();
    }

    public function test_clearing_a_user_cart_does_not_affect_another_users_cart(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $cart1 = Cart::factory()->create([
            'user_id' => $user1->id,
        ]);

        $cart2 = Cart::factory()->create([
            'user_id' => $user2->id,
        ]);

        $menuItem1 = MenuItem::factory()->create();
        $menuItem2 = MenuItem::factory()->create();

        CartItem::factory()->create([
            'cart_id' => $cart1->id,
            'menu_item_id' => $menuItem1->id,
            'quantity' => 2,
            'unit_price' => $menuItem1->price,
        ]);

        CartItem::factory()->create([
            'cart_id' => $cart2->id,
            'menu_item_id' => $menuItem2->id,
            'quantity' => 3,
            'unit_price' => $menuItem2->price,
        ]);

        $this
            ->actingAs($user1)
            ->delete('/cart');

        // User 1's cart is empty.
        $this->assertDatabaseMissing('cart_items', [
            'cart_id' => $cart1->id,
        ]);

        // User 2's cart is untouched.
        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart2->id,
            'menu_item_id' => $menuItem2->id,
            'quantity' => 3,
        ]);
    }

    public function test_clearing_a_cart_that_does_not_exist_is_harmless(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/cart');

        $response->assertRedirect();

        $this->assertDatabaseCount('carts', 0);
        $this->assertDatabaseCount('cart_items', 0);
    }
}
