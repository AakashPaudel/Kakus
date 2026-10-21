
import { Head, Link } from '@inertiajs/react';

export default function Show({ reservation }) {
    const formatDate = (date) => {
        if (!date) return '—';

        const value = String(date);
        const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? new Date(`${value}T00:00:00`)
            : new Date(value);

        if (Number.isNaN(parsedDate.getTime())) return value;

        return parsedDate.toLocaleDateString('en-NP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (time) => {
        if (!time) return '—';

        const match = String(time).match(/^(\d{1,2}):(\d{2})/);

        if (!match) return time;

        const hours = Number(match[1]);
        const minutes = match[2];
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12;

        return `${formattedHour}:${minutes} ${period}`;
    };

    const formatStatus = (status) => {
        if (!status) return 'Unknown';

        return status
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getStatusStyle = (status) => {
        const styles = {
            pending:
                'bg-amber-100 text-amber-800 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
            confirmed:
                'bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
            cancelled:
                'bg-red-100 text-red-800 ring-red-600/20 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/20',
            completed:
                'bg-stone-200 text-stone-700 ring-stone-500/20 dark:bg-stone-700/60 dark:text-stone-300 dark:ring-stone-400/20',
        };

        return (
            styles[status?.toLowerCase()] ??
            'bg-blue-100 text-blue-800 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20'
        );
    };

    const details = [
        {
            label: 'Reservation date',
            value: formatDate(reservation.reservation_date),
            icon: 'calendar',
        },
        {
            label: 'Reservation time',
            value: `${formatTime(reservation.start_time)} – ${formatTime(reservation.end_time)}`,
            icon: 'clock',
        },
        {
            label: 'Number of guests',
            value: `${reservation.guest_count ?? '—'} ${reservation.guest_count === 1 ? 'guest' : 'guests'}`,
            icon: 'users',
        },
        {
            label: 'Assigned table',
            value: reservation.restaurant_table?.table_number
                ? `Table ${reservation.restaurant_table.table_number}`
                : 'Not assigned',
            icon: 'table',
        },
    ];

    return (
        <>
            <Head title={`Reservation #${reservation.id}`} />

            <div className="mx-auto min-w-0 max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Breadcrumb */}
                <Link
                    href="/admin/reservations"
                    className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-stone-600 transition hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:text-stone-400 dark:hover:text-amber-400 dark:focus-visible:ring-offset-stone-950"
                >
                    <span aria-hidden="true">←</span>
                    Back to reservations
                </Link>

                {/* Page heading */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                            Reservation details
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-950 dark:text-stone-50 sm:text-3xl">
                            Reservation #{reservation.id}
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                            Review your booking information for Kaku's
                            Restaurant.
                        </p>
                    </div>

                    <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 ring-inset ${getStatusStyle(reservation.status)}`}
                    >
                        <span
                            className="h-2 w-2 rounded-full bg-current"
                            aria-hidden="true"
                        />
                        {formatStatus(reservation.status)}
                    </span>
                </header>

                {/* Reservation overview */}
                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
                    <div className="border-b border-stone-200 px-5 py-5 dark:border-stone-700 sm:px-6">
                        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                            Booking overview
                        </h2>

                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Your reservation at a glance.
                        </p>
                    </div>

                    <div className="grid gap-px bg-stone-200 sm:grid-cols-2 dark:bg-stone-700">
                        {details.map((detail) => (
                            <div
                                key={detail.label}
                                className="min-w-0 bg-white p-5 dark:bg-stone-900 sm:p-6"
                            >
                                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                    {detail.label}
                                </p>

                                <p className="mt-2 break-words text-base font-semibold text-stone-900 dark:text-stone-100">
                                    {detail.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Special requests */}
                <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
                    <div className="border-b border-stone-200 px-5 py-4 dark:border-stone-700 sm:px-6">
                        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                            Special requests
                        </h2>

                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Additional information for your visit.
                        </p>
                    </div>

                    <div className="p-5 sm:p-6">
                        {reservation.special_request?.trim() ? (
                            <p className="whitespace-pre-line break-words text-sm leading-7 text-stone-700 dark:text-stone-300">
                                {reservation.special_request}
                            </p>
                        ) : (
                            <p className="text-sm leading-6 text-stone-500 dark:text-stone-400">
                                No special requests were added to this
                                reservation.
                            </p>
                        )}
                    </div>
                </section>

                {/* Booking metadata */}
                <section className="rounded-2xl border border-stone-200 bg-stone-50/80 p-5 dark:border-stone-700 dark:bg-stone-900/60 sm:p-6">
                    <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        Booking information
                    </h2>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                                Reservation reference
                            </p>

                            <p className="mt-1 font-semibold text-stone-800 dark:text-stone-200">
                                #{reservation.id}
                            </p>
                        </div>

                        <div className="sm:text-right">
                            <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                                Created on
                            </p>

                            <p className="mt-1 text-sm font-medium text-stone-800 dark:text-stone-200">
                                {reservation.created_at
                                    ? new Date(
                                          reservation.created_at,
                                      ).toLocaleString('en-NP', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                      })
                                    : '—'}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
