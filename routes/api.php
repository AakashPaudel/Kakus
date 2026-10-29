<?php

use App\Http\Controllers\Api\V1\MenuItemController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('menu-items', [MenuItemController::class, 'index'])
        ->name('api.v1.menu-items.index');
});
