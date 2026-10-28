/**
 * notificationRoutes.js
 *
 * Central routing config for notification tap-to-navigate.
 * Method 3 + Method 5: Payload Metadata + Config-Driven Routing Table.
 *
 * Entities sourced from: notification_doc_shreya_4june2026.md
 *
 * HOW TO ADD A NEW NOTIFICATION TYPE:
 *   1. Get the exact type string from backend
 *   2. Identify which payload entity is needed for routing (taskId, assignmentId, etc.)
 *   3. Add one entry below — done. No other file changes needed.
 *
 * Config shape:
 * {
 *   path: string           — route template with placeholders
 *   params: string[]       — payload entity keys to extract and inject
 *   roleOverride?: string  — force 'provider' or 'performer' if needed
 * }
 *
 * Available placeholders: :role, :taskId, :assignmentId, :interestId, :conversationId, :transactionId
 */

export const NOTIFICATION_ROUTE_MAP = {

  // ─── KYC ────────────────────────────────────────────────────────────────
  KYC_STATUS_UPDATED:         { path: "/performer/kyc", params: [], roleOverride: "performer" },
  KYC_COMPLETE_REMINDER:      { path: "/performer/kyc", params: [], roleOverride: "performer" },

  // ─── TASK — Interest / Hiring ────────────────────────────────────────────
  INTEREST_EXPRESSED:         { path: "/provider/task-applicants?taskId=:taskId", params: ["taskId"], roleOverride: "provider" },
  INTEREST_ACCEPTED:          { path: "/performer/task-accepted/:taskId",  params: ["taskId"], roleOverride: "performer" },
  INTEREST_REJECTED:          { path: "/performer/my-tasks",               params: [], roleOverride: "performer" },
  TASK_ASSIGNED:              { path: "/performer/active-task/:taskId",    params: ["taskId"], roleOverride: "performer" },
  DIRECT_HIRE_REQUEST:        { path: "/performer/invitation/:taskId",     params: ["taskId"], roleOverride: "performer" },

  // ─── TASK — Execution ────────────────────────────────────────────────────
  TASK_SUBMITTED:             { path: "/provider/active-task/:taskId",     params: ["taskId"], roleOverride: "provider" },
  TASK_COMPLETED:             { path: "/:role/active-task/:taskId",        params: ["taskId"] },
  TASK_WORK_ADMIN_APPROVED:   { path: "/:role/active-task/:taskId",        params: ["taskId"] },
  TASK_WORK_ADMIN_REJECTED:   { path: "/:role/active-task/:taskId",        params: ["taskId"] },
  TASK_PROGRESS_UPDATE:       { path: "/provider/active-task/:taskId",     params: ["taskId"], roleOverride: "provider" },
  TASK_PROVIDER_UPDATE:       { path: "/performer/active-task/:taskId",    params: ["taskId"], roleOverride: "performer" },
  SUBMISSION_REJECTED:        { path: "/performer/active-task/:taskId",    params: ["taskId"], roleOverride: "performer" },
  TASK_DUE_SOON:              { path: "/performer/active-task/:taskId",    params: ["taskId"], roleOverride: "performer" },
  CHECKLIST_ITEM_COMPLETED:   { path: "/:role/active-task/:taskId",        params: ["taskId"] },
  CHECKLIST_ALL_COMPLETED:    { path: "/:role/active-task/:taskId",        params: ["taskId"] },

  // ─── TASK — Publication & Lifecycle ──────────────────────────────────────
  NEW_TASK_AVAILABLE:         { path: "/performer/task/:taskId",           params: ["taskId"], roleOverride: "performer" },
  TASK_LIVE:                  { path: "/provider/task-status?taskId=:taskId", params: ["taskId"], roleOverride: "provider" },
  TASK_REJECTED:              { path: "/provider/task-status?taskId=:taskId",       params: ["taskId"], roleOverride: "provider" },

  // ─── CHAT & SUPPORT ──────────────────────────────────────────────────────
  MESSAGE_RECEIVED:           { path: "/:role/chats",                      params: [] },
  SUPPORT_TICKET_UPDATE:      { path: "/:role/chats",                      params: [] },

  // ─── WALLET / PAYMENTS ───────────────────────────────────────────────────
  PAYMENT_RECEIVED:           { path: "/:role/wallet",                     params: [] },

  // ─── PROFILE & REWARDS ───────────────────────────────────────────────────
  PROFILE_INCOMPLETE_NUDGE:   { path: "/:role/profile",                    params: [] },
  ADMIN_BROADCAST:            { path: "/:role/dashboard",                  params: [] },
  REFERRAL_REWARD_ELIGIBLE:   { path: "/:role/rewards",                    params: [] },

  // ─── INTERNSHIPS ─────────────────────────────────────────────────────────
  INTERNSHIP_APPLIED:         { path: "/provider/internships",             params: [], roleOverride: "provider" },
  INTERNSHIP_ACCEPTED:        { path: "/performer/internships",            params: [], roleOverride: "performer" },
  INTERNSHIP_REJECTED:        { path: "/performer/internships",            params: [], roleOverride: "performer" },
  INTERNSHIP_PUBLISHED:       { path: "/performer/internships",            params: [], roleOverride: "performer" }
};

/** Fallback when no config match is found */
export const NOTIFICATION_FALLBACK_ROUTE = "/:role/dashboard";
