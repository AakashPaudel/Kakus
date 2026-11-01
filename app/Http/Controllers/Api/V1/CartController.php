<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartItemResource;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Models\MenuItem;
use App\Services\CartService;
use Dedoc\Scramble\Attributes\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class CartController extends Controller
{
    public function index(Request $request): CartResource|JsonResponse
    {
        $cart = $request->user()
            ->cart()
            ->with('cartItems.menuItem.images')
            ->first();

        if (! $cart) {
            return response()->json(['data' => null]);
        }

        return new CartResource($cart);
    }

    #[Response(status: 422, type: 'array{message:string}')]
    public function store(Request $request, CartService $cartService): CartItemResource|JsonResponse
    {
        $validated = $request->validate([
            'menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $menuItem = MenuItem::query()->findOrFail(
            $request->integer('menu_item_id')
        );

        try {
            $cartItem = $cartService->addItem(
                $request->user(),
                $menuItem,
                $validated['quantity']
            );
        } catch (RuntimeException $exception) {
            /** @var string $message */
            $message = (string) $exception->getMessage();

            return response()->json([
                'message' => $message,
            ], 422);
        }

        $cartItem->load('menuItem.images');

        return (new CartItemResource($cartItem))
            ->response()
            ->setStatusCode(201);
    }

    #[Response(status: 422, type: 'array{message:string}')]
    public function update(
        Request $request,
        CartItem $cartItem,
        CartService $cartService
    ): CartItemResource|JsonResponse {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        try {
            $cartItem = $cartService->updateItemQuantity(
                $request->user(),
                $cartItem,
                $validated['quantity']
            );
        } catch (RuntimeException $exception) {
            /** @var string $message */
            $message = (string) $exception->getMessage();

            return response()->json([
                'message' => $message,
            ], 422);
        }

        $cartItem->load('menuItem.images');

        return new CartItemResource($cartItem);
    }

    #[Response(status: 422, type: 'array{message:string}')]
    public function destroy(
        Request $request,
        CartItem $cartItem,
        CartService $cartService
    ): JsonResponse {
        try {
            $cartService->removeItem(
                $request->user(),
                $cartItem
            );
        } catch (RuntimeException $exception) {
            /** @var string $message */
            $message = (string) $exception->getMessage();

            return response()->json([
                'message' => $message,
            ], 422);
        }

        return response()->json([
            'message' => 'Cart item removed successfully.',
        ]);
    }

    public function clear(Request $request, CartService $cartService): JsonResponse
    {
        $cartService->clearCart($request->user());

        return response()->json([
            'message' => 'Cart cleared successfully.',
        ]);
    }
}
