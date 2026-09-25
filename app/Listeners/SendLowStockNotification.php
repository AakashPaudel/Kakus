<?php

namespace App\Listeners;

use App\Events\LowStockDetected;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\LowStockNotification;
use App\Models\User;

class SendLowStockNotification implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LowStockDetected $event): void
    {
        $users = User::whereIn('role', [
            'admin',
            'staff',
        ])->get();

        foreach ($users as $user) {
            $user->notify(
                new LowStockNotification(
                    $event->menuItem,
                    $event->inventory
                )
            );
        }
    }
}
{
    /**
     * Create the event listener.
     */
   

    /**
     * Handle the event.
     */
    
}
