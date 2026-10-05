import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

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

            <section className="bg-amber-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-10">
                        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                            Your order
                        </p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900">
                            Your Cart
                        </h1>

                        <p className="mt-2 text-stone-600">
                            Review your selected dishes before placing your order.
                        </p>
                    </div>

                    {!cart || cart.cartItems.length === 0 ? (
                        <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-stone-200">
                            <div className="mx-auto max-w-md">
                                <h2 className="text-2xl font-bold text-stone-900">
                                    Your cart is empty
                                </h2>

                                <p className="mt-3 text-stone-600">
                                    Looks like you haven't added any delicious dishes yet.
                                </p>

                                <Link
                                    href="/menu"
                                    className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
                                >
                                    Explore Menu
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                            {/* Cart Items */}
                            <div className="space-y-4">
                                {cart.cartItems.map((cartItem) => (
                                    <div
                                        key={cartItem.id}
                                        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
                                    >
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                            {/* Item information */}
                                            <div>
                                                <h2 className="text-xl font-semibold text-stone-900">
                                                    {cartItem.menuItem.name}
                                                </h2>

                                                <p className="mt-1 text-sm text-stone-500">
                                                    Rs. {cartItem.unit_price} per item
                                                </p>
                                            </div>

                                            {/* Quantity controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            cartItem,
                                                            cartItem.quantity - 1,
                                                        )
                                                    }
                                                    disabled={cartItem.quantity <= 1}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-lg text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    −
                                                </button>

                                                <span className="w-6 text-center font-semibold text-stone-900">
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
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-lg text-white transition hover:bg-amber-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item footer */}
                                        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                                            <p className="font-semibold text-stone-900">
                                                Rs. {cartItem.subtotal}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(cartItem)}
                                                className="text-sm font-medium text-red-600 transition hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 lg:sticky lg:top-24">
                                <h2 className="text-xl font-bold text-stone-900">
                                    Order Summary
                                </h2>

                                <div className="mt-6 space-y-4">
                                    <div className="flex justify-between text-stone-600">
                                        <span>Subtotal</span>
                                        <span>Rs. {cart.subtotal}</span>
                                    </div>

                                    <div className="flex justify-between text-stone-600">
                                        <span>Delivery</span>
                                        <span>Rs. 0</span>
                                    </div>

                                    <div className="border-t border-stone-200 pt-4">
                                        <div className="flex justify-between text-lg font-bold text-stone-900">
                                            <span>Total</span>
                                            <span>Rs. {cart.subtotal}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => router.post('/orders')}
                                    className="mt-6 w-full rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    href="/menu"
                                    className="mt-3 block text-center text-sm font-semibold text-stone-600 transition hover:text-stone-900"
                                >
                                    Continue Shopping
                                </Link>

                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="mt-6 w-full border-t border-stone-100 pt-4 text-sm font-medium text-red-600 transition hover:text-red-700"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

        </>
    );
}
