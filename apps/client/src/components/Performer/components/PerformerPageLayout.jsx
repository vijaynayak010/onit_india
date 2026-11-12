import React from "react";
import PerformerHeader from "./PerformerHeader";
import PerformerPageHeader from "./PerformerPageHeader";

const MAX_WIDTH_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

/**
 * PerformerSectionCard - Standardized card component matching PerformerProfilePage
 * Features:
 * - Rounded-2xl with border-slate-200/80 and subtle elevation
 * - Optional header with icon badge in emerald-50 / #10605F
 * - Title and subtitle typography aligned with design tokens
 * - Optional header action button / status pill
 */
export function PerformerSectionCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = "",
  contentClassName = "",
  headerClassName = "",
}) {
  const hasHeader = Boolean(title || subtitle || Icon || action);

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300/80 sm:p-6 ${className}`}
    >
      {hasHeader && (
        <div
          className={`mb-4 flex items-start justify-between gap-4 border-b border-slate-100 pb-3.5 ${headerClassName}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EFFBFB] text-[#10605F]">
                <Icon size={16} strokeWidth={2.2} />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="truncate text-[15px] font-medium text-slate-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[12px] font-medium text-slate-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
}

/**
 * PerformerPageLayout - Unified Page Layout for Performer Account Subsections.
 * Standardizes:
 * 1. Global top header + persistent single left sidebar (PerformerHeader, w-[220px], z-[90])
 * 2. Main content offset (pt-[93px], lg:ml-[220px], lg:w-[calc(100%-220px)])
 * 3. Sticky glassmorphism page header with back navigation (PerformerPageHeader)
 * 4. Responsive central container alignment and spacing
 */
export default function PerformerPageLayout({
  children,
  title,
  subtitle,
  backTo = "/performer/account",
  backLabel = "Back to Account",
  onBack,
  actions,
  activePage = "account",
  maxWidth = "4xl",
  showHeader = true,
  className = "",
  containerClassName = "space-y-6",
}) {
  const resolvedMaxWidth = MAX_WIDTH_CLASSES[maxWidth] || maxWidth;
  const shouldRenderHeader = showHeader && (title || actions);

  return (
    <div className={`min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)] ${className}`}>
      {/* Persistent global header & single sidebar */}
      <PerformerHeader activePage={activePage} />

      {/* Main offset container */}
      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className={`mx-auto w-full ${resolvedMaxWidth}`}>
          {shouldRenderHeader && (
            <PerformerPageHeader
              title={title}
              subtitle={subtitle}
              backTo={backTo}
              backLabel={backLabel}
              onBack={onBack}
              actions={actions}
            />
          )}
          <div className={containerClassName}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

PerformerPageLayout.Card = PerformerSectionCard;
PerformerPageLayout.Header = PerformerPageHeader;
