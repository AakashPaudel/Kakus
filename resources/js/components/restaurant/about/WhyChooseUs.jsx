import { useState } from 'react';

const reasons = [
    {
        question: 'Why are your ingredients special?',
        answer:
            'We focus on fresh, carefully selected ingredients so that every dish has the quality and flavor our guests expect.',
    },
    {
        question: 'How do you maintain food quality?',
        answer:
            'Our dishes are prepared with attention to consistency, cleanliness, and careful preparation from the kitchen to your table.',
    },
    {
        question: "What makes dining at Kaku's different?",
        answer:
            "We combine thoughtfully prepared food with a welcoming atmosphere, making Kaku's a place to enjoy both the meal and the moment.",
    },
];

export default function WhyChooseUs() {
    const [openIndex, setOpenIndex] = useState(null);

    function toggle(index) {
        setOpenIndex(openIndex === index ? null : index);
    }

    return (
        <section className="py-20">
            <div className="mx-auto max-w-3xl px-4">

                <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                        Why Kaku's
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        Why Choose Us?
                    </h2>
                </div>

                <div className="divide-y divide-gray-200 border-y border-gray-200">
                    {reasons.map((reason, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={reason.question}>
                                <button
                                    type="button"
                                    onClick={() => toggle(index)}
                                    className="flex w-full items-center justify-between py-5 text-left"
                                >
                                    <span className="font-semibold text-gray-900">
                                        {reason.question}
                                    </span>

                                    <span
                                        className={`text-xl transition-transform duration-300 ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    >
                                        ↓
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="pb-5 pr-8 text-gray-600">
                                        {reason.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}