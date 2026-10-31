<?php

namespace App\Http\Controllers;

use App\Exceptions\ReservationConflictException;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\ReservationStatus;
use App\Services\ReservationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class ReservationController extends Controller
{
    public function __construct(
        protected ReservationService $reservationService
    ) {}

    public function create(): Response
    {
        $availableTables = RestaurantTable::where('status', 'available')->get();

        // @dd($availableTables);
        return Inertia::render(
            'admin/reservations/create',
            [
                'availableTables' => $availableTables,
            ]
        );
    }

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

    public function indexCustomer(Request $request): Response
    {
        $reservations = Reservation::query()
            ->where('user_id', $request->user()->id)
            ->with('restaurantTable')
            ->latest()
            ->get();

        return Inertia::render('customer/reservations/Index', [
            'reservations' => $reservations,
        ]);
    }

    public function show(Request $request, Reservation $reservation): Response
    {
        Gate::authorize('view', $reservation);

        // eager load the related user and restaurant table to avoid N+1 queries
        $reservation->load([
            'user',
            'restaurantTable',
        ]);

        $page = in_array($request->user()->role, ['admin', 'staff'], true)
            ? 'admin/reservations/show'
            : 'customer/reservations/Show';

        return Inertia::render($page, ['reservation' => $reservation]);
    }

    public function edit(Reservation $reservation): Response
    {
        Gate::authorize('update', $reservation);

        $availableTables = RestaurantTable::query()
            ->where(function ($query) use ($reservation): void {
                $query
                    ->where('status', 'available')
                    ->orWhereKey($reservation->restaurant_table_id);
            })
            ->orderBy('table_number')
            ->get();

        $reservation->load('restaurantTable');

        return Inertia::render('customer/reservations/Edit', [
            'reservation' => $reservation,
            'availableTables' => $availableTables,
        ]);
    }

    public function update(
        UpdateReservationRequest $request,
        Reservation $reservation
    ): RedirectResponse {
        if (in_array($reservation->status, [
            ReservationStatus::Cancelled,
            ReservationStatus::Completed,
        ], true)) {
            return back()->withErrors([
                'reservation' => 'This reservation can no longer be edited.',
            ]);
        }

        try {
            $this->reservationService->updateReservation(
                $reservation,
                $request->validated()
            );
        } catch (ReservationConflictException|RuntimeException $exception) {
            return back()->withErrors([
                'reservation' => $exception->getMessage(),
            ]);
        }

        return to_route('customer.reservations.index')
            ->with('success', 'Reservation updated successfully.');
    }

    public function cancel(
        Request $request,
        Reservation $reservation
    ): RedirectResponse {
        Gate::authorize('cancel', $reservation);

        try {
            $this->reservationService->updateStatus(
                $request->user(),
                $reservation,
                ReservationStatus::Cancelled
            );
        } catch (RuntimeException $exception) {
            return back()->withErrors([
                'reservation' => $exception->getMessage(),
            ]);
        }

        return back()->with(
            'success',
            'Reservation cancelled successfully.'
        );
    }

    public function store(
        StoreReservationRequest $request
    ): RedirectResponse {
        try {
            // @dd($request->validated());

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
