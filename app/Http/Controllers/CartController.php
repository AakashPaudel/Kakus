<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\MenuItem;
use App\Services\CartService;
use Illuminate\Http\Request;
use RuntimeException;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->user()
            ->cart()
            ->with('cartItems.menuItem')
            ->first();

        return inertia('cart/Cart', [
            'cart' => $cart ? [
                'id' => $cart->id,

                'cartItems' => $cart->cartItems->map(function ($cartItem) {
                    return [
                        'id' => $cartItem->id,
                        'menu_item_id' => $cartItem->menu_item_id,
                        'quantity' => $cartItem->quantity,
                        'unit_price' => $cartItem->unit_price,
                        'subtotal' => $cartItem->subtotal,

                        'menuItem' => [
                            'id' => $cartItem->menuItem->id,
                            'name' => $cartItem->menuItem->name,
                            'price' => $cartItem->menuItem->price,
                        ],
                    ];
                }),

                'subtotal' => $cart->subtotal,
            ] : null,
        ]);
    }

    public function store(Request $request, CartService $cartService)
    {
        $validated = $request->validate([
            'menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $menuItem = MenuItem::findOrFail($validated['menu_item_id']);

        try {
            $cartService->addItem(
                $request->user(),
                $menuItem,
                $validated['quantity']
            );
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Item added to cart.');
    }

    public function update(
        Request $request,
        CartItem $cartItem,
        CartService $cartService
    ) {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        try {
            $cartService->updateItemQuantity(
                $request->user(),
                $cartItem,
                $validated['quantity']
            );
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Cart quantity updated.');
    }

    public function destroy(
        CartItem $cartItem,
        Request $request,
        CartService $cartService
    ) {
        try {
            $cartService->removeItem(
                $request->user(),
                $cartItem
            );
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Item removed from cart.');
    }

    public function clear(
        Request $request,
        CartService $cartService
    ) {
        $cartService->clearCart(
            $request->user()
        );

        return back()->with(
            'success',
            'Cart cleared successfully.'
        );
    }
}
