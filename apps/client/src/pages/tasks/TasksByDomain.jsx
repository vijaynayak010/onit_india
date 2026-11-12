import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Image,
  Cpu,
  BookOpen,
  MapPin,
  MessageCircle,
  FileText,
  AlertCircle,
  CheckCircle,
  Zap,
  Clock,
  Eye,
  XCircle,
} from "react-feather";

/**
 * Rally-style comparison: Left = "Without a clear platform" (pain capsules),
 * Right = "With FirstDoer" (task capsules + flow). Fixed layout, text animates in capsules.
 */

const WITHOUT_CAPSULES = [
  {
    id: "scattered",
    icon: MessageCircle,
    title: "Scattered requests",
    description: "Posting on multiple apps, DMs everywhere — no single place to post or track.",
    accent: "amber",
  },
  {
    id: "manual",
    icon: FileText,
    title: "Manual back-and-forth",
    description: "Endless briefs, unclear scope, chasing updates and approvals.",
    accent: "slate",
  },
  {
    id: "hit-miss",
    icon: AlertCircle,
    title: "Hit or miss",
    description: "Unverified help, payment risks, rework and trust issues.",
    accent: "rose",
  },
  {
    id: "no-visibility",
    icon: Eye,
    title: "No visibility",
    description: "Hard to compare performers, track progress or see who’s reliable.",
    accent: "violet",
  },
  {
    id: "wasted-time",
    icon: Clock,
    title: "Wasted time",
    description: "Searching in the wrong places, delayed replies, missed deadlines.",
    accent: "orange",
  },
];

const WITH_DOMAINS = [
  {
    id: "business",
    name: "Business & Research",
    icon: Briefcase,
    tasks: [
      "Research 20 B2B leads and add to my sheet",
      "Market and competitor analysis report",
      "CRM updates and vendor outreach list",
      "Lead generation and list building",
      "Survey design and analysis",
      "Cold outreach and follow-up emails",
      "Pitch deck and investor one-pager",
      "SWOT and industry trend summary",
      "LinkedIn list building and prospect research",
      "Budget comparison and vendor shortlist",
    ],
  },
  {
    id: "content",
    name: "Content & Design",
    icon: Image,
    tasks: [
      "Design 5 Instagram carousel posts for my launch",
      "Edit wedding video highlights",
      "Logo and social thumbnails for my brand",
      "Ad copy and email campaign",
      "Video editing and reels",
      "Podcast editing and show notes",
      "Banner and landing page visuals",
      "Infographic and one-pager design",
      "Short-form scripts and captions",
      "Brand kit and style guide",
    ],
  },
  {
    id: "tech",
    name: "Tech & Data",
    icon: Cpu,
    tasks: [
      "Build a tracker sheet with formulas",
      "Zapier automation setup",
      "Web scraping and data cleaning",
      "Website fixes and API integration",
      "Document formatting and templates",
      "Dashboard and report automation",
      "Data entry and database cleanup",
      "Simple bot or form integration",
      "CSV merge and bulk updates",
      "Email template and workflow setup",
    ],
  },
  {
    id: "academic",
    name: "Academic & Knowledge",
    icon: BookOpen,
    tasks: [
      "15-slide presentation on renewable energy with references",
      "Literature review and citations for my thesis",
      "Study notes and chapter summaries",
      "Proofreading and editing my draft",
      "Tutoring or doubt-solving",
      "Assignment and essay structuring",
      "Reference formatting (APA, MLA)",
      "Summary and key-point extraction",
      "Quiz prep and flashcard sets",
      "Translation and paraphrasing",
    ],
  },
  {
    id: "onground",
    name: "On-Ground & Local",
    icon: MapPin,
    tasks: [
      "Visit 5 stores and verify product display and click photos",
      "Document pickup and delivery",
      "Event day support and survey collection",
      "Local audits and feedback",
      "Store or site visits",
      "Mystery shopping and compliance check",
      "Local listing and signboard verification",
      "Crowd count and footfall at venue",
      "Sample collection and handover",
      "On-site inventory or stock check",
    ],
  },
];

const FLOW_BULLETS = ["POST IN ANY DOMAIN", "GET MATCHED", "WORK GETS DONE"];
const PAIN_BULLETS = ["MULTIPLE APPS", "NO SINGLE PLACE", "MORE FRICTION"];

