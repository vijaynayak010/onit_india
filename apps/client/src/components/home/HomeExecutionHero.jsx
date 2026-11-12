import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import ExplorePossibilities from "../landing/ExplorePossibilities";
import {
  getHomeDashboardPath,
  getHomePrimaryAction,
  getHomeSessionName,
} from "./homeSession";

/* ─── nav ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Categories",     to: "/services" },
  { label: "How it Works",   to: "/how-it-works" },
  { label: "For Business",   to: "/for-providers" },
  { label: "For Performers", to: "/for-performers" },
];

/* ─── category tabs ────────────────────────────────────────────────── */
const TABS = [
  { id: "growth",     label: "Growth & Marketing" },
  { id: "design",     label: "Design & Creative" },
  { id: "build",      label: "Build & Develop" },
  { id: "ai",         label: "AI Task Brief" },
  { id: "performers", label: "Verified Performers" },
];
const TAB_IDS = TABS.map((t) => t.id);
const AUTO_ADVANCE_MS = 4500;
const TYPEWRITER_SPEED_MS = 30;

/* ─── brief preview data per tab ──────────────────────────────────── */
const BRIEF_DATA = {
  growth: {
    title: "Run a targeted Instagram campaign for my product launch",
    category: "Growth & Marketing",
    skills: "Social Media, Copywriting",
    budget: "₹8k–20k",
    timeline: "5 days",
    deliverables: "10 posts, caption copy, 2 reels",
  },
  design: {
    title: "Design a brand identity kit for my consulting firm",
    category: "Design & Creative",
    skills: "Branding, Figma, Illustrator",
    budget: "₹12k–25k",
    timeline: "7 days",
    deliverables: "Logo, color palette, style guide",
  },
  build: {
    title: "Build a responsive website for my consulting business",
    category: "Build & Develop",
    skills: "Web Development, UI/UX",
    budget: "₹15k–30k",
    timeline: "7 days",
    deliverables: "5 pages, contact form, SEO basics",
  },
  ai: {
    title: "Create an AI-powered lead scoring model for B2B sales",
    category: "AI & Automation",
    skills: "Python, ML, Data Science",
    budget: "₹20k–40k",
    timeline: "10 days",
    deliverables: "Model, integration guide, dashboard",
  },
  performers: {
    title: "Find a verified video editor for my YouTube channel",
    category: "Design & Creative",
    skills: "Video Editing, Premiere Pro",
    budget: "₹5k–12k",
    timeline: "3 days",
    deliverables: "3 edited videos, thumbnails",
  },
};

const AVATARS = [
  { initials: "A", bg: "#F0C6A8" },
  { initials: "R", bg: "#A9CED0" },
  { initials: "K", bg: "#D7E2DE" },
];

