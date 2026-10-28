import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Settings, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationBell from '../../shared/NotificationBell';

const ProviderHeader = ({ activePage }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState(() => location.state?.query || "");

    // Keep the typed query visible after navigating to search results
    useEffect(() => {
        const incoming = location.state?.query;
        if (typeof incoming === "string") {
            setSearchQuery(incoming);
        }
    }, [location.pathname, location.state?.query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate("/provider/search", { state: { query: searchQuery.trim() } });
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
        { name: 'Home', path: '/provider/dashboard', key: 'home' },
        { name: 'My Tasks', path: '/provider/my-tasks', key: 'my-tasks' },
        { name: 'Chats', path: '/provider/chats', key: 'chats' },
    ];

    const getLinkClass = (key) => {
        const baseClass = "text-[15px] transition-colors font-bold pb-1 border-b-[3px] border-transparent";
        if (activePage === key) {
            return `${baseClass} text-[var(--color-primary)] border-[var(--color-primary)]`;
        }
        return `${baseClass} text-[var(--color-text-muted)] hover:text-[var(--color-text)]`;
    };

    return (
        <header className="fixed left-0 top-0 z-[100] flex w-full shrink-0 flex-col border-b border-[var(--color-border)] bg-white/90 backdrop-blur-xl shadow-[var(--shadow-xs)]">
            {/* Main Nav — aligned with marketing site chrome */}           
            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-2 py-2 sm:px-6 lg:px-8 lg:py-4">
                <div className="flex items-center">
                    {/* Wordmark — same as landing Navbar (no image logo) */}
                    <button
                        type="button"
                        onClick={() => navigate("/provider/dashboard")}
                        className="flex shrink-0 cursor-pointer items-center overflow-hidden rounded-lg text-left transition hover:opacity-90 active:scale-[0.98]"
                        aria-label="Go to provider home"
                    >
                        <img src="/logo.png" alt="OnIT India Logo" className="h-10 w-18 object-contain mr-2" />
                    </button>
                </div>

                {/* Right side Links, Search & Actions */}
                <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
                    {/* Global Search Bar in Navigation Bar (placed on the right side, beside the Home link) */}
                    <div className="hidden md:flex flex-1 max-w-[280px] lg:max-w-md relative">
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
                                className="w-full rounded-full border border-[var(--color-border)] bg-slate-50 py-2 pl-10 pr-4 text-xs font-semibold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                            />
                        </form>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden items-center gap-8 md:flex lg:gap-10">
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

                    {/* Post Task Action as Button */}
                    <button
                        onClick={() => navigate('/provider/post-task-selection')}
                        className="rounded-full p-2.5 bg-[var(--color-primary)] px-5 py-2 text-[14px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow active:scale-[0.98] cursor-pointer whitespace-nowrap"
                    >
                        Post Task
                    </button>

                    {/* Notification Bell */}
                    <NotificationBell />

                    {/* Account Dropdown Area */}
                    <div className="relative" ref={dropdownRef}>
                        <div
                            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                            className="flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-primary)] bg-white p-0.5 shadow-[var(--shadow-xs)] transition hover:shadow-md"
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
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-subtle)]">Account</p>
                                        <p className="truncate text-sm font-bold text-[var(--color-text)]">{user?.displayName || user?.name || user?.username || user?.email?.split("@")[0] || 'Provider'}</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate("/provider/settings");
                                                setShowAccountDropdown(false);
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-primary-subtle)]"
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
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-primary-subtle)]"
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
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
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
        </header>
    );
};

export default ProviderHeader;
