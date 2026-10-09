import { Head, Link } from '@inertiajs/react';
import OrderStatusSelect from '@/components/restaurant/OrderStatus';

export default function Index({ orders }) {
    return (
        <>
            <Head title="Orders" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">
                        Orders
                    </h1>

                    <p className="mt-1 text-sm text-stone-500">
                        Manage restaurant orders.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                    <table className="w-full">
                        <thead className="bg-stone-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm">
                                    Order
                                </th>

                                <th className="px-6 py-4 text-left text-sm">
                                    Customer
                                </th>

                                <th className="px-6 py-4 text-left text-sm">
                                    Total
                                </th>

                                <th className="px-6 py-4 text-left text-sm">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-sm">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-sm">
                                    Status Update
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.data.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-t border-stone-100"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        #{order.id}
                                    </td>

                                    <td className="px-6 py-4">
                                        {order.user?.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        Rs. {order.total}
                                    </td>

                                    <td className="px-6 py-4">
                                        {order.status}
                                    </td>

                                    <td className="px-6 py-4">
                                        {order.created_at}
                                    </td>
                                    <td className="px-6 py-4">
                                        <OrderStatusSelect order={order} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}