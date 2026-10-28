import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Star,
    Bookmark,
    Clock,
    TrendingUp,
    MessageSquare,
    ThumbsUp,
    Loader2,
    BadgeCheck,
    Calendar,
    IndianRupee,
    Package,
    CheckCircle2,
} from 'lucide-react';
import PerformerHeader from '../components/PerformerHeader';
import {
    getProviderProfile,
    getProviderReviews,
    getTasksFeed,
    getAssignedTasks,
    getMyInterests,
    getTaskDetails,
} from '../services/api';
import { resolveClientDisplayName } from '../utils/performerClientUtils';

const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'posted', label: 'Posted Tasks' },
];

function StarRow({ rating, size = 14 }) {
    const rounded = Math.round(Number(rating) || 0);
    return (
        <div className="flex items-center gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    fill={s <= rounded ? 'currentColor' : 'none'}
                    stroke="currentColor"
                />
            ))}
        </div>
    );
}

function SidebarInfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
            <div className="flex min-w-0 items-center gap-2 text-[var(--color-text-muted)]">
                <Icon size={15} strokeWidth={2.2} className="shrink-0" />
                <span className="font-medium">{label}</span>
            </div>
            <span className="shrink-0 font-bold text-[var(--color-text)]">{value}</span>
        </div>
    );
}

function TrustIndicator({ icon: Icon, label, value, tone }) {
    const tones = {
        green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        blue: 'bg-sky-50 text-sky-600 border-sky-100',
        purple: 'bg-violet-50 text-violet-600 border-violet-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
    };
    return (
        <div className={`rounded-xl border p-3 ${tones[tone]}`}>
            <Icon size={16} strokeWidth={2.2} className="mb-2" />
            <p className="text-[10px] font-semibold leading-tight opacity-80">{label}</p>
            <p className="mt-1 text-[13px] font-bold">{value}</p>
        </div>
    );
}

function ClientStatBox({ label, value, tone }) {
    const tones = {
        green: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        blue: 'bg-sky-50 border-sky-100 text-sky-700',
        rose: 'bg-rose-50 border-rose-100 text-rose-700',
    };
    return (
        <div className={`flex flex-1 flex-col rounded-xl border px-4 py-4 ${tones[tone]}`}>
            <span className="text-[22px] font-bold tabular-nums leading-none">{value}</span>
            <span className="mt-2 text-[11px] font-semibold opacity-80">{label}</span>
        </div>
    );
}

