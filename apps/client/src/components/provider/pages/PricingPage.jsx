import React from 'react';

const PricingPage = () => {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                    Pricing &amp; Fees
                </h1>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-8">
                    FirstDoer is designed to be transparent and fair for both task posters and
                    task performers. Below is a simple overview of how pricing and fees
                    work on the platform.
                </p>

                <div className="grid gap-6 md:grid-cols-2 mb-10">
                    <div className="rounded-2xl border border-zinc-100 shadow-sm p-5">
                        <h2 className="text-xl font-medium mb-2">For task posters</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                            Posting a task on FirstDoer is typically free. You only pay when you
                            accept an offer and the work is completed.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
                            <li>No or low posting fees (configurable by your business).</li>
                            <li>Clear visibility of total cost before confirming.</li>
                            <li>Secure online payment with digital records.</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 shadow-sm p-5">
                        <h2 className="text-xl font-medium mb-2">For task performers</h2>
                        <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                            Task performers earn money for each completed task. A small
                            service fee may be charged per transaction to keep the platform
                            running.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
                            <li>Transparent service fee per completed task.</li>
                            <li>Payouts to your preferred payment method.</li>
                            <li>Downloadable history for tax and invoicing.</li>
                        </ul>
                    </div>
                </div>

                <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-5">
                    <h2 className="text-lg md:text-xl font-medium mb-2">
                        Secure payment flow
                    </h2>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-zinc-600">
                        <li>You agree on a price with the task performer.</li>
                        <li>The payment is authorized and held securely.</li>
                        <li>The task performer completes the work.</li>
                        <li>You review the work and approve completion.</li>
                        <li>Funds are released to the task performer minus fees.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;

