import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Briefcase, Shield, Clock, ArrowRight } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const BENEFITS = [
  {
    icon: Zap,
    title: "Earn on your schedule",
    description: "Choose tasks that match your skills. Work when you want — no rigid hours. Get paid promptly when the client approves your deliverables.",
  },
  {
    icon: Briefcase,
    title: "High-value task categories",
    description: "Growth & marketing campaigns, video editing, UI/UX design, web development, and content creation with clear budgets.",
  },
  {
    icon: Shield,
    title: "Guaranteed protected payments",
    description: "Funds are pre-funded into escrow by the client before you begin work, ensuring your efforts are fully protected.",
  },
  {
    icon: Clock,
    title: "Build your trust score & reputation",
    description: "Complete tasks on time, earn 5-star ratings, and boost your public Trust Score to attract high-budget clients.",
  },
];

const STEPS = [
  "Verify your identity and get your performer profile approved",
  "Browse available tasks matching your skillset and apply",
  "Chat directly with the client to align on milestones and checklists",
  "Execute the work, upload timestamped drafts, and submit final deliverables",
  "Escrow payment is released immediately upon client approval",
];

const ForPerformersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="For Task Performers | Complete Tasks & Get Paid | firstDoer"
        description="Earn by completing marketing, design, and development tasks on firstDoer. Pre-funded escrow payments, verified clients, and flexible work."
        keywords="firstDoer task performer, earn by tasks, complete tasks, task-based work, flexible work, join as performer, task marketplace"
        canonical="https://www.firstdoer.com/for-performers"
      />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 md:px-20 bg-gradient-to-b from-[#10605F]/5 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#10605F] mb-4 leading-tight">
            Complete tasks. Get paid.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find high-value marketing, design, and dev tasks. Work with verified clients and enjoy guaranteed escrow payouts upon project approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/task-performers")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#10605F] text-white font-semibold hover:bg-[#083B3A] transition-colors text-base"
            >
              Join as performer
              <ArrowRight size={20} />
            </button>
            <Link
              to="/performerlogin"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[#10605F] text-[#10605F] font-semibold hover:bg-[#10605F]/5 transition-colors text-base"
            >
              Sign up / Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 md:px-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-medium text-[#10605F] mb-10 text-center">
            Why complete tasks on firstDoer
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {BENEFITS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#10605F]/15 bg-white p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#10605F]/10 text-[#10605F] flex items-center justify-center">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-[#10605F] mb-1.5">{item.title}</h3>
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
          <h2 className="text-2xl md:text-3xl font-medium text-[#10605F] mb-4 text-center">
            How it works
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Clients post clear task briefs and fund escrow. You apply, chat to align on scope, execute the work, and get paid securely upon sign-off.
          </p>
          <ul className="space-y-4">
            {STEPS.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 items-start rounded-lg bg-white border border-gray-100 p-4"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#10605F] text-white flex items-center justify-center text-sm font-bold">
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
          <div className="rounded-2xl bg-[#0D1210] text-white p-6 sm:p-8 md:p-10 border border-[#10605F]/30">
            <h2 className="text-xl md:text-2xl font-medium mb-3">
              Ready to start earning?
            </h2>
            <p className="text-[#C6F0F0] mb-6">
              Create an account, get verified, and land your first task on firstDoer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/auth", { state: { authMode: "signup" } })}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#7EDEDD] text-[#032120] font-semibold hover:bg-[#A2E7E7] transition-colors"
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
