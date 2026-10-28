import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  FileText,
  Grid3X3,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  Wallet,
} from "lucide-react";
import { formatRankLabel, mapRankedTaskers } from "../../../utils/taskerRankings";
import { useAutoReload } from "../../../hooks/useAutoReload";
import { mapHomeCategoryToBrowseItem, useHomeContent } from "../../../services/homeContent";
import {
  getAssignedTasks,
  getBankAccount,
  getMyActiveTasks,
  getMyAnalyticsSummary,
  getMyAppliedTasks,
  getMyCompletedTasks,
  getMyTaskerProfile,
  getMyTaskerRanking,
  getTasksFeed,
  getWalletBalance,
  getGrowthProgress,
  getGrowthResources,
  getGrowthTrustScore,
  getDailyQuiz,
  getPerformerRecommendations,
  recordRecommendationClick,
  recordRecommendationImpression,
} from "../services/api";
import { filterNormalizedTasks, normalizeFeedTask, parseTasksFeed } from "../components/tasks/performerTaskUtils";
import PerformerHeader from "../components/PerformerHeader";

const onboardingSteps = [
  {
    title: "Complete Profile",
    body: "Add your skills, bio, and portfolio to stand out to clients.",
    cta: "Add Details",
    badge: "Next",
    icon: UserRound,
    path: "/performer/profile",
  },
  {
    title: "Verify Identity",
    body: "A verified badge builds trust and unlocks premium tasks.",
    cta: "Start Verification",
    badge: "Step 2",
    icon: ShieldCheck,
    path: "/performer/kyc",
  },
  {
    title: "Add Payment Method",
    body: "Set up your bank or UPI to receive earnings instantly.",
    cta: "Connect Account",
    badge: "Step 3",
    icon: Wallet,
    path: "/performer/banks",
  },
];

const workSteps = [
  { title: "Submit First Proposal", body: "Apply to any open task", icon: FileText, bg: "bg-blue-50", color: "text-blue-500" },
  { title: "Earn Your First Rating", body: "Complete a task to get reviewed", icon: Star, bg: "bg-amber-50", color: "text-amber-500" },
  { title: "Enter the Rankings", body: "Finish 1 task to get ranked", icon: Trophy, bg: "bg-emerald-50", color: "text-emerald-600" },
];

const howItWorks = [
  {
    title: "Browse Tasks",
    body: "Explore hundreds of verified tasks matched to your skills and experience level.",
    icon: Grid3X3,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "Apply to Projects",
    body: "Send targeted proposals with your portfolio, timeline, and competitive pricing.",
    icon: Megaphone,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-50",
  },
  {
    title: "Get Paid Securely",
    body: "Work with confidence through protected payments, milestone releases, and ratings.",
    icon: BadgeCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

function normalizeTaskForCard(task) {
  // Assigned/active endpoints may wrap the task under `task` or
  // `taskDetails`, while the feed returns the task flat. Normalize both.
  const source = task?.task || task?.taskDetails || task || {};
  const normalized = normalizeFeedTask({ ...source, title: source.title || source.taskTitle || task?.taskTitle });
  return {
    id: normalized.id || task?.id,
    client: source.clientName || source.providerName || task?.clientName || task?.providerName || "Verified Client",
    title: normalized.title !== "Untitled Task" ? normalized.title : (source.taskTitle || task?.taskTitle || "Task details unavailable"),
    tags: normalized.tags?.length ? normalized.tags.slice(0, 4) : [normalized.category || source.category || "Task"].filter(Boolean),
    deadline: normalized.deadline || source.deadline || task?.deadline || "Flexible",
    posted: normalized.postedAtLabel || source.postedAtLabel || task?.postedAtLabel || "Recently",
    budget: normalized.priceLabel || source.priceLabel || task?.priceLabel || source.budgetLabel || source.budget || "Budget TBD",
    raw: source,
  };
}

function unwrapPayload(res) {
  return res?.data ?? res ?? null;
}

function extractList(res) {
  const payload = unwrapPayload(res);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.tasks)) return payload.tasks;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.payoutMethods)) return payload.payoutMethods;
  return [];
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isVerifiedStatus(value) {
  return ["APPROVED", "VERIFIED", "COMPLETED", "SUCCESS"].includes(String(value || "").toUpperCase());
}

function getTaskCategory(task) {
  const normalized = normalizeFeedTask(task.raw || task);
  return normalized.category || task.category || task.raw?.category || "General";
}

