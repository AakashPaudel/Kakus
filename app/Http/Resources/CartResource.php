<?php

namespace App\Http\Resources;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Cart */
class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Collection<int, CartItem> $cartItems */
        $cartItems = $this->cartItems;
        /** @var int $totalQuantity */
        $totalQuantity = (int) $cartItems->sum('quantity');

        return [
            'id' => $this->id,
            'cart_items' => CartItemResource::collection($this->whenLoaded('cartItems')),
            'total_quantity' => $totalQuantity,
            'subtotal' => $this->subtotal,
        ];
    }
}
