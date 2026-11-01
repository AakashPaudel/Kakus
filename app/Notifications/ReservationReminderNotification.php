<?php

namespace App\Notifications;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ReservationReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Reservation $reservation
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if ($notifiable instanceof User && filter_var($notifiable->email, FILTER_VALIDATE_EMAIL)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /** @return array<string, int|string|null> */
    public function toDatabase(object $notifiable): array
    {
        return [
            'reservation_id' => $this->reservation->id,
            'reservation_date' => $this->reservation->reservation_date->format('Y-m-d'),
            'start_time' => $this->formatTime($this->reservation->start_time),
            'end_time' => $this->formatTime($this->reservation->end_time),
            'guest_count' => $this->reservation->guest_count,
            'table_number' => $this->reservation->restaurantTable?->table_number,
            'message' => "Reminder: you have a restaurant reservation tomorrow at {$this->reservation->start_time}.",
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $reservationDate = $this->reservation->reservation_date->format('F j, Y');
        $startTime = $this->formatTime($this->reservation->start_time) ?? 'Not available';
        $endTime = $this->formatTime($this->reservation->end_time) ?? 'Not available';
        $tableNumber = $this->reservation->restaurantTable?->table_number;

        return (new MailMessage)
            ->subject("Reservation Reminder #{$this->reservation->id}")
            ->greeting('Reservation reminder')
            ->line("Your reservation is scheduled for {$reservationDate}.")
            ->line("Time: {$startTime} - {$endTime}")
            ->line("Guests: {$this->reservation->guest_count}")
            ->when(
                $tableNumber !== null,
                fn (MailMessage $mail): MailMessage => $mail->line("Table: {$tableNumber}")
            )
            ->line("Reservation ID: {$this->reservation->id}")
            ->line("We look forward to welcoming you to Kaku's Restaurant.");
    }

    private function formatTime(?string $time): ?string
    {
        return $time === null ? null : Carbon::parse($time)->format('H:i');
    }
}
