
import { useState } from 'react';
import { Search, X, UtensilsCrossed } from 'lucide-react';

import CategoryFilter from '@/components/restaurant/CategoryFilter';
import MenuCard from '@/components/restaurant/MenuCard';

export default function Menu({ items = [], categories = [] }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const query = searchTerm.trim().toLowerCase();

    const filteredItems = items.filter((item) => {
        const matchesCategory =
            selectedCategory === null ||
            String(item.category_id) === String(selectedCategory);

        const matchesName = item.name
            ?.toLowerCase()
            .includes(query);

        const matchesCategoryName = item.category?.name
            ?.toLowerCase()
            .includes(query);

        return (
            matchesCategory &&
            (!query || matchesName || matchesCategoryName)
        );
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory(null);
    };

    const hasActiveFilters =
        searchTerm.trim() !== '' || selectedCategory !== null;

    return (

        <main className="min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">


                {/* Page heading */}
                <header className="mb-8 text-center sm:mb-10">
                    <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                        <UtensilsCrossed size={14} />
                        Freshly prepared
                    </span>

                    <h1 className="text-3xl font-bold text-stone-800 tracking-tight sm:text-4xl lg:text-5xl">
                        Explore Our{' '}
                        <span className="text-orange-600 dark:text-orange-400">
                            Menu
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-400 sm:text-base">
                        Discover your next favourite dish. Search by food
                        name or category to find exactly what you are craving.
                    </p>
                </header>

                {/* Search and filters */}
                <section
                    aria-label="Search and filter menu"
                    className="mb-10 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"
                >
                    <div className="mb-6">
                        <label
                            htmlFor="menu-search"
                            className="mb-2 block text-sm font-semibold text-stone-800"
                        >
                            Find your favourite dish
                        </label>

                        <div className="relative">
                            <Search
                                size={20}
                                aria-hidden="true"
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                            />

                            <input
                                id="menu-search"
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search food or category..."
                                className="w-full rounded-xl border border-stone-300 bg-stone-50 py-3.5 pl-12 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 "
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-200 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                                >
                                    <X size={17} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-stone-200 pt-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-stone-800">
                                    Browse by category
                                </h2>
                                <p className="mt-1 text-sm text-stone-500">
                                    Choose a category to narrow your results.
                                </p>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/40"
                                >
                                    <X size={15} />
                                    Clear filters
                                </button>
                            )}
                        </div>

                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                    </div>
                </section>

                {/* Results heading */}
                <section aria-live="polite" aria-atomic="true">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                                {hasActiveFilters
                                    ? 'Your search results'
                                    : 'Our delicious selection'}
                            </h2>

                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                {filteredItems.length}{' '}
                                {filteredItems.length === 1
                                    ? 'dish'
                                    : 'dishes'}{' '}
                                found
                            </p>
                        </div>
                    </div>

                    {filteredItems.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredItems.map((item) => (
                                <MenuCard
                                    key={item.id}
                                    item={item}
                                />
                            ))
                        }

                        </div>
                            
                    ) : (
                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-14 text-center dark:border-stone-700 dark:bg-stone-900">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
                                <Search size={25} />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold">
                                No dishes found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
                                We couldn't find any dishes matching your
                                current search and category. Try another
                                keyword or clear your filters.
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-6 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/30"
                                >
                                    Show all dishes
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>

    );
}
