import { Link } from '@inertiajs/react';

export default function Logo() {
    return (
        <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-700 text-white">
                <span className="text-xl">🍽</span>
            </div>

            <div className="leading-tight">
                <span className="block text-xl font-bold tracking-wide text-stone-900">
                    La Maison
                </span>

                <span className="hidden text-xs tracking-[0.2em] text-amber-700 uppercase sm:block">
                    Restaurant
                </span>
            </div>
        </Link>
    );
}
