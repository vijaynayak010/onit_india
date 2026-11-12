import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  BadgeCheck,
  Check,
  ClipboardList,
  Clock,
  MapPin,
  MousePointerClick,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  UsersRound,
  Zap as ZapLucide,
} from "lucide-react";
import { Shield, Zap, Users, FileText, Percent, Briefcase, CheckCircle } from "react-feather";

const REASONS = [
  {
    icon: Percent,
    title: "Low commission, fair pay",
    description:
      "Platform fees stay low so providers and performers keep more of every task. Pricing is shown before you accept—no surprise charges when work is completed.",
    featured: true,
    highlights: [
      "See fees and terms before you accept a task",
      "Pay aligns to completed work—no mystery deductions",
      "The largest share is built for people doing the work",
    ],
  },
  {
    icon: Shield,
    title: "Verified Community",
    description: "Identity checks and reviews. Work with trusted performers and reliable providers.",
    highlights: [
      "Accountability through identity checks",
      "Ratings and reviews you can rely on",
    ],
    quickPoints: [
      { Icon: UserCheck, label: "Verified profiles" },
      { Icon: Star, label: "Honest reviews" },
      { Icon: ShieldCheck, label: "Trusted matching" },
    ],
  },
  {
    icon: Zap,
    title: "Post a Task in Minutes",
    description: "Describe what you need, get matched with local help, and have it done—without the hassle.",
    highlights: [
      "Short forms—get live without friction",
      "Matched with nearby help quickly",
    ],
    quickPoints: [
      { Icon: Clock, label: "Post in minutes" },
      { Icon: ZapLucide, label: "Fast matching" },
      { Icon: MousePointerClick, label: "Simple steps" },
    ],
  },
  {
    icon: FileText,
    title: "Clear & Transparent",
    description: "Simple process, clear expectations, and milestone-based payments for everyone.",
    highlights: [
      "Expectations spelled out up front",
      "Milestone-based payments when work lands",
    ],
    quickPoints: [
      { Icon: ClipboardList, label: "Clear scope" },
      { Icon: Scale, label: "Fair terms" },
      { Icon: Sparkles, label: "No fine-print games" },
    ],
  },
  {
    icon: Users,
    title: "Built for Local Trust",
    description: "Hyperlocal by design. Connect with people nearby and get help in your neighborhood.",
    highlights: [
      "Neighborhood-first discovery",
      "Real people—not anonymous bots",
    ],
    quickPoints: [
      { Icon: MapPin, label: "Nearby" },
      { Icon: UsersRound, label: "Local network" },
      { Icon: BadgeCheck, label: "Community trust" },
    ],
  },
];

/** Subtle layered backgrounds per card (low opacity — keeps copy readable) */
const CARD_BACKDROPS = [
  {
    base: "bg-gradient-to-br from-[var(--color-primary-subtle)]/90 via-white/95 to-[var(--color-surface)]/90",
    orb: "bg-[var(--color-primary)]/18",
    mesh: "from-[var(--color-primary)]/[0.07]",
  },
  {
    base: "bg-gradient-to-br from-sky-50/50 via-white/95 to-slate-50/40",
    orb: "bg-sky-400/14",
    mesh: "from-sky-500/[0.06]",
  },
  {
    base: "bg-gradient-to-br from-amber-50/45 via-white/95 to-orange-50/25",
    orb: "bg-amber-400/12",
    mesh: "from-amber-500/[0.06]",
  },
  {
    base: "bg-gradient-to-br from-violet-50/45 via-white/95 to-slate-50/35",
    orb: "bg-violet-400/12",
    mesh: "from-violet-500/[0.06]",
  },
  {
    base: "bg-gradient-to-br from-teal-50/45 via-white/95 to-emerald-50/30",
    orb: "bg-teal-400/12",
    mesh: "from-teal-600/[0.06]",
  },
];

/**
 * Bento layout (md+): 4 columns × 3 rows
 * [ 0: hero 2×2  ] [ 1 ]
 * [              ] [ 2 ]
 * [ 3            ] [ 4 ]
 */
