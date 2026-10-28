import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, Award, Heart, MessageSquare, AlertCircle } from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import { getMyTaskerProfile, getTaskerReviewsList, getAssignedTasks } from "../services/api";

const PerformerRatingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatingsAndReviews = async () => {
      try {
        setLoading(true);
        // 1. Fetch live performer/tasker profile stats and assigned tasks
        const [profileRes, assignedRes] = await Promise.all([
          getMyTaskerProfile().catch(() => null),
          getAssignedTasks().catch(() => null)
        ]);

        const profileData = profileRes?.data || profileRes;

        let localCompletedCount = 0;
        if (assignedRes) {
          const assignedTasks = assignedRes.tasks || assignedRes.data || (Array.isArray(assignedRes) ? assignedRes : []);
          if (Array.isArray(assignedTasks)) {
            localCompletedCount = assignedTasks.filter(t => t && String(t.status || '').toUpperCase() === 'COMPLETED').length;
          }
        }

        if (profileData) {
          const backendCompletedCount = profileData.completedTasksCount !== undefined && profileData.completedTasksCount !== null ? Number(profileData.completedTasksCount) : 0;
          profileData.completedTasksCount = backendCompletedCount > localCompletedCount ? backendCompletedCount : localCompletedCount;
          setProfile(profileData);
        }

        if (profileData?.id) {
          // 2. Fetch live customer reviews left for this tasker
          const reviewsRes = await getTaskerReviewsList(profileData.id);
          const reviewsData = reviewsRes?.data || reviewsRes || [];
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        }
      } catch (err) {
        console.error("Failed to load ratings and reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingsAndReviews();
  }, []);

  const ratingAvg = profile?.ratingAvg !== undefined && profile?.ratingAvg !== null ? Number(profile?.ratingAvg) : 0.0;
  const ratingCount = profile?.ratingCount !== undefined && profile?.ratingCount !== null ? Number(profile?.ratingCount) : 0;
  const completedTasksCount = profile?.completedTasksCount !== undefined && profile?.completedTasksCount !== null ? Number(profile?.completedTasksCount) : 0;

  // Dynamically calculate star breakdown from live reviews in the database
  const totalReviews = reviews.length;
  const getBreakdownPercentage = (starRating) => {
    if (totalReviews === 0) return 0;
    const count = reviews.filter(r => Math.round(r.rating) === starRating).length;
    return Math.round((count / totalReviews) * 100);
  };

  const breakdown = [
    { stars: 5, percentage: getBreakdownPercentage(5) },
    { stars: 4, percentage: getBreakdownPercentage(4) },
    { stars: 3, percentage: getBreakdownPercentage(3) },
    { stars: 2, percentage: getBreakdownPercentage(2) },
    { stars: 1, percentage: getBreakdownPercentage(1) },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
            <PerformerPageHeader
              title="Ratings & Reviews"
              subtitle="Track your live customer reviews, ratings metrics, and verified quality scores"
              backTo="/performer/account"
            />

            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-emerald-600">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-70">Loading ratings data...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Stats Summary Panel */}
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-gradient-to-br from-amber-50 to-white p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-500">Average Rating</p>
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-gray-900">{ratingAvg > 0 ? ratingAvg.toFixed(1) : "0.0"}</span>
                      <span className="text-sm font-bold text-gray-400">/ 5.0</span>
                    </div>
                    <div className="mt-2 flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => {
                        const filled = i < Math.round(ratingAvg);
                        return (
                          <Star 
                            key={i} 
                            className={`h-3.5 w-3.5 ${filled ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} 
                          />
                        );
                      })}
                      <span className="ml-2 text-xs font-bold text-amber-600">Based on {ratingCount} ratings</span>
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-500">Completed Tasks</p>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-4 text-4xl font-extrabold text-gray-900">{completedTasksCount}</p>
                    <p className="mt-2 text-xs font-bold text-emerald-600">Verified completions</p>
                  </div>

                  <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-500">Reviews count</p>
                      <Award className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-4 text-4xl font-extrabold text-gray-900">{reviews.length}</p>
                    <p className="mt-2 text-xs font-bold text-emerald-600">Written comments</p>
                  </div>
                </div>

                {/* Star Breakdown Graphics */}
                <div className="grid gap-6 md:grid-cols-5 border border-[var(--color-border)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                  <div className="md:col-span-2 flex flex-col justify-center border-b border-gray-100 pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-6">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Ratings Distribution</h3>
                    <p className="text-xs font-semibold text-gray-400 mb-4">Percentage breakdown of reviews received from customers</p>
                    {ratingAvg >= 4.5 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-emerald-600">★ Highly Rated Performer</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-3 space-y-3">
                    {breakdown.map((row) => (
                      <div key={row.stars} className="flex items-center gap-3">
                        <span className="w-3 text-xs font-bold text-gray-500">{row.stars}</span>
                        <Star className="h-3 w-3 text-gray-400 fill-gray-400" />
                        <div className="h-2 flex-1 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${row.percentage}%` }} />
                        </div>
                        <span className="w-8 text-right text-xs font-bold text-gray-500">{row.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Feed Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pl-1">
                    <MessageSquare className="h-5 w-5 text-emerald-600" strokeWidth={2} />
                    Verified Reviews Feed
                  </h3>

                  {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border border-dashed border-[var(--color-border)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-elevated)]/50 p-16 text-center shadow-[var(--shadow-sm)]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4">
                        <AlertCircle size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">No Reviews Found</h4>
                      <p className="text-xs font-semibold text-gray-400 max-w-sm leading-relaxed">
                        You have not received any written reviews from customers yet. Completed assigned tasks to receive live feedback and client ratings!
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 border border-[var(--color-border)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] overflow-hidden">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="p-6 transition hover:bg-gray-50/45">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-gray-900">Client Partner</span>
                                <span className="text-xs font-semibold text-gray-400">•</span>
                                <span className="text-xs font-semibold text-gray-400">
                                  {new Date(rev.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              {rev.task?.title && (
                                <p className="mt-1 text-xs font-bold text-emerald-600">{rev.task.title}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-2 py-1 text-xs font-extrabold text-amber-700 shadow-[var(--shadow-xs)]">
                              <Star className="h-3 w-3 fill-amber-600 text-amber-600" />
                              {rev.rating.toFixed(1)}
                            </div>
                          </div>
                          {rev.comment && (
                            <p className="mt-3 text-sm font-semibold leading-relaxed text-gray-600 italic">
                              "{rev.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Performance Footnote */}
                <div className="rounded-[var(--radius-2xl)] border border-dashed border-gray-200 p-5 bg-gray-50/50 flex gap-3 items-start">
                  <Heart size={16} className="text-rose-500 mt-0.5 shrink-0" />
                  <div className="text-xs font-semibold leading-relaxed text-gray-400">
                    High ratings unlock performer tier statuses, lower service fees, and priority matching in local task feeds.
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
    </div>
  );
};

export default PerformerRatingsPage;
