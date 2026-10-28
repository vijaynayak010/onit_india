import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getSpotlightTypeForTask,
  normalizeTaskStatus,
  SPOTLIGHT_TYPES,
} from "../../utils/taskSpotlight";
import { getTaskInterests } from "../../services/api";
import TalentWaitingCard from "./TalentWaitingCard";
import TaskSpotlightCard from "./TaskSpotlightCard";
import { AnimatedReveal, DashboardTaskCard } from "./DashboardAnimatedCard";

const AUTO_SLIDE_MS = 5500;

const LIVE_STATUSES = new Set([
  "PUBLISHED",
  "LIVE",
  "OPEN",
  "MATCHING",
  "ACCEPTING_APPLICATIONS",
]);

const ACTIVE_STATUSES = new Set([
  "IN_PROGRESS",
  "CLAIMED",
  "ASSIGNED",
  "ACCEPTED",
  "ACTIVE",
]);

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

const getAssignmentStatus = (task) => {
  const assignments = task?.taskAssignments || [];
  const assignment = Array.isArray(assignments) ? assignments[0] : assignments;
  return String(assignment?.status || "").toUpperCase();
};

/** Provider reviewing submitter work — not admin task-approval. */
const needsProviderReview = (task) => getAssignmentStatus(task) === "SUBMITTED";

const CarouselArrow = ({ direction, onClick, label }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    aria-label={label}
    className={`absolute top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 ${
      direction === "prev" ? "left-0 sm:-left-3" : "right-0 sm:-right-3"
    }`}
  >
    {direction === "prev" ? (
      <ChevronLeft size={20} strokeWidth={2.5} />
    ) : (
      <ChevronRight size={20} strokeWidth={2.5} />
    )}
  </button>
);

