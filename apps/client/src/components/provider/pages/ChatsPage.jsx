import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProviderHeader from "../components/ProviderHeader";
import PerformerHeader from "../../Performer/components/PerformerHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  ChevronLeft,
  Bot,
  Sparkles,
  ShieldCheck,
  Clock,
  User,
  Headset,
  CheckCircle2,
  Check,
  CheckCheck,
  AlertCircle,
  MoreVertical,
  Info,
  SlidersHorizontal,
  Bell,
  Pin,
  Archive,
  Star,
  Trash2,
  VolumeX,
  MailOpen,
  MessageCircle,
} from "lucide-react";
import {
  applyChatPrefsToList,
  setPinned,
  setArchived,
  setStarred,
  removeFromPrefs,
} from "../utils/chatPreferences";
import {
  listConversations,
  getMessages,
  sendMessage as apiSendMessage,
  createSupportTicket,
  addSupportMessage,
  createConversation,
  listSupportTickets,
  getSupportTicketMessages,
  markAsRead,
  listMyTasks,
} from "../services/api";
import { getAssignedTasks, submitRating } from "../../Performer/services/api";
import { useAuth } from "../../../contexts/AuthContext";
import {
  chatRealtime,
  createChatClientMessageId,
} from "../../../services/chatRealtime";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const BRAND = "#009966";
const BRAND_LIGHT = "#f0fbf7";

const CHAT_FILTERS = [
  { id: "all", label: "All Chats", icon: MessageCircle, color: "#059669" },
  { id: "read", label: "Read", icon: MailOpen, color: "#2563eb" },
  { id: "unread", label: "Unread", icon: MessageCircle, color: "#ef4444" },
  { id: "starred", label: "Starred", icon: Star, color: "#eab308" },
];

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDisplayTime(isoString);
  } catch {
    return "";
  }
}

function formatDisplayTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    if (isToday) {
      let h = date.getHours();
      const m = String(date.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    }
    return `${date.getDate()}/${date.getMonth() + 1}`;
  } catch {
    return "";
  }
}

function formatBubbleTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    let h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  } catch {
    return "";
  }
}

/* ─────────────────────────────────────────────
   Status tick icon (mirrors Flutter's _buildStatusIcon)
───────────────────────────────────────────── */
function StatusIcon({ status }) {
  if (status === "sending")
    return <Clock size={13} style={{ color: "rgba(255,255,255,0.65)" }} />;
  if (status === "error")
    return <AlertCircle size={14} style={{ color: "#f87171" }} />;
  if (status === "read")
    return <CheckCheck size={14} style={{ color: "#60a5fa" }} />;
  if (status === "delivered")
    return <CheckCheck size={14} style={{ color: "rgba(255,255,255,0.72)" }} />;
  return <Check size={14} style={{ color: "rgba(255,255,255,0.72)" }} />;
}

