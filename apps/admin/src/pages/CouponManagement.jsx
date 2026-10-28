import React, { useState, useEffect, useCallback } from 'react';
import {
    listAdminCoupons, createAdminCoupon, updateAdminCoupon,
    deleteAdminCoupon, getAdminCouponUsage, assignCouponUsers,
    listTriggerRules, createTriggerRule, updateTriggerRule,
    deleteTriggerRule, getTriggerRuleStats,
} from '../services/api.js';
import {
    Tag, Plus, Edit3, Trash2, Users, X, Save,
    RefreshCw, AlertCircle, ChevronLeft, ChevronRight,
    Eye, Zap, BarChart2, ToggleLeft, ToggleRight,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const isExpired = (c) => c.validUntil && new Date(c.validUntil) < new Date();

const StatusPill = ({ coupon }) => {
    if (!coupon.isActive) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">Inactive</span>;
    if (isExpired(coupon)) return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">Expired</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>;
};

const AssignmentBadge = ({ type }) => {
    const map = {
        all_users: 'bg-blue-50 text-blue-700',
        specific_users: 'bg-purple-50 text-purple-700',
        first_time_users: 'bg-orange-50 text-orange-700',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[type] ?? 'bg-slate-100 text-slate-600'}`}>
            {type?.replace(/_/g, ' ')}
        </span>
    );
};

const TRIGGER_TYPE_LABELS = {
    tasks_posted: 'Tasks Posted',
    tasks_completed: 'Tasks Completed',
    payments_made: 'Payments Made',
    tasks_assigned: 'Tasks Assigned',
};

const TRIGGER_TYPE_COLORS = {
    tasks_posted: 'bg-blue-100 text-blue-700',
    tasks_completed: 'bg-emerald-100 text-emerald-700',
    payments_made: 'bg-orange-100 text-orange-700',
    tasks_assigned: 'bg-purple-100 text-purple-700',
};

const TriggerTypeBadge = ({ type }) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TRIGGER_TYPE_COLORS[type] ?? 'bg-slate-100 text-slate-600'}`}>
        {TRIGGER_TYPE_LABELS[type] ?? type}
    </span>
);

const Input = ({ label, type = 'text', value, onChange, placeholder, optional, hint }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 mb-1.5">
            {label} {optional && <span className="text-slate-300 font-normal">(optional)</span>}
        </label>
        <input
            type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
);

