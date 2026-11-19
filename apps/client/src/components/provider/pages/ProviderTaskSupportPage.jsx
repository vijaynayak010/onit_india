import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, CalendarClock, CheckCircle2, ChevronLeft, Headphones, MessageSquareWarning, LoaderCircle } from "lucide-react";
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
  const [taskLoading, setTaskLoading] = useState(kind === "performer-issues" && Boolean(id));
  const [reason, setReason] = useState("UNCLEAR_DOCUMENTATION");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (kind !== "performer-issues" || !id) {
      setTaskLoading(false);
      return;
    }
    setTaskLoading(true);
    setLoadError(null);
    getTaskDetails(id)
      .then((response) => setTask(response?.data || response || null))
      .catch((error) => setLoadError(error?.response?.data?.message || error?.message || "Unable to load this task."))
      .finally(() => setTaskLoading(false));
  }, [id, kind]);

  const assignment = useMemo(() => {
    const assignments = task?.taskAssignments || task?.assignments;
    if (Array.isArray(assignments)) return assignments.find((item) => item?.id) || assignments[0];
    return assignments || task?.taskAssignment || null;
  }, [task]);

  const submitDispute = async (event) => {
    event.preventDefault();
    if (!assignment?.id || explanation.trim().length < 10) return;
    try {
      setSubmitting(true);
      setSubmitError("");
      await createTaskDispute({ taskId: id, assignmentId: assignment.id, reason, explanation: explanation.trim() });
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate(`/provider/active-task/${id}`);
      }, 1500);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error?.message || "Could not report this issue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAFA] pt-[80px] font-sans text-[#172B2B]">
      <ProviderHeader activePage="my-tasks" />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(id ? `/provider/active-task/${id}` : "/provider/my-tasks")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#647575] transition hover:text-[#10605F]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to task
        </button>

        <section className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFFBFB] text-[#10605F]">
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-medium text-[#172B2B]">{copy.title}</h1>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#647575]">{copy.body}</p>
              {task?.title && (
                <div className="mt-3 inline-flex max-w-full min-w-0 items-center gap-2 rounded-full bg-[#F5FAFA] px-3 py-1 text-xs font-semibold text-[#172B2B] border border-[#e2e8f0]">
                  <span className="min-w-0 flex-1 truncate">{task.title}</span>
                  <span className="shrink-0 font-mono text-[#647575]">#{String(id || "").toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          {kind === "performer-issues" ? (
            <form onSubmit={submitDispute} className="mt-7 space-y-5">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm font-medium leading-6 text-amber-950">
                Reporting an issue submits this task and your notes to FirstDoer support for review. Use this when the concern cannot be resolved directly in task chat.
              </div>
              {loadError ? <p className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-700">{loadError}</p> : null}
              {submitError ? <p className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-semibold text-red-700">{submitError}</p> : null}
              {submitSuccess ? (
                <div className="flex items-center gap-3 rounded-xl border border-[#29ADAC]/40 bg-[#EFFBFB] p-4 text-sm font-semibold text-[#083B3A]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#10605F]" />
                  <span>Issue submitted. FirstDoer support will review your report shortly.</span>
                </div>
              ) : null}
              <label className="block text-sm font-semibold text-[#172B2B]">
                Issue category
                <select value={reason} onChange={(event) => setReason(event.target.value)} disabled={submitting || submitSuccess} className="mt-2 w-full rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-3 text-sm font-medium text-[#172B2B] outline-none transition focus:border-[#10605F]">
                  <option value="UNCLEAR_DOCUMENTATION">Unclear documentation</option>
                  <option value="UNRESPONSIVE_COUNTERPARTY">Performer is unresponsive</option>
                  <option value="SCOPE_CREEP">Scope has changed</option>
                  <option value="PAYMENT_TERMS_DISAGREEMENT">Payment terms disagreement</option>
                  <option value="OTHER">Other issue</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-[#172B2B]">
                Describe what happened
                <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} disabled={submitting || submitSuccess} minLength={10} maxLength={1000} rows={5} placeholder="Include dates, agreed deliverables, and what you need FirstDoer support to review..." className="mt-2 w-full resize-y rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-3 text-sm font-medium leading-6 text-[#172B2B] outline-none transition focus:border-[#10605F]" />
                <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-[#647575]">
                  <span>Minimum 10 characters required</span>
                  <span>{explanation.length}/1000</span>
                </div>
              </label>
              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
                <button type="button" onClick={() => navigate(`/provider/active-task/${id}`)} disabled={submitting} className="inline-flex flex-1 items-center justify-center rounded-full border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-[#172B2B] transition hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={taskLoading || submitting || submitSuccess || !assignment?.id || explanation.trim().length < 10} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
                  {submitting ? "Submitting…" : "Submit Issue Report"}
                </button>
              </div>
              {!taskLoading && !assignment?.id && !loadError ? <p className="text-xs font-semibold text-amber-700">This task has no active assignment yet, so an issue cannot be reported.</p> : null}
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
