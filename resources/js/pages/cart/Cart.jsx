import { router } from '@inertiajs/react';

export default function Cart({ cart }) {
    const updateQuantity = (cartItem, quantity) => {
        router.patch(
            `/cart/items/${cartItem.id}`,
            {
                quantity,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const removeItem = (cartItem) => {
        router.delete(`/cart/items/${cartItem.id}`, {
            preserveScroll: true,
        });
    };

    const clearCart = () => {
        router.delete('/cart', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <div className="bg-black">
                <h1 className="text-3xl font-bold">Your Cart</h1>

                {!cart || cart.cartItems.length === 0 ? (
                    <p className="mt-4">Your cart is empty.</p>
                ) : (
                    <div className="mt-6 space-y-4">
                        {cart.cartItems.map((cartItem) => (
                            <div
                                key={cartItem.id}
                                className="rounded-lg border p-4"
                            >
                                <h2 className="text-xl font-semibold">
                                    {cartItem.menuItem.name}
                                </h2>

                                <p className="mt-1">
                                    Rs. {cartItem.unit_price}
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateQuantity(
                                                cartItem,
                                                cartItem.quantity - 1,
                                            )
                                        }
                                        disabled={cartItem.quantity <= 1}
                                        className="rounded border px-3 py-1"
                                    >
                                        −
                                    </button>

                                    <span className="font-semibold">
                                        {cartItem.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateQuantity(
                                                cartItem,
                                                cartItem.quantity + 1,
                                            )
                                        }
                                        className="rounded border px-3 py-1"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="mt-3 font-semibold">
                                    Subtotal: Rs. {cartItem.subtotal}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => removeItem(cartItem)}
                                    className="mt-3 rounded border px-3 py-1 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="border-t pt-4 text-xl font-bold">
                            Cart Subtotal: Rs. {cart.subtotal}
                        </div>

                        <button
                            type="button"
                            onClick={clearCart}
                            className="mt-4 rounded border px-4 py-2 text-sm"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
