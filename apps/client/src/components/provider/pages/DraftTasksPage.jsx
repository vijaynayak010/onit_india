import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Loader2, ClipboardList } from "lucide-react";
import ProviderAccountPageLayout from "../components/ProviderAccountPageLayout";
import { listMyTasks } from "../services/api";

const formatPrice = (amount) => {
  if (!amount || amount <= 0) return "₹—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const formatDue = (dueAt) => {
  if (!dueAt) return "Due —";
  return `Due ${new Date(dueAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

const DraftTaskCard = ({ task, onView }) => {
  const category = task.category || task.domain || "General";
  const title = task.title || "Untitled Task";

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm font-semibold text-blue-600">{category}</p>
        </div>
        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
          Draft
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-extrabold text-gray-900">{formatPrice(task.priceAmount || task.budget)}</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-gray-400">
          <Clock size={14} strokeWidth={2.25} />
          {formatDue(task.dueAt)}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFFBFB] text-xs font-bold text-[#10605F]">
            U
          </div>
          <span className="text-sm font-medium text-gray-500">Unassigned</span>
        </div>
        <button
          type="button"
          onClick={onView}
          className="rounded-xl bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
        >
          View
        </button>
      </div>
    </article>
  );
};

const DraftTasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listMyTasks({ limit: 100 });
      const all = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const drafts = all.filter((t) => String(t.status).toUpperCase() === "DRAFT");
      drafts.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
      setTasks(drafts);
    } catch (err) {
      console.error("[DraftTasks] fetch error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const subtitle = useMemo(() => {
    const count = tasks.length;
    return count === 1 ? "1 unpublished task" : `${count} unpublished tasks`;
  }, [tasks.length]);

  return (
    <ProviderAccountPageLayout title="Draft Tasks" subtitle={loading ? "Loading…" : subtitle}>
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-gray-300" strokeWidth={1.5} />
          <p className="text-lg font-bold text-gray-700">No draft tasks</p>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Tasks you save without publishing will appear here.
          </p>
          <button
            type="button"
            onClick={() => navigate("/provider/post-task-selection")}
            className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            Create a Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <DraftTaskCard
              key={task.id || task._id}
              task={task}
              onView={() => navigate(`/provider/task-applicants?taskId=${task.id || task._id}`)}
            />
          ))}
        </div>
      )}
    </ProviderAccountPageLayout>
  );
};

export default DraftTasksPage;
