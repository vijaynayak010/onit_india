import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./firstdoer.css";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.onitapp.india&pcampaignid=web_share";

const briefs = [
  {
    label: "Growth & Marketing",
    req: "Run a targeted Instagram campaign for my product",
    rows: [
      ["Category", "Growth & Marketing"],
      ["Skills", "Social Media, Copywriting"],
      ["Budget", "₹8k–20k"],
      ["Timeline", "5 days"],
      ["Deliverables", "10 posts, caption copy, 2 reels"]
    ]
  },
  {
    label: "Design & Creative",
    req: "Find a verified video editor for my YouTube channel",
    rows: [
      ["Category", "Design & Creative"],
      ["Skills", "Video Editing, Premiere Pro"],
      ["Budget", "₹5k–12k"],
      ["Timeline", "3 days"],
      ["Deliverables", "3 edited videos, thumbnails"]
    ]
  },
  {
    label: "Build & Develop",
    req: "Build a responsive website for my consulting business",
    rows: [
      ["Category", "Build & Develop"],
      ["Skills", "Web Development, UI/UX"],
      ["Budget", "₹15k–30k"],
      ["Timeline", "7 days"],
      ["Deliverables", "5 pages, contact form, SEO basics"]
    ]
  }
];

const htabs = ["Growth & Marketing", "Design & Creative", "Build & Develop", "AI Checklist", "Trust Score"];

const logoStyles = [
  "font-family:'Poppins',sans-serif;font-style:italic;font-size:30px",
  "font-weight:700;letter-spacing:-0.04em",
  "font-family:'Poppins',sans-serif;letter-spacing:.24em;font-size:20px;font-weight:600",
  "font-weight:500;letter-spacing:-0.03em",
  "font-family:'Poppins',sans-serif;font-size:30px"
];
const oneLogos = ["Kalpanimbus", "Tarang", "VERVE", "saffronpay", "Northwind"].map((n, i) => ({
  name: n,
  st: logoStyles[i]
}));
const logos = [...oneLogos, ...oneLogos];

const skillList = [
  "Social Media",
  "Copywriting",
  "Branding",
  "Figma",
  "UI/UX Design",
  "Web Design",
  "App Development",
  "Performance Marketing",
  "Content Writing",
  "Graphic Design",
  "Illustrator",
  "Reels Editing"
];
const skills = [...skillList, ...skillList];

const avs = [
  { background: "#7EDEDD", color: "#032120" },
  { background: "#FFEE8C", color: "#41390B" },
  { background: "#CAF0C1", color: "#183E0F" },
  { background: "#87E4DB", color: "#0E3E3A" },
  { background: "#C6F0F0", color: "#083B3A" }
];

const perf = [
  { name: "Ananya", role: "UI/UX & Web Design", trust: 98, tasks: 126 },
  { name: "Kamala", role: "Content Writing", trust: 97, tasks: 94 },
  { name: "Avi", role: "App Development", trust: 96, tasks: 112 },
  { name: "Abhi", role: "Performance Marketing", trust: 95, tasks: 87 },
  { name: "Avni", role: "Graphic Design", trust: 94, tasks: 103 }
].map((p, i) => ({ ...p, i: p.name[0], av: avs[i % avs.length] }));

const perf2 = [
  { name: "Rohan", role: "Video Editing", trust: 97, tasks: 118 },
  { name: "Priya", role: "Social Media", trust: 96, tasks: 99 },
  { name: "Karthik", role: "SEO & Growth", trust: 95, tasks: 81 },
  { name: "Meera", role: "Branding", trust: 95, tasks: 92 },
  { name: "Arjun", role: "Web Development", trust: 94, tasks: 107 }
].map((p, i) => ({ ...p, i: p.name[0], av: avs[(i + 2) % avs.length] }));

const perfChips = [...perf, ...perf];
const perfChips2 = [...perf2, ...perf2];

const categories = [
  { n: "01", t: "Growth & Marketing", to: "/domains/content-design-marketing" },
  { n: "02", t: "Design & Creative", to: "/domains/content-design-marketing" },
  { n: "03", t: "Build & Develop", to: "/domains/tech-data-admin" }
];

const tabDefs = [
  { short: "Conversation", title: "Chat in one place", desc: "One thread for all feedback." },
  { short: "Progress", title: "Live progress", desc: "Every step, live." },
  { short: "Deliverables", title: "Review & approve", desc: "Approve, then release payment." }
];

const convos = [
  ["Looks great! Can you add a bit more energy to the cuts?", "Sure, will send the updated version by EOD.", "RO"],
  ["Can we try the logo in a darker teal?", "On it. Two new options in an hour.", "ME"],
  ["The contact form is not sending on mobile.", "Fixed it. Please check once now.", "AR"],
  ["Can the reel go live on Friday at 7 pm?", "Done. It is scheduled for Friday, 7 pm.", "PR"],
  ["Please keep the blog under 800 words.", "Got it. Sharing the shorter draft now.", "KA"],
  ["Is the login screen ready for review?", "Yes! Sending you the test link.", "AV"]
];

const steps = [
  {
    n: "01",
    t: "Post your task",
    d: "AI, manual or template.",
    badge: "Posted",
    badgeSt: { background: "#DFF7F6", color: "#10605F" },
    top: "96px",
    bars: [true, false, false],
    rows: [
      { k: "Brief", v: "Ready", st: { color: "#007A52" } },
      { k: "AI checklist", v: "8 steps", st: { color: "#007A52" } },
      { k: "Deadlines", v: "Set", st: { color: "#007A52" } }
    ]
  },
  {
    n: "02",
    t: "Choose your performer",
    d: "Pick an applicant or invite one.",
    badge: "3 applicants",
    badgeSt: { background: "#DFF7F6", color: "#10605F" },
    top: "124px",
    bars: [true, true, false],
    rows: [
      { k: "Ananya · ★ 4.9", v: "Trust 98", st: { color: "#007A52" } },
      { k: "Rohan · ★ 4.8", v: "Trust 96", st: { color: "#007A52" } },
      { k: "Meera · ★ 4.9", v: "Trust 95", st: { color: "#007A52" } }
    ]
  },
  {
    n: "03",
    t: "Pay & track",
    d: "Pay when you post. Release when it’s done.",
    badge: "In progress",
    badgeSt: { background: "#E6F5F0", color: "#005C3D" },
    top: "152px",
    bars: [true, true, true],
    rows: [
      { k: "Payment", v: "Held safely", st: { color: "#007A52" } },
      { k: "Progress", v: "Step 2 of 3", st: { color: "#934A0C" } },
      { k: "Your approval", v: "Releases payment", st: { color: "#56615E" } }
    ]
  }
];

const faqDefs = [
  { q: "How do I post a task?", a: "Use AI, fill it in yourself, or start from a template. Set your budget and post." },
  { q: "How are performers verified?", a: "ID-checked, past projects approved by firstDoer, and shown with a trust score and star rating." },
  { q: "When do I pay?", a: "When you post. We hold the money and release it only after you approve the final work." },
  { q: "What if my task is cancelled?", a: "Your money goes back to your firstDoer wallet for your next task." },
  { q: "Can I choose who works on my task?", a: "Yes. Pick from performers who apply, or invite one directly." },
  { q: "How do I track progress?", a: "Live in the app: checklist, chat and files in one place." }
];

const footCols = [
  {
    h: "Categories",
    links: [
      { label: "Growth & Marketing", to: "/domains/content-design-marketing" },
      { label: "Design & Creative", to: "/domains/content-design-marketing" },
      { label: "Build & Develop", to: "/domains/tech-data-admin" },
      { label: "All Categories", to: "/tasks" }
    ]
  },
  {
    h: "Platform",
    links: [
      { label: "How it Works", href: "#steps" },
      { label: "Live Tracking", href: "#how" },
      { label: "Why firstDoer", href: "#why" },
      { label: "Verified Performers", to: "/performers-directory" }
    ]
  },
  {
    h: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Careers", to: "/careers" },
      { label: "Contact Support", to: "/contact" }
    ]
  },
  {
    h: "Legal",
    links: [
      { label: "Terms & Conditions", to: "/terms-and-conditions" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Refund Policy", to: "/refund-policy" },
      { label: "Trust & Safety", to: "/trust-safety" }
    ]
  },
  {
    h: "Support",
    links: [
      { label: "Help & FAQ", href: "#faq" },
      { label: "Dispute Resolution", to: "/policies/dispute-resolution" },
      { label: "Pricing Overview", to: "/pricing" }
    ]
  }
];

