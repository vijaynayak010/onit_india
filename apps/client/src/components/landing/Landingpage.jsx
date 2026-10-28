import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import TrustedBySection from "./TrustedBySection";
import ExploreCategoriesSection from "./ExploreCategoriesSection";
import PostOptionsSection from "./PostOptionsSection";
import VideoSection from "./VideoSection";
import TrustSection from "./TrustSection";
import VerificationSection from "./VerificationSection";
import PerformersSection from "./PerformersSection";
import TestimonialsSection from "./TestimonialsSection";
import FaqSection from "./FaqSection";
import FinalCtaSection from "./FinalCtaSection";
import LandingFooter from "./LandingFooter";
import ExplorePossibilities from "./ExplorePossibilities";
import FindTalentSection from "./FindTalentSection";
import HearFromUsersSection from "./HearFromUsersSection";
import WhateverYouNeedSection from "./WhateverYouNeedSection";

import HomeExecutionHero from "../home/HomeExecutionHero";
import HomeOnitDifferenceSection from "../home/HomeOnitDifferenceSection";
import HomeTalentOpportunityCta from "../home/HomeTalentOpportunityCta";
import {
  Search,
  ArrowRight,
  MessageSquare,
  Cpu,
  FileText,
  X,
  Users,
  TrendingUp,
} from "react-feather";

/**
 * Top SaaS-style Landing Page (single-file React component)
 * - Professional layout hierarchy
 * - Sticky navbar with aligned container
 * - Wider desktop container
 * - Clean hero spacing (no clipping under navbar)
 * - Reusable, structured sections
 */

/* ----------------------------- CONFIG ----------------------------- */

const tabs = [
  { id: "ai", label: "AI Mode", icon: Cpu, description: "AI-powered task matching", newFeature: true, badgeText: "NEW" },
  { id: "post", label: "Post a Task", icon: FileText, description: "Tell us what you need" },
  {
    id: "nearby",
    label: "Nearby Performers",
    icon: Users,
    description: "Find performers near you",
    newFeature: true,
    badgeIcon: TrendingUp,
    badgeText: "TRENDING",
  },
];

// Task Provider app link (matches Footer.jsx)
const TASK_PROVIDER_APP_LINK = "https://play.google.com/store/apps/details?id=com.onitapp.india&pcampaignid=web_share";

const taskTemplates = [
  "Research 10 competitors in my niche",
  "Design a professional logo for my brand",
  "Write a 500-word blog post about AI",
  "Create a financial spreadsheet with formulas",
  "Edit my wedding video highlights",
  "Find leads for B2B companies",
  "Build a responsive landing page",
  "Translate 20 pages to Spanish",
];

const heroChangeWords = ["Task", "Help", "Work"];

const popularCategoryLinks = [
  { label: "Content", to: "/domains/content-design-marketing", anchor: "Content creation and marketing tasks" },
  { label: "Editing", to: "/domains/content-design-marketing", anchor: "Editing and design task help" },
  { label: "Development", to: "/domains/tech-data-admin", anchor: "Tech and development tasks" },
  { label: "Marketing", to: "/domains/content-design-marketing", anchor: "Marketing and growth tasks" },
  { label: "Strategy", to: "/domains/business-operations-research", anchor: "Business strategy and research tasks" },
];

const whoIsItFor = [
  { label: "Students", description: "Assignments, notes, research, and study support." },
  { label: "Startups", description: "Research, content, design, and ops without full-time hires." },
  { label: "Professionals", description: "One-off tasks, admin, and specialist help on demand." },
  { label: "Freelancers", description: "Extra capacity and niche tasks to grow your work." },
];

const recentTasksMock = [
  { id: 1, title: "Research 10 competitors in my niche", category: "Research", time: "2m ago" },
  { id: 2, title: "Design a professional logo for my brand", category: "Design", time: "5m ago" },
  { id: 3, title: "Write a 500-word blog post about AI", category: "Content", time: "12m ago" },
  { id: 4, title: "Edit my wedding video highlights", category: "Editing", time: "18m ago" },
  { id: 5, title: "Build a responsive landing page", category: "Development", time: "25m ago" },
];

/* ----------------------------- PAGE ----------------------------- */