/* ─────────────────────────────────────────────
   Avatar (mirrors Flutter's _buildAvatar)
───────────────────────────────────────────── */
function Avatar({ src, name = "?", size = 56, showBadge = false }) {
  const [err, setErr] = useState(false);
  const initials = (name || "?").charAt(0).toUpperCase();

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          background: "#f3f4f6",
          border: "2px solid #fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        {src && !err ? (
          <img
            src={src}
            alt={name}
            onError={() => setErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${BRAND}22, ${BRAND}44)`,
              fontSize: size * 0.35,
              fontWeight: 700,
              color: BRAND,
            }}
          >
            {initials}
          </div>
        )}
      </div>
      {showBadge && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            background: "#fff",
            borderRadius: "50%",
            padding: 1,
            lineHeight: 0,
          }}
        >
          <CheckCircle2 size={16} style={{ color: BRAND }} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Chat List Card (mirrors Flutter's _buildChatCard)
───────────────────────────────────────────── */
function ChatCard({
  chat,
  isActive,
  isSelected,
  selectionMode,
  onClick,
  onLongPress,
  onMenuClick,
}) {
  const lastMsgContent = chat.lastMessage?.content || "No messages yet";
  const lastMsgTime = formatRelativeTime(
    chat.lastMessage?.createdAt || chat.updatedAt
  );
  const isSupportCard = chat._id === 0;
  const primaryTitle = chat.taskTitle || chat.name || "Conversation";
  const participantText = chat.taskTitle
    ? `${chat.participantRole || "Participant"}: ${chat.name || "Unknown"}`
    : chat.role;
  const longPressTimer = useRef(null);

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown = () => {
    if (isSupportCard || selectionMode) return;
    longPressTimer.current = setTimeout(() => onLongPress?.(chat), 450);
  };

  const highlighted = selectionMode ? isSelected : isActive;

  return (
    <div
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={clearLongPress}
      onPointerLeave={clearLongPress}
      onContextMenu={(e) => {
        if (!isSupportCard) {
          e.preventDefault();
          onLongPress?.(chat);
        }
      }}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition ${
        highlighted ? "bg-[var(--color-primary-subtle)]" : "hover:bg-gray-50"
      }`}
    >
      {isSupportCard ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[var(--color-primary)] shadow-sm">
          <Bot size={24} className="text-white" strokeWidth={2} />
        </div>
      ) : (
        <div className="relative shrink-0">
          <Avatar src={chat.avatar} name={chat.name} size={48} />
          {chat.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-base font-extrabold text-gray-900" title={primaryTitle}>
            {primaryTitle}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            {chat.isPinned && !isSupportCard && (
              <Pin
                size={13}
                strokeWidth={2.5}
                className="-rotate-45 text-gray-400"
                aria-label="Pinned"
              />
            )}
            <span className="text-[11px] font-medium text-gray-400">{lastMsgTime}</span>
          </div>
        </div>
        {participantText && (
          <div className="mb-0.5 truncate text-[12px] font-semibold text-gray-600">
            {participantText}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[12px] font-medium text-gray-400">
            {lastMsgContent}
          </span>
          {chat.unreadCount > 0 && !isActive && (
            <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[10px] font-bold text-white">
              {String(chat.unreadCount).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {!isSupportCard && !selectionMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(chat, e);
          }}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-lg p-1.5 text-gray-400 opacity-0 transition hover:bg-white hover:text-gray-600 group-hover:opacity-100 md:block"
          aria-label="Chat options"
        >
          <MoreVertical size={16} />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Message Bubble (mirrors Flutter's _buildProfessionalBubble)
───────────────────────────────────────────── */
function MessageBubble({ msg, isMe }) {
  const time = formatBubbleTime(msg.createdAt || msg.time);

  return (
    <motion.div
      initial={{ opacity: 0, x: isMe ? 16 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isMe ? "flex-end" : "flex-start",
        marginBottom: 4,
      }}
    >
      <div
        style={{
          maxWidth: "72%",
          padding: "10px 14px",
          borderRadius: isMe
            ? "18px 18px 4px 18px"
            : "18px 18px 18px 4px",
          background: isMe ? BRAND : "#fff",
          color: isMe ? "#fff" : "#374151",
          fontSize: 14,
          lineHeight: 1.45,
          boxShadow: isMe
            ? "0 2px 8px rgba(0,153,102,0.2)"
            : "0 1px 4px rgba(0,0,0,0.06)",
          border: isMe ? "none" : "1px solid #f0f0f0",
          wordBreak: "break-word",
          fontFamily: "var(--font-sans)",
        }}
      >
        {msg.content || msg.text || ""}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 3,
          paddingLeft: isMe ? 0 : 4,
          paddingRight: isMe ? 4 : 0,
        }}
      >
        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>
          {time}
        </span>
        {isMe && (
          <StatusIcon
            status={msg.status || (msg.readAt ? "read" : msg.deliveredAt ? "delivered" : "sent")}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Support Bubble
───────────────────────────────────────────── */
function SupportBubble({ text, time }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: BRAND,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,153,102,0.2)",
        }}
      >
        <Bot size={18} color="#fff" strokeWidth={2} />
      </div>
      <div>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "18px 18px 18px 4px",
            background: "#fff",
            border: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            fontSize: 14,
            color: "#374151",
            lineHeight: 1.45,
            maxWidth: "70vw",
            wordBreak: "break-word",
          }}
        >
          {text}
        </div>
        <span
          style={{
            display: "block",
            fontSize: 10,
            color: "#9ca3af",
            marginTop: 3,
            marginLeft: 4,
            fontWeight: 500,
          }}
        >
          {time}
        </span>
      </div>
    </motion.div>
  );
}

function UserSupportBubble({ text, time }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "18px 18px 4px 18px",
          background: BRAND,
          color: "#fff",
          fontSize: 14,
          lineHeight: 1.45,
          boxShadow: "0 2px 8px rgba(0,153,102,0.2)",
          maxWidth: "70vw",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 3,
          paddingRight: 4,
        }}
      >
        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>
          {time}
        </span>
        <CheckCheck size={13} style={{ color: BRAND }} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Chat filter dropdown & action modals
───────────────────────────────────────────── */
function ChatFilterMenu({ open, onClose, activeFilter, onSelect }) {
  if (!open) return null;
  return (
    <>
      <button type="button" className="fixed inset-0 z-40" onClick={onClose} aria-label="Close filters" />
      <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1 shadow-lg">
        {CHAT_FILTERS.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                onSelect(f.id);
                onClose();
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold transition hover:bg-gray-50 ${
                activeFilter === f.id ? "bg-gray-50 text-gray-900" : "text-gray-700"
              }`}
            >
              <Icon size={16} style={{ color: f.color }} strokeWidth={2.25} />
              {f.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function ChatActionsMenu({ chat, position, onClose, onAction }) {
  if (!chat || !position) return null;
  const actions = [
    { id: "pin", label: "Pin", icon: Pin },
    { id: "mute", label: "Mute", icon: VolumeX },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "delete", label: "Delete", icon: Trash2, danger: true },
    { id: "read", label: "Mark as read", icon: MailOpen },
  ];
  return (
    <>
      <button type="button" className="fixed inset-0 z-40" onClick={onClose} aria-label="Close menu" />
      <div
        className="fixed z-50 min-w-[160px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
        style={{ top: position.top, left: Math.max(8, position.left - 140) }}
      >
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                onAction(a.id, chat);
                onClose();
              }}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold transition hover:bg-gray-50 ${
                a.danger ? "text-red-600" : "text-gray-700"
              }`}
            >
              <Icon size={15} strokeWidth={2.25} />
              {a.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function ChatConfirmModal({ type, onConfirm, onCancel }) {
  const configs = {
    pin: {
      icon: Pin,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      title: "Pin this chat?",
      desc: "This chat will be pinned to the top of your chat list for quick access.",
      confirm: "Pin Chat",
      confirmClass: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]",
    },
    archive: {
      icon: Archive,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      title: "Archive this chat?",
      desc: "Archived chats are hidden from your main list but can be accessed anytime.",
      confirm: "Archive Chat",
      confirmClass: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]",
    },
    delete: {
      icon: AlertCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      title: "Delete this chat?",
      desc: "This action is permanent and cannot be undone. All messages will be lost.",
      confirm: "Delete Chat",
      confirmClass: "bg-red-600 hover:bg-red-700",
    },
  };
  const cfg = configs[type];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${cfg.iconBg}`}>
          <Icon size={26} className={cfg.iconColor} strokeWidth={2.25} />
        </div>
        <h3 className="text-center text-lg font-extrabold text-gray-900">{cfg.title}</h3>
        <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">{cfg.desc}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition ${cfg.confirmClass}`}
          >
            {cfg.confirm}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main ChatsPage Component
───────────────────────────────────────────── */
const ChatsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const isPerformer = location.pathname.toLowerCase().startsWith("/performer");

  const [activeTaskIds, setActiveTaskIds] = useState(null);

  /* Conversations list state */
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatFilter, setChatFilter] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [actionsMenu, setActionsMenu] = useState({ chat: null, position: null });
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const userId = user?.id || user?._id || user?.userId || "guest";

  const withPrefs = useCallback(
    (list) => applyChatPrefsToList(list, userId),
    [userId]
  );

  /* Active chat state */
  const [activeChat, setActiveChat] = useState(null); // null = no selection, 0 = support
  const [activeChatData, setActiveChatData] = useState(null);

  /* Messages state */
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  /* Support ticket */
  const [supportView, setSupportView] = useState("dashboard");
  const [activeSupportTicketId, setActiveSupportTicketId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Mobile: show chat pane only when a chat is selected */
  const [showChatPane, setShowChatPane] = useState(false);

  /* ── normalise backend convo shape ── */
  const normalizeConversation = useCallback((c, taskTitles = new Map()) => {
    if (!c) return null;
    const cid = c.id || c._id;
    const taskId = c.taskId || c.task?.id || c.task?._id;
    const displayName =
      c.otherUser?.displayName ||
      c.otherUser?.email?.split("@")[0] ||
      c.name ||
      "Conversation";
    const taskTitle =
      c.taskTitle ||
      c.task?.title ||
      c.task?.taskTitle ||
      c.taskName ||
      (taskId ? taskTitles.get(String(taskId)) : null) ||
      (taskId ? "Task conversation" : null);
    const isClosed = Boolean(
      c.isClosed ||
      c.closed ||
      c.status === "CLOSED" ||
      c.status === "COMPLETED" ||
      c.task?.status === "COMPLETED" ||
      c.task?.status === "CLOSED" ||
      c.taskStatus === "COMPLETED" ||
      c.taskStatus === "CLOSED"
    );
    return {
      _id: cid,
      id: cid,
      taskId,
      taskTitle,
      isClosed,
      name: displayName,
      role: taskId ? "Task chat" : "Direct message",
      participantRole: isPerformer ? "Provider" : "Performer",
      profession: c.otherUser?.profession || (taskId ? "Tasker" : null),
      avatar: c.otherUser?.profilePicUrl || c.avatar,
      lastMessage: c.lastMessage,
      unreadCount: c.unreadCount || 0,
      updatedAt: c.updatedAt,
      otherUser: c.otherUser,
    };
  }, [isPerformer]);

  /* ── fetch conversations ── */
  const fetchConversations = useCallback(
    async (targetUserId, targetTaskId, openSupport = false) => {
      try {
        setLoading(true);

        // Fetch active task IDs to filter out completed, closed, or cancelled tasks
        let activeIds = new Set();
        const taskTitles = new Map();
        try {
          if (isPerformer) {
            const assignedRes = await getAssignedTasks().catch(() => null);
            const assignedTasks = assignedRes?.tasks || assignedRes?.data || (Array.isArray(assignedRes) ? assignedRes : []);
            if (Array.isArray(assignedTasks)) {
              assignedTasks.forEach((t) => {
                if (!t) return;
                const task = t.task || {};
                const taskId = task.id || task._id || t.id || t._id;
                const taskTitle = task.title || task.taskTitle || t.title || t.taskTitle;
                const status = String(t.status || task.status || "").toUpperCase();
                if (taskId && !["COMPLETED", "CLOSED", "CANCELLED"].includes(status)) {
                  activeIds.add(String(taskId));
                  if (taskTitle) taskTitles.set(String(taskId), taskTitle);
                }
              });
            }
          } else {
            const response = await listMyTasks({ limit: 50 }).catch(() => null);
            const fetchedTasks = response?.data || (Array.isArray(response) ? response : []);
            if (Array.isArray(fetchedTasks)) {
              fetchedTasks.forEach((t) => {
                if (!t) return;
                const taskId = t.id || t._id;
                const taskTitle = t.title || t.taskTitle || t.task?.title;
                const status = String(t.status || "").toUpperCase();
                if (taskId && !["COMPLETED", "CLOSED", "CANCELLED"].includes(status)) {
                  activeIds.add(String(taskId));
                  if (taskTitle) taskTitles.set(String(taskId), taskTitle);
                }
              });
            }
          }
          setActiveTaskIds(activeIds);
        } catch (err) {
          console.error("Error loading active tasks:", err);
        }

        const response = await listConversations().catch(() => []);
        const raw = Array.isArray(response)
          ? response
          : Array.isArray(response?.conversations)
          ? response.conversations
          : [];
        const list = raw
          .map((conversation) => normalizeConversation(conversation, taskTitles))
          .filter(Boolean)
          .filter((c) => {
            // Filter out completed tasks
            if (!c.taskId) return true; // Direct messages are always shown
            return activeIds.has(String(c.taskId));
          });

        const supportChat = {
          _id: 0,
          name: "OnIT INDIA Support",
          role: "Support Buddy",
          profession: null,
          lastMessage: { content: "Hi, I am your OnIT INDIA Buddy..." },
          updatedAt: new Date().toISOString(),
          avatar: "support",
          unreadCount: 0,
        };

        // Deduplicate: keep all unique task chats separate, and only deduplicate direct messages (no taskId)
        const seenConversations = new Map();
        list.forEach((conv) => {
          const uid = conv.otherUser?.id || conv.otherUser?._id;
          if (!uid) return;
          
          // Unique key: if taskId exists, use uid-taskId to keep them separate. Otherwise just uid.
          const key = conv.taskId ? `${uid}-${conv.taskId}` : uid;
          
          const existing = seenConversations.get(key);
          if (!existing) {
            seenConversations.set(key, conv);
          } else {
            // Keep the one with most recent activity (lastMessage or updatedAt)
            const existingTime = new Date(existing.lastMessage?.createdAt || existing.updatedAt || 0).getTime();
            const newTime = new Date(conv.lastMessage?.createdAt || conv.updatedAt || 0).getTime();
            if (newTime > existingTime) seenConversations.set(key, conv);
          }
        });
        // Rebuild list: conversations without otherUser (edge case) + deduplicated ones
        const deduped = [
          ...list.filter((c) => !(c.otherUser?.id || c.otherUser?._id)),
          ...Array.from(seenConversations.values()),
        ].sort((a, b) => {
          const aTime = new Date(a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
          const bTime = new Date(b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
          return bTime - aTime; // newest first
        });

        const newList = [supportChat, ...deduped];
        setConversations(withPrefs(newList));

        // Need-help links open the shared support conversation directly.
        if (openSupport) {
          openChat(supportChat);
          return;
        }

        /* Auto-open a conversation from URL params */
        if (targetUserId) {
          const existing = newList.find((c) => {
            const isMatchUser = c.otherUser?.id === targetUserId || c.otherUser?._id === targetUserId;
            if (!isMatchUser) return false;
            if (targetTaskId) {
              return String(c.taskId) === String(targetTaskId);
            } else {
              return !c.taskId;
            }
          }) || (!targetTaskId ? newList.find((c) => c.otherUser?.id === targetUserId || c.otherUser?._id === targetUserId) : null);

          if (existing) {
            openChat(existing);
          } else {
            try {
              const createPayload = { otherUserId: targetUserId };
              if (targetTaskId) {
                createPayload.taskId = targetTaskId;
              }
              const created = await createConversation(createPayload);
              const cc = created?.conversation || created?.data || created;
              const cid = cc?.id || cc?._id;
              const refreshed = await listConversations().catch(() => []);
              const rRaw = Array.isArray(refreshed)
                ? refreshed
                : Array.isArray(refreshed?.conversations)
                ? refreshed.conversations
                : [];
              const rList = rRaw
                .map((conversation) => normalizeConversation(conversation, taskTitles))
                .filter(Boolean)
                .filter((c) => {
                  if (!c.taskId) return true;
                  return activeIds.has(String(c.taskId));
                });

              // Deduplicate and rebuild the list here too so the newly created conversation is properly handled
              const seenConversationsRefreshed = new Map();
              rList.forEach((conv) => {
                const uid = conv.otherUser?.id || conv.otherUser?._id;
                if (!uid) return;
                const key = conv.taskId ? `${uid}-${conv.taskId}` : uid;
                const prevConv = seenConversationsRefreshed.get(key);
                if (!prevConv) {
                  seenConversationsRefreshed.set(key, conv);
                } else {
                  const existingTime = new Date(prevConv.lastMessage?.createdAt || prevConv.updatedAt || 0).getTime();
                  const newTime = new Date(conv.lastMessage?.createdAt || conv.updatedAt || 0).getTime();
                  if (newTime > existingTime) seenConversationsRefreshed.set(key, conv);
                }
              });
              const dedupedRList = [
                ...rList.filter((c) => !(c.otherUser?.id || c.otherUser?._id)),
                ...Array.from(seenConversationsRefreshed.values()),
              ].sort((a, b) => {
                const aTime = new Date(a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
                const bTime = new Date(b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
                return bTime - aTime;
              });

              const newFull = [supportChat, ...dedupedRList];
              setConversations(newFull);

              // Find by conversation ID (string-safe), or by otherUser ID & taskId as fallback
              const found =
                newFull.find((c) => cid && String(c._id) === String(cid)) ||
                newFull.find((c) => {
                  const isMatchUser = c.otherUser?.id === targetUserId || c.otherUser?._id === targetUserId;
                  if (!isMatchUser) return false;
                  if (targetTaskId) {
                    return String(c.taskId) === String(targetTaskId);
                  } else {
                    return !c.taskId;
                  }
                });
              if (found) openChat(found);
            } catch (err) {
              console.error("Error creating conversation:", err);
            }
          }
        }
      } catch (err) {
        console.error("Fetch conversations error:", err);
        setConversations(
          withPrefs([
            {
              _id: 0,
              name: "OnIT INDIA Support",
              role: "Support Buddy",
              lastMessage: { content: "Hi, I am your OnIT INDIA Buddy..." },
              updatedAt: new Date().toISOString(),
              avatar: "support",
              unreadCount: 0,
            },
          ])
        );
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [normalizeConversation]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    fetchConversations(params.get("userId"), params.get("taskId"), params.get("support") === "1");
  }, [location.search, fetchConversations]);

  /* ── open chat helper ── */
  function openChat(chat) {
    setActiveChat(chat._id);
    setActiveChatData(chat);
    setShowChatPane(true);
    setMessages([]);
    if (chat._id === 0) {
      setSupportView("dashboard");
      return;
    }

    // Instantly clear unread count in local list
    if (chat.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c))
      );
      markAsRead(chat._id).catch((err) => {
        console.error("Failed to mark conversation as read:", err);
      });
    }
  }

  /* Keep the conversation preview current without replacing the list with a loader. */
  const updateConversationPreview = useCallback(
    (conversationId, message, { incrementUnread = false } = {}) => {
      if (conversationId === null || conversationId === undefined || !message) return;

      const createdAt = message.createdAt || new Date().toISOString();
      setConversations((previous) =>
        previous.map((conversation) => {
          if (String(conversation._id) !== String(conversationId)) return conversation;

          return {
            ...conversation,
            lastMessage: {
              ...(conversation.lastMessage || {}),
              ...message,
              createdAt,
            },
            updatedAt: createdAt,
            unreadCount: incrementUnread
              ? Number(conversation.unreadCount || 0) + 1
              : conversation.unreadCount,
          };
        })
      );
    },
    []
  );

  /* ── fetch messages ── */
  const fetchMessages = useCallback(
    async (convId, isPolling = false) => {
      if (convId === null || convId === undefined) return;

      if (convId === 0) {
        if (!isPolling) {
          try {
            setLoadingMessages(true);
            const ticketsResponse = await listSupportTickets().catch(() => []);
            const ticketsList = Array.isArray(ticketsResponse?.data)
              ? ticketsResponse.data
              : Array.isArray(ticketsResponse)
              ? ticketsResponse
              : [];
            const activeTicket = ticketsList.find((t) =>
              ["OPEN", "IN_PROGRESS"].includes(t.status)
            );
            if (activeTicket) {
              const ticketId = activeTicket.id || activeTicket._id;
              setActiveSupportTicketId(ticketId);
              const fullTicket = await getSupportTicketMessages(
                ticketId
              ).catch(() => null);
              if (fullTicket) {
                const ticketMsgs = Array.isArray(fullTicket.messages)
                  ? fullTicket.messages
                  : [];
                const formatted = [
                  {
                    id: "sys-1",
                    text: "Hi! I'm your OnIT Buddy. How can I help you today?",
                    time: "System",
                    type: "received",
                  },
                ];
                if (fullTicket.message) {
                  formatted.push({
                    id: "orig",
                    text: fullTicket.message,
                    time: new Date(fullTicket.createdAt).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    ),
                    type: "sent",
                  });
                }
                ticketMsgs.forEach((m) => {
                  formatted.push({
                    id: m._id || m.id,
                    text: m.content,
                    time: new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    type: m.isAdmin ? "received" : "sent",
                  });
                });
                setMessages(formatted);
                return;
              }
            }
          } catch (err) {
            console.error("Support fetch error:", err);
          } finally {
            setLoadingMessages(false);
          }
          setMessages([
            {
              id: "sys-1",
              text: "Hi! I'm your OnIT Buddy. How can I help you today?",
              time: "System",
              type: "received",
            },
          ]);
        }
        return;
      }

      try {
        if (!isPolling) setLoadingMessages(true);
        const response = await getMessages(convId, { page: "1", limit: "50" }).catch(
          () => ({ messages: [] })
        );

        const rawList = Array.isArray(response?.messages)
          ? response.messages
          : Array.isArray(response)
          ? response
          : [];

        // Sort newest last (ascending by createdAt)
        const sorted = [...rawList].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setMessages((prev) => {
          // Keep local "sending" messages not yet confirmed
          const localSending = prev.filter((m) => m.status === "sending");
          const ids = new Set(sorted.map((m) => String(m.id || m._id)));
          const clientMessageIds = new Set(
            sorted.map((m) => m.clientMessageId).filter(Boolean)
          );
          const stillPending = localSending.filter(
            (m) =>
              !ids.has(String(m.id)) &&
              !clientMessageIds.has(m.clientMessageId)
          );
          const next = [...sorted, ...stillPending];
          return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
        });

        // Sync and clear unread count in conversations state if we have unread messages locally
        setConversations((prev) => {
          const currentConv = prev.find((c) => c._id === convId);
          if (currentConv && currentConv.unreadCount > 0) {
            markAsRead(convId).catch(() => {});
            return prev.map((c) =>
              c._id === convId ? { ...c, unreadCount: 0 } : c
            );
          }
          return prev;
        });
      } catch (err) {
        console.error("Fetch messages error:", err);
      } finally {
        if (!isPolling) setLoadingMessages(false);
      }
    },
    []
  );

  /* ── trigger message fetch when activeChat changes ── */
  useEffect(() => {
    if (activeChat === null) return;

    fetchMessages(activeChat, false);

    if (activeChat !== 0) chatRealtime.joinConversation(activeChat);
    return () => {
      if (activeChat !== 0) chatRealtime.leaveConversation(activeChat);
    };
  }, [activeChat, fetchMessages]);

  useEffect(() => {
    if (!token) return undefined;

    chatRealtime.connect({
      token,
      appType: isPerformer ? "tasker" : "provider",
    }).catch((error) => {
      console.warn("[CHAT WS] Connection unavailable; REST fallback remains active", error);
    });

    const reconcileMessage = (incoming) => {
      if (!incoming?.id || String(incoming.conversationId) !== String(activeChat)) return;
      setMessages((previous) => {
        const withoutOptimisticCopy = previous.filter((message) =>
          incoming.clientMessageId
            ? message.clientMessageId !== incoming.clientMessageId
            : String(message.id) !== String(incoming.id)
        );
        const withoutServerCopy = withoutOptimisticCopy.filter(
          (message) => String(message.id) !== String(incoming.id)
        );
        return [...withoutServerCopy, incoming].sort(
          (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
      });
    };

    const applyReceipt = (receipt, type) => {
      if (String(receipt?.conversationId) !== String(activeChat)) return;
      const boundaryId = type === "read"
        ? receipt.readUpToMessageId
        : receipt.deliveredUpToMessageId;
      const timestamp = type === "read" ? receipt.readAt : receipt.deliveredAt;
      let reachedBoundary = false;
      setMessages((previous) => previous.map((message) => {
        const isMine = message.senderUserId === "me" || String(message.senderUserId) === String(userId);
        if (reachedBoundary || !isMine) return message;
        const next = type === "read"
          ? { ...message, deliveredAt: message.deliveredAt || timestamp, readAt: timestamp, status: "read" }
          : { ...message, deliveredAt: timestamp, status: "delivered" };
        if (String(message.id) === String(boundaryId)) reachedBoundary = true;
        return next;
      }));
    };

    const unsubscribeNew = chatRealtime.subscribe("message.new", (message) => {
      reconcileMessage(message);
      const isIncoming = String(message?.senderUserId) !== String(userId);
      updateConversationPreview(message?.conversationId, message, {
        incrementUnread:
          isIncoming && String(message?.conversationId) !== String(activeChat),
      });
      if (isIncoming) {
        chatRealtime.markDelivered(message.conversationId, message.id).catch(() => {});
        if (String(message.conversationId) === String(activeChat)) {
          chatRealtime.markRead(message.conversationId, message.id).catch(() => {});
        }
      }
    });
    const unsubscribeUpdated = chatRealtime.subscribe("message.updated", reconcileMessage);
    const unsubscribeDeleted = chatRealtime.subscribe("message.deleted", reconcileMessage);
    const unsubscribeDelivered = chatRealtime.subscribe("message.delivered", (receipt) => {
      applyReceipt(receipt, "delivered");
    });
    const unsubscribeRead = chatRealtime.subscribe("message.read", (receipt) => {
      applyReceipt(receipt, "read");
    });

    return () => {
      unsubscribeNew();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeDelivered();
      unsubscribeRead();
    };
  }, [activeChat, isPerformer, token, updateConversationPreview, userId]);

  /* ── auto scroll to bottom ── */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /* ── send message ── */
  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text) return;

    /* Support chat */
    if (activeChat === 0) {
      setMessageInput("");
      const tempMsg = {
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "sent",
      };
      setMessages((prev) => [...prev, tempMsg]);
      try {
        if (!activeSupportTicketId) {
          const ticket = await createSupportTicket({
            subject: "General Support Request",
            category: "GENERAL",
            message: text,
          });
          const tid =
            ticket?.id ||
            ticket?._id ||
            ticket?.data?.id ||
            ticket?.data?._id ||
            ticket?.ticket?.id ||
            ticket?.ticket?._id;
          setActiveSupportTicketId(tid);
        } else {
          await addSupportMessage(activeSupportTicketId, { content: text });
        }
      } catch (err) {
        console.error("Support message error:", err);
      }
      return;
    }

    /* Regular chat */
    const clientMessageId = createChatClientMessageId();
    const tempId = `tmp-${clientMessageId}`;
    const localMsg = {
      id: tempId,
      clientMessageId,
      content: text,
      senderUserId: "me",
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setMessageInput("");
    setMessages((prev) => [...prev, localMsg]);

    try {
      let response;
      try {
        response = await chatRealtime.sendMessage({
          conversationId: activeChat,
          content: text,
          clientMessageId,
        });
      } catch {
        response = await apiSendMessage({
          conversationId: activeChat,
          content: text,
          clientMessageId,
        });
      }
      const confirmed = response?.message || response?.data?.message || response?.data || response;
      const confirmedPayload = confirmed && typeof confirmed === "object" ? confirmed : {};
      const serverId = confirmedPayload.id;
      const confirmedMessage = {
        ...localMsg,
        ...confirmedPayload,
        id: serverId || localMsg.id,
        clientMessageId,
        status: "sent",
      };
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId || m.clientMessageId === clientMessageId
            ? confirmedMessage
            : m
        )
      );
      updateConversationPreview(activeChat, confirmedMessage);
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "error" } : m))
      );
    }
  };

  /* ── determine if a message is from "me" ── */
  function isMyMessage(msg) {
    // Locally created optimistic messages are always mine
    if (msg.senderUserId === "me") return true;
    if (msg.senderUserId === "other") return false;
    if (msg.type === "sent") return true;
    if (!msg.senderId && !msg.senderUserId) return false;

    const sid = String(msg.senderId || msg.senderUserId);

    // Primary: if we know the other person's ID, anything NOT from them is from me.
    // This is more reliable than matching the current user's ID (which may vary in shape).
    const otherId = String(activeChatData?.otherUser?.id || activeChatData?.otherUser?._id || "");
    if (otherId) {
      return sid !== otherId; // not from other person => from me
    }

    // Fallback: try to match against the current user's ID in various shapes
    const myId = String(
      user?.id ||
      user?._id ||
      user?.userId ||
      user?.provider?.userId ||
      user?.taskers?.userId ||
      ""
    );
    if (myId && sid === myId) return true;
    return false;
  }

  /* ── chat list filters & actions ── */
  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const enterSelectionMode = (chat) => {
    if (chat._id === 0) return;
    setSelectionMode(true);
    setSelectedIds([String(chat._id)]);
  };

  const toggleSelected = (chatId) => {
    const id = String(chatId);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getSelectedChats = () =>
    conversations.filter((c) => selectedIds.includes(String(c._id)));

  const applyPinToIds = (ids, pinned = true) => {
    setPinned(userId, ids, pinned);
    setConversations((prev) =>
      withPrefs(
        prev.map((c) =>
          ids.includes(String(c._id)) ? { ...c, isPinned: pinned } : c
        )
      )
    );
    if (activeChatData && ids.includes(String(activeChatData._id))) {
      setActiveChatData((prev) => (prev ? { ...prev, isPinned: pinned } : prev));
    }
  };

  const applyArchiveToIds = (ids) => {
    setArchived(userId, ids, true);
    setConversations((prev) => withPrefs(prev.filter((c) => !ids.includes(String(c._id)))));
    if (activeChat && ids.includes(String(activeChat))) {
      setActiveChat(null);
      setShowChatPane(false);
    }
    exitSelectionMode();
  };

  const applyDeleteToIds = (ids) => {
    removeFromPrefs(userId, ids);
    setConversations((prev) => prev.filter((c) => !ids.includes(String(c._id))));
    if (activeChat && ids.includes(String(activeChat))) {
      setActiveChat(null);
      setShowChatPane(false);
    }
    exitSelectionMode();
  };

  const handleSelectionPin = () => {
    const ids = selectedIds.filter((id) => id !== "0");
    if (!ids.length) return;
    applyPinToIds(ids, true);
    exitSelectionMode();
  };

  const handleSelectionArchive = () => {
    const chats = getSelectedChats().filter((c) => c._id !== 0);
    if (!chats.length) return;
    setConfirmAction({ type: "archive", chat: chats[0], bulkIds: chats.map((c) => String(c._id)) });
  };

  const handleSelectionDelete = () => {
    const chats = getSelectedChats().filter((c) => c._id !== 0);
    if (!chats.length) return;
    setConfirmAction({ type: "delete", chat: chats[0], bulkIds: chats.map((c) => String(c._id)) });
  };

  const toggleActiveChatPin = () => {
    if (!activeChatData || activeChatData._id === 0) return;
    const id = String(activeChatData._id);
    const next = !activeChatData.isPinned;
    applyPinToIds([id], next);
  };

  const toggleActiveChatStar = () => {
    if (!activeChatData || activeChatData._id === 0) return;
    const id = String(activeChatData._id);
    const next = !activeChatData.isStarred;
    setStarred(userId, [id], next);
    setActiveChatData((prev) => (prev ? { ...prev, isStarred: next } : prev));
    setConversations((prev) =>
      withPrefs(prev.map((c) => (String(c._id) === id ? { ...c, isStarred: next } : c)))
    );
  };

  const handleChatAction = (actionId, chat) => {
    if (actionId === "pin") {
      applyPinToIds([String(chat._id)], true);
      return;
    }
    if (["archive", "delete"].includes(actionId)) {
      setConfirmAction({ type: actionId, chat, bulkIds: [String(chat._id)] });
      return;
    }
    if (actionId === "read") {
      setConversations((prev) =>
        prev.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c))
      );
    }
    if (actionId === "mute") {
      setConversations((prev) =>
        prev.map((c) => (c._id === chat._id ? { ...c, isMuted: true } : c))
      );
    }
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    const { type, bulkIds } = confirmAction;
    const ids = bulkIds || [String(confirmAction.chat._id)];
    if (type === "delete") applyDeleteToIds(ids);
    else if (type === "archive") applyArchiveToIds(ids);
    else if (type === "pin") applyPinToIds(ids, true);
    setConfirmAction(null);
  };

  const filteredConvos = conversations
    .filter((c) => {
      if (c.isArchived) return false;
      if (chatFilter === "unread") return c.unreadCount > 0;
      if (chatFilter === "read") return !c.unreadCount;
      if (chatFilter === "starred") return c.isStarred;
      return true;
    })
    .filter(
      (c) =>
        !searchQuery ||
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.taskTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a._id === 0) return -1;
      if (b._id === 0) return 1;
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aTime = new Date(a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
      const bTime = new Date(b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
      return bTime - aTime;
    });

  const handleListItemClick = (chat) => {
    if (selectionMode) {
      if (chat._id === 0) return;
      toggleSelected(chat._id);
      return;
    }
    openChat(chat);
  };

  /* ────────────────────────────────────────
     RENDER
  ──────────────────────────────────────── */
  return (
    <div
      className={isPerformer ? "performer-chat-shell" : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "#f9fafb",
        paddingTop: isPerformer ? 93 : 80,
        fontFamily: "var(--font-sans)",
      }}
    >
      {isPerformer ? (
        <PerformerHeader activePage="chats" />
      ) : (
        <ProviderHeader activePage="chats" />
      )}

      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT PANEL: Chat List ── */}
        <div
          style={{
            width: showChatPane ? "0px" : "100%",
            maxWidth: 420,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            overflow: "hidden",
            // On md+ always show left panel
            ...(typeof window !== "undefined" && window.innerWidth >= 768
              ? { width: 380, display: "flex" }
              : {}),
          }}
          className="chat-list-panel"
        >
          {/* Header */}
          <div className="px-4 pb-3 pt-4">
            {selectionMode ? (
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={exitSelectionMode}
                  className="flex items-center gap-1 rounded-lg py-1.5 pl-1 pr-2 text-gray-800 transition hover:bg-gray-100"
                >
                  <ChevronLeft size={22} strokeWidth={2.25} />
                  <span className="min-w-[1.25rem] text-lg font-bold">{selectedIds.length}</span>
                </button>
                <div className="flex items-center gap-2">
                  {[
                    { icon: Pin, label: "Pin", onClick: handleSelectionPin },
                    { icon: Trash2, label: "Delete", onClick: handleSelectionDelete },
                    { icon: Archive, label: "Archive", onClick: handleSelectionArchive },
                  ].map(({ icon: Icon, label, onClick }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      disabled={!selectedIds.length}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-40"
                      aria-label={label}
                    >
                      <Icon size={18} strokeWidth={2.25} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(isPerformer ? "/performer/dashboard" : "/provider/dashboard")}
                    className="rounded-lg p-1.5 text-gray-600 transition hover:bg-gray-100 md:hidden"
                    aria-label="Back"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-extrabold text-gray-900">Chat</h2>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <Bell size={20} strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Search + filter */}
            <div className="relative">
              <div className="flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 shadow-sm">
                <Search size={17} className="shrink-0 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search for 'Web Designer'`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-0 flex-1 border-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen((v) => !v)}
                  className={`shrink-0 rounded-lg p-1.5 transition ${
                    filterMenuOpen ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" : "text-gray-500 hover:bg-gray-100"
                  }`}
                  aria-label="Filter chats"
                >
                  <SlidersHorizontal size={17} strokeWidth={2.25} />
                </button>
              </div>
              <ChatFilterMenu
                open={filterMenuOpen}
                onClose={() => setFilterMenuOpen(false)}
                activeFilter={chatFilter}
                onSelect={setChatFilter}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div
            className="scrollbar-hide flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-24 pt-1"
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 0",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: `3px solid ${BRAND_LIGHT}`,
                    borderTop: `3px solid ${BRAND}`,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            ) : filteredConvos.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "48px 0",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: BRAND_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={32} style={{ color: BRAND }} strokeWidth={1.5} />
                </div>
                <span
                  style={{
                    fontSize: 14,
                    color: "#9ca3af",
                    fontWeight: 600,
                  }}
                >
                  No active task chats
                </span>
              </div>
            ) : (
              <AnimatePresence>
                {              filteredConvos.map((chat) => (
                  <ChatCard
                    key={chat._id}
                    chat={chat}
                    isActive={!selectionMode && activeChat === chat._id}
                    isSelected={selectedIds.includes(String(chat._id))}
                    selectionMode={selectionMode}
                    onClick={() => handleListItemClick(chat)}
                    onLongPress={enterSelectionMode}
                    onMenuClick={(c, e) =>
                      setActionsMenu({
                        chat: c,
                        position: { top: e.clientY, left: e.clientX },
                      })
                    }
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: Chat / Support ── */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            background: "#f9fafb",
            overflow: "hidden",
          }}
          className={`chat-detail-panel${showChatPane ? " show" : ""}`}
        >
          <AnimatePresence mode="wait">
            {activeChat === null ? (
              /* Empty state */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 32,
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 24,
                    background: BRAND_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={44} style={{ color: BRAND }} strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Your messages
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#9ca3af",
                    textAlign: "center",
                    margin: 0,
                    maxWidth: 280,
                    lineHeight: 1.6,
                  }}
                >
                  Select a conversation from the left to start chatting with
                  your task providers.
                </p>
              </motion.div>
            ) : activeChat === 0 ? (
              supportView === "dashboard" ? (
                /* Support Dashboard */
                <motion.div
                  key="support-dashboard"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="scrollbar-hide"
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "32px 24px",
                  }}
                >
                  {/* Mobile back */}
                  <button
                    onClick={() => {
                      setActiveChat(null);
                      setShowChatPane(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: BRAND,
                      fontSize: 14,
                      fontWeight: 600,
                      padding: "0 0 16px 0",
                    }}
                    className="mobile-back-btn"
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>

                  <div style={{ maxWidth: 560, margin: "0 auto" }}>
                    <div
                      style={{ textAlign: "center", marginBottom: 36 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 24,
                          background: BRAND_LIGHT,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                        }}
                      >
                        <Bot size={40} style={{ color: BRAND }} strokeWidth={2} />
                      </motion.div>
                      <h2
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "#111827",
                          margin: "0 0 8px",
                        }}
                      >
                        How can we help today?
                      </h2>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#6b7280",
                          margin: 0,
                          fontWeight: 500,
                        }}
                      >
                        Your OnIT INDIA support dashboard
                      </p>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 20,
                      }}
                    >
                      {[
                        {
                          icon: Sparkles,
                          title: "Posting Tasks",
                          desc: "How to post your first task",
                          color: "#0284c7",
                        },
                        {
                          icon: ShieldCheck,
                          title: "Payments & Safety",
                          desc: "Secure payments & disputes",
                          color: "#7c3aed",
                        },
                        {
                          icon: Clock,
                          title: "Tracking Progress",
                          desc: "Manage and track taskers",
                          color: "#d97706",
                        },
                        {
                          icon: User,
                          title: "Account & Profile",
                          desc: "Settings and preferences",
                          color: BRAND,
                        },
                      ].map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ y: -3 }}
                            style={{
                              padding: "18px 16px",
                              borderRadius: 16,
                              border: "1.5px solid #f0f0f0",
                              background: "#fff",
                              cursor: "pointer",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                background: cat.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 10,
                              }}
                            >
                              <Icon size={20} color="#fff" strokeWidth={2} />
                            </div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#111827",
                                marginBottom: 3,
                              }}
                            >
                              {cat.title}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#6b7280",
                                fontWeight: 500,
                              }}
                            >
                              {cat.desc}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div
                      style={{
                        borderRadius: 20,
                        background: "#0f172a",
                        padding: "28px 24px",
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: -20,
                          top: -20,
                          width: 140,
                          height: 140,
                          borderRadius: "50%",
                          background: BRAND,
                          opacity: 0.15,
                          filter: "blur(40px)",
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 18,
                          background: "rgba(255,255,255,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <Headset size={28} color="#fff" strokeWidth={2} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 17,
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: 4,
                          }}
                        >
                          Still need help?
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#94a3b8",
                            marginBottom: 14,
                            fontWeight: 500,
                          }}
                        >
                          Our team is online 24/7
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSupportView("chat")}
                            style={{
                              padding: "10px 20px",
                              borderRadius: 12,
                              background: BRAND,
                              color: "#fff",
                              border: "none",
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: "pointer",
                              boxShadow: "0 4px 16px rgba(0,153,102,0.3)",
                            }}
                          >
                            Chat with Agent
                          </motion.button>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: BRAND,
                                animation: "pulse 1.5s ease-in-out infinite",
                              }}
                            />
                            <span
                              style={{
                                fontSize: 12,
                                color: "#64748b",
                                fontWeight: 600,
                              }}
                            >
                              ~2 mins wait
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Support Chat View */
                <motion.div
                  key="support-chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      background: "#fff",
                      borderBottom: "1px solid #f0f0f0",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 0,
                      }}
                    >
                      <button
                        onClick={() => {
                          setSupportView("dashboard");
                          setActiveChat(null);
                          setShowChatPane(false);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#374151",
                          display: "flex",
                          padding: 4,
                        }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: BRAND,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Bot size={22} color="#fff" strokeWidth={2} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#111827",
                          }}
                        >
                          OnIT INDIA Support
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: BRAND,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: BRAND,
                            }}
                          />
                          Online
                        </div>
                      </div>
                    </div>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#9ca3af",
                        padding: 4,
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  {/* Messages */}
                  <div
                    className="scrollbar-hide"
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "20px 16px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {messages.map((msg) =>
                      msg.type === "sent" ? (
                        <UserSupportBubble
                          key={msg.id}
                          text={msg.text}
                          time={msg.time}
                        />
                      ) : (
                        <SupportBubble
                          key={msg.id}
                          text={msg.text}
                          time={msg.time}
                        />
                      )
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <ChatInput
                    value={messageInput}
                    onChange={setMessageInput}
                    onSend={handleSendMessage}
                  />
                </motion.div>
              )
            ) : (
              /* Regular chat */
              <motion.div
                key={`chat-${activeChat}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                {/* Chat Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#fff",
                    borderBottom: "1px solid #f0f0f0",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <button
                      onClick={() => {
                        setActiveChat(null);
                        setShowChatPane(false);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#374151",
                        display: "flex",
                        padding: 4,
                      }}
                      className="mobile-back-btn"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <Avatar
                      src={activeChatData?.avatar}
                      name={activeChatData?.name}
                      size={44}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 17,
                          color: "#111827",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={activeChatData?.taskTitle || activeChatData?.name || "Chat"}
                      >
                        {activeChatData?.taskTitle || activeChatData?.name || "Chat"}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {activeChatData?.taskTitle
                          ? `${activeChatData?.participantRole || "Participant"}: ${activeChatData?.name || "Unknown"}`
                          : activeChatData?.role || "Direct message"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                      type="button"
                      onClick={toggleActiveChatPin}
                      title={activeChatData?.isPinned ? "Unpin chat" : "Pin chat"}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "none",
                        background: activeChatData?.isPinned ? BRAND_LIGHT : "#f3f4f6",
                        color: activeChatData?.isPinned ? BRAND : "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Pin size={18} strokeWidth={2.25} className={activeChatData?.isPinned ? "-rotate-45" : ""} />
                    </button>
                    <button
                      type="button"
                      onClick={toggleActiveChatStar}
                      title={activeChatData?.isStarred ? "Unstar chat" : "Star chat"}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "none",
                        background: activeChatData?.isStarred ? "#fef9c3" : "#f3f4f6",
                        color: activeChatData?.isStarred ? "#ca8a04" : "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Star size={18} strokeWidth={2.25} fill={activeChatData?.isStarred ? "currentColor" : "none"} />
                    </button>
                    <button
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "none",
                        background: "#f3f4f6",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Info size={18} />
                    </button>
                    <button
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        border: "none",
                        background: "#f3f4f6",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div
                  className="scrollbar-hide"
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px 16px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {loadingMessages ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "40px 0",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          border: `3px solid ${BRAND_LIGHT}`,
                          borderTop: `3px solid ${BRAND}`,
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    </div>
                  ) : messages.length === 0 ? (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        opacity: 0.5,
                      }}
                    >
                      <Bot size={40} style={{ color: BRAND }} strokeWidth={1.5} />
                      <span
                        style={{
                          fontSize: 14,
                          color: "#6b7280",
                          fontWeight: 600,
                        }}
                      >
                        No messages yet. Say hi! 👋
                      </span>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: 16,
                        }}
                      >
                        <span
                          style={{
                            padding: "4px 14px",
                            borderRadius: 20,
                            background: "#f3f4f6",
                            fontSize: 11,
                            color: "#9ca3af",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Today
                        </span>
                      </div>
                      {messages.map((msg, idx) => (
                        <MessageBubble
                          key={msg.id || idx}
                          msg={msg}
                          isMe={isMyMessage(msg)}
                        />
                      ))}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <ChatInput
                  value={messageInput}
                  onChange={setMessageInput}
                  onSend={handleSendMessage}
                  inputRef={inputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* OnIT Buddy FAB */}
      <button
        type="button"
        onClick={() => {
          const support = conversations.find((c) => c._id === 0);
          if (support) openChat(support);
        }}
        className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-1"
        aria-label="Open OnIT Buddy"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[var(--color-primary)] shadow-lg shadow-emerald-500/30 transition hover:scale-105">
          <Bot size={28} className="text-white" strokeWidth={2} />
        </div>
        <span className="text-[10px] font-bold lowercase tracking-wide text-gray-500">onit buddy</span>
      </button>

      <ChatActionsMenu
        chat={actionsMenu.chat}
        position={actionsMenu.position}
        onClose={() => setActionsMenu({ chat: null, position: null })}
        onAction={handleChatAction}
      />

      {confirmAction && (
        <ChatConfirmModal
          type={confirmAction.type}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Inline CSS for animations and responsive layout */}
      <style>{`
        @media (min-width: 1024px) {
          .performer-chat-shell {
            padding-left: 220px;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        /* Mobile: full-width panels with slide */
        @media (max-width: 767px) {
          .chat-list-panel {
            width: 100% !important;
            max-width: 100% !important;
            position: absolute;
            top: 80px;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
          }
          .chat-detail-panel {
            position: absolute;
            top: 80px;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 2;
            transform: translateX(100%);
            transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
          }
          .chat-detail-panel.show {
            transform: translateX(0);
          }
        }

        @media (min-width: 768px) {
          .chat-list-panel {
            width: 360px !important;
            max-width: 360px !important;
            display: flex !important;
          }
          .mobile-back-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Chat Input Bar
───────────────────────────────────────────── */
function ChatInput({ value, onChange, onSend, inputRef }) {
  return (
    <div
      style={{
        padding: "12px 16px 20px 16px",
        background: "#fff",
        borderTop: "1px solid #f0f0f0",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderRadius: 24,
          background: "#f3f4f6",
          border: "1.5px solid #e5e7eb",
          height: 48,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Write a message..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 14,
            color: "#111827",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={onSend}
        disabled={!value.trim()}
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: value.trim() ? BRAND : "#e5e7eb",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: value.trim() ? "pointer" : "not-allowed",
          flexShrink: 0,
          transition: "background 0.18s ease",
          boxShadow: value.trim() ? "0 4px 12px rgba(0,153,102,0.3)" : "none",
        }}
      >
        <Send size={18} color="#fff" strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ShowChatPane sync (mobile slide effect)
───────────────────────────────────────────── */
// We need to sync the CSS class dynamically. We'll use a wrapper approach.
// This is handled inline via the style prop in the main component.
// For the mobile slide, inject a tiny side-effect using a portal-free approach:
const ChatsPageWithMobileSlide = () => {
  // We track showChatPane at top level — re-export with the class toggling handled via CSS + state passed down.
  return <InnerChatsPage />;
};

/* We need to bubble showChatPane to apply the CSS class. Refactor to single component. */
const InnerChatsPage = () => {
  // This is the actual implementation — exported as ChatsPage above.
  // The mobile slide is handled by the inline <style> + className toggling.
  // Since we can't easily pass showChatPane back to affect className from inside the component,
  // we handle it differently: use a ref on the detail panel and toggle the class directly.
  return null;
};

export default ChatsPage;
