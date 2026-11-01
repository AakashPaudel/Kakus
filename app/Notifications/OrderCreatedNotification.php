<?php

namespace App\Notifications;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Order $order
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /** @return array<string, mixed> */
    public function toDatabase(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_date' => $this->order->created_at?->toDateTimeString(),
            'status' => $this->order->status,
            'subtotal' => (float) $this->order->subtotal,
            'discount' => (float) $this->order->discount,
            'tax' => (float) $this->order->tax,
            'delivery_fee' => (float) $this->order->delivery_fee,
            'total' => (float) $this->order->total,
            'items' => $this->orderItemsPayload(),
            'message' => "Your order #{$this->order->id} has been created.",
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject("Order Confirmation #{$this->order->id}")
            ->greeting('Thank you for your order!')
            ->line("Your order #{$this->order->id} has been created successfully.")
            ->line('We appreciate your order at Kaku\'s Restaurant.')
            ->line('Order date: '.($this->order->created_at?->toDateTimeString() ?? 'Not available'))
            ->line('Status: '.ucfirst($this->order->status))
            ->line('Items:');

        foreach ($this->order->orderItems as $orderItem) {
            $mail->line(sprintf(
                '- %s x%d: %s',
                $orderItem->name,
                $orderItem->quantity,
                $this->formatAmount($orderItem->subtotal)
            ));
        }

        return $mail
            ->line('Subtotal: '.$this->formatAmount($this->order->subtotal))
            ->line('Total: '.$this->formatAmount($this->order->total))
            ->line('We will keep you updated on your order status.');
    }

    /**
     * @return array<int, array<string, int|float|string>>
     */
    private function orderItemsPayload(): array
    {
        return $this->order->orderItems
            ->map(static function (OrderItem $orderItem): array {
                return [
                    'id' => $orderItem->id,
                    'menu_item_id' => $orderItem->menu_item_id,
                    'name' => $orderItem->name,
                    'quantity' => $orderItem->quantity,
                    'unit_price' => (float) $orderItem->unit_price,
                    'line_total' => (float) $orderItem->subtotal,
                ];
            })
            ->all();
    }

    private function formatAmount(float|int|string|null $amount): string
    {
        return number_format((float) $amount, 2);
    }
}
