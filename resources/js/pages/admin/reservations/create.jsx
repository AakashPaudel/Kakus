
import { Link, useForm } from '@inertiajs/react';

export default function Create({ availableTables }) {
    const { data, setData, post, processing, errors } = useForm({
        reservation_date: '',
        start_time: '',
        end_time: '',
        guest_count: '',
        restaurant_table_id: '',
        special_request: '',
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
                {/* Reservation Date */}
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

                {/* Start Time */}
                <div>
                    <label
                        htmlFor="start_time"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Start Time
                    </label>

                    <input
                        id="start_time"
                        type="time"
                        value={data.start_time}
                        onChange={(event) =>
                            setData('start_time', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.start_time && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.start_time}
                        </p>
                    )}
                </div>

                {/* End Time */}
                <div>
                    <label
                        htmlFor="end_time"
                        className="block text-sm font-medium text-stone-700"
                    >
                        End Time
                    </label>

                    <input
                        id="end_time"
                        type="time"
                        value={data.end_time}
                        onChange={(event) =>
                            setData('end_time', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.end_time && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.end_time}
                        </p>
                    )}
                </div>

                {/* Number of Guests */}
                <div>
                    <label
                        htmlFor="guest_count"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Number of Guests
                    </label>

                    <input
                        id="guest_count"
                        type="number"
                        min="1"
                        value={data.guest_count}
                        onChange={(event) =>
                            setData('guest_count', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.guest_count && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.guest_count}
                        </p>
                    )}
                </div>

                {/* Table */}
                <div>
                    <label
                        htmlFor="restaurant_table_id"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Choose Table
                    </label>

                    <select
                        id="restaurant_table_id"
                        value={data.restaurant_table_id}
                        onChange={(event) =>
                            setData(
                                'restaurant_table_id',
                                event.target.value,
                            )
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    >
                        <option value="">Select a table</option>

                        {availableTables.map((table) => (
                            <option
                                key={table.id}
                                value={table.id}
                            >
                                {table.table_number}
                            </option>
                        ))}
                    </select>

                    {availableTables.length === 0 && (
                        <p className="mt-2 text-sm text-stone-500">
                            No tables are currently available.
                        </p>
                    )}

                    {errors.restaurant_table_id && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.restaurant_table_id}
                        </p>
                    )}
                </div>

                {/* Special Request */}
                <div>
                    <label
                        htmlFor="special_request"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Additional Notes
                    </label>

                    <textarea
                        id="special_request"
                        rows="4"
                        value={data.special_request}
                        onChange={(event) =>
                            setData(
                                'special_request',
                                event.target.value,
                            )
                        }
                        placeholder="Any special requests?"
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.special_request && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.special_request}
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

