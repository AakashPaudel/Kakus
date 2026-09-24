export default function Show({ order }) {
    return (
        <>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Order #{order.id}
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Status: {order.status}
                        </p>
                    </div>

                    <div className="text-xl font-semibold">
                        Rs. {order.total}
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-xl font-semibold">Items</h2>

                    <div className="mt-4 space-y-4">
                        {order.order_items?.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between border-b pb-4"
                            >
                                <div>
                                    <p className="font-medium">{item.name}</p>

                                    <p className="text-sm text-gray-500">
                                        {item.quantity} × Rs. {item.unit_price}
                                    </p>
                                </div>

                                <p className="font-medium">
                                    Rs. {item.subtotal}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Rs. {order.subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Discount</span>
                        <span>Rs. {order.discount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>Rs. {order.tax}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>Rs. {order.delivery_fee}</span>
                    </div>

                    <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
                        <span>Total</span>
                        <span>Rs. {order.total}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
