import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Info,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { createSupportTicket, getTaskDetails } from "../services/api";

const FREE_LIMIT = 3;
const EXTRA_FEE = 500;
const MIN_CHARS = 10;
const MAX_CHARS = 500;
const MAX_FILE_MB = 20;

const CHANGE_TYPES = [
  {
    id: "add",
    title: "Add New Requirement",
    desc: "Introduce additional deliverables or features",
  },
  {
    id: "remove",
    title: "Remove Requirement",
    desc: "Reduce the scope of the task",
  },
  {
    id: "modify",
    title: "Modify Deliverables",
    desc: "Change what the performer should submit",
  },
  {
    id: "format",
    title: "Change Format or Style",
    desc: "Update visual, structural, or format guidelines",
  },
  {
    id: "scope",
    title: "Update Scope",
    desc: "Broaden or narrow the overall task scope",
  },
  {
    id: "other",
    title: "Other Change",
    desc: "Describe a custom change",
  },
];

const getActiveAssignment = (taskData) => {
  if (!taskData) return null;
  const assignments = taskData.taskAssignments;
  if (Array.isArray(assignments) && assignments.length > 0) {
    return (
      assignments.find((a) =>
        ["ASSIGNED", "CLAIMED", "IN_PROGRESS", "ACCEPTED", "COMPLETED", "SUBMITTED"].includes(
          String(a.status).toUpperCase()
        )
      ) || assignments[0]
    );
  }
  if (assignments && typeof assignments === "object") return assignments;
  return taskData.taskAssignment || taskData.tasker || taskData.performer || null;
};

const resolvePerformerName = (task) => {
  const assignment = getActiveAssignment(task);
  const performer = assignment?.tasker || assignment;
  if (!performer || typeof performer === "string") return "the performer";
  return (
    performer.displayName ||
    performer.professional_title ||
    performer.user?.email?.split("@")[0] ||
    "the performer"
  );
};

const ProviderTaskChangesPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [task, setTask] = useState(null);
  const [selected, setSelected] = useState([]);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [referenceId, setReferenceId] = useState("");

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
        console.error("Failed to load task for changes:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const selectedCount = selected.length;
  const extraCount = Math.max(0, selectedCount - FREE_LIMIT);
  const extraCharge = extraCount * EXTRA_FEE;
  const hasExtra = extraCount > 0;
  const charCount = description.length;
  const charsNeeded = Math.max(0, MIN_CHARS - charCount);
  const detailOk = charCount >= MIN_CHARS;
  const performerName = resolvePerformerName(task);

  const selectedLabels = useMemo(
    () => CHANGE_TYPES.filter((t) => selected.includes(t.id)).map((t) => t.title),
    [selected]
  );

  const canSubmit =
    selectedCount > 0 && detailOk && charCount <= MAX_CHARS && !submitting;

  const toggleType = (typeId) => {
    setSelected((prev) =>
      prev.includes(typeId) ? prev.filter((x) => x !== typeId) : [...prev, typeId]
    );
  };

  const handleFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const next = [];
    for (const file of incoming) {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        alert(`${file.name} exceeds ${MAX_FILE_MB} MB.`);
        continue;
      }
      next.push(file);
    }
    setFiles((prev) => [...prev, ...next].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const goAgentSupport = () => {
    const params = new URLSearchParams({ topic: "task-changes" });
    if (id) params.set("taskId", id);
    navigate(`/provider/agent-support?${params.toString()}`);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const ref = `CHG-${Math.floor(1000 + Math.random() * 9000)}`;
      const message = [
        `Task change request for: ${task?.title || id}`,
        `Reference: ${ref}`,
        `Changes (${selectedCount}): ${selectedLabels.join(", ")}`,
        extraCharge > 0 ? `Extra charge: ₹${extraCharge}` : "Within free change limit",
        "",
        "Description:",
        description.trim(),
        files.length ? `\nAttachments: ${files.map((f) => f.name).join(", ")}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await createSupportTicket({
        subject: `Task Changes — ${task?.title || "Task"} (${ref})`,
        category: "TASK",
        message,
        taskId: id,
      }).catch((err) => {
        console.warn("Support ticket create failed, continuing:", err);
      });

      setReferenceId(ref);
      setSubmitted(true);
    } catch (err) {
      console.error("Change request failed:", err);
      alert(err?.message || "Could not submit change request. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
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
              {submitted ? "Change Request Sent" : "Task Changes"}
            </span>
          </nav>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(`/provider/active-task/${id}/need-help`)}
          className="mb-5 flex items-center gap-1.5 text-[20px] font-bold text-[var(--color-text)] transition hover:opacity-80"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          {submitted ? "Change Request Sent" : "Task Changes"}
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--color-primary)]">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" />
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Loading…</p>
          </div>
        ) : submitted ? (
          <div className="mx-auto max-w-2xl space-y-5">
            <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-center shadow-[var(--shadow-sm)] sm:p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)]">
                <Check size={32} strokeWidth={2.75} />
              </div>
              <h2 className="text-[22px] font-extrabold tracking-tight text-[var(--color-text)]">
                Change Request Sent!
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[14px] font-medium leading-relaxed text-[var(--color-text-muted)]">
                Your request for {selectedCount} change{selectedCount === 1 ? "" : "s"} has been
                sent to {performerName} for review.
              </p>
              <span className="mt-4 inline-flex rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[12px] font-bold text-[var(--color-primary)]">
                Reference {referenceId}
              </span>
            </article>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                  Changes Requested
                </p>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-text-muted)]">
                  {selectedCount} change{selectedCount === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-subtle)] px-3 py-1.5 text-[12px] font-bold text-[var(--color-primary)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
              {extraCharge > 0 && (
                <p className="mt-3 text-[13px] font-semibold text-orange-600">
                  Extra charge: ₹{extraCharge.toLocaleString("en-IN")}
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                Request Timeline
              </p>
              <ol className="relative space-y-4 border-l-2 border-[var(--color-border)] pl-5">
                {[
                  { done: true, active: false, title: "Request Submitted", meta: "Just now" },
                  {
                    done: false,
                    active: true,
                    title: "Performer Notified",
                    meta: "In Progress · Within minutes",
                  },
                  { done: false, active: false, title: "Performer Review", meta: "Est. 24 hours" },
                  {
                    done: false,
                    active: false,
                    title: "Performer Decision",
                    meta: "Accept / Negotiate",
                  },
                  {
                    done: false,
                    active: false,
                    title: "Changes Applied to Task",
                    meta: "Upon acceptance",
                  },
                ].map((step, i) => (
                  <li key={i} className="relative">
                    <span
                      className={`absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full ${
                        step.done
                          ? "bg-[var(--color-primary)] text-white"
                          : step.active
                            ? "border-2 border-[var(--color-primary)] bg-white"
                            : "border-2 border-gray-200 bg-white"
                      }`}
                    >
                      {step.done ? <Check size={11} strokeWidth={3} /> : null}
                    </span>
                    <p
                      className={`text-[14px] font-bold ${
                        step.done || step.active
                          ? "text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[12px] font-medium text-[var(--color-text-subtle)]">
                      {step.meta}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 rounded-xl bg-[var(--color-surface)] px-3 py-2.5 text-[13px] font-semibold text-[var(--color-text)]">
                Estimated Response:{" "}
                <span className="text-[var(--color-primary)]">Within 24 hours</span>
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="text-[14px] font-bold text-[var(--color-text)]">
                What if the performer disagrees?
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] font-medium leading-relaxed text-[var(--color-text-muted)]">
                <li>They can propose modified terms or a revised budget.</li>
                <li>You’ll get a notification to review any counter-offer.</li>
                <li>
                  You can accept, negotiate, or{" "}
                  <button
                    type="button"
                    onClick={goAgentSupport}
                    className="font-bold text-[var(--color-primary)] underline-offset-2 hover:underline"
                  >
                    contact support
                  </button>{" "}
                  to mediate.
                </li>
              </ul>
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
                onClick={goAgentSupport}
                className="flex w-full items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3.5 text-[15px] font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)]/30"
              >
                Track via Support Chat
              </button>
              <button
                type="button"
                onClick={() => navigate("/provider/my-tasks")}
                className="w-full py-2 text-center text-[13px] font-bold text-[var(--color-primary)] hover:underline"
              >
                View All Tasks
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                    Select Change Types
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        hasExtra
                          ? "bg-orange-50 text-orange-600"
                          : selectedCount > 0
                            ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                            : "bg-gray-100 text-[var(--color-text-muted)]"
                      }`}
                    >
                      {selectedCount} selected
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      {FREE_LIMIT} free
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-sky-100 bg-sky-50/80 px-3.5 py-3">
                  <Info size={16} className="mt-0.5 shrink-0 text-sky-600" strokeWidth={2.4} />
                  <p className="text-[13px] font-medium leading-relaxed text-sky-800">
                    First <strong>3 changes are free</strong>. Each additional change incurs a fee
                    of <strong>₹{EXTRA_FEE}</strong>.
                  </p>
                </div>

                <ul className="divide-y divide-[var(--color-border)]">
                  {CHANGE_TYPES.map((type, index) => {
                    const checked = selected.includes(type.id);
                    const isPaidSlot = checked && selected.indexOf(type.id) >= FREE_LIMIT;
                    return (
                      <li key={type.id}>
                        <button
                          type="button"
                          onClick={() => toggleType(type.id)}
                          className="flex w-full items-start gap-3 py-3.5 text-left transition hover:bg-[var(--color-surface)]/60"
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                              checked
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {checked ? <Check size={12} strokeWidth={3} /> : null}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[15px] font-bold text-[var(--color-text)]">
                                {type.title}
                              </p>
                              {isPaidSlot && (
                                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                                  + ₹{EXTRA_FEE}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[12px] font-medium text-[var(--color-text-muted)]">
                              {type.desc}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {hasExtra && (
                  <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-orange-600" strokeWidth={2.3} />
                      <p className="text-[14px] font-bold text-orange-700">Extra Charges Apply</p>
                    </div>
                    <p className="text-[13px] font-medium leading-relaxed text-orange-800">
                      You have selected {selectedCount} changes — {extraCount} beyond the free
                      limit of {FREE_LIMIT}. Additional changes are charged at ₹{EXTRA_FEE} each.
                    </p>
                    <div className="mt-3 space-y-1.5 border-t border-orange-200/80 pt-3 text-[13px]">
                      <div className="flex justify-between gap-3 font-medium text-orange-900/80">
                        <span>Changes included (free)</span>
                        <span>{FREE_LIMIT} changes</span>
                      </div>
                      <div className="flex justify-between gap-3 font-medium text-orange-900/80">
                        <span>Additional changes</span>
                        <span>
                          {extraCount} × ₹{EXTRA_FEE}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3 font-bold text-orange-700">
                        <span>Extra charge</span>
                        <span>₹{extraCharge.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-[12px] font-medium text-orange-700/90">
                      This amount will be added to the task budget upon performer acceptance.
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                  Describe the Changes
                </p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, MAX_CHARS))}
                  rows={6}
                  placeholder="Explain clearly what you want changed, why, and any specific requirements..."
                  className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[14px] font-medium text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                />
                <div className="mt-2 flex items-center justify-between gap-3 text-[12px] font-semibold">
                  {detailOk ? (
                    <span className="inline-flex items-center gap-1 text-[var(--color-primary)]">
                      <Check size={14} strokeWidth={2.75} />
                      Good detail
                    </span>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">
                      {charsNeeded} more character{charsNeeded === 1 ? "" : "s"} needed
                    </span>
                  )}
                  <span className="text-[var(--color-text-subtle)]">
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                  Attach Reference Files (optional)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 transition hover:border-[var(--color-primary)]/40"
                >
                  <Upload size={22} className="mb-2 text-[var(--color-primary)]" />
                  <p className="text-[14px] font-bold text-[var(--color-text)]">
                    Upload reference files
                  </p>
                  <p className="mt-1 text-[12px] font-medium text-[var(--color-text-muted)]">
                    PNG, JPG, PDF, DOC · Max {MAX_FILE_MB} MB
                  </p>
                </button>
                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
                      >
                        <span className="truncate text-[13px] font-semibold text-[var(--color-text)]">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="rounded-full p-1 text-[var(--color-text-subtle)] hover:bg-white hover:text-red-500"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-[100px] lg:self-start">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-600" strokeWidth={2.3} />
                  <p className="text-[14px] font-bold text-orange-700">Possible Impact</p>
                </div>
                <ul className="list-disc space-y-1.5 pl-5 text-[13px] font-medium leading-relaxed text-orange-800">
                  <li>Performer must review and accept all selected changes</li>
                  <li>Timeline or budget may need renegotiation</li>
                  {hasExtra ? (
                    <li>
                      Extra charge of ₹{extraCharge.toLocaleString("en-IN")} applies for{" "}
                      {extraCount} additional change{extraCount === 1 ? "" : "s"}
                    </li>
                  ) : (
                    <li>Up to {FREE_LIMIT} changes are included at no extra cost</li>
                  )}
                </ul>
              </div>

              {selectedCount > 0 && (
                <div className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-center text-[12px] font-bold text-[var(--color-text-muted)] shadow-[var(--shadow-xs)]">
                  {selectedCount} change{selectedCount === 1 ? "" : "s"} selected ·{" "}
                  {Math.min(selectedCount, FREE_LIMIT)} free
                  {hasExtra ? ` · ₹${extraCharge} extra` : ""}
                </div>
              )}

              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Change Request"
                )}
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderTaskChangesPage;
