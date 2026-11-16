import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  ChevronDown,
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
import { DashboardShell, DashboardCard, StatusBadge, EmptyState } from "../../shared/dashboard";
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
          <h2 className="text-lg sm:text-xl font-heading font-medium leading-tight text-[var(--dash-text)]">{title}</h2>
          {subtitle ? <p className="mt-1 text-[13px] font-medium text-[var(--dash-text-secondary)]">{subtitle}</p> : null}
        </div>
        {actionLabel ? (
          <button type="button" onClick={onAction} className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--dash-primary-700)] transition hover:text-[var(--dash-primary-800)]">
            {actionLabel}
            <ChevronRight size={14} strokeWidth={2.25} />
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function TaskCard({ task, onOpen }) {
  return (
    <article className="flex min-h-[216px] flex-col rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--dash-primary-600)]/40 hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-[var(--dash-text-secondary)]">{task.client}</p>
          <button type="button" onClick={onOpen} className="mt-1 line-clamp-2 text-left text-[15px] sm:text-[16px] font-heading font-medium leading-snug text-[var(--dash-text)] hover:text-[var(--dash-primary-700)]">
            {task.title}
          </button>
        </div>
        <button type="button" onClick={onOpen} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--dash-text-secondary)] transition hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)]" aria-label="Save task">
          <Bookmark size={17} strokeWidth={1.8} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {task.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--dash-text-secondary)]">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-[var(--dash-text-secondary)]">
        <span className="tabular-nums">Deadline: {task.deadline}</span>
        <span>{task.posted}</span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-[var(--dash-border)] pt-4">
        <p className="dash-kpi tabular-nums text-[17px] font-medium text-[var(--dash-text)]">{task.budget}</p>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--dash-primary-700)] px-4 text-[11px] font-medium text-white shadow-[var(--shadow-xs)] transition hover:bg-[var(--dash-primary-800)]"
        >
          View task
          <ArrowRight size={12} strokeWidth={2.25} />
        </button>
      </div>
    </article>
  );
}

