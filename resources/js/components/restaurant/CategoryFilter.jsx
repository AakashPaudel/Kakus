
export default function CategoryFilter({
    categories = [],
    selectedCategory,
    onCategoryChange,
}) {
    return (
        <section className="mt-8 flex flex-col items-center justify-center gap-4">
            {/* <h1 className="mb-4 text-4xl font-semibold text-stone-900 dark:text-stone-100">
                Explore Our Menu
            </h1>
            <p className="mb-6 max-w-2xl text-center text-lg text-stone-600 dark:text-stone-300">
                Experience a symphony of flavors with our carefully curated menu. Each dish is designed to delight your senses and leave.
            </p> */}

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => onCategoryChange(null)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                        selectedCategory === null
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-stone-100 text-stone-700 hover:bg-orange-100 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700'
                    }`}
                >
                    All Items
                </button>

                {categories.map((category) => {
                    const isSelected =
                        String(selectedCategory) === String(category.id);

                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => onCategoryChange(category.id)}
                            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                                isSelected
                                    ? 'bg-orange-600 text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-700 hover:bg-orange-100 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700'
                            }`}
                        >
                            {category.name}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
