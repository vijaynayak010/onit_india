import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  ChevronRight,
  CheckCircle2,
  FileText,
  Grid3X3,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  Wallet,
} from "lucide-react";
const heroImage = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing/performer/earn-confidence-hero.png";
const heroImageWebp = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing/performer/earn-confidence-hero.webp";
import { formatRankLabel, mapRankedTaskers } from "../../../utils/taskerRankings";
import { mapHomeCategoryToBrowseItem, useHomeContent } from "../../../services/homeContent";
import {
  getAssignedTasks,
  getBankAccount,
  getMyActiveTasks,
  getMyAppliedTasks,
  getMyCompletedTasks,
  getMyTaskerProfile,
  getMyTaskerRanking,
  getTasksFeed,
} from "../services/api";
import { filterNormalizedTasks, normalizeFeedTask, parseTasksFeed } from "../components/tasks/performerTaskUtils";
import PerformerHeader from "../components/PerformerHeader";
import { useAutoReload } from "../../../hooks/useAutoReload";
import {
  PERFORMER_DASHBOARD_CACHE_KEY,
  PERFORMER_DASHBOARD_CACHE_TTL_MS,
  dedupePerformerRequest,
  readPerformerCache,
  writePerformerCache,
} from "../utils/performerDataCache";

const fallbackTasks = [
  {
    id: "sample-design",
    client: "Growthify Ventures",
    title: "Product UI/UX Designer for SaaS Platform",
    tags: ["Design", "Figma", "SaaS", "UX Research"],
    deadline: "31-07-2026",
    posted: "2 hours ago",
    budget: "₹25,000",
  },
  {
    id: "sample-react",
    client: "TravelDesk India",
    title: "React Developer - Build a Booking Dashboard",
    tags: ["Development", "React", "TypeScript", "REST API"],
    deadline: "31-07-2026",
    posted: "2 hours ago",
    budget: "₹30,000",
  },
  {
    id: "sample-brand",
    client: "Nimbus Co.",
    title: "Brand Strategy & Visual Identity B2C Brand",
    tags: ["Branding", "Illustrator", "Strategy"],
    deadline: "31-07-2026",
    posted: "2 hours ago",
    budget: "₹18,000",
  },
];

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
  { title: "Enter the Rankings", body: "Finish 1 task to get ranked", icon: Trophy, bg: "bg-[#EFFBFB]", color: "text-[#10605F]" },
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
    color: "text-[#10605F]",
    bg: "bg-[#EFFBFB]",
  },
];

const EMPTY_DASHBOARD_DATA = {
  tasks: [],
  profile: null,
  bankAccount: null,
  assignedTasks: [],
  appliedTasks: [],
  activeTasks: [],
  completedTasks: [],
  rankLabel: "Unranked",
  rankCategory: "Overall",
  rankingScore: 0,
  topPerformers: [],
};

const settleRequest = (request) => request
  .then((value) => ({ ok: true, value }))
  .catch((error) => ({ ok: false, error }));

function normalizeTaskForCard(task) {
  const normalized = normalizeFeedTask(task);
  return {
    id: normalized.id,
    client: normalized.clientName || task.clientName || task.providerName || "Verified Client",
    title: normalized.title || task.title || "Open task",
    tags: normalized.tags?.length ? normalized.tags.slice(0, 4) : [normalized.category || task.category || "Task"].filter(Boolean),
    deadline: normalized.deadline || task.deadline || "Flexible",
    posted: normalized.postedAtLabel || task.postedAtLabel || "Recently",
    budget: normalized.priceLabel || task.priceLabel || task.budgetLabel || task.budget || "Budget TBD",
    raw: task,
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
          <h2 className="text-lg sm:text-xl font-heading font-medium leading-tight text-slate-950">{title}</h2>
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
    <article className="flex min-h-[216px] flex-col rounded-[12px] border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#29ADAC]/20 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-slate-400">{task.client}</p>
          <button type="button" onClick={onOpen} className="mt-1 line-clamp-2 text-left text-[15px] sm:text-[16px] font-heading font-medium leading-snug text-slate-950 hover:text-[var(--color-primary)]">
            {task.title}
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
        <p className="text-[17px] font-medium text-slate-950">{task.budget}</p>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 text-[11px] font-semibold text-white shadow-[0_2px_6px_rgba(16,96,95,0.18)] transition hover:bg-[var(--color-primary-hover)]"
        >
          View task
          <ArrowRight size={12} strokeWidth={2.4} />
        </button>
      </div>
    </article>
  );
}

