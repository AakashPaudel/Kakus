<?php

namespace App\Http\Resources;

use App\Models\Cart;
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
        return [
            'id' => $this->id,
            'cart_items' => CartItemResource::collection($this->whenLoaded('cartItems')),
            'total_quantity' => $this->cartItems->sum('quantity'),
            'subtotal' => $this->subtotal,
        ];
    }
}
