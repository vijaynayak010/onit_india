import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, CheckCircle2, AlertCircle, RefreshCw, ListTodo } from "lucide-react";
import { listMyTasks } from "../../services/api";

const TABS = [
  { id: "all", label: "All Tasks" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" }
];

const AllTasksView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await listMyTasks({ limit: 100 });
      let fetchedTasks = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "active") {
      return ['IN_PROGRESS', 'CLAIMED', 'SUBMITTED', 'ASSIGNED', 'ACCEPTED', 'ACTIVE', 'PUBLISHED'].includes(String(t.status).toUpperCase());
    }
    if (activeTab === "completed") {
      return String(t.status).toUpperCase() === 'COMPLETED';
    }
    return true;
  }).filter((task) => {
    if (!searchQuery) return true;
    return task.title?.toLowerCase().includes(searchQuery.toLowerCase()) || task.category?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "bg-[var(--color-surface-elevated)] text-[var(--color-text-subtle)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab.label}
              <span className="ml-2 inline-flex h-5 items-center justify-center rounded-full bg-white/20 px-2 text-[10px]">
                {tab.id === "all" ? tasks.length : 
                 tab.id === "active" ? tasks.filter(t => ['IN_PROGRESS', 'CLAIMED', 'SUBMITTED', 'ASSIGNED', 'ACCEPTED', 'ACTIVE', 'PUBLISHED'].includes(String(t.status).toUpperCase())).length :
                 tasks.filter(t => String(t.status).toUpperCase() === 'COMPLETED').length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-2 pl-9 pr-4 text-sm font-semibold outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <button
            onClick={fetchTasks}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-subtle)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--color-border-subtle)]" />
          ))
        ) : filteredTasks.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => navigate(`/provider/active-task/${task.id}`)}
                className="group flex cursor-pointer flex-col gap-4 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-md)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4 sm:items-center">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    String(task.status).toUpperCase() === 'COMPLETED' ? "bg-[#DFF7F6] text-[#10605F]" :
                    String(task.status).toUpperCase() === 'PUBLISHED' ? "bg-sky-100 text-sky-600" : "bg-amber-100 text-amber-600"
                  }`}>
                    {String(task.status).toUpperCase() === 'COMPLETED' ? <CheckCircle2 size={24} /> :
                     String(task.status).toUpperCase() === 'PUBLISHED' ? <ListTodo size={24} /> : <Clock size={24} />}
                  </div>
                  
                  <div>
                    <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">{task.title || "Untitled Task"}</h3>
                    <p className="mt-1 text-sm font-medium text-[var(--color-text-subtle)]">{task.category || "General"} • ₹{task.priceAmount || task.budget || 0}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                    String(task.status).toUpperCase() === 'COMPLETED' ? "bg-[#EFFBFB] text-[#10605F]" :
                    String(task.status).toUpperCase() === 'PUBLISHED' ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {task.status}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
            <ListTodo className="mx-auto h-12 w-12 opacity-20" />
            <h3 className="mt-4 text-lg font-bold text-[var(--color-text)]">No tasks found</h3>
            <p className="mt-1 text-sm font-medium text-[var(--color-text-subtle)]">There are no tasks matching your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTasksView;