export default function LandingPage({ onTabChange }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const heroPostTaskRef = useRef(null);
  const [activeTab, setActiveTab] = useState("post"); // Default to Post a Task as primary
  const [templateIndex, setTemplateIndex] = useState(0);
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      setTemplateIndex((prev) => (prev + 1) % taskTemplates.length);
    }, 3000);

    const heroTimer = setInterval(() => {
      setHeroWordIndex((prev) => (prev + 1) % heroChangeWords.length);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(heroTimer);
    };
  }, []);

  useEffect(() => {
    if (typeof onTabChange === "function") {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  useEffect(() => {
    if (activeTab !== "ai") return;

    const scrollToAiTop = () => {
      const section = heroPostTaskRef.current;
      if (!section) return;
      section.scrollIntoView({ behavior: "auto", block: "start" });
      // Offset for sticky headers/bars so AI card starts from its top color strip.
      window.scrollBy({ top: -132, left: 0, behavior: "auto" });
    };

    scrollToAiTop();
    const rafId = window.requestAnimationFrame(scrollToAiTop);
    const settleTimer = window.setTimeout(scrollToAiTop, 180);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
    };
  }, [activeTab]);

  const handlePostTask = (details) => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          tab: "signup",
          taskData: {
            title: details,
            description: details
          }
        }
      });
    } else {
      const role = String(user?.role || "").toUpperCase();
      if (role === "PROVIDER") {
        navigate("/provider/post-task-manual", {
          state: {
            aiGeneratedData: {
              title: details,
              description: details
            }
          }
        });
      } else {
        navigate("/auth");
      }
    }
  };

  return (
    <div className="overflow-x-clip bg-white text-[var(--color-text)]">
      <main className="relative overflow-x-clip">
        <HomeExecutionHero />

        <div className="relative space-y-0">
          <TrustedBySection />
          {/* <ExploreCategoriesSection /> */}
          <PostOptionsSection />
          <VideoSection />
          <TrustSection />
          <VerificationSection />
          <PerformersSection />
          <TestimonialsSection />
          <FaqSection />
          <FinalCtaSection />
          {/* <ExplorePossibilities /> */}
          {/* <FindTalentSection /> */}
          {/* <HomeOnitDifferenceSection /> */}
          {/* <WhateverYouNeedSection /> */}
          {/* <HearFromUsersSection /> */}
          <LandingFooter />
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} taskDetails={taskDetails} />
    </div>
  );
}

/* ----------------------------- MODAL ----------------------------- */

