import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

const ChecklistSubmitModal = ({ isOpen, item, onClose, onSubmit }) => {
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setGithubLink("");
    }
  }, [isOpen, item?.id]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      setSubmitting(true);
      await onSubmit({
        item,
        description: description.trim(),
        githubLink: githubLink.trim() || undefined,
      });
      onClose();
    } catch (err) {
      alert(err?.message || "Failed to submit work.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
          onClick={!submitting ? onClose : undefined}
        />
        <motion.form
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onSubmit={handleSubmit}
          className="relative w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
            <div>
              <h2 className="text-lg font-medium text-[var(--color-text)]">Submit work</h2>
              <p className="mt-0.5 text-sm font-semibold text-[var(--color-text-muted)]">{item.text}</p>
            </div>
            {!submitting && (
              <button type="button" onClick={onClose} className="rounded-full p-2 text-[var(--color-text-subtle)] hover:bg-[var(--color-border-subtle)]">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="space-y-4 px-6 py-5">
            {item.providerFeedback ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">Provider feedback</p>
                {item.providerFeedback}
              </div>
            ) : null}
            {item.note ? (
              <p className="text-sm font-medium text-[var(--color-text-muted)]">{item.note}</p>
            ) : null}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[var(--color-text)]">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                disabled={submitting}
                placeholder="Briefly describe the work you completed..."
                className="w-full resize-none rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[var(--color-text)]">GitHub / work link (optional)</label>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                disabled={submitting}
                placeholder="https://github.com/..."
                className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm font-medium outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-[var(--color-border)] px-6 py-5">
            <button type="button" onClick={onClose} disabled={submitting} className="flex-1 rounded-full border border-[var(--color-border)] py-3 text-sm font-bold text-[var(--color-text-muted)]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
          </div>
        </motion.form>
      </div>
    </AnimatePresence>
  );
};

export default ChecklistSubmitModal;
