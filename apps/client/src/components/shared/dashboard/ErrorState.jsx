import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Accessible error-state container for failed API requests or empty fallbacks.
 */
export default function ErrorState({
  title = "Something went wrong",
  description = "We could not load this information right now. Please try again.",
  retryLabel = "Try again",
  onRetry,
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 px-6 py-8 text-center ${className}`}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600 shadow-[var(--shadow-xs)]">
        <AlertCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </div>
      <p className="text-[15px] font-semibold text-[var(--dash-text)]">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md text-[13px] leading-relaxed text-[var(--dash-text-secondary)]">
          {description}
        </p>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-2 text-[13px] font-semibold text-[var(--dash-text)] shadow-[var(--shadow-xs)] transition hover:border-[var(--dash-primary-700)] hover:text-[var(--dash-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)]"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          <span>{retryLabel}</span>
        </button>
      ) : null}
    </div>
  );
}
