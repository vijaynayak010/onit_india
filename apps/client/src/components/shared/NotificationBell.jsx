import React, { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, BellOff, CheckCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { resolveNotificationRoute } from '../../utils/notificationRouter';

const formatTime = (iso) => {
    try {
        const d = new Date(iso);
        const diff = Date.now() - d.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return d.toLocaleDateString();
    } catch { return ''; }
};

const NotificationBell = () => {
    const { notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead } = useNotifications();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = () => {
        const next = !open;
        setOpen(next);
        if (next) refresh();
    };

    const handleNotificationClick = async (n) => {
        // 1. Mark as read if unread
        if (!n.isRead) {
            await markAsRead(n.id);
        }
        
        // 2. Close notification drawer
        setOpen(false);

        // 3. Resolve route using config-driven resolver
        const route = resolveNotificationRoute(n, user?.role);

        // 4. Navigate
        navigate(route);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={toggle}
                aria-label="Notifications"
                className="relative cursor-pointer text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
            >
                <Bell className="h-6 w-6" strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-[360px] max-w-[92vw] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl z-[200]">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <div>
                            <p className="text-[14px] font-bold text-gray-900">Notifications</p>
                            <p className="text-[11px] font-semibold text-gray-400">
                                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                            </p>
                        </div>
                        {notifications.length > 0 && unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-subtle)]/40"
                            >
                                <CheckCheck className="h-3 w-3" strokeWidth={2.5} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[420px] overflow-y-auto">
                        {loading && notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-gray-400">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--color-primary)]" />
                                <p className="mt-3 text-[12px] font-semibold">Loading...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                                    <BellOff className="h-6 w-6" strokeWidth={1.8} />
                                </div>
                                <p className="text-[13px] font-bold text-gray-700">No notifications yet</p>
                                <p className="mt-1 text-[11px] font-medium text-gray-400">
                                    You'll see updates about your tasks and chats here.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {notifications.map((n) => {
                                    const title = n.title || n.payload?.title || (n.type ? n.type.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Notification');
                                    const body = n.body || n.payload?.body || n.payload?.message || n.payload?.text || n.payload?.content;
                                    
                                    return (
                                        <li key={n.id}>
                                            <button
                                                type="button"
                                                onClick={() => handleNotificationClick(n)}
                                                className={`w-full px-4 py-3 text-left transition hover:bg-gray-50 ${!n.isRead ? 'bg-[var(--color-primary-subtle)]/30' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {!n.isRead && (
                                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`truncate text-[13px] ${!n.isRead ? 'font-medium text-gray-900' : 'font-semibold text-gray-700'}`}>
                                                            {title}
                                                        </p>
                                                        {body && (
                                                            <p className="mt-0.5 line-clamp-2 text-[12px] font-medium text-gray-500">
                                                                {body}
                                                            </p>
                                                        )}
                                                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                                                            <Clock className="h-3 w-3" strokeWidth={2.5} />
                                                            {formatTime(n.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
