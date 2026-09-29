import { Link, useForm } from '@inertiajs/react';

export default function Edit({ table }) {
    const { data, setData, put, processing, errors } = useForm({
        table_number: table.table_number ?? '',
        capacity: table.capacity ?? '',
        status: table.status ?? 'available',
    });

    function submit(event) {
        event.preventDefault();

        put(`/tables/${table.id}`);
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <Link
                    href="/tables"
                    className="text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                    ← Back to tables
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-stone-900">
                    Edit Table
                </h1>
            </div>

            <form
                onSubmit={submit}
                className="space-y-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
            >
                <div>
                    <label
                        htmlFor="table_number"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Table Number
                    </label>

                    <input
                        id="table_number"
                        type="text"
                        value={data.table_number}
                        onChange={(event) =>
                            setData('table_number', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.table_number && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.table_number}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Capacity
                    </label>

                    <input
                        id="capacity"
                        type="number"
                        min="1"
                        value={data.capacity}
                        onChange={(event) =>
                            setData('capacity', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    />

                    {errors.capacity && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.capacity}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="status"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Status
                    </label>

                    <select
                        id="status"
                        value={data.status}
                        onChange={(event) =>
                            setData('status', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>

                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.status}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href="/tables"
                        className="rounded-lg border border-stone-300 px-5 py-3 font-medium text-stone-700 hover:bg-stone-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                    >
                        {processing ? 'Updating...' : 'Update Table'}
                    </button>
                </div>
            </form>
        </div>
    );
}