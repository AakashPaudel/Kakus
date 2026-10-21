
import { Link } from '@inertiajs/react';
import ReservationStatusSelect from '@/components/restaurant/ReservationStatus';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

export default function Index({ reservations }) {
    const reservationList = Array.isArray(reservations)
        ? reservations
        : reservations?.data ?? [];

    const totalReservations =
        reservations?.total ?? reservationList.length;

    const formatDate = (date) => {
        if (!date) return '—';

        // Avoid UTC shifting when the database returns YYYY-MM-DD.
        const dateString = String(date);
        const localDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
            ? new Date(`${dateString}T00:00:00`)
            : new Date(dateString);

        if (Number.isNaN(localDate.getTime())) return dateString;

        return localDate.toLocaleDateString('en-NP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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

    return (
        <AdminPageLayout>
            <div className="min-w-0 space-y-6">
            {/* Page heading */}
            <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-stone-700 dark:bg-stone-900">
                <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                        Administration
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
                        Reservations
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">
                        Review table bookings and manage reservation
                        statuses from one place.
                    </p>
                </div>

                <div className="flex w-fit items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-950">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <rect
                                x="3.75"
                                y="5.5"
                                width="16.5"
                                height="15"
                                rx="2"
                            />
                            <path
                                strokeLinecap="round"
                                d="M8 3.75v3.5M16 3.75v3.5M3.75 10h16.5"
                            />
                        </svg>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                            Total reservations
                        </p>
                        <p className="text-xl font-bold tabular-nums text-stone-950 dark:text-stone-50">
                            {totalReservations}
                        </p>
                    </div>
                </div>
                </header>
            </section>

            {/* Reservations table */}
            <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
                <div className="border-b border-stone-200 px-5 py-4 dark:border-stone-700 sm:px-6">
                    <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                        All reservations
                    </h2>

                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        Booking details, current status, and available actions.
                    </p>
                </div>

                {reservationList.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-7 w-7"
                                aria-hidden="true"
                            >
                                <rect
                                    x="3.75"
                                    y="5.5"
                                    width="16.5"
                                    height="15"
                                    rx="2"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 3.75v3.5M16 3.75v3.5M3.75 10h16.5m-11 4h7m-7 3h4"
                                />
                            </svg>
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-stone-900 dark:text-stone-100">
                            No reservations yet
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
                            Reservations will appear here when customers
                            book a table.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead className="bg-stone-50 dark:bg-stone-800/70">
                                <tr>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                    >
                                        Reservation
                                    </th>

                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                    >
                                        Reservation date
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                    >
                                        Status
                                    </th>

                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                    >
                                        Update status
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 sm:px-6"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                {reservationList.map((reservation) => (
                                    <tr
                                        key={reservation.id}
                                        className="transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40"
                                    >
                                        <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">
                                                #{reservation.id}
                                            </p>

                                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                                Kaku's Restaurant
                                            </p>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-700 dark:text-stone-300 sm:px-6">
                                            {formatDate(
                                                reservation.reservation_date,
                                            )}
                                        </td>

                                        <td className="px-5 py-4 sm:px-6">
                                            <span
                                                className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(reservation.status)}`}
                                            >
                                                {formatStatus(
                                                    reservation.status,
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 sm:px-6">
                                            <div className="w-44">
                                                <ReservationStatusSelect
                                                    reservation={reservation}
                                                />
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-right sm:px-6">
                                            <Link
                                                href={`/reservations/${reservation.id}`}
                                                className="inline-flex items-center gap-1 rounded-md text-sm font-semibold text-amber-800 transition hover:text-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:text-amber-400 dark:hover:text-amber-300 dark:focus-visible:ring-offset-stone-900"
                                            >
                                                View details
                                                <span aria-hidden="true">
                                                    →
                                                </span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination summary for Laravel paginated results */}
                {reservationList.length > 0 &&
                    reservations?.total != null && (
                        <div className="border-t border-stone-200 bg-stone-50/70 px-5 py-4 dark:border-stone-700 dark:bg-stone-800/40 sm:px-6">
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                                Showing{' '}
                                <span className="font-semibold text-stone-900 dark:text-stone-100">
                                    {reservations.from ?? 1}
                                </span>{' '}
                                to{' '}
                                <span className="font-semibold text-stone-900 dark:text-stone-100">
                                    {reservations.to ?? reservationList.length}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-stone-900 dark:text-stone-100">
                                    {reservations.total}
                                </span>{' '}
                                reservations
                            </p>
                        </div>
                    )}
            </section>
            </div>
        </AdminPageLayout>
    );
}
