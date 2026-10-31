<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read float $subtotal
 */
class Cart extends Model
{
    /** @use HasFactory<\Database\Factories\CartFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    /**
     * Get the user who owns this cart.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all cart items for this cart.
     *
     * @return HasMany<CartItem, $this>
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function getSubtotalAttribute(): float
    {
        return (float) $this->cartItems->sum(
            fn (CartItem $item): float => $item->subtotal
        );
    }
}
