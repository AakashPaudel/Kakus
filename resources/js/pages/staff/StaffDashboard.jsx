import { Head } from '@inertiajs/react';

import StatCard from '@/components/dashboard/StatCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import RecentReservations from '@/components/dashboard/RecentReservations';
import QuickActions from '@/components/dashboard/QuickActions';

// const stats = [
//     {
//         title: "Today's Orders",
//         value: 0,
//         description: 'Orders received today',
//         icon: 'shopping-bag',
//     },
//     {
//         title: 'Pending Orders',
//         value: 0,
//         description: 'Orders waiting for processing',
//         icon: 'clock',
//     },
//     {
//         title: "Today's Reservations",
//         value: 0,
//         description: 'Reservations scheduled today',
//         icon: 'calendar-days',
//     },
//     {
//         title: 'Orders Completed',
//         value: 0,
//         description: 'Orders completed today',
//         icon: 'check-circle',
//     },
// ];

const quickActions = [
    {
        title: 'Manage Orders',
        description: 'View and process customer orders',
        href: '/admin/orders',
    },
    {
        title: 'Manage Reservations',
        description: 'Review customer reservations',
        href: '/admin/reservations',
    },
];

export default function StaffDashboard({
    // stats read as dashboardStats to avoid naming conflict with the local stats variable
    stats: dashboardStats = {},
    recentOrders = [],
    recentReservations = [],
}) {
    const statCards = [
        {
            title: "Today's Orders",
            value: dashboardStats.todayOrders ?? 0,
            description: 'Orders received today',
            icon: 'shopping-bag',
        },
        {
            title: 'Pending Orders',
            value: dashboardStats.pendingOrders ?? 0,
            description: 'Orders waiting for processing',
            icon: 'clock',
        },
        {
            title: "Today's Reservations",
            value: dashboardStats.todayReservations ?? 0,
            description: 'Reservations scheduled today',
            icon: 'calendar-days',
        },
        {
            title: 'Orders Completed',
            value: dashboardStats.completedOrders ?? 0,
            description: 'Orders completed today',
            icon: 'check-circle',
        },
    ];

    return (
        <>
            <Head title="Staff Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                        Staff Overview
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">
                        Monitor today's orders and restaurant reservations.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 xl:grid-cols-2">
                    <RecentOrders orders={recentOrders} />

                    <RecentReservations reservations={recentReservations} />
                </div>

                {/* Quick Actions */}
                <QuickActions actions={quickActions} />
            </div>
        </>
    );
}
