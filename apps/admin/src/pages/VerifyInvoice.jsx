import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, FileText, Download, Building2, User, Wrench } from 'lucide-react';
import api from '../services/api';

const VerifyInvoice = () => {
    const [searchParams] = useSearchParams();
    const invoiceId = searchParams.get('id');
    const taskId = searchParams.get('taskId');
    const amount = searchParams.get('amount');

    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!taskId) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/tasks/${taskId}/invoice`);
                setInvoiceData(response.data);
            } catch (err) {
                console.error('Error verifying invoice online:', err);
                setError('Could not retrieve digital record from OnIT Escrow Engine.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [taskId]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans">
            {/* Top Navigation / Brand */}
            <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl">
                        O
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                            OnIT <span className="text-emerald-400">INDIA</span>
                        </h1>
                        <p className="text-xs text-slate-400">Official Electronic Verification Ledger</p>
                    </div>
                </div>
                <Link to="/login" className="text-xs font-semibold text-slate-400 hover:text-white transition">
                    Admin Portal &rarr;
                </Link>
            </header>

            {/* Main Content Card */}
            <main className="max-w-4xl mx-auto w-full my-8">
                {/* Official Verification Banner */}
                <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden mb-8">
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20 animate-pulse">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Signed by OnIT — Verified
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                Official Authenticated Digital Invoice
                            </h2>
                            <p className="text-slate-300 text-sm mt-1 max-w-xl">
                                This document is digitally signed by OnIT India Technologies Escrow & Billing Engine. Integrity verified & stored on secure ledger.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 font-medium">
                        Verifying cryptographic signature on ledger...
                    </div>
                )}

                {/* Error / Fallback URL info state */}
                {!loading && (error || !invoiceData) && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-400" /> Verification Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <span className="text-slate-400 text-xs uppercase font-semibold">Invoice Number</span>
                                <p className="font-mono font-bold text-white text-base mt-1">{invoiceId || 'N/A'}</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <span className="text-slate-400 text-xs uppercase font-semibold">Task Reference ID</span>
                                <p className="font-mono font-bold text-white text-base mt-1">{taskId || 'N/A'}</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <span className="text-slate-400 text-xs uppercase font-semibold">Verified Total Amount</span>
                                <p className="font-mono font-bold text-emerald-400 text-lg mt-1">₹{amount || '0.00'}</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <span className="text-slate-400 text-xs uppercase font-semibold">Digital Signature Status</span>
                                <p className="font-bold text-emerald-400 text-base mt-1 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" /> SIGNED & VERIFIED BY ONIT
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Live fetched Invoice Details */}
                {!loading && invoiceData && (
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Invoice Identifier</span>
                                    <h3 className="text-2xl font-black font-mono text-white">{invoiceData.invoiceNumber}</h3>
                                    <p className="text-xs text-slate-400 mt-1">Issued: {invoiceData.issueDate}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 uppercase">
                                        {invoiceData.status}
                                    </span>
                                    <p className="text-xs text-slate-400 mt-1 font-mono">{invoiceData.digitalSignatureHash}</p>
                                </div>
                            </div>

                            {/* Service Card */}
                            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Wrench className="w-4 h-4 text-emerald-400" /> Service Title & Scope
                                </span>
                                <h4 className="text-lg font-bold text-white">{invoiceData.task?.title}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                                    <span className="bg-slate-800 px-2.5 py-1 rounded-md">Category: {invoiceData.task?.category}</span>
                                    <span className="bg-slate-800 px-2.5 py-1 rounded-md">Subcategory: {invoiceData.task?.subcategory}</span>
                                </div>
                            </div>

                            {/* Billed Parties */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-2">
                                        <User className="w-4 h-4 text-blue-400" /> Billed To (Task Provider)
                                    </span>
                                    <p className="font-bold text-white text-sm">{invoiceData.provider?.name}</p>
                                    <p className="text-xs text-slate-400">{invoiceData.provider?.email}</p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-2">
                                        <Building2 className="w-4 h-4 text-purple-400" /> Performed By (Tasker)
                                    </span>
                                    <p className="font-bold text-white text-sm">{invoiceData.performer?.name}</p>
                                    <p className="text-xs text-slate-400">{invoiceData.performer?.email}</p>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Task Contract Price:</span>
                                    <span className="font-bold font-mono">₹{invoiceData.pricing?.baseAmount?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Platform Fee:</span>
                                    <span className="font-bold font-mono">₹{invoiceData.pricing?.platformFee?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Service Commission:</span>
                                    <span className="font-bold font-mono">₹{invoiceData.pricing?.commissionFee?.toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-emerald-400">
                                    <span className="font-black text-base uppercase tracking-wider">Total Settled Amount:</span>
                                    <span className="text-2xl font-black font-mono">₹{invoiceData.pricing?.totalPaid?.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {taskId && (
                                <div className="pt-2 text-center">
                                    <a
                                        href={`${api.defaults.baseURL}/tasks/${taskId}/invoice/pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition"
                                    >
                                        <Download className="w-4 h-4" /> Download Official PDF Invoice
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
                <p>&copy; {new Date().getFullYear()} OnIT India Technologies Pvt. Ltd. All rights reserved.</p>
                <p className="text-slate-400">Tax-Compliant Marketplace Ledger — Electronically Signed & Verified</p>
            </footer>
        </div>
    );
};

export default VerifyInvoice;
