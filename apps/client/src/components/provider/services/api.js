import axios from 'axios';
import { getApiBaseUrl } from '../../../config/apiBase';
import { attachApiInterceptors } from '../../../utils/apiInterceptors';
import { resolveOnboardRole } from '../../../utils/authSession';

// Token refresh registry — populated by AuthContext on mount
let _tokenRefresher = null;
let _refreshPromise = null;

export const setApiTokenRefresher = (fn) => { _tokenRefresher = fn; };

async function getRefreshedToken() {
    if (!_refreshPromise) {
        _refreshPromise = _tokenRefresher().finally(() => { _refreshPromise = null; });
    }
    return _refreshPromise;
}

// NestJS backend (Lambda) — same proxy as Performer/Admin
const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: { 'Content-Type': 'application/json' },
});

// Express micro-server — only for AI/task-assist routes
const aiApi = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

attachApiInterceptors(api, () => (_tokenRefresher ? getRefreshedToken : null));
attachApiInterceptors(aiApi, () => (_tokenRefresher ? getRefreshedToken : null));

// --- AUTH & COMMON ---
export const getMe = (config) =>
  api.get("/users/me", {
    ...config,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...(config?.headers || {}),
    },
    params: { _t: Date.now(), ...(config?.params || {}) },
  });
export const checkEmailExists = (email) => api.post('/auth/check-email', { email });
export const checkAccountExists = ({ identifier, app }) =>
  api.post('/auth/check-account', { identifier, app });
export const updateUserMe = (data) => api.put('/users/me', data);
/** @deprecated Use requestAccountDeletion */
export const requestAccountDeletionOtp = () => api.post('/users/me/delete/otp');
/** @deprecated Use requestAccountDeletion */
export const confirmAccountDeletion = (data) => api.delete('/users/me', { data });
export const requestAccountDeletion = (data) => api.post('/users/me/deletion-request', data || {});
export const getAccountDeletionRequest = () => api.get('/users/me/deletion-request');
export const cancelAccountDeletionRequest = () => api.post('/users/me/deletion-request/cancel');
export const refreshToken = (data) => api.post('/auth/refresh', data);
export const logoutUser = () => api.post('/auth/logout');
/** Backend assigns role from JWT azp; body.role must be PROVIDER or TASKER (not PERFORMER). */
export const onboardUser = (role) =>
  api.post('/users/onboard', { role: resolveOnboardRole(role) });

// --- PROVIDER API ENDPOINTS ---

// Profile
export const getUserProfile = getMe; // Alias for backward compatibility

// Admin performer-growth quiz controls
export const listDailyQuizAssignmentsAdmin = () => api.get('/admin/performer-growth/daily-quizzes');
export const listLearningResourcesAdmin = () => api.get('/admin/performer-growth/resources');
export const createDailyQuizAssignmentAdmin = (data) => api.post('/admin/performer-growth/daily-quizzes', data);
export const updateDailyQuizAssignmentAdmin = (assignmentId, data) =>
    api.patch(`/admin/performer-growth/daily-quizzes/${assignmentId}`, data);
export const getDailyQuizAnalyticsAdmin = (assignmentId) =>
    api.get(`/admin/performer-growth/daily-quizzes/${assignmentId}/analytics`);
export const getProviderOnboardingStatus = () => api.get('/providers/me/onboarding-status');
export const getProviderProfile = () => api.get('/providers/me');
export const updateProviderProfile = (data) => api.put('/providers/me', data);
export const createProviderProfile = (data) => api.post('/providers', data);

// Wallet & Payouts
export const getWalletBalance = () => api.get("/wallet");
export const getTransactions = (params) => api.get("/wallet/transactions", { params });
export const getPaymentHistory = (params) => api.get("/payments/history", { params });
export const getPayoutMethods = () => api.get("/payout-methods");
export const addPayoutMethod = (data) => api.post("/payout-methods", data);
export const deletePayoutMethod = (id) => api.delete(`/payout-methods/${id}`);
/** Request withdrawal — POST /payout-methods/withdrawals */
export const withdrawFunds = (data) => api.post("/payout-methods/withdrawals", data);
export const getMyWithdrawals = () => api.get("/payout-methods/withdrawals");
/** @deprecated Use withdrawFunds — kept for older imports */
export const requestWithdrawal = withdrawFunds;

// Chat (Conversations & Messages)
export const listConversations = (params) => api.get('/conversations', { params });
export const createConversation = (data) => api.post('/conversations', data);
export const getConversationMetadata = (id) => api.get(`/conversations/${id}`);

// Matches frontend usage in ChatsPage.jsx
export const getMessages = (convId, params) => api.get(`/conversations/${convId}/messages`, { params });
export const sendMessage = ({ conversationId, content, fileId, clientMessageId }) =>
    api.post(`/conversations/${conversationId}/messages`, { content, fileId, clientMessageId });
