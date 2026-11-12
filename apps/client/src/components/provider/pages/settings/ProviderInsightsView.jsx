import React, { useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Users,
  Star,
  Repeat,
  IndianRupee,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useProviderData } from "../../contexts/ProviderDataContext";

const MONTHLY_SPEND = [
  { month: "Jan", value: 12 },
  { month: "Feb", value: 19 },
  { month: "Mar", value: 10 },
  { month: "Apr", value: 24 },
  { month: "May", value: 32 },
  { month: "Jun", value: 16 },
];

const CATEGORIES = [
  { name: "Design & Creative", tasks: 14, pct: 38, color: "bg-violet-500" },
  { name: "Web Development", tasks: 10, pct: 27, color: "bg-blue-500" },
  { name: "Content & Writing", tasks: 7, pct: 19, color: "bg-[#10605F]" },
  { name: "Marketing & SEO", tasks: 4, pct: 11, color: "bg-orange-500" },
  { name: "Video & Animation", tasks: 2, pct: 5, color: "bg-pink-500" },
];

const TOP_PERFORMERS = [
  { name: "Rohan Desai", role: "UI/UX Designer", spent: "₹42,000", rating: 4.9, tasks: 7, color: "bg-blue-500" },
  { name: "Meera Singh", role: "Web Developer", spent: "₹31,500", rating: 4.8, tasks: 5, color: "bg-pink-500" },
  { name: "Arjun Kapoor", role: "Content Writer", spent: "₹18,200", rating: 4.7, tasks: 4, color: "bg-amber-600" },
];

const RECENT_TASKS = [
  { title: "Brand Logo Redesign", status: "Completed", statusClass: "bg-[#EFFBFB] text-[#10605F]", time: "3d turnaround", price: "₹8,500", rating: 5 },
  { title: "Landing Page Build", status: "Completed", statusClass: "bg-[#EFFBFB] text-[#10605F]", time: "7d turnaround", price: "₹14,000", rating: 5 },
  { title: "SEO Audit Report", status: "Completed", statusClass: "bg-[#EFFBFB] text-[#10605F]", time: "5d turnaround", price: "₹6,200", rating: 4 },
  { title: "Social Media Graphics", status: "Active", statusClass: "bg-blue-50 text-blue-700", time: "2d turnaround", price: "₹4,800", rating: null },
  { title: "Email Campaign Copy", status: "Completed", statusClass: "bg-[#EFFBFB] text-[#10605F]", time: "4d turnaround", price: "₹3,900", rating: 4 },
];

const JOB_TASKS = [
  { title: "Senior React Developer", price: "₹42K", status: "Hired", statusClass: "bg-[#EFFBFB] text-[#10605F]" },
  { title: "UI/UX Designer", price: "₹68K", status: "Active", statusClass: "bg-orange-50 text-orange-700" },
  { title: "Node.js Backend Eng.", price: "₹21K", status: "Closed", statusClass: "bg-red-50 text-red-700" },
  { title: "Product Manager", price: "₹35K", status: "Draft", statusClass: "bg-gray-100 text-gray-600" },
];

const APPLICATIONS_TREND = [32, 45, 38, 52, 48, 61, 68];

const StatCard = ({ icon: Icon, label, value, sub, iconBg, iconColor }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
      <Icon size={18} className={iconColor} strokeWidth={2.25} />
    </div>
    {sub ? <p className="text-[11px] font-semibold text-gray-400">{sub}</p> : null}
    <p className="mt-0.5 text-xl font-extrabold text-gray-900">{value}</p>
    <p className="text-xs font-semibold text-gray-500">{label}</p>
  </div>
);

