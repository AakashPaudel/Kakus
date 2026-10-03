import MenuCard from './MenuCard';

export default function MenuSection({ items }) {
    return (
        <section className="mt-10">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Our Menu</h2>

                <p className="mt-2 text-gray-600">
                    Choose something delicious.
                </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
           