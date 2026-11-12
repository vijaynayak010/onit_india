import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * Standardized Page Header for Performer Account Subsections.
 * Follows the visual and navigation pattern established in PerformerProfilePage.
 *
 * Implements intelligent, loop-safe back navigation:
 * 1. Honors explicit onBack callback if provided.
 * 2. Uses location.state.from if the user arrived from a specific caller (e.g. Settings -> KYC).
 * 3. Preserves explicit child workflow targets (e.g. /performer/wallet, /performer/earnings).
 * 4. Intelligently uses browser history when safe, while protecting against redirect loops (aliases/tabs).
 * 5. Provides a reliable fallback to /performer/account on direct navigation or page refresh.
 */
export default function PerformerPageHeader({
  title,
  subtitle,
  backTo = "/performer/account",
  backLabel = "Back to Account",
  onBack,
  actions,
  className = "",
  showBack = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const stateFrom = location.state?.from;
  const stateFromLabel = location.state?.fromLabel;

  const resolvedBackTo = stateFrom || backTo;
  const resolvedBackLabel = stateFromLabel || backLabel;

  const handleBack = () => {
    // 1. Explicit caller onBack callback takes precedence
    if (typeof onBack === "function") {
      onBack();
      return;
    }

    // 2. If stateFrom is explicitly provided during navigation, return to that specific origin
    if (stateFrom && typeof stateFrom === "string" && stateFrom.startsWith("/")) {
      navigate(stateFrom);
      return;
    }

    // 3. If backTo was customized to a specific child workflow (e.g., "/performer/wallet", "/performer/earnings"),
    // preserve that parent workflow directly
    if (backTo && backTo !== "/performer/account") {
      navigate(backTo);
      return;
    }

    // 4. Intelligent browser history evaluation:
    // Check if the user navigated from within the application history
    const hasHistoryEntry =
      typeof window !== "undefined" &&
      window.history.state &&
      typeof window.history.state.idx === "number" &&
      window.history.state.idx > 0;

    const isSameOriginReferrer =
      typeof document !== "undefined" &&
      document.referrer &&
      document.referrer.startsWith(window.location.origin);

    // Prevent redirect loops (e.g. if previous entry was an alias route like /performer/active-tasks
    // which immediately redirects to /performer/my-tasks?tab=active)
    const currentIsAliasOrTab =
      location.pathname.startsWith("/performer/my-tasks") ||
      location.pathname.startsWith("/performer/all-tasks") ||
      location.pathname === "/performer/active-tasks" ||
      location.pathname === "/performer/completed-tasks" ||
      location.pathname === "/performer/applications";

    if (hasHistoryEntry && isSameOriginReferrer && !currentIsAliasOrTab) {
      try {
        const prevUrl = new URL(document.referrer);
        // Ensure the referrer was a valid performer section, not an external or auth redirect
        if (
          prevUrl.pathname.startsWith("/performer/") &&
          prevUrl.pathname !== location.pathname
        ) {
          navigate(-1);
          return;
        }
      } catch {
        // Fall through to reliable default
      }
    }

    // 5. Reliable fallback: direct navigation, page refresh, or loop protection
    // always returns safely to the Account overview
    navigate(resolvedBackTo || "/performer/account");
  };

  return (
    <div
      className={`sticky top-[93px] z-20 -mx-4 -mt-2 mb-6 flex items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 py-3.5 backdrop-blur-md shadow-xs sm:mx-0 sm:rounded-2xl sm:border sm:px-6 ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label={resolvedBackLabel}
            title={resolvedBackLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base sm:text-lg font-heading font-medium text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden truncate text-[11px] font-medium text-slate-400 sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
    </div>
  );
}
