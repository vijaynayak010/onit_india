import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Image,
  LayoutGrid,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import Toast from "../components/common/Toast.jsx";
import { getAdminHomeContent, updateAdminHomeContent } from "../services/api";

const emptySlide = () => ({
  id: "",
  title: "",
  subtitle: "",
  imageUrl: "",
  linkUrl: "",
  sortOrder: 0,
  isActive: true,
});

const emptyCategory = () => ({
  id: "",
  title: "",
  slug: "",
  description: "",
  imageUrl: "",
  iconName: "Sparkles",
  linkUrl: "",
  sortOrder: 0,
  isActive: true,
  commissionType: "PERCENTAGE",
  commissionValue: 10,
  commissionIsActive: true,
});

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10";

export default function HomeContentPage() {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAdminHomeContent();
      const payload = data?.content && (data.content.slides || data.content.categories)
        ? data.content
        : data;
      setSlides(Array.isArray(payload.slides) ? payload.slides : []);
      setCategories(Array.isArray(payload.categories) ? payload.categories : []);
    } catch (error) {
      setToast({ message: error.message || "Failed to load homepage content.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateSlide = (index, patch) => {
    setSlides((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const updateCategory = (index, patch) => {
    setCategories((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminHomeContent({ slides, categories });
      setToast({ message: "Homepage content saved.", type: "success" });
      await load();
    } catch (error) {
      setToast({ message: error.message || "Failed to save homepage content.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-700">
      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/settings"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-600"
          >
            <ArrowLeft size={14} />
            Back to settings
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Homepage Content
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Manage carousel slides, service categories, and category commissions (`home:content`).
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            Save changes
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-sm font-bold text-slate-400">
          Loading homepage configuration...
        </div>
      ) : (
        <>
          <section className="card space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Image size={18} />
                </div>
                <div>
                  <h2 className="font-black text-slate-900">Carousel slides</h2>
                  <p className="text-xs text-slate-400">Shown on the public homepage banner carousel.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSlides((prev) => [...prev, { ...emptySlide(), sortOrder: prev.length }])}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Plus size={14} />
                Add slide
              </button>
            </div>

            {slides.length === 0 ? (
              <p className="text-sm text-slate-400">No slides yet.</p>
            ) : (
              slides.map((slide, index) => (
                <div key={`slide-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Slide {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSlides((prev) => prev.filter((_, i) => i !== index))}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label="Remove slide"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Title">
                      <input className={inputClass} value={slide.title || ""} onChange={(e) => updateSlide(index, { title: e.target.value })} />
                    </Field>
                    <Field label="Subtitle">
                      <input className={inputClass} value={slide.subtitle || ""} onChange={(e) => updateSlide(index, { subtitle: e.target.value })} />
                    </Field>
                    <Field label="Image URL">
                      <input className={inputClass} value={slide.imageUrl || ""} onChange={(e) => updateSlide(index, { imageUrl: e.target.value })} />
                    </Field>
                    <Field label="Link URL">
                      <input className={inputClass} value={slide.linkUrl || ""} onChange={(e) => updateSlide(index, { linkUrl: e.target.value })} />
                    </Field>
                    <Field label="Sort order">
                      <input type="number" className={inputClass} value={slide.sortOrder ?? 0} onChange={(e) => updateSlide(index, { sortOrder: Number(e.target.value) })} />
                    </Field>
                    <label className="flex items-center gap-2 pt-6 text-sm font-bold text-slate-700">
                      <input type="checkbox" checked={slide.isActive !== false} onChange={(e) => updateSlide(index, { isActive: e.target.checked })} />
                      Active
                    </label>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="card space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <LayoutGrid size={18} />
                </div>
                <div>
                  <h2 className="font-black text-slate-900">Service categories</h2>
                  <p className="text-xs text-slate-400">Category feed + commission sync on save.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCategories((prev) => [...prev, { ...emptyCategory(), sortOrder: prev.length }])}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Plus size={14} />
                Add category
              </button>
            </div>

            {categories.length === 0 ? (
              <p className="text-sm text-slate-400">No categories yet.</p>
            ) : (
              categories.map((cat, index) => (
                <div key={`cat-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Category {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCategories((prev) => prev.filter((_, i) => i !== index))}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label="Remove category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Title">
                      <input className={inputClass} value={cat.title || ""} onChange={(e) => updateCategory(index, { title: e.target.value })} />
                    </Field>
                    <Field label="Slug">
                      <input className={inputClass} value={cat.slug || ""} onChange={(e) => updateCategory(index, { slug: e.target.value })} />
                    </Field>
                    <Field label="Description">
                      <input className={inputClass} value={cat.description || ""} onChange={(e) => updateCategory(index, { description: e.target.value })} />
                    </Field>
                    <Field label="Icon name (Lucide)">
                      <input className={inputClass} value={cat.iconName || ""} onChange={(e) => updateCategory(index, { iconName: e.target.value })} />
                    </Field>
                    <Field label="Image URL">
                      <input className={inputClass} value={cat.imageUrl || ""} onChange={(e) => updateCategory(index, { imageUrl: e.target.value })} />
                    </Field>
                    <Field label="Link URL">
                      <input className={inputClass} value={cat.linkUrl || ""} onChange={(e) => updateCategory(index, { linkUrl: e.target.value })} />
                    </Field>
                    <Field label="Commission type">
                      <select className={inputClass} value={cat.commissionType || "PERCENTAGE"} onChange={(e) => updateCategory(index, { commissionType: e.target.value })}>
                        <option value="PERCENTAGE">PERCENTAGE</option>
                        <option value="FLAT">FLAT</option>
                      </select>
                    </Field>
                    <Field label="Commission value">
                      <input type="number" className={inputClass} value={cat.commissionValue ?? 0} onChange={(e) => updateCategory(index, { commissionValue: Number(e.target.value) })} />
                    </Field>
                    <Field label="Sort order">
                      <input type="number" className={inputClass} value={cat.sortOrder ?? 0} onChange={(e) => updateCategory(index, { sortOrder: Number(e.target.value) })} />
                    </Field>
                    <div className="flex flex-col gap-2 pt-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <input type="checkbox" checked={cat.isActive !== false} onChange={(e) => updateCategory(index, { isActive: e.target.checked })} />
                        Active
                      </label>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <input type="checkbox" checked={cat.commissionIsActive !== false} onChange={(e) => updateCategory(index, { commissionIsActive: e.target.checked })} />
                        Commission active
                      </label>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
