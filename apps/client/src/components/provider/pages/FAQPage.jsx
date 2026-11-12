import React from 'react';

const FAQPage = () => {
    const faqs = [
        {
            q: 'What is FirstDoer?',
            a: 'FirstDoer is a hyperlocal marketplace that connects people who need tasks done with trusted task performers nearby. You can post tasks, receive offers and complete work securely on the platform.',
        },
        {
            q: 'Is it free to post a task?',
            a: 'Posting a task is generally free. You only pay once you hire a task performer and the work is completed, according to the pricing settings configured for the platform.',
        },
        {
            q: 'How are task performers vetted?',
            a: 'Task performers can build trust through profile information, verified IDs (if enabled), completed tasks, and ratings and reviews from other users.',
        },
        {
            q: 'How does payment work?',
            a: 'Payments are handled securely through the platform. Funds are only released to the task performer after you confirm that the task is completed satisfactorily.',
        },
        {
            q: 'Can I become a task performer?',
            a: 'Yes. You can apply to become a task performer, set up your profile, list your skills and start receiving relevant task opportunities in your area.',
        },
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-8">
                    Find quick answers to the most common questions about using FirstDoer as
                    both a task poster and a task performer.
                </p>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-zinc-100 bg-white shadow-sm p-4"
                        >
                            <h2 className="text-sm md:text-base font-medium mb-1">
                                {item.q}
                            </h2>
                            <p className="text-sm text-zinc-600 leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;

