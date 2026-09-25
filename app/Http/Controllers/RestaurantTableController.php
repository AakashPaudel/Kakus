<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRestaurantTableRequest;
use App\Http\Requests\UpdateRestaurantTableRequest;
use App\Models\RestaurantTable;
use App\Services\RestaurantTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use App\RestaurantTableStatus;


class RestaurantTableController extends Controller
{
    public function __construct(
        protected RestaurantTableService $tableService
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', RestaurantTable::class);

        return inertia('admin/tables/Index', [
            'tables' => $this->tableService->getAllTables(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', RestaurantTable::class);

        return inertia('admin/tables/Create');
    }

    public function store(
        StoreRestaurantTableRequest $request
    ): RedirectResponse {
        Gate::authorize('create', RestaurantTable::class);

        $this->tableService->createTable(
            $request->validated('table_number'),
            $request->integer('capacity')
        );

        return to_route('admin.tables.index')
            ->with('success', 'Restaurant table created successfully.');
    }

    public function edit(
        RestaurantTable $restaurantTable
    ): Response {
        Gate::authorize('update', $restaurantTable);

        return inertia('admin/tables/Edit', [
            'table' => $restaurantTable,
        ]);
    }

    public function update(
        UpdateRestaurantTableRequest $request,
        RestaurantTable $restaurantTable
    ): RedirectResponse {
        Gate::authorize('update', $restaurantTable);

        $this->tableService->updateTable(
            $restaurantTable,
            $request->validated('table_number'),
            $request->integer('capacity')
        );

        return to_route('admin.tables.index')
            ->with('success', 'Restaurant table updated successfully.');
    }

    public function destroy(
        RestaurantTable $restaurantTable
    ): RedirectResponse {
        Gate::authorize('delete', $restaurantTable);

        $this->tableService->deactivate($restaurantTable);

        return to_route('admin.tables.index')
            ->with('success', 'Restaurant table deactivated successfully.');
    }

    public function updateStatus(
        Request $request,
        RestaurantTable $restaurantTable
    ): RedirectResponse {
        Gate::authorize('updateStatus', $restaurantTable);

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::enum(RestaurantTableStatus::class),
            ],
        ]);

        $this->tableService->updateStatus(
            $restaurantTable,
            RestaurantTableStatus::from($validated['status'])
        );

        return back()->with(
            'success',
            'Table status updated successfully.'
        );
    }
}
