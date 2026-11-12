import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, Clock, Loader2, Mail } from 'lucide-react';
import PerformerHeader from '../components/PerformerHeader';
import { getMyInvitations } from '../services/api';

const STATUS_STYLES = {
    PENDING: { label: 'Pending', bg: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200/70' },
    ACCEPTED: { label: 'Accepted', bg: 'bg-[#EFFBFB] text-[#083B3A] ring-1 ring-[#29ADAC]/30' },
    DECLINED: { label: 'Declined', bg: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200/70' },
};

const PerformerInvitationsPage = () => {
    const navigate = useNavigate();
    const [invitations, setInvitations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                const res = await getMyInvitations({ page: 1, limit: 50 });
                const data = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
                setInvitations(data);
            } catch (err) {
                console.error('Failed to load invitations:', err);
                setError('Unable to load invitations right now.');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg)] pb-12 pt-[80px] font-sans text-[var(--color-text)] lg:pl-[220px]">
            <PerformerHeader activePage="invitations" />
            <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-6">
                    <h1 className="text-2xl font-medium text-[var(--color-text)]">Invitations</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Tasks providers have personally invited you to work on.</p>
                </header>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 py-16 text-center">
                        <AlertCircle className="mb-3 h-10 w-10 text-rose-500" strokeWidth={1.7} />
                        <p className="text-sm font-semibold text-rose-800">{error}</p>
                    </div>
                ) : invitations.length === 0 ? (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-20 text-center"
                    >
                        <Mail className="mb-3 h-10 w-10 text-[var(--color-text-subtle)]" strokeWidth={1.5} />
                        <p className="text-sm font-semibold text-[var(--color-text-muted)]">No invitations yet</p>
                        <p className="mt-1 text-xs text-[var(--color-text-subtle)]">When a provider invites you to a task, it will appear here.</p>
                    </Motion.div>
                ) : (
                    <AnimatePresence>
                        <div className="flex flex-col gap-3">
                            {invitations.map((inv, i) => {
                                const task = inv.task || inv;
                                const status = String(inv.status || 'PENDING').toUpperCase();
                                const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
                                const isPending = status === 'PENDING';
                                const price = Number(task.priceAmount || 0);

                                return (
                                    <Motion.article
                                        key={inv.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.2 }}
                                        className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h2 className="truncate text-base font-medium text-[var(--color-text)]">
                                                    {task.title || 'Untitled Task'}
                                                </h2>
                                                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                                                    {task.category || 'General'} · {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Negotiable'}
                                                </p>
                                            </div>
                                            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyle.bg}`}>
                                                {statusStyle.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]">
                                                <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                                                {inv.createdAt
                                                    ? new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : 'Recently'}
                                            </div>
                                            {isPending && (
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/performer/task/${task.id}`)}
                                                    className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-primary)] transition hover:gap-1.5"
                                                >
                                                    View Invitation
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </Motion.article>
                                );
                            })}
                        </div>
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
};

export default PerformerInvitationsPage;
