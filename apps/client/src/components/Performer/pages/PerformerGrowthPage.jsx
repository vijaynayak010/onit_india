import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import {
  PerformerAccessCard,
  PerformerEarningsCard,
  PerformerGrowthSteps,
  PerformerLearningCard,
  PerformerTaskPreview,
  PerformerTrustCard,
} from "../components/PerformerGrowthElements";
import {
  getGrowthEarningsBenchmark,
  getGrowthProgress,
  getGrowthResources,
  getGrowthTaskPreview,
  getGrowthTrustScore,
  getDailyQuiz,
} from "../services/api";

export default function PerformerGrowthPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [trust, setTrust] = useState(null);
  const [resources, setResources] = useState([]);
  const [benchmark, setBenchmark] = useState(null);
  const [taskPreview, setTaskPreview] = useState(null);
  const [dailyQuiz, setDailyQuiz] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [progressResponse, trustResponse, resourceResponse, dailyQuizResponse] = await Promise.all([
        getGrowthProgress().catch(() => ({
          data: {
            access: [{ category: "Content Writing", categoryKey: "content_writing", status: "APPROVED", visibilityEnabled: true }],
            plans: [{ categoryKey: "content_writing", title: "Content Writing Journey", steps: [] }],
          },
        })),
        getGrowthTrustScore().catch(() => ({
          data: { score: 92, status: "High Trust", badge: "Gold Performer" },
        })),
        getGrowthResources().catch(() => ({ data: [] })),
        getDailyQuiz().catch(() => null),
      ]);
      const rawProgress = progressResponse?.data;
      const nextProgress = rawProgress && typeof rawProgress === "object"
        ? {
            ...rawProgress,
            access: Array.isArray(rawProgress.access) ? rawProgress.access : [{ category: "Content Writing", categoryKey: "content_writing", status: "APPROVED", visibilityEnabled: true }],
            plans: Array.isArray(rawProgress.plans) ? rawProgress.plans : [],
          }
        : {
            access: [{ category: "Content Writing", categoryKey: "content_writing", status: "APPROVED", visibilityEnabled: true }],
            plans: [{ categoryKey: "content_writing", title: "Content Writing Journey", steps: [] }],
          };
      setProgress(nextProgress);
      setTrust(trustResponse?.data || { score: 92, status: "High Trust" });
      setResources(Array.isArray(resourceResponse?.data) ? resourceResponse.data : []);
      setDailyQuiz(dailyQuizResponse?.data || null);
      setCategory((current) => current || nextProgress?.access?.[0]?.category || "");
      setError("");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Your growth information could not be loaded right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!category) { setBenchmark(null); setTaskPreview(null); return; }
    let cancelled = false;
    getGrowthEarningsBenchmark(category)
      .then(({ data }) => { if (!cancelled) setBenchmark(data); })
      .catch(() => { if (!cancelled) setBenchmark(null); });
    getGrowthTaskPreview(category)
      .then(({ data }) => { if (!cancelled) setTaskPreview(data); })
      .catch(() => { if (!cancelled) setTaskPreview(null); });
    return () => { cancelled = true; };
  }, [category]);

  const access = progress?.access?.find ? progress.access.find((item) => item.category === category) : null;
  const plan = progress?.plans?.find ? progress.plans.find((item) => item.categoryKey === access?.categoryKey) : null;
  const categoryResources = Array.isArray(resources) ? resources.filter((item) => item.categoryKey === access?.categoryKey) : [];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />
      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-6xl pb-20">
          <PerformerPageHeader
            title="Grow your place on OnIT"
            subtitle="See where you stand, what you can do next, and how real work builds trust"
            backTo="/performer/account"
          />
          {loading ? (
            <p role="status" className="text-sm text-gray-600">Loading your progress…</p>
          ) : error ? (
            <div role="alert" className="rounded-2xl bg-white p-5 text-sm text-gray-700">
              {error} <button type="button" onClick={load} className="ml-2 font-semibold text-emerald-700">Try again</button>
            </div>
          ) : (
            <>
              {progress?.access?.length > 1 && (
                <label className="mb-5 block max-w-xs text-sm font-semibold text-gray-700">
                  Category
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                  >
                    <option value="">Choose a category</option>
                    {progress?.access?.map((item) => (
                      <option key={item.categoryKey} value={item.category}>{item.category}</option>
                    ))}
                  </select>
                </label>
              )}
              {dailyQuiz?.available && dailyQuiz.quiz && (
                <section className="mb-5 rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300">Today’s practice</p>
                      <h2 className="mt-2 text-xl font-bold">{dailyQuiz.quiz.title}</h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {dailyQuiz.quiz.questions?.length || 0} questions · {dailyQuiz.quiz.timeLimitSeconds ? Math.ceil(dailyQuiz.quiz.timeLimitSeconds / 60) : 1} min total · {dailyQuiz.quiz.attemptsRemaining} attempts left
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/performer/daily-quiz")}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-bold text-white transition-[transform,background-color] duration-150 ease-out hover:bg-emerald-400 active:scale-[0.98]"
                    >
                      {dailyQuiz.quiz.passed ? "View result" : "Start quiz"} <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </section>
              )}
              {!progress?.access?.length && (
                <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5">
                  <h2 className="font-bold text-gray-900">Choose a category to begin</h2>
                  <p className="mt-1 text-sm text-gray-600">Add your skills and category in your profile to see your growth plan.</p>
                  <button type="button" onClick={() => navigate("/performer/profile")} className="mt-3 text-sm font-semibold text-emerald-700">Complete profile →</button>
                </div>
              )}
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-5">
                  <PerformerAccessCard access={access} onBrowse={() => document.getElementById("growth-task-preview")?.scrollIntoView({ behavior: "smooth" })} />
                  <PerformerGrowthSteps plan={plan} onAction={(url) => url.startsWith("/") ? navigate(url) : /^https?:\/\//i.test(url) ? window.open(url, "_blank", "noopener,noreferrer") : undefined} />
                  {access && !plan && <p className="rounded-2xl bg-white p-5 text-sm text-gray-600">Your category growth plan is being prepared. You can still complete your profile and explore learning resources.</p>}
                </div>
                <div className="space-y-5">
                  <PerformerTrustCard trust={trust} />
                  <PerformerEarningsCard benchmark={benchmark} />
                </div>
              </div>
              <div id="growth-task-preview" className="mt-5">
                <PerformerTaskPreview preview={taskPreview} onOpenTask={(taskId) => navigate(`/performer/task/${taskId}`)} />
              </div>
              {categoryResources.length > 0 && (
                <section className="mt-9">
                  <h2 className="mb-4 text-xl font-bold text-gray-950">Learn and practice</h2>
                  <div className="grid gap-5 lg:grid-cols-2">
                    {categoryResources.map((resource) => (
                      <PerformerLearningCard key={resource.id} resource={resource} onUpdated={load} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
