
import { Link } from '@inertiajs/react';

export default function ThisWeekSpecialsSection({
    specials = [], special_date,
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
            className="restaurant-shell py-16 sm:py-20 lg:py-24"
            aria-labelledby="weekly-specials-heading"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mb-10 max-w-2xl sm:mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700 sm:text-sm">
                        {/* <span aria-hidden="true">✦</span> */}
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
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                        {specials.map((special) => {
                            const isToday = special.special_date === special_date;
                            const item = special.menu_item;

                            return (
                                <article
                                    key={special.id}
                                    className={`
                        flex w-64 shrink-0 snap-start flex-col
                        rounded-xl border p-5 transition-colors
                        sm:w-72
                        ${isToday
                                            ? 'border-amber-400 bg-[var(--restaurant-accent-soft)]'
                                            : 'border-stone-200 bg-white hover:border-amber-300'
                                        }
                    `}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-stone-500">
                                                {formatDay(special.special_date)}
                                            </p>

                                            <p className="mt-1 text-xs text-stone-400">
                                                {formatDate(special.special_date)}
                                            </p>
                                        </div>

                                        {isToday && (
                                            <span className="rounded-full bg-amber-800 px-2.5 py-1 text-xs font-semibold text-white">
                                                Today
                                            </span>
                                        )}
                                    </div>

                                    <div className="my-4 border-t border-stone-200" />

                                    <h3 className="text-base font-bold leading-snug text-stone-900">
                                        {item?.name ?? 'Special dish'}
                                    </h3>

                                    {item?.description && (
                                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-stone-600">
                                            {item.description}
                                        </p>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="py-8 text-center text-stone-500">
                        No upcoming specials available.
                    </p>
                )}
                
            </div>
        </section>
    );
}
