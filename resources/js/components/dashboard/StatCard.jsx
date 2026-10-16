export default function StatCard({ title, value, description, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                        {title}
                    </p>

                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-2 text-xs leading-5 text-stone-500 dark:text-stone-400">
                            {description}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div className="shrink-0 rounded-xl bg-orange-50 p-3 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
                        <Icon size={21} />
                    </div>
                )}
            </div>
        </div>
    );
}
