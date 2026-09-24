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
            <div className="hidden items-center gap-2 sm:flex">
                <Link
                    href="/login"
                    className="rounded-lg bg-amber-700 px-4 py-2 text-sm"
                >
                    Login
                </Link>

                <Link
                    href="/register"
                    className="rounded-lg bg-amber-700 px-4 py-2 text-white"
                >
                    Register
                </Link>
            </div>
        );
    }

    return (
        <div className="relative hidden sm:block">
            <button
                type="submit"
                onClick={() => setOpen(!open)}
                className="h-9 w-9 rounded-full bg-amber-700 text-white"
            >
                {user.name?.charAt(0).toUpperCase()}
            </button>

            <p className="text-black">{open ? 'OPEN' : 'CLOSED'}</p>

            {open && (
                <div className="absolute right-0 mt-3 w-48 rounded-lg border bg-white shadow-lg">
                    <Link
                        href="/profile"
                        className="block px-4 py-3 text-gray-700 hover:bg-stone-50"
                    >
                        Profile
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
