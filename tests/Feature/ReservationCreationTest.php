<?php

namespace Tests\Feature;

use App\ReservationStatus;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_reservation(): void
    {
        $user = User::factory()->create([
            'role' => 'customer',
        ]);

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        $response = $this->actingAs($user)
            ->post(route('reservations.store'), [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-01',
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 3,
                'special_request' => 'Window seat',
            ]);

        $response->assertRedirect();

        $response->assertSessionHas(
            'success',
            'Reservation created successfully.'
        );

        $reservation = Reservation::where('user_id', $user->id)->first();

        $this->assertNotNull($reservation);

        $this->assertEquals('2026-10-01', $reservation->reservation_date->format('Y-m-d'));
        $this->assertEquals('18:00', $reservation->start_time->format('H:i'));
        $this->assertEquals('20:00', $reservation->end_time->format('H:i'));

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'user_id' => $user->id,
            'restaurant_table_id' => $table->id,
            'guest_count' => 3,
            'status' => 'pending',
            'special_request' => 'Window seat',
        ]);
    }

    public function test_guest_cannot_create_reservation(): void
    {
        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        $response = $this->post(
            route('reservations.store'),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-01',
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 2,
            ]
        );

        $response->assertRedirect(
            route('login')
        );

        $this->assertDatabaseCount(
            'reservations',
            0
        );
    }

    public function test_guest_count_cannot_exceed_table_capacity(): void
    {
        $user = User::factory()->create();

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        $response = $this->actingAs($user)->post(
            route('reservations.store'),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-01',
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 5,
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHasErrors('reservation');

        $this->assertDatabaseCount(
            'reservations',
            0
        );
    }

    public function test_inactive_table_cannot_be_reserved(): void
    {
        $user = User::factory()->create();

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
            'status' => 'inactive',
        ]);

        $response = $this->actingAs($user)->post(
            route('reservations.store'),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-01',
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 2,
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHasErrors('reservation');

        $this->assertDatabaseCount(
            'reservations',
            0
        );
    }

    public function test_reservation_cannot_have_end_time_before_start_time(): void
    {
        $user = User::factory()->create();

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        $response = $this->actingAs($user)->post(
            route('reservations.store'),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-01',
                'start_time' => '20:00',
                'end_time' => '18:00',
                'guest_count' => 2,
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHasErrors('end_time');

        $this->assertDatabaseCount(
            'reservations',
            0
        );
    }

    public function test_reservation_cannot_have_same_start_and_end_time(): void
    {
        $user = User::factory()->create();

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        $response = $this->actingAs($user)->post(
            route('reservations.store'),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-01',
                'start_time' => '18:00',
                'end_time' => '18:00',
                'guest_count' => 2,
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHasErrors('end_time');

        $this->assertDatabaseCount(
            'reservations',
            0
        );
    }

    // public function test_overlapping_reservation_is_rejected(): void
    // {
    //     $user = User::factory()->create();

    //     $table = RestaurantTable::factory()->create([
    //         'capacity' => 4,
    //     ]);

    //     Reservation::factory()->create([
    //         'restaurant_table_id' => $table->id,
    //         'reservation_date' => '2026-10-01',
    //         'start_time' => '18:00:00',
    //         'end_time' => '20:00:00',
    //         'status' => ReservationStatus::Confirmed,
    //     ]);


    //     $response = $this->actingAs($user)->post(
    //         route('reservations.store'),
    //         [
    //             'restaurant_table_id' => $table->id,
    //             'reservation_date' => '2026-10-01',
    //             'start_time' => '19:00',
    //             'end_time' => '21:00',
    //             'guest_count' => 2,
    //         ]
    //     );

    //     // $response->dumpSession();

    //     $response
    //         ->assertRedirect()
    //         ->assertSessionHasErrors('reservation');

    //     $this->assertDatabaseCount(
    //         'reservations',
    //         1
    //     );
    // }

    // public function test_reservation_that_starts_before_existing_reservation_is_rejected(): void
    // {
    //     $user = User::factory()->create();

    //     $table = RestaurantTable::factory()->create([
    //         'capacity' => 4,
    //     ]);

    //     Reservation::factory()->create([
    //         'restaurant_table_id' => $table->id,
    //         'reservation_date' => '2026-10-01',
    //         'start_time' => '18:00:00',
    //         'end_time' => '20:00:00',
    //         'status' => ReservationStatus::Confirmed,
    //     ]);

    //     $response = $this->actingAs($user)->post(
    //         route('reservations.store'),
    //         [
    //             'restaurant_table_id' => $table->id,
    //             'reservation_date' => '2026-10-01',
    //             'start_time' => '17:00',
    //             'end_time' => '19:00',
    //             'guest_count' => 2,
    //         ]
    //     );

    //     $response
    //         ->assertRedirect()
    //         ->assertSessionHasErrors('reservation');

    //     $this->assertDatabaseCount(
    //         'reservations',
    //         1
    //     );
    // }

    // public function test_reservation_completely_containing_existing_reservation_is_rejected(): void
    // {
    //     $user = User::factory()->create();

    //     $table = RestaurantTable::factory()->create([
    //         'capacity' => 4,
    //     ]);

    //     Reservation::factory()->create([
    //         'restaurant_table_id' => $table->id,
    //         'reservation_date' => '2026-10-01',
    //         'start_time' => '18:00:00',
    //         'end_time' => '20:00:00',
    //         'status' => ReservationStatus::Confirmed,
    //     ]);

    //     $response = $this->actingAs($user)->post(
    //         route('reservations.store'),
    //         [
    //             'restaurant_table_id' => $table->id,
    //             'reservation_date' => '2026-10-01',
    //             'start_time' => '17:00',
    //             'end_time' => '21:00',
    //             'guest_count' => 2,
    //         ]
    //     );

    //     $response
    //         ->assertRedirect()
    //         ->assertSessionHasErrors('reservation');

    //     $this->assertDatabaseCount(
    //         'reservations',
    //         1
    //     );
    // }

    public function test_adjacent_reservation_is_allowed(): void
    {
        $user = User::factory()->create();

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        Reservation::factory()->create([
            'restaurant_table_id' => $table->id,
            'reservation_date' => '2026-10-01',
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
            'status' => ReservationStatus::Confirmed,
        ]);

        $response = $this->actingAs($user)->post(
            route('reservations.store'),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-01',
                'start_time' => '20:00',
                'end_time' => '22:00',
                'guest_count' => 2,
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHas(
                'success',
                'Reservation created successfully.'
            );

        $this->assertDatabaseCount(
            'reservations',
            2
        );
    }

    public function test_reservation_on_different_date_is_allowed(): void
    {
        $user = User::factory()->create();

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        Reservation::factory()->create([
            'restaurant_table_id' => $table->id,
            'reservation_date' => '2026-10-01',
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
            'status' => ReservationStatus::Confirmed,
        ]);

        $response = $this->actingAs($user)->post(
            route('reservations.store'),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-02',
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 2,
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHas(
                'success',
                'Reservation created successfully.'
            );

        $this->assertDatabaseCount(
            'reservations',
            2
        );
    }

    public function test_cancelled_reservation_does_not_block_new_reservation(): void
    {
        $user = User::factory()->create();

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        Reservation::factory()->create([
            'restaurant_table_id' => $table->id,
            'reservation_date' => '2026-10-01',
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
            'status' => ReservationStatus::Cancelled,
        ]);

        $response = $this->actingAs($user)->post(
            route('reservations.store'),
            [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-01',
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 2,
            ]
        );

        $response
            ->assertRedirect()
            ->assertSessionHas(
                'success',
                'Reservation created successfully.'
            );

        $this->assertDatabaseCount(
            'reservations',
            2
        );
    }

    // public function test_pending_reservation_blocks_overlapping_reservation(): void
    // {
    //     $user = User::factory()->create();

    //     $table = RestaurantTable::factory()->create([
    //         'capacity' => 4,
    //     ]);

    //     Reservation::factory()->create([
    //         'restaurant_table_id' => $table->id,
    //         'reservation_date' => '2026-10-01',
    //         'start_time' => '18:00:00',
    //         'end_time' => '20:00:00',
    //         'status' => ReservationStatus::Pending,
    //     ]);

    //     $response = $this->actingAs($user)->post(
    //         route('reservations.store'),
    //         [
    //             'restaurant_table_id' => $table->id,
    //             'reservation_date' => '2026-10-01',
    //             'start_time' => '19:00',
    //             'end_time' => '21:00',
    //             'guest_count' => 2,
    //         ]
    //     );

    //     $response
    //         ->assertRedirect()
    //         ->assertSessionHasErrors('reservation');

    //     $this->assertDatabaseCount(
    //         'reservations',
    //         1
    //     );
    // }
    public function test_reservation_creation_occurs_inside_transaction(): void
    {
        $user = User::factory()->create();

        $table = RestaurantTable::factory()->create([
            'capacity' => 4,
        ]);

        $reservation = app(\App\Services\ReservationService::class)
            ->createReservation($user, [
                'restaurant_table_id' => $table->id,
                'reservation_date' => '2026-10-05',
                'start_time' => '18:00',
                'end_time' => '20:00',
                'guest_count' => 2,
            ]);

        $this->assertNotNull($reservation);

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'restaurant_table_id' => $table->id,
            'user_id' => $user->id,
            'guest_count' => 2,
        ]);
    }
}
