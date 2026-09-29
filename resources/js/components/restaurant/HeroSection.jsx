import { Link } from '@inertiajs/react';

export default function HeroSection() {
    return (
        <section className="grid min-h-[500px] items-center gap-12 lg:grid-cols-2">
            <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-600">
                    Welcome to Kaku's
                </p>

                <h1 className="max-w-xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                    Good food,
                    <span className="block text-amber-600">
                        great moments.
                    </span>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">
                    Discover delicious meals prepared with fresh ingredients
                    and served with care.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        href="/menu"
                        className="rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
                    >
                        Explore Menu
                    </Link>

                    <Link
                        href="/reservations"
                        className="rounded-lg border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                        Reserve a Table
                    </Link>
                </div>
            </div>

            <div className="flex min-h-[350px] items-center justify-center rounded-3xl bg-amber-100 p-8">
                <div className="text-center">
                    <p className="text-6xl">🍽️</p>

                    <p className="mt-4 text-xl font-semibold text-stone-800">
                        Freshly prepared
                    </p>

                    <p className="mt-2 text-stone-600">
                        Made for every occasion.
                    </p>
                </div>
            </div>
        </section>
    );
}