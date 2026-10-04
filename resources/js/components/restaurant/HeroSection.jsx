import { Link } from '@inertiajs/react';

export default function HeroSection() {
    const stats = [
        {
            value: '1,000+',
            label: 'Happy Customers',
        },
        {
            value: '4.8',
            label: 'Rating',
        },
        {
            value: '50+',
            label: 'Customer Reviews',
        },
        {
            value: '30+',
            label: 'Menu Varieties',
        },
    ];
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
                        href="/reservations/create"
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
            <section className="py-16 lg:col-span-2 w-full">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </section>
    );
}