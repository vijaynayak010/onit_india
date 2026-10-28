import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, PlusCircle, CheckCircle, ArrowRight } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

const HELP_ARTICLES = [
  {
    slug: "getting-started",
    title: "Getting Started Guide",
    description: "New to OnIT INDIA? Learn how the platform works, create your account, and understand the basics of posting or completing tasks.",
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
      title="Help & Guides | Platform Help | OnIT INDIA"
      description="Get started with OnIT INDIA. Guides for posting your first task, completing tasks as a performer, and using the platform. Reduce support questions with our help articles."
      keywords="OnIT INDIA help, getting started, post task guide, complete task guide, platform help, support"
      canonical="https://www.onitindia.com/help"
      webPageSchema={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Help & Guides | OnIT INDIA",
        "description": "Platform help and guides for task providers and performers.",
        "url": "https://www.onitindia.com/help",
      }}
    />

    <section className="pt-24 pb-16 px-6 md:px-20 bg-gradient-to-b from-[#004d43]/5 to-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d43] mb-4 leading-tight">
          Platform Help
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Guides and articles to get you started and answer common questions. Find what you need below.
        </p>
      </div>
    </section>

    <section className="py-10 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#004d43] mb-4">Platform overview</h2>
        <p className="text-gray-600 text-sm mb-6">
          Key pages for task providers and performers: how to post tasks, how to complete tasks, how the platform works, pricing, and rules.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/for-providers" className="text-[#004d43] font-medium hover:underline text-sm">For Task Providers (how to post tasks)</Link>
          <Link to="/for-performers" className="text-[#004d43] font-medium hover:underline text-sm">For Task Performers (how to complete tasks)</Link>
          <Link to="/how-it-works" className="text-[#004d43] font-medium hover:underline text-sm">How It Works</Link>
          <Link to="/execution-infrastructure" className="text-[#004d43] font-medium hover:underline text-sm">Execution Infrastructure Explained</Link>
          <Link to="/pricing" className="text-[#004d43] font-medium hover:underline text-sm">Pricing / Fees</Link>
          <Link to="/task-guidelines" className="text-[#004d43] font-medium hover:underline text-sm">Task Guidelines / Posting Rules</Link>
          <Link to="/community" className="text-[#004d43] font-medium hover:underline text-sm">Community (Success Stories, Leaderboard, Examples)</Link>
        </div>
      </div>
    </section>

    <section className="py-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#004d43] mb-4">Step-by-step guides</h2>
        <div className="space-y-6">
          {HELP_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              to={`/help/${article.slug}`}
              className="group flex gap-4 rounded-xl border border-[#004d43]/15 bg-white p-6 hover:border-[#004d43]/30 hover:shadow-md transition-all"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#004d43]/10 text-[#004d43] flex items-center justify-center group-hover:bg-[#004d43]/20 transition-colors">
                <article.icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-[#004d43] mb-1 group-hover:underline text-lg">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm">{article.description}</p>
                <span className="inline-flex items-center gap-1 text-[#004d43] font-medium text-sm mt-2">
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
          <Link to="/contact" className="text-[#004d43] font-medium hover:underline">
            Contact us
          </Link>
          {" "}or check our{" "}
          <Link to="/faqs" className="text-[#004d43] font-medium hover:underline">
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
