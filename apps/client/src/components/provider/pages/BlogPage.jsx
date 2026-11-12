import React from 'react';

const articles = [
    {
        title: 'How to write the perfect task description',
        slug: 'write-the-perfect-task-description',
        excerpt:
            'Clear, detailed task descriptions attract better offers and help task performers deliver exactly what you need.',
    },
    {
        title: 'Tips for hiring a web designer on FirstDoer',
        slug: 'tips-for-hiring-a-web-designer',
        excerpt:
            'From portfolios to timelines, here is what to look for before you assign your next web design project.',
    },
    {
        title: 'Getting academic research help the right way',
        slug: 'getting-academic-research-help',
        excerpt:
            'Learn how to collaborate ethically with research assistants while staying aligned with your institution’s rules.',
    },
];

const BlogPage = () => {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                    FirstDoer Learning Hub
                </h1>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-8">
                    Guides and resources to help you get more done—whether you are
                    posting tasks or completing them as a performer.
                </p>

                <div className="grid gap-5 md:grid-cols-3">
                    {articles.map((article) => (
                        <article
                            key={article.slug}
                            className="rounded-2xl border border-zinc-100 shadow-sm p-4 flex flex-col bg-white"
                        >
                            <h2 className="text-base md:text-lg font-semibold mb-2">
                                {article.title}
                            </h2>
                            <p className="text-sm text-zinc-600 leading-relaxed mb-3 flex-1">
                                {article.excerpt}
                            </p>
                            <button className="text-xs font-semibold text-green-600 hover:text-green-700 inline-flex items-center gap-1">
                                Read more
                                <span className="text-sm leading-none">↗</span>
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;

