<?php

namespace App\Console\Commands;

use App\ReservationStatus;
use App\Models\Reservation;
use App\Notifications\ReservationReminderNotification;
use Illuminate\Console\Command;

class SendReservationReminders extends Command
{
    protected $signature = 'reservations:send-reminders';

    protected $description =
        'Send reminders for upcoming reservations';

    public function handle(): int
    {
        $tomorrow = now()->addDay()->toDateString();

        $reservations = Reservation::query()
            ->with('user')
            ->whereDate('reservation_date', $tomorrow)
            ->whereIn('status', [
                ReservationStatus::Pending,
                ReservationStatus::Confirmed,
            ])
            ->get();

        foreach ($reservations as $reservation) {
            $reservation->user->notify(
                new ReservationReminderNotification(
                    $reservation
                )
            );
        }

        $this->info(
            "{$reservations->count()} reservation reminders sent."
        );

        return self::SUCCESS;
    }
}