/** Normalize a ranking API row for provider/performer UI cards. */
export function mapRankedTasker(t = {}) {
  const displayName = t.displayName || t.user?.name || t.domain || "Performer";
  const completedTasksCount = Math.max(
    Number(t.stats?.completedTasks ?? 0),
    Number(t.tasksCompleted ?? 0),
    Number(t.completedTasksCount ?? 0),
  );
  const avatar =
    t.profilePicUrl ||
    t.avatar ||
    t.photoUrl ||
    t.user?.profilePicUrl ||
    t.user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=059669&color=fff&size=128`;

  return {
    ...t,
    id: t.taskerId || t.id,
    taskerId: t.taskerId || t.id,
    userId: t.userId || t.user?.id,
    displayName,
    profession: t.profession || t.domain || "Tasker",
    domain: t.domain || t.profession || "General",
    skills: Array.isArray(t.skills) ? t.skills : [],
    locationCity: t.locationCity || "",
    kycStatus: t.kycStatus,
    isAvailable: t.isAvailable,
    ratingAvg: t.stats?.ratingAvg ?? t.ratingAvg ?? t.user?.ratingAvg ?? 0,
    completedTasksCount,
    rankingScore: t.rankingScore ?? 0,
    rank: t.rank ?? null,
    scoreBreakdown: t.scoreBreakdown || null,
    stats: t.stats || {},
    matchedCategory: t.matchedCategory || null,
    avatar,
    bio: t.bio || "",
  };
}

export function mapRankedTaskers(list = []) {
  return (Array.isArray(list) ? list : []).map(mapRankedTasker);
}

/** Format rank as #1st, #2nd, #3rd, #4th… */
export function formatRankLabel(rank) {
  if (rank == null || Number.isNaN(Number(rank))) return "Unranked";
  const n = Number(rank);
  const v = n % 100;
  const suffix =
    v >= 11 && v <= 13 ? "th" : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][v % 10];
  return `#${n}${suffix}`;
}
