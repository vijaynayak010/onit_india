import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  AlertCircle,
  Bell,
  CheckCircle2,
  XCircle,
  Circle,
  Lightbulb,
  ChevronRight,
  FileText,
} from "lucide-react";
import ProviderFlowLayout from "../layout/ProviderFlowLayout";
import { useProviderData } from "../contexts/ProviderDataContext";
import { getTaskDetails } from "../services/api";
import {
  SPOTLIGHT_TYPES,
  getSpotlightTypeForTask,
  parseReviewCommentsFromTask,
} from "../utils/taskSpotlight";

const ProgressStep = ({ label, state }) => {
  const isDone = state === "done";
  const isCurrent = state === "current";
  const isFailed = state === "failed";

  return (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
          isDone
            ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
            : isFailed
              ? "border-red-500 bg-red-50 text-red-600"
              : isCurrent
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-gray-200 bg-gray-50 text-gray-400"
        }`}
      >
        {isDone ? <CheckCircle2 className="h-5 w-5" /> : isFailed ? <XCircle className="h-5 w-5" /> : isCurrent ? <Circle className="h-3 w-3 fill-current" /> : <Circle className="h-3 w-3" />}
      </div>
      <span
        className={`text-xs font-bold ${
          isDone
            ? "text-[var(--color-primary)]"
            : isFailed
              ? "text-red-600"
              : isCurrent
                ? "text-amber-600"
                : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const TaskStatusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { activities, loading, refreshData } = useProviderData();
  const justPosted = Boolean(location.state?.justPosted);
  const [detailTask, setDetailTask] = useState(() => location.state?.postedTask || null);
  const [detailLoading, setDetailLoading] = useState(() => Boolean(taskId && !location.state?.postedTask));
  const didRefreshJustPosted = useRef(false);

  const cachedTask = useMemo(
    () => activities.find((a) => String(a.id) === String(taskId)),
    [activities, taskId]
  );

  const task = detailTask || cachedTask;

  useEffect(() => {
    if (justPosted && !didRefreshJustPosted.current) {
      didRefreshJustPosted.current = true;
      refreshData();
    }
  }, [justPosted, refreshData]);

  useEffect(() => {
    if (!taskId) {
      setDetailLoading(false);
      return undefined;
    }
    let cancelled = false;
    setDetailLoading(true);

    getTaskDetails(taskId)
      .then((data) => {
        if (cancelled || !data) return;
        const payload =
          data?.data && typeof data.data === "object" && !Array.isArray(data.data)
            ? { ...data, ...data.data }
            : data?.task && typeof data.task === "object"
              ? { ...data, ...data.task }
              : data;

        const merged = {
          ...cachedTask,
          ...payload,
          id: payload.id || payload._id || taskId,
          title: payload.title || cachedTask?.title,
          description: payload.description || cachedTask?.description,
          category: payload.category || cachedTask?.category,
          budget: cachedTask?.budget,
          skills: payload.skills || payload.requiredSkills || cachedTask?.skills,
          taskType: payload.taskType || payload.type || cachedTask?.taskType,
          rawStatus: payload.status || cachedTask?.rawStatus || cachedTask?.status,
          status: payload.status || cachedTask?.status,
        };

        const fromDetail = parseReviewCommentsFromTask(payload);
        const fromCached = parseReviewCommentsFromTask(cachedTask);
        const fromMerged = parseReviewCommentsFromTask(merged);

        setDetailTask({
          ...merged,
          reviewComments:
            fromDetail.length > 0
              ? fromDetail
              : fromMerged.length > 0
                ? fromMerged
                : fromCached,
        });
      })
      .catch(() => {
        /* fall back to cached list data */
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [taskId, cachedTask]);

  const spotlightType = task ? getSpotlightTypeForTask(task) : null;
  const isUnderReview = spotlightType === SPOTLIGHT_TYPES.UNDER_REVIEW;
  const isReviewFailed = spotlightType === SPOTLIGHT_TYPES.REVIEW_FAILED;
  const title = task?.title || task?.task || "Your task";
  const reviewComments = Array.isArray(task?.reviewComments) && task.reviewComments.length
    ? task.reviewComments
    : parseReviewCommentsFromTask(task);

  const handleEditTask = () => {
    navigate("/provider/post-task-manual", {
      state: {
        editTask: {
          id: task?.id,
          title: task?.title || task?.task,
          description: task?.description,
          category: task?.category,
          budget: task?.budget,
          skills: task?.skills,
          taskType: task?.taskType,
        },
      },
    });
  };

  if (!task && (loading || detailLoading)) {
    return (
      <ProviderFlowLayout title="Task Status" maxWidth="max-w-2xl">
        <div className="animate-pulse space-y-6" aria-label="Loading task status">
          <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="mx-auto h-16 w-16 rounded-full bg-slate-100" />
            <div className="mx-auto mt-5 h-5 w-40 rounded bg-slate-100" />
            <div className="mx-auto mt-3 h-4 w-64 max-w-full rounded bg-slate-100" />
          </div>
          <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="mt-5 h-14 rounded-xl bg-slate-100" />
            <div className="mt-3 h-14 rounded-xl bg-slate-100" />
          </div>
        </div>
      </ProviderFlowLayout>
    );
  }

  if (!task) {
    return (
      <ProviderFlowLayout title="Task Status">
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <p className="text-sm font-semibold text-[var(--color-text-muted)]">Task not found.</p>
          <button
            type="button"
            onClick={() => navigate("/provider/dashboard")}
            className="mt-4 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white"
          >
            Back to Home
          </button>
        </div>
      </ProviderFlowLayout>
    );
  }

  return (
    <ProviderFlowLayout title="Task Status" maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col items-center text-center">
            <div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                isReviewFailed ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {isReviewFailed ? (
                <AlertCircle className="h-8 w-8" strokeWidth={2} />
              ) : (
                <ShieldCheck className="h-8 w-8" strokeWidth={2} />
              )}
            </div>
            <h2 className="text-xl font-extrabold text-[var(--color-text)]">
              {isReviewFailed ? "Task Needs Changes" : "Task Under Review"}
            </h2>
            <p className="mt-2 max-w-md text-sm font-medium text-[var(--color-text-muted)]">
              {isReviewFailed
                ? "Your task couldn't be published at this time."
                : "We're reviewing your task before making it visible to performers."}
            </p>
            <span
              className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider ${
                isReviewFailed
                  ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isReviewFailed ? "bg-red-500" : "bg-amber-500"}`} />
              {isReviewFailed ? "Review Failed" : "In Review"}
            </span>
            <p className="mt-4 text-sm font-bold text-[var(--color-text)]">{title}</p>
          </div>
        </div>

        {isUnderReview ? (
          <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-[var(--color-text)]">What&apos;s happening</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Your task is being checked for quality and compliance.",
                "You'll be notified once the review is complete.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm font-medium text-[var(--color-text-muted)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {isReviewFailed ? (
          <>
            <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <FileText className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="text-base font-extrabold text-[var(--color-text)]">Review Comments</h3>
              </div>
              {reviewComments.length > 0 ? (
                <div className="space-y-2">
                  {reviewComments.map((comment, index) => (
                    <button
                      key={`${comment}-${index}`}
                      type="button"
                      onClick={handleEditTask}
                      className="flex w-full items-center justify-between rounded-xl bg-red-50/80 px-4 py-3.5 text-left text-sm font-semibold text-[var(--color-text)] transition hover:bg-red-50"
                    >
                      <span className="pr-3">{comment}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-red-400" strokeWidth={2} />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-red-50/80 px-4 py-3.5 text-sm font-semibold text-[var(--color-text-muted)]">
                  The admin rejection reason was not returned by the task API for this task.
                </p>
              )}
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm font-medium text-amber-900">
                Please update your task based on the feedback and submit it again for review.
              </p>
            </div>
          </>
        ) : null}

        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <h3 className="mb-5 text-base font-extrabold text-[var(--color-text)]">Progress</h3>
          <div className="flex items-start gap-2">
            <ProgressStep label="Task Created" state="done" />
            <div className="mt-5 h-0.5 flex-1 bg-[var(--color-primary)]" />
            <ProgressStep
              label={isReviewFailed ? "Review Failed" : "Under Review"}
              state={isReviewFailed ? "failed" : "current"}
            />
            <div className="mt-5 h-0.5 flex-1 bg-gray-200" />
            <ProgressStep label="Task Live" state="pending" />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isReviewFailed ? (
            <button
              type="button"
              onClick={handleEditTask}
              className="flex-1 rounded-full bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
            >
              Edit Task
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/provider/my-tasks")}
              className="flex-1 rounded-full bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
            >
              View My Tasks
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/provider/dashboard")}
            className="flex-1 rounded-full border border-[var(--color-border)] bg-white py-3.5 text-sm font-bold text-[var(--color-text)] transition hover:bg-gray-50"
          >
            Back to Home
          </button>
        </div>
      </div>
    </ProviderFlowLayout>
  );
};

export default TaskStatusPage;
