import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { getWalletBalance, listMyTasks, getTaskerRankings, getProviderProfile } from "../services/api";
import { mapRankedTasker } from "../../../utils/taskerRankings";
import { parseReviewCommentsFromTask } from "../utils/taskSpotlight";

const ProviderDataContext = createContext(null);
const DASHBOARD_CACHE_KEY = "onit_provider_dashboard_cache_v2";

export const ProviderDataProvider = ({ children }) => {
    const { user } = useAuth();
    // Helper to read cache synchronously during state initialization
    const cachedDash = (() => {
        const cacheKey = DASHBOARD_CACHE_KEY;
        const cachedStr = sessionStorage.getItem(cacheKey);
        if (cachedStr) {
            try {
                const cached = JSON.parse(cachedStr);
                const age = Date.now() - (cached.timestamp || 0);
                const isFresh = age < 20 * 60 * 1000; // 20 minutes
                if (isFresh && cached.stats && cached.activities && cached.performers) {
                    return cached;
                }
            } catch (e) {}
        }
        return null;
    })();

    const initialLoadDone = React.useRef(false);

    const [stats, setStats] = useState(cachedDash ? cachedDash.stats : null);
    const [activities, setActivities] = useState(cachedDash ? cachedDash.activities : []);
    const [performers, setPerformers] = useState(cachedDash ? cachedDash.performers : []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toFiniteNumber = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : undefined;
    };

    const refreshProviderData = useCallback(async (force = false) => {
        const cacheKey = DASHBOARD_CACHE_KEY;

        // 1. Read from cache if it exists, is fresh (< 20 mins), and we are not forcing a refresh
        if (!force) {
            const cachedStr = sessionStorage.getItem(cacheKey);
            if (cachedStr) {
                try {
                    const cached = JSON.parse(cachedStr);
                    const age = Date.now() - (cached.timestamp || 0);
                    const isFresh = age < 20 * 60 * 1000; // 20 minutes
                    if (isFresh && cached.stats && cached.activities && cached.performers) {
                        setStats(cached.stats);
                        setActivities(cached.activities);
                        setPerformers(cached.performers);
                        setLoading(false);
                        initialLoadDone.current = true;
                        return; // Loaded instantly from cache!
                    }
                } catch (e) {
                    console.error("[ProviderDataContext] Failed to parse dashboard cache", e);
                }
            }
        }

        try {
            // Only set loading on the very first cold load (no data in state yet)
            if (!initialLoadDone.current) {
                setLoading(true);
            }
            setError(null);

            const [walletData, tasksResponse] = await Promise.all([
                getWalletBalance().catch(() => ({ balance: 0, available: 0 })),
                listMyTasks({ limit: 50 }).catch(() => ({ data: [], pagination: { total: 0 } })),
            ]);

            // Process Tasks (Sort to ensure deterministic order for JSON.stringify)
            let tasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : (Array.isArray(tasksResponse) ? tasksResponse : []);
            
            // Filter out locally deleted/cancelled tasks to mask backend delays
            try {
                const deleted = JSON.parse(localStorage.getItem('onit_deleted_tasks') || '[]');
                if (deleted.length > 0) {
                    tasks = tasks.filter(t => !deleted.includes(t.id) && !deleted.includes(t._id));
                }
            } catch (e) {}

            tasks.sort((a, b) => String(a.id || a._id).localeCompare(String(b.id || b._id)));
            
            // Format Stats
            const formattedStats = [
                { label: "Applicants", value: tasks.filter(t => String(t.status).toUpperCase() === 'PUBLISHED').length.toString() },
                { label: "Active", value: tasks.filter(t => ['IN_PROGRESS', 'CLAIMED', 'SUBMITTED', 'ASSIGNED', 'ACCEPTED', 'ACTIVE'].includes(String(t.status).toUpperCase())).length.toString() },
                { label: "Completed", value: tasks.filter(t => String(t.status).toUpperCase() === 'COMPLETED').length.toString() },
                { label: "Drafts", value: tasks.filter(t => String(t.status).toUpperCase() === 'DRAFT').length.toString() }
            ];
            setStats(prev => JSON.stringify(prev) === JSON.stringify(formattedStats) ? prev : formattedStats);

            // Format Activities
            const mappedActivities = tasks.map(t => {
                const performer = (Array.isArray(t.taskAssignments) ? t.taskAssignments[0]?.tasker : t.taskAssignments?.tasker)
                    || t.tasker || t.performer || (Array.isArray(t.applicants) ? t.applicants[0]?.tasker : null);

                const reviewComments = parseReviewCommentsFromTask(t);

                return {
                    id: t.id || t._id,
                    title: t.title || "Untitled task",
                    task: t.title || t.description?.substring(0, 30) + '...',
                    description: t.description || "",
                    category: t.category || "General",
                    budget: `₹${t.priceAmount || 0}`,
                    deadline: t.dueAt ? new Date(t.dueAt).toLocaleDateString() : 'N/A',
                    time: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent',
                    createdAt: t.createdAt,
                    rawStatus: t.status,
                    status: t.status,
                    skills: t.skills || t.requiredSkills || [],
                    taskType: t.taskType || t.type,
                    filesCount: t.details?.filesCount || t.files?.length || 0,
                    applicants: Array.isArray(t.applicants) ? t.applicants : [],
                    applicantsCount: Array.isArray(t.applicants)
                        ? t.applicants.length
                        : (t.interestsCount ?? t._count?.interests ?? t.applicantCount ?? 0),
                    taskAssignments: t.taskAssignments || [],
                    reviewComments,
                    rejectionReason: t.rejectionReason || t.reason || t.reviewFeedback || null,
                    reviewFeedback: t.reviewFeedback || t.rejectionReason || t.reason || null,
                    estimatedReviewMinutes: t.estimatedReviewMinutes || t.reviewEtaMinutes || 24,
                    matchingStats: {
                        views: toFiniteNumber(t.viewsCount ?? t.viewCount ?? t.stats?.views),
                        visibility: t.visibilityLabel || t.stats?.visibility || undefined,
                        profileMatch: toFiniteNumber(t.profileMatchPercent ?? t.stats?.profileMatch),
                    },
                    performerAvatar: performer?.user?.profilePicUrl
                        || `https://ui-avatars.com/api/?name=${performer?.displayName || 'P'}&background=random`,
                    performerName: performer?.displayName || "Unassigned",
                    performerAvatars: Array.isArray(t.matchedPerformers)
                        ? t.matchedPerformers.map((p) => p?.user?.profilePicUrl || p?.profilePicUrl).filter(Boolean)
                        : undefined,
                };
            });
            setActivities(prev => JSON.stringify(prev) === JSON.stringify(mappedActivities) ? prev : mappedActivities);

            // Let the dashboard paint with the wallet/tasks data immediately.
            // Rankings and profile enrichment continue below and must not block
            // the primary provider workspace on a cold load.
            setLoading(false);

            // Enrichment is non-critical for the first paint.
            const [taskersResponse, providerProfile] = await Promise.all([
                getTaskerRankings({ limit: 10 }).catch(() => ({ data: [] })),
                getProviderProfile().catch(() => null),
            ]);
            if (providerProfile?.completedTasksCount != null) {
                setStats((previous) => previous?.map((item) => item.label === "Completed"
                    ? { ...item, value: String(providerProfile.completedTasksCount) }
                    : item));
            }

            // Format Performers from rankings API
            let taskers = Array.isArray(taskersResponse?.data) ? taskersResponse.data : (Array.isArray(taskersResponse) ? taskersResponse : []);
            taskers.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999) || String(a.taskerId || a.id).localeCompare(String(b.taskerId || b.id)));
            const mappedPerformers = taskers.map((t) => {
                const s = mapRankedTasker(t);
                return {
                    id: s.id,
                    name: s.profession || "Task Performer",
                    person: s.displayName || "Anonymous",
                    rating: s.ratingAvg || 0,
                    reviews: s.stats?.ratingCount || 0,
                    bio: s.bio || "No bio available.",
                    tasks: `${s.completedTasksCount ?? 0} Tasks`,
                    avatar: s.avatar,
                    skills: s.skills || [],
                    rank: s.rank,
                    rankingScore: s.rankingScore,
                };
            });
            setPerformers(prev => JSON.stringify(prev) === JSON.stringify(mappedPerformers) ? prev : mappedPerformers);

            initialLoadDone.current = true;

            // Update Cache
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    timestamp: Date.now(),
                    stats: formattedStats,
                    activities: mappedActivities,
                    performers: mappedPerformers
                }));
            } catch (e) {
                console.error("[ProviderDataContext] Failed to write dashboard cache", e);
            }

        } catch (err) {
            console.error("[ProviderDataContext] Sync Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            const role = String(user.role || '').toUpperCase();
            if (role === 'PROVIDER' || role === 'ADMIN') {
                refreshProviderData();

                // Re-check cache on tab focus — fetches silently only if stale
                const onFocus = () => {
                    if (document.visibilityState === 'visible') {
                        refreshProviderData(false);
                    }
                };
                window.addEventListener('focus', onFocus);
                document.addEventListener('visibilitychange', onFocus);

                // Real-time refresh on push notification
                const onUpdate = () => {
                    if (document.visibilityState === 'visible') {
                        refreshProviderData(true);
                    }
                };
                window.addEventListener('onit-update', onUpdate);

                return () => {
                    window.removeEventListener('focus', onFocus);
                    document.removeEventListener('visibilitychange', onFocus);
                    window.removeEventListener('onit-update', onUpdate);
                };
            }
        }
    }, [user, refreshProviderData]);

    const contextValue = React.useMemo(() => ({
        stats, 
        activities, 
        performers, 
        loading, 
        error, 
        refreshData: () => refreshProviderData(true) 
    }), [stats, activities, performers, loading, error, refreshProviderData]);

    return (
        <ProviderDataContext.Provider value={contextValue}>
            {children}
        </ProviderDataContext.Provider>
    );
};

export const useProviderData = () => {
    const context = useContext(ProviderDataContext);
    if (!context) {
        throw new Error('useProviderData must be used within a ProviderDataProvider');
    }
    return context;
};
