import React from "react";
import { LogOut } from "lucide-react";

export const ACCOUNT_SIDEBAR_WIDTH = 240;

export const AccountFlatNavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
      isActive
        ? "bg-[#E8F5EE] text-[#2BA960] shadow-sm"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    {isActive ? (
      <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#2BA960]" />
    ) : null}
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
    <span className={`text-[14px] ${isActive ? "font-bold" : "font-semibold"}`}>{label}</span>
  </button>
);

export const AccountFlatSidebarShell = ({ children, footer, onLogout, showLogout = true }) => (
  <aside
    className="fixed left-0 top-[80px] z-40 hidden h-[calc(100vh-80px)] flex-col overflow-y-auto border-r border-gray-100 bg-[#F8FAFC] no-scrollbar lg:flex"
    style={{ width: ACCOUNT_SIDEBAR_WIDTH }}
  >
    <nav className="flex flex-1 flex-col gap-1 px-4 py-6">{children}</nav>

    {showLogout && onLogout ? (
      <div className="border-t border-gray-100 px-4 py-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} strokeWidth={2} />
          <span className="text-[14px]">Logout</span>
        </button>
      </div>
    ) : null}

    {footer ? <div className="px-4 pb-4">{footer}</div> : null}
  </aside>
);

export const accountMainClass = `min-h-[calc(100vh-80px)] flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:ml-[240px] lg:px-8 lg:py-8`;

export const accountMainStyle = {};
