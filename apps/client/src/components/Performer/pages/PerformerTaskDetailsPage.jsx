import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Bookmark,
    Star,
    CheckCircle2,
    FileText,
    MapPin,
    Clock,
    CalendarDays,
    IndianRupee,
    ArrowRight,
    ShieldCheck,
    BadgeCheck,
    X,
} from 'lucide-react';
import PerformerHeader from '../components/PerformerHeader';
import { getTaskDetails, expressInterest, getProviderProfile, getMyInterests, saveTask, unsaveTask, acceptInvitation } from '../services/api';
import { resolveProviderProfileId, resolveClientDisplayName } from '../utils/performerClientUtils';

const DESCRIPTION_PREVIEW_LEN = 160;

const INTEREST_ALREADY_SENT_RE = /already expressed interest|already applied|duplicate/i;
const KYC_REQUIRED_RE = /kyc|verification/i;

function InterestStatusModal({ state, taskTitle, onClose, onPrimary, onSecondary }) {
    if (!state) return null;

    const config = {
        success: {
            tone: 'success',
            title: 'Your interest has been sent!',
            body: "Your profile and proposal have been shared with the provider. They'll review your application and get back to you shortly.",
            primary: 'Track Application',
            secondary: 'Browse More Tasks',
        },
        duplicate: {
            tone: 'success',
            title: 'Interest already sent',
            body: 'You have already expressed interest in this task. You can track it from your applications.',
            primary: 'Track Application',
            secondary: 'Browse More Tasks',
        },
        kyc: {
            tone: 'warning',
            title: 'Complete Verification to Send Interest',
            body: 'Identity verification is required before you can send interest to providers.',
            primary: 'Start Verification',
            secondary: 'Maybe Later',
        },
        error: {
            tone: 'error',
            title: 'Could not send interest',
            body: state.message || 'Something went wrong while sending your interest. Please try again.',
            primary: 'Try Again',
            secondary: 'Close',
        },
    }[state.type];

    const isSuccess = config.tone === 'success';
    const isWarning = config.tone === 'warning';

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-xl rounded-[24px] bg-white p-6 text-center shadow-[0_28px_90px_rgba(15,23,42,0.34)] sm:p-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                    aria-label="Close"
                >
                    <X size={20} strokeWidth={2.4} />
                </button>
                <div
                    className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 ${
                        isSuccess
                            ? 'border-emerald-100 bg-emerald-50 text-[var(--color-primary)]'
                            : isWarning
                                ? 'border-amber-100 bg-amber-50 text-amber-600'
                                : 'border-rose-100 bg-rose-50 text-rose-600'
                    }`}
                >
                    {isSuccess ? <CheckCircle2 size={42} strokeWidth={2.2} /> : <AlertCircle size={40} strokeWidth={2.2} />}
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">{config.title}</h2>
                <p className="mx-auto mt-3 max-w-md text-[15px] font-medium leading-7 text-slate-500">{config.body}</p>
                {taskTitle ? (
                    <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-primary)]">
                            <FileText size={20} strokeWidth={2.2} />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">{taskTitle}</p>
                            <p className="text-xs font-semibold text-slate-400">OnIT India task</p>
                        </div>
                    </div>
                ) : null}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onPrimary}
                        className="flex h-12 items-center justify-center rounded-full bg-[var(--color-primary)] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,153,102,0.24)] transition hover:bg-[var(--color-primary-hover)]"
                    >
                        {config.primary}
                    </button>
                    <button
                        type="button"
                        onClick={onSecondary}
                        className="flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        {config.secondary}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <h2 className="mb-3 text-[15px] font-bold tracking-tight text-[var(--color-text)]">
            {children}
        </h2>
    );
}

function FileRow({ name, size, type, url }) {
    const isPdf = type === 'pdf';
    return (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3">
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    isPdf ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-600'
                }`}
            >
                <FileText size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-[var(--color-text)]">{name}</p>
                <p className="text-[11px] font-semibold text-[var(--color-text-muted)]">{size}</p>
            </div>
            {url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-[12px] font-bold text-[var(--color-primary)] hover:underline"
                >
                    View
                </a>
            ) : null}
        </div>
    );
}

