import React, { useState, useEffect, useCallback } from 'react';
import {
    getReferralStats, getAllReferralRedemptions,
    getReferralMilestones, createReferralMilestone,
    updateReferralMilestone, deleteReferralMilestone,
    getReferralFulfillmentQueue, updateReferralFulfillment,
} from '../services/api.js';
import {
    Users, TrendingUp, Package, Truck, CheckCircle,
    RefreshCw, Plus, Edit3, Trash2, Save, X,
    ChevronLeft, ChevronRight, AlertCircle, Gift,
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => `₹${Number(n ?? 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const FulfillmentBadge = ({ status }) => {
    const map = {
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-600',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[status] ?? 'bg-slate-100 text-slate-500'}`}>
            {status}
        </span>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs font-bold text-slate-500 mt-0.5">{label}</p>
    </div>
);

// ── Milestone form ────────────────────────────────────────────────────────────

const MilestoneModal = ({ initial, onClose, onSaved }) => {
    const isEdit = !!initial?.id;
    const [form, setForm] = useState({
        referralCount: initial?.referralCount ?? '',
        rewardType: initial?.rewardType ?? 'physical_item',
        rewardItem: initial?.rewardItem ?? '',
        rewardLabel: initial?.rewardLabel ?? '',
        rewardAmount: initial?.rewardAmount ?? '',
        isActive: initial?.isActive ?? true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

    const save = async () => {
        if (!form.referralCount) { setError('Referral count is required'); return; }
        if (form.rewardType === 'physical_item' && !form.rewardItem) {
            setError('Reward item description is required for physical rewards'); return;
        }
        if (form.rewardType === 'wallet_credit' && !form.rewardAmount) {
            setError('Reward amount is required for wallet credit'); return;
        }
        setSaving(true); setError('');
        try {
            const payload = {
                referralCount: Number(form.referralCount),
                rewardType: form.rewardType,
                rewardItem: form.rewardType === 'physical_item' ? form.rewardItem : undefined,
                rewardAmount: form.rewardType === 'wallet_credit' ? Number(form.rewardAmount) : undefined,
                rewardLabel: form.rewardLabel || undefined,
                ...(isEdit ? { isActive: form.isActive } : {}),
            };
            if (isEdit) await updateReferralMilestone(initial.id, payload);
            else await createReferralMilestone(payload);
            onSaved(); onClose();
        } catch (e) {
            setError(e.message ?? 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-black text-slate-900">{isEdit ? 'Edit Milestone' : 'New Milestone'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Referrals Needed to Unlock</label>
                        <input type="number" min={1} value={form.referralCount} onChange={e => set('referralCount')(e.target.value)}
                            placeholder="e.g. 5" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Reward Type</label>
                        <div className="flex gap-2">
                            {[['physical_item', 'Physical Item (T-Shirt, etc.)'], ['wallet_credit', 'Wallet Credit (₹)']].map(([v, l]) => (
                                <button key={v} onClick={() => set('rewardType')(v)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${form.rewardType === v ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {form.rewardType === 'physical_item' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Item Description</label>
                            <input value={form.rewardItem} onChange={e => set('rewardItem')(e.target.value)}
                                placeholder="e.g. OnIT T-Shirt (Black, L/XL)"
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                    )}

                    {form.rewardType === 'wallet_credit' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Credit Amount (₹)</label>
                            <input type="number" min={0} value={form.rewardAmount} onChange={e => set('rewardAmount')(e.target.value)}
                                placeholder="e.g. 500"
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Badge / Tier Label <span className="text-slate-300 font-normal">(optional)</span></label>
                        <input value={form.rewardLabel} onChange={e => set('rewardLabel')(e.target.value)}
                            placeholder="e.g. Gold Referrer"
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                    </div>

                    {isEdit && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500">Status:</span>
                            {[true, false].map(v => (
                                <button key={String(v)} onClick={() => set('isActive')(v)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition ${form.isActive === v ? (v ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-red-500 text-white border-red-500') : 'border-slate-200 text-slate-600'}`}>
                                    {v ? 'Active' : 'Inactive'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm">Cancel</button>
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm disabled:opacity-50">
                        <Save size={14} /> {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Milestones tab ────────────────────────────────────────────────────────────

const MilestonesPanel = () => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try { setMilestones(await getReferralMilestones()); } catch { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async (m) => {
        if (!window.confirm(`Delete milestone for ${m.referralCount} referrals?`)) return;
        try { await deleteReferralMilestone(m.id); load(); } catch (e) { alert(e.message ?? 'Error'); }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Configure what users earn at each referral milestone</p>
                <button onClick={() => setModal('create')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm">
                    <Plus size={14} /> Add Milestone
                </button>
            </div>

            {loading ? (
                <p className="text-center py-10 text-slate-400 text-sm animate-pulse">Loading…</p>
            ) : milestones.length === 0 ? (
                <div className="text-center py-14 border-2 border-dashed border-slate-200 rounded-2xl">
                    <Gift size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-400 text-sm">No milestones yet. Add one to start rewarding referrers.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {milestones.map(m => (
                        <div key={m.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                                <span className="font-black text-emerald-700 text-lg">{m.referralCount}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-black text-slate-800">
                                        {m.referralCount} referral{m.referralCount !== 1 ? 's' : ''} →{' '}
                                        {m.rewardType === 'physical_item'
                                            ? (m.rewardItem ?? 'Physical Item')
                                            : fmt(m.rewardAmount)}
                                    </p>
                                    {m.rewardLabel && (
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{m.rewardLabel}</span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${m.rewardType === 'physical_item' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {m.rewardType === 'physical_item' ? 'Physical' : 'Wallet Credit'}
                                    </span>
                                    {!m.isActive && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">Inactive</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">Created {fmtDate(m.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setModal({ type: 'edit', data: m })}
                                    className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl">
                                    <Edit3 size={14} />
                                </button>
                                <button onClick={() => handleDelete(m)}
                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal === 'create' && <MilestoneModal onClose={() => setModal(null)} onSaved={load} />}
            {modal?.type === 'edit' && <MilestoneModal initial={modal.data} onClose={() => setModal(null)} onSaved={load} />}
        </div>
    );
};

// ── Fulfillment queue tab ─────────────────────────────────────────────────────

const FulfillmentQueue = () => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(null);
    const limit = 15;

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getReferralFulfillmentQueue({ limit, offset: page * limit, ...(statusFilter && { status: statusFilter }) });
            setItems(res.data ?? []);
            setTotal(res.pagination?.total ?? 0);
        } catch { setItems([]); }
        finally { setLoading(false); }
    }, [page, statusFilter]);

    useEffect(() => { load(); }, [load]);

    const markStatus = async (id, status, extra = {}) => {
        setUpdating(id);
        try { await updateReferralFulfillment(id, { status, ...extra }); load(); }
        catch (e) { alert(e.message ?? 'Error'); }
        finally { setUpdating(null); }
    };

    const promptShip = async (item) => {
        const tracking = window.prompt(`Enter tracking number for ${item.referrerUser?.email}:`);
        if (tracking === null) return;
        await markStatus(item.id, 'shipped', { trackingNumber: tracking });
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400">
                    <option value="">Actionable (pending + processing)</option>
                    <option value="pending">Pending address</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={load} className="p-2 hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
                <span className="text-xs text-slate-400 ml-auto">{total} total</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            {['User', 'Milestone Reward', 'Address', 'Status', 'Tracking', 'Unlocked', 'Actions'].map(h => (
                                <th key={h} className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-12 text-slate-400 animate-pulse">Loading…</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-12 text-slate-400">No items in queue</td></tr>
                        ) : items.map(item => (
                            <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-700">{item.referrerUser?.email ?? '—'}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-bold text-slate-800">
                                        {item.milestone?.rewardType === 'physical_item'
                                            ? item.milestone?.rewardItem ?? 'Physical Item'
                                            : fmt(item.milestone?.rewardAmount)}
                                    </p>
                                    <p className="text-slate-400">{item.milestone?.referralCount} referrals</p>
                                </td>
                                <td className="px-4 py-3">
                                    {item.shippingAddress ? (
                                        <div className="text-slate-600 leading-tight">
                                            <p>{item.shippingAddress.name}</p>
                                            <p className="text-slate-400">{item.shippingAddress.city}, {item.shippingAddress.pincode}</p>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">Awaiting from user</span>
                                    )}
                                </td>
                                <td className="px-4 py-3"><FulfillmentBadge status={item.status} /></td>
                                <td className="px-4 py-3 text-slate-600 font-mono">{item.trackingNumber ?? '—'}</td>
                                <td className="px-4 py-3 text-slate-500">{fmtDate(item.createdAt)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {item.status === 'processing' && (
                                            <button onClick={() => promptShip(item)} disabled={updating === item.id}
                                                className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-bold">
                                                <Truck size={11} /> Ship
                                            </button>
                                        )}
                                        {item.status === 'shipped' && (
                                            <button onClick={() => markStatus(item.id, 'delivered')} disabled={updating === item.id}
                                                className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold">
                                                <CheckCircle size={11} /> Mark Delivered
                                            </button>
                                        )}
                                        {['pending', 'processing'].includes(item.status) && (
                                            <button onClick={() => markStatus(item.id, 'cancelled')} disabled={updating === item.id}
                                                className="px-2 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="p-4 flex items-center justify-between border-t border-slate-100">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"><ChevronLeft size={14} /></button>
                        <span className="text-xs font-bold text-slate-700">{page + 1} / {totalPages}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
                            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"><ChevronRight size={14} /></button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Redemptions tab ───────────────────────────────────────────────────────────

const RedemptionsTable = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 15;

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllReferralRedemptions({ limit, offset: page * limit });
            setData(res.data ?? []);
            setTotal(res.pagination?.total ?? 0);
        } catch { setData([]); }
        finally { setLoading(false); }
    }, [page]);

    useEffect(() => { load(); }, [load]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-black text-slate-800 text-sm">All Referral Records</span>
                <button onClick={load} className="p-1.5 hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            <table className="w-full text-xs">
                <thead><tr className="border-b border-slate-100 bg-slate-50">
                    {['Referrer', 'Referred User', 'Joined', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-bold text-slate-500">{h}</th>
                    ))}
                </tr></thead>
                <tbody>
                    {loading ? <tr><td colSpan={5} className="text-center py-12 text-slate-400 animate-pulse">Loading…</td></tr>
                        : data.map(r => (
                            <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                                <td className="px-4 py-3 font-semibold text-slate-700">{r.referrerUser?.email ?? '—'}</td>
                                <td className="px-4 py-3 text-slate-600">{r.referredUser?.email ?? '—'}</td>
                                <td className="px-4 py-3 text-slate-400">{fmtDate(r.referredUser?.createdAt)}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-400">{fmtDate(r.createdAt)}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="p-4 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-400">{total} records</span>
                    <div className="flex gap-2 items-center">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"><ChevronLeft size={14} /></button>
                        <span className="text-xs font-bold">{page + 1}/{totalPages}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
                            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40"><ChevronRight size={14} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ReferralManagement() {
    const [tab, setTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = useCallback(async () => {
        setLoading(true);
        try { setStats(await getReferralStats()); } catch { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { loadStats(); }, [loadStats]);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'milestones', label: 'Milestones' },
        { id: 'fulfillment', label: `Fulfillment Queue${stats?.pendingFulfillments ? ` (${stats.pendingFulfillments})` : ''}` },
        { id: 'redemptions', label: 'All Referrals' },
        { id: 'top', label: 'Top Referrers' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Referral Program</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Milestone-based rewards — physical items shipped after N referrals</p>
                </div>
                <button onClick={loadStats} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users size={18} className="text-emerald-600" />} label="Total Referrals" value={stats?.totalRedemptions ?? '—'} color="bg-emerald-50" />
                <StatCard icon={<CheckCircle size={18} className="text-blue-600" />} label="Successful" value={stats?.successfulReferrals ?? '—'} color="bg-blue-50" />
                <StatCard icon={<Package size={18} className="text-orange-600" />} label="Pending Fulfilment" value={stats?.pendingFulfillments ?? '—'} color="bg-orange-50" />
                <StatCard icon={<Truck size={18} className="text-purple-600" />} label="Shipped" value={stats?.shippedFulfillments ?? '—'} color="bg-purple-50" />
            </div>

            <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit flex-wrap">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'overview' && (
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="font-black text-slate-800 mb-4">Active Milestones</h3>
                        {!stats?.activeMilestones?.length ? (
                            <p className="text-slate-400 text-sm">No milestones configured. Go to the Milestones tab.</p>
                        ) : (
                            <div className="space-y-2">
                                {stats.activeMilestones.map(m => (
                                    <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center font-black text-emerald-700 text-xs">{m.referralCount}</div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-700">
                                                {m.referralCount} referrals → {m.rewardType === 'physical_item' ? m.rewardItem : fmt(m.rewardAmount)}
                                            </p>
                                            {m.rewardLabel && <p className="text-xs text-slate-400">{m.rewardLabel}</p>}
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.rewardType === 'physical_item' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {m.rewardType === 'physical_item' ? 'Physical' : 'Credit'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h3 className="font-black text-slate-800 mb-4">Top 5 Referrers</h3>
                        {(stats?.topReferrers ?? []).slice(0, 5).map((r, i) => (
                            <div key={r.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                <span className="w-5 text-xs font-black text-slate-400">#{i + 1}</span>
                                <p className="flex-1 text-xs font-semibold text-slate-700 truncate">{r.user?.email ?? '—'}</p>
                                <span className="font-black text-emerald-700 text-sm">{r.referralCount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {tab === 'milestones' && <MilestonesPanel />}
            {tab === 'fulfillment' && <FulfillmentQueue />}
            {tab === 'redemptions' && <RedemptionsTable />}
            {tab === 'top' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                    {(stats?.topReferrers ?? []).map((r, i) => (
                        <div key={r.id} className="flex items-center gap-4 px-5 py-4">
                            <span className="w-6 text-center font-black text-slate-400 text-sm">#{i + 1}</span>
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-700 text-xs shrink-0">
                                {r.user?.email?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm truncate">{r.user?.email ?? '—'}</p>
                                <p className="text-xs text-slate-400">Code: {r.referralCode}</p>
                            </div>
                            <span className="font-black text-emerald-700">{r.referralCount} referrals</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
