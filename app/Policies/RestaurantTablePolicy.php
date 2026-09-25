<?php

namespace App\Policies;

use App\Models\RestaurantTable;
use App\Models\User;

class RestaurantTablePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'staff',
        ], true);
    }

    public function view(User $user, RestaurantTable $table): bool
    {
        return in_array($user->role, [
            'admin',
            'staff',
        ], true);
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(
        User $user,
        RestaurantTable $table
    ): bool {
        return $user->role === 'admin';
    }

    public function updateStatus(
        User $user,
        RestaurantTable $table
    ): bool {
        return in_array($user->role, [
            'admin',
            'staff',
        ], true);
    }

    public function delete(
        User $user,
        RestaurantTable $table
    ): bool {
        return $user->role === 'admin';
    }
}