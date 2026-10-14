
import StatCard from '@/components/dashboard/StatCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import RecentReservations from '@/components/dashboard/RecentReservations';
import LowStockItems from '@/components/dashboard/LowStockItems';
import SalesSummary from '@/components/dashboard/SalesSummary';
import QuickActions from '@/components/dashboard/QuickActions';

export default function Dashboard({
    stats = {},
    recentOrders = [],
    recentReservations = [],
    lowStockItems = [],
    sales = {},
}) {
    return (
        <div className="space-y-8">
            {/* Page heading */}
            <div>
                <h1 className="text-2xl font-bold text-stone-900">
                    Dashboard Overview
                </h1>

                <p className="mt-1 text-sm text-stone-500">
                    Welcome back! Here's what's happening at Kaku's.
                </p>
            </div>

            {/* Overview cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders ?? 0}
                    description="Orders received"
                />

                <StatCard
                    title="Reservations"
                    value={stats.totalReservations ?? 0}
                    description="Bookings received"
                />

                <StatCard
                    title="Menu Items"
                    value={stats.totalMenuItems ?? 0}
                    description="Items on your menu"
                />

                <StatCard
                    title="Low Stock"
                    value={stats.lowStockItems ?? 0}
                    description="Items needing attention"
                />
            </div>

            {/* Sales */}
            <SalesSummary sales={sales} />

            {/* Orders and reservations */}
            <div className="grid items-start gap-6 xl:grid-cols-2">
                <RecentOrders orders={recentOrders} />

                <RecentReservations
                    reservations={recentReservations}
                />
            </div>

            {/* Inventory and quick actions */}
            <div className="grid items-start gap-6 xl:grid-cols-2">
                <LowStockItems items={lowStockItems} />

                <QuickActions />
            </div>
        </div>
    );
}
