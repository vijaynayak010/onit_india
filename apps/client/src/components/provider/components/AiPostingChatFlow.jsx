import { useEffect, useRef, useState } from "react";
import {
  ArrowUp, CheckCircle2, CircleDollarSign,
  History, LoaderCircle, MapPin, MessageSquarePlus, Pencil, Send,
  Sparkles, CalendarDays, Paperclip, Plus, Menu, X,
} from "lucide-react";
import {
  getAiTaskConversation,
  listAiTaskConversations,
  postAiTaskConversation,
  sendAiTaskMessage,
} from "../services/api";

const asList = (value) => Array.isArray(value) ? value : [];
const asText = (value) => value == null ? "" : String(value);
const AI_MARK_SRC = "/assets/onit-ai-mark.png";
const STARTER_PROMPTS = [
  "Design a logo for my café",
  "I need a photographer this weekend",
  "Build a landing page",
];

function conversationIdOf(conversation) {
  return asText(conversation?.conversationId || conversation?.id);
}

function conversationLabel(conversation) {
  return asText(conversation?.snippet || conversation?.title || conversation?.lastMessage || "New task draft");
}

function taskFrom(value) {
  return value?.task || value?.payload || value?.metadata || value?.extracted_data || value?.extractedData || null;
}

function normaliseMessages(value) {
  return asList(value?.messages).flatMap((message) => {
    const content = asText(message?.content || message?.message).trim();
    if (!content) return [];
    const role = message?.role || message?.sender;
    return [{ role: role === "user" ? "user" : "assistant", content }];
  });
}

function clientMessageId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : date.toLocaleDateString();
}

