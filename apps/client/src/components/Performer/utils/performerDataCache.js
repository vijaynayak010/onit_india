export const PERFORMER_DASHBOARD_CACHE_KEY = "onit_performer_dashboard_cache_v1";
export const PERFORMER_DASHBOARD_CACHE_TTL_MS = 20 * 60 * 1000;
export const PERFORMER_TASKS_CACHE_TTL_MS = 5 * 60 * 1000;
const inFlightRequests = new Map();

export const getPerformerTasksCacheKey = (tab) =>
  `onit_performer_tasks_cache_v1:${String(tab || "active").toLowerCase()}`;

export const getPerformerChecklistCacheKey = (taskId) =>
  `onit_performer_checklist_cache_v1:${String(taskId || "unknown")}`;

function getScopedCacheKey(key) {
  if (typeof window === "undefined") return key;

  try {
    const user = JSON.parse(window.localStorage.getItem("onit_user") || "{}");
    const identity = user.id || user.sub || user.userId || user.email || "session";
    return `${key}:${encodeURIComponent(String(identity))}`;
  } catch {
    return `${key}:session`;
  }
}

export function readPerformerCache(key, ttlMs, { allowStale = false } = {}) {
  if (typeof window === "undefined") return null;

  try {
    const serialized = window.sessionStorage.getItem(getScopedCacheKey(key));
    if (!serialized) return null;

    const cached = JSON.parse(serialized);
    const age = Date.now() - Number(cached?.timestamp || 0);
    if (age < 0 || cached?.data == null) return null;
    if (!allowStale && age >= ttlMs) return null;

    return cached.data;
  } catch {
    return null;
  }
}

/** Keep the last good payload for an instant render, but force a quiet refresh. */
export function expirePerformerCache(key) {
  if (typeof window === "undefined") return;

  try {
    const scopedKey = getScopedCacheKey(key);
    const serialized = window.sessionStorage.getItem(scopedKey);
    if (!serialized) return;

    const cached = JSON.parse(serialized);
    if (cached?.data == null) return;
    window.sessionStorage.setItem(scopedKey, JSON.stringify({
      ...cached,
      timestamp: Number.MIN_SAFE_INTEGER,
    }));
  } catch (error) {
    console.warn("[PERFORMER CACHE] Unable to expire data:", error);
  }
}

export function writePerformerCache(key, data) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(getScopedCacheKey(key), JSON.stringify({
      timestamp: Date.now(),
      data,
    }));
  } catch (error) {
    console.warn("[PERFORMER CACHE] Unable to store data:", error);
  }
}

export function dedupePerformerRequest(key, requestFactory) {
  const scopedKey = getScopedCacheKey(key);
  const existingRequest = inFlightRequests.get(scopedKey);
  if (existingRequest) return existingRequest;

  const request = Promise.resolve()
    .then(requestFactory)
    .finally(() => {
      if (inFlightRequests.get(scopedKey) === request) {
        inFlightRequests.delete(scopedKey);
      }
    });

  inFlightRequests.set(scopedKey, request);
  return request;
}