function SummaryMetric({ icon, label, value, highlight = false }) {
    return (
        <div
            className={`flex min-w-0 items-center gap-3 rounded-2xl px-4 py-4 ${
                highlight
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface)]'
            }`}
        >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${highlight ? 'bg-white/15' : 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'}`}>
                {icon}
            </span>
            <span className="min-w-0">
                <span className={`block text-[11px] font-semibold ${highlight ? 'text-white/75' : 'text-[var(--color-text-muted)]'}`}>{label}</span>
                <span className={`mt-0.5 block truncate text-[17px] font-extrabold tabular-nums ${highlight ? 'text-white' : 'text-[var(--color-text)]'}`}>{value}</span>
            </span>
        </div>
    );
}

function StatRow({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5 text-[13px]">
            <span className="font-medium text-[var(--color-text-muted)]">{label}</span>
            <span className="font-bold text-[var(--color-text)]">{value}</span>
        </div>
    );
}

function TaskDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-[var(--color-bg)] pb-12 pt-[80px] lg:pl-[220px]">
            <PerformerHeader activePage="home" />
            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 h-5 w-28 animate-pulse rounded bg-[var(--color-border-subtle)]" />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
                            <div className="h-6 w-32 animate-pulse rounded bg-[var(--color-border-subtle)]" />
                            <div className="mt-5 h-10 w-3/4 animate-pulse rounded bg-[var(--color-border-subtle)]" />
                            <div className="mt-4 h-5 w-52 animate-pulse rounded bg-[var(--color-border-subtle)]" />
                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <div className="h-[72px] animate-pulse rounded-2xl bg-[var(--color-primary-subtle)]" />
                                <div className="h-[72px] animate-pulse rounded-2xl bg-[var(--color-border-subtle)]" />
                            </div>
                        </div>
                        <div className="h-64 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]" />
                    </div>
                    <div className="h-80 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]" />
                </div>
            </main>
        </div>
    );
}

const PerformerTaskDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState(false);
    const [providerProfile, setProviderProfile] = useState(null);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const [payoutAccepted, setPayoutAccepted] = useState(false);
    const [savedLocally, setSavedLocally] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [interestState, setInterestState] = useState(null);
    const [knownInterest, setKnownInterest] = useState(null);
    const [invitationAccepted, setInvitationAccepted] = useState(false);

    useEffect(() => {
        const fetchTaskDetails = async () => {
            if (!id || id === ':id') {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const res = await getTaskDetails(id);
                const taskObj = res && res.data ? res.data : res;
                if (taskObj) {
                    setTask(taskObj);
                    setSavedLocally(!!taskObj.isSaved);
                    try {
                        const interestsRes = await getMyInterests({ page: 1, limit: 100 });
                        const interestsPayload = interestsRes?.data || interestsRes || {};
                        const rows = interestsPayload.data || interestsPayload.interests || (Array.isArray(interestsPayload) ? interestsPayload : []);
                        const match = rows.find((row) => String(row.taskId || row.task?.id || row.task?._id) === String(taskObj.id || id));
                        if (match) setKnownInterest(match);
                    } catch (interestErr) {
                        console.warn('Failed to fetch existing performer interests:', interestErr);
                    }
                    const providerProfileId = resolveProviderProfileId(taskObj);
                    if (providerProfileId) {
                        try {
                            const providerRes = await getProviderProfile(providerProfileId);
                            const pProfile = providerRes && providerRes.data ? providerRes.data : providerRes;
                            if (pProfile) setProviderProfile(pProfile);
                        } catch (pErr) {
                            console.error('Failed to fetch provider profile details:', pErr);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch task details:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTaskDetails();
    }, [id]);

    const viewModel = useMemo(() => {
        if (!task) return null;

        const assignment = task.taskAssignment || (Array.isArray(task.taskAssignments) ? task.taskAssignments[0] : task.taskAssignments);
        const assignmentStatus = assignment?.status?.toUpperCase() || task.status?.toUpperCase();
        const isAssigned = ['ACCEPTED', 'IN_PROGRESS', 'ASSIGNED', 'ACTIVE', 'COMPLETED', 'SUBMITTED'].includes(assignmentStatus);
        const hasInterestSent = !!(assignment || task.isInterested || knownInterest);
        const isInvited = !isAssigned && !hasInterestSent && !!(task.pendingInvitation);
        const invitationId = task.pendingInvitation?.id ?? null;
        const isWaitingConfirmation = hasInterestSent && !isAssigned;

        const targetClientId = task.provider?.provider?.id || providerProfile?.id || task.providerId || task.provider?.id;
        const ratingCount = Number(providerProfile?.user?.ratingCount || task.provider?.ratingCount || 0);
        const rawRatingAvg = providerProfile?.user?.ratingAvg ?? task.provider?.ratingAvg;
        const ratingAvg = rawRatingAvg == null ? null : Number(rawRatingAvg);
        const tasksPostedCount = providerProfile?.tasksPostedCount
            ?? providerProfile?._count?.tasks
            ?? task.provider?.tasksPostedCount
            ?? task.provider?._count?.tasks
            ?? null;

        const grossAmount = Number(task.priceAmount || 0);

        const description = task.description || 'No description provided.';
        const needsReadMore = description.length > DESCRIPTION_PREVIEW_LEN;
        const skills = task.skills?.length > 0 ? task.skills : [];
        const taskDetails = task.details && typeof task.details === 'object' ? task.details : {};
        const deliverableSource = task.deliverables
            || taskDetails.deliverables
            || taskDetails.scopeDeliverables
            || [];
        const deliverables = (Array.isArray(deliverableSource)
            ? deliverableSource
            : typeof deliverableSource === 'string'
                ? deliverableSource.split(/\n|•|;/)
                : [])
            .map((item) => typeof item === 'object' ? item?.title || item?.name : item)
            .map((item) => String(item || '').trim())
            .filter(Boolean);

        const apiFiles = Array.isArray(task.files) ? task.files : [];

        const clientName = resolveClientDisplayName(task, providerProfile);
        const clientAvatar = [
            providerProfile?.user?.profilePicUrl,
            providerProfile?.profilePicUrl,
            providerProfile?.avatarUrl,
            providerProfile?.avatar,
            task.provider?.user?.profilePicUrl,
            task.provider?.profilePicUrl,
            task.provider?.provider?.user?.profilePicUrl,
            task.provider?.provider?.profilePicUrl,
        ].find((value) => typeof value === 'string' && value.trim());

        const postedAt = task.createdAt
            ? new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'Recently';

        const memberSince = providerProfile?.user?.createdAt
            ? new Date(providerProfile.user.createdAt).getFullYear()
            : 'Not available';

        const projectDuration = task.dueAt
            ? `Until ${new Date(task.dueAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
            : task.duration || 'Flexible';

        return {
            title: task.title || 'Untitled Task',
            category: task.category || 'General',
            tierLabel: String(task.priority || '').toUpperCase() === 'HIGH' ? 'Tier 1+' : 'Standard',
            location: task.location || 'Remote',
            postedAt,
            description,
            needsReadMore,
            skills,
            deliverables,
            apiFiles,
            grossAmount,
            isAssigned,
            hasInterestSent,
            isWaitingConfirmation,
            isInvited,
            invitationId,
            targetClientId,
            projectDuration,
            client: {
                name: clientName,
                initials: clientName.substring(0, 2).toUpperCase(),
                avatar: clientAvatar || null,
                verified: Boolean(
                    providerProfile?.isVerified
                    || providerProfile?.verificationStatus === 'VERIFIED'
                    || providerProfile?.user?.isVerified
                    || task.provider?.isVerified
                ),
                tasksPosted: tasksPostedCount,
                rating: Number.isFinite(ratingAvg) ? Math.round(ratingAvg) : null,
                ratingCount,
                memberSince,
                totalSpent: providerProfile?.totalSpent
                    ? `₹${Number(providerProfile.totalSpent).toLocaleString('en-IN')}`
                    : 'Not available',
                location: task.location || providerProfile?.locationCity || 'India',
            },
        };
    }, [task, providerProfile, knownInterest]);

    const handleAcceptInvitation = async () => {
        if (!viewModel?.invitationId) return;
        try {
            setIsAccepting(true);
            await acceptInvitation(viewModel.invitationId);
            setInvitationAccepted(true);
        } catch (error) {
            console.error('Failed to accept invitation:', error);
            const message = error?.response?.data?.message || error.message || 'Failed to accept invitation. Please try again.';
            setInterestState({ type: 'error', message });
        } finally {
            setIsAccepting(false);
        }
    };

    const handleAccept = async () => {
        if (!viewModel || !id || id === ':id') return;

        if (viewModel.hasInterestSent) {
            setInterestState({ type: 'duplicate' });
            return;
        }

        if (!payoutAccepted) return;

        try {
            setIsAccepting(true);
            await expressInterest(id, { message: "I'm interested in this task!" });
            setKnownInterest({ taskId: id, status: 'PENDING' });
            setInterestState({ type: 'success' });
        } catch (error) {
            console.error("Failed to accept task:", error);
            const message = error?.response?.data?.message || error.message || "Failed to accept task. Please try again.";
            if (INTEREST_ALREADY_SENT_RE.test(message)) {
                setKnownInterest({ taskId: id, status: 'PENDING' });
                setInterestState({ type: 'duplicate' });
            } else if (KYC_REQUIRED_RE.test(message)) {
                setInterestState({ type: 'kyc' });
            } else {
                setInterestState({ type: 'error', message });
            }
        } finally {
            setIsAccepting(false);
        }
    };

    const handleToggleSave = async () => {
        if (isSaving || !id || id === ':id') return;
        const next = !savedLocally;
        setSavedLocally(next);
        setIsSaving(true);
        try {
            if (next) {
                await saveTask(id);
            } else {
                await unsaveTask(id);
            }
        } catch (err) {
            console.error('Failed to save/unsave task:', err);
            setSavedLocally(!next);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrimaryAction = () => {
        if (viewModel?.isAssigned) {
            navigate(`/performer/active-task/${id}`);
            return;
        }
        if (viewModel?.isInvited) {
            handleAcceptInvitation();
            return;
        }
        if (viewModel?.hasInterestSent) {
            navigate(`/performer/task-accepted/${id}`);
            return;
        }
        handleAccept();
    };

    if (isLoading) {
        return <TaskDetailsSkeleton />;
    }

    if (!task || !viewModel) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] p-6">
                <AlertCircle size={48} className="mb-4 text-red-500" />
                <h2 className="mb-2 text-2xl font-bold text-[var(--color-text)]">Task Not Found</h2>
                <p className="mb-8 text-[var(--color-text-muted)]">The task you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <button
                    type="button"
                    onClick={() => navigate('/performer/dashboard')}
                    className="rounded-xl bg-[var(--color-primary)] px-8 py-3 font-bold text-white"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (invitationAccepted) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] pb-16 pt-[80px] font-sans text-[var(--color-text)] lg:pl-[220px]">
                <PerformerHeader activePage="home" />
                <main className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6">
                    <Motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-primary)] shadow-[var(--shadow-md)]">
                            <CheckCircle2 size={48} className="text-white" strokeWidth={2} />
                        </div>
                        <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-text)]">
                            You&apos;re In!
                        </h1>
                        <p className="mt-2 max-w-sm text-[14px] font-medium leading-relaxed text-[var(--color-text-muted)]">
                            You&apos;ve accepted the invitation for{' '}
                            <span className="font-bold text-[var(--color-text)]">&apos;{viewModel.title}&apos;</span>.
                        </p>

                        <div className="mt-8 w-full rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-left">
                            <div className="flex items-start gap-3">
                                <Clock size={18} className="mt-0.5 shrink-0 text-amber-500" />
                                <div>
                                    <p className="text-[14px] font-bold text-amber-800">Waiting for provider payment</p>
                                    <p className="mt-1 text-[13px] font-medium leading-relaxed text-amber-700">
                                        You can start working once the provider confirms and pays for this task. The task will appear in your active list after payment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex w-full flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/performer/dashboard')}
                                className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)]"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </Motion.div>
                </main>
            </div>
        );
    }

    const displayDescription = viewModel.needsReadMore && !descriptionExpanded
        ? `${viewModel.description.slice(0, DESCRIPTION_PREVIEW_LEN).trim()}...`
        : viewModel.description;

    const acceptLabel = viewModel.isAssigned
        ? 'View Task Execution'
        : viewModel.isInvited
            ? (isAccepting ? 'Accepting...' : 'Accept Invitation')
            : viewModel.hasInterestSent
                ? 'View My Interest Status'
                : isAccepting
                    ? 'Sending...'
                    : 'Send Interest';

    const actionTitle = viewModel.isAssigned
        ? 'Continue this task'
        : viewModel.isInvited
            ? 'You have been invited!'
            : viewModel.hasInterestSent
                ? 'Interest sent'
                : 'Interested in this task?';

    const actionDescription = viewModel.isAssigned
        ? 'Open your execution workspace to review the checklist and submit work.'
        : viewModel.isInvited
            ? 'The provider has personally invited you to work on this task. Accept to get started.'
            : viewModel.hasInterestSent
                ? 'The provider has your profile. You can review the current application status.'
                : 'Confirm the payout, then share your interest with the provider.';

    return (
        <div className="min-h-screen bg-[var(--color-bg)] pb-12 pt-[80px] font-sans text-[var(--color-text)] lg:pl-[220px]">
            <PerformerHeader activePage="home" />
            <InterestStatusModal
                state={interestState}
                taskTitle={viewModel.title}
                onClose={() => setInterestState(null)}
                onPrimary={() => {
                    if (interestState?.type === 'kyc') {
                        navigate('/performer/kyc');
                    } else if (interestState?.type === 'error') {
                        setInterestState(null);
                        handleAccept();
                    } else {
                        navigate(`/performer/task-accepted/${id}`);
                    }
                }}
                onSecondary={() => {
                    if (interestState?.type === 'success' || interestState?.type === 'duplicate') {
                        navigate('/performer/find-tasks');
                    } else {
                        setInterestState(null);
                    }
                }}
            />

            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => navigate('/performer/find-tasks')}
                    className="mb-6 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-[14px] font-bold text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
                >
                    <ChevronLeft size={18} />
                    Back to tasks
                </button>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
                    <div className="space-y-5">
                        <Motion.article
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]"
                        >
                            <div className="p-5 sm:p-7">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold text-[var(--color-primary)]">
                                        {viewModel.category}
                                    </span>
                                    <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-muted)]">
                                        {viewModel.tierLabel}
                                    </span>
                                </div>

                                <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-text)] sm:text-[34px]">
                                    {viewModel.title}
                                </h1>

                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold text-[var(--color-text-muted)]">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin size={15} className="text-[var(--color-primary)]" />
                                        {viewModel.location}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock size={15} className="text-[var(--color-primary)]" />
                                        Posted {viewModel.postedAt}
                                    </span>
                                </div>

                                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                    <SummaryMetric
                                        icon={<IndianRupee size={19} strokeWidth={2.2} />}
                                        label="Your payout"
                                        value={`₹${viewModel.grossAmount.toLocaleString('en-IN')}`}
                                        highlight
                                    />
                                    <SummaryMetric
                                        icon={<CalendarDays size={19} strokeWidth={2.2} />}
                                        label="Deadline"
                                        value={viewModel.projectDuration}
                                    />
                                </div>
                            </div>
                        </Motion.article>

                        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] sm:p-7">
                            <section>
                                <SectionTitle>About this task</SectionTitle>
                                <p className="max-w-3xl whitespace-pre-wrap text-[14px] font-medium leading-7 text-[var(--color-text-muted)]">
                                    {displayDescription}
                                </p>
                                {viewModel.needsReadMore ? (
                                    <button
                                        type="button"
                                        onClick={() => setDescriptionExpanded((value) => !value)}
                                        className="mt-3 inline-flex items-center gap-1 rounded-md text-[13px] font-bold text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
                                    >
                                        {descriptionExpanded ? 'Read less' : 'Read more'}
                                        {descriptionExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                ) : null}
                            </section>

                            <section className="mt-7 border-t border-[var(--color-border)] pt-6">
                                <SectionTitle>Skills needed</SectionTitle>
                                {viewModel.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {viewModel.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-bold text-[var(--color-text)]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[13px] font-medium text-[var(--color-text-muted)]">No specific skills were listed.</p>
                                )}
                            </section>

                            {viewModel.deliverables.length > 0 ? (
                                <section className="mt-7 border-t border-[var(--color-border)] pt-6">
                                    <SectionTitle>What you will deliver</SectionTitle>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {viewModel.deliverables.map((item) => (
                                            <li key={item} className="flex items-start gap-3 rounded-xl bg-[var(--color-surface)] p-3.5">
                                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                                                    <CheckCircle2 size={13} strokeWidth={2.5} />
                                                </span>
                                                <span className="text-[13px] font-semibold leading-5 text-[var(--color-text)]">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ) : null}

                            <section className="mt-7 border-t border-[var(--color-border)] pt-6">
                                <SectionTitle>Attachments</SectionTitle>
                                <div className="space-y-3">
                                    {viewModel.apiFiles.length > 0 ? (
                                        viewModel.apiFiles.map((file, index) => (
                                            <FileRow
                                                key={file.id || file.url || index}
                                                name={file.filename || file.name || `Attachment ${index + 1}`}
                                                size={file.sizeBytes ? `${Math.round(file.sizeBytes / 1024)} KB` : 'Size unavailable'}
                                                type={/pdf/i.test(file.filename || file.name || '') ? 'pdf' : 'doc'}
                                                url={file.url || file.documentUrl}
                                            />
                                        ))
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-7 text-center">
                                            <FileText className="mx-auto h-5 w-5 text-[var(--color-text-subtle)]" />
                                            <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">No attachments were added to this task.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </article>
                    </div>

                    <aside className="space-y-5 lg:sticky lg:top-[96px]">
                        <article className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-md)]">
                            <div className="flex items-start gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                                    <ShieldCheck size={20} strokeWidth={2.2} />
                                </span>
                                <div>
                                    <h2 className="text-[17px] font-extrabold tracking-tight text-[var(--color-text)]">{actionTitle}</h2>
                                    <p className="mt-1 text-[12px] font-medium leading-5 text-[var(--color-text-muted)]">{actionDescription}</p>
                                </div>
                            </div>

                            {viewModel.isWaitingConfirmation ? (
                                <div className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3 text-[12px] font-semibold leading-5 text-amber-800">
                                    Waiting for the provider to confirm your application.
                                </div>
                            ) : null}

                            {!viewModel.hasInterestSent ? (
                                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 transition hover:border-[var(--color-primary)]/30">
                                    <input
                                        type="checkbox"
                                        checked={payoutAccepted}
                                        onChange={(event) => setPayoutAccepted(event.target.checked)}
                                        className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                    />
                                    <span className="text-[12px] font-medium leading-5 text-[var(--color-text-muted)]">
                                        I accept the listed payout of <span className="font-extrabold text-[var(--color-text)]">₹{viewModel.grossAmount.toLocaleString('en-IN')}</span>.
                                    </span>
                                </label>
                            ) : null}

                            <button
                                type="button"
                                onClick={handlePrimaryAction}
                                disabled={isAccepting || (!viewModel.hasInterestSent && !payoutAccepted)}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3.5 text-[14px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isAccepting ? <Loader2 size={16} className="animate-spin" /> : null}
                                {acceptLabel}
                                {!isAccepting ? <ArrowRight size={16} /> : null}
                            </button>

                            <button
                                type="button"
                                onClick={handleToggleSave}
                                disabled={isSaving}
                                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-[13px] font-bold transition active:translate-y-px disabled:opacity-60 ${
                                    savedLocally
                                        ? 'border-[var(--color-primary)]/30 bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                                        : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:border-[var(--color-primary)]/30'
                                }`}
                            >
                                <Bookmark size={16} className={savedLocally ? 'fill-current' : ''} />
                                {savedLocally ? 'Task saved' : 'Save for later'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/performer/settings')}
                                className="mt-3 w-full rounded-lg py-1.5 text-center text-[12px] font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
                            >
                                Report this task
                            </button>
                        </article>

                        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)]">
                            <h2 className="mb-4 text-[15px] font-bold text-[var(--color-text)]">About the client</h2>

                            <div className="flex items-start gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (viewModel.targetClientId) {
                                            navigate(`/performer/client/${viewModel.targetClientId}?fromTask=${task.id || id}`);
                                        }
                                    }}
                                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white ${viewModel.targetClientId ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                    <span>{viewModel.client.initials}</span>
                                    {viewModel.client.avatar ? (
                                        <img
                                            src={viewModel.client.avatar}
                                            alt=""
                                            className="absolute inset-0 h-full w-full rounded-full object-cover"
                                            onError={(event) => {
                                                event.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                    {viewModel.client.verified ? (
                                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-surface-elevated)]">
                                            <BadgeCheck size={10} />
                                        </span>
                                    ) : null}
                                </button>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="truncate text-[15px] font-bold text-[var(--color-text)]">{viewModel.client.name}</h3>
                                        {viewModel.client.verified ? (
                                            <span className="rounded-md bg-[var(--color-primary-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
                                                Verified
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="mt-0.5 text-[12px] font-semibold text-[var(--color-text-muted)]">
                                        {viewModel.client.tasksPosted == null
                                            ? 'Client profile'
                                            : `${viewModel.client.tasksPosted} ${Number(viewModel.client.tasksPosted) === 1 ? 'task' : 'tasks'} posted`}
                                    </p>
                                    {viewModel.client.rating ? (
                                        <div className="mt-1.5 flex items-center gap-1 text-amber-500">
                                            <Star size={14} fill="currentColor" stroke="currentColor" />
                                            <span className="text-[12px] font-bold text-[var(--color-text)]">{viewModel.client.rating}</span>
                                            {viewModel.client.ratingCount > 0 ? (
                                                <span className="text-[11px] font-medium text-[var(--color-text-muted)]">({viewModel.client.ratingCount})</span>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <p className="mt-1.5 text-[11px] font-medium text-[var(--color-text-muted)]">No reviews yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 border-t border-[var(--color-border)] pt-1">
                                <StatRow label="Member since" value={viewModel.client.memberSince} />
                                <StatRow label="Total spent" value={viewModel.client.totalSpent} />
                                <StatRow label="Location" value={viewModel.client.location} />
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (viewModel.targetClientId) {
                                        navigate(`/performer/client/${viewModel.targetClientId}?fromTask=${task.id || id}`);
                                    }
                                }}
                                disabled={!viewModel.targetClientId}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] py-2.5 text-[13px] font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                View client profile
                                <ArrowRight size={15} />
                            </button>
                        </article>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default PerformerTaskDetailsPage;
