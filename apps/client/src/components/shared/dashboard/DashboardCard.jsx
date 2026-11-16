import React from "react";

/**
 * Standardized surface card for Provider and Performer dashboards.
 */
export default function DashboardCard({
  children,
  className = "",
  as = "section",
  ...props
}) {
  return React.createElement(
    as,
    {
      className: `rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[var(--shadow-sm)] ${className}`,
      ...props,
    },
    children,
  );
}
