<?php

namespace Tests\Feature;

use App\ReservationStatus;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_confirm_pending_reservation(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $reservation = Reservation::factory()->create([
            'status' => ReservationStatus::Pending,
        ]);

        $response = $this->actingAs($staff)->patch(
            route(
                'admin.reservations.update-status',
                $reservation
            ),
            [
                'status' => 'confirmed',
            ]
        );

        $response->assertRedirect();

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_admin_can_complete_confirmed_reservation(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $reservation = Reservation::factory()->create([
            'status' => ReservationStatus::Confirmed,
        ]);

        $response = $this->actingAs($admin)->patch(
            route(
                'admin.reservations.update-status',
                $reservation
            ),
            [
                'status' => 'completed',
            ]
        );

        $response->assertRedirect();

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'completed',
        ]);
    }

    public function test_staff_can_cancel_pending_reservation(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $reservation = Reservation::factory()->create([
            'status' => ReservationStatus::Pending,
        ]);

        $response = $this->actingAs($staff)->patch(
            route(
                'admin.reservations.update-status',
                $reservation
            ),
            [
                'status' => 'cancelled',
            ]
        );

        $response->assertRedirect();

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_customer_cannot_update_reservation_status(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'status' => ReservationStatus::Pending,
        ]);

        $response = $this->actingAs($customer)->patch(
            route(
                'admin.reservations.update-status',
                $reservation
            ),
            [
                'status' => 'confirmed',
            ]
        );

        $response->assertForbidden();
    }

    public function test_invalid_status_transition_is_rejected(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $reservation = Reservation::factory()->create([
            'status' => ReservationStatus::Pending,
        ]);

        $response = $this->actingAs($staff)->patch(
            route(
                'admin.reservations.update-status',
                $reservation
            ),
            [
                'status' => 'completed',
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHasErrors('reservation');

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'pending',
        ]);
    }

    public function test_completed_reservation_cannot_be_changed(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $reservation = Reservation::factory()->create([
            'status' => ReservationStatus::Completed,
        ]);

        $response = $this->actingAs($staff)->patch(
            route(
                'admin.reservations.update-status',
                $reservation
            ),
            [
                'status' => 'cancelled',
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHasErrors('reservation');

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'completed',
        ]);
    }

    public function test_cancelled_reservation_cannot_be_changed(): void
    {
        $staff = User::factory()->create([
            'role' => 'staff',
        ]);

        $reservation = Reservation::factory()->create([
            'status' => ReservationStatus::Cancelled,
        ]);

        $response = $this->actingAs($staff)->patch(
            route(
                'admin.reservations.update-status',
                $reservation
            ),
            [
                'status' => 'confirmed',
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHasErrors('reservation');

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'cancelled',
        ]);
    }
}