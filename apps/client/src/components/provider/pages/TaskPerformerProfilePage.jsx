import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    ChevronRight,
    Star,
    Award,
    Clock,
    Bookmark,
    Briefcase,
    ShieldCheck,
    MapPin,
    AlertCircle,
    CheckCircle,
    Activity,
    Zap,
    X,
    FileText,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { getTaskerProfile, listMyTasks, getTaskDetails, getTaskInterests, listTaskers, sendTaskInvitation, getTaskInvitations } from "../services/api";
import { getTaskerReviewsList } from "../../Performer/services/api";

const TABS = ["About", "Portfolio", "Reviews", "Recent Activities"];

const getTaskerAvatar = (tasker) =>
    tasker?.profilePicUrl ||
    tasker?.avatar ||
    tasker?.photoUrl ||
    tasker?.user?.profilePicUrl ||
    tasker?.user?.avatar ||
    "";

const getCompletedCount = (tasker) => {
    const values = [
        tasker?.completedTasksCount,
        tasker?.completedTasks,
        tasker?.tasksCompleted,
        tasker?.totalCompletedTasks,
        tasker?.stats?.completedTasks,
        tasker?._count?.completedTasks,
        tasker?._count?.taskAssignments,
    ].map(Number).filter(Number.isFinite);
    return values.length ? Math.max(...values) : 0;
};

const getRateLabel = (tasker) => {
    const rate = tasker?.hourlyRate ?? tasker?.ratePerHour ?? tasker?.pricing?.hourlyRate;
    if (!rate) return "";
    return `₹${Number(rate).toLocaleString("en-IN")}/hr`;
};

const getTaskBudget = (task) =>
    task?.priceAmount ?? task?.budget ?? task?.price ?? 0;

const extractTaskers = (response) => {
    const list = response?.taskers || response?.data?.taskers || response?.data || response;
    return Array.isArray(list) ? list : [];
};

const isSameTasker = (tasker, taskerId) => {
    const id = String(taskerId || "");
    if (!id) return false;
    return [
        tasker?.id,
        tasker?.taskerId,
        tasker?.userId,
        tasker?.user?.id,
        tasker?.user?._id,
    ].map((value) => String(value || "")).includes(id);
};

