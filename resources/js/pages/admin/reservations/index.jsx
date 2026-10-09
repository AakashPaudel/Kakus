import { Link } from '@inertiajs/react';
import ReservationStatusSelect from '@/components/restaurant/ReservationStatus';

export default function Index({ reservations }) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                        My Reservations
                    </h1>


                    <p className="mt-2 text-sm text-stone-600">
                        View and manage your restaurant reservations.
                    </p>
                </div>

                <Link
                    href="/reservations/create"
                    className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                    + Make Reservation
                </Link>
            </div>

            {/* Reservations Table */}
            {reservations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                    <h2 className="text-lg font-semibold text-stone-800">
                        No reservations yet
                    </h2>

                    <p className="mt-2 text-sm text-stone-500">
                        You don't have any reservations at the moment.
                    </p>

                    <Link
                        href="/reservations/create"
                        className="mt-5 inline-block text-sm font-semibold text-amber-600 hover:text-amber-700"
                    >
                        Reserve a table →
                    </Link>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] divide-y divide-stone-200 text-left">
                            <thead className="bg-stone-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                        Reservation
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                        Update Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-100">
                                {reservations.map((reservation) => (
                                    <tr
                                        key={reservation.id}
                                        className="transition hover:bg-amber-50/40"
                                    >
                                        {/* Reservation ID */}
                                        <td className="whitespace-nowrap px-6 py-5">
                                            <span className="font-semibold text-stone-900">
                                                #{reservation.id}
                                            </span>
                                            <p className="mt-1 text-xs text-stone-500">
                                                Kaku's Restaurant
                                            </p>
                                        </td>

                                        {/* Date */}
                                        <td className="whitespace-nowrap px-6 py-5 text-sm text-stone-600">
                                            {reservation.reservation_date}
                                        </td>

                                        {/* Current Status */}
                                        <td className="whitespace-nowrap px-6 py-5">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${reservation.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : reservation.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-700'
                                                        : reservation.status === 'completed'
                                                            ? 'bg-stone-200 text-stone-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}
                                            >
                                                {reservation.status}
                                            </span>
                                        </td>

                                        {/* Update Status */}
                                        <td className="whitespace-nowrap px-6 py-5">
                                            <ReservationStatusSelect
                                                reservation={reservation}
                                            />
                                        </td>

                                        {/* View Action */}
                                        <td className="whitespace-nowrap px-6 py-5 text-right">
                                            <Link
                                                href={`/reservations/${reservation.id}`}
                                                className="text-sm font-semibold text-amber-700 transition hover:text-amber-800"
                                            >
                                                View Details →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );


}
