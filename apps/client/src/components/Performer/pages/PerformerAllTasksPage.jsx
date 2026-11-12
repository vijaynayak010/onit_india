import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, CheckCircle2, AlertCircle, RefreshCw, ListTodo, TrendingUp, Zap, Calendar } from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import { getAssignedTasks, getMyInterests, getChecklist } from "../services/api";
import { resolveClientDisplayName } from "../utils/performerClientUtils";

const TABS = [
  { id: "all", label: "All Tasks" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" }
];

const PerformerAllTasksPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [assignedRes, interestRes] = await Promise.all([
        getAssignedTasks().catch(() => ({ tasks: [], data: [] })),
        getMyInterests().catch(() => ({ tasks: [], data: [] }))
      ]);

      let allTasks = [];

      const assignedTasks = assignedRes?.tasks || assignedRes?.data || (Array.isArray(assignedRes) ? assignedRes : []);
      if (Array.isArray(assignedTasks) && assignedTasks.length > 0) {
        const checklistResults = await Promise.all(
          assignedTasks.map(t => {
            const taskId = t.task?.id || t.id;
            const isCompleted = t.status === 'COMPLETED' || t.task?.status === 'COMPLETED';
            const isSubmitted = t.status === 'SUBMITTED';
            if (isCompleted || isSubmitted || !taskId) return Promise.resolve(null);
            return getChecklist(taskId).catch(() => null);
          })
        );

        const assignedMapped = assignedTasks.map((t, idx) => {
          if (!t) return null;
          const task = t.task || {};
          const provider = task.provider || {};
          const providerProfile = provider.provider || {};

          const isCompleted = t.status === 'COMPLETED' || task.status === 'COMPLETED';
          const isSubmitted = t.status === 'SUBMITTED';

          let milestoneCurrent = 0, milestoneTotal = 1, progress = 0;

          if (isCompleted) {
            milestoneCurrent = 1; milestoneTotal = 1; progress = 100;
          } else if (isSubmitted) {
            milestoneCurrent = 0; milestoneTotal = 1; progress = 90;
          } else {
            const checklistData = checklistResults[idx];
            const items = checklistData?.items || [];
            milestoneTotal = items.length || 1;
            milestoneCurrent = items.filter(item => item.isChecked).length;
            progress = milestoneTotal > 0 ? Math.round((milestoneCurrent / milestoneTotal) * 100) : 0;
          }

          return {
            id: task.id || t.id,
            category: task.category || "General",
            status: isCompleted ? 'completed' : isSubmitted ? 'pending' : 'active',
            priority: task.priority === 'HIGH' ? "High" : "Normal",
            company: task.title || "Untitled Task",
            client: resolveClientDisplayName(task, providerProfile),
            deadline: task.dueAt ? new Date(task.dueAt).toLocaleDateString() : (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Flexible"),
            priceAmount: task.priceAmount || task.budget || 0,
            milestones: { current: milestoneCurrent, total: milestoneTotal },
            progress,
            onTrack: true,
            avatar: provider.profilePicUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
          };
        }).filter(Boolean);
        allTasks = [...allTasks, ...assignedMapped];
      }

      const interests = interestRes?.data || interestRes?.tasks || (Array.isArray(interestRes) ? interestRes : []);
      if (Array.isArray(interests) && interests.length > 0) {
        const interestMapped = interests.map(interest => {
          if (!interest) return null;
          const task = interest.task || {};
          const provider = task.provider || {};
          const providerProfile = provider.provider || {};

          return {
            id: task.id || interest.id,
            category: task.category || "General",
            status: "pending",
            priority: task.priority === "HIGH" ? "High" : "Normal",
            company: task.title || "Pending Task",
            client: resolveClientDisplayName(task, providerProfile),
            deadline: task.dueAt ? new Date(task.dueAt).toLocaleDateString() : (interest.createdAt ? new Date(interest.createdAt).toLocaleDateString() : "Flexible"),
            priceAmount: task.priceAmount || task.budget || 0,
            milestones: { current: 0, total: 1 },
            progress: 0,
            onTrack: true,
            avatar: provider.profilePicUrl || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
          };
        }).filter(Boolean);
        allTasks = [...allTasks, ...interestMapped];
      }

      const seenIds = new Set();
      const uniqueTasks = [];
      allTasks.forEach(task => {
        if (task) {
          const taskId = task.id;
          if (taskId && !seenIds.has(taskId)) {
            seenIds.add(taskId);
            uniqueTasks.push(task);
          }
        }
      });

      setTasks(uniqueTasks);
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
    if (activeTab === "active") return t.status === "active" || t.status === "pending";
    if (activeTab === "completed") return t.status === "completed";
    return true;
  }).filter((task) => {
    if (!searchQuery) return true;
    return task.company?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           task.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           task.client?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
            <PerformerPageHeader
              title="All Tasks"
              subtitle="View your complete task history and track assignment progress"
              backTo="/performer/account"
              backLabel="Back to Account Hub"
            />

            <div className="space-y-6">
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
                         tab.id === "active" ? tasks.filter(t => t.status === "active" || t.status === "pending").length :
                         tasks.filter(t => t.status === "completed").length}
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
                        onClick={() => navigate(`/performer/active-task/${task.id}`)}
                        className="group flex cursor-pointer flex-col gap-4 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-md)] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-start gap-4 sm:items-center">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                            task.status === 'completed' ? "bg-[#DFF7F6] text-[#10605F]" :
                            task.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-sky-100 text-sky-600"
                          }`}>
                            {task.status === 'completed' ? <CheckCircle2 size={24} /> :
                             task.status === 'pending' ? <AlertCircle size={24} /> : <Clock size={24} />}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">{task.company}</h3>
                            <p className="mt-1 text-sm font-medium text-[var(--color-text-subtle)]">{task.category} • ₹{task.priceAmount}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                            task.status === 'completed' ? "bg-[#EFFBFB] text-[#10605F]" :
                            task.status === 'pending' ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                            Deadline {task.deadline}
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
          </div>
        </main>
    </div>
  );
};

export default PerformerAllTasksPage;