function PayloadSummary({ task, isPosting, onEdit, onPost }) {
  const details = task?.details && typeof task.details === "object" ? task.details : {};
  const deliverables = asList(details.deliverables || task?.deliverables);
  const checklist = asList(details.checklist || details.checklists || details.milestones || task?.checklist || task?.milestones || task?.executionChecklist || task?.execution_checklist);
  const skills = asList(task?.required_skills || task?.requiredSkills || task?.skills);
  const budget = task?.priceAmount ?? task?.budget ?? "Flexible";
  const deadline = task?.dueAt || task?.deadline || "Flexible";
  const location = task?.locationAddress || task?.location_address || "Remote / Online";
  const hasChecklist = checklist.length > 0;

  return (
    <section className="my-4 rounded-2xl border border-[#29ADAC]/30 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-black text-[#10605F]"><CheckCircle2 className="h-5 w-5" /> Ready to post</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{task?.category || "General"}</span>
      </div>
      <h2 className="text-lg font-black text-[var(--color-text)]">{task?.title || "Untitled task"}</h2>
      {task?.description && <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{task.description}</p>}

      {deliverables.length > 0 && <SummaryList title="Deliverables" items={deliverables} />}
      {hasChecklist ? <SummaryList title="Checklist" items={checklist.map((item) => typeof item === "object" ? item.title || item.name : item)} /> : <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-bold leading-5 text-amber-800">Add at least one checklist item before posting. It defines the work the performer must submit.</div>}
      {skills.length > 0 && <div className="mt-4"><p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Required skills</p><div className="flex flex-wrap gap-2">{skills.map((skill) => <span key={asText(skill)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{asText(skill)}</span>)}</div></div>}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5"><CircleDollarSign className="h-3.5 w-3.5" /> {budget} {task?.priceCurrency || "INR"}</span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(deadline) || deadline}</span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5"><MapPin className="h-3.5 w-3.5" /> {location}</span>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button type="button" onClick={onEdit} disabled={isPosting} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#10605F] px-4 py-3 text-sm font-black text-[#10605F] transition hover:bg-[#EFFBFB] disabled:opacity-50"><Pencil className="h-4 w-4" /> Edit details</button>
        <button type="button" onClick={hasChecklist ? onPost : onEdit} disabled={isPosting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-black text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60">{isPosting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : hasChecklist ? <Send className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}{isPosting ? "Posting…" : hasChecklist ? "Post task" : "Add checklist"}</button>
      </div>
    </section>
  );
}

function SummaryList({ title, items }) {
  return <div className="mt-4"><p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">{title}</p><ul className="space-y-1.5 text-sm text-[var(--color-text-muted)]">{items.filter(Boolean).map((item, index) => <li key={`${asText(item)}-${index}`} className="flex gap-2"><span className="text-[#10605F]">•</span><span>{asText(item)}</span></li>)}</ul></div>;
}

export default function AiPostingChatFlow({ onEditTask, onPosted }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [draft, setDraft] = useState("");
  const [progress, setProgress] = useState(0);
  const [task, setTask] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const endRef = useRef(null);
  const postingRef = useRef(false);
  const inputRef = useRef(null);

  const canSend = draft.trim().length > 0 && !sending && !task;
  useEffect(() => {
    let live = true;
    listAiTaskConversations()
      .then((response) => {
        if (!live) return;
        setConversations(asList(response?.conversations || response?.data || response));
      })
      .catch(() => live && setError("Unable to load previous AI drafts. You can still start a new one."))
      .finally(() => live && setLoadingHistory(false));
    return () => { live = false; };
  }, []);

  // An effect callback may return only a cleanup function. Keep scrolling in
  // a block so `scrollIntoView()` is never accidentally returned to React.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending, task]);

  const startNew = () => {
    setConversationId(null);
    setMessages([]);
    setTask(null);
    setProgress(0);
    setError("");
    setDraft("");
  };

  const applyStarterPrompt = (prompt) => {
    setDraft(prompt);
    inputRef.current?.focus();
  };

  const loadConversation = async (id) => {
    if (!id || id === conversationId) return;
    setError("");
    setSending(true);
    try {
      const detail = await getAiTaskConversation(id);
      setConversationId(id);
      setMessages(normaliseMessages(detail));
      setTask(taskFrom(detail));
      setProgress(Number(detail?.progress?.percent || 0));
    } catch (requestError) {
      setError(requestError?.message || "Unable to open this AI draft.");
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || sending || task) return;
    setError("");
    setDraft("");
    setSending(true);
    setMessages((previous) => [...previous, { role: "user", content: message }]);
    try {
      const response = await sendAiTaskMessage({ conversationId, message, clientMessageId: clientMessageId() });
      const nextConversationId = asText(response?.conversationId || response?.conversation_id) || conversationId;
      setConversationId(nextConversationId || null);
      setProgress(Number(response?.progress?.percent || 0));
      if (response?.readyToPost) setTask(taskFrom(response));
      const question = asText(response?.question).trim();
      if (question) setMessages((previous) => [...previous, { role: "assistant", content: question }]);
      if (response?.status === "posted") setTask((previous) => previous || taskFrom(response));
      if (nextConversationId) {
        setConversations((previous) => {
          const summary = { conversationId: nextConversationId, snippet: message, updatedAt: new Date().toISOString() };
          return [summary, ...previous.filter((item) => conversationIdOf(item) !== nextConversationId)];
        });
      }
      if (response?.status === "error" && !question) setError("The AI could not complete that request. Please try again.");
    } catch (requestError) {
      setError(requestError?.message || "Unable to contact AI assistance. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const postTask = async () => {
    if (!conversationId || postingRef.current) return;
    postingRef.current = true;
    setPosting(true);
    setError("");
    try {
      const response = await postAiTaskConversation(conversationId);
      setMessages((previous) => [...previous, { role: "system", content: "Your task has been posted and sent for admin review. Once approved, taskers can view and apply to it." }]);
      onPosted?.(response?.taskId || response?.id || response?.task?.id);
    } catch (requestError) {
      setError(requestError?.message || "Unable to post this task. Please try again.");
    } finally {
      postingRef.current = false;
      setPosting(false);
    }
  };

  const historyContent = (
    <>
      <div className="mb-6 flex items-center gap-2 px-2"><img src={AI_MARK_SRC} alt="FirstDoer AI" className="h-7 w-7 object-contain" /><span className="text-xs font-black tracking-[0.18em] text-slate-800">FirstDoer AI</span></div>
      <button type="button" onClick={() => { startNew(); setIsHistoryOpen(false); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#049c67] px-4 py-3 text-sm font-black text-white shadow-[0_8px_18px_rgba(4,156,103,0.22)] transition hover:bg-[#083B3A]"><MessageSquarePlus className="h-4 w-4" /> New chat</button>
      <div className="mt-7 flex items-center gap-2 px-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400"><History className="h-3.5 w-3.5" /> Recent chats</div>
      <div className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {loadingHistory ? <p className="px-2 py-3 text-sm text-slate-500">Loading…</p> : conversations.length === 0 ? <p className="px-2 py-3 text-sm text-slate-500">No previous chats</p> : conversations.map((item) => {
          const id = conversationIdOf(item);
          return <button key={id} type="button" onClick={() => { loadConversation(id); setIsHistoryOpen(false); }} className={`w-full rounded-xl px-3 py-3 text-left transition ${id === conversationId ? "bg-[#DFF7F6] text-emerald-900" : "hover:bg-white text-slate-700"}`}><p className="truncate text-sm font-bold">{conversationLabel(item)}</p><p className="mt-1 text-xs opacity-70">{formatDate(item?.updatedAt)}</p></button>;
        })}
      </div>
    </>
  );

  return <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:rounded-[28px]">
    <div className="flex h-[calc(100svh-168px)] min-h-[500px] max-h-[760px] lg:grid lg:min-h-[680px] lg:grid-cols-[272px_minmax(0,1fr)]">
      <aside className="hidden min-h-0 flex-col border-r border-slate-100 bg-[#f7faf9] p-4 lg:flex">{historyContent}</aside>
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#fcfdfd]">
        <header className="border-b border-slate-100 bg-white px-4 py-3 sm:px-7 sm:py-4"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><img src={AI_MARK_SRC} alt="" className="h-8 w-8 shrink-0 rounded-xl object-contain sm:h-9 sm:w-9" /><div className="min-w-0"><h1 className="font-black text-slate-900">AI task assistant</h1><p className="truncate text-xs text-slate-400">Turn your idea into a clear task, step by step.</p></div></div><button type="button" onClick={() => setIsHistoryOpen(true)} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50 lg:hidden" aria-label="Open recent chats"><Menu className="h-4 w-4" /> <span className="hidden xs:inline">History</span></button></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100 sm:mt-4"><div className="h-full rounded-full bg-[#10605F] transition-all" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} /></div></header>
        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-7 sm:py-6">
          {messages.length === 0 && !sending && <div className="mx-auto flex max-w-md flex-col items-center py-14 text-center"><img src={AI_MARK_SRC} alt="FirstDoer AI" className="mb-5 h-20 w-20 object-contain" /><h2 className="text-2xl font-black tracking-tight text-slate-900">What can I help you create today?</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Describe what you need and I’ll help turn it into a clear, ready-to-post task.</p><div className="mt-7 grid w-full gap-2 text-left">{STARTER_PROMPTS.map((prompt) => <button key={prompt} type="button" onClick={() => applyStarterPrompt(prompt)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#29ADAC]/40 hover:bg-[#EFFBFB] hover:text-[#083B3A]">{prompt}</button>)}</div></div>}
          {messages.map((message, index) => message.role === "system" ? <div key={index} className="rounded-2xl border border-[#29ADAC]/30 bg-[#EFFBFB] p-4 text-sm font-semibold leading-6 text-emerald-900"><CheckCircle2 className="mr-2 inline h-4 w-4" />{message.content}</div> : <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-sm bg-[var(--color-primary)] text-white" : "rounded-tl-sm border border-slate-200 bg-white text-slate-800"}`}>{message.content}</div></div>)}
          {sending && <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin text-[#10605F]" /> AI is thinking…</div>}
          {task && <PayloadSummary task={task} isPosting={posting} onEdit={() => onEditTask?.(task)} onPost={postTask} />}
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          <div ref={endRef} />
        </div>
        <form onSubmit={sendMessage} className="border-t border-slate-100 bg-white p-3 sm:p-5"><div className="flex items-end gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 sm:gap-2"><button type="button" aria-label="Add attachment" title="Attachments can be added after task creation" className="mb-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><Plus className="h-4 w-4" /></button><textarea ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} disabled={sending || Boolean(task)} rows={1} placeholder={task ? "Edit details or post this task to continue." : "Describe your task…"} className="min-h-[40px] min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none disabled:cursor-not-allowed" /><Paperclip className="mb-3 hidden h-4 w-4 shrink-0 text-slate-300 sm:block" /><button type="submit" disabled={!canSend} aria-label="Send message" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10605F] text-white shadow-sm transition hover:bg-[#083B3A] disabled:opacity-40"><ArrowUp className="h-5 w-5" /></button></div><p className="mt-2 text-center text-[10px] font-medium text-slate-400">FirstDoer AI creates a task draft from the details you share.</p></form>
      </section>
    </div>
    {isHistoryOpen && <div className="fixed inset-0 z-[200] bg-slate-950/40 lg:hidden" onClick={() => setIsHistoryOpen(false)}><aside className="flex h-full w-[min(86vw,340px)] flex-col bg-[#f7faf9] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-3 flex justify-end"><button type="button" onClick={() => setIsHistoryOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white" aria-label="Close recent chats"><X className="h-5 w-5" /></button></div>{historyContent}</aside></div>}
  </div>;
}
