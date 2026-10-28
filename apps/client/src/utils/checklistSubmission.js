const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)(\?|$)/i;

export const isImageUrl = (url) => Boolean(url && IMAGE_EXT.test(url));

/** API item statuses from checklist doc */
export const CHECKLIST_STATUS = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  REVIEW_REQUESTED: "REVIEW_REQUESTED",
  CHANGE_REQUESTED: "CHANGE_REQUESTED",
  COMPLETED: "COMPLETED",
  APPROVED: "APPROVED",
  DISPUTED: "DISPUTED",
};

export const checklistStatusLabel = (status) => {
  const s = String(status || "").toUpperCase();
  if ([CHECKLIST_STATUS.SUBMITTED, CHECKLIST_STATUS.REVIEW_REQUESTED].includes(s)) return "In Review";
  if (s === CHECKLIST_STATUS.CHANGE_REQUESTED) return "Revision Required";
  if ([CHECKLIST_STATUS.COMPLETED, CHECKLIST_STATUS.APPROVED].includes(s)) return "Approved";
  if (s === CHECKLIST_STATUS.DISPUTED) return "Admin Review";
  return "Pending";
};

export const isChecklistItemComplete = (status) => {
  const s = String(status || "").toUpperCase();
  return [CHECKLIST_STATUS.COMPLETED, CHECKLIST_STATUS.APPROVED].includes(s);
};

export const isChecklistItemInReview = (status) => {
  const s = String(status || "").toUpperCase();
  return [CHECKLIST_STATUS.SUBMITTED, CHECKLIST_STATUS.REVIEW_REQUESTED].includes(s);
};

export const isChecklistItemDisputed = (status) =>
  String(status || "").toUpperCase() === CHECKLIST_STATUS.DISPUTED;

export const canTaskerSubmitItem = (status) => {
  const s = String(status || "").toUpperCase();
  return [CHECKLIST_STATUS.PENDING, CHECKLIST_STATUS.CHANGE_REQUESTED, "NOT_STARTED", "OPEN", "IN_PROGRESS"].includes(s);
};

/** First pending / change-requested item in order (sequential enforcement). */
export const getNextActionableItemId = (items = []) => {
  const sorted = [...items].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  const next = sorted.find((item) => canTaskerSubmitItem(item.apiStatus || item.status));
  const fallback = sorted.find((item) => !isChecklistItemComplete(item.apiStatus || item.status));
  return next?.id || fallback?.id || null;
};

const fileUrl = (f) => f?.url || f?.fileUrl || f?.documentUrl || f?.s3Url || "";
const fileName = (f) =>
  f?.filename || f?.name || (fileUrl(f) ? decodeURIComponent(fileUrl(f).split("/").pop()?.split("?")[0] || "") : "file");

