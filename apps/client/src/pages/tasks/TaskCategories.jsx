import React from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, ChevronRight } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import CategoryCrossLinks from "../../components/landing/CategoryCrossLinks";
import { taskCategories } from "../../data/taskCategories";

const TaskCategories = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Tasks You Can Get Done on FirstDoer | Task Marketplace India"
        description="Tasks on FirstDoer: business operations, content & design, tech & data, admin support, creative writing, events. Post a task and get it executed quickly. Task marketplace India."
        keywords="FirstDoer, onitindia, task marketplace India, tasks, micro task platform, hire people for small tasks, lead generation, design, data entry, task execution platform, types of tasks, outsource tasks India"
        canonical="https://www.firstdoer.com/tasks"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Tasks You Can Get Done on FirstDoer",
          "description": "Discover task categories on FirstDoer: business, content, tech, admin, creative, and events.",
          "url": "https://www.firstdoer.com/tasks",
        }}
      />

      {/* Breadcrumb — high contrast so it stays readable below fixed nav */}
      <nav
        className="border-b border-gray-200 bg-white"
        aria-label="Breadcrumb"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-3.5 sm:py-4">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm md:text-[0.9375rem]">
            <li>
              <Link
                to="/"
                className="font-semibold text-gray-900 underline-offset-2 hover:text-[var(--color-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:rounded"
              >
                Home
              </Link>
            </li>
            <li
              className="text-gray-500 select-none font-medium"
              aria-hidden="true"
            >
              /
            </li>
            <li
              className="font-semibold text-[var(--color-primary)]"
              aria-current="page"
            >
              Tasks
            </li>
          </ol>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-10 md:py-14 font-sans">
        {/* Hero */}
        <header className="mb-10 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] font-medium text-[var(--color-primary)] mb-3 tracking-tight font-heading leading-tight">
            Tasks You Can Get Done on FirstDoer
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mb-6 sm:mb-8">
            From lead generation to video editing—get real work done by vetted performers. Post your task, get matched, and move forward without the hiring hassle.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-semibold px-5 py-3 rounded-full hover:bg-[var(--color-primary-hover)] transition-colors shadow-md hover:shadow-lg min-h-[44px]"
            >
              <Plus size={18} strokeWidth={2.5} />
              Post a task
            </Link>
            <Link
              to="/task-performers"
              className="inline-flex items-center justify-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold px-5 py-3 rounded-full hover:bg-[var(--color-primary)]/5 transition-colors min-h-[44px]"
            >
              Join as a performer
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </header>

        {/* Quick links — links only (CTAs are in hero above) */}
        <section className="mb-12" aria-label="Quick links">
          <CategoryCrossLinks
            title="Explore more"
            links={[
              { to: "/#domain", label: "By domain" },
              { to: "/use-cases", label: "By use case" },
            ]}
            variant="teal"
            showCtas={false}
          />
        </section>

        {/* Intro */}
        <p className="text-gray-600 leading-relaxed mb-8">
          Whether you're a founder, marketer, or operations lead, you'll find the right help for short-term, high-impact tasks. Below are the main categories we support—each with clear scope and quick turnaround.
        </p>

        {/* Category grid */}
        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="sr-only">
            Task categories
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 list-none p-0 m-0">
            {taskCategories.map((cat, index) => {
              const Icon = cat.icon;
              const uniqueExamples = [...new Set(cat.examples)];
              return (
                <li key={cat.id}>
                  <Link
                    to={`/tasks/${cat.id}`}
                    className="group flex h-full rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden hover:border-[var(--color-primary)]/25 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <article className="p-4 sm:p-6 flex flex-col h-full w-full">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon size={18} className="text-[var(--color-primary)] flex-shrink-0" aria-hidden />
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-[var(--color-primary)] transition-colors font-heading">
                              {cat.title}
                            </h3>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-snug">
                            {cat.description}
                          </p>
                          <p className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Example tasks
                          </p>
                          <ul className="mt-1.5 flex flex-wrap gap-1.5">
                            {uniqueExamples.slice(0, 4).map((ex) => (
                              <li key={ex}>
                                <span className="inline-block px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-700">
                                  {ex}
                                </span>
                              </li>
                            ))}
                            {uniqueExamples.length > 4 && (
                              <li>
                                <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-500">
                                  +{uniqueExamples.length - 4}
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-[var(--color-primary)] flex-shrink-0 mt-1" />
                      </div>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Bottom CTA */}
        <section className="mt-14 p-6 md:p-8 rounded-2xl bg-[var(--color-primary)] text-white text-center" aria-label="Call to action">
          <h2 className="text-xl md:text-2xl font-medium mb-2">
            Ready to get your next task done?
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto text-sm md:text-base">
            Post your task in minutes. Get matched with performers who fit. Pay only when the work is done.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Post a task
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </section>

        {/* Explore other categories — links only (CTA is in block above) */}
        <section className="mt-10" aria-label="Explore other categories">
          <CategoryCrossLinks
            title="Explore other categories"
            links={taskCategories.map((c) => ({ to: `/tasks/${c.id}`, label: c.title }))}
            variant="teal"
            showCtas={false}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TaskCategories;
