import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mic,
  SlidersHorizontal,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Zap,
  AlertCircle,
  Award,
  Star,
  ListTodo,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import { getMyActiveTasks, getMyInterests, getMyCompletedTasks, getChecklist } from "../services/api";
import { resolveClientDisplayName } from "../utils/performerClientUtils";
import {
  PERFORMER_TASKS_CACHE_TTL_MS,
  dedupePerformerRequest,
  getPerformerChecklistCacheKey,
  getPerformerTasksCacheKey,
  readPerformerCache,
  writePerformerCache,
} from "../utils/performerDataCache";

const TABS = [
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
];

const extractList = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.tasks)) return response.tasks;
  if (Array.isArray(response)) return response;
  return [];
};

const mapAssignedItem = (assignment, checklistData) => {
  if (!assignment) return null;
  const task = assignment.task || assignment;
  const assignmentDetails = assignment.assignment || assignment;
  const provider = task.provider || {};
  const providerProfile = provider.provider || {};

  const statusRaw = String(assignmentDetails.status || task.status || "").toUpperCase();
  const isCompleted = statusRaw === "COMPLETED";
  const isSubmitted = statusRaw === "SUBMITTED";

  let milestoneCurrent;
  let milestoneTotal;
  let progress;

  if (isCompleted) {
    milestoneCurrent = 1;
    milestoneTotal = 1;
    progress = 100;
  } else if (isSubmitted) {
    milestoneCurrent = 0;
    milestoneTotal = 1;
    progress = 90;
  } else {
    const items = checklistData?.items || [];
    milestoneTotal = items.length || 1;
    milestoneCurrent = items.filter((item) => item.isChecked).length;
    progress = milestoneTotal > 0
      ? Math.round((milestoneCurrent / milestoneTotal) * 100)
      : 0;
  }

  return {
    id: task.id || assignmentDetails.id,
    rawTask: task,
    rawAssignment: assignmentDetails,
    category: task.category || "General",
    status: isCompleted ? "completed" : isSubmitted ? "pending" : "active",
    priority: task.priority === "HIGH" ? "High" : "Normal",
    company: task.title || "Untitled Task",
    client: resolveClientDisplayName(task, providerProfile),
    price: task.priceAmount || 0,
    description: task.description || "No description provided.",
    skills: task.skills || [],
    location: task.locationAddress || "Remote",
    deadline: task.dueAt ? new Date(task.dueAt).toLocaleDateString() : (assignmentDetails.createdAt ? new Date(assignmentDetails.createdAt).toLocaleDateString() : "Flexible"),
    milestones: { current: milestoneCurrent, total: milestoneTotal },
    progress,
    onTrack: true,
    avatar: provider.profilePicUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  };
};

const mapInterestItem = (interest) => {
  if (!interest) return null;
  const task = interest.task || {};
  const interestDetails = interest.interest || interest;
  const provider = task.provider || {};
  const providerProfile = provider.provider || {};

  return {
    id: task.id || interestDetails.id,
    category: task.category || "General",
    status: "pending",
    priority: task.priority === "HIGH" ? "High" : "Normal",
    company: task.title || "Pending Task",
    client: resolveClientDisplayName(task, providerProfile),
    deadline: task.dueAt ? new Date(task.dueAt).toLocaleDateString() : (interestDetails.createdAt ? new Date(interestDetails.createdAt).toLocaleDateString() : "Flexible"),
    milestones: { current: 0, total: 1 },
    progress: 0,
    onTrack: true,
    avatar: provider.profilePicUrl || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
  };
};

const readCachedTasksForTab = (tabId, allowStale = false) => readPerformerCache(
  getPerformerTasksCacheKey(tabId),
  PERFORMER_TASKS_CACHE_TTL_MS,
  { allowStale },
);

