
export default function StatCard({
    title,
    value,
    description,
}) {
    return (
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-stone-500">
                {title}
            </p>

            <h3 className="mt-3 text-3xl font-bold text-stone-900">
                {value}
            </h3>

            <p className="mt-2 text-sm text-stone-500">
                {description}
            </p>
        </div>
    );
}
