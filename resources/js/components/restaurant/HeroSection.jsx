
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkOpeningHours = () => {
            const now = new Date();
            const hour = now.getHours();

            setIsOpen(hour >= 10 && hour < 22);
        };

        checkOpeningHours();

        const interval = setInterval(checkOpeningHours, 60000);

        return () => clearInterval(interval);
    }, []);



    return (
        <>
            {/* Hero Section */}
            <section className="overflow-hidden bg-stone-900">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                    <div className="grid min-h-[500px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Left Side — Hero Content */}
                        <div className="flex flex-col items-start">
                            {/* Eyebrow */}
                            <div
                                className="
        mb-6 inline-flex max-w-full items-center gap-3
        animate-[heroReveal_0.7s_ease-out_both]
    "
                            >
                                {/* Opening status indicator */}
                                <span className="relative flex h-2.5 w-2.5 shrink-0">
                                    <span
                                        className={`
                absolute inline-flex h-full w-full rounded-full opacity-75
                ${isOpen ? 'animate-ping bg-green-400' : ''}
            `}
                                    />

                                    <span
                                        className={`
                relative inline-flex h-2.5 w-2.5 rounded-full
                ${isOpen ? 'bg-green-400' : 'bg-amber-400'}
            `}
                                    />
                                </span>

                                {/* Status label */}
                                <p
                                    className="
            min-w-0 text-xs font-bold uppercase
            tracking-[0.16em] text-amber-300
            sm:text-sm sm:tracking-[0.2em]
        "
                                    aria-live="polite"
                                >
                                    {isOpen ? "Open Now, kitchen closes at 10 PM" : "Currently Closed — See You Soon"}
                                </p>

                                {/* Decorative divider */}
                                {/* <span
                                    className="hidden h-px w-8 shrink-0 bg-amber-100/70 sm:block"
                                    aria-hidden="true"
                                /> */}
                            </div>

                            {/* Main Heading */}
                            <h1
                                className="
                                    max-w-3xl text-5xl font-extrabold
                                    leading-[1.02] tracking-[-0.045em]
                                    text-white
                                    sm:text-6xl lg:text-6xl xl:text-7xl
                                    motion-safe:animate-[heroReveal_0.8s_ease-out_0.12s_both]
                                "
                            >
                                Good food.

                                <span className="mt-2 block text-amber-300">
                                    Great moments.
                                </span>
                            </h1>

                            {/* Description */}
                            <p
                                className="
                                    mt-7 max-w-xl text-base leading-8
                                    text-stone-300 sm:text-lg
                                    motion-safe:animate-[heroReveal_0.8s_ease-out_0.24s_both]
                                "
                            >
                                From fresh ingredients to unforgettable
                                flavors, discover dishes made with care and
                                served to bring people together.
                            </p>

                            {/* Call to Actions */}
                            <div
                                className="
                                    mt-9 flex w-full flex-col gap-3
                                    sm:w-auto sm:flex-row sm:items-center
                                    motion-safe:animate-[heroReveal_0.8s_ease-out_0.36s_both]
                                "
                            >
                                <Link
                                    href="/menu"
                                    className="restaurant-accent-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold sm:text-base"
                                >
                                    Explore Our Menu
                                    <span aria-hidden="true">→</span>
                                </Link>

                                <Link
                                    href="/reservations/create"
                                    className="restaurant-secondary-button inline-flex min-h-12 items-center justify-center rounded-xl border-stone-600 bg-transparent px-7 py-3.5 text-sm font-semibold text-white hover:bg-stone-800 hover:text-amber-300 sm:text-base"
                                >
                                    Reserve a Table
                                </Link>
                            </div>

                            {/* Small Trust Indicator */}
                            <div
                                className="
                                    mt-9 flex items-center gap-3
                                    border-t border-amber-700/30 pt-5
                                    motion-safe:animate-[heroReveal_0.8s_ease-out_0.48s_both]
                                "
                            >
                                

                                <div>
                                    <p className="text-sm font-semibold text-stone-600">
                                        Made with care, served with love
                                    </p>

                                    <p className="mt-1 text-xs text-stone-600 sm:text-sm">
                                        Fresh ingredients. Memorable meals.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side — Food Gallery */}
                        <div className="relative mx-auto w-full max-w-2xl px-2 py-12 sm:px-4">
                            {/* Ambient Glow */}
                            <div
                                aria-hidden="true"
                                className="
                                    absolute left-1/2 top-1/2
                                    h-72 w-72 -translate-x-1/2
                                    -translate-y-1/2 rounded-full
                                    bg-amber-300/40 blur-3xl
                                    motion-safe:animate-[ambientGlow_6s_ease-in-out_infinite]
                                "
                            />

                            {/* Floating Food Gallery */}
                            <div className="relative flex items-center justify-center gap-3 sm:gap-5">
                                {/* Left Image */}
                                <div
                                    className="
                                        w-[27%] shrink-0
                                        motion-safe:animate-[foodReveal_1s_ease-out_both]
                                    "
                                >
                                    <div
                                        className="
                                            overflow-hidden rounded-2xl
                                            rotate-[-7deg]
                                            shadow-xl shadow-amber-900/10
                                            transition-all duration-500
                                            hover:scale-110 hover:rotate-0
                                            hover:shadow-2xl
                                            motion-safe:animate-[foodLeft_5s_ease-in-out_infinite]
                                        "
                                    >
                                        <img
                                            src="/storage/menu-items/chicken-burger.jpg"
                                            alt="Freshly prepared chicken burger"
                                            className="
                                                aspect-[3/4] w-full object-cover
                                                transition-transform duration-700
                                                hover:scale-110
                                            "
                                        />
                                    </div>
                                </div>

                                {/* Center Image */}
                                <div
                                    className="
                                        relative z-[1] w-[42%] shrink-0
                                        overflow-hidden rounded-3xl
                                        border-4 border-white bg-amber-100
                                        shadow-2xl shadow-amber-900/20
                                        transition-all duration-500
                                        hover:z-10 hover:scale-105
                                        hover:shadow-amber-900/30
                                        motion-safe:animate-[foodCenter_5s_ease-in-out_infinite]
                                    "
                                >
                                    <img
                                        src="/storage/menu-items/four-cheese-pizza.jpg"
                                        alt="Kaku's signature four-cheese pizza"
                                        className="
                                            aspect-[3/4] w-full object-cover
                                            transition-transform duration-700
                                            hover:scale-110
                                        "
                                    />

                                    {/* Image Caption */}
                                    <div
                                        className="
                                            absolute inset-x-0 bottom-0
                                            bg-gradient-to-t
                                            from-stone-950/80 to-transparent
                                            px-2 pb-3 pt-10 text-center
                                            sm:px-4 sm:pb-5
                                        "
                                    >
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
                                    className="
                                        w-[27%] shrink-0 rotate-[7deg]
                                        overflow-hidden rounded-2xl
                                        shadow-xl shadow-amber-900/10
                                        transition-all duration-500
                                        hover:z-10 hover:scale-110
                                        hover:rotate-0 hover:shadow-2xl
                                        motion-safe:animate-[foodRight_5s_ease-in-out_infinite]
                                    "
                                >
                                    <img
                                        src="/storage/menu-items/chicken-momo.jpg"
                                        alt="Delicious chicken momo"
                                        className="
                                            aspect-[3/4] w-full object-cover
                                            transition-transform duration-700
                                            hover:scale-110
                                        "
                                    />
                                </div>
                            </div>

                            {/* Bottom Label */}
                            <div
                                className="
                                    relative mt-8 text-center
                                    motion-safe:animate-[foodReveal_1s_ease-out_0.6s_both]
                                "
                            >
                                <p className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
                                    A Taste Worth Sharing
                                </p>

                                <p className="mt-2 text-sm text-stone-600">
                                    Fresh ingredients. Unforgettable flavors.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="border-t border-stone-800 bg-stone-950 py-12 sm:py-14">
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
                                <p className="text-3xl font-extrabold tracking-tight text-amber-300 sm:text-4xl">
                                    {stat.value}
                                </p>

                                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-300 sm:text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom Animation Keyframes */}
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

                @keyframes foodReveal {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes foodLeft {
                    0%,
                    100% {
                        transform: translateY(0) rotate(-7deg);
                    }

                    50% {
                        transform: translateY(-8px) rotate(-4deg);
                    }
                }

                @keyframes foodCenter {
                    0%,
                    100% {
                        transform: translateY(0) scale(1);
                    }

                    50% {
                        transform: translateY(-6px) scale(1.012);
                    }
                }

                @keyframes foodRight {
                    0%,
                    100% {
                        transform: translateY(0) rotate(7deg);
                    }

                    50% {
                        transform: translateY(-8px) rotate(4deg);
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
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>
        </>
    );
}
