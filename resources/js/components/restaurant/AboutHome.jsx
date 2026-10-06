
import { Link } from '@inertiajs/react';

export default function AboutSection() {
    return (
        <section className="bg-amber-50 py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    
                    {/* Images */}
                    <div className="relative mx-auto w-full max-w-md">
                        {/* Top Image */}
                        <div className="w-[78%] overflow-hidden rounded-3xl shadow-lg">
                            <img
                                src="/storage/menu-items/chicken-pizza.jpg"
                                alt="Freshly prepared dish at Kaku's"
                                className="h-72 w-full object-cover transition duration-700 hover:scale-105 sm:h-80"
                            />
                        </div>

                        {/* Bottom Image */}
                        <div className="ml-auto mt-[-70px] w-[78%] overflow-hidden rounded-3xl border-8 border-amber-50 shadow-xl">
                            <img
                                src="/storage/menu-items/chicken-momo.jpg"
                                alt="Delicious food served at Kaku's"
                                className="h-72 w-full object-cover transition duration-700 hover:scale-105 sm:h-80"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                            About Kaku's
                        </p>

                        <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                            Good Food,
                            <span className="block text-amber-600">
                                Great Moments.
                            </span>
                        </h2>

                        <p className="mt-6 text-base leading-8 text-stone-600">
                            At Kaku's, we believe that great food is more than
                            just a meal. It is about bringing people together,
                            sharing stories, and creating moments worth
                            remembering.
                        </p>

                        <p className="mt-4 text-base leading-8 text-stone-600">
                            From carefully selected ingredients to dishes
                            prepared with passion, every plate we serve
                            reflects our commitment to quality, flavor, and
                            genuine hospitality.
                        </p>

                        {/* Link */}
                        <Link
                            href="/about"
                            className="group mt-8 inline-flex items-center gap-2 border-b-2 border-amber-500 pb-1 text-sm font-semibold text-stone-900 transition hover:border-amber-700 hover:text-amber-700"
                        >
                            Discover Our Story
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

