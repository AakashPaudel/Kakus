import { Head, Link } from '@inertiajs/react';
import ordersRoute from '@/routes/orders';

export default function Index({ orders = [] }) {
    return (
        <>
            <Head title="My Orders" />

            <div className="restaurant-shell px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-widest text-amber-700 uppercase">
                                Your orders
                            </p>
                            <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900">
                                My Orders
                            </h1>
                            <p className="mt-2 max-w-2xl text-stone-600">
                                Review your order history and open any order for
                                its full details.
                            </p>
                        </div>

                        <Link
                            href="/menu"
                            className="restaurant-accent-button w-fit rounded-lg px-5 py-3 text-sm font-semibold"
                        >
                            Browse menu
                        </Link>
                    </header>

                    {orders.length === 0 ? (
                        <EmptyState
                            title="No orders yet"
                            description="Your completed orders will appear here after you place an order."
                            href="/menu"
                            label="Explore the menu"
                        />
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {orders.map((order) => (
                                <article
                                    key={order.id}
                                    className="restaurant-surface rounded-3xl p-6 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold tracking-wider text-stone-500 uppercase">
                                                Order #{order.id}
                                            </p>
                                            <h2 className="mt-2 text-xl font-bold text-stone-900 capitalize">
                                                {order.status}
                                            </h2>
                                        </div>
                                        <p className="text-lg font-bold text-stone-900">
                                            Rs.{' '}
                                            {Number(
                                                order.total,
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="mt-5 space-y-3 border-t border-stone-200 pt-4">
                                        {order.order_items
                                            ?.slice(0, 3)
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between gap-4 text-sm"
                                                >
                                                    <span className="text-stone-700">
                                                        {item.name} ×{' '}
                                                        {item.quantity}
                                                    </span>
                                                    <span className="font-medium text-stone-900">
                                                        Rs.{' '}
                                                        {Number(
                                                            item.subtotal,
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>

                                    <Link
                                        href={ordersRoute.show.url(order)}
                                        className="restaurant-secondary-button mt-6 block rounded-lg px-4 py-3 text-center text-sm font-semibold"
                                    >
                                        View order details
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function EmptyState({ title, description, href, label }) {
    return (
        <div className="restaurant-surface rounded-3xl px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
            <p className="mx-auto mt-3 max-w-md text-stone-600">
                {description}
            </p>
            <Link
                href={href}
                className="restaurant-accent-button mt-6 inline-block rounded-lg px-6 py-3 font-semibold"
            >
                {label}
            </Link>
        </div>
    );
}
