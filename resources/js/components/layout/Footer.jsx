
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="grid gap-10 md:grid-cols-3">
                    {/* Restaurant */}
                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            Kaku's
                        </h3>

                        <p className="mt-4 max-w-sm text-sm leading-7 text-stone-400">
                            A place where great food, warm hospitality, and
                            memorable moments come together. We look forward
                            to welcoming you.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white">
                            Quick Links
                        </h3>

                        <nav className="mt-4 flex flex-col gap-3 text-sm">
                            <Link
                                href="/"
                                className="w-fit transition hover:text-amber-400"
                            >
                                Home
                            </Link>

                            <Link
                                href="/menu"
                                className="w-fit transition hover:text-amber-400"
                            >
                                Menu
                            </Link>

                            <Link
                                href="/about"
                                className="w-fit transition hover:text-amber-400"
                            >
                                About Us
                            </Link>

                            <Link
                                href="/contact"
                                className="w-fit transition hover:text-amber-400"
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="font-semibold text-white">
                            Contact Us
                        </h3>

                        <div className="mt-4 space-y-3 text-sm">
                            <p>
                                <span className="font-medium text-stone-200">
                                    Email:
                                </span>{' '}
                                paudelaakash777@gmail.com
                            </p>

                            <p>
                                <span className="font-medium text-stone-200">
                                    Phone:
                                </span>{' '}
                                +977 9847317336
                            </p>

                            <p>
                                <span className="font-medium text-stone-200">
                                    Address:
                                </span>{' '}
                                Kathmandu, Nepal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="mt-12 flex flex-col gap-5 border-t border-stone-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-stone-500">
                        © {new Date().getFullYear()} Kaku's. All rights
                        reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium transition hover:text-amber-400"
                        >
                            Instagram
                        </a>

                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium transition hover:text-amber-400"
                        >
                            Facebook
                        </a>

                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium transition hover:text-amber-400"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
