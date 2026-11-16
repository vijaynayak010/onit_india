import React from "react";

/**
 * Compact empty-state container for dashboard sections with zero items.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--dash-border)] bg-[var(--dash-canvas)]/70 px-6 py-8 text-center ${className}`}
    >
      {Icon ? (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--dash-surface)] text-[var(--dash-primary-700)] shadow-[var(--shadow-xs)]">
          <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
        </div>
      ) : null}
      {title ? (
        <p className="text-sm font-medium text-[var(--dash-text)]">{title}</p>
      ) : null}
      {description ? (
        <p className="mt-1 max-w-md text-xs leading-relaxed text-[var(--dash-text-secondary)]">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--dash-primary-700)] px-4 py-2 text-xs font-medium text-white transition hover:bg-[var(--dash-primary-800)]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