const BENTO_CELLS = [
  "md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1",
  "md:col-span-2 md:row-span-1 md:col-start-3 md:row-start-1",
  "md:col-span-2 md:row-span-1 md:col-start-3 md:row-start-2",
  "md:col-span-2 md:row-span-1 md:col-start-1 md:row-start-3",
  "md:col-span-2 md:row-span-1 md:col-start-3 md:row-start-3",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const numberVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const STATS = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "People connected",
    subline: "Task providers & performers on the platform",
  },
  {
    icon: Briefcase,
    value: 100,
    suffix: "+",
    label: "Brands connected",
    subline: "Businesses posting tasks & hiring help",
  },
  {
    icon: CheckCircle,
    value: 500,
    suffix: "+",
    label: "Tasks done",
    subline: "Completed work across categories",
  },
];

const DURATION_MS = 1600;
const EASING = (t) => 1 - (1 - t) ** 3;

function CountUp({ end, durationMs = DURATION_MS, enabled }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / durationMs);
      setN(Math.round(EASING(p) * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, durationMs, enabled]);
  return <>{n.toLocaleString("en-IN")}</>;
}

const metricsItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

function PlatformMetricsStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      id="platform-stats"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 md:mb-12"
      aria-labelledby="why-choose-platform-metrics-heading"
    >
      <p
        id="why-choose-platform-metrics-heading"
        className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]"
      >
        Platform snapshot
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={metricsItemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/80 px-4 py-4 shadow-[var(--shadow-sm)] ring-1 ring-black/[0.03] backdrop-blur-sm transition-shadow hover:shadow-md md:px-5 md:py-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums tracking-tight text-[var(--color-text)] sm:text-3xl">
                      <CountUp end={stat.value} enabled={isInView} />
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{stat.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-muted)]">{stat.subline}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/** Right column: three clear bands — philosophy / model / note */
function FeaturedCommissionPanel() {
  return (
    <aside
      className="flex h-full min-h-0 flex-col divide-y divide-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/55"
      aria-labelledby="featured-payout-heading"
    >
      {/* 1 — Principle */}
      <section className="px-4 py-3.5 sm:px-5 sm:py-4" aria-labelledby="featured-payout-heading">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-subtle)] text-[10px] font-bold text-[var(--color-primary)]"
            aria-hidden
          >
            1
          </span>
          <div className="min-w-0 flex-1 border-l-2 border-[var(--color-primary-muted)] pl-3">
            <h4
              id="featured-payout-heading"
              className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]"
            >
              How we think about payouts
            </h4>
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-[var(--color-text)]">
              Payments are built so <span className="text-[var(--color-text)]">task providers and performers</span>—the
              people doing the work—get the largest share.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
              The platform takes a <span className="font-medium text-[var(--color-text)]">smaller fee</span> to keep the
              service running.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — Visual model (illustrative only) */}
      <section
        className="flex flex-1 flex-col px-4 py-3.5 sm:px-5 sm:py-4"
        aria-labelledby="illustrative-split-heading"
      >
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary-subtle)] text-[10px] font-bold text-[var(--color-primary)]"
            aria-hidden
          >
            2
          </span>
          <div className="min-w-0 flex-1 border-l-2 border-[var(--color-primary-muted)] pl-3">
            <h4
              id="illustrative-split-heading"
              className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
            >
              Illustrative split
            </h4>
            <p className="mt-1 text-[10px] leading-snug text-[var(--color-text-subtle)]">
              Not real percentages—only shows how shares relate.
            </p>

            <div
              className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-[var(--color-border-subtle)] ring-1 ring-black/[0.04]"
              role="img"
              aria-label="Illustration: a long segment for providers and performers, a shorter segment for platform fee"
            >
              <div
                className="min-w-[58%] bg-gradient-to-r from-[var(--color-primary)] to-emerald-400"
                aria-hidden
              />
              <div
                className="min-w-[10%] flex-1 bg-gradient-to-r from-emerald-100 to-[var(--color-primary-subtle)]"
                aria-hidden
              />
            </div>

            <dl className="mt-3 space-y-2.5">
              <div className="flex gap-2 rounded-lg bg-[var(--color-primary-subtle)]/50 px-2.5 py-2 ring-1 ring-[var(--color-primary-muted)]/40">
                <dt className="sr-only">Share one</dt>
                <dd className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-[var(--color-primary)]">Providers & performers</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[var(--color-text-muted)]">
                    Larger portion of each payment
                  </p>
                </dd>
              </div>
              <div className="flex gap-2 rounded-lg bg-[var(--color-surface)]/90 px-2.5 py-2 ring-1 ring-[var(--color-border-subtle)]">
                <dt className="sr-only">Share two</dt>
                <dd className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-[var(--color-text)]">Platform fee</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[var(--color-text-muted)]">
                    Smaller slice to operate the platform
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 3 — Disclaimer */}
      <footer className="bg-[var(--color-border-subtle)]/40 px-4 py-3 sm:px-5">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-text-subtle)]/15 text-[9px] font-bold uppercase text-[var(--color-text-subtle)]"
            aria-hidden
          >
            i
          </span>
          <div className="min-w-0 border-l-2 border-[var(--color-border)] pl-3">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
              Before you book or accept
            </p>
            <p className="mt-1 text-[9px] leading-relaxed text-[var(--color-text-subtle)]">
              Fees are not fixed here—they depend on the task category and scope. You will always see the applicable fees
              when you book or accept a task.
            </p>
          </div>
        </div>
      </footer>
    </aside>
  );
}

