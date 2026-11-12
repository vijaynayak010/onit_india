import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryLandingPage = () => {
    const { categorySlug } = useParams();
    const categoryName = categorySlug
        ? categorySlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
        : 'Tasks';

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                    {categoryName} on FirstDoer
                </h1>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-6">
                    Find experienced task performers for {categoryName.toLowerCase()}.
                    Post your requirements, receive offers and collaborate securely on
                    FirstDoer.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-2">Examples of {categoryName.toLowerCase()}</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600 mb-6">
                    <li>Short description of one typical task in this category.</li>
                    <li>Another example to show the range of work you can post.</li>
                    <li>Optional specialized or advanced tasks for professionals.</li>
                </ul>

                <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-6 text-white">
                    <h2 className="text-lg md:text-xl font-bold mb-2">
                        Ready to post a {categoryName.toLowerCase()} task?
                    </h2>
                    <p className="text-sm md:text-base mb-3">
                        Share a few details about what you need and we&apos;ll help you
                        connect with the right task performers.
                    </p>
                    <button className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold text-sm px-4 py-2 rounded-full shadow-sm">
                        Post {categoryName.toLowerCase()} task
                        <span className="text-lg leading-none">↗</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryLandingPage;

