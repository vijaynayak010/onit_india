import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProviderHeader from "../components/ProviderHeader";
import {
  Search,
  Mic,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  CircleDollarSign,
  Medal,
  BarChart3,
  Star,
  ChevronRight,
  LayoutGrid,
  PlusCircle,
  ListTodo,
  Paperclip,
  Users,
  RefreshCw,
  Trash2,
  FileText,
  X,
  Eye
} from "lucide-react";
import { listMyTasks, publishTask, cancelTask, deleteTask, deleteDraftTask } from "../services/api";
import { useAutoReload } from "../../../hooks/useAutoReload";
import { useProviderData } from "../contexts/ProviderDataContext";

const MotionDiv = motion.div;

const TASKS_CACHE_KEY = "onit_provider_tasks_cache_v2";
const TASKS_CACHE_TTL_MS = 30 * 1000;
const APPLICANT_STATUSES = ['PUBLISHED', 'LIVE', 'OPEN', 'MATCHING', 'ACCEPTING_APPLICATIONS'];
const ACTIVE_STATUSES = ['IN_PROGRESS', 'CLAIMED', 'SUBMITTED', 'ASSIGNED', 'ACCEPTED', 'ACTIVE', 'ONGOING', 'IN_REVIEW_BY_PROVIDER'];
const COMPLETED_STATUSES = ['COMPLETED', 'DONE', 'CLOSED', 'FINISHED', 'RESOLVED', 'VERIFIED'];
const DRAFT_STATUSES = ["DRAFT", "PENDING", "REVIEW", "REJECTED", "REVIEW_FAILED", "UNDER_REVIEW", "PENDING_REVIEW", "IN_REVIEW", "SUBMITTED_FOR_REVIEW", "REVIEW_PENDING", "PENDING_APPROVAL", "AWAITING_APPROVAL", "AWAITING_REVIEW", "MODERATION"];
const TASK_TABS = ["Applicants", "Active", "Completed", "Draft"];

