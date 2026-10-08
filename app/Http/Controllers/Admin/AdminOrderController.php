<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->with('user')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/orders/Index', [
            'orders' => $orders,
        ]);
    }
}