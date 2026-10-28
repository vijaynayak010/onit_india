import React, { useState, useEffect, useCallback } from 'react';
import {
    CheckCircle2, Download, Wallet, RotateCw,
    Search, AlertCircle, Loader2, ArrowUpRight,
    RefreshCw, CreditCard, ArrowDownRight, ArrowUpRight as ArrowUpRightIcon,
    XCircle, ShieldAlert, ArrowLeftRight, FileText
} from 'lucide-react';
import DataTable from '../components/common/DataTable.jsx';
import Toast from '../components/common/Toast.jsx';
import { 
    listTransactions, 
    updateTransactionStatus, 
    listWithdrawals, 
    completeWithdrawal, 
    rejectWithdrawal,
    downloadTaskInvoicePdf,
} from '../services/api';

/* =======================
   HELPERS
   ======================= */
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
};

const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const getUserName = (user) => {
    if (!user) return 'Unknown';
    return user.taskers?.displayName || user.provider?.username || user.email || 'Unknown';
};

const getWithdrawalPayoutInfo = (withdrawal = {}) => {
    const payoutDetails = withdrawal.payoutDetails || {};
    const method = withdrawal.payoutMethod || {};
    const methodDetails = method.details || {};
    const rawType = payoutDetails.type || method.type || '';
    const normalizedType = String(rawType).toUpperCase();
    const isBankAccount = normalizedType === 'BANK_ACCOUNT';
    const accountNumber = payoutDetails.accountNumber || methodDetails.accountNumber || '';
    const accountLast4 = accountNumber ? String(accountNumber).slice(-4) : methodDetails.accountLast4;
    const bankName = payoutDetails.bankName || methodDetails.bankName || '';
    const ifscCode = payoutDetails.ifscCode || methodDetails.ifscCode || '';
    const beneficiaryName =
        payoutDetails.beneficiaryName ||
        methodDetails.beneficiaryName ||
        methodDetails.accountHolderName ||
        methodDetails.accountHolder ||
        '';
    const upiId = payoutDetails.upiId || methodDetails.upiId || '';

    if (isBankAccount) {
        return {
            type: 'BANK_ACCOUNT',
            display: `${bankName || 'Bank'} Account (•••• ${accountLast4 || 'N/A'})`,
            bankName,
            accountNumber,
            accountLast4,
            ifscCode,
            beneficiaryName,
            upiId: null,
        };
    }

    return {
        type: 'UPI',
        display: `UPI Address (${upiId || 'N/A'})`,
        bankName: '',
        accountNumber: '',
        accountLast4: '',
        ifscCode: '',
        beneficiaryName: '',
        upiId,
    };
};


/* =======================
   TRANSACTION DETAIL DRAWER
   ======================= */