const ConfirmModal = ({ open, title, message, confirmLabel = "Confirm", onConfirm, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl">
        <h3 className="text-[17px] font-black leading-snug text-slate-900">{title}</h3>
        <p className="mt-2.5 text-[13px] leading-relaxed text-slate-500">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={() => { onConfirm?.(); onClose(); }}
            className="rounded-full bg-red-500 px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-600 active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const MyTasksPage = () => {
  const { refreshData } = useProviderData();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialTab = () => {
    const urlTab = searchParams.get("tab");
    if (urlTab) {
      const matched = TASK_TABS.find((t) => t.toLowerCase() === urlTab.toLowerCase());
      if (matched) return matched;
    }
    return location.state?.tab || "Applicants";
  };

  const initialTab = getInitialTab();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [taskFetchError, setTaskFetchError] = useState(null);
  const [publishingTaskId, setPublishingTaskId] = useState(null);
  const publishingTaskIdRef = useRef(null);
  const taskFetchInFlightRef = useRef(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", confirmLabel: "Confirm", onConfirm: null });
  const openConfirm = ({ title, message, confirmLabel, onConfirm }) =>
    setConfirmModal({ open: true, title, message: message || "", confirmLabel: confirmLabel || "Confirm", onConfirm });
  const closeConfirm = () => setConfirmModal(m => ({ ...m, open: false, onConfirm: null }));

  const getTaskStatus = (task) => String(task?.status || "").toUpperCase();

  const filterTasksForTab = useCallback((fetchedTasks, tab = activeTab) => {
    if (tab === "Applicants") {
      return fetchedTasks.filter(t => APPLICANT_STATUSES.includes(getTaskStatus(t)));
    }
    if (tab === "Active") {
      return fetchedTasks.filter(t => ACTIVE_STATUSES.includes(getTaskStatus(t)));
    }
    if (tab === "Completed") {
      return fetchedTasks.filter(t => COMPLETED_STATUSES.includes(getTaskStatus(t)));
    }
    if (tab === "Draft") {
      return fetchedTasks.filter(t => DRAFT_STATUSES.includes(getTaskStatus(t)));
    }
    return fetchedTasks;
  }, [activeTab]);

  const extractTasksResponse = (response) => {
    if (Array.isArray(response)) return { tasks: response, stats: {} };
    if (Array.isArray(response?.data)) return { tasks: response.data, stats: response.stats || {} };
    if (Array.isArray(response?.tasks)) return { tasks: response.tasks, stats: response.stats || {} };
    if (Array.isArray(response?.data?.data)) return { tasks: response.data.data, stats: response.data.stats || response.stats || {} };
    if (Array.isArray(response?.data?.tasks)) return { tasks: response.data.tasks, stats: response.data.stats || response.stats || {} };
    return { tasks: [], stats: response?.stats || response?.data?.stats || {} };
  };

  // Helper to read cache synchronously during state initialization
  const cachedData = (() => {
    const cachedStr = sessionStorage.getItem(TASKS_CACHE_KEY);
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        const age = Date.now() - (cached.timestamp || 0);
        const isFresh = age < TASKS_CACHE_TTL_MS;
        if (isFresh && Array.isArray(cached.data)) {
          return cached;
        }
      } catch {
        sessionStorage.removeItem(TASKS_CACHE_KEY);
      }
    }
    return null;
  })();

  const [tasks, setTasks] = useState(() => {
    if (cachedData) {
      return filterTasksForTab(cachedData.data, initialTab);
    }
    return [];
  });
  
  const [allTasks, setAllTasks] = useState(cachedData ? cachedData.data : []);
  const allTasksRef = useRef(cachedData ? cachedData.data : []);
  const [stats, setStats] = useState(cachedData ? cachedData.stats : {});
  const [loading, setLoading] = useState(cachedData ? false : true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      setSearchParams({ tab: location.state.tab.toLowerCase() });
    }
  }, [location.state, setSearchParams]);

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab) {
      const matched = TASK_TABS.find((t) => t.toLowerCase() === urlTab.toLowerCase());
      if (matched && matched !== activeTab) {
        setActiveTab(matched);
      }
    }
  }, [activeTab, searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setSearchParams({ tab: tab.toLowerCase() });
  };

  const searchedTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const skillsMatch = Array.isArray(task.skills) && task.skills.some(s => String(s).toLowerCase().includes(q));
    return (
      String(task.title || "").toLowerCase().includes(q) ||
      String(task.description || "").toLowerCase().includes(q) ||
      String(task.category || "").toLowerCase().includes(q) ||
      skillsMatch
    );
  });

  const getInterestCount = (task) => {
    const applicants = Array.isArray(task?.applicants) ? task.applicants : [];
    const interests = Array.isArray(task?.interests) ? task.interests : [];
    return applicants.length || interests.length || Number(task?.interestsCount ?? task?._count?.interests ?? task?.applicantCount ?? 0) || 0;
  };

  const clearTaskCaches = () => {
    sessionStorage.removeItem("onit_provider_tasks_cache");
    sessionStorage.removeItem("onit_provider_tasks_cache_v2");
    sessionStorage.removeItem("onit_provider_dashboard_cache");
    sessionStorage.removeItem("onit_provider_dashboard_cache_v2");
  };

  const removeTaskFromLists = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  useEffect(() => {
    allTasksRef.current = allTasks;
  }, [allTasks]);

  const getTaskAssignment = (task) => {
    const assignment = task?.taskAssignments;
    return Array.isArray(assignment) ? assignment[0] : assignment;
  };

  const canDeleteTask = (task) => {
    const assignment = getTaskAssignment(task);
    const disputes = Array.isArray(task?.disputes) ? task.disputes : [];
    return !assignment && disputes.length === 0;
  };

  const handleDeleteTask = (task, { draftOnly = false } = {}) => {
    const taskId = task?.id;
    if (!taskId) return;
    const status = String(task?.status || "").toUpperCase();
    const isDraft = status === "DRAFT";
    const taskLabel = task?.title ? `"${task.title}"` : "this task";
    const message = isDraft || draftOnly
      ? `This draft will be permanently removed from your task list.`
      : `This task will be removed from your list. Its record is retained internally.`;

    openConfirm({
      title: isDraft || draftOnly ? `Delete ${taskLabel}?` : `Delete ${taskLabel}?`,
      message,
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          clearTaskCaches();
          if (isDraft || draftOnly) {
            await deleteDraftTask(taskId);
          } else {
            await deleteTask(taskId);
          }
          removeTaskFromLists(taskId);
          refreshData();
        } catch (err) {
          alert("Failed to delete task: " + (err.message || ""));
        }
      },
    });
  };

  const fetchTasks = useCallback(async (showLoading = true, forceRefresh = false) => {
    // Focus, visibility, polling, and a React remount can all ask for the
    // same list at once. Keep one request in flight so the API rate limiter
    // never sees those as separate user actions.
    if (taskFetchInFlightRef.current) return;
    taskFetchInFlightRef.current = true;

    const cacheKey = TASKS_CACHE_KEY;
    try {
      const isInitialOrTabSwitch = showLoading;
      const bypassCache = forceRefresh || !isInitialOrTabSwitch;

      if (!bypassCache) {
        const cachedStr = sessionStorage.getItem(cacheKey);
        if (cachedStr) {
          try {
            const cached = JSON.parse(cachedStr);
            const age = Date.now() - (cached.timestamp || 0);
            const isFresh = age < TASKS_CACHE_TTL_MS;
            if (isFresh && cached.data) {
              const fetchedTasks = cached.data;
              const cachedStats = cached.stats || {};
              setAllTasks(fetchedTasks);
              setStats(cachedStats);
              setTaskFetchError(null);
              setTasks(filterTasksForTab(fetchedTasks));
              setLoading(false);
              return; // Loaded instantly from cache!
            }
          } catch (e) {
            console.error("Failed to parse tasks cache", e);
          }
        }
      }

      if (showLoading) {
        setLoading(true);
      }

      const response = await listMyTasks({ page: 1, limit: 50 });
      const { tasks: fetchedTasks, stats: responseStats } = extractTasksResponse(response);

      // Sort to ensure stable deep equality checks
      fetchedTasks.sort((a, b) => String(a.id || a._id).localeCompare(String(b.id || b._id)));

      console.log("[MY TASKS] Fetched tasks:", fetchedTasks);
      setTaskFetchError(null);
      setAllTasks(prev => JSON.stringify(prev) === JSON.stringify(fetchedTasks) ? prev : fetchedTasks);

      // 2. Calculate stats client-side (standardizing statuses to UPPERCASE)
      const clientStats = fetchedTasks.reduce((acc, t) => {
        if (t.status) {
          const s = String(t.status).toUpperCase();
          acc[s] = (acc[s] || 0) + 1;
        }
        return acc;
      }, {});

      const combinedStats = { ...clientStats, ...responseStats };
      setStats(prev => JSON.stringify(prev) === JSON.stringify(combinedStats) ? prev : combinedStats);

      // Update cache
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: fetchedTasks,
          stats: combinedStats
        }));
      } catch (e) {
        console.error("Failed to write tasks cache", e);
      }

      const filtered = filterTasksForTab(fetchedTasks);
      setTasks(prev => JSON.stringify(prev) === JSON.stringify(filtered) ? prev : filtered);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setTaskFetchError(err?.message || "Unable to load your tasks.");
      if (showLoading && allTasksRef.current.length > 0) {
        setTasks(filterTasksForTab(allTasksRef.current));
      }
    } finally {
      if (showLoading) setLoading(false);
      taskFetchInFlightRef.current = false;
    }
  }, [filterTasksForTab]);

  useEffect(() => {
    fetchTasks(true);
  }, [activeTab, fetchTasks]);

  useAutoReload(fetchTasks, 60000);

  // Helper to map backend task to cards
  const getTaskProgress = (task) => {
    const directValues = [
      task?.progressPercent,
      task?.completionPercent,
      task?.progress,
      task?.taskProgress?.percent,
      task?.taskAssignment?.progressPercent,
      Array.isArray(task?.taskAssignments) ? task.taskAssignments[0]?.progressPercent : null,
    ];
    const direct = directValues.find((value) => value !== null && value !== undefined && Number.isFinite(Number(value)));
    if (direct !== undefined) return Math.max(0, Math.min(100, Math.round(Number(direct))));

    const items = task?.checklist?.items || task?.checklistItems || [];
    if (Array.isArray(items) && items.length > 0) {
      const completed = items.filter((item) => ['COMPLETED', 'APPROVED'].includes(String(item?.status || '').toUpperCase()) || item?.isChecked === true).length;
      return Math.round((completed / items.length) * 100);
    }

    const status = String(task?.status || '').toUpperCase();
    if (['SUBMITTED', 'COMPLETED', 'DONE', 'CLOSED', 'FINISHED'].includes(status)) return 100;
    return null;
  };

  const mapToActive = (t) => {
    const assignments = t.taskAssignments || [];
    const activeAssignment = Array.isArray(assignments) ? assignments[0] : assignments;
    return {
      id: t.id,
      title: t.title || "Untitled Task",
      company: t.category || "General",
      priority: t.priceAmount > 5000 ? "High" : "Medium",
      status: t.status === 'PUBLISHED' ? "Published" : t.status === 'IN_PROGRESS' ? "In Progress" : t.status,
      progress: getTaskProgress(t),
      date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Recent",
      avatars: activeAssignment?.tasker?.user?.profilePicUrl
        ? [activeAssignment.tasker.user.profilePicUrl]
        : (activeAssignment?.tasker?.displayName?.substring(0, 2).toUpperCase() ? [activeAssignment.tasker.displayName.substring(0, 2).toUpperCase()] : ["ON"]),
      filesCount: t.details?.filesCount || t.files?.length || 0
    };
  };

  const mapToPending = (t) => {
    const assignments = t.taskAssignments || [];
    const activeAssignment = Array.isArray(assignments) ? assignments[0] : assignments;
    return {
      id: t.id,
      title: t.title || "Untitled Task",
      warning: t.status === 'SUBMITTED' ? "Response Needed" : "Draft",
      name: activeAssignment?.tasker?.displayName || "Review Required",
      rating: activeAssignment?.tasker?.user?.ratingAvg || 0,
      role: t.category || "Task",
      milestones: t.status === 'SUBMITTED' ? "Work Submitted" : "Finalizing",
      progress: getTaskProgress(t),
      paid: 0,
      remaining: t.priceAmount || 0,
      image: activeAssignment?.tasker?.user?.profilePicUrl || `https://ui-avatars.com/api/?name=${t.category || "Task"}&background=random`,
      filesCount: t.details?.filesCount || t.files?.length || 0
    };
  };

  const mapToCompleted = (t) => {
    const assignments = t.taskAssignments || [];
    const activeAssignment = Array.isArray(assignments) ? assignments[0] : assignments;
    return {
      id: t.id,
      title: t.title || "Untitled Task",
      price: t.priceAmount ? t.priceAmount.toLocaleString() : "0",
      date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Recent",
      name: activeAssignment?.tasker?.displayName || "Task Performer",
      role: t.category || "Task",
      rating: 5,
      completedDate: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : "Recent",
      image: activeAssignment?.tasker?.user?.profilePicUrl || `https://ui-avatars.com/api/?name=User&background=random`,
      filesCount: t.details?.filesCount || t.files?.length || 0
    };
  };

  const SkeletonStatCard = () => (
    <div className="animate-pulse rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="h-3 w-1/3 rounded bg-[var(--color-border-subtle)]" />
          <div className="h-8 w-1/2 rounded bg-[var(--color-border-subtle)]" />
        </div>
        <div className="h-12 w-12 rounded-xl bg-[var(--color-border-subtle)]" />
      </div>
    </div>
  );

  const SkeletonTaskCard = () => (
    <div className="animate-pulse rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 h-[280px]">
      <div className="mb-5 flex items-center gap-4">
        <div className="h-[52px] w-[52px] rounded-2xl bg-[var(--color-border-subtle)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-[var(--color-border-subtle)]" />
          <div className="h-3 w-1/2 rounded bg-[var(--color-border-subtle)]" />
        </div>
      </div>
      <div className="mb-6 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-[var(--color-border-subtle)]" />
        <div className="h-5 w-20 rounded-full bg-[var(--color-border-subtle)]" />
      </div>
      <div className="mb-6 space-y-2">
        <div className="h-2 w-full rounded bg-[var(--color-border-subtle)]" />
        <div className="h-2 w-full rounded bg-[var(--color-border-subtle)]" />
      </div>
      <div className="mt-auto flex justify-between border-t border-[var(--color-border)] pt-5">
        <div className="h-8 w-20 rounded-full bg-[var(--color-border-subtle)]" />
        <div className="h-10 w-28 rounded-full bg-[var(--color-border-subtle)]" />
      </div>
    </div>
  );

  const renderStatCards = () => {
    if (loading) {
      return [1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />);
    }

    if (activeTab === "Applicants") {
      const interestCandidates = allTasks
        .filter(t => APPLICANT_STATUSES.includes(getTaskStatus(t)))
        .reduce((sum, t) => sum + getInterestCount(t), 0);
      return (
        <>
          <StatCard label="Published" value={stats.PUBLISHED || 0} accent="bg-sky-500" icon={<TrendingUp />} />
          <StatCard label="Interested Candidates" value={interestCandidates} accent="bg-[var(--color-primary)]" icon={<Users />} />
          <StatCard label="Active Tasks" value={(stats.IN_PROGRESS || 0) + (stats.CLAIMED || 0) + (stats.SUBMITTED || 0) + (stats.ASSIGNED || 0) + (stats.ACCEPTED || 0) + (stats.ACTIVE || 0)} accent="bg-violet-500" icon={<Clock />} />
          <StatCard label="Completed Tasks" value={stats.COMPLETED || 0} accent="bg-emerald-500" icon={<Medal />} />
        </>
      );
    }
    if (activeTab === "Active") {
      return (
        <>
          <StatCard label="In Progress" value={(stats.IN_PROGRESS || 0) + (stats.ASSIGNED || 0) + (stats.ACCEPTED || 0) + (stats.ACTIVE || 0)} accent="bg-[var(--color-primary)]" icon={<Clock />} />
          <StatCard label="Claimed" value={stats.CLAIMED || 0} accent="bg-violet-500" icon={<CheckCircle2 />} />
          <StatCard label="Awaiting Review" value={stats.SUBMITTED || 0} accent="bg-rose-500" icon={<AlertCircle />} />
          <StatCard label="Total Active" value={(stats.IN_PROGRESS || 0) + (stats.CLAIMED || 0) + (stats.SUBMITTED || 0) + (stats.ASSIGNED || 0) + (stats.ACCEPTED || 0) + (stats.ACTIVE || 0)} accent="bg-amber-500" icon={<Calendar />} />
        </>
      );
    }
    if (activeTab === "Completed") {
      const totalPaid = allTasks.filter(t => String(t.status).toUpperCase() === 'COMPLETED').reduce((sum, t) => sum + (t.priceAmount || 0), 0);
      return (
        <>
          <StatCard label="Completed" value={stats.COMPLETED || 0} accent="bg-[var(--color-primary)]" icon={<Medal />} />
          <StatCard label="Total Paid" value={`₹${totalPaid.toLocaleString()}`} accent="bg-emerald-500" icon={<CircleDollarSign />} />
          <StatCard label="Cancelled" value={stats.CANCELED || 0} accent="bg-slate-500" icon={<AlertCircle />} />
          <StatCard label="Expired" value={stats.EXPIRED || 0} accent="bg-amber-500" icon={<Star />} />
        </>
      );
    }
    if (activeTab === "Draft") {
      const estBudget = allTasks.filter(t => String(t.status).toUpperCase() === 'DRAFT').reduce((sum, t) => sum + (t.priceAmount || 0), 0);
      return (
        <>
          <StatCard label="Drafts" value={stats.DRAFT || 0} accent="bg-amber-500" icon={<CircleDollarSign />} />
          <StatCard label="Est. Budget" value={`₹${estBudget.toLocaleString()}`} accent="bg-[var(--color-primary)]" icon={<CircleDollarSign />} />
          <StatCard label="Published" value={stats.PUBLISHED || 0} accent="bg-sky-500" icon={<TrendingUp />} />
          <div className="hidden min-h-[1px] md:block" aria-hidden />
        </>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-24 pt-[80px] font-sans antialiased">
      <ProviderHeader activePage="my-tasks" />



      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page shell */}


        {/* Summary metrics */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {renderStatCards()}
        </MotionDiv>

        {/* Tabs + list */}
        <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/95 shadow-[var(--shadow-sm)] backdrop-blur-sm">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              {TASK_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`relative pb-4 pt-5 text-[15px] font-bold transition-colors sm:text-[16px] ${activeTab === tab
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]"
                    }`}
                >
                  {tab === "Applicants" ? "Applications" : tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="myTasksTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[var(--color-primary)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {taskFetchError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>{taskFetchError}</span>
                  <button
                    type="button"
                    onClick={() => fetchTasks(true, true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
                  >
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.4} />
                    Retry
                  </button>
                </div>
              </div>
            )}
            <p className="mb-6 text-sm text-[var(--color-text-muted)]">
              {activeTab === "Applicants" && "Tasks open for applications. Click any task to review performers showing interest."}
              {activeTab === "Active" && "Tasks currently in motion with your performers, including pending submissions."}
              {activeTab === "Completed" && "Closed tasks and payouts for your records."}
              {activeTab === "Draft" && "Unpublished tasks you are still preparing."}
            </p>

            <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <SkeletonTaskCard />
                    </motion.div>
                  ))
                ) : searchedTasks.length > 0 ? (
                  searchedTasks.map((task, idx) => (
                    <motion.div
                      key={task.id || idx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                    >
                      {activeTab === "Applicants" && (
                        <InterestTaskCard
                          task={task}
                          onClick={() => navigate(`/provider/task-activity?taskId=${task.id}`)}
                          onNavigateDetails={() => navigate(`/provider/task-details?taskId=${task.id}`)}
                          onDelete={canDeleteTask(task) ? () => handleDeleteTask(task) : null}
                          onCancel={() => openConfirm({
                            title: "Cancel this task?",
                            message: "This task will no longer be visible to performers. This action cannot be undone.",
                            confirmLabel: "Yes, cancel",
                            onConfirm: async () => {
                              try {
                                clearTaskCaches();
                                await cancelTask(task.id);
                                removeTaskFromLists(task.id);
                                refreshData();
                              } catch (err) {
                                alert("Failed to cancel task: " + (err.message || ""));
                              }
                            },
                          })}
                        />
                      )}
                      {activeTab === "Active" && (
                        String(task.status).toUpperCase() === 'SUBMITTED' ? (
                          <PendingTaskCard
                            task={mapToPending(task)}
                            onClick={() => navigate(`/provider/active-task/${task.id}`, { state: { task } })}
                          />
                        ) : (
                          <ActiveTaskCard
                            task={mapToActive(task)}
                            onClick={() => navigate(`/provider/active-task/${task.id}`, { state: { task } })}
                          />
                        )
                      )}
                      {activeTab === "Draft" && (
                        <DraftTaskCard
                          task={task}
                          isPublishing={publishingTaskId === task.id}
                          onPublish={async () => {
                            // State updates are asynchronous, so use a ref as
                            // the immediate lock for rapid/double clicks.
                            if (publishingTaskIdRef.current) return;

                            publishingTaskIdRef.current = task.id;
                            setPublishingTaskId(task.id);
                            try {
                              clearTaskCaches();
                              await publishTask(task.id);
                              setTasks(prev => prev.filter(t => t.id !== task.id));
                              setAllTasks(prev => prev.filter(t => t.id !== task.id));
                              navigate(`/provider/task-activity?taskId=${task.id}`);
                            } catch (err) {
                              const isRateLimited = err?.status === 429 || /rate exceeded|too many requests/i.test(err?.message || "");
                              alert(
                                isRateLimited
                                  ? "Too many requests were sent. Please wait a moment and try publishing again."
                                  : "Failed to publish task: " + (err.message || "")
                              );
                            } finally {
                              publishingTaskIdRef.current = null;
                              setPublishingTaskId(null);
                            }
                          }}
                          onView={() => navigate("/provider/post-task-manual", {
                            state: { editTask: task },
                          })}
                          onDelete={canDeleteTask(task) ? () => handleDeleteTask(task) : null}
                        />
                      )}
                      {activeTab === "Completed" && (
                        <CompletedTaskCard
                          task={mapToCompleted(task)}
                          onClick={() => navigate(`/provider/active-task/${task.id}`, { state: { task } })}
                        />
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 xl:col-span-3 py-16 text-center">
                    <p className="text-lg font-medium text-[var(--color-text-subtle)]">
                      {searchQuery ? `No tasks found matching "${searchQuery}"` : `No ${activeTab.toLowerCase()} found.`}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => navigate("/provider/post-task-selection")}
                        className="mt-4 text-[var(--color-primary)] font-bold hover:underline"
                      >
                        Create your first task
                      </button>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.onConfirm}
        onClose={closeConfirm}
      />
    </div>
  );
};

const StatCard = ({ label, value, accent, icon }) => (
  <div className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]/20 hover:shadow-[var(--shadow-md)]">
    <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-[var(--color-primary)]/[0.05] opacity-0 transition group-hover:opacity-100" />
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-1 text-3xl font-black tracking-tight text-[var(--color-text)]">{value}</p>
      </div>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent} text-white shadow-[var(--shadow-xs)] ring-1 ring-black/[0.06]`}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon, { size: 20, className: "h-5 w-5 text-white", strokeWidth: 2.25 })
          : icon}
      </div>
    </div>
  </div>
);

