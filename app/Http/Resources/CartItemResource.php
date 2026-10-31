<?php

namespace App\Http\Resources;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CartItem */
class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $menuItem = $this->menuItem;
        $image = $menuItem->images
            ->sortByDesc('is_primary')
            ->first();

        return [
            'id' => $this->id,
            'menu_item_id' => $this->menu_item_id,
            'menu_item_name' => $menuItem->name,
            'menu_item_image' => $image
                ? asset('storage/'.$image->image_path)
                : null,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'line_total' => $this->subtotal,
        ];
    }
}
