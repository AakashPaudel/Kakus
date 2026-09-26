<?php

namespace App\Services;

use App\ReservationStatus;
use App\Exceptions\ReservationConflictException;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ReservationService
{
    public function createReservation(
        User $user,
        array $data
    ): Reservation {
        return DB::transaction(function () use ($user, $data) {

            /*
             * Lock the table so that two transactions cannot
             * simultaneously reserve the same table.
             */
            $table = RestaurantTable::query()
                ->whereKey($data['restaurant_table_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($table->status->value === 'inactive') {
                throw new RuntimeException(
                    'This restaurant table is currently inactive.'
                );
            }

            if ($data['guest_count'] > $table->capacity) {
                throw new RuntimeException(
                    "This table can accommodate a maximum of {$table->capacity} guests."
                );
            }

            $hasConflict = Reservation::query()
                ->where(
                    'restaurant_table_id',
                    $table->id
                )
                ->where(
                    'reservation_date',
                    $data['reservation_date']
                )
                ->whereIn('status', [
                    ReservationStatus::Pending->value,
                    ReservationStatus::Confirmed->value,
                ])
                ->where(function ($query) use ($data) {
                    $query
                        ->where(
                            'start_time',
                            '<',
                            $data['end_time']
                        )
                        ->where(
                            'end_time',
                            '>',
                            $data['start_time']
                        );
                })
                ->exists();

            if ($hasConflict) {
                throw new ReservationConflictException(
                    'This table is already reserved during the selected time.'
                );
            }

            return $user->reservations()->create([
                'restaurant_table_id' => $table->id,
                'reservation_date' => $data['reservation_date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'guest_count' => $data['guest_count'],
                'status' => ReservationStatus::Pending,
                'special_request' => $data['special_request'] ?? null,
            ]);
        });
    }

    public function updateStatus(
        User $user,
        Reservation $reservation,
        ReservationStatus $newStatus
    ): Reservation {
        return DB::transaction(function () use (
            $user,
            $reservation,
            $newStatus
        ) {
            $reservation = Reservation::query()
                ->whereKey($reservation->id)
                ->lockForUpdate()
                ->firstOrFail();

            $currentStatus = $reservation->status;

            $allowedTransitions = [
                ReservationStatus::Pending->value => [
                    ReservationStatus::Confirmed->value,
                    ReservationStatus::Cancelled->value,
                ],

                ReservationStatus::Confirmed->value => [
                    ReservationStatus::Completed->value,
                    ReservationStatus::Cancelled->value,
                ],

                ReservationStatus::Cancelled->value => [],

                ReservationStatus::Completed->value => [],
            ];

            if (! in_array(
                $newStatus->value,
                $allowedTransitions[$currentStatus->value] ?? [],
                true
            )) {
                throw new RuntimeException(
                    "Reservation cannot move from {$currentStatus->value} to {$newStatus->value}."
                );
            }

            $reservation->update([
                'status' => $newStatus,
            ]);

            return $reservation->fresh();
        });
    }
}
