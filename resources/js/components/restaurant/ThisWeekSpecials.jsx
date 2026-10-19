
import { Link } from '@inertiajs/react';

export default function ThisWeekSpecialsSection({
    specials = [],
    todayDate,
}) {
    const formatDay = (date) => {
        const [year, month, day] = date.split('-');

        return new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
        ).toLocaleDateString('en-US', {
            weekday: 'long',
        });
    };

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');

        return new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
        ).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <section
            className="bg-white py-16 sm:py-20 lg:py-24"
            aria-labelledby="weekly-specials-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mb-10 max-w-2xl sm:mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700 sm:text-sm">
                        <span aria-hidden="true">✦</span>
                        A New Flavor Every Day
                    </span>

                    <h2
                        id="weekly-specials-heading"
                        className="mt-5 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl lg:text-5xl"
                    >
                        This Week's Specials
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                        See what's cooking throughout the week.
                        Today's featured dish is highlighted so
                        you can find it easily.
                    </p>
                </div>

                {/* Weekly Schedule */}
                {specials.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {specials.map((special) => {
                            const isToday =
                                special.special_date === todayDate;

                            const item = special.menu_item;

                            return (
                                <article
                                    key={special.id}
                                    className={`
                                        flex min-w-0 flex-col overflow-hidden
                                        rounded-2xl border transition-all
                                        duration-300 hover:-translate-y-1
                                        hover:shadow-lg
                                        ${
                                            isToday
                                                ? 'border-amber-400 bg-amber-50 shadow-md ring-1 ring-amber-200'
                                                : 'border-stone-200 bg-white hover:border-amber-200'
                                        }
                                    `}
                                >
                                    {/* Date Header */}
                                    <div
                                        className={`
                                            flex items-center justify-between
                                            gap-3 border-b px-4 py-4
                                            ${
                                                isToday
                                                    ? 'border-amber-200 bg-amber-100'
                                                    : 'border-stone-100 bg-stone-50'
                                            }
                                        `}
                                    >
                                        <div>
                                            <p
                                                className={`text-sm font-bold ${
                                                    isToday
                                                        ? 'text-amber-950'
                                                        : 'text-stone-800'
                                                }`}
                                            >
                                                {formatDay(
                                                    special.special_date,
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-stone-500">
                                                {formatDate(
                                                    special.special_date,
                                                )}
                                            </p>
                                        </div>

                                        {isToday && (
                                            <span className="rounded-full bg-amber-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                Today
                                            </span>
                                        )}
                                    </div>

                                    {/* Dish Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                                        {item?.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-stone-500">
                                                Image coming soon
                                            </div>
                                        )}
                                    </div>

                                    {/* Dish Details */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="text-lg font-bold text-stone-950">
                                            {item?.name ??
                                                'Special dish'}
                                        </h3>

                                        {item?.description && (
                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-5">
                                            <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                                                {item?.price != null ? (
                                                    <p className="text-lg font-extrabold text-amber-900">
                                                        Rs.{' '}
                                                        {Number(
                                                            item.price,
                                                        ).toLocaleString(
                                                            'en-NP',
                                                        )}
                                                    </p>
                                                ) : (
                                                    <span />
                                                )}

                                                {item?.id && (
                                                    <Link
                                                        href={`/menu/${item.id}`}
                                                        className="text-sm font-semibold text-amber-800 underline-offset-4 transition hover:text-amber-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
                                                    >
                                                        View dish →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center">
                        <p className="text-lg font-semibold text-stone-800">
                            No specials have been scheduled yet.
                        </p>

                        <p className="mt-2 text-sm text-stone-500">
                            Please check back soon for our weekly
                            selection.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
