<?php

namespace App\Models;

use App\ReservationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'restaurant_table_id',
        'reservation_date',
        'start_time',
        'end_time',
        'guest_count',
        'status',
        'special_request',
    ];

    protected function casts(): array
    {
        return [
            'reservation_date' => 'date',
            'guest_count' => 'integer',
            'status' => ReservationStatus::class,
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function restaurantTable(): BelongsTo
    {
        return $this->belongsTo(
            RestaurantTable::class
        );
    }
}