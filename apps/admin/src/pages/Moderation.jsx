import React, { useState, useEffect, useCallback } from 'react';
import {
    Flag, MessageSquare, Shield, Trash2, CheckCircle,
    XCircle, Search, Filter, AlertCircle, Info, Loader2, RefreshCw, Star
} from 'lucide-react';
import DataTable from '../components/common/DataTable.jsx';
import Toast from '../components/common/Toast.jsx';
import { listReviewsAdmin, deleteReviewAdmin } from '../services/api';

const ModerationPage = () => {
    const [activeTab, setActiveTab] = useState('reviews');
    const [toast, setToast] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // API State
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');
    const PAGE_SIZE = 20;

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listReviewsAdmin({
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            });
            setReviews(res.data || []);
            setTotal(res.pagination?.total || 0);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            setToast({ message: error.message || 'Failed to load reviews', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        if (activeTab === 'reviews') {
            fetchReviews();
        }
    }, [fetchReviews, activeTab]);

    const handleDeleteReview = async () => {
        if (!selectedReview || !deleteReason) return;
        setIsProcessing(true);
        try {
            await deleteReviewAdmin(selectedReview.id, { reason: deleteReason });
            setToast({ message: 'Review successfully deleted from the platform.', type: 'success' });
            setShowDeleteModal(false);
            setDeleteReason('');
            setSelectedReview(null);
            fetchReviews();
        } catch (error) {
            setToast({ message: error.message || 'Failed to delete review.', type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmDelete = (review) => {
        setSelectedReview(review);
        setShowDeleteModal(true);
    };

    const reviewColumns = [
        {
            header: 'REVIEWER & TARGET',
            key: 'user',
            render: (_, row) => (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                        {row.reviewer?.email || 'Unknown Reviewer'}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        To: <span className="text-slate-600">{row.targetTasker?.user?.email || 'System'}</span>
                    </p>
                    {row.task?.title && (
                        <p className="text-[10px] text-emerald-600 font-medium truncate max-w-[200px]">
                            Task: {row.task.title}
                        </p>
                    )}
                </div>
            )
        },
        {
            header: 'RATING',
            key: 'rating',
            render: (val) => (
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded w-fit">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-black">{val}/5</span>
                </div>
            )
        },
        {
            header: 'COMMENT',
            key: 'comment',
            render: (val) => (
                <p className="text-sm text-slate-800 max-w-[300px] truncate italic font-medium">"{val || 'No written feedback'}"</p>
            )
        },
        {
            header: 'DATE',
            key: 'createdAt',
            render: (val) => (
                <span className="text-xs text-slate-500 font-medium">
                    {new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
            )
        },
        {
            header: 'ACTIONS',
            key: 'id',
            render: (_, row) => (
                <button
                    onClick={() => confirmDelete(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors font-bold text-xs"
                    title="Delete Review"
                >
                    <Trash2 size={14} /> Remove
                </button>
            )
        }
    ];

    return (
        <div className="space-y-8 p-8 animate-in fade-in duration-700 h-[calc(100vh-4rem)] overflow-y-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Moderation</h1>
                    <p className="text-slate-500 mt-1 font-medium">Monitor user interactions and enforce platform safety policies.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                    <button
                        onClick={() => { setActiveTab('reviews'); setPage(0); }}
                        className={`px-5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                            activeTab === 'reviews' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Flag size={16} /> Platform Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('chats')}
                        className={`px-5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                            activeTab === 'chats' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <MessageSquare size={16} /> User Chats
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[500px]">
                
                {/* Header Actions */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-slate-900">
                            {activeTab === 'reviews' ? 'Review Moderation Queue' : 'Chat Monitor (coming soon)'}
                        </h2>
                        {activeTab === 'reviews' && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg uppercase tracking-widest">
                                {total} Total
                            </span>
                        )}
                    </div>
                    
                    {activeTab === 'reviews' && (
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search content..."
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64 shadow-sm"
                                />
                            </div>
                            <button onClick={fetchReviews} className="p-2 border border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 transition-all shadow-sm">
                                <RefreshCw size={18} className={loading ? 'animate-spin text-emerald-600' : ''} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Logic */}
                {activeTab === 'reviews' ? (
                    <>
                        {loading && (
                            <div className="absolute inset-x-0 bottom-0 top-[88px] bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                            </div>
                        )}
                        
                        {reviews.length > 0 ? (
                            <DataTable columns={reviewColumns} data={reviews} />
                        ) : !loading && (
                            <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                                <Shield size={48} className="text-slate-200 mb-4" />
                                <p className="font-bold">No reviews found in the system.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {total > PAGE_SIZE && !loading && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
                                <p className="text-sm font-bold text-slate-500">
                                    Viewing <span className="text-slate-900">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)}</span> of <span className="text-slate-900">{total}</span>
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                        className="bg-white border border-slate-200 px-5 py-2 rounded-full font-bold text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={(page + 1) * PAGE_SIZE >= total}
                                        onClick={() => setPage(p => p + 1)}
                                        className="bg-white border border-slate-200 px-5 py-2 rounded-full font-bold text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <MessageSquare size={48} className="text-indigo-200 mb-4" />
                        <h3 className="text-xl font-black text-slate-900 mb-2">Live Chat Moderation API Pending</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-md">
                            The backend infrastructure for real-time 1-on-1 chat log extraction is currently in development. Please check back later when your backend team completes the chat endpoints!
                        </p>
                    </div>
                )}
            </div>

            {/* System Info */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex items-start gap-4">
                <div className="h-12 w-12 flex-shrink-0 bg-white rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Info size={24} />
                </div>
                <div>
                    <h4 className="text-base font-black text-indigo-900">Note on Review Moderation</h4>
                    <p className="text-sm font-medium text-indigo-700/80 mt-1 max-w-3xl leading-relaxed">
                        Currently, the platform allows you to delete reviews that violate terms of service. When a review is deleted, the impacted Tasker's average rating profile is automatically recalculated by the backend Prisma trigger. Ensure you provide clear justification in your logs when removing user content.
                    </p>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900 text-red-600 flex items-center gap-2">
                                <AlertCircle size={24} /> Delete Review
                            </h3>
                            <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-medium text-slate-500">
                                You are about to permanently delete a review by <span className="font-bold text-slate-900">{selectedReview?.reviewer?.email}</span>. This action cannot be undone and will recalculate the provider's overall rating score.
                            </p>

                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl italic text-sm text-slate-600">
                                "{selectedReview?.comment}"
                            </div>

                            <textarea
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-sm"
                                placeholder="Mandatory moderation reason (e.g., Harassment, Fake Review)..."
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                rows={3}
                            />

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all bg-white shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteReview}
                                    disabled={!deleteReason || isProcessing}
                                    className="flex-[2] py-3 bg-red-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Deletion'}
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

export default ModerationPage;
