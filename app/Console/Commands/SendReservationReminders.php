<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Notifications\ReservationReminderNotification;
use App\ReservationStatus;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SendReservationReminders extends Command
{
    protected $signature = 'reservations:send-reminders';

    protected $description =
        'Send reminders for upcoming reservations';

    public function handle(): int
    {
        $tomorrow = now()->addDay()->toDateString();

        $reservations = Reservation::query()
            ->with(['user', 'restaurantTable'])
            ->whereDate('reservation_date', $tomorrow)
            ->whereIn('status', [
                ReservationStatus::Pending,
                ReservationStatus::Confirmed,
            ])
            ->whereNull('reminder_sent_at')
            ->get();

        foreach ($reservations as $reservation) {
            DB::transaction(function () use ($reservation): void {
                $reservation = Reservation::query()
                    ->lockForUpdate()
                    ->with(['user', 'restaurantTable'])
                    ->find($reservation->id);

                if ($reservation === null || $reservation->reminder_sent_at !== null) {
                    return;
                }

                $reservation->user->notify(
                    (new ReservationReminderNotification($reservation))->afterCommit()
                );

                $reservation->update([
                    'reminder_sent_at' => now(),
                ]);
            });
        }

        $this->info(
            "{$reservations->count()} reservation reminders sent."
        );

        return self::SUCCESS;
    }
}
