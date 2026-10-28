import React from "react";
import { Link } from "react-router-dom";
import { FileText, Users, Play, CheckCircle, CreditCard } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const steps = [
  {
    step: 1,
    title: "Post a Task",
    description: "Describe the work you need completed.",
    icon: FileText,
  },
  {
    step: 2,
    title: "Get Matched",
    description: "Relevant performers receive the task and respond.",
    icon: Users,
  },
  {
    step: 3,
    title: "Execute the Work",
    description: "The performer completes the task.",
    icon: Play,
  },
  {
    step: 4,
    title: "Review & Pay",
    description: "Work is verified and payment is released.",
    icon: CreditCard,
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="How OnIT INDIA Works | Post, Match, Execute, Pay"
        description="How OnIT INDIA works: post a task, get matched with performers, execute the work, review and pay. Instant task execution and task coordination platform for India. Simple four-step process."
        keywords="OnIT INDIA, onitindia, how OnIT INDIA works, post task, get matched, task execution, instant task execution, task coordination platform, how to post task, how to hire tasker India"
        canonical="https://www.onitindia.com/how-it-works"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "How OnIT INDIA Works",
          "description": "Learn how to post a task, get matched with performers, execute work, and pay on OnIT INDIA.",
          "url": "https://www.onitindia.com/how-it-works"
        }}
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[#004d43] hover:text-green-600 font-medium text-sm mb-8 transition-colors"
          >
            ← Back to Home
          </Link>

          <header className="border-b border-gray-200 pb-8 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-2">
              How OnIT INDIA Works
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Get your work done in four simple steps. From posting a task to releasing payment, the process is designed to be clear and efficient.
            </p>
          </header>

          <div className="space-y-8">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-[#004d43]/20 transition-colors"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#004d43] text-white">
                    <Icon size={24} strokeWidth={2} aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#004d43]">
                      Step {item.step}
                    </span>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mt-1 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 self-center sm:self-auto">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#004d43]/30 text-lg font-bold text-[#004d43]">
                      {item.step}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              to="/for-providers"
              className="rounded-xl border border-[#004d43]/20 bg-[#004d43]/5 p-4 text-center hover:bg-[#004d43]/10 transition-colors"
            >
              <span className="font-semibold text-[#004d43]">For Task Providers</span>
              <p className="text-gray-600 text-sm mt-1">How to post tasks and get work done</p>
            </Link>
            <Link
              to="/for-performers"
              className="rounded-xl border border-[#004d43]/20 bg-[#004d43]/5 p-4 text-center hover:bg-[#004d43]/10 transition-colors"
            >
              <span className="font-semibold text-[#004d43]">For Task Performers</span>
              <p className="text-gray-600 text-sm mt-1">How to complete tasks and get paid</p>
            </Link>
          </div>
          <p className="mt-6 text-center text-gray-600 text-sm">
            Ready to get started?{" "}
            <Link to="/for-providers" className="font-semibold text-[#004d43] hover:text-green-600 transition-colors">
              Post your first task
            </Link>{" "}
            or{" "}
            <Link to="/for-performers" className="font-semibold text-[#004d43] hover:text-green-600 transition-colors">
              join as a performer
            </Link>
            .
          </p>

          <div className="mt-14 pt-8 border-t border-gray-200 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#004d43] hover:text-green-600 font-semibold transition-colors"
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
