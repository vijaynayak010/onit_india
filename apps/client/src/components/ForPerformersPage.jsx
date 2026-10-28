import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Briefcase, Shield, Clock, ArrowRight } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const BENEFITS = [
  {
    icon: Zap,
    title: "Earn on your schedule",
    description: "Choose tasks that match your skills. Work when you want — no fixed hours. Get paid when the provider approves your work.",
  },
  {
    icon: Briefcase,
    title: "Wide range of tasks",
    description: "Research, content, data entry, design, field visits, and more. Browse by category and show interest at the provider's price.",
  },
  {
    icon: Shield,
    title: "Secure payments",
    description: "Payment is held securely and released only after the task provider approves your deliverable. Clear records for every task.",
  },
  {
    icon: Clock,
    title: "Build your reputation",
    description: "Complete tasks well, get ratings and reviews, and become a trusted performer. Verification and badges can help you win more work.",
  },
];

const STEPS = [
  "Browse tasks and find work that matches your skills",
  "Show interest at the provider's price",
  "Chat with the provider to confirm scope and deliverables",
  "Get assigned, complete the work, and submit your deliverable",
  "Payment is released to you when the provider approves",
];

const ForPerformersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="For Task Performers | Complete Tasks & Get Paid | OnIT INDIA"
        description="Earn by completing tasks on OnIT INDIA. Find tasks that match your skills, show interest, deliver work, and get paid when the provider approves. Flexible, task-based work across India."
        keywords="OnIT INDIA task performer, earn by tasks, complete tasks, task-based work India, flexible work, join as performer, task marketplace India, side income India"
        canonical="https://www.onitindia.com/for-performers"
      />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 md:px-20 bg-gradient-to-b from-[#004d43]/5 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d43] mb-4 leading-tight">
            Complete tasks. Get paid.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find tasks that match your skills, show interest at the provider&apos;s price,
            deliver the work, and get paid when it&apos;s approved. No long-term commitments — task by task.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/task-performers")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#004d43] text-white font-semibold hover:bg-[#016b5c] transition-colors text-base"
            >
              Join as performer
              <ArrowRight size={20} />
            </button>
            <Link
              to="/performerlogin"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[#004d43] text-[#004d43] font-semibold hover:bg-[#004d43]/5 transition-colors text-base"
            >
              Sign up / Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-10 text-center">
            Why complete tasks on OnIT INDIA
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {BENEFITS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#004d43]/15 bg-white p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#004d43]/10 text-[#004d43] flex items-center justify-center">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#004d43] mb-1.5">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 md:px-20 bg-gray-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4 text-center">
            How it works
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Providers post tasks and set the price. You show interest, get assigned, complete the work, and receive payment when the provider approves.
          </p>
          <ul className="space-y-4">
            {STEPS.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 items-start rounded-lg bg-white border border-gray-100 p-4"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#004d43] text-white flex items-center justify-center text-sm font-bold">
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
          <div className="rounded-2xl bg-[#004d43] text-white p-6 sm:p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Ready to start earning?
            </h2>
            <p className="text-white/90 mb-6">
              Create an account, browse tasks, and complete your first task. Need more detail? Check our{" "}
              <Link to="/help/completing-your-first-task" className="underline font-semibold">Completing Your First Task</Link> guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/auth", { state: { authMode: "signup" } })}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-[#004d43] font-semibold hover:bg-gray-100 transition-colors"
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

      <Footer />
    </div>
  );
};

export default ForPerformersPage;
