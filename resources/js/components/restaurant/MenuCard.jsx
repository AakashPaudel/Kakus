
import { router } from '@inertiajs/react';

export default function MenuCard({ item }) {
    function addToCart() {
        router.post('/cart/items', {
            menu_item_id: item.id,
            quantity: 1,
        });
    }

    return (


        <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Image */}
            <div className="relative overflow-hidden">
                {item.images?.[0]?.image_path ? (
                    <img
                        src={`/storage/${item.images[0].image_path}`}
                        alt={item.name}
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-56 w-full items-center justify-center bg-amber-50 text-sm text-stone-400">
                        No image available
                    </div>
                )}

                {/* Availability */}
                {!item.is_available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-800">
                            Currently Unavailable
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            ```jsx
            <div className="flex min-h-[190px] flex-col p-5">
                <h2 className="text-xl font-bold text-stone-900 transition group-hover:text-amber-700">
                    {item.name}
                </h2>

                {item.description ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
                        {item.description}
                    </p>
                ) : (
                    <div className="mt-2 h-[72px]" />
                )}

                {/* Price + Add to Cart */}
                <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                    <p className="text-lg font-bold text-amber-700">
                        Rs. {item.price}
                    </p>

                    <button
                        type="button"
                        onClick={addToCart}
                        disabled={!item.is_available}
                        className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-stone-300"
                    >
                        {item.is_available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>
            </div>
            ```

        </div>


    );
}