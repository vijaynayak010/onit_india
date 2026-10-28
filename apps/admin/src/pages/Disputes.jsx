import React, { useState, useEffect, useCallback } from 'react';
import {
    AlertTriangle, ShieldAlert, CheckCircle2, Search, Filter,
    XCircle, Eye, RefreshCw, Loader2, ArrowUpRight, CheckCircle,
    User, Phone, Mail, Clock, HelpCircle, FileText
} from 'lucide-react';
import DataTable from '../components/common/DataTable.jsx';
import Toast from '../components/common/Toast.jsx';
import { listDisputesAdmin, getDisputeByIdAdmin, resolveDisputeAdmin, repostTaskAdmin } from '../services/api';

/* =======================
   HELPERS
   ======================= */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
};

const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const getUserName = (user) => {
    if (!user) return 'Unknown';
    return user.taskers?.displayName || user.provider?.username || user.email || 'Unknown';
};

const getDisputeReasonLabel = (reason) => {
    const labels = {
        'UNCLEAR_DOCUMENTATION': 'Vague/Unclear Instructions',
        'UNRESPONSIVE_COUNTERPARTY': 'Unresponsive Provider/Tasker',
        'SCOPE_CREEP': 'Unreasonable Scope Creep',
        'PAYMENT_TERMS_DISAGREEMENT': 'Payment Terms Dispute',
        'OTHER': 'Other Reason'
    };
    return labels[reason] || reason;
};


/* =======================
   DISPUTE DETAIL DRAWER
   ======================= */
