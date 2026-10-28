import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import { getSavedTasks, unsaveTask } from "../services/api";
import { normalizePagedList } from "../../../utils/fileUpload";

const PerformerSavedTasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const loadSaved = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSavedTasks({ page, limit });
      const { items, total: count } = normalizePagedList(res, [
        "tasks",
        "savedTasks",
        "data",
        "items",
      ]);
      setTasks(items);
      setTotal(count);
    } catch (err) {
      console.error("[Saved tasks] load failed:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const handleRemove = async (taskId) => {
    try {
      await unsaveTask(taskId);
      setTasks((prev) => prev.filter((t) => (t.id || t.taskId) !== taskId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      alert(err.message || "Could not remove saved task.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />
      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
            <PerformerPageHeader
              title="Saved Tasks"
              subtitle="Tasks you bookmarked to apply later"
              backTo="/performer/account"
            />

            {loading ? (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-12 text-center">
                <Bookmark className="mx-auto mb-4 h-10 w-10 text-[var(--color-text-subtle)]" />
                <p className="font-bold text-[var(--color-text)]">No saved tasks yet</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Save tasks from the feed to find them here.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/performer/dashboard")}
                  className="mt-6 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white"
                >
                  Browse tasks
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((entry) => {
                  const task = entry.task || entry;
                  const taskId = task.id || entry.taskId || entry.id;
                  return (
                    <article
                      key={taskId}
                      className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                          {task.category || "General"}
                        </p>
                        <h2 className="mt-1 truncate text-lg font-bold text-[var(--color-text)]">
                          {task.title || "Untitled task"}
                        </h2>
                        {task.locationCity || task.city ? (
                          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                            <MapPin size={14} />
                            {task.locationCity || task.city}
                          </p>
                        ) : null}
                        {task.priceAmount != null ? (
                          <p className="mt-2 text-sm font-bold text-[var(--color-text)]">
                            ₹{Number(task.priceAmount).toLocaleString("en-IN")}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/performer/task/${taskId}`)}
                          className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white"
                        >
                          View task
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(taskId)}
                          className="rounded-xl border border-rose-200 px-3 py-2.5 text-rose-600 hover:bg-rose-50"
                          aria-label="Remove saved task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </article>
                  );
                })}

                {totalPages > 1 ? (
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-bold disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-[var(--color-text-muted)]">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-bold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </main>
    </div>
  );
};

export default PerformerSavedTasksPage;
