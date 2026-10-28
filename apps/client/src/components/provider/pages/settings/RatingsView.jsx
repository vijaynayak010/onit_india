import React, { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { getProviderProfile, getProviderReviews } from "../../services/api";

const StarRating = ({ rating, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        className={i <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        strokeWidth={0}
      />
    ))}
  </div>
);

const RatingsView = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState([
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await getProviderProfile();
        setProfile(profileData);

        if (profileData?.id) {
          const reviewsData = await getProviderReviews(profileData.id);
          const reviewItems = reviewsData?.data || [];
          setReviews(reviewItems);

          if (reviewItems.length > 0) {
            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            reviewItems.forEach((r) => {
              if (counts[r.rating] !== undefined) counts[r.rating]++;
            });
            setDistribution([5, 4, 3, 2, 1].map((s) => ({ stars: s, count: counts[s] })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch ratings data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-[var(--color-primary)]">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest opacity-70">Loading ratings...</p>
      </div>
    );
  }

  const calculatedTotalReviews = reviews.length;
  const calculatedAvgRating =
    calculatedTotalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / calculatedTotalReviews
      : 0;

  const finalRating =
    profile?.ratingAvg && profile.ratingAvg > 0
      ? profile.ratingAvg
      : profile?.user?.ratingAvg && profile.user.ratingAvg > 0
        ? profile.user.ratingAvg
        : calculatedAvgRating;

  const totalReviews =
    profile?.ratingCount && profile.ratingCount > 0
      ? profile.ratingCount
      : profile?.user?.ratingCount && profile.user.ratingCount > 0
        ? profile.user.ratingCount
        : calculatedTotalReviews;

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);
  const avatarColors = ["bg-green-500", "bg-orange-500", "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500"];

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0 text-left">
            <p className="text-5xl font-extrabold text-gray-900">{finalRating.toFixed(1)}</p>
            <div className="mt-1 flex justify-start">
              <StarRating rating={Math.round(finalRating)} size={20} />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-500">{totalReviews} ratings</p>
          </div>
          <div className="w-full flex-1 space-y-2">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-4 text-sm font-semibold text-gray-600">{item.stars}</span>
                <Star size={14} className="fill-amber-400 text-amber-400" strokeWidth={0} />
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-semibold text-gray-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-gray-400">Recent Ratings</h2>
        <div className="space-y-4">
          {reviews.map((r, index) => {
            const name = r.reviewer?.displayName || r.reviewer?.email?.split("@")[0] || "Client";
            const initial = name.charAt(0).toUpperCase();
            const service = r.task?.title || "Task";
            const date = r.createdAt
              ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—";

            return (
              <article
                key={r.id || index}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                        avatarColors[index % avatarColors.length]
                      }`}
                    >
                      {initial}
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900">{name}</p>
                      <p className="text-sm font-medium text-gray-500">{service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StarRating rating={r.rating || 0} />
                    <p className="mt-1 text-xs text-gray-400">{date}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {r.comment || "No comment provided."}
                </p>
              </article>
            );
          })}
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-left text-gray-500">
              No ratings received yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RatingsView;
