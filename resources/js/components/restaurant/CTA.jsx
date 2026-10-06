
import { Link } from '@inertiajs/react';

export default function ContactCTA() {
    return (
        <section className="bg-amber-50 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-full bg-stone-900 px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20 lg:px-20">
                    {/* Decorative shapes */}
                    <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl" />
                    <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

                    <div className="relative mx-auto max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">
                            Come Dine With Us
                        </p>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Hungry? Visit Kaku's Today!
                        </h2>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
                            Whether you're craving a quick bite, a delicious
                            family meal, or something special, Kaku's is here
                            to make every visit memorable. Come enjoy great
                            food, warm hospitality, and moments worth sharing.
                        </p>

                        {/* Actions */}
                        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/contact"
                                className="inline-flex w-full items-center justify-center rounded-full bg-amber-600 px-7 py-3.5 text-sm font-semibold text-stone-950 transition duration-300 hover:bg-amber-700 sm:w-auto"
                            >
                                Get in Touch
                            </Link>

                            <Link
                                href="/reservations/create"
                                className="inline-flex w-full items-center justify-center rounded-full border border-stone-600 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:border-amber-500 hover:text-amber-600 sm:w-auto"
                            >
                                Make a Reservation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

