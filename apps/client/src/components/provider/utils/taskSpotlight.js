const FLOW_OVERRIDE_KEY = "onit_provider_task_flow_overrides";

export const SPOTLIGHT_TYPES = {
  TALENT: "talent",
  UNDER_REVIEW: "under_review",
  REVIEW_FAILED: "review_failed",
  LIVE: "live",
};

const UNDER_REVIEW_STATUSES = new Set([
  "UNDER_REVIEW",
  "PENDING_REVIEW",
  "IN_REVIEW",
  "SUBMITTED_FOR_REVIEW",
  "REVIEW_PENDING",
  "PENDING_APPROVAL",
  "AWAITING_APPROVAL",
  "AWAITING_REVIEW",
  "MODERATION",
  "PENDING",
]);

const REVIEW_FAILED_STATUSES = new Set([
  "REVIEW_FAILED",
  "REJECTED",
  "NEEDS_CHANGES",
  "CHANGES_REQUESTED",
  "FAILED_REVIEW",
]);

const LIVE_STATUSES = new Set([
  "PUBLISHED",
  "LIVE",
  "OPEN",
  "ACTIVE",
  "MATCHING",
  "ACCEPTING_APPLICATIONS",
]);

export function readFlowOverrides() {
  try {
    const raw = sessionStorage.getItem(FLOW_OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setFlowOverride(taskId, flowType) {
  if (!taskId) return;
  const overrides = readFlowOverrides();
  overrides[String(taskId)] = {
    type: flowType,
    setAt: Date.now(),
  };
  sessionStorage.setItem(FLOW_OVERRIDE_KEY, JSON.stringify(overrides));
}

export function clearFlowOverride(taskId) {
  if (!taskId) return;
  const overrides = readFlowOverrides();
  delete overrides[String(taskId)];
  sessionStorage.setItem(FLOW_OVERRIDE_KEY, JSON.stringify(overrides));
}

export function normalizeTaskStatus(task) {
  return String(task?.rawStatus || task?.status || "").toUpperCase();
}

export function getSpotlightTypeForTask(task) {
  if (!task) return null;

  const override = readFlowOverrides()[String(task.id)];
  if (override?.type) return override.type;

  const status = normalizeTaskStatus(task);
  if (UNDER_REVIEW_STATUSES.has(status)) return SPOTLIGHT_TYPES.UNDER_REVIEW;
  if (REVIEW_FAILED_STATUSES.has(status)) return SPOTLIGHT_TYPES.REVIEW_FAILED;
  if (LIVE_STATUSES.has(status)) return SPOTLIGHT_TYPES.LIVE;
  return null;
}

export function pickSpotlightTask(activities = []) {
  if (!activities.length) return null;

  const priority = [
    SPOTLIGHT_TYPES.REVIEW_FAILED,
    SPOTLIGHT_TYPES.UNDER_REVIEW,
    SPOTLIGHT_TYPES.LIVE,
  ];

  for (const type of priority) {
    const match = activities.find((task) => getSpotlightTypeForTask(task) === type);
    if (match) return { task: match, type };
  }

  const newest = [...activities].sort((a, b) => {
    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  })[0];

  const inferred = getSpotlightTypeForTask(newest);
  if (inferred) return { task: newest, type: inferred };
  return null;
}

export function providerHasAssignableTasks(activities = []) {
  return activities.some((task) => LIVE_STATUSES.has(normalizeTaskStatus(task)));
}

export function providerHasPostedTasks(activities = []) {
  return activities.some((task) => {
    const status = normalizeTaskStatus(task);
    return status && status !== "DRAFT";
  });
}

/** Normalize admin rejection feedback from task list/detail payloads. */
export function parseReviewCommentsFromTask(task) {
  if (!task) return [];

  const root = task?.data && typeof task.data === "object" && !Array.isArray(task.data)
    ? { ...task, ...task.data }
    : task;
  const nested = {
    ...(root.details && typeof root.details === "object" ? root.details : {}),
    ...(root.moderation && typeof root.moderation === "object" ? root.moderation : {}),
    ...(root.review && typeof root.review === "object" ? root.review : {}),
    ...(root.rejection && typeof root.rejection === "object" ? root.rejection : {}),
    ...(root.adminReview && typeof root.adminReview === "object" ? root.adminReview : {}),
  };
  const source = { ...nested, ...root };

  const arrayCandidates = [
    source.reviewComments,
    source.rejectionReasons,
    source.rejectionComments,
    source.feedbackComments,
    source.comments,
  ];

  for (const candidate of arrayCandidates) {
    if (!Array.isArray(candidate) || !candidate.length) continue;
    const lines = candidate
      .map((item) => {
        if (item == null) return "";
        if (typeof item === "string") return item.trim();
        return String(item.reason || item.comment || item.message || item.text || "").trim();
      })
      .filter(Boolean);
    if (lines.length) return lines;
  }

  const singleCandidates = [
    source.reviewFeedback,
    source.rejectionReason,
    source.rejectionComment,
    source.adminRejectionReason,
    source.adminReason,
    source.adminFeedback,
    source.moderationNote,
    source.moderationFeedback,
    source.rejectReason,
    source.reject_reason,
    source.rejection_reason,
    source.feedback,
    source.reason,
    source.note,
    source.message,
  ];

  for (const raw of singleCandidates) {
    if (raw == null) continue;
    const text = String(raw).trim();
    if (!text) continue;

    const lines = text
      .split(/\r?\n+|(?:^|\n)\s*[-•*]\s+/)
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.length > 1 ? lines : [text];
  }

  return [];
}
