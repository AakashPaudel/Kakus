import { Link, useForm } from '@inertiajs/react';

export default function Create({ availableTables = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        reservation_date: '',
        reservation_time: '',
        number_of_guests: '',
        table_id: '',
        notes: '',
    });

    function submit(event) {
        event.preventDefault();

        post('/reservations');
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <Link
                    href="/reservations"
                    className="text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                    ← Back to reservations
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-stone-900">
                    Reserve a Table
                </h1>

                <p className="mt-2 text-stone-600">
                    Choose your preferred date, time, and table.
                </p>
            </div>

            <form
                onSubmit={submit}
                className="space-y-6 rounded-xl border border-stone-200 bg-black p-6 shadow-sm"
            >
                {/* Date */}
                <div>
                    <label
                        htmlFor="reservation_date"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Reservation Date
                    </label>

                    <input
                        id="reservation_date"
                        type="date"
                        value={data.reservation_date}
                        onChange={(event) =>
                            setData('reservation_date', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.reservation_date && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.reservation_date}
                        </p>
                    )}
                </div>

                {/* Time */}
                <div>
                    <label
                        htmlFor="reservation_time"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Reservation Time
                    </label>

                    <input
                        id="reservation_time"
                        type="time"
                        value={data.reservation_time}
                        onChange={(event) =>
                            setData('reservation_time', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.reservation_time && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.reservation_time}
                        </p>
                    )}
                </div>

                {/* Guests */}
                <div>
                    <label
                        htmlFor="number_of_guests"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Number of Guests
                    </label>

                    <input
                        id="number_of_guests"
                        type="number"
                        min="1"
                        value={data.number_of_guests}
                        onChange={(event) =>
                            setData('number_of_guests', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.number_of_guests && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.number_of_guests}
                        </p>
                    )}
                </div>

                {/* Table */}
                <div>
                    <label
                        htmlFor="table_id"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Choose Table
                    </label>

                    <select
                        id="table_id"
                        value={data.table_id}
                        onChange={(event) =>
                            setData('table_id', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    >
                        <option value="">Select a table</option>

                        {availableTables.map((table) => (
                            <option key={table.id} value={table.id}>
                                Table {table.table_number} — {table.capacity}{' '}
                                seats
                            </option>
                        ))}
                    </select>

                    {availableTables.length === 0 && (
                        <p className="mt-2 text-sm text-stone-500">
                            No tables are currently available.
                        </p>
                    )}

                    {errors.table_id && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.table_id}
                        </p>
                    )}
                </div>

                {/* Notes */}
                <div>
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Additional Notes
                    </label>

                    <textarea
                        id="notes"
                        rows="4"
                        value={data.notes}
                        onChange={(event) =>
                            setData('notes', event.target.value)
                        }
                        placeholder="Any special requests?"
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.notes && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.notes}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Link
                        href="/reservations"
                        className="rounded-lg border border-stone-300 px-5 py-3 font-medium text-stone-700 hover:bg-stone-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                    >
                        {processing ? 'Reserving...' : 'Reserve Table'}
                    </button>
                </div>
            </form>
        </div>
    );
}