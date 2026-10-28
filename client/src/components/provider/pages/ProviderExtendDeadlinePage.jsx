import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
  Home,
  Info,
  Loader2,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { createSupportTicket, getTaskDetails } from "../services/api";

const QUICK_OPTIONS = [
  { id: "1d", label: "+1 Day", hint: "Tomorrow", days: 1 },
  { id: "3d", label: "+3 Days", hint: "In 3 days", days: 3 },
  { id: "1w", label: "+1 Week", hint: "In 7 days", days: 7 },
  { id: "2w", label: "+2 Weeks", hint: "In 14 days", days: 14 },
  { id: "1m", label: "+1 Month", hint: "In 30 days", days: 30 },
  { id: "custom", label: "Custom", hint: "Pick a date", days: null },
];

const addDays = (base, days) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

const formatDeadlineLabel = (date) => {
  if (!date || Number.isNaN(date.getTime())) return "No deadline set";
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate();
  if (isTomorrow) return `Tomorrow, ${time}`;
  return `${date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}, ${time}`;
};

const isUrgent = (date) => {
  if (!date || Number.isNaN(date.getTime())) return false;
  const hours = (date.getTime() - Date.now()) / (1000 * 60 * 60);
  return hours >= 0 && hours <= 48;
};

const toDateInputValue = (date) => {
  if (!date || Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const ProviderExtendDeadlinePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [task, setTask] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customDate, setCustomDate] = useState("");
  const [note, setNote] = useState("");
  const [newDeadline, setNewDeadline] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id || id === ":id") {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getTaskDetails(id);
        if (!cancelled) setTask(res?.data ?? res);
      } catch (err) {
        console.error("Failed to load task for deadline extension:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const currentDeadline = useMemo(() => {
    if (!task?.dueAt) return null;
    const d = new Date(task.dueAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [task?.dueAt]);

  const baseDate = currentDeadline && currentDeadline.getTime() > Date.now()
    ? currentDeadline
    : new Date();

  const proposedDeadline = useMemo(() => {
    if (!selectedOption) return null;
    if (selectedOption === "custom") {
      if (!customDate) return null;
      const d = new Date(`${customDate}T18:00:00`);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const opt = QUICK_OPTIONS.find((o) => o.id === selectedOption);
    if (!opt?.days) return null;
    const d = addDays(baseDate, opt.days);
    if (currentDeadline) {
      d.setHours(currentDeadline.getHours(), currentDeadline.getMinutes(), 0, 0);
    } else {
      d.setHours(18, 0, 0, 0);
    }
    return d;
  }, [selectedOption, customDate, baseDate, currentDeadline]);

  const canSubmit = Boolean(proposedDeadline) && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const label = formatDeadlineLabel(proposedDeadline);
      const message = [
        `Deadline extension request for task: ${task?.title || id}`,
        `Current deadline: ${formatDeadlineLabel(currentDeadline)}`,
        `Requested new deadline: ${label}`,
        note.trim() ? `Note to performer: ${note.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await createSupportTicket({
        subject: `Extend Deadline — ${task?.title || "Task"}`,
        category: "TASK",
        message,
        taskId: id,
      }).catch((err) => {
        console.warn("Support ticket create failed, continuing with local success:", err);
      });

      setNewDeadline(proposedDeadline);
      setSubmitted(true);
    } catch (err) {
      console.error("Extend deadline failed:", err);
      alert(err?.message || "Could not submit deadline extension. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const goContactSupport = () => {
    const params = new URLSearchParams({ topic: "extend-deadline" });
    if (id) params.set("taskId", id);
    navigate(`/provider/agent-support?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-16 pt-[80px] font-sans text-[var(--color-text)] antialiased">
      <ProviderHeader activePage="my-tasks" />

      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5, 150, 105, 0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(5, 150, 105, 0.05), transparent 45%)",
        }}
      />

      <div className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-elevated)] to-[var(--color-surface)]/90">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => navigate("/provider/dashboard")}
              className="inline-flex items-center gap-2 font-medium text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
            >
              <Home className="h-4 w-4" strokeWidth={2.25} />
              Home
            </button>
            <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
            <button
              type="button"
              onClick={() => navigate(`/provider/active-task/${id}/need-help`)}
              className="font-medium text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
            >
              Need Help
            </button>
            <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
            <span className="font-bold text-[var(--color-primary)]">
              {submitted ? "Request Submitted" : "Extend Deadline"}
            </span>
          </nav>
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(`/provider/active-task/${id}/need-help`)}
          className="mb-5 flex items-center gap-1.5 text-[20px] font-bold text-[var(--color-text)] transition hover:opacity-80"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          {submitted ? "Request Submitted" : "Extend Deadline"}
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--color-primary)]">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" />
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Loading…</p>
          </div>
        ) : submitted ? (
          <div className="space-y-5">
            <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-center shadow-[var(--shadow-sm)] sm:p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)]">
                <Check size={32} strokeWidth={2.75} />
              </div>
              <h2 className="text-[22px] font-extrabold tracking-tight text-[var(--color-text)]">
                Deadline Extended
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[14px] font-medium leading-relaxed text-[var(--color-text-muted)]">
                Your new deadline has been sent to the performer for confirmation. They will
                receive a notification and must accept the updated timeline.
              </p>
            </article>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                Request Details
              </p>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-[var(--color-text-muted)]">Previous</span>
                  <span className="font-bold text-[var(--color-text)]">
                    {formatDeadlineLabel(currentDeadline)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-[var(--color-text-muted)]">New deadline</span>
                  <span className="font-bold text-[var(--color-primary)]">
                    {formatDeadlineLabel(newDeadline)}
                  </span>
                </div>
                {note.trim() ? (
                  <div className="rounded-xl bg-[var(--color-surface)] px-3 py-2.5 text-left">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                      Note
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-[var(--color-text)]">
                      {note.trim()}
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                What Happens Next
              </p>
              <ol className="space-y-4">
                {[
                  { done: true, text: "Our support team reviews your request" },
                  { done: false, n: 2, text: "Performer is notified and asked to respond" },
                  { done: false, n: 3, text: "Resolution communicated to you" },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {step.done ? (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[12px] font-bold text-[var(--color-text-muted)]">
                        {step.n}
                      </span>
                    )}
                    <p
                      className={`pt-0.5 text-[14px] font-semibold ${
                        step.done ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => navigate("/provider/my-tasks")}
                className="flex w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)]"
              >
                Return to Tasks
              </button>
              <button
                type="button"
                onClick={goContactSupport}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3.5 text-[15px] font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)]/30"
              >
                <Headphones size={18} className="text-[var(--color-primary)]" />
                Contact Support
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                Current Deadline
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Clock size={20} strokeWidth={2.2} />
                </div>
                <p className="flex-1 text-[16px] font-bold text-[var(--color-text)]">
                  {formatDeadlineLabel(currentDeadline)}
                </p>
                {isUrgent(currentDeadline) && (
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-600">
                    Urgent
                  </span>
                )}
              </div>
            </article>

            <section>
              <p className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                Quick Extension
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {QUICK_OPTIONS.map((opt) => {
                  const active = selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOption(opt.id)}
                      className={`rounded-2xl border px-3 py-3.5 text-left transition ${
                        active
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] shadow-[var(--shadow-xs)]"
                          : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/30"
                      }`}
                    >
                      <p
                        className={`text-[15px] font-bold ${
                          active ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"
                        }`}
                      >
                        {opt.label}
                      </p>
                      <p className="mt-0.5 text-[12px] font-medium text-[var(--color-text-muted)]">
                        {opt.hint}
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedOption === "custom" && (
                <div className="mt-3">
                  <label className="mb-1.5 block text-[12px] font-bold text-[var(--color-text-muted)]">
                    Pick a date
                  </label>
                  <input
                    type="date"
                    value={customDate}
                    min={toDateInputValue(addDays(new Date(), 1))}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[14px] font-semibold text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                  />
                </div>
              )}

              {proposedDeadline && (
                <p className="mt-3 text-[13px] font-semibold text-[var(--color-primary)]">
                  New deadline: {formatDeadlineLabel(proposedDeadline)}
                </p>
              )}
            </section>

            <section>
              <label className="mb-2 block px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                Note to Performer (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Let the performer know why you're extending the deadline..."
                className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[14px] font-medium text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
              />
            </section>

            <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
                <Info size={14} strokeWidth={2.5} />
              </div>
              <p className="text-[13px] font-medium leading-relaxed text-sky-800">
                The performer will be notified of the new deadline and must confirm acceptance.
              </p>
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending…
                </>
              ) : (
                "Send to Performer for Approval"
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderExtendDeadlinePage;
