import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import CategoryCrossLinks from "../../components/landing/CategoryCrossLinks";
import { getTaskCategoryBySlug, taskCategories, getUniqueExamples } from "../../data/taskCategories";

const TaskCategoryDetailPage = () => {
  const { categorySlug } = useParams();
  const category = getTaskCategoryBySlug(categorySlug);

  if (!category) {
    return <Navigate to="/tasks" replace />;
  }

  const Icon = category.icon;
  const canonical = `https://www.firstdoer.com/tasks/${category.id}`;
  const uniqueExamples = getUniqueExamples(category);
  const keywords = [
    "FirstDoer",
    "onitindia",
    "task marketplace India",
    category.title.toLowerCase(),
    ...uniqueExamples.slice(0, 4),
    "post task",
    "task execution platform",
  ].join(", ");

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title={`${category.title} Tasks | Get ${category.title} Done on FirstDoer`}
        description={`${category.description} Post ${category.title.toLowerCase()} tasks on FirstDoer and get matched with vetted performers. Task marketplace India.`}
        keywords={keywords}
        canonical={canonical}
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `${category.title} Tasks | FirstDoer`,
          "description": category.description,
          "url": canonical,
        }}
      />

      {/* Breadcrumb — high contrast, clear path */}
      <nav
        className="border-b border-gray-200 bg-white"
        aria-label="Breadcrumb"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-20 py-4">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:text-[0.9375rem]">
            <li>
              <Link
                to="/"
                className="font-semibold text-gray-900 underline-offset-2 hover:text-[var(--color-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:rounded"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-500 select-none font-medium" aria-hidden="true">
              /
            </li>
            <li>
              <Link
                to="/tasks"
                className="font-semibold text-gray-900 underline-offset-2 hover:text-[var(--color-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:rounded"
              >
                Tasks
              </Link>
            </li>
            <li className="text-gray-500 select-none font-medium" aria-hidden="true">
              /
            </li>
            <li
              className="font-semibold text-[var(--color-primary)] min-w-0 break-words"
              aria-current="page"
              title={category.title}
            >
              {category.title}
            </li>
          </ol>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 md:px-20 py-10 md:py-14">
        {/* Back link */}
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium hover:underline mb-8"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          All task categories
        </Link>

        {/* Hero */}
        <header className="border-b border-gray-200 pb-10 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0">
              <Icon size={28} strokeWidth={2} aria-hidden />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-3">
                {category.title} Tasks
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-semibold px-5 py-3 rounded-full hover:bg-[#003d35] transition-colors shadow-md"
            >
              Post a {category.title.toLowerCase()} task
            </Link>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold px-5 py-3 rounded-full hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              Browse all categories
            </Link>
          </div>
        </header>

        {/* Example tasks */}
        <section className="mb-12" aria-labelledby="examples-heading">
          <h2 id="examples-heading" className="text-xl font-semibold text-gray-900 mb-4">
            Example tasks you can post
          </h2>
          <ul className="flex flex-wrap gap-2">
            {uniqueExamples.map((ex) => (
              <li key={ex}>
                <span className="inline-block px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm">
                  {ex}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA block */}
        <section className="p-6 md:p-8 rounded-2xl bg-[var(--color-primary)] text-white" aria-label="Call to action">
          <h2 className="text-xl font-semibold mb-2">
            Ready to get your {category.title.toLowerCase()} task done?
          </h2>
          <p className="text-white/90 mb-6">
            Post your task in minutes. Get matched with performers who fit. Pay only when the work is done.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Post a task
            <ArrowLeft size={18} strokeWidth={2} className="rotate-180" />
          </Link>
        </section>

        {/* Explore other categories — single block */}
        <section className="mt-10" aria-label="Explore other categories">
          <CategoryCrossLinks
            title="Explore other categories"
            links={taskCategories
              .filter((c) => c.id !== category.id)
              .map((c) => ({ to: `/tasks/${c.id}`, label: c.title }))}
            ctaPrimary={{ to: "/", label: "Post Your Task" }}
            ctaSecondary={{ to: "/task-performers", label: "Get Work Executed" }}
            variant="teal"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TaskCategoryDetailPage;
