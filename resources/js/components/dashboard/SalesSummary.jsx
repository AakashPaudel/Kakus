
export default function SalesSummary({ sales = {} }) {
    const metrics = [
        {
            label: "Today's Sales",
            value: sales.today ?? 0,
        },
        {
            label: 'This Week',
            value: sales.week ?? 0,
        },
        {
            label: 'This Month',
            value: sales.month ?? 0,
        },
    ];

    return (
        <section className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-stone-900">
                    Sales Summary
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    A quick overview of restaurant sales.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-lg bg-stone-50 p-4"
                    >
                        <p className="text-sm text-stone-500">
                            {metric.label}
                        </p>

                        <p className="mt-2 text-2xl font-bold text-stone-900">
                            Rs. {Number(metric.value).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
