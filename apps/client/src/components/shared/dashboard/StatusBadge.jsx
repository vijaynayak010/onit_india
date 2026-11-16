import React from "react";

const VARIANT_CLASSES = {
  completed: "bg-[#E8F8F5] text-[#1B8887] border border-[#1B8887]/15",
  active: "bg-[#EDF9FA] text-[#1B8887] border border-[#1B8887]/20",
  live: "bg-[#E8F8F5] text-[#083B3A] border border-[#4CCDDC]/40",
  bright: "bg-[#7EDEDD] text-[#032120]",
  neutral: "bg-[#F5FAFA] text-[#647575] border border-[#E5EEEE]",
};

/**
 * Accessible status pill badge for dashboard cards and headers.
 */
export default function StatusBadge({
  children,
  variant = "neutral",
  dot = false,
  className = "",
}) {
  const style = VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-5 tabular-nums ${style} ${className}`}
    >
      {dot ? (
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-[#4CCDDC]"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}
