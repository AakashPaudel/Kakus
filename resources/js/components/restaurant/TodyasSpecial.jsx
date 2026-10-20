
import { Link } from '@inertiajs/react';

export default function TodaysSpecialSection({ special = [] }) {
    if (!special || special.length === 0) {
        return (
            <section
                className="bg-amber-50 py-16 sm:py-20"
                aria-labelledby="todays-special-heading"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-amber-100 bg-white px-6 py-14 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-800">
                            Today's Special
                        </p>

                        <h2
                            id="todays-special-heading"
                            className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl"
                        >
                            Something delicious is coming
                        </h2>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-600 sm:text-base">
                            We're preparing our next special dish.
                            Please explore our menu while you wait.
                        </p>

                        <Link
                            href="/menu"
                            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
                        >
                            Explore Our Menu
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    const item = special?.menu_item
        ?? special?.menuItem
        ?? special;

    const imageUrl = item?.image_url;

    return (
        <section
            className="overflow-hidden bg-amber-50 py-16 sm:py-20 lg:py-24"
            aria-labelledby="todays-special-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <div className="mb-10 max-w-2xl sm:mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-900 sm:text-sm">
                        <span aria-hidden="true">✦</span>
                        Today's Special
                    </span>

                    <h2
                        id="todays-special-heading"
                        className="mt-5 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl lg:text-5xl"
                    >
                        Today's Featured Flavor
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                        Handpicked for today. Prepared with care.
                        Made to be remembered.
                    </p>
                </div>

                {/* Featured Dish */}
                <div className="grid overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm lg:grid-cols-2 lg:shadow-lg">
                    {/* Dish Image */}
                    <div className="relative min-h-64 overflow-hidden bg-stone-200 sm:min-h-80 lg:min-h-[480px]">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={item.name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full min-h-64 items-center justify-center bg-amber-100 text-amber-900 sm:min-h-80 lg:min-h-[480px]">
                                <span className="text-sm font-medium">
                                    Dish image coming soon
                                </span>
                            </div>
                        )}

                        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-900 shadow-sm sm:left-6 sm:top-6">
                            Chef's Special
                        </div>
                    </div>

                    {/* Dish Information */}
                    <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
                            Selected for today
                        </p>

                        <h3 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-stone-950 sm:text-4xl">
                            {item.name}
                        </h3>

                        {item.description && (
                            <p className="mt-5 text-sm leading-7 text-stone-600 sm:text-base">
                                {item.description}
                            </p>
                        )}

                        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-6">
                            {item.price != null && (
                                <div>
                                    <p className="text-xs font-medium text-stone-500">
                                        Today's price
                                    </p>

                                    <p className="mt-1 text-2xl font-extrabold text-amber-900 sm:text-3xl">
                                        Rs.{' '}
                                        {Number(item.price).toLocaleString(
                                            'en-NP',
                                        )}
                                    </p>
                                </div>
                            )}

                            {item.id && (
                                <Link
                                    href={`/menu/${item.id}`}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
                                >
                                    Discover This Dish
                                    <span aria-hidden="true">→</span>
                                </Link>
                            )}
                        </div>

                        <p className="mt-6 text-xs leading-6 text-stone-500">
                            Available as part of our scheduled daily
                            specials, while supplies last.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
