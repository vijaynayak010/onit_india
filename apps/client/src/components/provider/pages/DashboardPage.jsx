import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Users,
  ChevronRight,
  FileText,
  X,
  Plus,
  ListTodo,
  Star,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { useAuth } from "../../../contexts/AuthContext";
import { useProviderData } from "../contexts/ProviderDataContext";
import DashboardActionCarousel from "../components/dashboard/DashboardActionCarousel";
import PostFirstTaskBanner from "../components/dashboard/PostFirstTaskBanner";
import BrowseCategoryGrid from "../components/BrowseCategoryGrid";
import { useHomeContent } from "../../../services/homeContent";
import {
  DashboardCard,
  StatCard,
  StatusBadge,
  EmptyState,
  LoadingSkeleton,
  ErrorState,
  PrimaryButton,
  SecondaryButton,
} from "../../shared/dashboard";

const MotionDiv = motion.div;

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-[var(--dash-border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="dash-overline mb-1 text-[var(--dash-primary-700)]">{eyebrow}</p>
        ) : null}
        <h2 className="dash-section-title text-[var(--dash-text)]">{title}</h2>
        {description ? (
          <p className="dash-secondary mt-1 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function getStatusBadgeMeta(rawStatus) {
  const status = String(rawStatus || "DRAFT").toUpperCase();
  if (["COMPLETED", "DONE", "CLOSED", "FINISHED", "RESOLVED", "VERIFIED"].includes(status)) {
    return { variant: "completed", label: "Completed" };
  }
  if (["IN_PROGRESS", "CLAIMED", "SUBMITTED", "ASSIGNED", "ACCEPTED", "ACTIVE", "ONGOING", "IN_REVIEW_BY_PROVIDER"].includes(status)) {
    return { variant: "active", label: status.replaceAll("_", " ") };
  }
  if (["PUBLISHED", "LIVE", "OPEN", "MATCHING", "ACCEPTING_APPLICATIONS"].includes(status)) {
    return { variant: "live", label: "Open" };
  }
  return { variant: "neutral", label: status.replaceAll("_", " ") };
}

function getTabForMetric(label) {
  if (label === "Applicants") return "Applicants";
  if (label === "Active") return "Active";
  if (label === "Completed") return "Completed";
  if (label === "Drafts") return "Draft";
  return "Applicants";
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { stats: cachedStats, activities, performers, loading, error, refreshData } = useProviderData();
  const { slides: homeSlides, categories: homeCategories } = useHomeContent();

  const [searchQuery, setSearchQuery] = useState(() => location.state?.query || "");
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    if (location.state?.query !== undefined) {
      setSearchQuery(location.state.query || "");
    }
  }, [location.state]);

  const firstName = useMemo(() => {
    const raw = user?.displayName || user?.name || user?.username || "";
    const part = raw.trim().split(/\s+/)[0];
    return part || "";
  }, [user]);

  const defaultStats = useMemo(
    () => [
      { label: "Applicants", value: "0", change: "Published tasks", Icon: Users, trend: "up" },
      { label: "Active", value: "0", change: "In execution", Icon: Clock, trend: "up" },
      { label: "Completed", value: "0", change: "Successfully completed", Icon: CheckCircle2, trend: "up" },
      { label: "Drafts", value: "0", change: "Preparing tasks", Icon: FileText, trend: null },
    ],
    [],
  );

  const stats = useMemo(() => {
    if (!cachedStats) return defaultStats;
    return cachedStats
      .map((s, i) => {
        const base = defaultStats.find((d) => d.label === s.label) || defaultStats[i] || {};
        return {
          ...base,
          value: s.value,
          change: s.available !== undefined ? `₹${s.available} available` : base.change || "",
        };
      })
      .filter((s) => s.label);
  }, [cachedStats, defaultStats]);

  const recentTasks = useMemo(() => {
    const list = Array.isArray(activities) ? [...activities] : [];
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list.slice(0, 5);
  }, [activities]);

  const filteredPerformers = useMemo(() => {
    return (performers || []).filter((p) => {
      if (selectedDomain) {
        const pProfession = String(p.name || "").toLowerCase();
        const pSkills = (p.skills || []).map((s) => String(s).toLowerCase());
        const pBio = String(p.bio || "").toLowerCase();
        const isDomainMatch = selectedDomain.peerFilters.some(
          (filter) => pProfession.includes(filter.toLowerCase()) || pBio.includes(filter.toLowerCase()),
        );
        const isSkillMatch = selectedDomain.taskFilters.some((filter) =>
          pSkills.some((skill) => skill.includes(filter.toLowerCase())),
        );
        if (!isDomainMatch && !isSkillMatch) return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const skillsMatch = Array.isArray(p.skills) && p.skills.some((s) => String(s).toLowerCase().includes(q));
      return (
        String(p.person || "").toLowerCase().includes(q) ||
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.bio || "").toLowerCase().includes(q) ||
        skillsMatch
      );
    });
  }, [performers, selectedDomain, searchQuery]);

  const openTaskDestination = (task) => {
    const status = String(task?.rawStatus || task?.status || "").toUpperCase();
    if (["IN_PROGRESS", "CLAIMED", "SUBMITTED", "ASSIGNED", "ACCEPTED", "ACTIVE", "ONGOING", "IN_REVIEW_BY_PROVIDER"].includes(status)) {
      navigate(`/provider/active-task/${task.id}`);
      return;
    }
    if (["PUBLISHED", "LIVE", "OPEN", "MATCHING", "ACCEPTING_APPLICATIONS"].includes(status)) {
      navigate(`/provider/task-applicants?taskId=${task.id}`);
      return;
    }
    navigate(`/provider/task-details?taskId=${task.id}`);
  };

  return (
    <div className="min-h-screen bg-[var(--dash-canvas)] pt-[80px] font-sans antialiased text-[var(--dash-text)]">
      <ProviderHeader activePage="home" />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        {/* Page Header */}
        <header className="mb-7 flex flex-col gap-4 border-b border-[var(--dash-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="dash-overline mb-1 text-[var(--dash-primary-700)]">Provider Workspace</p>
            <h1 className="dash-page-title text-[var(--dash-text)]">
              {firstName ? `Welcome back, ${firstName}` : "Provider Dashboard"}
            </h1>
            <p className="dash-body mt-1 max-w-2xl text-[var(--dash-text-secondary)]">
              Monitor active tasks, review incoming applicants, and launch new work with verified performers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <SecondaryButton
              size="md"
              onClick={() => navigate("/provider/my-tasks")}
              className="whitespace-nowrap"
            >
              <ListTodo className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              <span>My Tasks</span>
            </SecondaryButton>
            <PrimaryButton
              size="md"
              onClick={() => navigate("/provider/post-task-selection")}
              className="whitespace-nowrap"
            >
              <Plus className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
              <span>Post a Task</span>
            </PrimaryButton>
          </div>
        </header>

        {/* Active Category Filter Pill Banner */}
        <AnimatePresence>
          {selectedDomain ? (
            <MotionDiv
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[var(--dash-primary-600)]/25 bg-[var(--dash-active-bg)] p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--dash-primary-700)] text-white">
                  <selectedDomain.icon size={18} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="dash-overline text-[var(--dash-primary-700)]">Active Category Filter</p>
                  <p className="truncate text-sm font-semibold text-[var(--dash-text)]">{selectedDomain.title}</p>
                </div>
              </div>
              <SecondaryButton size="sm" onClick={() => setSelectedDomain(null)}>
                <span>Clear</span>
                <X size={13} aria-hidden="true" />
              </SecondaryButton>
            </MotionDiv>
          ) : null}
        </AnimatePresence>

        {error && !loading && activities.length === 0 ? (
          <div className="mb-6">
            <ErrorState
              title="Could not sync provider workspace"
              description={error}
              onRetry={refreshData}
            />
          </div>
        ) : null}

        <div className="space-y-7">
          {!loading && activities.length === 0 ? (
            <PostFirstTaskBanner dynamicSlides={homeSlides} />
          ) : null}

          <DashboardActionCarousel
            activities={activities}
            performers={performers}
            performerCount={performers.length || 120}
            onViewApplicants={(task) => navigate(`/provider/task-applicants?taskId=${task.id}`)}
            onTaskAction={(task, actionType) => {
              if (actionType === "review" || actionType === "active") {
                navigate(`/provider/active-task/${task.id}`);
                return;
              }
              navigate(`/provider/task-applicants?taskId=${task.id}`);
            }}
          />

          {/* Business Overview / KPI Cards */}
          <section aria-labelledby="dash-stats-heading">
            <div className="mb-3.5 flex items-center justify-between gap-3">
              <h2 id="dash-stats-heading" className="dash-overline text-[var(--dash-text-secondary)]">
                Task Overview
              </h2>
              <button
                type="button"
                onClick={() => navigate("/provider/my-tasks")}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--dash-primary-700)] transition hover:text-[var(--dash-primary-800)]"
              >
                <span>View all tasks</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {loading && !cachedStats ? (
              <LoadingSkeleton variant="kpi" count={4} />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() =>
                      navigate("/provider/my-tasks", {
                        state: { tab: getTabForMetric(s.label) },
                      })
                    }
                    className="text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)]"
                  >
                    <StatCard
                      icon={s.Icon}
                      label={s.label}
                      value={s.value}
                      change={s.change}
                      trend={s.trend}
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Recent Activity & Task Performance */}
          <DashboardCard className="p-5 sm:p-6">
            <SectionHeader
              eyebrow="Activity"
              title="Recent tasks"
              description="Jump back into open applications, active execution, or saved drafts."
              action={
                <SecondaryButton size="sm" onClick={() => navigate("/provider/my-tasks")}>
                  <span>Manage all</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </SecondaryButton>
              }
            />

            {loading && recentTasks.length === 0 ? (
              <LoadingSkeleton variant="list" count={3} />
            ) : recentTasks.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No tasks posted yet"
                description="Create your first task to start receiving applications from verified performers."
                actionLabel="Post your first task"
                onAction={() => navigate("/provider/post-task-selection")}
              />
            ) : (
              <div className="divide-y divide-[var(--dash-border)]">
                {recentTasks.map((task) => {
                  const badge = getStatusBadgeMeta(task.rawStatus || task.status);
                  return (
                    <div
                      key={task.id}
                      className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openTaskDestination(task)}
                            className="truncate text-left text-[15px] font-semibold text-[var(--dash-text)] transition hover:text-[var(--dash-primary-700)]"
                          >
                            {task.title}
                          </button>
                          <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--dash-text-secondary)]">
                          <span>{task.category || "General"}</span>
                          <span className="dash-num font-semibold text-[var(--dash-text)]">{task.budget}</span>
                          {task.deadline && task.deadline !== "N/A" ? (
                            <span className="inline-flex items-center gap-1 dash-num">
                              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                              Due {task.deadline}
                            </span>
                          ) : null}
                          {Number(task.applicantsCount) > 0 ? (
                            <span className="dash-num font-medium text-[var(--dash-primary-700)]">
                              {task.applicantsCount} {task.applicantsCount === 1 ? "applicant" : "applicants"}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <SecondaryButton
                        size="sm"
                        onClick={() => openTaskDestination(task)}
                        className="self-start sm:self-center shrink-0"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </SecondaryButton>
                    </div>
                  );
                })}
              </div>
            )}
          </DashboardCard>

          {/* Browse Categories */}
          {Array.isArray(homeCategories) && homeCategories.length > 0 ? (
            <DashboardCard className="p-5 sm:p-6">
              <BrowseCategoryGrid
                showHeader
                onSelectCategory={(item) =>
                  navigate("/provider/task-templates", {
                    state: { category: item.category || item.label || item.slug },
                  })
                }
                onMoreClick={() => navigate("/provider/task-templates")}
              />
            </DashboardCard>
          ) : null}

          {/* Top Performers */}
          <DashboardCard className="p-5 sm:p-6">
            <SectionHeader
              eyebrow="Network"
              title="Verified performers"
              description="Explore top-ranked performers ready to take on your next task."
              action={
                <SecondaryButton size="sm" onClick={() => navigate("/provider/task-performers")}>
                  <span>View all</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </SecondaryButton>
              }
            />

            {loading && !performers.length ? (
              <LoadingSkeleton variant="kpi" count={4} />
            ) : filteredPerformers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredPerformers.slice(0, 4).map((p, i) => (
                  <article
                    key={p.id || i}
                    className="flex flex-col rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-[var(--dash-primary-600)]/40 hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="mb-3.5 flex gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--dash-border)]">
                        <img
                          src={p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.person || "P")}&background=1B8887&color=fff`}
                          alt={p.person}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="dash-card-title line-clamp-1 text-[var(--dash-text)]">{p.person}</h3>
                        <p className="line-clamp-1 text-xs font-medium text-[var(--dash-text-secondary)]">{p.name}</p>
                        <div className="mt-1 flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${star <= Math.round(p.rating) ? "fill-current" : "text-slate-200"}`}
                              strokeWidth={0}
                              fill="currentColor"
                            />
                          ))}
                          <span className="dash-num ml-1 text-[11px] font-medium text-[var(--dash-text-secondary)]">
                            {p.rating ? p.rating.toFixed(1) : "0.0"}/5
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mb-3.5 line-clamp-2 min-h-[34px] text-[13px] leading-relaxed text-[var(--dash-text-secondary)]">
                      {p.bio}
                    </p>

                    <div className="mb-4 flex min-h-[24px] flex-wrap gap-1.5">
                      {(p.skills || []).slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--dash-text-secondary)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--dash-border)] pt-3.5">
                      <StatusBadge variant="completed">{p.tasks}</StatusBadge>
                      <PrimaryButton
                        size="sm"
                        onClick={() => navigate(`/provider/task-performer-profile/${p.id}`, { state: { tasker: p } })}
                      >
                        View Profile
                      </PrimaryButton>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No performers found"
                description="Try clearing your search or category filter to see available task performers."
                actionLabel="Explore All Talent"
                onAction={() => navigate("/provider/task-performers")}
              />
            )}
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
