import React from "react";
import { Search, X } from "lucide-react";

/**
 * Standardized rounded search input pill for dashboard filtering.
 */
export default function SearchPill({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  ariaLabel = "Search",
}) {
  return (
    <div
      className={`relative flex items-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[var(--shadow-xs)] focus-within:border-[var(--dash-primary-700)] focus-within:ring-2 focus-within:ring-[var(--dash-primary-700)]/15 ${className}`}
    >
      <Search
        className="pointer-events-none ml-4 h-4 w-4 shrink-0 text-[var(--dash-text-secondary)]"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full bg-transparent px-3 py-2 text-sm text-[var(--dash-text)] placeholder:text-[var(--dash-text-secondary)] focus:outline-none"
      />
      {value && onClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--dash-text-secondary)] hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
