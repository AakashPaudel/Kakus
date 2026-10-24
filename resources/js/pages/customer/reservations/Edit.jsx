import { Head, Link, useForm } from '@inertiajs/react';
import reservations from '@/routes/reservations';

export default function Edit({ reservation, availableTables = [] }) {
    const form = useForm({
        reservation_date: String(reservation.reservation_date ?? '').slice(
            0,
            10,
        ),
        start_time: String(reservation.start_time ?? '').slice(0, 5),
        end_time: String(reservation.end_time ?? '').slice(0, 5),
        guest_count: reservation.guest_count ?? '',
        restaurant_table_id: reservation.restaurant_table_id ?? '',
        special_request: reservation.special_request ?? '',
    });

    function submit(event) {
        event.preventDefault();
        form.put(reservations.update.url(reservation));
    }

    return (
        <>
            <Head title={`Edit reservation #${reservation.id}`} />

            <div className="restaurant-shell px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-8">
                    <div>
                        <Link
                            href={reservations.show.url(reservation)}
                            className="text-sm font-semibold text-amber-700 hover:text-amber-900 hover:underline"
                        >
                            ← Back to reservation
                        </Link>
                        <p className="mt-6 text-sm font-semibold tracking-widest text-amber-700 uppercase">
                            Update your booking
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                            Edit reservation
                        </h1>
                        <p className="mt-2 text-stone-600">
                            Adjust your date, time, table, or guest count.
                            Availability will be checked when you save.
                        </p>
                    </div>

                    {form.errors.reservation && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {form.errors.reservation}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="restaurant-surface space-y-6 rounded-3xl p-6 shadow-sm sm:p-8"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field
                                form={form}
                                name="reservation_date"
                                label="Date"
                                type="date"
                            />
                            <Field
                                form={form}
                                name="guest_count"
                                label="Guests"
                                type="number"
                                min="1"
                            />
                            <Field
                                form={form}
                                name="start_time"
                                label="Start time"
                                type="time"
                            />
                            <Field
                                form={form}
                                name="end_time"
                                label="End time"
                                type="time"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="restaurant_table_id"
                                className="block text-sm font-semibold text-stone-800"
                            >
                                Table
                            </label>
                            <select
                                id="restaurant_table_id"
                                value={form.data.restaurant_table_id}
                                onChange={(event) =>
                                    form.setData(
                                        'restaurant_table_id',
                                        event.target.value,
                                    )
                                }
                                className={inputClasses(
                                    Boolean(form.errors.restaurant_table_id),
                                )}
                            >
                                <option value="">Select a table</option>
                                {availableTables.map((table) => (
                                    <option key={table.id} value={table.id}>
                                        Table {table.table_number} · up to{' '}
                                        {table.capacity} guests
                                    </option>
                                ))}
                            </select>
                            <Error error={form.errors.restaurant_table_id} />
                        </div>

                        <div>
                            <label
                                htmlFor="special_request"
                                className="block text-sm font-semibold text-stone-800"
                            >
                                Special request{' '}
                                <span className="font-normal text-stone-500">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                id="special_request"
                                rows="4"
                                value={form.data.special_request}
                                onChange={(event) =>
                                    form.setData(
                                        'special_request',
                                        event.target.value,
                                    )
                                }
                                className={inputClasses(
                                    Boolean(form.errors.special_request),
                                )}
                                placeholder="Tell us anything we should know..."
                            />
                            <Error error={form.errors.special_request} />
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={reservations.show.url(reservation)}
                                className="restaurant-secondary-button rounded-lg px-5 py-3 text-center text-sm font-semibold"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="restaurant-accent-button rounded-lg px-5 py-3 text-sm font-semibold disabled:opacity-50"
                            >
                                {form.processing ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

function Field({ form, name, label, type, min }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-semibold text-stone-800"
            >
                {label}
            </label>
            <input
                id={name}
                type={type}
                min={min}
                value={form.data[name]}
                onChange={(event) => form.setData(name, event.target.value)}
                className={inputClasses(Boolean(form.errors[name]))}
            />
            <Error error={form.errors[name]} />
        </div>
    );
}

function Error({ error }) {
    return error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null;
}

function inputClasses(hasError) {
    return `mt-2 block w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-stone-900 outline-none focus:ring-2 ${
        hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-stone-300 focus:border-amber-500 focus:ring-amber-500/20'
    }`;
}
