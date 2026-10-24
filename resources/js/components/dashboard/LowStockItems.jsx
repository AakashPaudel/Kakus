import { Link } from '@inertiajs/react';
import { ArrowRight, AlertTriangle, PackageCheck, Package } from 'lucide-react';

export default function LowStockItems({ items = [] }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-stone-100 p-5 sm:p-6 dark:border-stone-800">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        <AlertTriangle size={21} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                                Low Stock Items
                            </h2>

                            {items.length > 0 && (
                                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
                                    {items.length}{' '}
                                    {items.length === 1 ? 'item' : 'items'}
                                </span>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Menu items that need inventory attention.
                        </p>
                    </div>
                </div>

                <Link
                    href="/admin/inventory"
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                >
                    <span className="hidden sm:inline">View inventory</span>
                    <span className="sm:hidden">View all</span>
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Inventory Items */}
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="group flex items-center justify-between gap-4 p-5 transition-colors duration-200 hover:bg-stone-50/80 sm:px-6 dark:hover:bg-stone-800/50"
                        >
                            {/* Item Details */}
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500 transition-colors group-hover:bg-orange-50 group-hover:text-orange-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-orange-500/10 dark:group-hover:text-orange-400">
                                    <Package size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-stone-900 dark:text-stone-100">
                                        {item.menu_item?.name ?? 'Unknown item'}
                                    </p>

                                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                        Reorder level:{' '}
                                        <span className="font-medium text-stone-700 dark:text-stone-300">
                                            {item.reorder_level}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="shrink-0 text-right">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-sm font-bold text-red-700 tabular-nums dark:bg-red-500/10 dark:text-red-400">
                                    <AlertTriangle size={14} />
                                    {item.quantity} left
                                </span>

                                <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                                    Current stock
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center px-6 py-10 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <PackageCheck size={28} />
                        </div>

                        <h3 className="mt-4 font-semibold text-stone-900 dark:text-stone-100">
                            Inventory looks good!
                        </h3>

                        <p className="mt-1 max-w-xs text-sm leading-6 text-stone-500 dark:text-stone-400">
                            No low-stock items to worry about right now. Your
                            inventory is looking healthy.
                        </p>

                        <Link
                            href="/admin/inventory"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-stone-700 dark:text-stone-300 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
                        >
                            Check inventory
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="flex items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/70 px-5 py-3.5 sm:px-6 dark:border-stone-800 dark:bg-stone-800/30">
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                        Inventory attention required
                    </p>

                    <Link
                        href="/admin/inventory"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                        Manage stock
                        <ArrowRight size={14} />
                    </Link>
                </div>
            )}
        </section>
    );
}
