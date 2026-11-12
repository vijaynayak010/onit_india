import React from 'react';

const HowItWorksPage = () => {
    const steps = [
        {
            step: 'Step 1',
            title: 'Post your task',
            desc: 'Describe what you need done, add details like budget, skills required and preferred timeline.',
        },
        {
            step: 'Step 2',
            title: 'Get offers from task performers',
            desc: 'Review proposals, compare profiles, ratings and experience before shortlisting candidates.',
        },
        {
            step: 'Step 3',
            title: 'Chat and confirm',
            desc: 'Use the built-in chat to clarify requirements, share files and confirm the scope of work.',
        },
        {
            step: 'Step 4',
            title: 'Secure payment & completion',
            desc: 'Payment is handled safely on the platform and is released only when you are satisfied with the work.',
        },
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                    How On<span className="text-green-600">IT</span> Works
                </h1>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-8">
                    FirstDoer brings together people who need help and trusted task
                    performers in a single, simple workflow. Here&apos;s exactly what
                    happens from posting a task to getting it done.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    {steps.map((s, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-zinc-100 shadow-sm p-5 bg-white"
                        >
                            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 mb-1">
                                {s.step}
                            </div>
                            <h2 className="text-lg font-semibold mb-2">{s.title}</h2>
                            <p className="text-sm text-zinc-600 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-6 text-white">
                    <h2 className="text-xl font-bold mb-2">Ready to get started?</h2>
                    <p className="text-sm md:text-base mb-3">
                        Post your first task in minutes and connect with pre‑vetted task
                        performers in your city.
                    </p>
                    <button className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold text-sm px-4 py-2 rounded-full shadow-sm">
                        Post a task now
                        <span className="text-lg leading-none">↗</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;

