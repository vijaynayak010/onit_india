import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import CategoryCrossLinks from "../../components/landing/CategoryCrossLinks";
import { getUseCaseBySlug, useCases } from "../../data/useCases";

const STEPS = [
  "Post your task (manual or with AI assist) — set your price",
  "Review interest from performers (interested at your price)",
  "Chat, confirm, and assign",
  "Receive completed work and approve",
  "Payment is released; you're done",
];

const UseCasePage = ({ slug: slugProp }) => {
  const { useCaseSlug: slugParam } = useParams();
  const slug = slugProp ?? slugParam;
  const navigate = useNavigate();
  const useCase = getUseCaseBySlug(slug);

  if (!useCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Page not found</h1>
          <Link to="/" className="text-[var(--color-primary)] font-medium hover:underline">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  const { title, headline, description, keywords, benefits, exampleTasks } = useCase;
  const canonical = `https://www.firstdoer.com/${slug}`;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title={`${title} | Task Execution on Demand | FirstDoer`}
        description={description}
        keywords={keywords}
        canonical={canonical}
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `${title} | FirstDoer`,
          "description": description,
          "url": canonical,
        }}
      />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 md:px-20 bg-gradient-to-b from-[var(--color-primary)]/5 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] mb-4 leading-tight">
            {headline}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/provider/post-task-selection")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors text-base"
            >
              Post a task
              <ArrowRight size={20} />
            </button>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)]/5 transition-colors text-base"
            >
              Sign up / Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 -mt-4 mb-4 max-w-4xl mx-auto">
        <CategoryCrossLinks
          title="Explore other use cases"
          links={useCases.filter((u) => u.slug !== slug).map((u) => ({ to: `/${u.slug}`, label: u.title }))}
          ctaPrimary={{ to: "/", label: "Post Your Task" }}
          ctaSecondary={{ to: "/task-performers", label: "Get Work Executed" }}
          variant="teal"
        />
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-10 text-center">
            Why {title.toLowerCase()} use FirstDoer
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((text, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-primary)]/15 bg-white p-6 flex gap-4"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  <Check size={24} strokeWidth={2.5} />
                </div>
                <p className="text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example tasks */}
      <section className="py-16 px-6 md:px-20 bg-gray-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4 text-center">
            Example tasks you can post
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Research, design, content, data, and more — post what you need, get it done.
          </p>
          <ul className="flex flex-wrap justify-center gap-3">
            {exampleTasks.map((task) => (
              <li key={task}>
                <span className="inline-block px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium">
                  {task}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-center mt-6">
            <Link to="/tasks" className="text-[var(--color-primary)] font-semibold hover:underline">
              See all task categories →
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4 text-center">
            How it works
          </h2>
          <p className="text-gray-600 text-center mb-8">
            You set the price when posting; performers interested at that price show interest. You choose, chat, assign, and pay when work is done.
          </p>
          <ul className="space-y-4">
            {STEPS.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 items-start rounded-lg bg-white border border-gray-100 p-4"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-2xl bg-[var(--color-primary)] text-white p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Ready to get work done?
            </h2>
            <p className="text-white/90 mb-6">
              Create an account, post your first task, and connect with performers in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/auth", { state: { authMode: "signup" } })}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-[var(--color-primary)] font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign up
                <ArrowRight size={18} />
              </button>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 pb-16 max-w-4xl mx-auto">
        <CategoryCrossLinks
          title="Explore other use cases"
          links={useCases.filter((u) => u.slug !== slug).map((u) => ({ to: `/${u.slug}`, label: u.title }))}
          ctaPrimary={{ to: "/", label: "Post Your Task" }}
          ctaSecondary={{ to: "/task-performers", label: "Get Work Executed" }}
          variant="teal"
        />
      </section>

      <Footer />
    </div>
  );
};

export default UseCasePage;
