import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Search, Settings, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import NotificationBell from "../../shared/NotificationBell";

const navLinks = [
  { name: "Home", path: "/performer/dashboard", key: "dashboard" },
  { name: "My Tasks", path: "/performer/my-tasks", key: "my-tasks" },
  { name: "Invitations", path: "/performer/invitations", key: "invitations" },
  { name: "Messages", path: "/performer/chats", key: "chats" },
  { name: "Notifications", path: "/performer/notifications", key: "notifications" },
  { name: "Account", path: "/performer/account", key: "account" },
];

const MotionDiv = motion.div;

const PerformerHeader = ({ activePage = "dashboard" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const displayName = user?.displayName || user?.name || user?.username || user?.email?.split("@")[0] || "User";

  const initials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    const value = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : displayName.slice(0, 2);
    return value.toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed left-0 top-0 z-[100] h-[93px] w-full border-b border-[rgba(177,186,199,0.35)] bg-white">
        <div className="flex h-full items-center justify-between px-5 sm:px-6">
          <button type="button" onClick={() => navigate("/performer/dashboard")} className="flex items-center gap-2" aria-label="Go to performer home">
            <svg width="26" height="18" viewBox="0 0 30 22" fill="none" aria-hidden="true">
              <path d="M11 2.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5c3.4 0 5.6-2.4 8-8.5 2.4-6.1 4.6-8.5 8-8.5" stroke="#29ADAC" strokeWidth="3" strokeLinecap="round" />
              <path d="M19 19.5c4.7 0 8.5-3.8 8.5-8.5S23.7 2.5 19 2.5c-3.4 0-5.6 2.4-8 8.5" stroke="#4CCDCC" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-[#0D1210]">firstDoer</span>
          </button>

          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            <label className="hidden h-11 w-[min(444px,42vw)] items-center gap-2 rounded-full border border-[#e0e0e0] bg-white px-3 text-slate-500 md:flex">
              <Search size={16} strokeWidth={1.9} className="text-slate-500" />
              <input
                type="search"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && event.currentTarget.value.trim()) {
                    navigate(`/performer/find-tasks?q=${encodeURIComponent(event.currentTarget.value.trim())}`);
                  }
                }}
                placeholder="Search tasks, performers..."
                className="min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:text-slate-400"
              />
            </label>

            <NotificationBell />

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowProfileDropdown((value) => !value)}
                className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-3 text-[14px] font-medium text-slate-700 transition hover:bg-slate-200"
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
              >
                <span className="h-6 w-6 rounded-full bg-[var(--color-primary)]" />
                <span className="hidden sm:inline">{initials}</span>
                <ChevronDown size={14} strokeWidth={2} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {showProfileDropdown ? (
                  <MotionDiv
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Account</p>
                      <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                    </div>
                    <button type="button" onClick={() => { navigate("/performer/account"); setShowProfileDropdown(false); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#EFFBFB]">
                      <UserRound size={17} className="text-slate-400" />
                      Account
                    </button>
                    <button type="button" onClick={() => { navigate("/performer/settings"); setShowProfileDropdown(false); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-[#EFFBFB]">
                      <Settings size={17} className="text-slate-400" />
                      Settings
                    </button>
                    <button type="button" onClick={() => { logout(); navigate("/"); }} className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
                      <LogOut size={17} />
                      Logout
                    </button>
                  </MotionDiv>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-[93px] z-[90] hidden h-[calc(100vh-93px)] w-[220px] flex-col bg-[#fafafa] px-4 py-7 lg:flex">
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const isActive =
              activePage === link.key ||
              ((activePage === "account" || activePage === "settings") && link.key === "account") ||
              (activePage === "dashboard" && link.key === "dashboard");
            return (
              <button
                key={link.key}
                type="button"
                onClick={() => navigate(link.path)}
                className={`flex h-[43px] w-full items-center rounded-[10px] px-3.5 text-left text-[14px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                  isActive ? "bg-[rgba(16,96,95,0.15)] font-semibold text-[var(--color-primary)]" : "text-black/60 hover:bg-white hover:text-slate-900"
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/80 pt-3">
          <div className="flex items-center gap-2.5 px-2.5 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-[12px] font-bold text-white">{initials}</div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-slate-500">{displayName}</p>
              <p className="text-[11px] font-medium text-slate-300">Performer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PerformerHeader;
