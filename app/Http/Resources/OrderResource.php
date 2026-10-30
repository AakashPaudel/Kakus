<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Order */
class OrderResource extends JsonResource
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
            'status' => $this->status,
            'fulfillment_type' => $this->fulfillment_type,
            'street_address' => $this->street_address,
            'city' => $this->city,
            'postal_code' => $this->postal_code,
            'delivery_notes' => $this->delivery_notes,
            'delivery_address' => $this->delivery_address,
            'subtotal' => $this->subtotal,
            'discount' => $this->discount,
            'tax' => $this->tax,
            'delivery_fee' => $this->delivery_fee,
            'total' => $this->total,
            'order_items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
