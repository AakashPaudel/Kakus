import WhyChooseUs from "../components/restaurant/about/WhyChooseUs";
export default function About({ featuredItem }) {
    const stats = [
        {
            value: '1,000+',
            label: 'Happy Customers',
        },
        {
            value: '4.8',
            label: 'Average Rating',
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
        <>
            <section className="py-20">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                        About Kaku's
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
                        Good food, good people, good moments.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                        Kaku's is built around the simple idea that great food should
                        bring people together. From carefully prepared dishes to a
                        welcoming dining experience, every detail matters.
                    </p>
                </div>
            </section>
            <section className="py-16">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2">

                    <div className="overflow-hidden rounded-2xl">
                        <img
                            src={
                                featuredItem?.images?.[0]?.image_path ??
                                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
                            }
                            alt={featuredItem?.name ?? "Kaku's dish"}
                            className="h-full min-h-[400px] w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-center">
                        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                            From Our Kitchen
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            {featuredItem?.name}
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            {featuredItem?.description}
                        </p>

                        <p className="mt-6 text-xl font-bold text-gray-900">
                            Rs. {featuredItem?.price}
                        </p>
                    </div>

                </div>
            </section>
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <WhyChooseUs />
        </>

    )
}   
