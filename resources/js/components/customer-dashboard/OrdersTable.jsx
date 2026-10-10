
import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const PAGE_SIZE = 5;

const statusStyles = {
    pending: 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300',
    confirmed: 'bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300',
    preparing: 'bg-violet-50 text-violet-800 dark:bg-violet-500/10 dark:text-violet-300',
    ready: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-300',
    completed: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300',
    cancelled: 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300',
};

const money = (amount) =>
    new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        maximumFractionDigits: 0,
    }).format(Number(amount ?? 0));

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(
        String(value).length === 10 ? `${value}T00:00:00` : value,
    );

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat('en', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          }).format(date);
};

export default function OrdersTable({ orders = [] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();

        return orders.filter((order) => {
            const number = String(order.order_number ?? order.id ?? '');
            const matchesSearch = number.toLowerCase().includes(query);
            const matchesStatus =
                statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    function changeSearch(value) {
        setSearch(value);
        setPage(1);
    }

    function changeStatus(value) {
        setStatusFilter(value);
        setPage(1);
    }

    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <label className="relative block flex-1">
                    <Search
                        size={17}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                    />
                    <span className="sr-only">Search order number</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => changeSearch(event.target.value)}
                        placeholder="Search order number..."
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    />
                </label>

                <label>
                    <span className="sr-only">Filter by order status</span>
                    <select
                        value={statusFilter}
                        onChange={(event) => changeStatus(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white sm:w-44"
                    >
                        <option value="all">All statuses</option>
                        {Object.keys(statusStyles).map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {paginatedOrders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 px-4 py-12 text-center dark:border-zinc-700">
                    <p className="font-semibold text-slate-800 dark:text-white">
                        No orders found
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                        Try another search or browse the menu to place an order.
                    </p>
                    <Link
                        href="/menu"
                        className="mt-4 inline-flex rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
                    >
                        Browse menu
                    </Link>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                                    <th scope="col" className="px-3 py-3 font-semibold">Order</th>
                                    <th scope="col" className="px-3 py-3 font-semibold">Date</th>
                                    <th scope="col" className="px-3 py-3 font-semibold">Total</th>
                                    <th scope="col" className="px-3 py-3 font-semibold">Status</th>
                                    <th scope="col" className="px-3 py-3 text-right font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {paginatedOrders.map((order) => {
                                    const status = String(order.status ?? 'pending').toLowerCase();

                                    return (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-zinc-800/40"
                                        >
                                            <td className="px-3 py-4 font-semibold text-slate-900 dark:text-white">
                                                #{order.order_number ?? order.id}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-zinc-200">
                                                {money(order.total)}
                                            </td>
                                            <td className="px-3 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                                        statusStyles[status] ??
                                                        'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                    }`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-right">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    aria-label={`View order ${order.order_number ?? order.id}`}
                                                    className="font-semibold text-amber-700 hover:underline dark:text-amber-400"
                                                >
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-500 dark:text-zinc-400" aria-live="polite">
                            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} orders
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPage((value) => Math.max(1, value - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