function ReasonCard({ item, index }) {
  const Icon = item.icon;
  const num = String(index + 1).padStart(2, "0");
  const featured = item.featured === true;
  const highlights = Array.isArray(item.highlights) ? item.highlights : [];
  const quickPoints = Array.isArray(item.quickPoints) ? item.quickPoints : [];
  const backdrop = CARD_BACKDROPS[index] ?? CARD_BACKDROPS[0];
  const bentoCell = BENTO_CELLS[index] ?? "";

  return (
    <motion.article
      role="listitem"
      variants={cardVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`group relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--color-border)] shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-[var(--color-primary)]/40 hover:shadow-md ${bentoCell} ${
        featured ? "md:min-h-0" : ""
      }`}
    >
      {/* Layered backgrounds — low opacity */}
      <div
        className={`pointer-events-none absolute inset-0 ${backdrop.base}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_100%_0%,rgba(255,255,255,0.72),transparent_55%)]"
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-px w-[140%] rotate-45 bg-gradient-to-r ${backdrop.mesh} to-transparent opacity-50`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute -bottom-6 -right-4 h-28 w-28 rounded-full ${backdrop.orb} blur-2xl sm:h-32 sm:w-32`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.06) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
      {featured && (
        <div
          className="pointer-events-none absolute -left-8 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[var(--color-primary)]/10 blur-2xl"
          aria-hidden
        />
      )}

      <motion.div
        className="absolute bottom-0 left-0 z-[1] h-0.5 origin-left bg-[var(--color-primary)]"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />
      <div
        className={`relative z-[2] flex h-full min-h-0 flex-col backdrop-blur-[2px] ${
          featured ? "p-4 sm:p-5 md:p-5" : "p-4 sm:p-4 md:p-4"
        }`}
      >
        {featured && highlights.length > 0 ? (
          <div className="h-full min-h-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] md:grid md:grid-cols-2 md:divide-x md:divide-[var(--color-border-subtle)]">
            <section className="flex min-h-0 flex-col p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <motion.span
                    variants={numberVariants}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-xs font-bold tabular-nums text-[var(--color-primary)]"
                  >
                    {num}
                  </motion.span>
                  <span className="rounded-full border border-[var(--color-primary-muted)] bg-[var(--color-primary-subtle)]/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                    Fees & payouts
                  </span>
                </div>
                <motion.div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)]"
                  whileHover={{ scale: 1.05, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  aria-hidden
                >
                  <Icon size={22} strokeWidth={2} />
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
                {item.description}
              </p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                What you can expect
              </p>
              <ul className="mt-2 space-y-2 border-t border-[var(--color-border-subtle)] pt-3">
                {highlights.map((line) => (
                  <li key={line} className="flex gap-2.5 text-[13px] text-[var(--color-text)]">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                      <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />
                    </span>
                    <span className="leading-snug text-[var(--color-text-muted)]">{line}</span>
                  </li>
                ))}
              </ul>
            </section>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[200px] flex-col border-t border-[var(--color-border-subtle)] md:min-h-0 md:border-t-0"
            >
              <FeaturedCommissionPanel />
            </motion.div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className={`flex items-start justify-between gap-3 ${featured ? "mb-4" : "mb-3"}`}>
              <motion.span
                variants={numberVariants}
                className={`flex items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-xs font-bold tabular-nums text-[var(--color-primary)] ${
                  featured ? "h-9 w-9" : "h-8 w-8 sm:h-9 sm:w-9"
                }`}
              >
                {num}
              </motion.span>
              <motion.div
                className={`flex items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)] ${
                  featured ? "h-10 w-10" : "h-9 w-9"
                }`}
                whileHover={{ scale: 1.06, rotate: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                aria-hidden
              >
                <Icon size={featured ? 22 : 20} strokeWidth={2} />
              </motion.div>
            </div>
            <div className={`flex min-h-0 flex-1 flex-col ${featured ? "mt-auto" : ""}`}>
              <h3
                className={`font-semibold leading-tight text-[var(--color-text)] ${
                  featured ? "mb-1.5 text-lg sm:text-xl" : "mb-1.5 text-base sm:text-[1.05rem]"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`leading-snug text-[var(--color-text-muted)] ${
                  featured ? "text-sm" : "text-[13px] sm:text-sm"
                }`}
              >
                {item.description}
              </p>
              {!featured && highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-[var(--color-border-subtle)] pt-3">
                  {highlights.map((line) => (
                    <li key={line} className="flex gap-2 text-[12px] leading-snug text-[var(--color-text-muted)] sm:text-[13px]">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                        <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!featured && quickPoints.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {quickPoints.map(({ Icon: QIcon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white/75 px-2 py-1 text-[10px] font-medium text-[var(--color-text)] shadow-[var(--shadow-xs)] ring-1 ring-black/[0.03] backdrop-blur-sm transition-colors group-hover:border-[var(--color-primary-muted)] sm:text-[11px]"
                    >
                      <QIcon className="h-3 w-3 shrink-0 text-[var(--color-primary)]" aria-hidden />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function WhyChooseUs() {
  return (
    <section
      id="whychooseus"
      className="relative bg-[var(--color-surface)] py-14 md:py-16 overflow-hidden"
      aria-labelledby="why-choose-us-heading"
    >
      {/* Background — subtle grid + gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-text) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-text) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-80 bg-gradient-to-b from-[var(--color-primary)]/8 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header — structured, animated */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center md:mb-12"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]"
          >
            Why Work With Us
          </motion.p>
          <h2
            id="why-choose-us-heading"
            className="text-2xl font-bold leading-[1.2] tracking-tight text-[var(--color-text)] sm:text-3xl md:text-4xl"
          >
            Why Choose{" "}
            <span className="text-[var(--color-text)]">
              On<span className="text-[var(--color-primary)]">IT</span> INDIA
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base"
          >
            We built the platform we’d want to use—fair, simple, and built around real people and local trust.
          </motion.p>
        </motion.header>

        <PlatformMetricsStrip />

        {/* Bento grid — 4×3 on md+, single column on small screens */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-4 md:grid-rows-3 md:gap-3.5 lg:gap-4"
          role="list"
          aria-label="Why choose FirstDoer — bento grid"
        >
          {REASONS.map((item, index) => (
            <ReasonCard key={item.title} item={item} index={index} />
          ))}
        </motion.div>

        {/* Trust line — animated last */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center md:mt-12"
        >
          <p className="text-sm text-[var(--color-text-subtle)]">
            Join thousands of task providers and performers who trust On
            <span className="text-[var(--color-primary)] font-semibold">IT</span> India for local, flexible work.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