const DashboardActionCarousel = ({
  activities = [],
  performers = [],
  performerCount,
  onViewApplicants,
  onTaskAction,
}) => {
  const [interestCounts, setInterestCounts] = useState({});

  const publishedTaskIds = useMemo(
    () =>
      activities
        .filter((task) => LIVE_STATUSES.has(normalizeTaskStatus(task)))
        .map((task) => String(task.id))
        .filter(Boolean),
    [activities]
  );

  useEffect(() => {
    if (!publishedTaskIds.length) {
      setInterestCounts({});
      return;
    }

    let cancelled = false;

    const loadInterests = async () => {
      const results = await Promise.all(
        publishedTaskIds.map(async (taskId) => {
          try {
            const res = await getTaskInterests(taskId);
            const list = Array.isArray(res) ? res : res?.data || res?.interests || [];
            return [taskId, Array.isArray(list) ? list.length : 0];
          } catch {
            return [taskId, null];
          }
        })
      );

      if (cancelled) return;
      setInterestCounts(Object.fromEntries(results));
    };

    loadInterests();
    return () => {
      cancelled = true;
    };
  }, [publishedTaskIds.join(",")]);

  const getApplicantCount = (task) => {
    const taskId = String(task.id);
    const fetched = interestCounts[taskId];
    if (typeof fetched === "number") return fetched;
    return task.applicantsCount || task.applicants?.length || 0;
  };

  const slides = useMemo(() => {
    const items = [];
    const seenTaskIds = new Set();

    // Build task-specific slides first
    activities.forEach((task) => {
      const taskId = String(task.id);
      if (!taskId || seenTaskIds.has(taskId)) return;

      const status = normalizeTaskStatus(task);
      if (["DRAFT", "COMPLETED", "CANCELED", "CANCELLED"].includes(status)) return;

      const spotlightType = getSpotlightTypeForTask(task);
      const applicantCount = getApplicantCount(task);
      const title = task.title || task.task || "Untitled Task";
      const taskWithCounts = { ...task, applicantsCount: applicantCount };

      if (spotlightType === SPOTLIGHT_TYPES.REVIEW_FAILED) {
        seenTaskIds.add(taskId);
        items.push({
          id: `feedback-${taskId}`,
          kind: "rejection",
          render: () => (
            <TaskSpotlightCard embedded task={taskWithCounts} type={SPOTLIGHT_TYPES.REVIEW_FAILED} />
          ),
        });
        return;
      }

      if (needsProviderReview(task)) {
        seenTaskIds.add(taskId);
        items.push({
          id: `review-${taskId}`,
          kind: "interest",
          render: () => (
            <DashboardTaskCard
              animate={false}
              title={title}
              timeAgo={formatTimeAgo(task.createdAt)}
              meta="Work submitted — awaiting your review"
              price={formatPrice(task)}
              actionType="review"
              chipLabel="Pending"
              onAction={() => onTaskAction?.(task, "review")}
            />
          ),
        });
        return;
      }

      if (spotlightType === SPOTLIGHT_TYPES.UNDER_REVIEW) {
        seenTaskIds.add(taskId);
        items.push({
          id: `under-review-${taskId}`,
          kind: "details",
          render: () => (
            <TaskSpotlightCard embedded task={taskWithCounts} type={SPOTLIGHT_TYPES.UNDER_REVIEW} />
          ),
        });
        return;
      }

      if (LIVE_STATUSES.has(status)) {
        seenTaskIds.add(taskId);
        items.push({
          id: `view-${taskId}`,
          kind: "interest",
          render: () => (
            <TaskSpotlightCard embedded task={taskWithCounts} type={SPOTLIGHT_TYPES.LIVE} />
          ),
        });
        return;
      }

      if (ACTIVE_STATUSES.has(status)) {
        seenTaskIds.add(taskId);
        items.push({
          id: `active-${taskId}`,
          kind: "interest",
          render: () => (
            <DashboardTaskCard
              animate={false}
              title={title}
              timeAgo={formatTimeAgo(task.createdAt)}
              meta="Active task in progress"
              price={formatPrice(task)}
              actionType="view"
              chipLabel="Active"
              onAction={() => onTaskAction?.(task, "active")}
            />
          ),
        });
      }
    });

    // Show "Talent waiting" card when there are no active action items for tasks.
    if (items.length === 0) {
      items.push({
        id: "talent-explore",
        kind: "explore",
        render: () => (
          <TalentWaitingCard
            embedded
            performers={performers}
            availableCount={performerCount ?? performers.length ?? 0}
          />
        ),
      });
    }

    return items;
  }, [
    activities,
    performers,
    performerCount,
    interestCounts,
    onViewApplicants,
    onTaskAction,
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const hasMultiple = count > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [count]);

  const goTo = useCallback(
    (nextIndex) => {
      if (!count) return;
      setActiveIndex((nextIndex + count) % count);
    },
    [count]
  );

  const safeActiveIndex = Math.min(Math.max(activeIndex, 0), Math.max(count - 1, 0));
  const goNext = useCallback(() => goTo(safeActiveIndex + 1), [safeActiveIndex, goTo]);
  const goPrev = useCallback(() => goTo(safeActiveIndex - 1), [safeActiveIndex, goTo]);

  useEffect(() => {
    if (!hasMultiple || paused) return undefined;
    const timer = setInterval(goNext, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, paused, goNext]);

  if (!count) return null;

  // `activities` can refresh from several action cards to a single fallback
  // card. React applies the index-reset effect after that render, so clamp the
  // previous index here to keep the transient render valid.
  const activeSlide = slides[safeActiveIndex];

  if (!activeSlide || typeof activeSlide.render !== "function") return null;

  return (
    <AnimatedReveal>
      <div
        className="relative w-full overflow-hidden px-8 sm:px-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {hasMultiple ? (
          <>
            <CarouselArrow direction="prev" onClick={goPrev} label="Previous card" />
            <CarouselArrow direction="next" onClick={goNext} label="Next card" />
          </>
        ) : null}

        <div className="relative w-full overflow-hidden">
          <motion.div
            key={activeSlide.id}
            className="w-full"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.85 }}
            drag={hasMultiple ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -64 || info.velocity.x < -400) goNext();
              else if (info.offset.x > 64 || info.velocity.x > 400) goPrev();
            }}
          >
            {activeSlide.render()}
          </motion.div>
        </div>

        {hasMultiple ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === safeActiveIndex ? "w-6 bg-emerald-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </AnimatedReveal>
  );
};

export default DashboardActionCarousel;
