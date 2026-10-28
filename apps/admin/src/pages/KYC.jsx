import React, { useState, useEffect, useCallback } from 'react';
import {
    ShieldCheck, AlertCircle, CheckCircle2, Search, Filter,
    ZoomIn, ZoomOut, RotateCw, XCircle, Eye, Download,
    FileText, User, CheckCircle, ShieldAlert, Loader2, RefreshCw,
    Clock, Image as ImageIcon, History, Phone
} from 'lucide-react';
import DataTable from '../components/common/DataTable.jsx';
import Toast from '../components/common/Toast.jsx';
import { getPendingKyc, getKycSubmission, verifyKycSubmission, getKycStatistics } from '../services/api';

const PerformerVerificationPage = () => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeDoc, setActiveDoc] = useState('id'); // 'id' | 'selfie'
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [toast, setToast] = useState(null);

    // API Data
    const [kycRequests, setKycRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [stats, setStats] = useState(null);
    const PAGE_SIZE = 20;

    const fetchKycRequests = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getPendingKyc({
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            });
            setKycRequests(res.data || []);
            setTotal(res.pagination?.total || 0);
        } catch (error) {
            console.error("Failed to fetch KYC requests:", error);
            setToast({ message: error.message || "Failed to load KYC requests.", type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [page]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await getKycStatistics();
            setStats(res.data || res);
        } catch (error) {
            console.error("Failed to fetch KYC statistics:", error);
        }
    }, []);

    useEffect(() => {
        fetchKycRequests();
    }, [fetchKycRequests]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const rejectionTemplates = [
        "Incomplete or blurry document image",
        "Document has expired",
        "Name/Details mismatch with platform profile",
        "Unsupported document type",
        "Suspicious or tampered document detection",
        "Selfie does not match ID document photo",
    ];

    const openReview = async (row) => {
        setSelectedRequest(row);
        setDetail(null);
        setActiveDoc('id');
        setZoom(1);
        setRotation(0);
        setDetailLoading(true);
        try {
            const res = await getKycSubmission(row.id);
            setDetail(res.data || res);
        } catch (error) {
            console.error("Failed to load submission detail:", error);
            setToast({ message: error.message || 'Failed to load submission details.', type: 'error' });
        } finally {
            setDetailLoading(false);
        }
    };

    const closeReview = () => {
        setSelectedRequest(null);
        setDetail(null);
    };

    // Merge quick row data with the richer detail payload (presigned URLs, rejection history) once loaded
    const active = detail || selectedRequest;
    const tasker = active?.user?.taskers;

    const handleApprove = async () => {
        if (!selectedRequest) return;
        setIsProcessing(true);
        try {
            await verifyKycSubmission(selectedRequest.id, { status: 'VERIFIED' });
            setToast({ message: 'Identity verified successfully.', type: 'success' });
            closeReview();
            fetchKycRequests();
            fetchStats();
        } catch (error) {
            console.error("Verification failed:", error);
            setToast({ message: error.message || 'Failed to verify user.', type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest || !rejectReason) return;
        setIsProcessing(true);
        try {
            await verifyKycSubmission(selectedRequest.id, { status: 'REJECTED', rejectionReason: rejectReason });
            setShowRejectModal(false);
            setRejectReason('');
            closeReview();
            setToast({ message: 'Verification rejected.', type: 'success' });
            fetchKycRequests();
            fetchStats();
        } catch (error) {
            console.error("Rejection failed:", error);
            setToast({ message: error.message || 'Failed to reject verification.', type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    const kycColumns = [
        {
            header: 'USER',
            key: 'user',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                        {(row.user?.profilePicUrl || row.user?.avatar) ? (
                            <img
                                src={row.user.profilePicUrl || row.user.avatar}
                                alt={row.user?.name ? `Avatar for ${row.user.name}` : "Performer avatar"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User size={16} />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight truncate max-w-[150px]" title={row.user?.email}>
                            {row.user?.taskers?.displayName || row.user?.email || 'Unknown User'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{row.user?.role || 'User'}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'DOCUMENT',
            key: 'docType',
            render: (val, row) => (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{val || 'ID Proof'}</span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <ImageIcon size={11} /> ID{row.selfieUrl ? ' + Selfie' : ''}
                    </span>
                </div>
            )
        },
        {
            header: 'SUBMITTED',
            key: 'createdAt',
            render: (val) => <span className="text-xs text-slate-500 font-medium">{new Date(val).toLocaleDateString()}</span>
        },
        {
            header: 'STATUS',
            key: 'status',
            render: (val) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    val === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
                    val === 'REJECTED' ? 'bg-red-50 text-red-600' :
                    val === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                    'bg-slate-100 text-slate-600'
                }`}>
                    {val || 'PENDING'}
                </span>
            )
        },
        {
            header: 'ACTION',
            key: 'id',
            render: (val, row) => (
                <button
                    onClick={() => openReview(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                    <Eye size={14} /> Review
                </button>
            )
        }
    ];

    const statTiles = [
        { label: 'Pending', value: stats?.pending, icon: <Clock size={18} />, color: 'text-orange-600 bg-orange-50' },
        { label: 'Verified', value: stats?.verified, icon: <CheckCircle2 size={18} />, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Rejected', value: stats?.rejected, icon: <ShieldAlert size={18} />, color: 'text-red-600 bg-red-50' },
        { label: 'Verification Rate', value: stats ? `${stats.verificationRate}%` : undefined, icon: <ShieldCheck size={18} />, color: 'text-blue-600 bg-blue-50' },
        { label: 'Avg. Review Time', value: stats ? `${stats.avgProcessingTimeHours}h` : undefined, icon: <History size={18} />, color: 'text-slate-600 bg-slate-100' },
    ];

    const activeDocUrl = activeDoc === 'selfie' ? active?.selfieUrl : active?.idDocumentUrl;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">KYC Verification</h1>
                    <p className="text-slate-500 mt-1 font-medium">Review identity documents to maintain platform trust.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { fetchKycRequests(); fetchStats(); }}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm focus:outline-none"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statTiles.map((tile) => (
                    <div key={tile.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tile.color}`}>
                            {tile.icon}
                        </div>
                        <div>
                            <p className="text-lg font-black text-slate-900 leading-none">{tile.value ?? '—'}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{tile.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Request List (Left Side) */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[500px]">
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                            </div>
                        )}

                        {kycRequests.length > 0 ? (
                            <DataTable columns={kycColumns} data={kycRequests} />
                        ) : !loading && (
                            <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                                <ShieldCheck size={48} className="text-slate-200 mb-4" />
                                <p className="font-bold text-slate-700">No pending KYC requests found!</p>
                                <p className="text-sm">You are all caught up.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {total > PAGE_SIZE && !loading && (
                        <div className="flex items-center justify-between px-2">
                            <p className="text-sm font-bold text-slate-500">
                                Viewing <span className="text-slate-900">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)}</span> of <span className="text-slate-900">{total}</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage(p => p - 1)}
                                    className="bg-white border border-slate-200 px-5 py-2 rounded-full font-bold text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={(page + 1) * PAGE_SIZE >= total}
                                    onClick={() => setPage(p => p + 1)}
                                    className="bg-white border border-slate-200 px-5 py-2 rounded-full font-bold text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Review Panel (Right Side Sticky) */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[700px] xl:sticky xl:top-8">
                    {!selectedRequest ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Select a Request</h3>
                            <p className="text-sm text-slate-400 font-medium mt-2 max-w-[200px]">
                                Choose a submission from the list to begin document verification.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                                        Reviewing
                                    </span>
                                    <button onClick={closeReview} className="text-slate-400 hover:text-slate-700">
                                        <XCircle size={20} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 truncate" title={active?.user?.email}>
                                    {tasker?.displayName || active?.user?.email || 'Unknown User'}
                                </h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    {active?.user?.role || 'User'} &bull; {active?.docType || 'ID'}
                                </p>
                                {tasker?.phoneNumber && (
                                    <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-1.5">
                                        <Phone size={12} /> {tasker.phoneNumber}
                                    </p>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {detailLoading ? (
                                    <div className="flex-1 flex items-center justify-center py-16">
                                        <Loader2 size={28} className="animate-spin text-emerald-600" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-full space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                                    <button
                                                        onClick={() => { setActiveDoc('id'); setZoom(1); setRotation(0); }}
                                                        className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeDoc === 'id' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        ID Document
                                                    </button>
                                                    <button
                                                        onClick={() => { setActiveDoc('selfie'); setZoom(1); setRotation(0); }}
                                                        disabled={!active?.selfieUrl}
                                                        className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 ${activeDoc === 'selfie' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        Selfie
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))} className="h-7 w-7 bg-white border border-slate-200 rounded text-slate-500 flex items-center justify-center hover:bg-slate-50">
                                                        <ZoomIn size={14} />
                                                    </button>
                                                    <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="h-7 w-7 bg-white border border-slate-200 rounded text-slate-500 flex items-center justify-center hover:bg-slate-50">
                                                        <ZoomOut size={14} />
                                                    </button>
                                                    <button onClick={() => setRotation(prev => (prev + 90) % 360)} className="h-7 w-7 bg-white border border-slate-200 rounded text-slate-500 flex items-center justify-center hover:bg-slate-50">
                                                        <RotateCw size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="w-full h-80 bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner">
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center transition-transform duration-300 pointer-events-none p-4"
                                                    style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                                                >
                                                    {activeDocUrl ? (
                                                        <img
                                                            src={activeDocUrl}
                                                            alt={activeDoc === 'selfie' ? 'KYC Selfie' : 'KYC Document'}
                                                            className="max-w-full max-h-full object-contain drop-shadow-xl rounded"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center text-slate-600 opacity-50">
                                                            <FileText size={48} className="mb-2" />
                                                            <span className="text-xs font-bold uppercase">No Image Available</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {activeDocUrl && (
                                                <div className="flex items-center justify-center gap-4">
                                                    <a href={activeDocUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline">
                                                        <Eye size={13} /> Open Original
                                                    </a>
                                                    <a href={activeDocUrl} download target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:underline">
                                                        <Download size={13} /> Download
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {detail?.previousRejections?.length > 0 && (
                                            <div className="w-full space-y-2 pt-2 border-t border-slate-100">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <History size={13} /> Previous Rejections ({detail.previousRejections.length})
                                                </h4>
                                                {detail.previousRejections.map((rej) => (
                                                    <div key={rej.id} className="bg-red-50/60 border border-red-100 rounded-xl p-3">
                                                        <p className="text-[11px] font-bold text-red-600">{new Date(rej.createdAt).toLocaleDateString()}</p>
                                                        <p className="text-xs text-slate-600 mt-1">{rej.rejectionReason || 'No reason recorded'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={isProcessing || detailLoading}
                                    className="flex-1 py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isProcessing || detailLoading}
                                    className="flex-[2] bg-emerald-600 text-white font-black uppercase tracking-widest text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <>Approve Submission</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showRejectModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900">Provide Rejection Reason</h3>
                            <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                {rejectionTemplates.map((template, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setRejectReason(template)}
                                        className={`w-full text-left p-3.5 rounded-xl text-sm font-bold transition-all ${
                                            rejectReason === template
                                                ? 'bg-red-50 text-red-700 ring-2 ring-red-500'
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                                        }`}
                                    >
                                        {template}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                placeholder="Or type a custom rejection reason..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={3}
                            />

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectReason || isProcessing}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Rejection'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default PerformerVerificationPage;
