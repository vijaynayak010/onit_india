import React from "react";
import { Loader2 } from "lucide-react";

const SIZE_CLASSES = {
  sm: "min-h-[36px] px-3.5 py-1.5 text-xs",
  md: "min-h-[42px] px-5 py-2.5 text-sm",
  lg: "min-h-[46px] px-6 py-3 text-sm",
};

/**
 * Standardized secondary/outline button using FirstDoer surface and border tokens.
 */
export default function SecondaryButton({
  children,
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] font-medium text-[var(--dash-text)] transition hover:border-[var(--dash-primary-700)]/40 hover:bg-[var(--dash-active-bg)] hover:text-[var(--dash-primary-800)] active:bg-[var(--dash-completed-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
