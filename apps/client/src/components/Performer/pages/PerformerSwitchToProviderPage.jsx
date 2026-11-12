import React from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, BriefcaseBusiness, ShieldCheck, Star, Users } from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";

const FeatureCard = ({ icon: Icon, title, copy, tone }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
    green: "bg-[#EFFBFB] text-[#10605F] border-[#29ADAC]/20",
  };

  return (
    <article className={`rounded-2xl border p-5 text-center shadow-sm ${tones[tone]}`}>
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/70">
        <Icon size={22} strokeWidth={2.3} />
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{copy}</p>
    </article>
  );
};

const PerformerSwitchToProviderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-[93px] font-sans text-gray-900">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-3xl pb-12">
          <PerformerPageHeader
            title="Switch Account"
            subtitle="Post tasks and hire skilled performers as an employer or client"
            backTo="/performer/account"
          />
          <section className="mt-8 w-full text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                <Users size={42} strokeWidth={2.4} />
              </div>

              <h1 className="mt-7 text-2xl font-medium tracking-tight text-gray-900 sm:text-3xl">
                Start Posting Tasks
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-gray-500">
                Switch to a Provider account to hire skilled performers for your projects. Your Performer account will remain active.
              </p>

              <div className="mx-auto mt-9 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
                <FeatureCard
                  icon={Star}
                  title="Post Tasks Easily"
                  copy="Create detailed task listings in minutes. Reach hundreds of skilled performers instantly."
                  tone="blue"
                />
                <FeatureCard
                  icon={Users}
                  title="Find Top Talent"
                  copy="Browse verified performer profiles, portfolios, and ratings before you hire."
                  tone="violet"
                />
                <FeatureCard
                  icon={ShieldCheck}
                  title="Secure Payments"
                  copy="Escrow-protected payments. Funds release only when work is approved."
                  tone="green"
                />
              </div>

              <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFFBFB] text-[#10605F]">
                    <BriefcaseBusiness size={20} strokeWidth={2.4} />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-900">Provider App Available</h2>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-[#10605F]">
                      The Provider experience is available on the Provider App. Download it from the Play Store to switch.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/provider/dashboard")}
                  className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gray-950 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  <BadgeCheck size={18} strokeWidth={2.4} />
                  Continue to Provider
                </button>
              </div>

              <p className="mt-8 text-xs font-medium text-gray-400">
                Sign in with your existing account on the Provider App.
              </p>
            </section>
          </div>
        </main>
    </div>
  );
};

export default PerformerSwitchToProviderPage;
