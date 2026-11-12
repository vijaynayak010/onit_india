import React from 'react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                    About On<span className="text-green-600">IT</span>
                </h1>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-6">
                    FirstDoer is a hyperlocal platform that connects people who need help with
                    trusted task performers in their area. From academic research and web
                    design to everyday home services, we make it simple to post a task,
                    get offers, and hire the right expert.
                </p>

                <h2 className="text-xl md:text-2xl font-bold mt-8 mb-3">Our Mission</h2>
                <p className="text-zinc-600 leading-relaxed mb-4">
                    Our mission is to help people save time and unlock new income
                    opportunities by building the most reliable and transparent
                    hyperlocal marketplace in India. We believe great work can come from
                    anywhere, and our platform is designed to make collaboration safe,
                    fast, and frictionless.
                </p>

                <h2 className="text-xl md:text-2xl font-bold mt-8 mb-3">Why FirstDoer?</h2>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600">
                    <li><strong>Verified task performers</strong> with ratings and reviews.</li>
                    <li><strong>Secure payments</strong> released only when work is completed.</li>
                    <li><strong>Smart matching</strong> between your task and the right skills.</li>
                    <li><strong>Hyperlocal focus</strong> so you can hire people near you.</li>
                </ul>

                <h2 className="text-xl md:text-2xl font-bold mt-8 mb-3">Who we serve</h2>
                <p className="text-zinc-600 leading-relaxed mb-2">
                    FirstDoer is built for students, professionals, small businesses and
                    families who want work done quickly and reliably:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-600">
                    <li>Students looking for academic research assistance or project guidance.</li>
                    <li>Founders and small businesses needing design, marketing, or tech help.</li>
                    <li>Homeowners who want trusted help for repairs, cleaning, and more.</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;

