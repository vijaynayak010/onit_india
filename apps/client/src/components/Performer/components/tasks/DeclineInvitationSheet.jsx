import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const DECLINE_REASONS = [
  "Busy right now",
  "Budget too low",
  "Deadline too short",
  "Not my expertise",
  "Other",
];

/**
 * Bottom-sheet for declining a task invitation (matches performer invite mock).
 */
const DeclineInvitationSheet = ({
  open,
  onClose,
  reason,
  onReasonChange,
  onConfirm,
  loading = false,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/45"
            onClick={loading ? undefined : onClose}
            aria-hidden
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[201] mx-auto max-w-lg rounded-t-3xl bg-white px-5 pb-8 pt-3 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="decline-invitation-title"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

            <h2
              id="decline-invitation-title"
              className="text-[20px] font-bold tracking-tight text-[var(--color-text)]"
            >
              Decline Invitation?
            </h2>
            <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-[var(--color-text-muted)]">
              Let the client know why you&apos;re unable to take this task.
            </p>

            <ul className="mt-5 divide-y divide-[var(--color-border)]">
              {DECLINE_REASONS.map((option) => {
                const selected = reason === option;
                return (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => onReasonChange(option)}
                      className="flex w-full items-center gap-3 py-3.5 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          selected
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                            : "border-gray-300 bg-white"
                        }`}
                        aria-hidden
                      >
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                      <span className="text-[14px] font-semibold text-[var(--color-text)]">
                        {option}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-white py-3.5 text-[14px] font-bold text-[var(--color-text)] transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading || !reason}
                className="flex-1 rounded-xl bg-[#E53935] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#D32F2F] disabled:opacity-50"
              >
                {loading ? "Declining…" : "Decline Invitation"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeclineInvitationSheet;
