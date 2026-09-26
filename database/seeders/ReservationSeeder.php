<?php

namespace Database\Seeders;

use App\ReservationStatus;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::query()
            ->where('role', 'customer')
            ->first();

        $table = RestaurantTable::query()
            ->where('status', 'available')
            ->first();

        if (!$customer || !$table) {
            return;
        }

        Reservation::create([
            'user_id' => $customer->id,
            'restaurant_table_id' => $table->id,
            'reservation_date' => now()->addDay()->toDateString(),
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
            'guest_count' => min(2, $table->capacity),
            'status' => ReservationStatus::Pending,
            'special_request' => 'Window seat if available.',
        ]);
    }
}