const ActiveTaskCard = ({ task, onClick }) => (
  <div className="flex h-full flex-col rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:shadow-[var(--shadow-lg)]">
    <div className="mb-5 flex items-center gap-4">
      <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[15px] font-bold text-white shadow-[var(--shadow-glow)] overflow-hidden">
        {task.avatars[0] && (task.avatars[0].startsWith('http') || task.avatars[0].includes('/')) ? (
          <img src={task.avatars[0]} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          task.avatars[0]
        )}
      </div>
      <div className="min-w-0">
        <h4 className="text-[15px] font-bold text-[var(--color-text)] transition group-hover:text-[var(--color-primary)]">
          {task.title}
        </h4>
        <p className="text-xs font-semibold text-[var(--color-text-subtle)]">{task.company}</p>
      </div>
    </div>

    <div className="mb-6 flex flex-wrap gap-2">
      <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200/80">
        {task.priority}
      </span>
      <span className="rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/15">
        {task.status}
      </span>
    </div>

    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--color-text-muted)]">Progress</span>
        <span className="text-xs font-bold text-[var(--color-primary)]">{task.progress == null ? "Not reported" : `${task.progress}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
          style={{ width: `${task.progress ?? 0}%` }}
        />
      </div>
    </div>

    <div className="mt-auto flex flex-col gap-4 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex -space-x-2">
        {task.avatars.slice(0, 3).map((av, i) => (
          <div
            key={i}
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm overflow-hidden ${
              i === 0 ? "bg-[var(--color-primary)]" : i === 1 ? "bg-sky-500" : "bg-slate-400"
            }`}
          >
            {av && (av.startsWith('http') || av.includes('/')) ? (
              <img src={av} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              av
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-stretch gap-3 sm:items-end">
        <div className="flex items-center gap-3 text-[var(--color-text-subtle)]">
          {task.filesCount > 0 && (
            <div className="flex items-center gap-1 font-bold text-[#16a34a]">
              <Paperclip className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="text-[11px]">{task.filesCount}</span>
            </div>
          )}
          <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
          <span className="text-[11px] font-semibold">{task.date}</span>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-[13px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const PendingTaskCard = ({ task, onClick }) => (
  <div className="flex h-full flex-col rounded-[var(--radius-2xl)] border border-red-200/80 bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] ring-1 ring-red-100/50 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/20 hover:shadow-[var(--shadow-lg)]">
    <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/80 p-3 text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 animate-pulse" strokeWidth={2.25} />
      <span className="text-[11px] font-bold uppercase leading-snug tracking-tight">{task.warning}</span>
    </div>

    <div className="mb-5 flex items-center gap-4">
      <img
        src={task.image}
        alt={task.name}
        className="h-14 w-14 rounded-2xl object-cover shadow-[var(--shadow-xs)] ring-1 ring-black/[0.06]"
      />
      <div className="min-w-0">
        <h4 className="text-[15px] font-bold text-[var(--color-text)] truncate">{task.title}</h4>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
          <span className="text-xs font-bold">{task.rating}</span>
          <span className="text-[var(--color-text-subtle)]">·</span>
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">Performer: {task.name}</span>
          {task.filesCount > 0 && (
            <>
              <span className="text-[var(--color-text-subtle)]">·</span>
              <div className="flex items-center gap-1 font-bold text-[#16a34a]">
                <Paperclip className="h-3 w-3" strokeWidth={2.5} />
                <span className="text-[11px]">{task.filesCount}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>

    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--color-text-muted)]">{task.milestones}</span>
        <span className="text-xs font-bold text-[var(--color-text)]">{task.progress == null ? "Not reported" : `${task.progress}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-red-50">
        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 shadow-sm" style={{ width: `${task.progress ?? 0}%` }} />
      </div>
    </div>

    <div className="mb-6 grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Paid</p>
        <p className="text-lg font-black text-[var(--color-text)]">₹{task.paid}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Remaining</p>
        <p className="text-lg font-black text-[var(--color-primary)]">₹{task.remaining}</p>
      </div>
    </div>

    <div className="mt-auto flex gap-3">
      <button
        type="button"
        onClick={onClick}
        className="flex-[1.5] inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-3 text-[13px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
      >
        Review Work
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="flex-1 rounded-2xl border border-[var(--color-border)] bg-white py-3 text-[13px] font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)]"
      >
        Replace
      </button>
    </div>
  </div>
);

const CompletedTaskCard = ({ task, onClick }) => (
  <div className="flex h-full flex-col rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-4">
        <img
          src={task.image}
          alt={task.name}
          className="h-14 w-14 shrink-0 rounded-full border-2 border-[var(--color-primary-subtle)] object-cover shadow-sm"
        />
        <div className="min-w-0">
          <h4 className="text-[15px] font-bold text-[var(--color-text)] truncate">{task.title}</h4>
          <p className="text-xs font-semibold text-[var(--color-text-subtle)]">Performer: {task.name}</p>
        </div>
      </div>
      <div className="shrink-0 text-xl font-black text-[var(--color-text)]">₹{task.price}</div>
    </div>

    <div className="mb-6 flex items-start gap-2 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-subtle)]/80 p-3 text-[var(--color-primary)]">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
      <span className="text-xs font-semibold leading-snug">Successfully completed on {task.completedDate}</span>
    </div>

    <div className="mt-auto flex gap-3">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex flex-[1.5] items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-3 text-[13px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
      >
        View Details
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        className="flex-1 rounded-2xl border border-[var(--color-border)] bg-white py-3 text-[13px] font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)]"
      >
        Report
      </button>
    </div>
  </div>
);

const DraftTaskCard = ({ task, onPublish, onView, onDelete, isPublishing = false }) => (
  <div className="flex h-full flex-col rounded-[var(--radius-2xl)] border border-amber-200/80 bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xs)] ring-1 ring-amber-100/40 transition hover:shadow-[var(--shadow-md)]">
    <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/80 p-3 text-amber-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
      <span className="text-[11px] font-bold uppercase leading-snug tracking-tight">Draft — Not Published</span>
    </div>

    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 text-[13px] font-black">
        {(task.title || "T").substring(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <h4 className="truncate text-[15px] font-bold text-[var(--color-text)]">{task.title || "Untitled Task"}</h4>
        <p className="text-xs font-semibold text-[var(--color-text-subtle)]">{task.category || "General"}</p>
      </div>
    </div>

    <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
      {task.priceAmount > 0 && (
        <span className="rounded-full bg-[var(--color-border-subtle)] px-3 py-1">
          ₹{task.priceAmount.toLocaleString()}
        </span>
      )}
      {task.dueAt && (
        <span className="rounded-full bg-[var(--color-border-subtle)] px-3 py-1">
          Due {new Date(task.dueAt).toLocaleDateString()}
        </span>
      )}
      {task.createdAt && (
        <span className="rounded-full bg-[var(--color-border-subtle)] px-3 py-1">
          Created {new Date(task.createdAt).toLocaleDateString()}
        </span>
      )}
    </div>

    <div className="mt-auto flex gap-3 pt-4 border-t border-[var(--color-border)]">
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
        >
          Delete
        </button>
      )}
      <button
        type="button"
        onClick={onView}
        className="flex-1 rounded-2xl border border-[var(--color-border)] bg-white py-3 text-[13px] font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)] active:scale-[0.98]"
      >
        Edit task
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={isPublishing}
        aria-busy={isPublishing}
        className="flex-[1.5] inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-3 text-[13px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPublishing ? "Publishing…" : "Publish Task"}
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  </div>
);

const InterestTaskCard = ({ task, onClick, onNavigateDetails, onCancel, onDelete }) => {
  const applicants = Array.isArray(task.applicants)
    ? task.applicants
    : (Array.isArray(task.interests) ? task.interests : []);
  const applicantsCount = applicants.length || Number(task.interestsCount ?? task._count?.interests ?? task.applicantCount ?? 0);
  const invitations = Array.isArray(task.invitations) ? task.invitations : [];
  const invitationsCount = invitations.length || Number(task._count?.invitations ?? task.invitationsCount ?? task.inviteCount ?? 0);
  const hasApplicants = applicantsCount > 0;
  const hasInvitations = !hasApplicants && invitationsCount > 0;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-100">
      {/* Thin accent line at top */}
      <div className={`h-[3px] w-full ${hasApplicants ? "bg-gradient-to-r from-emerald-400 to-teal-400" : hasInvitations ? "bg-gradient-to-r from-violet-400 to-purple-400" : "bg-gradient-to-r from-slate-200 to-slate-300"}`} />

      {/* Header row */}
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {task.category || "General"}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${
          hasApplicants
            ? "bg-emerald-500 text-white"
            : hasInvitations
              ? "bg-violet-100 text-violet-700"
              : "bg-slate-100 text-slate-500"
        }`}>
          {hasApplicants && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          )}
          {hasApplicants ? `${applicantsCount} Applied` : hasInvitations ? `${invitationsCount} Invited` : "Open"}
        </span>
      </div>

      {/* Title */}
      <div className="px-5 pt-3">
        <h3 className="line-clamp-2 text-[15px] font-black leading-snug tracking-tight text-slate-900">
          {task.title || "Untitled Task"}
        </h3>
        {task.description && (
          <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-slate-400">
            {task.description}
          </p>
        )}
      </div>

      {/* Applicants section */}
      <div className="mx-5 mt-4">
        {hasApplicants ? (
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {applicants.slice(0, 4).map((applicant, i) => {
                  const performer = applicant.tasker || {};
                  const name = performer.displayName || "A";
                  const avatar = performer.user?.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d1fae5&color=065f46&bold=true&size=64`;
                  return (
                    <img key={i} src={avatar} alt={name}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm" />
                  );
                })}
                {applicantsCount > 4 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-200 text-[9px] font-black text-emerald-800 shadow-sm">
                    +{applicantsCount - 4}
                  </div>
                )}
              </div>
              <div className="text-[12px] leading-none">
                <span className="font-black text-emerald-700">{applicantsCount}</span>
                <span className="ml-1 font-semibold text-emerald-600">
                  performer{applicantsCount > 1 ? "s" : ""} applied
                </span>
              </div>
            </div>
            <Eye className="h-4 w-4 text-emerald-400" strokeWidth={2} />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">
              <Users className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-500">Waiting for interest</p>
              {hasInvitations && (
                <p className="text-[10px] font-semibold text-violet-500">{invitationsCount} invitation{invitationsCount > 1 ? "s" : ""} sent</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 pb-5 pt-4">
        {/* Budget row */}
        <div className="mb-3">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Budget</p>
          <p className="text-[18px] font-black leading-none tracking-tight text-slate-900">
            ₹{task.priceAmount ? Number(task.priceAmount).toLocaleString("en-IN") : "0"}
          </p>
        </div>

        {/* Actions row — full width, never overflows */}
        <div className="flex items-center justify-between">
          {/* Destructive icon buttons on the left of this row */}
          <div className="flex items-center gap-1">
            {onDelete && (
              <button
                type="button"
                title="Delete task"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-50 hover:text-red-500 active:scale-95"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                title="Cancel task"
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-50 hover:text-red-500 active:scale-95"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Primary actions on the right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigateDetails?.(); }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
            >
              <FileText className="h-3 w-3" strokeWidth={2.5} />
              Details
            </button>
            <button
              type="button"
              onClick={onClick}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-[12px] font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95"
            >
              Activity
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasksPage;
