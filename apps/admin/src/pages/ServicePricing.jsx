import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  History,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  createTaskCatalogServiceAdmin,
  getTaskCatalogServiceAuditAdmin,
  listTaskCatalogDomainsAdmin,
  listTaskCatalogServicesAdmin,
  updateTaskCatalogServiceAdmin,
} from '../services/api';

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  domainId: '',
  subcategoryId: '',
  pricingModel: 'FIXED',
  billingUnit: 'TASK',
  minPrice: 0,
  recommendedMinPrice: '',
  recommendedMaxPrice: '',
  launchGuideMaxPrice: '',
  highValueThreshold: '',
  currency: 'INR',
  allowCustomBudget: true,
  allowBudgetRange: true,
  allowNegotiation: true,
  requiresScopeQuestions: false,
  requiresManualReview: false,
  isRecurringSupported: false,
  isActive: true,
  isLaunchVisible: true,
  displayOrder: 0,
  reason: '',
};

function Field({ label, children, hint }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10';

const Toggle = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
      checked
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
    }`}
  >
    <span>{label}</span>
    <span className={`h-5 w-9 rounded-full p-0.5 transition ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`}>
      <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-4' : ''}`} />
    </span>
  </button>
);

const toForm = (service) => ({
  ...emptyForm,
  ...service,
  domainId: service?.domain?.id || service?.domainId || '',
  subcategoryId: service?.subcategory?.id || service?.subcategoryId || '',
  recommendedMinPrice: service?.recommendedMinPrice ?? '',
  recommendedMaxPrice: service?.recommendedMaxPrice ?? '',
  launchGuideMaxPrice: service?.launchGuideMaxPrice ?? '',
  highValueThreshold: service?.highValueThreshold ?? '',
  reason: '',
});

const numberOrUndefined = (value) => (value === '' || value == null ? undefined : Number(value));