const PerformerDashboardPage = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
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
    <DashboardShell header={<PerformerHeader activePage="dashboard" />} hasSidebar>
      <div className="space-y-6 lg:space-y-7">
        {/* Compact Hero Banner (~150px) with integrated pagination controls */}
        <section className="relative overflow-hidden rounded-2xl border border-[var(--dash-primary-800)]/20 bg-gradient-to-r from-[#083B3A] via-[#10605F] to-[#1B8887] shadow-[var(--shadow-sm)]">
          <div className="relative min-h-[150px] overflow-hidden">
            <picture>
              <source type="image/webp" srcSet={heroImageWebp} />
              <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity" />
            </picture>
            <div className="relative flex min-h-[150px] flex-col justify-between gap-4 px-6 py-5 text-white sm:flex-row sm:items-center sm:px-8">
              <div className="max-w-xl">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                  <Wallet size={14} strokeWidth={2} aria-hidden="true" />
                  <span>Protected Payouts</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-heading font-medium leading-tight text-white">
                  Earn with Confidence
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-normal leading-relaxed text-white/90">
                  Transparent payouts with the full task amount shown before you apply.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                <button
                  type="button"
                  onClick={() => navigate("/performer/find-tasks")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#7EDEDD] px-5 py-2.5 text-xs sm:text-sm font-medium text-[#032120] shadow-xs transition hover:bg-[#4CCDDC]"
                >
                  <span>Get Started</span>
                  <ArrowRight size={15} />
                </button>
                <div className="flex items-center gap-1.5" aria-label="Banner slides">
                  <span className="h-1.5 w-6 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started on FirstDoer with 2/3 Done (67%) in header */}
        {onboardingProgress.show ? (
          <DashboardCard className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[var(--dash-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-heading font-medium text-[var(--dash-text)]">
                  Get Started on FirstDoer
                </h2>
                <p className="mt-0.5 text-xs font-medium text-[var(--dash-text-secondary)]">
                  Complete these steps to unlock your full earning potential.
                </p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-[var(--dash-canvas)] sm:block">
                  <div
                    className="h-full rounded-full bg-[var(--dash-primary-700)] transition-all"
                    style={{ width: `${onboardingProgress.percent}%` }}
                  />
                </div>
                <StatusBadge variant="completed" className="tabular-nums">
                  {onboardingProgress.done}/3 Done ({onboardingProgress.percent}%)
                </StatusBadge>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {onboardingSteps.map((step, index) => {
                const isDone = onboardingProgress.statuses[index];
                const isNext = !isDone && (onboardingProgress.done === index || step.cta === "Start Verification");
                const Icon = isDone ? CheckCircle2 : step.icon;
                return (
                  <article
                    key={step.title}
                    className={`flex flex-col rounded-xl border p-4 transition ${
                      isDone
                        ? "border-[#1B8887]/20 bg-[#E8F8F5]/45"
                        : isNext
                          ? "border-[#1B8887]/40 bg-[#EDF9FA]/60"
                          : "border-[var(--dash-border)] bg-[var(--dash-surface)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          isDone
                            ? "bg-[#E8F8F5] text-[#1B8887]"
                            : "bg-[var(--dash-canvas)] text-[var(--dash-primary-700)]"
                        }`}
                      >
                        <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      </div>
                      {isDone ? (
                        <StatusBadge variant="completed">Completed</StatusBadge>
                      ) : isNext ? (
                        <StatusBadge variant="active">Next</StatusBadge>
                      ) : (
                        <StatusBadge variant="neutral">Step {index + 1}</StatusBadge>
                      )}
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-[var(--dash-text)]">{step.title}</h3>
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--dash-text-secondary)]">
                      {step.body}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(step.path)}
                      className={`mt-4 h-9 w-full rounded-full text-xs font-medium transition ${
                        isDone
                          ? "border border-[#1B8887]/20 bg-[#E8F8F5] text-[#1B8887] hover:bg-[#E8F8F5]/80"
                          : isNext
                            ? "bg-[#1B8887] text-white shadow-[var(--shadow-xs)] hover:bg-[#10605F]"
                            : "border border-[var(--dash-border)] bg-[var(--dash-canvas)] text-[var(--dash-text)] hover:border-[#1B8887]/40"
                      }`}
                    >
                      {isDone ? "Completed" : step.cta}
                    </button>
                  </article>
                );
              })}
            </div>
          </DashboardCard>
        ) : null}

        {/* Recommended Tasks: Responsive 3-column grid */}
        <SectionShell
          title="Recommended Tasks"
          subtitle="Tasks that best match your skills and interests."
          actionLabel="View All Tasks"
          onAction={() => navigate("/performer/find-tasks")}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loadingTasks && tasks.length === 0
              ? [0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-[216px] animate-pulse rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)]"
                  />
                ))
              : displayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onOpen={() =>
                      navigate(
                        String(task.id).startsWith("sample-")
                          ? "/performer/find-tasks"
                          : `/performer/task/${task.id}`,
                      )
                    }
                  />
                ))}
          </div>
        </SectionShell>

        {/* Browse Work by Skills: Interactive chips or clean EmptyState */}
        <SectionShell
          title="Browse Work by Skills"
          subtitle="Discover tasks across every discipline."
          actionLabel="See all"
          onAction={() => navigate("/performer/find-tasks")}
        >
          {loadingCategories && !categoryCards.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[110px] animate-pulse rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)]"
                />
              ))}
            </div>
          ) : categoryCards.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categoryCards.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <button
                      key={skill.id || skill.label}
                      type="button"
                      onClick={() =>
                        navigate(`/performer/find-tasks?q=${encodeURIComponent(skill.query || skill.label)}`)
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-2 text-xs sm:text-[13px] font-medium text-[var(--dash-text)] shadow-[var(--shadow-xs)] transition hover:border-[var(--dash-primary-700)] hover:bg-[var(--dash-active-bg)] hover:text-[var(--dash-primary-700)]"
                    >
                      {Icon ? <Icon size={15} strokeWidth={2} aria-hidden="true" /> : null}
                      <span>{skill.label}</span>
                      <span className="dash-kpi tabular-nums rounded-full bg-[var(--dash-canvas)] px-2 py-0.5 text-[11px] text-[var(--dash-text-secondary)]">
                        {skill.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <DashboardCard className="p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {["UI/UX Design", "React & Web", "Video Editing", "Content & Copy", "Digital Marketing"].map(
                  (chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => navigate(`/performer/find-tasks?q=${encodeURIComponent(chip)}`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-3.5 py-1.5 text-xs font-medium text-[var(--dash-text)] transition hover:border-[var(--dash-primary-700)] hover:bg-[var(--dash-active-bg)] hover:text-[var(--dash-primary-700)]"
                    >
                      <span>{chip}</span>
                      <ChevronRight size={12} />
                    </button>
                  ),
                )}
              </div>
              <EmptyState
                icon={Grid3X3}
                title="Live category counts are updating"
                description="Use any skill chip above or browse all open tasks directly."
                actionLabel="Browse All Tasks"
                onAction={() => navigate("/performer/find-tasks")}
              />
            </DashboardCard>
          )}
        </SectionShell>

        {/* Performance Ranking: Balanced grid so Current Rank and 3 step cards never wrap narrowly */}
        <DashboardCard className="p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-base sm:text-lg font-heading font-medium text-[var(--dash-text)]">
              Performance Ranking
            </h2>
            <p className="mt-1 text-xs font-medium text-[var(--dash-text-secondary)]">
              Your standing among FirstDoer performers.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
            <div className="flex flex-col justify-between rounded-xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-5">
              <div>
                <p className="text-xs font-medium text-[var(--dash-text-secondary)]">Current Rank</p>
                <h3 className="dash-kpi tabular-nums mt-3 text-xl font-medium text-[var(--dash-text)]">
                  {rankLabel}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--dash-text-secondary)]">
                  {rankLabel === "Unranked"
                    ? `${rankCategory}. Complete your first task to enter the FirstDoer ranking.`
                    : `${rankCategory} · score ${rankingScore}. Keep completing tasks to climb higher.`}
                </p>
              </div>
              <div className="mt-4 space-y-3">
                <StatusBadge variant="active">Top performers reach rank #1 within 60 days</StatusBadge>
                <div>
                  <button
                    type="button"
                    onClick={() => navigate("/performer/find-tasks")}
                    className="inline-flex h-9 items-center rounded-full bg-[var(--dash-primary-700)] px-4 text-xs font-medium text-white transition hover:bg-[var(--dash-primary-800)]"
                  >
                    {performerStats.hasActivity ? "Find More Tasks" : "Find Your First Task"}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {performerStats.hasActivity && topPerformers.length
                ? topPerformers.map((performer, index) => (
                    <button
                      key={performer.id || performer.displayName}
                      type="button"
                      onClick={() => navigate("/performer/leaderboard")}
                      className="flex flex-col items-center rounded-xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-4 text-center transition hover:border-[var(--dash-primary-600)]/40 hover:bg-[var(--dash-surface)]"
                    >
                      <img src={performer.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                      <p className="dash-kpi tabular-nums mt-3 text-[10px] font-medium uppercase tracking-wider text-[var(--dash-text-secondary)]">
                        Rank #{performer.rank || index + 1}
                      </p>
                      <h3 className="mt-1.5 w-full truncate text-xs font-medium text-[var(--dash-text)]">
                        {performer.displayName}
                      </h3>
                      <p className="mt-0.5 w-full truncate text-[11px] text-[var(--dash-text-secondary)]">
                        {performer.profession || performer.domain}
                      </p>
                      <div className="mt-3 h-1 w-full rounded-full bg-[#E8F8F5]">
                        <div className="h-full w-3/4 rounded-full bg-[var(--dash-primary-700)]" />
                      </div>
                      <p className="dash-kpi tabular-nums mt-2 text-[11px] text-[var(--dash-text-secondary)]">
                        Score {performer.rankingScore ?? 0}
                      </p>
                    </button>
                  ))
                : rankingSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.title}
                        className="flex flex-col items-center justify-between rounded-xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-4 text-center"
                      >
                        <div>
                          <div
                            className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${step.bg} ${step.color}`}
                          >
                            <Icon size={17} strokeWidth={2} aria-hidden="true" />
                          </div>
                          <p className="dash-kpi tabular-nums mt-3 text-[10px] font-medium uppercase tracking-wider text-[var(--dash-text-secondary)]">
                            Step {index + 1}
                          </p>
                          <h3 className="mt-1.5 text-xs font-medium text-[var(--dash-text)]">{step.title}</h3>
                          <p className="mt-1 text-[11px] leading-snug text-[var(--dash-text-secondary)]">
                            {step.body}
                          </p>
                        </div>
                        <div className="mt-4 w-full">
                          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--dash-border)]">
                            <div
                              className={`h-full rounded-full ${
                                step.completed ? "w-full bg-[var(--dash-primary-700)]" : "w-0"
                              }`}
                            />
                          </div>
                          <p className="dash-kpi tabular-nums mt-2 text-[10px] text-[var(--dash-text-secondary)]">
                            {step.completed ? "1" : "0"} / 1 completed
                          </p>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </DashboardCard>

        {/* How FirstDoer Works: Compact & Collapsible */}
        <DashboardCard className="p-5 sm:p-6">
          <button
            type="button"
            onClick={() => setShowHowItWorks((prev) => !prev)}
            aria-expanded={showHowItWorks}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <div>
              <h2 className="text-base sm:text-lg font-heading font-medium text-[var(--dash-text)]">
                How FirstDoer Works
              </h2>
              <p className="mt-0.5 text-xs font-medium text-[var(--dash-text-secondary)]">
                Three steps to earning securely on FirstDoer
              </p>
            </div>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-canvas)] text-[var(--dash-text)]">
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${showHowItWorks ? "rotate-180" : ""}`}
              />
            </span>
          </button>
          {showHowItWorks ? (
            <div className="mt-5 grid gap-4 border-t border-[var(--dash-border)] pt-5 md:grid-cols-3">
              {howItWorks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="relative overflow-hidden rounded-xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                      >
                        <Icon size={17} strokeWidth={2} aria-hidden="true" />
                      </div>
                      <span className="dash-kpi tabular-nums text-xs font-medium text-[var(--dash-text-secondary)]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-[var(--dash-text)]">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--dash-text-secondary)]">{item.body}</p>
                  </article>
                );
              })}
            </div>
          ) : null}
        </DashboardCard>
      </div>
    </DashboardShell>
  );
};

export default PerformerDashboardPage;
