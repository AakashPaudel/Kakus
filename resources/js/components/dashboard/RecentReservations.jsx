
import { Link } from '@inertiajs/react';

export default function RecentReservations({ reservations = [] }) {
    return (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 p-5">
                <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                        Recent Reservations
                    </h2>

                    <p className="mt-1 text-sm text-stone-500">
                        Keep track of upcoming guest bookings.
                    </p>
                </div>

                <Link
                    href="/reservations"
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                    View all
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 text-stone-500">
                        <tr>
                            <th className="px-5 py-3 font-medium">Customer</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium">Guests</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100">
                        {reservations.length > 0 ? (
                            reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="whitespace-nowrap px-5 py-4 font-medium text-stone-900">
                                        {reservation.user?.name ?? 'Unknown'}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-stone-600">
                                        {reservation.reservation_date}
                                    </td>

                                    <td className="px-5 py-4 text-stone-600">
                                        {reservation.guest_count}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4">
                                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-700">
                                            {reservation.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-5 py-10 text-center text-stone-500"
                                >
                                    No reservations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
