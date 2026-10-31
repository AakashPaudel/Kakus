<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use RuntimeException;

class OrderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $orders = $request->user()
            ->orders()
            ->with('orderItems.menuItem')
            ->latest()
            ->paginate($validated['per_page'] ?? 10)
            ->withQueryString();

        return OrderResource::collection($orders);
    }

    public function show(Order $order): OrderResource
    {
        Gate::authorize('view', $order);

        $order->load('orderItems.menuItem');

        return new OrderResource($order);
    }

    public function store(
        Request $request,
        OrderService $orderService
    ): OrderResource|JsonResponse {
        $validated = $request->validate([
            'fulfillment_type' => [
                'required',
                'in:delivery,pickup,dine_in',
            ],
            'street_address' => [
                'exclude_unless:fulfillment_type,delivery',
                'required',
                'string',
                'max:255',
            ],
            'city' => [
                'exclude_unless:fulfillment_type,delivery',
                'required',
                'string',
                'max:100',
            ],
            'postal_code' => [
                'exclude_unless:fulfillment_type,delivery',
                'required',
                'string',
                'max:20',
            ],
            'delivery_notes' => [
                'exclude_unless:fulfillment_type,delivery',
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        try {
            $order = $orderService->createOrder(
                $request->user(),
                $validated
            );
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        $order->load('orderItems.menuItem');

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
    }
}
