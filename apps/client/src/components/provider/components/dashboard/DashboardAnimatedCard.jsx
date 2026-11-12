import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Eye,
  ClipboardCheck,
  XCircle,
  MessageSquare,
  Compass,
} from "lucide-react";

const ACTION_CONFIG = {
  view: {
    label: "View",
    icon: Eye,
    gradient: "from-[#10605F] to-[#083B3A]",
    shadow: "rgba(16,185,129,0.35)",
    chip: "Live",
  },
  review: {
    label: "Review",
    icon: ClipboardCheck,
    gradient: "from-amber-500 to-orange-500",
    shadow: "rgba(245,158,11,0.35)",
    chip: "Pending",
  },
  details: {
    label: "Details",
    icon: ClipboardCheck,
    gradient: "from-amber-400 to-yellow-500",
    shadow: "rgba(245,158,11,0.35)",
    chip: "Pending",
  },
  reject: {
    label: "Reject",
    icon: XCircle,
    gradient: "from-red-500 to-rose-600",
    shadow: "rgba(239,68,68,0.35)",
    chip: "Action",
  },
  feedback: {
    label: "View Feedback",
    icon: MessageSquare,
    gradient: "from-red-500 to-rose-600",
    shadow: "rgba(239,68,68,0.35)",
    chip: "Notes",
  },
  explore: {
    label: "Explore",
    icon: Compass,
    gradient: "from-[#10605F] to-teal-600",
    shadow: "rgba(16,185,129,0.35)",
    chip: "Open",
  },
};

