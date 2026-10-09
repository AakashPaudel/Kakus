<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Inertia\Inertia;
use Inertia\Response;

class AdminReservationController extends Controller
{
    public function index(): Response
    {
        $reservations = Reservation::query()
            ->with([
                'user',
                'restaurantTable',
            ])
            ->latest('reservation_date')
            ->paginate(15);

        return Inertia::render('admin/reservations/Index', [
            'reservations' => $reservations,
        ]);
    }
}
