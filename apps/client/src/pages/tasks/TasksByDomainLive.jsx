import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  Image,
  Cpu,
  BookOpen,
  MapPin,
  Radio,
} from "react-feather";

/**
 * "Live Pulse" — Engaging, non-generic section:
 * - Central hero: one typewriter cycling through tasks; domain badge + domain orbs sync with it
 * - Domain orbs pulse when their task is "live"
 * - Streaming strip of task cards below for a feed feel
 */

const LIVE_TASKS = [
  { domain: "Business & Research", task: "Research 20 B2B leads in ed-tech", icon: Briefcase },
  { domain: "Content & Design", task: "Design 5 Instagram carousel posts for my launch", icon: Image },
  { domain: "Tech & Data", task: "Build a tracker sheet with formulas and conditional formatting", icon: Cpu },
  { domain: "Academic", task: "15-slide presentation on renewable energy with references", icon: BookOpen },
  { domain: "On-Ground & Local", task: "Visit 5 stores, verify product display and share photos", icon: MapPin },
  { domain: "Business & Research", task: "Market and competitor analysis report", icon: Briefcase },
  { domain: "Content & Design", task: "Edit wedding video highlights", icon: Image },
  { domain: "Tech & Data", task: "Zapier automation and web scraping", icon: Cpu },
];

const STREAM_TASKS = [
  { domain: "Writing", task: "Rewrite my resume to get more interviews" },
  { domain: "Consulting", task: "Help me choose the right database" },
  { domain: "Academic", task: "Literature review and citations" },
  { domain: "On-Ground", task: "Document pickup and delivery" },
  { domain: "Content", task: "Logo and social thumbnails" },
  { domain: "Business", task: "Lead generation and list building" },
];

