import React, { useState } from 'react';
import {
    ClipboardCheck,
    AlertCircle,
    CheckCircle2,
    Search,
    Filter,
    ZoomIn,
    ZoomOut,
    RotateCw,
    XCircle,
    Eye,
    Download,
    Layout,
    User,
    Clock,
    IndianRupee,
    ExternalLink
} from 'lucide-react';
import DataTable from '../components/common/DataTable.jsx';
import Toast from '../components/common/Toast.jsx';
import {
    getPendingVerificationsAdmin,
    getVerificationDetailAdmin,
    approveVerificationAdmin,
    rejectVerificationAdmin,
    getVerificationStatisticsAdmin
} from '../services/api';


const WorkVerificationPage = () => {
    const formatDate = (iso) =>
        iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

    const [verifications, setVerifications] = useState([]);
    const [stats, setStats] = useState({ pendingVerification: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [toast, setToast] = useState(null);

    const rejectionTemplates = [
        "Incomplete or poor quality proof for task",
        "Submission does not match task requirements",
        "Identified as duplicate or bot-generated work",
        "Invalid submission format",
        "Violation of task performance guidelines"
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [verRes, statsRes] = await Promise.all([
                getPendingVerificationsAdmin({ limit: 50 }),
                getVerificationStatisticsAdmin()
            ]);
            setVerifications(verRes.data || []);
            setStats(statsRes || { pendingVerification: 0, approved: 0, rejected: 0 });
        } catch (error) {
            setToast({ message: 'Failed to fetch verification queue.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleSelect = async (row) => {
        setLoading(true);
        try {
            const detail = await getVerificationDetailAdmin(row.id);
            setSelectedRequest(detail);
        } catch (error) {
            setToast({ message: 'Error loading details.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;
        setIsProcessing(true);
        try {
            await approveVerificationAdmin(selectedRequest.id);
            setToast({ message: 'Work approved successfully.', type: 'success' });
            setSelectedRequest(null);
            fetchData();
        } catch (error) {
            setToast({ message: 'Approval failed.', type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest || !rejectReason) return;
        setIsProcessing(true);
        try {
            await rejectVerificationAdmin(selectedRequest.id, {
                status: 'SUBMITTED', // Re-verify status requirements for rejection in backend
                notes: rejectReason
            });
            setToast({ message: 'Work rejected and returned to performer.', type: 'success' });
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedRequest(null);
            fetchData();
        } catch (error) {
            setToast({ message: 'Rejection failed.', type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    const taskColumns = [
        {
            header: 'Performer',
            key: 'tasker',
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                        {val?.user?.avatar ? <img src={val.user.avatar} className="w-full h-full object-cover" /> : <User size={16} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">{val?.user?.email?.split('@')[0] || 'Unknown User'}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{val?.user?.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Task Title',
            key: 'task',
            render: (val) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{val?.title}</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{val?.category}</span>
                </div>
            )
        },
        {
            header: 'Submitted',
            key: 'submittedAt',
            render: (val) => <span className="text-sm text-slate-400 font-medium">{formatDate(val)}</span>
        },
        {
            header: 'Reward',
            key: 'task',
            render: (val) => (
                <div className="flex items-center gap-1 font-black text-slate-900">
                    <IndianRupee size={12} className="text-emerald-500" />
                    <span>{val?.priceAmount}</span>
                </div>
            )
        },
        {
            header: 'Action',
            key: 'id',
            render: (val, row) => (
                <button
                    onClick={() => handleSelect(row)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <Eye size={14} />
                    Verify
                </button>
            )
        }
    ];


    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Work Verification</h1>
                    <p className="text-slate-500 mt-1 font-medium">Validate task performance and proof-of-work submissions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Queue Status</span>
                        <span className="text-sm font-black text-emerald-600">{stats.pendingVerification} Pending</span>
                    </div>

                    <div className="h-10 w-[1px] bg-slate-200" />
                    <button className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Task List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-xl w-fit">
                        <button className="px-6 py-2 bg-white text-slate-900 shadow-sm rounded-lg text-sm font-bold">
                            Active Tasks (42)
                        </button>
                        <button className="px-6 py-2 text-slate-500 hover:text-slate-700 rounded-lg text-sm font-bold transition-all">
                            Audit Trail
                        </button>
                    </div>
                    <DataTable
                        columns={taskColumns}
                        data={verifications}
                        loading={loading}
                    />

                </div>

                {/* Review Panel */}
                <div className="card p-0 overflow-hidden flex flex-col h-full sticky top-24">
                    {!selectedRequest ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                <ClipboardCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Select Work Proof</h3>
                                <p className="text-sm text-slate-400 font-medium">Choose a submission from the list to begin verification.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">Performance Proof</span>
                                    <button
                                        onClick={() => setSelectedRequest(null)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedRequest.tasker?.user?.email.split('@')[0]}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm text-slate-500 font-medium">#{selectedRequest.id.split('-')[0]} &bull; {selectedRequest.task?.title}</p>
                                </div>
                            </div>


                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {/* Proof Preview */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Submitted Proof</h4>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                                                className="h-7 w-7 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:bg-slate-50"
                                            >
                                                <ZoomIn size={14} />
                                            </button>
                                            <button
                                                onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                                                className="h-7 w-7 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:bg-slate-50"
                                            >
                                                <ZoomOut size={14} />
                                            </button>
                                            <button
                                                onClick={() => setRotation(prev => (prev + 90) % 360)}
                                                className="h-7 w-7 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:bg-slate-50"
                                            >
                                                <RotateCw size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden relative group shadow-inner">
                                        <div
                                            className="absolute inset-0 flex items-center justify-center p-4 transition-transform duration-300"
                                            style={{
                                                transform: `scale(${zoom}) rotate(${rotation}deg)`
                                            }}
                                        >
                                            {selectedRequest.task?.files?.length > 0 ? (
                                                <img 
                                                    src={selectedRequest.task.files[0].url} 
                                                    className="max-w-full max-h-full object-contain shadow-2xl" 
                                                    alt="Proof"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-800 rounded shadow-inner flex flex-col items-center justify-center text-slate-600 gap-2 border-2 border-dashed border-slate-700">
                                                    <Layout size={48} />
                                                    <span className="text-xs font-bold uppercase tracking-tighter">No Visual Proof Attached</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                            <a 
                                                href={/^https?:\/\//i.test(selectedRequest.task?.files?.[0]?.url) ? selectedRequest.task.files[0].url : '#'}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded text-[10px] font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                                            >
                                                <ExternalLink size={12} /> View Full Detail
                                            </a>
                                        </div>
                                    </div>

                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        Submission Details
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 lowercase">Task Rewards</p>
                                            <p className="text-sm font-black text-slate-900">{selectedRequest.task?.priceAmount} {selectedRequest.task?.priceCurrency}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 lowercase">Provider</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedRequest.task?.provider?.email}</p>
                                        </div>
                                        {selectedRequest.updates?.length > 0 && (
                                            <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 lowercase">Performer Notes</p>
                                                <p className="text-xs text-slate-600 italic mt-1">"{selectedRequest.updates[0].notes || 'No notes provided'}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                            <div className="p-6 bg-white border-t border-slate-100 space-y-3 mt-auto">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={isProcessing}
                                        className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <XCircle size={18} /> Reject Work
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        disabled={isProcessing}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
                                    >
                                        {isProcessing ? (
                                            <RotateCw size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle2 size={18} /> Approve & Release
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Work Rejection</h3>
                            <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Why are you rejecting <span className="text-slate-900 font-bold">{selectedRequest?.name}'s</span> work submission?
                            </p>

                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {rejectionTemplates.map((template, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setRejectReason(template)}
                                        className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${rejectReason === template
                                            ? 'border-red-500 bg-red-50 text-red-700 font-bold'
                                            : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                                            }`}
                                    >
                                        {template}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg h-24 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                placeholder="Details regarding rejection..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectReason || isProcessing}
                                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <RotateCw size={18} className="animate-spin" /> : 'Confirm Rejection'}
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

export default WorkVerificationPage;
