<?php

namespace App\Http\Controllers;

use App\Exceptions\ReservationConflictException;
use App\Http\Requests\StoreReservationRequest;
use App\Services\ReservationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use RuntimeException;
use App\Models\Reservation;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Gate;
use App\ReservationStatus;
use Illuminate\Validation\Rule;


class ReservationController extends Controller
{
    public function __construct(
        protected ReservationService $reservationService
    ) {}


    public function index(): Response
    {
        Gate::authorize('viewAny', Reservation::class);

        $reservations = Reservation::with([
            'user',
            'restaurantTable',
        ])->latest()->get();

        return Inertia::render(
            'admin/reservations/Index',
            [
                'reservations' => $reservations,
            ]
        );
    }

    public function show(
        Reservation $reservation
    ): Response {
        Gate::authorize('view', $reservation);

        $reservation->load([
            'user',
            'restaurantTable',
        ]);

        return Inertia::render(
            'reservations/Show',
            [
                'reservation' => $reservation,
            ]
        );
    }
    public function cancel(
        Reservation $reservation
    ): RedirectResponse {
        Gate::authorize('cancel', $reservation);

        // Cancellation logic will be added in
        // the Reservation Status milestone.

        return back();
    }



    public function store(
        StoreReservationRequest $request
    ): RedirectResponse {
        try {
            $this->reservationService->createReservation(
                $request->user(),
                $request->validated()
            );
        } catch (ReservationConflictException $exception) {
            return back()->withErrors([
                'reservation' => $exception->getMessage(),
            ]);
        } catch (RuntimeException $exception) {
            return back()->withErrors([
                'reservation' => $exception->getMessage(),
            ]);
        }

        return back()->with(
            'success',
            'Reservation created successfully.'
        );
    }


    public function updateStatus(
        Request $request,
        Reservation $reservation
    ): RedirectResponse {
        Gate::authorize(
            'updateStatus',
            $reservation
        );

        $validated = $request->validate([
            'status' => [
                'required',
                Rule::enum(ReservationStatus::class),
            ],
        ]);

        try {
            $this->reservationService->updateStatus(
                $request->user(),
                $reservation,
                ReservationStatus::from($validated['status'])
            );
        } catch (RuntimeException $exception) {
            return back()->withErrors([
                'reservation' => $exception->getMessage(),
            ]);
        }

        return back()->with(
            'success',
            'Reservation status updated successfully.'
        );
    }
}
