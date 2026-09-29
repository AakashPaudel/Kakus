import { Link } from '@inertiajs/react';

export default function Index({ reservations = [] }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900">
                        My Reservations
                    </h1>

                    <p className="mt-2 text-stone-600">
                        View and manage your restaurant reservations.
                    </p>
                </div>

                <Link
                    href="/reservations/create"
                    className="rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700"
                >
                    Make Reservation
                </Link>
            </div>

            {reservations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
                    <h2 className="text-xl font-semibold text-stone-800">
                        No reservations yet
                    </h2>

                    <p className="mt-2 text-stone-500">
                        You don't have any reservations at the moment.
                    </p>

                    <Link
                        href="/reservations/create"
                        className="mt-6 inline-block font-semibold text-amber-600 hover:text-amber-700"
                    >
                        Reserve a table →
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-stone-500">
                                        Reservation #{reservation.id}
                                    </p>

                                    <h2 className="mt-1 text-xl font-semibold text-stone-900">
                                        {reservation.reservation_date}
                                    </h2>
                                </div>

                                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                                    {reservation.status}
                                </span>
                            </div>

                            <div className="mt-5 space-y-2 text-sm text-stone-600">
                                <p>
                                    <strong>Time:</strong>{' '}
                                    {reservation.reservation_time}
                                </p>

                                <p>
                                    <strong>Guests:</strong>{' '}
                                    {reservation.number_of_guests}
                                </p>

                                <p>
                                    <strong>Table:</strong>{' '}
                                    {reservation.table?.table_number ?? '—'}
                                </p>
                            </div>

                            <Link
                                href={`/reservations/${reservation.id}`}
                                className="mt-5 inline-block font-semibold text-amber-600 hover:text-amber-700"
                            >
                                View reservation →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}