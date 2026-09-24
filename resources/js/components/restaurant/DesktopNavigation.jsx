import { Link } from '@inertiajs/react';

export default function DesktopNavigation() {
    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        { name: "Today's Specials", href: '/specials' },
        { name: 'Table Reservation', href: '/reservation' },
        { name: 'Orders', href: '/orders' },
    ];

    return (
        <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-stone-600 transition hover:text-amber-700"
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}