const loadChecklist = async (taskId) => {
  const cacheKey = getPerformerChecklistCacheKey(taskId);
  const cached = readPerformerCache(cacheKey, PERFORMER_TASKS_CACHE_TTL_MS);
  if (cached) return cached;

  try {
    const checklist = await dedupePerformerRequest(cacheKey, () => getChecklist(taskId));
    writePerformerCache(cacheKey, checklist);
    return checklist;
  } catch {
    return undefined;
  }
};

const readCachedTaskTabs = () => TABS.reduce((cachedTabs, tab) => {
  const cached = readCachedTasksForTab(tab.id, true);
  if (Array.isArray(cached)) cachedTabs[tab.id] = cached;
  return cachedTabs;
}, {});

const PerformerMyTasksPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab = TABS.some((t) => t.id === requestedTab) ? requestedTab : "active";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [tasksByTab, setTasksByTab] = useState(readCachedTaskTabs);
  const tasksByTabRef = useRef(tasksByTab);
  const taskFetchInFlightRef = useRef({});
  const [loadingTabs, setLoadingTabs] = useState({});
  const [loadErrors, setLoadErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tab if query parameter changes
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t && TABS.some((tab) => tab.id === t) && t !== activeTab) {
      setActiveTab(t);
    }
  }, [searchParams, activeTab]);

  const tasks = tasksByTab[activeTab] || [];
  const hasLoadedActiveTab = Object.prototype.hasOwnProperty.call(tasksByTab, activeTab);
  const isLoading = Boolean(loadingTabs[activeTab] && !hasLoadedActiveTab);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery("");
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const calculateStats = () => {
    const activeTasks = (tasksByTab.active || []).filter(t => t.status === 'active');
    const pendingTasks = (tasksByTab.pending || []).filter(t => t.status === 'pending');
    const completedTasks = (tasksByTab.completed || []).filter(t => t.status === 'completed');
    const totalQueue = activeTasks.length + pendingTasks.length + completedTasks.length;

    return {
      active: [
        { label: "Active tasks", value: activeTasks.length.toString(), icon: TrendingUp, tone: "primary" },
        { label: "In progress", value: activeTasks.filter(t => t.progress > 0 && t.progress < 100).length.toString(), icon: Clock, tone: "emerald" },
        { label: "Completed", value: completedTasks.length.toString(), icon: CheckCircle2, tone: "violet" },
        { label: "Total queue", value: totalQueue.toString(), icon: Calendar, tone: "amber" },
      ],
      pending: [
        { label: "Interested", value: pendingTasks.length.toString(), icon: AlertCircle, tone: "rose" },
        { label: "Waitlist", value: pendingTasks.length.toString(), icon: Clock, tone: "sky" },
        { label: "Next steps", value: "Review", icon: ListTodo, tone: "primary" },
      ],
      completed: [
        { label: "Completed", value: completedTasks.length.toString(), icon: Award, tone: "emerald" },
        { label: "Earnings total", value: "₹" + (completedTasks.length * 1000).toLocaleString(), icon: TrendingUp, tone: "primary" },
        { label: "Avg rating", value: "5.0", icon: Star, tone: "amber" },
        { label: "This month", value: completedTasks.length.toString(), icon: Calendar, tone: "violet" },
      ],
    };
  };

  const statsConfig = calculateStats();

  const fetchTasksForTab = useCallback(async (tabId, showLoading = true, forceRefresh = false) => {
    if (taskFetchInFlightRef.current[tabId]) {
      return taskFetchInFlightRef.current[tabId];
    }

    if (!forceRefresh) {
      const cached = readCachedTasksForTab(tabId);
      if (Array.isArray(cached)) {
        const nextTasksByTab = { ...tasksByTabRef.current, [tabId]: cached };
        tasksByTabRef.current = nextTasksByTab;
        setTasksByTab(nextTasksByTab);
        setLoadErrors((previous) => ({ ...previous, [tabId]: null }));
        return cached;
      }
    }

    const hasCachedData = Object.prototype.hasOwnProperty.call(tasksByTabRef.current, tabId);
    if (showLoading && !hasCachedData) {
      setLoadingTabs((previous) => ({ ...previous, [tabId]: true }));
    }
    setLoadErrors((previous) => ({ ...previous, [tabId]: null }));

    const request = dedupePerformerRequest(`performer-my-tasks:${tabId}`, async () => {
      const params = { page: 1, limit: 50 };
      let mapped = [];

      if (tabId === "active") {
        const activeRes = await getMyActiveTasks(params);
        const assignedTasks = extractList(activeRes);
        const previousTasksById = new Map(
          (tasksByTabRef.current.active || []).map((task) => [String(task.id), task]),
        );
        const checklistResults = await Promise.all(
          assignedTasks.map((assignment) => {
            const taskId = assignment.task?.id || assignment.id;
            const assignmentDetails = assignment.assignment || assignment;
            const statusRaw = String(assignmentDetails.status || assignment.task?.status || "").toUpperCase();
            if (statusRaw === "COMPLETED" || statusRaw === "SUBMITTED" || !taskId) {
              return Promise.resolve(null);
            }
            return loadChecklist(taskId);
          }),
        );
        mapped = assignedTasks
          .map((assignment, index) => {
            const mappedTask = mapAssignedItem(assignment, checklistResults[index]);
            const previousTask = mappedTask && previousTasksById.get(String(mappedTask.id));
            if (checklistResults[index] === undefined && previousTask) {
              return {
                ...mappedTask,
                milestones: previousTask.milestones,
                progress: previousTask.progress,
              };
            }
            return mappedTask;
          })
          .filter(Boolean);
      } else if (tabId === "pending") {
        const interestRes = await getMyInterests(params);
        mapped = extractList(interestRes).map(mapInterestItem).filter(Boolean);
      } else if (tabId === "completed") {
        const completedRes = await getMyCompletedTasks(params);
        mapped = extractList(completedRes)
          .map((assignment) => mapAssignedItem(assignment, null))
          .filter(Boolean)
          .map((task) => ({ ...task, status: "completed", progress: 100 }));
      }

      mapped.sort((a, b) => String(a.id || a._id).localeCompare(String(b.id || b._id)));
      return mapped;
    });

    taskFetchInFlightRef.current[tabId] = request;

    try {
      const mapped = await request;
      const nextTasksByTab = { ...tasksByTabRef.current, [tabId]: mapped };
      tasksByTabRef.current = nextTasksByTab;
      setTasksByTab(nextTasksByTab);
      writePerformerCache(getPerformerTasksCacheKey(tabId), mapped);
      return mapped;
    } catch (error) {
      console.error(`[MY TASKS] Failed to load ${tabId} tasks:`, error);
      setLoadErrors((previous) => ({
        ...previous,
        [tabId]: error?.message || "Unable to load tasks right now.",
      }));
      return tasksByTabRef.current[tabId] || [];
    } finally {
      setLoadingTabs((previous) => ({ ...previous, [tabId]: false }));
      delete taskFetchInFlightRef.current[tabId];
    }
  }, []);

  useEffect(() => {
    // Fresh cache avoids a request. Expired cache is still rendered instantly
    // while a quiet refresh runs in the background.
    TABS.forEach((tab) => {
      const freshCache = readCachedTasksForTab(tab.id);
      if (!Array.isArray(freshCache)) {
        const hasStaleData = Object.prototype.hasOwnProperty.call(tasksByTabRef.current, tab.id);
        fetchTasksForTab(tab.id, !hasStaleData, true);
      }
    });
  }, [fetchTasksForTab]);

  useEffect(() => {
    if (!Object.prototype.hasOwnProperty.call(tasksByTabRef.current, activeTab)) {
      fetchTasksForTab(activeTab, true);
    }
  }, [activeTab, fetchTasksForTab]);

  const applySearch = (list) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((task) =>
      String(task.company || "").toLowerCase().includes(q) ||
      String(task.category || "").toLowerCase().includes(q) ||
      String(task.client || "").toLowerCase().includes(q) ||
      String(task.priority || "").toLowerCase().includes(q)
    );
  };

  // For the pending tab, split into: submitted work (from active fetch) + interests sent
  const submittedTasks = activeTab === "pending"
    ? applySearch((tasksByTab.active || []).filter((t) => t.status === "pending"))
    : [];
  const filteredTasks = applySearch(tasks.filter((t) => t.status === activeTab));
  const currentStats = statsConfig[activeTab] || statsConfig.active;

  const toneRing = {
    primary: "bg-[var(--color-primary-subtle)] text-[var(--color-primary)] ring-[var(--color-primary)]/20",
    emerald: "bg-[#EFFBFB] text-[#10605F] ring-[#29ADAC]/30",
    violet: "bg-violet-50 text-violet-700 ring-violet-200/60",
    amber: "bg-amber-50 text-amber-800 ring-amber-200/60",
    rose: "bg-rose-50 text-rose-700 ring-rose-200/60",
    sky: "bg-sky-50 text-sky-800 ring-sky-200/60",
  };

  const tabAccent = () => {
    if (activeTab === "pending") return "border-t-amber-500";
    if (activeTab === "completed") return "border-t-[#10605F]";
    return "border-t-[var(--color-primary)]";
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="my-tasks" />

      <main className="w-full px-4 py-6 sm:px-6 sm:pb-20 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Stats */}
        <section aria-label="Task summary" className="mb-8">
          <AnimatePresence mode="wait">
            <Motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={`grid gap-3 sm:gap-4 ${currentStats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"
                }`}
            >
              {currentStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">{stat.label}</p>
                    <p className="mt-1 text-2xl font-medium tabular-nums tracking-tight text-[var(--color-text)]">{stat.value}</p>
                  </div>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${toneRing[stat.tone] || toneRing.primary}`}
                  >
                    <stat.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                </div>
              ))}
            </Motion.div>
          </AnimatePresence>
        </section>

        {/* Toolbar: tabs + search */}
        <section
          className="mb-8 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-[var(--shadow-sm)] sm:p-5"
          aria-label="Filters and search"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div
              className="inline-flex w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]/50 p-1 lg:w-auto"
              role="tablist"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-semibold transition-colors ${activeTab === tab.id ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                >
                  {activeTab === tab.id && (
                    <Motion.span
                      layoutId="myTasksTabPill"
                      className="absolute inset-0 z-0 rounded-lg bg-[var(--color-surface-elevated)] shadow-[var(--shadow-xs)] ring-1 ring-[var(--color-border)]"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="group relative min-w-0 flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] group-focus-within:text-[var(--color-primary)]">
                  <Search className="h-5 w-5" strokeWidth={2} />
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search e.g. "Web design"'
                  className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-10 pr-11 text-sm font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-text-subtle)] transition hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-primary)]"
                  aria-label="Voice search"
                >
                  <Mic className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
              <button
                type="button"
                className="flex h-11 w-full shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] sm:w-11"
                aria-label="More filters"
              >
                <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </section>

        {/* Task grid */}
        <section aria-label="Task list">
          <Motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                [...Array(3)].map((_, idx) => (
                  <Motion.div
                    key={`skeleton-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className="animate-pulse rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 flex flex-col h-[270px] shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                          <div className="h-5 w-16 bg-gray-200/80 rounded-full" />
                          <div className="h-5 w-12 bg-gray-200/80 rounded-full" />
                        </div>
                        <div className="h-5 w-12 bg-gray-200/80 rounded-full" />
                      </div>

                      <div className="h-6 w-3/4 bg-gray-200/80 rounded-md mb-6" />
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-11 w-11 rounded-full bg-gray-200/80 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/3 bg-gray-200/80 rounded" />
                          <div className="h-3 w-1/4 bg-gray-100/80 rounded" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <div className="h-3.5 w-1/3 bg-gray-100/80 rounded" />
                          <div className="h-3.5 w-8 bg-gray-200/80 rounded" />
                        </div>
                        <div className="h-2 w-full bg-gray-100/80 rounded-full" />
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4">
                        <div className="h-8 w-24 bg-gray-200/80 rounded-lg" />
                        <div className="h-4 w-20 bg-gray-200/80 rounded" />
                      </div>
                    </div>
                  </Motion.div>
                ))
              ) : loadErrors[activeTab] && filteredTasks.length === 0 && submittedTasks.length === 0 ? (
                <Motion.div
                  key={`error-${activeTab}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-rose-200 bg-rose-50/60 py-16 text-center"
                >
                  <AlertCircle className="mb-3 h-10 w-10 text-rose-500" strokeWidth={1.7} />
                  <p className="text-sm font-semibold text-rose-800">We couldn&apos;t load these tasks.</p>
                  <p className="mt-1 text-xs text-rose-600">Your existing task data has not been cleared.</p>
                  <button
                    type="button"
                    onClick={() => fetchTasksForTab(activeTab, true)}
                    className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                  >
                    Try again
                  </button>
                </Motion.div>
              ) : filteredTasks.length > 0 || submittedTasks.length > 0 ? (
                <>
                  {activeTab === "pending" && submittedTasks.length > 0 && (
                    <>
                      <div className="col-span-full mb-1 mt-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Submitted Work</p>
                        <p className="text-[11px] text-[var(--color-text-subtle)]">Awaiting provider review</p>
                      </div>
                      {submittedTasks.map((task, i) => (
                        <Motion.article
                          key={`submitted-${task.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ delay: i * 0.05, duration: 0.25 }}
                          className="flex flex-col rounded-[var(--radius-2xl)] border border-amber-200 bg-amber-50/40 shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]"
                        >
                          <div className="border-b border-amber-200/60 p-5">
                            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">{task.category}</span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200/70">
                                <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
                                Pending Review
                              </span>
                            </div>
                            <h2 className="text-lg font-medium leading-snug text-[var(--color-text)]">{task.company}</h2>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <div className="mb-4 flex items-center gap-3">
                              <img src={task.avatar} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[var(--color-border)]" alt={task.client} />
                              <div className="min-w-0">
                                <p className="text-xs text-[var(--color-text-subtle)]">Client</p>
                                <p className="truncate text-sm font-semibold text-[var(--color-text)]">{task.client}</p>
                              </div>
                            </div>
                            <div className="mt-auto flex items-center justify-between border-t border-amber-200/60 pt-4">
                              <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                                <Clock className="h-3 w-3 text-amber-600" strokeWidth={2.5} />
                                Work Submitted
                              </div>
                              <button type="button" onClick={() => navigate(`/performer/active-task/${task.id}`, { state: { task } })} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-[var(--color-primary)] transition hover:gap-1.5">
                                View details
                                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                        </Motion.article>
                      ))}
                      {filteredTasks.length > 0 && (
                        <div className="col-span-full mb-1 mt-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-sky-700">Interests Sent</p>
                          <p className="text-[11px] text-[var(--color-text-subtle)]">Waiting for provider to accept</p>
                        </div>
                      )}
                    </>
                  )}
                  {filteredTasks.map((task, i) => (
                  <Motion.article
                    key={`${activeTab}-${task.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    className={`flex flex-col rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] ${tabAccent()}`}
                  >
                    <div className="border-b border-[var(--color-border)]/80 p-5">
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                            {task.category}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${activeTab === "pending"
                              ? (task.progress === 90 ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200/70" : "bg-sky-50 text-sky-800 ring-1 ring-sky-200/70")
                              : activeTab === "completed"
                                ? "bg-[#EFFBFB] text-[#083B3A] ring-1 ring-[#29ADAC]/30"
                                : "bg-sky-50 text-sky-800 ring-1 ring-sky-200/70"
                              }`}
                          >
                            <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
                            {activeTab === "pending" ? (task.progress === 90 ? "Pending Review" : "Applied") : task.status}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700 ring-1 ring-rose-200/60">
                          <Zap className="h-3 w-3 fill-current" />
                          {task.priority}
                        </span>
                      </div>
                      <h2 className="text-lg font-medium leading-snug text-[var(--color-text)]">{task.company}</h2>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-6 flex items-center gap-3">
                        <img
                          src={task.avatar}
                          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[var(--color-border)]"
                          alt={task.client}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--color-text)]">{task.client}</p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)]">
                            <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                            <span>Deadline {task.deadline}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mb-6 space-y-2">
                        <div className="flex items-end justify-between gap-2 text-xs">
                          <span className="font-semibold text-[var(--color-text-subtle)]">
                            {task.milestones.current} of {task.milestones.total} milestone{task.milestones.total !== 1 ? 's' : ''}
                            {activeTab === "pending" && task.progress === 90 && (
                              <span className="ml-1.5 text-amber-600">(Awaiting review)</span>
                            )}
                          </span>
                          <span
                            className={`font-bold tabular-nums ${activeTab === "pending"
                              ? (task.progress === 90 ? "text-amber-600" : "text-sky-600")
                              : activeTab === "completed"
                                ? "text-[#10605F]"
                                : "text-[var(--color-primary)]"
                              }`}
                          >
                            {task.progress}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${activeTab === "pending"
                              ? (task.progress === 90 ? "bg-amber-500" : "bg-sky-500")
                              : activeTab === "completed"
                                ? "bg-[#10605F]"
                                : "bg-[var(--color-primary)]"
                              }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                        <div
                          className={`inline-flex min-h-[2.25rem] max-w-[60%] items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold ${activeTab === "pending"
                            ? (task.progress === 90 ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-sky-50 text-sky-700 ring-1 ring-sky-200")
                            : activeTab === "completed"
                              ? "bg-[#10605F] text-white"
                              : "bg-[var(--color-primary-subtle)] text-[var(--color-text)]"
                            }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${activeTab === "pending"
                              ? (task.progress === 90 ? "bg-amber-100" : "bg-sky-100")
                              : activeTab === "completed"
                                ? "bg-white/20"
                                : "bg-white/80"
                              }`}
                          >
                            {activeTab === "completed" ? (
                              <CheckCircle2 className="h-3 w-3 text-white" strokeWidth={2.5} />
                            ) : (
                              <Clock
                                className={`h-3 w-3 ${activeTab === "pending"
                                  ? (task.progress === 90 ? "text-amber-600" : "text-sky-600")
                                  : "text-[var(--color-primary)]"
                                  }`}
                                strokeWidth={2.5}
                              />
                            )}
                          </span>
                          <span className="truncate">
                            {activeTab === "pending"
                              ? (task.progress === 90 ? "Pending Review" : "Applied")
                              : activeTab === "completed"
                                ? "Completed"
                                : task.onTrack
                                  ? "On track"
                                  : "Delayed"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/performer/active-task/${task.id}`, { state: { task } })}
                          className={`inline-flex shrink-0 items-center gap-1 text-sm font-bold transition hover:gap-1.5 ${activeTab === "completed" ? "text-[#10605F]" : "text-[var(--color-primary)]"
                            }`}
                        >
                          View details
                          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </Motion.article>
                  ))}
                </>
              ) : (
                <Motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)]/80 py-16 text-center"
                >
                  <ListTodo className="mb-3 h-10 w-10 text-[var(--color-text-subtle)]" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                    {searchQuery ? `No tasks found matching "${searchQuery}"` : "No tasks in this category."}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                    {searchQuery ? "Try refining your search terms or clearing the search box." : "Try another tab or check back later."}
                  </p>
                </Motion.div>
              )}
            </AnimatePresence>
          </Motion.div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default PerformerMyTasksPage;
