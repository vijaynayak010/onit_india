import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

/**
 * Accessible confirmation modal dialog for destructive or high-impact actions.
 */
export default function ConfirmationDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="absolute inset-0 bg-[#032120]/40 backdrop-blur-xs"
        onClick={() => {
          if (!loading) onClose?.();
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 shadow-[var(--shadow-xl)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {variant === "danger" ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </div>
            ) : null}
            <h2
              id="confirm-dialog-title"
              className="text-[16px] font-semibold leading-snug text-[var(--dash-text)]"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!loading) onClose?.();
            }}
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {message ? (
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--dash-text-secondary)]">
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <SecondaryButton
            size="sm"
            disabled={loading}
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </SecondaryButton>
          <PrimaryButton
            size="sm"
            variant={variant === "danger" ? "danger" : "primary"}
            loading={loading}
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
