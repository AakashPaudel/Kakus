<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function admin(): Response
    {
        $today = now()->toDateString();

        $stats = [
            'totalOrders' => Order::count(),
            'pendingOrders' => Order::where('status', 'pending')->count(),
            'totalReservations' => Reservation::count(),
            'totalCustomers' => User::where('role', 'customer')->count(),
        ];

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();

        $recentReservations = Reservation::with('user')
            ->latest()
            ->take(5)
            ->get();

        $lowStockItems = Inventory::with('menuItem')
            ->whereColumn('quantity', '<=', 'reorder_level')
            ->orderBy('quantity')
            ->take(5)
            ->get();

        // Assumes your order amount column is named "total".
        $sales = [
            'today' => (float) Order::whereDate('created_at', $today)
                ->where('status', 'completed')
                ->sum('total'),

            'week' => (float) Order::whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek(),
            ])->where('status', 'completed')->sum('total'),

            'month' => (float) Order::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->where('status', 'completed')
                ->sum('total'),
        ];

        return Inertia::render('admin/AdminDashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentReservations' => $recentReservations,
            'lowStockItems' => $lowStockItems,
            'sales' => $sales,
        ]);
    }

    /**
     * Display the staff dashboard.
     */
    public function staff(): Response
    {
        $today = now()->toDateString();

        $stats = [
            'todayOrders' => Order::whereDate('created_at', $today)->count(),

            'pendingOrders' => Order::whereIn('status', [
                'pending',
            ])->count(),

            'todayReservations' => Reservation::whereDate(
                'reservation_date',
                $today
            )->count(),

            'completedOrders' => Order::whereDate('created_at', $today)
                ->where('status', 'completed')
                ->count(),
        ];

        $recentOrders = Order::with('user')
            ->whereDate('created_at', $today)
            ->latest()
            ->take(5)
            ->get();

        $recentReservations = Reservation::with('user')
            ->whereDate('reservation_date', $today)
            ->orderBy('start_time')
            ->take(5)
            ->get();

        // dd([
        //     'stats' => $stats,
        //     'recentOrders' => $recentOrders->toArray(),
        //     'recentReservations' => $recentReservations->toArray(),
        // ]);

        return Inertia::render('staff/StaffDashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentReservations' => $recentReservations,
        ]);
    }

    /**
     * Display the customer dashboard.
     */
    public function customer(Request $request): Response
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id);

        $stats = [
            'totalOrders' => (clone $orders)->count(),

            'activeOrders' => (clone $orders)
                ->whereIn('status', ['pending', 'preparing', 'ready'])
                ->count(),

            'completedOrders' => (clone $orders)
                ->where('status', 'completed')
                ->count(),

            'upcomingReservations' => Reservation::where('user_id', $user->id)
                ->whereDate('reservation_date', '>=', now()->toDateString())
                ->whereIn('status', ['pending', 'confirmed'])
                ->count(),
        ];

        $recentOrders = (clone $orders)
            ->latest()
            ->take(5)
            ->get();

        $upcomingReservation = Reservation::where('user_id', $user->id)
            ->whereDate('reservation_date', '>=', now()->toDateString())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('reservation_date')
            ->orderBy('start_time')
            ->first();
        
            
        return Inertia::render('customer/CustomerDashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'upcomingReservation' => $upcomingReservation,
        ]);
    }
}