const TransactionDetailDrawer = ({ isOpen, onClose, transaction, onStatusChange, onDownloadInvoice, actionLoading }) => {
    if (!transaction) return null;

    const isPayout = transaction.type === 'PAYOUT';
    const isCompleted = transaction.status === 'COMPLETED';

    return (
        <div className={`fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[60] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                            Txn Detail
                        </span>
                        <span className="text-slate-400 text-xs font-bold truncate max-w-[150px]" title={transaction.id}>
                            {transaction.id.split('-')[0]}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                </div>

                <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                    {/* Amount Card */}
                    <div className={`rounded-3xl p-8 text-center text-white shadow-lg ${isPayout ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-emerald-600 shadow-emerald-600/20'
                        }`}>
                        <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-2">
                            {transaction.type} AMOUNT
                        </p>
                        <h3 className="text-4xl font-black">{formatCurrency(transaction.amount)}</h3>
                        {transaction.feeAmount > 0 && (
                            <p className="text-sm font-medium opacity-80 mt-2">
                                + {formatCurrency(transaction.feeAmount)} platform fee
                            </p>
                        )}
                    </div>

                    {/* Status & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest ${transaction.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                    transaction.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-200 text-slate-700'
                                }`}>
                                {transaction.status}
                            </span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-sm font-bold text-slate-800">{formatDate(transaction.createdAt)}</p>
                        </div>
                    </div>

                    {/* Associated Info */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Related Entities</h4>

                        {(transaction.task || transaction.taskId) && (
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                                <div className="min-w-0 flex-1 pr-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Task Invoice</p>
                                    <p className="font-bold text-slate-800 text-xs mt-0.5 truncate">{transaction.task?.title || 'Associated Task'}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onDownloadInvoice(transaction.task?.id || transaction.taskId)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 transition shrink-0"
                                >
                                    <FileText size={12} /> Invoice PDF
                                </button>
                            </div>
                        )}

                        {(transaction.user || transaction.wallet?.user) && (
                            <div className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center rounded-full font-black">
                                    {getUserName(transaction.user || transaction.wallet?.user)[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Primary User</p>
                                    <p className="font-bold text-slate-800">{getUserName(transaction.user || transaction.wallet?.user)}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{(transaction.user || transaction.wallet?.user).email}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Admin Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    {!isCompleted ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => onStatusChange(transaction.id, 'COMPLETED')}
                                disabled={actionLoading}
                                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black text-xs uppercase shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                            >
                                {actionLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'MARK COMPLETED'}
                            </button>
                            <button
                                onClick={() => onStatusChange(transaction.id, 'FAILED')}
                                disabled={actionLoading}
                                className="w-full bg-white border border-red-200 text-red-600 py-3.5 rounded-xl font-black text-xs uppercase hover:bg-red-50 transition"
                            >
                                MARK FAILED
                            </button>
                        </div>
                    ) : (
                        <div className="w-full bg-emerald-50 text-emerald-700 py-4 rounded-xl font-black text-xs text-center uppercase border border-emerald-100 flex justify-center items-center gap-2">
                            <CheckCircle2 size={16} /> TRANSACTION SETTLED
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


/* =======================
   WITHDRAWAL REQUEST DETAIL DRAWER
   ======================= */
const WithdrawalDetailDrawer = ({ isOpen, onClose, withdrawal, onApprove, onReject, actionLoading }) => {
    const [actionType, setActionType] = useState(null); // 'approve' | 'reject' | null
    const [utr, setUtr] = useState('');
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        setActionType(null);
        setUtr('');
        setReason('');
        setNote('');
    }, [withdrawal, isOpen]);

    if (!withdrawal) return null;

    const isPending = withdrawal.status === 'PENDING';
    const isCompleted = withdrawal.status === 'COMPLETED';
    const isRejected = withdrawal.status === 'REJECTED';
    
    const payoutInfo = getWithdrawalPayoutInfo(withdrawal);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (actionType === 'approve') {
            if (!utr.trim()) return alert('Banking UTR/Reference Number is required');
            onApprove(withdrawal.id, utr.trim(), note.trim());
        } else if (actionType === 'reject') {
            if (!reason.trim()) return alert('Rejection reason is required');
            onReject(withdrawal.id, reason.trim(), note.trim());
        }
    };

    return (
        <div className={`fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[60] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                            Payout Request
                        </span>
                        <span className="text-slate-400 text-xs font-bold truncate max-w-[150px]" title={withdrawal.id}>
                            {withdrawal.id.split('-')[0]}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* Amount & Status Header */}
                    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                            <Wallet size={120} />
                        </div>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                            WITHDRAWAL REQUEST AMOUNT
                        </p>
                        <h3 className="text-3xl font-black">{formatCurrency(withdrawal.amount)}</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                                isCompleted ? 'bg-emerald-500/20 text-emerald-300' :
                                isRejected ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
                            }`}>
                                {withdrawal.status}
                            </span>
                            <span className="text-slate-400 text-[10px] font-medium">• Submitted {formatDate(withdrawal.createdAt)}</span>
                        </div>
                    </div>

                    {/* Tasker Profile */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tasker Details</h4>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-600 text-white flex items-center justify-center rounded-full font-black">
                                {getUserName(withdrawal.user)[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 leading-tight">{getUserName(withdrawal.user)}</p>
                                <p className="text-xs text-slate-500 font-medium">{withdrawal.user?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Payout Method */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payout Bank Account</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Settlement Method</p>
                                <p className="font-bold text-slate-800 text-sm">{payoutInfo.display}</p>
                            </div>
                            {payoutInfo.type === 'BANK_ACCOUNT' && (
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Account Holder</p>
                                        <p className="font-bold text-slate-700 text-xs">{payoutInfo.beneficiaryName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">IFSC Code</p>
                                        <p className="font-bold text-slate-700 text-xs">{payoutInfo.ifscCode || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Account Number</p>
                                        <p className="font-mono font-bold text-slate-700 text-xs">
                                            {payoutInfo.accountNumber || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Bank Name</p>
                                        <p className="font-bold text-slate-700 text-xs">{payoutInfo.bankName || 'N/A'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Historic Resolution info */}
                    {!isPending && (
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Details</h4>
                            {isCompleted && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Banking UTR / Reference</p>
                                    <p className="font-mono font-bold text-emerald-700 text-sm bg-emerald-50 px-2.5 py-1 rounded inline-block mt-1">{withdrawal.utrNumber || withdrawal.referenceNumber}</p>
                                </div>
                            )}
                            {isRejected && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Rejection Reason</p>
                                    <p className="font-medium text-red-600 text-xs bg-red-50 px-2.5 py-1.5 rounded mt-1">{withdrawal.rejectionReason}</p>
                                </div>
                            )}
                            {withdrawal.adminNote && (
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Admin Note</p>
                                    <p className="text-slate-600 text-xs mt-1 italic">"{withdrawal.adminNote}"</p>
                                </div>
                            )}
                            <p className="text-[10px] text-slate-400 font-medium">Processed on {formatDate(withdrawal.processedAt)}</p>
                        </div>
                    )}

                    {/* Process Action Form */}
                    {isPending && actionType && (
                        <form onSubmit={handleFormSubmit} className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl space-y-4 animate-in slide-in-from-bottom duration-300">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                {actionType === 'approve' ? 'Complete Bank Settlement' : 'Reject Withdrawal Request'}
                            </h4>
                            
                            {actionType === 'approve' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Bank UTR / Transaction Reference (Required)</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. UTR918273645"
                                        value={utr}
                                        onChange={e => setUtr(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-400 font-mono"
                                    />
                                </div>
                            )}

                            {actionType === 'reject' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Rejection Reason (Required)</label>
                                    <textarea
                                        required
                                        placeholder="Reason for rejecting this payout request (visible to tasker)..."
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400"
                                        rows={3}
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase block">Internal Admin Audit Note (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="Add internal notes for records..."
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-400"
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setActionType(null)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={actionLoading}
                                    className={`px-5 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow ${
                                        actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {actionLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                                    {actionType === 'approve' ? 'Submit Completion' : 'Submit Rejection'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Pending Actions Footer */}
                {isPending && !actionType && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setActionType('approve')}
                                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black text-xs uppercase shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                            >
                                APPROVE & COMPLETE
                            </button>
                            <button
                                onClick={() => setActionType('reject')}
                                className="w-full bg-white border border-red-200 text-red-600 py-3.5 rounded-xl font-black text-xs uppercase hover:bg-red-50 transition"
                            >
                                REJECT PAYOUT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


/* =======================
   MAIN FINANCE PAGE
   ======================= */
const FinancePage = () => {
    // Tabs state: 'transactions' | 'withdrawals'
    const [activeTab, setActiveTab] = useState('transactions');

    // Transactions Ledger state
    const [transactions, setTransactions] = useState([]);
    const [txnTotal, setTxnTotal] = useState(0);
    const [txnLoading, setTxnLoading] = useState(true);
    const [txnPage, setTxnPage] = useState(0);
    const [activeType, setActiveType] = useState('all'); // all | CREDIT | DEBIT
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [txnDrawerOpen, setTxnDrawerOpen] = useState(false);

    // Withdrawal Requests state
    const [withdrawals, setWithdrawals] = useState([]);
    const [wdrTotal, setWdrTotal] = useState(0);
    const [wdrLoading, setWdrLoading] = useState(true);
    const [wdrPage, setWdrPage] = useState(0);
    const [activeStatus, setActiveStatus] = useState('PENDING'); // PENDING | COMPLETED | REJECTED | all
    const [selectedWdr, setSelectedWdr] = useState(null);
    const [wdrDrawerOpen, setWdrDrawerOpen] = useState(false);

    // Common Action states
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const PAGE_SIZE = 20;

    // Fetch Transactions
    const fetchTransactions = useCallback(async () => {
        setTxnLoading(true);
        try {
            const params = {
                limit: PAGE_SIZE,
                offset: txnPage * PAGE_SIZE,
            };
            if (activeType !== 'all') params.type = activeType;

            const res = await listTransactions(params);
            setTransactions(res.data ?? []);
            setTxnTotal(res.pagination?.total ?? 0);
        } catch (err) {
            setToast({ message: err.message || 'Failed to load transaction ledger', type: 'error' });
        } finally {
            setTxnLoading(false);
        }
    }, [txnPage, activeType]);

    // Fetch Withdrawals
    const fetchWithdrawals = useCallback(async () => {
        setWdrLoading(true);
        try {
            const params = {
                limit: PAGE_SIZE,
                offset: wdrPage * PAGE_SIZE,
            };
            if (activeStatus !== 'all') params.status = activeStatus;

            const res = await listWithdrawals(params);
            setWithdrawals(res.data ?? []);
            setWdrTotal(res.pagination?.total ?? 0);
        } catch (err) {
            setToast({ message: err.message || 'Failed to load withdrawal requests', type: 'error' });
        } finally {
            setWdrLoading(false);
        }
    }, [wdrPage, activeStatus]);

    // Initial and responsive fetches
    useEffect(() => {
        if (activeTab === 'transactions') {
            fetchTransactions();
        } else {
            fetchWithdrawals();
        }
    }, [activeTab, fetchTransactions, fetchWithdrawals]);

    // Handle Manual Transaction status override
    const handleStatusChange = async (id, newStatus) => {
        setActionLoading(true);
        try {
            await updateTransactionStatus(id, { status: newStatus });
            setToast({ message: `Transaction marked as ${newStatus}`, type: 'success' });
            setSelectedTxn(prev => prev ? { ...prev, status: newStatus } : prev);
            fetchTransactions();
        } catch (err) {
            setToast({ message: err.message || 'Failed to update transaction status', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleInvoiceDownload = async (taskId) => {
        try {
            await downloadTaskInvoicePdf(taskId);
        } catch (err) {
            console.error('Failed to download task invoice:', err);
            setToast({ message: err.message || 'Unable to download the invoice.', type: 'error' });
        }
    };

    // Approve/Complete Withdrawal Payout
    const handleApproveWithdrawal = async (id, referenceNumber, adminNote) => {
        setActionLoading(true);
        try {
            await completeWithdrawal(id, { referenceNumber, adminNote });
            setToast({ message: 'Withdrawal payout marked completed successfully', type: 'success' });
            setWdrDrawerOpen(false);
            fetchWithdrawals();
        } catch (err) {
            setToast({ message: err.message || 'Failed to complete payout', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    // Reject Withdrawal Request
    const handleRejectWithdrawal = async (id, rejectionReason, adminNote) => {
        setActionLoading(true);
        try {
            await rejectWithdrawal(id, { rejectionReason, adminNote });
            setToast({ message: 'Withdrawal request rejected. Funds refunded to tasker.', type: 'success' });
            setWdrDrawerOpen(false);
            fetchWithdrawals();
        } catch (err) {
            setToast({ message: err.message || 'Failed to reject payout', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    /* ============================
       COLUMNS FOR TABLES
       ============================ */
    const txnColumns = [
        {
            header: 'TXN ID',
            key: 'id',
            render: (v) => <span className="font-mono text-xs text-slate-500 truncate block max-w-[100px]" title={v}>{v.split('-')[0]}</span>
        },
        {
            header: 'TYPE',
            key: 'type',
            render: (v) => (
                <div className="flex items-center gap-1.5 font-bold text-xs">
                    {v === 'DEBIT' ? <ArrowUpRightIcon size={14} className="text-indigo-500" /> :
                        v === 'CREDIT' ? <ArrowDownRight size={14} className="text-emerald-500" /> :
                            <RotateCw size={14} className="text-amber-500" />}
                    {v}
                </div>
            )
        },
        {
            header: 'AMOUNT',
            key: 'amount',
            render: (v, row) => (
                <span className={`font-black tracking-tight ${row.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {formatCurrency(v)}
                </span>
            )
        },
        {
            header: 'USER',
            key: 'wallet',
            render: (wallet) => (
                <div className="flex flex-col">
                    <span className="font-black text-xs text-slate-800">{getUserName(wallet?.user)}</span>
                    {wallet?.user?.email && <span className="text-[10px] text-slate-400 font-medium">{wallet.user.email}</span>}
                </div>
            )
        },
        {
            header: 'STATUS',
            key: 'status',
            render: (status) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                    status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                    status === 'FAILED' ? 'bg-red-50 text-red-600' :
                    'bg-slate-100 text-slate-600'
                }`}>
                    {status}
                </span>
            )
        },
        {
            header: 'DATE',
            key: 'createdAt',
            render: (date) => <span className="text-xs font-medium text-slate-500">{formatDate(date)}</span>
        },
        {
            header: 'ACTIONS',
            render: (_, row) => (
                <button
                    onClick={() => {
                        setSelectedTxn(row);
                        setTxnDrawerOpen(true);
                    }}
                    className="flex items-center gap-1 text-emerald-600 font-bold text-xs hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Review <ArrowUpRight size={14} />
                </button>
            )
        }
    ];

    const wdrColumns = [
        {
            header: 'REQ ID',
            key: 'id',
            render: (v) => <span className="font-mono text-xs text-slate-500 truncate block max-w-[100px]" title={v}>{v.split('-')[0]}</span>
        },
        {
            header: 'TASKER',
            key: 'user',
            render: (user) => (
                <div className="flex flex-col">
                    <span className="font-black text-xs text-slate-800">{getUserName({ user })}</span>
                    {user?.email && <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>}
                </div>
            )
        },
        {
            header: 'AMOUNT',
            key: 'amount',
            render: (v) => <span className="font-black tracking-tight text-slate-900">{formatCurrency(v)}</span>
        },
        {
            header: 'BANK ACCOUNT',
            key: 'payoutMethod',
            render: (_, row) => {
                if (!row?.payoutMethod && !row?.payoutDetails) {
                    return <span className="text-xs text-slate-400 font-medium">N/A</span>;
                }
                const payoutInfo = getWithdrawalPayoutInfo(row);
                return (
                    <div className="flex flex-col">
                        <span className="font-bold text-xs text-slate-700">
                            {payoutInfo.type === 'BANK_ACCOUNT'
                                ? `${payoutInfo.bankName || 'Bank'} (•••• ${payoutInfo.accountLast4 || 'N/A'})`
                                : `UPI: ${payoutInfo.upiId || 'N/A'}`}
                        </span>
                        {payoutInfo.beneficiaryName && (
                            <span className="text-[10px] text-slate-400 font-medium">{payoutInfo.beneficiaryName}</span>
                        )}
                    </div>
                );
            }
        },
        {
            header: 'STATUS',
            key: 'status',
            render: (status) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                    status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                    status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                    'bg-slate-100 text-slate-600'
                }`}>
                    {status}
                </span>
            )
        },
        {
            header: 'REQUESTED ON',
            key: 'createdAt',
            render: (date) => <span className="text-xs font-medium text-slate-500">{formatDate(date)}</span>
        },
        {
            header: 'ACTIONS',
            render: (_, row) => (
                <button
                    onClick={() => {
                        setSelectedWdr(row);
                        setWdrDrawerOpen(true);
                    }}
                    className="flex items-center gap-1 text-emerald-600 font-bold text-xs hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Review Payout <ArrowUpRight size={14} />
                </button>
            )
        }
    ];

    const currentLoading = activeTab === 'transactions' ? txnLoading : wdrLoading;
    const currentTotal = activeTab === 'transactions' ? txnTotal : wdrTotal;
    const currentPage = activeTab === 'transactions' ? txnPage : wdrPage;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700 pb-20 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finance Center</h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        {currentLoading ? 'Syncing with ledger...' : 
                         activeTab === 'transactions' 
                             ? `${txnTotal.toLocaleString()} total platform transactions`
                             : `${wdrTotal.toLocaleString()} withdrawal request files`
                        }
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => activeTab === 'transactions' ? fetchTransactions() : fetchWithdrawals()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold shadow-sm hover:shadow hover:border-emerald-200 transition-all"
                    >
                        <RefreshCw size={16} className={currentLoading ? 'animate-spin text-emerald-500' : ''} />
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Tab Switched Layout */}
            <div className="flex border-b border-slate-200 gap-6">
                <button
                    onClick={() => { setActiveTab('transactions'); }}
                    className={`pb-4 text-sm font-bold transition-all relative ${
                        activeTab === 'transactions' 
                            ? 'text-slate-900 border-b-2 border-slate-900' 
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    Transactions Ledger
                </button>
                <button
                    onClick={() => { setActiveTab('withdrawals'); }}
                    className={`pb-4 text-sm font-bold transition-all relative ${
                        activeTab === 'withdrawals' 
                            ? 'text-slate-900 border-b-2 border-slate-900' 
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    Payout & Withdrawal Requests
                </button>
            </div>

            {/* Quick Filters */}
            {activeTab === 'transactions' ? (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {['all', 'CREDIT', 'DEBIT'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveType(tab); setTxnPage(0); }}
                            className={`px-6 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                                activeType === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                            }`}
                        >
                            {tab === 'all' ? 'All Txns' : tab}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {['PENDING', 'COMPLETED', 'REJECTED', 'all'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveStatus(tab); setWdrPage(0); }}
                            className={`px-6 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                                activeStatus === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                            }`}
                        >
                            {tab === 'all' ? 'All Requests' : tab}
                        </button>
                    ))}
                </div>
            )}

            {/* Data Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                {currentLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                        <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Fetching Records</span>
                    </div>
                )}

                {activeTab === 'transactions' ? (
                    transactions.length > 0 ? (
                        <DataTable columns={txnColumns} data={transactions} />
                    ) : !txnLoading && (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                            <Wallet size={48} className="text-slate-200 mb-4" />
                            <p className="font-bold">No transactions found.</p>
                        </div>
                    )
                ) : (
                    withdrawals.length > 0 ? (
                        <DataTable columns={wdrColumns} data={withdrawals} />
                    ) : !wdrLoading && (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                            <ArrowLeftRight size={48} className="text-slate-200 mb-4" />
                            <p className="font-bold">No withdrawal requests found.</p>
                        </div>
                    )
                )}
            </div>

            {/* Pagination Controls */}
            {currentTotal > PAGE_SIZE && !currentLoading && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm font-bold text-slate-500">
                        Viewing <span className="text-slate-900">{currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, currentTotal)}</span> of <span className="text-slate-900">{currentTotal}</span>
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => activeTab === 'transactions' ? setTxnPage(p => p - 1) : setWdrPage(p => p - 1)}
                            className="bg-white border border-slate-200 px-5 py-2 rounded-full font-bold text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all"
                        >
                            Previous
                        </button>
                        <button
                            disabled={(currentPage + 1) * PAGE_SIZE >= currentTotal}
                            onClick={() => activeTab === 'transactions' ? setTxnPage(p => p + 1) : setWdrPage(p => p + 1)}
                            className="bg-white border border-slate-200 px-5 py-2 rounded-full font-bold text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Drawers */}
            <TransactionDetailDrawer
                isOpen={txnDrawerOpen}
                onClose={() => setTxnDrawerOpen(false)}
                transaction={selectedTxn}
                onStatusChange={handleStatusChange}
                onDownloadInvoice={handleInvoiceDownload}
                actionLoading={actionLoading}
            />

            <WithdrawalDetailDrawer
                isOpen={wdrDrawerOpen}
                onClose={() => setWdrDrawerOpen(false)}
                withdrawal={selectedWdr}
                onApprove={handleApproveWithdrawal}
                onReject={handleRejectWithdrawal}
                actionLoading={actionLoading}
            />

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

export default FinancePage;
