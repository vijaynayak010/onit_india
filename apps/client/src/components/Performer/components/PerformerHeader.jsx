import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Briefcase, ChevronDown, Home, LogOut, Mail, Menu, MessageSquare, Search, Settings, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import NotificationBell from "../../shared/NotificationBell";

const navLinks = [
  { name: "Home", path: "/performer/dashboard", key: "dashboard", icon: Home },
  { name: "My Tasks", path: "/performer/my-tasks", key: "my-tasks", icon: Briefcase },
  { name: "Invitations", path: "/performer/invitations", key: "invitations", icon: Mail },
  { name: "Messages", path: "/performer/chats", key: "chats", icon: MessageSquare },
  { name: "Notifications", path: "/performer/notifications", key: "notifications", icon: Bell },
  { name: "Account", path: "/performer/account", key: "account", icon: UserRound },
];

const MotionDiv = motion.div;

const PerformerHeader = ({ activePage = "dashboard" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const displayName = user?.displayName || user?.name || user?.username || user?.email?.split("@")[0] || "Performer";
  const avatarUrl = user?.profilePicUrl || user?.avatar || user?.profilePicture || null;

  const initials = useMemo(() => {
    const rawName = user?.displayName || user?.name || user?.username || user?.email?.split("@")[0] || "";
    const parts = rawName.trim().split(/\s+/).filter(Boolean);
    if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return "FD";
  }, [user]);

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
      <header className="fixed left-0 top-0 z-[100] h-[80px] w-full border-b border-[var(--dash-border)] bg-[var(--dash-surface)]">
        <div className="flex h-full items-center justify-between px-5 sm:px-6">
          <button type="button" onClick={() => navigate("/performer/dashboard")} className="flex items-center gap-2" aria-label="Go to performer home">
            <svg width="26" height="18" viewBox="0 0 30 22" fill="none" aria-hidden="true">
              <path d="M11 2.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5c3.4 0 5.6-2.4 8-8.5 2.4-6.1 4.6-8.5 8-8.5" stroke="#29ADAC" strokeWidth="3" strokeLinecap="round" />
              <path d="M19 19.5c4.7 0 8.5-3.8 8.5-8.5S23.7 2.5 19 2.5c-3.4 0-5.6 2.4-8 8.5" stroke="#4CCDCC" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-medium tracking-tight text-[var(--dash-text)]">firstDoer</span>
          </button>

          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <label className="hidden h-10 w-[min(420px,40vw)] items-center gap-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3.5 text-[var(--dash-text-secondary)] focus-within:border-[var(--dash-primary-700)] focus-within:ring-2 focus-within:ring-[var(--dash-primary-700)]/15 md:flex">
              <Search size={16} strokeWidth={1.9} className="text-[var(--dash-text-secondary)]" />
              <input
                type="search"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && event.currentTarget.value.trim()) {
                    navigate(`/performer/find-tasks?q=${encodeURIComponent(event.currentTarget.value.trim())}`);
                  }
                }}
                placeholder="Search tasks, performers..."
                className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-text-secondary)]"
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
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-semibold text-white">
                    {initials}
                  </span>
                )}
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

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Toggle performer navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: "easeInOut" }}
              className="overflow-hidden border-b border-slate-200 bg-white/98 shadow-xl backdrop-blur-md lg:hidden"
            >
              <div className="flex flex-col gap-3 px-5 py-4">
                {/* Search in mobile drawer */}
                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="search"
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && mobileSearch.trim()) {
                        navigate(`/performer/find-tasks?q=${encodeURIComponent(mobileSearch.trim())}`);
                        setMobileMenuOpen(false);
                      }
                    }}
                    placeholder="Search tasks, skills..."
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col gap-1 py-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      activePage === link.key ||
                      ((activePage === "account" || activePage === "settings") && link.key === "account") ||
                      (activePage === "dashboard" && link.key === "dashboard");
                    return (
                      <button
                        key={link.key}
                        type="button"
                        onClick={() => {
                          navigate(link.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex h-11 w-full items-center gap-3 rounded-xl px-4 text-left text-sm transition ${
                          isActive
                            ? "bg-[var(--dash-active-bg)] font-medium text-[var(--dash-primary-700)]"
                            : "font-medium text-[var(--dash-text-secondary)] hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)]"
                        }`}
                      >
                        {Icon ? (
                          <Icon
                            size={17}
                            strokeWidth={2}
                            className={isActive ? "text-[var(--dash-primary-700)]" : "text-[var(--dash-text-secondary)]"}
                            aria-hidden="true"
                          />
                        ) : null}
                        <span>{link.name}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* User quick footer */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2.5">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dash-primary-700)] text-xs font-semibold text-white">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-heading font-medium text-[var(--dash-text)]">{displayName}</p>
                      <p className="text-[10px] font-medium text-[var(--dash-text-secondary)]">Performer</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <aside className="fixed left-0 top-[80px] z-[90] hidden h-[calc(100vh-80px)] w-[240px] flex-col border-r border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-6 lg:flex">
        <nav className="space-y-1.5" aria-label="Performer navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              activePage === link.key ||
              ((activePage === "account" || activePage === "settings") && link.key === "account") ||
              (activePage === "dashboard" && link.key === "dashboard");
            return (
              <button
                key={link.key}
                type="button"
                onClick={() => navigate(link.path)}
                className={`flex h-[42px] w-full items-center gap-3 rounded-xl px-3.5 text-left text-[14px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)] ${
                  isActive
                    ? "bg-[var(--dash-active-bg)] text-[var(--dash-primary-700)]"
                    : "text-[var(--dash-text-secondary)] hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)]"
                }`}
              >
                {Icon ? (
                  <Icon
                    size={17}
                    strokeWidth={2}
                    className={isActive ? "text-[var(--dash-primary-700)]" : "text-[var(--dash-text-secondary)]"}
                    aria-hidden="true"
                  />
                ) : null}
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-[var(--dash-border)] pt-3">
          <div className="flex items-center gap-2.5 px-2 py-2.5">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="h-9 w-9 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--dash-primary-700)] text-[12px] font-medium text-white">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[var(--dash-text)]">{displayName}</p>
              <p className="text-[11px] font-medium text-[var(--dash-text-secondary)]">Performer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PerformerHeader;
