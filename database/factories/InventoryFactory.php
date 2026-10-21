<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inventory>
 */
class InventoryFactory extends Factory
{
    protected $model = Inventory::class;

    public function definition(): array
    {
        return [
            'menu_item_id' => MenuItem::factory(),
            'quantity' => fake()->numberBetween(0, 100),
            'reorder_level' => fake()->numberBetween(1, 10),
        ];
    }
}
