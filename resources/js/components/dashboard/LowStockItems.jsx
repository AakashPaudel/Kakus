
import { Link } from '@inertiajs/react';

export default function LowStockItems({ items = [] }) {
    return (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 p-5">
                <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                        Low Stock Items
                    </h2>

                    <p className="mt-1 text-sm text-stone-500">
                        Menu items that need inventory attention.
                    </p>
                </div>

                <Link
                    href="/admin/inventory"
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                    View inventory
                </Link>
            </div>

            <div className="divide-y divide-stone-100">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 p-5"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium text-stone-900">
                                    {item.menu_item?.name ?? 'Unknown item'}
                                </p>

                                <p className="mt-1 text-sm text-stone-500">
                                    Reorder level: {item.reorder_level}
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="font-semibold text-red-600">
                                    {item.quantity} left
                                </p>

                                <p className="mt-1 text-xs text-stone-500">
                                    In stock
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="px-5 py-10 text-center text-sm text-stone-500">
                        No low-stock items. Your inventory looks good!
                    </p>
                )}
            </div>
        </div>
    );
}
