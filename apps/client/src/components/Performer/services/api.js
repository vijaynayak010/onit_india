import axios from "axios";
import { getApiBaseUrl } from "../../../config/apiBase";
import { attachApiInterceptors } from "../../../utils/apiInterceptors";
import { resolveOnboardRole } from "../../../utils/authSession";

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Token refresh registry — populated by AuthContext on mount
let _tokenRefresher = null;
let _refreshPromise = null;

export const setApiTokenRefresher = (fn) => {
  _tokenRefresher = fn;
};

async function getRefreshedToken() {
  if (!_refreshPromise) {
    _refreshPromise = _tokenRefresher().finally(() => {
      _refreshPromise = null;
    });
  }
  return _refreshPromise;
}

attachApiInterceptors(api, () => (_tokenRefresher ? getRefreshedToken : null));

// --- AUTH & COMMON ---
export const getMe = () => api.get("/users/me");
export const updateMe = (data) => api.put("/users/me", data);
export const requestAccountDeletion = (data) => api.post("/users/me/deletion-request", data || {});
export const getAccountDeletionRequest = () => api.get("/users/me/deletion-request");
export const cancelAccountDeletionRequest = () => api.post("/users/me/deletion-request/cancel");
export const refreshToken = (data) => api.post("/auth/refresh", data);
export const logoutUser = () => api.post("/auth/logout");
export const onboardUser = (role) =>
  api.post("/users/onboard", { role: resolveOnboardRole(role) });

// --- PERFORMER / TASKER API (see Performer API docs) ---

// Profile
export const getMyTaskerProfile = () => api.get("/taskers/me");
export const getOnboardingStatus = () => api.get("/taskers/me/onboarding-status");
export const getGrowthProgress = () => api.get("/performer/growth/progress");
export const getGrowthTrustScore = () => api.get("/performer/growth/trust-score");
export const getGrowthTaskPreview = (category) =>
  api.get("/performer/growth/task-preview", { params: { category } });
export const getGrowthEarningsBenchmark = (category) =>
  api.get("/performer/growth/earnings-benchmark", { params: { category } });
export const getGrowthResources = () => api.get("/performer/growth/resources");
export const getDailyQuiz = () => api.get("/performer/growth/daily-quiz");
export const startDailyQuiz = (assignmentId) =>
  api.post(`/performer/growth/daily-quiz/${assignmentId}/start`);
export const submitDailyQuiz = (assignmentId, attemptId, answers) =>
  api.post(`/performer/growth/daily-quiz/${assignmentId}/attempt`, { attemptId, answers });
export const getDailyQuizHistory = () => api.get("/performer/growth/daily-quiz/history");
export const getPerformerRecommendations = (limit = 3) =>
  api.get("/api/performer/recommendations", { params: { limit } });
export const recordRecommendationImpression = (campaignId, data) =>
  api.post(`/api/performer/recommendations/${campaignId}/impression`, data);
export const recordRecommendationClick = (campaignId, data) =>
  api.post(`/api/performer/recommendations/${campaignId}/click`, data);
export const submitGrowthQuiz = (resourceId, answers) =>
  api.post(`/performer/growth/resources/${resourceId}/quiz-attempts`, { answers });
export const submitGrowthCourse = (resourceId, evidenceUrl) =>
  api.post(`/performer/growth/resources/${resourceId}/course-submissions`, { evidenceUrl });
export const getTaskerPublicProfile = (id) => api.get(`/taskers/${id}`);
export const createTaskerProfile = (data) => api.post("/taskers", data);
export const updateTaskerProfile = (data) => api.put("/taskers/me", data);
export const toggleTaskerAvailability = () =>
  api.patch("/taskers/me/availability/toggle", {});
export const listTaskCatalogDomains = (params) =>
  api.get("/task-catalog/domains", { params });

// Bank account
export const getBankAccount = () => api.get("/taskers/me/bank-account");
export const upsertBankAccount = (data) =>
  api.put("/taskers/me/bank-account", data);