function useTypewriter(phrases, speed = 45, pauseMs = 2800) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const phase = useRef("typing");

  useEffect(() => {
    const text = phrases[idx] ?? phrases[0];
    const doneTyping = charIdx >= text.length;
    const doneDeleting = charIdx <= 0;

    const t = setTimeout(() => {
      if (phase.current === "typing") {
        if (doneTyping) {
          phase.current = "pausing";
          setDisplay(text);
          return;
        }
        setDisplay(text.slice(0, charIdx + 1));
        setCharIdx((i) => i + 1);
        return;
      }
      if (phase.current === "pausing") {
        phase.current = "deleting";
        return;
      }
      if (phase.current === "deleting") {
        if (doneDeleting) {
          phase.current = "typing";
          setIdx((i) => (i + 1) % phrases.length);
          setCharIdx(0);
          setDisplay("");
          return;
        }
        setDisplay(text.slice(0, charIdx - 1));
        setCharIdx((i) => i - 1);
        return;
      }
    }, phase.current === "pausing" ? pauseMs : speed);
    return () => clearTimeout(t);
  }, [phrases, idx, charIdx, speed, pauseMs]);

  return display;
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } };
const itemUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function TasksByDomain() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.06 });
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visiblePainStartIndex, setVisiblePainStartIndex] = useState(0);

  // Rotate which 3 domains are shown every 8 seconds
  useEffect(() => {
    if (!isInView) return;
    const t = setInterval(() => {
      setVisibleStartIndex((i) => (i + 1) % WITH_DOMAINS.length);
      setVisiblePainStartIndex((i) => (i + 1) % WITHOUT_CAPSULES.length);
    }, 8000);
    return () => clearInterval(t);
  }, [isInView]);

  const visibleDomains = [0, 1, 2].map((offset) => WITH_DOMAINS[(visibleStartIndex + offset) % WITH_DOMAINS.length]);
  const visiblePains = [0, 1, 2].map((offset) => WITHOUT_CAPSULES[(visiblePainStartIndex + offset) % WITHOUT_CAPSULES.length]);

  return (
    <section
      ref={sectionRef}
      id="tasks-by-domain"
      className="relative w-full overflow-hidden bg-[var(--color-surface)] py-14 sm:py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-80 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-2">
            One place for every task
          </h2>
          <p className="text-base text-[var(--color-text-muted)] max-w-xl mx-auto">
            Stop juggling platforms. Post in any domain on FirstDoer and get matched with the right performers.
          </p>
        </motion.header>

        {/* Two-column comparison */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch"
        >
          {/* Left — Without a clear platform (pain capsules + summary) */}
          <motion.div variants={itemUp} className="relative">
            <div className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 sm:p-6 min-h-[320px] flex flex-col">
              <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <XCircle size={14} strokeWidth={2.5} />
                Without a clear platform
              </p>

              {/* Pain capsules — 3 at a time; rotate in sync with right */}
              <div className="space-y-2.5 flex-1 flex flex-col">
                {[0, 1, 2].map((slotIndex) => {
                  const cap = visiblePains[slotIndex];
                  return (
                    <div key={slotIndex} className="min-h-[4.5rem] overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                        <WithoutCapsule key={cap.id} cap={cap} slotIndex={slotIndex} />
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Pain summary bullets */}
              <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {PAIN_BULLETS.map((b) => (
                    <li key={b} className="flex items-center gap-1.5">
                      <AlertCircle size={12} className="text-[var(--color-text-muted)] flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-sm font-semibold text-[var(--color-text-muted)]">
                Multiple places to post, no single view — more friction, less done.
              </p>
            </div>
          </motion.div>

          {/* Right — With FirstDoer (task capsules + flow) */}
          <motion.div variants={itemUp} className="relative">
            <div className="rounded-2xl border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary-subtle)]/30 p-5 sm:p-6 min-h-[320px] flex flex-col">
              <p className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap size={14} strokeWidth={2.5} />
                With FirstDoer
              </p>

              {/* Task capsules — 3 at a time; rotate to next 3 after 8s, same layout */}
              <div className="space-y-2.5 flex-1 flex flex-col">
                {[0, 1, 2].map((slotIndex) => {
                  const domain = visibleDomains[slotIndex];
                  return (
                    <div key={slotIndex} className="min-h-[4.5rem] overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                        <WithCapsule key={domain.id} domain={domain} isInView={isInView} slotIndex={slotIndex} />
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Flow bullets */}
              <div className="mt-4 pt-4 border-t border-[var(--color-primary)]/10">
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {FLOW_BULLETS.map((b) => (
                    <li key={b} className="flex items-center gap-1.5">
                      <CheckCircle size={12} className="text-[var(--color-primary)] flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">
                That’s it — one place. Post your task and get matched.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-[var(--color-text-muted)]"
        >
          Post your task in any domain → get matched with the right performers
        </motion.p>
      </div>
    </section>
  );
}

const capsuleTransition = (slotIndex = 0) => ({
  type: "tween",
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
  delay: slotIndex * 0.06,
});

function WithCapsule({ domain, isInView, slotIndex = 0 }) {
  const Icon = domain.icon;
  const displayText = useTypewriter(domain.tasks, 45, 2800);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={capsuleTransition(slotIndex)}
      className="flex gap-3 rounded-xl border border-[var(--color-primary)]/20 bg-white p-3 sm:p-4 shadow-[var(--shadow-sm)]"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">
          {domain.name}
        </p>
        <p className="text-sm font-medium text-[var(--color-text)] leading-snug min-h-[2rem]">
          {displayText}
          <motion.span
            animate={{ opacity: [1, 0.35] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-0.5 h-3.5 bg-[var(--color-primary)] align-middle ml-0.5"
            aria-hidden
          />
        </p>
      </div>
    </motion.div>
  );
}

function WithoutCapsule({ cap, slotIndex = 0 }) {
  const Icon = cap.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={capsuleTransition(slotIndex)}
      className="flex gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3 sm:p-4 shadow-[var(--shadow-sm)]"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)] flex items-center justify-center">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
          {cap.title}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] leading-snug">
          {cap.description}
        </p>
      </div>
    </motion.div>
  );
}
