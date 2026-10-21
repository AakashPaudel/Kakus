import { Head, Link } from '@inertiajs/react';
import reservations from '@/routes/reservations';
import customerReservations from '@/routes/customer/reservations';

export default function Show({ reservation }) {
    const status = String(reservation.status ?? 'pending');
    const statusStyles = {
        confirmed: 'bg-emerald-100 text-emerald-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-stone-200 text-stone-700',
        pending: 'bg-amber-100 text-amber-800',
    };

    return (
        <>
            <Head title={`Reservation #${reservation.id}`} />

            <div className="bg-amber-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl space-y-8">
                    <Link
                        href={customerReservations.index.url()}
                        className="text-sm font-semibold text-amber-700 hover:text-amber-900 hover:underline"
                    >
                        ← Back to my reservations
                    </Link>

                    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                                Your booking
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                                Reservation #{reservation.id}
                            </h1>
                            <p className="mt-2 text-stone-600">
                                Review your table booking details.
                            </p>
                        </div>

                        <span
                            className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${statusStyles[status] ?? statusStyles.pending}`}
                        >
                            {status}
                        </span>
                    </header>

                    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Detail label="Date" value={reservation.reservation_date} />
                            <Detail
                                label="Time"
                                value={`${reservation.start_time} – ${reservation.end_time}`}
                            />
                            <Detail
                                label="Guests"
                                value={`${reservation.guest_count} ${reservation.guest_count === 1 ? 'guest' : 'guests'}`}
                            />
                            <Detail
                                label="Table"
                                value={`Table ${reservation.restaurant_table?.table_number ?? 'N/A'}`}
                            />
                        </div>

                        {reservation.special_request && (
                            <div className="mt-8 border-t border-stone-200 pt-6">
                                <Detail
                                    label="Special request"
                                    value={reservation.special_request}
                                />
                            </div>
                        )}

                        {status !== 'cancelled' && status !== 'completed' && (
                            <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    href={reservations.edit.url(reservation)}
                                    className="rounded-lg bg-amber-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-600"
                                >
                                    Edit reservation
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <p className="text-sm text-stone-500">{label}</p>
            <p className="mt-1 font-semibold text-stone-900">{value}</p>
        </div>
    );
}
