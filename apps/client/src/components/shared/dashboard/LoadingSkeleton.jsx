import React from "react";

/**
 * Standardized loading skeleton primitives for dashboard cards, KPI rows, and lists.
 */
export default function LoadingSkeleton({
  variant = "card",
  count = 1,
  className = "",
}) {
  const items = Array.from({ length: Math.max(1, count) });

  if (variant === "kpi") {
    return (
      <div
        role="status"
        aria-label="Loading metrics"
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      >
        {items.map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 sm:p-5"
          >
            <div className="mb-3 h-10 w-10 rounded-xl bg-[var(--dash-canvas)]" />
            <div className="mb-2 h-3 w-24 rounded bg-[var(--dash-canvas)]" />
            <div className="h-7 w-20 rounded bg-[var(--dash-canvas)]" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div role="status" aria-label="Loading list" className={`space-y-3 ${className}`}>
        {items.map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-3 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-[var(--dash-canvas)]" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-[var(--dash-canvas)]" />
              <div className="h-3 w-1/3 rounded bg-[var(--dash-canvas)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div role="status" aria-label="Loading content" className={`space-y-4 ${className}`}>
      {items.map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5"
        >
          <div className="mb-4 h-4 w-1/3 rounded bg-[var(--dash-canvas)]" />
          <div className="mb-2 h-3 w-full rounded bg-[var(--dash-canvas)]" />
          <div className="h-3 w-4/5 rounded bg-[var(--dash-canvas)]" />
        </div>
      ))}
    </div>
  );
}
