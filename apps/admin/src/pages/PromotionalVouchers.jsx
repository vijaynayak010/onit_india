import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Gift, Plus, RefreshCw, Save, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import {
    addVoucherAchievementOption,
    createPromotionalVoucherTemplate,
    createVoucherAchievementRule,
    listPromotionalVoucherIssued,
    listPromotionalVoucherTemplates,
    listPromotionalVoucherUnlocks,
    listVoucherAchievementRules,
    removeVoucherAchievementOption,
    updatePromotionalVoucherTemplate,
    updateVoucherAchievementRule,
} from '../services/api.js';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n ?? 0);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const TRIGGER_LABELS = {
    tasks_completed: 'Tasks Completed',
    tasks_posted: 'Tasks Posted',
    tasks_assigned: 'Tasks Assigned',
    payments_made: 'Payments Made',
    earnings_reached: 'Earnings Reached',
};

const StatusPill = ({ active }) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {active ? 'Active' : 'Inactive'}
    </span>
);

const TemplateModal = ({ onClose, onSaved }) => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        codePrefix: '',
        brandName: '',
        logoUrl: '',
        bannerUrl: '',
        brandColor: '',
        redemptionUrl: '',
        redemptionInstructions: '',
        title: '',
        description: '',
        discountType: 'FLAT',
        discountAmount: '',
        minOrderValue: '',
        maxDiscountCap: '',
        validityDaysAfterGrant: '30',
        validUntil: '',
    });
    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
    const save = async () => {
        if (!form.title.trim()) return setError('Title is required');
        if (!form.discountAmount || Number(form.discountAmount) <= 0) return setError('Discount amount is required');
        setSaving(true); setError('');
        try {
            await createPromotionalVoucherTemplate({
                codePrefix: form.codePrefix || undefined,
                brandName: form.brandName || undefined,
                logoUrl: form.logoUrl || undefined,
                bannerUrl: form.bannerUrl || undefined,
                brandColor: form.brandColor || undefined,
                redemptionUrl: form.redemptionUrl || undefined,
                redemptionInstructions: form.redemptionInstructions || undefined,
                title: form.title,
                description: form.description || undefined,
                discountType: form.discountType,
                discountAmount: Number(form.discountAmount),
                minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
                maxDiscountCap: form.maxDiscountCap ? Number(form.maxDiscountCap) : undefined,
                validityDaysAfterGrant: form.validityDaysAfterGrant ? Number(form.validityDaysAfterGrant) : undefined,
                validUntil: form.validUntil || undefined,
            });
            onSaved();
            onClose();
        } catch (e) {
            setError(e.message ?? 'Failed to save voucher');
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-black text-slate-900">New Promotional Voucher</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
                    <div className="grid grid-cols-2 gap-3">
                        <input value={form.codePrefix} onChange={set('codePrefix')} placeholder="Code prefix e.g. SWIGGY" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input value={form.brandName} onChange={set('brandName')} placeholder="Brand name e.g. Swiggy" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input value={form.title} onChange={set('title')} placeholder="Voucher title" className="col-span-2 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input value={form.logoUrl} onChange={set('logoUrl')} placeholder="Logo URL" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input value={form.bannerUrl} onChange={set('bannerUrl')} placeholder="Banner image URL" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input value={form.brandColor} onChange={set('brandColor')} placeholder="Brand color e.g. #FC8019" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input value={form.redemptionUrl} onChange={set('redemptionUrl')} placeholder="Redemption URL" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <textarea value={form.description} onChange={set('description')} placeholder="Voucher description" className="col-span-2 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold min-h-16" />
                        <textarea value={form.redemptionInstructions} onChange={set('redemptionInstructions')} placeholder="Redemption instructions" className="col-span-2 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold min-h-16" />
                        <select value={form.discountType} onChange={set('discountType')} className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold">
                            <option value="FLAT">Flat Amount</option>
                            <option value="PERCENT">Percent</option>
                        </select>
                        <input type="number" value={form.discountAmount} onChange={set('discountAmount')} placeholder="Value" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input type="number" value={form.minOrderValue} onChange={set('minOrderValue')} placeholder="Min order value" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input type="number" value={form.maxDiscountCap} onChange={set('maxDiscountCap')} placeholder="Max cap" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input type="number" value={form.validityDaysAfterGrant} onChange={set('validityDaysAfterGrant')} placeholder="Validity days after claim" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <input type="date" value={form.validUntil} onChange={set('validUntil')} className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600">Cancel</button>
                    <button onClick={save} disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50">
                        <Save size={14} /> {saving ? 'Saving...' : 'Create Voucher'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AchievementModal = ({ templates, onClose, onSaved }) => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [form, setForm] = useState({
        title: '',
        triggerType: 'tasks_completed',
        triggerCount: '',
        triggerMode: 'cumulative',
        userType: 'performer',
        description: '',
    });
    const activeTemplates = templates.filter((t) => t.isActive);
    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
    const toggleTemplate = (id) => {
        setSelectedTemplates((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
    };
    const save = async () => {
        if (!form.triggerCount || Number(form.triggerCount) < 1) return setError('Trigger count is required');
        if (selectedTemplates.length === 0) return setError('Select at least one voucher option');
        setSaving(true); setError('');
        try {
            const rule = await createVoucherAchievementRule({
                title: form.title || `${form.triggerCount} ${TRIGGER_LABELS[form.triggerType]}`,
                triggerType: form.triggerType,
                triggerCount: Number(form.triggerCount),
                triggerMode: form.triggerMode,
                userType: form.userType,
                description: form.description || undefined,
            });
            await Promise.all(selectedTemplates.map((voucherTemplateId, idx) =>
                addVoucherAchievementOption(rule.id, { voucherTemplateId, displayOrder: idx })
            ));
            onSaved();
            onClose();
        } catch (e) {
            setError(e.message ?? 'Failed to save achievement');
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="font-black text-slate-900">New Achievement</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
                    <div className="grid grid-cols-2 gap-3">
                        <input value={form.title} onChange={set('title')} placeholder="Achievement title" className="col-span-2 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <select value={form.triggerType} onChange={set('triggerType')} className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold">
                            {Object.entries(TRIGGER_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <input type="number" value={form.triggerCount} onChange={set('triggerCount')} placeholder="Milestone count e.g. 10" className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold" />
                        <select value={form.userType} onChange={set('userType')} className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold">
                            <option value="performer">Performer</option>
                            <option value="provider">Provider</option>
                            <option value="all">All users</option>
                        </select>
                        <select value={form.triggerMode} onChange={set('triggerMode')} className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold">
                            <option value="cumulative">Once at milestone</option>
                            <option value="recurring">Every N times</option>
                        </select>
                        <textarea value={form.description} onChange={set('description')} placeholder="Description" className="col-span-2 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold min-h-16" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Voucher options user can choose from</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {activeTemplates.map((template) => (
                                <label key={template.id} className={`border rounded-xl p-3 cursor-pointer ${selectedTemplates.includes(template.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" checked={selectedTemplates.includes(template.id)} onChange={() => toggleTemplate(template.id)} />
                                        {template.logoUrl ? <img src={template.logoUrl} alt="" className="h-8 w-8 rounded-lg object-cover" /> : <Gift size={18} className="text-slate-300" />}
                                        <div>
                                            <span className="font-black text-sm text-slate-800">{template.title}</span>
                                            <span className="block text-xs text-slate-500 mt-1">{template.brandName || template.codePrefix || 'Voucher'} · {template.discountType === 'FLAT' ? fmt(template.discountAmount) : `${template.discountAmount}%`} off</span>
                                        </div>
                                    </div>
                                </label>
                            ))}
                            {activeTemplates.length === 0 && <p className="text-sm text-red-500">Create active voucher templates first.</p>}
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600">Cancel</button>
                    <button onClick={save} disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50">
                        <Save size={14} /> {saving ? 'Saving...' : 'Create Achievement'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function PromotionalVouchers() {
    const [tab, setTab] = useState('templates');
    const [templates, setTemplates] = useState([]);
    const [rules, setRules] = useState([]);
    const [unlocks, setUnlocks] = useState([]);
    const [issued, setIssued] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [templateRes, ruleRes, unlockRes, issuedRes] = await Promise.all([
                listPromotionalVoucherTemplates({ limit: 50, offset: 0, status: 'all' }),
                listVoucherAchievementRules(),
                listPromotionalVoucherUnlocks(),
                listPromotionalVoucherIssued(),
            ]);
            setTemplates(templateRes.data ?? []);
            setRules(Array.isArray(ruleRes) ? ruleRes : []);
            setUnlocks(Array.isArray(unlockRes) ? unlockRes : []);
            setIssued(Array.isArray(issuedRes) ? issuedRes : []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const templateById = useMemo(() => new Map(templates.map((t) => [t.id, t])), [templates]);

    const toggleTemplate = async (template) => {
        await updatePromotionalVoucherTemplate(template.id, { isActive: !template.isActive });
        load();
    };

    const toggleRule = async (rule) => {
        await updateVoucherAchievementRule(rule.id, { isActive: !rule.isActive });
        load();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Promotional Vouchers</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Create voucher choices and unlock them through achievement milestones</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    {tab === 'templates' && <button onClick={() => setModal('template')} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center gap-2"><Plus size={16} /> New Voucher</button>}
                    {tab === 'achievements' && <button onClick={() => setModal('achievement')} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center gap-2"><Plus size={16} /> New Achievement</button>}
                </div>
            </div>

            <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
                {[
                    ['templates', 'Voucher Templates'],
                    ['achievements', 'Achievements'],
                    ['unlocks', 'User Unlocks'],
                    ['issued', 'Claimed Vouchers'],
                ].map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{label}</button>
                ))}
            </div>

            {tab === 'templates' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>{['Voucher', 'Value', 'Validity', 'Issued', 'Status', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left font-bold text-slate-500">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {templates.map((template) => (
                                <tr key={template.id} className="border-b border-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {template.logoUrl ? (
                                                <img src={template.logoUrl} alt="" className="h-10 w-10 rounded-xl object-cover border border-slate-100" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                                                    <Gift size={16} className="text-slate-300" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-black text-slate-800">{template.title}</p>
                                                <p className="text-slate-400">{template.brandName || template.codePrefix || 'No brand'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-700">{template.discountType === 'FLAT' ? fmt(template.discountAmount) : `${template.discountAmount}%`}</td>
                                    <td className="px-4 py-3 text-slate-500">{template.validityDaysAfterGrant ? `${template.validityDaysAfterGrant} days after claim` : fmtDate(template.validUntil)}</td>
                                    <td className="px-4 py-3 text-slate-700 font-bold">{template._count?.issuedVouchers ?? template.totalGrantCount}</td>
                                    <td className="px-4 py-3"><StatusPill active={template.isActive} /></td>
                                    <td className="px-4 py-3"><button onClick={() => toggleTemplate(template)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">{template.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'achievements' && (
                <div className="space-y-3">
                    {rules.map((rule) => (
                        <div key={rule.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-black text-slate-900">{rule.title || `${rule.triggerCount} ${TRIGGER_LABELS[rule.triggerType]}`}</p>
                                    <p className="text-xs text-slate-500 mt-1">{TRIGGER_LABELS[rule.triggerType]} · {rule.triggerCount} · {rule.triggerMode} · {rule.userType}</p>
                                </div>
                                <button onClick={() => toggleRule(rule)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">{rule.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}</button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {(rule.options || []).map((option) => (
                                    <span key={option.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                                        {option.voucherTemplate?.logoUrl && <img src={option.voucherTemplate.logoUrl} alt="" className="h-5 w-5 rounded object-cover" />}
                                        {option.voucherTemplate?.title || templateById.get(option.voucherTemplateId)?.title}
                                        <button onClick={() => removeVoucherAchievementOption(option.id).then(load)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'unlocks' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-50"><tr>{['User', 'Achievement', 'Snapshot', 'Status', 'Unlocked'].map((h) => <th key={h} className="px-4 py-3 text-left font-bold text-slate-500">{h}</th>)}</tr></thead>
                        <tbody>{unlocks.map((u) => <tr key={u.id} className="border-b border-slate-50"><td className="px-4 py-3">{u.user?.email || u.userId}</td><td className="px-4 py-3">{u.achievementRule?.title || TRIGGER_LABELS[u.achievementRule?.triggerType]}</td><td className="px-4 py-3">{u.triggerSnapshot}</td><td className="px-4 py-3 font-bold">{u.status}</td><td className="px-4 py-3">{fmtDate(u.unlockedAt)}</td></tr>)}</tbody>
                    </table>
                </div>
            )}

            {tab === 'issued' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-50"><tr>{['User', 'Voucher', 'Achievement', 'Status', 'Claimed', 'Expires'].map((h) => <th key={h} className="px-4 py-3 text-left font-bold text-slate-500">{h}</th>)}</tr></thead>
                        <tbody>{issued.map((v) => <tr key={v.id} className="border-b border-slate-50"><td className="px-4 py-3">{v.user?.email || v.userId}</td><td className="px-4 py-3">{v.voucherTemplate?.title}</td><td className="px-4 py-3">{v.achievementRule?.title || '-'}</td><td className="px-4 py-3 font-bold">{v.status}</td><td className="px-4 py-3">{fmtDate(v.grantedAt)}</td><td className="px-4 py-3">{fmtDate(v.expiresAt)}</td></tr>)}</tbody>
                    </table>
                </div>
            )}

            {modal === 'template' && <TemplateModal onClose={() => setModal(null)} onSaved={load} />}
            {modal === 'achievement' && <AchievementModal templates={templates} onClose={() => setModal(null)} onSaved={load} />}
        </div>
    );
}
