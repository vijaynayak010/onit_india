import React from "react";
import { motion } from "framer-motion";
import { Star, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

function TagBadge({ label, urgent }) {
  if (urgent) {
    return (
      <span className="inline-flex rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-md bg-[var(--color-primary-subtle)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-primary)]">
      {label}
    </span>
  );
}

const PerformerAvailableTaskCard = ({
  task,
  index = 0,
  onViewDetails,
  interestStatus = null,
  compact = false,
}) => (
  <motion.article
    {...fadeUp}
    transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)] ${
      compact ? "p-4" : "p-5 sm:p-6"
    }`}
  >
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
        {task.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} label={tag} urgent={tag === "URGENT"} />
        ))}
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-amber-500">
        <Star size={14} fill="currentColor" strokeWidth={0} />
        {task.rating}
      </span>
    </div>

    <h3
      onClick={() => onViewDetails?.(task)}
      className={`mb-3 cursor-pointer font-bold leading-snug text-[var(--color-text)] transition hover:text-[var(--color-primary)] ${
        compact ? "line-clamp-2 text-[15px]" : "text-lg"
      }`}
    >
      {task.title}
    </h3>

    <p className={`font-bold text-[var(--color-text)] ${compact ? "text-lg" : "text-xl"}`}>
      {task.priceLabel}
    </p>

    <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-text-muted)]">
      <Calendar size={14} className="shrink-0 text-[var(--color-text-subtle)]" strokeWidth={2} />
      <span className="line-clamp-1">{task.deadlineLabel}</span>
    </div>

    <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-4">
      <button
        type="button"
        onClick={() => onViewDetails?.(task)}
        className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--color-primary)] hover:underline"
      >
        View task details
        <ArrowUpRight size={14} strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={() => onViewDetails?.(task)}
        className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold shadow-[var(--shadow-xs)] transition ${
          interestStatus
            ? "bg-[#EFFBFB] text-[var(--color-primary)] ring-1 ring-emerald-100"
            : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
        }`}
      >
        {interestStatus ? <CheckCircle2 size={14} strokeWidth={2.4} /> : null}
        {interestStatus ? "Interest sent" : "View task"}
      </button>
    </div>
  </motion.article>
);

export default PerformerAvailableTaskCard;
