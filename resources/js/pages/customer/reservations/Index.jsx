import { Head, Link } from '@inertiajs/react';
import reservationsRoutes from '@/routes/reservations';

// console.log('Reservations routes:', reservations);
// console.log('Create route:', reservations.create);


export default function Index({ reservations = [] }) {
    
    return (
        <>
            <Head title="My Reservations" />

            <div className="bg-amber-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                                Your bookings
                            </p>
                            <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900">
                                My Reservations
                            </h1>
                            <p className="mt-2 max-w-2xl text-stone-600">
                                View your bookings, update upcoming plans, and
                                open a reservation for its full details.
                            </p>
                        </div>

                        <Link
                            href={reservationsRoutes.create.url()}
                            className="w-fit rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                            Reserve a table
                        </Link>
                    </header>

                    {reservations.length === 0 ? (
                        <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-stone-200">
                            <h2 className="text-2xl font-bold text-stone-900">No reservations yet</h2>
                            <p className="mx-auto mt-3 max-w-md text-stone-600">
                                Find a table that is perfect for your next visit.
                            </p>
                            <Link href={reservationsRoutes.create.url()} className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600">
                                Reserve a table
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {reservations.map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function ReservationCard({ reservation }) {
    const status = String(reservation.status ?? 'pending');
    const canEdit = !['cancelled', 'completed'].includes(status);

    return (
        <article className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                    Reservation #{reservation.id}
                </p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${status === 'confirmed' ? 'bg-green-100 text-green-700' : status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {status}
                </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
                <Detail label="Date" value={reservation.reservation_date} />
                <Detail label="Time" value={`${reservation.start_time} – ${reservation.end_time}`} />
                <Detail label="Guests" value={reservation.guest_count} />
                <Detail label="Table" value={`Table ${reservation.restaurant_table?.table_number ?? 'N/A'}`} />
            </dl>

            {reservation.special_request && (
                <div className="mt-5 border-t border-stone-100 pt-4">
                    <p className="text-sm text-stone-500">Special request</p>
                    <p className="mt-1 line-clamp-2 text-sm text-stone-700">{reservation.special_request}</p>
                </div>
            )}

            <div className="mt-6 flex gap-3 border-t border-stone-100 pt-5">
                <Link href={reservationsRoutes.show.url(reservation)} className="flex-1 rounded-lg border border-stone-300 px-4 py-2 text-center text-sm font-semibold text-stone-700 hover:bg-stone-50">
                    View details
                </Link>
                {canEdit && (
                    <Link href={reservationsRoutes.edit.url(reservation)} className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-amber-600">
                        Edit
                    </Link>
                )}
            </div>
        </article>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <dt className="text-sm text-stone-500">{label}</dt>
            <dd className="mt-1 font-semibold text-stone-900">{value}</dd>
        </div>
    );
}
