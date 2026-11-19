import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
    Clock,
    Info,
    Bell
} from "lucide-react";
import PerformerHeader from '../components/PerformerHeader';

const PerformerTaskAcceptedPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)] pb-20 lg:pl-[240px]">
            <PerformerHeader activePage="home" />

            <main className="mx-auto max-w-[860px] px-4 py-8 sm:px-6">
                <Motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="overflow-hidden rounded-[28px] border border-[#29ADAC]/20 bg-white shadow-[var(--shadow-md)]"
                >
                    {/* Success Header Card */}
                    <div
                        className="relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12"
                        style={{ background: "linear-gradient(135deg, #10605F 0%, #083B3A 100%)" }}
                    >
                        <Motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.15 }}
                            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md"
                        >
                            <Bell size={28} strokeWidth={1.9} className="text-[#7EDEDD]" />
                        </Motion.div>
                        <h1 className="text-[22px] sm:text-[24px] font-heading font-medium leading-snug tracking-tight text-white">
                            Task Provider Notified
                        </h1>
                        <p className="mx-auto mt-2 max-w-md text-[14px] sm:text-[15px] font-normal leading-relaxed text-white/85">
                            Your interest has been successfully shared with the client
                        </p>

                        {/* Decorative background elements */}
                        <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#29ADAC]/15 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-12 -right-10 h-48 w-48 rounded-full bg-[#7EDEDD]/15 blur-2xl" />
                    </div>

                    <div className="space-y-9 p-6 sm:p-10">
                        {/* Status List */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#29ADAC]/25 bg-[#EFFBFB] text-[#10605F]">
                                    <Bell size={20} strokeWidth={1.9} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[15px] sm:text-[16px] font-medium text-[var(--color-text)]">
                                        Task Provider Notified
                                    </h3>
                                    <p className="text-[13px] sm:text-[14px] font-normal leading-relaxed text-[var(--color-text-muted)]">
                                        The task provider has been notified that you are interested in this task.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#29ADAC]/20 bg-[#DFF7F6]/60 text-[#1B8887]">
                                    <Clock size={20} strokeWidth={1.9} />
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="text-[15px] sm:text-[16px] font-medium text-[var(--color-text)]">
                                            Waiting for Provider&apos;s Confirmation
                                        </h3>
                                        <span className="inline-flex items-center rounded-full border border-[#29ADAC]/30 bg-[#EFFBFB] px-3 py-1 text-[11px] sm:text-[12px] font-medium text-[#10605F]">
                                            Pending
                                        </span>
                                    </div>
                                    <p className="text-[13px] sm:text-[14px] font-normal leading-relaxed text-[var(--color-text-muted)]">
                                        Please wait for the provider (client) to confirm the task details before final commencement.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate(`/performer/active-task/${id || '1'}`)}
                                className="inline-flex h-11 w-full max-w-[300px] items-center justify-center gap-2 rounded-full bg-[#10605F] px-6 text-[13px] sm:text-[14px] font-medium text-white shadow-sm transition hover:bg-[#083B3A] active:scale-[0.98]"
                            >
                                <Info size={16} strokeWidth={2} />
                                View Task Details (Preview)
                            </button>
                        </div>
                    </div>

                    {/* How it works Box */}
                    <div className="border-t border-[#29ADAC]/15 bg-[#EFFBFB]/60 p-6 sm:p-8">
                        <div className="flex items-start gap-3">
                            <Info size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-[#1B8887]" />
                            <div className="space-y-2.5">
                                <h4 className="text-[14px] sm:text-[15px] font-medium text-[#083B3A]">
                                    How it works
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        "The provider reviews your profile and interest",
                                        "The provider confirms the task and processes payment",
                                        "You receive a notification to begin the work"
                                    ].map((step, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] font-normal text-[#10605F]">
                                            <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#29ADAC]" />
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Motion.div>

                <div className="mt-7 text-center">
                    <button
                        type="button"
                        onClick={() => navigate('/performer/dashboard')}
                        className="text-[13px] sm:text-[14px] font-medium text-[#10605F] transition hover:text-[#083B3A] hover:underline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PerformerTaskAcceptedPage;
