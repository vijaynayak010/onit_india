import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FilePenLine,
  Headphones,
  Home,
  Info,
  Loader2,
  Star,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { getChecklist, getTaskDetails } from "../services/api";

const getActiveAssignment = (taskData) => {
  if (!taskData) return null;
  const assignments = taskData.taskAssignments;
  if (assignments) {
    if (Array.isArray(assignments) && assignments.length > 0) {
      return (
        assignments.find((a) =>
          ["ASSIGNED", "CLAIMED", "IN_PROGRESS", "ACCEPTED", "COMPLETED", "SUBMITTED"].includes(
            String(a.status).toUpperCase()
          )
        ) || assignments[0]
      );
    }
    if (typeof assignments === "object") return assignments;
  }
  for (const field of ["taskAssignment", "tasker", "performer", "acceptedBy", "assignedTo"]) {
    if (taskData[field]) return taskData[field];
  }
  return null;
};

const HelpRow = ({ icon: Icon, iconBg, iconColor, title, subtitle, titleClassName = "", onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 text-left shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/25 hover:bg-[var(--color-surface)]"
  >
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
    >
      <Icon size={20} className={iconColor} strokeWidth={2.2} />
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-[15px] font-bold ${titleClassName || "text-[var(--color-text)]"}`}>
        {title}
      </p>
      <p className="mt-0.5 text-[12px] font-medium text-[var(--color-text-muted)]">{subtitle}</p>
    </div>
    <ChevronRight size={18} className="shrink-0 text-[var(--color-text-subtle)]" strokeWidth={2.25} />
  </button>
);

const ProviderNeedHelpPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [progressPct, setProgressPct] = useState(0);
  const [performer, setPerformer] = useState(null);

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
        setPerformer(
          typeof performerObj === "object" && performerObj
            ? {
                name:
                  performerObj.displayName ||
                  performerObj.professional_title ||
                  performerObj.user?.email?.split("@")[0] ||
                  "Assigned Performer",
                rating: performerObj.rating ?? performerObj.avgRating ?? 4.8,
                avatar: performerObj.profilePicUrl || performerObj.user?.profilePicUrl || null,
                active: ["ASSIGNED", "CLAIMED", "IN_PROGRESS", "ACCEPTED"].includes(
                  String(assignment?.status || "").toUpperCase()
                ),
              }
            : null
        );

        const items = checklistRes?.items || checklistRes?.data?.items || [];
        const total = items.length;
        const done = items.filter((i) => i.isChecked || i.checked || i.status === "APPROVED").length;
        setProgressPct(total > 0 ? Math.round((done / total) * 100) : 0);
      } catch (err) {
        console.error("Failed to load need-help context:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const categoryLabel = useMemo(
    () => String(task?.category || "General").replace(/-/g, " ").toUpperCase(),
    [task?.category]
  );

  const budget = task?.priceAmount
    ? `₹${Number(task.priceAmount).toLocaleString("en-IN")}`
    : "—";

  const initials = (performer?.name || "AR")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const goAgentSupport = (topic) => {
    const params = new URLSearchParams();
    if (id) params.set("taskId", id);
    if (topic) params.set("topic", topic);
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
              onClick={() => navigate(`/provider/active-task/${id}`)}
              className="font-medium text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
            >
              Active Task
            </button>
            <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
            <span className="font-bold text-[var(--color-primary)]">Need Help</span>
          </nav>
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(`/provider/active-task/${id}`)}
          className="mb-5 flex items-center gap-1.5 text-[20px] font-bold text-[var(--color-text)] transition hover:opacity-80"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          Need Help
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--color-primary)]">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" />
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Loading…</p>
          </div>
        ) : (
          <div className="space-y-5">
            <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">
                  {categoryLabel}
                </span>
              </div>
              <h2 className="text-[20px] font-extrabold tracking-tight text-[var(--color-text)]">
                {task?.title || "Task"}
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Progress
                  </p>
                  <p className="mt-0.5 text-[15px] font-bold text-[var(--color-text)]">{progressPct}%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Performer
                  </p>
                  <p className="mt-0.5 truncate text-[15px] font-bold text-[var(--color-text)]">
                    {performer?.name || "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Budget
                  </p>
                  <p className="mt-0.5 text-[15px] font-bold text-[var(--color-text)]">{budget}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                  style={{ width: `${Math.min(100, progressPct)}%` }}
                />
              </div>
            </article>

            {performer && (
              <article className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
                {performer.avatar ? (
                  <img
                    src={performer.avatar}
                    alt={performer.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                    {initials || "AR"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-[var(--color-text)]">
                    {performer.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-[var(--color-text-muted)]">
                    Assigned Performer · {Number(performer.rating).toFixed(1)}
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                  </p>
                </div>
                {performer.active && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                )}
              </article>
            )}

            <section>
              <p className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                Task Management
              </p>
              <div className="space-y-2.5">
                <HelpRow
                  icon={Calendar}
                  iconBg="bg-sky-50"
                  iconColor="text-sky-600"
                  title="Extend Deadline"
                  subtitle="Change task deadline"
                  onClick={() => navigate(`/provider/active-task/${id}/extend-deadline`)}
                />
                <HelpRow
                  icon={FilePenLine}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                  title="Task Changes"
                  subtitle="Modify requirements or deliverables"
                  onClick={() => navigate(`/provider/active-task/${id}/task-changes`)}
                />
              </div>
            </section>

            <section>
              <p className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                Performer
              </p>
              <HelpRow
                icon={AlertTriangle}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                title="Performer Issues"
                subtitle="Report a problem with the assigned performer"
                onClick={() => navigate(`/provider/active-task/${id}/performer-issues`)}
              />
            </section>

            <section>
              <p className="mb-2.5 px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                Support
              </p>
              <HelpRow
                icon={Headphones}
                iconBg="bg-[var(--color-primary-subtle)]"
                iconColor="text-[var(--color-primary)]"
                title="Contact Support"
                subtitle="Chat with our support team"
                titleClassName="text-[var(--color-primary)]"
                onClick={() => goAgentSupport("general")}
              />
            </section>

            <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
                <Info size={14} strokeWidth={2.5} />
              </div>
              <p className="text-[13px] font-medium leading-relaxed text-sky-800">
                Our support team is available 24/7. Average response time is under 5 minutes.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderNeedHelpPage;
