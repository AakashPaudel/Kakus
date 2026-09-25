<?php

namespace Database\Seeders;

use App\RestaurantTableStatus;
use App\Models\RestaurantTable;
use Illuminate\Database\Seeder;

class RestaurantTableSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            [
                'table_number' => 'T01',
                'capacity' => 2,
                'status' => RestaurantTableStatus::Available,
            ],
            [
                'table_number' => 'T02',
                'capacity' => 2,
                'status' => RestaurantTableStatus::Available,
            ],
            [
                'table_number' => 'T03',
                'capacity' => 4,
                'status' => RestaurantTableStatus::Available,
            ],
            [
                'table_number' => 'T04',
                'capacity' => 4,
                'status' => RestaurantTableStatus::Available,
            ],
            [
                'table_number' => 'T05',
                'capacity' => 6,
                'status' => RestaurantTableStatus::Available,
            ],
            [
                'table_number' => 'T06',
                'capacity' => 8,
                'status' => RestaurantTableStatus::Available,
            ],
        ];

        foreach ($tables as $table) {
            RestaurantTable::updateOrCreate(
                [
                    'table_number' => $table['table_number'],
                ],
                $table
            );
        }
    }
}