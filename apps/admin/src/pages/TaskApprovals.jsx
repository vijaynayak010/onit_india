import React, { useState, useEffect } from 'react';
import {
    ClipboardCheck,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Eye,
    Clock,
    MapPin,
    IndianRupee,
    Tag,
    X,
} from 'lucide-react';
import DataTable from '../components/common/DataTable.jsx';
import Toast from '../components/common/Toast.jsx';
import {
    listTaskApprovalsAdmin,
    approveTaskAdmin,
    rejectTaskAdmin,
    getTaskByIdAdmin,
} from '../services/api';

const formatPrice = (amount, currency) => {
    if (amount == null) return '—';
    return `${currency || 'INR'} ${Number(amount).toLocaleString()}`;
};

const TaskApprovalsPage = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [busyId, setBusyId] = useState(null);

    // Detail drawer
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Reject modal
    const [rejectTarget, setRejectTarget] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await listTaskApprovalsAdmin({ limit: 100 });
            setRows(res.data || []);
        } catch (error) {
            setToast({ message: error.message || 'Failed to load pending tasks.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        setBusyId(id);
        try {
            await approveTaskAdmin(id);
            setToast({ message: 'Task approved — it is now live on the app.', type: 'success' });
            setDetail(null);
            fetchPending();
        } catch (error) {
            setToast({ message: error.message || 'Failed to approve task.', type: 'error' });
        } finally {
            setBusyId(null);
        }
    };

    const submitReject = async () => {
        if (!rejectReason.trim()) {
            setToast({ message: 'Please enter a reason for rejection.', type: 'error' });
            return;
        }
        const id = rejectTarget.id;
        setBusyId(id);
        try {
            await rejectTaskAdmin(id, { reason: rejectReason.trim() });
            setToast({ message: 'Task rejected. The provider has been notified.', type: 'success' });
            setRejectTarget(null);
            setRejectReason('');
            setDetail(null);
            fetchPending();
        } catch (error) {
            setToast({ message: error.message || 'Failed to reject task.', type: 'error' });
        } finally {
            setBusyId(null);
        }
    };

    const openDetail = async (row) => {
        setDetail({ ...row });
        setDetailLoading(true);
        try {
            const res = await getTaskByIdAdmin(row.id);
            const fullTask = res?.data || res;
            if (fullTask && typeof fullTask === 'object') {
                setDetail(prev => ({ ...prev, ...fullTask }));
            }
        } catch (error) {
            setToast({ message: 'Failed to load full task details.', type: 'error' });
        } finally {
            setDetailLoading(false);
        }
    };

    const columns = [
        {
            header: 'Task',
            key: 'title',
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 leading-tight">{val || 'Untitled task'}</span>
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[260px]">
                        {row.description || 'No description'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Provider',
            key: 'provider',
            render: (val) => (
                <span className="text-xs font-medium text-slate-600 truncate max-w-[180px] block">
                    {val?.email || '—'}
                </span>
            ),
        },
        {
            header: 'Category',
            key: 'category',
            render: (val) => (
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                    {val || 'General'}
                </span>
            ),
        },
        {
            header: 'Price',
            key: 'priceAmount',
            render: (val, row) => (
                <span className="text-sm font-bold text-slate-900">{formatPrice(val, row.priceCurrency)}</span>
            ),
        },
        {
            header: 'Submitted',
            key: 'updatedAt',
            render: (val) => (
                <span className="text-[11px] font-medium text-slate-400">
                    {val ? new Date(val).toLocaleString() : '—'}
                </span>
            ),
        },
        {
            header: 'Actions',
            key: 'id',
            render: (_, row) => (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        onClick={() => openDetail(row)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-emerald-600"
                        title="View details"
                    >
                        <Eye size={14} /> View
                    </button>
                    <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => handleApprove(row.id)}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline disabled:opacity-40"
                    >
                        <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => { setRejectTarget(row); setRejectReason(''); }}
                        className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline disabled:opacity-40"
                    >
                        <XCircle size={14} /> Reject
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <ClipboardCheck size={22} />
                        </span>
                        Task Approvals
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Review tasks submitted by providers. Approved tasks go live on the app; rejected tasks return to the provider with your note.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fetchPending}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-sm font-bold hover:bg-emerald-100 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="card p-4 border-l-4 border-l-amber-500 flex items-center gap-4">
                    <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Review</p>
                        <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{rows.length}</h3>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Pending tasks</h2>
                </div>
                {rows.length === 0 && !loading ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                            <CheckCircle2 size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">All caught up</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">No tasks are waiting for approval right now.</p>
                    </div>
                ) : (
                    <DataTable columns={columns} data={rows} onRowClick={openDetail} />
                )}
            </div>

            {/* Detail Drawer */}
            {detail && (
                <div className="fixed inset-0 z-[70] flex justify-end bg-slate-900/40 backdrop-blur-sm" onClick={() => setDetail(null)}>
                    <div
                        className="h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending Approval</p>
                                <h2 className="text-xl font-bold text-slate-900 leading-tight mt-1">{detail.title || 'Untitled task'}</h2>
                            </div>
                            <button onClick={() => setDetail(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {detailLoading && (
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <div className="h-4 w-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                                    Loading full details…
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <Tag size={16} className="text-slate-400" />
                                    {detail.category || 'General'}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <IndianRupee size={16} className="text-slate-400" />
                                    {formatPrice(detail.priceAmount, detail.priceCurrency)}
                                </div>
                                {detail.locationAddress && (
                                    <div className="col-span-2 flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin size={16} className="text-slate-400" />
                                        {detail.locationAddress}
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider</p>
                                <p className="text-sm font-medium text-slate-700">{detail.provider?.email || '—'}</p>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</p>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                    {detail.description || 'No description provided.'}
                                </p>
                            </div>

                            {Array.isArray(detail.skills) && detail.skills.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {detail.skills.map((s, i) => (
                                            <span key={i} className="px-2 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {Array.isArray(detail.files) && detail.files.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Attachments</p>
                                    <ul className="space-y-1">
                                        {detail.files.map((f) => {
                                            const safeUrl = /^https?:\/\//i.test(f.url) ? f.url : '#';
                                            return (
                                                <li key={f.id}>
                                                    <a href={safeUrl} target="_blank" rel="noreferrer" className="text-sm text-emerald-600 font-medium hover:underline">
                                                        {f.filename || 'Attachment'}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex gap-3">
                            <button
                                type="button"
                                disabled={busyId === detail.id}
                                onClick={() => handleApprove(detail.id)}
                                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} /> Approve & Go Live
                            </button>
                            <button
                                type="button"
                                disabled={busyId === detail.id}
                                onClick={() => { setRejectTarget(detail); setRejectReason(''); }}
                                className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <XCircle size={18} /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectTarget && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setRejectTarget(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Reject task</h3>
                                <p className="text-sm text-slate-500 font-medium">"{rejectTarget.title}"</p>
                            </div>
                            <button onClick={() => setRejectTarget(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Reason (sent to provider)</label>
                            <textarea
                                autoFocus
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm h-28 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-400"
                                placeholder="e.g. Price is below the allowed minimum for this category."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setRejectTarget(null)}
                                className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={busyId === rejectTarget.id}
                                onClick={submitReject}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {busyId === rejectTarget.id ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Confirm reject</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
};

export default TaskApprovalsPage;
