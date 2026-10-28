import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Image as ImageIcon,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import Toast from '../components/common/Toast.jsx';
import { getHomeContentAdmin, updateHomeContentAdmin, uploadAdminCategoryIcon } from '../services/api';

const emptySlide = () => ({
  id: `slide-${Date.now()}`,
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 0,
  isActive: true,
});

const emptyCategory = () => ({
  id: `category-${Date.now()}`,
  title: '',
  slug: '',
  description: '',
  imageUrl: '',
  iconName: 'UploadedIcon',
  linkUrl: '',
  sortOrder: 0,
  isActive: true,
  commissionType: 'PERCENTAGE',
  commissionValue: 10,
  taskTemplates: [],
});

const emptyTaskTemplate = () => ({
  id: `template-${Date.now()}`,
  title: '',
  description: '',
  budget: '',
  taskType: 'One-time',
  imageUrl: '',
  skills: [],
  tag: '',
  sortOrder: 0,
  isActive: true,
  details: null,
});

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const reorder = (items, index, direction) => {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const copy = [...items];
  const [item] = copy.splice(index, 1);
  copy.splice(nextIndex, 0, item);
  return copy.map((entry, order) => ({ ...entry, sortOrder: order }));
};

const normalizeSkillsInput = (value) =>
  String(value || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

function Field({ label, children }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10';

const HomeDynamic = () => {
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingCategory, setSavingCategory] = useState(null);
  const [uploadingCategory, setUploadingCategory] = useState(null);
  const [uploadingTemplate, setUploadingTemplate] = useState(null);
  const [toast, setToast] = useState(null);

  const activeCounts = useMemo(
    () => ({
      slides: slides.filter((slide) => slide.isActive).length,
      categories: categories.filter((category) => category.isActive).length,
      templates: categories.reduce(
        (total, category) =>
          total + (Array.isArray(category.taskTemplates)
            ? category.taskTemplates.filter((template) => template.isActive !== false).length
            : 0),
        0,
      ),
    }),
    [slides, categories],
  );

  const fetchHomeContent = async () => {
    setLoading(true);
    try {
      const data = await getHomeContentAdmin();
      const payload = data?.content && (data.content.slides || data.content.categories)
        ? data.content
        : data;
      setSlides(Array.isArray(payload.slides) ? payload.slides : []);
      setCategories(Array.isArray(payload.categories) ? payload.categories : []);
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to load home content.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  useEffect(() => {
    if (categories.length === 0) {
      setSelectedCategoryIndex(0);
      return;
    }
    setSelectedCategoryIndex((current) => Math.min(current, categories.length - 1));
  }, [categories.length]);

  const selectedCategory = categories[selectedCategoryIndex] || null;
  const selectedCategoryTemplates = Array.isArray(selectedCategory?.taskTemplates)
    ? selectedCategory.taskTemplates
    : [];

  const updateSlide = (index, patch) => {
    setSlides((prev) => prev.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  };

  const updateCategory = (index, patch) => {
    setCategories((prev) =>
      prev.map((category, i) => {
        if (i !== index) return category;
        const next = { ...category, ...patch };
        if (Object.prototype.hasOwnProperty.call(patch, 'title')) {
          next.slug = slugify(patch.title);
        }
        return next;
      }),
    );
  };

  const updateCategoryTemplate = (categoryIndex, templateIndex, patch) => {
    setCategories((prev) =>
      prev.map((category, i) => {
        if (i !== categoryIndex) return category;
        const templates = Array.isArray(category.taskTemplates) ? category.taskTemplates : [];
        return {
          ...category,
          taskTemplates: templates.map((template, j) =>
            j === templateIndex ? { ...template, ...patch } : template,
          ),
        };
      }),
    );
  };

  const addCategoryTemplate = (categoryIndex) => {
    setCategories((prev) =>
      prev.map((category, i) => {
        if (i !== categoryIndex) return category;
        const templates = Array.isArray(category.taskTemplates) ? category.taskTemplates : [];
        return {
          ...category,
          taskTemplates: [...templates, { ...emptyTaskTemplate(), sortOrder: templates.length }],
        };
      }),
    );
  };

  const removeCategoryTemplate = (categoryIndex, templateIndex) => {
    setCategories((prev) =>
      prev.map((category, i) => {
        if (i !== categoryIndex) return category;
        const templates = Array.isArray(category.taskTemplates) ? category.taskTemplates : [];
        return {
          ...category,
          taskTemplates: templates
            .filter((_, j) => j !== templateIndex)
            .map((template, order) => ({ ...template, sortOrder: order })),
        };
      }),
    );
  };

  const reorderCategoryTemplate = (categoryIndex, templateIndex, direction) => {
    setCategories((prev) =>
      prev.map((category, i) => {
        if (i !== categoryIndex) return category;
        const templates = Array.isArray(category.taskTemplates) ? category.taskTemplates : [];
        return {
          ...category,
          taskTemplates: reorder(templates, templateIndex, direction),
        };
      }),
    );
  };

  const uploadCategoryIcon = async (index, file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      setToast({ type: 'error', message: 'Please upload an image file for the category icon.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast({ type: 'error', message: 'Icon image must be smaller than 2MB.' });
      return;
    }

    setUploadingCategory(index);
    try {
      const uploaded = await uploadAdminCategoryIcon(file);

      updateCategory(index, {
        imageUrl: uploaded.publicUrl,
        iconName: 'UploadedIcon',
      });
      setToast({ type: 'success', message: 'Category icon uploaded. Save this category to publish it.' });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to upload category icon.' });
    } finally {
      setUploadingCategory(null);
    }
  };

  const uploadTaskTemplateImage = async (categoryIndex, templateIndex, file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      setToast({ type: 'error', message: 'Please upload an image file for the task template.' });
      return;
    }

    const uploadKey = `${categoryIndex}-${templateIndex}`;
    setUploadingTemplate(uploadKey);
    try {
      const uploaded = await uploadAdminCategoryIcon(file);
      updateCategoryTemplate(categoryIndex, templateIndex, {
        imageUrl: uploaded.publicUrl,
      });
      setToast({ type: 'success', message: 'Task template image uploaded. Save this category to publish it.' });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to upload task template image.' });
    } finally {
      setUploadingTemplate(null);
    }
  };

  const buildPayload = () => ({
    slides: slides.map((slide, index) => ({ ...slide, sortOrder: index })),
    categories: categories.map((category, index) => {
      const slug = slugify(category.title);
      const templates = Array.isArray(category.taskTemplates) ? category.taskTemplates : [];
      return {
        ...category,
        slug,
        iconName: 'UploadedIcon',
        linkUrl: `/tasks/${slug}`,
        sortOrder: index,
        commissionValue: Number(category.commissionValue || 0),
        taskTemplates: templates.map((template, templateIndex) => ({
          id: template.id,
          title: String(template.title || '').trim(),
          description: String(template.description || '').trim(),
          budget: String(template.budget || '').trim(),
          taskType: String(template.taskType || '').trim(),
          imageUrl: String(template.imageUrl || '').trim(),
          tag: String(template.tag || '').trim(),
          skills: Array.isArray(template.skills) ? template.skills : normalizeSkillsInput(template.skillsText),
          sortOrder: templateIndex,
          isActive: template.isActive !== false,
          details: template.details ?? null,
        })).filter((template) => template.title),
      };
    }),
  });

  const savePayload = async (payload, successMessage) => {
    const result = await updateHomeContentAdmin(payload);
    setSlides(result.content?.slides ?? payload.slides);
    setCategories(result.content?.categories ?? payload.categories);
    setToast({ type: 'success', message: successMessage });
  };

  const handleSave = async () => {
    const invalidSlide = slides.find((slide) => !slide.title?.trim() || !slide.imageUrl?.trim());
    const invalidCategory = categories.find((category) => !category.title?.trim());

    if (invalidSlide) {
      setToast({ type: 'error', message: 'Each carousel slide needs a title and image URL.' });
      return;
    }
    if (invalidCategory) {
      setToast({ type: 'error', message: 'Each category needs a title.' });
      return;
    }

    const invalidTemplate = categories.find((category) =>
      (Array.isArray(category.taskTemplates) ? category.taskTemplates : []).some((template) => !template.title?.trim()),
    );
    if (invalidTemplate) {
      setToast({ type: 'error', message: 'Each task template needs a title.' });
      return;
    }

    setSaving(true);
    try {
      await savePayload(buildPayload(), 'Home dynamic section saved.');
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to save home content.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (index) => {
    const category = categories[index];
    if (!category?.title?.trim()) {
      setToast({ type: 'error', message: 'Add a category name before saving.' });
      return;
    }

    setSavingCategory(index);
    try {
      await savePayload(buildPayload(), `${category.title.trim()} saved.`);
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Failed to save category.' });
    } finally {
      setSavingCategory(null);
    }
  };

  const handleAddCategory = () => {
    setCategories((prev) => [...prev, { ...emptyCategory(), sortOrder: prev.length }]);
    setSelectedCategoryIndex(categories.length);
  };

  const handleReorderCategory = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= categories.length) return;
    setCategories((prev) => reorder(prev, index, direction));
    if (selectedCategoryIndex === index) {
      setSelectedCategoryIndex(nextIndex);
    } else if (selectedCategoryIndex === nextIndex) {
      setSelectedCategoryIndex(index);
    }
  };

  const handleRemoveCategory = (index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
    setSelectedCategoryIndex((current) => {
      if (current > index) return current - 1;
      if (current === index) return Math.max(0, current - 1);
      return current;
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-8 pb-20">
      <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Home Dynamic Section</h1>
            <p className="mt-1 font-medium text-slate-500">
              Control homepage carousel images, service categories, and category-wise commission.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchHomeContent}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-emerald-600' : ''} />
              Refresh
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Slides</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{activeCounts.slides}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Categories</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{activeCounts.categories}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Templates</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{activeCounts.templates}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-900 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Commission Source</p>
            <p className="mt-2 text-sm font-bold text-white">Synced with finance category commissions</p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-100 bg-white">
            <Loader2 className="mr-3 animate-spin text-emerald-600" size={26} />
            <span className="text-sm font-black uppercase tracking-widest text-slate-400">Loading home content</span>
          </div>
        ) : (
          <>
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ImageIcon size={20} />
                  </span>
                  <div>
                    <h2 className="font-black text-slate-900">Carousel Images</h2>
                    <p className="text-xs font-medium text-slate-400">Visible image slides for the home experience.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSlides((prev) => [...prev, { ...emptySlide(), sortOrder: prev.length }])}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus size={16} className="text-emerald-600" />
                  Add Slide
                </button>
              </div>

              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div key={slide.id || index} className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 md:grid-cols-[120px_1fr_auto]">
                    <div className="h-28 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      {slide.imageUrl ? (
                        <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Title">
                        <input className={inputClass} value={slide.title || ''} onChange={(e) => updateSlide(index, { title: e.target.value })} />
                      </Field>
                      <Field label="Image URL">
                        <input className={inputClass} value={slide.imageUrl || ''} onChange={(e) => updateSlide(index, { imageUrl: e.target.value })} />
                      </Field>
                      <Field label="Subtitle">
                        <input className={inputClass} value={slide.subtitle || ''} onChange={(e) => updateSlide(index, { subtitle: e.target.value })} />
                      </Field>
                      <Field label="Link URL">
                        <input className={inputClass} value={slide.linkUrl || ''} onChange={(e) => updateSlide(index, { linkUrl: e.target.value })} />
                      </Field>
                    </div>
                    <div className="flex items-center gap-2 md:flex-col">
                      <button onClick={() => updateSlide(index, { isActive: !slide.isActive })} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${slide.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {slide.isActive ? 'Active' : 'Hidden'}
                      </button>
                      <button onClick={() => setSlides((prev) => reorder(prev, index, -1))} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-900">
                        <ArrowUp size={15} />
                      </button>
                      <button onClick={() => setSlides((prev) => reorder(prev, index, 1))} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-900">
                        <ArrowDown size={15} />
                      </button>
                      <button onClick={() => setSlides((prev) => prev.filter((_, i) => i !== index))} className="rounded-lg border border-red-100 bg-white p-2 text-red-500 hover:bg-red-50">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Layers size={20} />
                  </span>
                  <div>
                    <h2 className="font-black text-slate-900">Categories and Commission</h2>
                    <p className="text-xs font-medium text-slate-400">These power the homepage category cards and task commission lookup.</p>
                  </div>
                </div>
                <button
                  onClick={handleAddCategory}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus size={16} className="text-emerald-600" />
                  Add Category
                </button>
              </div>

              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={category.id || index}
                    className={`rounded-2xl border p-4 transition ${
                      selectedCategoryIndex === index
                        ? 'border-emerald-200 bg-emerald-50/50 ring-4 ring-emerald-500/10'
                        : 'border-slate-100 bg-slate-50/60'
                    }`}
                  >
                    <div className="grid gap-4 lg:grid-cols-[112px_1fr_auto]">
                      <div className="space-y-2">
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        {category.imageUrl ? (
                          <img src={category.imageUrl} alt="" className="h-full w-full object-contain p-3" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <Layers size={24} />
                          </div>
                        )}
                        </div>
                        <label className="inline-flex w-24 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-2 text-[10px] font-black uppercase text-slate-600 transition hover:bg-slate-50">
                          {uploadingCategory === index ? <Loader2 size={13} className="animate-spin text-emerald-600" /> : <Upload size={13} className="text-emerald-600" />}
                          Icon
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingCategory === index}
                            onChange={(event) => {
                              uploadCategoryIcon(index, event.target.files?.[0]);
                              event.target.value = '';
                            }}
                          />
                        </label>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Category Name">
                          <input className={inputClass} value={category.title || ''} onChange={(e) => updateCategory(index, { title: e.target.value })} />
                        </Field>
                        <Field label="Description">
                          <input className={inputClass} value={category.description || ''} onChange={(e) => updateCategory(index, { description: e.target.value })} />
                        </Field>
                        <Field label="Commission Type">
                          <select className={inputClass} value={category.commissionType || 'PERCENTAGE'} onChange={(e) => updateCategory(index, { commissionType: e.target.value })}>
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="FLAT">Flat amount</option>
                          </select>
                        </Field>
                        <Field label={category.commissionType === 'FLAT' ? 'Commission Amount' : 'Commission %'}>
                          <input type="number" min="0" step="0.01" className={inputClass} value={category.commissionValue ?? 0} onChange={(e) => updateCategory(index, { commissionValue: e.target.value })} />
                        </Field>
                      </div>

                      <div className="flex items-center gap-2 lg:flex-col">
                        <button onClick={() => updateCategory(index, { isActive: !category.isActive })} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${category.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                          {category.isActive ? 'Active' : 'Hidden'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategoryIndex(index)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-black uppercase transition ${
                            selectedCategoryIndex === index
                              ? 'bg-slate-900 text-white'
                              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <FileText size={13} />
                          Templates
                        </button>
                        <button onClick={() => handleReorderCategory(index, -1)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-900">
                          <ArrowUp size={15} />
                        </button>
                        <button onClick={() => handleReorderCategory(index, 1)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-900">
                          <ArrowDown size={15} />
                        </button>
                        <button
                          onClick={() => handleRemoveCategory(index)}
                          className="rounded-lg border border-red-100 bg-white p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button
                          onClick={() => handleSaveCategory(index)}
                          disabled={savingCategory === index || saving || uploadingCategory === index || uploadingTemplate?.startsWith(`${index}-`)}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {savingCategory === index ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <FileText size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {(Array.isArray(category.taskTemplates) ? category.taskTemplates.length : 0)} task templates
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            Select this category to manage templates below.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryIndex(index)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800"
                      >
                        <FileText size={15} />
                        Manage Templates
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FileText size={20} />
                  </span>
                  <div>
                    <h2 className="font-black text-slate-900">Task Templates</h2>
                    <p className="text-xs font-medium text-slate-400">
                      Select a category, then add or edit templates shown in the app.
                    </p>
                  </div>
                </div>

                {selectedCategory && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700">
                      {selectedCategory.title || `Category ${selectedCategoryIndex + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => addCategoryTemplate(selectedCategoryIndex)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      <Plus size={15} className="text-emerald-600" />
                      Add Template
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveCategory(selectedCategoryIndex)}
                      disabled={
                        savingCategory === selectedCategoryIndex ||
                        saving ||
                        uploadingCategory === selectedCategoryIndex ||
                        uploadingTemplate?.startsWith(`${selectedCategoryIndex}-`)
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {savingCategory === selectedCategoryIndex ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      Save Templates
                    </button>
                  </div>
                )}
              </div>

              {categories.length > 0 && (
                <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {categories.map((category, index) => (
                    <button
                      key={`template-tab-${category.id || index}`}
                      type="button"
                      onClick={() => setSelectedCategoryIndex(index)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                        selectedCategoryIndex === index
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {category.title || `Category ${index + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {!selectedCategory ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                  <p className="text-sm font-bold text-slate-500">Add a category first.</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Task templates are managed category-wise.
                  </p>
                </div>
              ) : selectedCategoryTemplates.length > 0 ? (
                <div className="space-y-3">
                  {selectedCategoryTemplates.map((template, templateIndex) => (
                    <div
                      key={template.id || templateIndex}
                      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                        <div className="grid gap-3 md:grid-cols-2">
                          <Field label="Template Title">
                            <input
                              className={inputClass}
                              value={template.title || ''}
                              onChange={(e) => updateCategoryTemplate(selectedCategoryIndex, templateIndex, { title: e.target.value })}
                              placeholder="e.g. Build a landing page for a startup"
                            />
                          </Field>
                          <Field label="Budget">
                            <input
                              className={inputClass}
                              value={template.budget || ''}
                              onChange={(e) => updateCategoryTemplate(selectedCategoryIndex, templateIndex, { budget: e.target.value })}
                              placeholder="Rs.1,000 - Rs.10,000"
                            />
                          </Field>
                          <Field label="Description">
                            <textarea
                              className={`${inputClass} min-h-[88px] resize-y md:col-span-2`}
                              value={template.description || ''}
                              onChange={(e) => updateCategoryTemplate(selectedCategoryIndex, templateIndex, { description: e.target.value })}
                              placeholder="Short task brief shown to providers."
                            />
                          </Field>
                          <Field label="Task Type">
                            <select
                              className={inputClass}
                              value={template.taskType || 'One-time'}
                              onChange={(e) => updateCategoryTemplate(selectedCategoryIndex, templateIndex, { taskType: e.target.value })}
                            >
                              <option value="One-time">One-time</option>
                              <option value="Recurring">Recurring</option>
                              <option value="Long-term">Long-term</option>
                              <option value="Remote">Remote</option>
                              <option value="On-site">On-site</option>
                            </select>
                          </Field>
                          <Field label="Template Image">
                            <div className="flex gap-3">
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                {template.imageUrl ? (
                                  <img src={template.imageUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                                    <ImageIcon size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1 space-y-2">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-black text-emerald-700 transition hover:bg-emerald-100">
                                  {uploadingTemplate === `${selectedCategoryIndex}-${templateIndex}` ? (
                                    <Loader2 size={13} className="animate-spin" />
                                  ) : (
                                    <Upload size={13} />
                                  )}
                                  {template.imageUrl ? 'Replace Image' : 'Upload Image'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingTemplate === `${selectedCategoryIndex}-${templateIndex}`}
                                    onChange={(event) => {
                                      uploadTaskTemplateImage(selectedCategoryIndex, templateIndex, event.target.files?.[0]);
                                      event.target.value = '';
                                    }}
                                  />
                                </label>
                                {template.imageUrl && (
                                  <button
                                    type="button"
                                    onClick={() => updateCategoryTemplate(selectedCategoryIndex, templateIndex, { imageUrl: '' })}
                                    className="ml-2 inline-flex items-center gap-1 rounded-xl border border-red-100 bg-white px-3 py-2 text-[11px] font-black text-red-600 transition hover:bg-red-50"
                                  >
                                    <Trash2 size={13} />
                                    Remove
                                  </button>
                                )}
                                <p className="truncate text-[10px] font-medium text-slate-400">
                                  {template.imageUrl ? 'Uploaded to S3. Save templates to publish.' : 'Select an image to upload.'}
                                </p>
                              </div>
                            </div>
                          </Field>
                          <Field label="Tag">
                            <input
                              className={inputClass}
                              value={template.tag || ''}
                              onChange={(e) => updateCategoryTemplate(selectedCategoryIndex, templateIndex, { tag: e.target.value })}
                              placeholder="Landing page, Frontend"
                            />
                          </Field>
                          <Field label="Skills">
                            <input
                              className={inputClass}
                              value={Array.isArray(template.skills) ? template.skills.join(', ') : template.skillsText || ''}
                              onChange={(e) =>
                                updateCategoryTemplate(selectedCategoryIndex, templateIndex, {
                                  skills: normalizeSkillsInput(e.target.value),
                                  skillsText: e.target.value,
                                })
                              }
                              placeholder="React, Next.js, Tailwind"
                            />
                          </Field>
                        </div>

                        <div className="flex flex-wrap items-start gap-2 lg:w-28 lg:flex-col">
                          <button
                            type="button"
                            onClick={() => updateCategoryTemplate(selectedCategoryIndex, templateIndex, { isActive: template.isActive === false })}
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                              template.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {template.isActive !== false ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderCategoryTemplate(selectedCategoryIndex, templateIndex, -1)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-900"
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderCategoryTemplate(selectedCategoryIndex, templateIndex, 1)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-900"
                          >
                            <ArrowDown size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCategoryTemplate(selectedCategoryIndex, templateIndex)}
                            className="rounded-lg border border-red-100 bg-white p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    No task templates in {selectedCategory.title || 'this category'}.
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Add one to make it visible in the app.
                  </p>
                  <button
                    type="button"
                    onClick={() => addCategoryTemplate(selectedCategoryIndex)}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-700"
                  >
                    <Plus size={15} />
                    Add Template
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default HomeDynamic;
