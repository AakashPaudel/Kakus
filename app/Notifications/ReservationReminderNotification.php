<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReservationReminderNotification extends Notification
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
            'reservation_date' =>
                $this->reservation->reservation_date->format('Y-m-d'),
            'start_time' => $this->reservation->start_time,
            'end_time' => $this->reservation->end_time,
            'message' =>
                "Reminder: you have a restaurant reservation tomorrow at {$this->reservation->start_time}.",
        ];
    }
}