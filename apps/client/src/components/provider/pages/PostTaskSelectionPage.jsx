import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PenTool,
  Sparkles,
  ChevronRight,
  Home,
  ArrowRight,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";

const PostTaskSelectionPage = () => {
  const navigate = useNavigate();

  const options = [
    {
      key: "manual",
      title: "Post Manually",
      subtitle: "Create your task step by step",
      detail: "Have Full Control over Task Description",
      icon: PenTool,
      accent: "from-[#3d7cf8] to-[#2577d4]",
      ring: "ring-sky-200/60",
      to: "/provider/post-task-manual",
      cta: "Post Manually",
    },
    {
      key: "ai",
      title: "Post Task using AI",
      subtitle: "Let AI help you",
      detail: "Let AI Generate Task Description",
      icon: Sparkles,
      accent: "from-[#2279d9] to-[#2078d1]",
      ring: "ring-[#29ADAC]/30",
      to: "/provider/post-task-ai",
      cta: "Post Using AI",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-surface)] pt-[80px] font-sans antialiased">
      <ProviderHeader />

      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5, 150, 105, 0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(5, 150, 105, 0.05), transparent 45%), radial-gradient(ellipse 50% 35% at 0% 60%, rgba(14, 165, 233, 0.06), transparent 45%)",
        }}
      />

      <div className="border-b border-[var(--color-border)] bg-[#f3fdf7]">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4 text-sm sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/provider/dashboard")}
            className="inline-flex items-center gap-2 font-semibold text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
          >
            <Home className="h-4 w-4" strokeWidth={2.25} />
            Home
          </button>
          <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
          <span className="font-bold text-[var(--color-primary)]">Post Task</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center sm:mb-12"
        >
          <h1 className="mb-3 text-4xl font-extrabold text-[var(--color-text)] sm:text-[46px]">
            Post a Task
          </h1>
          <p className="mx-auto max-w-xl text-lg font-medium leading-relaxed text-[var(--color-text-muted)] sm:text-xl">
            Choose how you&apos;d like to create you tasks
          </p>
        </motion.div>

        <div className="grid w-full max-w-[880px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {options.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.div
                key={opt.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={`relative flex min-h-[328px] flex-col overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-white p-8 text-left shadow-[0_22px_44px_rgba(15,23,42,0.12)] ring-1 ${opt.ring} transition hover:border-[var(--color-primary)]/25 hover:shadow-[0_28px_54px_rgba(15,23,42,0.16)] sm:p-10`}
              >
                <div
                  className={`relative mb-14 flex h-20 w-20 items-center justify-center rounded-[18px] bg-gradient-to-br text-white shadow-lg ${opt.accent}`}
                >
                  <Icon className="h-8 w-8" strokeWidth={2.25} aria-hidden />
                </div>
                <h2 className="relative mb-3 text-3xl font-extrabold text-[var(--color-text)] sm:text-[32px]">
                  {opt.title}
                </h2>
                <p className="relative mb-4 text-xl font-medium text-[var(--color-text-muted)]">{opt.subtitle}</p>
                <p className="relative mb-10 text-base font-medium leading-relaxed text-[var(--color-text-subtle)]">{opt.detail}</p>
                <button
                  type="button"
                  onClick={() => navigate(opt.to)}
                  className="group relative mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2677d7] px-8 py-4 text-base font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[#1f68bf] active:scale-[0.98] sm:w-auto"
                >
                  {opt.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2.5} />
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mt-12 max-w-lg text-center sm:mt-16"
        >
          <p className="text-3xl font-bold text-[var(--color-text-muted)]">Not sure which to choose?</p>
          <p className="mt-4 text-2xl font-semibold leading-relaxed text-[var(--color-text-muted)]">
            Use AI for quick posting, Manual for full customization.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default PostTaskSelectionPage;
