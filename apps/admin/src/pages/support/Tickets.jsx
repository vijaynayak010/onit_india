import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    MessageCircle,
    Filter,
    Search,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    Tag,
    ArrowUpRight,
    Loader2,
    Send,
    X,
} from 'lucide-react';
import DataTable from '../../components/common/DataTable.jsx';
import Toast from '../../components/common/Toast.jsx';
import {
    listTicketsAdmin,
    getTicketByIdAdmin,
    getTicketStatisticsAdmin,
    updateTicketStatusAdmin,
    addTicketMessageAdmin,
} from '../../services/api';

const STATUS_COLORS = {
    OPEN: { dot: 'bg-amber-500', text: 'text-amber-600', icon: AlertCircle },
    IN_PROGRESS: { dot: 'bg-blue-500', text: 'text-blue-600', icon: Clock },
    RESOLVED: { dot: 'bg-emerald-500', text: 'text-emerald-600', icon: CheckCircle2 },
    CLOSED: { dot: 'bg-slate-400', text: 'text-slate-500', icon: CheckCircle2 },
};

const TABS = [
    { id: 'all', label: 'All Tickets', backend: undefined },
    { id: 'OPEN', label: 'Open', backend: 'OPEN' },
    { id: 'IN_PROGRESS', label: 'In Progress', backend: 'IN_PROGRESS' },
    { id: 'RESOLVED', label: 'Resolved', backend: 'RESOLVED' },
];

const TicketsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
    const [loading, setLoading] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [activeTicket, setActiveTicket] = useState(null);
    const [ticketLoading, setTicketLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { limit: 50 };
            const tab = TABS.find(t => t.id === activeTab);
            if (tab?.backend) params.status = tab.backend;

            const [ticketsRes, statsRes] = await Promise.all([
                listTicketsAdmin(params),
                getTicketStatisticsAdmin().catch(() => ({})),
            ]);
            const list = Array.isArray(ticketsRes?.data) ? ticketsRes.data : (Array.isArray(ticketsRes) ? ticketsRes : []);
            setTickets(list);
            setStats({
                total: statsRes.total ?? list.length,
                open: statsRes.open ?? 0,
                inProgress: statsRes.inProgress ?? 0,
                resolved: statsRes.resolved ?? 0,
            });
        } catch (err) {
            setToast({ message: 'Failed to fetch tickets.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Load the full ticket (with messages) when one is selected.
    const loadTicket = useCallback(async (id) => {
        if (!id) return;
        setTicketLoading(true);
        try {
            const full = await getTicketByIdAdmin(id);
            setActiveTicket(full);
        } catch (err) {
            setToast({ message: 'Failed to load ticket details.', type: 'error' });
        } finally {
            setTicketLoading(false);
        }
    }, []);

    useEffect(() => { if (selectedTicketId) loadTicket(selectedTicketId); }, [selectedTicketId, loadTicket]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeTicket?.messages?.length]);

    const handleUpdateStatus = async (newStatus) => {
        if (!activeTicket?.id) return;
        try {
            await updateTicketStatusAdmin(activeTicket.id, { status: newStatus });
            setToast({ message: `Ticket marked ${newStatus.replace('_', ' ').toLowerCase()}.`, type: 'success' });
            await loadTicket(activeTicket.id);
            fetchData();
        } catch (err) {
            setToast({ message: err.message || 'Failed to update status.', type: 'error' });
        }
    };

    const handleSendReply = async () => {
        const trimmed = replyText.trim();
        if (!trimmed || !activeTicket?.id) return;
        setSending(true);
        try {
            await addTicketMessageAdmin(activeTicket.id, { content: trimmed });
            setReplyText('');
            setToast({ message: 'Reply sent.', type: 'success' });
            await loadTicket(activeTicket.id);
            fetchData();
        } catch (err) {
            setToast({ message: err.message || 'Failed to send reply.', type: 'error' });
        } finally {
            setSending(false);
        }
    };

    const filteredTickets = tickets.filter(t => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
            String(t.id).toLowerCase().includes(q) ||
            String(t.subject || '').toLowerCase().includes(q) ||
            String(t.user?.email || '').toLowerCase().includes(q)
        );
    });

    const columns = [
        {
            header: 'Ticket ID',
            key: 'id',
            render: (val) => (
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    #{String(val).split('-')[0]}
                </span>
            ),
        },
        {
            header: 'Subject',
            key: 'subject',
            render: (val, row) => (
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{val}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{row.user?.email || 'Unknown User'}</p>
                </div>
            ),
        },
        {
            header: 'Category',
            key: 'category',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Tag size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">{val || '—'}</span>
                </div>
            ),
        },
        {
            header: 'Priority',
            key: 'priority',
            render: (val) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    val === 'HIGH' || val === 'URGENT' ? 'bg-red-100 text-red-600' :
                    val === 'NORMAL' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                }`}>
                    {val || 'LOW'}
                </span>
            ),
        },
        {
            header: 'Status',
            key: 'status',
            render: (val) => {
                const c = STATUS_COLORS[val] || STATUS_COLORS.OPEN;
                const Icon = c.icon;
                return (
                    <div className="flex items-center gap-1.5">
                        <Icon size={14} className={c.text} />
                        <span className={`text-sm font-bold ${c.text}`}>{val?.replace('_', ' ')}</span>
                    </div>
                );
            },
        },
        {
            header: 'Last Update',
            key: 'updatedAt',
            render: (val) => <span className="text-sm text-slate-500">{val ? new Date(val).toLocaleString() : '—'}</span>,
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Tickets</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage and resolve customer complaints efficiently.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tickets', value: stats.total || 0, icon: MoreHorizontal, tone: 'bg-slate-500' },
                    { label: 'Open', value: stats.open || 0, icon: AlertCircle, tone: 'bg-amber-500' },
                    { label: 'In Progress', value: stats.inProgress || 0, icon: Clock, tone: 'bg-blue-500' },
                    { label: 'Resolved', value: stats.resolved || 0, icon: CheckCircle2, tone: 'bg-emerald-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`h-10 w-10 ${stat.tone} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                                <stat.icon size={20} className={stat.tone.replace('bg-', 'text-')} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4 border-b border-slate-100 pb-px">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative pb-4 px-2 text-sm font-black transition-all ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full" />}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search ticket ID, subject or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <DataTable
                    columns={columns}
                    data={filteredTickets}
                    loading={loading}
                    actions={true}
                    hideToolbar={true}
                    onRowClick={(row) => setSelectedTicketId(row.id)}
                />
            </div>

            {/* Detail Drawer */}
            {selectedTicketId && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white h-screen shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4 min-w-0">
                                <span className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-400 shrink-0">
                                    <MessageCircle size={20} />
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-xl font-black text-slate-900 truncate">
                                        {ticketLoading ? 'Loading…' : (activeTicket?.subject || '—')}
                                    </h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        #{String(selectedTicketId).split('-')[0]}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setSelectedTicketId(null); setActiveTicket(null); }}
                                className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {ticketLoading && !activeTicket ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                                    <Loader2 className="animate-spin text-emerald-500" size={28} />
                                    <p className="text-xs font-bold uppercase tracking-widest">Loading thread...</p>
                                </div>
                            ) : activeTicket ? (
                                <div className="p-8 space-y-6">
                                    {/* Status + actions */}
                                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Current status</p>
                                            <p className="text-lg font-black text-slate-900 mt-1">{activeTicket.status?.replace('_', ' ')}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {activeTicket.status !== 'IN_PROGRESS' && activeTicket.status !== 'RESOLVED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus('IN_PROGRESS')}
                                                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                                                >
                                                    Mark in progress
                                                </button>
                                            )}
                                            {activeTicket.status !== 'RESOLVED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus('RESOLVED')}
                                                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700"
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                            {activeTicket.status === 'RESOLVED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus('CLOSED')}
                                                    className="px-3 py-2 bg-slate-700 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800"
                                                >
                                                    Close
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <section className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</p>
                                            <p className="text-sm font-bold text-slate-700 truncate">{activeTicket.user?.email || 'Unknown'}</p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase">{activeTicket.user?.role || 'USER'}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Created</p>
                                            <p className="text-sm font-bold text-slate-700">{new Date(activeTicket.createdAt).toLocaleString()}</p>
                                            <p className="text-[10px] font-medium text-slate-400">Category: {activeTicket.category || '—'}</p>
                                        </div>
                                    </section>

                                    {/* Conversation */}
                                    <section>
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Conversation</h4>
                                        <div className="space-y-3">
                                            {/* Original message */}
                                            {activeTicket.message && (
                                                <div className="flex justify-start">
                                                    <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">
                                                        <p className="text-xs font-bold text-slate-500 mb-1">Original request</p>
                                                        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{activeTicket.message}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {Array.isArray(activeTicket.messages) && activeTicket.messages.length > 0 ? (
                                                activeTicket.messages.map(m => (
                                                    <div key={m.id} className={`flex ${m.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.isAdmin ? 'bg-emerald-600 text-white rounded-tr-md' : 'bg-slate-100 text-slate-800 rounded-tl-md'}`}>
                                                            <p className={`text-[10px] font-bold mb-1 ${m.isAdmin ? 'text-emerald-100' : 'text-slate-500'}`}>
                                                                {m.isAdmin ? 'Support' : (m.sender?.email || 'Customer')} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-slate-400 italic px-2">No replies yet — send the first response below.</p>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </section>
                                </div>
                            ) : null}
                        </div>

                        {/* Reply */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50">
                            <div className="relative flex items-end gap-3">
                                <textarea
                                    placeholder="Write a response to the customer..."
                                    className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all resize-none"
                                    rows={2}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendReply();
                                        }
                                    }}
                                    disabled={sending || !activeTicket}
                                />
                                <button
                                    onClick={handleSendReply}
                                    disabled={sending || !replyText.trim() || !activeTicket}
                                    className="h-12 w-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                >
                                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default TicketsPage;