// KYC — two-step flow + legacy single-doc submit
export const getMyKycStatus = () => api.get("/taskers/me/kyc");
export const submitKycIdDocument = (data) => api.post("/taskers/me/kyc/id", data);
export const submitKycSelfie = (data) => api.post("/taskers/me/kyc/selfie", data);
/** @deprecated Legacy single-document KYC */
export const submitKyc = (data) => api.post("/taskers/me/kyc", data);

// Saved tasks & recent searches
export const getSavedTasks = (params) =>
  api.get("/taskers/me/saved-tasks", { params });
export const saveTask = (taskId) =>
  api.post(`/taskers/me/saved-tasks/${taskId}`, {});
export const unsaveTask = (taskId) =>
  api.delete(`/taskers/me/saved-tasks/${taskId}`, { data: {} });
export const addRecentSearch = (query) =>
  api.post("/taskers/me/recent-search", { query });
export const getSearchTrending = () => api.get("/search/trending");

// Provider discovery (read-only; Provider role on backend)
export const listTaskers = (params) => api.get("/taskers", { params });
export const searchTaskers = (params) => api.get("/taskers/search", { params });

/** Logged-in tasker ranking + leaderboard — GET /taskers/me/ranking */
export const getMyTaskerRanking = (params) =>
  api.get("/taskers/me/ranking", { params });

/** Earnings analytics — GET /taskers/me/analytics/* */
export const getMyAnalyticsSummary = () =>
  api.get("/taskers/me/analytics/summary");
export const getMyEarningsByCategory = (params) =>
  api.get("/taskers/me/analytics/earnings-by-category", { params });
export const getMyMonthlyEarnings = (params) =>
  api.get("/taskers/me/analytics/monthly-earnings", { params });

// Tasks Feed & Interactions
export const getTasksFeed = (params) => api.get("/tasks/feed", { params });
export const searchTasks = (params) => api.get("/tasks/search", { params });
export const expressInterest = (taskId, data) =>
  api.post(`/tasks/${taskId}/interest`, data);
export const getTaskDetails = (id) => api.get(`/tasks/${id}`);
export const getProviderProfile = (id) => api.get(`/providers/${id}`);
export const getProviderReviews = (providerId, params) =>
  api.get(`/providers/${providerId}/reviews`, { params });

// Active / Assigned Tasks
export const getAssignedTasks = (params) =>
  api.get("/tasks/assigned-to-me", { params });
export const getMyInterests = (params) =>
  api.get("/tasks/my-interests", { params });
export const getMyWork = (params) => api.get("/tasks/my-work", { params });
export const getMyAppliedTasks = (params) =>
  api.get("/tasks/my-applied-tasks", { params });
export const getMyActiveTasks = (params) =>
  api.get("/tasks/my-active-tasks", { params });
export const getMyCompletedTasks = (params) =>
  api.get("/tasks/my-completed-tasks", { params });
export const acceptOffer = (assignmentId) =>
  api.put(`/tasks/assignments/${assignmentId}/accept-offer`);
export const declineOffer = (assignmentId, data) =>
  api.put(`/tasks/assignments/${assignmentId}/decline-offer`, data);
export const acceptTask = (taskId) => api.post(`/tasks/${taskId}/assign`);
export const submitTask = (assignmentId, data) =>
  api.post(`/tasks/${assignmentId}/submit`, data);
export const addTaskUpdate = (assignmentId, data) =>
  api.post(`/tasks/updates/${assignmentId}`, data);
export const getTaskUpdates = (assignmentId) =>
  api.get(`/tasks/updates/${assignmentId}`);

// Checklists
export const getChecklist = (taskId) => api.get(`/tasks/${taskId}/checklist`);
const retryPutRoutes = async (paths, data) => {
  let lastError;
  for (const path of paths) {
    try {
      return await api.put(path, data);
    } catch (err) {
      lastError = err;
      const message = String(err?.message || err?.error || "");
      const routeMissing = err?.status === 404 || message.toLowerCase().includes("cannot put");
      if (!routeMissing) throw err;
    }
  }
  throw lastError;
};
/**
 * Tasker submits/resubmits work.
 * The API contract uses tasker-prefixed properties. Accept the former UI names
 * here as well so every caller produces a valid checklist submission payload.
 */
