<?php

namespace App\Notifications;

use App\Models\Inventory;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public MenuItem $menuItem, public Inventory $inventory)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if ($notifiable instanceof User && filter_var($notifiable->email, FILTER_VALIDATE_EMAIL)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Low Stock Alert: {$this->menuItem->name}")
            ->greeting('Low stock alert')
            ->line("The menu item '{$this->menuItem->name}' has reached its low-stock threshold.")
            ->line("Current quantity: {$this->inventory->quantity}")
            ->line("Reorder level: {$this->inventory->reorder_level}")
            ->line('Please review the inventory and restock this item when appropriate.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'inventory_id' => $this->inventory->id,
            'menu_item_id' => $this->menuItem->id,
            'menu_item_name' => $this->menuItem->name,
            'current_quantity' => $this->inventory->quantity,
            'reorder_level' => $this->inventory->reorder_level,
            'message' => "The menu item '{$this->menuItem->name}' is low on stock.",
        ];
    }
}
