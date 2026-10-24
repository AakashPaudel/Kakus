import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import inventoryRoutes from '@/routes/admin/inventory';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

function InventoryRow({ item }) {
    const form = useForm({
        quantity: item.quantity,
        reorder_level: item.reorder_level,
    });

    const lowStock = Number(item.quantity) <= Number(item.reorder_level);
    const itemName = item.menu_item?.name ?? 'Unknown item';

    function submit(event) {
        event.preventDefault();

        form.patch(inventoryRoutes.update.url(item), {
            preserveScroll: true,
        });
    }

    return (
        <tr className="transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/60">
            {/* Menu item */}
            <td className="px-5 py-4 whitespace-nowrap">
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {itemName}
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    Inventory ID: #{item.id}
                </p>
            </td>

            {/* Stock status */}
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex flex-col items-start gap-2">
                    <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            lowStock
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        }`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${
                                lowStock ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                        />
                        {lowStock ? 'Low stock' : 'In stock'}
                    </span>

                    <span className="text-sm text-stone-600 dark:text-stone-300">
                        {item.quantity} units available
                    </span>
                </div>
            </td>

            {/* Update stock */}
            <td className="min-w-[300px] px-5 py-4">
                <form onSubmit={submit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                htmlFor={`quantity-${item.id}`}
                                className="mb-1.5 block text-xs font-semibold text-stone-600 dark:text-stone-300"
                            >
                                Quantity
                            </label>

                            <input
                                id={`quantity-${item.id}`}
                                type="number"
                                min="0"
                                step="1"
                                required
                                value={form.data.quantity}
                                onChange={(event) =>
                                    form.setData('quantity', event.target.value)
                                }
                                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100"
                                aria-invalid={Boolean(form.errors.quantity)}
                            />
                            {form.errors.quantity && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {form.errors.quantity}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor={`reorder-level-${item.id}`}
                                className="mb-1.5 block text-xs font-semibold text-stone-600 dark:text-stone-300"
                            >
                                Reorder level
                            </label>

                            <input
                                id={`reorder-level-${item.id}`}
                                type="number"
                                min="0"
                                step="1"
                                required
                                value={form.data.reorder_level}
                                onChange={(event) =>
                                    form.setData(
                                        'reorder_level',
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100"
                                aria-invalid={Boolean(
                                    form.errors.reorder_level,
                                )}
                            />
                            {form.errors.reorder_level && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                    {form.errors.reorder_level}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={form.processing || !form.isDirty}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-stone-900"
                        >
                            {form.processing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Saving...
                                </>
                            ) : (
                                'Save changes'
                            )}
                        </button>

                        {form.wasSuccessful && (
                            <span
                                role="status"
                                className="text-xs font-medium text-emerald-700 dark:text-emerald-400"
                            >
                                Changes saved
                            </span>
                        )}
                    </div>
                </form>
            </td>
        </tr>
    );
}

export default function Index({ inventory = [] }) {
    const lowStockCount = inventory.filter(
        (item) => Number(item.quantity) <= Number(item.reorder_level),
    ).length;

    const totalItems = inventory.length;

    return (
        <>
            <Head title="Inventory Management" />

            <AdminPageLayout>
                <div className="space-y-8">
                    {/* Page heading */}
                    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-stone-700 dark:bg-stone-900">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-widest text-amber-700 uppercase dark:text-amber-400">
                                    Administration
                                </p>

                                <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
                                    Inventory management
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">
                                    Monitor available stock, adjust quantities,
                                    and set reorder levels to keep your
                                    restaurant running smoothly.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                        Inventory records
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-stone-900 dark:text-stone-100">
                                        {totalItems}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 7.8 7.5 4.4 7.5-4.4M12 12.2V21"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                                Menu items tracked in inventory
                            </p>
                        </div>

                        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                        Low-stock items
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-stone-900 dark:text-stone-100">
                                        {lowStockCount}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v4m0 4h.01M10.3 4.9 2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2l-7.5-13.1a1.5 1.5 0 0 0-2.6 0Z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                                Items at or below their reorder level
                            </p>
                        </div>
                    </div>

                    {/* Inventory table */}
                    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
                        <div className="border-b border-stone-200 px-5 py-4 sm:px-6 dark:border-stone-700">
                            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                                Stock overview
                            </h2>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                Update stock levels and reorder thresholds for
                                each menu item.
                            </p>
                        </div>

                        {inventory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left">
                                    <thead className="bg-stone-50 dark:bg-stone-800/70">
                                        <tr>
                                            <th className="px-5 py-3 text-xs font-semibold tracking-wider text-stone-600 uppercase dark:text-stone-300">
                                                Menu item
                                            </th>
                                            <th className="px-5 py-3 text-xs font-semibold tracking-wider text-stone-600 uppercase dark:text-stone-300">
                                                Stock status
                                            </th>
                                            <th className="px-5 py-3 text-xs font-semibold tracking-wider text-stone-600 uppercase dark:text-stone-300">
                                                Adjust stock
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                                        {inventory.map((item) => (
                                            <InventoryRow
                                                key={item.id}
                                                item={item}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-5 py-16 text-center sm:px-6">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        className="h-7 w-7"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4.5 7.8 7.5 4.4 7.5-4.4"
                                        />
                                    </svg>
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-stone-900 dark:text-stone-100">
                                    No inventory records yet
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
                                    Inventory records will appear here once
                                    stock has been configured for your menu
                                    items.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </AdminPageLayout>
        </>
    );
}
