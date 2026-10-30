<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class ReservationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $reservations = $request->user()
            ->reservations()
            ->with('restaurantTable')
            ->latest()
            ->paginate($validated['per_page'] ?? 10)
            ->withQueryString();

        return ReservationResource::collection($reservations);
    }

    public function show(Request $request, Reservation $reservation): ReservationResource
    {
        Gate::forUser($request->user())->authorize('view', $reservation);

        $reservation->load('restaurantTable');

        return new ReservationResource($reservation);
    }
}
