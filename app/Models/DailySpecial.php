<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property Carbon $special_date
 */
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

    /** @return BelongsTo<MenuItem, $this> */
    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }
}
