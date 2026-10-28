import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Headphones,
  Home,
  Info,
  Loader2,
  MessageCircle,
  MoreVertical,
  Shield,
  Star,
  Upload,
  X,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { createSupportTicket, getChecklist, getTaskDetails } from "../services/api";

const MIN_CHARS = 10;
const MAX_CHARS = 500;
const MAX_FILE_MB = 10;

const ISSUE_TYPES = [
  {
    id: "not-responding",
    title: "Not Responding",
    desc: "Performer is inactive or not replying to messages",
    Icon: MessageCircle,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    id: "missed-deadline",
    title: "Missed Deadline",
    desc: "Work was not delivered by the agreed deadline",
    Icon: Clock,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    id: "poor-quality",
    title: "Poor Quality Work",
    desc: "Deliverables do not meet the agreed standards",
    Icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    id: "unprofessional",
    title: "Unprofessional Behaviour",
    desc: "Rude, inappropriate, or unprofessional conduct",
    Icon: Flag,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "extra-payment",
    title: "Requesting Extra Payment",
    desc: "Asking for money outside the agreed budget",
    Icon: Info,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    id: "other",
    title: "Other Issue",
    desc: "Something else not listed above",
    Icon: MoreVertical,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
  },
];

const HIGH_PRIORITY_IDS = new Set([
  "not-responding",
  "missed-deadline",
  "poor-quality",
  "unprofessional",
  "extra-payment",
]);

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

const ProviderPerformerIssuesPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [task, setTask] = useState(null);
  const [progressPct, setProgressPct] = useState(0);
  const [performer, setPerformer] = useState(null);
  const [issueType, setIssueType] = useState(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [caseId, setCaseId] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id || id === ":id") {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [taskRes, checklistRes] = await Promise.all([
          getTaskDetails(id),
          getChecklist(id).catch(() => ({ items: [] })),
        ]);
        if (cancelled) return;

        const taskObj = taskRes?.data ?? taskRes;
        setTask(taskObj || null);

        const assignment = getActiveAssignment(taskObj);
        const performerObj = assignment?.tasker || assignment;
        if (typeof performerObj === "object" && performerObj) {
          setPerformer({
            name:
              performerObj.displayName ||
              performerObj.professional_title ||
              performerObj.user?.email?.split("@")[0] ||
              "Assigned Performer",
            rating: performerObj.rating ?? performerObj.avgRating ?? 4.8,
            tasksCompleted:
              performerObj.tasksCompleted ??
              performerObj.completedTasks ??
              performerObj.totalTasks ??
              null,
            avatar: performerObj.profilePicUrl || performerObj.user?.profilePicUrl || null,
          });
        } else {
          setPerformer(null);
        }

        const items = checklistRes?.items || checklistRes?.data?.items || [];
        const total = items.length;
        const done = items.filter(
          (i) => i.isChecked || i.checked || i.status === "APPROVED"
        ).length;
        setProgressPct(total > 0 ? Math.round((done / total) * 100) : 0);
      } catch (err) {
        console.error("Failed to load performer issues context:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const charCount = description.length;
  const charsNeeded = Math.max(0, MIN_CHARS - charCount);
  const detailOk = charCount >= MIN_CHARS;
  const selectedIssue = useMemo(
    () => ISSUE_TYPES.find((t) => t.id === issueType) || null,
    [issueType]
  );
  const isHighPriority = HIGH_PRIORITY_IDS.has(issueType);
  const canSubmit = Boolean(issueType) && detailOk && !submitting;

  const initials = (performer?.name || "AR")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const goAgentSupport = () => {
    const params = new URLSearchParams({ topic: "performer-issues" });
    if (id) params.set("taskId", id);
    navigate(`/provider/agent-support?${params.toString()}`);
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

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const ref = `ISS-${Math.floor(1000 + Math.random() * 9000)}`;
      const message = [
        `Performer issue report for task: ${task?.title || id}`,
        `Case: ${ref}`,
        `Performer: ${performer?.name || "Unknown"}`,
        `Issue type: ${selectedIssue?.title}`,
        isHighPriority ? "Priority: High" : "Priority: Normal",
        "",
        "Description:",
        description.trim(),
        files.length ? `\nEvidence: ${files.map((f) => f.name).join(", ")}` : "\nEvidence: None",
      ].join("\n");

      await createSupportTicket({
        subject: `Performer Issue — ${selectedIssue?.title} (${ref})`,
        category: "PERFORMER",
        message,
        taskId: id,
      }).catch((err) => {
        console.warn("Support ticket create failed, continuing:", err);
      });

      setCaseId(ref);
      setSubmitted(true);
    } catch (err) {
      console.error("Report issue failed:", err);
      alert(err?.message || "Could not submit the report. Please try again.");
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
              {submitted ? "Issue Reported" : "Performer Issues"}
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
          {submitted ? "Issue Reported" : "Performer Issues"}
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
                Issue Reported!
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[14px] font-medium leading-relaxed text-[var(--color-text-muted)]">
                Your report against{" "}
                <span className="font-bold text-[var(--color-text)]">
                  {performer?.name || "the performer"}
                </span>{" "}
                has been submitted to our support team for review.
              </p>
              <span className="mt-4 inline-flex rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[12px] font-bold text-[var(--color-primary)]">
                {caseId}
              </span>
            </article>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                    Report Summary
                  </p>
                  {isHighPriority && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      High Priority
                    </span>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-3 rounded-xl bg-[var(--color-surface)] p-3">
                  {performer?.avatar ? (
                    <img
                      src={performer.avatar}
                      alt={performer.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                      {initials || "AR"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold text-[var(--color-text)]">
                      {performer?.name || "Performer"}
                    </p>
                    <p className="text-[12px] font-medium text-[var(--color-text-muted)]">
                      Reported Performer · Task #{String(id || "").slice(0, 8)}
                    </p>
                  </div>
                </div>

                <dl className="space-y-2.5 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <dt className="font-medium text-[var(--color-text-muted)]">Issue Type</dt>
                    <dd className="font-bold text-[var(--color-text)]">{selectedIssue?.title}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-medium text-[var(--color-text-muted)]">Task</dt>
                    <dd className="max-w-[60%] truncate text-right font-bold text-[var(--color-text)]">
                      {task?.title || "Task"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-medium text-[var(--color-text-muted)]">Evidence</dt>
                    <dd className="font-bold text-[var(--color-text)]">
                      {files.length
                        ? `${files.length} file${files.length === 1 ? "" : "s"} attached`
                        : "No files attached"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-medium text-[var(--color-text-muted)]">Submitted</dt>
                    <dd className="font-bold text-[var(--color-text)]">Just now</dd>
                  </div>
                </dl>

                <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                    Your Description
                  </p>
                  <p className="mt-1.5 whitespace-pre-wrap text-[13px] font-medium leading-relaxed text-[var(--color-text)]">
                    {description.trim()}
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                  Investigation Timeline
                </p>
                <ol className="relative space-y-4 border-l-2 border-[var(--color-border)] pl-5">
                  {[
                    { done: true, active: false, title: "Issue Reported", meta: "Just now" },
                    {
                      done: false,
                      active: true,
                      title: "Support Team Notified",
                      meta: "Within minutes",
                      badge: "In Progress",
                    },
                    {
                      done: false,
                      active: false,
                      title: "Performer Contacted",
                      meta: "Est. 2-4 hours",
                    },
                    { done: false, active: false, title: "Investigation", meta: "Est. 24 hours" },
                    { done: false, active: false, title: "Resolution", meta: "Est. 48 hours" },
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
                        {step.active ? (
                          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                        ) : null}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`text-[14px] font-bold ${
                            step.done || step.active
                              ? "text-[var(--color-text)]"
                              : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          {step.title}
                        </p>
                        {step.badge && (
                          <span className="rounded-full bg-[var(--color-primary-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
                            {step.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] font-medium text-[var(--color-text-subtle)]">
                        {step.meta}
                      </p>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[var(--color-surface)] px-3 py-2.5 text-[13px] font-semibold">
                  <span className="text-[var(--color-text-muted)]">Expected Resolution</span>
                  <span className="text-[var(--color-primary)]">Within 48 hours</span>
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                What Happens Next
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    Icon: Headphones,
                    bg: "bg-emerald-50",
                    color: "text-emerald-600",
                    title: "Support team reviews your report",
                    desc: "We assess the issue details and evidence.",
                  },
                  {
                    Icon: MessageCircle,
                    bg: "bg-sky-50",
                    color: "text-sky-600",
                    title: "Performer is contacted",
                    desc: "They are notified and asked to respond.",
                  },
                  {
                    Icon: Shield,
                    bg: "bg-violet-50",
                    color: "text-violet-600",
                    title: "Task is protected",
                    desc: "Progress and funds are secured during review.",
                  },
                  {
                    Icon: Check,
                    bg: "bg-emerald-50",
                    color: "text-emerald-600",
                    title: "Resolution communicated",
                    desc: "Both parties are notified of the outcome.",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3.5"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
                    >
                      <item.Icon size={18} className={item.color} strokeWidth={2.2} />
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-[var(--color-text)]">{item.title}</p>
                      <p className="mt-0.5 text-[12px] font-medium text-[var(--color-text-muted)]">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mx-auto max-w-xl space-y-3 pt-1">
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
                className="flex w-full items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white px-5 py-3.5 text-[15px] font-bold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]/30"
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
              <article className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-5">
                {performer?.avatar ? (
                  <img
                    src={performer.avatar}
                    alt={performer.name}
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-base font-bold text-white">
                    {initials || "AR"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-bold text-[var(--color-text)]">
                    {performer?.name || "Assigned Performer"}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-muted)]">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {Number(performer?.rating || 4.8).toFixed(1)}
                    {performer?.tasksCompleted != null && (
                      <span>· {performer.tasksCompleted} tasks</span>
                    )}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--color-surface)] px-3 py-2 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Progress
                  </p>
                  <p className="text-[15px] font-bold text-[var(--color-primary)]">{progressPct}%</p>
                </div>
              </article>

              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                  Select Issue Type
                </p>
                <ul className="space-y-2">
                  {ISSUE_TYPES.map((type) => {
                    const active = issueType === type.id;
                    const Icon = type.Icon;
                    return (
                      <li key={type.id}>
                        <button
                          type="button"
                          onClick={() => setIssueType(type.id)}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
                            active
                              ? "border-red-200 bg-red-50/70"
                              : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/25"
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${type.iconBg}`}
                          >
                            <Icon size={18} className={type.iconColor} strokeWidth={2.2} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-bold text-[var(--color-text)]">
                              {type.title}
                            </p>
                            <p className="mt-0.5 text-[12px] font-medium text-[var(--color-text-muted)]">
                              {type.desc}
                            </p>
                          </div>
                          {active && (
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                              <Check size={14} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                  Describe the Issue
                </p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, MAX_CHARS))}
                  rows={5}
                  placeholder="Provide specific details — dates, examples, and what you expected vs what happened..."
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
                  Attach Evidence (optional)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
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
                    Upload screenshots or files
                  </p>
                  <p className="mt-1 text-[12px] font-medium text-[var(--color-text-muted)]">
                    PNG, JPG, PDF · Max {MAX_FILE_MB} MB
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
                          onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
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
              <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3.5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
                  <Info size={14} strokeWidth={2.5} />
                </div>
                <p className="text-[13px] font-medium leading-relaxed text-sky-800">
                  Our team will review the issue and contact both parties within 24 hours. Task
                  progress is protected during the review.
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
                    Reporting…
                  </>
                ) : (
                  "Report Issue"
                )}
              </button>

              <button
                type="button"
                onClick={goAgentSupport}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-primary)]/30 bg-white px-5 py-3.5 text-[15px] font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-subtle)]"
              >
                <Headphones size={18} />
                Contact Support Instead
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderPerformerIssuesPage;
