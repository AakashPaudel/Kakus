import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function UserMenu() {
    const { auth } = usePage().props;

    const [open, setOpen] = useState(false);

    const user = auth?.user;

    const logout = () => {
        router.post('/logout');
    };

    if (!user) {
        return (
            <div className="hidden items-center gap-3 sm:flex">
                <Link
                    href="/login"
                    className="group inline-flex items-center justify-center rounded-full border border-amber-800/20 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition-all duration-300 hover:border-amber-700 hover:bg-amber-50 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                >
                    Login
                </Link>

                <Link
                    href="/register"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-900 hover:shadow-lg hover:shadow-amber-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                >
                    Create Account
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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


    return (
        <div className="relative hidden sm:block">
            {/* User Avatar */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label="Open user menu"
                className={`flex h - 10 w - 10 items - center justify - center rounded - full
    bg - amber - 700 text - sm font - bold text - white shadow - sm
    ring - 2 ring - amber - 100 transition - all duration - 200
    hover: bg - amber - 800 hover: shadow - md
    focus: outline - none focus: ring - 2 focus: ring - amber - 500
    focus: ring - offset - 2 ${open ? "ring-amber-400" : ""
                    } `}
            >
                {user.name?.charAt(0).toUpperCase()}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 z-50 mt-3 w-64
                    overflow-hidden rounded-2xl border border-stone-200
                    bg-white shadow-xl shadow-stone-900/10
                    animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    {/* User Information */}
                    <div className="border-b border-stone-100 bg-stone-50/80 px-4 py-4">
                        <p className="truncate text-sm font-semibold text-stone-900">
                            {user.name}
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                            Welcome to Kaku’s
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-2">
                        <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl
                            px-3 py-2.5 text-sm font-medium text-stone-700
                            transition-colors hover:bg-amber-50
                            hover:text-amber-800"
                        >
                            <span className="text-base">👤</span>
                            My Profile
                        </Link>

                        <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl
                            px-3 py-2.5 text-sm font-medium text-stone-700
                            transition-colors hover:bg-amber-50
                            hover:text-amber-800"
                        >
                            <span className="text-base">▦</span>
                            Dashboard
                        </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-stone-100 p-2">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                logout();
                            }}
                            className="flex w-full items-center gap-3
                            rounded-xl px-3 py-2.5 text-left text-sm
                            font-medium text-red-600 transition-colors
                            hover:bg-red-50 hover:text-red-700"
                        >
                            <span className="text-base">↪</span>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
