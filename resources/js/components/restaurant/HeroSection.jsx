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
        <>
            <section className="bg-amber-600">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid min-h-[500px] items-center gap-12 lg:grid-cols-2">

                        {/* Left side */}
                        <div>
                            <p className="mb-4 text-sm font-semibold uppercase tracking-widest">
                                Welcome to Kaku's
                            </p>

                            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                                Good food,
                                <span className="block">
                                    great moments.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-lg leading-8">
                                Discover delicious meals prepared with fresh ingredients
                                and served with care.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/menu"
                                    className="rounded-lg px-6 py-3 font-semibold text-white transition hover:bg-black"
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

                        {/* Right side */}
                        <div className="flex min-h-[350px] items-center justify-center rounded-3xl bg-amber-100">
                            <div className="w-full text-center">
                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src="/storage/menu-items/four-cheese-pizza.jpg"
                                        alt="Kaku's dish"
                                        className="h-[300px] w-full object-cover"
                                    />
                                </div>

                                <p className="mt-4 text-xl font-semibold text-stone-800">
                                    Freshly prepared
                                </p>

                                <p className="mt-2 text-stone-600">
                                    Made for every occasion.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                <section className=" py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-3xl font-bold">
                                        {stat.value}
                                    </p>

                                    <p className="mt-2 text-sm font-semibold uppercase tracking-widest">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </section>
        </>

    );
}