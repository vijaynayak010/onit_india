import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  MoreVertical,
  User,
  Loader2,
  FileClock,
} from "lucide-react";
import ProviderAccountPageLayout from "../components/ProviderAccountPageLayout";
import { listMyTasks } from "../services/api";

const ACTIVE_STATUSES = ["IN_PROGRESS", "CLAIMED", "SUBMITTED", "ASSIGNED", "ACCEPTED", "ACTIVE", "PUBLISHED"];
const COMPLETED_STATUSES = ["COMPLETED", "PAID", "CLOSED"];

const categoryStyle = (category = "") => {
  const key = category.toLowerCase();
  if (key.includes("business")) return { dot: "bg-red-500", label: "text-red-600" };
  if (key.includes("ux") || key.includes("research")) return { dot: "bg-amber-400", label: "text-gray-500" };
  if (key.includes("design")) return { dot: "bg-violet-500", label: "text-violet-600" };
  return { dot: "bg-emerald-500", label: "text-emerald-600" };
};

const formatDeadline = (dueAt, createdAt) => {
  const date = dueAt || createdAt;
  if (!date) return "Deadline: —";
  return `Deadline: ${new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

const getAssignee = (task) => {
  const assignments = task.taskAssignments || [];
  const assignment = Array.isArray(assignments) ? assignments[0] : assignments;
  const tasker = assignment?.tasker;
  const name = tasker?.displayName || tasker?.user?.email?.split("@")[0] || null;
  const avatar = tasker?.user?.profilePicUrl;
  const initial = name ? name.charAt(0).toUpperCase() : null;
  return { name, avatar, initial };
};

const getProgress = (task) => {
  const status = String(task.status).toUpperCase();
  if (status === "COMPLETED" || status === "PAID") return 100;
  if (status === "SUBMITTED") return 90;
  if (status === "IN_PROGRESS" || status === "ACTIVE") return 60;
  if (status === "ASSIGNED" || status === "ACCEPTED") return 30;
  if (status === "PUBLISHED") return 10;
  return 0;
};

const isCompleted = (task) => COMPLETED_STATUSES.includes(String(task.status).toUpperCase());
const isActive = (task) => ACTIVE_STATUSES.includes(String(task.status).toUpperCase());

const TaskHistoryCard = ({ task, onView }) => {
  const category = (task.category || task.domain || "General").toUpperCase();
  const style = categoryStyle(category);
  const assignee = getAssignee(task);
  const progress = getProgress(task);
  const completed = isCompleted(task);
  const showProgress = isActive(task) && !completed;

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        completed ? "border-gray-100 opacity-90" : "border-gray-100"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
          <span className={`text-[11px] font-bold tracking-wide ${style.label}`}>{category}</span>
        </div>
        <button
          type="button"
          className="rounded-lg p-1 text-gray-300 transition hover:bg-gray-50 hover:text-gray-500"
          aria-label="More options"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <h2
        className={`text-base font-extrabold ${
          completed ? "text-gray-500" : "text-gray-900"
        }`}
      >
        {task.title || "Untitled Task"}
      </h2>
      <p className="mt-1 text-sm font-medium text-gray-400">
        {formatDeadline(task.dueAt, task.createdAt)}
      </p>

      {showProgress ? (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wide text-gray-400">PROGRESS</span>
            <span className="text-sm font-extrabold text-gray-900">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-900 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className={`flex items-center justify-between ${showProgress ? "mt-5" : "mt-6"}`}>
        <div className="flex items-center gap-2">
          {assignee.avatar ? (
            <img
              src={assignee.avatar}
              alt={assignee.name || "Assignee"}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : assignee.initial ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
              {assignee.initial}
            </div>
          ) : (
            <User size={16} className="text-emerald-500" strokeWidth={2.5} />
          )}
          <span className="text-sm font-medium text-gray-500">
            {assignee.name || "Unassigned"}
          </span>
        </div>

        {completed ? (
          <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
            Paid
          </span>
        ) : (
          <button
            type="button"
            onClick={onView}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            View Progress
          </button>
        )}
      </div>
    </article>
  );
};

const TaskHistoryPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listMyTasks({ limit: 100 });
      const all = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const posted = all.filter((t) => String(t.status).toUpperCase() !== "DRAFT");
      posted.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
      setTasks(posted);
    } catch (err) {
      console.error("[TaskHistory] fetch error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        (t.title || "").toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  return (
    <ProviderAccountPageLayout title="Task History" subtitle="All posted tasks">
      <div className="mb-6 flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            strokeWidth={2.25}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search for "Web Designer"'
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15"
          />
        </div>
        <button
          type="button"
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-gray-300 hover:text-gray-700"
          aria-label="Filter tasks"
        >
          <SlidersHorizontal size={20} strokeWidth={2} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <FileClock className="mb-4 h-12 w-12 text-gray-300" strokeWidth={1.5} />
          <p className="text-lg font-bold text-gray-700">
            {searchQuery ? "No tasks match your search" : "No posted tasks yet"}
          </p>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            {searchQuery
              ? "Try a different keyword or clear the search."
              : "Publish a task to see it in your history."}
          </p>
          {!searchQuery ? (
            <button
              type="button"
              onClick={() => navigate("/provider/post-task-selection")}
              className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
            >
              Post a Task
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <TaskHistoryCard
              key={task.id || task._id}
              task={task}
              onView={() => {
                const status = String(task.status).toUpperCase();
                if (COMPLETED_STATUSES.includes(status)) {
                  navigate(`/provider/active-task/${task.id || task._id}`);
                } else if (status === "PUBLISHED") {
                  navigate(`/provider/task-applicants?taskId=${task.id || task._id}`);
                } else {
                  navigate(`/provider/active-task/${task.id || task._id}`);
                }
              }}
            />
          ))}
        </div>
      )}
    </ProviderAccountPageLayout>
  );
};

export default TaskHistoryPage;
