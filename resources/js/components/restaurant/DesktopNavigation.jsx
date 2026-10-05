import { Link } from '@inertiajs/react';

export default function DesktopNavigation() {
    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        { name: 'Orders', href: '/orders' },
        {name: 'About', href: '/about'},
        { name: "Contact", href: '/contact' },
        { name: 'Reservations', href: '/reservations/customer' },
    ];

    return (
        <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="text-md font-medium transition hover:text-amber-300"
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}
