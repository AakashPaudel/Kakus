<?php

namespace App\Services;

use App\RestaurantTableStatus;
use App\Models\RestaurantTable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;


class RestaurantTableService
{
    public function getAllTables(): Collection
    {
        return RestaurantTable::query()
            ->orderBy('table_number')
            ->get();
    }

    public function createTable(
        string $tableNumber,
        int $capacity
    ): RestaurantTable {
        if ($capacity <= 0) {
            throw new RuntimeException(
                'Table capacity must be greater than zero.'
            );
        }

        return RestaurantTable::create([
            'table_number' => $tableNumber,
            'capacity' => $capacity,
            'status' => RestaurantTableStatus::Available,
        ]);
    }

    public function updateTable(
        RestaurantTable $table,
        string $tableNumber,
        int $capacity
    ): RestaurantTable {
        if ($capacity <= 0) {
            throw new RuntimeException(
                'Table capacity must be greater than zero.'
            );
        }

        $table->update([
            'table_number' => $tableNumber,
            'capacity' => $capacity,
        ]);

        return $table->fresh();
    }

    public function updateStatus(
        RestaurantTable $table,
        RestaurantTableStatus $status
    ): RestaurantTable {
        return DB::transaction(function () use ($table, $status) {
            $table = RestaurantTable::query()
                ->lockForUpdate()
                ->findOrFail($table->id);

            $table->update([
                'status' => $status,
            ]);

            return $table->fresh();
        });
    }

    public function deactivate(
        RestaurantTable $table
    ): RestaurantTable {
        return $this->updateStatus(
            $table,
            RestaurantTableStatus::Inactive
        );
    }
}