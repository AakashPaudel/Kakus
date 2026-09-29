import { Link } from '@inertiajs/react';

export default function Index({ tables = [] }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900">
                        Restaurant Tables
                    </h1>

                    <p className="mt-2 text-stone-600">
                        Manage the tables available in the restaurant.
                    </p>
                </div>

                <Link
                    href="/tables/create"
                    className="rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700"
                >
                    Add Table
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-stone-200 bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                                    Table
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                                    Capacity
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-stone-200">
                            {tables.map((table) => (
                                <tr key={table.id}>
                                    <td className="px-6 py-4 font-medium text-stone-900">
                                        Table {table.table_number}
                                    </td>

                                    <td className="px-6 py-4 text-stone-600">
                                        {table.capacity} seats
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                            {table.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/tables/${table.id}/edit`}
                                            className="font-medium text-amber-600 hover:text-amber-700"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {tables.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-10 text-center text-stone-500"
                                    >
                                        No restaurant tables found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}