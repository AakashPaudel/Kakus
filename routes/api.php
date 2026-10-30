<?php

use App\Http\Controllers\Api\V1\Auth\AuthenticationController;
use App\Http\Controllers\Api\V1\MenuItemController;
use App\Http\Controllers\Api\V1\OrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {

    // Public authentication routes
    Route::post('auth/login', [AuthenticationController::class, 'store'])
        ->middleware('throttle:api-login')
        ->name('api.v1.auth.login');

    Route::post('auth/two-factor-challenge', [AuthenticationController::class, 'twoFactorChallenge'])
        ->middleware('throttle:api-two-factor')
        ->name('api.v1.auth.two-factor-challenge');

    // Public menu endpoint
    Route::get('menu-items', [MenuItemController::class, 'index'])
        ->name('api.v1.menu-items.index');

    // Protected authentication routes
    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('auth/me', [AuthenticationController::class, 'me'])
            ->name('api.v1.auth.me');

        Route::post('auth/logout', [AuthenticationController::class, 'logout'])
            ->name('api.v1.auth.logout');

        Route::get('orders', [OrderController::class, 'index'])
            ->name('api.v1.orders.index');

        Route::get('orders/{order}', [OrderController::class, 'show'])
            ->name('api.v1.orders.show');
    });
});
