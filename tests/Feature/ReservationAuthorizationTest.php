<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\Models\User;
use App\ReservationStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_view_their_own_reservation(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
        ]);

        $response = $this->actingAs($customer)->get(
            route('reservations.show', $reservation)
        );

        $response->assertSuccessful();
    }

    public function test_customer_cannot_view_another_customers_reservation(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $otherCustomer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $otherCustomer->id,
        ]);

        $response = $this->actingAs($customer)->get(
            route('reservations.show', $reservation)
        );

        $response->assertForbidden();
    }

    public function test_staff_can_view_any_reservation(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
        ]);

        $response = $this->actingAs($staff)->get(
            route('reservations.show', $reservation)
        );

        $response->assertSuccessful();
    }

    public function test_admin_can_view_any_reservation(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
        ]);

        $response = $this->actingAs($admin)->get(
            route('reservations.show', $reservation)
        );

        $response->assertSuccessful();
    }

    public function test_customer_can_edit_their_pending_reservation(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $table = RestaurantTable::factory()->create(['capacity' => 6]);
        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
            'restaurant_table_id' => $table->id,
            'guest_count' => 2,
        ]);

        $date = now()->addDays(3)->toDateString();

        $response = $this->actingAs($customer)->put(
            route('reservations.update', $reservation),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => $date,
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 4,
                'special_request' => 'Window seat, please.',
            ]
        );

        $response
            ->assertRedirect(route('customer.reservations.index'))
            ->assertSessionHas('success', 'Reservation updated successfully.');

        $reservation->refresh();

        $this->assertSame($date, $reservation->reservation_date->toDateString());
        $this->assertSame('18:00', $reservation->start_time->format('H:i'));
        $this->assertSame(4, $reservation->guest_count);
        $this->assertSame('Window seat, please.', $reservation->special_request);
    }

    public function test_customer_cannot_edit_another_customers_reservation(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $reservation = Reservation::factory()->create();

        $response = $this->actingAs($customer)->put(
            route('reservations.update', $reservation),
            [
                'restaurant_table_id' => $reservation->restaurant_table_id,
                'reservation_date' => now()->addDays(3)->toDateString(),
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 2,
            ]
        );

        $response->assertForbidden();
    }

    public function test_completed_reservation_cannot_be_edited(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $reservation = Reservation::factory()
            ->completed()
            ->create(['user_id' => $customer->id]);

        $response = $this->actingAs($customer)->put(
            route('reservations.update', $reservation),
            [
                'restaurant_table_id' => $reservation->restaurant_table_id,
                'reservation_date' => now()->addDays(3)->toDateString(),
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 2,
            ]
        );

        $response->assertForbidden();
    }

    public function test_customer_cannot_view_all_reservations(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $response = $this->actingAs($customer)->get(
            route('admin.reservations.index')
        );

        $response->assertForbidden();
    }

    public function test_staff_can_view_all_reservations(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $response = $this->actingAs($staff)->get(
            route('admin.reservations.index')
        );

        $response->assertSuccessful();
    }

    public function test_admin_can_view_all_reservations(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->get(
            route('admin.reservations.index')
        );

        $response->assertSuccessful();
    }

    public function test_customer_can_create_reservation(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $this->assertTrue(
            $customer->can('create', Reservation::class)
        );
    }

    public function test_customer_can_cancel_their_own_reservation(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
        ]);

        $this->assertTrue(
            $customer->can('cancel', $reservation)
        );
    }

    public function test_customer_cannot_cancel_a_completed_reservation(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
            'status' => ReservationStatus::Completed,
        ]);

        $response = $this->actingAs($customer)->patch(
            route('reservations.cancel', $reservation)
        );

        $response->assertForbidden();

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'completed',
        ]);
    }

    public function test_customer_can_cancel_their_pending_reservation(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
            'status' => ReservationStatus::Pending,
        ]);

        $response = $this->actingAs($customer)->patch(
            route('reservations.cancel', $reservation)
        );

        $response
            ->assertRedirect()
            ->assertSessionHas('success', 'Reservation cancelled successfully.');

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_customer_cannot_cancel_another_customers_reservation(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $otherCustomer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $otherCustomer->id,
        ]);

        $this->assertFalse(
            $customer->can('cancel', $reservation)
        );
    }

    public function test_staff_can_cancel_any_reservation(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
        ]);

        $this->assertTrue(
            $staff->can('cancel', $reservation)
        );
    }

    public function test_admin_can_cancel_any_reservation(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
        ]);

        $this->assertTrue(
            $admin->can('cancel', $reservation)
        );
    }

    public function test_only_admin_can_delete_reservation(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $customer->id,
        ]);

        $this->assertTrue(
            $admin->can('delete', $reservation)
        );

        $this->assertFalse(
            $staff->can('delete', $reservation)
        );

        $this->assertFalse(
            $customer->can('delete', $reservation)
        );
    }
}
