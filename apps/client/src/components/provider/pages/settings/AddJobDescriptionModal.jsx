import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Type, AlignLeft, Tag, IndianRupee, MapPin } from "lucide-react";

const categories = ["Design", "Development", "Marketing", "Research", "Writing", "Other"];
const durations = ["< 1 week", "1–2 weeks", "1 month", "3+ months", "Ongoing"];

const emptyForm = {
  title: "",
  description: "",
  category: "Design",
  duration: "< 1 week",
  skillsInput: "",
  priceAmount: "",
  priceCurrency: "INR",
  locationAddress: "",
};

const AddJobDescriptionModal = ({ isOpen, onClose, onSave, initialData = null, saving = false }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setForm(
        initialData
          ? {
              title: initialData.title || "",
              description: initialData.description || "",
              category: initialData.category || "Design",
              duration: initialData.duration || "< 1 week",
              skillsInput: (initialData.skills || []).join(", "),
              priceAmount:
                initialData.priceAmount === "" || initialData.priceAmount == null
                  ? ""
                  : String(initialData.priceAmount),
              priceCurrency: initialData.priceCurrency || "INR",
              locationAddress: initialData.locationAddress || "",
            }
          : emptyForm
      );
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    const skills = form.skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setError("");
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        duration: form.duration,
        skills,
        priceAmount: form.priceAmount,
        priceCurrency: form.priceCurrency,
        locationAddress: form.locationAddress.trim(),
      });
    } catch (err) {
      setError(err?.message || "Failed to save job description.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            onClick={saving ? undefined : onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-job-description-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[78vh] w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl"
          >
            <div className="flex justify-center pt-2">
              <span className="h-0.5 w-8 rounded-full bg-gray-300" />
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <h2 id="add-job-description-title" className="text-base font-bold text-gray-900">
                {initialData ? "Edit Job Description" : "Add Job Description"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(78vh-52px)] overflow-y-auto px-4 pb-5 pt-3">
              <div className="space-y-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                    <Type size={14} />
                  </div>
                  <div className="w-full min-w-0">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Web Design, UI/UX Audit"
                      className="mt-0.5 w-full border-none bg-transparent p-0 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                    <AlignLeft size={14} />
                  </div>
                  <div className="w-full min-w-0">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the job — scope, deliverables, requirements..."
                      rows={2}
                      className="mt-0.5 w-full resize-none border-none bg-transparent p-0 text-xs font-medium leading-relaxed text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</h3>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                      className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                        form.category === cat
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Tag size={11} />
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Duration</h3>
                <div className="space-y-0.5 rounded-xl border border-gray-200 bg-white p-1.5">
                  {durations.map((dur) => (
                    <label
                      key={dur}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition ${
                        form.duration === dur ? "bg-emerald-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold ${
                          form.duration === dur ? "text-emerald-700" : "text-gray-800"
                        }`}
                      >
                        {dur}
                      </span>
                      <div
                        className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                          form.duration === dur ? "border-emerald-600" : "border-gray-300"
                        }`}
                      >
                        {form.duration === dur ? (
                          <div className="h-2 w-2 rounded-full bg-emerald-600" />
                        ) : null}
                      </div>
                      <input
                        type="radio"
                        name="duration"
                        value={dur}
                        checked={form.duration === dur}
                        onChange={() => setForm((prev) => ({ ...prev, duration: dur }))}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2.5 rounded-xl border border-gray-100 bg-white p-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                    <Tag size={14} />
                  </div>
                  <div className="w-full min-w-0">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Skills
                    </label>
                    <input
                      type="text"
                      value={form.skillsInput}
                      onChange={(e) => setForm((prev) => ({ ...prev, skillsInput: e.target.value }))}
                      placeholder="e.g., Figma, UI/UX, Wireframing"
                      className="mt-0.5 w-full border-none bg-transparent p-0 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                    <IndianRupee size={14} />
                  </div>
                  <div className="w-full min-w-0">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Price Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.priceAmount}
                      onChange={(e) => setForm((prev) => ({ ...prev, priceAmount: e.target.value }))}
                      placeholder="e.g., 1500"
                      className="mt-0.5 w-full border-none bg-transparent p-0 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                    <MapPin size={14} />
                  </div>
                  <div className="w-full min-w-0">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.locationAddress}
                      onChange={(e) => setForm((prev) => ({ ...prev, locationAddress: e.target.value }))}
                      placeholder="e.g., 123 Main St, New Delhi"
                      className="mt-0.5 w-full border-none bg-transparent p-0 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              {error ? <p className="mt-3 text-xs font-semibold text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={saving || !form.title.trim()}
                className="mt-5 w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-xs font-bold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : initialData ? "Save Changes" : "Add Job Description"}
              </button>
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default AddJobDescriptionModal;
