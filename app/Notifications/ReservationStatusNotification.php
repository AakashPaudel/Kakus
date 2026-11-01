<?php

namespace App\Notifications;

use App\Models\Reservation;
use App\Models\User;
use App\ReservationStatus;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ReservationStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Reservation $reservation,
        public ReservationStatus $previousStatus,
        public ReservationStatus $newStatus
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
            'status' => $this->newStatus->value,
            'previous_status' => $this->previousStatus->value,
            'new_status' => $this->newStatus->value,
            'reservation_date' => $this->reservation->reservation_date->format('Y-m-d'),
            'start_time' => $this->formatTime($this->reservation->start_time),
            'end_time' => $this->formatTime($this->reservation->end_time),
            'table_number' => $this->reservation->restaurantTable?->table_number,
            'message' => "Your reservation status changed from {$this->previousStatus->value} to {$this->newStatus->value}.",
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $reservationDate = $this->reservation->reservation_date->format('F j, Y');
        $startTime = $this->formatTime($this->reservation->start_time) ?? 'Not available';
        $endTime = $this->formatTime($this->reservation->end_time) ?? 'Not available';
        $tableNumber = $this->reservation->restaurantTable?->table_number;

        return (new MailMessage)
            ->subject("Reservation Status Update #{$this->reservation->id}")
            ->greeting('Reservation status update')
            ->line("Your reservation status changed from {$this->previousStatus->value} to {$this->newStatus->value}.")
            ->line("Reservation date: {$reservationDate}")
            ->line("Time: {$startTime} - {$endTime}")
            ->when(
                $tableNumber !== null,
                fn (MailMessage $mail): MailMessage => $mail->line("Table: {$tableNumber}")
            )
            ->line("Reservation ID: {$this->reservation->id}")
            ->line("Thank you for choosing Kaku's Restaurant.");
    }

    private function formatTime(?string $time): ?string
    {
        return $time === null ? null : Carbon::parse($time)->format('H:i');
    }
}
