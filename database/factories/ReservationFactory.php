<?php

namespace Database\Factories;

use App\ReservationStatus;
use App\Models\RestaurantTable;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween(
            '12:00:00',
            '20:00:00'
        );

        $endTime = (clone $startTime)->modify('+2 hours');

        return [
            'user_id' => User::factory(),

            'restaurant_table_id' => RestaurantTable::factory(),

            'reservation_date' => fake()
                ->dateTimeBetween('today', '+30 days')
                ->format('Y-m-d'),

            'start_time' => $startTime->format('H:i:s'),

            'end_time' => $endTime->format('H:i:s'),

            'guest_count' => fake()->numberBetween(1, 8),

            'status' => ReservationStatus::Pending,

            'special_request' => fake()->optional()->sentence(),
        ];
    }
    public function confirmed(): static
    {
        return $this->state(fn() => [
            'status' => ReservationStatus::Confirmed,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn() => [
            'status' => ReservationStatus::Cancelled,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn() => [
            'status' => ReservationStatus::Completed,
        ]);
    }
}
