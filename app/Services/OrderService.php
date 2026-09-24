<?php

namespace App\Services;

use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OrderService
{
    public function __construct(
        protected InventoryService $inventoryService
    ) {
        //
    }

    public function createOrder(User $user): Order
    {
        return DB::transaction(function () use ($user) {

            $cart = $user->cart;

            if (! $cart) {
                throw new RuntimeException(
                    'You do not have a cart.'
                );
            }

            $cart->load('cartItems.menuItem');

            if ($cart->cartItems->isEmpty()) {
                throw new RuntimeException(
                    'Your cart is empty.'
                );
            }

            foreach ($cart->cartItems as $cartItem) {
                if (! $cartItem->menuItem->is_available) {
                    throw new RuntimeException(
                        "The menu item '{$cartItem->menuItem->name}' is no longer available."
                    );
                }
            }

            $subtotal = $cart->cartItems->sum(
                fn ($cartItem) => $cartItem->subtotal
            );

            $discount = 0;
            $tax = 0;
            $deliveryFee = 0;

            $total = $subtotal
                - $discount
                + $tax
                + $deliveryFee;

            $order = $user->orders()->create([
                'status' => 'pending',
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'delivery_fee' => $deliveryFee,
                'total' => $total,
            ]);

            /*
         * Create order items and deduct inventory.
         *
         * InventoryService uses lockForUpdate(), so the
         * inventory row remains locked until this transaction
         * finishes.
         */
            foreach ($cart->cartItems as $cartItem) {

                $order->orderItems()->create([
                    'menu_item_id' => $cartItem->menu_item_id,
                    'name' => $cartItem->menuItem->name,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'subtotal' => $cartItem->subtotal,
                ]);

                $this->inventoryService->deductStock(
                    $cartItem->menuItem,
                    $cartItem->quantity
                );
            }

            $cart->cartItems()->delete();

            /*
         * Dispatch only after the order and its order items
         * have successfully been created.
         */
            OrderCreated::dispatch($order);

            return $order;
        });
    }

    public function updateStatus(
        User $user,
        Order $order,
        string $newStatus
    ): Order {
        return DB::transaction(function () use (
            $user,
            $order,
            $newStatus
        ) {
            $allowedTransitions = [
                'pending' => ['confirmed'],
                'confirmed' => ['preparing'],
                'preparing' => ['ready'],
                'ready' => ['completed'],
                'completed' => [],
            ];

            $currentStatus = $order->status;

            if (! in_array(
                $newStatus,
                $allowedTransitions[$currentStatus] ?? []
            )) {
                throw new RuntimeException(
                    "Order cannot move from {$currentStatus} to {$newStatus}."
                );
            }

            $order->status = $newStatus;
            $order->save();

            $order->statusHistories()->create([
                'changed_by' => $user->id,
                'old_status' => $currentStatus,
                'new_status' => $newStatus,
            ]);

            return $order;
        });
    }
}
