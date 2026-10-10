
import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Activity,
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    ChevronDown,
    CircleHelp,
    Clock3,
    Coffee,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Search,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    UserRound,
    X,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import MetricCard from '@/components/customer-dashboard/MetricCard';
import OrdersTable from '@/components/customer-dashboard/OrdersTable';

const navigation = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Browse menu', href: '/menu', icon: Coffee },
    { label: 'My orders', href: '/orders', icon: ShoppingBag },
    { label: 'Reservations', href: '/reservations/customer', icon: CalendarDays },
    { label: 'My cart', href: '/cart', icon: ShoppingCart },
    { label: 'Profile settings', href: '/settings/profile', icon: Settings },
];

const money = (amount) =>
    new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        maximumFractionDigits: 0,
    }).format(Number(amount ?? 0));

const dateLabel = (value) => {
    if (!value) return 'Not scheduled';

    const date = new Date(`${value}`.length === 10 ? `${value}T00:00:00` : value);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat('en', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          }).format(date);
};

function CustomerSidebar({ open, onClose, user }) {
    return (
        <>
            {open && (
                <button
                    aria-label="Close navigation overlay"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-950 lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
                aria-label="Customer navigation"
            >
                <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6 dark:border-zinc-800">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
                            <Coffee size={22} aria-hidden="true" />
                        </span>
                        <span>
                            <span className="block font-bold tracking-tight text-slate-900 dark:text-white">
                                Kaku's
                            </span>
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                                Customer space
                            </span>
                        </span>
                    </Link>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden"
                        aria-label="Close navigation"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Your restaurant
                    </p>

                    {navigation.map(({ label, href, icon: Icon }) => {
                        const active = href === '/dashboard';

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                aria-current={active ? 'page' : undefined}
                                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                                }`}
                            >
                                <Icon size={19} aria-hidden="true" />
                                {label}
                            </Link>
                        );
                    })}

                    <div className="mt-8 rounded-2xl bg-slate-50 p-4 dark:bg-zinc-900">
                        <div className="mb-2 flex items-center gap-2 text-slate-800 dark:text-white">
                            <CircleHelp size={18} />
                            <span className="text-sm font-semibold">Need help?</span>
                        </div>
                        <p className="mb-3 text-xs leading-5 text-slate-500 dark:text-zinc-400">
                            Have a question about an order or reservation?
                        </p>
                        <Link
                            href="/contact"
                            className="text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
                        >
                            Contact us <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </nav>

                <div className="border-t border-slate-100 p-4 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                            {(user?.name || 'Customer').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                {user?.name || 'Customer'}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

function SectionHeading({ title, description, action, href }) {
    return (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
                >
                    {action} <ArrowRight size={16} aria-hidden="true" />
                </Link>
            )}
        </div>
    );
}

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <p className="mb-1 text-xs text-slate-500 dark:text-zinc-400">{label}</p>
            <p className="font-semibold text-slate-900 dark:text-white">
                {payload[0].name === 'spend'
                    ? money(payload[0].value)
                    : `${payload[0].value} orders`}
            </p>
        </div>
    );
}

export default function Dashboard({
    auth,
    stats = {},
    activity = [],
    orderTrend = [],
    orderDistribution = [],
    upcomingReservation = null,
    recentOrders = [],
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const user = auth?.user;
    const today = new Intl.DateTimeFormat('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());

    const chartColors = ['#d97706', '#0d9488', '#64748b', '#dc2626'];

    const totalOrders = stats.totalOrders ?? 0;
    const activeOrders = stats.activeOrders ?? 0;
    const completedOrders = stats.completedOrders ?? 0;
    const totalSpent = stats.totalSpent ?? 0;

    const metricCards = [
        {
            title: 'Total orders',
            value: totalOrders.toLocaleString(),
            note: 'Orders placed with us',
            icon: ShoppingBag,
        },
        {
            title: 'Active orders',
            value: activeOrders.toLocaleString(),
            note: 'Currently being processed',
            icon: Activity,
        },
        {
            title: 'Completed orders',
            value: completedOrders.toLocaleString(),
            note: 'Successfully completed',
            icon: Package,
        },
        {
            title: 'Total spent',
            value: money(totalSpent),
            note: 'Across your orders',
            icon: Sparkles,
        },
    ];

    const recentActivity = useMemo(
        () => activity.slice(0, 5),
        [activity],
    );

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-zinc-950 dark:text-white">
                <CustomerSidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    user={user}
                />

                <div className="lg:pl-64">
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 lg:hidden"
                                aria-label="Open navigation"
                            >
                                <Menu size={21} />
                            </button>
                            <div>
                                <p className="text-sm font-semibold">Customer dashboard</p>
                                <p className="hidden text-xs text-slate-500 dark:text-zinc-400 sm:block">
                                    Your restaurant, all in one place
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/cart"
                                aria-label="View shopping cart"
                                className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <ShoppingCart size={20} />
                            </Link>
                            <button
                                onClick={() => setDarkMode((value) => !value)}
                                aria-label={darkMode ? 'Switch to light appearance' : 'Switch to dark appearance'}
                                className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                {darkMode ? <Sparkles size={20} /> : <Clock3 size={20} />}
                            </button>
                            <Link
                                href="/settings/profile"
                                aria-label="Open profile settings"
                                className="rounded-full bg-amber-100 p-2.5 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                            >
                                <UserRound size={19} />
                            </Link>
                        </div>
                    </header>

                    <main className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
                        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 p-6 text-white shadow-sm sm:p-8">
                            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/10" />
                            <div className="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

                            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                                <div>
                                    <p className="mb-2 text-sm font-medium text-amber-50">
                                        {today}
                                    </p>
                                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                        Welcome back, {user?.name?.split(' ')[0] || 'there'}!
                                    </h1>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-amber-50 sm:text-base">
                                        Ready for something delicious? Keep track of your orders
                                        and reservations right here.
                                    </p>
                                </div>

                                <Link
                                    href="/menu"
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-600"
                                >
                                    <Coffee size={18} />
                                    Explore the menu
                                    <ArrowRight size={17} />
                                </Link>
                            </div>
                        </section>

                        <section aria-label="Order summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {metricCards.map((metric) => (
                                <MetricCard key={metric.title} {...metric} />
                            ))}
                        </section>

                        <section className="grid gap-6 xl:grid-cols-3">
                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6 xl:col-span-2">
                                <SectionHeading
                                    title="Your order activity"
                                    description="Track how your orders have changed over time."
                                />

                                {orderTrend.length ? (
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={orderTrend} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="orderFill" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#d97706" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                                                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <Tooltip content={<ChartTooltip />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="orders"
                                                    name="orders"
                                                    stroke="#d97706"
                                                    strokeWidth={3}
                                                    fill="url(#orderFill)"
                                                    activeDot={{ r: 5 }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="flex h-72 flex-col items-center justify-center text-center">
                                        <Activity className="mb-3 text-slate-400" size={30} />
                                        <p className="font-semibold">Your activity will appear here</p>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                            Place your first order to start building your history.
                                        </p>
                                    </div>
                                )}
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                                <SectionHeading
                                    title="Order breakdown"
                                    description="A snapshot of your order statuses."
                                />

                                {orderDistribution.length ? (
                                    <>
                                        <div className="relative h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={orderDistribution}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        innerRadius={58}
                                                        outerRadius={82}
                                                        paddingAngle={4}
                                                        stroke="none"
                                                    >
                                                        {orderDistribution.map((entry, index) => (
                                                            <Cell
                                                                key={entry.name}
                                                                fill={entry.color || chartColors[index % chartColors.length]}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-bold">{totalOrders}</span>
                                                <span className="text-xs text-slate-500 dark:text-zinc-400">Total orders</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 space-y-3">
                                            {orderDistribution.map((item, index) => (
                                                <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="h-2.5 w-2.5 rounded-full"
                                                            style={{ backgroundColor: item.color || chartColors[index % chartColors.length] }}
                                                        />
                                                        <span className="capitalize text-slate-600 dark:text-zinc-300">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex h-72 flex-col items-center justify-center text-center">
                                        <Package className="mb-3 text-slate-400" size={30} />
                                        <p className="font-semibold">No order data yet</p>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                            Your breakdown will appear after ordering.
                                        </p>
                                    </div>
                                )}
                            </article>
                        </section>

                        <section className="grid gap-6 xl:grid-cols-3">
                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6 xl:col-span-2">
                                <SectionHeading
                                    title="Recent orders"
                                    description="Your latest purchases and their current status."
                                    action="All orders"
                                    href="/orders"
                                />
                                <OrdersTable orders={recentOrders} />
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                                <SectionHeading
                                    title="Upcoming reservation"
                                    description="Your next planned visit."
                                    action="All reservations"
                                    href="/reservations"
                                />

                                {upcomingReservation ? (
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
                                        <div className="mb-4 flex items-start justify-between gap-2">
                                            <span className="rounded-lg bg-white p-3 text-amber-700 shadow-sm dark:bg-zinc-800 dark:text-amber-300">
                                                <CalendarDays size={22} />
                                            </span>
                                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold capitalize text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                                                {upcomingReservation.status}
                                            </span>
                                        </div>
                                        <p className="font-bold text-slate-900 dark:text-white">
                                            {dateLabel(upcomingReservation.reservation_date)}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                                            {upcomingReservation.start_time || 'Time to be confirmed'}
                                        </p>
                                        <div className="mt-4 space-y-2 border-t border-amber-200 pt-4 text-sm text-slate-600 dark:border-amber-500/20 dark:text-zinc-300">
                                            <p>
                                                <span className="font-medium">Guests:</span>{' '}
                                                {upcomingReservation.guest_count ?? '—'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Table:</span>{' '}
                                                {upcomingReservation.table_number ?? 'To be assigned'}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/reservations/${upcomingReservation.id}`}
                                            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-800 hover:underline dark:text-amber-300"
                                        >
                                            View reservation <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-zinc-700">
                                        <CalendarDays className="mx-auto mb-3 text-slate-400" size={28} />
                                        <p className="font-semibold">No upcoming reservations</p>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                            Save a table for your next visit.
                                        </p>
                                        <Link
                                            href="/reservations/create"
                                            className="mt-4 inline-flex rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                                        >
                                            Book a table
                                        </Link>
                                    </div>
                                )}
                            </article>
                        </section>

                        <section>
                            <SectionHeading
                                title="Quick actions"
                                description="The things you might want to do next."
                            />
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    { title: 'Browse the menu', detail: 'Discover your next favourite.', href: '/menu', icon: Coffee },
                                    { title: 'Place an order', detail: 'Choose dishes for your meal.', href: '/menu', icon: ShoppingBag },
                                    { title: 'Book a table', detail: 'Plan your next restaurant visit.', href: '/reservations/create', icon: CalendarDays },
                                    { title: 'Update profile', detail: 'Keep your details up to date.', href: '/settings/profile', icon: UserRound },
                                ].map(({ title, detail, href, icon: Icon }) => (
                                    <Link
                                        key={title}
                                        href={href}
                                        className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/40"
                                    >
                                        <span className="rounded-xl bg-amber-50 p-3 text-amber-700 transition group-hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:group-hover:bg-amber-500/20">
                                            <Icon size={22} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-semibold text-slate-900 dark:text-white">
                                                {title}
                                            </span>
                                            <span className="mt-1 block text-sm leading-5 text-slate-500 dark:text-zinc-400">
                                                {detail}
                                            </span>
                                        </span>
                                        <ArrowRight className="mt-1 text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-600" size={18} />
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {recentActivity.length > 0 && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                                <SectionHeading title="Recent activity" description="A quick look at recent account updates." />
                                <div className="space-y-4">
                                    {recentActivity.map((item, index) => (
                                        <div key={item.id ?? `${item.title}-${index}`} className="flex gap-3">
                                            <span className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                                                <Activity size={16} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-slate-800 dark:text-zinc-100">
                                                    {item.title}
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <time className="shrink-0 text-xs text-slate-400">
                                                {dateLabel(item.date)}
                                            </time>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <footer className="border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-500 sm:px-6">
                        © {new Date().getFullYear()} Kaku's Restaurant. Made for good food and good company.
                    </footer>
                </div>
            </div>
        </div>
    );
}