/* ─── BriefPreviewCard ─────────────────────────────────────────────── */
function BriefPreviewCard({ brief, animKey, onPostTask }) {
  const [displayedTitle, setDisplayedTitle] = useState("");

  useEffect(() => {
    setDisplayedTitle("");
    let i = 0;
    const title = brief.title;
    const id = setInterval(() => {
      i++;
      setDisplayedTitle(title.slice(0, i));
      if (i >= title.length) clearInterval(id);
    }, TYPEWRITER_SPEED_MS);
    return () => clearInterval(id);
  }, [animKey]);

  const isDone = displayedTitle.length >= brief.title.length;

  const rows = [
    { label: "Category",     value: brief.category },
    { label: "Skills",       value: brief.skills },
    { label: "Budget",       value: brief.budget },
    { label: "Timeline",     value: brief.timeline },
    { label: "Deliverables", value: brief.deliverables },
  ];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl"
      style={{
        background: "linear-gradient(155deg, #FFFFFF 8.49%, #FFFFFF 68.27%, #F9FCFA 91.51%)",
        border: "0.8px solid rgba(20,55,44,0.10)",
        boxShadow: "0px 1px 2px rgba(9,30,23,0.04), 0px 22px 60px rgba(9,30,23,0.09)",
      }}
    >
      {/* shimmer top line */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-px"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* browser chrome */}
      <div
        className="flex items-center justify-between px-7"
        style={{
          height: 56,
          background: "rgba(249,252,250,0.82)",
          borderBottom: "0.8px solid #E4E9E7",
          backdropFilter: "blur(12px)",
        }}
      >
        <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#7A8380" }}>
          ▢ firstdoer.com/post-task
        </span>
        <div className="flex items-center gap-7">
          <span
            className="rounded-full px-3 py-1"
            style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 500, color: "#009966", border: "0.8px solid #D9EEE7" }}
          >
            Brief
          </span>
          {["Budget", "Timeline", "Performers"].map((t) => (
            <span key={t} style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#7A8380" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* body */}
      <div className="flex flex-col md:flex-row">
        {/* left — typewriter */}
        <div
          className="flex flex-col px-6 py-8 md:px-[50px] md:py-[54px] w-full md:w-[47%] border-b md:border-b-0 md:border-r"
          style={{ borderColor: "#E4E9E7" }}
        >
          <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, letterSpacing: "0.72px", color: "#65706D" }}>
            YOUR REQUEST
          </span>
          <h3
            className="mt-[22px]"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(18px, 2.2vw, 26px)",
              fontWeight: 400,
              lineHeight: "1.36",
              letterSpacing: "-0.91px",
              color: "#0B1110",
              minHeight: "3.6em",
            }}
          >
            {displayedTitle}
            {!isDone && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "0.85em",
                  background: "#0B1110",
                  verticalAlign: "middle",
                  marginLeft: 2,
                  borderRadius: 1,
                  animation: "onit-blink 0.65s step-end infinite",
                }}
              />
            )}
          </h3>
          <span className="mt-auto" style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#87908D" }}>
            Structured by FirstDoer AI
          </span>
        </div>

        {/* right — staggered rows */}
        <div className="flex flex-col px-6 py-6 md:px-[48px] md:py-[44px] w-full md:w-[53%]">
          <div className="flex-1">
            {rows.map(({ label, value }, i) => (
              <motion.div
                key={`${animKey}-${label}`}
                initial={{ opacity: 0, x: 18 }}
                animate={isDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
                transition={{ delay: i * 0.13, duration: 0.28, ease: "easeOut" }}
                className="flex items-center"
                style={{ height: 48, borderBottom: "0.8px solid #E4E9E7" }}
              >
                <span className="shrink-0" style={{ width: 125, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#79817F" }}>
                  {label}
                </span>
                <motion.span
                  key={`${animKey}-${label}-v`}
                  initial={{ opacity: 0 }}
                  animate={isDone ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.1 + i * 0.13, duration: 0.22 }}
                  style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, fontWeight: 500, color: "#0B1110" }}
                >
                  {value}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* footer */}
          <motion.div
            key={`${animKey}-footer`}
            initial={{ opacity: 0, y: 10 }}
            animate={isDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: rows.length * 0.13, duration: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-3 pt-6 md:flex-nowrap md:gap-0"
          >
            <div className="flex items-center">
              {AVATARS.map((av, i) => (
                <div
                  key={av.initials}
                  className="flex items-center justify-center rounded-full text-[9px] font-medium"
                  style={{
                    width: 25, height: 25, background: av.bg,
                    border: "1.6px solid #FFFFFF", color: "#23433A",
                    marginLeft: i === 0 ? 0 : -7,
                    position: "relative", zIndex: AVATARS.length - i,
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {av.initials}
                </div>
              ))}
            </div>
            <span className="ml-3 md:ml-4" style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#7A8380" }}>
              3 verified performers matched
            </span>
            <div className="ml-auto">
              <button
                type="button"
                onClick={onPostTask}
                className="rounded-full px-[22px] text-white transition hover:bg-[#008055]"
                style={{ background: "#009966", height: 42, fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 700 }}
              >
                Post Task
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────── */
export default function HomeExecutionHero({ className = "" }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [taskText, setTaskText] = useState("");
  const [activeTab, setActiveTab] = useState("growth");
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);

  const hasRestoredSession = isAuthenticated && Boolean(user);
  const sessionName = getHomeSessionName(user);
  const dashboardPath = getHomeDashboardPath(user);
  const primaryAction = getHomePrimaryAction(user);

  const goToTab = useCallback((id) => {
    setActiveTab(id);
    setAnimKey((k) => k + 1);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const idx = TAB_IDS.indexOf(activeTab);
      goToTab(TAB_IDS[(idx + 1) % TAB_IDS.length]);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [activeTab, goToTab]);

  const handleTabClick = (id) => {
    clearTimeout(timerRef.current);
    goToTab(id);
  };

  const handlePost = () => {
    const text = taskText.trim();
    if (hasRestoredSession) {
      const role = String(user?.role || "").toUpperCase();
      if (role === "PROVIDER") {
        navigate("/provider/post-task-manual", {
          state: { aiGeneratedData: text ? { title: text, description: text } : undefined },
        });
        return;
      }
      navigate(dashboardPath);
      return;
    }
    navigate("/auth", {
      state: { tab: "signup", taskData: text ? { title: text, description: text } : undefined },
    });
  };

  return (
    <>
      <style>{`
        @keyframes onit-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <section
        className={`relative isolate overflow-hidden ${className}`}
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* ── header ─────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-30 w-full h-16 md:h-[88px]"
          style={{
            background: "rgba(255,255,255,0.96)",
            borderBottom: "0.8px solid #EDF0EF",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex h-full items-center justify-center px-4 md:px-6">
            <div className="flex w-full items-center" style={{ maxWidth: 1280 }}>
              <Link to="/" className="relative shrink-0" style={{ width: 92, height: 32 }}>
                <span style={{ position: "absolute", left: 0, top: -0.6, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 21, lineHeight: "32px", letterSpacing: "-0.7px", color: "#0B1110" }}>
                  FirstDoer
                </span>
                <span style={{ position: "absolute", left: 52.67, top: 13.4, fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: 9, lineHeight: "14px", letterSpacing: "3px", color: "#77817E" }}>
                  INDIA
                </span>
              </Link>

              <nav className="hidden lg:flex flex-1 items-center justify-center">
                <div className="flex items-center gap-10">
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.label} to={item.to} className="transition hover:text-[#009966]"
                      style={{ fontFamily: "Manrope, sans-serif", fontSize: 14, color: "#0B1110", lineHeight: "21px" }}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="flex shrink-0 items-center gap-3 md:gap-6 ml-auto lg:ml-0">
                {hasRestoredSession ? (
                  <Link to={dashboardPath} className="hidden md:block max-w-[160px] truncate transition hover:text-[#009966]"
                    style={{ fontFamily: "Manrope, sans-serif", fontSize: 14, color: "#0B1110", lineHeight: "21px" }}>
                    {sessionName}
                  </Link>
                ) : (
                  <Link to="/auth" className="hidden md:block transition hover:text-[#009966]"
                    style={{ fontFamily: "Manrope, sans-serif", fontSize: 14, color: "#0B1110", lineHeight: "21px" }}>
                    Login
                  </Link>
                )}
                <Link
                  to={hasRestoredSession ? primaryAction.path : "/auth"}
                  className="inline-flex items-center rounded-full text-white transition hover:bg-[#008055]"
                  style={{ background: "#009966", padding: "13px 22px", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 13, lineHeight: "20px" }}
                >
                  {hasRestoredSession ? primaryAction.label : "Post a Task"}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* ── hero copy ───────────────────────────────────────────────── */}
        <div className="flex flex-col items-center px-4" style={{ paddingTop: "clamp(48px, 8vw, 112px)" }}>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, letterSpacing: "0.72px", color: "#65706D", lineHeight: "18px", textAlign: "center" }}>
            Made in India · Only verified performers
          </p>

          <div className="relative mt-[26px] text-center">
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "clamp(32px, 5.5vw, 62px)", letterSpacing: "clamp(-1.5px, -0.35vw, -3.73px)", color: "#0B1110", lineHeight: "1.08", display: "inline" }}>
              Post work. Get it{" "}
            </h1>
            <span className="relative inline-block">
              <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "clamp(32px, 5.5vw, 62px)", letterSpacing: "clamp(-1.5px, -0.35vw, -3.73px)", color: "#009966", lineHeight: "1.08" }}>
                executed.
              </span>
              <span className="absolute" style={{ height: 5, bottom: 2, left: 14, right: 0, background: "#009966", opacity: 0.18, borderRadius: 999, transform: "rotate(-1deg)" }} />
            </span>
          </div>

          <p className="mt-[14px] text-center" style={{ fontFamily: "Manrope, sans-serif", fontSize: 18, lineHeight: "30px", color: "#68726F", maxWidth: 509 }}>
            One platform to get marketing, design, and development work done by verified performers.
          </p>

          <div className="mt-10 px-6" style={{ width: "100%", maxWidth: 720 }}>
            <div className="flex items-center" style={{ background: "rgba(255,255,255,0.2)", border: "0.8px solid #EFFAF5", boxShadow: "0px 1px 2px rgba(9,30,23,0.04), 0px 10px 30px rgba(9,30,23,0.07)", borderRadius: 999, padding: "8px 10px" }}>
              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handlePost(); }}
                placeholder="Describe your task, e.g. Design a logo for my startup"
                className="flex-1 bg-transparent focus:outline-none"
                style={{ fontFamily: "Manrope, sans-serif", fontSize: 14, color: "rgba(23,32,30,0.5)", padding: "0 21px", lineHeight: "46px" }}
              />
              <button type="button" onClick={handlePost} className="shrink-0 rounded-full text-white transition hover:bg-[#008055]"
                style={{ background: "#009966", height: 46, minWidth: 148, fontFamily: "Manrope, sans-serif", fontSize: 13, fontWeight: 700 }}>
                Post Task
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 px-4">
            <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#7A8380" }}>Perfect for</span>
            {["Startups", "Agencies", "Growing brands"].map((chip) => (
              <span key={chip} style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 500, color: "#202624", border: "0.8px solid #EBEFED", borderRadius: 999, padding: "6px 12px", lineHeight: "18px" }}>
                {chip}
              </span>
            ))}
          </div>

          <p className="mt-4 text-center" style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#89918F", lineHeight: "18px" }}>
            Free to post. No credit card required.
          </p>
        </div>

        {/* ── brief preview section ───────────────────────────────────── */}
        <div className="flex flex-col items-center px-4 md:px-6" style={{ paddingBottom: "clamp(48px, 8vw, 104px)" }}>
          {/* category tabs */}
          <div
            className="flex items-end justify-center gap-9 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ width: "100%", maxWidth: 1024, marginTop: 40 }}
          >
            {TABS.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className="relative shrink-0 flex flex-col pb-[14px] transition"
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 14,
                    color: active ? "#111716" : "#717A77",
                    lineHeight: "21px",
                    whiteSpace: "nowrap",
                    background: "none",
                    cursor: "pointer",
                    borderBottom: "1.6px solid transparent",
                  }}
                >
                  {tab.label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-[1.6px] rounded-full" style={{ background: "#009966" }} />}
                  {active && (
                    <motion.span
                      key={`progress-${animKey}`}
                      className="absolute bottom-0 left-0 h-[1.6px] rounded-full"
                      style={{ background: "#009966", opacity: 0.35 }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* card */}
          <div style={{ width: "100%", maxWidth: 1024, marginTop: 32 }}>
            <BriefPreviewCard brief={BRIEF_DATA[activeTab]} animKey={animKey} onPostTask={handlePost} />
          </div>
        </div>
      </section>

      <ExplorePossibilities />
    </>
  );
}