function CategoryProgressRow({ name, percent }) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[var(--color-text)]">{name}</span>
                <span className="font-bold text-[var(--color-text-muted)]">{percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function formatRelativeDate(dateStr) {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PerformerClientProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [client, setClient] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [postedTasks, setPostedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savedLocally, setSavedLocally] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const queryParams = new URLSearchParams(location.search);
    const fromTaskId = queryParams.get('fromTask');

    useEffect(() => {
        const fetchClientProfile = async () => {
            if (!id || id === ':id') {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);

                let providerProfileId = id;
                let providerData = null;
                let matchingTask = null;

                try {
                    const res = await getProviderProfile(providerProfileId);
                    providerData = res?.data || res;
                } catch (err) {
                    console.log('Direct provider profile fetch failed:', err);
                }

                if (!providerData?.id || !(
                    providerData.organization ||
                    providerData.username ||
                    providerData.user?.displayName ||
                    providerData.user?.name
                )) {
                    try {
                        if (fromTaskId) {
                            try {
                                const taskRes = await getTaskDetails(fromTaskId);
                                matchingTask = taskRes?.data || taskRes;
                            } catch (_) {}
                        }

                        if (!matchingTask) {
                            const tasksRes = await getTasksFeed();
                            const tasksData = tasksRes?.tasks || tasksRes?.data || (Array.isArray(tasksRes) ? tasksRes : []);
                            if (Array.isArray(tasksData)) {
                                matchingTask = tasksData.find((t) =>
                                    String(t.providerId) === String(id) ||
                                    String(t.provider?.id) === String(id) ||
                                    String(t.userId) === String(id)
                                );
                            }
                        }

                        if (!matchingTask) {
                            try {
                                const assignedRes = await getAssignedTasks();
                                const assignedData = assignedRes?.data || assignedRes || [];
                                if (Array.isArray(assignedData)) {
                                    matchingTask = assignedData.find((t) =>
                                        String(t.providerId) === String(id) ||
                                        String(t.provider?.id) === String(id)
                                    );
                                }
                            } catch (_) {}
                        }

                        if (!matchingTask) {
                            try {
                                const interestsRes = await getMyInterests();
                                const interestsData = interestsRes?.data || interestsRes || [];
                                if (Array.isArray(interestsData)) {
                                    matchingTask = interestsData.find((t) =>
                                        String(t.providerId) === String(id) ||
                                        String(t.provider?.id) === String(id)
                                    );
                                }
                            } catch (_) {}
                        }

                        let resolvedProfileId = matchingTask?.provider?.provider?.id;
                        if (!resolvedProfileId && matchingTask?.id) {
                            try {
                                const fullTask = await getTaskDetails(matchingTask.id);
                                resolvedProfileId = (fullTask?.data || fullTask)?.provider?.provider?.id;
                            } catch (_) {}
                        }
                        if (!resolvedProfileId) resolvedProfileId = matchingTask?.providerId;

                        if (resolvedProfileId && resolvedProfileId !== id) {
                            providerProfileId = resolvedProfileId;
                            const retryRes = await getProviderProfile(providerProfileId);
                            providerData = retryRes?.data || retryRes;
                        }
                    } catch (resolveErr) {
                        console.error('Failed to resolve provider UUID:', resolveErr);
                    }
                }

                if (providerData) {
                    if (!providerData.organization && matchingTask?.provider?.provider?.organization) {
                        providerData.organization = matchingTask.provider.provider.organization;
                    }
                    if (!providerData.username && matchingTask?.provider?.username) {
                        providerData.username = matchingTask.provider.username;
                    }
                    if (!providerData.user?.displayName && matchingTask?.provider?.displayName) {
                        providerData.user = {
                            ...(providerData.user || {}),
                            displayName: matchingTask.provider.displayName,
                        };
                    }
                    setClient(providerData);
                } else if (matchingTask?.provider) {
                    setClient({
                        id: matchingTask.provider.provider?.id || id,
                        organization: matchingTask.provider.provider?.organization || matchingTask.provider.organization,
                        username: matchingTask.provider.username || matchingTask.provider.displayName || matchingTask.provider.name,
                        user: matchingTask.provider,
                        createdAt: matchingTask.provider.provider?.createdAt || matchingTask.provider.createdAt,
                        locationCity: matchingTask.provider.provider?.locationCity || matchingTask.provider.location,
                    });
                }

                const activeId = providerData?.id || providerProfileId || id;

                try {
                    const reviewsRes = await getProviderReviews(activeId);
                    const reviewsData = reviewsRes?.data || reviewsRes || [];
                    setReviews(Array.isArray(reviewsData) ? reviewsData : []);
                } catch (_) {
                    setReviews([]);
                }

                try {
                    const tasksRes = await getTasksFeed();
                    const tasksData = tasksRes?.tasks || tasksRes?.data || (Array.isArray(tasksRes) ? tasksRes : []);
                    if (Array.isArray(tasksData)) {
                        const profileUUIDs = [providerData?.id, providerProfileId].filter(Boolean).map(String);
                        const userIDs = [providerData?.user?.id, id].filter(Boolean).map(String);
                        const filtered = tasksData.filter((t) => {
                            const taskProvId = t.providerId ? String(t.providerId) : null;
                            const taskProvUserId = t.provider?.id ? String(t.provider.id) : null;
                            const taskProvProfileId = t.provider?.provider?.id ? String(t.provider.provider.id) : null;
                            return (
                                profileUUIDs.includes(taskProvId) ||
                                profileUUIDs.includes(taskProvProfileId) ||
                                userIDs.includes(taskProvId) ||
                                userIDs.includes(taskProvUserId)
                            );
                        });
                        setPostedTasks(filtered);
                    }
                } catch (_) {
                    setPostedTasks([]);
                }
            } catch (err) {
                console.error('Failed to fetch client profile:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClientProfile();
    }, [id, fromTaskId]);

    const viewModel = useMemo(() => {
        if (!client && !isLoading) return null;

        const ratingCount = client?.user?.ratingCount ?? reviews.length ?? 0;
        const ratingAvg =
            client?.user?.ratingAvg ??
            (reviews.length > 0
                ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
                : null);

        const name = resolveClientDisplayName(null, client);

        const subtitle =
            client?.organization && client?.username && client.organization !== client.username
                ? client.username
                : client?.user?.headline ||
                  client?.locationCity ||
                  (client?.organization ? 'Organization' : 'Individual Client');

        const categories = [
            ...new Set([
                ...(client?.domains || []),
                ...postedTasks.map((t) => t.category).filter(Boolean),
            ]),
        ];

        const tasksPosted = postedTasks.length || client?.tasksPostedCount || 0;

        const createdAt = client?.createdAt || client?.user?.createdAt;
        const activeSince = createdAt
            ? new Date(createdAt).getFullYear().toString()
            : '—';

        const monthsActive = createdAt
            ? Math.max(1, Math.ceil((Date.now() - new Date(createdAt).getTime()) / (30 * 24 * 60 * 60 * 1000)))
            : 1;
        const avgMonthlyTasks = tasksPosted > 0 ? Math.round(tasksPosted / monthsActive) : '—';

        const formatStat = (val, suffix = '') => {
            if (val === null || val === undefined || val === '') return '—';
            return `${val}${suffix}`;
        };

        const paymentRate = client?.paymentOnTimeRate ?? client?.user?.paymentOnTimeRate;
        const disputeRate = client?.disputeRate ?? client?.user?.disputeRate;
        const responseTime = client?.stats?.hasSufficientResponseData
            ? client.stats.avgResponseLabel
            : null;

        const categoryCounts = {};
        postedTasks.forEach((t) => {
            if (t.category) categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
        });
        const categoryTotal = Object.values(categoryCounts).reduce((a, b) => a + b, 0) || categories.length || 1;
        const preferredCategories = (Object.keys(categoryCounts).length > 0
            ? Object.entries(categoryCounts)
            : categories.map((c) => [c, 1])
        )
            .map(([cat, count]) => ({
                name: cat,
                percent: Math.round((count / categoryTotal) * 100),
            }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 6);

        return {
            name,
            subtitle,
            initials: name.substring(0, 2).toUpperCase(),
            avatar: client?.user?.profilePicUrl,
            verified: !!(client?.user?.ratingAvg || ratingCount > 0 || client?.organization),
            rating: ratingAvg != null ? Number(ratingAvg).toFixed(1) : null,
            reviewsCount: ratingCount,
            about:
                client?.about ||
                client?.bio ||
                client?.user?.bio ||
                client?.description ||
                '',
            categories,
            preferredCategories,
            activeSince,
            avgMonthlyTasks,
            providerUserId: client?.user?.id,
            stats: {
                tasksPosted: tasksPosted > 0 ? String(tasksPosted) : '—',
                paymentRate: paymentRate != null ? `${paymentRate}%` : '—',
                disputeRate: disputeRate != null ? `${disputeRate}%` : '—',
            },
            trust: {
                payments: paymentRate != null ? `${paymentRate}%` : '—',
                delivery: formatStat(client?.onTimeDeliveryRate ?? client?.user?.onTimeDeliveryRate, '%'),
                workload: avgMonthlyTasks !== '—' ? `${avgMonthlyTasks}/mo` : '—',
                reviews: ratingAvg != null ? `${Number(ratingAvg).toFixed(1)}/5` : '—',
            },
            responseTime: formatStat(
                responseTime,
                typeof responseTime === 'number' ? ' avg' : ''
            ),
        };
    }, [client, reviews, postedTasks, isLoading]);

    const handleMessageClient = () => {
        if (viewModel?.providerUserId) {
            navigate(`/performer/chats?userId=${viewModel.providerUserId}`);
            return;
        }
        navigate('/performer/chats');
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)]">
                <Loader2 size={40} className="animate-spin text-[var(--color-primary)]" />
                <p className="mt-3 text-sm font-semibold text-[var(--color-text-muted)]">Loading client details…</p>
            </div>
        );
    }

    if (!viewModel) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] p-6">
                <p className="text-[var(--color-text-muted)]">Client not found.</p>
                <button type="button" onClick={() => navigate(-1)} className="mt-4 text-sm font-bold text-[var(--color-primary)]">
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] pb-12 pt-[80px] font-sans text-[var(--color-text)] lg:pl-[220px]">
            <PerformerHeader activePage="home" />

            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
                <button
                    type="button"
                    onClick={() => (fromTaskId ? navigate(`/performer/task/${fromTaskId}`) : navigate(-1))}
                    className="mb-6 flex items-center gap-2 text-[14px] font-bold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
                >
                    <ChevronLeft size={18} />
                    Client Details
                </button>

                <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                    {/* Left sidebar */}
                    <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-[96px]">
                        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 text-center shadow-[var(--shadow-sm)]">
                            <div className="relative mx-auto mb-4 w-fit">
                                {viewModel.avatar ? (
                                    <img
                                        src={viewModel.avatar}
                                        alt={viewModel.name}
                                        className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-xl font-bold text-white">
                                        {viewModel.initials}
                                    </div>
                                )}
                                {viewModel.verified ? (
                                    <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-white ring-2 ring-white">
                                        <BadgeCheck size={14} />
                                    </span>
                                ) : null}
                            </div>

                            <h1 className="text-[20px] font-bold text-[var(--color-text)]">{viewModel.name}</h1>
                            <p className="mt-1 text-[13px] font-medium text-[var(--color-text-muted)]">{viewModel.subtitle}</p>

                            <div className="mt-3 flex items-center justify-center gap-2">
                                {viewModel.rating ? (
                                    <>
                                        <StarRow rating={viewModel.rating} />
                                        <span className="text-[13px] font-bold text-[var(--color-text)]">
                                            {viewModel.rating}/5
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-[12px] font-medium text-[var(--color-text-muted)]">No ratings yet</span>
                                )}
                            </div>
                        </article>

                        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)]">
                            <div className="divide-y divide-[var(--color-border)]">
                                <SidebarInfoRow icon={Calendar} label="Active Since" value={viewModel.activeSince} />
                                {viewModel.responseTime && (
                                    <SidebarInfoRow icon={Clock} label="Avg Response Time" value={viewModel.responseTime} />
                                )}
                                <SidebarInfoRow icon={TrendingUp} label="Avg Monthly Tasks" value={viewModel.avgMonthlyTasks} />
                            </div>

                            <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                                <p className="mb-3 text-[12px] font-bold text-[var(--color-text-muted)]">Common Task Categories</p>
                                {viewModel.categories.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {viewModel.categories.map((cat) => (
                                            <span
                                                key={cat}
                                                className="rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold text-[var(--color-primary)]"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[12px] font-medium text-[var(--color-text-muted)]">No categories listed yet.</p>
                                )}
                            </div>
                        </article>

                        <section>
                            <h2 className="mb-3 text-[14px] font-bold text-[var(--color-text)]">Trust Indicators</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <TrustIndicator icon={IndianRupee} label="On-time payments" value={viewModel.trust.payments} tone="green" />
                                <TrustIndicator icon={Package} label="On-time delivery" value={viewModel.trust.delivery} tone="blue" />
                                <TrustIndicator icon={TrendingUp} label="Consistent workload" value={viewModel.trust.workload} tone="purple" />
                                <TrustIndicator icon={CheckCircle2} label="Good reviews" value={viewModel.trust.reviews} tone="amber" />
                            </div>
                        </section>
                    </aside>

                    {/* Right main content */}
                    <div className="space-y-5 lg:col-span-8">
                        <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]">
                            <div className="border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 p-1.5">
                                <div className="flex gap-1">
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
                                                activeTab === tab.id
                                                    ? 'bg-white text-[var(--color-text)] shadow-sm'
                                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <section>
                                            <h2 className="mb-3 text-[15px] font-bold text-[var(--color-text)]">About</h2>
                                            <p className="text-[14px] font-medium leading-relaxed text-[var(--color-text-muted)]">
                                                {viewModel.about || 'No description available for this client yet.'}
                                            </p>
                                        </section>

                                        <section>
                                            <div className="mb-3 flex items-center gap-2">
                                                <TrendingUp size={16} className="text-[var(--color-primary)]" />
                                                <h2 className="text-[15px] font-bold text-[var(--color-text)]">Client Stats</h2>
                                            </div>
                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                <ClientStatBox label="Tasks Posted" value={viewModel.stats.tasksPosted} tone="green" />
                                                <ClientStatBox label="Payment Rate" value={viewModel.stats.paymentRate} tone="blue" />
                                                <ClientStatBox label="Dispute Rate" value={viewModel.stats.disputeRate} tone="rose" />
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="mb-4 text-[15px] font-bold text-[var(--color-text)]">Preferred Categories</h2>
                                            {viewModel.preferredCategories.length > 0 ? (
                                                <div className="space-y-4">
                                                    {viewModel.preferredCategories.map((cat) => (
                                                        <CategoryProgressRow key={cat.name} name={cat.name} percent={cat.percent} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
                                                    No category data available yet.
                                                </p>
                                            )}
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-[15px] font-bold text-[var(--color-text)]">Reviews</h2>
                                            <span className="text-[12px] font-semibold text-[var(--color-text-muted)]">
                                                {viewModel.reviewsCount} reviews
                                            </span>
                                        </div>

                                        {reviews.length > 0 ? (
                                            <div className="space-y-3">
                                                {reviews.map((rev) => {
                                                    const reviewerName =
                                                        rev.user?.name ||
                                                        rev.user?.username ||
                                                        rev.user?.email?.split('@')[0] ||
                                                        'Performer';
                                                    const reviewerRole = rev.user?.headline || rev.task?.category || 'Tasker';
                                                    const reviewerAvatar =
                                                        rev.user?.profilePicUrl ||
                                                        `https://api.dicebear.com/7.x/initials/svg?seed=${reviewerName}`;
                                                    const rating = Number(rev.rating) || 0;

                                                    return (
                                                        <article
                                                            key={rev.id || rev._id}
                                                            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <img
                                                                    src={reviewerAvatar}
                                                                    alt={reviewerName}
                                                                    className="h-10 w-10 shrink-0 rounded-full border border-[var(--color-border)] object-cover"
                                                                />
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                                        <div>
                                                                            <p className="text-[14px] font-bold text-[var(--color-text)]">{reviewerName}</p>
                                                                            <p className="text-[12px] font-medium text-[var(--color-text-muted)]">{reviewerRole}</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <StarRow rating={rating} size={12} />
                                                                            <span className="text-[12px] font-bold text-[var(--color-text)]">
                                                                                {rating.toFixed(1)}/5
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <p className="mt-3 text-[13px] font-medium leading-relaxed text-[var(--color-text-muted)]">
                                                                        {rev.comment || 'No written feedback provided.'}
                                                                    </p>
                                                                    <div className="mt-3 flex items-center justify-between">
                                                                        <span className="text-[11px] font-semibold text-[var(--color-text-subtle)]">
                                                                            {formatRelativeDate(rev.createdAt)}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-text-muted)]"
                                                                        >
                                                                            <ThumbsUp size={12} />
                                                                            Helpful ({rev.helpfulCount ?? 0})
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </article>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-[var(--color-border)] px-5 py-10 text-center">
                                                <p className="text-[13px] font-semibold text-[var(--color-text-muted)]">No reviews yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'posted' && (
                                    <div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-[15px] font-bold text-[var(--color-text)]">Posted Tasks</h2>
                                            <span className="text-[12px] font-semibold text-[var(--color-text-muted)]">
                                                {postedTasks.length} tasks
                                            </span>
                                        </div>

                                        {postedTasks.length > 0 ? (
                                            <div className="space-y-3">
                                                {postedTasks.map((task) => (
                                                    <button
                                                        key={task.id}
                                                        type="button"
                                                        onClick={() => navigate(`/performer/task/${task.id}`)}
                                                        className="flex w-full items-start justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left transition hover:border-[var(--color-primary)]/30"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="truncate text-[14px] font-bold text-[var(--color-text)]">
                                                                {task.title || 'Untitled Task'}
                                                            </p>
                                                            <p className="mt-1 text-[12px] font-medium text-[var(--color-text-muted)]">
                                                                {task.category || 'General'}
                                                                {task.createdAt
                                                                    ? ` · ${new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <p className="text-[14px] font-bold text-[var(--color-primary)]">
                                                                {task.priceAmount
                                                                    ? `₹${Number(task.priceAmount).toLocaleString('en-IN')}`
                                                                    : '—'}
                                                            </p>
                                                            <ChevronRight size={16} className="ml-auto mt-1 text-[var(--color-text-muted)]" />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-[var(--color-border)] px-5 py-10 text-center">
                                                <p className="text-[13px] font-semibold text-[var(--color-text-muted)]">No posted tasks found.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </article>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setSavedLocally((v) => !v)}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-[14px] font-bold transition ${
                                    savedLocally
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                                        : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)]/30'
                                }`}
                            >
                                <Bookmark size={16} className={savedLocally ? 'fill-current' : ''} />
                                {savedLocally ? 'Saved' : fromTaskId ? 'Save Task' : 'Save Client'}
                            </button>

                            {fromTaskId ? (
                                <button
                                    type="button"
                                    onClick={() => navigate(`/performer/task/${fromTaskId}`)}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-[14px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)]"
                                >
                                    View Task
                                    <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleMessageClient}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-[14px] font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)]"
                                >
                                    <MessageSquare size={16} />
                                    Message Client
                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PerformerClientProfilePage;