function Modal({ isOpen, onClose, taskDetails }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const hasTask = (taskDetails || "").trim().length > 0;
  const canSubmit =
    hasTask &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    mobileNumber.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/submit-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskDetails: (taskDetails || "").trim(),
          name: name.trim(),
          email: email.trim(),
          mobileNumber: mobileNumber.trim(),
        }),
      });

      const text = await response.text();

      if (response.ok) {
        setMessage("Task submitted successfully! Our team will connect with you within 2 min.");
        setTimeout(() => {
          onClose();
          setName("");
          setEmail("");
          setMobileNumber("");
          setMessage("");
        }, 2000);
      } else {
        setMessage(text || "Failed to submit task. Please try again.");
      }
    } catch (err) {
      console.error("Submit task error:", err);
      setMessage("Failed to submit task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white p-6 sm:p-8 shadow-[var(--shadow-xl)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-muted)]">
            <MessageSquare size={32} className="text-[var(--color-primary)]" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-[var(--color-text)]">
            Get Connected Quickly
          </h3>

          <p className="mb-6 text-[var(--color-text-muted)]">
            Enter your details; our team will connect with you within 2 min.
          </p>

          {hasTask && (
            <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-left">
              <p className="text-xs font-medium text-[var(--color-text-muted)] mb-1">Your task</p>
              <p className="text-sm text-[var(--color-text)]">{taskDetails.trim()}</p>
            </div>
          )}

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${message.includes("success") ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" : "bg-red-100 text-red-700"}`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
            />

            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full rounded-xl bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}



/* ----------------------------- HERO ----------------------------- */

function HeroHeader({ heroWordIndex }) {
  return (
    <div className="text-center px-2 sm:px-0 pt-2 sm:pt-3 md:pt-4">
      <motion.h1
        id="page-heading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight text-[var(--color-text)]"
      >
        Get any{" "}
        <span className="relative inline-flex items-center justify-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[140px] h-[1.15em] overflow-hidden bg-transparent">
          <AnimatePresence mode="wait">
            <motion.span
              key={heroWordIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute text-[var(--color-primary)]"
            >
              {heroChangeWords[heroWordIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="invisible" aria-hidden>{heroChangeWords[heroWordIndex]}</span>
        </span>{" "}
        done today.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto mt-4 sm:mt-5 max-w-2xl px-4 sm:px-0 text-base sm:text-lg md:text-xl font-semibold text-[var(--color-text)]"
      >
        The fastest way to get work executed.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="mx-auto mt-3 sm:mt-4 max-w-xl px-4 sm:px-0 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed"
      >
        Trusted performers. Secure payments. Verified work.
      </motion.p>
    </div>
  );
}

function TabSwitcher({ activeTab, setActiveTab, navigate }) {
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Scroll to the nearby performers section on the homepage
    if (tabId === "nearby") {
      navigate("/performers-directory");
      return;
    }
  };

  return (
    <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2 sm:px-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition relative ${active
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:shadow-[var(--shadow-sm)]"
              } ${tab.newFeature ? "ring-2 ring-[var(--color-primary)]/30 ring-offset-2 ring-offset-white" : ""}`}
          >
            <Icon size={12} />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.newFeature && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-primary)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                <span className="inline-flex items-center gap-1">
                  {tab.badgeIcon ? (
                    <tab.badgeIcon size={10} className="text-white" strokeWidth={3} aria-hidden />
                  ) : null}
                  {tab.badgeText || "NEW"}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SearchCard({ templateIndex, onPostTask }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  // True only after the user has typed something (not the rotating example)
  const [userHasEnteredTask, setUserHasEnteredTask] = useState(false);

  useEffect(() => {
    // Show rotating example only when not focused and user hasn't typed anything
    if (!isFocused && !userHasEnteredTask) {
      setInputValue(taskTemplates[templateIndex] || "");
    }
  }, [templateIndex, isFocused, userHasEnteredTask]);

  const handleFocus = () => {
    setIsFocused(true);
    if (!userHasEnteredTask) setInputValue("");
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!inputValue.trim()) {
      setInputValue(taskTemplates[templateIndex] || "");
      setUserHasEnteredTask(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setUserHasEnteredTask(value.trim().length > 0);
  };

  const handlePostClick = () => {
    const trimmed = (inputValue || "").trim();
    if (!trimmed || !userHasEnteredTask) return;
    onPostTask(trimmed);
  };

  const canPostTask = userHasEnteredTask && (inputValue || "").trim().length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2 }}
      className="mt-6 sm:mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)] ring-2 ring-transparent ring-offset-2 ring-offset-[var(--color-surface)] transition-all duration-300 focus-within:ring-[var(--color-primary)]/40 focus-within:shadow-[0_0_0_1px_rgba(5,150,105,0.08),0_20px_40px_-12px_rgba(0,0,0,0.08),0_0_48px_-12px_rgba(5,150,105,0.15)] hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1),0_0_60px_-16px_rgba(5,150,105,0.12)]"
    >
      {/* Animated gradient bar with shine overlay */}
      <div className="relative h-1.5 overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-500 animate-gradient-flow">
        <span
          className="absolute inset-0 z-10 block bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ animation: "task-card-shine 6s ease-in-out infinite" }}
        />
      </div>
      <div className="p-4 sm:p-6 md:p-7">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <motion.h3 variants={itemVariants} className="text-base sm:text-lg font-semibold text-[var(--color-text)]">What do you need help with?</motion.h3>
            <motion.span variants={itemVariants} className="text-xs sm:text-sm text-[var(--color-text-subtle)]">Try these →</motion.span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <motion.label
              variants={itemVariants}
              className="flex flex-1 items-start gap-2 sm:gap-3 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 sm:px-4 py-3 sm:py-4 transition focus-within:border-[var(--color-primary)] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(5,150,105,0.08)]"
            >
              <Search size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
              <input
                aria-label="Describe your task"
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Describe your task..."
                className="w-full bg-transparent text-sm sm:text-base text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none pt-1"
              />
            </motion.label>

            <motion.button
              variants={itemVariants}
              type="button"
              onClick={handlePostClick}
              disabled={!canPostTask}
              whileHover={canPostTask ? { scale: 1.02 } : {}}
              whileTap={canPostTask ? { scale: 0.98 } : {}}
              className="h-auto sm:h-[74px] rounded-xl bg-[var(--color-primary)] px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-glow)] sm:min-w-[160px] inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[var(--shadow-sm)]"
            >
              Post Task <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 sm:px-5 py-3 sm:py-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[var(--color-text-muted)]" />
      </motion.div>
    </motion.div>
  );
}

function CategoryChips() {
  return (
    <section className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <span className="mr-1 text-sm text-[var(--color-text-subtle)]">Popular:</span>
      {popularCategoryLinks.map((cat) => (
        <Link
          key={cat.label}
          to={cat.to}
          title={cat.anchor}
          className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)]"
        >
          {cat.label}
        </Link>
      ))}
    </section>
  );
}

function Stats() {
  const stats = [
    { number: "10K+", label: "Performers" },
    { number: "50K+", label: "Tasks completed" },
    { number: "100+", label: "Community partners" },
  ];

  return (
    <section className="mt-8 border-t border-[var(--color-border)] pt-8 pb-4">
      <div className="flex flex-wrap justify-center gap-10 sm:gap-16 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{s.number}</div>
            <div className="mt-1 text-xs sm:text-sm text-[var(--color-text-muted)]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