export const AnimatedReveal = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: -8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PulseBadge = ({ count }) => (
  <motion.span
    animate={{ scale: [0.85, 1, 0.85] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-[#10605F] px-2 py-0.5 text-[11px] font-bold text-white"
  >
    {count}
  </motion.span>
);

export const LiveChip = ({ label = "Live" }) => (
  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#29ADAC]/30 bg-[#EFFBFB] px-2 py-1 text-[11px] font-semibold text-[#083B3A]">
    <motion.span
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      className="h-1.5 w-1.5 rounded-full bg-[#10605F]"
    />
    {label}
  </span>
);

export const GradientActionButton = ({ actionType = "view", onClick, disabled }) => {
  const config = ACTION_CONFIG[actionType] || ACTION_CONFIG.view;
  const Icon = config.icon;

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br ${config.gradient} px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg transition disabled:opacity-50`}
      style={{ boxShadow: `0 4px 10px ${config.shadow}` }}
    >
      {config.label}
      <Icon size={15} strokeWidth={2.5} />
    </motion.button>
  );
};

export const DashboardTaskCard = ({
  title,
  timeAgo,
  meta,
  price,
  actionType = "view",
  chipLabel,
  onAction,
  index = 0,
  animate = true,
}) => {
  const content = (
    <div className="rounded-2xl border border-[#29ADAC]/20/80 bg-white p-4 shadow-sm">
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 flex-1 text-[15px] font-medium leading-snug tracking-tight text-gray-900">
          {title}
        </h3>
        <LiveChip label={chipLabel || ACTION_CONFIG[actionType]?.chip || "Live"} />
      </div>

      <div className="mb-3.5 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-400">
        <span className="inline-flex items-center gap-1">
          <Clock size={13} />
          {timeAgo}
        </span>
        {meta ? (
          <>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="inline-flex items-center gap-1">
              <User size={13} />
              {meta}
            </span>
          </>
        ) : null}
      </div>

      <div className="border-t border-gray-100 pt-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Budget</p>
            <p className="text-lg font-medium tracking-tight text-[#10605F]">{price}</p>
          </div>
          <GradientActionButton actionType={actionType} onClick={onAction} />
        </div>
      </div>
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Recently posted";
  try {
    const date = new Date(dateString);
    const duration = Date.now() - date.getTime();
    const days = Math.floor(duration / 86400000);
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor(duration / 60000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  } catch {
    return "Recently posted";
  }
};

const formatPrice = (task) => {
  if (task?.budget) return task.budget;
  const amount = task?.priceAmount ?? task?.raw?.priceAmount;
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const AUTO_SLIDE_MS = 5000;

const InterestCardCarousel = ({ tasks, onViewApplicants }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const count = tasks.length;
  const hasMultiple = count > 1;

  useEffect(() => {
    setActiveIndex(0);
    setDirection(1);
  }, [count]);

  const goTo = useCallback(
    (nextIndex, slideDirection) => {
      if (!count) return;
      setDirection(slideDirection);
      setActiveIndex((nextIndex + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);

  useEffect(() => {
    if (!hasMultiple || paused) return undefined;
    const timer = setInterval(goNext, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, paused, goNext, activeIndex]);

  if (!count) return null;

  const task = tasks[activeIndex];
  const applicantCount = task.applicantsCount || task.applicants?.length || 0;

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
  };

  return (
    <div
      className="border-t border-gray-100 px-3 pb-3 pt-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex items-center gap-2">
        {hasMultiple ? (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous interest card"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#29ADAC]/30 hover:bg-[#EFFBFB] hover:text-[#083B3A] active:scale-95"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
        ) : null}

        <div className="min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={task.id || activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <DashboardTaskCard
                animate={false}
                title={task.title || task.task || "Untitled Task"}
                timeAgo={formatTimeAgo(task.createdAt)}
                meta={`${applicantCount} applicant${applicantCount > 1 ? "s" : ""}`}
                price={formatPrice(task)}
                actionType="view"
                chipLabel="Live"
                onAction={() => onViewApplicants?.(task)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {hasMultiple ? (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next interest card"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#29ADAC]/30 hover:bg-[#EFFBFB] hover:text-[#083B3A] active:scale-95"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {tasks.map((t, i) => (
            <button
              key={t.id || i}
              type="button"
              aria-label={`Go to interest card ${i + 1}`}
              onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-5 bg-[#10605F]" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const InterestAlertBar = ({ activities = [], onViewApplicants }) => {
  const interestTasks = activities.filter((task) => {
    const status = String(task.rawStatus || task.status || "").toUpperCase();
    const applicantCount = task.applicantsCount || task.applicants?.length || 0;
    return status === "PUBLISHED" && applicantCount > 0;
  });

  const totalInterests = interestTasks.reduce(
    (sum, task) => sum + (task.applicantsCount || task.applicants?.length || 0),
    0
  );

  if (!interestTasks.length) return null;

  return (
    <AnimatedReveal>
      <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-[0_4px_20px_rgba(16,185,129,0.08),0_2px_10px_rgba(0,0,0,0.04)]">
        <div className="flex w-full items-center gap-3 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10605F] to-[#083B3A] text-white shadow-[0_3px_8px_rgba(16,185,129,0.3)]">
            <Users size={18} strokeWidth={2.25} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">New Interests</span>
              <PulseBadge count={totalInterests} />
            </div>
            <p className="text-xs font-medium text-gray-400">
              {interestTasks.length} task{interestTasks.length > 1 ? "s" : ""} with new applicants
            </p>
          </div>
          {interestTasks.length > 1 ? (
            <span className="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Auto slide
            </span>
          ) : null}
        </div>

        <InterestCardCarousel tasks={interestTasks} onViewApplicants={onViewApplicants} />
      </div>
    </AnimatedReveal>
  );
};

export const DashboardActionCards = ({ activities = [], onTaskAction }) => {
  const cards = [];

  activities.forEach((task) => {
    const status = String(task.rawStatus || task.status || "").toUpperCase();

    if (status === "SUBMITTED") {
      cards.push({
        key: `${task.id}-review`,
        task,
        actionType: "review",
        chipLabel: "Pending",
        meta: "Work submitted for review",
      });
    }
  });

  if (!cards.length) return null;

  return (
    <div className="space-y-3">
      {cards.map((item, index) => (
        <DashboardTaskCard
          key={item.key}
          index={index}
          title={item.task.title || item.task.task || "Untitled Task"}
          timeAgo={formatTimeAgo(item.task.createdAt)}
          meta={item.meta}
          price={formatPrice(item.task)}
          actionType={item.actionType}
          chipLabel={item.chipLabel}
          onAction={() => onTaskAction?.(item.task, item.actionType)}
        />
      ))}
    </div>
  );
};

export default InterestAlertBar;
