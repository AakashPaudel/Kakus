import { Link } from '@inertiajs/react';

const fallbackImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    'https://images.unsplash.com/photo-1547592180-85f173990554',
];

export default function DishGallery({ items }) {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                        From Our Kitchen
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                        A Taste of Kaku's
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Take a look at some of the dishes our kitchen prepares
                        with care and passion.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => {
                        const image = item.images?.[0]?.image_path
                            ? `/storage/${item.images[0].image_path}`
                            : fallbackImages[index % fallbackImages.length];

                        return (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-2xl"
                            >
                                <img
                                    src={image}
                                    alt={item.name}
                                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                                    <h3 className="text-xl font-semibold text-white">
                                        {item.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-white/80">
                                        Rs. {item.price}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/menu"
                        className="inline-flex rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                        Explore Our Menu
                    </Link>
                </div>

            </div>
        </section>
    );
}