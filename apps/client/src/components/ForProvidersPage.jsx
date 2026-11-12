import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Users, Shield, Clock, ArrowRight } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const BENEFITS = [
  {
    icon: Zap,
    title: "Get work done fast",
    description: "Post a task with AI or templates, get matched with verified performers, and receive completed work without long hiring cycles.",
  },
  {
    icon: Users,
    title: "Access verified performers",
    description: "Connect with vetted specialists in growth & marketing, UI/UX design, video editing, and development.",
  },
  {
    icon: Shield,
    title: "Secure and transparent",
    description: "Agree on checklists and milestones upfront. Funds are held in escrow and released only when work is approved.",
  },
  {
    icon: Clock,
    title: "Flexible and scalable",
    description: "Use it for one-off tasks or recurring projects. Scale up or down effortlessly with zero overhead.",
  },
];

const STEPS = [
  "Post your task (AI, manual or template) — set your budget and deadlines",
  "Review verified applicants with transparent trust scores and ratings",
  "Chat, agree on milestones, and fund the protected escrow",
  "Track live progress and receive timestamped deliverables",
  "Approve the work to release payment; you’re done",
];

const ForProvidersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="For Task Providers | Post Tasks & Hire Performers | firstDoer"
        description="Post marketing, design, and development tasks on firstDoer. Pay only when work is done. Vetted performers, protected payments, and fast turnaround."
        keywords="firstDoer task provider, post a task, get work done, hire task performer, task execution platform, hire verified performers"
        canonical="https://www.firstdoer.com/for-providers"
      />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 md:px-20 bg-gradient-to-b from-[#10605F]/5 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#10605F] mb-4 leading-tight">
            Post work. Get it executed.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you need marketing campaigns, design assets, video editing, or web development — post a
            task, connect with verified performers, and pay only when it’s done.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/provider/post-task-selection")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#10605F] text-white font-semibold hover:bg-[#083B3A] transition-colors text-base"
            >
              Post a task
              <ArrowRight size={20} />
            </button>
            <Link
              to="/providerlogin"
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#10605F] mb-10 text-center">
            Why post tasks on firstDoer
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
                  <h3 className="font-semibold text-[#10605F] mb-1.5">
                    {item.title}
                  </h3>
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#10605F] mb-4 text-center">
            How it works
          </h2>
          <p className="text-gray-600 text-center mb-8">
            You set the budget and requirements; verified performers apply. Review their trust scores, chat in one thread, and release payment only upon approval.
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
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Ready to get work done?
            </h2>
            <p className="text-[#C6F0F0] mb-6">
              Create an account, post your first task, and connect with verified performers in minutes.
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

export default ForProvidersPage;