export const markAsDelivered = (convId, data) => api.post(`/conversations/${convId}/delivered`, data);
export const markAsRead = (convId, data) => api.post(`/conversations/${convId}/read`, data);

// Support
export const listSupportTickets = () => api.get("/support/tickets/me");
export const getSupportTicketMessages = (ticketId) => api.get(`/support/tickets/${ticketId}`);
export const createSupportTicket = (data) => api.post("/support/tickets", data);
export const addSupportMessage = (ticketId, data) => api.post(`/support/tickets/${ticketId}/messages`, data);
export const getPublicFaq = (params) => api.get("/support/faq", { params });

// Payments (Razorpay)
export const createRazorpayOrder = (data) => api.post("/payments/create-order", data);
export const previewTaskPayment = (taskId, data = {}) => api.post(`/payments/tasks/${taskId}/preview`, data);
export const verifyRazorpayPayment = (data) => api.post("/payments/verify-payment", data);
export const validateCoupon = (data) => api.post("/coupons/validate", data);
export const listMyVouchers = (params) => api.get("/coupons/my-vouchers", { params });

// Tasks
export const listMyTasks = (params) => api.get('/tasks/my-posted-tasks', { params: { ...params, _t: Date.now() } });
export const listTaskCatalogServices = (params) => api.get('/task-catalog/services', { params });
export const listTaskCatalogDomains = (params) => api.get('/task-catalog/domains', { params });
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
const markTaskRemovedLocally = (id) => {
    try {
        const deleted = JSON.parse(localStorage.getItem('onit_deleted_tasks') || '[]');
        if (!deleted.includes(id)) {
            deleted.push(id);
            localStorage.setItem('onit_deleted_tasks', JSON.stringify(deleted));
        }
    } catch {
        return;
    }
};
export const deleteTask = async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    markTaskRemovedLocally(id);
    return res;
};
export const deleteDraftTask = async (id) => {
    const res = await api.delete(`/tasks/draft/${id}`);
    markTaskRemovedLocally(id);
    return res;
};
export const cancelTask = async (id) => {
    const res = await api.post(`/tasks/${id}/cancel`);
    markTaskRemovedLocally(id);
    return res;
};
export const getTaskDetails = (id) => api.get(`/tasks/provider/${id}`);
export const createTaskDispute = (data) => api.post('/tasks/disputes', data);
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const publishTask = (id) => api.post(`/tasks/${id}/publish`);
export const attachTaskFiles = (taskId, data) => api.post(`/tasks/${taskId}/files`, data);
export const getTasksFeed = (params) => api.get('/tasks/feed', { params });
export const expressInterest = (taskId, data = {}) => api.post(`/tasks/${taskId}/interest`, data);
export const getTaskInterests = (taskId) => api.get(`/tasks/${taskId}/interests`);
export const acceptInterest = (interestId) => api.put(`/tasks/interests/${interestId}/accept`);
export const rejectInterest = (interestId) => api.put(`/tasks/interests/${interestId}/reject`);
/** Invite a performer. They must accept this request before payment is started. */
export const sendTaskInvitation = (taskId, taskerId, data = {}) =>
  api.post(`/tasks/${taskId}/invitations/${taskerId}`, data);
export const getTaskInvitations = (taskId) => api.get(`/tasks/${taskId}/invitations`);
export const acceptOffer = (assignmentId) => api.put(`/tasks/assignments/${assignmentId}/accept-offer`);
export const getChecklist = (taskId) => api.get(`/tasks/${taskId}/checklist`);
export const createChecklist = (taskId, data) => api.post(`/tasks/${taskId}/checklist`, data);
export const updateChecklist = (taskId, data) => api.patch(`/tasks/${taskId}/checklist`, data);
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
/** Review a tasker submission using the same contract as the released app. */
export const reviewChecklistItem = (itemId, data) =>
  api.post(`/tasks/checklist/items/${itemId}/review`, data);
/** Provider approves a submitted checklist item. */
export const approveChecklistItem = (itemId) =>
  reviewChecklistItem(itemId, { status: 'APPROVED' });
/** Provider requests changes — accepts the former web field names for callers. */
export const requestChecklistItemChange = (itemId, data = {}) =>
  reviewChecklistItem(itemId, {
    status: 'REJECTED',
    providerFeedback: data.providerFeedback ?? data.reason,
    providerFiles: data.providerFiles ?? data.fileIds,
  });
/** Provider final checklist sign-off */
export const approveChecklist = (checklistId) =>
  api.put(`/tasks/checklist/${checklistId}/approve`);

