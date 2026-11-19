import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProviderHeader from '../components/ProviderHeader';
import {
    Monitor,
    Check,
    MessageSquare,
    TrendingUp,
    Star,
    AlertCircle,
} from 'lucide-react';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};
    const taskData = state.taskData || null;
    const performer = state.performer || null;
    const paymentAmount = state.paymentAmount ?? state.totalAmount ?? null;
    const taskId = taskData?.id || taskData?._id || null;
    const hasVerifiedPayment = Boolean(taskId && (paymentAmount !== null || state.paymentId));

    const formattedAmount = paymentAmount !== null
        ? Number(paymentAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })
        : null;

    if (!hasVerifiedPayment) {
        return (
            <div className="min-h-screen pt-[80px] bg-[#F5FAFA] font-sans text-[#172B2B]">
                <ProviderHeader activePage="my-tasks" />
                <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
                    <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFFBFB] text-[#10605F]">
                            <AlertCircle size={28} />
                        </div>
                        <h1 className="dash-page-title text-[#172B2B] mb-2">No Active Payment Confirmation</h1>
                        <p className="text-sm font-medium text-[#647575] mb-8">
                            This page displays confirmation details right after a verified task payment. View your tasks to check assignment and payment status.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                type="button"
                                onClick={() => navigate('/provider/my-tasks')}
                                className="px-6 py-3 rounded-full bg-[#10605F] text-white text-sm font-semibold hover:bg-[#083B3A] transition"
                            >
                                Go to My Tasks
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/provider/dashboard')}
                                className="px-6 py-3 rounded-full border border-[#e2e8f0] bg-white text-sm font-semibold text-[#172B2B] hover:bg-slate-50 transition"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const performerName = performer?.person || performer?.displayName || 'Assigned Performer';
    const performerRole = performer?.name || performer?.profession || 'Task Performer';
    const performerRating = performer?.rating || performer?.ratingAvg || null;
    const rawDeadline = taskData?.dueAt || taskData?.deadline || taskData?.expectedCompletionDate;
    const formattedDeadline = rawDeadline && !Number.isNaN(new Date(rawDeadline).getTime())
        ? new Date(rawDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : (rawDeadline || 'No deadline');

    return (
        <div className="min-h-screen pt-[80px] bg-[#F5FAFA] font-sans text-[#172B2B]">
            <ProviderHeader activePage="my-tasks" />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                {/* Success Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 bg-[#10605F] rounded-full flex items-center justify-center text-white mb-5 shadow-md">
                        <Check size={32} strokeWidth={3} />
                    </div>
                    <h1 className="dash-page-title text-[#172B2B] mb-2">Payment Successful</h1>
                    {formattedAmount !== null && (
                        <p className="text-[#10605F] font-bold text-[17px]">₹{formattedAmount} Paid successfully</p>
                    )}
                    <p className="mt-1 text-xs font-mono font-semibold text-[#647575]">Task #{String(taskId).toUpperCase()}</p>
                </div>

                {/* Content Stack */}
                <div className="flex flex-col gap-6">
                    {/* Task Brief Card */}
                    <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-sm flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h3 className="text-[19px] font-medium text-[#172B2B] mb-1 truncate">{taskData?.title || 'Assigned Task'}</h3>
                            <p className="text-[14px] font-medium text-[#647575] mb-3">{taskData?.category || 'Task'} • Assigned</p>
                            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#647575]">
                                <span>Deadline:</span>
                                <span className="text-[#172B2B]">{formattedDeadline}</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 shrink-0 bg-[#EFFBFB] rounded-2xl flex items-center justify-center text-[#10605F]">
                            <Monitor size={28} />
                        </div>
                    </div>

                    {/* What Happens Next Card */}
                    <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-sm">
                        <h4 className="text-[16px] font-medium text-[#172B2B] mb-6">Here&apos;s what happens next:</h4>
                        <div className="space-y-4">
                            {[
                                "Payment securely held in escrow",
                                "Performer has been notified",
                                "Work will start shortly",
                                "Amount will be released after your approval"
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 bg-[#10605F] rounded-full flex items-center justify-center text-white flex-shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-[15px] font-medium text-[#172B2B]">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performer Status Card */}
                    <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#e2e8f0] bg-slate-100 flex items-center justify-center shrink-0">
                                    {performer?.avatar ? (
                                        <img src={performer.avatar} alt={performerName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg font-semibold text-[#647575]">{performerName.charAt(0)}</span>
                                    )}
                                </div>
                                <div>
                                    <h5 className="text-[17px] font-medium text-[#172B2B]">{performerName}</h5>
                                    <p className="text-[14px] font-semibold text-[#10605F]">{performerRole}</p>
                                </div>
                            </div>
                            {performerRating && (
                                <div className="flex items-center gap-1.5">
                                    <Star size={14} className="text-amber-400 fill-current" />
                                    <span className="text-[14px] font-bold text-[#172B2B]">{performerRating}/5</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/provider/chats')}
                                className="flex items-center justify-center gap-2 border border-[#10605F] text-[#10605F] py-3.5 rounded-full text-[15px] font-semibold hover:bg-[#EFFBFB] transition-all"
                            >
                                <MessageSquare size={18} /> Chat With Performer
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/provider/active-task/${taskId}`)}
                                className="flex items-center justify-center gap-2 bg-[#10605F] text-white py-3.5 rounded-full text-[15px] font-semibold hover:bg-[#083B3A] transition-all shadow-md"
                            >
                                <TrendingUp size={18} /> Track Task Progress
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentSuccessPage;
