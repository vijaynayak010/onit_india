import React, { useMemo, useState } from "react";
import { MessageCircle, Star, ThumbsUp } from "lucide-react";

const FILTER_TABS = ["All", "5★", "4★", "3★", "Pending"];

const SUMMARY = {
  reviewsGiven: 6,
  wouldRehire: 4,
  avgGiven: 4.3,
};

const PENDING_REVIEW = {
  name: "Karan Malhotra",
  role: "App Developer",
};

const REVIEWS = [
  {
    id: 1,
    name: "Rohan Desai",
    role: "UI/UX Designer",
    rating: 5,
    badge: "Highly Recommended",
    badgeClass: "bg-violet-50 text-violet-700",
    project: "Brand Logo Redesign",
    date: "Jun 12, 2026",
    text: "Exceptional attention to detail. Delivered polished designs ahead of schedule and was very responsive throughout.",
    wouldRehire: true,
    avatarColor: "bg-blue-500",
  },
  {
    id: 2,
    name: "Meera Singh",
    role: "Web Developer",
    rating: 5,
    badge: "Top Quality",
    badgeClass: "bg-emerald-50 text-emerald-700",
    project: "Landing Page Build",
    date: "Jun 5, 2026",
    text: "Clean code, great communication, and handled revisions without any hassle. Would definitely work together again.",
    wouldRehire: true,
    avatarColor: "bg-pink-500",
  },
  {
    id: 3,
    name: "Arjun Kapoor",
    role: "Content Writer",
    rating: 4,
    badge: "Good Work",
    badgeClass: "bg-sky-50 text-sky-700",
    project: "SEO Audit Report",
    date: "May 28, 2026",
    text: "Solid research and well-structured report. Needed one round of edits but overall a positive experience.",
    wouldRehire: true,
    avatarColor: "bg-amber-600",
  },
  {
    id: 4,
    name: "Priya Nair",
    role: "Graphic Designer",
    rating: 5,
    badge: "Creative",
    badgeClass: "bg-pink-50 text-pink-700",
    project: "Social Media Graphics",
    date: "May 20, 2026",
    text: "Creative visuals that matched our brand perfectly. Fast turnaround and open to feedback.",
    wouldRehire: true,
    avatarColor: "bg-violet-500",
  },
  {
    id: 5,
    name: "Vikram Shah",
    role: "Video Editor",
    rating: 3,
    badge: "Average",
    badgeClass: "bg-gray-100 text-gray-600",
    project: "Product Demo Video",
    date: "May 14, 2026",
    text: "Acceptable output but missed a few brief requirements. Communication could have been better.",
    wouldRehire: false,
    avatarColor: "bg-red-500",
  },
  {
    id: 6,
    name: "Sneha Reddy",
    role: "SEO Specialist",
    rating: 4,
    badge: "Reliable",
    badgeClass: "bg-orange-50 text-orange-700",
    project: "Keyword Research",
    date: "May 2, 2026",
    text: "Delivered a comprehensive keyword list with actionable insights. Professional and on time.",
    wouldRehire: false,
    avatarColor: "bg-teal-500",
  },
];

const StarRow = ({ rating, interactive = false, value = 0, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(star)}
        className={interactive ? "transition hover:scale-110" : ""}
      >
        <Star
          size={interactive ? 22 : 14}
          className={
            star <= (interactive ? value : rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
          strokeWidth={0}
        />
      </button>
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${review.avatarColor}`}
        >
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="font-extrabold text-gray-900">
            {review.name}{" "}
            <span className="font-semibold text-gray-500">({review.role})</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <StarRow rating={review.rating} />
        <span
          className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${review.badgeClass}`}
        >
          {review.badge}
        </span>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-400">
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">{review.project}</span>
      <span>{review.date}</span>
    </div>

    <p className="mt-4 text-sm leading-relaxed text-gray-600">{review.text}</p>

    <div className="mt-4 border-t border-gray-50 pt-4">
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-bold ${
          review.wouldRehire ? "text-violet-600" : "text-gray-400"
        }`}
      >
        <ThumbsUp size={14} fill={review.wouldRehire ? "currentColor" : "none"} strokeWidth={2} />
        {review.wouldRehire ? "Would hire again" : "Would not re-hire"}
      </span>
    </div>
  </article>
);

const ReviewsView = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [pendingRating, setPendingRating] = useState(0);
  const [pendingComment, setPendingComment] = useState("");
  const [wouldRehirePending, setWouldRehirePending] = useState(false);

  const filteredReviews = useMemo(() => {
    if (activeFilter === "Pending") return [];
    if (activeFilter === "All") return REVIEWS;
    const stars = parseInt(activeFilter, 10);
    return REVIEWS.filter((r) => r.rating === stars);
  }, [activeFilter]);

  const showPending = activeFilter === "All" || activeFilter === "Pending";

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              activeFilter === tab
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <MessageCircle size={18} strokeWidth={2.25} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{SUMMARY.reviewsGiven}</p>
          <p className="text-xs font-semibold text-gray-500">Reviews Given</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ThumbsUp size={18} strokeWidth={2.25} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{SUMMARY.wouldRehire}</p>
          <p className="text-xs font-semibold text-gray-500">Would Re-hire</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Star size={18} strokeWidth={2.25} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{SUMMARY.avgGiven}★</p>
          <p className="text-xs font-semibold text-gray-500">Avg Given</p>
        </div>
      </div>

      {showPending ? (
        <section>
          <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-orange-500">
            Awaiting Your Review
          </h3>
          <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-extrabold text-gray-900">{PENDING_REVIEW.name}</p>
                <p className="text-sm font-medium text-gray-500">{PENDING_REVIEW.role}</p>
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                Pending
              </span>
            </div>
            <StarRow interactive value={pendingRating} onChange={setPendingRating} />
            <textarea
              value={pendingComment}
              onChange={(e) => setPendingComment(e.target.value)}
              placeholder="Share your honest feedback about this performer..."
              rows={3}
              className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={wouldRehirePending}
                onChange={(e) => setWouldRehirePending(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              I&apos;d hire them again
            </label>
            <button
              type="button"
              disabled={!pendingRating || !pendingComment.trim()}
              className="mt-4 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white transition enabled:hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Submit
            </button>
          </div>
        </section>
      ) : null}

      {activeFilter !== "Pending" ? (
        <section>
          <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-violet-600">
            {filteredReviews.length} Reviews
          </h3>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ReviewsView;
