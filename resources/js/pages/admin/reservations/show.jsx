import { Link } from '@inertiajs/react';

export default function Show({ reservation }) {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <Link
                    href="/reservations"
                    className="text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                    ← Back to reservations
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-stone-900">
                    Reservation #{reservation.id}
                </h1>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-200 pb-5">
                    <div>
                        <p className="text-sm text-stone-500">Status</p>

                        <p className="mt-1 font-semibold capitalize text-stone-900">
                            {reservation.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-stone-500">Guests</p>

                        <p className="mt-1 font-semibold text-stone-900">
                            {reservation.guest_count}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 py-6 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-stone-500">Date</p>
                        <p className="mt-1 font-medium text-stone-900">
                            {reservation.reservation_date}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-stone-500">Time</p>
                        <p className="mt-1 font-medium text-stone-900">
                            {reservation.start_time} – {reservation.end_time}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-stone-500">Table</p>
                        <p className="mt-1 font-medium text-stone-900">
                            {reservation.restaurant_table?.table_number || 'N/A'}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-stone-500">Created</p>
                        <p className="mt-1 font-medium text-stone-900">
                            {reservation.created_at}
                        </p>
                    </div>
                </div>

                {reservation.notes && (
                    <div className="border-t border-stone-200 pt-6">
                        <p className="text-sm text-stone-500">Notes</p>

                        <p className="mt-1 text-stone-800">
                            {reservation.notes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}