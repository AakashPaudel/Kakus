
import { Link, usePage } from '@inertiajs/react';

export default function CartButton() {
    const { cart } = usePage().props;

    const cartCount = cart?.cartCount ?? 0;

    return (
        <Link
            href="/cart"
            aria-label={
                cartCount > 0
                    ? `Shopping cart with ${cartCount} items`
                    : 'Shopping cart'
            }
            className="
                group relative inline-flex size-10 shrink-0
                items-center justify-center
                rounded-full border border-stone-200
                bg-white text-stone-700
                transition-all duration-200
                hover:border-amber-300 hover:bg-amber-50
                hover:text-amber-800
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-amber-600
                focus-visible:ring-offset-2
                active:scale-95
                sm:size-11
            "
        >
            {/* Shopping Cart Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="
                    size-5 transition-transform duration-200
                    group-hover:scale-110 sm:size-[22px]
                "
            >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />

                <path
                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                />
            </svg>

            {/* Cart Item Count */}
            {cartCount > 0 && (
                <span
                    aria-hidden="true"
                    className="
                        absolute -right-1 -top-1
                        flex h-[19px] min-w-[19px]
                        items-center justify-center
                        rounded-full border-2 border-white
                        bg-amber-800 px-1
                        text-[10px] font-bold leading-none
                        tabular-nums text-white
                        shadow-sm
                        sm:h-5 sm:min-w-5 sm:text-[11px]
                    "
                >
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </Link>
    );
}
