<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\DailySpecial;
use App\Models\MenuItem;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        // Use the application's configured timezone.
        $today = Carbon::today();

        // Upcoming specials from today through the end of this week.
        $weeklySpecials = DailySpecial::query()
            ->with('menuItem.images')
            ->whereDate('special_date', '>=', $today->toDateString())
            ->whereDate(
                'special_date',
                '<=',
                $today->copy()->addDays(6)->toDateString()
            )
            ->orderBy('special_date')
            ->get();
        // dd($weeklySpecials->toArray());

        $galleryItems = MenuItem::query()
            ->where('is_available', true)
            ->with('images')
            ->latest()
            ->take(6)
            ->get();

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        // Find today's dish from the same schedule.
        $todaysSpecial = $weeklySpecials->first(
            fn ($special) => $special->special_date->toDateString()
                === $today->toDateString()
        );
        // dd($weeklySpecials->toArray());
        // dd($todaysSpecial?->toArray());

        return Inertia::render('Home', [
            'todayDate' => $today->toDateString(),

            'todaysSpecial' => $todaysSpecial
                ? $this->formatSpecial($todaysSpecial)
                : null,

            'weeklySpecials' => $weeklySpecials
                ->map(fn ($special) => $this->formatSpecial($special))
                ->values(),
            'galleryItems' => $galleryItems,
            'categories' => $categories,
        ]);
    }

    private function formatSpecial(DailySpecial $special): array
    {
        $item = $special->menuItem;

        return [
            'id' => $special->id,
            'special_date' => $special->special_date->toDateString(),

            'menu_item' => [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'price' => $item->price,

                'image_url' => $item->images->first()
                    ? asset('storage/'.$item->images->first()->image_path)
                    : null,
            ],
        ];
    }
}
