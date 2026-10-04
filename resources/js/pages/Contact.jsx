import { useForm } from '@inertiajs/react';

export default function ContactSection() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    function submit(event) {
        event.preventDefault();

        post('/contact', {
            onSuccess: () => reset(),
        });
    }

    return (
        <section className="bg-stone-100 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Contact Us
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        We'd Love to Hear From You
                    </h2>

                    <p className="mt-4 leading-7 text-gray-600">
                        Have a question, suggestion, or simply want to say hello?
                        Send us a message and our team will get back to you.
                    </p>
                </div>

                {/* Main content */}
                <div className="grid overflow-hidden rounded-3xl bg-white shadow-sm lg:grid-cols-5">

                    {/* Contact information */}
                    <div className="bg-gray-900 p-8 text-white sm:p-10 lg:col-span-2">
                        <h3 className="text-2xl font-semibold">
                            Let's talk
                        </h3>

                        <p className="mt-3 leading-7 text-gray-300">
                            We're here to help with reservations, menu questions,
                            feedback, or anything else you'd like to ask.
                        </p>

                        <div className="mt-10 space-y-7">

                            <div>
                                <p className="text-sm text-gray-400">
                                    Visit us
                                </p>

                                <p className="mt-1 font-medium">
                                    Kathmandu, Nepal
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">
                                    Call us
                                </p>

                                <p className="mt-1 font-medium">
                                    +977 9847317336
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">
                                    Email us
                                </p>

                                <p className="mt-1 font-medium">
                                    paudelaakash777@gmail.com
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">
                                    Opening hours
                                </p>

                                <p className="mt-1 font-medium">
                                    10:00 AM – 10:00 PM
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Contact form */}
                    <div className="p-8 sm:p-10 lg:col-span-3">

                        <form onSubmit={submit} className="space-y-6">

                            {/* Name + Email */}
                            <div className="grid gap-6 sm:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Your name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        placeholder="John Doe"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />

                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(event) =>
                                            setData('email', event.target.value)
                                        }
                                        placeholder="john@example.com"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    />

                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* Subject */}
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Subject
                                </label>

                                <input
                                    id="subject"
                                    type="text"
                                    value={data.subject}
                                    onChange={(event) =>
                                        setData('subject', event.target.value)
                                    }
                                    placeholder="How can we help?"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />

                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    rows="6"
                                    value={data.message}
                                    onChange={(event) =>
                                        setData('message', event.target.value)
                                    }
                                    placeholder="Write your message..."
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />

                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {processing
                                    ? 'Sending...'
                                    : 'Send Message'}
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}