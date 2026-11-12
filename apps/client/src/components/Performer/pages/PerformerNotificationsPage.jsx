import React, { useEffect } from "react";
import { Bell, BellOff, CheckCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import { useNotifications } from "../../../contexts/NotificationContext";
import { resolveNotificationRoute } from "../../../utils/notificationRouter";
import { useAuth } from "../../../contexts/AuthContext";

const formatTime = (iso) => {
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  } catch {
    return "";
  }
};

const getNotificationText = (notification) => {
  const title =
    notification.title ||
    notification.payload?.title ||
    (notification.type
      ? notification.type
          .toLowerCase()
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Notification");
  const body =
    notification.body ||
    notification.payload?.body ||
    notification.payload?.message ||
    notification.payload?.text ||
    notification.payload?.content ||
    "";

  return { title, body };
};

const PerformerNotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleOpen = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    navigate(resolveNotificationRoute(notification, user?.role));
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="notifications" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto max-w-4xl">
          <PerformerPageHeader
            title="Notifications"
            subtitle="Task updates, messages, payments, and account alerts"
            showBack={false}
            actions={
              notifications.length > 0 && unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-5 text-sm font-bold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--color-primary-subtle)]"
                >
                  <CheckCheck size={17} strokeWidth={2.4} />
                  Mark all read
                </button>
              ) : null
            }
          />

          <section className="overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
            {loading && notifications.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[var(--color-primary)]" />
                <p className="mt-3 text-sm font-semibold">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                  <BellOff size={30} strokeWidth={1.8} />
                </div>
                <h2 className="text-lg font-medium text-slate-800">No notifications yet</h2>
                <p className="mt-1 max-w-sm text-sm font-medium text-slate-400">
                  Updates about your tasks, chats, and account will appear here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const { title, body } = getNotificationText(notification);
                  return (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() => handleOpen(notification)}
                        className={`flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${
                          !notification.isRead ? "bg-[var(--color-primary-subtle)]/35" : ""
                        }`}
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                          <Bell size={18} strokeWidth={2.2} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-slate-900">{title}</span>
                          {body ? (
                            <span className="mt-1 line-clamp-2 block text-sm font-medium leading-6 text-slate-500">{body}</span>
                          ) : null}
                          <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-400">
                            <Clock size={13} strokeWidth={2.4} />
                            {formatTime(notification.createdAt)}
                          </span>
                        </span>
                        {!notification.isRead ? <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-primary)]" /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PerformerNotificationsPage;
