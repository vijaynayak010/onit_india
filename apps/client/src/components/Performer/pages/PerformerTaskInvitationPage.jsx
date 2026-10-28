import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Briefcase,
  Check,
  ChevronLeft,
  Clock,
  Info,
  Loader2,
  Star,
  Tag,
  User,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import DeclineInvitationSheet from "../components/tasks/DeclineInvitationSheet";
import {
  acceptInvitation,
  declineOffer,
  getAssignedTasks,
  getProviderProfile,
  getTaskDetails,
} from "../services/api";
import {
  resolveClientDisplayName,
  resolveProviderProfileId,
} from "../utils/performerClientUtils";

const DESCRIPTION_PREVIEW_LEN = 180;

function formatPriceLabel(task) {
  const amount = Number(task?.priceAmount ?? task?.budget ?? 0);
  const formatted =
    amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "Negotiable";
  const pricing = String(task?.pricingType || task?.priceType || "FIXED").toUpperCase();
  if (pricing.includes("HOUR")) return `${formatted} Hourly`;
  return `${formatted} Fixed Price`;
}

function formatDurationLabel(task) {
  if (task?.durationDays != null) {
    const d = Number(task.durationDays);
    return `${d} Day${d === 1 ? "" : "s"}`;
  }
  if (typeof task?.duration === "string" && task.duration.trim()) {
    return task.duration.trim();
  }
  if (task?.dueAt) {
    const days = Math.max(
      1,
      Math.ceil((new Date(task.dueAt).getTime() - Date.now()) / 86400000)
    );
    return `${days} Day${days === 1 ? "" : "s"}`;
  }
  if (task?.estimatedHours) {
    const days = Math.max(1, Math.ceil(Number(task.estimatedHours) / 8));
    return `${days} Day${days === 1 ? "" : "s"}`;
  }
  return "Flexible";
}

function resolveAssignment(task, assignedList) {
  const fromTask =
    task?.taskAssignment ||
    (Array.isArray(task?.taskAssignments)
      ? task.taskAssignments[0]
      : task?.taskAssignments) ||
    task?.assignment ||
    null;

  if (fromTask?.id) return fromTask;

  const match = (assignedList || []).find((row) => {
    const tid = row?.taskId || row?.task?.id || row?.id;
    return String(tid) === String(task?.id);
  });
  return match?.assignment || match?.taskAssignment || match || null;
}

function isAlreadyAssigned(status) {
  const s = String(status || "").toUpperCase();
  return ["ACCEPTED", "IN_PROGRESS", "ASSIGNED", "ACTIVE", "COMPLETED", "SUBMITTED"].includes(s);
}

const PerformerTaskInvitationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [isDeclining, setIsDeclining] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id || id === ":id") {
        setIsLoading(false);
        setLoadError("Invalid invitation");
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const [taskRes, assignedRes] = await Promise.all([
          getTaskDetails(id),
          getAssignedTasks({ limit: 50 }).catch(() => null),
        ]);

        if (cancelled) return;

        const taskObj = taskRes?.data ?? taskRes;
        if (!taskObj) {
          setLoadError("Invitation not found");
          return;
        }

        setTask(taskObj);

        const assignedList =
          assignedRes?.data?.items ||
          assignedRes?.data?.data ||
          assignedRes?.data ||
          (Array.isArray(assignedRes) ? assignedRes : []);

        const resolved = resolveAssignment(taskObj, assignedList);
        setAssignment(resolved);

        if (isAlreadyAssigned(resolved?.status || taskObj.status)) {
          setAccepted(true);
        }

        const providerProfileId = resolveProviderProfileId(taskObj);
        if (providerProfileId) {
          try {
            const providerRes = await getProviderProfile(providerProfileId);
            if (!cancelled) {
              setProviderProfile(providerRes?.data ?? providerRes);
            }
          } catch (err) {
            console.error("Failed to load provider profile:", err);
          }
        }
      } catch (err) {
        console.error("Failed to load invitation:", err);
        if (!cancelled) setLoadError("Could not load this invitation");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const view = useMemo(() => {
    if (!task) return null;

    const clientName = resolveClientDisplayName(task, providerProfile);
    const ratingRaw =
      providerProfile?.user?.ratingAvg ??
      providerProfile?.ratingAvg ??
      task.provider?.ratingAvg ??
      task.provider?.user?.ratingAvg;
    const rating =
      ratingRaw != null && Number(ratingRaw) > 0
        ? Number(ratingRaw).toFixed(1)
        : null;

    const description = task.description || "No description provided.";
    const priceShort = Number(task.priceAmount ?? task.budget ?? 0);
    const priceDisplay =
      priceShort > 0 ? `₹${priceShort.toLocaleString("en-IN")}` : "—";

    return {
      title: task.title || "Untitled Task",
      category: task.category || task.domain || "General",
      priceLabel: formatPriceLabel(task),
      priceDisplay,
      durationLabel: formatDurationLabel(task),
      description,
      needsReadMore: description.length > DESCRIPTION_PREVIEW_LEN,
      clientName,
      clientInitials: clientName.substring(0, 2).toUpperCase(),
      clientTitle:
        providerProfile?.organization ||
        providerProfile?.businessName ||
        task.provider?.organization ||
        null,
      rating,
      invitationId: task.pendingInvitation?.id ?? null,
    };
  }, [task, providerProfile]);

  const handleAccept = async () => {
    if (isAccepting) return;
    const invitationId = view?.invitationId;
    if (!invitationId) {
      setActionError("Could not find your invitation. Please try again.");
      return;
    }
    setActionError(null);
    setIsAccepting(true);
    try {
      await acceptInvitation(invitationId);
      setAccepted(true);
    } catch (err) {
      console.error("Failed to accept invitation:", err);
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to accept invitation. Please try again."
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineConfirm = async () => {
    if (!declineReason || isDeclining) return;
    setActionError(null);
    setIsDeclining(true);
    try {
      const assignmentId = assignment?.id || assignment?.assignmentId;
      if (assignmentId) {
        await declineOffer(assignmentId, { reason: declineReason });
      } else {
        // No assignment id — still close the flow so UX isn't blocked
        console.warn("No assignment id available for decline-offer");
      }
      setDeclineOpen(false);
      navigate("/performer/dashboard", { replace: true });
    } catch (err) {
      console.error("Failed to decline invitation:", err);
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to decline invitation. Please try again."
      );
    } finally {
      setIsDeclining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)]">
        <Loader2 size={40} className="mb-3 animate-spin text-[var(--color-primary)]" />
        <p className="font-semibold text-[var(--color-text-muted)]">Loading invitation…</p>
      </div>
    );
  }

  if (loadError || !task || !view) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] p-6">
        <AlertCircle size={44} className="mb-3 text-red-500" />
        <h2 className="mb-2 text-xl font-bold text-[var(--color-text)]">
          {loadError || "Invitation not found"}
        </h2>
        <button
          type="button"
          onClick={() => navigate("/performer/dashboard")}
          className="mt-4 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pb-16 pt-[80px] font-sans text-[var(--color-text)] lg:pl-[220px]">
        <PerformerHeader activePage="my-tasks" />
        <main className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-primary)] shadow-[var(--shadow-md)]">
              <Check size={48} className="text-white" strokeWidth={3} />
            </div>
            <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-text)]">
              You&apos;re In!
            </h1>
            <p className="mt-2 max-w-sm text-[14px] font-medium leading-relaxed text-[var(--color-text-muted)]">
              You&apos;ve accepted the invitation for{" "}
              <span className="font-bold text-[var(--color-text)]">&apos;{view.title}&apos;</span>.
            </p>

            <article className="mt-8 w-full rounded-2xl border border-[var(--color-border)] bg-white p-5 text-left shadow-[var(--shadow-sm)]">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[17px] font-bold text-[var(--color-text)]">{view.title}</h2>
                <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-600">
                  Pending Payment
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-[var(--color-text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase size={14} className="text-[var(--color-primary)]" />
                  {view.priceDisplay}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={14} className="text-blue-500" />
                  {view.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-amber-500" />
                  {view.durationLabel}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4 text-[13px] font-semibold text-[var(--color-text)]">
                <User size={15} className="text-[var(--color-text-muted)]" />
                Client: {view.clientName}
              </div>
            </article>

            <div className="mt-5 flex w-full items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
              <Clock
                size={16}
                className="mt-0.5 shrink-0 text-amber-500"
              />
              <p className="text-[13px] font-semibold leading-relaxed text-amber-700">
                You can start working once the provider confirms and pays for this task.
              </p>
            </div>

            <div className="mt-8 flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("/performer/dashboard")}
                className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)]"
              >
                Back To Home
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const previewDescription = view.needsReadMore
    ? `${view.description.slice(0, DESCRIPTION_PREVIEW_LEN).trim()}…`
    : view.description;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-28 pt-[80px] font-sans text-[var(--color-text)] lg:pl-[220px]">
      <PerformerHeader activePage="my-tasks" />

      <main className="mx-auto w-full max-w-lg px-4 py-6 sm:px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-1.5 text-[17px] font-bold text-[var(--color-text)] transition hover:opacity-80"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          Task Invitation
        </button>

        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-[22px] font-bold leading-snug tracking-tight text-[var(--color-text)]">
              {view.title}
            </h1>
            <span className="shrink-0 rounded-lg border border-[var(--color-primary)] px-2.5 py-1 text-[11px] font-bold text-[var(--color-primary)]">
              New Invitation
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-violet-50 px-3 py-1.5 text-[12px] font-bold text-violet-600">
              {view.priceLabel}
            </span>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[12px] font-bold text-blue-600">
              {view.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-[12px] font-bold text-amber-600">
              <Clock size={12} strokeWidth={2.5} />
              {view.durationLabel}
            </span>
          </div>

          <p className="mt-4 text-[14px] font-medium leading-relaxed text-[var(--color-text-muted)]">
            {previewDescription}
          </p>

          <button
            type="button"
            onClick={() => navigate(`/performer/task/${id}`)}
            className="mt-3 text-[14px] font-bold text-[var(--color-primary)] hover:underline"
          >
            View Full Details
          </button>

          <div className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[13px] font-bold text-white">
              {view.clientInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-[var(--color-text)]">
                {view.clientName}
              </p>
              {view.clientTitle && (
                <p className="truncate text-[12px] font-medium text-[var(--color-text-muted)]">
                  {view.clientTitle}
                </p>
              )}
            </div>
            {view.rating && (
              <div className="flex shrink-0 items-center gap-1 text-[14px] font-bold text-[var(--color-text)]">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                {view.rating}
              </div>
            )}
          </div>
        </motion.article>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[var(--color-primary)]/25 bg-[var(--color-primary-subtle)] px-4 py-3.5">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-[var(--color-primary)]"
            strokeWidth={2.5}
          />
          <p className="text-[13px] font-semibold leading-relaxed text-[var(--color-primary)]">
            Accepting confirms your interest. You can start working once the provider completes payment.
          </p>
        </div>

        {actionError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
            {actionError}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setDeclineOpen(true);
            }}
            disabled={isAccepting}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-white py-3.5 text-[15px] font-bold text-[var(--color-text)] transition hover:bg-gray-50 disabled:opacity-60"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={isAccepting}
            className="flex-[1.4] rounded-xl bg-[var(--color-primary)] py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
          >
            {isAccepting ? "Accepting…" : "Accept Invitation"}
          </button>
        </div>
      </div>

      <DeclineInvitationSheet
        open={declineOpen}
        onClose={() => !isDeclining && setDeclineOpen(false)}
        reason={declineReason}
        onReasonChange={setDeclineReason}
        onConfirm={handleDeclineConfirm}
        loading={isDeclining}
      />
    </div>
  );
};

export default PerformerTaskInvitationPage;