const toChecklistSubmissionPayload = ({ description, githubLink, fileIds, ...data } = {}) => ({
  ...data,
  ...(description !== undefined ? { taskerDescription: description } : {}),
  ...(githubLink ? { taskerLink: githubLink } : {}),
  ...(fileIds !== undefined ? { taskerFiles: fileIds } : {}),
});

export const tickChecklistItem = (itemId, data = {}) =>
  retryPutRoutes([
    `/tasks/checklist/items/${itemId}/tick`,
    `/checklist/items/${itemId}/tick`,
    `/tasks/checklist-item/${itemId}/tick`,
  ], toChecklistSubmissionPayload(data));

// Uploads
export const getPresignedUrl = (data) =>
  api.post("/uploads/presigned-url", data);
export const confirmUpload = (data) => api.post("/uploads/confirm", data);
export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/uploads/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Wallet & Earnings
export const getWalletBalance = () => api.get("/wallet");
export const getTransactions = (params) =>
  api.get("/wallet/transactions", { params });
export const getPaymentHistory = (params) => api.get("/payments/history", { params });
/** Request withdrawal — POST /payout-methods/withdrawals */
export const withdrawFunds = (data) => api.post("/payout-methods/withdrawals", data);
export const getMyWithdrawals = () => api.get("/payout-methods/withdrawals");

// Payout Methods (Bank/UPI)
export const getPayoutMethods = () => api.get("/payout-methods");
export const addPayoutMethod = (data) => api.post("/payout-methods", data);
export const deletePayoutMethod = (id) => api.delete(`/payout-methods/${id}`);

// Chat & Support
export const listConversations = (params) =>
  api.get("/conversations", { params });
export const createConversation = (data) => api.post("/conversations", data);
export const getMessages = (convId, params) =>
  api.get(`/conversations/${convId}/messages`, { params });
export const sendMessage = (convId, data) =>
  api.post(`/conversations/${convId}/messages`, data);
export const markAsDelivered = (convId, data) =>
  api.post(`/conversations/${convId}/delivered`, data);
export const markAsRead = (convId, data) =>
  api.post(`/conversations/${convId}/read`, data);
export const listSupportTickets = () => api.get("/support/tickets/me");
export const getSupportTicketMessages = (ticketId) => api.get(`/support/tickets/${ticketId}`);
export const createSupportTicket = (data) => api.post("/support/tickets", data);
export const addSupportMessage = (ticketId, data) => api.post(`/support/tickets/${ticketId}/messages`, data);

// Task Reviews
export const createTaskReview = (taskId, data) =>
  api.post(`/tasks/${taskId}/reviews`, data);
export const getTaskReviews = (taskId, params) =>
  api.get(`/tasks/${taskId}/reviews`, { params });
export const getMyReferralStats = () => api.get("/referral/me");
export const getReferralDashboard = () => api.get("/referral/dashboard");
export const applyReferralCode = (code) => api.post("/referral/apply", { code });
export const getTaskerReviewsList = (taskerId, params) =>
  api.get(`/taskers/${taskerId}/reviews`, { params });
export const submitRating = (data) => api.post("/ratings", data);

// Notifications
export const getNotifications = (params) =>
  api.get("/notifications", { params });
export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () =>
  api.put("/notifications/read-all");
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// Task invitations
export const getMyInvitations = (params) => api.get('/tasks/my-invitations', { params });
export const acceptInvitation = (invitationId) => api.put(`/tasks/invitations/${invitationId}/accept`);
export const declineInvitation = (invitationId, data) => api.put(`/tasks/invitations/${invitationId}/decline`, data);

// Profile email verification
export const startProfileEmailVerification = (email) => api.post('/auth/profile-email/start-verification', { email });
export const verifyProfileEmail = (email, otp) => api.post('/auth/profile-email/verify', { email, otp });

export default api;
