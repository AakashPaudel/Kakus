<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailySpecial extends Model
{
    protected $fillable = [
        'menu_item_id',
        'special_date',
    ];

    protected function casts(): array
    {
        return [
            'special_date' => 'date',
        ];
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }
}