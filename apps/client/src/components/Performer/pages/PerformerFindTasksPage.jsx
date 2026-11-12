import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Mic, SlidersHorizontal, Loader2, ChevronDown, Clock, TrendingUp, BriefcaseBusiness, X, ShieldCheck } from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerAvailableTaskCard from "../components/tasks/PerformerAvailableTaskCard";
import {
  parseTasksFeed,
  normalizeFeedTask,
  filterNormalizedTasks,
} from "../components/tasks/performerTaskUtils";
import { addRecentSearch, getMyInterests, getMyKycStatus, getMyTaskerProfile, getSearchTrending, getTasksFeed, searchTasks } from "../services/api";
import { normalizeKycStatus } from "../utils/kycStatus";

const FILTER_PILLS = [
  { id: "all", label: "All Tasks" },
  { id: "high-priority", label: "High Priority" },
  { id: "short-term", label: "Short-term" },
  { id: "high-pay", label: "High pay" },
];

const PAGE_SIZE = 12;

const PerformerFindTasksPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [submittedQuery, setSubmittedQuery] = useState(searchParams.get("q") || "");
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [appliedTaskIds, setAppliedTaskIds] = useState(new Set());
  const [kycStatus, setKycStatus] = useState(null);
  const [activePill, setActivePill] = useState("all");

  const fetchTasks = useCallback(async (pageNum = 1, append = false, queryOverride) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const keyword = String(queryOverride ?? submittedQuery).trim();
      const feedRes = keyword
        ? await searchTasks({ keyword, page: pageNum, limit: PAGE_SIZE })
        : await getTasksFeed({ page: pageNum, limit: PAGE_SIZE });
      const parsed = parseTasksFeed(feedRes).map(normalizeFeedTask);

      setTasks((prev) => (append ? [...prev, ...parsed] : parsed));
      setHasMore(parsed.length >= PAGE_SIZE);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to load tasks feed:", err);
      if (!append) setTasks([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [submittedQuery]);

  useEffect(() => {
    fetchTasks(1, false);
  }, [fetchTasks]);

  useEffect(() => {
    let alive = true;
    const loadSearchMetadata = async () => {
      const [profileRes, trendingRes, interestsRes] = await Promise.allSettled([
        getMyTaskerProfile(),
        getSearchTrending(),
        getMyInterests({ page: 1, limit: 100 }),
      ]);

      if (!alive) return;

      if (profileRes.status === "fulfilled") {
        const profile = profileRes.value?.data || profileRes.value;
        const values = profile?.recentSearches || profile?.taskers?.recentSearches || [];
        setKycStatus(normalizeKycStatus(profile?.kycStatus || profile?.taskers?.kycStatus || profile?.user?.kycStatus));
        setRecentSearches(Array.isArray(values) ? values.filter(Boolean).slice(0, 5) : []);
      }

      if (trendingRes.status === "fulfilled") {
        const data = trendingRes.value?.data || trendingRes.value || {};
        const values = data.trending || [];
        setTrendingSearches(
          values
            .map((item) => (typeof item === "string" ? item : item?.title))
            .filter(Boolean)
            .slice(0, 5)
        );
      }

      if (interestsRes.status === "fulfilled") {
        const data = interestsRes.value?.data || interestsRes.value || {};
        const rows = data.data || data.interests || (Array.isArray(data) ? data : []);
        setAppliedTaskIds(
          new Set(
            rows
              .map((row) => row.taskId || row.task?.id || row.task?._id)
              .filter(Boolean)
              .map(String)
          )
        );
      }

      if (profileRes.status !== "fulfilled") {
        try {
          const kycRes = await getMyKycStatus();
          const kycPayload = kycRes?.data || kycRes || {};
          setKycStatus(normalizeKycStatus(kycPayload.kycStatus || kycPayload.status));
        } catch (err) {
          console.warn("Failed to load performer KYC status:", err);
        }
      }
    };

    loadSearchMetadata();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(
    () => filterNormalizedTasks(tasks, { search: searchQuery, pill: activePill }),
    [tasks, searchQuery, activePill]
  );

  const suggestedTasks = useMemo(() => tasks.slice(0, 4), [tasks]);

  const runSearch = useCallback(
    async (query) => {
      const value = String(query || searchQuery).trim();
      if (!value) return;
      setSearchQuery(value);
      setSubmittedQuery(value);
      setSearchFocused(false);
      setRecentSearches((prev) => [value, ...prev.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 5));
      if (value === submittedQuery) fetchTasks(1, false, value);
      try {
        await addRecentSearch(value);
      } catch (err) {
        console.warn("Failed to save recent performer search:", err);
      }
    },
    [fetchTasks, searchQuery, submittedQuery]
  );

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const kycBanner = useMemo(() => {
    if (kycStatus === "PENDING") {
      return {
        title: "Your identity verification is currently under review",
        body: "You'll be able to send interests immediately after your verification has been approved. Estimated review time: 24-48 hours.",
        action: "View Status",
      };
    }
    return null;
  }, [kycStatus]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="dashboard" />

      <main className="w-full px-4 pb-16 pt-[110px] sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight">Find Tasks</h1>
        </header>

        {kycBanner ? (
          <section
            className="mb-6 flex flex-col gap-4 rounded-[14px] border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70">
                <ShieldCheck size={22} />
              </span>
              <div>
                <h2 className="text-sm font-heading font-medium">{kycBanner.title}</h2>
                <p className="mt-1 max-w-3xl text-sm font-medium leading-6 opacity-75">{kycBanner.body}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/performer/kyc")}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)]"
            >
              {kycBanner.action}
            </button>
          </section>
        ) : null}

        <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]"
              strokeWidth={2.25}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                const next = e.target.value;
                setSearchQuery(next);
                if (!next.trim()) setSubmittedQuery("");
              }}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  runSearch(event.currentTarget.value);
                }
              }}
              placeholder="Search for 'Web Design'"
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] pl-11 pr-11 text-sm font-medium text-[var(--color-text)] shadow-[var(--shadow-xs)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
            />
            <Mic
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]"
              strokeWidth={2.25}
            />
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-text)]"
            aria-label="Filters"
          >
            <SlidersHorizontal size={18} strokeWidth={2.25} />
          </button>

          {searchFocused ? (
            <div className="absolute left-0 right-0 top-[56px] z-40 max-h-[70vh] overflow-y-auto rounded-[14px] border border-slate-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:right-14">
              <div className="flex items-center justify-between px-5 py-4">
                <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">Recent searches</p>
                <button type="button" onClick={clearRecentSearches} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                  Clear all
                </button>
              </div>
              <div className="space-y-1 px-4 pb-4">
                {recentSearches.length > 0 ? (
                  recentSearches.map((item) => (
                    <button key={item} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => runSearch(item)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-[15px] font-medium text-slate-700 hover:bg-slate-50">
                      <Clock size={16} className="text-slate-300" />
                      {item}
                    </button>
                  ))
                ) : (
                  <p className="px-2 py-2 text-sm font-medium text-slate-400">No recent searches yet</p>
                )}
              </div>

              {trendingSearches.length > 0 ? (
                <div className="border-t border-slate-100 px-5 py-4">
                  <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">Popular skills</p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((item) => (
                      <button key={item} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => runSearch(item)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]">
                        <TrendingUp size={14} />
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="border-t border-slate-100 pb-2">
                <p className="px-5 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">Suggested tasks</p>
                {suggestedTasks.map((task) => (
                  <button key={task.id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => navigate(`/performer/task/${task.id}`)} className="flex w-full items-center gap-4 px-5 py-3 text-left hover:bg-[var(--color-primary-subtle)]/45">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[var(--color-primary)]">
                      <BriefcaseBusiness size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">{task.title}</span>
                      <span className="mt-0.5 block truncate text-xs font-medium text-slate-400">{task.priceLabel} · {task.category}</span>
                    </span>
                    <span className="text-sm font-semibold text-slate-300">View</span>
                  </button>
                ))}
                <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setSearchFocused(false)} className="mt-2 flex w-full items-center justify-center gap-2 border-t border-slate-100 px-5 py-3 text-sm font-bold text-[var(--color-primary)]">
                  <X size={15} />
                  Close search
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActivePill(pill.id)}
              className={`shrink-0 rounded-full border px-5 py-2 text-[13px] font-medium transition ${
                activePill === pill.id
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/30"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[var(--color-primary)]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-3 text-sm font-semibold text-[var(--color-text-muted)]">Loading tasks…</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((task, i) => (
              <PerformerAvailableTaskCard
                key={task.id}
                task={task}
                index={i}
                onViewDetails={() => navigate(`/performer/task/${task.id}`)}
                interestStatus={appliedTaskIds.has(String(task.id)) ? "sent" : null}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 py-16 text-center">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              {searchQuery ? `No tasks found matching "${searchQuery}"` : "No tasks match this filter."}
            </p>
          </div>
        )}

        {hasMore && !loading && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => fetchTasks(page + 1, true)}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-8 py-3 text-sm font-bold text-[var(--color-text-muted)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/30 hover:text-[var(--color-text)] disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--color-primary)]" />
                  Loading…
                </>
              ) : (
                <>
                  Load more tasks
                  <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default PerformerFindTasksPage;
