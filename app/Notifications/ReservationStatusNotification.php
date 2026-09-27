<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReservationStatusNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Reservation $reservation
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'reservation_id' => $this->reservation->id,
            'status' => $this->reservation->status->value,
            'reservation_date' =>
                $this->reservation->reservation_date->format('Y-m-d'),
            'start_time' => $this->reservation->start_time,
            'end_time' => $this->reservation->end_time,
            'message' =>
                "Your reservation status is now {$this->reservation->status->value}.",
        ];
    }
}