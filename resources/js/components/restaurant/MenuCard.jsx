
import { router } from '@inertiajs/react';

export default function MenuCard({ item }) 
{
    function addToCart() {
        router.post('/cart/items', {
            menu_item_id: item.id,
            quantity: 1,
        });
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-600">
                {item.name}
            </h2>

            <p className="mt-2 text-gray-600">
                {item.description}
            </p>

            <p className="mt-4 text-lg font-bold text-gray-600">
                Rs. {item.price}
            </p>

            <button
                type="button"
                onClick={addToCart}
                className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white transition hover:bg-gray-700"
            >
                Add to cart
            </button>
        </div>
    );
}