const Select = ({ label, value, onChange, options, optional }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 mb-1.5">
            {label} {optional && <span className="text-slate-300 font-normal">(optional)</span>}
        </label>
        <select value={value} onChange={e => onChange(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400">
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

// ── Coupon form modal ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
    code: '', title: '', description: '',
    discountType: 'FLAT', discountAmount: '',
    minOrderValue: '', maxDiscountCap: '',
    validFrom: '', validUntil: '',
    usageLimitPerUser: '1', totalUsageLimit: '',
    assignmentType: 'all_users',
};

const CouponFormModal = ({ initial, onClose, onSaved }) => {
    const isEdit = !!initial?.id;
    const [form, setForm] = useState(initial ? {
        code: initial.code ?? '',
        title: initial.title ?? '',
        description: initial.description ?? '',
        discountType: initial.discountType ?? 'FLAT',
        discountAmount: initial.discountAmount ?? '',
        minOrderValue: initial.minOrderValue ?? '',
        maxDiscountCap: initial.maxDiscountCap ?? '',
        validFrom: initial.validFrom ? initial.validFrom.slice(0, 10) : '',
        validUntil: initial.validUntil ? initial.validUntil.slice(0, 10) : '',
        usageLimitPerUser: initial.usageLimitPerUser ?? 1,
        totalUsageLimit: initial.totalUsageLimit ?? '',
        assignmentType: initial.assignmentType ?? 'all_users',
        isActive: initial.isActive ?? true,
    } : EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

    const save = async () => {
        if (!form.title || !form.discountAmount) { setError('Title and discount amount are required'); return; }
        setSaving(true); setError('');
        try {
            const payload = {
                ...(isEdit ? {} : { code: form.code }),
                title: form.title,
                description: form.description || undefined,
                discountType: form.discountType,
                discountAmount: Number(form.discountAmount),
                minOrderValue: form.minOrderValue !== '' ? Number(form.minOrderValue) : undefined,
                maxDiscountCap: form.maxDiscountCap !== '' ? Number(form.maxDiscountCap) : undefined,
                validFrom: form.validFrom || undefined,
                validUntil: form.validUntil || undefined,
                usageLimitPerUser: Number(form.usageLimitPerUser) || 1,
                totalUsageLimit: form.totalUsageLimit !== '' ? Number(form.totalUsageLimit) : undefined,
                assignmentType: form.assignmentType,
                ...(isEdit ? { isActive: form.isActive } : {}),
            };
            if (isEdit) { await updateAdminCoupon(initial.id, payload); }
            else {
                if (!form.code) { setError('Coupon code is required'); setSaving(false); return; }
                await createAdminCoupon(payload);
            }
            onSaved(); onClose();
        } catch (e) {
            setError(e.message ?? 'Failed to save coupon');
        } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between rounded-t-3xl">
                    <h2 className="font-black text-slate-900 text-lg">{isEdit ? 'Edit Coupon' : 'Create Coupon'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        {!isEdit && (
                            <Input label="Coupon Code" value={form.code} onChange={v => set('code')(v.toUpperCase())}
                                placeholder="e.g. WELCOME50" hint="Uppercase letters and numbers only" />
                        )}
                        <div className={!isEdit ? '' : 'col-span-2'}>
                            <Input label="Title" value={form.title} onChange={set('title')} placeholder="e.g. Welcome Discount" />
                        </div>
                    </div>
                    <Input label="Description" value={form.description} onChange={set('description')}
                        placeholder="Short description visible to users" optional />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Discount Type" value={form.discountType} onChange={set('discountType')} options={[
                            { value: 'FLAT', label: 'Flat Amount (₹)' },
                            { value: 'PERCENT', label: 'Percentage (%)' },
                        ]} />
                        <Input label={`Discount ${form.discountType === 'FLAT' ? 'Amount (₹)' : 'Percent (%)'}`}
                            type="number" value={form.discountAmount} onChange={set('discountAmount')}
                            placeholder={form.discountType === 'FLAT' ? 'e.g. 100' : 'e.g. 20'} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Min Order Value (₹)" type="number" value={form.minOrderValue}
                            onChange={set('minOrderValue')} placeholder="e.g. 500" optional />
                        {form.discountType === 'PERCENT' && (
                            <Input label="Max Discount Cap (₹)" type="number" value={form.maxDiscountCap}
                                onChange={set('maxDiscountCap')} placeholder="e.g. 200" optional
                                hint="Max ₹ off even if % exceeds this" />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Valid From" type="date" value={form.validFrom} onChange={set('validFrom')} optional />
                        <Input label="Valid Until" type="date" value={form.validUntil} onChange={set('validUntil')} optional />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Uses Per User" type="number" value={form.usageLimitPerUser}
                            onChange={set('usageLimitPerUser')} placeholder="1"
                            hint="How many times one user can use this" />
                        <Input label="Total Usage Limit" type="number" value={form.totalUsageLimit}
                            onChange={set('totalUsageLimit')} placeholder="Leave empty for unlimited" optional />
                    </div>
                    <Select label="Availability" value={form.assignmentType} onChange={set('assignmentType')} options={[
                        { value: 'all_users', label: 'All Users (public)' },
                        { value: 'specific_users', label: 'Specific Users (manual assign)' },
                        { value: 'first_time_users', label: 'First-Time Users Only' },
                    ]} />
                    {isEdit && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500">Status:</span>
                            <button onClick={() => set('isActive')(true)}
                                className={`px-4 py-1.5 rounded-xl text-sm font-bold border transition ${form.isActive ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600'}`}>
                                Active
                            </button>
                            <button onClick={() => set('isActive')(false)}
                                className={`px-4 py-1.5 rounded-xl text-sm font-bold border transition ${!form.isActive ? 'bg-red-500 text-white border-red-500' : 'border-slate-200 text-slate-600'}`}>
                                Inactive
                            </button>
                        </div>
                    )}
                </div>
                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
                    <button onClick={onClose} className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">Cancel</button>
                    <button onClick={save} disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 disabled:opacity-50">
                        <Save size={14} /> {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Coupon')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Assign users modal ────────────────────────────────────────────────────────

const AssignUsersModal = ({ coupon, onClose, onSaved }) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const assign = async () => {
        const ids = input.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        if (!ids.length) { setError('Enter at least one user ID'); return; }
        setSaving(true); setError('');
        try {
            const res = await assignCouponUsers(coupon.id, { userIds: ids });
            setResult(res); onSaved();
        } catch (e) { setError(e.message ?? 'Failed to assign users'); }
        finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-black text-slate-900">Assign Users</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{coupon.code}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
                    {result ? (
                        <div className="space-y-2">
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">{result.message}</div>
                            <button onClick={onClose} className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm">Done</button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">User IDs (one per line or comma-separated)</label>
                                <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
                                    placeholder={'uuid-1\nuuid-2\nuuid-3'}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                            </div>
                            <button onClick={assign} disabled={saving}
                                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm disabled:opacity-50">
                                {saving ? 'Assigning…' : 'Assign Users'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Usage analytics drawer ────────────────────────────────────────────────────

const UsageDrawer = ({ coupon, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminCouponUsage(coupon.id).then(setData).catch(() => {}).finally(() => setLoading(false));
    }, [coupon.id]);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between rounded-t-3xl">
                    <div>
                        <h2 className="font-black text-slate-900">Usage Analytics</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{coupon.code} · {coupon.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-5">
                    {loading ? (
                        <p className="text-center text-slate-400 py-10 text-sm animate-pulse">Loading analytics…</p>
                    ) : !data ? (
                        <p className="text-center text-slate-400 py-10 text-sm">Failed to load</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Times Used', value: data.analytics.usedCount, color: 'bg-emerald-50 text-emerald-700' },
                                    { label: 'Pre-granted (available)', value: data.analytics.claimedCount, color: 'bg-blue-50 text-blue-700' },
                                    { label: 'Conversion Rate', value: `${data.analytics.conversionRate}%`, color: 'bg-purple-50 text-purple-700' },
                                    { label: 'Total Discount Given', value: data.analytics.totalDiscountGiven !== null ? fmt(data.analytics.totalDiscountGiven) : 'N/A (% type)', color: 'bg-orange-50 text-orange-700' },
                                ].map(s => (
                                    <div key={s.label} className={`p-4 rounded-2xl ${s.color}`}>
                                        <p className="text-xl font-black">{s.value}</p>
                                        <p className="text-xs font-bold mt-0.5 opacity-70">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-sm mb-3">Recent Usage</h3>
                                {data.recentUsages.length === 0 ? (
                                    <p className="text-slate-400 text-xs text-center py-4">No usage yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {data.recentUsages.map(u => (
                                            <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-xs font-black text-slate-600 shrink-0">
                                                    {u.user?.email?.[0]?.toUpperCase() ?? '?'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-700 truncate">{u.user?.email ?? '—'}</p>
                                                    <p className="text-xs text-slate-400">{fmtDate(u.usedAt ?? u.claimedAt)}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.status === 'used' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {u.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Trigger rule form modal ───────────────────────────────────────────────────

const TriggerRuleModal = ({ initial, coupons, onClose, onSaved }) => {
    const isEdit = !!initial?.id;
    const [form, setForm] = useState({
        couponId: initial?.couponId ?? (coupons[0]?.id ?? ''),
        triggerType: initial?.triggerType ?? 'tasks_posted',
        triggerCount: initial?.triggerCount ?? '',
        triggerMode: initial?.triggerMode ?? 'cumulative',
        description: initial?.description ?? '',
        isActive: initial?.isActive ?? true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

    const save = async () => {
        if (!form.couponId) { setError('Select a coupon'); return; }
        if (!form.triggerCount || Number(form.triggerCount) < 1) { setError('Trigger count must be at least 1'); return; }
        setSaving(true); setError('');
        try {
            const payload = {
                couponId: form.couponId,
                triggerType: form.triggerType,
                triggerCount: Number(form.triggerCount),
                triggerMode: form.triggerMode,
                description: form.description || undefined,
                ...(isEdit ? { isActive: form.isActive } : {}),
            };
            if (isEdit) await updateTriggerRule(initial.id, payload);
            else await createTriggerRule(payload);
            onSaved(); onClose();
        } catch (e) {
            setError(e.message ?? 'Failed to save rule');
        } finally { setSaving(false); }
    };

    const exampleText = () => {
        const type = TRIGGER_TYPE_LABELS[form.triggerType] ?? form.triggerType;
        const count = form.triggerCount || 'N';
        if (form.triggerMode === 'cumulative') {
            return `Grant coupon once when user reaches ${count} ${type.toLowerCase()} total`;
        }
        return `Grant coupon every ${count}th ${type.toLowerCase()} (5th, 10th, 15th…)`;
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between rounded-t-3xl">
                    <h2 className="font-black text-slate-900">{isEdit ? 'Edit Scenario Rule' : 'New Scenario Rule'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Grant this Coupon</label>
                        {coupons.length === 0 ? (
                            <p className="text-xs text-red-500">No coupons available. Create a coupon first.</p>
                        ) : (
                            <select value={form.couponId} onChange={e => set('couponId')(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400">
                                {coupons.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.code} — {c.title} ({c.discountType === 'FLAT' ? fmt(c.discountAmount) : `${c.discountAmount}% off`})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">When User Action</label>
                        <select value={form.triggerType} onChange={e => set('triggerType')(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400">
                            {Object.entries(TRIGGER_TYPE_LABELS).map(([v, l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Reaches Count" type="number" value={form.triggerCount}
                            onChange={set('triggerCount')} placeholder="e.g. 5" />
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Mode</label>
                            <div className="flex flex-col gap-1.5">
                                {[['cumulative', 'Once at N total'], ['recurring', 'Every Nth time']].map(([v, l]) => (
                                    <button key={v} onClick={() => set('triggerMode')(v)}
                                        className={`w-full py-2 rounded-xl text-xs font-bold border transition text-left px-3 ${form.triggerMode === v ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {form.triggerCount && (
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-semibold">
                            {exampleText()}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Description <span className="text-slate-300 font-normal">(optional)</span></label>
                        <input value={form.description} onChange={e => set('description')(e.target.value)}
                            placeholder="e.g. Reward after first 5 tasks posted"
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
                    <button onClick={save} disabled={saving || coupons.length === 0}
                        className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm disabled:opacity-50">
                        <Save size={14} /> {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Rule')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Trigger rule stats drawer ─────────────────────────────────────────────────

const TriggerStatsDrawer = ({ rule, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTriggerRuleStats(rule.id).then(setData).catch(() => {}).finally(() => setLoading(false));
    }, [rule.id]);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between rounded-t-3xl">
                    <div>
                        <h2 className="font-black text-slate-900">Rule Stats</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{rule.description || `${TRIGGER_TYPE_LABELS[rule.triggerType]} × ${rule.triggerCount}`}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} /></button>
                </div>
                <div className="p-6">
                    {loading ? (
                        <p className="text-center text-slate-400 py-10 text-sm animate-pulse">Loading…</p>
                    ) : !data ? (
                        <p className="text-center text-slate-400 py-10 text-sm">Failed to load</p>
                    ) : (
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-blue-50 rounded-2xl">
                                    <p className="text-2xl font-black text-blue-700">{data.totalGrants ?? 0}</p>
                                    <p className="text-xs font-bold text-blue-500 mt-0.5">Total Grants</p>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-2xl">
                                    <p className="text-2xl font-black text-emerald-700">{data.uniqueUsers ?? 0}</p>
                                    <p className="text-xs font-bold text-emerald-500 mt-0.5">Unique Users</p>
                                </div>
                            </div>
                            {data.recentGrants?.length > 0 && (
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm mb-3">Recent Grants</h3>
                                    <div className="space-y-2">
                                        {data.recentGrants.map(g => (
                                            <div key={g.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-xs">
                                                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center font-black text-slate-600 shrink-0">
                                                    {g.user?.email?.[0]?.toUpperCase() ?? '?'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-700 truncate">{g.user?.email ?? '—'}</p>
                                                    <p className="text-slate-400">Snapshot: {g.triggerSnapshot}</p>
                                                </div>
                                                <span className="text-slate-400">{fmtDate(g.createdAt)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Trigger Rules tab ─────────────────────────────────────────────────────────

const TriggerRulesPanel = ({ allCoupons, reloadCoupons }) => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try { setRules(await listTriggerRules()); } catch { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async (rule) => {
        if (!window.confirm(`Delete rule "${rule.description || rule.triggerType}"?`)) return;
        try { await deleteTriggerRule(rule.id); load(); } catch (e) { alert(e.message ?? 'Error'); }
    };

    const toggleActive = async (rule) => {
        try { await updateTriggerRule(rule.id, { isActive: !rule.isActive }); load(); }
        catch (e) { alert(e.message ?? 'Error'); }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-600 font-semibold">Scenario-based auto-grant rules</p>
                    <p className="text-xs text-slate-400 mt-0.5">When a user hits a milestone (e.g. posts 5 tasks), they automatically receive the linked coupon</p>
                </div>
                <button onClick={async () => { await reloadCoupons?.(); setModal('create'); }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm">
                    <Plus size={14} /> New Rule
                </button>
            </div>

            {loading ? (
                <p className="text-center py-10 text-slate-400 text-sm animate-pulse">Loading…</p>
            ) : rules.length === 0 ? (
                <div className="text-center py-14 border-2 border-dashed border-slate-200 rounded-2xl">
                    <Zap size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-400 text-sm font-semibold">No scenario rules yet</p>
                    <p className="text-slate-300 text-xs mt-1">Create a rule to auto-grant coupons based on user actions</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {['Trigger', 'Count', 'Mode', 'Grants Coupon', 'Description', 'Grants', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map(rule => (
                                <tr key={rule.id} className="border-b border-slate-50 hover:bg-slate-50 group">
                                    <td className="px-4 py-3"><TriggerTypeBadge type={rule.triggerType} /></td>
                                    <td className="px-4 py-3 font-black text-slate-800">{rule.triggerCount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${rule.triggerMode === 'recurring' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {rule.triggerMode}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {rule.coupon ? (
                                            <div>
                                                <p className="font-black text-slate-700 font-mono">{rule.coupon.code}</p>
                                                <p className="text-slate-400">{rule.coupon.discountType === 'FLAT' ? fmt(rule.coupon.discountAmount) : `${rule.coupon.discountAmount}% off`}</p>
                                            </div>
                                        ) : <span className="text-slate-300">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{rule.description || '—'}</td>
                                    <td className="px-4 py-3 font-bold text-slate-700">{rule._count?.grants ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => toggleActive(rule)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition ${rule.isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                            {rule.isActive ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                                            {rule.isActive ? 'Active' : 'Off'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => setModal({ type: 'stats', rule })} title="View stats"
                                                className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg">
                                                <BarChart2 size={13} />
                                            </button>
                                            <button onClick={() => setModal({ type: 'edit', rule })} title="Edit"
                                                className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg">
                                                <Edit3 size={13} />
                                            </button>
                                            <button onClick={() => handleDelete(rule)} title="Delete"
                                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal === 'create' && (
                <TriggerRuleModal coupons={allCoupons} onClose={() => setModal(null)} onSaved={load} />
            )}
            {modal?.type === 'edit' && (
                <TriggerRuleModal initial={modal.rule} coupons={allCoupons} onClose={() => setModal(null)} onSaved={load} />
            )}
            {modal?.type === 'stats' && (
                <TriggerStatsDrawer rule={modal.rule} onClose={() => setModal(null)} />
            )}
        </div>
    );
};

// ── Coupon row ────────────────────────────────────────────────────────────────

const CouponRow = ({ coupon, onEdit, onDelete, onAssign, onViewUsage }) => (
    <tr className="border-b border-slate-50 hover:bg-slate-50 transition group">
        <td className="px-4 py-3">
            <p className="font-black text-slate-800 font-mono text-sm">{coupon.code}</p>
            <p className="text-xs text-slate-500 mt-0.5">{coupon.title}</p>
        </td>
        <td className="px-4 py-3">
            <p className="font-bold text-slate-800 text-sm">
                {coupon.discountType === 'FLAT' ? fmt(coupon.discountAmount) : `${coupon.discountAmount}%`}
            </p>
            {coupon.minOrderValue && <p className="text-xs text-slate-400">Min: {fmt(coupon.minOrderValue)}</p>}
            {coupon.maxDiscountCap && <p className="text-xs text-slate-400">Cap: {fmt(coupon.maxDiscountCap)}</p>}
        </td>
        <td className="px-4 py-3"><AssignmentBadge type={coupon.assignmentType} /></td>
        <td className="px-4 py-3">
            <p className="text-xs text-slate-700">{fmtDate(coupon.validFrom)} → {fmtDate(coupon.validUntil)}</p>
        </td>
        <td className="px-4 py-3">
            <p className="text-sm font-bold text-slate-700">{coupon.usageCount} / {coupon.totalUsageLimit ?? '∞'}</p>
            <p className="text-xs text-slate-400">{coupon.usageLimitPerUser} per user</p>
        </td>
        <td className="px-4 py-3"><StatusPill coupon={coupon} /></td>
        <td className="px-4 py-3">
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => onViewUsage(coupon)} title="Usage analytics"
                    className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg"><Eye size={14} /></button>
                <button onClick={() => onEdit(coupon)} title="Edit"
                    className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg"><Edit3 size={14} /></button>
                {coupon.assignmentType === 'specific_users' && (
                    <button onClick={() => onAssign(coupon)} title="Assign users"
                        className="p-1.5 hover:bg-purple-50 text-slate-400 hover:text-purple-600 rounded-lg"><Users size={14} /></button>
                )}
                <button onClick={() => onDelete(coupon)} title="Delete / deactivate"
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={14} /></button>
            </div>
        </td>
    </tr>
);

// ── Main page ─────────────────────────────────────────────────────────────────

const CouponManagement = () => {
    const [activeTab, setActiveTab] = useState('coupons');
    const [coupons, setCoupons] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({ status: 'all', assignmentType: '', search: '' });
    const [modal, setModal] = useState(null);
    const limit = 15;

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listAdminCoupons({
                limit,
                offset: page * limit,
                ...(filters.status !== 'all' && { status: filters.status }),
                ...(filters.assignmentType && { assignmentType: filters.assignmentType }),
                ...(filters.search && { search: filters.search }),
            });
            setCoupons(res.data ?? []);
            setTotal(res.pagination?.total ?? 0);
        } catch { setCoupons([]); }
        finally { setLoading(false); }
    }, [page, filters]);

    // Load active coupons for the trigger-rule coupon picker.
    // Keep this bounded because the backend rejects oversized admin coupon limits.
    const [allActiveCoupons, setAllActiveCoupons] = useState([]);
    const loadActiveCoupons = useCallback(async () => {
        try {
            const res = await listAdminCoupons({ limit: 50, offset: 0, status: 'active' });
            setAllActiveCoupons(res.data ?? []);
        } catch {
            setAllActiveCoupons([]);
        }
    }, []);

    useEffect(() => { loadActiveCoupons(); }, [loadActiveCoupons]);
    useEffect(() => { if (activeTab === 'triggers') loadActiveCoupons(); }, [activeTab, loadActiveCoupons]);

    useEffect(() => { if (activeTab === 'coupons') load(); }, [load, activeTab]);

    const refreshCoupons = useCallback(() => {
        load();
        loadActiveCoupons();
    }, [load, loadActiveCoupons]);

    const handleDelete = async (coupon) => {
        if (!window.confirm(`Delete coupon "${coupon.code}"? If it has usage history it will be deactivated instead.`)) return;
        try { await deleteAdminCoupon(coupon.id); refreshCoupons(); } catch (e) { alert(e.message ?? 'Failed to delete'); }
    };

    const totalPages = Math.ceil(total / limit);

    const tabs = [
        { id: 'coupons', label: 'Coupons', icon: <Tag size={14} /> },
        { id: 'triggers', label: 'Scenario Rules', icon: <Zap size={14} /> },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Coupon Management</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Create coupons and configure auto-grant scenario rules</p>
                </div>
                {activeTab === 'coupons' && (
                    <button onClick={() => setModal('create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition">
                        <Plus size={16} /> New Coupon
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Coupons tab */}
            {activeTab === 'coupons' && (
                <>
                    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <select value={filters.status} onChange={e => { setFilters(p => ({ ...p, status: e.target.value })); setPage(0); }}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400">
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </select>
                        <select value={filters.assignmentType} onChange={e => { setFilters(p => ({ ...p, assignmentType: e.target.value })); setPage(0); }}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400">
                            <option value="">All Types</option>
                            <option value="all_users">All Users</option>
                            <option value="specific_users">Specific Users</option>
                            <option value="first_time_users">First-Time Users</option>
                        </select>
                        <input type="text" value={filters.search}
                            onChange={e => { setFilters(p => ({ ...p, search: e.target.value })); setPage(0); }}
                            placeholder="Search code or title…"
                            className="flex-1 min-w-[180px] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <button onClick={load} className="p-2 hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50">
                                        {['Code / Title', 'Discount', 'Availability', 'Validity', 'Usage', 'Status', 'Actions'].map(h => (
                                            <th key={h} className="px-4 py-3 text-left font-bold text-slate-500 whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={7} className="text-center py-14 text-slate-400 text-sm animate-pulse">Loading coupons…</td></tr>
                                    ) : coupons.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-14 text-slate-400 text-sm">No coupons found</td></tr>
                                    ) : coupons.map(c => (
                                        <CouponRow key={c.id} coupon={c}
                                            onEdit={coupon => setModal({ type: 'edit', coupon })}
                                            onDelete={handleDelete}
                                            onAssign={coupon => setModal({ type: 'assign', coupon })}
                                            onViewUsage={coupon => setModal({ type: 'usage', coupon })}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="p-4 flex items-center justify-between border-t border-slate-100">
                                <p className="text-xs text-slate-500">{total} coupons total</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                                        className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft size={14} /></button>
                                    <span className="text-xs font-bold text-slate-700">{page + 1} / {totalPages}</span>
                                    <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
                                        className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronRight size={14} /></button>
                                </div>
                            </div>
                        )}
                    </div>

                    {modal === 'create' && <CouponFormModal onClose={() => setModal(null)} onSaved={refreshCoupons} />}
                    {modal?.type === 'edit' && <CouponFormModal initial={modal.coupon} onClose={() => setModal(null)} onSaved={refreshCoupons} />}
                    {modal?.type === 'assign' && <AssignUsersModal coupon={modal.coupon} onClose={() => setModal(null)} onSaved={load} />}
                    {modal?.type === 'usage' && <UsageDrawer coupon={modal.coupon} onClose={() => setModal(null)} />}
                </>
            )}

            {/* Scenario Rules tab */}
            {activeTab === 'triggers' && (
                <TriggerRulesPanel allCoupons={allActiveCoupons} reloadCoupons={loadActiveCoupons} />
            )}
        </div>
    );
};

export default CouponManagement;
