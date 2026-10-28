import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Send,
    Search,
    MoreVertical,
    Smile,
    Clock,
    CheckCheck,
    ArrowLeft,
    MessageCircle,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { listTicketsAdmin, getTicketByIdAdmin, addTicketMessageAdmin } from '../../services/api';

const DEFAULT_SUPPORT_WS_URL = 'wss://ohh9kczx4k.execute-api.ap-south-1.amazonaws.com/prod';

function getSupportWebSocketUrl(token) {
    const configured = String(import.meta.env.VITE_ADMIN_SUPPORT_WS_URL || DEFAULT_SUPPORT_WS_URL).trim().replace(/\/$/, '');
    const url = new URL(configured);
    url.searchParams.set('token', token);
    url.searchParams.set('appType', 'provider');
    return url.toString();
}

function appendUniqueMessage(list, message) {
    if (!message?.id) return list;
    return list.some(m => m.id === message.id) ? list : [...list, message];
}

const STATUS_COLOR = {
    OPEN: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
    CLOSED: 'bg-slate-100 text-slate-500',
};

const LiveChatPage = () => {
    const [tickets, setTickets] = useState([]);
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [ticketMeta, setTicketMeta] = useState(null);
    const [search, setSearch] = useState('');
    const [draft, setDraft] = useState('');
    const [loadingList, setLoadingList] = useState(false);
    const [loadingThread, setLoadingThread] = useState(false);
    const [sending, setSending] = useState(false);
    const [socketReady, setSocketReady] = useState(false);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
    const endRef = useRef(null);
    const joinedRef = useRef(null);
    const reconnectTimerRef = useRef(null);

    // Fetch open + in-progress tickets to act as the "live chats" list.
    const fetchTickets = useCallback(async () => {
        setLoadingList(true);
        setError(null);
        try {
            const [open, inProgress] = await Promise.all([
                listTicketsAdmin({ status: 'OPEN', limit: 50 }).catch(() => null),
                listTicketsAdmin({ status: 'IN_PROGRESS', limit: 50 }).catch(() => null),
            ]);
            const norm = (res) => Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
            const merged = [...norm(open), ...norm(inProgress)]
                .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
            setTickets(merged);
        } catch (err) {
            setError(err?.message || 'Failed to load active chats.');
        } finally {
            setLoadingList(false);
        }
    }, []);

    useEffect(() => { fetchTickets(); }, [fetchTickets]);

    const loadThread = useCallback(async (ticketId) => {
        if (!ticketId) return;
        setLoadingThread(true);
        setError(null);
        try {
            const ticket = await getTicketByIdAdmin(ticketId);
            setTicketMeta(ticket || null);
            setMessages(Array.isArray(ticket?.messages) ? ticket.messages : []);
        } catch (err) {
            setError(err?.message || 'Could not load ticket messages.');
        } finally {
            setLoadingThread(false);
        }
    }, []);

    // Setup API Gateway WebSocket once. This must be native WebSocket, not Socket.IO.
    useEffect(() => {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('onit_token');
        if (!token) {
            setError('Admin session expired — please sign in again.');
            return;
        }

        let disposed = false;
        let retryCount = 0;

        const connect = () => {
            if (disposed) return;

            const socket = new WebSocket(getSupportWebSocketUrl(token));
            socketRef.current = socket;

            socket.onopen = () => {
                retryCount = 0;
                setSocketReady(true);
                setError(null);
                if (joinedRef.current) {
                    socket.send(JSON.stringify({
                        action: 'conversation.join',
                        ticketId: joinedRef.current,
                    }));
                }
            };

            socket.onclose = () => {
                setSocketReady(false);
                if (!disposed) {
                    const delay = Math.min(1000 * 2 ** retryCount, 10000);
                    retryCount += 1;
                    reconnectTimerRef.current = setTimeout(connect, delay);
                }
            };

            socket.onerror = () => {
                setSocketReady(false);
            };

            socket.onmessage = (event) => {
                let payload;
                try {
                    payload = JSON.parse(event.data);
                } catch {
                    return;
                }

                const eventName = payload?.event;
                const data = payload?.data;

                if (eventName === 'support.newTicket' || eventName === 'support.statusChanged') {
                    fetchTickets();
                    return;
                }

                if (eventName === 'support.newMessage') {
                    const ticketId = data?.ticket?.id || data?.message?.ticketId;
                    if (ticketId === joinedRef.current && data?.message) {
                        setMessages(prev => appendUniqueMessage(prev, data.message));
                    }
                    fetchTickets();
                    return;
                }

                if (eventName === 'support.messageSent' || eventName === 'message.sent') {
                    const message = data?.message || data;
                    if (message?.ticketId === joinedRef.current) {
                        setMessages(prev => appendUniqueMessage(prev, message));
                    }
                    return;
                }

                if (eventName === 'error') {
                    setError(data?.message || 'Support WebSocket error.');
                }
            };
        };

        connect();

        return () => {
            disposed = true;
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }
            try { socketRef.current?.close(); } catch (_) { /* noop */ }
            socketRef.current = null;
        };
    }, [fetchTickets]);

    // Join a ticket room and load its messages when selection changes.
    useEffect(() => {
        const socket = socketRef.current;
        if (!selected?.id) return;
        joinedRef.current = selected.id;

        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'conversation.join',
                ticketId: selected.id,
            }));
        }

        loadThread(selected.id);

        return () => {
            if (joinedRef.current === selected.id) {
                joinedRef.current = null;
            }
        };
    }, [loadThread, selected?.id]);

    // Auto-scroll
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const handleSend = async () => {
        const content = draft.trim();
        if (!content || !selected?.id) return;
        setSending(true);
        try {
            const message = await addTicketMessageAdmin(selected.id, { content });
            setMessages(prev => appendUniqueMessage(prev, message));
            setDraft('');
        } catch (err) {
            setError(err?.message || 'Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    const visibleTickets = tickets.filter(t => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            String(t.subject || '').toLowerCase().includes(q) ||
            String(t.user?.email || '').toLowerCase().includes(q)
        );
    });

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-700">
            <div className="flex-1 flex overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-xl">
                {/* Sidebar */}
                <div className={`w-full md:w-80 flex flex-col border-r border-slate-100 bg-slate-50/30 ${selected ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900">Live Support</h2>
                            <div className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 rounded-full ${socketReady ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{socketReady ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by subject or email..."
                                className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {error && (
                            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-2.5">
                                <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-500" />
                                <p className="text-[11px] font-semibold text-red-700">{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4 space-y-1">
                        {loadingList && tickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                                <Loader2 className="animate-spin mb-2" size={28} />
                                <p className="text-[10px] font-black uppercase tracking-widest">Loading chats...</p>
                            </div>
                        ) : visibleTickets.length > 0 ? (
                            visibleTickets.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelected(t)}
                                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                                        selected?.id === t.id
                                            ? 'bg-white shadow-lg shadow-emerald-500/10 border border-emerald-100'
                                            : 'hover:bg-white hover:shadow-md border border-transparent'
                                    }`}
                                >
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-xs shrink-0">
                                        {(t.user?.email || '?')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-black text-slate-900 truncate">{t.subject || 'Untitled ticket'}</p>
                                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                                {new Date(t.updatedAt || t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[10px] text-slate-500 truncate">{t.user?.email || 'Unknown user'}</p>
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${STATUS_COLOR[t.status] || 'bg-slate-100 text-slate-500'}`}>
                                                {t.status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-300">
                                <MessageCircle className="mx-auto mb-2 opacity-20" size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Active Chats</p>
                                <p className="text-[10px] font-medium text-slate-400 mt-1">New support tickets appear here in real time.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                {selected ? (
                    <div className="flex-1 flex flex-col bg-white relative">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                                <button
                                    onClick={() => setSelected(null)}
                                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm shrink-0">
                                    {(selected.user?.email || '?')[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-black text-slate-900 leading-tight truncate">{selected.subject || 'Untitled ticket'}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                        {selected.user?.email || 'Unknown'} • {selected.status?.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30 relative">
                            {loadingThread ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                    <div className="flex justify-center">
                                        <span className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                                            Conversation
                                        </span>
                                    </div>

                                    {/* Original ticket message */}
                                    {ticketMeta && selected.message && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[75%] rounded-2xl rounded-tl-md bg-slate-200 p-4 text-sm font-medium text-slate-800 shadow-sm">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Original request</p>
                                                {selected.message}
                                            </div>
                                        </div>
                                    )}

                                    {messages.length > 0 ? messages.map((m, i) => (
                                        <div key={m.id || i} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] group`}>
                                                <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm ${
                                                    m.isAdmin
                                                        ? 'bg-emerald-600 text-white rounded-tr-none'
                                                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                                                }`}>
                                                    {m.content}
                                                </div>
                                                <div className={`flex items-center gap-1.5 mt-1.5 ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {m.isAdmin && <CheckCheck size={12} className="text-emerald-600" />}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="flex-1 flex flex-col items-center justify-center opacity-30 mt-12">
                                            <MessageCircle size={48} className="mb-2" />
                                            <p className="text-xs font-black uppercase tracking-widest">No messages yet</p>
                                        </div>
                                    )}
                                    <div ref={endRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-100">
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                                <textarea
                                    className="w-full bg-transparent border-none focus:ring-0 p-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 resize-none outline-none"
                                    placeholder={socketReady ? 'Type your message here…' : 'Connecting to support socket…'}
                                    rows={2}
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                />
                                <div className="flex items-center justify-between py-2 px-3 border-t border-slate-100">
                                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <Clock size={12} />
                                        {socketReady ? 'Live channel' : 'Buffered (REST fallback)'}
                                    </span>
                                    <button
                                        onClick={handleSend}
                                        disabled={!draft.trim() || sending}
                                        className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-xs transition-all shadow-lg ${
                                            draft.trim() && !sending
                                                ? 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
                                                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                        <span>Send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-slate-50/30 p-12 text-center">
                        <div className="h-24 w-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-slate-100">
                            <MessageCircle className="text-emerald-600" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Select a conversation</h3>
                        <p className="text-slate-500 mt-2 max-w-sm font-medium">
                            Pick a ticket on the left to chat with the user in real time. New tickets stream in automatically.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveChatPage;
