
import StatCard from '@/components/dashboard/StatCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import RecentReservations from '@/components/dashboard/RecentReservations';
import LowStockItems from '@/components/dashboard/LowStockItems';
import SalesSummary from '@/components/dashboard/SalesSummary';
import QuickActions from '@/components/dashboard/QuickActions';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function Dashboard({
    stats = {},
    recentOrders = [],
    recentReservations = [],
    lowStockItems = [],
    sales = {},
}) {

    return (
        <AdminPageLayout>

                {/* Page heading */}
                <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7 dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-400">
                                Kaku's Administration
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
                                Dashboard Overview
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base dark:text-stone-400">
                                Welcome back! Here's what's happening at Kaku's.
                                Monitor your sales, orders, reservations, and inventory
                                from one place.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Overview statistics */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                            Business Overview
                        </h2>

                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            A quick look at your restaurant's current activity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                </section>

                {/* Sales summary */}
                <section className="min-w-0">
                    <SalesSummary sales={sales} />
                </section>

                {/* Recent orders and reservations */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                            Recent Activity
                        </h2>

                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Keep track of customer orders and upcoming bookings.
                        </p>
                    </div>

                    <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-2">
                        <div className="min-w-0">
                            <RecentOrders orders={recentOrders} />
                        </div>

                        <div className="min-w-0">
                            <RecentReservations
                                reservations={recentReservations}
                            />
                        </div>
                    </div>
                </section>

                {/* Inventory and quick actions */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                            Inventory & Management
                        </h2>

                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Monitor stock levels and access your frequently used tools.
                        </p>
                    </div>

                    <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-2">
                        <div className="min-w-0">
                            <LowStockItems items={lowStockItems} />
                        </div>

                        <div className="min-w-0">
                            <QuickActions />
                        </div>
                    </div>
                </section>

        </AdminPageLayout>
    );
}