const TaskPerformerProfilePage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const taskerId = params.name || params.id || params.taskerId;
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const isInterestContext = location.state?.profileSource === "task-interest" || searchParams.get("source") === "interest";

    const [activeTab, setActiveTab] = useState("About");
    const fallbackTasker = location.state?.tasker || null;
    const [tasker, setTasker] = useState(fallbackTasker);
    const [isLoading, setIsLoading] = useState(!fallbackTasker);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // Direct Hire context task
    const [contextTask, setContextTask] = useState(location.state?.taskData || null);
    const [loadingContextTask, setLoadingContextTask] = useState(false);

    // Hire modal
    const [showHireModal, setShowHireModal] = useState(false);
    const [myTasks, setMyTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const initialInterestId = location.state?.interestId || location.state?.tasker?.interestId || null;
    const [interestId, setInterestId] = useState(initialInterestId);
    const [interestLoading, setInterestLoading] = useState(isInterestContext && !initialInterestId);

    useEffect(() => {
        const fetchPerformerInterest = async () => {
            const activeTaskId = contextTask?.id || contextTask?._id || selectedTask?.id || selectedTask?._id || location.state?.taskId || searchParams.get("taskId");
            if (activeTaskId && taskerId) {
                if (isInterestContext && !interestId) setInterestLoading(true);
                try {
                    const interests = await getTaskInterests(activeTaskId);
                    const list = interests?.interests || interests?.data || (Array.isArray(interests) ? interests : []);
                    const matchingInterest = list.find(
                        (interest) => [
                            interest.taskerId,
                            interest.tasker?.id,
                        ].some((value) => String(value || "") === String(taskerId)) ||
                            (tasker?.userId && String(interest.tasker?.userId || "") === String(tasker.userId))
                    );
                    if (matchingInterest) {
                        console.log("[ONIT] Found matching interest in profile page:", matchingInterest);
                        setInterestId(matchingInterest.id);
                    } else if (!initialInterestId) {
                        setInterestId(null);
                    }
                } catch (err) {
                    console.error("[ONIT] Error fetching task interests in profile page:", err);
                    if (!initialInterestId) setInterestId(null);
                } finally {
                    setInterestLoading(false);
                }
            } else if (isInterestContext) {
                setInterestLoading(false);
            }
        };
        fetchPerformerInterest();
    }, [contextTask, selectedTask, taskerId, tasker?.userId, location.state, searchParams, isInterestContext, initialInterestId, interestId]);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [data, taskerListResponse] = await Promise.all([
                getTaskerProfile(taskerId),
                listTaskers({ limit: 99 }).catch(() => null),
            ]);
            const listTasker = extractTaskers(taskerListResponse).find((item) => isSameTasker(item, taskerId));
            console.log("[ONIT] Raw tasker profile data:", JSON.stringify(data, null, 2));
            const merged = { ...(fallbackTasker || {}), ...(listTasker || {}), ...(data || {}) };
            merged.completedTasksCount = Math.max(
                getCompletedCount(fallbackTasker),
                getCompletedCount(listTasker),
                getCompletedCount(data),
            );
            setTasker(merged);
        } catch (err) {
            console.error("[ONIT] Error fetching profile:", err);
            if (!fallbackTasker) {
                setError("Could not load performer profile. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await getTaskerReviewsList(taskerId, { limit: 50 });
            const list = res?.reviews || res?.data || (Array.isArray(res) ? res : []);
            setReviews(list);
        } catch (err) {
            console.error("[ONIT] Error fetching reviews:", err);
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        if (taskerId && taskerId !== "undefined" && taskerId !== "null") {
            fetchProfile();
            fetchReviews();
        } else {
            setIsLoading(false);
            setError("Invalid or missing performer profile ID.");
        }
    }, [taskerId]);

    useEffect(() => {
        const fetchContextTask = async () => {
            const tId = location.state?.taskId || searchParams.get("taskId");
            if (tId && !contextTask) {
                setLoadingContextTask(true);
                try {
                    const res = await getTaskDetails(tId);
                    const task = res?.task || res?.data || res;
                    if (task) {
                        setContextTask(task);
                    }
                } catch (err) {
                    console.error("[ONIT] Error fetching context task:", err);
                } finally {
                    setLoadingContextTask(false);
                }
            }
        };
        fetchContextTask();
    }, [location.state, searchParams]);

    const openHireModal = async () => {
        setShowHireModal(true);
        setSelectedTask(null);
        setTasksLoading(true);
        try {
            const res = await listMyTasks({ limit: 50 });
            const list = res?.tasks || res?.data || (Array.isArray(res) ? res : []);
            const open = list.filter(t =>
                ['PUBLISHED', 'OPEN'].includes(String(t.status || "").toUpperCase())
            );
            setMyTasks(open);
        } catch (err) {
            console.error('[ONIT] fetchMyTasks error:', err);
            setMyTasks([]);
        } finally {
            setTasksLoading(false);
        }
    };

    const [isSendingInvitation, setIsSendingInvitation] = useState(false);
    const [invitationFeedback, setInvitationFeedback] = useState("");
    const [pendingInvitation, setPendingInvitation] = useState(null);
    const [checkingInvitation, setCheckingInvitation] = useState(false);

    const handleConfirmHire = async (taskToHireFor) => {
        const targetTask = taskToHireFor || selectedTask;
        const taskId = targetTask?.id || targetTask?._id;
        if (!taskId || !taskerId || isSendingInvitation) return;

        // If the performer already applied, the normal acceptance-and-payment
        // flow is correct. A selected performer without an application must
        // receive an invitation first.
        if (interestId) {
            const avatar = getTaskerAvatar(tasker);
            navigate('/provider/confirm-and-pay', {
                state: {
                    performer: {
                        person: displayName,
                        name: tasker?.profession || tasker?.domain || 'Expert Tasker',
                        avatar: avatar || null,
                        rating: displayRatingAvg || 'New',
                        tasks: `${displayCompletedCount} Tasks`,
                        rate: getRateLabel(tasker),
                        interestId,
                        taskerId,
                    },
                    taskData: {
                        id: taskId,
                        title: targetTask.title || 'Task',
                        description: targetTask.description || '',
                        priceAmount: getTaskBudget(targetTask),
                        category: targetTask.category || targetTask.domain || 'Professional Services',
                        deadline: targetTask.deadline || targetTask.expectedCompletionDate || 'To be discussed',
                    },
                },
            });
            setShowHireModal(false);
            return;
        }

        setIsSendingInvitation(true);
        setInvitationFeedback("");
        try {
            await sendTaskInvitation(taskId, taskerId);
            setShowHireModal(false);
            setPendingInvitation({ task: targetTask, taskId });
            setInvitationFeedback(`${displayName} has been invited. You can pay after they accept the request.`);
        } catch (err) {
            const message = String(err?.message || "");
            setInvitationFeedback(/already.*invited|duplicate/i.test(message)
                ? "An invitation has already been sent to this performer for the selected task."
                : message || "Could not send the invitation. Please try again.");
        } finally {
            setIsSendingInvitation(false);
        }
    };

    const handleHireInterestedPerformer = () => {
        if (!contextTask || !interestId || interestLoading || loadingContextTask) return;
        handleConfirmHire(contextTask);
    };

    const checkInvitationAndPay = async () => {
        if (!pendingInvitation?.taskId || checkingInvitation) return;
        setCheckingInvitation(true);
        try {
            const response = await getTaskInvitations(pendingInvitation.taskId);
            const invitations = response?.invitations || response?.data || (Array.isArray(response) ? response : []);
            const invitation = invitations.find((item) => String(item?.taskerId || item?.tasker?.id || item?.tasker_id) === String(taskerId));
            const status = String(invitation?.status || invitation?.assignment?.status || "").toUpperCase();
            if (!status.includes("ACCEPT")) {
                setInvitationFeedback(`${displayName} has not accepted the request yet. Payment will unlock as soon as they accept.`);
                return;
            }

            const targetTask = pendingInvitation.task;
            navigate('/provider/confirm-and-pay', {
                state: {
                    performer: {
                        person: displayName,
                        name: tasker?.profession || tasker?.domain || 'Expert Tasker',
                        avatar: getTaskerAvatar(tasker) || null,
                        rating: displayRatingAvg || 'New',
                        tasks: `${displayCompletedCount} Tasks`,
                        rate: getRateLabel(tasker),
                        taskerId,
                        hireType: 'accepted_invitation',
                        invitationId: invitation?.id,
                    },
                    taskData: {
                        id: pendingInvitation.taskId,
                        title: targetTask.title || 'Task',
                        description: targetTask.description || '',
                        priceAmount: getTaskBudget(targetTask),
                        category: targetTask.category || targetTask.domain || 'Professional Services',
                        deadline: targetTask.deadline || targetTask.expectedCompletionDate || 'To be discussed',
                    },
                },
            });
        } catch (err) {
            setInvitationFeedback(err?.message || "Could not check the invitation status. Please try again.");
        } finally {
            setCheckingInvitation(false);
        }
    };

    const displayName = tasker?.displayName || tasker?.user?.name || tasker?.user?.email?.split("@")?.[0] || "Performer";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-surface)] pb-24 pt-[80px] font-sans antialiased">
                <ProviderHeader activePage="home" />
                <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse space-y-8">
                    <div className="h-4 w-48 bg-[var(--color-border-subtle)] rounded" />
                    <div className="h-[250px] bg-[var(--color-border-subtle)] rounded-[var(--radius-2xl)]" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-40 bg-[var(--color-border-subtle)] rounded-[var(--radius-2xl)]" />
                            <div className="h-60 bg-[var(--color-border-subtle)] rounded-[var(--radius-2xl)]" />
                        </div>
                        <div className="h-80 bg-[var(--color-border-subtle)] rounded-[var(--radius-2xl)]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !tasker) {
        return (
            <div className="min-h-screen bg-[var(--color-surface)] pb-24 pt-[80px] flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[var(--color-text)]">{error || "Profile not found"}</h2>
                    <button onClick={() => navigate(-1)} className="mt-6 font-bold text-[var(--color-primary)] hover:underline">Go back</button>
                </div>
            </div>
        );
    }

    // Compute rating from fetched reviews if API doesn't return it
    const computedRatingAvg = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : null;
    const computedRatingCount = reviews.length;

    const displayRatingAvg = tasker.ratingAvg || tasker.averageRating || tasker.avgRating || computedRatingAvg;
    const displayRatingCount = tasker.ratingCount ?? tasker.reviewCount ?? tasker.totalReviews ?? computedRatingCount;
    // Try every known field name the backend might use
    const displayCompletedCount =
        getCompletedCount(tasker);
    const displayAvatar = getTaskerAvatar(tasker);
    const displayRate = getRateLabel(tasker);

    const stats = [
        { label: "Tasks completed", value: displayCompletedCount, icon: Award },
        { label: "Rating", value: displayRatingAvg ? `${displayRatingAvg}/5` : "New", icon: Star },
        { label: "Experience", value: tasker.experienceLevel || "Beginner", icon: ShieldCheck },
        { label: "Location", value: tasker.locationCity || tasker.city || "India", icon: MapPin },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-surface)] pb-24 pt-[80px] font-sans text-[var(--color-text)] antialiased">
            <ProviderHeader activePage="home" />

            <div
                className="pointer-events-none fixed inset-0 -z-10 opacity-80"
                aria-hidden
                style={{
                    background:
                        "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(5, 150, 105, 0.07), transparent 50%), radial-gradient(ellipse 50% 35% at 100% 30%, rgba(5, 150, 105, 0.04), transparent 45%)",
                }}
            />

            <div className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-elevated)] to-[var(--color-surface)]/90">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
                        <button
                            type="button"
                            onClick={() => navigate("/provider/dashboard")}
                            className="inline-flex items-center gap-2 font-medium text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
                        >
                            <Home className="h-4 w-4" strokeWidth={2.25} />
                            Home
                        </button>
                        <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
                        <button
                            type="button"
                            onClick={() => navigate("/provider/task-performers")}
                            className="font-medium text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
                        >
                            Task performers
                        </button>
                        <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
                        <span className="font-bold text-[var(--color-primary)] truncate max-w-[200px]">{displayName}</span>
                    </nav>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {invitationFeedback && (
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                        <span>{invitationFeedback}</span>
                        <div className="flex items-center gap-3">
                            {pendingInvitation && <button type="button" onClick={checkInvitationAndPay} disabled={checkingInvitation} className="rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-black text-white disabled:opacity-60">{checkingInvitation ? 'Checking…' : 'Check & pay'}</button>}
                            <button type="button" onClick={() => setInvitationFeedback("")} className="text-xs font-black underline">Dismiss</button>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                    <div className="min-w-0 flex-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-md)] ring-1 ring-black/[0.04]"
                        >
                            <div className="relative border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-subtle)]/80 to-white p-6 sm:p-8">
                                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--color-primary)]/10 blur-3xl" aria-hidden />
                                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                        <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full border-4 border-white shadow-[var(--shadow-md)] ring-2 ring-[var(--color-primary)]/20">
                                            <img
                                                src={displayAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=059669&color=fff&size=256`}
                                                alt={displayName}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                                                {tasker.kycStatus === "VERIFIED" ? "Verified Performer" : "Top rated"}
                                            </p>
                                            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">{displayName}</h1>
                                            <p className="mt-1 text-[15px] font-semibold text-[var(--color-text-muted)]">{tasker.profession || "Expert Tasker"}</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star className="h-5 w-5 fill-current" strokeWidth={0} />
                                                </div>
                                                <span className="text-sm font-bold text-[var(--color-text)]">{displayRatingAvg || "New"}</span>
                                                <span className="text-sm font-medium text-[var(--color-text-subtle)]">/ 5 · {displayRatingCount} review{displayRatingCount !== 1 ? "s" : ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:max-w-md lg:grid-cols-2">
                                        {stats.map(({ label, value, icon: Icon }) => (
                                            <div
                                                key={label}
                                                className="rounded-[var(--radius-xl)] border border-[var(--color-border)]/80 bg-white/90 px-4 py-3 shadow-[var(--shadow-xs)] backdrop-blur-sm"
                                            >
                                                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                                                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                                                    <span className="text-lg font-black text-[var(--color-text)] truncate">{value}</span>
                                                </div>
                                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/30 px-4 sm:px-8">
                                <div className="flex gap-2 overflow-x-auto pb-0 pt-1 scrollbar-hide sm:gap-8">
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={`relative shrink-0 whitespace-nowrap pb-3 pt-4 text-[14px] font-bold transition-colors sm:text-[15px] ${activeTab === tab
                                                ? "text-[var(--color-text)]"
                                                : "text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]"
                                                }`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="performerProfileTab"
                                                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[var(--color-primary)]"
                                                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {activeTab === "About" && (
                                <motion.div
                                    key="about"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="space-y-6"
                                >
                                    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
                                        <h2 className="mb-4 text-xl font-bold text-[var(--color-text)]">Overview</h2>
                                        <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.75] text-[var(--color-text-muted)]">
                                            {tasker.bio || "This performer has not provided a bio yet. They are a dedicated member of the OnIT professional network, committed to high-quality work and client satisfaction."}
                                        </p>
                                    </div>
                                    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
                                        <h2 className="mb-5 text-xl font-bold text-[var(--color-text)]">Skills</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {(tasker.skills?.length > 0 ? tasker.skills : ["Dedicated", "Professional", "Timely"]).map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary-subtle)] px-4 py-2 text-[13px] font-bold text-[var(--color-primary)]"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "Portfolio" && (
                                <motion.div
                                    key="portfolio"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                >
                                    {tasker.portfolio?.length > 0 ? (
                                        tasker.portfolio.map((item) => (
                                            <div
                                                key={item.id}
                                                className="group overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-lg)]"
                                            >
                                                {item.imageUrl && (
                                                    <div className="h-40 overflow-hidden">
                                                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                                                    </div>
                                                )}
                                                <div className="p-5">
                                                    <h3 className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">{item.title}</h3>
                                                    <p className="mt-2 line-clamp-2 text-xs font-medium text-[var(--color-text-subtle)]">{item.description}</p>
                                                    {item.link && (
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline">
                                                            View link <ChevronRight className="h-3 w-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] bg-white/50 py-12 text-center text-[var(--color-text-subtle)]">
                                            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                            <p className="font-bold">No portfolio entries yet</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "Reviews" && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {reviewsLoading ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="animate-pulse rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-5">
                                                    <div className="flex gap-3 mb-3">
                                                        <div className="h-10 w-10 rounded-full bg-[var(--color-border-subtle)]" />
                                                        <div className="flex-1 space-y-2">
                                                            <div className="h-3 w-1/3 rounded bg-[var(--color-border-subtle)]" />
                                                            <div className="h-3 w-1/4 rounded bg-[var(--color-border-subtle)]" />
                                                        </div>
                                                    </div>
                                                    <div className="h-3 w-full rounded bg-[var(--color-border-subtle)]" />
                                                    <div className="h-3 w-2/3 rounded bg-[var(--color-border-subtle)] mt-2" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
                                            >
                                                <div className="mb-4 flex gap-3">
                                                    <div className="h-10 w-10 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                                                        <img
                                                            src={review.reviewer?.profilePicUrl || review.provider?.user?.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer?.email?.split('@')[0] || 'Client')}&background=059669&color=fff`}
                                                            alt="Reviewer"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{review.reviewer?.email?.split('@')[0] || review.provider?.businessName || "Client"}</p>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star key={s} className={`h-3 w-3 ${s <= (review.rating || 0) ? 'fill-current' : 'opacity-25'}`} strokeWidth={0} />
                                                            ))}
                                                            <span className="ml-1 text-xs font-bold text-[var(--color-text)]">{review.rating}/5</span>
                                                        </div>
                                                        {review.createdAt && (
                                                            <p className="text-[11px] text-[var(--color-text-subtle)] mt-0.5">
                                                                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium leading-relaxed text-[var(--color-text-muted)] italic">
                                                    &quot;{review.comment || review.feedback || "No comment provided."}&quot;
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] bg-white/50 py-12 text-center text-[var(--color-text-subtle)]">
                                            <Star className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                            <p className="font-bold">No reviews yet</p>
                                            <p className="text-xs mt-1">Be the first to work with this performer!</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "Recent Activities" && (
                                <motion.div
                                    key="activities"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                                        <h2 className="mb-5 text-xl font-bold text-[var(--color-text)]">Activity Summary</h2>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                            <div className="rounded-[var(--radius-xl)] bg-[var(--color-primary-subtle)]/60 p-4 text-center">
                                                <p className="text-2xl font-black text-[var(--color-primary)]">{displayCompletedCount}</p>
                                                <p className="mt-1 text-[12px] font-semibold text-[var(--color-text-subtle)]">Tasks Completed</p>
                                            </div>
                                            <div className="rounded-[var(--radius-xl)] bg-amber-50 p-4 text-center">
                                                <p className="text-2xl font-black text-amber-600">{displayRatingAvg || "—"}</p>
                                                <p className="mt-1 text-[12px] font-semibold text-[var(--color-text-subtle)]">Avg Rating</p>
                                            </div>
                                            <div className="rounded-[var(--radius-xl)] bg-blue-50 p-4 text-center col-span-2 sm:col-span-1">
                                                <p className="text-2xl font-black text-blue-600">{displayRatingCount}</p>
                                                <p className="mt-1 text-[12px] font-semibold text-[var(--color-text-subtle)]">Total Reviews</p>
                                            </div>
                                        </div>
                                    </div>
                                    {reviews.length > 0 && (
                                        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                                            <h2 className="mb-4 text-xl font-bold text-[var(--color-text)]">Latest Feedback</h2>
                                            <div className="space-y-3">
                                                {reviews.slice(0, 3).map(review => (
                                                    <div key={review.id} className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)]/60 p-3">
                                                        <CheckCircle className="h-5 w-5 shrink-0 text-[var(--color-primary)] mt-0.5" strokeWidth={2} />
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex text-amber-500">
                                                                    {[1, 2, 3, 4, 5].map(s => (
                                                                        <Star key={s} className={`h-3 w-3 ${s <= (review.rating || 0) ? 'fill-current' : 'opacity-20'}`} strokeWidth={0} />
                                                                    ))}
                                                                </div>
                                                                <span className="text-[11px] font-semibold text-[var(--color-text-subtle)]">{review.rating}/5</span>
                                                            </div>
                                                            <p className="mt-1 text-[13px] text-[var(--color-text-muted)] line-clamp-2 italic">&quot;{review.comment || review.feedback || "Great work!"}&quot;</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {displayCompletedCount === 0 && reviews.length === 0 && (
                                        <div className="rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] bg-white/50 py-12 text-center text-[var(--color-text-subtle)]">
                                            <Activity className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                            <p className="font-bold">No activity yet</p>
                                            <p className="text-xs mt-1">This performer is new to the platform</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <aside className="w-full shrink-0 lg:w-[300px] xl:w-[320px]">
                        <div className="sticky top-[100px] overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-md)] ring-1 ring-black/[0.04]">
                            <div className="border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-subtle)]/60 to-white p-6 text-center">
                                {displayRate ? (
                                    <>
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">Hiring rate</p>
                                        <p className="mt-2 text-2xl font-black text-[var(--color-text)]">{displayRate}</p>
                                    </>
                                ) : null}
                                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-bold text-[var(--color-primary)] shadow-[var(--shadow-xs)] ring-1 ring-[var(--color-primary)]/15 mx-auto">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                                    </span>
                                    {tasker.isAvailable === false ? "Busy right now" : "Available now"}
                                </div>
                                {tasker.stats?.hasSufficientResponseData && tasker.stats?.avgResponseLabel && (
                                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
                                        <Clock className="h-3.5 w-3.5" aria-hidden />
                                        <span>Responds in {tasker.stats.avgResponseLabel.replace(/\s+avg$/i, "")}</span>
                                    </div>
                                )}
                                {contextTask && (
                                    <div className="mt-4 mx-auto max-w-[240px] rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-subtle)]/50 p-3.5 text-left shadow-[var(--shadow-sm)] backdrop-blur-md">
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">{isInterestContext ? "Applied for task" : "Hiring for task"}</p>
                                        <p className="mt-1 text-xs font-bold text-[var(--color-text)] truncate">{contextTask.title}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[11px] font-black text-[var(--color-primary)]">₹{contextTask.priceAmount || contextTask.budget || contextTask.price}</span>
                                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-extrabold text-[var(--color-primary)] uppercase">Active</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3 p-6">
                                {isInterestContext ? (
                                    <motion.button
                                        type="button"
                                        whileHover={interestId && contextTask ? { scale: 1.02 } : undefined}
                                        whileTap={interestId && contextTask ? { scale: 0.98 } : undefined}
                                        disabled={!interestId || !contextTask || interestLoading || loadingContextTask}
                                        onClick={handleHireInterestedPerformer}
                                        className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[var(--color-primary)] py-4 text-[15px] font-extrabold text-white shadow-[0_4px_20px_rgba(5,150,105,0.35)] transition disabled:cursor-not-allowed disabled:bg-[var(--color-border-subtle)] disabled:text-[var(--color-text-subtle)] disabled:shadow-none"
                                    >
                                        <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10 opacity-0 transition hover:opacity-100" />
                                        <Zap className="h-5 w-5 shrink-0" strokeWidth={2.5} fill="currentColor" />
                                        {interestLoading || loadingContextTask
                                            ? "Loading application…"
                                            : interestId && contextTask
                                                ? "Hire performer"
                                                : "Application unavailable"}
                                    </motion.button>
                                ) : (
                                    <>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={openHireModal}
                                            className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[var(--color-primary)] py-4 text-[15px] font-extrabold text-white shadow-[0_4px_20px_rgba(5,150,105,0.35)] transition"
                                        >
                                            <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition hover:opacity-100 rounded-full" />
                                            <Zap className="h-5 w-5 shrink-0" strokeWidth={2.5} fill="currentColor" />
                                            Assign task
                                        </motion.button>

                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-white py-3 text-[14px] font-semibold text-[var(--color-text-subtle)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
                                        >
                                            <Bookmark className="h-4 w-4" strokeWidth={2.25} />
                                            Save for later
                                        </button>
                                    </>
                                )}

                                <p className="text-center text-[11px] font-medium leading-relaxed text-[var(--color-text-subtle)]">
                                    {isInterestContext
                                        ? "This performer expressed interest in your task. Hire them to continue to secure checkout."
                                        : "Secure your task with this verified performer. Payment is held in escrow until you approve the work."}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* ── Task Picker Modal (same flow as TaskApplicantsPage) ── */}
            <AnimatePresence>
                {showHireModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowHireModal(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 60 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            className="w-full max-w-lg bg-[var(--color-surface-elevated)] rounded-[var(--radius-2xl)] shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
                                <div>
                                    <h2 className="text-lg font-extrabold text-[var(--color-text)]">Select a Task to Hire For</h2>
                                    <p className="text-[12px] font-medium text-[var(--color-text-subtle)] mt-0.5">
                                        Hiring <span className="font-bold text-[var(--color-primary)]">{displayName}</span>
                                    </p>
                                </div>
                                <button onClick={() => setShowHireModal(false)} className="rounded-full p-2 hover:bg-[var(--color-border-subtle)] transition">
                                    <X className="h-5 w-5 text-[var(--color-text-subtle)]" />
                                </button>
                            </div>

                            {/* Task list */}
                            <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2">
                                {tasksLoading ? (
                                    <div className="space-y-3 py-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="animate-pulse h-16 rounded-[var(--radius-xl)] bg-[var(--color-border-subtle)]" />
                                        ))}
                                    </div>
                                ) : myTasks.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <FileText className="h-10 w-10 mx-auto mb-3 opacity-20 text-[var(--color-text-subtle)]" />
                                        <p className="font-bold text-[var(--color-text-subtle)]">No open tasks found</p>
                                        <p className="text-xs mt-1 text-[var(--color-text-subtle)]">Post a task first, then hire this performer for it.</p>
                                        <button
                                            onClick={() => navigate('/provider/post-task-selection')}
                                            className="mt-4 px-5 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition"
                                        >
                                            Post a Task
                                        </button>
                                    </div>
                                ) : (
                                    myTasks.map(task => (
                                        <button
                                            key={task.id || task._id}
                                            type="button"
                                            onClick={() => setSelectedTask(task)}
                                            className={`w-full text-left rounded-[var(--radius-xl)] border-2 p-4 transition ${
                                                selectedTask?.id === (task.id || task._id)
                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)]'
                                                    : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/40'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-[14px] text-[var(--color-text)] truncate">{task.title || 'Untitled Task'}</p>
                                                    <p className="text-[12px] text-[var(--color-text-subtle)] mt-0.5 line-clamp-1">{task.description || 'No description'}</p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                            <p className="text-[13px] font-black text-[var(--color-primary)]">{getTaskBudget(task) ? `₹${Number(getTaskBudget(task)).toLocaleString("en-IN")}` : "—"}</p>
                                                    <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                        task.status === 'PUBLISHED' ? 'bg-green-50 text-green-700' :
                                                        task.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                                                        'bg-slate-50 text-slate-500'
                                                    }`}>{task.status}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {myTasks.length > 0 && (
                                <div className="border-t border-[var(--color-border)] p-4 flex gap-3">
                                    <button
                                        onClick={() => setShowHireModal(false)}
                                        className="flex-1 rounded-full border border-[var(--color-border)] py-3 text-[14px] font-bold text-[var(--color-text-subtle)] hover:bg-[var(--color-border-subtle)] transition"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: selectedTask ? 1.02 : 1 }}
                                        whileTap={{ scale: selectedTask ? 0.97 : 1 }}
                                        disabled={!selectedTask}
                                        onClick={() => handleConfirmHire()}
                                        className={`flex-1 rounded-full py-3 text-[14px] font-extrabold text-white transition ${
                                            selectedTask
                                                ? 'bg-[var(--color-primary)] shadow-[0_4px_14px_rgba(5,150,105,0.3)] cursor-pointer'
                                                : 'bg-[var(--color-border-subtle)] text-[var(--color-text-subtle)] cursor-not-allowed'
                                        }`}
                                    >
                                        {isSendingInvitation ? 'Sending request…' : selectedTask ? 'Send request →' : 'Select a task first'}
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskPerformerProfilePage;
