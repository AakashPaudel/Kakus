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

import StatCard from '@/components/dashboard/StatCard';




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
        href: '/orders',
        icon: Package,
    },
    {
        title: 'My Reservations',
        description: 'Review your upcoming dining visits.',
        href: '/reservations/customer',
        icon: CalendarDays,
    },
];

export default function CustomerDashboard({
    stats: dashboardStats = {},
    recentOrders = [],
    upcomingReservation = [], }) {

    const statCards = [
        {
            title: "Total Orders",
            value: dashboardStats.totalOrders ?? 0,
            description: 'Orders received',
            icon: 'shopping-bag',
        },
        {
            title: 'Active Orders',
            value: dashboardStats.activeOrders ?? 0,
            description: 'Orders waiting for processing',
            icon: 'clock',
        },
        {
            title: "Upcoming Reservations",
            value: dashboardStats.upcomingReservations ?? 0,
            description: 'Reservations scheduled for the future',
            icon: 'calendar-days',
        },
        {
            title: 'Orders Completed',
            value: dashboardStats.completedOrders ?? 0,
            description: 'Orders completed',
            icon: 'check-circle',
        },
    ];

    return (
        <>
            <Head title="My Dashboard" />

            <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8">

                    {/* Welcome Header */}
                    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7 dark:border-stone-800 dark:bg-stone-900">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="mb-2 text-sm font-semibold tracking-wide text-orange-700 dark:text-orange-400">
                                    KAKU'S RESTAURANT
                                </p>

                                <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
                                    Welcome Back!
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 sm:text-base dark:text-stone-400">
                                    Keep track of your orders, manage your reservations,
                                    and plan your next delicious visit.
                                </p>
                            </div>

                            <Link
                                href="/menu"
                                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900"
                            >
                                Explore Menu
                                <ArrowRight size={17} />
                            </Link>
                        </div>
                    </section>

                    {/* Statistics Cards */}
                    <section aria-label="Dashboard statistics">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {statCards.map((stat) => (
                                <StatCard key={stat.title} {...stat} />
                            ))}
                        </div>
                    </section>

                    {/* Main Dashboard Content */}
                    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">

                        {/* Recent Orders */}
                        <section className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm xl:col-span-2 dark:border-stone-800 dark:bg-stone-900">
                            <div className="flex flex-col gap-3 border-b border-stone-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-stone-800">
                                <div>
                                    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                                        Recent Orders
                                    </h2>

                                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                        Keep track of your latest restaurant orders.
                                    </p>
                                </div>

                                <Link
                                    href="/orders"
                                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-orange-700 transition hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                                >
                                    View all orders
                                    <ArrowRight size={16} />
                                </Link>
                            </div>

                            {recentOrders.length > 0 ? (
                                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex flex-col gap-4 p-5 transition hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:hover:bg-stone-800/50"
                                        >
                                            <div className="flex min-w-0 items-start gap-4">
                                                <div className="shrink-0 rounded-xl bg-orange-50 p-3 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
                                                    <ShoppingBag size={21} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                                                        Order #{order.id}
                                                    </p>

                                                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                                        {order.date}
                                                    </p>

                                                    <p className="mt-2 break-words text-sm leading-5 text-stone-600 dark:text-stone-300">
                                                        {order.items}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                                                <p className="text-base font-bold text-stone-900 dark:text-stone-100">
                                                    Rs. {Number(order.total).toLocaleString('en-IN')}
                                                </p>

                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] ??
                                                        'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center px-6 py-12 text-center">
                                    <div className="rounded-full bg-stone-100 p-4 dark:bg-stone-800">
                                        <ShoppingBag
                                            size={28}
                                            className="text-stone-500"
                                        />
                                    </div>

                                    <h3 className="mt-4 font-semibold text-stone-900 dark:text-stone-100">
                                        No orders yet
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
                                        Your recent orders will appear here when you
                                        order something delicious.
                                    </p>

                                    <Link
                                        href="/menu"
                                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                                    >
                                        Browse Menu
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Right Sidebar */}
                        <div className="flex min-w-0 flex-col gap-6">

                            {/* Next Reservation */}
                            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-orange-50 p-2.5 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
                                        <CalendarDays size={21} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-stone-900 dark:text-stone-100">
                                            Next Reservation
                                        </h2>

                                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                            Your upcoming dining plan
                                        </p>
                                    </div>
                                </div>

                                {upcomingReservation ? (
                                    <div className="mt-5">
                                        <div className="rounded-xl border border-orange-100 bg-orange-50/70 p-4 dark:border-orange-900/50 dark:bg-orange-950/30">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-400">
                                                Reservation Date
                                            </p>

                                            <p className="mt-2 text-lg font-bold leading-7 text-stone-900 dark:text-stone-100">
                                                {new Date(
                                                    `${upcomingReservation.reservation_date}T00:00:00`
                                                ).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>

                                            <div className="mt-4 flex flex-col gap-3">
                                                <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                                                    <Clock
                                                        size={16}
                                                        className="shrink-0 text-orange-700 dark:text-orange-400"
                                                    />

                                                    <span>
                                                        {upcomingReservation.start_time
                                                            ? new Date(
                                                                `2000-01-01T${upcomingReservation.start_time}`
                                                            ).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })
                                                            : 'Time not specified'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                                                    <Users
                                                        size={16}
                                                        className="shrink-0 text-orange-700 dark:text-orange-400"
                                                    />

                                                    <span>
                                                        {upcomingReservation.guest_count}{' '}
                                                        {Number(upcomingReservation.guest_count) === 1
                                                            ? 'guest'
                                                            : 'guests'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 border-t border-orange-200/70 pt-4 dark:border-orange-900/60">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${upcomingReservation.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                                            : upcomingReservation.status === 'pending'
                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                                : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                                                        }`}
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />

                                                    {upcomingReservation.status === 'pending'
                                                        ? 'Pending confirmation'
                                                        : upcomingReservation.status === 'confirmed'
                                                            ? 'Confirmed'
                                                            : upcomingReservation.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-5 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-7 text-center dark:border-stone-700 dark:bg-stone-800/50">
                                        <CalendarDays
                                            size={28}
                                            className="mx-auto text-stone-400"
                                        />

                                        <p className="mt-3 font-semibold text-stone-800 dark:text-stone-200">
                                            No upcoming reservations
                                        </p>

                                        <p className="mt-1 text-sm leading-5 text-stone-500 dark:text-stone-400">
                                            Reserve your table for your next visit.
                                        </p>
                                    </div>
                                )}

                                <Link
                                    href="/reservations/customer"
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800 dark:border-stone-700 dark:text-stone-200 dark:hover:border-orange-800 dark:hover:bg-orange-950/30 dark:hover:text-orange-300"
                                >
                                    Manage Reservations
                                    <ArrowRight size={16} />
                                </Link>
                            </section>

                            {/* Explore Kaku's */}
                            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-stone-800 dark:bg-stone-900">
                                <div>
                                    <h2 className="font-bold text-stone-900 dark:text-stone-100">
                                        Explore Kaku's
                                    </h2>

                                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                        Everything you need, in one place.
                                    </p>
                                </div>

                                <div className="mt-5 flex flex-col gap-2">
                                    {shortcuts.map((shortcut) => {
                                        const Icon = shortcut.icon;

                                        return (
                                            <Link
                                                key={shortcut.title}
                                                href={shortcut.href}
                                                className="group flex min-w-0 items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-stone-200 hover:bg-stone-50 dark:hover:border-stone-700 dark:hover:bg-stone-800/70"
                                            >
                                                <span className="shrink-0 rounded-xl bg-stone-100 p-2.5 text-stone-700 transition group-hover:bg-orange-100 group-hover:text-orange-700 dark:bg-stone-800 dark:text-stone-300 dark:group-hover:bg-orange-950 dark:group-hover:text-orange-400">
                                                    <Icon size={19} />
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-sm font-semibold text-stone-800 dark:text-stone-200">
                                                        {shortcut.title}
                                                    </span>

                                                    <span className="mt-1 block text-xs leading-5 text-stone-500 dark:text-stone-400">
                                                        {shortcut.description}
                                                    </span>
                                                </span>

                                                <ArrowRight
                                                    size={16}
                                                    className="shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-orange-700 dark:group-hover:text-orange-400"
                                                />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}