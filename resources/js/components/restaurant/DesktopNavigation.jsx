import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

export default function DesktopNavigation() {
    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        { name: 'Orders', href: '/orders' },
        { name: 'About', href: '/about' },
        { name: "Contact", href: '/contact' },
        { name: 'Reservations', href: '/reservations/customer' },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();

    const isActive = (href) =>
        url === href || (href !== '/' && url.startsWith(`${href}/`));
    return (
        <nav className="relative">
            {/* Desktop Navigation */}
            <div className="hidden items-center gap-7 lg:flex">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={`relative py-2 text-sm font-semibold
                            transition-colors duration-200
                            ${isActive(item.href)
                                ? 'text-stone-100'
                                : 'text-stone-700 hover:text-stone-800'
                            }`}
                    >
                        {item.name}

                        {isActive(item.href) && (
                            <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-stone-100" />
                        )}
                    </Link>
                ))}
            </div>

            {/* Mobile Hamburger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className="inline-flex size-11 items-center justify-center
                    rounded-xl border border-stone-200 bg-white text-stone-800
                    transition hover:bg-amber-50 hover:text-amber-700
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-amber-500 lg:hidden"
            >
                {isOpen ? (
                    <X className="size-6" />
                ) : (
                    <Menu className="size-6" />
                )}
            </button>

            {/* Mobile Navigation Menu */}
            <div
                id="mobile-navigation"
                className={`absolute right-0 top-full z-50 mt-3 w-72
                    max-w-[calc(100vw-2rem)] origin-top-right rounded-2xl
                    border border-stone-200 bg-white p-3 shadow-xl
                    transition duration-200 lg:hidden
                    ${isOpen
                        ? 'visible translate-y-0 scale-100 opacity-100'
                        : 'invisible -translate-y-2 scale-95 opacity-0'
                    }`}
            >
                <div className="flex flex-col gap-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            aria-current={isActive(item.href) ? 'page' : undefined}
                            className={`rounded-xl px-4 py-3 text-sm font-medium
                                transition-colors duration-200
                                ${isActive(item.href)
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'text-stone-700 hover:bg-stone-50 hover:text-amber-700'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}