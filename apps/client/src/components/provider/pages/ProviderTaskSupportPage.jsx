import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, CalendarClock, ChevronLeft, Headphones, MessageSquareWarning, LoaderCircle } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { createTaskDispute, getTaskDetails } from "../services/api";

const SUPPORT_COPY = {
  "need-help": {
    icon: Headphones,
    title: "Need help with this task?",
    body: "Choose the issue that best matches what you need. Support will use this task context.",
  },
  "extend-deadline": {
    icon: CalendarClock,
    title: "Request deadline support",
    body: "Share the updated timing with support or continue managing this task from the task workspace.",
  },
  "task-changes": {
    icon: MessageSquareWarning,
    title: "Request task changes",
    body: "Use this page when the work scope or deliverables need support review.",
  },
  "performer-issues": {
    icon: AlertCircle,
    title: "Report performer issue",
    body: "Escalate communication, quality, or delivery concerns for this task.",
  },
};

const ProviderTaskSupportPage = ({ kind = "need-help" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const copy = SUPPORT_COPY[kind] || SUPPORT_COPY["need-help"];
  const Icon = copy.icon;
  const [task, setTask] = useState(null);
  const [reason, setReason] = useState("UNCLEAR_DOCUMENTATION");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (kind !== "performer-issues" || !id) return;
    getTaskDetails(id)
      .then((response) => setTask(response?.data || response || null))
      .catch((error) => setLoadError(error?.response?.data?.message || error?.message || "Unable to load this task."));
  }, [id, kind]);

  const assignment = useMemo(() => {
    const assignments = task?.taskAssignments;
    if (Array.isArray(assignments)) return assignments.find((item) => item?.id) || assignments[0];
    return assignments || task?.taskAssignment || null;
  }, [task]);

  const submitDispute = async (event) => {
    event.preventDefault();
    if (!assignment?.id || explanation.trim().length < 10) return;
    try {
      setSubmitting(true);
      await createTaskDispute({ taskId: id, assignmentId: assignment.id, reason, explanation: explanation.trim() });
      window.alert("Issue reported. FirstDoer support will review the task and keep escrow protected while it is investigated.");
      navigate(`/provider/active-task/${id}`);
    } catch (error) {
      window.alert(error?.response?.data?.message || error?.message || "Could not report this issue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[80px] font-sans text-[var(--color-text)]">
      <ProviderHeader activePage="my-tasks" />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(id ? `/provider/active-task/${id}` : "/provider/my-tasks")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to task
        </button>

        <section className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
            <Icon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-medium text-[var(--color-text)]">{copy.title}</h1>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">{copy.body}</p>

          {kind === "performer-issues" ? (
            <form onSubmit={submitDispute} className="mt-8 space-y-5">
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium leading-6 text-amber-900">
                Raising an issue freezes the task&apos;s escrow while our team reviews the evidence. Use this only when the task cannot be resolved in chat.
              </div>
              {loadError ? <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{loadError}</p> : null}
              <label className="block text-sm font-bold text-[var(--color-text)]">
                What is the issue?
                <select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[var(--color-primary)]">
                  <option value="UNCLEAR_DOCUMENTATION">Unclear documentation</option>
                  <option value="UNRESPONSIVE_COUNTERPARTY">Performer is unresponsive</option>
                  <option value="SCOPE_CREEP">Scope has changed</option>
                  <option value="PAYMENT_TERMS_DISAGREEMENT">Payment terms disagreement</option>
                  <option value="OTHER">Other issue</option>
                </select>
              </label>
              <label className="block text-sm font-bold text-[var(--color-text)]">
                Explain what happened
                <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} minLength={10} maxLength={1000} rows={6} placeholder="Include dates, agreed deliverables, and what you need FirstDoer to review..." className="mt-2 w-full resize-y rounded-xl border border-[var(--color-border)] bg-white px-3 py-3 text-sm font-medium leading-6 outline-none focus:border-[var(--color-primary)]" />
                <span className="mt-1 block text-right text-xs font-medium text-[var(--color-text-subtle)]">{explanation.length}/1000</span>
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={submitting || !assignment?.id || explanation.trim().length < 10} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
                  {submitting ? "Reporting…" : "Report issue"}
                </button>
                <button type="button" onClick={() => navigate(`/provider/active-task/${id}`)} className="inline-flex flex-1 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)]">Back to task</button>
              </div>
              {!assignment?.id && !loadError ? <p className="text-xs font-semibold text-amber-700">This task has no active assignment yet, so an issue cannot be reported.</p> : null}
            </form>
          ) : <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(`/provider/chats?support=1${id ? `&taskId=${encodeURIComponent(id)}` : ""}`)}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
            >
              Contact support
            </button>
            <button
              type="button"
              onClick={() => navigate(id ? `/provider/active-task/${id}` : "/provider/my-tasks")}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)]"
            >
              Manage task
            </button>
          </div>}
        </section>
      </main>
    </div>
  );
};

export default ProviderTaskSupportPage;
