
import { ArrowUpRight } from 'lucide-react';

export default function MetricCard({
    title,
    value,
    note,
    icon: Icon,
    change,
    trend,
}) {
    const positive = trend === 'up';

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                        {title}
                    </p>
                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {value}
                    </p>
                </div>

                <span className="rounded-xl bg-amber-50 p-3 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                    <Icon size={21} aria-hidden="true" />
                </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {change != null && (
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                            positive
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                        }`}
                    >
                        <ArrowUpRight
                            size={13}
                            className={positive ? '' : 'rotate-90'}
                            aria-hidden="true"
                        />
                        {change}
                    </span>
                )}

                <span className="text-xs text-slate-500 dark:text-zinc-400">
                    {note}
                </span>
            </div>
        </article>
    );
}
