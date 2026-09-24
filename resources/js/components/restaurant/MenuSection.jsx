import MenuCard from './MenuCard';

export default function MenuSection() {
    const menuItems = [
        {
            id: 1,
            name: 'Chicken Momo',
            description: 'Steamed chicken dumplings served with spicy chutney.',
            price: 250,
        },
        {
            id: 2,
            name: 'Chicken Pizza',
            description: 'Cheesy pizza topped with seasoned chicken.',
            price: 550,
        },
        {
            id: 3,
            name: 'Veg Chowmein',
            description: 'Stir-fried noodles with fresh vegetables.',
            price: 220,
        },
        {
            id: 4,
            name: 'Chicken Burger',
            description: 'Juicy chicken patty with fresh vegetables.',
            price: 350,
        },
    ];

    return (
        <section className="mt-10">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Our Menu</h2>

                <p className="mt-2 text-gray-600">
                    Choose something delicious.
                </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                    <MenuCard
                        key={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                    />
                ))}
            </div>
        </section>
    );
}
