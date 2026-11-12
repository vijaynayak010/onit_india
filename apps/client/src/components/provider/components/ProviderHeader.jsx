import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Settings, LogOut, Search, Menu, X, Home, ListTodo, MessageSquare, PlusCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationBell from '../../shared/NotificationBell';

const ProviderHeader = ({ activePage }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState(() => location.state?.query || "");

    // Keep the typed query visible after navigating to search results
    useEffect(() => {
        const incoming = location.state?.query;
        if (typeof incoming === "string") {
            setSearchQuery(incoming);
        }
    }, [location.pathname, location.state?.query]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate("/provider/search", { state: { query: searchQuery.trim() } });
            setMobileMenuOpen(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowAccountDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/provider/dashboard', key: 'home', icon: Home },
        { name: 'My Tasks', path: '/provider/my-tasks', key: 'my-tasks', icon: ListTodo },
        { name: 'Chats', path: '/provider/chats', key: 'chats', icon: MessageSquare },
    ];

    const getLinkClass = (key) => {
        const baseClass = "text-[14px] sm:text-[15px] transition-colors font-medium pb-1 border-b-[3px] border-transparent min-h-[44px] flex items-center";
        if (activePage === key) {
            return `${baseClass} text-[var(--color-primary)] border-[var(--color-primary)] font-semibold`;
        }
        return `${baseClass} text-[var(--color-text-muted)] hover:text-[var(--color-text)]`;
    };

    return (
        <header className="fixed left-0 top-0 z-[100] flex w-full shrink-0 flex-col border-b border-[var(--color-border)] bg-white/95 backdrop-blur-xl shadow-[var(--shadow-xs)]">
            {/* Main Nav — aligned with marketing site chrome */}
            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-3 py-2 sm:px-6 lg:px-8 lg:py-3.5">
                <div className="flex items-center gap-2">
                    {/* Mobile Menu Hamburger Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="inline-flex md:hidden items-center justify-center h-10 w-10 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    {/* Wordmark — FirstDoer */}
                    <button
                        type="button"
                        onClick={() => navigate("/provider/dashboard")}
                        className="flex shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-lg text-left transition hover:opacity-90 active:scale-[0.98]"
                        aria-label="Go to provider home"
                    >
                        <svg width="26" height="18" viewBox="0 0 30 22" fill="none" aria-hidden="true">
                            <path d="M11 2.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5c3.4 0 5.6-2.4 8-8.5 2.4-6.1 4.6-8.5 8-8.5" stroke="#29ADAC" strokeWidth="3" strokeLinecap="round" />
                            <path d="M19 19.5c4.7 0 8.5-3.8 8.5-8.5S23.7 2.5 19 2.5c-3.4 0-5.6 2.4-8 8.5" stroke="#4CCDCC" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <span className="text-lg sm:text-xl font-heading font-medium tracking-tight text-[#0D1210]">firstDoer</span>
                    </button>
                </div>

                {/* Right side Links, Search & Actions */}
                <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
                    {/* Global Search Bar in Navigation Bar (desktop) */}
                    <div className="hidden md:flex flex-1 max-w-[240px] lg:max-w-md relative">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <Search
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]"
                                strokeWidth={2.25}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search performers, skills..."
                                className="w-full rounded-full border border-[var(--color-border)] bg-slate-50 py-2 pl-10 pr-4 text-xs font-medium text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 min-h-[38px]"
                            />
                        </form>
                    </div>

                    {/* Nav Links (desktop) */}
                    <nav className="hidden items-center gap-5 md:flex lg:gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.key}
                                onClick={() => navigate(link.path)}
                                className={getLinkClass(link.key)}
                            >
                                {link.name}
                            </button>
                        ))}
                    </nav>

                    {/* Post Task Action Button */}
                    <button
                        onClick={() => navigate('/provider/post-task-selection')}
                        className="rounded-full px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[var(--color-primary)] shadow-sm transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow active:scale-[0.98] cursor-pointer whitespace-nowrap min-h-[38px] flex items-center justify-center gap-1.5"
                    >
                        <PlusCircle size={15} className="hidden sm:inline" />
                        <span>Post Task</span>
                    </button>

                    {/* Notification Bell */}
                    <NotificationBell />

                    {/* Account Dropdown Area */}
                    <div className="relative" ref={dropdownRef}>
                        <div
                            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                            className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-primary)] bg-white p-0.5 shadow-[var(--shadow-xs)] transition hover:shadow-md"
                        >
                            <img
                                src={user?.profilePicUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                alt="User Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>

                        <AnimatePresence>
                            {showAccountDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white py-2 shadow-[var(--shadow-xl)]"
                                >
                                    <div className="border-b border-[var(--color-border)] px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">Account</p>
                                        <p className="truncate text-sm font-medium text-[var(--color-text)]">{user?.displayName || user?.name || user?.username || user?.email?.split("@")[0] || 'Provider'}</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate("/provider/settings");
                                                setShowAccountDropdown(false);
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-primary-subtle)] min-h-[44px]"
                                        >
                                            <LayoutDashboard size={18} className="text-[var(--color-text-subtle)]" strokeWidth={2} />
                                            Account dashboard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate("/provider/settings?tab=settings");
                                                setShowAccountDropdown(false);
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-primary-subtle)] min-h-[44px]"
                                        >
                                            <Settings size={18} className="text-[var(--color-text-subtle)]" strokeWidth={2} />
                                            Settings
                                        </button>
                                    </div>
                                    <div className="border-t border-[var(--color-border)] pt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                logout();
                                                navigate("/");
                                                setShowAccountDropdown(false);
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 min-h-[44px]"
                                        >
                                            <LogOut size={18} strokeWidth={2} />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer / Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg overflow-hidden"
                    >
                        {/* Search on mobile */}
                        <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
                            <Search
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                                strokeWidth={2.25}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search performers, skills..."
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 outline-none focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 min-h-[44px]"
                            />
                        </form>

                        {/* Navigation Links on mobile */}
                        <nav className="flex flex-col gap-1 mb-4">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = activePage === link.key;
                                return (
                                    <button
                                        key={link.key}
                                        type="button"
                                        onClick={() => {
                                            navigate(link.path);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors text-left min-h-[44px] ${
                                            isActive
                                                ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-semibold"
                                                : "text-gray-700 hover:bg-gray-50 font-medium"
                                        }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-[var(--color-primary)]" : "text-gray-400"} />
                                        <span>{link.name}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Quick Account links on mobile */}
                        <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    navigate("/provider/settings");
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 text-left min-h-[40px]"
                            >
                                <LayoutDashboard size={16} className="text-gray-400" />
                                <span>Account dashboard</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    navigate("/provider/settings?tab=settings");
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 text-left min-h-[40px]"
                            >
                                <Settings size={16} className="text-gray-400" />
                                <span>Settings</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    navigate("/");
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 text-left min-h-[40px]"
                            >
                                <LogOut size={16} className="text-red-500" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default ProviderHeader;
