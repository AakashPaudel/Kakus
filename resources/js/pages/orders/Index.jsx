export default function Index({ orders }) {
    return (
        <div className="min-h-screen py-12">
            <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900">
                        My Orders
                    </h1>

                    <p className="mt-2 text-stone-600 dark:text-stone-400">
                        View your previous restaurant orders.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
                        <p className="text-stone-600 dark:text-stone-400">
                            You haven't placed any orders yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-stone-900 ">
                                            Order #{order.id}
                                        </h2>

                                        <p className="mt-1 text-sm capitalize text-stone-500">
                                            {order.status}
                                        </p>
                                    </div>

                                    <p className="font-semibold text-stone-900 dark:text-stone-900">
                                        Rs. {Number(order.total).toLocaleString()}
                                    </p>
                                </div>

                                <div className="mt-5 space-y-3 border-t border-stone-200 pt-4 dark:border-stone-800">
                                    {order.order_items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between gap-4 text-sm"
                                        >
                                            <span className="text-stone-700 dark:text-stone-800">
                                                {item.name} × {item.quantity}
                                            </span>

                                            <span className="shrink-0 font-medium text-stone-900 dark:text-stone-900">
                                                Rs. {Number(item.subtotal).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}