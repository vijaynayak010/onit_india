import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Accessible slide-over drawer (side panel on desktop, full/sheet on mobile).
 */
export default function ResponsiveDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidth = "max-w-md",
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "responsive-drawer-title" : undefined}
    >
      <div
        className="absolute inset-0 bg-[#032120]/40 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`relative z-10 flex h-full w-full ${maxWidth} flex-col border-l border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[var(--shadow-xl)]`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--dash-border)] px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <h2
                id="responsive-drawer-title"
                className="truncate text-[16px] font-semibold text-[var(--dash-text)]"
              >
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-0.5 text-[13px] text-[var(--dash-text-secondary)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="border-t border-[var(--dash-border)] bg-[var(--dash-canvas)]/50 px-5 py-3.5">
            {footer}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
