/** Normalize backend KYC status strings for UI logic. */
export function normalizeKycStatus(raw) {
  const s = String(raw ?? "NOT_SUBMITTED").toUpperCase().trim();
  if (s === "APPROVED") return "VERIFIED";
  if (["PENDING", "UNDER_REVIEW", "IN_REVIEW", "SUBMITTED"].includes(s)) return "PENDING";
  if (s === "REJECTED" || s === "DECLINED") return "REJECTED";
  if (s === "VERIFIED") return "VERIFIED";
  if (s === "NOT_VERIFIED" || s === "NOT_SUBMITTED") return "NOT_SUBMITTED";
  return s;
}

export function isKycVerified(raw) {
  return normalizeKycStatus(raw) === "VERIFIED";
}

export function isKycPending(raw) {
  return normalizeKycStatus(raw) === "PENDING";
}

export function isKycRejected(raw) {
  return normalizeKycStatus(raw) === "REJECTED";
}

export function getKycStatusLabel(raw) {
  const normalized = normalizeKycStatus(raw);
  if (normalized === "VERIFIED") return "Verified";
  if (normalized === "PENDING") return "Under Verification";
  if (normalized === "REJECTED") return "Rejected";
  return "Not Submitted";
}

/** Parse GET /taskers/me/kyc (axios interceptor already unwraps .data). */
export function parseKycResponse(res) {
  const root = res?.data ?? res ?? {};
  const kycStatus = normalizeKycStatus(
    root.kycStatus ?? root.status ?? root.data?.kycStatus
  );
  const submissions = Array.isArray(root.submissions)
    ? root.submissions
    : Array.isArray(root.data?.submissions)
      ? root.data.submissions
      : [];

  const rejectedSub = [...submissions]
    .reverse()
    .find((s) => String(s?.status ?? "").toUpperCase() === "REJECTED");

  const rejectionReason =
    root.rejectionReason ??
    root.latestRejectionReason ??
    rejectedSub?.rejectionReason ??
    null;

  return { kycStatus, submissions, rejectionReason, raw: root };
}
