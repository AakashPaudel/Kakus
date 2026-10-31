<?php

namespace Database\Seeders;

use App\Models\DailySpecial;
use App\Models\MenuItem;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DailySpecialSeeder extends Seeder
{
    public function run(): void
    {
        $items = MenuItem::query()
            ->orderBy('id')
            ->take(3)
            ->get();

        if ($items->count() < 3) {
            $this->command->warn(
                'You need at least 3 menu items to run this seeder.'
            );

            return;
        }

        $startDate = Carbon::today();

        for ($day = 0; $day < 14; $day++) {
            $date = $startDate->copy()
                ->addDays($day)
                ->toDateString();

            $item = $items[$day % $items->count()];

            DailySpecial::updateOrCreate(
                ['special_date' => $date],
                ['menu_item_id' => $item->id]
            );
        }
    }
}
