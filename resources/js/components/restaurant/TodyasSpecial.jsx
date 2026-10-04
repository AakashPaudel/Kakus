import MenuCard from '@/components/restaurant/MenuCard';

export default function TodaysSpecialSection({ items }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                    Today's Special
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    Our Special Picks
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                    Enjoy some of our specially selected dishes today.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <MenuCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>
        </section>
    );
}