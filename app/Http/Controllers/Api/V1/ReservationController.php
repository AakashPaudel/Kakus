<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\ReservationConflictException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\ReservationStatus;
use App\Services\ReservationService;
use Dedoc\Scramble\Attributes\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use RuntimeException;

class ReservationController extends Controller
{
    /**
     * List the authenticated user's reservations, newest first, with up to 50 items per page.
     */
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

    /**
     * Create a reservation. The requested date must not be in the past and the end
     * time must be later than the start time.
     */
    #[Response(status: 422, type: 'array{message:string}')]
    public function store(
        StoreReservationRequest $request,
        ReservationService $reservationService
    ): ReservationResource|JsonResponse {
        Gate::forUser($request->user())->authorize(
            'create',
            Reservation::class
        );

        try {
            $reservation = $reservationService->createReservation(
                $request->user(),
                $request->validated()
            );
        } catch (ReservationConflictException|RuntimeException $exception) {
            /** @var string $message */
            $message = (string) $exception->getMessage();

            return response()->json([
                'message' => $message,
            ], 422);
        }

        $reservation->load('restaurantTable');

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(201);
    }

    #[Response(status: 422, type: 'array{message:string}')]
    public function update(
        UpdateReservationRequest $request,
        Reservation $reservation,
        ReservationService $reservationService
    ): ReservationResource|JsonResponse {
        Gate::forUser($request->user())->authorize('update', $reservation);

        try {
            $reservation = $reservationService->updateReservation(
                $reservation,
                $request->validated()
            );
        } catch (ReservationConflictException|RuntimeException $exception) {
            /** @var string $message */
            $message = (string) $exception->getMessage();

            return response()->json([
                'message' => $message,
            ], 422);
        }

        return new ReservationResource($reservation);
    }

    #[Response(status: 422, type: 'array{message:string}')]
    public function cancel(
        Request $request,
        Reservation $reservation,
        ReservationService $reservationService
    ): ReservationResource|JsonResponse {
        Gate::forUser($request->user())->authorize('cancel', $reservation);

        try {
            $reservation = $reservationService->updateStatus(
                $request->user(),
                $reservation,
                ReservationStatus::Cancelled
            );
        } catch (RuntimeException $exception) {
            /** @var string $message */
            $message = (string) $exception->getMessage();

            return response()->json([
                'message' => $message,
            ], 422);
        }

        $reservation->load('restaurantTable');

        return new ReservationResource($reservation);
    }

    #[Response(status: 422, type: 'array{message:string}')]
    public function updateStatus(
        Request $request,
        Reservation $reservation,
        ReservationService $reservationService
    ): ReservationResource|JsonResponse {
        Gate::forUser($request->user())->authorize(
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
            $reservation = $reservationService->updateStatus(
                $request->user(),
                $reservation,
                ReservationStatus::from($validated['status'])
            );
        } catch (RuntimeException $exception) {
            /** @var string $message */
            $message = (string) $exception->getMessage();

            return response()->json([
                'message' => $message,
            ], 422);
        }

        $reservation->load('restaurantTable');

        return new ReservationResource($reservation);
    }
}
