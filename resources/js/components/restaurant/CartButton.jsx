import { Link, usePage } from '@inertiajs/react';

export default function CartButton() {
    const { cart } = usePage().props;

    const cartCount = cart?.itemCount ?? 0;

    return (
        <Link
            href="/cart"
            className="relative rounded-full p-2.5 text-stone-600 transition hover:bg-amber-50 hover:text-amber-700"
        >
            🛒
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-700 text-xs text-white">
                    {cartCount}
                </span>
            )}
        </Link>
    );
}
