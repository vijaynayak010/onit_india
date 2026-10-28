import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, ArrowUpRight, CheckCircle2, AlertCircle,
    Loader2, RefreshCw, XCircle, MapPin, Tag, ShieldAlert, Wallet, Clock, Zap, ZapOff, FileText
} from 'lucide-react';
import { listTasksAdmin, updateTaskStatusAdmin, getTaskStatisticsAdmin, resolveAssignmentAdmin, repostTaskAdmin, downloadTaskInvoicePdf } from '../services/api';

// ─── helpers ─────────────────────────────────────────────────────────────────

const getStatusColor = (status) => {
    switch (status) {
        case 'ACTIVE':
        case 'PUBLISHED':
        case 'IN_PROGRESS':
        case 'CLAIMED':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'COMPLETED':
            return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'PENDING':
        case 'SUBMITTED':
        case 'DRAFT':
            return 'bg-orange-50 text-orange-600 border-orange-200';
        case 'CANCELED':
        case 'EXPIRED':
            return 'bg-red-50 text-red-600 border-red-200';
        default:
            return 'bg-slate-50 text-slate-600 border-slate-200';
    }
};

const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const getTaskDisplayStatus = (task) => task?.effectiveStatus || task?.status || 'UNKNOWN';

const LIVE_REFRESH_INTERVAL_SECONDS = 5 * 60;
const LIVE_REFRESH_INTERVAL_MS = LIVE_REFRESH_INTERVAL_SECONDS * 1000;

// ─── main component ───────────────────────────────────────────────────────────

