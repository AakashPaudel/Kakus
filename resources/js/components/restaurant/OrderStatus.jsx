import { router } from '@inertiajs/react';

const statuses = [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'completed',
        'cancelled',
    ];

export default function OrderStatusSelect({ order }) {
    // console.log('Order:', order);
    // console.log('Order ID:', order.id);
    

    return (
        <select
            value={order.status}
            onChange={(event) => {
                const url = `/orders/${order.id}/status`;

                console.log('PATCH URL:', url);

                router.patch(
                    url,
                    { status: event.target.value },
                    { preserveScroll: true },
                );
            }}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
        >
            {statuses.map((status) => (
                <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
            ))}
        </select>
    );
}