// Referral
export const getMyReferralStats = () => api.get('/referral/me');

export const getPresignedUrl = (data) => api.post('/uploads/presigned-url', data);
export const confirmUpload = (data) => api.post('/uploads/confirm', data);
export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/uploads/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const completeTask = (assignmentId) => api.post(`/tasks/${assignmentId}/complete`);
export const approveAssignment = (assignmentId) => api.post(`/tasks/${assignmentId}/approve`);
export const rejectAssignment = (assignmentId, data = {}) => api.post(`/tasks/${assignmentId}/reject`, data);
export const submitTask = (assignmentId, data) => api.post(`/tasks/${assignmentId}/submit`, data);

// Provider templates — GET/POST/PUT/DELETE /templates (see docs/templates_api_doc.md)
// Do NOT use /tasks/templates — Nest matches that as GET /tasks/:id with id="templates"
// and Prisma rejects the non-UUID (error: found 't' at 1).
export const listTaskTemplates = (params) => api.get('/templates', { params });
export const listProviderTemplates = (params) => api.get('/templates', { params });
export const getProviderTemplate = (id) => api.get(`/templates/${id}`);
export const createProviderTemplate = (data) => api.post('/templates', data);
export const updateProviderTemplate = (id, data) => api.put(`/templates/${id}`, data);
export const deleteProviderTemplate = (id) => api.delete(`/templates/${id}`);

/** ProfileView aliases — unwrap axios response body */
export const listTemplates = (params) =>
  listProviderTemplates(params).then((res) => res.data);
export const createTemplate = (data) =>
  createProviderTemplate(data).then((res) => res.data);
export const updateTemplate = (id, data) =>
  updateProviderTemplate(id, data).then((res) => res.data);
export const deleteTemplate = (id) => deleteProviderTemplate(id);
export const getTemplate = (id) => getProviderTemplate(id);

// Provider Reviews
export const getProviderReviews = (providerId, params) => api.get(`/providers/${providerId}/reviews`, { params });

// Taskers (Performers)
export const listTaskers = (params) => api.get('/taskers', { params });
export const searchTaskers = (params) => api.get('/taskers/search', { params });
/** Suggested performers for the authenticated provider — GET /taskers/suggested */
export const getSuggestedTaskers = (params) => api.get('/taskers/suggested', { params });
/** Category / overall top taskers — GET /taskers/rankings */
export const getTaskerRankings = (params) => api.get('/taskers/rankings', { params });
export const getTaskerProfile = (id) => api.get(`/taskers/${id}`);
export const directHireTasker = (taskId, taskerId) => api.post(`/tasks/${taskId}/direct-hire`, { taskerId });

// AI Assistant (Express micro-server)
export const generateAITask = (prompt) => aiApi.post('/ai-task', { prompt });

// AI task posting — served by the authenticated OnIT API. These mirror the
// mobile client rather than the unauthenticated Express demo endpoint above.
export const sendAiTaskMessage = ({ conversationId, message, clientMessageId }) =>
  api.post('/ai/chat', {
    ...(conversationId ? { conversation_id: conversationId } : {}),
    message,
    client_message_id: clientMessageId,
  }, { timeout: 300000 });
export const listAiTaskConversations = () => api.get('/ai/conversations');
export const getAiTaskConversation = (conversationId) =>
  api.get(`/ai/conversations/${conversationId}`);
export const postAiTaskConversation = (conversationId) =>
  api.post(`/ai/conversations/${conversationId}/post`);
export const enhanceDescription = (description, productType) => aiApi.post('/enhance-description', { description, productType });

// Task Reviews
export const createTaskReview = (taskId, data) => api.post(`/tasks/${taskId}/reviews`, data);
export const getTaskReviews = (taskId, params) => api.get(`/tasks/${taskId}/reviews`, { params });

// Task Updates
export const addTaskUpdate = (assignmentId, data) => api.post(`/tasks/updates/${assignmentId}`, data);
export const getTaskUpdates = (assignmentId) => api.get(`/tasks/updates/${assignmentId}`);

// Notifications
export const getNotifications = (params) => api.get('/notifications', { params });
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export const applyReferralCode = (code) => api.post('/referral/apply', { code });

// Saved performers
export const savePerformer = (taskerId) => api.post(`/providers/saved-taskers/${taskerId}`);
export const unsavePerformer = (taskerId) => api.delete(`/providers/saved-taskers/${taskerId}`);
export const getSavedPerformers = (params) => api.get('/providers/saved-taskers', { params });

// Profile email verification
export const startProfileEmailVerification = (email) => api.post('/auth/profile-email/start-verification', { email });
export const verifyProfileEmail = (email, otp) => api.post('/auth/profile-email/verify', { email, otp });

export default api;
