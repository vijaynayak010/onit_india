import React from "react";
import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  primary:
    "bg-[var(--dash-primary-700)] text-white hover:bg-[var(--dash-primary-800)] active:bg-[var(--dash-primary-900)] shadow-[var(--shadow-xs)]",
  accent:
    "bg-[var(--dash-primary-400)] text-[var(--dash-primary-950)] hover:bg-[var(--dash-primary-500)] active:bg-[var(--dash-primary-600)] shadow-[var(--shadow-xs)]",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-[var(--shadow-xs)]",
};

const SIZE_CLASSES = {
  sm: "min-h-[36px] px-3.5 py-1.5 text-xs",
  md: "min-h-[42px] px-5 py-2.5 text-sm",
  lg: "min-h-[46px] px-6 py-3 text-sm",
};

/**
 * Standardized primary action button using FirstDoer teal palette.
 */
export default function PrimaryButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
