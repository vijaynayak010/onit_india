import React from "react";
import { LogOut } from "lucide-react";
import { ACCOUNT_SIDEBAR_WIDTH } from "./accountNavConstants";

export const AccountFlatNavItem = ({ icon, label, isActive, onClick }) => {
  const IconComponent = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)] ${
        isActive
          ? "bg-[var(--dash-active-bg)] text-[var(--dash-primary-800)]"
          : "text-[var(--dash-text-secondary)] hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)]"
      }`}
    >
      {isActive ? (
        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[var(--dash-primary-700)]" />
      ) : null}
      <IconComponent
        size={18}
        strokeWidth={isActive ? 2.25 : 2}
        className={`shrink-0 ${isActive ? "text-[var(--dash-primary-700)]" : "text-[var(--dash-text-secondary)]"}`}
        aria-hidden="true"
      />
      <span className={`text-[14px] ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
    </button>
  );
};

export const AccountFlatSidebarShell = ({ children, footer, onLogout, showLogout = true }) => (
  <aside
    className="fixed left-0 top-[80px] z-40 hidden h-[calc(100vh-80px)] flex-col overflow-y-auto border-r border-[var(--dash-border)] bg-[var(--dash-surface)] no-scrollbar lg:flex"
    style={{ width: ACCOUNT_SIDEBAR_WIDTH }}
  >
    <nav className="flex flex-1 flex-col gap-1 px-4 py-6">{children}</nav>

    {showLogout && onLogout ? (
      <div className="border-t border-[var(--dash-border)] px-4 py-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-[var(--dash-text-secondary)] transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <LogOut size={18} strokeWidth={2} aria-hidden="true" />
          <span className="text-[14px]">Logout</span>
        </button>
      </div>
    ) : null}

    {footer ? <div className="px-4 pb-4">{footer}</div> : null}
  </aside>
);
