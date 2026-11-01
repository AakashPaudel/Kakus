<?php

namespace App\Listeners;

use App\Events\ReservationStatusChanged;
use App\Notifications\ReservationStatusNotification;

class SendReservationStatusChangedNotification
{
    public function handle(ReservationStatusChanged $event): void
    {
        $event->reservation->loadMissing([
            'user',
            'restaurantTable',
        ]);

        $event->reservation->user->notify(
            (new ReservationStatusNotification(
                $event->reservation,
                $event->previousStatus,
                $event->newStatus
            ))->afterCommit()
        );
    }
}
