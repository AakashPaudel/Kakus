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
        try {
            $orderService->createOrder(
                $request->user()
            );
        } catch (RuntimeException $e) {
            return back()->with(
                'error',
                $e->getMessage()
            );
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