const PerformerDashboardPage = () => {
  const navigate = useNavigate();
  const { categories, loading: loadingCategories } = useHomeContent();
  const initialDashboardData = useMemo(
    () => readPerformerCache(PERFORMER_DASHBOARD_CACHE_KEY, PERFORMER_DASHBOARD_CACHE_TTL_MS),
    [],
  );
  const hasInitialDashboardDataRef = useRef(Boolean(initialDashboardData));
  const initialData = initialDashboardData || EMPTY_DASHBOARD_DATA;
  const dashboardDataRef = useRef(initialData);
  const dashboardFetchInFlightRef = useRef(null);

  const [tasks, setTasks] = useState(initialData.tasks || []);
  const [loadingTasks, setLoadingTasks] = useState(!initialDashboardData);
  const [profileLoaded, setProfileLoaded] = useState(Boolean(initialDashboardData));
  const [rankLabel, setRankLabel] = useState(initialData.rankLabel || "Unranked");
  const [rankCategory, setRankCategory] = useState(initialData.rankCategory || "Overall");
  const [rankingScore, setRankingScore] = useState(Number(initialData.rankingScore || 0));
  const [profile, setProfile] = useState(initialData.profile || null);
  const [bankAccount, setBankAccount] = useState(initialData.bankAccount || null);
  const [assignedTasks, setAssignedTasks] = useState(initialData.assignedTasks || []);
  const [appliedTasks, setAppliedTasks] = useState(initialData.appliedTasks || []);
  const [activeTasks, setActiveTasks] = useState(initialData.activeTasks || []);
  const [completedTasks, setCompletedTasks] = useState(initialData.completedTasks || []);
  const [topPerformers, setTopPerformers] = useState(initialData.topPerformers || []);

  const applyDashboardData = useCallback((data) => {
    dashboardDataRef.current = data;
    setTasks(data.tasks || []);
    setProfile(data.profile || null);
    setBankAccount(data.bankAccount || null);
    setAssignedTasks(data.assignedTasks || []);
    setAppliedTasks(data.appliedTasks || []);
    setActiveTasks(data.activeTasks || []);
    setCompletedTasks(data.completedTasks || []);
    setRankLabel(data.rankLabel || "Unranked");
    setRankCategory(data.rankCategory || "Overall");
    setRankingScore(Number(data.rankingScore || 0));
    setTopPerformers(data.topPerformers || []);
  }, []);

  const displayTasks = useMemo(() => {
    const openTasks = filterNormalizedTasks(tasks.map(normalizeFeedTask), { search: "", pill: "all" }).map((task) => normalizeTaskForCard(task.raw || task));
    return openTasks.length ? openTasks.slice(0, 3) : fallbackTasks;
  }, [tasks]);

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
      show: profileLoaded && !performerStats.hasActivity && done < onboardingSteps.length,
    };
  }, [performerStats, profileLoaded]);

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

  const fetchData = useCallback((showLoading = true) => {
    if (dashboardFetchInFlightRef.current) return dashboardFetchInFlightRef.current;

    // Background call (showLoading=false): skip if cache is still fresh
    if (!showLoading && readPerformerCache(PERFORMER_DASHBOARD_CACHE_KEY, PERFORMER_DASHBOARD_CACHE_TTL_MS)) {
      return Promise.resolve();
    }

    const fetchPromise = (async () => {
      if (showLoading && !hasInitialDashboardDataRef.current) setLoadingTasks(true);

      const feedRequest = settleRequest(dedupePerformerRequest(
        "performer-dashboard:feed",
        () => getTasksFeed({ page: 1, limit: 50 }),
      ));
      const enrichmentRequest = Promise.all([
        settleRequest(dedupePerformerRequest("performer-dashboard:profile", () => getMyTaskerProfile())),
        settleRequest(dedupePerformerRequest("performer-dashboard:assigned", () => getAssignedTasks({ limit: 20 }))),
        settleRequest(dedupePerformerRequest("performer-dashboard:applied", () => getMyAppliedTasks({ limit: 20 }))),
        settleRequest(dedupePerformerRequest("performer-dashboard:active", () => getMyActiveTasks({ limit: 20 }))),
        settleRequest(dedupePerformerRequest("performer-dashboard:completed", () => getMyCompletedTasks({ limit: 20 }))),
        settleRequest(dedupePerformerRequest("performer-dashboard:bank", () => getBankAccount())),
        settleRequest(dedupePerformerRequest("performer-dashboard:ranking", () => getMyTaskerRanking({ limit: 3 }))),
      ]);

      const feedResult = await feedRequest;
      if (feedResult.ok) {
        const feedData = {
          ...dashboardDataRef.current,
          tasks: parseTasksFeed(feedResult.value),
        };
        applyDashboardData(feedData);
        writePerformerCache(PERFORMER_DASHBOARD_CACHE_KEY, feedData);
      } else {
        console.error("[PERF DASH] Failed to load task feed:", feedResult.error);
      }

      // The task feed controls the primary dashboard skeleton. Enrichment can
      // finish quietly without holding the whole page behind the slowest API.
      setLoadingTasks(false);

      const [profileResult, assignedResult, appliedResult, activeResult, completedResult, bankResult, rankingResult] = await enrichmentRequest;
      const nextData = { ...dashboardDataRef.current };

      if (profileResult.ok) nextData.profile = unwrapPayload(profileResult.value);
      if (assignedResult.ok) nextData.assignedTasks = extractList(assignedResult.value);
      if (appliedResult.ok) nextData.appliedTasks = extractList(appliedResult.value);
      if (activeResult.ok) nextData.activeTasks = extractList(activeResult.value);
      if (completedResult.ok) nextData.completedTasks = extractList(completedResult.value);
      if (bankResult.ok) nextData.bankAccount = unwrapPayload(bankResult.value);
      if (rankingResult.ok && rankingResult.value?.data) {
        nextData.rankLabel = formatRankLabel(rankingResult.value.data.rank);
        nextData.rankCategory = rankingResult.value.category || "Overall";
        nextData.rankingScore = Number(rankingResult.value.data.rankingScore || 0);
        nextData.topPerformers = mapRankedTaskers(rankingResult.value.leaderboard || []).slice(0, 3);
      }

      applyDashboardData(nextData);
      setProfileLoaded(true);
      if (feedResult.ok || [profileResult, assignedResult, appliedResult, activeResult, completedResult, bankResult, rankingResult].some((result) => result.ok)) {
        writePerformerCache(PERFORMER_DASHBOARD_CACHE_KEY, nextData);
      }
    })()
      .catch((error) => {
        console.error("[PERF DASH] Failed to load dashboard data:", error);
      })
      .finally(() => {
        setLoadingTasks(false);
        dashboardFetchInFlightRef.current = null;
      });

    dashboardFetchInFlightRef.current = fetchPromise;
    return fetchPromise;
  }, [applyDashboardData]);

  useEffect(() => {
    fetchData(!hasInitialDashboardDataRef.current);
  }, [fetchData]);

  // Silent background revalidation: respects cache TTL, no spinner
  useAutoReload(fetchData, PERFORMER_DASHBOARD_CACHE_TTL_MS);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PerformerHeader activePage="dashboard" />
      <main className="w-full px-5 pb-16 pt-[108px] sm:px-8 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-9">
        <div className="max-w-[1160px] space-y-8">
          <section className="overflow-hidden rounded-[12px]">
            <div className="relative min-h-[214px] overflow-hidden">
              <picture>
                <source type="image/webp" srcSet={heroImageWebp} />
                <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400/80 via-sky-300/55 to-[#7EDEDD]/80" />
              <div className="relative flex min-h-[214px] max-w-[430px] flex-col justify-center px-7 py-8 text-white">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Wallet size={18} strokeWidth={1.9} />
                </div>
                <h1 className="text-xl sm:text-2xl font-heading font-medium leading-tight text-white">Earn with Confidence</h1>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/95">Transparent payouts with the full task amount shown before you apply</p>
                <button type="button" onClick={() => navigate("/performer/find-tasks")} className="mt-3 inline-flex w-fit items-center gap-1 border-b border-white pb-0.5 text-[14px] font-semibold">
                  Get Started
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-1.5">
              <span className="h-2 w-8 rounded-full bg-[var(--color-primary)]" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
            </div>
          </section>

          {onboardingProgress.show ? (
            <section className="rounded-[16px] border border-slate-100 bg-white p-7 shadow-[0_0_2px_rgba(15,23,42,0.14)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[15px] font-medium text-slate-950">Get Started on FirstDoer</h2>
                  <p className="mt-1 text-[11px] font-medium text-slate-400">Complete these steps to unlock your full earning potential.</p>
                </div>
                <span className="rounded-full bg-[#EFFBFB] px-3 py-1 text-[11px] font-semibold text-[var(--color-primary)]">{onboardingProgress.done}/3 Done</span>
              </div>
              <div className="mt-5 grid gap-6 md:grid-cols-3">
                {onboardingSteps.map((step, index) => {
                  const isDone = onboardingProgress.statuses[index];
                  const isNext = !isDone && onboardingProgress.done === index;
                  const Icon = isDone ? CheckCircle2 : step.icon;
                  return (
                    <article key={step.title} className={`rounded-[12px] border p-4 ${isDone || isNext ? "border-[#29ADAC]/30 bg-gradient-to-br from-[#EFFBFB]/60 to-white" : "border-slate-100 bg-white"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#EFFBFB] text-[var(--color-primary)]">
                          <Icon size={20} strokeWidth={1.9} />
                        </div>
                        <span className="rounded-full bg-[#EFFBFB] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.03em] text-[var(--color-primary)]">
                          {isDone ? "Done" : isNext ? "Next" : `Step ${index + 1}`}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[13px] font-medium text-slate-950">{step.title}</h3>
                      <p className="mt-1 min-h-[32px] text-[11px] font-medium leading-[15px] text-slate-400">{step.body}</p>
                      <button type="button" onClick={() => navigate(step.path)} className={`mt-4 h-[30px] w-full rounded-full text-[11px] font-semibold ${isNext ? "bg-[var(--color-primary)] text-white" : "bg-slate-50 text-slate-500"}`}>
                        {isDone ? "Completed" : step.cta}
                      </button>
                    </article>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-[11px] font-medium text-slate-400">Complete your profile to unlock better task recommendations.</p>
                <span className="text-[11px] font-semibold text-[var(--color-primary)]">{onboardingProgress.percent}%</span>
              </div>
              <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${onboardingProgress.percent}%` }} />
              </div>
            </section>
          ) : null}

          <SectionShell title="Recommended Tasks" subtitle="Tasks that best match your skills and interests." actionLabel="View All Tasks" onAction={() => navigate("/performer/find-tasks")}>
            <div className="grid gap-3 md:grid-cols-3">
              {loadingTasks && tasks.length === 0
                ? [0, 1, 2].map((item) => <div key={item} className="h-[216px] animate-pulse rounded-[12px] border border-slate-100 bg-slate-50" />)
                : displayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onOpen={() => navigate(String(task.id).startsWith("sample-") ? "/performer/find-tasks" : `/performer/task/${task.id}`)}
                    />
                  ))}
            </div>
          </SectionShell>

          <SectionShell title="Browse Work by Skills" subtitle="Discover tasks across every discipline." actionLabel="See all" onAction={() => navigate("/performer/find-tasks")}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {loadingCategories && !categoryCards.length
                ? Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-[150px] animate-pulse rounded-[12px] border border-slate-100 bg-slate-50" />)
                : categoryCards.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <button key={skill.id || skill.label} type="button" onClick={() => navigate(`/performer/find-tasks?q=${encodeURIComponent(skill.query || skill.label)}`)} className="group rounded-[12px] border border-slate-100 bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#29ADAC]/20">
                        {skill.imageUrl ? (
                          <div className="h-9 w-9 overflow-hidden rounded-[10px]">
                            <img src={skill.imageUrl} alt="" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: skill.iconBg || "#ecfdf5", color: skill.iconColor || "#059669" }}>
                            <Icon size={17} strokeWidth={2} />
                          </div>
                        )}
                        <h3 className="mt-4 text-[13px] font-medium text-slate-950">{skill.label}</h3>
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
              <h2 className="text-base sm:text-lg font-heading font-medium text-slate-950">Performance Ranking</h2>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Your standing among FirstDoer performers.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_435px]">
              <div className="rounded-[12px] bg-slate-50 p-5">
                <p className="text-[12px] font-semibold text-slate-400">Current Rank</p>
                <h3 className="mt-5 text-[16px] font-medium text-slate-950">{rankLabel}</h3>
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  {rankLabel === "Unranked"
                    ? `${rankCategory}. Complete your first task to enter the FirstDoer ranking.`
                    : `${rankCategory} · score ${rankingScore}. Keep completing tasks to climb higher.`}
                </p>
                <div className="mt-3 inline-flex rounded-full bg-[#EFFBFB] px-3 py-1 text-[10px] font-semibold text-[var(--color-primary)]">Top performers reach rank #1 within 60 days</div>
                <button type="button" onClick={() => navigate("/performer/find-tasks")} className="mt-4 flex h-8 items-center rounded-full bg-[var(--color-primary)] px-4 text-[11px] font-semibold text-white">
                  {performerStats.hasActivity ? "Find More Tasks" : "Find Your First Task"}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {performerStats.hasActivity && topPerformers.length
                  ? topPerformers.map((performer, index) => (
                      <button key={performer.id || performer.displayName} type="button" onClick={() => navigate("/performer/leaderboard")} className="rounded-[12px] border border-slate-100 bg-slate-50 p-4 text-center transition hover:border-[#29ADAC]/20 hover:bg-white">
                        <img src={performer.avatar} alt="" className="mx-auto h-12 w-12 rounded-full object-cover" />
                        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.03em] text-slate-300">Rank #{performer.rank || index + 1}</p>
                        <h3 className="mt-2 truncate text-[12px] font-medium text-slate-700">{performer.displayName}</h3>
                        <p className="mt-1 truncate text-[10px] font-medium text-slate-400">{performer.profession || performer.domain}</p>
                        <div className="mt-3 h-1 rounded-full bg-[#DFF7F6]" />
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
                          <h3 className="mt-2 text-[11px] font-medium text-slate-600">{step.title}</h3>
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
              <h2 className="text-[19px] font-medium text-slate-950">How FirstDoer Works</h2>
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
                    <h3 className="mt-5 text-[13px] font-medium text-slate-700">{item.title}</h3>
                    <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-400">{item.body}</p>
                    <span className="absolute right-5 top-4 text-[45px] font-medium leading-none text-slate-100">0{index + 1}</span>
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
