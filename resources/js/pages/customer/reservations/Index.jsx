import { Link } from '@inertiajs/react';

export default function Index({ reservations }) {
    return (
        <section className="bg-amber-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                        Your bookings
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900">
                        My Reservations
                    </h1>

                    <p className="mt-2 text-stone-600">
                        View and manage the tables you have reserved.
                    </p>
                </div>

                {/* Empty state */}
                {reservations.length === 0 ? (
                    <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-stone-200">
                        <div className="mx-auto max-w-md">
                            <h2 className="text-2xl font-bold text-stone-900">
                                No reservations yet
                            </h2>

                            <p className="mt-3 text-stone-600">
                                You haven't reserved a table yet. Find a table
                                that's perfect for your next visit.
                            </p>

                            <Link
                                href="/reservations/create"
                                className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
                            >
                                Reserve a Table
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {reservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
                            >
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                                        Reservation #{reservation.id}
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                            reservation.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700'
                                                : reservation.status ===
                                                    'cancelled'
                                                  ? 'bg-red-100 text-red-700'
                                                  : 'bg-amber-100 text-amber-700'
                                        }`}
                                    >
                                        {reservation.status}
                                    </span>
                                </div>

                                {/* Reservation details */}
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <p className="text-sm text-stone-500">
                                            Date
                                        </p>

                                        <p className="mt-1 font-semibold text-stone-900">
                                            {reservation.reservation_date}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-stone-500">
                                            Time
                                        </p>

                                        <p className="mt-1 font-semibold text-stone-900">
                                            {reservation.start_time} –{' '}
                                            {reservation.end_time}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-stone-500">
                                                Guests
                                            </p>

                                            <p className="mt-1 font-semibold text-stone-900">
                                                {reservation.guest_count}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-stone-500">
                                                Table
                                            </p>

                                            <p className="mt-1 font-semibold text-stone-900">
                                                Table{' '}
                                                {reservation.restaurant_table
                                                    ?.table_number ?? 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {reservation.special_request && (
                                        <div>
                                            <p className="text-sm text-stone-500">
                                                Special request
                                            </p>

                                            <p className="mt-1 text-sm text-stone-700">
                                                {reservation.special_request}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-6 flex gap-3 border-t border-stone-100 pt-5">
                                    <Link
                                        href={`/reservations/${reservation.id}`}
                                        className="flex-1 rounded-lg border border-stone-300 px-4 py-2 text-center text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/reservations/${reservation.id}/edit`}
                                        className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-amber-600"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create another reservation */}
                {reservations.length > 0 && (
                    <div className="mt-10 text-center">
                        <Link
                            href="/reservations/create"
                            className="inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
                        >
                            Reserve Another Table
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

