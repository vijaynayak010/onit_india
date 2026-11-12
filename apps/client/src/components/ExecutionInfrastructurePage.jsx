import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, X, Zap, Users } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const TASK_CATEGORIES = [
  {
    title: "Growth & Marketing",
    items: ["Social media campaigns", "Copywriting", "Video editing & reels", "Performance ads"],
  },
  {
    title: "Design & Creative",
    items: ["UI/UX wireframes & Figma", "Brand identity & logos", "Presentation decks", "Vector graphics"],
  },
  {
    title: "Build & Develop",
    items: ["Responsive web pages", "Frontend components", "Automation workflows", "API integrations"],
  },
  {
    title: "Business Operations",
    items: ["Market research", "Competitor analysis", "Lead generation", "Data organization"],
  },
];

const ExecutionInfrastructurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Execution Infrastructure | The Operating System for Getting Work Done | firstDoer"
        description="Execution infrastructure is the layer that lets anyone turn work into tasks and get them executed by a verified performer network. firstDoer is building it — for startups, agencies, and brands."
        keywords="execution infrastructure, firstDoer, task execution, execution gap, get work done, task marketplace, verified performers, scalable work"
        canonical="https://www.firstdoer.com/execution-infrastructure"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Execution Infrastructure | firstDoer",
          "description": "The operating system for getting work done. How firstDoer powers verified task execution.",
          "url": "https://www.firstdoer.com/execution-infrastructure",
        }}
      />

      {/* 1. Hero */}
      <section className="pt-24 pb-20 px-6 md:px-20 bg-gradient-to-b from-[#10605F]/10 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#10605F] mb-4">
            Execution Infrastructure
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#10605F] mb-6 leading-tight">
            The Operating System for Getting Work Done
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
            Ideas are abundant. Execution is scarce.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            Across startups, growing brands, agencies, and creators, countless tasks need to be completed every day — but slow freelancer bidding and lack of verification stalls momentum.
          </p>
          <p className="text-lg font-semibold text-[#10605F]">
            The modern economy needs something better. <span className="text-gray-800">Execution Infrastructure.</span>
          </p>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            firstDoer is building the infrastructure that allows anyone to turn work into structured tasks and get them executed quickly by verified performers with protected payments.
          </p>
        </div>
      </section>

      {/* 2. The Execution Gap */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#10605F] mb-6 text-center">
            The Execution Gap
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Despite powerful AI and software tools, high-quality deliverables still rely on skilled human execution.
          </p>
          <p className="text-gray-600 mb-4">Teams face a constant stream of operational and creative tasks such as:</p>
          <ul className="grid gap-2 sm:grid-cols-2 mb-6">
            {["launching ad campaigns", "editing reels and videos", "designing prototypes", "building landing pages", "curating market intelligence", "setting up automations"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-700">
                <span className="text-[#10605F]">•</span> {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mb-2">
            These tasks are essential — but they are <strong>too small for full-time hiring</strong>, <strong>too urgent for lengthy agency contracts</strong>, and <strong>too critical to compromise on quality</strong>.
          </p>
          <p className="text-gray-700 font-medium">
            This gap between what needs to be shipped and what gets executed is the <span className="text-[#10605F]">execution gap</span>.
          </p>
        </div>
      </section>

      {/* 3. Introducing Execution Infrastructure */}
      <section className="py-16 px-6 md:px-20 bg-[#10605F]/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#10605F] mb-6 text-center">
            Introducing Execution Infrastructure
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Execution infrastructure is the layer that enables tasks to move from intention to completion seamlessly.
          </p>
          <p className="text-gray-600 mb-6">
            Instead of relying on rigid hiring or unvetted bidding, work flows dynamically between clients who need outcomes and verified performers with proven track records.
          </p>
          <ul className="space-y-2">
            {["On-demand verified matching", "Clear AI-assisted milestone agreements", "Safe escrow payment protection", "Transparent trust scores and star ratings"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-800 font-medium">
                <Check size={20} className="text-[#10605F] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Task Categories */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#10605F] mb-8 text-center">
            Task Domains
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {TASK_CATEGORIES.map((cat) => (
              <div key={cat.title} className="p-6 rounded-2xl border border-gray-200 bg-white">
                <h3 className="text-lg font-bold text-[#10605F] mb-3">{cat.title}</h3>
                <ul className="space-y-1.5 text-gray-600 text-sm">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#29ADAC]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Built for the Modern Work Economy */}
      <section className="py-16 px-6 md:px-20 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[#10605F]/15 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={22} className="text-[#10605F]" />
                <h3 className="text-xl font-bold text-[#10605F]">For Task Providers</h3>
              </div>
              <p className="text-gray-600 mb-4">Execute marketing, design, and dev work without growing your fixed payroll:</p>
              <ul className="space-y-2 text-gray-700">
                {["Faster turnaround in hours/days", "Pay only when work is approved", "Verified performers with trust scores", "Zero administrative friction"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={16} className="text-[#10605F] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#10605F]/15 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={22} className="text-[#10605F]" />
                <h3 className="text-xl font-bold text-[#10605F]">For Performers</h3>
              </div>
              <p className="text-gray-600 mb-4">Access flexible, high-trust project opportunities with guaranteed payments:</p>
              <ul className="space-y-2 text-gray-700">
                {["Protected escrow funds upfront", "Build a verifiable reputation", "Transparent milestones and chat", "Earn from your specialized skills"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={16} className="text-[#10605F] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-20 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#10605F] mb-4">
            Start Executing Work
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Turn work into tasks. Get them executed by verified performers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/provider/post-task-selection")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#10605F] text-white font-semibold hover:bg-[#083B3A] transition-colors"
            >
              Start Posting Tasks
              <ArrowRight size={20} />
            </button>
            <Link
              to="/for-performers"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[#10605F] text-[#10605F] font-semibold hover:bg-[#10605F]/5 transition-colors"
            >
              Become a Performer
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExecutionInfrastructurePage;
