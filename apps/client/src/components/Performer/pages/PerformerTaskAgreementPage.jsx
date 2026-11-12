import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import {
  acceptOffer,
  declineOffer,
  getAssignedTasks,
  getProviderProfile,
  getTaskDetails,
} from "../services/api";
import {
  resolveClientDisplayName,
  resolveProviderProfileId,
} from "../utils/performerClientUtils";

function formatPrice(task) {
  const amount = Number(task?.priceAmount ?? task?.budget ?? 0);
  if (!amount) return "Negotiable";
  const pricing = String(task?.pricingType || task?.priceType || "FIXED").toUpperCase();
  const label = pricing.includes("HOUR") ? "/ hr" : "Fixed";
  return `₹${amount.toLocaleString("en-IN")} ${label}`;
}

function formatDeadline(task) {
  if (task?.durationDays != null) {
    const d = Number(task.durationDays);
    return `${d} day${d === 1 ? "" : "s"}`;
  }
  if (typeof task?.duration === "string" && task.duration.trim()) {
    return task.duration.trim();
  }
  if (task?.dueAt) {
    const d = new Date(task.dueAt);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (task?.estimatedHours) {
    const days = Math.max(1, Math.ceil(Number(task.estimatedHours) / 8));
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  return "Flexible";
}

function resolveAssignmentId(task, assignedList) {
  const fromTask =
    task?.taskAssignment ||
    (Array.isArray(task?.taskAssignments) ? task.taskAssignments[0] : task?.taskAssignments) ||
    task?.assignment ||
    null;
  if (fromTask?.id) return fromTask.id;

  const match = (assignedList || []).find((row) => {
    const tid = row?.taskId || row?.task?.id || row?.id;
    return String(tid) === String(task?.id);
  });
  const asgn = match?.assignment || match?.taskAssignment || match || null;
  return asgn?.id || asgn?.assignmentId || null;
}

const PerformerTaskAgreementPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [assignmentId, setAssignmentId] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id || id === ":id") {
        setIsLoading(false);
        setLoadError("Invalid task");
        return;
      }
      try {
        setIsLoading(true);
        const [taskRes, assignedRes] = await Promise.all([
          getTaskDetails(id),
          getAssignedTasks({ limit: 50 }).catch(() => null),
        ]);
        if (cancelled) return;

        const taskObj = taskRes?.data ?? taskRes;
        if (!taskObj) {
          setLoadError("Task not found");
          return;
        }
        setTask(taskObj);

        const assignedList =
          assignedRes?.data?.items ||
          assignedRes?.data?.data ||
          assignedRes?.data ||
          (Array.isArray(assignedRes) ? assignedRes : []);

        setAssignmentId(resolveAssignmentId(taskObj, assignedList));

        const providerProfileId = resolveProviderProfileId(taskObj);
        if (providerProfileId) {
          try {
            const pRes = await getProviderProfile(providerProfileId);
            if (!cancelled) setProviderProfile(pRes?.data ?? pRes);
          } catch {
            // non-fatal
          }
        }
      } catch (err) {
        console.error("Failed to load task agreement:", err);
        if (!cancelled) setLoadError("Could not load task details");
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
    return {
      title: task.title || "Untitled Task",
      category: task.category || task.domain || "General",
      description: task.description || "No description provided.",
      price: formatPrice(task),
      deadline: formatDeadline(task),
      clientName,
      clientInitials: clientName.substring(0, 2).toUpperCase(),
      clientOrg:
        providerProfile?.organization ||
        providerProfile?.businessName ||
        task.provider?.organization ||
        null,
    };
  }, [task, providerProfile]);

  const handleAccept = async () => {
    if (!id || isAccepting) return;
    setActionError(null);
    setIsAccepting(true);
    try {
      if (assignmentId) {
        await acceptOffer(assignmentId);
      }
      setAccepted(true);
      setTimeout(() => navigate(`/performer/active-task/${id}`, { replace: true }), 2000);
    } catch (err) {
      console.error("Accept failed:", err);
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not accept this task. Please try again."
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!id || isDeclining) return;
    setActionError(null);
    setIsDeclining(true);
    try {
      if (assignmentId) {
        await declineOffer(assignmentId, { reason: "Declined by performer" });
      }
      navigate("/performer/my-tasks", { replace: true });
    } catch (err) {
      console.error("Decline failed:", err);
      setActionError(err?.message || "Could not decline. Please try again.");
    } finally {
      setIsDeclining(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-24 pt-[80px] font-sans text-[var(--color-text)] antialiased">
      <PerformerHeader activePage="my-tasks" />

      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,96,95,0.07), transparent 50%)",
        }}
      />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          Back
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-[var(--color-primary)]">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" />
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Loading task details…
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && loadError && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
            <AlertCircle className="mb-3 h-9 w-9 text-red-400" />
            <p className="text-base font-bold text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              Go back
            </button>
          </div>
        )}

        {/* Success overlay */}
        {accepted && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
              <CheckCircle2 className="h-10 w-10" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-medium text-[var(--color-text)]">Task Accepted!</h2>
            <p className="mt-2 text-[15px] font-medium text-[var(--color-text-muted)]">
              Redirecting you to your task dashboard…
            </p>
          </div>
        )}

        {/* Main content */}
        {!isLoading && !loadError && view && !accepted && (
          <div className="space-y-5">
            {/* Page header */}
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                Task Agreement
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-[var(--color-text)]">
                {view.title}
              </h1>
              <p className="mt-1.5 text-[15px] font-medium text-[var(--color-text-muted)]">
                Review the task terms below before accepting.
              </p>
            </div>

            {/* Details card */}
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]">
              {/* Client row */}
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[13px] font-bold text-white">
                  {view.clientInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[var(--color-text)]">
                    {view.clientName}
                  </p>
                  {view.clientOrg && (
                    <p className="truncate text-[12px] font-medium text-[var(--color-text-muted)]">
                      {view.clientOrg}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-border-subtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-text-subtle)]">
                  <User className="h-3 w-3" strokeWidth={2.5} />
                  Client
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-[var(--color-border)] border-b border-[var(--color-border)]">
                {[
                  { icon: Tag, label: "Category", value: view.category },
                  { icon: Briefcase, label: "Budget", value: view.price },
                  { icon: CalendarClock, label: "Timeline", value: view.deadline },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center gap-1 px-3 py-4">
                    <Icon
                      className="h-4 w-4 text-[var(--color-primary)]"
                      strokeWidth={2}
                    />
                    <p className="text-center text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
                      {label}
                    </p>
                    <p className="text-center text-[13px] font-bold text-[var(--color-text)]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="px-5 py-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
                  Scope of Work
                </p>
                <p className="whitespace-pre-wrap text-[14px] font-medium leading-relaxed text-[var(--color-text)]">
                  {view.description}
                </p>
              </div>
            </div>

            {/* Agreement notice */}
            <div className="flex gap-3 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-subtle)] px-4 py-4">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]"
                strokeWidth={2}
              />
              <p className="text-[13px] font-medium leading-relaxed text-[var(--color-primary-dark,#065f46)]">
                By accepting, you agree to complete this task as described within the stated
                timeline. Payment will be released to your wallet upon client approval.
              </p>
            </div>

            {/* Action error */}
            {actionError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" strokeWidth={2.5} />
                <p className="text-[13px] font-semibold text-red-600">{actionError}</p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={handleAccept}
                disabled={isAccepting || isDeclining}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-[15px] font-medium text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
              >
                {isAccepting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
                )}
                {isAccepting ? "Accepting…" : "Accept & Start"}
              </button>

              <button
                type="button"
                onClick={handleDecline}
                disabled={isAccepting || isDeclining}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-3.5 text-[15px] font-medium text-[var(--color-text-subtle)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
              >
                {isDeclining && <Loader2 className="h-4 w-4 animate-spin" />}
                {isDeclining ? "Declining…" : "Decline"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformerTaskAgreementPage;
