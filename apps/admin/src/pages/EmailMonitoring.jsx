import React, { useState, useEffect } from 'react';
import { Mail, Send, Search, CheckCircle, AlertTriangle, Eye, RefreshCw, X, Filter } from 'lucide-react';
import { listAdminEmails, sendAdminManualEmail } from '../services/api';

export default function EmailMonitoring() {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 15;

    // Modal & Drawer states
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);

    // Form inputs
    const [recipientEmail, setRecipientEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [bodyText, setBodyText] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            };
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (statusFilter !== 'ALL') params.status = statusFilter;

            const res = await listAdminEmails(params);
            const data = res?.data || (Array.isArray(res) ? res : []);
            setLogs(data);
            setTotal(res?.pagination?.total ?? data.length);
        } catch (err) {
            console.error('Failed to load email logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, statusFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        fetchLogs();
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        if (!recipientEmail || !recipientEmail.includes('@')) {
            alert('Please enter a valid recipient email address.');
            return;
        }
        if (!subject.trim()) {
            alert('Subject is required.');
            return;
        }

        setSendLoading(true);
        try {
            await sendAdminManualEmail({
                recipientEmail: recipientEmail.trim(),
                subject: subject.trim(),
                bodyText: bodyText.trim() || subject.trim(),
                htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #059669;">OnIT India Official Support Notice</h2>
                    <p style="white-space: pre-line; line-height: 1.6;">${bodyText.trim() || subject.trim()}</p>
                    <br/>
                    <hr style="border: none; border-top: 1px solid #e2e8f0;"/>
                    <p style="font-size: 12px; color: #64748b;">Sent via OnIT India Admin Portal | <a href="mailto:support@onitindia.com">support@onitindia.com</a></p>
                </div>`,
            });
            alert(`Email dispatched successfully to ${recipientEmail}!`);
            setIsComposeOpen(false);
            setRecipientEmail('');
            setSubject('');
            setBodyText('');
            fetchLogs();
        } catch (err) {
            alert('Failed to send email: ' + (err.message || 'Unknown error'));
        } finally {
            setSendLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Mail size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">Email Monitoring & Communications</h1>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Track dispatch logs to Providers, Taskers & Support Desk or manually send official notifications.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchLogs}
                        className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button
                        onClick={() => setIsComposeOpen(true)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        <Send size={14} /> Send Email
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-96">
                    <div className="relative w-full">
                        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by recipient or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl">
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Filter size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
                    {['ALL', 'SENT', 'FAILED'].map((st) => (
                        <button
                            key={st}
                            onClick={() => { setStatusFilter(st); setPage(0); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                statusFilter === st
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Email Logs Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="py-4 px-6">Recipient Email</th>
                                <th className="py-4 px-6">Subject</th>
                                <th className="py-4 px-6">Event Type</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Sent At</th>
                                <th className="py-4 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                            {loading && !logs.length ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-slate-400 font-bold uppercase tracking-wider">
                                        Loading email audit logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-slate-400 font-bold uppercase tracking-wider">
                                        No email dispatch records found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-6 font-bold text-slate-900">
                                            {log.recipientEmail}
                                        </td>
                                        <td className="py-4 px-6 max-w-xs truncate font-semibold" title={log.subject}>
                                            {log.subject}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                {log.eventType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {log.status === 'SENT' ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    <CheckCircle size={12} /> SENT
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    <AlertTriangle size={12} /> FAILED
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                                            {new Date(log.sentAt || log.createdAt).toLocaleString('en-IN')}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => setSelectedEmail(log)}
                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1"
                                            >
                                                <Eye size={12} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {total > PAGE_SIZE && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-bold">
                            Showing {page * PAGE_SIZE + 1} - {Math.min((page + 1) * PAGE_SIZE, total)} of {total} emails
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                disabled={(page + 1) * PAGE_SIZE >= total}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Email Detail View Modal */}
            {selectedEmail && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                                    Email Inspection
                                </span>
                                <h3 className="text-lg font-black text-slate-900">{selectedEmail.subject}</h3>
                            </div>
                            <button onClick={() => setSelectedEmail(null)} className="p-2 text-slate-400 hover:text-slate-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs font-medium text-slate-700">
                                <div>
                                    <span className="text-slate-400 font-bold block text-[10px] uppercase">To:</span>
                                    {selectedEmail.recipientEmail}
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Sent Time:</span>
                                    {new Date(selectedEmail.sentAt).toLocaleString('en-IN')}
                                </div>
                            </div>

                            <div>
                                <span className="text-slate-400 font-bold block text-[10px] uppercase mb-2">Content Preview:</span>
                                {selectedEmail.htmlContent ? (
                                    <div
                                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
                                        dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
                                    />
                                ) : (
                                    <pre className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono whitespace-pre-wrap">
                                        {selectedEmail.bodyText || selectedEmail.subject}
                                    </pre>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Compose & Send Email Drawer */}
            {isComposeOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleSendEmail} className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Send size={18} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Send Official Email</h3>
                            </div>
                            <button type="button" onClick={() => setIsComposeOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Recipient Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="user@onitindia.com"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Subject Line *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="OnIT India | Important Support Update regarding your account"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Email Content Body *
                                </label>
                                <textarea
                                    rows={6}
                                    required
                                    placeholder="Type your message content here..."
                                    value={bodyText}
                                    onChange={(e) => setBodyText(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-bold">
                                Sender: support@onitindia.com
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsComposeOpen(false)}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendLoading}
                                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    {sendLoading ? 'Dispatching...' : 'Dispatch Email'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
