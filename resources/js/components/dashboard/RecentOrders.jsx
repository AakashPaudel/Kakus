import { Link } from '@inertiajs/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const statusStyles = {
    pending:
        'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-500/20',
    confirmed:
        'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-500/20',
    processing:
        'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-500/20',
    preparing:
        'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-950/40 dark:text-orange-300 dark:ring-orange-500/20',
    completed:
        'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/20',
    delivered:
        'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/20',
    cancelled:
        'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-500/20',
};

export default function RecentOrders({ orders = [] }) {
    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-stone-100 p-5 sm:p-6 dark:border-stone-800">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="shrink-0 rounded-xl bg-orange-50 p-2.5 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
                        <ShoppingBag size={20} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                            Recent Orders
                        </h2>

                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            The latest orders received by your restaurant.
                        </p>
                    </div>
                </div>

                <Link
                    href="/admin/orders"
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-orange-700 transition hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                >
                    View all
                    <ArrowRight size={15} />
                </Link>
            </div>

            {/* Orders table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-stone-50 dark:bg-stone-800/60">
                        <tr>
                            <th
                                scope="col"
                                className="px-5 py-3.5 font-semibold text-stone-600 sm:px-6 dark:text-stone-300"
                            >
                                Order
                            </th>

                            <th
                                scope="col"
                                className="px-5 py-3.5 font-semibold text-stone-600 sm:px-6 dark:text-stone-300"
                            >
                                Customer
                            </th>

                            <th
                                scope="col"
                                className="px-5 py-3.5 font-semibold text-stone-600 sm:px-6 dark:text-stone-300"
                            >
                                Total
                            </th>

                            <th
                                scope="col"
                                className="px-5 py-3.5 font-semibold text-stone-600 sm:px-6 dark:text-stone-300"
                            >
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                const status = String(
                                    order.status ?? 'unknown',
                                ).toLowerCase();

                                const badgeStyle =
                                    statusStyles[status] ??
                                    'bg-stone-100 text-stone-700 ring-stone-500/20 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-500/20';

                                return (
                                    <tr
                                        key={order.id}
                                        className="transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40"
                                    >
                                        <td className="px-5 py-4 font-semibold whitespace-nowrap text-stone-900 sm:px-6 dark:text-stone-100">
                                            #{order.id}
                                        </td>

                                        <td className="max-w-[180px] truncate px-5 py-4 text-stone-600 sm:px-6 dark:text-stone-300">
                                            {order.user?.name ?? 'Unknown'}
                                        </td>

                                        <td className="px-5 py-4 font-semibold whitespace-nowrap text-stone-900 sm:px-6 dark:text-stone-100">
                                            Rs.{' '}
                                            {Number(
                                                order.total ?? 0,
                                            ).toLocaleString('en-IN')}
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap sm:px-6">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${badgeStyle}`}
                                            >
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                                                {status.replaceAll('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 sm:px-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="rounded-full bg-stone-100 p-3 dark:bg-stone-800">
                                            <ShoppingBag
                                                size={24}
                                                className="text-stone-400"
                                            />
                                        </div>

                                        <p className="mt-3 font-semibold text-stone-800 dark:text-stone-200">
                                            No orders yet
                                        </p>

                                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                            New customer orders will appear
                                            here.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            {orders.length > 0 && (
                <div className="border-t border-stone-100 px-5 py-3.5 dark:border-stone-800">
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                        Showing {orders.length} recent{' '}
                        {orders.length === 1 ? 'order' : 'orders'}
                    </p>
                </div>
            )}
        </section>
    );
}
