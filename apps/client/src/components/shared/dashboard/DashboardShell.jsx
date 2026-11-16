import React from "react";

/**
 * Shared canvas & optional 240px sidebar offset shell for Provider and Performer dashboards.
 */
export default function DashboardShell({
  header = null,
  hasSidebar = false,
  children,
  className = "",
  mainClassName = "",
}) {
  return (
    <div className={`min-h-screen bg-[var(--dash-canvas)] text-[var(--dash-text)] font-sans ${className}`}>
      {header}
      <main
        className={`w-full ${
          hasSidebar
            ? "px-4 pb-16 pt-[88px] sm:px-6 lg:ml-[240px] lg:w-[calc(100%-240px)] lg:px-8 lg:pt-8"
            : "mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8"
        } ${mainClassName}`}
      >
        <div className="mx-auto w-full max-w-[1440px]">{children}</div>
      </main>
    </div>
  );
}
