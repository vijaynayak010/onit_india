import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowUpRight,
    BriefcaseBusiness,
    CheckCircle2,
    ClipboardList,
    Loader2,
    Search,
    ShieldCheck,
    UserRound,
    XCircle,
} from 'lucide-react';
import { searchAdminEntities } from '../services/api';

const ENTITY_OPTIONS = [
    { value: 'provider', label: 'Provider' },
    { value: 'performer', label: 'Performer' },
    { value: 'task', label: 'Task' },
];

const PAGE_SIZE = 20;

const statusClass = (status) => {
    if (['ACTIVE', 'PUBLISHED', 'IN_PROGRESS', 'CLAIMED', 'AVAILABLE'].includes(status)) {
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
    if (['COMPLETED', 'VERIFIED'].includes(status)) {
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
    if (['PENDING', 'PENDING_APPROVAL', 'SUBMITTED', 'DRAFT'].includes(status)) {
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
    if (['BLOCKED', 'INACTIVE', 'CANCELED', 'EXPIRED', 'REJECTED', 'UNAVAILABLE'].includes(status)) {
        return 'bg-red-50 text-red-700 border-red-100';
    }
    return 'bg-slate-50 text-slate-600 border-slate-100';
};

const kycClass = (status) => {
    if (status === 'VERIFIED') return 'bg-emerald-50 text-emerald-700';
    if (status === 'PENDING') return 'bg-amber-50 text-amber-700';
    if (status === 'REJECTED') return 'bg-red-50 text-red-700';
    return 'bg-slate-50 text-slate-500';
};

const entityIcon = (type) => {
    if (type === 'TASK') return <ClipboardList size={18} />;
    if (type === 'PROVIDER') return <BriefcaseBusiness size={18} />;
    return <UserRound size={18} />;
};

const displayValue = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    return value;
};

const AdminSearch = () => {
    const navigate = useNavigate();
    const [entityType, setEntityType] = useState('provider');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const [results, setResults] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const trimmedQuery = query.trim();

    const title = useMemo(
        () => ENTITY_OPTIONS.find((option) => option.value === entityType)?.label ?? 'Provider',
        [entityType],
    );

    const runSearch = async () => {
        if (trimmedQuery.length < 2) {
            setResults([]);
            setPagination(null);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await searchAdminEntities({
                type: entityType,
                q: trimmedQuery,
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            });
            setResults(response.data ?? []);
            setPagination(response.pagination ?? null);
        } catch (err) {
            setError(err.message || 'Search failed');
            setResults([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(runSearch, 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityType, trimmedQuery, page]);

    useEffect(() => {
        setPage(0);
    }, [entityType, trimmedQuery]);

    const openResult = (row) => {
        if (row.actionUrl) navigate(row.actionUrl);
    };

    const renderWorkSummary = (row) => {
        if (row.type === 'TASK') {
            return (
                <div className="text-sm text-slate-600">
                    <div className="font-bold text-slate-800">{displayValue(row.meta?.category)}</div>
                    <div className="text-xs text-slate-400">
                        {row.meta?.assignedPerformer ? `Assigned: ${row.meta.assignedPerformer}` : 'Unassigned'}
                    </div>
                </div>
            );
        }

        if (row.type === 'PROVIDER') {
            return (
                <div className="text-sm text-slate-600">
                    <div className="font-bold text-slate-800">{row.taskCount ?? 0} posted</div>
                    <div className="text-xs text-slate-400">{row.completedTaskCount ?? 0} completed</div>
                </div>
            );
        }

        return (
            <div className="text-sm text-slate-600">
                <div className="font-bold text-slate-800">{row.completedTaskCount ?? 0} completed</div>
                <div className="text-xs text-slate-400">{row.taskCount ?? 0} assigned</div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Search</h1>
                <p className="text-slate-500 font-medium">
                    Search one entity type at a time to quickly open task, provider, or performer details.
                </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3">
                    <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Type</span>
                        <select
                            value={entityType}
                            onChange={(event) => setEntityType(event.target.value)}
                            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                        >
                            {ENTITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                            Search {title}
                        </span>
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search by id, email, name, phone, task title..."
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                            />
                            {loading && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin" />}
                        </div>
                    </label>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 font-bold">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="font-black text-slate-900">Results</h2>
                        <p className="text-xs font-bold text-slate-400">
                            {pagination ? `${pagination.total} found` : trimmedQuery.length < 2 ? 'Enter at least 2 characters' : 'No results yet'}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] text-left">
                        <thead className="bg-slate-50/80 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <tr>
                                <th className="px-5 py-3">Name / Title</th>
                                <th className="px-5 py-3">Type</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">KYC</th>
                                <th className="px-5 py-3">Disputes</th>
                                <th className="px-5 py-3">Work Summary</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading && !results.length ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-14 text-center text-slate-400 font-bold">
                                        <Loader2 className="mx-auto mb-3 animate-spin text-emerald-500" />
                                        Searching...
                                    </td>
                                </tr>
                            ) : results.length ? (
                                results.map((row) => (
                                    <tr
                                        key={`${row.type}-${row.id}`}
                                        onClick={() => openResult(row)}
                                        className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    {entityIcon(row.type)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900">{displayValue(row.primaryText)}</div>
                                                    <div className="text-xs font-bold text-slate-400">{displayValue(row.secondaryText)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-black text-slate-500">{row.type}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusClass(row.status)}`}>
                                                {row.status === 'ACTIVE' || row.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : row.status === 'BLOCKED' ? <XCircle size={12} /> : null}
                                                {displayValue(row.status)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${kycClass(row.kycStatus)}`}>
                                                {row.kycStatus === 'VERIFIED' && <ShieldCheck size={12} />}
                                                {row.kycStatus || '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`font-black ${row.disputeCount > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                                                {row.disputeCount ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">{renderWorkSummary(row)}</td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    openResult(row);
                                                }}
                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white hover:bg-emerald-600 transition-colors"
                                            >
                                                {row.actionLabel || 'Open'} <ArrowUpRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-5 py-14 text-center text-slate-400 font-bold">
                                        {trimmedQuery.length < 2 ? 'Search to see results.' : 'No matching records found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                        <button
                            disabled={page === 0 || loading}
                            onClick={() => setPage((value) => Math.max(0, value - 1))}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Page {page + 1}
                        </span>
                        <button
                            disabled={!pagination.hasMore || loading}
                            onClick={() => setPage((value) => value + 1)}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSearch;
