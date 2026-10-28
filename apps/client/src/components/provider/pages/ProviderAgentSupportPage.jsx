import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Headphones, Home, Loader2, Send } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import {
  addSupportMessage,
  createSupportTicket,
  getSupportTicketMessages,
  listSupportTickets,
} from "../services/api";

const TOPIC_META = {
  general: {
    subject: "General Support Request",
    category: "GENERAL",
    title: "Agent Support",
    subtitle: "Chat with our support team about your task.",
  },
  "extend-deadline": {
    subject: "Extend Task Deadline",
    category: "TASK",
    title: "Extend Deadline",
    subtitle: "Tell us the new deadline you need and why.",
  },
  "task-changes": {
    subject: "Task Changes Request",
    category: "TASK",
    title: "Task Changes",
    subtitle: "Describe the requirement or deliverable changes you need.",
  },
  "performer-issues": {
    subject: "Performer Issue Report",
    category: "PERFORMER",
    title: "Performer Issues",
    subtitle: "Report a problem with your assigned performer.",
  },
};

const formatTime = (value) => {
  try {
    return new Date(value || Date.now()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const GREETING = {
  id: "sys-1",
  text: "Hi! I'm your OnIT Buddy. How can I help you today?",
  time: "System",
  type: "received",
};

const ProviderAgentSupportPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");
  const topic = searchParams.get("topic") || "general";
  const meta = TOPIC_META[topic] || TOPIC_META.general;

  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [ticketId, setTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const ticketsResponse = await listSupportTickets().catch(() => []);
        const ticketsList = Array.isArray(ticketsResponse?.data)
          ? ticketsResponse.data
          : Array.isArray(ticketsResponse)
          ? ticketsResponse
          : [];

        const activeTicket = ticketsList.find((t) =>
          ["OPEN", "IN_PROGRESS"].includes(String(t.status || "").toUpperCase())
        );

        if (!activeTicket || cancelled) {
          setLoading(false);
          return;
        }

        const tid = activeTicket.id || activeTicket._id;
        setTicketId(tid);

        const fullTicket = await getSupportTicketMessages(tid).catch(() => null);
        if (!fullTicket || cancelled) {
          setLoading(false);
          return;
        }

        const ticketMsgs = Array.isArray(fullTicket.messages)
          ? fullTicket.messages
          : [];

        const formatted = [GREETING];

        if (fullTicket.message) {
          formatted.push({
            id: "orig",
            text: fullTicket.message,
            time: formatTime(fullTicket.createdAt),
            type: "sent",
          });
        }

        ticketMsgs.forEach((m) => {
          const isAgent =
            m.isAdmin ||
            m.senderRole === "ADMIN" ||
            m.senderType === "AGENT" ||
            m.fromSupport;
          formatted.push({
            id: m.id || m._id || `msg-${formatted.length}`,
            text: m.content || m.message || m.text || "",
            time: formatTime(m.createdAt),
            type: isAgent ? "received" : "sent",
          });
        });

        if (!cancelled) setMessages(formatted.filter((m) => m.text));
      } catch (err) {
        console.error("Failed to load support tickets:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [topic, taskId]);

  const handleSend = async (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || sending) return;

    const tempMsg = {
      id: `tmp-${Date.now()}`,
      text,
      time: formatTime(),
      type: "sent",
    };
    setMessages((prev) => [...prev, tempMsg]);
    setInput("");
    setSending(true);

    try {
      if (!ticketId) {
        const payload = {
          subject: meta.subject,
          category: meta.category,
          message: text,
        };
        if (taskId) payload.taskId = taskId;

        const ticket = await createSupportTicket(payload);
        const tid =
          ticket?.id ||
          ticket?._id ||
          ticket?.data?.id ||
          ticket?.data?._id ||
          ticket?.ticket?.id ||
          ticket?.ticket?._id;
        if (tid) setTicketId(tid);
      } else {
        await addSupportMessage(ticketId, { content: text });
      }
    } catch (err) {
      console.error("Support message error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: "Sorry — we couldn't send that message. Please try again.",
          time: formatTime(),
          type: "received",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-16 pt-[80px] font-sans text-[var(--color-text)] antialiased">
      <ProviderHeader activePage="my-tasks" />

      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5,150,105,0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(5,150,105,0.05), transparent 45%)",
        }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-elevated)] to-[var(--color-surface)]/90">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => navigate("/provider/dashboard")}
              className="inline-flex items-center gap-2 font-medium text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
            >
              <Home className="h-4 w-4" strokeWidth={2.25} />
              Home
            </button>
            <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
            {taskId && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/provider/active-task/${taskId}`)}
                  className="font-medium text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
                >
                  Task
                </button>
                <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
              </>
            )}
            <span className="font-bold text-[var(--color-primary)]">OnIT Buddy</span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
            <Headphones className="h-3.5 w-3.5" strokeWidth={2.5} />
            Support
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-[32px]">
            {meta.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] font-medium text-[var(--color-text-muted)]">
            {meta.subtitle}
          </p>
        </div>

        {/* Chat window */}
        <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-md)] ring-1 ring-black/[0.04]">
          {/* Header bar */}
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/50 px-5 py-4 sm:px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
              <Headphones size={20} strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-[var(--color-text)]">OnIT Buddy</p>
              <p className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                Online · Avg. reply under 5 min
              </p>
            </div>
          </div>

          {/* Messages + input */}
          <div className="flex h-[min(520px,60vh)] flex-col">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-[var(--color-primary)]">
                  <Loader2 className="mb-3 h-7 w-7 animate-spin" />
                  <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                    Connecting to support…
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] font-medium leading-relaxed sm:max-w-[70%] ${
                        msg.type === "sent"
                          ? "rounded-br-md bg-[var(--color-primary)] text-white"
                          : "rounded-bl-md border border-[var(--color-border)] bg-white text-[var(--color-text)]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p
                        className={`mt-1 text-[10px] font-semibold ${
                          msg.type === "sent"
                            ? "text-white/70"
                            : "text-[var(--color-text-subtle)]"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-end gap-2 border-t border-[var(--color-border)] bg-white px-4 py-3 sm:px-5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                disabled={sending}
                className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[14px] font-medium text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                aria-label="Send message"
              >
                {sending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderAgentSupportPage;
