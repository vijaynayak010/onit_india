import React from "react";
import { TrendingUp } from "lucide-react";

/**
 * Clean KPI StatCard with 40x40px #F5FAFA icon badge (#1B8887 stroke),
 * tabular-nums value, and zero corner decorative artifacts.
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  className = "",
}) {
  return (
    <article
      className={`rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 sm:p-5 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)] ${className}`}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--dash-canvas)] text-[var(--dash-primary-700)]">
        {Icon ? <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> : null}
      </div>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--dash-text-secondary)]">
        {label}
      </p>
      <p className="dash-kpi tabular-nums text-2xl sm:text-[28px] font-medium leading-tight tracking-tight text-[var(--dash-text)]">
        {value}
      </p>
      {change ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--dash-primary-700)]">
          {trend === "up" ? (
            <TrendingUp className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden="true" />
          ) : null}
          <span>{change}</span>
        </p>
      ) : null}
    </article>
  );
}
