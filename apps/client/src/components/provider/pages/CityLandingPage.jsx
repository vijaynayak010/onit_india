import React from 'react';
import { useParams } from 'react-router-dom';

const CityLandingPage = () => {
    const { citySlug } = useParams();
    const cityName = citySlug
        ? citySlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
        : 'Your City';

    const popularCategories = ['Academic research', 'Web design', 'Home cleaning', 'Repairs', 'Tutoring'];

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                    Hire trusted task performers in {cityName}
                </h1>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-6">
                    OnIT helps you get things done locally. Post your task, compare
                    offers and hire verified task performers in {cityName}.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-3">Popular categories in {cityName}</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                    {popularCategories.map((c) => (
                        <span
                            key={c}
                            className="inline-flex items-center px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-700"
                        >
                            {c}
                        </span>
                    ))}
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                    <h2 className="text-lg md:text-xl font-bold mb-2">
                        Why people in {cityName} use OnIT
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
                        <li>Find nearby experts who understand your local context.</li>
                        <li>Post any task in minutes from your phone or laptop.</li>
                        <li>Compare profiles, reviews and prices before hiring.</li>
                        <li>Secure payments and support from the OnIT team.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CityLandingPage;

