<?php

namespace App\Http\Resources;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Reservation */
class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reservation_date' => $this->reservation_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'guest_count' => $this->guest_count,
            'status' => $this->status,
            'special_request' => $this->special_request,
            'restaurant_table' => $this->whenLoaded('restaurantTable', fn (): array => [
                'id' => $this->restaurantTable->id,
                'table_number' => $this->restaurantTable->table_number,
                'capacity' => $this->restaurantTable->capacity,
                'status' => $this->restaurantTable->status,
            ]),
            'created_at' => $this->created_at,
        ];
    }
}