export default function Landingpage({ onTabChange }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // State
  const [cat, setCat] = useState(0);
  const [tab, setTab] = useState(0);
  const [faq, setFaq] = useState(0);
  const [cyc, setCyc] = useState(0);
  const [activeNav, setActiveNav] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [taskQuery, setTaskQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  const heroTimerRef = useRef(null);
  const liveTabTimerRef = useRef(null);
  const chatTimerRef = useRef(null);
  const placeholderTimerRef = useRef(null);
  const isHeroPausedRef = useRef(false);

  // Sync tab change prop
  useEffect(() => {
    if (typeof onTabChange === "function") {
      onTabChange(htabs[cat]);
    }
  }, [cat, onTabChange]);

  // Hero Auto-Cycle
  const startHeroTimer = useCallback((currentCat) => {
    if (heroTimerRef.current) clearTimeout(heroTimerRef.current);
    if (isHeroPausedRef.current) return;
    heroTimerRef.current = setTimeout(() => {
      setCat((prev) => (prev + 1) % 5);
    }, 7000);
  }, []);

  useEffect(() => {
    startHeroTimer(cat);
    return () => {
      if (heroTimerRef.current) clearTimeout(heroTimerRef.current);
    };
  }, [cat, startHeroTimer]);

  // Live Tracking Tab Timer (6 seconds)
  useEffect(() => {
    liveTabTimerRef.current = setInterval(() => {
      setTab((prev) => (prev + 1) % 3);
    }, 6000);
    return () => {
      if (liveTabTimerRef.current) clearInterval(liveTabTimerRef.current);
    };
  }, []);

  // Chat Cycle Timer (6 seconds)
  useEffect(() => {
    chatTimerRef.current = setInterval(() => {
      setCyc((prev) => (prev + 1) % convos.length);
    }, 6000);
    return () => {
      if (chatTimerRef.current) clearInterval(chatTimerRef.current);
    };
  }, []);

  // Animated Placeholder typewriter
  useEffect(() => {
    const prompts = [
      "Find a performer to build a responsive website for my bakery",
      "Find a performer to run an Instagram campaign for my product",
      "Find a performer to design a logo for my café",
      "Find a performer to edit 10 reels for my brand"
    ];
    let pIdx = 0;
    let charIdx = 0;
    let dir = 1;

    const step = () => {
      const txt = prompts[pIdx];
      setPlaceholder(txt.slice(0, charIdx) + (dir > 0 && charIdx < txt.length ? "|" : ""));
      let wait = 45;
      if (dir > 0) {
        if (charIdx < txt.length) {
          charIdx++;
        } else {
          dir = -1;
          wait = 2000;
        }
      } else if (charIdx > 0) {
        charIdx--;
        wait = 20;
      } else {
        dir = 1;
        pIdx = (pIdx + 1) % prompts.length;
        wait = 450;
      }
      placeholderTimerRef.current = setTimeout(step, wait);
    };

    placeholderTimerRef.current = setTimeout(step, 800);
    return () => {
      if (placeholderTimerRef.current) clearTimeout(placeholderTimerRef.current);
    };
  }, []);

  // Scrollspy & Scroll progress
  useEffect(() => {
    const sections = ["categories", "how", "why", "steps", "faq"];

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setScrollProgress(progress);

      if (scrollY < 180) {
        setActiveNav("");
        return;
      }

      let current = "";
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            current = sections[i];
            break;
          }
        }
      }
      setActiveNav(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Task post action handler
  const handlePostTask = (prefill) => {
    const textToSubmit = (prefill || taskQuery || placeholder.replace(/\|$/, "")).trim();
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          tab: "signup",
          taskData: {
            title: textToSubmit,
            description: textToSubmit
          }
        }
      });
    } else {
      const role = String(user?.role || "").toUpperCase();
      if (role === "PROVIDER") {
        navigate("/provider/post-task-manual", {
          state: {
            aiGeneratedData: {
              title: textToSubmit,
              description: textToSubmit
            }
          }
        });
      } else {
        navigate("/auth");
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handlePostTask();
  };

  const currentBrief = briefs[cat < 3 ? cat : 0];
  const currentConvo = convos[cyc % convos.length];
  const stepOn = cat < 3 ? 0 : cat === 3 ? 2 : 3;

  return (
    <div className="fd-root">
      {/* STICKY HEADER */}
      <header style={{ position: "sticky", top: "12px", zIndex: 50, padding: "0 clamp(16px, 3.5vw, 48px)", height: 0, width: "100%" }}>
        <nav
          className="navshrink"
          aria-label="Main"
          style={{
            position: "relative",
            margin: "14px auto 0",
            maxWidth: "1480px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            padding: "10px 14px 10px 24px",
            borderRadius: "999px",
            border: "1px solid #E4E7E6",
            background: "rgba(255,255,255,.92)",
            WebkitBackdropFilter: "blur(16px)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 16px rgba(0,20,13,.06)"
          }}
        >
          <a href="#top" aria-label="firstDoer home" style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "#0D1210" }}>
            <span style={{ fontSize: "21px", fontWeight: 600, letterSpacing: "-0.04em" }}>firstDoer</span>
          </a>

          <div className="navmid" style={{ display: "flex", alignItems: "center", gap: "2px", flexWrap: "wrap", fontSize: "14px" }}>
            <a href="#categories" className={`navlink ${activeNav === "categories" ? "active" : ""}`} style={{ padding: "8px 14px", borderRadius: "999px" }}>
              Categories
            </a>
            <a href="#how" className={`navlink ${activeNav === "how" ? "active" : ""}`} style={{ padding: "8px 14px", borderRadius: "999px" }}>
              Live Tracking
            </a>
            <a href="#why" className={`navlink ${activeNav === "why" ? "active" : ""}`} style={{ padding: "8px 14px", borderRadius: "999px" }}>
              Why firstDoer
            </a>
            <a href="#steps" className={`navlink ${activeNav === "steps" ? "active" : ""}`} style={{ padding: "8px 14px", borderRadius: "999px" }}>
              How it Works
            </a>
            <a href="#faq" className={`navlink ${activeNav === "faq" ? "active" : ""}`} style={{ padding: "8px 14px", borderRadius: "999px" }}>
              FAQ
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="navlink navlogin"
              style={{ padding: "8px 14px", borderRadius: "999px", fontSize: "14px", border: 0, background: "transparent", cursor: "pointer" }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handlePostTask()}
              className="btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 20px",
                borderRadius: "999px",
                background: "#0D1210",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 500,
                border: 0,
                cursor: "pointer"
              }}
            >
              <span className="roll">
                <span>Post a Task</span>
                <span aria-hidden="true">Post a Task</span>
              </span>
            </button>
          </div>

          <span
            aria-hidden="true"
            className="sprog"
            style={{
              position: "absolute",
              left: "28px",
              right: "28px",
              bottom: "-1px",
              height: "2px",
              borderRadius: "999px",
              background: "#29ADAC",
              transformOrigin: "left",
              transform: `scaleX(${scrollProgress})`,
              transition: "transform .1s linear"
            }}
          />
        </nav>
      </header>

      <section id="top" style={{ padding: 0 }} />

      {/* HERO SECTION */}
      <div className="hero-bg" style={{ position: "relative", width: "calc(100% - 48px)", margin: "10px 24px 0", overflow: "hidden", borderRadius: "32px" }}>
        <svg className="hx-bg h-ribbon" style={{ position: "absolute", right: "-10%", top: "4%", width: "80%", height: "70%", pointerEvents: "none" }} viewBox="0 0 900 700" fill="none" aria-hidden="true">
          <path d="M120 520C120 380 230 270 370 270s250 110 360 250c110 140 220 160 300 60" stroke="currentColor" strokeWidth="70" strokeLinecap="round" />
          <path d="M760 180C620 180 540 280 470 400S330 600 210 600 40 500 80 400" stroke="currentColor" strokeWidth="44" strokeLinecap="round" opacity=".7" />
        </svg>

        <div className="hx-text" style={{ position: "relative", width: "100%", margin: "0 auto", padding: "82px 48px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <p className="fadein h-sub" style={{ margin: 0, fontSize: "14px" }}>
            Verified performers only
          </p>
          <h1
            className="h-title"
            style={{
              margin: "12px 0 0",
              fontSize: "clamp(40px, 5.8vw, 84px)",
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: "-0.055em",
              fontFamily: "Arial, sans-serif"
            }}
          >
            <span className="line">
              <span className="li" style={{ animationDelay: ".05s" }}>
                Post your task. Get it <span>done.</span>
              </span>
            </span>
          </h1>
          <p className="fadein h-sub" style={{ margin: "14px 0 0", maxWidth: "780px", width: "100%", fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.5 }}>
            Post marketing, design or development work in seconds.
            <br />
            Pay only when it’s done.
          </p>

          <form
            id="post"
            onSubmit={handleFormSubmit}
            className="fadein h-form"
            style={{ width: "100%", maxWidth: "760px", marginTop: "22px", display: "flex", alignItems: "center", gap: "8px", padding: "8px 8px 8px 24px", borderRadius: "999px" }}
          >
            <label htmlFor="taskq" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              Describe your task
            </label>
            <input
              id="taskq"
              type="text"
              value={taskQuery}
              onChange={(e) => setTaskQuery(e.target.value)}
              placeholder={placeholder || "Find a performer to build a responsive website for my bakery"}
              style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", font: "inherit", fontSize: "16px", padding: "12px 0" }}
            />
            <button
              type="submit"
              className="btn h-cta"
              style={{ flex: "none", border: 0, cursor: "pointer", padding: "14px 26px", borderRadius: "999px", font: "inherit", fontSize: "15px", fontWeight: 500 }}
            >
              <span className="roll">
                <span>Post Task</span>
                <span aria-hidden="true">Post Task</span>
              </span>
            </button>
          </form>

          <div className="fadein" style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px", fontSize: "13px" }}>
            <span className="h-sub">Perfect for</span>
            <span className="h-chip">Startups</span>
            <span className="h-chip">Agencies</span>
            <span className="h-chip">Growing brands</span>
            <span className="h-chip">Small businesses</span>
          </div>
          <p className="fadein h-sub" style={{ margin: "8px 0 0", fontSize: "13px" }}>
            Post with AI, manually or from a template.
          </p>
        </div>

        {/* HERO WINDOW / INTERACTIVE TABS */}
        <div style={{ position: "relative", width: "100%", margin: 0, padding: "22px 48px 56px" }}>
          <div
            role="tablist"
            aria-label="See firstDoer in action"
            className="h-tabs"
            style={{ display: "flex", flexWrap: "nowrap", justifyContent: "safe center", gap: "20px", overflowX: "auto", scrollbarWidth: "none" }}
          >
            {htabs.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={i === cat}
                onClick={() => setCat(i)}
                className={`h-tab ${i === cat ? "on" : ""}`}
                style={{ flex: "none", whiteSpace: "nowrap", border: 0, background: "transparent", cursor: "pointer", font: "inherit", fontSize: "15px", padding: "8px 4px" }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className="h-win"
            onPointerEnter={() => {
              isHeroPausedRef.current = true;
              if (heroTimerRef.current) clearTimeout(heroTimerRef.current);
            }}
            onPointerLeave={() => {
              isHeroPausedRef.current = false;
              startHeroTimer(cat);
            }}
            style={{ marginTop: "16px", borderRadius: "24px", overflow: "hidden", width: "100%" }}
          >
            <div className="h-bar" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "14px 20px" }}>
              <span className="mono h-url" style={{ fontSize: "12px" }}>
                firstdoer.com/post-task
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", fontSize: "13px" }}>
                {["Brief", "Budget", "Checklist", "Performers"].map((l, i) => (
                  <span key={l} className={`h-step ${i === stepOn ? "on" : ""}`} style={{ padding: "5px 12px", borderRadius: "999px" }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-stack">
              {/* CATEGORY BRIEFS (0, 1, 2) */}
              {cat < 3 && (
                <div key={cat} className="panelin hp">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}>
                    <div style={{ padding: "28px" }}>
                      <div className="mono h-lab" style={{ fontSize: "11px", letterSpacing: ".14em" }}>
                        YOUR REQUEST
                      </div>
                      <p className="h-q" style={{ margin: "12px 0 0", minHeight: "68px", fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.3, fontWeight: 500, letterSpacing: "-0.02em" }}>
                        <span className="tw on">
                          {currentBrief.req.split("").map((ch, idx) => (
                            <span key={idx} className="c" style={{ animationDelay: `${350 + idx * 26}ms` }}>
                              {ch}
                            </span>
                          ))}
                          <span className="cur" style={{ animationDelay: `${350 + currentBrief.req.length * 26}ms` }} />
                        </span>
                      </p>
                      <div className="h-ai rv2" style={{ marginTop: "18px", fontSize: "13px", fontWeight: 500, animationDelay: `${350 + currentBrief.req.length * 26 + 400 + 4 * 550 + 450}ms` }}>
                        Structured by firstDoer AI
                      </div>
                    </div>

                    <dl className="h-dl" style={{ margin: 0, padding: "12px 28px" }}>
                      {currentBrief.rows.map((r, j) => {
                        const te = 350 + currentBrief.req.length * 26 + 400;
                        const delay = te + j * 550;
                        const skWidths = [62, 74, 40, 30, 86];
                        return (
                          <div key={r[0]} className="h-row" style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "12px", padding: "12px 0" }}>
                            <dt className="h-dt" style={{ fontSize: "13px" }}>
                              {r[0]}
                            </dt>
                            <dd className="h-dd" style={{ margin: 0, fontSize: "14px", fontWeight: 500, position: "relative", minHeight: "20px" }}>
                              <span className="sk" style={{ width: `${skWidths[j % 5]}%`, animationDelay: `0ms, ${delay}ms` }} />
                              <span className="rv2" style={{ animationDelay: `${delay}ms` }}>
                                {r[1]}
                              </span>
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>

                  <div className="h-foot" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ display: "flex", gap: "4px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "999px", background: "#7EDEDD", color: "#032120", fontSize: "11px", fontWeight: 600 }}>A</span>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "999px", background: "#FFEE8C", color: "#41390B", fontSize: "11px", fontWeight: 600 }}>R</span>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "999px", background: "#CAF0C1", color: "#183E0F", fontSize: "11px", fontWeight: 600 }}>K</span>
                      </span>
                      <span className="h-dt rv2" style={{ fontSize: "13px", animationDelay: `${350 + currentBrief.req.length * 26 + 400 + 4 * 550 + 750}ms` }}>
                        3 verified performers matched
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePostTask(currentBrief.req)}
                      className="btn h-cta"
                      style={{ padding: "10px 20px", borderRadius: "999px", fontSize: "14px", fontWeight: 500, border: 0, cursor: "pointer" }}
                    >
                      <span className="roll">
                        <span>Post Task</span>
                        <span aria-hidden="true">Post Task</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* AI CHECKLIST (tab 3) */}
              {cat === 3 && (
                <div key="ai-check" className="panelin hp">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}>
                    <div style={{ padding: "28px" }}>
                      <div className="mono h-lab" style={{ fontSize: "11px", letterSpacing: ".14em" }}>
                        AI CHECKLIST
                      </div>
                      <p className="h-q" style={{ margin: "12px 0 0", fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.3, fontWeight: 500, letterSpacing: "-0.02em" }}>
                        Tell us your budget and needs. We’ll list every step.
                      </p>
                      <div className="h-ai" style={{ marginTop: "18px", fontSize: "13px", fontWeight: 500 }}>
                        Checklist ready
                      </div>
                    </div>
                    <div style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div className="h-plan" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "14px" }}>
                        <span className="mono h-ai" style={{ fontSize: "13px", fontWeight: 600 }}>1</span>
                        <span className="h-dd" style={{ fontSize: "15px", fontWeight: 500 }}>Wireframes &amp; sitemap</span>
                      </div>
                      <div className="h-plan" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "14px" }}>
                        <span className="mono h-ai" style={{ fontSize: "13px", fontWeight: 600 }}>2</span>
                        <span className="h-dd" style={{ fontSize: "15px", fontWeight: 500 }}>Build &amp; mobile check</span>
                      </div>
                      <div className="h-plan" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "14px" }}>
                        <span className="mono h-ai" style={{ fontSize: "13px", fontWeight: 600 }}>3</span>
                        <span className="h-dd" style={{ fontSize: "15px", fontWeight: 500 }}>Launch &amp; handover</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-foot" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 28px" }}>
                    <span className="h-dt" style={{ fontSize: "13px" }}>Nothing missed. Ready to post.</span>
                    <button
                      type="button"
                      onClick={() => handlePostTask()}
                      className="btn h-cta"
                      style={{ padding: "10px 20px", borderRadius: "999px", fontSize: "14px", fontWeight: 500, border: 0, cursor: "pointer" }}
                    >
                      <span className="roll">
                        <span>Post Task</span>
                        <span aria-hidden="true">Post Task</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* TRUST SCORE & PERFORMER PREVIEW (tab 4) */}
              {cat === 4 && (
                <div key="trust-score" className="panelin hp">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}>
                    <div style={{ padding: "28px" }}>
                      <div className="mono h-lab" style={{ fontSize: "11px", letterSpacing: ".14em" }}>
                        KNOW WHO YOU HIRE
                      </div>
                      <p className="h-q" style={{ margin: "12px 0 0", fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.3, fontWeight: 500, letterSpacing: "-0.02em" }}>
                        Every performer shows a trust score and a star rating, so you pick with confidence.
                      </p>
                    </div>
                    <div style={{ padding: "20px 28px 28px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", background: "#7EDEDD", color: "#032120", fontWeight: 600 }}>
                          A
                        </span>
                        <div>
                          <div className="h-dd" style={{ fontSize: "15px", fontWeight: 600 }}>Ananya</div>
                          <div className="h-dt" style={{ fontSize: "13px" }}>Web Design · Projects reviewed by firstDoer</div>
                        </div>
                        <span className="h-ok" style={{ marginLeft: "auto", padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 }}>
                          Verified
                        </span>
                      </div>
                      <div className="h-row" style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
                        <span className="h-dt" style={{ fontSize: "14px" }}>Trust score</span>
                        <span className="h-okt" style={{ fontSize: "14px", fontWeight: 600 }}>98</span>
                      </div>
                      <div className="h-row" style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
                        <span className="h-dt" style={{ fontSize: "14px" }}>Star rating</span>
                        <span className="h-dd" style={{ fontSize: "14px", fontWeight: 600 }}>4.9 ★</span>
                      </div>
                      <div className="h-row" style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
                        <span className="h-dt" style={{ fontSize: "14px" }}>Tasks completed</span>
                        <span className="h-dd" style={{ fontSize: "14px", fontWeight: 600 }}>126</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-foot" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px 28px" }}>
                    <span className="h-dt" style={{ fontSize: "13px" }}>Only approved performers can apply</span>
                    <button
                      type="button"
                      onClick={() => handlePostTask()}
                      className="btn h-cta"
                      style={{ padding: "10px 20px", borderRadius: "999px", fontSize: "14px", fontWeight: 500, border: 0, cursor: "pointer" }}
                    >
                      <span className="roll">
                        <span>Post Task</span>
                        <span aria-hidden="true">Post Task</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TRUSTED BY BUSINESSES MARQUEE */}
      <section aria-label="Trusted by growing businesses" style={{ width: "calc(100% - 20px)", margin: "0 10px", padding: "32px 0 72px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        <span className="mono" style={{ flex: "none", fontSize: "12px", letterSpacing: ".06em", color: "#56615E" }}>
          Businesses getting work done on firstDoer
        </span>
        <div className="mqwrap fadex" style={{ flex: "1 1 400px", minWidth: 0, overflow: "hidden" }}>
          <div className="px-xr">
            <div className="mqx">
              {logos.map((l, idx) => (
                <span key={idx} style={{ flex: "none", padding: "0 36px", fontSize: "26px", color: "#74817C", whiteSpace: "nowrap" }}>
                  {l.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES BENTO GRID (#categories) */}
      <section id="categories" style={{ position: "relative", width: "calc(100% - 20px)", margin: "0 10px", color: "#0D1210", padding: "80px 48px 120px", backgroundColor: "#1A6E6E", borderRadius: "40px" }}>
        <div style={{ width: "100%", margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", gap: "20px" }}>
          {/* Card A: Whatever you need */}
          <article className="rvs" style={{ position: "relative", overflow: "hidden", minHeight: "420px", borderRadius: "28px", padding: "36px", background: "#FFFFFF", border: "1px solid #C6F0F0", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "stretch", textAlign: "left" }}>
            <div>
              <h2 className="mw on" style={{ margin: 0, fontSize: "clamp(26px, 2.6vw, 34px)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.045em", color: "#0D1210" }}>
                Whatever you need,
                <br />
                get it done.
              </h2>
              <p style={{ margin: "12px 0 0", fontSize: "15px", color: "#3F4A47" }}>
                Marketing, design and development. Done right.
              </p>
            </div>

            <div className="ex-sq" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
              {categories.map((c) => (
                <Link
                  key={c.n}
                  to={c.to}
                  className="lift"
                  style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px", minHeight: "160px", padding: "18px", borderRadius: "16px", background: "#EFFBFB", border: "1px solid #C6F0F0", color: "#0D1210", textAlign: "left" }}
                >
                  <span style={{ fontSize: "48px", lineHeight: 1, fontWeight: 600, letterSpacing: "-0.05em", color: "#29ADAC" }}>{c.n}</span>
                  <span style={{ fontSize: "17px", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em" }}>{c.t}</span>
                </Link>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px", width: "100%" }}>
              <div className="mqwrap fadex" style={{ flex: 1, minWidth: 0, overflow: "hidden", padding: "4px 0" }}>
                <div className="mqx fast">
                  {skills.map((s, idx) => (
                    <span key={idx} style={{ flex: "none", marginRight: "8px", padding: "7px 12px", borderRadius: "999px", background: "#E1F8F6", border: "1px solid #B1EDE8", fontSize: "13px", color: "#176860", whiteSpace: "nowrap" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handlePostTask()}
                className="btn"
                style={{ flex: "none", display: "inline-flex", alignItems: "center", padding: "11px 20px", borderRadius: "999px", background: "#0D1210", color: "#FFFFFF", fontSize: "14px", fontWeight: 500, border: 0, cursor: "pointer" }}
              >
                <span className="roll">
                  <span>Post a Task</span>
                  <span aria-hidden="true">Post a Task</span>
                </span>
              </button>
            </div>
          </article>

          {/* Card B: See your task move */}
          <article className="rvs" style={{ position: "relative", overflow: "hidden", minHeight: "420px", borderRadius: "28px", padding: "36px", background: "radial-gradient(90% 70% at 50% 110%, #FFFFFF 0%, rgba(255,255,255,0) 60%), linear-gradient(170deg, #7EDEDD 0%, #A2E7E7 45%, #DFF7F6 100%)" }}>
            <h2 className="mw on" style={{ margin: 0, fontSize: "clamp(26px, 2.6vw, 34px)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.045em", color: "#0D1210", textAlign: "right" }}>
              See your task
              <br />
              move, every day.
            </h2>
            <div className="float" style={{ position: "absolute", left: "50%", top: "54%", transform: "translate(-50%,-50%)", width: "min(92%, 460px)" }}>
              <div className="px-slow" style={{ background: "#FFFFFF", color: "#0D1210", borderRadius: "18px", padding: "18px", boxShadow: "0 10px 28px rgba(0,20,13,.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#EFFBFB", color: "#10605F", fontWeight: 500 }}>
                    Design &amp; Creative
                  </span>
                  <span style={{ padding: "3px 10px", borderRadius: "999px", background: "#EAF2FC", color: "#1B4C86", fontWeight: 500 }}>
                    In progress
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", background: "#7EDEDD", color: "#032120", fontWeight: 600 }}>
                    AN
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "16px", fontWeight: 500, letterSpacing: "-0.02em" }}>
                      Edit 10 reels for my brand
                    </div>
                    <div style={{ fontSize: "13px", color: "#56615E" }}>
                      Assigned to Ananya S. · Trust 98
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "15px", fontWeight: 500 }}>3 days</div>
                    <div style={{ fontSize: "12px", color: "#56615E" }}>left</div>
                  </div>
                </div>
                <div style={{ marginTop: "16px", height: "6px", borderRadius: "999px", background: "#F1F3F3", overflow: "hidden" }}>
                  <div style={{ width: "66%", height: "100%", background: "#29ADAC", borderRadius: "999px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
                  <div style={{ display: "flex", gap: "6px", fontSize: "12px", color: "#3F4A47" }}>
                    <span style={{ padding: "3px 9px", borderRadius: "6px", background: "#F1F3F3" }}>Conversation</span>
                    <span style={{ padding: "3px 9px", borderRadius: "6px", background: "#F1F3F3" }}>Progress</span>
                    <span style={{ padding: "3px 9px", borderRadius: "6px", background: "#F1F3F3" }}>Deliverables</span>
                  </div>
                  <a href="#how" className="btn" style={{ padding: "7px 14px", borderRadius: "999px", background: "#0D1210", color: "#FFFFFF", fontSize: "12px", fontWeight: 500 }}>
                    <span className="roll">
                      <span>Open</span>
                      <span aria-hidden="true">Open</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Card C: Your money stays safe */}
          <article id="trust" className="rvs" style={{ position: "relative", overflow: "hidden", borderRadius: "28px", padding: "36px", background: "radial-gradient(80% 60% at 20% 0%, #FFFFFF 0%, rgba(255,255,255,0) 60%), linear-gradient(180deg, #DFF7F6 0%, #A2E7E7 60%, #7EDEDD 100%)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="float2" style={{ position: "relative", width: "min(100%, 420px)", margin: "0 auto 28px" }}>
              <div className="px-slow" style={{ background: "#FFFFFF", color: "#0D1210", borderRadius: "20px", padding: "20px", boxShadow: "0 10px 28px rgba(0,20,13,.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "15px", fontWeight: 500 }}>Protected payment</span>
                  <span aria-hidden="true" style={{ color: "#74817C" }}>•••</span>
                </div>
                <div style={{ marginTop: "14px", fontSize: "13px", color: "#007A52", fontWeight: 500 }}>
                  Paid at posting · Held safely
                </div>
                <div style={{ marginTop: "6px", fontSize: "40px", fontWeight: 500, letterSpacing: "-0.04em" }}>
                  ₹18,500
                </div>
                <div style={{ marginTop: "4px", fontSize: "13px", color: "#56615E" }}>
                  Released only when the final task is approved.
                </div>
                <div style={{ marginTop: "16px", padding: "12px 14px", borderRadius: "12px", background: "#F1F3F3", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                  <span>Milestone 2 of 3</span>
                  <span style={{ padding: "3px 9px", borderRadius: "999px", background: "#E6F5F0", color: "#005C3D", fontWeight: 500 }}>
                    On schedule
                  </span>
                </div>
                <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "6px" }}>
                  <span style={{ height: "6px", borderRadius: "999px", background: "#009966" }} />
                  <span style={{ height: "6px", borderRadius: "999px", background: "#009966" }} />
                  <span style={{ height: "6px", borderRadius: "999px", background: "#E4E7E6" }} />
                </div>
                <a href="#how" className="btn" style={{ marginTop: "16px", display: "flex", justifyContent: "center", padding: "12px", borderRadius: "12px", background: "#0D1210", color: "#FFFFFF", fontSize: "14px", fontWeight: 500 }}>
                  <span className="roll">
                    <span>Approve &amp; release</span>
                    <span aria-hidden="true">Approve &amp; release</span>
                  </span>
                </a>
              </div>
            </div>
            <h2 className="mw on" style={{ margin: 0, fontSize: "clamp(26px, 2.6vw, 34px)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.045em", color: "#0D1210" }}>
              Your money stays safe.
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: 500, color: "#10605F" }}>
              Released only when you approve the final work.
            </p>
          </article>

          {/* Cards D & E: People & Chat Stack */}
          <div className="bstack" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* The people behind your task */}
            <article className="rvs" style={{ borderRadius: "28px", padding: "32px 0 26px", background: "#FFFFFF", border: "1px solid #C6F0F0" }}>
              <h2 className="mw on" style={{ margin: 0, padding: "0 32px", fontSize: "clamp(24px, 2.2vw, 30px)", lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.04em", color: "#0D1210" }}>
                The people behind your task.
              </h2>
              <p style={{ margin: "8px 0 0", padding: "0 32px", fontSize: "15px", color: "#3F4A47" }}>
                Verified, reviewed and rated.
              </p>
              <div className="mqwrap fadex" style={{ marginTop: "20px", overflow: "hidden", display: "flex", flexDirection: "column", gap: "14px", padding: "6px 0 12px" }}>
                <div className="mqx">
                  {perfChips.map((p, idx) => (
                    <Link
                      key={idx}
                      to="/performers-directory"
                      style={{ flex: "none", marginRight: "12px", display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px 10px 10px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #DFF7F6", boxShadow: "0 4px 12px rgba(0,20,13,.06)", color: "inherit" }}
                    >
                      <span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, background: p.av.background, color: p.av.color }}>
                        {p.i}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px", lineHeight: 1.3 }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#0D1210" }}>{p.name}</span>
                        <span style={{ fontSize: "12px", color: "#56615E" }}>{p.role}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mqx rev">
                  {perfChips2.map((p, idx) => (
                    <Link
                      key={idx}
                      to="/performers-directory"
                      style={{ flex: "none", marginRight: "12px", display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px 10px 10px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #DFF7F6", boxShadow: "0 4px 12px rgba(0,20,13,.06)", color: "inherit" }}
                    >
                      <span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, background: p.av.background, color: p.av.color }}>
                        {p.i}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px", lineHeight: 1.3 }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#0D1210" }}>{p.name}</span>
                        <span style={{ fontSize: "12px", color: "#56615E" }}>{p.role}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* Talk to your performer */}
            <article className="rvs" style={{ borderRadius: "28px", padding: "32px", background: "#FFFFFF", border: "1px solid #C6F0F0" }}>
              <h2 className="mw on" style={{ margin: 0, fontSize: "clamp(24px, 2.2vw, 30px)", lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.04em", color: "#0D1210" }}>
                Talk to your performer
                <br />
                in one place.
              </h2>
              <div style={{ marginTop: "22px", minHeight: "128px" }}>
                <div className="tw on chatloop" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="tb" style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "10px", background: "#FFEE8C", color: "#41390B", fontSize: "11px", fontWeight: 600 }}>
                      YO
                    </span>
                    <p style={{ margin: 0, maxWidth: "300px", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#C9F3EF", fontSize: "14px", color: "#0E3E3A" }}>
                      {currentConvo[0]}
                    </p>
                  </div>
                  <div className="tb" style={{ display: "flex", alignItems: "flex-end", gap: "10px", justifyContent: "flex-end" }}>
                    <p style={{ margin: 0, maxWidth: "300px", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", background: "#F1F3F3", fontSize: "14px", color: "#191F1D" }}>
                      {currentConvo[1]}
                    </p>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "10px", background: "#7EDEDD", color: "#032120", fontSize: "11px", fontWeight: 600 }}>
                      {currentConvo[2]}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <svg style={{ position: "absolute", left: 0, bottom: "-1px", width: "100%", height: "90px" }} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 90V40C0 18 18 0 40 0h560c60 0 70 30 120 70 50-40 60-70 120-70h560c22 0 40 18 40 40v50z" fill="#F9FAFA" />
        </svg>
      </section>

      {/* LIVE TRACKING SHOWCASE (#how) */}
      <section id="how" className="dots" style={{ position: "relative", width: "calc(100% - 72px)", margin: "0 36px", padding: "80px 48px 0", borderRadius: "32px" }}>
        <div style={{ width: "100%", margin: 0 }}>
          <div className="rv" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", padding: "36px clamp(24px, 3vw, 48px)", borderRadius: "24px", background: "#FFFFFF", border: "1px solid #E4E7E6" }}>
            <div>
              <div className="eyebrow" style={{ color: "#10605F" }}>Live tracking</div>
              <h2 className="mw on" style={{ margin: "12px 0 0", fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.05em" }}>
                Know where your task
                <br />
                stands, always.
              </h2>
            </div>
            <div style={{ maxWidth: "380px", textAlign: "right", marginLeft: "auto" }}>
              <p style={{ margin: 0, fontSize: "15px", color: "#3F4A47" }}>Chat, progress and files in one app.</p>
              <a href="#how" className="btn" style={{ marginTop: "14px", display: "inline-flex", padding: "10px 20px", borderRadius: "999px", background: "#0D1210", color: "#FFFFFF", fontSize: "14px", fontWeight: 500 }}>
                <span className="roll">
                  <span>Watch how it works · 1:00</span>
                  <span aria-hidden="true">Watch how it works · 1:00</span>
                </span>
              </a>
            </div>
          </div>

          <div
            className="rvs"
            style={{
              marginTop: "20px",
              position: "relative",
              overflow: "hidden",
              borderRadius: "24px",
              minHeight: "540px",
              padding: "56px clamp(20px, 3vw, 48px) 0",
              background: "radial-gradient(70% 70% at 50% 120%, #EFFBFB 0%, rgba(239,251,251,0) 60%), linear-gradient(180deg, #7EDEDD 0%, #A2E7E7 45%, #DFF7F6 100%)",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <svg className="px-fast" style={{ position: "absolute", left: "-5%", top: "10%", width: "110%", opacity: 0.5, pointerEvents: "none" }} viewBox="0 0 1200 300" fill="none" aria-hidden="true">
              <path d="M0 220C200 80 380 60 560 160s360 120 640-60" stroke="#EFFBFB" strokeWidth="60" strokeLinecap="round" />
            </svg>

            <div className="rise" style={{ position: "relative", width: "100%", borderRadius: "20px 20px 0 0", background: "#FFFFFF", boxShadow: "0 12px 32px rgba(0,20,13,.12)", padding: "24px clamp(20px, 3vw, 36px) 32px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px", paddingBottom: "14px", borderBottom: "1px solid #F1F3F3" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", background: "#7EDEDD", color: "#032120", fontSize: "13px", fontWeight: 600 }}>
                    AN
                  </span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 500 }}>Edit 10 reels for my brand</div>
                    <div style={{ fontSize: "12px", color: "#56615E" }}>Assigned to Ananya Sharma · 3 days left</div>
                  </div>
                </div>
                <span style={{ padding: "4px 11px", borderRadius: "999px", background: "#EAF2FC", color: "#1B4C86", fontSize: "12px", fontWeight: 500 }}>
                  In progress
                </span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "12px", fontSize: "13px" }}>
                {tabDefs.map((t, idx) => (
                  <button
                    key={t.short}
                    type="button"
                    onClick={() => setTab(idx)}
                    style={{
                      border: 0,
                      cursor: "pointer",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: tab === idx ? "#0D1210" : "#F1F3F3",
                      color: tab === idx ? "#FFFFFF" : "#3F4A47"
                    }}
                  >
                    {t.short}
                  </button>
                ))}
              </div>

              {/* Tab 0: Real-time chat */}
              {tab === 0 && (
                <div className="panelin tw on" style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="tb" style={{ display: "flex", gap: "10px" }}>
                    <span style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "10px", background: "#FFEE8C", color: "#41390B", fontSize: "11px", fontWeight: 600 }}>YO</span>
                    <div>
                      <div style={{ fontSize: "12px", color: "#56615E" }}><b style={{ color: "#191F1D", fontWeight: 500 }}>You</b> · 2:14 PM</div>
                      <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#3F4A47" }}>Here’s the draft of the first 3 reels. Let me know if the pacing works for you!</p>
                    </div>
                  </div>
                  <div className="tb" style={{ display: "flex", gap: "10px" }}>
                    <span style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "10px", background: "#7EDEDD", color: "#032120", fontSize: "11px", fontWeight: 600 }}>AN</span>
                    <div>
                      <div style={{ fontSize: "12px", color: "#56615E" }}><b style={{ color: "#191F1D", fontWeight: 500 }}>Ananya</b> · 2:18 PM</div>
                      <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#3F4A47" }}>Looks great! Can you add a bit more energy to the cuts?</p>
                    </div>
                  </div>
                  <div className="tb" style={{ display: "flex", gap: "10px" }}>
                    <span style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "10px", background: "#FFEE8C", color: "#41390B", fontSize: "11px", fontWeight: 600 }}>YO</span>
                    <div>
                      <div style={{ fontSize: "12px", color: "#56615E" }}><b style={{ color: "#191F1D", fontWeight: 500 }}>You</b> · 2:21 PM</div>
                      <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#3F4A47" }}>Sure, will send updated version by EOD.</p>
                      <div className="tb" style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "10px", border: "1px solid #E4E7E6", fontSize: "13px" }}>
                        Reels_Draft_v1.mp4 <span style={{ color: "#56615E" }}>0:47</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 8px 8px 14px", borderRadius: "12px", background: "#F1F3F3", fontSize: "13px", color: "#56615E" }}>
                    <span>Reply to Ananya...</span>
                    <span style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: "8px", background: "#0D1210", color: "#FFFFFF", fontWeight: 500 }}>Send</span>
                  </div>
                </div>
              )}

              {/* Tab 1: Milestone Progress */}
              {tab === 1 && (
                <div className="panelin" style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#56615E" }}>
                    <span>Milestone 2 of 3</span>
                    <span>Due Friday</span>
                  </div>
                  <div style={{ height: "8px", borderRadius: "999px", background: "#F1F3F3", overflow: "hidden" }}>
                    <div style={{ width: "66%", height: "100%", borderRadius: "999px", background: "#009966" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "12px", border: "1px solid #E4E7E6" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "999px", background: "#009966", color: "#FFFFFF", fontSize: "13px" }} aria-hidden="true">✓</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>Drafts of first 3 reels</div>
                      <div style={{ fontSize: "12px", color: "#56615E" }}>Approved</div>
                    </div>
                    <span style={{ padding: "3px 9px", borderRadius: "999px", background: "#E6F5F0", color: "#005C3D", fontSize: "12px", fontWeight: 500 }}>Done</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "12px", border: "1.5px solid #7EDEDD", background: "#EFFBFB" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "999px", background: "#10605F", color: "#FFFFFF", fontSize: "12px", fontWeight: 600 }}>2</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>Remaining 7 reels</div>
                      <div style={{ fontSize: "12px", color: "#56615E" }}>In progress</div>
                    </div>
                    <span style={{ padding: "3px 9px", borderRadius: "999px", background: "#E6F5F0", color: "#005C3D", fontSize: "12px", fontWeight: 500 }}>On schedule</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "12px", border: "1px solid #E4E7E6" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "999px", background: "#F1F3F3", color: "#56615E", fontSize: "12px", fontWeight: 600 }}>3</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>Final delivery &amp; handover</div>
                      <div style={{ fontSize: "12px", color: "#56615E" }}>Up next</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Deliverables & Approvals */}
              {tab === 2 && (
                <div className="panelin" style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "15px", fontWeight: 500 }}>Final delivery</span>
                    <span style={{ padding: "3px 9px", borderRadius: "999px", background: "#E6F5F0", color: "#005C3D", fontSize: "12px", fontWeight: 500 }}>Verified</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px" }}>
                    <div style={{ padding: "12px", borderRadius: "12px", border: "1px solid #E4E7E6", fontSize: "13px" }}>
                      Reels_Final_01–05.mp4
                      <div style={{ color: "#56615E", fontSize: "12px" }}>Files · Timestamped</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "12px", border: "1px solid #E4E7E6", fontSize: "13px" }}>
                      Reels_Final_06–10.mp4
                      <div style={{ color: "#56615E", fontSize: "12px" }}>Files · Timestamped</div>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "12px", border: "1px solid #E4E7E6", fontSize: "13px" }}>
                      Captions.docx
                      <div style={{ color: "#56615E", fontSize: "12px" }}>Version history · Protected</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "flex-end", marginTop: "6px" }}>
                    <button type="button" className="btn" style={{ padding: "10px 16px", borderRadius: "999px", background: "#F1F3F3", color: "#191F1D", fontSize: "14px", fontWeight: 500, border: 0, cursor: "pointer" }}>
                      <span className="roll"><span>Request changes</span><span aria-hidden="true">Request changes</span></span>
                    </button>
                    <button type="button" className="btn" style={{ padding: "10px 16px", borderRadius: "999px", background: "#0D1210", color: "#FFFFFF", fontSize: "14px", fontWeight: 500, border: 0, cursor: "pointer" }}>
                      <span className="roll"><span>Approve &amp; release payment</span><span aria-hidden="true">Approve &amp; release payment</span></span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TAB PICKERS (How it works row) */}
          <div role="tablist" aria-label="How it works" style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "28px" }}>
            {tabDefs.map((t, idx) => (
              <button
                key={t.short}
                type="button"
                role="tab"
                aria-selected={tab === idx}
                onClick={() => setTab(idx)}
                style={{ cursor: "pointer", textAlign: "left", border: 0, background: "transparent", font: "inherit", padding: "0 0 8px", color: "inherit" }}
              >
                <div style={{ position: "relative", height: "2px", background: "#E4E7E6", overflow: "hidden" }}>
                  {tab === idx && <div className="tabbar" style={{ position: "absolute", inset: 0, background: "#1B8887" }} />}
                </div>
                <div style={{ marginTop: "22px", fontSize: "22px", fontWeight: 500, letterSpacing: "-0.03em", color: tab === idx ? "#0D1210" : "#74817C" }}>
                  {t.title}
                </div>
                <p style={{ margin: "8px 0 0", fontSize: "15px", color: tab === idx ? "#3F4A47" : "#74817C" }}>
                  {t.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHY FIRSTDOER BENTO GRID (#why) */}
      <section id="why" style={{ position: "relative", width: "calc(100% - 72px)", margin: "0 36px", padding: "80px 48px 0" }}>
        <div style={{ width: "100%", margin: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" }}>
            <div>
              <div className="eyebrow" style={{ color: "#10605F" }}>Why firstDoer</div>
              <h2 className="mw on" style={{ margin: "12px 0 0", fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.05em", color: "#0D1210" }}>
                Why businesses post on firstDoer.
              </h2>
            </div>
            <p style={{ margin: 0, maxWidth: "360px", fontSize: "16px", lineHeight: 1.5, color: "#3F4A47" }}>
              Less managing. More done.
            </p>
          </div>

          <div className="why-grid" style={{ marginTop: "36px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px", width: "100%" }}>
            {/* Bento 1: Verified performers */}
            <article className="slidel lift why-big why-card" style={{ gridColumn: "span 2", minHeight: "230px", borderRadius: "24px", padding: "30px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", background: "radial-gradient(90% 80% at 100% 0%, #FFFFFF 0%, rgba(255,255,255,0) 60%), linear-gradient(160deg, #7EDEDD 0%, #C6F0F0 60%, #EFFBFB 100%)", color: "#0D1210" }}>
              <div>
                <span style={{ display: "flex" }}>
                  <span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "999px", marginLeft: 0, boxShadow: "0 0 0 3px #A2E7E7", background: "#7EDEDD", color: "#032120", fontSize: "15px", fontWeight: 600 }}>A</span>
                  <span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "999px", marginLeft: "-10px", boxShadow: "0 0 0 3px #A2E7E7", background: "#C6F0F0", color: "#083B3A", fontSize: "15px", fontWeight: 600 }}>A</span>
                  <span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "999px", marginLeft: "-10px", boxShadow: "0 0 0 3px #A2E7E7", background: "#CAF0C1", color: "#183E0F", fontSize: "15px", fontWeight: 600 }}>K</span>
                  <span style={{ position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "999px", marginLeft: "-10px", boxShadow: "0 0 0 3px #A2E7E7", background: "#87E4DB", color: "#0E3E3A", fontSize: "15px", fontWeight: 600 }}>A</span>
                </span>
                <h3 style={{ margin: "22px 0 0", fontSize: "24px", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.03em" }}>
                  Verified performers you can trust
                </h3>
                <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#25302D" }}>
                  ID-checked, with past projects approved by our team.
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: 500, background: "rgba(255,255,255,.75)", color: "#10605F", border: "1px solid #FFFFFF" }}>ID checked</span>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: 500, background: "rgba(255,255,255,.75)", color: "#10605F", border: "1px solid #FFFFFF" }}>Projects approved</span>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: 500, background: "rgba(255,255,255,.75)", color: "#10605F", border: "1px solid #FFFFFF" }}>Trust score + rating</span>
              </div>
            </article>

            {/* Bento 2: You pay only for finished work */}
            <article className="slider lift why-card" style={{ minHeight: "230px", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "22px", background: "linear-gradient(160deg, #FFFFFF 0%, #EFFBFB 100%)", border: "1px solid #C6F0F0", color: "#0D1210" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "6px", fontSize: "12px", fontWeight: 500, textAlign: "center" }}>
                <span style={{ padding: "8px 4px", borderRadius: "10px", background: "#10605F", color: "#FFFFFF" }}>Paid</span>
                <span style={{ padding: "8px 4px", borderRadius: "10px", background: "#10605F", color: "#FFFFFF" }}>Held</span>
                <span style={{ padding: "8px 4px", borderRadius: "10px", background: "#CAF0C1", color: "#183E0F" }}>Released</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.03em" }}>You pay only for finished work</h3>
                <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#3F4A47" }}>Released only when you approve the work.</p>
              </div>
            </article>

            {/* Bento 3: AI checklist */}
            <article className="slidel lift why-card" style={{ minHeight: "210px", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "22px", background: "#FFFFFF", border: "1px solid #C6F0F0", color: "#0D1210" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                <span style={{ alignSelf: "flex-start", padding: "8px 12px", borderRadius: "12px 12px 12px 4px", background: "#F1F3F3", color: "#191F1D" }}>
                  “Build a website for my café”
                </span>
                <span style={{ alignSelf: "flex-end", padding: "8px 12px", borderRadius: "12px 12px 4px 12px", background: "#DFF7F6", color: "#10605F", fontWeight: 500 }}>
                  8-step checklist
                </span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.03em" }}>AI checklist, nothing missed</h3>
                <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#3F4A47" }}>Budget and needs in. Clear steps out.</p>
              </div>
            </article>

            {/* Bento 4: Track it live */}
            <article className="rv lift why-card" style={{ minHeight: "210px", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "22px", background: "linear-gradient(160deg, #FFFFFF 0%, #F2FBF0 100%)", border: "1px solid #DDF5D7", color: "#0D1210" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#3F4A47" }}>
                  <span>Milestone 2 of 3</span>
                  <span style={{ color: "#009966", fontWeight: 500 }}>On track</span>
                </div>
                <div style={{ marginTop: "10px", height: "8px", borderRadius: "999px", background: "#DDF5D7", overflow: "hidden" }}>
                  <div className="why-bar" style={{ width: "66%", height: "100%", borderRadius: "999px", background: "#009966" }} />
                </div>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.03em" }}>Track it live</h3>
                <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#3F4A47" }}>Progress and chat in one place.</p>
              </div>
            </article>

            {/* Bento 5: Proof at every step */}
            <article className="slider lift why-card" style={{ minHeight: "210px", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "22px", background: "#FFFFFF", border: "1px solid #C6F0F0", color: "#0D1210" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <span className="mono" style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 500, background: "#F1F3F3", color: "#3F4A47" }}>v1</span>
                <span className="mono" style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 500, background: "#F1F3F3", color: "#3F4A47" }}>v2</span>
                <span className="mono" style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 500, background: "#0D1210", color: "#FFFFFF" }}>Final</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.03em" }}>Proof at every step</h3>
                <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#3F4A47" }}>Version history and timestamped files.</p>
              </div>
            </article>

            {/* Bento 6: Clear task agreement */}
            <article className="slidel lift why-card" style={{ borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "22px", background: "radial-gradient(90% 80% at 100% 0%, #FFFFFF 0%, rgba(255,255,255,0) 60%), linear-gradient(160deg, #7EDEDD 0%, #C6F0F0 60%, #EFFBFB 100%)", color: "#0D1210" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: 500, background: "#EFFBFB", color: "#10605F", border: "1px solid #C6F0F0" }}>Agreed before work starts</span>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: 500, background: "#EFFBFB", color: "#10605F", border: "1px solid #C6F0F0" }}>Clear &amp; complete checklist</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.03em" }}>Clear task agreement</h3>
                <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#25302D" }}>Checklists and deliverables agreed before work starts.</p>
              </div>
            </article>

            {/* Bento 7: A deadline for every step */}
            <article className="slider lift why-big why-card" style={{ gridColumn: "span 2", borderRadius: "24px", padding: "30px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px", background: "#FFFFFF", border: "1px solid #C6F0F0", color: "#0D1210" }}>
              <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: "20px", lineHeight: 1.2, fontWeight: 600, letterSpacing: "-0.03em" }}>A deadline for every step</h3>
                <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#3F4A47" }}>Each checklist item has its own due date.</p>
              </div>
              <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "12px", background: "#F9FAFA", border: "1px solid #E4E7E6", fontSize: "14px" }}>
                  <span className="mono" style={{ flex: "none", fontSize: "12px", fontWeight: 600, color: "#10605F" }}>01</span>
                  <span style={{ flex: 1, minWidth: 0, fontWeight: 500 }}>Wireframes &amp; sitemap</span>
                  <span style={{ flex: "none", padding: "3px 9px", borderRadius: "999px", fontSize: "12px", fontWeight: 500, background: "#E6F5F0", color: "#005C3D" }}>Due Mon</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "12px", background: "#F9FAFA", border: "1px solid #E4E7E6", fontSize: "14px" }}>
                  <span className="mono" style={{ flex: "none", fontSize: "12px", fontWeight: 600, color: "#10605F" }}>02</span>
                  <span style={{ flex: 1, minWidth: 0, fontWeight: 500 }}>5 pages designed &amp; built</span>
                  <span style={{ flex: "none", padding: "3px 9px", borderRadius: "999px", fontSize: "12px", fontWeight: 500, background: "#DFF7F6", color: "#10605F" }}>Due Thu</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "12px", background: "#F9FAFA", border: "1px solid #E4E7E6", fontSize: "14px" }}>
                  <span className="mono" style={{ flex: "none", fontSize: "12px", fontWeight: 600, color: "#10605F" }}>03</span>
                  <span style={{ flex: 1, minWidth: 0, fontWeight: 500 }}>Contact form + SEO basics</span>
                  <span style={{ flex: "none", padding: "3px 9px", borderRadius: "999px", fontSize: "12px", fontWeight: 500, background: "#DFF7F6", color: "#10605F" }}>Due Sat</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - 3 STICKY CARDS (#steps) */}
      <section id="steps" style={{ position: "relative", width: "calc(100% - 120px)", margin: "0 60px", padding: "96px 0 0" }}>
        <div style={{ width: "100%", margin: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div className="eyebrow" style={{ color: "#10605F" }}>How it works</div>
            <h2 className="wtl" style={{ margin: "16px auto 0", maxWidth: "1040px", fontSize: "clamp(32px, 4vw, 54px)", lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.05em", color: "#0D1210" }}>
              {"Post your first task in 3 simple steps.".split(" ").map((w, i) => (
                <span key={i} className="wd" style={{ animationRange: `cover ${Math.round(10 + (i / 8) * 32)}% cover ${Math.round(16 + (i / 8) * 32)}%` }}>
                  {w}{" "}
                </span>
              ))}
            </h2>
          </div>

          <div style={{ marginTop: "72px", display: "flex", flexDirection: "column", gap: "32px" }}>
            {steps.map((s, idx) => (
              <article
                key={s.n}
                className="sticky-step stepin stepcard"
                style={{
                  top: s.top,
                  borderRadius: "28px",
                  padding: "48px",
                  minHeight: "440px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "48px"
                }}
              >
                <div className="step-grid" aria-hidden="true" />
                <div style={{ position: "relative", flex: "1 1 360px", minWidth: 0 }}>
                  <div className="mono c-a" style={{ fontSize: "12px", letterSpacing: ".14em", fontWeight: 500 }}>
                    STEP {s.n} / 03
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", gap: "6px" }}>
                    {s.bars.map((barOn, bIdx) => (
                      <span key={bIdx} className={`bar ${barOn ? "on" : ""}`} style={{ width: "32px", height: "4px", borderRadius: "999px" }} />
                    ))}
                  </div>
                  <h3 className="c-h" style={{ margin: "22px 0 0", fontSize: "clamp(30px, 3.4vw, 46px)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.05em" }}>
                    {s.t}
                  </h3>
                  <p className="c-b" style={{ margin: "14px 0 0", fontSize: "16px" }}>
                    {s.d}
                  </p>
                </div>

                <div className="step-panel" style={{ position: "relative", flex: "1.2 1 420px", minWidth: 0, borderRadius: "20px", padding: "26px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="step-ph" style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", background: "#FFEE8C", color: "#41390B", fontWeight: 600 }}>
                      W
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className="c-h" style={{ fontSize: "15px", fontWeight: 600 }}>Website for my studio</div>
                      <div className="c-m" style={{ fontSize: "12px" }}>Build &amp; Develop · ₹15k–30k</div>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 500, ...s.badgeSt }}>
                      {s.badge}
                    </span>
                  </div>
                  {s.rows.map((r, rIdx) => (
                    <div key={rIdx} className="step-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "10px", fontSize: "14px" }}>
                      <span className="c-b">{r.k}</span>
                      <span style={{ fontWeight: 500, ...r.st }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION (#faq) */}
      <section id="faq" style={{ position: "relative", width: "calc(100% - 48px)", margin: "0 24px", padding: "80px 0 0" }}>
        <div className="rvs" style={{ width: "100%", margin: 0, borderRadius: "28px", background: "#EFFBFB", border: "1px solid #DFF7F6", padding: "48px" }}>
          <div style={{ width: "100%", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "48px" }}>
            <div style={{ flex: "1 1 320px", minWidth: 0, maxWidth: "440px" }}>
              <div className="eyebrow" style={{ color: "#10605F" }}>FAQs</div>
              <h2 className="mw on" style={{ margin: "12px 0 0", fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.05em", color: "#0D1210" }}>
                Questions,
                <br />
                answered.
              </h2>
              <p style={{ margin: "16px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#3F4A47" }}>
                Can’t find your answer? Our team is happy to help.
              </p>
              <Link
                to="/contact"
                className="btn"
                style={{ marginTop: "20px", display: "inline-flex", padding: "11px 20px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid #C6F0F0", color: "#0D1210", fontSize: "14px", fontWeight: 500 }}
              >
                <span className="roll">
                  <span>Contact support</span>
                  <span aria-hidden="true">Contact support</span>
                </span>
              </Link>
            </div>

            <div style={{ flex: "2.2 1 540px", minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {faqDefs.map((f, i) => {
                const isOpen = faq === i;
                return (
                  <div
                    key={f.q}
                    style={{
                      borderRadius: "16px",
                      background: "#FFFFFF",
                      border: isOpen ? "1px solid #A2E7E7" : "1px solid #E4E7E6",
                      boxShadow: isOpen ? "0 10px 24px rgba(16,96,95,.10)" : "none",
                      transition: "box-shadow .3s, border-color .3s"
                    }}
                  >
                    <button
                      type="button"
                      className="faqbtn"
                      aria-expanded={isOpen}
                      onClick={() => setFaq(isOpen ? -1 : i)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "18px 20px",
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                        font: "inherit",
                        fontSize: "16px",
                        fontWeight: 500,
                        color: isOpen ? "#10605F" : "#191F1D",
                        textAlign: "left"
                      }}
                    >
                      <span className="mono" style={{ flex: "none", fontSize: "12px", color: "#56615E" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>{f.q}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          flex: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "26px",
                          height: "26px",
                          borderRadius: "999px",
                          fontSize: "16px",
                          lineHeight: 1,
                          background: isOpen ? "#0D1210" : "#DFF7F6",
                          color: isOpen ? "#FFFFFF" : "#10605F"
                        }}
                      >
                        {isOpen ? "×" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="panelin" style={{ margin: 0, padding: "0 60px 18px 46px", fontSize: "15px", lineHeight: 1.6, color: "#3F4A47" }}>
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA (#apps) */}
      <section id="apps" style={{ position: "relative", width: "calc(100% - 20px)", margin: "0 10px", padding: "80px 0" }}>
        <div
          className="rvs"
          style={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            margin: 0,
            borderRadius: "28px",
            background: "#0D1210",
            color: "#FFFFFF",
            padding: "clamp(40px, 4vw, 64px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px"
          }}
        >
          <svg aria-hidden="true" style={{ position: "absolute", right: "-80px", top: "-120px", width: "460px", height: "460px", pointerEvents: "none" }} viewBox="0 0 460 460" fill="none">
            <circle cx="230" cy="230" r="120" stroke="rgba(126,222,221,.28)" />
            <circle cx="230" cy="230" r="170" stroke="rgba(126,222,221,.20)" />
            <circle cx="230" cy="230" r="220" stroke="rgba(126,222,221,.12)" />
          </svg>

          <div style={{ position: "relative", flex: "1 1 420px", minWidth: 0 }}>
            <h2 style={{ margin: 0, maxWidth: "560px", fontSize: "clamp(30px, 3.6vw, 46px)", lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.04em", color: "#FFFFFF" }}>
              Ready to get your next task done?
            </h2>
            <p style={{ margin: "16px 0 0", maxWidth: "400px", fontSize: "16px", lineHeight: 1.5, color: "#C6F0F0" }}>
              Post your task in under a minute. Pay only when the work is complete.
            </p>
          </div>

          <div style={{ position: "relative", flex: "0 1 320px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              type="button"
              onClick={() => handlePostTask()}
              className="btn"
              style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "15px 24px", borderRadius: "999px", background: "#7EDEDD", color: "#032120", fontSize: "15px", fontWeight: 600, border: 0, cursor: "pointer" }}
            >
              <span className="roll">
                <span>Post your task</span>
                <span aria-hidden="true">Post your task</span>
              </span>
            </button>

            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              aria-label="Get it on Google Play"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "10px 24px", borderRadius: "999px", background: "#000000", border: "1px solid rgba(255,255,255,.28)", color: "#FFFFFF", lineHeight: 1.1 }}
            >
              <svg width="22" height="24" viewBox="0 0 22 24" aria-hidden="true">
                <path d="M1 1.2 12.6 12 1 22.8c-.4-.3-.6-.8-.6-1.4V2.6c0-.6.2-1.1.6-1.4z" fill="#00D7FE" />
                <path d="M16.4 8.3 12.6 12 1 1.2c.4-.3 1-.4 1.6-.1l13.8 7.2z" fill="#00F076" />
                <path d="M16.4 15.7 2.6 22.9c-.6.3-1.2.2-1.6-.1L12.6 12l3.8 3.7z" fill="#FF3A44" />
                <path d="M20.6 10.6c1 .6 1 2.2 0 2.8l-4.2 2.3L12.6 12l3.8-3.7 4.2 2.3z" fill="#FFD400" />
              </svg>
              <span style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <span style={{ fontSize: "10px", letterSpacing: ".06em", textTransform: "uppercase", color: "#C6F0F0" }}>Get it on</span>
                <span style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.01em" }}>Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", width: "calc(100% - 20px)", margin: "0 10px 10px", padding: "0 0 32px" }}>
        <div style={{ width: "100%", margin: 0, borderRadius: "28px", background: "#DFF7F6", color: "#0D1210", padding: "64px clamp(24px, 3vw, 56px) 36px" }}>
          <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "48px", justifyContent: "space-between" }}>
            <div style={{ flex: "1 1 260px", maxWidth: "320px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                <svg width="30" height="22" viewBox="0 0 30 22" fill="none" aria-hidden="true">
                  <path d="M11 2.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5c3.4 0 5.6-2.4 8-8.5 2.4-6.1 4.6-8.5 8-8.5" stroke="#29ADAC" strokeWidth="3" strokeLinecap="round" />
                  <path d="M19 19.5c4.7 0 8.5-3.8 8.5-8.5S23.7 2.5 19 2.5c-3.4 0-5.6 2.4-8 8.5" stroke="#4CCDCC" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.04em" }}>firstDoer</span>
              </div>
              <p style={{ margin: "16px 0 0", fontSize: "14px", color: "#3F4A47" }}>Post your task. Get it done.</p>
              <a href="mailto:support@firstdoer.com" style={{ display: "inline-block", marginTop: "16px", fontSize: "14px", color: "#10605F", fontWeight: 500 }}>
                support@firstdoer.com
              </a>

              <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "999px", border: "1px solid #A2E7E7", background: "#FFFFFF", color: "#0D1210" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "999px", border: "1px solid #A2E7E7", background: "#FFFFFF", color: "#0D1210" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.2H7.5V12h2.8v10h3.7V12h2.8l.4-3.5z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "999px", border: "1px solid #A2E7E7", background: "#FFFFFF", color: "#0D1210" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "999px", border: "1px solid #A2E7E7", background: "#FFFFFF", color: "#0D1210" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8zM9.8 15.1V8.9l5.8 3.1z" />
                  </svg>
                </a>
              </div>
            </div>

            <div style={{ flex: "3 1 560px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "32px" }}>
              {footCols.map((c) => (
                <nav key={c.h} aria-label={c.h}>
                  <div className="mono" style={{ fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#56615E" }}>
                    {c.h}
                  </div>
                  <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                    {c.links.map((l) => (
                      <li key={l.label}>
                        {l.to ? (
                          <Link to={l.to} style={{ color: "#191F1D" }}>
                            {l.label}
                          </Link>
                        ) : (
                          <a href={l.href} style={{ color: "#191F1D" }}>
                            {l.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div style={{ width: "100%", margin: "56px auto 0", paddingTop: "24px", borderTop: "1px solid #A2E7E7", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", fontSize: "13px", color: "#3F4A47" }}>
            <span>© 2026 firstDoer</span>
            <span className="mono">Verified performers only</span>
          </div>

          <div aria-hidden="true" className="px-x" style={{ width: "100%", margin: "24px auto 0", fontSize: "clamp(80px, 17vw, 240px)", lineHeight: 0.8, fontWeight: 600, letterSpacing: "-0.07em", color: "rgba(16,96,95,.10)", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden" }}>
            firstDoer
          </div>
        </div>
      </footer>
    </div>
  );
}