function ServiceModal({ mode, service, domains, selectedDomainId, onClose, onSaved }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(() => ({
    ...(isEdit ? toForm(service) : emptyForm),
    domainId: isEdit ? toForm(service).domainId : selectedDomainId || '',
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const domain = domains.find((item) => item.id === form.domainId);
  const subcategories = domain?.subcategories || [];

  const set = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === 'name' && !isEdit) next.slug = slugify(value);
      if (key === 'domainId') next.subcategoryId = '';
      return next;
    });
  };

  const save = async () => {
    if (!form.name.trim()) {
      setError('Service name is required');
      return;
    }
    if (!form.domainId) {
      setError('Select a category');
      return;
    }
    if (Number(form.minPrice) < 0) {
      setError('Minimum price cannot be negative');
      return;
    }
    if (
      form.recommendedMinPrice !== '' &&
      form.recommendedMaxPrice !== '' &&
      Number(form.recommendedMinPrice) > Number(form.recommendedMaxPrice)
    ) {
      setError('Recommended min cannot be greater than recommended max');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        pricingModel: form.pricingModel,
        billingUnit: form.billingUnit,
        minPrice: Number(form.minPrice || 0),
        recommendedMinPrice: numberOrUndefined(form.recommendedMinPrice),
        recommendedMaxPrice: numberOrUndefined(form.recommendedMaxPrice),
        launchGuideMaxPrice: numberOrUndefined(form.launchGuideMaxPrice),
        highValueThreshold: numberOrUndefined(form.highValueThreshold),
        currency: form.currency || 'INR',
        allowCustomBudget: Boolean(form.allowCustomBudget),
        allowBudgetRange: Boolean(form.allowBudgetRange),
        allowNegotiation: Boolean(form.allowNegotiation),
        requiresScopeQuestions: Boolean(form.requiresScopeQuestions),
        requiresManualReview: Boolean(form.requiresManualReview),
        isRecurringSupported: Boolean(form.isRecurringSupported),
        isActive: Boolean(form.isActive),
        isLaunchVisible: Boolean(form.isLaunchVisible),
        displayOrder: Number(form.displayOrder || 0),
        reason: form.reason?.trim() || undefined,
      };

      if (isEdit) {
        await updateTaskCatalogServiceAdmin(service.id, payload);
      } else {
        await createTaskCatalogServiceAdmin({
          ...payload,
          slug: slugify(form.slug || form.name),
          domainId: form.domainId,
          subcategoryId: form.subcategoryId || undefined,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-950">{isEdit ? 'Edit Service' : 'Add Service'}</h2>
            <p className="mt-1 text-sm text-slate-500">Controls publishing minimums and frontend recommendations.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category">
              <select
                disabled={isEdit}
                value={form.domainId}
                onChange={(event) => set('domainId', event.target.value)}
                className={inputClass}
              >
                <option value="">Select category</option>
                {domains.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Subcategory">
              <select
                disabled={isEdit || !form.domainId}
                value={form.subcategoryId || ''}
                onChange={(event) => set('subcategoryId', event.target.value)}
                className={inputClass}
              >
                <option value="">No subcategory</option>
                {subcategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Service Name">
              <input value={form.name} onChange={(event) => set('name', event.target.value)} className={inputClass} />
            </Field>
            <Field label="Slug" hint={isEdit ? 'Slug is locked after creation.' : 'Used by task creation and templates.'}>
              <input
                disabled={isEdit}
                value={form.slug}
                onChange={(event) => set('slug', slugify(event.target.value))}
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description || ''}
                onChange={(event) => set('description', event.target.value)}
                rows={3}
                className={`${inputClass} resize-none md:col-span-2`}
              />
            </Field>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Field label="Min Price">
              <input type="number" min="0" value={form.minPrice} onChange={(event) => set('minPrice', event.target.value)} className={inputClass} />
            </Field>
            <Field label="Recommended Min">
              <input type="number" min="0" value={form.recommendedMinPrice} onChange={(event) => set('recommendedMinPrice', event.target.value)} className={inputClass} />
            </Field>
            <Field label="Recommended Max">
              <input type="number" min="0" value={form.recommendedMaxPrice} onChange={(event) => set('recommendedMaxPrice', event.target.value)} className={inputClass} />
            </Field>
            <Field label="Launch Guide Max">
              <input type="number" min="0" value={form.launchGuideMaxPrice} onChange={(event) => set('launchGuideMaxPrice', event.target.value)} className={inputClass} />
            </Field>
            <Field label="High Value Review">
              <input type="number" min="0" value={form.highValueThreshold} onChange={(event) => set('highValueThreshold', event.target.value)} className={inputClass} />
            </Field>
            <Field label="Pricing Model">
              <select value={form.pricingModel} onChange={(event) => set('pricingModel', event.target.value)} className={inputClass}>
                <option value="FIXED">Fixed</option>
                <option value="RANGE">Range</option>
                <option value="HOURLY">Hourly</option>
              </select>
            </Field>
            <Field label="Billing Unit">
              <select value={form.billingUnit} onChange={(event) => set('billingUnit', event.target.value)} className={inputClass}>
                <option value="TASK">Task</option>
                <option value="HOUR">Hour</option>
                <option value="DAY">Day</option>
                <option value="MONTH">Month</option>
              </select>
            </Field>
            <Field label="Display Order">
              <input type="number" value={form.displayOrder} onChange={(event) => set('displayOrder', event.target.value)} className={inputClass} />
            </Field>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Toggle label="Active" checked={form.isActive} onChange={(value) => set('isActive', value)} />
            <Toggle label="Launch Visible" checked={form.isLaunchVisible} onChange={(value) => set('isLaunchVisible', value)} />
            <Toggle label="Custom Budget" checked={form.allowCustomBudget} onChange={(value) => set('allowCustomBudget', value)} />
            <Toggle label="Budget Range" checked={form.allowBudgetRange} onChange={(value) => set('allowBudgetRange', value)} />
            <Toggle label="Negotiation" checked={form.allowNegotiation} onChange={(value) => set('allowNegotiation', value)} />
            <Toggle label="Scope Questions" checked={form.requiresScopeQuestions} onChange={(value) => set('requiresScopeQuestions', value)} />
            <Toggle label="Manual Review" checked={form.requiresManualReview} onChange={(value) => set('requiresManualReview', value)} />
            <Toggle label="Recurring" checked={form.isRecurringSupported} onChange={(value) => set('isRecurringSupported', value)} />
          </div>

          <div className="mt-6">
            <Field label="Change Reason">
              <input
                value={form.reason}
                onChange={(event) => set('reason', event.target.value)}
                placeholder="Example: Launch pricing update"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving' : 'Save Service'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AuditPanel({ service, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getTaskCatalogServiceAuditAdmin(service.id)
      .then((data) => {
        if (alive) setRows(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (alive) setError(err.message || 'Failed to load audit history');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [service.id]);

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-black text-slate-950">Pricing Audit</h2>
          <p className="mt-1 text-sm text-slate-500">{service.name}</p>
        </div>
        <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close audit">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Loader2 size={16} className="animate-spin" /> Loading audit history
          </div>
        )}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
        {!loading && !error && rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-400">
            No audit history yet.
          </div>
        )}
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-900">{row.reason || 'Pricing updated'}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {row.changedByUser?.email || 'System'} - {new Date(row.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">
                  v{row.after?.pricingVersion ?? '-'}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-semibold">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-slate-400">Before</p>
                  <p className="mt-1 text-slate-700">Min {money(row.before?.minPrice)}</p>
                  <p className="text-slate-500">
                    Rec {money(row.before?.recommendedMinPrice)} - {money(row.before?.recommendedMaxPrice)}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-emerald-500">After</p>
                  <p className="mt-1 text-slate-800">Min {money(row.after?.minPrice)}</p>
                  <p className="text-slate-600">
                    Rec {money(row.after?.recommendedMinPrice)} - {money(row.after?.recommendedMaxPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ServicePricing = () => {
  const [domains, setDomains] = useState([]);
  const [services, setServices] = useState([]);
  const [activeDomainId, setActiveDomainId] = useState('all');
  const [query, setQuery] = useState('');
  const [showInactive, setShowInactive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [auditService, setAuditService] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [domainRows, serviceRows] = await Promise.all([
        listTaskCatalogDomainsAdmin(),
        listTaskCatalogServicesAdmin(),
      ]);
      const nextDomains = Array.isArray(domainRows) ? domainRows : [];
      setDomains(nextDomains);
      setServices(Array.isArray(serviceRows) ? serviceRows : []);
      setActiveDomainId((current) => {
        if (current !== 'all') return current;
        return nextDomains[0]?.id || 'all';
      });
    } catch (err) {
      setError(err.message || 'Failed to load service catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeDomain = domains.find((domain) => domain.id === activeDomainId);

  const filteredServices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return services.filter((service) => {
      const matchesDomain = activeDomainId === 'all' || service.domain?.id === activeDomainId;
      const matchesState = showInactive || service.isActive;
      const text = [service.name, service.slug, service.domain?.name, service.subcategory?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesDomain && matchesState && (!needle || text.includes(needle));
    });
  }, [activeDomainId, query, services, showInactive]);

  const stats = useMemo(() => {
    const active = services.filter((service) => service.isActive).length;
    const launch = services.filter((service) => service.isLaunchVisible).length;
    const min = services.length ? Math.min(...services.map((service) => Number(service.minPrice || 0))) : 0;
    return { total: services.length, active, launch, min };
  }, [services]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-700">
              <SlidersHorizontal size={14} /> Task Catalog
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Service Pricing</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Manage launch categories, service minimums, recommendations, and publish guardrails.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              onClick={() => setModal({ mode: 'create', service: null })}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
            >
              <Plus size={16} /> Add Service
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Total services', stats.total],
            ['Active services', stats.active],
            ['Launch visible', stats.launch],
            ['Lowest minimum', money(stats.min)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveDomainId('all')}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-black transition ${
                    activeDomainId === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomainId(domain.id)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-black transition ${
                      activeDomainId === domain.id ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {domain.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search services"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-72"
                  />
                </div>
                <button
                  onClick={() => setShowInactive((value) => !value)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${
                    showInactive ? 'border-slate-200 text-slate-600' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {showInactive ? 'Showing inactive' : 'Active only'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-72 items-center justify-center gap-2 text-sm font-bold text-slate-500">
              <Loader2 size={18} className="animate-spin" /> Loading service catalog
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3 text-right">Min</th>
                    <th className="px-5 py-3 text-right">Recommended</th>
                    <th className="px-5 py-3 text-right">Guide Max</th>
                    <th className="px-5 py-3">Controls</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="align-top hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className={`mt-1 h-2.5 w-2.5 rounded-full ${service.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <div>
                            <p className="font-black text-slate-950">{service.name}</p>
                            <p className="mt-0.5 text-xs font-semibold text-slate-400">{service.slug}</p>
                            {service.description && <p className="mt-2 max-w-md text-sm text-slate-500">{service.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-slate-800">{service.domain?.name || '-'}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">{service.subcategory?.name || 'No subcategory'}</p>
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-black text-slate-950">{money(service.minPrice)}</td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-slate-700">
                        {service.recommendedMinPrice != null || service.recommendedMaxPrice != null
                          ? `${money(service.recommendedMinPrice)} - ${money(service.recommendedMaxPrice)}`
                          : '-'}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-slate-700">
                        {service.launchGuideMaxPrice != null ? money(service.launchGuideMaxPrice) : '-'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {service.isLaunchVisible && <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">Launch</span>}
                          {service.allowCustomBudget && <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">Custom</span>}
                          {service.allowBudgetRange && <span className="rounded-full bg-purple-50 px-2 py-1 text-xs font-black text-purple-700">Range</span>}
                          {service.requiresManualReview && <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-black text-amber-700">Review</span>}
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">v{service.pricingVersion}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setAuditService(service)}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-white hover:text-slate-900"
                            title="Audit history"
                          >
                            <History size={16} />
                          </button>
                          <button
                            onClick={() => setModal({ mode: 'edit', service })}
                            className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100"
                            title="Edit service"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredServices.length === 0 && (
                <div className="flex min-h-56 flex-col items-center justify-center text-center">
                  <CheckCircle2 size={30} className="text-slate-300" />
                  <p className="mt-3 text-sm font-bold text-slate-500">No services match the current filters.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {activeDomain && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            <span className="font-black text-slate-800">{activeDomain.name}</span> includes{' '}
            {(activeDomain.subcategories || []).map((item) => item.name).join(', ') || 'no configured subcategories'}.
          </div>
        )}
      </div>

      {modal && (
        <ServiceModal
          mode={modal.mode}
          service={modal.service}
          domains={domains}
          selectedDomainId={activeDomainId !== 'all' ? activeDomainId : domains[0]?.id}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
      {auditService && <AuditPanel service={auditService} onClose={() => setAuditService(null)} />}
    </div>
  );
};

export default ServicePricing;
