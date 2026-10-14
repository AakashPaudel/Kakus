
import { Link } from '@inertiajs/react';

const actions = [
    {
        title: 'Manage Menu',
        description: 'Add or update menu items.',
        href: '/admin/menu',
    },
    {
        title: 'Manage Orders',
        description: 'Review orders and update status.',
        href: '/admin/orders',
    },
    {
        title: 'Reservations',
        description: 'Review restaurant bookings.',
        href: '/reservations',
    },
    {
        title: 'Inventory',
        description: 'Check stock and reorder levels.',
        href: '/admin/inventory',
    },
];

export default function QuickActions() {
    return (
        <section className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-stone-900">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    Jump directly to common management tasks.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {actions.map((action) => (
                    <Link
                        key={action.title}
                        href={action.href}
                        className="rounded-lg border border-stone-200 p-4 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        <h3 className="font-medium text-stone-900">
                            {action.title}
                        </h3>

                        <p className="mt-1 text-sm text-stone-500">
                            {action.description}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