const TasksPage = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState(null); // platform-wide stats from backend
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoiceError, setInvoiceError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [nextRefresh, setNextRefresh] = useState(LIVE_REFRESH_INTERVAL_SECONDS);
    const refreshIntervalRef = useRef(null);
    const countdownRef = useRef(null);

    // filters & sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [onlyDisputed, setOnlyDisputed] = useState(false);
    const [sortBy, setSortBy] = useState('LATEST');
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 20;

    // ── fetch ──────────────────────────────────────────────────────────────────
    const fetchTasks = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        setError(null);
        try {
            const params = {
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            };
            if (activeTab !== 'all') params.status = activeTab;
            if (searchTerm.trim()) params.search = searchTerm.trim();

            const [res, statsRes] = await Promise.all([
                listTasksAdmin(params),
                getTaskStatisticsAdmin().catch(() => null),
            ]);

            const fetchedTasks = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

            setTasks(fetchedTasks);
            setTotal(res?.pagination?.total ?? (Array.isArray(res?.data) ? res.data.length : 0));
            if (statsRes) setStats(statsRes);
            setNextRefresh(LIVE_REFRESH_INTERVAL_SECONDS);
        } catch (err) {
            setError(err.message || 'Failed to load tasks');
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, [page, activeTab, searchTerm]);

    useEffect(() => { fetchTasks(); }, [page, activeTab]);

    // Handle Live Mode
    useEffect(() => {
        if (isLive) {
            refreshIntervalRef.current = setInterval(() => {
                fetchTasks(true);
            }, LIVE_REFRESH_INTERVAL_MS);

            countdownRef.current = setInterval(() => {
                setNextRefresh(prev => (prev > 0 ? prev - 1 : LIVE_REFRESH_INTERVAL_SECONDS));
            }, 1000);
        } else {
            if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        }

        return () => {
            if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [isLive, fetchTasks]);

    // debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            if (page !== 0) {
                setPage(0);
            } else {
                fetchTasks();
            }
        }, 450);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    // ── actions ────────────────────────────────────────────────────────────────
    const handleStatusChange = async (task, newStatus) => {
        const reason = window.prompt(`Change task status to ${newStatus}? Provide a reason:`, 'Administrative override');
        if (reason === null) return; // cancelled
        if (!String(reason).trim()) {
            alert('A reason is required to change task status.');
            return;
        }

        setActionLoading(true);
        try {
            await updateTaskStatusAdmin(task.id, { status: newStatus, reason: reason.trim() });
            fetchTasks();
            setSelectedTask(null);
        } catch (err) {
            alert('Action failed: ' + (err.message || 'Unknown error.'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleInvoiceDownload = async (event, taskId) => {
        event.stopPropagation();
        setInvoiceError(null);
        try {
            await downloadTaskInvoicePdf(taskId);
        } catch (err) {
            console.error('Failed to download task invoice:', err);
            setInvoiceError(err.message || 'Unable to download the invoice.');
        }
    };

    // Dispute / issue resolver — moves an assignment to COMPLETED or CANCELED with admin notes.
    const handleResolveAssignment = async (assignmentId, resolution) => {
        if (!assignmentId) {
            alert('No active assignment to resolve for this task.');
            return;
        }
        const notes = window.prompt(`Resolve dispute as ${resolution}. Add admin notes (required, audit-logged):`, '');
        if (notes === null) return;
        if (!String(notes).trim() || notes.trim().length < 10) {
            alert('Please add at least 10 characters of resolution notes for the audit trail.');
            return;
        }
        setResolving(true);
        try {
            await resolveAssignmentAdmin(assignmentId, { status: resolution, notes: notes.trim() });
            fetchTasks();
            setSelectedTask(null);
        } catch (err) {
            alert('Resolution failed: ' + (err.message || 'Unknown error.'));
        } finally {
            setResolving(false);
        }
    };

    const handleRepostTask = async (task) => {
        const reason = window.prompt(
            'Refund provider wallet and repost this task for new performers? Add an admin reason:',
            'Current performer issue. Reposting task for new performers.'
        );
        if (!reason || !reason.trim()) return;

        setActionLoading(true);
        try {
            const response = await repostTaskAdmin(task.id, { reason: reason.trim() });
            const result = response?.data || response;
            const newTaskId = result?.newTask?.id;
            alert(`Task reposted successfully.${newTaskId ? ` New task: ${newTaskId.split('-')[0]}` : ''}`);
            fetchTasks();
            setSelectedTask(null);
        } catch (err) {
            alert('Repost failed: ' + (err.message || 'Unknown error.'));
        } finally {
            setActionLoading(false);
        }
    };

    // ── child components ───────────────────────────────────────────────────────
    const TaskCard = ({ task }) => {
        // Robust assignment extraction
        let mainAssignment = null;
        if (Array.isArray(task.taskAssignments) && task.taskAssignments.length > 0) mainAssignment = task.taskAssignments[0];
        else if (task.taskAssignments && typeof task.taskAssignments === 'object') mainAssignment = task.taskAssignments;
        else if (Array.isArray(task.assignments) && task.assignments.length > 0) mainAssignment = task.assignments[0];
        else if (Array.isArray(task.interests)) {
            mainAssignment = task.interests.find(i => ['ACCEPTED', 'ASSIGNED', 'IN_PROGRESS'].includes(i.status)) || null;
        }

        const taskerEmail = mainAssignment?.tasker?.user?.email || mainAssignment?.tasker?.displayName || mainAssignment?.performer?.email || 'Unassigned';
        const displayStatus = getTaskDisplayStatus(task);
        const hasDispute = Boolean(
            task.hasActiveDispute ||
            task.hasChecklistDispute ||
            task.hasDispute ||
            task.isDisputed ||
            task.effectiveStatus === 'DISPUTED' ||
            (task.disputedChecklistCount && task.disputedChecklistCount > 0) ||
            (Array.isArray(task.disputes) && task.disputes.some(d => d.status !== 'RESOLVED')) ||
            (Array.isArray(task.disputedChecklistItems) && task.disputedChecklistItems.length > 0)
        );

        return (
            <div
                onClick={() => navigate('/tasks/' + task.id)}
                className={`bg-white border rounded-[24px] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group active:scale-[0.98] flex flex-col justify-between h-full relative ${
                    hasDispute ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/10' : 'border-slate-100'
                }`}
            >
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest truncate max-w-[100px]" title={task.id}>
                                #{task.id.split('-')[0]}
                            </span>
                            {hasDispute && (
                                <span className="flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider animate-pulse ring-2 ring-rose-200 shadow-sm">
                                    <ShieldAlert size={10} /> DISPUTED
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5">
                            {displayStatus === 'IN_PROGRESS' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            <span className="text-emerald-600 font-extrabold text-lg">
                                ₹{task.priceAmount || 0}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-[17px] font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2 min-h-[48px]" title={task.title}>
                        {task.title}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {task.category && (
                            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                <Tag size={10} /> {task.category}
                            </span>
                        )}
                        {task.locationCity && (
                            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 truncate max-w-[120px]">
                                <MapPin size={10} /> {task.locationCity}
                            </span>
                        )}
                    </div>

                    <div className="space-y-3 mb-8 border-l-2 border-slate-100 pl-4 py-1">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Provider</span>
                            <span className="text-xs font-bold text-slate-700 truncate" title={task.provider?.email}>
                                {task.provider?.email || 'Unknown'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Assigned To</span>
                            <span className={`text-xs font-bold truncate ${taskerEmail === 'Unassigned' ? 'text-slate-400 italic' : 'text-emerald-600 font-black'}`}>
                                {taskerEmail}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(displayStatus)}`}>
                        {displayStatus?.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(event) => handleInvoiceDownload(event, task.id)}
                            className="flex items-center gap-1 text-slate-700 hover:text-emerald-600 font-extrabold text-[11px] bg-slate-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-all border border-slate-200"
                            title="Download PDF invoice"
                        >
                            <FileText size={12} className="text-emerald-600" />
                            <span>Invoice</span>
                        </button>
                        <button className="flex items-center gap-1 text-emerald-600 font-black text-xs group-hover:gap-1.5 transition-all">
                            <span>Details</span>
                            <ArrowUpRight size={14} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {invoiceError ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
                    <span>{invoiceError}</span>
                    <button type="button" onClick={() => setInvoiceError(null)} className="font-bold underline">Dismiss</button>
                </div>
            ) : null}
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Task Monitoring</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-slate-500 font-medium text-lg">
                            {loading ? 'Refreshing repository...' : `${total.toLocaleString()} registered tasks found.`}
                        </p>
                        {isLive && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm animate-pulse">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                Sync in {nextRefresh}s
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-sm ${isLive
                                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300'
                            }`}
                    >
                        {isLive ? <Zap size={14} fill="currentColor" /> : <ZapOff size={14} />}
                        {isLive ? 'Live Syncing' : 'Go Live'}
                    </button>

                    <div className="relative w-full sm:w-64 xl:w-80 border border-slate-200 rounded-full bg-white shadow-sm hover:shadow transition-all group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-bold focus:outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        onClick={() => fetchTasks()}
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-full font-bold text-sm shadow-lg transition-all"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Quick Stats — platform-wide from backend stats endpoint, falls back to page slice. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {(() => {
                    const tasksWithAssignment = (t) => {
                        const a = t.taskAssignments;
                        return Array.isArray(a) ? a.length > 0 : !!a;
                    };
                    const inAssignedStatus = (t) => ['CLAIMED', 'IN_PROGRESS', 'ACCEPTED', 'SUBMITTED'].includes(String(t.status).toUpperCase());

                    return [
                        { label: 'Platform Tasks', value: (stats?.total ?? total).toLocaleString(), sub: 'Total registered tasks' },
                        { label: 'Assigned', value: (stats?.assigned ?? tasks.filter(t => tasksWithAssignment(t) || inAssignedStatus(t)).length).toLocaleString(), sub: 'Tasks with active taskers' },
                        { label: 'Submitted', value: (stats?.submitted ?? tasks.filter(t => String(t.status).toUpperCase() === 'SUBMITTED').length).toLocaleString(), sub: 'Pending admin / provider approval' },
                        { label: 'Completed', value: (stats?.completed ?? tasks.filter(t => String(t.status).toUpperCase() === 'COMPLETED').length).toLocaleString(), sub: 'Successfully closed' },
                        { label: 'Canceled', value: (stats?.canceled ?? tasks.filter(t => String(t.status).toUpperCase() === 'CANCELED').length).toLocaleString(), sub: 'Failed or revoked' },
                    ];
                })().map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:border-slate-200 transition-colors group">
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block group-hover:text-slate-500">{stat.label}</span>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-2">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Sorting & Advanced Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
                    {['all', 'DRAFT', 'PENDING_APPROVAL', 'REJECTED', 'PUBLISHED', 'CLAIMED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'CANCELED', 'EXPIRED'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setPage(0); }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === tab
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {tab === 'all' ? 'All Tasks' : tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                        onClick={() => setOnlyDisputed(!onlyDisputed)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                            onlyDisputed
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-300'
                                : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                    >
                        <ShieldAlert size={14} />
                        {onlyDisputed ? '⚠️ Showing Disputed Only' : 'Filter Disputed'}
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                        <option value="LATEST">Sort: Latest First</option>
                        <option value="PRICE_HIGH_LOW">Sort: Price (High → Low)</option>
                        <option value="PRICE_LOW_HIGH">Sort: Price (Low → High)</option>
                    </select>
                </div>
            </div>

            {/* Grid View */}
            {(() => {
                const displayTasks = tasks.filter(t => {
                    if (onlyDisputed) {
                        const hasDispute = Boolean(
                            t.hasActiveDispute ||
                            t.hasChecklistDispute ||
                            t.hasDispute ||
                            t.isDisputed ||
                            t.effectiveStatus === 'DISPUTED' ||
                            (t.disputedChecklistCount && t.disputedChecklistCount > 0) ||
                            (Array.isArray(t.disputes) && t.disputes.some(d => d.status !== 'RESOLVED')) ||
                            (Array.isArray(t.disputedChecklistItems) && t.disputedChecklistItems.length > 0)
                        );
                        if (!hasDispute) return false;
                    }
                    return true;
                }).sort((a, b) => {
                    if (sortBy === 'PRICE_HIGH_LOW') return (Number(b.priceAmount) || 0) - (Number(a.priceAmount) || 0);
                    if (sortBy === 'PRICE_LOW_HIGH') return (Number(a.priceAmount) || 0) - (Number(b.priceAmount) || 0);
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                });

                if (loading && !tasks.length) {
                    return (
                        <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-4">
                            <Loader2 size={36} className="animate-spin text-emerald-500" />
                            <p className="font-bold tracking-widest text-[10px] uppercase">Connecting to Database...</p>
                        </div>
                    );
                }

                if (displayTasks.length === 0) {
                    return (
                        <div className="py-24 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Search size={32} className="text-slate-300" />
                            </div>
                            <p className="text-slate-800 font-black text-xl mb-1">Grid is empty</p>
                            <p className="text-slate-500 font-medium text-sm">No tasks matching the selected status or filter.</p>
                        </div>
                    );
                }

                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                );
            })()}

            {/* Pagination */}
            {total > PAGE_SIZE && !loading && (
                <div className="flex items-center justify-between px-2 pt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Page <span className="text-slate-900">{page + 1}</span> of <span className="text-slate-900">{Math.ceil(total / PAGE_SIZE)}</span>
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="bg-white border border-slate-200 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-700 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Back
                        </button>
                        <button
                            disabled={(page + 1) * PAGE_SIZE >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="bg-white border border-slate-200 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-700 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Task Detail Drawer */}
            {selectedTask && (() => {
                const t = selectedTask;
                const displayStatus = getTaskDisplayStatus(t);
                const statusColor = getStatusColor(displayStatus);
                const mainAssignment = Array.isArray(t.taskAssignments) ? t.taskAssignments[0] : t.taskAssignments;
                const assignedTasker = mainAssignment?.tasker?.user?.email || mainAssignment?.tasker?.displayName || 'Unassigned';
                const providerEmail = t.provider?.email || 'Unknown Provider';

                return (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => setSelectedTask(null)}
                        />
                        <div className="relative w-full max-w-lg bg-white h-screen shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">
                            {/* Drawer Header */}
                            <div className="p-7 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Task ID</span>
                                    <span className="text-slate-900 text-sm font-black" title={t.id}>{t.id.split('-')[0].toUpperCase()}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedTask(null)}
                                    className="h-10 w-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full text-slate-900 transition-all border border-slate-200 active:scale-90"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Drawer Content */}
                            <div className="p-7 space-y-8 flex-1">
                                <div>
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-6 ${statusColor}`}>
                                        {displayStatus?.replace('_', ' ')}
                                    </span>
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">
                                        {t.title}
                                    </h2>
                                    <div className="text-slate-500 font-medium text-[13px] leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-[24px] border border-slate-100 shadow-inner">
                                        {t.description || <span className="italic opacity-50">Detailed documentation not available.</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[28px] text-center shadow-sm">
                                        <Wallet className="mx-auto mb-2 text-emerald-500" size={20} strokeWidth={2.5} />
                                        <p className="text-[9px] font-black text-emerald-600/70 uppercase tracking-widest mb-1">Contract Value</p>
                                        <p className="text-2xl font-black text-emerald-600">
                                            ₹{t.priceAmount || 0}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[28px] text-center shadow-sm">
                                        <Clock className="mx-auto mb-2 text-slate-400" size={20} strokeWidth={2.5} />
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered On</p>
                                        <p className="text-[13px] font-black text-slate-800 pt-1">
                                            {formatDate(t.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest">
                                        <Tag size={12} strokeWidth={3} /> {t.category || 'Standard'}
                                    </div>
                                    {t.locationCity && (
                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest">
                                            <MapPin size={12} strokeWidth={3} /> {t.locationCity}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Assignment Matrix</h4>

                                    <div className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-black shadow-lg">
                                                {providerEmail[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Provider</p>
                                                <p className="text-sm font-black text-slate-900 line-clamp-1">{providerEmail}</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                            <RefreshCw size={14} />
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-between p-5 rounded-[24px] bg-white border shadow-sm transition-all ${assignedTasker === 'Unassigned' ? 'border-dashed border-slate-200 opacity-60' : 'border-emerald-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-black shadow-lg ${assignedTasker === 'Unassigned' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {assignedTasker[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className={`text-[9px] font-black uppercase tracking-widest ${assignedTasker === 'Unassigned' ? 'text-slate-400' : 'text-emerald-500'}`}>Assigned Tasker</p>
                                                <p className={`text-sm font-black line-clamp-1 ${assignedTasker === 'Unassigned' ? 'text-slate-400 italic' : 'text-slate-900'}`}>{assignedTasker}</p>
                                            </div>
                                        </div>
                                        {assignedTasker !== 'Unassigned' && (
                                            <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_0_4px_#ecfdf5]" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Admin Overrides */}
                            <div className="p-8 bg-slate-900 border-t border-slate-800 mt-auto shrink-0 space-y-5 rounded-t-[40px]">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">
                                    <ShieldAlert size={16} strokeWidth={2.5} /> Administrative Directives
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleStatusChange(t, 'CANCELED')}
                                        disabled={actionLoading || displayStatus === 'CANCELED'}
                                        className="py-4 px-6 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-slate-800 text-red-500 border border-red-900/40 hover:bg-red-950/20 disabled:opacity-20 shadow-lg"
                                    >
                                        {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} strokeWidth={3} />}
                                        Abort Task
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(t, 'COMPLETED')}
                                        disabled={actionLoading || displayStatus === 'COMPLETED'}
                                        className="py-4 px-6 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-500 disabled:opacity-20 shadow-lg"
                                    >
                                        {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} strokeWidth={3} />}
                                        Force Settle
                                    </button>
                                    <button
                                        onClick={() => handleRepostTask(t)}
                                        disabled={actionLoading || displayStatus === 'COMPLETED'}
                                        className="col-span-2 py-4 px-6 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-emerald-900/70 text-emerald-200 border border-emerald-500/60 hover:bg-emerald-800 disabled:opacity-20 shadow-lg"
                                    >
                                        {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} strokeWidth={3} />}
                                        Refund + Repost
                                    </button>
                                </div>

                                {/* Dispute / Issue Resolver — only if there's an active assignment */}
                                {t.taskAssignments && (Array.isArray(t.taskAssignments) ? t.taskAssignments.length > 0 : true) && (
                                    <div className="pt-4 border-t border-slate-800/80 space-y-3">
                                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Issue Resolver</p>
                                        <p className="text-[11px] font-medium text-slate-400">
                                            Force-close the active assignment with an audit-logged note (required).
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => {
                                                    const a = Array.isArray(t.taskAssignments) ? t.taskAssignments[0] : t.taskAssignments;
                                                    handleResolveAssignment(a?.id, 'COMPLETED');
                                                }}
                                                disabled={resolving}
                                                className="py-3 px-4 rounded-[16px] font-black text-[10px] uppercase tracking-widest transition-all bg-emerald-700 text-white hover:bg-emerald-600 border border-emerald-500/60 disabled:opacity-30 flex items-center justify-center gap-2"
                                            >
                                                {resolving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                Resolve in favor of tasker
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const a = Array.isArray(t.taskAssignments) ? t.taskAssignments[0] : t.taskAssignments;
                                                    handleResolveAssignment(a?.id, 'CANCELED');
                                                }}
                                                disabled={resolving}
                                                className="py-3 px-4 rounded-[16px] font-black text-[10px] uppercase tracking-widest transition-all bg-rose-700 text-white hover:bg-rose-600 border border-rose-500/60 disabled:opacity-30 flex items-center justify-center gap-2"
                                            >
                                                {resolving ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                                                Resolve in favor of provider
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default TasksPage;
