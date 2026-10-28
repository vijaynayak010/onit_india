import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, Check, CheckCheck, Clock, User, Loader2, AlertCircle } from "lucide-react";
import { chatRealtime, createChatClientMessageId } from "../../services/chatRealtime";

const ActiveTaskChat = ({
  taskId,
  taskTitle,
  otherUserId,
  otherUserName,
  otherUserRole = "Participant",
  otherUserAvatar,
  currentUser,
  listConversations,
  getMessages,
  sendMessage,
  createConversation,
  markAsRead,
  token,
  appType = "provider",
}) => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Resolve or spawn direct conversation for this task/user
  useEffect(() => {
    let active = true;

    const initConversation = async () => {
      if (!otherUserId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch all current conversations
        const response = await listConversations().catch(() => []);
        const raw = Array.isArray(response)
          ? response
          : (Array.isArray(response?.conversations) ? response.conversations : []);

        // Try to find a conversation for this task
        let found = raw.find(
          (c) =>
            (taskId && String(c.taskId) === String(taskId)) ||
            (!taskId && (c.otherUser?.id === otherUserId || c.otherUser?._id === otherUserId))
        );

        if (found) {
          if (active) setConversationId(found.id || found._id);
        } else if (createConversation) {
          // If not found and createConversation exists, create one dynamically
          const created = await createConversation({
            otherUserId,
            taskId,
          });
          const createdConv = created?.conversation || created?.data || created;
          const createdId = createdConv?.id || createdConv?._id;
          if (createdId && active) {
            setConversationId(createdId);
          }
        }
      } catch (err) {
        console.error("[INLINE CHAT] Init error:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    initConversation();
    return () => {
      active = false;
    };
  }, [taskId, otherUserId, listConversations, createConversation]);

  const currentUserId = String(currentUser?.id || currentUser?._id || currentUser?.userId || "");

  // 2. Fetch initial history. Live updates arrive through API Gateway WebSocket.
  useEffect(() => {
    if (!conversationId) return;

    let active = true;
    let hasMarkedInitial = false;
    let lastMsgId = null;

    const fetchMsgs = async () => {
      try {
        const response = await getMessages(conversationId, { page: "1", limit: "50" }).catch(() => ({ messages: [] }));
        const rawList = Array.isArray(response.messages) ? response.messages : (Array.isArray(response) ? response : []);
        // Message APIs commonly return newest-first. The chat UI renders in document
        // order, so normalize to oldest-first before mapping and scrolling to the end.
        const list = rawList
          .map((message, index) => ({ message, index, timestamp: Date.parse(message.createdAt || message.updatedAt || "") }))
          .sort((a, b) => {
            const aHasTime = Number.isFinite(a.timestamp);
            const bHasTime = Number.isFinite(b.timestamp);
            if (aHasTime && bHasTime && a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
            if (aHasTime !== bHasTime) return aHasTime ? -1 : 1;
            return a.index - b.index;
          })
          .map(({ message }) => message);
        if (active) {
          const formatted = list.map((m) => {
            const senderId = String(m.senderUserId || m.senderId || "");
            // Primary: if we know the other person's ID, anything NOT from them is from me
            const isMe = otherUserId
              ? senderId !== String(otherUserId)
              : currentUserId
                ? senderId === currentUserId
                : false;
            return {
              id: m._id || m.id,
              clientMessageId: m.clientMessageId,
              text: m.content,
              createdAt: m.createdAt,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              type: (isMe || m.senderUserId === "me" || m.type === "sent") ? "sent" : "received",
              deliveredAt: m.deliveredAt,
              readAt: m.readAt,
              status: m.readAt ? "read" : m.deliveredAt ? "delivered" : "sent",
            };
          });

          setMessages(prev => JSON.stringify(prev) === JSON.stringify(formatted) ? prev : formatted);

          // Mark conversation as read on initial load, or when a new received message arrives
          if (typeof markAsRead === "function") {
            const lastMsg = formatted[formatted.length - 1];
            const currentLastId = lastMsg?.id;
            const isNewReceived = lastMsg && lastMsg.type === "received" && currentLastId !== lastMsgId;

            if (!hasMarkedInitial || isNewReceived) {
              hasMarkedInitial = true;
              if (currentLastId) {
                lastMsgId = currentLastId;
              }
              markAsRead(conversationId).catch(() => {});
            }
          }
        }
      } catch (err) {
        console.error("[INLINE CHAT] Fetch messages error:", err);
      }
    };

    fetchMsgs();

    return () => {
      active = false;
    };
  }, [conversationId, currentUserId, getMessages, otherUserId, markAsRead]);

  useEffect(() => {
    if (!conversationId || !token) return undefined;

    chatRealtime.connect({ token, appType }).then(() => {
      chatRealtime.joinConversation(conversationId);
    }).catch(() => {});

    const reconcile = (incoming) => {
      if (String(incoming?.conversationId) !== String(conversationId)) return;
      const senderId = String(incoming.senderUserId || "");
      const isMe = currentUserId ? senderId === currentUserId : senderId !== String(otherUserId || "");
      const formatted = {
        id: incoming.id,
        clientMessageId: incoming.clientMessageId,
        text: incoming.content,
        time: new Date(incoming.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: incoming.createdAt,
        type: isMe ? "sent" : "received",
        deliveredAt: incoming.deliveredAt,
        readAt: incoming.readAt,
        status: incoming.readAt ? "read" : incoming.deliveredAt ? "delivered" : "sent",
      };
      setMessages((previous) => [
        ...previous.filter((message) =>
          incoming.clientMessageId
            ? message.clientMessageId !== incoming.clientMessageId && String(message.id) !== String(incoming.id)
            : String(message.id) !== String(incoming.id)
        ),
        formatted,
      ].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()));

      if (!isMe) {
        chatRealtime.markDelivered(conversationId, incoming.id).catch(() => {});
        chatRealtime.markRead(conversationId, incoming.id).catch(() => {});
      }
    };

    const applyReceipt = (receipt, status) => {
      if (String(receipt?.conversationId) !== String(conversationId)) return;
      const boundaryId = status === "read" ? receipt.readUpToMessageId : receipt.deliveredUpToMessageId;
      const timestamp = status === "read" ? receipt.readAt : receipt.deliveredAt;
      let reachedBoundary = false;
      setMessages((previous) => previous.map((message) => {
        if (reachedBoundary || message.type !== "sent") return message;
        const next = status === "read"
          ? { ...message, status, deliveredAt: message.deliveredAt || timestamp, readAt: timestamp }
          : { ...message, status, deliveredAt: timestamp };
        if (String(message.id) === String(boundaryId)) reachedBoundary = true;
        return next;
      }));
    };

    const offNew = chatRealtime.subscribe("message.new", reconcile);
    const offUpdated = chatRealtime.subscribe("message.updated", reconcile);
    const offDeleted = chatRealtime.subscribe("message.deleted", reconcile);
    const offDelivered = chatRealtime.subscribe("message.delivered", (receipt) => applyReceipt(receipt, "delivered"));
    const offRead = chatRealtime.subscribe("message.read", (receipt) => applyReceipt(receipt, "read"));
    return () => {
      offNew();
      offUpdated();
      offDeleted();
      offDelivered();
      offRead();
      chatRealtime.leaveConversation(conversationId);
    };
  }, [appType, conversationId, currentUserId, otherUserId, token]);

  // 3. Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message
  const handleSend = async () => {
    if (!messageInput.trim() || !conversationId || sending) return;

    const text = messageInput;
    setMessageInput("");
    setSending(true);

    // Optimistic Update
    const clientMessageId = createChatClientMessageId();
    const tempMsg = {
      id: `temp-${clientMessageId}`,
      clientMessageId,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: new Date().toISOString(),
      type: "sent",
      status: "sending",
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      let confirmed;
      try {
        confirmed = await chatRealtime.sendMessage({
          conversationId,
          content: text,
          clientMessageId,
        });
      } catch {
        confirmed = await sendMessage(conversationId, text, clientMessageId);
      }
      if (!confirmed) throw new Error("Message send failed");
      const serverMessage = confirmed.message || confirmed.data || confirmed;
      setMessages((previous) => previous.map((message) =>
        message.clientMessageId === clientMessageId
          ? {
              ...message,
              id: serverMessage.id || message.id,
              clientMessageId,
              status: "sent",
              deliveredAt: serverMessage.deliveredAt,
              readAt: serverMessage.readAt,
            }
          : message
      ));
    } catch (err) {
      console.error("[INLINE CHAT] Send error:", err);
      setMessages((previous) => previous.map((message) =>
        message.clientMessageId === clientMessageId ? { ...message, status: "error" } : message
      ));
    } finally {
      setSending(false);
    }
  };

  if (!otherUserId) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center p-8 text-[var(--color-text-subtle)]">
        <AlertCircle className="h-10 w-10 mb-4 opacity-40" />
        <p className="font-bold text-lg">No Performer Assigned yet</p>
        <p className="text-xs font-semibold max-w-sm mt-1">
          Once a performer is hired and claims this task, you will be able to message them directly here.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-[var(--color-primary)]">
        <Loader2 className="h-10 w-10 animate-spin opacity-80" />
        <p className="mt-4 text-sm font-bold">Connecting secure workspace chat...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      {/* Active Pulse Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/30 px-6 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] overflow-hidden">
            {otherUserAvatar ? (
              <img src={otherUserAvatar} alt={otherUserName} className="h-full w-full object-cover" />
            ) : (
              <User size={20} strokeWidth={2.5} />
            )}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold text-[var(--color-text)]" title={taskTitle || "Task conversation"}>
              {taskTitle || "Task conversation"}
            </h3>
            <p className="truncate text-xs font-semibold text-[var(--color-text-muted)]">
              {otherUserName ? `${otherUserRole}: ${otherUserName}` : "Secure task conversation"}
            </p>
          </div>
        </div>
      </div>

      {/* Bubble Thread */}
      <div className="scrollbar-hide flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--color-surface-elevated)]/20">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
              <Bot size={24} />
            </div>
            <p className="text-sm font-bold text-[var(--color-text)]">Begin your workspace dialogue</p>
            <p className="text-[11px] font-semibold text-[var(--color-text-subtle)] max-w-[280px] mt-1">
              Ask questions, discuss instructions, or post instant files here.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%] sm:max-w-[70%]">
                <div
                  className={`rounded-[2rem] px-5 py-3 text-[13px] font-semibold shadow-sm ${
                    msg.type === "sent"
                      ? "rounded-tr-md bg-[var(--color-primary)] text-white"
                      : "rounded-tl-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text)]"
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`mt-1.5 flex items-center gap-1.5 ${
                    msg.type === "sent" ? "justify-end animate-fade-in" : "justify-start"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
                    {msg.time}
                  </span>
                  {msg.type === "sent" && (
                    msg.status === "read" ? (
                      <CheckCheck size={12} className="text-blue-500" strokeWidth={3} />
                    ) : msg.status === "delivered" ? (
                      <CheckCheck size={12} className="text-[var(--color-text-subtle)]" strokeWidth={3} />
                    ) : msg.status === "sending" ? (
                      <Clock size={11} className="text-[var(--color-text-subtle)]" strokeWidth={2.5} />
                    ) : (
                      <Check size={11} className="text-[var(--color-primary)]" strokeWidth={3} />
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 rounded-full bg-[var(--color-border-subtle)] p-1.5 shadow-inner"
        >
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Write secure message..."
            className="min-w-0 flex-1 border-none bg-transparent px-4 py-2.5 text-xs sm:text-sm font-semibold text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!messageInput.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            <Send size={16} strokeWidth={2.25} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActiveTaskChat;
