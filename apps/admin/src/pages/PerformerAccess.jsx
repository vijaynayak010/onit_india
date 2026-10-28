import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Eye,
    Loader2,
    Search,
    ShieldAlert,
    ShieldCheck,
    SlidersHorizontal,
    UserCheck,
    X,
    XCircle,
} from 'lucide-react';
import {
    approvePerformerCategoryAccess,
    getPerformerAccessProfile,
    getPerformerScoreHistory,
    listPerformerAccessSummary,
    listPerformerCategoryAccess,
    rejectPerformerCategoryAccess,
    searchPerformerAccess,
    suspendPerformerCategoryAccess,
    waitlistPerformerCategoryAccess,
    savePerformerGrowthCapacity,
} from '../services/api';

const PAGE_SIZE = 25;

const STATUSES = [
    { value: '', label: 'All' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'PENDING_REVIEW', label: 'Pending' },
    { value: 'WAITLISTED', label: 'Waitlist' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'SUSPENDED', label: 'Suspended' },
];

const statusClass = (status) => {
    if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (status === 'PENDING_REVIEW') return 'bg-amber-50 text-amber-700 border-amber-100';
    if (status === 'WAITLISTED') return 'bg-blue-50 text-blue-700 border-blue-100';
    if (status === 'SUSPENDED') return 'bg-orange-50 text-orange-700 border-orange-100';
    if (status === 'REJECTED') return 'bg-red-50 text-red-700 border-red-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
};

const display = (value) => value || '—';

