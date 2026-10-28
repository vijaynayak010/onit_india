import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Toast from '../components/shared/Toast';
import { chatRealtime } from '../services/chatRealtime';
import {
    getNotifications as apiGetNotifications,
    markNotificationRead as apiMarkRead,
    markAllNotificationsRead as apiMarkAllRead,
} from '../components/provider/services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();
    const [toasts, setToasts] = useState([]);
    const [items, setItems] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(n => n.id !== id));
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const resp = await apiGetNotifications({ limit: 20 });
            const list = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp) ? resp : []);
            setItems(prev => {
                const localItems = prev.filter(item => String(item.id).startsWith('test_') || String(item.id).startsWith('live_'));
                const fetchedIds = new Set(list.map(i => String(i.id)));
                const uniqueLocal = localItems.filter(i => !fetchedIds.has(String(i.id)));
                const combined = [...uniqueLocal, ...list];
                
                const apiUnread = typeof resp?.unreadCount === 'number' ? resp.unreadCount : list.filter(n => !n.isRead).length;
                const localUnread = uniqueLocal.filter(n => !n.isRead).length;
                setUnreadCount(apiUnread + localUnread);
                
                return combined;
            });
        } catch (err) {
            console.warn('Failed to load notifications:', err?.message || err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const markAsRead = useCallback(async (id) => {
        setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        if (!String(id).startsWith('test_') && !String(id).startsWith('live_')) {
            try { await apiMarkRead(id); } catch (err) { console.warn('markAsRead failed:', err?.message || err); }
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setItems(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try { await apiMarkAllRead(); } catch (err) { console.warn('markAllAsRead failed:', err?.message || err); }
    }, []);

    const handleNewNotification = useCallback((notification) => {
        // Toast for transient display
        const toastId = notification.id || Date.now();
        setToasts(prev => [
            ...prev,
            {
                id: toastId,
                title: notification.title || 'New Notification',
                message: notification.body || notification.payload?.message || 'You have a new update.',
                type: 'info'
            }
        ]);

        // Append to persistent list
        setItems(prev => [
            {
                id: notification.id || `live_${Date.now()}`,
                title: notification.title || 'New Notification',
                body: notification.body || notification.payload?.message || '',
                isRead: false,
                createdAt: notification.createdAt || new Date().toISOString(),
                ...notification,
            },
            ...prev,
        ]);
        setUnreadCount(prev => prev + 1);

        // Dispatch global event for silent real-time refresh across all panels
        window.dispatchEvent(new CustomEvent('onit-update', { detail: notification }));
    }, []);

    useEffect(() => {
        if (import.meta.env.DEV) {
            window.__testNotification = (type, payload = {}, title, body) => {
                handleNewNotification({
                    id: `test_${Date.now()}`,
                    type: type || 'TASK_ASSIGNED',
                    title: title || `Test: ${type}`,
                    body: body || `Click to test navigation for ${type}`,
                    createdAt: new Date().toISOString(),
                    isRead: false,
                    payload: payload
                });
                console.log(`[Test Notification] Simulated "${type}". Check the bottom-right toast or Bell icon!`);
            };
        }
    }, [handleNewNotification]);

    // Fetch on token mount; refresh on focus
    useEffect(() => {
        fetchNotifications();
        const onFocus = () => fetchNotifications();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [fetchNotifications]);

    // One native API Gateway WebSocket carries notifications and chat events.
    useEffect(() => {
        if (!token) {
            chatRealtime.disconnect();
            return undefined;
        }

        const appType = location.pathname.toLowerCase().startsWith('/performer')
            ? 'tasker'
            : 'provider';
        const unsubscribe = chatRealtime.subscribe('notification.new', handleNewNotification);
        chatRealtime.connect({ token, appType }).catch((error) => {
            console.warn('Notification WebSocket unavailable:', error?.message || error);
        });

        return () => {
            unsubscribe();
        };
    }, [handleNewNotification, location.pathname, token]);

    return (
        <NotificationContext.Provider value={{
            socket: chatRealtime,
            notifications: items,
            unreadCount,
            loading,
            refresh: fetchNotifications,
            markAsRead,
            markAllAsRead,
        }}>
            {children}

            {/* Global Notification Toasts Container */}
            <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((n) => (
                    <div key={n.id} className="pointer-events-auto">
                        <Toast
                            message={n.message}
                            type={n.type}
                            onClose={() => removeToast(n.id)}
                            duration={6000}
                        />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
