<?php

namespace Database\Factories;

// use App\Enums\RestaurantTableStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\RestaurantTableStatus;

/**
 * @extends Factory<\App\Models\RestaurantTable>
 */
class RestaurantTableFactory extends Factory
{
    public function definition(): array
    {
        return [
            'table_number' => fake()->unique()->numerify('T##'),
            'capacity' => fake()->randomElement([
                2,
                2,
                4,
                4,
                6,
                8,
            ]),
            'status' => RestaurantTableStatus::Available,
        ];
    }
}