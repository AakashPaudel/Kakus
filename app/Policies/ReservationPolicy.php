<?php

namespace App\Policies;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\User;

class ReservationPolicy
{
    /**
     * Can the user view any reservations?
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'staff',
        ]);
    }

    /**
     * Can the user view this reservation?
     */
    public function view(User $user, Reservation $reservation): bool
    {
        return $user->role === 'admin'
            || $user->role === 'staff'
            || $reservation->user_id === $user->id;
    }

    /**
     * Can the user create a reservation?
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Can the user update this reservation?
     */
    public function update(User $user, Reservation $reservation): bool
    {
        return $user->role === 'admin'
            || $user->role === 'staff'
            || $reservation->user_id === $user->id;
    }

    /**
     * Can the user cancel this reservation?
     */
    public function cancel(User $user, Reservation $reservation): bool
    {
        return $user->role === 'admin'
            || $user->role === 'staff'
            || $reservation->user_id === $user->id;
    }

    /**
     * Can the user delete this reservation?
     */
    public function delete(User $user, Reservation $reservation): bool
    {
        return $user->role === 'admin';
    }

    public function updateStatus(
        User $user,
        Reservation $reservation
    ): bool {
        return in_array($user->role, [
            'admin',
            'staff',
        ]);
    }
}
