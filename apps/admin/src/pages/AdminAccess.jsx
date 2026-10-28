import React, { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, ShieldCheck, Trash2, UserRoundCheck } from 'lucide-react';
import {
    createAdminFeatureAccess,
    deleteAdminFeatureAccess,
    listAdminFeatureAccess,
    listAdminFeatureAccessFeatures,
} from '../services/api';
import Toast from '../components/common/Toast.jsx';

const AdminAccess = () => {
    const [features, setFeatures] = useState([]);
    const [activeFeature, setActiveFeature] = useState('SUPPORT');
    const [rows, setRows] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const activeLabel = useMemo(
        () => features.find((feature) => feature.key === activeFeature)?.label || activeFeature,
        [features, activeFeature]
    );

    const loadFeatures = async () => {
        const res = await listAdminFeatureAccessFeatures();
        setFeatures(res ?? []);
        if (res?.length && !res.some((feature) => feature.key === activeFeature)) {
            setActiveFeature(res[0].key);
        }
    };

    const loadRows = async () => {
        setLoading(true);
        try {
            const res = await listAdminFeatureAccess({ featureKey: activeFeature, isActive: true });
            setRows(res ?? []);
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Failed to load access list.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeatures().catch((error) => {
            setToast({ type: 'error', message: error.message || 'Failed to load features.' });
        });
    }, []);

    useEffect(() => {
        if (activeFeature) {
            loadRows();
        }
    }, [activeFeature]);

    const addEmail = async (event) => {
        event.preventDefault();
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) return;

        setSaving(true);
        try {
            await createAdminFeatureAccess({ featureKey: activeFeature, email: normalizedEmail });
            setEmail('');
            setToast({ type: 'success', message: `${normalizedEmail} added to ${activeLabel}.` });
            await loadRows();
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Failed to add email.' });
        } finally {
            setSaving(false);
        }
    };

    const removeEmail = async (row) => {
        if (!window.confirm(`Remove ${row.email} from ${activeLabel}?`)) return;

        try {
            await deleteAdminFeatureAccess(row.id);
            setToast({ type: 'success', message: `${row.email} removed from ${activeLabel}.` });
            await loadRows();
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Failed to remove email.' });
        }
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Access</h1>
                            <p className="text-sm font-semibold text-slate-500">
                                Manage Google email access for sensitive admin areas.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={loadRows}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                    <button
                        key={feature.key}
                        onClick={() => setActiveFeature(feature.key)}
                        className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                            activeFeature === feature.key
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                    >
                        {feature.label}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">{activeLabel}</h2>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            Active Google emails with this feature access.
                        </p>
                    </div>
                </div>

                <form onSubmit={addEmail} className="p-5 border-b border-slate-100 flex flex-col gap-3 md:flex-row">
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@company.com"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                    <button
                        type="submit"
                        disabled={saving || !email.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:bg-slate-300"
                    >
                        <Plus size={16} />
                        Add Email
                    </button>
                </form>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-10 text-center text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
                            Loading access list...
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="p-10 text-center">
                            <UserRoundCheck size={32} className="mx-auto text-slate-300" />
                            <p className="mt-3 text-sm font-bold text-slate-500">No emails added yet.</p>
                        </div>
                    ) : (
                        rows.map((row) => (
                            <div key={row.id} className="flex items-center justify-between gap-4 px-5 py-4">
                                <div>
                                    <p className="text-sm font-black text-slate-800">{row.email}</p>
                                    <p className="text-xs font-semibold text-slate-400">
                                        Added {row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeEmail(row)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"
                                    title="Remove access"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAccess;
