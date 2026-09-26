<?php

namespace Tests\Feature;

use App\ReservationStatus;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationDatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_reservation_belongs_to_user(): void
    {
        $user = User::factory()->create([
            'role' => 'customer',
        ]);

        $reservation = Reservation::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->assertTrue(
            $reservation->user->is($user)
        );
    }

    public function test_reservation_belongs_to_restaurant_table(): void
    {
        $table = RestaurantTable::factory()->create();

        $reservation = Reservation::factory()->create([
            'restaurant_table_id' => $table->id,
        ]);

        $this->assertTrue(
            $reservation->restaurantTable->is($table)
        );
    }

    public function test_user_can_have_many_reservations(): void
    {
        $user = User::factory()->create([
            'role' => 'customer',
        ]);

        Reservation::factory()
            ->count(3)
            ->create([
                'user_id' => $user->id,
            ]);

        $this->assertCount(
            3,
            $user->reservations
        );
    }

    public function test_table_can_have_many_reservations(): void
    {
        $table = RestaurantTable::factory()->create();

        Reservation::factory()
            ->count(3)
            ->create([
                'restaurant_table_id' => $table->id,
            ]);

        $this->assertCount(
            3,
            $table->reservations
        );
    }

    public function test_reservation_status_is_cast_to_enum(): void
    {
        $reservation = Reservation::factory()->create([
            'status' => ReservationStatus::Pending,
        ]);

        $reservation->refresh();

        $this->assertSame(
            ReservationStatus::Pending,
            $reservation->status
        );
    }

    public function test_reservation_date_is_cast_to_date(): void
    {
        $reservation = Reservation::factory()->create();

        $reservation->refresh();

        $this->assertInstanceOf(
            CarbonImmutable::class,
            $reservation->reservation_date
        );
    }

    public function test_reservation_can_be_created_with_confirmed_status(): void
    {
        $reservation = Reservation::factory()
            ->confirmed()
            ->create();

        $this->assertSame(
            ReservationStatus::Confirmed,
            $reservation->status
        );
    }

    public function test_reservation_can_be_created_with_cancelled_status(): void
    {
        $reservation = Reservation::factory()
            ->cancelled()
            ->create();

        $this->assertSame(
            ReservationStatus::Cancelled,
            $reservation->status
        );
    }

    public function test_reservation_can_be_created_with_completed_status(): void
    {
        $reservation = Reservation::factory()
            ->completed()
            ->create();

        $this->assertSame(
            ReservationStatus::Completed,
            $reservation->status
        );
    }

    public function test_multiple_reservations_can_exist_for_same_table(): void
    {
        $table = RestaurantTable::factory()->create();

        Reservation::factory()->create([
            'restaurant_table_id' => $table->id,
            'reservation_date' => '2026-10-01',
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
        ]);

        Reservation::factory()->create([
            'restaurant_table_id' => $table->id,
            'reservation_date' => '2026-10-01',
            'start_time' => '20:00:00',
            'end_time' => '22:00:00',
        ]);

        $this->assertDatabaseCount('reservations', 2);
    }
}