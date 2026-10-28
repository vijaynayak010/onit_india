import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ProviderHeader from '../components/ProviderHeader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ChevronRight,
    User,
    MessageCircle,
    ShieldCheck,
    Compass,
    Zap,
    RefreshCw,
    Bookmark
} from 'lucide-react';
import { getTaskDetails, getTaskInterests, rejectInterest, getTaskerRankings } from '../services/api';
import { mapRankedTaskers } from '../../../utils/taskerRankings';

const normalizeInterestsList = (list) => {
    const arr = Array.isArray(list) ? list : (list?.interests || list?.data || []);
    const apps = arr.map(interest => {
        const t = interest.tasker || {};
        return {
            id: t.id || interest.taskerId,
            userId: t.user?.id || t.user?._id,
            interestId: interest.id,
            name: t.professional_title || "Applicant",
            person: t.displayName || t.user?.email?.split('@')[0] || "Anonymous",
            rate: t.hourlyRate ? `₹${Number(t.hourlyRate).toLocaleString("en-IN")}/hr` : "",
            rating: typeof t.ratingAvg === 'number' ? t.ratingAvg : (typeof t.user?.ratingAvg === 'number' ? t.user.ratingAvg : 0.0),
            tasks: `${t.completedTasksCount || 0} Tasks`,
            tags: t.skills || [],
            avatar: t.user?.profilePicUrl || `https://ui-avatars.com/api/?name=${t.displayName || 'A'}&background=random`,
            desc: t.bio || interest.message || "Interested in your task.",
            status: interest.status || "PENDING",
        };
    });
    apps.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
    return apps;
};

const TaskApplicantsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId') || 'temp-id';

    // Use prefetched data from TaskActivityPage navigation to avoid duplicate API calls
    const prefetchedInterests = location.state?.prefetchedInterests;
    const prefetchedTask = location.state?.prefetchedTask;
    const hasPrefetch = Array.isArray(prefetchedInterests) && !!prefetchedTask;

    const [applicants, setApplicants] = useState(() => hasPrefetch ? normalizeInterestsList(prefetchedInterests) : []);
    const [suggested, setSuggested] = useState([]);
    const [taskData, setTaskData] = useState(hasPrefetch ? prefetchedTask : null);
    const [loading, setLoading] = useState(!hasPrefetch);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(hasPrefetch);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(() => !hasPrefetch && !sessionStorage.getItem(`seen_loader_${taskId}`));
    const [scoutMessageIndex, setScoutMessageIndex] = useState(0);

    const scoutingMessages = [
        "Loading performers who expressed interest...",
        "Fetching interest responses...",
        "Updating interested performers...",
    ];

    const [rejectingId, setRejectingId] = useState(null);

    const handleRejectInterest = async (interestId) => {
        if (!interestId) return;
        if (!window.confirm("Reject this applicant's interest?")) return;
        setRejectingId(interestId);
        try {
            await rejectInterest(interestId);
            setApplicants((prev) => prev.filter((a) => a.interestId !== interestId));
        } catch (err) {
            alert("Failed to reject applicant: " + (err.message || ""));
        } finally {
            setRejectingId(null);
        }
    };

    const fetchData = async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            setError(null);

            const [task, interests] = await Promise.all([
                getTaskDetails(taskId).catch(() => null),
                getTaskInterests(taskId).catch(() => []),
            ]);
            if (task) setTaskData(task);

            const apps = normalizeInterestsList(interests);
            setApplicants(prev => JSON.stringify(prev) === JSON.stringify(apps) ? prev : apps);

            // When no interest yet, load top ranked taskers for this task category
            if (apps.length === 0) {
                const rankingParams = { limit: 8 };
                const category = task?.category;
                if (category) rankingParams.category = category;
                const rankingsRes = await getTaskerRankings(rankingParams).catch(() => ({ data: [] }));
                setSuggested(mapRankedTaskers(Array.isArray(rankingsRes?.data) ? rankingsRes.data : []));
            } else {
                setSuggested([]);
            }

            if (!isSilent && isSearching) {
                setTimeout(() => {
                    setIsSearching(false);
                    sessionStorage.setItem(`seen_loader_${taskId}`, 'true');
                }, 2000);
            }
        } catch (err) {
            console.error("Failed to fetch search results:", err);
            if (!isSilent) setError("Something went wrong while scanning for talent.");
        } finally {
            setHasLoadedOnce(true);
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        // If prefetched data was passed via navigation state, refresh silently in background
        fetchData(hasPrefetch);
        const interval = setInterval(() => {
            fetchData(true);
        }, 60000);
        return () => clearInterval(interval);
    }, [taskId]);

    // Cycling scouting message text
    useEffect(() => {
        if (isSearching) {
            const interval = setInterval(() => {
                setScoutMessageIndex((prev) => (prev + 1) % scoutingMessages.length);
            }, 450);
            return () => clearInterval(interval);
        }
    }, [isSearching]);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-100">
            <ProviderHeader activePage="my-tasks" />

            {/* Glowing decorative background blobs */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-[400px] right-20 w-[500px] h-[500px] bg-violet-400/5 rounded-full blur-[120px] pointer-events-none" />

            <main className="pt-[110px] pb-24 px-4 sm:px-6 lg:px-10 relative z-10">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Minimal & Elegant Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Performers Interested
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                {taskData?.title || (loading ? "Loading Task Details..." : "Untitled Task")}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => fetchData()}
                                disabled={loading}
                                className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
                            >
                                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                                Refresh List
                            </button>
                            <button
                                onClick={() => navigate(`/provider/active-task/${taskId}`)}
                                className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs transition-all active:scale-[0.98] shadow-sm"
                            >
                                Manage Task
                                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* REDESIGNED RESULTS & WORKSPACE */}
                    <AnimatePresence mode="wait">
                        {isSearching ? (
                            /* SCI-FI TALENT SEARCHING SCANNER */
                            <motion.div
                                key="searching"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-md relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

                                <div className="relative mb-10">
                                    {/* Rotating radar sweeping background */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="w-40 h-40 rounded-full border-2 border-dashed border-emerald-500/20 absolute inset-0 flex items-center justify-center"
                                    >
                                        <div className="w-32 h-32 rounded-full border border-dotted border-emerald-500/10" />
                                    </motion.div>

                                    {/* Central radar signal core */}
                                    <motion.div
                                        animate={{
                                            boxShadow: [
                                                "0 0 0 0px rgba(16, 185, 129, 0)",
                                                "0 0 0 25px rgba(16, 185, 129, 0.08)",
                                                "0 0 0 50px rgba(16, 185, 129, 0)"
                                            ]
                                        }}
                                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-24 h-24 bg-emerald-500/10 border-4 border-white shadow-xl rounded-full flex items-center justify-center text-emerald-500 relative z-10"
                                    >
                                        <Compass size={40} className="animate-spin duration-[4000ms]" />
                                    </motion.div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Loading Interested Performers</h3>

                                {/* Dynamic scouting log updates */}
                                <div className="h-6 overflow-hidden relative w-full flex justify-center mb-10">
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={scoutMessageIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-emerald-600 font-extrabold text-sm uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <Zap size={14} className="animate-bounce" />
                                            {scoutingMessages[scoutMessageIndex]}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>

                                {/* Custom loading progress bar */}
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            animate={{
                                                scaleY: [1, 2, 1],
                                                backgroundColor: ["#e2e8f0", "#10b981", "#e2e8f0"]
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: idx * 0.15
                                            }}
                                            className="w-1.5 h-6 rounded-full"
                                        />
                                    ))}
                                </div>
                                
                            </motion.div>
                        ) : loading && !hasLoadedOnce ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25 }}
                                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
                            >
                                <div className="animate-pulse space-y-5">
                                    <div className="h-5 w-48 rounded bg-slate-100" />
                                    <div className="h-28 rounded-3xl bg-slate-100" />
                                    <div className="h-28 rounded-3xl bg-slate-100" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                            Performers interested
                                        </h3>
                                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wider bg-emerald-500 text-white">
                                            {applicants.length}
                                        </span>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-500 border border-slate-200">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        Interest responses
                                    </div>
                                </div>

                                <div className="min-h-[500px]">
                                    <div className="flex flex-col gap-6">
                                        {applicants.length > 0 ? (
                                            applicants.map((performer, i) => (
                                                <PerformerCard
                                                    key={performer.id || i}
                                                    performer={performer}
                                                    type="applicant"
                                                    taskId={taskId}
                                                    taskData={taskData}
                                                    navigate={navigate}
                                                    onReject={handleRejectInterest}
                                                    rejecting={rejectingId === performer.interestId}
                                                />
                                            ))
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="col-span-full py-16 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 shadow-sm">
                                                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
                                                        <User className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                    <h4 className="text-2xl font-black text-slate-900 mb-2">No performers interested yet</h4>
                                                    <p className="text-slate-400 font-bold max-w-sm mx-auto">
                                                        Top ranked performers for this category are shown below while you wait.
                                                    </p>
                                                </div>

                                                {suggested.length > 0 ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-lg font-black text-slate-900">Top ranked performers</h3>
                                                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wider bg-indigo-500 text-white">
                                                                {suggested.length}
                                                            </span>
                                                        </div>
                                                        {suggested.map((s) => (
                                                            <div
                                                                key={s.id}
                                                                className="bg-white border border-emerald-100 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start"
                                                            >
                                                                <img
                                                                    src={s.avatar}
                                                                    alt={s.displayName}
                                                                    className="w-20 h-20 rounded-2xl object-cover border border-slate-100"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <h4 className="text-lg font-bold text-slate-900">{s.displayName}</h4>
                                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                                                                            <Star size={12} fill="currentColor" />
                                                                            {s.ratingAvg || "5"}
                                                                        </span>
                                                                        {s.kycStatus === "VERIFIED" ? (
                                                                            <ShieldCheck size={16} className="text-emerald-500" />
                                                                        ) : null}
                                                                    </div>
                                                                    <p className="text-sm font-semibold text-slate-500 mt-0.5">{s.profession}</p>
                                                                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                                                      {s.rank != null
                                                                        ? `Rank #${s.rank}${s.rankingScore != null ? ` · score ${s.rankingScore}` : ""}`
                                                                        : (s.bio || "Top ranked for this category.")}
                                                                    </p>
                                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                                        {(s.skills || []).slice(0, 4).map((skill) => (
                                                                            <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2 w-full sm:w-auto">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => navigate(`/provider/task-performer-profile/${s.id}?taskId=${taskId}`, { state: { taskId, taskData, tasker: s } })}
                                                                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
                                                                    >
                                                                        View Profile
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => navigate(`/provider/confirm-and-pay`, {
                                                                            state: {
                                                                                performer: {
                                                                                    id: s.id,
                                                                                    taskerId: s.id,
                                                                                    person: s.displayName,
                                                                                    name: s.profession,
                                                                                    rate: s.hourlyRate ? `₹${Number(s.hourlyRate).toLocaleString("en-IN")}/hr` : "",
                                                                                    rating: s.ratingAvg,
                                                                                    avatar: s.avatar,
                                                                                    interestId: 'direct_hire',
                                                                                },
                                                                                taskData,
                                                                            },
                                                                        })}
                                                                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700"
                                                                    >
                                                                        Hire
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

// PRESET PREMIUM CARD COMPONENT
const PerformerCard = ({ performer, type, taskId, taskData, navigate, onReject, rejecting }) => {
    const isInterestedApplicant = type === 'applicant' && Boolean(performer.interestId);
    const profileUrl = `/provider/task-performer-profile/${performer.id}?taskId=${encodeURIComponent(taskId)}${isInterestedApplicant ? '&source=interest' : ''}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(16, 185, 129, 0.08)" }}
            className="group bg-white border border-[#a7f3d0] hover:border-emerald-500/50 rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col sm:flex-row items-start gap-6 relative"
        >
            {/* Avatar Frame */}
            <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
                {performer.avatar ? (
                    <img
                        src={performer.avatar}
                        alt={performer.person}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-2xl uppercase">
                        {performer.person?.charAt(0)}
                    </div>
                )}
            </div>

            {/* Performer Details */}
            <div className="flex-1 min-w-0 pr-8 sm:pr-14">
                {/* Professional Title */}
                <h4 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                    {performer.name || "Web Designer"}
                </h4>

                {/* Display Name */}
                <p className="text-sm font-semibold text-slate-500 mt-1">
                    {performer.person}
                </p>

                {/* Rating & Tasks Completed */}
                <div className="flex items-center gap-1.5 mt-2.5">
                    <div className="flex text-amber-400 shrink-0 gap-0.5">
                        {[...Array(5)].map((_, idx) => {
                            const ratingValue = performer.rating || 0;
                            const isFilled = idx < Math.round(ratingValue);
                            return (
                                <Star
                                    key={idx}
                                    size={15}
                                    fill={isFilled ? "currentColor" : "none"}
                                    className={isFilled ? "text-amber-400 stroke-none" : "text-slate-300"}
                                />
                            );
                        })}
                    </div>
                    <span className="text-xs font-black text-slate-700 leading-none">
                        {typeof performer.rating === 'number' ? performer.rating.toFixed(1) : "0.0"}/5
                    </span>
                </div>

                {/* Tasks Completed */}
                <p className="text-xs font-bold text-slate-400 mt-1.5">
                    {performer.tasks || "0 Tasks"} Completed
                </p>

                {/* Bio statement */}
                <p className="text-sm font-semibold text-slate-500 leading-relaxed mt-3 max-w-xl">
                    {performer.desc}
                </p>
            </div>

            {/* Bookmark Ribbon Icon */}
            <button className="absolute top-6 right-6 text-[#a7f3d0] hover:text-emerald-500 transition-colors p-1" title="Bookmark Performer">
                <Bookmark className="w-6 h-6 stroke-[1.8]" />
            </button>

            {/* Actions Bar */}
            <div className="sm:absolute bottom-6 right-6 flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                {performer.userId && (performer.status === 'ASSIGNED' || performer.status === 'ACCEPTED') && (
                    <button
                        onClick={() => navigate(`/provider/chats?userId=${performer.userId}&taskId=${taskId}`)}
                        className="p-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-full border border-slate-200/60 transition-all active:scale-95"
                        title="Message Performer"
                    >
                        <MessageCircle size={16} strokeWidth={2.5} />
                    </button>
                )}

                {performer.status === 'ASSIGNED' || performer.status === 'ACCEPTED' ? (
                    <button
                        onClick={() => navigate(`/provider/active-task/${taskId}`)}
                        className="px-5 py-2.5 bg-slate-950 text-white rounded-full font-black text-xs hover:bg-slate-900 transition-all shadow-md active:scale-95"
                    >
                        Manage Task
                    </button>
                ) : (
                    <>
                        {type === 'applicant' && performer.interestId && performer.status === 'PENDING' && onReject && (
                            <button
                                onClick={() => onReject(performer.interestId)}
                                disabled={rejecting}
                                className="px-5 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-extrabold rounded-full text-xs transition-all active:scale-95 disabled:opacity-50"
                            >
                                {rejecting ? "Rejecting..." : "Reject"}
                            </button>
                        )}
                        <button
                            onClick={() => navigate(`/provider/confirm-and-pay`, { state: { performer, taskData } })}
                            className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 font-extrabold rounded-full text-xs transition-all active:scale-95"
                        >
                            Hire
                        </button>
                    </>
                )}

                <button
                    onClick={() => navigate(profileUrl, {
                        state: {
                            taskId,
                            taskData,
                            ...(isInterestedApplicant ? {
                                profileSource: 'task-interest',
                                interestId: performer.interestId,
                            } : {}),
                        },
                    })}
                    className="px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold rounded-full text-xs shadow-sm transition-all active:scale-95"
                >
                    View Profile
                </button>
            </div>
        </motion.div>
    );
};

export default TaskApplicantsPage;
