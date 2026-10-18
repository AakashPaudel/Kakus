
import { useEffect, useRef, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function UserMenu() {
    const { auth } = usePage().props;

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const user = auth?.user;

    // Close the dropdown when clicking outside or pressing Escape.
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    const closeMenu = () => {
        setOpen(false);
    };

    const logout = () => {
        closeMenu();
        router.post('/logout');
    };

    // Guest navigation
    if (!user) {
        return (
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Link
                    href="/login"
                    className="
                        inline-flex items-center justify-center
                        rounded-full border border-amber-800/20
                        bg-white px-3 py-2 text-xs font-semibold
                        text-stone-800 shadow-sm
                        transition-all duration-300
                        hover:border-amber-700 hover:bg-amber-50
                        hover:text-amber-800
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-amber-600
                        focus-visible:ring-offset-2
                        sm:px-5 sm:py-2.5 sm:text-sm
                    "
                >
                    Login
                </Link>

                <Link
                    href="/register"
                    className="
                        group inline-flex items-center justify-center
                        gap-1.5 rounded-full bg-amber-800
                        px-3 py-2 text-xs font-semibold text-white
                        shadow-md shadow-amber-900/15
                        transition-all duration-300
                        hover:-translate-y-0.5 hover:bg-amber-900
                        hover:shadow-lg hover:shadow-amber-900/20
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-amber-600
                        focus-visible:ring-offset-2
                        sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm
                    "
                >
                    <span>Create Account</span>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="
                            h-4 w-4 shrink-0
                            transition-transform duration-300
                            group-hover:translate-x-0.5
                        "
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 0 1 .75-.75h10.69L10.22 5.03a.75.75 0 1 1 1.06-1.06l5.5 5.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06l4.22-4.22H3.75A.75.75 0 0 1 3 10Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Link>
            </div>
        );
    }

    // Authenticated user navigation
    return (
        <div
            ref={menuRef}
            className="relative shrink-0"
        >
            {/* User Avatar Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label={open ? 'Close user menu' : 'Open user menu'}
                className={`
                    flex h-10 w-10 items-center justify-center
                    rounded-full bg-amber-800 text-sm font-bold
                    text-white shadow-sm ring-2 ring-amber-100
                    transition-all duration-200
                    hover:bg-amber-900 hover:shadow-md
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-amber-500 focus-visible:ring-offset-2
                    ${open ? 'ring-amber-400' : ''}
                `}
            >
                {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </button>

            {/* Responsive Dropdown */}
            {open && (
                <div
                    className="
                        absolute right-0 top-full z-[100]
                        mt-3 w-[min(18rem,calc(100vw-2rem))]
                        overflow-hidden rounded-2xl
                        border border-stone-200 bg-white
                        shadow-xl shadow-stone-900/10
                        animate-in fade-in slide-in-from-top-2 duration-200
                    "
                >
                    {/* User Information */}
                    <div className="border-b border-stone-100 bg-stone-50 px-4 py-4">
                        <p className="truncate text-sm font-semibold text-stone-900">
                            {user.name}
                        </p>

                        {user.email && (
                            <p className="mt-1 truncate text-xs text-stone-500">
                                {user.email}
                            </p>
                        )}

                        <p className="mt-2 text-xs text-stone-500">
                            Welcome to Kaku's
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <nav
                        aria-label="User navigation"
                        className="p-2"
                    >
                        <Link
                            href="/profile"
                            onClick={closeMenu}
                            className="
                                flex items-center gap-3 rounded-xl
                                px-3 py-3 text-sm font-medium
                                text-stone-700 transition-colors
                                hover:bg-amber-50 hover:text-amber-800
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-amber-600
                            "
                        >
                            <span aria-hidden="true" className="text-base">
                                👤
                            </span>

                            <span>My Profile</span>
                        </Link>

                        <Link
                            href="/dashboard"
                            onClick={closeMenu}
                            className="
                                flex items-center gap-3 rounded-xl
                                px-3 py-3 text-sm font-medium
                                text-stone-700 transition-colors
                                hover:bg-amber-50 hover:text-amber-800
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-amber-600
                            "
                        >
                            <span aria-hidden="true" className="text-base">
                                ▦
                            </span>

                            <span>Dashboard</span>
                        </Link>
                    </nav>

                    {/* Logout */}
                    <div className="border-t border-stone-100 p-2">
                        <button
                            type="button"
                            onClick={logout}
                            className="
                                flex w-full items-center gap-3
                                rounded-xl px-3 py-3 text-left
                                text-sm font-medium text-red-600
                                transition-colors
                                hover:bg-red-50 hover:text-red-700
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-red-500
                            "
                        >
                            <span aria-hidden="true" className="text-base">
                                ↪
                            </span>

                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