const DisputeDetailDrawer = ({ isOpen, onClose, disputeId, onResolve, actionLoading, onRefresh }) => {
    const [dispute, setDispute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [resolutionType, setResolutionType] = useState(null); // 'REFUND_PROVIDER' | 'RELEASE_TASKER' | 'SPLIT_SETTLEMENT' | 'DISMISS' | 'REFUND_AND_REPOST'
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'checklist' | 'chat'
    const [resolvingItemId, setResolvingItemId] = useState(null);

    // Fetch detail when drawer opens
    useEffect(() => {
        if (isOpen && disputeId) {
            setLoading(true);
            setDispute(null);
            setAdminNotes('');
            setResolutionType(null);
            setActiveTab('overview');
            getDisputeByIdAdmin(disputeId)
                .then(res => {
                    setDispute(res.data || res);
                })
                .catch(err => {
                    alert(err.message || 'Failed to fetch dispute details');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, disputeId]);

    if (!isOpen) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!resolutionType) return alert('Please select a resolution action');
        if (!adminNotes.trim()) return alert('Admin resolution notes are required');
        onResolve(dispute.id, resolutionType, adminNotes.trim(), dispute.task?.id);
    };

    const handleOverrideChecklistItem = async (itemId, approve) => {
        const feedback = prompt(
            approve
                ? 'Enter admin notes for approving this checklist item:'
                : 'Enter admin notes for rejecting this checklist item:',
            approve ? 'Admin override: Approved after reviewing evidence.' : 'Admin override: Rejected submission.'
        );
        if (feedback === null) return;
        setResolvingItemId(itemId);
        try {
            await resolveChecklistItemDisputeAdmin(itemId, {
                status: approve ? 'APPROVED' : 'REJECTED',
                providerFeedback: feedback,
            });
            alert('Checklist item dispute resolved successfully!');
            const updated = await getDisputeByIdAdmin(disputeId);
            setDispute(updated.data || updated);
            if (onRefresh) onRefresh();
        } catch (err) {
            alert(err.message || 'Failed to resolve checklist item dispute');
        } finally {
            setResolvingItemId(null);
        }
    };

    const isPending = dispute?.status === 'PENDING' || dispute?.status === 'INVESTIGATING';
    const timeline = dispute?.timeline || [];
    const checklistItems = dispute?.checklistItems || dispute?.task?.checklist?.items || [];
    const disputedChecklistItems = dispute?.disputedChecklistItems || checklistItems.filter(i => i.status === 'DISPUTED' || i.isDisputed || i.rejectionCount >= 3);
    const chatMessages = dispute?.chatMessages || [];

    return (
        <div className={`fixed inset-y-0 right-0 w-full max-w-3xl bg-white shadow-2xl z-[60] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                            Case File
                        </span>
                        <span className="text-slate-400 text-xs font-mono font-bold truncate max-w-[150px]" title={disputeId}>
                            {disputeId?.split('-')[0]}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-lg px-2">✕</button>
                </div>

                {dispute && (
                    <div className="flex border-b border-slate-100 bg-white px-6">
                        {[
                            { key: 'overview', label: 'Overview & Decision' },
                            { key: 'timeline', label: `Timeline (${timeline.length})` },
                            { key: 'checklist', label: `Checklist (${checklistItems.length})`, badge: disputedChecklistItems.length },
                            { key: 'chat', label: `Task Chat (${chatMessages.length})` },
                        ].map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all relative ${
                                    activeTab === t.key
                                        ? 'border-slate-900 text-slate-900'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {t.label}
                                {t.badge > 0 && (
                                    <span className="ml-1.5 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[9px] font-black">
                                        {t.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Case File...</p>
                        </div>
                    ) : dispute ? (
                        <>
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <>
                                    {/* Header Status Card */}
                                    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                                        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5">
                                            <AlertTriangle size={150} />
                                        </div>
                                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">
                                            DISPUTE REASON
                                        </p>
                                        <h3 className="text-2xl font-black">{getDisputeReasonLabel(dispute.reason)}</h3>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                                                dispute.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'
                                            }`}>
                                                {dispute.status}
                                            </span>
                                            <span className="text-slate-400 text-[10px] font-medium">• Filed {formatDate(dispute.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Task & Escrow Info */}
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Task Details</h4>
                                        <div className="space-y-2">
                                            <p className="font-bold text-slate-800 text-base">{dispute.task?.title}</p>
                                            <div className="grid grid-cols-2 gap-4 pt-1">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Task Price</p>
                                                    <p className="font-black text-slate-800 text-sm">{formatCurrency(dispute.task?.priceAmount)}</p>
                                                </div>
                                                {dispute.task?.settlement && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Escrow Status</p>
                                                        <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-black uppercase mt-0.5">
                                                            {dispute.task.settlement.status}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Involved Parties */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Provider</p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                                    {getUserName(dispute.task?.provider)[0]?.toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-slate-800 text-xs truncate">{getUserName(dispute.task?.provider)}</p>
                                                    <p className="text-[10px] text-slate-400 truncate">{dispute.task?.provider?.email}</p>
                                                    {dispute.task?.provider?.phoneNumber && (
                                                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{dispute.task.provider.phoneNumber}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                                                {dispute.task?.provider?.email && (
                                                    <a
                                                        href={`mailto:${dispute.task.provider.email}`}
                                                        className="px-2.5 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                                                        title="Click to Email Provider"
                                                    >
                                                        ✉️ Email
                                                    </a>
                                                )}
                                                {dispute.task?.provider?.phoneNumber && (
                                                    <a
                                                        href={`tel:${dispute.task.provider.phoneNumber}`}
                                                        className="px-2.5 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                                                        title="Click to Call Provider"
                                                    >
                                                        📞 Call
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Performer</p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                                    {getUserName(dispute.assignment?.tasker?.user)[0]?.toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-slate-800 text-xs truncate">{getUserName(dispute.assignment?.tasker?.user)}</p>
                                                    <p className="text-[10px] text-slate-400 truncate">{dispute.assignment?.tasker?.user?.email}</p>
                                                    {dispute.assignment?.tasker?.user?.phoneNumber && (
                                                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{dispute.assignment.tasker.user.phoneNumber}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                                                {dispute.assignment?.tasker?.user?.email && (
                                                    <a
                                                        href={`mailto:${dispute.assignment.tasker.user.email}`}
                                                        className="px-2.5 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                                                        title="Click to Email Performer"
                                                    >
                                                        ✉️ Email
                                                    </a>
                                                )}
                                                {dispute.assignment?.tasker?.user?.phoneNumber && (
                                                    <a
                                                        href={`tel:${dispute.assignment.tasker.user.phoneNumber}`}
                                                        className="px-2.5 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                                                        title="Click to Call Performer"
                                                    >
                                                        📞 Call
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description & Explanation */}
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispute Explanation</h4>
                                        <div className="text-slate-700 text-xs bg-white border border-slate-200 rounded-xl p-3.5 leading-relaxed">
                                            {dispute.explanation || 'No explanation details provided by the claimant.'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                            <Clock size={12} /> Filed by {dispute.raisedByUser?.email || 'User'}
                                        </div>
                                    </div>

                                    {/* Historic Resolution info */}
                                    {!isPending && (
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolution Audit Trail</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Resolution Decision</p>
                                                    <span className="font-bold text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block mt-0.5">
                                                        {dispute.resolution}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Resolved By</p>
                                                    <p className="font-bold text-slate-700 text-xs mt-0.5">{dispute.resolver?.email || dispute.resolvedBy || 'Admin'}</p>
                                                </div>
                                            </div>
                                            {dispute.adminNotes && (
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Admin Resolution Notes</p>
                                                    <p className="text-slate-600 text-xs mt-1 italic">"{dispute.adminNotes}"</p>
                                                </div>
                                            )}
                                            <p className="text-[10px] text-slate-400 font-medium">Completed on {formatDate(dispute.resolvedAt)}</p>
                                        </div>
                                    )}

                                    {/* Resolution Action Form */}
                                    {isPending && (
                                        <form onSubmit={handleFormSubmit} className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-4">
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                                Dispute Resolution Options
                                            </h4>

                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setResolutionType('REFUND_PROVIDER')}
                                                    className={`px-4 py-3 rounded-xl border text-xs font-black text-left flex flex-col justify-between transition-all ${
                                                        resolutionType === 'REFUND_PROVIDER' 
                                                            ? 'bg-rose-50 border-rose-600 text-rose-800 shadow-sm ring-1 ring-rose-600' 
                                                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <span>Option A</span>
                                                    <span className="text-xs font-black mt-2">Refund Provider 100%</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setResolutionType('RELEASE_TASKER')}
                                                    className={`px-4 py-3 rounded-xl border text-xs font-black text-left flex flex-col justify-between transition-all ${
                                                        resolutionType === 'RELEASE_TASKER' 
                                                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm ring-1 ring-emerald-600' 
                                                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <span>Option B</span>
                                                    <span className="text-xs font-black mt-2">Release to Tasker 100%</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setResolutionType('SPLIT_SETTLEMENT')}
                                                    className={`px-4 py-3 rounded-xl border text-xs font-black text-left flex flex-col justify-between transition-all ${
                                                        resolutionType === 'SPLIT_SETTLEMENT' 
                                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-800 shadow-sm ring-1 ring-indigo-600' 
                                                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <span>Option C</span>
                                                    <span className="text-xs font-black mt-2">Split Escrow 50/50</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setResolutionType('DISMISS')}
                                                    className={`px-4 py-3 rounded-xl border text-xs font-black text-left flex flex-col justify-between transition-all ${
                                                        resolutionType === 'DISMISS' 
                                                            ? 'bg-slate-800 border-slate-800 text-white shadow-sm' 
                                                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <span>Option D</span>
                                                    <span className="text-xs font-black mt-2">Dismiss & Resume Task</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setResolutionType('REFUND_AND_REPOST')}
                                                    className={`col-span-2 px-4 py-3 rounded-xl border text-xs font-black text-left flex flex-col justify-between transition-all ${
                                                        resolutionType === 'REFUND_AND_REPOST'
                                                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-sm ring-1 ring-emerald-600'
                                                            : 'bg-white border-emerald-200 text-slate-700 hover:border-emerald-400'
                                                    }`}
                                                >
                                                    <span>Option E</span>
                                                    <span className="text-xs font-black mt-2">Refund Provider + Repost Task</span>
                                                    <span className="text-[10px] font-bold mt-1 opacity-70">
                                                        Cancel current assignment, credit provider wallet, and publish the same task for new performers.
                                                    </span>
                                                </button>
                                            </div>

                                            {resolutionType && (
                                                <div className="space-y-1 pt-2 animate-in slide-in-from-top-2 duration-300">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Admin Resolution Audit Notes (Required)</label>
                                                    <textarea
                                                        required
                                                        placeholder="Please write the reasoning for this resolution (e.g. details of telephone/email discussions with tasker & provider)..."
                                                        value={adminNotes}
                                                        onChange={e => setAdminNotes(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400"
                                                        rows={3}
                                                    />
                                                </div>
                                            )}

                                            {resolutionType && (
                                                <button
                                                    type="submit"
                                                    disabled={actionLoading}
                                                    className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md shadow-slate-950/10 hover:bg-slate-850 mt-4 transition-all"
                                                >
                                                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                                                    {resolutionType === 'REFUND_AND_REPOST' ? 'Refund and Repost Task' : 'Submit Resolution Decision'}
                                                </button>
                                            )}
                                        </form>
                                    )}
                                </>
                            )}

                            {/* TIMELINE TAB */}
                            {activeTab === 'timeline' && (
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={16} className="text-blue-500" /> Complete Task Event Tracking
                                    </h4>
                                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                        {timeline.map((event, idx) => (
                                            <div key={idx} className="relative">
                                                <div className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ring-4 ring-slate-50 ${
                                                    event.type.includes('DISPUTE') ? 'bg-orange-500' :
                                                    event.type.includes('COMPLETED') || event.type.includes('ACCEPTED') ? 'bg-emerald-500' :
                                                    event.type.includes('REJECTED') ? 'bg-rose-500' : 'bg-blue-500'
                                                }`} />
                                                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-xs text-slate-900">{event.label}</span>
                                                        <span className="text-[10px] font-bold text-slate-400">{formatDate(event.at)}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600">{event.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CHECKLIST TAB */}
                            {activeTab === 'checklist' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                            Task Deliverable Checklist ({checklistItems.length})
                                        </h4>
                                        {disputedChecklistItems.length > 0 && (
                                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-black uppercase">
                                                ⚠️ {disputedChecklistItems.length} Disputed Items
                                            </span>
                                        )}
                                    </div>

                                    {checklistItems.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
                                            No checklist items generated for this task.
                                        </div>
                                    ) : (
                                        checklistItems.map((item, idx) => {
                                            const isItemDisputed = item.status === 'DISPUTED' || item.isDisputed || item.rejectionCount >= 3;
                                            const latestSub = item.submissions?.[item.submissions.length - 1];

                                            return (
                                                <div
                                                    key={item.id || idx}
                                                    className={`p-4 rounded-2xl border space-y-3 transition-all ${
                                                        isItemDisputed
                                                            ? 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-200'
                                                            : 'bg-slate-50 border-slate-100'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                                                            <h5 className="font-bold text-slate-900 text-sm">{item.title}</h5>
                                                            {item.description && <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>}
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                                                            item.status === 'COMPLETED' || item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                                            isItemDisputed ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                                                        }`}>
                                                            {isItemDisputed ? 'DISPUTED (3x REJECT)' : item.status}
                                                        </span>
                                                    </div>

                                                    {/* Rejection count & Provider Feedback */}
                                                    {item.rejectionCount > 0 && (
                                                        <div className="bg-white p-3 rounded-xl border border-rose-100 text-xs space-y-1">
                                                            <p className="font-bold text-rose-700 text-[10px] uppercase">
                                                                Rejection Count: {item.rejectionCount} / 3
                                                            </p>
                                                            {item.providerFeedback && (
                                                                <p className="text-slate-700 italic">"Provider Feedback: {item.providerFeedback}"</p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* All Submission Versions (v1, v2, v3...) */}
                                                    {Array.isArray(item.submissions) && item.submissions.length > 0 && (
                                                        <div className="space-y-2 pt-1">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                Submission History ({item.submissions.length} Version{item.submissions.length > 1 ? 's' : ''})
                                                            </p>
                                                            <div className="space-y-2">
                                                                {item.submissions.map((sub, sIdx) => (
                                                                    <div key={sub.id || sIdx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="font-bold text-slate-800 text-[10px] uppercase bg-slate-100 px-2 py-0.5 rounded">
                                                                                Version #{sub.version || sIdx + 1}
                                                                            </span>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                                                    sub.reviewStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                                                                    sub.reviewStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                                                                }`}>
                                                                                    {sub.reviewStatus || 'SUBMITTED'}
                                                                                </span>
                                                                                <span className="text-[10px] text-slate-400">{formatDate(sub.submittedAt || sub.createdAt)}</span>
                                                                            </div>
                                                                        </div>
                                                                        {sub.notes && <p className="text-slate-600 mt-1"><strong className="text-slate-700">Tasker Notes:</strong> {sub.notes}</p>}
                                                                        {sub.providerFeedback && <p className="text-rose-600 italic text-[11px]"><strong className="text-rose-700 font-bold">Provider Feedback:</strong> "{sub.providerFeedback}"</p>}
                                                                        {sub.fileUrl && (
                                                                            <a
                                                                                href={sub.fileUrl}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="inline-block mt-1 text-blue-600 font-bold text-[11px] underline hover:text-blue-800"
                                                                            >
                                                                                View Proof Attachment (v{sub.version || sIdx + 1}) 🔗
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Admin Override Action */}
                                                    {isItemDisputed && (
                                                        <div className="pt-2 flex gap-2">
                                                            <button
                                                                disabled={resolvingItemId === item.id}
                                                                onClick={() => handleOverrideChecklistItem(item.id, true)}
                                                                className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center justify-center gap-1"
                                                            >
                                                                {resolvingItemId === item.id ? <Loader2 size={14} className="animate-spin" /> : 'Override: Approve Item'}
                                                            </button>
                                                            <button
                                                                disabled={resolvingItemId === item.id}
                                                                onClick={() => handleOverrideChecklistItem(item.id, false)}
                                                                className="flex-1 bg-rose-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-700 transition-all flex items-center justify-center gap-1"
                                                            >
                                                                {resolvingItemId === item.id ? <Loader2 size={14} className="animate-spin" /> : 'Override: Reject Item'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {/* CHAT TAB */}
                            {activeTab === 'chat' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                        Provider & Performer Task Chat History ({chatMessages.length})
                                    </h4>

                                    {chatMessages.length === 0 ? (
                                        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                                            No chat messages exchanged between parties yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-[400px] overflow-y-auto">
                                            {chatMessages.map((msg) => {
                                                const isProvider = msg.senderRole === 'PROVIDER';

                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex flex-col ${isProvider ? 'items-end' : 'items-start'}`}
                                                    >
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <span className="text-[10px] font-black uppercase text-slate-400">
                                                                {isProvider ? 'Provider' : 'Tasker'}
                                                            </span>
                                                            <span className="text-[9px] text-slate-400">{formatDate(msg.createdAt)}</span>
                                                        </div>
                                                        <div
                                                            className={`px-3.5 py-2.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                                                                isProvider
                                                                    ? 'bg-slate-900 text-white rounded-tr-none'
                                                                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                                                            }`}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <HelpCircle size={48} className="mx-auto mb-2 opacity-50" />
                            <p>No dispute selected.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


/* =======================
   MAIN DISPUTES PAGE
   ======================= */
const DisputesPage = () => {
    const [disputes, setDisputes] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState('PENDING'); // PENDING | RESOLVED | all
    const [selectedDisputeId, setSelectedDisputeId] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const PAGE_SIZE = 20;

    const fetchDisputes = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            };
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            const res = await listDisputesAdmin(params);
            setDisputes(res.data || []);
            setTotal(res.pagination?.total || 0);
        } catch (error) {
            console.error('Failed to load disputes:', error);
            setToast({ message: error.message || 'Failed to load disputes data', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => {
        fetchDisputes();
    }, [fetchDisputes]);

    const handleResolve = async (id, resolution, adminNotes, taskId) => {
        setActionLoading(true);
        try {
            if (resolution === 'REFUND_AND_REPOST') {
                if (!taskId) {
                    throw new Error('Task ID missing for this dispute. Cannot repost automatically.');
                }
                const auditNotes = `${adminNotes}\n\nAdmin selected Refund Provider + Repost Task. A replacement task will be published for new performers.`;
                await resolveDisputeAdmin(id, { resolution: 'REFUND_PROVIDER', adminNotes: auditNotes });
                await repostTaskAdmin(taskId, { reason: adminNotes });
                setToast({ message: 'Dispute resolved, provider refunded, and replacement task posted.', type: 'success' });
            } else {
                await resolveDisputeAdmin(id, { resolution, adminNotes });
                setToast({ message: 'Dispute resolved successfully. Escrow funds settled.', type: 'success' });
            }
            setDrawerOpen(false);
            fetchDisputes();
        } catch (error) {
            setToast({ message: error.message || 'Failed to resolve dispute', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        {
            header: 'CASE ID',
            key: 'id',
            render: (v) => <span className="font-mono text-xs text-slate-500 truncate block max-w-[100px]" title={v}>{v.split('-')[0]}</span>
        },
        {
            header: 'TASK TITLE',
            key: 'task',
            render: (task) => <span className="font-bold text-xs text-slate-900 block max-w-[180px] truncate" title={task?.title}>{task?.title || 'Unknown'}</span>
        },
        {
            header: 'REASON',
            key: 'reason',
            render: (reason) => <span className="font-bold text-xs text-slate-700">{getDisputeReasonLabel(reason)}</span>
        },
        {
            header: 'ESCROW AMOUNT',
            key: 'task',
            render: (task) => <span className="font-black text-slate-900 tracking-tight">{formatCurrency(task?.priceAmount)}</span>
        },
        {
            header: 'FILED BY',
            key: 'raisedByUser',
            render: (user) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs text-slate-800">{user?.email?.split('@')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{user?.email}</span>
                </div>
            )
        },
        {
            header: 'STATUS',
            key: 'status',
            render: (status) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' :
                    status === 'INVESTIGATING' ? 'bg-blue-50 text-blue-600' :
                    'bg-orange-50 text-orange-600'
                }`}>
                    {status}
                </span>
            )
        },
        {
            header: 'DATE FILED',
            key: 'createdAt',
            render: (date) => <span className="text-xs font-medium text-slate-500">{formatDate(date)}</span>
        },
        {
            header: 'ACTIONS',
            render: (_, row) => (
                <button
                    onClick={() => {
                        setSelectedDisputeId(row.id);
                        setDrawerOpen(true);
                    }}
                    className="flex items-center gap-1 text-emerald-600 font-bold text-xs hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Review Case <ArrowUpRight size={14} />
                </button>
            )
        }
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700 pb-20 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={32} />
                        Dispute Center
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        {loading ? 'Syncing cases...' : `${total.toLocaleString()} total dispute filings`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDisputes}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm hover:shadow hover:border-emerald-200 transition-all"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin text-emerald-500' : ''} />
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {['PENDING', 'RESOLVED', 'all'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setStatusFilter(tab); setPage(0); }}
                        className={`px-6 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                            statusFilter === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                        }`}
                    >
                        {tab === 'all' ? 'All Cases' : `${tab} Cases`}
                    </button>
                ))}
            </div>

            {/* Data Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                        <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Fetching Records</span>
                    </div>
                )}

                {disputes.length > 0 ? (
                    <DataTable columns={columns} data={disputes} />
                ) : !loading && (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                        <AlertTriangle size={48} className="text-slate-200 mb-4" />
                        <p className="font-bold">No dispute cases found.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {total > PAGE_SIZE && !loading && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm font-bold text-slate-500">
                        Viewing <span className="text-slate-900">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)}</span> of <span className="text-slate-900">{total}</span>
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="bg-white border border-slate-200 px-5 py-2 rounded-full font-bold text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all"
                        >
                            Previous
                        </button>
                        <button
                            disabled={(page + 1) * PAGE_SIZE >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="bg-white border border-slate-200 px-5 py-2 rounded-full font-bold text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Drawer */}
            <DisputeDetailDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                disputeId={selectedDisputeId}
                onResolve={handleResolve}
                actionLoading={actionLoading}
                onRefresh={fetchDisputes}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default DisputesPage;
