import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, X, Info } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!duration || !onClose) return undefined;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="shrink-0 text-[var(--dash-primary-700)]" size={18} aria-hidden="true" />,
    error: <AlertCircle className="shrink-0 text-rose-600" size={18} aria-hidden="true" />,
    warning: <AlertTriangle className="shrink-0 text-amber-600" size={18} aria-hidden="true" />,
    info: <Info className="shrink-0 text-[var(--dash-primary-700)]" size={18} aria-hidden="true" />,
  };

  const styles = {
    success: "border-[var(--dash-primary-700)]/20 bg-[var(--dash-completed-bg)] text-[var(--dash-primary-900)]",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    info: "border-[var(--dash-primary-600)]/25 bg-[var(--dash-active-bg)] text-[var(--dash-primary-900)]",
  };

  const resolvedType = styles[type] ? type : "info";

  return (
    <div
      role={resolvedType === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`fixed bottom-4 left-4 right-4 z-[160] flex items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-[var(--shadow-lg)] sm:bottom-8 sm:left-auto sm:right-8 sm:max-w-md ${styles[resolvedType]}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {icons[resolvedType]}
        <p className="text-[13px] font-semibold leading-snug">{message}</p>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--dash-text-secondary)] transition hover:bg-black/5 hover:text-[var(--dash-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)]"
        >
          <X size={15} />
        </button>
      ) : null}
    </div>
  );
};

export default Toast;
