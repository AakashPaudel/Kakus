
import { Head, Link } from '@inertiajs/react';
import reservations from '@/routes/reservations';
import customerReservations from '@/routes/customer/reservations';

function formatDate(date) {
    if (!date) return 'Not specified';

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatTime(time) {
    if (!time) return 'Not specified';

    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

function getStatusStyles(status) {
    const styles = {
        confirmed:
            'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-400/20',
        cancelled:
            'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-400/20',
        completed:
            'bg-stone-100 text-stone-700 ring-stone-500/20 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-400/20',
        pending:
            'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-400/20',
    };

    return styles[status] ?? styles.pending;
}

function Detail({ label, value, icon }) {
    return (
        <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {icon}
            </div>

            <div className="min-w-0 pt-0.5">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {label}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-stone-900 sm:text-base dark:text-stone-100">
                    {value}
                </p>
            </div>
        </div>
    );
}

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <rect x="3.5" y="5" width="17" height="15" rx="2" />
            <path
                strokeLinecap="round"
                d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="8.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
        </svg>
    );
}

function GuestsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle cx="9" cy="8" r="3" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19zM16 5.5a3 3 0 0 1 0 5.8M17 13h.5a3.5 3.5 0 0 1 3.5 3.5V19h-4"
            />
        </svg>
    );
}

function TableIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <rect x="4" y="5" width="16" height="7" rx="1.5" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 12v7M17 12v7M4 8.5h16"
            />
        </svg>
    );
}

export default function Show({ reservation }) {
    const status = String(reservation.status ?? 'pending').toLowerCase();

    const canEdit = !['cancelled', 'completed'].includes(status);

    const guestCount = Number(reservation.guest_count);
    const guestLabel = `${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`;

    const tableNumber = reservation.restaurant_table?.table_number;

    return (
        <>
            <Head title={`Reservation #${reservation.id}`} />

            <div className="restaurant-shell min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Back navigation */}
                    <Link
                        href={customerReservations.index.url()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m15 18-6-6 6-6M9 12h11"
                            />
                        </svg>
                        My reservations
                    </Link>

                    {/* Page heading */}
                    <header className="mt-7 flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
                                Reservation details
                            </p>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
                                Your table booking
                            </h1>

                            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                                Booking reference{' '}
                                <span className="font-semibold text-stone-800 dark:text-stone-200">
                                    #{reservation.id}
                                </span>
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold capitalize ring-1 ring-inset ${getStatusStyles(status)}`}
                        >
                            <span className="h-2 w-2 rounded-full bg-current" />
                            {status}
                        </span>
                    </header>

                    {/* Reservation summary */}
                    <main className="mt-7 space-y-6">
                        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
                            <div className="border-b border-stone-200 px-5 py-5 sm:px-7 dark:border-stone-800">
                                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                                    Booking summary
                                </h2>
                                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                    Here are the details of your reservation.
                                </p>
                            </div>

                            <div className="grid gap-x-8 gap-y-7 p-5 sm:grid-cols-2 sm:p-7">
                                <Detail
                                    label="Reservation date"
                                    value={formatDate(reservation.reservation_date)}
                                    icon={<CalendarIcon />}
                                />

                                <Detail
                                    label="Reservation time"
                                    value={`${formatTime(reservation.start_time)} – ${formatTime(reservation.end_time)}`}
                                    icon={<ClockIcon />}
                                />

                                <Detail
                                    label="Number of guests"
                                    value={guestLabel}
                                    icon={<GuestsIcon />}
                                />

                                <Detail
                                    label="Your table"
                                    value={
                                        tableNumber != null
                                            ? `Table ${tableNumber}`
                                            : 'Not assigned'
                                    }
                                    icon={<TableIcon />}
                                />
                            </div>
                        </section>

                        {/* Special request */}
                        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7 dark:border-stone-800 dark:bg-stone-900">
                            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                                Special requests
                            </h2>

                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                Any additional notes included with your booking.
                            </p>

                            {reservation.special_request ? (
                                <div className="mt-4 rounded-xl bg-stone-50 p-4 text-sm leading-6 whitespace-pre-wrap text-stone-700 dark:bg-stone-800/70 dark:text-stone-300">
                                    {reservation.special_request}
                                </div>
                            ) : (
                                <p className="mt-4 rounded-xl border border-dashed border-stone-300 px-4 py-5 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
                                    No special requests were added to this reservation.
                                </p>
                            )}
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
                            <p className="text-xs leading-5 text-stone-500 dark:text-stone-400">
                                Need to make a change? Review your booking details
                                before updating your reservation.
                            </p>

                            {canEdit && (
                                <Link
                                    href={reservations.edit.url(reservation)}
                                    className="restaurant-accent-button inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold"
                                >
                                    Edit reservation
                                </Link>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
