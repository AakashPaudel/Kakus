<?php

use App\Http\Controllers\Api\V1\Auth\AuthenticationController;
use App\Http\Controllers\Api\V1\MenuItemController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('auth/login', [AuthenticationController::class, 'store'])
        ->middleware('throttle:api-login')
        ->name('api.v1.auth.login');

    Route::post('auth/two-factor-challenge', [AuthenticationController::class, 'twoFactorChallenge'])
        ->middleware('throttle:api-two-factor')
        ->name('api.v1.auth.two-factor-challenge');

    Route::get('menu-items', [MenuItemController::class, 'index'])
        ->name('api.v1.menu-items.index');
});
