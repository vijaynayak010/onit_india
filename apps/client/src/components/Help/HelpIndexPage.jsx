import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, PlusCircle, CheckCircle, ArrowRight } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

const HELP_ARTICLES = [
  {
    slug: "getting-started",
    title: "Getting Started Guide",
    description: "New to FirstDoer? Learn how the platform works, create your account, and understand the basics of posting or completing tasks.",
    icon: BookOpen,
  },
  {
    slug: "posting-your-first-task",
    title: "Posting Your First Task",
    description: "Step-by-step guide for task providers: how to describe your task, set a budget, and get matched with performers who can deliver.",
    icon: PlusCircle,
  },
  {
    slug: "completing-your-first-task",
    title: "Completing Your First Task",
    description: "For task performers: how to find tasks, show interest, chat with providers, and get paid when you complete work.",
    icon: CheckCircle,
  },
];

const HelpIndexPage = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Help & Guides | Platform Help | FirstDoer"
      description="Get started with FirstDoer. Guides for posting your first task, completing tasks as a performer, and using the platform. Reduce support questions with our help articles."
      keywords="FirstDoer help, getting started, post task guide, complete task guide, platform help, support"
      canonical="https://www.firstdoer.com/help"
      webPageSchema={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Help & Guides | FirstDoer",
        "description": "Platform help and guides for task providers and performers.",
        "url": "https://www.firstdoer.com/help",
      }}
    />

    <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[var(--color-primary)]/5 to-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-[var(--color-primary)] mb-3 sm:mb-4 leading-tight">
          Platform Help
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Guides and articles to get you started and answer common questions. Find what you need below.
        </p>
      </div>
    </section>

    <section className="py-8 sm:py-10 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg sm:text-xl font-heading font-medium text-[var(--color-primary)] mb-3 sm:mb-4">Platform overview</h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">
          Key pages for task providers and performers: how to post tasks, how to complete tasks, how the platform works, pricing, and rules.
        </p>
        <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
          <Link to="/for-providers" className="text-[var(--color-primary)] font-medium hover:underline text-xs sm:text-sm py-1">For Task Providers (how to post tasks)</Link>
          <Link to="/for-performers" className="text-[var(--color-primary)] font-medium hover:underline text-xs sm:text-sm py-1">For Task Performers (how to complete tasks)</Link>
          <Link to="/how-it-works" className="text-[var(--color-primary)] font-medium hover:underline text-xs sm:text-sm py-1">How It Works</Link>
          <Link to="/execution-infrastructure" className="text-[var(--color-primary)] font-medium hover:underline text-xs sm:text-sm py-1">Execution Infrastructure Explained</Link>
          <Link to="/pricing" className="text-[var(--color-primary)] font-medium hover:underline text-xs sm:text-sm py-1">Pricing / Fees</Link>
          <Link to="/task-guidelines" className="text-[var(--color-primary)] font-medium hover:underline text-xs sm:text-sm py-1">Task Guidelines / Posting Rules</Link>
          <Link to="/community" className="text-[var(--color-primary)] font-medium hover:underline text-xs sm:text-sm py-1">Community (Success Stories, Leaderboard, Examples)</Link>
        </div>
      </div>
    </section>

    <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg sm:text-xl font-heading font-medium text-[var(--color-primary)] mb-4 sm:mb-6">Step-by-step guides</h2>
        <div className="space-y-4 sm:space-y-6">
          {HELP_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              to={`/help/${article.slug}`}
              className="group flex gap-3.5 sm:gap-4 rounded-xl border border-[var(--color-primary)]/15 bg-white p-4 sm:p-6 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all items-start"
            >
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                <article.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-medium text-[var(--color-primary)] mb-1 group-hover:underline text-base sm:text-lg">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{article.description}</p>
                <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-medium text-xs sm:text-sm mt-2 min-h-[32px]">
                  Read guide
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="py-8 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-center text-gray-600 text-sm">
        <p>
          Can&apos;t find what you need?{" "}
          <Link to="/contact" className="text-[var(--color-primary)] font-medium hover:underline">
            Contact us
          </Link>
          {" "}or check our{" "}
          <Link to="/faqs" className="text-[var(--color-primary)] font-medium hover:underline">
            FAQs
          </Link>
          .
        </p>
      </div>
    </section>

    <Footer />
  </div>
);

export default HelpIndexPage;
