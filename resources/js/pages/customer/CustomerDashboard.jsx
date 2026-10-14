import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock,
    Package,
    ShoppingBag,
    UtensilsCrossed,
} from 'lucide-react';

import  StatCard  from '@/components/dashboard/StatCard';

const stats = [
    {
        title: 'Total Orders',
        value: '12',
        description: 'Orders placed so far',
        // icon: ShoppingBag,
    },
    {
        title: 'Active Orders',
        value: '2',
        description: 'Currently being processed',
        // icon: Clock,
    },
    {
        title: 'Completed Orders',
        value: '10',
        description: 'Successfully delivered',
        // icon: CheckCircle2,
    },
    {
        title: 'Upcoming Reservations',
        value: '1',
        description: 'Your next dining visit',
        // icon: CalendarDays,
    },
];

const recentOrders = [
    { id: '#ORD-1042', date: 'Oct 13, 2026', items: 'Chicken Pizza, Fries', total: 850, status: 'Preparing' },
    { id: '#ORD-1035', date: 'Oct 10, 2026', items: 'Classic Burger, Juice', total: 550, status: 'Completed' },
    { id: '#ORD-1028', date: 'Oct 06, 2026', items: 'Veg Pizza', total: 650, status: 'Completed' },
];

const statusStyles = {
    Preparing: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-700',
    Completed: 'bg-emerald-100 text-emerald-700',
};

const shortcuts = [
    {
        title: 'Explore Menu',
        description: 'Discover your next favorite meal.',
        href: '/menu',
        icon: UtensilsCrossed,
    },
    {
        title: 'My Orders',
        description: 'Track orders and view your order history.',
        href: '/my-orders',
        icon: Package,
    },
    {
        title: 'My Reservations',
        description: 'Review your upcoming dining visits.',
        href: '/my-reservations',
        icon: CalendarDays,
    },
];

function CustomerDashboard() {
    return (
        <>
            <Head title="My Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                        Welcome Back!
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">
                        Keep track of your orders and plan your next visit.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white xl:col-span-2">
                        <div className="flex items-center justify-between border-b border-stone-100 p-5">
                            <div>
                                <h2 className="font-semibold text-stone-900">
                                    Recent Orders
                                </h2>
                                <p className="mt-1 text-sm text-stone-500">
                                    Your latest restaurant orders
                                </p>
                            </div>

                            <Link
                                href="/my-orders"
                                className="inline-flex items-center gap-1 text-sm font-medium text-orange-700 hover:text-orange-800"
                            >
                                View all <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="divide-y divide-stone-100">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="rounded-lg bg-orange-100 p-2.5 text-orange-700">
                                            <ShoppingBag size={20} />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="font-semibold text-stone-800">
                                                {order.id}
                                            </p>
                                            <p className="mt-1 text-sm text-stone-500">
                                                {order.date}
                                            </p>
                                            <p className="mt-1 text-sm text-stone-600">
                                                {order.items}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                                        <p className="font-semibold text-stone-900">
                                            Rs. {order.total.toLocaleString()}
                                        </p>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-6">
                        <section className="rounded-xl border border-stone-200 bg-white p-5">
                            <div className="flex items-center gap-2">
                                <CalendarDays size={20} className="text-orange-700" />
                                <h2 className="font-semibold text-stone-900">
                                    Next Reservation
                                </h2>
                            </div>

                            <div className="mt-4 rounded-lg bg-orange-50 p-4">
                                <p className="text-sm font-semibold text-stone-800">
                                    Saturday, October 17
                                </p>
                                <p className="mt-1 text-sm text-stone-600">
                                    7:00 PM · 2 guests
                                </p>
                                <span className="mt-3 inline-block rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                                    Pending confirmation
                                </span>
                            </div>

                            <Link
                                href="/my-reservations"
                                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-orange-700 hover:text-orange-800"
                            >
                                Manage reservations <ArrowRight size={16} />
                            </Link>
                        </section>

                        <section className="rounded-xl border border-stone-200 bg-white p-5">
                            <h2 className="font-semibold text-stone-900">
                                Explore Kaku's
                            </h2>

                            <div className="mt-4 space-y-3">
                                {shortcuts.map((shortcut) => {
                                    const Icon = shortcut.icon;

                                    return (
                                        <Link
                                            key={shortcut.title}
                                            href={shortcut.href}
                                            className="group flex items-start gap-3 rounded-lg p-2 transition hover:bg-stone-50"
                                        >
                                            <span className="rounded-lg bg-stone-100 p-2 text-stone-700">
                                                <Icon size={18} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-medium text-stone-800">
                                                    {shortcut.title}
                                                </span>
                                                <span className="mt-1 block text-xs leading-5 text-stone-500">
                                                    {shortcut.description}
                                                </span>
                                            </span>
                                            <ArrowRight
                                                size={15}
                                                className="mt-1 text-stone-400 transition group-hover:translate-x-1"
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CustomerDashboard;