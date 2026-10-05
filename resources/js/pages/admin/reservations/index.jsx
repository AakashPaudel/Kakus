
import { Link } from '@inertiajs/react';

export default function Index({ reservations = [] }) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
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
                    className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                    Make Reservation
                </Link>
            </div>

            {/* Empty State */}
            {reservations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
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
                /* Reservation List */
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                    {reservations.map((reservation, index) => (
                        <div
                            key={reservation.id}
                            className={`flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between ${
                                index !== reservations.length - 1
                                    ? 'border-b border-stone-200'
                                    : ''
                            }`}
                        >
                            {/* Reservation Information */}
                            <div className="flex items-center gap-5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">
                                    #{reservation.id}
                                </div>

                                <div>
                                    <h2 className="font-semibold text-stone-900">
                                        Kaku's Restaurant
                                    </h2>

                                    <p className="mt-1 text-sm text-stone-500">
                                        {reservation.reservation_date}
                                    </p>
                                </div>
                            </div>

                            {/* Status + Action */}
                            <div className="flex items-center justify-between gap-6 sm:justify-end">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                        reservation.status === 'confirmed'
                                            ? 'bg-green-100 text-green-700'
                                            : reservation.status === 'cancelled'
                                              ? 'bg-red-100 text-red-700'
                                              : 'bg-amber-100 text-amber-700'
                                    }`}
                                >
                                    {reservation.status}
                                </span>

                                <Link
                                    href={`/reservations/${reservation.id}`}
                                    className="text-sm font-semibold text-amber-600 transition hover:text-amber-700"
                                >
                                    View Reservation →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

