import React from "react";
import { useNavigate } from "react-router-dom";
import { PenTool, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { DashboardCard, PrimaryButton, SecondaryButton } from "../../shared/dashboard";

const OPTIONS = [
  {
    key: "manual",
    title: "Post Manually",
    subtitle: "Full control over every detail",
    detail: "Set category, approved service, budget, timeline, skills, and custom work journey checkpoints.",
    highlights: ["Custom checkpoints & rules", "Attach brief files", "Save as draft anytime"],
    icon: PenTool,
    to: "/provider/post-task-manual",
    cta: "Start Manual Form",
    primary: true,
  },
  {
    key: "ai",
    title: "Post Task with AI",
    subtitle: "Guided brief in seconds",
    detail: "Describe what you need in plain English and let AI structure the title, deliverables, and checklist.",
    highlights: ["Auto-generated deliverables", "Editable before publishing", "Fastest way to launch"],
    icon: Sparkles,
    to: "/provider/post-task-ai",
    cta: "Try AI Assistant",
    primary: false,
  },
];

const PostTaskSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--dash-canvas)] pt-[80px] font-sans text-[var(--dash-text)] antialiased">
      <ProviderHeader activePage="my-tasks" />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 text-center sm:mb-10">
          <p className="dash-overline mb-2 text-[var(--dash-primary-700)]">Create Task</p>
          <h1 className="dash-page-title text-[var(--dash-text)]">Post a Task</h1>
          <p className="dash-body mx-auto mt-2 max-w-xl text-[var(--dash-text-secondary)]">
            Choose how you&apos;d like to create your task. Both options let you review every detail before publishing.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <DashboardCard
                key={opt.key}
                className="flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-[var(--dash-primary-600)]/45 hover:shadow-[var(--shadow-md)] sm:p-7"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--dash-active-bg)] text-[var(--dash-primary-700)]">
                    <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                  </div>
                  {opt.key === "ai" ? (
                    <span className="rounded-full bg-[var(--dash-completed-bg)] px-3 py-1 text-[11px] font-semibold text-[var(--dash-primary-800)]">
                      Guided
                    </span>
                  ) : null}
                </div>

                <h2 className="dash-section-title text-[var(--dash-text)]">{opt.title}</h2>
                <p className="mt-1 text-[13px] font-medium text-[var(--dash-primary-700)]">{opt.subtitle}</p>
                <p className="dash-body mt-3 text-[var(--dash-text-secondary)]">{opt.detail}</p>

                <ul className="mt-5 space-y-2 border-t border-[var(--dash-border)] pt-4">
                  {opt.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-[var(--dash-text-secondary)]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--dash-primary-700)]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-2">
                  {opt.primary ? (
                    <PrimaryButton size="lg" onClick={() => navigate(opt.to)} className="w-full">
                      <span>{opt.cta}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </PrimaryButton>
                  ) : (
                    <SecondaryButton size="lg" onClick={() => navigate(opt.to)} className="w-full">
                      <span>{opt.cta}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </SecondaryButton>
                  )}
                </div>
              </DashboardCard>
            );
          })}
        </div>

        <p className="dash-secondary mt-8 text-center">
          Not sure which to choose? Use <strong className="font-semibold text-[var(--dash-text)]">AI Assistant</strong> for a quick draft, or{" "}
          <strong className="font-semibold text-[var(--dash-text)]">Manual</strong> for full customization.
        </p>
      </main>
    </div>
  );
};

export default PostTaskSelectionPage;
