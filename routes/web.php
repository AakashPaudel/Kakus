<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'Home')->name('home');
Route::inertia('/menu', 'menu/Menu')->name('menu');

Route::get('/dashboard', function (Request $request) {
    return match ($request->user()->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'staff' => redirect()->route('staff.dashboard'),
        'customer' => redirect()->route('customer.dashboard'),
        default => abort(403),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('dashboard', function () {
//     return Inertia::render('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:customer'])
    ->get('/customer/dashboard', function () {
        return Inertia::render('customer/CustomerDashboard');
    })
    ->name('customer.dashboard');

Route::middleware(['auth', 'verified', 'role:staff'])
    ->get('/staff/dashboard', function () {
        return Inertia::render('staff/StaffDashboard');
    })
    ->name('staff.dashboard');

Route::middleware(['auth', 'verified', 'role:admin'])
    ->get('/admin/dashboard', function () {
        return Inertia::render('admin/AdminDashboard');
    })
    ->name('admin.dashboard');

// cart routes
Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'index'])
        ->name('cart.index');

    Route::post('/cart/items', [CartController::class, 'store'])
        ->name('cart.items.store');

    Route::patch('/cart/items/{cartItem}', [CartController::class, 'update'])
        ->name('cart.items.update');

    Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy'])
        ->name('cart.items.destroy');

    Route::delete('/cart', [CartController::class, 'clear'])
        ->name('cart.clear');
});

// order routes

Route::middleware('auth')->group(function () {

    // Cart routes...

    Route::post('/orders', [OrderController::class, 'store'])
        ->name('orders.store');

    Route::get('/orders', [OrderController::class, 'index'])
        ->name('orders.index');

    Route::get('/orders/{order}', [OrderController::class, 'show'])
        ->name('orders.show');

    Route::patch(
        '/orders/{order}/status',
        [OrderController::class, 'updateStatus']
    )->name('orders.status.update');
});

require __DIR__.'/settings.php';
