
import { Head } from '@inertiajs/react';
import OrderStatusSelect from '@/components/restaurant/OrderStatus';

export default function Index({ orders }) {
    const orderList = orders?.data ?? [];

    const formatDate = (date) => {
        if (!date) return '—';

        return new Date(date).toLocaleString('en-NP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatStatus = (status) => {
        if (!status) return 'Unknown';

        return status
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getStatusStyle = (status) => {
        const styles = {
            pending:
                'bg-amber-100 text-amber-800 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
            confirmed:
                'bg-blue-100 text-blue-800 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20',
            preparing:
                'bg-violet-100 text-violet-800 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20',
            ready:
                'bg-cyan-100 text-cyan-800 ring-cyan-600/20 dark:bg-cyan-400/10 dark:text-cyan-300 dark:ring-cyan-400/20',
            completed:
                'bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
            cancelled:
                'bg-red-100 text-red-800 ring-red-600/20 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/20',
        };

        return (
            styles[status?.toLowerCase()] ??
            'bg-stone-100 text-stone-700 ring-stone-500/20 dark:bg-stone-700/40 dark:text-stone-300 dark:ring-stone-400/20'
        );
    };

    return (
        <>
            <Head title="Orders" />

            <div className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Page heading */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                            Administration
                        </p>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-950 dark:text-stone-50 sm:text-3xl">
                            Orders
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                            Review customer orders and manage their
                            preparation status.
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm dark:border-stone-700 dark:bg-stone-900">
                        <span className="text-sm text-stone-600 dark:text-stone-400">
                            Total orders
                        </span>

                        <span className="text-lg font-bold tabular-nums text-stone-950 dark:text-stone-50">
                            {orders?.total ?? orderList.length}
                        </span>
                    </div>
                </div>

                {/* Orders table */}
                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
                    {/* Table header */}
                    <div className="flex flex-col gap-1 border-b border-stone-200 px-5 py-4 dark:border-stone-700 sm:px-6">
                        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                            All orders
                        </h2>

                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            Track order details and update order status.
                        </p>
                    </div>

                    {orderList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px] border-collapse text-left">
                                <thead className="bg-stone-50 dark:bg-stone-800/70">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                        >
                                            Order
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                        >
                                            Customer
                                        </th>

                                        <th
                                            scope="col"
                                            className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                        >
                                            Total
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                        >
                                            Current status
                                        </th>

                                        <th
                                            scope="col"
                                            className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                        >
                                            Order date
                                        </th>

                                        <th
                                            scope="col"
                                            className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                        >
                                            Update status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                    {orderList.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                                                <span className="font-semibold text-stone-900 dark:text-stone-100">
                                                    #{order.id}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 sm:px-6">
                                                <p className="max-w-[200px] truncate font-medium text-stone-800 dark:text-stone-200">
                                                    {order.user?.name ??
                                                        'Unknown customer'}
                                                </p>

                                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                                    Customer
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums text-stone-900 dark:text-stone-100 sm:px-6">
                                                Rs.{' '}
                                                {Number(
                                                    order.total ?? 0,
                                                ).toLocaleString('en-NP')}
                                            </td>

                                            <td className="px-5 py-4 sm:px-6">
                                                <span
                                                    className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(order.status)}`}
                                                >
                                                    {formatStatus(
                                                        order.status,
                                                    )}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-600 dark:text-stone-400 sm:px-6">
                                                {formatDate(
                                                    order.created_at,
                                                )}
                                            </td>

                                            <td className="px-5 py-4 sm:px-6 text-stone-600 dark:text-stone-400">
                                                <div className="w-44">
                                                    <OrderStatusSelect
                                                        order={order}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="h-7 w-7"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 7h8M8 11h8m-8 4h5M5 3.75h14a1.25 1.25 0 0 1 1.25 1.25v14A1.25 1.25 0 0 1 19 20.25H5A1.25 1.25 0 0 1 3.75 19V5A1.25 1.25 0 0 1 5 3.75Z"
                                    />
                                </svg>
                            </div>

                            <h3 className="mt-4 text-base font-semibold text-stone-900 dark:text-stone-100">
                                No orders yet
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
                                Customer orders will appear here when they
                                place an order.
                            </p>
                        </div>
                    )}

                    {/* Pagination summary */}
                    {orderList.length > 0 &&
                        orders?.total != null && (
                            <div className="border-t border-stone-200 bg-stone-50/70 px-5 py-4 dark:border-stone-700 dark:bg-stone-800/40 sm:px-6">
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    Showing{' '}
                                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                                        {orders.from ?? 1}
                                    </span>
                                    {' '}to{' '}
                                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                                        {orders.to ??
                                            orderList.length}
                                    </span>
                                    {' '}of{' '}
                                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                                        {orders.total}
                                    </span>
                                    {' '}orders
                                </p>
                            </div>
                        )}
                </section>
            </div>
        </>
    );
}
