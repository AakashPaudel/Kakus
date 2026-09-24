<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CartService
{
    public function addItem(
        User $user,
        MenuItem $menuItem,
        int $quantity = 1
    ): Model {
        if (! $menuItem->is_available) {
            throw new RuntimeException(
                'This menu item is currently unavailable.'
            );
        }

        return DB::transaction(function () use ($user, $menuItem, $quantity) {

            $cart = $this->getOrCreateCart($user);

            $cartItem = $cart->cartItems()
                ->where('menu_item_id', $menuItem->id)
                ->lockForUpdate()
                ->first();

            if ($cartItem) {
                $cartItem->quantity += $quantity;
                $cartItem->save();

                return $cartItem;
            }

            return $cart->cartItems()->create([
                'menu_item_id' => $menuItem->id,
                'quantity' => $quantity,
                'unit_price' => $menuItem->price,
            ]);
        });
    }

    private function getOrCreateCart(User $user): Cart
    {
        $cart = $user->cart;

        if ($cart) {
            return $cart;
        }

        try {
            return $user->cart()->create();
        } catch (QueryException $e) {
            if ($e->errorInfo[1] === 1062) {
                return $user->cart()->firstOrFail();
            }

            throw $e;
        }
    }

    public function updateItemQuantity(
        User $user,
        CartItem $cartItem,
        int $quantity
    ): CartItem {
        return DB::transaction(function () use ($user, $cartItem, $quantity) {
            $cart = $user->cart;

            if (! $cart || $cartItem->cart_id !== $cart->id) {
                throw new RuntimeException(
                    'This cart item does not belong to your cart.'
                );
            }

            $cartItem = $cart->cartItems()
                ->whereKey($cartItem->id)
                ->lockForUpdate()
                ->firstOrFail();

            $cartItem->quantity = $quantity;
            $cartItem->save();

            return $cartItem;
        });
    }

    public function removeItem(
        User $user,
        CartItem $cartItem
    ): void {
        DB::transaction(function () use ($user, $cartItem) {
            $cart = $user->cart;

            if (! $cart || $cartItem->cart_id !== $cart->id) {
                throw new RuntimeException(
                    'This cart item does not belong to your cart.'
                );
            }

            $cartItem = $cart->cartItems()
                ->whereKey($cartItem->id)
                ->lockForUpdate()
                ->firstOrFail();

            $cartItem->delete();
        });
    }

    public function clearCart(User $user): void
    {
        DB::transaction(function () use ($user) {
            $cart = $user->cart;

            // User does not have a cart yet.
            // There is simply nothing to clear.
            if (! $cart) {
                return;
            }

            $cart->cartItems()->delete();
        });
    }
}
