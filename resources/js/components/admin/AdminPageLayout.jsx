export default function AdminPageLayout({ children }) {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8">
                {children}
            </main>
        </div>
    );
}
