
import { Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    UtensilsCrossed,
    ShoppingBag,
    CalendarDays,
} from 'lucide-react';

const actions = [
    {
        title: 'Manage Menu',
        description: 'Add or update menu items.',
        href: '/admin/menu',
        icon: UtensilsCrossed,
        iconStyle:
            'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white dark:bg-orange-500/10 dark:text-orange-400 dark:group-hover:bg-orange-500 dark:group-hover:text-white',
    },
    {
        title: 'Manage Orders',
        description: 'Review orders and update status.',
        href: '/admin/orders',
        icon: ShoppingBag,
        iconStyle:
            'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:group-hover:bg-blue-500 dark:group-hover:text-white',
    },
    {
        title: 'Reservations',
        description: 'Review restaurant bookings.',
        href: '/admin/reservations',
        icon: CalendarDays,
        iconStyle:
            'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-500/10 dark:text-purple-400 dark:group-hover:bg-purple-500 dark:group-hover:text-white',
    },
];

export default function QuickActions() {
    return (
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 sm:p-6">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                    Jump directly to common management tasks.
                </p>
            </div>

            {/* Action Cards */}
            <div className="grid gap-3 sm:grid-cols-2">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-xl border border-stone-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-orange-500/50 dark:hover:bg-stone-800 dark:focus-visible:ring-offset-stone-900 sm:p-5"
                        >
                            {/* Icon and Arrow */}
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${action.iconStyle}`}
                                >
                                    <Icon size={21} strokeWidth={1.8} />
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="text-stone-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-orange-600 dark:text-stone-500 dark:group-hover:text-orange-400"
                                />
                            </div>

                            {/* Action Details */}
                            <div>
                                <h3 className="font-semibold text-stone-900 transition-colors group-hover:text-orange-700 dark:text-stone-100 dark:group-hover:text-orange-400">
                                    {action.title}
                                </h3>

                                <p className="mt-1 text-sm leading-5 text-stone-500 dark:text-stone-400">
                                    {action.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4 dark:border-stone-800">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />

                <p className="text-xs text-stone-500 dark:text-stone-400">
                    Your restaurant management tools are ready to use.
                </p>
            </div>
        </section>
    );
}
