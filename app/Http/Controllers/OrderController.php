<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use RuntimeException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('orderItems.menuItem')
            ->latest()
            ->get();

        return inertia('orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order)
    {
        Gate::authorize('view', $order);

        $order->load('orderItems.menuItem');

        return inertia('orders/ShowOrder', [
            'order' => $order,
        ]);
    }


    public function store(
        Request $request,
        OrderService $orderService
    ) {
        $validated = $request->validate([
            'fulfillment_type' => [
                'required',
                'in:delivery,pickup,dine_in',
            ],

            'street_address' => [
                'exclude_unless:fulfillment_type,delivery',
                'required',
                'string',
                'max:255',
            ],

            'city' => [
                'exclude_unless:fulfillment_type,delivery',
                'required',
                'string',
                'max:100',
            ],

            'postal_code' => [
                'exclude_unless:fulfillment_type,delivery',
                'required',
                'string',
                'max:20',
            ],

            'delivery_notes' => [
                'exclude_unless:fulfillment_type,delivery',
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        try {
            $orderService->createOrder(
                $request->user(),
                $validated
            );
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with(
            'success',
            'Order placed successfully.'
        );
    }


    public function updateStatus(
        Request $request,
        Order $order,
        OrderService $orderService
    ) {
        Gate::authorize('updateStatus', $order);

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:pending,confirmed,preparing,ready,completed,cancelled',
            ],
        ]);

        try {
            $orderService->updateStatus(
                $request->user(),
                $order,
                $validated['status']
            );
        } catch (RuntimeException $e) {
            return back()->with(
                'error',
                $e->getMessage()
            );
        }

        return back()->with(
            'success',
            'Order status updated successfully.'
        );
    }
}
