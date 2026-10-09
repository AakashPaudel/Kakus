import { router } from '@inertiajs/react';

const statuses = [
    'pending',
    'confirmed',
    'completed',
    'cancelled',
];

export default function ReservationStatusSelect({ reservation }) {
    // console.log('Order:', reservation);
    // console.log('Order ID:', reservation.id);
    return (

        <select
            value={reservation.status}
            onChange={(event) => {
                const newStatus = event.target.value;

                router.patch(
                    `/admin/reservations/${reservation.id}/status`,
                    { status: newStatus },
                    {
                        preserveScroll: true,
                    },
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