const PerformerAccess = () => {
    const [summary, setSummary] = useState([]);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('APPROVED');
    const [search, setSearch] = useState('');
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [scoreHistory, setScoreHistory] = useState([]);
    const [actionBusy, setActionBusy] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [targetCategory, setTargetCategory] = useState('');
    const [seatCap, setSeatCap] = useState('');
    const [savingCap, setSavingCap] = useState(false);

    const selectedSummary = useMemo(
        () => summary.find((item) => item.categoryKey === category || item.category === category),
        [summary, category],
    );

    useEffect(() => {
        setSeatCap(String(selectedSummary?.cap ?? 500));
    }, [selectedSummary?.cap]);

    const loadSummary = useCallback(async () => {
        const data = await listPerformerAccessSummary();
        setSummary(data || []);
        if (!category && data?.length) setCategory(data[0].categoryKey);
    }, [category]);

    const loadRows = useCallback(async () => {
        if (!category) return;
        setLoading(true);
        setError(null);
        try {
            const res = await listPerformerCategoryAccess({
                category,
                status,
                search: search.trim() || undefined,
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            });
            setRows(res.data || []);
            setPagination(res.pagination || null);
        } catch (err) {
            setError(err.message || 'Failed to load performer access list');
            setRows([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, [category, page, search, status]);

    const runSearch = useCallback(async () => {
        if (search.trim().length < 2) {
            loadRows();
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await searchPerformerAccess({
                q: search.trim(),
                category: category || undefined,
                status: status || undefined,
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            });
            setRows((res.data || []).map((tasker) => ({ tasker, categoryAccesses: tasker.categoryAccesses })));
            setPagination(res.pagination || null);
        } catch (err) {
            setError(err.message || 'Failed to search performers');
            setRows([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, [category, loadRows, page, search, status]);

    useEffect(() => {
        loadSummary().catch((err) => setError(err.message || 'Failed to load categories'));
    }, [loadSummary]);

    useEffect(() => {
        const timer = setTimeout(runSearch, 300);
        return () => clearTimeout(timer);
    }, [runSearch]);

    useEffect(() => {
        setPage(0);
    }, [category, status, search]);

    const openProfile = async (taskerId) => {
        setProfileLoading(true);
        setProfile(null);
        setScoreHistory([]);
        setAdminNotes('');
        try {
            const [res, history] = await Promise.all([
                getPerformerAccessProfile(taskerId),
                getPerformerScoreHistory(taskerId, { weeks: 12 }),
            ]);
            setProfile(res);
            setScoreHistory(history?.data || []);
            setTargetCategory(selectedSummary?.category || res?.suggestedCategories?.[0]?.category || '');
        } catch (err) {
            setError(err.message || 'Failed to load performer profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const refreshAfterAction = async (updated) => {
        await Promise.all([loadSummary(), runSearch()]);
        if (updated?.tasker?.id || profile?.id) {
            await openProfile(updated?.tasker?.id || profile.id);
        }
    };

    const performAction = async (type) => {
        if (!profile || !targetCategory) return;
        setActionBusy(true);
        try {
            const payload = { adminNotes };
            let updated;
            if (type === 'approve') updated = await approvePerformerCategoryAccess(profile.id, targetCategory, payload);
            if (type === 'reject') updated = await rejectPerformerCategoryAccess(profile.id, targetCategory, payload);
            if (type === 'waitlist') updated = await waitlistPerformerCategoryAccess(profile.id, targetCategory, payload);
            if (type === 'suspend') updated = await suspendPerformerCategoryAccess(profile.id, targetCategory, payload);
            setAdminNotes('');
            await refreshAfterAction(updated);
        } catch (err) {
            setError(err.message || 'Action failed');
        } finally {
            setActionBusy(false);
        }
    };

    const saveCapacity = async (event) => {
        event.preventDefault();
        if (!selectedSummary) return;
        setSavingCap(true);
        setError(null);
        try {
            await savePerformerGrowthCapacity({
                category: selectedSummary.category,
                activeSlotCap: Number(seatCap),
                isActive: true,
            });
            await loadSummary();
        } catch (err) {
            setError(err.message || 'Unable to update category capacity');
        } finally {
            setSavingCap(false);
        }
    };

    const getRowTasker = (row) => row.tasker || row;
    const getRowAccess = (row) => row.id ? row : (row.categoryAccesses || []).find((access) => access.categoryKey === category);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performer Category Access</h1>
                <p className="text-slate-500 font-medium">
                    Control who can see and apply to tasks, with a separate seat limit for each category.
                </p>
            </div>

            {error && (
                <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700 font-bold">
                    <span className="flex items-center gap-3"><AlertCircle size={18} /> {error}</span>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700"><X size={18} /></button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Category</p>
                    <p className="mt-2 text-lg font-black text-slate-900 truncate">{display(selectedSummary?.category)}</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Approved Visible</p>
                    <p className="mt-2 text-3xl font-black text-emerald-600">{selectedSummary?.approvedVisible ?? 0}<span className="text-sm text-slate-400"> / {selectedSummary?.cap ?? 500}</span></p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pending Review</p>
                    <p className="mt-2 text-3xl font-black text-amber-500">{selectedSummary?.pendingReview ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Open Slots</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{selectedSummary?.remainingSlots ?? 0}</p>
                </div>
            </div>

            {selectedSummary && (
                <form onSubmit={saveCapacity} className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Visible seats in {selectedSummary.category}</span>
                        <input type="number" min="1" max="10000" required value={seatCap} onChange={(event) => setSeatCap(event.target.value)} className="h-11 w-40 rounded-xl border border-slate-200 px-3 font-semibold" />
                    </label>
                    <button type="submit" disabled={savingCap || Number(seatCap) < 1} className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white disabled:opacity-50">
                        {savingCap ? 'Saving…' : 'Save seat limit'}
                    </button>
                    <p className="text-xs text-slate-500">A lower limit stops new approvals; existing approved performers keep access.</p>
                </form>
            )}

            <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_220px_1fr] gap-3">
                    <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Category</span>
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                        >
                            {summary.map((item) => (
                                <option key={item.categoryKey} value={item.categoryKey}>{item.category}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Status</span>
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                        >
                            {STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Search Performer</span>
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by name, email, phone, skill, or profession"
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                            />
                            {loading && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin" />}
                        </div>
                    </label>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="font-black text-slate-900 flex items-center gap-2">
                            <SlidersHorizontal size={18} className="text-emerald-600" /> Category Performer List
                        </h2>
                        <p className="text-xs font-bold text-slate-400">{pagination?.total ?? 0} records</p>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading && rows.length === 0 ? (
                        <div className="p-8 flex items-center justify-center gap-3 text-slate-500 font-bold">
                            <Loader2 className="animate-spin" size={18} /> Loading performers...
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-bold">No performers found for this filter.</div>
                    ) : rows.map((row) => {
                        const tasker = getRowTasker(row);
                        const access = getRowAccess(row);
                        return (
                            <button
                                key={access?.id || tasker.id}
                                onClick={() => openProfile(tasker.id)}
                                className="w-full px-5 py-4 text-left hover:bg-slate-50 transition-colors grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_180px_1fr_auto] gap-4 items-center"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center overflow-hidden">
                                        {tasker.user?.profilePicUrl ? <img src={tasker.user.profilePicUrl} alt="" className="h-full w-full object-cover" /> : <UserCheck size={18} />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-900 truncate">{display(tasker.displayName || tasker.user?.email)}</p>
                                        <p className="text-xs font-bold text-slate-400 truncate">{display(tasker.user?.email)} · {display(tasker.phoneNumber || tasker.user?.phoneNumber)}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Profile</p>
                                    <p className="text-sm font-bold text-slate-700">{display(tasker.profession || tasker.domain)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="rounded-xl bg-emerald-50 px-3 py-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Trust</p>
                                        <p className="text-sm font-black text-emerald-800">{tasker.trustScore ?? 0}/100</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</p>
                                        <p className="text-sm font-black text-slate-900">{tasker.performerRating ?? 1000}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex border rounded-full px-3 py-1 text-xs font-black ${statusClass(access?.status)}`}>
                                        {access?.status || 'NO ACCESS'}
                                    </span>
                                    {access?.visibilityEnabled && <span className="inline-flex border border-emerald-100 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-black">Visible</span>}
                                </div>
                                <span className="inline-flex items-center gap-2 text-sm font-black text-emerald-600">
                                    <Eye size={16} /> Review
                                </span>
                            </button>
                        );
                    })}
                </div>

                {pagination?.total > PAGE_SIZE && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                        <button
                            onClick={() => setPage((value) => Math.max(0, value - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-black disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-black text-slate-400">Page {page + 1}</span>
                        <button
                            onClick={() => setPage((value) => value + 1)}
                            disabled={!pagination?.hasMore}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-black disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {(profile || profileLoading) && (
                <div className="fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-sm flex justify-end">
                    <div className="h-full w-full max-w-3xl bg-white shadow-2xl overflow-y-auto">
                        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Performer Review</h2>
                                <p className="text-sm font-bold text-slate-400">Portfolio, work history, and category visibility</p>
                            </div>
                            <button onClick={() => setProfile(null)} className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900">
                                <X size={18} />
                            </button>
                        </div>

                        {profileLoading ? (
                            <div className="p-8 flex items-center gap-3 text-slate-500 font-bold">
                                <Loader2 className="animate-spin" size={18} /> Loading profile...
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="h-16 w-16 rounded-2xl bg-white text-emerald-700 flex items-center justify-center overflow-hidden border border-slate-100">
                                            {profile.user?.profilePicUrl ? <img src={profile.user.profilePicUrl} alt="" className="h-full w-full object-cover" /> : <UserCheck size={24} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-black text-slate-900">{display(profile.displayName || profile.user?.email)}</h3>
                                            <p className="text-sm font-bold text-slate-500">{display(profile.user?.email)} · {display(profile.phoneNumber || profile.user?.phoneNumber)}</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-white border border-slate-100 px-3 py-1 text-xs font-black text-slate-600">KYC: {display(profile.kycStatus)}</span>
                                                <span className="rounded-full bg-white border border-slate-100 px-3 py-1 text-xs font-black text-slate-600">{profile.counts?.completedAssignments ?? 0} completed</span>
                                                <span className="rounded-full bg-white border border-slate-100 px-3 py-1 text-xs font-black text-slate-600">{profile.counts?.portfolio ?? 0} portfolio items</span>
                                                <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-black text-emerald-700">Trust {profile.trustScore ?? 0}/100</span>
                                                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white">Rating {profile.performerRating ?? 1000}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-slate-100 p-5">
                                    <h3 className="font-black text-slate-900 mb-3">Score Movement</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="rounded-2xl bg-emerald-50 p-4">
                                            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Current Trust Score</p>
                                            <p className="mt-1 text-3xl font-black text-emerald-800">{profile.trustScore ?? 0}<span className="text-sm"> / 100</span></p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Current Performer Rating</p>
                                            <p className="mt-1 text-3xl font-black text-slate-900">{profile.performerRating ?? 1000}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                                        <div className="grid grid-cols-[1fr_100px_100px_80px] bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Week</span>
                                            <span>Trust</span>
                                            <span>Rating</span>
                                            <span>Rank</span>
                                        </div>
                                        {scoreHistory.length === 0 ? (
                                            <div className="px-4 py-5 text-sm font-bold text-slate-400">No score history yet. Run scoring backfill after deploying the backend migration.</div>
                                        ) : scoreHistory.map((item) => (
                                            <div key={item.weekStart} className="grid grid-cols-[1fr_100px_100px_80px] px-4 py-3 text-sm font-bold text-slate-700 border-t border-slate-100">
                                                <span>{new Date(item.weekStart).toLocaleDateString()}</span>
                                                <span>{item.trustScore ?? 0}</span>
                                                <span>{item.performerRating ?? 1000}</span>
                                                <span>{item.rankOverall ? `#${item.rankOverall}` : '—'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-slate-100 p-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={18} className="text-emerald-600" />
                                        <h3 className="font-black text-slate-900">Category Decision</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3">
                                        <label className="flex flex-col gap-1">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Target Category</span>
                                            <select
                                                value={targetCategory}
                                                onChange={(event) => setTargetCategory(event.target.value)}
                                                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                                            >
                                                <option value="" disabled>Select a category</option>
                                                {summary.map((item) => <option key={item.categoryKey} value={item.category} />)}
                                            </select>
                                        </label>
                                        <label className="flex flex-col gap-1">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Admin Notes</span>
                                            <input
                                                value={adminNotes}
                                                onChange={(event) => setAdminNotes(event.target.value)}
                                                placeholder="Why this decision was made"
                                                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                                            />
                                        </label>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button disabled={actionBusy || !targetCategory} onClick={() => performAction('approve')} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white disabled:opacity-50">
                                            <CheckCircle2 size={16} /> Approve Visibility
                                        </button>
                                        <button disabled={actionBusy || !targetCategory} onClick={() => performAction('waitlist')} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700 disabled:opacity-50">
                                            <Clock3 size={16} /> Waitlist
                                        </button>
                                        <button disabled={actionBusy || !targetCategory} onClick={() => performAction('reject')} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-black text-red-700 disabled:opacity-50">
                                            <XCircle size={16} /> Reject
                                        </button>
                                        <button disabled={actionBusy || !targetCategory} onClick={() => performAction('suspend')} className="inline-flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-black text-orange-700 disabled:opacity-50">
                                            <ShieldAlert size={16} /> Suspend
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-slate-100 p-5">
                                    <h3 className="font-black text-slate-900 mb-3">Current Category Access</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(profile.categoryAccesses || []).length === 0 ? (
                                            <span className="text-sm font-bold text-slate-400">No category access decisions yet.</span>
                                        ) : profile.categoryAccesses.map((access) => (
                                            <span key={access.id} className={`inline-flex border rounded-full px-3 py-1 text-xs font-black ${statusClass(access.status)}`}>
                                                {access.category}: {access.status}{access.visibilityEnabled ? ' · visible' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-slate-100 p-5">
                                    <h3 className="font-black text-slate-900 mb-3">Portfolio & Certificates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(profile.portfolio || []).length === 0 ? (
                                            <span className="text-sm font-bold text-slate-400">No portfolio evidence uploaded.</span>
                                        ) : profile.portfolio.map((item) => (
                                            <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                                <p className="font-black text-slate-900">{item.title}</p>
                                                <p className="mt-1 text-sm font-medium text-slate-500 line-clamp-3">{item.description || item.projectType || 'No description'}</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="text-xs font-black text-emerald-600">Project Link</a>}
                                                    {item.imageUrl && <a href={item.imageUrl} target="_blank" rel="noreferrer" className="text-xs font-black text-emerald-600">Image</a>}
                                                    {item.certificatePhoto && <a href={item.certificatePhoto} target="_blank" rel="noreferrer" className="text-xs font-black text-emerald-600">Certificate</a>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-slate-100 p-5">
                                    <h3 className="font-black text-slate-900 mb-3">Recent Work Signals</h3>
                                    <div className="space-y-2">
                                        {(profile.taskAssignments || []).slice(0, 6).map((assignment) => (
                                            <div key={assignment.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                                                <div>
                                                    <p className="font-black text-slate-800">{display(assignment.task?.title)}</p>
                                                    <p className="text-xs font-bold text-slate-400">{display(assignment.task?.category)}</p>
                                                </div>
                                                <span className="text-xs font-black text-slate-500">{assignment.status}</span>
                                            </div>
                                        ))}
                                        {(profile.taskAssignments || []).length === 0 && <p className="text-sm font-bold text-slate-400">No assignments yet.</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformerAccess;