function buildCategoryCounts(tasks) {
  return tasks.reduce((acc, task) => {
    const category = getTaskCategory(task);
    const keys = new Set([category, slugify(category)].filter(Boolean));
    keys.forEach((key) => {
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {});
}

function SectionShell({ title, subtitle, actionLabel, onAction, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold leading-tight text-slate-950">{title}</h2>
          {subtitle ? <p className="mt-1 text-[13px] font-medium text-slate-400">{subtitle}</p> : null}
        </div>
        {actionLabel ? (
          <button type="button" onClick={onAction} className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-700 transition hover:text-[var(--color-primary)]">
            {actionLabel}
            <ChevronRight size={14} strokeWidth={2.4} />
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function TaskCard({ task, onOpen }) {
  return (
    <article className="flex min-h-[216px] flex-col rounded-[12px] border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-slate-400">{task.client}</p>
          <button type="button" onClick={onOpen} className="mt-1 line-clamp-2 text-left text-[16px] font-semibold leading-snug text-slate-950 hover:text-[var(--color-primary)]">
            {task.title || "Task details unavailable"}
          </button>
        </div>
        <button type="button" onClick={onOpen} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-50 hover:text-slate-600" aria-label="Save task">
          <Bookmark size={17} strokeWidth={1.8} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {task.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
        <span>Deadline: {task.deadline}</span>
        <span>{task.posted}</span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-4 pt-4">
        <p className="text-[17px] font-semibold text-slate-950">{task.budget}</p>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 text-[11px] font-semibold text-white shadow-[0_2px_6px_rgba(0,153,102,0.18)] transition hover:bg-[var(--color-primary-hover)]"
        >
          View task
          <ArrowRight size={12} strokeWidth={2.4} />
        </button>
      </div>
    </article>
  );
}

function JourneyBanner({ stage, category, onAction }) {
  const copy = {
    loading: {
      eyebrow: "Preparing your workspace",
      title: "Getting your next best step ready",
      body: "Your tasks and progress are loading in the background.",
      action: null,
    },
    setup: {
      eyebrow: "Your next step",
      title: "Complete your profile to get reviewed",
      body: "Add your skills, portfolio, and identity details so OnIT can match you to the right category.",
      action: "Continue setup",
    },
    review: {
      eyebrow: `Application${category ? ` · ${category}` : ""}`,
      title: "Your category is under review",
      body: "You can preview the kind of work available while our team reviews your profile.",
      action: "View progress",
    },
    waitlisted: {
      eyebrow: `Category${category ? ` · ${category}` : ""}`,
      title: "Places are full right now",
      body: "Follow your improvement steps and keep your profile ready. Applications open when a place is approved.",
      action: "See improvement plan",
    },
    rejected: {
      eyebrow: `Category${category ? ` · ${category}` : ""}`,
      title: "Your next review starts here",
      body: "Use the feedback on your profile to strengthen your application before requesting another review.",
      action: "Improve profile",
    },
    working: {
      eyebrow: "Your work today",
      title: "Keep your active tasks moving",
      body: "Quality, deadlines, and reliable updates are what grow your Trust Score.",
      action: "Open active task",
    },
    ready: {
      eyebrow: `You're approved${category ? ` · ${category}` : ""}`,
      title: "Find work that fits your skills",
      body: "Browse matched tasks, send a thoughtful proposal, and start building your track record.",
      action: "Browse tasks",
    },
  }[stage] || null;
  if (!copy) return null;
  return <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] sm:p-6">
    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300">{copy.eyebrow}</p>
    <h1 className="mt-2 max-w-xl text-[25px] font-bold leading-tight tracking-tight sm:text-[30px]">{copy.title}</h1>
    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{copy.body}</p>
    {copy.action ? <button type="button" onClick={onAction} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-bold text-white transition active:scale-[0.98] hover:bg-emerald-400">
      {copy.action}<ArrowRight size={16} />
    </button> : <div className="mt-5 h-2 w-40 overflow-hidden rounded-full bg-white/15"><div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-400" /></div>}
  </section>;
}

function Greeting({ name }) {
  if (!name) return null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return <div className="flex items-end justify-between gap-4">
    <div><p className="text-sm font-medium text-slate-500">{greeting}</p><h2 className="mt-1 text-[28px] font-bold tracking-tight text-slate-950">{name} <span aria-hidden="true">👋</span></h2></div>
    <p className="hidden text-right text-xs font-medium text-slate-400 sm:block">Your work, progress, and next step</p>
  </div>;
}

function EmptyState({ title, body, action, onAction }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center"><p className="text-sm font-bold text-slate-700">{title}</p><p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">{body}</p>{action && <button type="button" onClick={onAction} className="mt-3 text-xs font-bold text-emerald-700">{action} →</button>}</div>;
}

const NEW_HOME_CACHE_KEY = "onit_performer_new_home_cache_v1";
const NEW_HOME_CACHE_TTL = 15 * 60 * 1000; // 15 min

function readNewHomeCache() {
  try {
    const raw = sessionStorage.getItem(NEW_HOME_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed.ts || 0) > NEW_HOME_CACHE_TTL) return null;
    return parsed.data || null;
  } catch { return null; }
}

function writeNewHomeCache(data) {
  try { sessionStorage.setItem(NEW_HOME_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch { /* ignore */ }
}

function SponsoredCard({ item, position }) {
  const [impressionId, setImpressionId] = useState(null);
  useEffect(() => {
    if (!item?.id) return undefined;
    const requestId = `new-home-${item.id}-${Date.now()}`;
    recordRecommendationImpression(item.id, { requestId, position, placement: "performer_new_home" })
      .then((response) => setImpressionId(response?.data?.impression_id || null))
      .catch(() => {});
    return undefined;
  }, [item?.id, position]);
  if (!item) return null;
  const open = () => {
    recordRecommendationClick(item.id, { requestId: `new-home-click-${item.id}-${Date.now()}`, impressionId: impressionId || undefined, placement: "performer_new_home" }).catch(() => {});
    window.open(item.destination_url, "_blank", "noopener,noreferrer");
  };
  return <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between px-5 pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{item.is_sponsored ? "Sponsored" : "OnIT resource"}</p><span className="text-[10px] font-medium text-slate-400">For your growth</span></div>{item.image_url ? <img src={item.image_url} alt="" className="mt-3 h-32 w-full object-cover" /> : <div className="mx-5 mt-3 flex h-24 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Sparkles size={28} /></div>}<div className="p-5"><p className="text-xs font-semibold text-emerald-700">{item.brand_name}</p><h3 className="mt-1 text-base font-bold text-slate-950">{item.title}</h3><p className="mt-1 text-sm leading-5 text-slate-600">{item.description}</p><button type="button" onClick={open} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white">Learn more <ArrowRight size={15} /></button></div></article>;
}

const PerformerDashboardPage = () => {
  const navigate = useNavigate();
  const { categories, loading: loadingCategories } = useHomeContent();
  const cachedHome = useMemo(() => readNewHomeCache(), []);
  const [tasks, setTasks] = useState(cachedHome?.tasks || []);
  const [loadingTasks, setLoadingTasks] = useState(!cachedHome);
  const [rankLabel, setRankLabel] = useState(cachedHome?.rankLabel || "Unranked");
  const [rankCategory, setRankCategory] = useState(cachedHome?.rankCategory || "Overall");
  const [rankingScore, setRankingScore] = useState(cachedHome?.rankingScore || 0);
  const [profile, setProfile] = useState(cachedHome?.profile || null);
  const [bankAccount, setBankAccount] = useState(cachedHome?.bankAccount || null);
  const [assignedTasks, setAssignedTasks] = useState(cachedHome?.assignedTasks || []);
  const [appliedTasks, setAppliedTasks] = useState(cachedHome?.appliedTasks || []);
  const [activeTasks, setActiveTasks] = useState(cachedHome?.activeTasks || []);
  const [completedTasks, setCompletedTasks] = useState(cachedHome?.completedTasks || []);
  const [topPerformers, setTopPerformers] = useState(cachedHome?.topPerformers || []);
  const [growthProgress, setGrowthProgress] = useState(null);
  const [growthTrust, setGrowthTrust] = useState(null);
  const [growthResources, setGrowthResources] = useState([]);
  const [dailyQuiz, setDailyQuiz] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [walletSummary, setWalletSummary] = useState(cachedHome?.walletSummary || null);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(Boolean(cachedHome));

  const displayTasks = useMemo(() => {
    const openTasks = filterNormalizedTasks(tasks.map(normalizeFeedTask), { search: "", pill: "all" }).map((task) => normalizeTaskForCard(task.raw || task));
    return openTasks.slice(0, 3);
  }, [tasks]);

  const displayName = useMemo(() => {
    const payload = unwrapPayload(profile);
    const tasker = payload?.tasker || payload?.profile || payload || {};
    return tasker.displayName || tasker.user?.name || tasker.user?.firstName || "";
  }, [profile]);

  const profileAccess = useMemo(() => {
    const payload = unwrapPayload(profile);
    const tasker = payload?.tasker || payload?.profile || payload || {};
    return Array.isArray(tasker.categoryAccesses) ? tasker.categoryAccesses : [];
  }, [profile]);

  const categoryCards = useMemo(() => {
    const counts = buildCategoryCounts(tasks);
    const cmsCards = categories.map((category, index) => {
      const item = mapHomeCategoryToBrowseItem(category, index);
      const count = counts[item.label] || counts[item.slug] || counts[item.category] || counts[slugify(item.label)] || 0;
      return { ...item, count, query: item.slug || item.label };
    });

    if (cmsCards.length) return cmsCards;

    return Object.entries(counts)
      .filter(([key]) => key && key !== slugify(key))
      .slice(0, 8)
      .map(([label, count], index) => ({
        id: slugify(label) || `category-${index}`,
        label,
        category: label,
        query: label,
        count,
        icon: Sparkles,
        iconColor: "#059669",
        iconBg: "#ecfdf5",
      }));
  }, [categories, tasks]);

  const performerStats = useMemo(() => {
    const profilePayload = unwrapPayload(profile);
    const tasker = profilePayload?.tasker || profilePayload?.profile || profilePayload || {};
    const skills = Array.isArray(tasker.skills) ? tasker.skills : [];
    const profileComplete = Boolean(
      (tasker.bio || tasker.description || tasker.displayName || tasker.user?.name) && (skills.length || tasker.profession || tasker.domain),
    );
    const identityVerified = isVerifiedStatus(tasker.kycStatus || tasker.verificationStatus || tasker.user?.kycStatus);
    const bankPayload = unwrapPayload(bankAccount);
    const payoutMethods = extractList(bankPayload);
    const hasPaymentMethod = Boolean(
      bankPayload?.id ||
      bankPayload?.accountNumberLast4 ||
      bankPayload?.upiId ||
      bankPayload?.bankName ||
      payoutMethods.length,
    );

    const appliedCount = appliedTasks.length;
    const activeCount = activeTasks.length + assignedTasks.length;
    const completedCount = completedTasks.length;
    const hasRankingActivity = rankLabel !== "Unranked" || rankingScore > 0;
    const hasActivity = appliedCount > 0 || activeCount > 0 || completedCount > 0 || hasRankingActivity;

    return {
      appliedCount,
      activeCount,
      completedCount,
      hasActivity,
      profileComplete,
      identityVerified,
      hasPaymentMethod,
      rating: Number(tasker.ratingAvg || tasker.stats?.ratingAvg || 0),
    };
  }, [activeTasks, appliedTasks, assignedTasks, bankAccount, completedTasks, profile, rankLabel, rankingScore]);

  const onboardingProgress = useMemo(() => {
    const statuses = [
      performerStats.profileComplete,
      performerStats.identityVerified,
      performerStats.hasPaymentMethod,
    ];
    const done = statuses.filter(Boolean).length;
    return {
      done,
      percent: Math.round((done / onboardingSteps.length) * 100),
      statuses,
      show: !performerStats.hasActivity && done < onboardingSteps.length,
    };
  }, [performerStats]);

  const rankingSteps = useMemo(() => {
    const statuses = [
      performerStats.appliedCount > 0 || performerStats.activeCount > 0 || performerStats.completedCount > 0,
      performerStats.rating > 0 || performerStats.completedCount > 0,
      rankLabel !== "Unranked" || rankingScore > 0 || performerStats.completedCount > 0,
    ];
    return workSteps.map((step, index) => ({
      ...step,
      completed: statuses[index],
    }));
  }, [performerStats, rankLabel, rankingScore]);

  const journey = useMemo(() => {
    if (!profileLoaded) return { stage: "loading", access: null };
    const access = growthProgress?.access?.[0] || profileAccess[0];
    if (activeTasks.length || assignedTasks.length) return { stage: "working", access };
    if (!performerStats.profileComplete || !performerStats.identityVerified) return { stage: "setup", access };
    if (access?.status === "WAITLISTED") return { stage: "waitlisted", access };
    if (access?.status === "REJECTED" || access?.status === "SUSPENDED") return { stage: "rejected", access };
    if (access?.status === "PENDING_REVIEW") return { stage: "review", access };
    if (access?.status === "APPROVED" && access.visibilityEnabled) return { stage: "ready", access };
    return { stage: "review", access };
  }, [activeTasks.length, assignedTasks.length, growthProgress, performerStats, profileAccess, profileLoaded]);

  const journeyPlan = growthProgress?.plans?.find((plan) => plan.categoryKey === journey.access?.categoryKey);
  const journeyMilestones = journeyPlan?.milestones || [];
  const nextMilestone = journeyMilestones.find((milestone) => milestone.progress?.status !== "COMPLETED");
  const activeWork = [...assignedTasks, ...activeTasks].slice(0, 3).map((item) => normalizeTaskForCard(item));
  const quizResource = growthResources.find((resource) => resource.type === "QUIZ" && (!journey.access?.categoryKey || resource.categoryKey === journey.access.categoryKey));
  const courseResources = growthResources.filter((resource) => resource.type === "COURSE" && (!journey.access?.categoryKey || resource.categoryKey === journey.access.categoryKey)).slice(0, 2);

  const fetchData = async (force = false) => {
    // If cache is fresh and not forced, skip the fetch entirely.
    if (!force && readNewHomeCache()) return;
    try {
      if (tasks.length === 0) setLoadingTasks(true);
      // First wave: data needed for the initial paint.
      const [feedRes, profileRes, assignedRes, appliedRes, activeRes] = await Promise.all([
        getTasksFeed({ page: 1, limit: 20 }).catch(() => null),
        getMyTaskerProfile().catch(() => null),
        getAssignedTasks({ limit: 10 }).catch(() => null),
        getMyAppliedTasks({ limit: 10 }).catch(() => null),
        getMyActiveTasks({ limit: 10 }).catch(() => null),
      ]);

      const feedTasks = parseTasksFeed(feedRes);
      const newProfile = profileRes;
      const newAssigned = extractList(assignedRes);
      const newApplied = extractList(appliedRes);
      const newActive = extractList(activeRes);

      setTasks(feedTasks);
      setProfile(newProfile);
      setProfileLoaded(true);
      setAssignedTasks(newAssigned);
      setAppliedTasks(newApplied);
      setActiveTasks(newActive);
      setLoadingTasks(false);

      // Second wave: enrichment — does not block the initial paint.
      const [walletRes, completedRes, bankRes, rankingRes, analyticsRes, growthRes, trustRes, learningRes, dailyQuizRes, recommendationsRes] = await Promise.all([
        getWalletBalance().catch(() => null),
        getMyCompletedTasks({ limit: 10 }).catch(() => null),
        getBankAccount().catch(() => null),
        getMyTaskerRanking({ limit: 3 }).catch(() => null),
        getMyAnalyticsSummary().catch(() => null),
        getGrowthProgress().catch(() => null),
        getGrowthTrustScore().catch(() => null),
        getGrowthResources().catch(() => null),
        getDailyQuiz().catch(() => null),
        getPerformerRecommendations(3).catch(() => null),
      ]);

      const newBank = bankRes;
      const newCompleted = extractList(completedRes);
      const newWallet = unwrapPayload(walletRes);
      let newRankLabel = rankLabel, newRankCategory = rankCategory, newRankingScore = rankingScore, newTopPerformers = topPerformers;

      setBankAccount(newBank);
      setCompletedTasks(newCompleted);
      setWalletSummary(newWallet);
      setAnalyticsSummary(unwrapPayload(analyticsRes));
      setGrowthProgress(unwrapPayload(growthRes));
      setGrowthTrust(unwrapPayload(trustRes));
      setGrowthResources(Array.isArray(unwrapPayload(learningRes)) ? unwrapPayload(learningRes) : []);
      setDailyQuiz(unwrapPayload(dailyQuizRes));
      const recommendationPayload = unwrapPayload(recommendationsRes);
      setRecommendations(Array.isArray(recommendationPayload) ? recommendationPayload : recommendationPayload?.items || []);
      if (rankingRes?.data) {
        newRankLabel = formatRankLabel(rankingRes.data.rank);
        newRankCategory = rankingRes.category || "Overall";
        newRankingScore = Number(rankingRes.data.rankingScore || 0);
        newTopPerformers = mapRankedTaskers(rankingRes.leaderboard || []).slice(0, 3);
        setRankLabel(newRankLabel);
        setRankCategory(newRankCategory);
        setRankingScore(newRankingScore);
        setTopPerformers(newTopPerformers);
      }

      writeNewHomeCache({
        tasks: feedTasks,
        profile: newProfile,
        assignedTasks: newAssigned,
        appliedTasks: newApplied,
        activeTasks: newActive,
        completedTasks: newCompleted,
        bankAccount: newBank,
        walletSummary: newWallet,
        rankLabel: newRankLabel,
        rankCategory: newRankCategory,
        rankingScore: newRankingScore,
        topPerformers: newTopPerformers,
      });
    } catch (error) {
      console.error("[PERF DASH] Failed to load dashboard data:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useAutoReload(fetchData, 60000);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PerformerHeader activePage="dashboard" />
      <main className="w-full px-5 pb-16 pt-[108px] sm:px-8 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-9">
        <div className="max-w-[1160px] space-y-6">
          <Greeting name={displayName} />
          <JourneyBanner stage={journey.stage} category={journey.access?.category} onAction={() => {
            if (journey.stage === "setup" || journey.stage === "rejected") navigate("/performer/profile");
            else if (journey.stage === "waitlisted" || journey.stage === "review") navigate("/performer/growth");
            else if (journey.stage === "working" && activeWork[0]?.id) navigate(`/performer/task/${activeWork[0].id}`);
            else navigate("/performer/find-tasks");
          }} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)] lg:items-start">
            <div className="space-y-6">
              {journey.stage === "working" ? <SectionShell title="Active tasks" subtitle="Keep quality and deadlines moving." actionLabel="See all" onAction={() => navigate("/performer/active-tasks")}>
                {activeWork.length ? <div className="grid gap-3 md:grid-cols-2">{activeWork.map((task) => <TaskCard key={task.id} task={task} onOpen={() => navigate(`/performer/task/${task.id}`)} />)}</div> : <EmptyState title="No active tasks" body="Your next accepted task will appear here." action="Browse matched tasks" onAction={() => navigate("/performer/find-tasks")} />}
              </SectionShell> : null}

              {appliedTasks.length > 0 ? <SectionShell title="Applications and offers" subtitle="Track what is waiting, shortlisted, or ready for you." actionLabel="View applications" onAction={() => navigate("/performer/applications")}>
                <div className="space-y-2">{appliedTasks.slice(0, 3).map((application) => { const task = application.task || application; const status = String(application.status || application.interestStatus || "SUBMITTED").replaceAll("_", " ").toLowerCase(); return <button key={application.id || task.id} type="button" onClick={() => task.id && navigate(`/performer/task/${task.id}`)} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm"><span className="min-w-0"><span className="block truncate text-sm font-bold text-slate-900">{task.title || "Task application"}</span><span className="mt-1 block text-xs text-slate-500">{task.category || "Application"}</span></span><span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold capitalize ${status.includes("offer") || status.includes("short") ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{status}</span></button>; })}</div>
              </SectionShell> : null}

              {journey.stage !== "working" && <SectionShell title={journey.stage === "ready" ? "Tasks matched to you" : "Preview your future work"} subtitle={journey.stage === "ready" ? "A short list based on your skills and category." : "See what performers in this category work on."} actionLabel="Browse" onAction={() => navigate("/performer/find-tasks")}>
                {loadingTasks && tasks.length === 0 ? <div className="grid gap-3 md:grid-cols-2">{[0, 1].map((item) => <div key={item} className="h-[216px] animate-pulse rounded-2xl bg-slate-50" />)}</div> : displayTasks.length ? <div className="grid gap-3 md:grid-cols-2">{displayTasks.map((task) => <TaskCard key={task.id} task={task} onOpen={() => navigate(`/performer/task/${task.id}`)} />)}</div> : <EmptyState title="No published tasks right now" body="We’ll show relevant work here as soon as it is available." />}
              </SectionShell>}

              {nextMilestone && <section className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700"><Target size={19} /></div><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Your improvement plan</p><h2 className="mt-1 text-lg font-bold text-slate-950">Next: {nextMilestone.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{nextMilestone.description || "Complete this step to keep your profile ready for review."}</p><button type="button" onClick={() => navigate("/performer/growth")} className="mt-3 text-sm font-bold text-emerald-700">Open growth plan →</button></div></div></section>}
            </div>

            <aside className="space-y-5">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500"><Wallet size={16} /> Earnings</div><p className="mt-3 text-3xl font-bold text-slate-950">₹{Number(walletSummary?.balance ?? walletSummary?.availableBalance ?? walletSummary?.amount ?? walletSummary?.wallet?.balance ?? 0).toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-slate-500">Available balance</p><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Completed</p><p className="mt-1 text-sm font-bold text-slate-900">{analyticsSummary?.completedTasks ?? analyticsSummary?.tasksCompleted ?? completedTasks.length}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-500">Rating</p><p className="mt-1 text-sm font-bold text-slate-900">{performerStats.rating ? `${performerStats.rating.toFixed(1)} / 5` : "Not rated"}</p></div></div><button type="button" onClick={() => navigate("/performer/earnings")} className="mt-4 text-xs font-bold text-emerald-700">View earnings →</button></section>
              <section className="rounded-3xl bg-slate-950 p-5 text-white">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-300"><ShieldCheck size={17} /> Trust Score</div>
                {growthTrust == null ? (
                  <div className="mt-3 space-y-2">
                    <div className="h-9 w-20 animate-pulse rounded-lg bg-white/10" />
                    <div className="h-3 w-48 animate-pulse rounded bg-white/10" />
                  </div>
                ) : growthTrust.active ? (
                  <>
                    <p className="mt-3 text-4xl font-bold">{growthTrust.score}<span className="text-lg text-slate-400">/{growthTrust.maxScore}</span></p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">Quality, deadlines, reliability, and verified work.</p>
                  </>
                ) : (
                  <>
                    <p className="mt-3 text-base font-bold">Your score starts with real work</p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">Complete your first task to activate it.</p>
                  </>
                )}
              </section>
              {dailyQuiz?.available && dailyQuiz.quiz ? <section className="rounded-3xl border border-amber-100 bg-amber-50 p-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800"><BookOpen size={16} /> Today’s quiz</div><span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold text-amber-800">{dailyQuiz.quiz.attemptsRemaining} tries left</span></div><h2 className="mt-2 text-lg font-bold text-slate-950">{dailyQuiz.quiz.title}</h2><p className="mt-1 text-sm leading-5 text-slate-600">{dailyQuiz.quiz.questions?.length || 0} questions · {dailyQuiz.quiz.timeLimitSeconds ? Math.ceil(dailyQuiz.quiz.timeLimitSeconds / 60) : Math.ceil((dailyQuiz.quiz.questions?.length || 0) * (dailyQuiz.quiz.secondsPerQuestion || 30) / 60)} min total</p><button type="button" onClick={() => navigate("/performer/daily-quiz")} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white transition-transform active:scale-[0.98]">{dailyQuiz.quiz.passed ? "View result" : "Start quiz"} <ArrowRight size={15} /></button></section> : quizResource ? <section className="rounded-3xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500"><BookOpen size={16} /> Practice library</div><h2 className="mt-2 text-lg font-bold text-slate-950">{quizResource.title}</h2><p className="mt-1 text-sm leading-5 text-slate-600">Explore this practice resource while today’s quiz is being prepared.</p><button type="button" onClick={() => navigate("/performer/growth")} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white">Open library <ArrowRight size={15} /></button></section> : null}
              {courseResources.length ? <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500"><BookOpen size={16} /> Learn next</div><button type="button" onClick={() => navigate("/performer/growth")} className="text-xs font-bold text-emerald-700">See all</button></div><div className="mt-3 space-y-3">{courseResources.map((resource) => <button key={resource.id} type="button" onClick={() => navigate("/performer/growth")} className="block w-full rounded-2xl border border-slate-100 p-3 text-left"><p className="text-sm font-bold text-slate-900">{resource.title}</p><p className="mt-1 text-xs text-slate-500">{resource.category}</p></button>)}</div></section> : null}
              {recommendations[0] ? <SponsoredCard item={recommendations[0]} position={1} /> : null}
            </aside>
          </div>

          <SectionShell title="Browse work by skills" subtitle="Explore other categories when you’re ready." actionLabel="See all" onAction={() => navigate("/performer/find-tasks")}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {loadingCategories && !categoryCards.length
                ? Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-[150px] animate-pulse rounded-[12px] border border-slate-100 bg-slate-50" />)
                : categoryCards.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <button key={skill.id || skill.label} type="button" onClick={() => navigate(`/performer/find-tasks?q=${encodeURIComponent(skill.query || skill.label)}`)} className="group rounded-[12px] border border-slate-100 bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-emerald-100">
                        {skill.imageUrl ? (
                          <div className="h-9 w-9 overflow-hidden rounded-[10px]">
                            <img src={skill.imageUrl} alt="" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: skill.iconBg || "#ecfdf5", color: skill.iconColor || "#059669" }}>
                            <Icon size={17} strokeWidth={2} />
                          </div>
                        )}
                        <h3 className="mt-4 text-[13px] font-semibold text-slate-950">{skill.label}</h3>
                        <p className="mt-2 text-[10px] font-medium text-slate-400">{skill.count} open tasks</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)]">
                          Explore <ChevronRight size={12} />
                        </span>
                      </button>
                    );
                  })}
              {!loadingCategories && !categoryCards.length ? (
                <div className="rounded-[12px] border border-slate-100 bg-slate-50 p-5 text-[12px] font-medium text-slate-500 sm:col-span-2 lg:col-span-4">
                  No task categories are available right now.
                </div>
              ) : null}
            </div>
          </SectionShell>

          <section className="rounded-[16px] border border-slate-100 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <div className="mb-5">
              <h2 className="text-[17px] font-semibold text-slate-950">Performance Ranking</h2>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Your standing among ONIT performers.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_435px]">
              <div className="rounded-[12px] bg-slate-50 p-5">
                <p className="text-[12px] font-semibold text-slate-400">Current Rank</p>
                <h3 className="mt-5 text-[16px] font-semibold text-slate-950">{rankLabel}</h3>
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  {rankLabel === "Unranked"
                    ? `${rankCategory}. Complete your first task to enter the ONIT ranking.`
                    : `${rankCategory} · score ${rankingScore}. Keep completing tasks to climb higher.`}
                </p>
                <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-[var(--color-primary)]">Quality work and reliability improve your standing</div>
                <button type="button" onClick={() => navigate("/performer/find-tasks")} className="mt-4 flex h-8 items-center rounded-full bg-[var(--color-primary)] px-4 text-[11px] font-semibold text-white">
                  {performerStats.hasActivity ? "Find More Tasks" : "Find Your First Task"}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {performerStats.hasActivity && topPerformers.length
                  ? topPerformers.map((performer, index) => (
                      <button key={performer.id || performer.displayName} type="button" onClick={() => navigate("/performer/leaderboard")} className="rounded-[12px] border border-slate-100 bg-slate-50 p-4 text-center transition hover:border-emerald-100 hover:bg-white">
                        <img src={performer.avatar} alt="" className="mx-auto h-12 w-12 rounded-full object-cover" />
                        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.03em] text-slate-300">Rank #{performer.rank || index + 1}</p>
                        <h3 className="mt-2 truncate text-[12px] font-semibold text-slate-700">{performer.displayName}</h3>
                        <p className="mt-1 truncate text-[10px] font-medium text-slate-400">{performer.profession || performer.domain}</p>
                        <div className="mt-3 h-1 rounded-full bg-emerald-100" />
                        <p className="mt-2 text-[9px] font-medium text-slate-400">Score {performer.rankingScore ?? 0}</p>
                      </button>
                    ))
                  : rankingSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.title} className="relative rounded-[12px] border border-slate-100 bg-slate-50 p-4 text-center">
                          <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${step.bg} ${step.color}`}>
                            <Icon size={17} strokeWidth={2} />
                          </div>
                          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.03em] text-slate-300">Step {index + 1}</p>
                          <h3 className="mt-2 text-[11px] font-semibold text-slate-600">{step.title}</h3>
                          <p className="mt-1 text-[10px] font-medium text-slate-400">{step.body}</p>
                          <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200">
                            <div className={`h-full rounded-full ${step.completed ? "w-full bg-[var(--color-primary)]" : "w-0"}`} />
                          </div>
                          <p className="mt-2 text-[9px] font-medium text-slate-300">{step.completed ? "1" : "0"} / 1 completed</p>
                        </div>
                      );
                    })}
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-slate-100 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
            <div>
              <h2 className="text-[19px] font-semibold text-slate-950">How OnIT Works</h2>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Three steps to earning securely</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {howItWorks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="relative overflow-hidden rounded-[15px] border border-slate-100 bg-slate-50 p-5">
                    <div className={`flex h-[38px] w-[38px] items-center justify-center rounded-[15px] ${item.bg} ${item.color}`}>
                      <Icon size={17} strokeWidth={2} />
                    </div>
                    <h3 className="mt-5 text-[13px] font-semibold text-slate-700">{item.title}</h3>
                    <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-400">{item.body}</p>
                    <span className="absolute right-5 top-4 text-[45px] font-bold leading-none text-slate-100">0{index + 1}</span>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PerformerDashboardPage;
