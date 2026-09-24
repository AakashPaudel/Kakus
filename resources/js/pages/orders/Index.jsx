export default function Index({ orders }) {
    return (
        <>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">My Orders</h1>

                    <p className="mt-2 text-gray-600">
                        View your previous restaurant orders.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-lg bg-white p-8 text-center shadow">
                        <p className="text-gray-600">
                            You haven't placed any orders yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-lg bg-white p-6 shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Order #{order.id}
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            {order.status}
                                        </p>
                                    </div>

                                    <p className="font-semibold">
                                        Rs. {order.total}
                                    </p>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {order.order_items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between"
                                        >
                                            <span>
                                                {item.name} × {item.quantity}
                                            </span>

                                            <span>Rs. {item.subtotal}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
