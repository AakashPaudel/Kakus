
export default function SalesSummary({ sales }) {
    const metrics = [
        {
            label: 'Total Sales',
            value: sales?.totalSales ?? 0,
        },
        {
            label: 'Today',
            value: sales?.todaySales ?? 0,
        },
        {
            label: 'This Month',
            value: sales?.monthlySales ?? 0,
        },
    ];

    return (
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">

            {/* Section heading */}
            <div className="border-b border-stone-100 p-5 sm:p-6 dark:border-stone-800">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Sales Summary
                </h2>

                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                    A quick overview of your restaurant's sales performance.
                </p>
            </div>

            {/* Sales metrics */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
                {metrics.map((metric, index) => (
                    <div
                        key={metric.label}
                        className="rounded-xl border border-stone-100 bg-stone-50/80 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/50 sm:p-5 dark:border-stone-800 dark:bg-stone-800/50 dark:hover:border-orange-900 dark:hover:bg-orange-950/20"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                {metric.label}
                            </p>

                            <span
                                className={`h-2 w-2 shrink-0 rounded-full ${
                                    index === 0
                                        ? 'bg-orange-500'
                                        : index === 1
                                            ? 'bg-emerald-500'
                                            : 'bg-amber-500'
                                }`}
                            />
                        </div>

                        <p className="mt-3 break-words text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
                            Rs. {Number(metric.value).toLocaleString('en-IN')}
                        </p>

                        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                            {index === 0
                                ? 'Overall recorded sales'
                                : index === 1
                                    ? "Today's recorded sales"
                                    : 'Recorded sales this month'}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