const uniqueFiles = (files) => {
  const seen = new Set();
  return files.filter((file) => {
    const key = fileUrl(file) || file?.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const latestSubmissionFor = (item) => {
  const candidates = [
    item.latestSubmission,
    item.submission,
    item.taskerSubmission,
    ...(Array.isArray(item.submissions) ? item.submissions : []),
    ...(Array.isArray(item.checklistSubmissions) ? item.checklistSubmissions : []),
  ].filter(Boolean);

  if (candidates.length === 0) return {};

  return candidates.sort((a, b) => {
    const aTime = new Date(a.submittedAt || a.createdAt || a.updatedAt || 0).getTime();
    const bTime = new Date(b.submittedAt || b.createdAt || b.updatedAt || 0).getTime();
    if (aTime !== bTime) return bTime - aTime;
    return Number(b.version || 0) - Number(a.version || 0);
  })[0] || {};
};

export const resolveChecklistSubmission = (item) => {
  const latestSubmission = latestSubmissionFor(item);
  const review = latestSubmission.review && typeof latestSubmission.review === "object"
    ? latestSubmission.review
    : {};
  const files = uniqueFiles([
    ...(Array.isArray(item.files) ? item.files : []),
    ...(Array.isArray(latestSubmission.taskerFiles) ? latestSubmission.taskerFiles : []),
    ...(Array.isArray(latestSubmission.files) ? latestSubmission.files : []),
    ...(Array.isArray(latestSubmission.attachments) ? latestSubmission.attachments : []),
  ]);
  const providerFiles = uniqueFiles([
    ...(Array.isArray(review.providerFiles) ? review.providerFiles : []),
    ...(Array.isArray(latestSubmission.providerFiles) ? latestSubmission.providerFiles : []),
  ]);
  const imageFile = files.find((f) => isImageUrl(fileUrl(f)));
  const docFile = files.find((f) => fileUrl(f) && (!imageFile || fileUrl(f) !== fileUrl(imageFile)));

  const description =
    latestSubmission.description ||
    latestSubmission.taskerDescription ||
    latestSubmission.submissionDescription ||
    latestSubmission.submissionNote ||
    latestSubmission.note ||
    item.taskerDescription ||
    item.submissionDescription ||
    item.submissionNote ||
    item.description ||
    "";

  const imageUrl =
    latestSubmission.imageUrl ||
    latestSubmission.image ||
    latestSubmission.photoUrl ||
    latestSubmission.photo ||
    item.imageUrl ||
    item.image ||
    item.photoUrl ||
    (imageFile ? fileUrl(imageFile) : "") ||
    "";

  const attachmentUrl =
    latestSubmission.documentUrl ||
    latestSubmission.attachmentUrl ||
    latestSubmission.fileUrl ||
    latestSubmission.url ||
    item.documentUrl ||
    item.attachmentUrl ||
    item.fileUrl ||
    (docFile ? fileUrl(docFile) : "") ||
    "";

  const attachmentName =
    latestSubmission.attachmentName ||
    latestSubmission.filename ||
    latestSubmission.fileName ||
    item.attachmentName ||
    item.filename ||
    (docFile ? fileName(docFile) : "") ||
    (attachmentUrl ? decodeURIComponent(attachmentUrl.split("/").pop()?.split("?")[0] || "") : "") ||
    "attachment";
  const displayFiles = uniqueFiles([
    ...files,
    ...(imageUrl ? [{ url: imageUrl, filename: fileName(imageFile) || "submission-image" }] : []),
    ...(attachmentUrl ? [{ url: attachmentUrl, filename: attachmentName }] : []),
  ]);

  return {
    description,
    githubLink: latestSubmission.taskerLink || latestSubmission.githubLink || latestSubmission.link || item.taskerLink || item.githubLink || "",
    imageUrl,
    attachmentUrl,
    attachmentName,
    files: displayFiles,
    providerFiles,
    providerFeedback: review.providerFeedback || latestSubmission.providerFeedback || item.providerFeedback || null,
    reviewStatus: review.status || latestSubmission.reviewStatus || null,
    reviewedAt: review.reviewedAt || latestSubmission.reviewedAt || null,
    version: latestSubmission.version || null,
    submittedAt: latestSubmission.submittedAt || latestSubmission.createdAt || item.submittedAt || item.completedAt || item.updatedAt || null,
    hasSubmissionContent: Boolean(description || displayFiles.length || latestSubmission.taskerLink || latestSubmission.githubLink || item.taskerLink || item.githubLink),
  };
};

export const mapChecklistItemFromApi = (raw) => {
  const apiStatus = String(raw.status || (raw.isChecked ? CHECKLIST_STATUS.COMPLETED : CHECKLIST_STATUS.PENDING)).toUpperCase();
  const submission = resolveChecklistSubmission(raw);
  const label = checklistStatusLabel(apiStatus);
  const completed = isChecklistItemComplete(apiStatus);


  return {
    id: raw.id,
    text: raw.title,
    note: raw.note || "",
    title: raw.title,
    order: raw.order ?? 0,
    apiStatus,
    status: label,
    meta: label,
    checked: completed,
    color: completed ? "green" : apiStatus === CHECKLIST_STATUS.DISPUTED ? "red" : apiStatus === CHECKLIST_STATUS.CHANGE_REQUESTED ? "orange" : isChecklistItemInReview(apiStatus) ? "blue" : "gray",
    submission,
    description: submission.description,
    providerFeedback: submission.providerFeedback,
    githubLink: submission.githubLink,
    files: submission.files,
    isDisputed: apiStatus === CHECKLIST_STATUS.DISPUTED || raw.isDisputed === true,
    disputeReason: raw.disputeReason || "",
    submissions: Array.isArray(raw.submissions) ? raw.submissions : [],
  };
};

export const mapChecklistItemsFromApi = (items) =>
  (items || [])
    .slice()
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    .map((raw) => mapChecklistItemFromApi(raw));

/** Normalize suggested tasker from GET /taskers/suggested for UI cards. */
export const mapSuggestedTasker = (t) => ({
  ...t,
  id: t.id,
  userId: t.userId || t.user?.id,
  displayName: t.displayName || t.user?.name || t.user?.email?.split("@")[0] || t.domain || "Performer",
  profession: t.domain || t.profession || "Tasker",
  ratingAvg: t.ratingAvg ?? t.user?.ratingAvg ?? 0,
  completedTasksCount: t.completedTasksCount || 0,
  bio: t.bio || "",
  skills: Array.isArray(t.skills) ? t.skills : [],
  kycStatus: t.kycStatus,
  avatar:
    t.user?.profilePicUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(t.displayName || t.domain || "P")}&background=059669&color=fff&size=128`,
});
