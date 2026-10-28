export function parseTasksFeed(feedRes) {
  if (!feedRes) return [];
  let tasks = [];
  if (feedRes.tasks) tasks = feedRes.tasks;
  else if (feedRes.data) tasks = feedRes.data;
  else if (Array.isArray(feedRes)) tasks = feedRes;

  return tasks
    .filter((t) => String(t.status || "").toUpperCase() === "PUBLISHED")
    .sort((a, b) => String(a.id || a._id).localeCompare(String(b.id || b._id)));
}

export function normalizeFeedTask(rt) {
  const category = rt.category || "General";
  const subcategory = rt.subcategory || rt.subCategory || null;
  const isUrgent = String(rt.priority || "").toUpperCase() === "HIGH";
  const price = Number(rt.priceAmount ?? rt.budget ?? 0);

  const tags = [category];
  if (subcategory) tags.push(subcategory);
  if (isUrgent) tags.push("URGENT");

  const due = rt.dueAt ? new Date(rt.dueAt) : null;
  const deadline = due
    ? due.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Flexible";

  return {
    id: rt.id,
    raw: rt,
    title: rt.title || "Untitled Task",
    price,
    priceLabel: price > 0 ? `₹${price.toLocaleString("en-IN")}` : "Competitive",
    deadline,
    deadlineLabel: due ? `Deadline: ${deadline}` : `Posted: ${rt.createdAt ? new Date(rt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently"}`,
    location: rt.location || "Remote",
    category,
    priority: rt.priority,
    isUrgent,
    isHighPay: price >= 10000,
    isShortTerm: due ? due.getTime() - Date.now() <= 14 * 24 * 60 * 60 * 1000 : false,
    rating: Number(rt.provider?.ratingAvg ?? rt.rating ?? 4.8).toFixed(1),
    tags,
  };
}

export function filterNormalizedTasks(tasks, { search = "", pill = "all" } = {}) {
  const q = search.trim().toLowerCase();
  return tasks.filter((t) => {
    if (pill === "high-priority" && !t.isUrgent) return false;
    if (pill === "short-term" && !t.isShortTerm) return false;
    if (pill === "high-pay" && !t.isHighPay) return false;

    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      String(t.raw.description || "").toLowerCase().includes(q)
    );
  });
}
