import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, CheckCircle2, Clock3, Eye, EyeOff, Plus, RefreshCw, Search, Target, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  createDailyQuizAssignmentAdmin,
  getDailyQuizAnalyticsAdmin,
  listDailyQuizAssignmentsAdmin,
  listLearningResourcesAdmin,
  updateDailyQuizAssignmentAdmin,
} from "../../provider/services/api";

const today = new Date().toISOString().slice(0, 10);

function unwrap(response) { return response?.data ?? response; }

function Stat({ label, value, detail, icon: Icon, tone = "emerald" }) {
  return <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === "orange" ? "bg-orange-50 text-orange-600" : tone === "blue" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-700"}`}><Icon size={17} /></span></div><p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function AssignmentRow({ assignment, selected, onSelect, onToggle }) {
  const published = assignment.isPublished;
  return <button type="button" onClick={() => onSelect(assignment)} className={`grid w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition-colors last:border-0 hover:bg-slate-50 sm:grid-cols-[1.4fr_0.9fr_0.8fr_0.7fr_auto] sm:items-center ${selected ? "bg-emerald-50/60" : "bg-white"}`}><div className="min-w-0"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${published ? "bg-emerald-500" : "bg-slate-300"}`} /><p className="truncate text-sm font-bold text-slate-950">{assignment.title}</p></div><p className="mt-1 truncate text-xs text-slate-500">{assignment.category} · {assignment.resource?.title || "Quiz resource"}</p></div><div className="flex items-center gap-2 text-xs font-semibold text-slate-600"><CalendarDays size={14} /> {assignment.quizDate}</div><div className="text-xs text-slate-600"><span className="font-bold text-slate-950">{assignment._count?.attempts ?? 0}</span> attempts</div><div className="text-xs font-semibold text-slate-600"><Clock3 size={13} className="mr-1 inline" /> {assignment.secondsPerQuestion || 30}s / question</div><span role="status" onClick={(event) => { event.stopPropagation(); onToggle(assignment); }} className={`inline-flex min-h-9 items-center justify-center gap-1 rounded-full px-3 text-xs font-bold ${published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{published ? <><Eye size={14} /> Live</> : <><EyeOff size={14} /> Draft</>}</span></button>;
}

export default function AdminDailyQuizPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ quizDate: today, category: "", resourceId: "", secondsPerQuestion: 30, maxAttempts: 2, rewardPoints: 0, isPublished: false });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [assignmentResponse, resourceResponse] = await Promise.all([listDailyQuizAssignmentsAdmin(), listLearningResourcesAdmin()]);
      const nextAssignments = unwrap(assignmentResponse) || [];
      setAssignments(Array.isArray(nextAssignments) ? nextAssignments : []);
      const nextResources = unwrap(resourceResponse) || [];
      setResources(Array.isArray(nextResources) ? nextResources.filter((resource) => resource.type === "QUIZ") : []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load daily quiz assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!selected?.id) { setAnalytics(null); return undefined; }
    let cancelled = false;
    getDailyQuizAnalyticsAdmin(selected.id).then((response) => { if (!cancelled) setAnalytics(unwrap(response)); }).catch(() => { if (!cancelled) setAnalytics(null); });
    return () => { cancelled = true; };
  }, [selected?.id]);

  const visibleAssignments = useMemo(() => assignments.filter((assignment) => `${assignment.title} ${assignment.category}`.toLowerCase().includes(query.toLowerCase())), [assignments, query]);
  const publishedCount = assignments.filter((assignment) => assignment.isPublished).length;
  const totalAttempts = assignments.reduce((sum, assignment) => sum + (assignment._count?.attempts || 0), 0);
  const selectedResource = resources.find((resource) => resource.id === form.resourceId);

  const toggle = async (assignment) => {
    try {
      await updateDailyQuizAssignmentAdmin(assignment.id, { isPublished: !assignment.isPublished });
      await load();
      setSelected((current) => current?.id === assignment.id ? { ...current, isPublished: !assignment.isPublished } : current);
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not update the quiz status."); }
  };

  const create = async (event) => {
    event.preventDefault();
    if (!form.category || !form.resourceId) return;
    setSaving(true);
    try {
      await createDailyQuizAssignmentAdmin({ ...form, secondsPerQuestion: Number(form.secondsPerQuestion), maxAttempts: Number(form.maxAttempts), rewardPoints: Number(form.rewardPoints) });
      setShowCreate(false);
      setForm({ quizDate: today, category: "", resourceId: "", secondsPerQuestion: 30, maxAttempts: 2, rewardPoints: 0, isPublished: false });
      await load();
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not create the assignment."); }
    finally { setSaving(false); }
  };

  return <div className="min-h-screen bg-[#f5f7f7] text-slate-950"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">OnIT operations</p><h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Daily quiz control</h1></div><div className="flex items-center gap-2"><span className="hidden text-xs font-medium text-slate-500 sm:block">{user?.name || user?.email || "Admin"}</span><button type="button" onClick={load} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-[transform,background-color] duration-150 ease-out hover:bg-slate-50 active:scale-[0.98]" aria-label="Refresh"><RefreshCw size={16} /></button><button type="button" onClick={() => setShowCreate(true)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-emerald-700 active:scale-[0.98]"><Plus size={16} /> <span className="hidden sm:inline">Schedule quiz</span></button></div></div></header><main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Assignments" value={assignments.length} detail="Scheduled across categories" icon={CalendarDays} /><Stat label="Live today" value={publishedCount} detail="Published assignments" icon={CheckCircle2} /><Stat label="Attempts" value={totalAttempts} detail="Across all assignments" icon={Target} tone="blue" /><Stat label="Selected pass rate" value={analytics ? `${analytics.passRate}%` : "—"} detail={analytics ? `${analytics.uniquePerformers} performers reached` : "Select an assignment"} icon={BarChart3} tone="orange" /></div>{error ? <div role="alert" className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div> : null}<div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"><section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-bold text-slate-950">Assignments</h2><p className="mt-1 text-xs text-slate-500">Schedule once, publish when the content is ready.</p></div><label className="flex h-10 items-center gap-2 rounded-full border border-slate-200 px-3 text-sm text-slate-500"><Search size={15} /><span className="sr-only">Search assignments</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" className="w-32 bg-transparent outline-none placeholder:text-slate-400 sm:w-44" /></label></div><div className="hidden grid-cols-[1.4fr_0.9fr_0.8fr_0.7fr_auto] gap-3 border-b border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:grid"><span>Assignment</span><span>Date</span><span>Reach</span><span>Timing</span><span>Status</span></div>{loading ? <div className="space-y-3 p-5"><div className="h-14 animate-pulse rounded-2xl bg-slate-100" /><div className="h-14 animate-pulse rounded-2xl bg-slate-100" /><div className="h-14 animate-pulse rounded-2xl bg-slate-100" /></div> : visibleAssignments.length ? visibleAssignments.map((assignment) => <AssignmentRow key={assignment.id} assignment={assignment} selected={selected?.id === assignment.id} onSelect={setSelected} onToggle={toggle} />) : <div className="p-10 text-center"><p className="font-bold text-slate-800">No assignments found</p><p className="mt-1 text-sm text-slate-500">Create a dated quiz to give performers a clear next step.</p></div>}</section><aside className="space-y-5"><div className="rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_12px_34px_rgba(15,23,42,0.13)]"><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300">Analytics</p>{selected ? <><h2 className="mt-2 line-clamp-2 text-xl font-bold">{selected.title}</h2><p className="mt-1 text-xs text-slate-400">{selected.category} · {selected.quizDate}</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-400">Pass rate</p><p className="mt-1 text-2xl font-bold">{analytics ? `${analytics.passRate}%` : "—"}</p></div><div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-400">Average</p><p className="mt-1 text-2xl font-bold">{analytics ? `${analytics.averageScore}%` : "—"}</p></div></div><div className="mt-3 rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-400">Timed out</p><p className="mt-1 text-lg font-bold">{analytics?.timedOutAttempts ?? "—"}</p></div></> : <><h2 className="mt-2 text-xl font-bold">Select an assignment</h2><p className="mt-2 text-sm leading-6 text-slate-300">Review participation and timing performance without leaving this page.</p></>}</div><div className="rounded-[24px] border border-slate-200 bg-white p-5"><h2 className="text-sm font-bold text-slate-950">Publishing checklist</h2><div className="mt-4 space-y-3 text-xs leading-5 text-slate-600"><p><span className="font-bold text-emerald-700">01</span> Choose a category-specific quiz resource.</p><p><span className="font-bold text-emerald-700">02</span> Set 30–300 seconds per question.</p><p><span className="font-bold text-emerald-700">03</span> Publish only after a quick preview.</p></div></div></aside></div></main>{showCreate ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-5"><form onSubmit={create} className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:rounded-[28px]"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700">New assignment</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Schedule a daily quiz</h2></div><button type="button" onClick={() => setShowCreate(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close"><X size={18} /></button></div><div className="mt-6 space-y-4"><label className="block text-sm font-semibold text-slate-700">Quiz date<input type="date" required value={form.quizDate} onChange={(event) => setForm({ ...form, quizDate: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label><label className="block text-sm font-semibold text-slate-700">Category<input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="e.g. Graphic Design" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label><label className="block text-sm font-semibold text-slate-700">Quiz resource<select required value={form.resourceId} onChange={(event) => { const resource = resources.find((item) => item.id === event.target.value); setForm({ ...form, resourceId: event.target.value, category: resource?.category || form.category }); }} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"><option value="">Choose a quiz</option>{resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.title} · {resource.category}</option>)}</select>{selectedResource ? <span className="mt-1 block text-xs font-normal text-slate-500">{selectedResource.questionsJson?.length || 0} questions · pass mark {selectedResource.passingScore}%</span> : null}</label><div className="grid gap-4 sm:grid-cols-3"><label className="block text-sm font-semibold text-slate-700">Seconds / question<input type="number" min="5" max="300" required value={form.secondsPerQuestion} onChange={(event) => setForm({ ...form, secondsPerQuestion: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label><label className="block text-sm font-semibold text-slate-700">Max attempts<input type="number" min="1" max="5" required value={form.maxAttempts} onChange={(event) => setForm({ ...form, maxAttempts: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label><label className="block text-sm font-semibold text-slate-700">Reward points<input type="number" min="0" max="100000" required value={form.rewardPoints} onChange={(event) => setForm({ ...form, rewardPoints: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label></div><label className="flex items-center gap-3 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.isPublished} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} className="h-4 w-4 accent-emerald-600" /> Publish immediately</label></div><button type="submit" disabled={saving} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.98]">{saving ? "Scheduling…" : "Schedule assignment"}</button></form></div> : null}</div>;
}
