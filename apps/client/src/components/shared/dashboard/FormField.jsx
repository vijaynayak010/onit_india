import React, { useId } from "react";

/**
 * Accessible form field wrapper with label, helper text, and error message.
 */
export default function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
  className = "",
}) {
  const generatedId = useId();
  const fieldId = htmlFor || generatedId;
  const errorId = error ? `${fieldId}-error` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="text-[13px] font-semibold text-[var(--dash-text)]"
        >
          {label}
          {required ? (
            <span className="ml-1 text-rose-600" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {typeof children === "function"
        ? children({
            id: fieldId,
            "aria-invalid": Boolean(error) || undefined,
            "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
          })
        : children}

      {hint && !error ? (
        <p id={hintId} className="text-[12px] text-[var(--dash-text-secondary)]">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-[12px] font-medium text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
