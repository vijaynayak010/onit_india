import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Paperclip, Trash2 } from "lucide-react";
import TaskDocumentRow from "./TaskDocumentRow";

const RequestChangesModal = ({ isOpen, onClose, item, onSubmit }) => {
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFeedback("");
      setFiles([]);
    }
  }, [isOpen, item?.id]);

  if (!isOpen || !item) return null;

  const { submission, text, description } = item;
  const submissionDescription = submission?.description || description || "";
  const imageUrl = submission?.imageUrl || "";
  const attachmentUrl = submission?.attachmentUrl || "";
  const attachmentName = submission?.attachmentName || "task-details.file";
  const hasDescription = Boolean(submissionDescription.trim());
  const hasImage = Boolean(imageUrl);
  const hasAttachment = Boolean(attachmentUrl);
  const hasSubmissionPreview = hasDescription || hasImage || hasAttachment;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    try {
      setSubmitting(true);
      await onSubmit({ item, feedback: feedback.trim(), files });
      onClose();
    } catch (err) {
      console.error("Request changes failed:", err);
      alert(err.message || "Failed to submit change request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!submitting ? onClose : undefined}
          className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
        />

        <motion.form
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          onSubmit={handleSubmit}
          className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
            <h2 className="text-xl font-bold text-[var(--color-text)]">Request Changes</h2>
            {!submitting && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-[var(--color-text-subtle)] transition hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
              >
                <X className="h-5 w-5" strokeWidth={2.25} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {hasSubmissionPreview && (
              <div className="mb-6">
                <p className="mb-3 text-sm font-bold text-[var(--color-text)]">Performer&apos;s Submission</p>
                <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4">
                  {hasDescription && (
                    <p className="text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                      {submissionDescription}
                    </p>
                  )}
                  {hasImage && (
                    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
                      <img
                        src={imageUrl}
                        alt={`Submission for ${text}`}
                        className="max-h-56 w-full object-cover"
                      />
                    </div>
                  )}
                  {hasAttachment && (
                    <TaskDocumentRow
                      file={{
                        url: attachmentUrl,
                        filename: attachmentName,
                        createdAt: submission?.submittedAt,
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            <label className="mb-2 block text-sm font-bold text-[var(--color-text)]">
              Describe the changes needed
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please provide detailed feedback on what needs to be changed..."
              rows={5}
              required
              disabled={submitting}
              className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 text-sm font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-100 disabled:opacity-60"
            />

            <div className="mt-5">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--color-text-muted)] transition hover:border-amber-300 hover:bg-amber-50 disabled:opacity-50">
                <Paperclip className="h-4 w-4" />
                Attach reference files
                <input
                  type="file"
                  multiple
                  disabled={submitting || files.length >= 5}
                  onChange={(event) => {
                    const selected = Array.from(event.target.files || []);
                    setFiles((current) => [...current, ...selected].slice(0, 5));
                    event.target.value = "";
                  }}
                  className="sr-only"
                />
              </label>
              <p className="mt-2 text-xs font-medium text-[var(--color-text-subtle)]">
                Optional · up to 5 files
              </p>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
                      <Paperclip className="h-4 w-4 shrink-0 text-amber-600" />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--color-text)]">{file.name}</span>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                        className="rounded-lg p-1.5 text-[var(--color-text-subtle)] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Remove ${file.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 border-t border-[var(--color-border)] px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-full border border-[var(--color-border)] bg-white py-3 text-sm font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !feedback.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50 py-3 text-sm font-bold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </AnimatePresence>
  );
};

export default RequestChangesModal;
