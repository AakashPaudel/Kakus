
import { useState } from 'react';

const faqs = [
    {
        question: 'Can I make a reservation online?',
        answer:
            "Yes. You can easily reserve a table through our website by choosing your preferred date, time, number of guests, and available table.",
    },
    {
        question: 'Can I order food online?',
        answer:
            "Absolutely. Browse our menu, add your favorite dishes to the cart, and proceed to checkout to place your order.",
    },
    {
        question: 'Do you offer delivery?',
        answer:
            "Yes, we offer food delivery to selected areas. Delivery availability and charges may depend on your location.",
    },
    {
        question: 'Can I customize my order?',
        answer:
            "For selected dishes, you can include special requests or notes when placing your order. Our team will do their best to accommodate your preferences.",
    },
    {
        question: 'How can I contact Kaku’s Restaurant?',
        answer:
            "You can reach us through our contact page, where you can send us a message or find our restaurant contact information and location.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mb-12 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                        Frequently Asked Questions
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                        Everything You Need to Know
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-stone-600">
                        Have a question about reservations, ordering, or dining
                        at Kaku’s? Find your answer below.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-stone-50">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={faq.question}>
                                <button
                                    type="button"
                                    onClick={() => toggleFAQ(index)}
                                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-amber-50 sm:px-8"
                                >
                                    <span className="font-semibold text-stone-900">
                                        {faq.question}
                                    </span>

                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-medium text-amber-700 transition-transform duration-300 ${
                                            isOpen ? 'rotate-45' : ''
                                        }`}
                                    >
                                        +
                                    </span>
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ${
                                        isOpen
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-6 text-sm leading-7 text-stone-600 sm:px-8">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

