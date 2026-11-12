import React from "react";
import { useNavigate } from "react-router-dom";
import { SPOTLIGHT_TYPES } from "../../utils/taskSpotlight";
import {
  AnimatedReveal,
  GradientActionButton,
  LiveChip,
} from "./DashboardAnimatedCard";

const avatarStack = (task) => {
  const urls = task?.performerAvatars?.length
    ? task.performerAvatars
    : task?.performerAvatar
      ? [task.performerAvatar]
      : ["JD", "SM", "AK"].map(
          (n) => `https://ui-avatars.com/api/?name=${n}&background=random&size=64`
        );

  return urls.slice(0, 3);
};

const SpotlightShell = ({ children, borderClass, bgClass, embedded }) => {
  const section = (
    <section
      className={`overflow-hidden rounded-[var(--radius-2xl)] border p-5 shadow-[var(--shadow-sm)] sm:p-6 ${borderClass} ${bgClass}`}
    >
      {children}
    </section>
  );

  if (embedded) return section;

  return <AnimatedReveal>{section}</AnimatedReveal>;
};

const TaskSpotlightCard = ({ task, type, embedded = false }) => {
  const navigate = useNavigate();
  if (!task || !type) return null;

  const title = task.title || task.task || "Your task";
  const taskId = task.id;

  const goDetails = () => navigate(`/provider/task-status?taskId=${taskId}`);
  const goActivity = () => navigate(`/provider/task-activity?taskId=${taskId}`);
  const goApplicants = () => navigate(`/provider/task-applicants?taskId=${taskId}`);

  if (type === SPOTLIGHT_TYPES.UNDER_REVIEW) {
    return (
      <SpotlightShell embedded={embedded} borderClass="border-amber-100" bgClass="bg-gradient-to-r from-amber-50/80 to-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <LiveChip label="Pending" />
              <h2 className="truncate text-lg font-extrabold text-[var(--color-text)]">{title}</h2>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Your task is under review</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Submitted", "In Queue", `Est. ${task.estimatedReviewMinutes || 24}min`].map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    tag === "Submitted"
                      ? "bg-amber-100 text-amber-800"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-text-muted)]"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {avatarStack(task).map((src, i) => (
                <img key={i} src={src} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <GradientActionButton actionType="details" onClick={goDetails} />
          </div>
        </div>
      </SpotlightShell>
    );
  }

  if (type === SPOTLIGHT_TYPES.REVIEW_FAILED) {
    return (
      <SpotlightShell embedded={embedded} borderClass="border-red-100" bgClass="bg-gradient-to-r from-red-50/70 to-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <LiveChip label="Notes" />
              <h2 className="truncate text-lg font-extrabold text-[var(--color-text)]">{title}</h2>
            </div>
            <p className="text-sm font-semibold text-red-600">Review didn&apos;t pass</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Changes", "See Notes", "Resubmit"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-red-100 bg-white px-3 py-1 text-[11px] font-bold text-red-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {avatarStack(task).map((src, i) => (
                <img key={i} src={src} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <GradientActionButton actionType="feedback" onClick={goDetails} />
          </div>
        </div>
      </SpotlightShell>
    );
  }

  if (type === SPOTLIGHT_TYPES.LIVE) {
    const stats = task.matchingStats || {};
    const applicantCount = task.applicantsCount || 0;
    const views = Number(stats.views);
    const profileMatch = Number(stats.profileMatch);
    const statItems = [
      Number.isFinite(views) ? `${views} Viewed` : null,
      stats.visibility ? `Visibility ${stats.visibility}` : null,
      Number.isFinite(profileMatch) ? `${profileMatch}% Profile Match` : null,
    ].filter(Boolean);

    return (
      <SpotlightShell embedded={embedded} borderClass="border-[#29ADAC]/20" bgClass="bg-gradient-to-r from-[#EFFBFB]/80 to-white">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <LiveChip />
                <h2 className="truncate text-lg font-extrabold text-[var(--color-text)]">Task is live</h2>
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                Matching performers for your task
              </p>
              <p className="mt-1 truncate text-base font-extrabold text-[var(--color-text)]">{title}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {applicantCount > 0 ? (
                <GradientActionButton actionType="view" onClick={goApplicants} />
              ) : (
                <GradientActionButton actionType="view" onClick={goActivity} />
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#29ADAC]/20/80 pt-4">
            <div className="flex flex-wrap gap-4 text-xs font-bold text-[var(--color-text-muted)]">
              {statItems.length > 0 ? (
                statItems.map((item) => (
                  <span
                    key={item}
                    className={item.includes("Profile Match") ? "text-[#10605F]" : undefined}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span>{applicantCount > 0 ? `${applicantCount} applicant${applicantCount === 1 ? "" : "s"}` : "Waiting for performer activity"}</span>
              )}
            </div>
            <div className="flex -space-x-2">
              {avatarStack(task).map((src, i) => (
                <img key={i} src={src} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
          </div>
        </div>
      </SpotlightShell>
    );
  }

  return null;
};

export default TaskSpotlightCard;
