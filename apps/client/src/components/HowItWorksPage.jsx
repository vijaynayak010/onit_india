import React from "react";
import { Link } from "react-router-dom";
import { FileText, Users, Play, CreditCard } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const steps = [
  {
    step: 1,
    title: "Post a Task",
    description: "Describe the work you need completed with AI, manually, or from a template.",
    icon: FileText,
  },
  {
    step: 2,
    title: "Choose Your Performer",
    description: "Review vetted performers with verified trust scores, reviews, and approved projects.",
    icon: Users,
  },
  {
    step: 3,
    title: "Track Live & Collaborate",
    description: "Chat in real-time, view timestamped draft versions, and track milestone checklists.",
    icon: Play,
  },
  {
    step: 4,
    title: "Approve & Release Payment",
    description: "Work is reviewed and escrow funds are released only when you approve the final output.",
    icon: CreditCard,
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="How firstDoer Works | Post, Choose Performer, Track, Approve"
        description="How firstDoer works: post a task, choose a verified performer, track live progress, and release payment only when satisfied."
        keywords="firstDoer, how firstDoer works, post task, verified performers, escrow payment, task execution platform"
        canonical="https://www.firstdoer.com/how-it-works"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "How firstDoer Works",
          "description": "Learn how to post a task, choose verified performers, track progress, and pay safely on firstDoer.",
          "url": "https://www.firstdoer.com/how-it-works"
        }}
      />

      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[#10605F] hover:text-[#083B3A] font-medium text-sm mb-6 sm:mb-8 transition-colors"
          >
            ← Back to Home
          </Link>

          <header className="border-b border-gray-200 pb-6 sm:pb-8 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[#10605F] mb-2 tracking-tight">
              How firstDoer Works
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Get your work done in four simple steps. From posting a task to releasing payment, the process is designed to be clear, safe, and efficient.
            </p>
          </header>

          <div className="space-y-6 sm:space-y-8">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-[#10605F]/20 transition-colors"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#10605F] text-white">
                    <Icon size={22} strokeWidth={2} aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#10605F]">
                      Step {item.step}
                    </span>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-medium text-gray-900 mt-1 mb-1.5 sm:mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 self-start sm:self-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#10605F]/30 text-base sm:text-lg font-medium text-[#10605F]">
                      {item.step}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              to="/for-providers"
              className="rounded-xl border border-[#10605F]/20 bg-[#10605F]/5 p-4 text-center hover:bg-[#10605F]/10 transition-colors"
            >
              <span className="font-heading font-medium text-[#10605F]">For Task Providers</span>
              <p className="text-gray-600 text-sm mt-1">How to post tasks and get work done</p>
            </Link>
            <Link
              to="/for-performers"
              className="rounded-xl border border-[#10605F]/20 bg-[#10605F]/5 p-4 text-center hover:bg-[#10605F]/10 transition-colors"
            >
              <span className="font-heading font-medium text-[#10605F]">For Task Performers</span>
              <p className="text-gray-600 text-sm mt-1">How to complete tasks and get paid</p>
            </Link>
          </div>
          <p className="mt-6 text-center text-gray-600 text-sm">
            Ready to get started?{" "}
            <Link to="/for-providers" className="font-medium text-[#10605F] hover:text-[#083B3A] transition-colors">
              Post your first task
            </Link>{" "}
            or{" "}
            <Link to="/for-performers" className="font-medium text-[#10605F] hover:text-[#083B3A] transition-colors">
              join as a performer
            </Link>
            .
          </p>

          <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-gray-200 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#10605F] hover:text-[#083B3A] font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
