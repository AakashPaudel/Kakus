import { Link } from '@inertiajs/react';

export default function HeroSection() {
    const stats = [
        {
            value: '1,000+',
            label: 'Happy Customers',
        },
        {
            value: '4.8',
            label: 'Rating',
        },
        {
            value: '50+',
            label: 'Customer Reviews',
        },
        {
            value: '30+',
            label: 'Menu Varieties',
        },
    ];

    return (
        <section className="overflow-hidden bg-amber-600">
            {/* Hero */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                <div className="grid min-h-[500px] items-center gap-12 lg:grid-cols-2 lg:gap-16">

                    {/* Left side */}
                    <div>
                        {/* Eyebrow */}
                        <p
                            className="
                                mb-5
                                text-sm font-bold uppercase tracking-[0.2em]
                                text-stone-900
                                motion-safe:animate-[heroReveal_0.7s_ease-out_both]
                            "
                        >
                            Welcome to Kaku's
                        </p>

                        {/* Main heading */}
                        <h1
                            className="
                                max-w-2xl
                                text-4xl font-extrabold leading-[1.05]
                                tracking-tight text-stone-950
                                sm:text-5xl
                                lg:text-6xl
                                xl:text-7xl
                                motion-safe:animate-[heroReveal_0.8s_ease-out_0.12s_both]
                            "
                        >
                            Good food,
                            <span className="mt-2 block">
                                great moments.
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className="
                                mt-6 max-w-xl
                                text-base leading-7 text-stone-800
                                sm:text-lg sm:leading-8
                                motion-safe:animate-[heroReveal_0.8s_ease-out_0.24s_both]
                            "
                        >
                            Discover delicious meals prepared with fresh ingredients
                            and served with care.
                        </p>

                        {/* CTAs */}
                        <div
                            className="
                                mt-8 flex flex-wrap gap-3
                                motion-safe:animate-[heroReveal_0.8s_ease-out_0.36s_both]
                            "
                        >
                            <Link
                                href="/menu"
                                className="
                                    rounded-xl bg-stone-950 px-6 py-3.5
                                    font-semibold text-white
                                    shadow-lg shadow-amber-900/20
                                    transition-all duration-300
                                    hover:scale-105 hover:bg-stone-900
                                    hover:shadow-xl
                                    focus:outline-none focus:ring-2
                                    focus:ring-stone-950 focus:ring-offset-2
                                    focus:ring-offset-amber-600
                                "
                            >
                                Explore Menu
                            </Link>

                            <Link
                                href="/reservations/create"
                                className="
                                    rounded-xl border border-stone-300
                                    bg-white px-6 py-3.5
                                    font-semibold text-stone-800
                                    shadow-sm
                                    transition-all duration-300
                                    hover:scale-105
                                    hover:bg-stone-50
                                    hover:shadow-lg
                                    focus:outline-none focus:ring-2
                                    focus:ring-white focus:ring-offset-2
                                    focus:ring-offset-amber-600
                                "
                            >
                                Reserve a Table
                            </Link>
                        </div>
                    </div>

                    {/* Right side */}

                    <div className="relative mx-auto w-full max-w-2xl px-2 py-12 sm:px-4">

                        {/* Ambient Glow */}
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 h-72 w-72
            -translate-x-1/2 -translate-y-1/2 rounded-full
            bg-orange-300/40 blur-3xl
            motion-safe:animate-[ambientGlow_6s_ease-in-out_infinite]"
                        />

                        {/* Floating Food Gallery */}
                        <div className="relative flex items-center justify-center gap-3 sm:gap-5">

                    
                            {/* Left Image */}
                            <div
                                className="w-[27%] shrink-0
        motion-safe:animate-[foodReveal_1s_ease-out_both]"
                            >
                                <div
                                    className="overflow-hidden rounded-2xl
            rotate-[-7deg] shadow-xl shadow-amber-900/10
            transition-all duration-500
            hover:scale-110 hover:rotate-0 hover:shadow-2xl
            motion-safe:animate-[foodLeft_5s_ease-in-out_infinite]"
                                >
                                    <img
                                        src="/storage/menu-items/chicken-burger.jpg"
                                        alt="Freshly prepared pizza"
                                        className="aspect-[3/4] w-full object-cover
                transition-transform duration-700 hover:scale-110"
                                    />
                                </div>
                            </div>
                            

                            {/* Center Image */}
                            <div
                                className="relative z-[1] w-[42%] shrink-0
                overflow-hidden rounded-3xl border-4 border-white
                bg-amber-100 shadow-2xl shadow-amber-900/20
                transition-all duration-500
                hover:z-10 hover:scale-105 hover:shadow-amber-900/30
                motion-safe:animate-[foodCenter_5s_ease-in-out_infinite]
                motion-safe:animate-[foodReveal_1s_ease-out_0.2s_both]"
                            >
                                <img
                                    src="/storage/menu-items/four-cheese-pizza.jpg"
                                    alt="Kaku's signature four-cheese pizza"
                                    className="aspect-[3/4] w-full object-cover
                    transition-transform duration-700 hover:scale-110"
                                />

                                {/* Image Caption */}
                                <div className="absolute inset-x-0 bottom-0
                bg-gradient-to-t from-stone-950/80 to-transparent
                px-2 pb-3 pt-10 text-center sm:px-4 sm:pb-5">
                                    <p className="text-xs font-bold text-white sm:text-base">
                                        Chef's Special
                                    </p>
                                    <p className="mt-1 text-[10px] text-white/80 sm:text-xs">
                                        Freshly prepared
                                    </p>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div
                                className="w-[27%] shrink-0 rotate-[7deg]
                overflow-hidden rounded-2xl shadow-xl
                shadow-amber-900/10 transition-all duration-500
                hover:z-10 hover:scale-110 hover:rotate-0
                hover:shadow-2xl
                motion-safe:animate-[foodRight_5s_ease-in-out_infinite]
                motion-safe:animate-[foodReveal_1s_ease-out_0.4s_both]"
                            >
                                <img
                                    src="/storage/menu-items/chicken-momo.jpg"
                                    alt="Delicious cheese pizza"
                                    className="aspect-[3/4] w-full object-cover
                    transition-transform duration-700 hover:scale-110"
                                />
                            </div>

                        </div>

                        {/* Bottom Label */}
                        <div className="relative mt-8 text-center
        motion-safe:animate-[foodReveal_1s_ease-out_0.6s_both]">
                            <p className="text-lg font-bold tracking-tight text-stone-800 sm:text-xl">
                                A Taste Worth Sharing
                            </p>
                            <p className="mt-2 text-sm text-stone-600">
                                Fresh ingredients. Unforgettable flavors.
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            {/* Stats */}
            <section className="border-t border-amber-500/40 bg-amber-700/30 py-12 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-amber-500/40">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="
                                    text-center
                                    transition-transform duration-300
                                    hover:-translate-y-1
                                "
                            >
                                <p className="text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">
                                    {stat.value}
                                </p>

                                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-800 sm:text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom animation keyframes */}
            <style>{`
                @keyframes heroReveal {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes foodBreathing {
                    0%,
                    100% {
                        transform: translateY(0) scale(1);
                    }

                    50% {
                        transform: translateY(-6px) scale(1.012);
                    }
                }

                @keyframes ambientGlow {
                    0%,
                    100% {
                        opacity: 0.45;
                        transform: translate(-50%, -50%) scale(0.95);
                    }

                    50% {
                        opacity: 0.7;
                        transform: translate(-50%, -50%) scale(1.08);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </section>
    );
}