function useTypewriterWithIndex(phrases, speed = 38, pauseMs = 2600) {
  const [display, setDisplay] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const phaseRef = useRef("typing");

  const getTask = (i) => (phrases[i] ?? phrases[0])?.task ?? (typeof phrases[i] === "string" ? phrases[i] : "");

  useEffect(() => {
    const phrase = getTask(phraseIndex);
    const isDoneTyping = charIndex >= phrase.length;
    const isDoneDeleting = charIndex <= 0;

    const t = setTimeout(() => {
      if (phaseRef.current === "typing") {
        if (isDoneTyping) {
          phaseRef.current = "pausing";
          setDisplay(phrase);
          return;
        }
        setDisplay(phrase.slice(0, charIndex + 1));
        setCharIndex((i) => i + 1);
        return;
      }
      if (phaseRef.current === "pausing") {
        phaseRef.current = "deleting";
        return;
      }
      if (phaseRef.current === "deleting") {
        if (isDoneDeleting) {
          phaseRef.current = "typing";
          setPhraseIndex((i) => (i + 1) % phrases.length);
          setCharIndex(0);
          setDisplay("");
          return;
        }
        setDisplay(phrase.slice(0, charIndex - 1));
        setCharIndex((i) => i - 1);
        return;
      }
    }, phaseRef.current === "pausing" ? pauseMs : speed);

    return () => clearTimeout(t);
  }, [phrases, phraseIndex, charIndex, speed, pauseMs]);

  return { display, phraseIndex };
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const itemUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function TasksByDomainLive() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.06 });
  const { display, phraseIndex } = useTypewriterWithIndex(LIVE_TASKS, 38, 2600);
  const current = LIVE_TASKS[phraseIndex] ?? LIVE_TASKS[0];

  // Unique domains for orbs (by order of first appearance)
  const domainOrbs = LIVE_TASKS.reduce((acc, t) => {
    if (!acc.find((d) => d.domain === t.domain)) acc.push({ domain: t.domain, icon: t.icon });
    return acc;
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tasks-by-domain-live"
      className="relative w-full overflow-hidden bg-[var(--color-surface)]"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] max-w-2xl h-80 bg-gradient-to-b from-[var(--color-primary)]/8 via-[var(--color-primary)]/3 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20">
        {/* Header — punchy and intriguing */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-1.5 text-sm font-semibold mb-3">
            <Radio size={14} strokeWidth={2.5} />
            Live on OnIT
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-2">
            See what’s getting posted right now
          </h2>
          <p className="text-base text-[var(--color-text-muted)] max-w-lg mx-auto">
            Real tasks from every domain — post yours and get matched in minutes.
          </p>
        </motion.header>

        {/* Central hero — one "live" post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8 md:mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[var(--color-primary)]/25 bg-[var(--color-surface-elevated)] shadow-[var(--shadow-lg)]"
          >
            {/* Gradient glow that shifts */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-primary)]/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--color-primary)]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative p-5 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  Live
                </span>
                <motion.span
                  key={current.domain}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg bg-[var(--color-primary-subtle)] text-[var(--color-primary)] px-3 py-1.5 text-sm font-semibold"
                >
                  {current.domain}
                </motion.span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--color-text)] leading-snug pr-2 min-h-[2.5rem]">
                {display}
                <motion.span
                  animate={{ opacity: [1, 0.3] }}
                  transition={{ duration: 0.55, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 md:h-6 bg-[var(--color-primary)] align-middle ml-0.5"
                  aria-hidden
                />
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                This is the kind of task people post every day — pick your domain and post yours.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Domain orbs — pulse when this domain is "live" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10"
        >
          {domainOrbs.map((item, i) => {
            const Icon = item.icon;
            const isActive = current.domain === item.domain;
            return (
              <motion.div
                key={item.domain}
                animate={{
                  scale: isActive ? 1.12 : 1,
                  boxShadow: isActive
                    ? "0 0 0 3px rgba(5, 150, 105, 0.35), 0 4px 14px rgba(5, 150, 105, 0.2)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                    isActive ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                  }`}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold max-w-[72px] text-center truncate ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-subtle)]"}`}>
                  {item.domain?.replace(/ & .*/, "") || 'General'}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Streaming strip — "More from the feed" */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          viewport={{ once: true }}
          className="mb-2"
        >
          <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider mb-3 text-center">
            More tasks from the feed
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STREAM_TASKS.map((item, i) => (
              <StreamCard key={i} item={item} isInView={isInView} />
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45 }}
          className="text-center text-sm text-[var(--color-text-muted)] mt-6"
        >
          Post your task in any domain — get matched with the right performers.
        </motion.p>
      </div>
    </section>
  );
}

function StreamCard({ item, isInView }) {
  const [display, setDisplay] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const phaseRef = useRef("typing");

  useEffect(() => {
    const phrase = item.task;
    const isDoneTyping = charIndex >= phrase.length;
    const isDoneDeleting = charIndex <= 0;
    const t = setTimeout(() => {
      if (phaseRef.current === "typing") {
        if (isDoneTyping) {
          phaseRef.current = "pausing";
          setDisplay(phrase);
          return;
        }
        setDisplay(phrase.slice(0, charIndex + 1));
        setCharIndex((i) => i + 1);
        return;
      }
      if (phaseRef.current === "pausing") {
        phaseRef.current = "deleting";
        return;
      }
      if (phaseRef.current === "deleting") {
        if (isDoneDeleting) {
          phaseRef.current = "typing";
          setCharIndex(0);
          setDisplay("");
          return;
        }
        setDisplay(phrase.slice(0, charIndex - 1));
        setCharIndex((i) => i - 1);
        return;
      }
    }, phaseRef.current === "pausing" ? 2200 : 35);
    return () => clearTimeout(t);
  }, [item.task, phraseIndex, charIndex]);

  return (
    <motion.div
      variants={itemUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 sm:p-4 shadow-[var(--shadow-sm)] hover:border-[var(--color-primary)]/25 hover:shadow-[var(--shadow-sm)] transition-all"
    >
      <p className="text-sm font-medium text-[var(--color-text)] leading-snug pr-14 min-h-[2.25rem]">
        {display}
        <motion.span
          animate={{ opacity: [1, 0.4] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-3.5 bg-[var(--color-primary)] align-middle ml-0.5"
          aria-hidden
        />
      </p>
      <span className="inline-block mt-1.5 rounded-md bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
        {item.domain}
      </span>
    </motion.div>
  );
}