const ProviderInsightsView = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const { stats, loading } = useProviderData();

  const draftCount = stats?.find((s) => s.label === "Drafts")?.value || "2";
  const activeCount = stats?.find((s) => s.label === "Active")?.value || "7";
  const completedCount = stats?.find((s) => s.label === "Completed")?.value || "3";

  const maxSpend = useMemo(() => Math.max(...MONTHLY_SPEND.map((m) => m.value)), []);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex gap-6 border-b border-gray-200">
        {[
          { id: "tasks", label: "Tasks Posted" },
          { id: "jobs", label: "Job Details" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-3 text-sm font-bold transition ${
              activeTab === tab.id ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id ? (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--color-primary)]" />
            ) : null}
          </button>
        ))}
      </div>

      {activeTab === "tasks" ? (
        <>
          <section>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-400">Overview</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Briefcase} sub="Since Jan 2026" value={loading ? "…" : "37"} label="Tasks Posted" iconBg="bg-[#EFFBFB]" iconColor="text-[#10605F]" />
              <StatCard icon={CheckCircle2} sub="34 of 37 closed" value="92%" label="Completion Rate" iconBg="bg-sky-50" iconColor="text-sky-600" />
              <StatCard icon={Clock} sub="total applicants" value="284" label="Avg Turnaround" iconBg="bg-violet-50" iconColor="text-violet-600" />
              <StatCard icon={Users} sub="Unique so far" value="95.8%" label="Performers Hired" iconBg="bg-amber-50" iconColor="text-amber-600" />
            </div>
          </section>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Spent · 2026</p>
                <p className="mt-1 text-3xl font-extrabold text-gray-900">₹1,12,700</p>
                <p className="mt-1 text-xs font-medium text-gray-400">Across 37 tasks this year</p>
              </div>
              <span className="rounded-full bg-[#EFFBFB] px-3 py-1 text-xs font-bold text-[#10605F]">+22%</span>
            </div>
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Monthly Spend</h3>
              <span className="rounded-full bg-[#EFFBFB] px-2.5 py-1 text-[10px] font-bold text-[#10605F]">+22% ↑</span>
            </div>
            <p className="mb-4 text-xs font-medium text-gray-400">Jan – Jun 2026</p>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-40 items-end justify-between gap-2">
                {MONTHLY_SPEND.map((m) => (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500">{m.value}k</span>
                    <div
                      className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                        m.value === maxSpend ? "bg-[var(--color-primary)]" : "bg-emerald-200"
                      }`}
                      style={{ height: `${(m.value / maxSpend) * 100}%`, minHeight: "20%" }}
                    />
                    <span className="text-[10px] font-semibold text-gray-400">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-400">Tasks by Category</h3>
            <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              {CATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-800">{cat.name}</span>
                    <span className="text-xs font-medium text-gray-400">
                      {cat.tasks} tasks · {cat.pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-400">Top Performers Hired</h3>
            <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-white shadow-sm">
              {TOP_PERFORMERS.map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${p.color}`}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900">{p.name}</p>
                      <p className="text-xs font-medium text-gray-500">{p.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-gray-900">{p.spent}</p>
                    <div className="mt-0.5 flex items-center justify-end gap-1 text-xs font-semibold text-gray-500">
                      <Star size={12} className="fill-amber-400 text-amber-400" strokeWidth={0} />
                      {p.rating} · {p.tasks} tasks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-400">Recent Tasks</h3>
            <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-white shadow-sm">
              {RECENT_TASKS.map((task) => (
                <div key={task.title} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-extrabold text-gray-900">{task.title}</p>
                    <p className="text-xs font-medium text-gray-400">{task.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${task.statusClass}`}>
                      {task.status}
                    </span>
                    <span className="text-sm font-extrabold text-gray-900">{task.price}</span>
                    {task.rating ? (
                      <div className="flex gap-0.5">
                        {Array.from({ length: task.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" strokeWidth={0} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Repeat size={22} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-gray-900">62% Repeat Hire Rate</p>
              <p className="text-sm font-medium text-gray-600">
                You re-hire the same performers often — a sign of great partnerships.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Briefcase} sub="12 jobs posted" value="₹38.4L" label="Total CTC Offered" iconBg="bg-[#EFFBFB]" iconColor="text-[#10605F]" />
            <StatCard icon={IndianRupee} sub="per role" value="₹3.2L" label="Avg. Salary Offered" iconBg="bg-sky-50" iconColor="text-sky-600" />
            <StatCard icon={Clock} sub="total applicants" value="284" label="Applications Received" iconBg="bg-violet-50" iconColor="text-violet-600" />
            <StatCard icon={BarChart3} sub="+5.3% this month" value="95.8%" label="Interview Rate" iconBg="bg-amber-50" iconColor="text-amber-600" />
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">Applications</h3>
                <p className="text-xs font-medium text-gray-400">Received per month · last 7 months</p>
              </div>
              <span className="text-sm font-bold text-gray-700">68 this mo.</span>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <svg viewBox="0 0 400 120" className="h-32 w-full" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={APPLICATIONS_TREND.map((v, i) => {
                    const x = (i / (APPLICATIONS_TREND.length - 1)) * 380 + 10;
                    const y = 110 - (v / 70) * 90;
                    return `${x},${y}`;
                  }).join(" ")}
                />
              </svg>
              <div className="mt-2 flex justify-between text-[10px] font-semibold text-gray-400">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-[#10605F]">{activeCount}</p>
              <p className="text-xs font-semibold text-gray-500">Active</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-red-500">{completedCount}</p>
              <p className="text-xs font-semibold text-gray-500">Closed</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-orange-500">{draftCount}</p>
              <p className="text-xs font-semibold text-gray-500">Draft</p>
            </div>
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900">Upcoming Interviews</h3>
              <button type="button" className="text-xs font-bold text-[var(--color-primary)]">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: "Alex Kumar", role: "React Developer", date: "Jun 30, 2026", time: "10:00 AM" },
                { name: "Priya Sharma", role: "UI Designer", date: "Jul 2, 2026", time: "2:30 PM" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-extrabold text-gray-900">{item.name}</p>
                    <p className="text-xs font-medium text-gray-500">{item.role}</p>
                  </div>
                  <div className="text-right text-xs font-semibold text-gray-500">
                    <p className="flex items-center justify-end gap-1">
                      <Calendar size={12} />
                      {item.date}
                    </p>
                    <p className="mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900">Recent Tasks</h3>
              <button type="button" className="text-xs font-bold text-[var(--color-primary)]">
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-white shadow-sm">
              {JOB_TASKS.map((task) => (
                <div key={task.title} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-extrabold text-gray-900">{task.title}</p>
                    <p className="text-sm font-bold text-gray-700">{task.price}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${task.statusClass}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Repeat size={22} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-gray-900">62% Repeat Hire Rate</p>
              <p className="text-sm font-medium text-gray-600">
                You re-hire the same performers often — a sign of great partnerships.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProviderInsightsView;
