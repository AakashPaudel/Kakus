export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            La Maison
                        </h3>

                        <p className="mt-3 text-sm text-stone-400">
                            An elegant dining experience.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">
                            Opening Hours
                        </h3>

                        <p className="mt-3 text-sm">
                            Monday - Sunday: 10 AM - 10 PM
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">Contact</h3>

                        <p className="mt-3 text-sm">Kathmandu, Nepal</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
