
import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';

export default function Cart({ cart }) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const checkoutForm = useForm({
        fulfillment_type: 'delivery',
        street_address: '',
        city: '',
        postal_code: '',
        delivery_notes: '',
    });

    const updateQuantity = (cartItem, quantity) => {
        router.patch(
            `/cart/items/${cartItem.id}`,
            { quantity },
            { preserveScroll: true },
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

    const openCheckout = () => {
        checkoutForm.clearErrors();
        setIsCheckoutOpen(true);
    };

    const closeCheckout = () => {
        if (checkoutForm.processing) return;

        setIsCheckoutOpen(false);
    };

    const submitOrder = (event) => {
        event.preventDefault();

        checkoutForm.post('/orders', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCheckoutOpen(false);
            },
        });
    };

    const fulfillmentOptions = [
        {
            value: 'delivery',
            title: 'Delivery',
            description: 'Get your food delivered to your address.',
            icon: '🚚',
        },
        {
            value: 'pickup',
            title: 'Pickup',
            description: 'Collect your order from our restaurant.',
            icon: '🛍️',
        },
        {
            value: 'dine_in',
            title: 'Dine-in',
            description: 'Enjoy your meal at our restaurant.',
            icon: '🍽️',
        },
    ];

    const isDelivery = checkoutForm.data.fulfillment_type === 'delivery';
    const cartItems = cart?.cartItems ?? [];
    const isCartEmpty = cartItems.length === 0;

    const inputClass =
        'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100';

    const errorClass = 'mt-1 text-sm text-red-600';

    return (
        <>
            <section className="min-h-screen bg-amber-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-10">
                        <p className="text-sm font-semibold tracking-widest text-amber-700 uppercase">
                            Your order
                        </p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900">
                            Your Cart
                        </h1>

                        <p className="mt-2 text-stone-600">
                            Review your selected dishes before placing your
                            order.
                        </p>
                    </div>

                    {isCartEmpty ? (
                        <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-stone-200">
                            <div className="mx-auto max-w-md">
                                <div className="mb-4 text-5xl">🛒</div>

                                <h2 className="text-2xl font-bold text-stone-900">
                                    Your cart is empty
                                </h2>

                                <p className="mt-3 text-stone-600">
                                    Looks like you haven't added any delicious
                                    dishes yet.
                                </p>

                                <Link
                                    href="/menu"
                                    className="mt-6 inline-block rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
                                >
                                    Explore Menu
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                            {/* Cart Items */}
                            <div className="space-y-4">
                                {cartItems.map((cartItem) => (
                                    <article
                                        key={cartItem.id}
                                        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
                                    >
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                            {/* Item Information */}
                                            <div>
                                                <h2 className="text-xl font-semibold text-stone-900">
                                                    {cartItem.menuItem.name}
                                                </h2>

                                                <p className="mt-1 text-sm text-stone-500">
                                                    Rs. {cartItem.unit_price}{' '}
                                                    per item
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            cartItem,
                                                            cartItem.quantity -
                                                                1,
                                                        )
                                                    }
                                                    disabled={
                                                        cartItem.quantity <= 1
                                                    }
                                                    aria-label={`Decrease quantity of ${cartItem.menuItem.name}`}
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
                                                            cartItem.quantity +
                                                                1,
                                                        )
                                                    }
                                                    aria-label={`Increase quantity of ${cartItem.menuItem.name}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-lg text-white transition hover:bg-amber-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Footer */}
                                        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                                            <p className="font-semibold text-stone-900">
                                                Rs. {cartItem.subtotal}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(cartItem)
                                                }
                                                className="text-sm font-medium text-red-600 transition hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 lg:sticky lg:top-24">
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
                                    onClick={openCheckout}
                                    className="mt-6 w-full rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    href="/menu"
                                    className="mt-4 block text-center text-sm font-semibold text-stone-600 transition hover:text-stone-900"
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
                            </aside>
                        </div>
                    )}
                </div>
            </section>

            {/* Checkout Modal */}
            {isCheckoutOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-stone-950/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeCheckout();
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="checkout-title"
                        className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-stone-100 px-6 py-5 sm:px-8">
                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-amber-700 uppercase">
                                    Almost there
                                </p>

                                <h2
                                    id="checkout-title"
                                    className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl"
                                >
                                    Complete Your Order
                                </h2>

                                <p className="mt-2 text-sm text-stone-500">
                                    Choose how you'd like to enjoy your meal.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeCheckout}
                                disabled={checkoutForm.processing}
                                aria-label="Close checkout"
                                className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-50"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={submitOrder}>
                            <div className="max-h-[65vh] space-y-7 overflow-y-auto px-6 py-6 sm:px-8">
                                {/* Fulfillment Type */}
                                <div>
                                    <h3 className="font-semibold text-stone-900">
                                        How would you like your order?
                                    </h3>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                        {fulfillmentOptions.map((option) => {
                                            const selected =
                                                checkoutForm.data
                                                    .fulfillment_type ===
                                                option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() =>
                                                        checkoutForm.setData(
                                                            'fulfillment_type',
                                                            option.value,
                                                        )
                                                    }
                                                    aria-pressed={selected}
                                                    className={`rounded-2xl border p-4 text-left transition ${
                                                        selected
                                                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                                                            : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50'
                                                    }`}
                                                >
                                                    <span className="text-2xl">
                                                        {option.icon}
                                                    </span>

                                                    <span className="mt-3 block font-semibold text-stone-900">
                                                        {option.title}
                                                    </span>

                                                    <span className="mt-1 block text-xs leading-5 text-stone-500">
                                                        {option.description}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {checkoutForm.errors.fulfillment_type && (
                                        <p className={errorClass}>
                                            {
                                                checkoutForm.errors
                                                    .fulfillment_type
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Delivery Address */}
                                {isDelivery && (
                                    <div className="space-y-5 rounded-2xl bg-stone-50 p-5 sm:p-6">
                                        <div>
                                            <h3 className="font-semibold text-stone-900">
                                                Delivery Address
                                            </h3>

                                            <p className="mt-1 text-sm text-stone-500">
                                                Where should we deliver your
                                                order?
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="street_address"
                                                className="text-sm font-medium text-stone-700"
                                            >
                                                Street address *
                                            </label>

                                            <input
                                                id="street_address"
                                                type="text"
                                                autoComplete="street-address"
                                                value={
                                                    checkoutForm.data
                                                        .street_address
                                                }
                                                onChange={(event) =>
                                                    checkoutForm.setData(
                                                        'street_address',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="House number, street, or area"
                                                required
                                                maxLength={255}
                                                className={inputClass}
                                            />

                                            {checkoutForm.errors
                                                .street_address && (
                                                <p className={errorClass}>
                                                    {
                                                        checkoutForm.errors
                                                            .street_address
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="city"
                                                    className="text-sm font-medium text-stone-700"
                                                >
                                                    City *
                                                </label>

                                                <input
                                                    id="city"
                                                    type="text"
                                                    autoComplete="address-level2"
                                                    value={
                                                        checkoutForm.data.city
                                                    }
                                                    onChange={(event) =>
                                                        checkoutForm.setData(
                                                            'city',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Your city"
                                                    required
                                                    maxLength={100}
                                                    className={inputClass}
                                                />

                                                {checkoutForm.errors.city && (
                                                    <p className={errorClass}>
                                                        {
                                                            checkoutForm.errors
                                                                .city
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="postal_code"
                                                    className="text-sm font-medium text-stone-700"
                                                >
                                                    Postal code *
                                                </label>

                                                <input
                                                    id="postal_code"
                                                    type="text"
                                                    autoComplete="postal-code"
                                                    value={
                                                        checkoutForm.data
                                                            .postal_code
                                                    }
                                                    onChange={(event) =>
                                                        checkoutForm.setData(
                                                            'postal_code',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Postal code"
                                                    required
                                                    maxLength={20}
                                                    className={inputClass}
                                                />

                                                {checkoutForm.errors
                                                    .postal_code && (
                                                    <p className={errorClass}>
                                                        {
                                                            checkoutForm.errors
                                                                .postal_code
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="delivery_notes"
                                                className="text-sm font-medium text-stone-700"
                                            >
                                                Delivery instructions
                                                <span className="font-normal text-stone-400">
                                                    {' '}
                                                    (optional)
                                                </span>
                                            </label>

                                            <textarea
                                                id="delivery_notes"
                                                rows={3}
                                                maxLength={1000}
                                                value={
                                                    checkoutForm.data
                                                        .delivery_notes
                                                }
                                                onChange={(event) =>
                                                    checkoutForm.setData(
                                                        'delivery_notes',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Nearby landmark, directions, or other instructions"
                                                className={inputClass}
                                            />

                                            {checkoutForm.errors
                                                .delivery_notes && (
                                                <p className={errorClass}>
                                                    {
                                                        checkoutForm.errors
                                                            .delivery_notes
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Order Review */}
                                <div className="rounded-2xl border border-stone-200 p-5">
                                    <h3 className="font-semibold text-stone-900">
                                        Order Review
                                    </h3>

                                    <div className="mt-4 space-y-3">
                                        {cartItems.map((cartItem) => (
                                            <div
                                                key={cartItem.id}
                                                className="flex items-start justify-between gap-4 text-sm"
                                            >
                                                <span className="text-stone-600">
                                                    {cartItem.menuItem.name}{' '}
                                                    <span className="text-stone-400">
                                                        × {cartItem.quantity}
                                                    </span>
                                                </span>

                                                <span className="shrink-0 font-medium text-stone-900">
                                                    Rs. {cartItem.subtotal}
                                                </span>
                                            </div>
                                        ))}

                                        <div className="flex justify-between border-t border-stone-100 pt-3 font-bold text-stone-900">
                                            <span>Subtotal</span>
                                            <span>Rs. {cart.subtotal}</span>
                                        </div>

                                        <p className="text-xs leading-5 text-stone-500">
                                            Final pricing is calculated securely
                                            by the restaurant when your order is
                                            submitted.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex flex-col-reverse gap-3 border-t border-stone-100 bg-stone-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                                <button
                                    type="button"
                                    onClick={closeCheckout}
                                    disabled={checkoutForm.processing}
                                    className="rounded-xl border border-stone-300 px-5 py-3 font-semibold text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        checkoutForm.processing || isCartEmpty
                                    }
                                    className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {checkoutForm.processing
                                        ? 'Placing Order...'
                                        : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
