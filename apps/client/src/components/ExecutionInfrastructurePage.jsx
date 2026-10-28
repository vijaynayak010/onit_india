import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, X, Zap, Users } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const TASK_CATEGORIES = [
  {
    title: "Content & Marketing",
    items: ["Social media posts", "Blog writing", "Video editing", "Creative design"],
  },
  {
    title: "Business Operations",
    items: ["Market research", "Competitor analysis", "Lead generation"],
  },
  {
    title: "Data & Administrative Work",
    items: ["Spreadsheet management", "Data entry", "Document conversion"],
  },
  {
    title: "Academic & Knowledge Work",
    items: ["Presentations", "Summaries", "Study materials"],
  },
  {
    title: "Local Verification",
    items: ["Store visits", "Location verification", "Retail audits"],
  },
];

const ExecutionInfrastructurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Execution Infrastructure | The Operating System for Getting Work Done | OnIT INDIA"
        description="Execution infrastructure is the layer that lets anyone turn work into tasks and get them executed by a distributed network. OnIT INDIA is building it — for startups, businesses, researchers, and creators."
        keywords="execution infrastructure, OnIT INDIA, task execution, execution gap, get work done, task marketplace India, operational tasks, scalable work"
        canonical="https://www.onitindia.com/execution-infrastructure"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Execution Infrastructure | OnIT INDIA",
          "description": "The operating system for getting work done. How OnIT INDIA powers task execution.",
          "url": "https://www.onitindia.com/execution-infrastructure",
        }}
      />

      {/* 1. Hero */}
      <section className="pt-24 pb-20 px-6 md:px-20 bg-gradient-to-b from-[#004d43]/10 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#004d43] mb-4">
            Execution Infrastructure
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d43] mb-6 leading-tight">
            The Operating System for Getting Work Done
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
            Ideas are abundant. Execution is scarce.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            Across startups, businesses, researchers, and creators, countless tasks need to be completed every day — but hiring employees, coordinating freelancers, or managing agencies for small tasks slows everything down.
          </p>
          <p className="text-lg font-semibold text-[#004d43]">
            The modern economy needs something better. <span className="text-gray-800">Execution Infrastructure.</span>
          </p>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            OnIT INDIA is building the infrastructure that allows anyone to turn work into tasks and get them executed quickly by a distributed network of performers.
          </p>
        </div>
      </section>

      {/* 2. The Execution Gap */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-6 text-center">
            The Execution Gap
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Despite powerful digital tools, most work still depends on human execution.
          </p>
          <p className="text-gray-600 mb-4">Businesses face a constant stream of operational tasks such as:</p>
          <ul className="grid gap-2 sm:grid-cols-2 mb-6">
            {["creating content", "researching markets", "managing data", "verifying locations", "preparing presentations", "collecting information"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-700">
                <span className="text-[#004d43]">•</span> {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mb-2">
            These tasks are essential — but they are <strong>too small for hiring</strong>, <strong>too frequent for outsourcing</strong>, and <strong>too important to ignore</strong>.
          </p>
          <p className="text-gray-700 font-medium">
            This gap between work that exists and work that gets executed efficiently is what we call the <span className="text-[#004d43]">execution gap</span>.
          </p>
        </div>
      </section>

      {/* 3. Introducing Execution Infrastructure */}
      <section className="py-16 px-6 md:px-20 bg-[#004d43]/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-6 text-center">
            Introducing Execution Infrastructure
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Execution infrastructure is the layer that enables tasks to move from intention to completion seamlessly.
          </p>
          <p className="text-gray-600 mb-6">
            Instead of relying on rigid hiring models, execution infrastructure allows work to flow dynamically between:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>people who need tasks completed</li>
            <li>people who can execute those tasks</li>
          </ul>
          <p className="text-gray-600 mb-4">The result is a system where work becomes:</p>
          <ul className="space-y-2">
            {["On-demand", "Scalable", "Efficient", "Accessible anywhere"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-800 font-medium">
                <Check size={20} className="text-[#004d43] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. How OnIT INDIA Powers Execution */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4 text-center">
            How OnIT INDIA Powers Execution
          </h2>
          <p className="text-gray-600 text-center mb-10">
            OnIT INDIA transforms work into an execution loop.
          </p>
          <ol className="space-y-6">
            {[
              { step: 1, title: "Post Work", body: "Task providers describe what needs to be done and define the requirements." },
              { step: 2, title: "Match with Performers", body: "A network of verified performers can accept and execute the task." },
              { step: 3, title: "Execute and Submit Proof", body: "Work is completed and proof of execution is uploaded." },
              { step: 4, title: "Approve and Close", body: "Task providers review the work and approve completion." },
            ].map(({ step, title, body }) => (
              <li key={step} className="flex gap-4 items-start">
                <span className="shrink-0 w-10 h-10 rounded-full bg-[#004d43] text-white flex items-center justify-center font-bold">
                  {step}
                </span>
                <div>
                  <h3 className="font-bold text-[#004d43] text-lg">{title}</h3>
                  <p className="text-gray-600">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-gray-700 font-medium mt-8 text-center">
            This loop enables fast, structured, and reliable task execution.
          </p>
        </div>
      </section>

      {/* 5. What Can Be Executed - Task categories */}
      <section className="py-16 px-6 md:px-20 bg-[#004d43]/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4 text-center">
            What Can Be Executed
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Execution infrastructure supports a wide spectrum of work.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TASK_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="rounded-xl border border-[#004d43]/15 bg-white p-5"
              >
                <h3 className="font-bold text-[#004d43] mb-3">{cat.title}</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  {cat.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-center mt-8">
            These tasks form a massive layer of operational work across the economy.
          </p>
        </div>
      </section>

      {/* 6. A New Way to Work + Benefits for both sides */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-6 text-center">
            A New Way to Work
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Execution infrastructure changes how work happens.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-6">
              <p className="font-semibold text-gray-800 mb-4">Instead of:</p>
              <ul className="space-y-2">
                {["Hiring employees for every task", "Managing complex outsourcing processes", "Spending hours on operational work"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <X size={18} className="text-red-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#004d43]/20 bg-[#004d43]/5 p-6">
              <p className="font-semibold text-[#004d43] mb-4">Organizations can simply:</p>
              <p className="text-gray-800 font-medium">Post tasks and get them executed.</p>
              <p className="text-gray-600 text-sm mt-2">This makes work modular, flexible, and scalable.</p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-8 text-center">
            Built for the Modern Work Economy
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            The workforce is evolving rapidly. Students, freelancers, professionals, and independent workers increasingly seek flexible opportunities. Execution infrastructure connects this growing workforce with real tasks that need to be completed. This creates value for both sides.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[#004d43]/15 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={22} className="text-[#004d43]" />
                <h3 className="text-xl font-bold text-[#004d43]">For Task Providers</h3>
              </div>
              <p className="text-gray-600 mb-4">Organizations can execute work faster without expanding their teams. Benefits include:</p>
              <ul className="space-y-2 text-gray-700">
                {["Faster turnaround", "Operational flexibility", "Scalable task execution", "Reduced overhead"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={16} className="text-[#004d43] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#004d43]/15 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={22} className="text-[#004d43]" />
                <h3 className="text-xl font-bold text-[#004d43]">For Performers</h3>
              </div>
              <p className="text-gray-600 mb-4">Individuals can access flexible work opportunities by completing tasks. Benefits include:</p>
              <ul className="space-y-2 text-gray-700">
                {["Work on your own schedule", "Earn from your skills", "Build experience", "Access a variety of tasks"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={16} className="text-[#004d43] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. The Future of Execution */}
      <section className="py-16 px-6 md:px-20 bg-[#004d43]/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-6">
            The Future of Execution
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Just as cloud infrastructure transformed computing, execution infrastructure will transform how work gets done.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Tasks will move seamlessly across networks of skilled individuals, enabling organizations to operate faster and more efficiently.
          </p>
          <p className="text-[#004d43] font-semibold text-lg">
            OnIT INDIA is building that future — creating a system where work flows effortlessly from idea to execution.
          </p>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-20 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4">
            Start Executing Work
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Whether you are a business that needs tasks completed or an individual looking to perform tasks, OnIT INDIA makes execution simple.
          </p>
          <p className="text-xl font-semibold text-gray-800 mb-2">Turn work into tasks. Get them executed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => navigate("/provider/post-task-selection")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#004d43] text-white font-semibold hover:bg-[#016b5c] transition-colors"
            >
              Start Posting Tasks
              <ArrowRight size={20} />
            </button>
            <Link
              to="/for-performers"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[#004d43] text-[#004d43] font-semibold hover:bg-[#004d43]/5 transition-colors"
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
