<?php

namespace Tests\Feature;

use App\RestaurantTableStatus;
use App\Models\RestaurantTable;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RestaurantTableTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_tables(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        RestaurantTable::factory()->count(3)->create();

        $response = $this->actingAs($admin)
            ->get(route('admin.tables.index'));

        $response->assertOk();
    }

    public function test_staff_can_view_tables(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        RestaurantTable::factory()->count(3)->create();

        $response = $this->actingAs($staff)
            ->get(route('admin.tables.index'));

        $response->assertOk();
    }

    public function test_customer_cannot_view_table_management(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $response = $this->actingAs($customer)
            ->get(route('admin.tables.index'));

        $response->assertForbidden();
    }

    public function test_admin_can_create_table(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.tables.store'), [
                'table_number' => 'T10',
                'capacity' => 4,
            ]);

        $response->assertRedirect(route('admin.tables.index'));

        $this->assertDatabaseHas('restaurant_tables', [
            'table_number' => 'T10',
            'capacity' => 4,
            'status' => 'available',
        ]);
    }

    public function test_staff_cannot_create_table(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $response = $this->actingAs($staff)
            ->post(route('admin.tables.store'), [
                'table_number' => 'T10',
                'capacity' => 4,
            ]);

        $response->assertForbidden();
    }

    public function test_customer_cannot_create_table(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $response = $this->actingAs($customer)
            ->post(route('admin.tables.store'), [
                'table_number' => 'T10',
                'capacity' => 4,
            ]);

        $response->assertForbidden();
    }

    public function test_table_number_must_be_unique(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        RestaurantTable::factory()->create([
            'table_number' => 'T01',
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.tables.store'), [
                'table_number' => 'T01',
                'capacity' => 4,
            ]);

        $response->assertSessionHasErrors('table_number');
    }

    public function test_table_capacity_must_be_positive(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.tables.store'), [
                'table_number' => 'T10',
                'capacity' => 0,
            ]);

        $response->assertSessionHasErrors('capacity');
    }

    public function test_admin_can_update_table(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $table = RestaurantTable::factory()->create([
            'table_number' => 'T01',
            'capacity' => 2,
        ]);

        $response = $this->actingAs($admin)
            ->put(
                route('admin.tables.update', [
                    'table' => $table->id,
                ]),
                [
                    'table_number' => 'T10',
                    'capacity' => 6,
                ]
            );

        $response->assertRedirect(route('admin.tables.index'));

        $this->assertDatabaseHas('restaurant_tables', [
            'id' => $table->id,
            'table_number' => 'T10',
            'capacity' => 6,
        ]);
    }

    public function test_staff_cannot_update_table_information(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $table = RestaurantTable::factory()->create();

        $response = $this->actingAs($staff)
            ->put(route('admin.tables.update', $table), [
                'table_number' => 'T99',
                'capacity' => 8,
            ]);

        $response->assertForbidden();
    }

    public function test_staff_can_change_table_status(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $table = RestaurantTable::factory()->create([
            'status' => RestaurantTableStatus::Available,
        ]);

        $response = $this->actingAs($staff)
            ->patch(
                route(
                    'admin.tables.update-status',
                    $table
                ),
                [
                    'status' => 'occupied',
                ]
            );

        $response->assertRedirect();

        $this->assertDatabaseHas('restaurant_tables', [
            'id' => $table->id,
            'status' => 'occupied',
        ]);
    }

    public function test_customer_cannot_change_table_status(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $table = RestaurantTable::factory()->create();

        $response = $this->actingAs($customer)
            ->patch(
                route(
                    'admin.tables.update-status',
                    $table
                ),
                [
                    'status' => 'occupied',
                ]
            );

        $response->assertForbidden();
    }

    public function test_invalid_table_status_is_rejected(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $table = RestaurantTable::factory()->create();

        $response = $this->actingAs($staff)
            ->patch(
                route(
                    'admin.tables.update-status',
                    $table
                ),
                [
                    'status' => 'something-invalid',
                ]
            );

        $response->assertSessionHasErrors('status');
    }

    public function test_admin_can_deactivate_table(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $table = RestaurantTable::factory()->create([
            'status' => RestaurantTableStatus::Available,
        ]);

        $url = route('admin.tables.destroy', [
            'table' => $table->id,
        ]);

        $response = $this->actingAs($admin)
            ->delete($url);

        $response->dump();

        $response->assertRedirect(route('admin.tables.index'));

        $this->assertDatabaseHas('restaurant_tables', [
            'id' => $table->id,
            'status' => 'inactive',
        ]);
    }

    public function test_table_status_is_cast_to_enum(): void
    {
        $table = RestaurantTable::factory()->create([
            'status' => RestaurantTableStatus::Available,
        ]);

        $table->refresh();

        $this->assertSame(
            RestaurantTableStatus::Available,
            $table->status
        );
    }
}
