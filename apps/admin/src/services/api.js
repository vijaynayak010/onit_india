import axios from 'axios';
import { getApiBaseUrl } from '../config/apiBase';
import {
    clearAdminGoogleVerification,
    getAdminGoogleVerificationToken,
} from '../utils/adminGoogleVerification';

const getBaseURL = () => getApiBaseUrl();

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

let tokenRefresher = null;
let refreshPromise = null;

export const setAdminApiTokenRefresher = (refresher) => {
    tokenRefresher = refresher;
};

const refreshAdminToken = async () => {
    if (!tokenRefresher) throw new Error('Admin token refresher is unavailable');
    if (!refreshPromise) {
        refreshPromise = tokenRefresher().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};

const isTokenExpiring = (token) => {
    if (!token || token.split('.').length !== 3) return false;
    try {
        const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const paddedPayload = encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=');
        const payload = JSON.parse(atob(paddedPayload));
        return !payload.exp || Date.now() >= payload.exp * 1000 - 30_000;
    } catch {
        return false;
    }
};

const rawGet = api.get.bind(api);
const ADMIN_GET_CACHE_TTL_MS = 60 * 1000;
const ADMIN_DASHBOARD_CACHE_TTL_MS = 2 * 60 * 1000;
const ADMIN_DETAIL_CACHE_TTL_MS = 30 * 1000;
const adminGetCache = new Map();
const pendingGetRequests = new Map();

const stableStringify = (value) => {
    if (!value || typeof value !== 'object') return JSON.stringify(value ?? null);
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
};

const getCacheTtl = (url) => {
    if (url.includes('/admin/messages') || url.includes('/admin/chats') || url.includes('/admin/notifications')) {
        return 10 * 1000;
    }
    if (url.includes('/admin/analytics/') || url.includes('/statistics') || url.includes('/stats')) {
        return ADMIN_DASHBOARD_CACHE_TTL_MS;
    }
    if (/\/admin\/[^?]+\/[0-9a-f-]{12,}/i.test(url)) {
        return ADMIN_DETAIL_CACHE_TTL_MS;
    }
    return ADMIN_GET_CACHE_TTL_MS;
};

const getCacheKey = (url, config = {}) => {
    const token = localStorage.getItem('admin_token') || '';
    const googleToken = getAdminGoogleVerificationToken() || '';
    return stableStringify({
        url,
        params: config.params || null,
        token: token.slice(-16),
        googleToken: googleToken.slice(-16),
    });
};

export const clearAdminApiCache = (prefix = '') => {
    for (const key of adminGetCache.keys()) {
        if (!prefix || key.includes(prefix)) adminGetCache.delete(key);
    }
    if (!prefix) pendingGetRequests.clear();
};

const cachedGet = (url, config = {}) => {
    const cacheMode = config.cache;
    const requestConfig = { ...config };
    delete requestConfig.cache;

    if (cacheMode === false) {
        return rawGet(url, requestConfig);
    }

    const key = getCacheKey(url, requestConfig);
    const now = Date.now();
    const cached = adminGetCache.get(key);
    const ttl = typeof cacheMode?.ttlMs === 'number' ? cacheMode.ttlMs : getCacheTtl(url);

    if (!cacheMode?.force && cached && now - cached.savedAt < ttl) {
        return Promise.resolve(cached.data);
    }

    if (!cacheMode?.force && pendingGetRequests.has(key)) {
        return pendingGetRequests.get(key);
    }

    const request = rawGet(url, requestConfig)
        .then((data) => {
            adminGetCache.set(key, { data, savedAt: Date.now() });
            return data;
        })
        .finally(() => {
            pendingGetRequests.delete(key);
        });

    pendingGetRequests.set(key, request);
    return request;
};

const mutate = async (request) => {
    const result = await request;
    clearAdminApiCache();
    return result;
};

// --- AUTH & COMMON ---
export const getMe = () => cachedGet('/users/me', { cache: { ttlMs: 30 * 1000 } });
export const refreshToken = (data) => mutate(api.post('/auth/refresh', data));
export const logoutUser = () => mutate(api.post('/auth/logout', undefined).finally(() => clearAdminApiCache()));
export const onboardUser = (data) => mutate(api.post('/users/onboard', data));
export const verifyAdminGoogleAccount = (idToken) =>
    mutate(api.post('/admin/auth/google/verify', { idToken }));
export const getMyAdminFeatureAccess = () => cachedGet('/admin/access/me', { cache: { ttlMs: 5 * 60 * 1000 } });
export const listAdminFeatureAccessFeatures = () => cachedGet('/admin/access/features', { cache: { ttlMs: 5 * 60 * 1000 } });
export const listAdminFeatureAccess = (params) => cachedGet('/admin/access', { params });
export const createAdminFeatureAccess = (data) => mutate(api.post('/admin/access', data));
export const updateAdminFeatureAccess = (id, data) => mutate(api.patch(`/admin/access/${id}`, data));
export const deleteAdminFeatureAccess = (id) => mutate(api.delete(`/admin/access/${id}`));

// Request Interceptor for Auth
api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('admin_token');
        if (isTokenExpiring(token) && tokenRefresher) {
            try {
                token = await refreshAdminToken();
            } catch {
                // Let the API return 401 so the response interceptor can make
                // one final refresh attempt before ending the session.
            }
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            if (import.meta.env.DEV) {
                console.log(`[Admin API Request] Sending Bearer token to: ${config.url}`);
            }
        } else {
            console.warn(`[Admin API Request] No Authorization token found for: ${config.url}`);
        }

        const adminGoogleToken = getAdminGoogleVerificationToken();
        const isAdminRequest = typeof config.url === 'string' && config.url.startsWith('/admin/');
        const isGoogleVerifyRequest = config.url === '/admin/auth/google/verify';

        if (adminGoogleToken && isAdminRequest && !isGoogleVerifyRequest) {
            config.headers['X-Admin-Google-Verification'] = adminGoogleToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let sessionExpiredNotified = false;

// Response Interceptor for Error Handling
api.interceptors.response.use(
    (response) => {
        sessionExpiredNotified = false;
        if (response.config?.method && response.config.method.toLowerCase() !== 'get') {
            clearAdminApiCache();
        }
        return response.data;
    },
    async (error) => {
        const message = error.response?.data?.message || 'An unexpected error occurred';
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest._authRefreshRetried && tokenRefresher) {
            originalRequest._authRefreshRetried = true;
            try {
                const token = await refreshAdminToken();
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch {
                // Refresh is no longer valid; clear the session below.
            }
        }

        if (error.response?.status === 401) {
            clearAdminApiCache();
            localStorage.removeItem('admin_token');
            localStorage.removeItem('onit_token');
            localStorage.removeItem('admin_user');
            localStorage.removeItem('onit_user');
            localStorage.removeItem('userRole');
            localStorage.removeItem('onit_dev_access_2026');
            clearAdminGoogleVerification();

            if (!sessionExpiredNotified) {
                sessionExpiredNotified = true;
                window.dispatchEvent(new CustomEvent('onit-admin-session-expired'));
            }
        }

        if (error.response?.status === 403 && message.includes('Google admin verification')) {
            clearAdminGoogleVerification();
            if (window.location.pathname !== '/google-auth') {
                localStorage.setItem('admin_google_redirect_return_to', window.location.pathname);
                window.location.assign('/google-auth');
            }
        }

        return Promise.reject({ message, status: error.response?.status });
    }
);


export const getPendingKyc = (params) => cachedGet('/admin/kyc/pending', { params });
export const getKycDocument = (id) => cachedGet(`/admin/kyc/documents/${id}`);
export const verifyKycDocument = (id, data) => api.patch(`/admin/kyc/documents/${id}/verify`, data);
export const getKycSubmission = (id) => cachedGet(`/admin/kyc/submissions/${id}`);
export const verifyKycSubmission = (id, data) => api.patch(`/admin/kyc/submissions/${id}/verify`, data);
export const getKycStatistics = () => cachedGet('/admin/kyc/statistics');
export const listPerformerAccessSummary = () => cachedGet('/admin/performer-access/categories/summary', { cache: { ttlMs: 30 * 1000 } });
export const listPerformerCategoryAccess = (params) => cachedGet('/admin/performer-access', { params, cache: false });
export const searchPerformerAccess = (params) => cachedGet('/admin/performer-access/performers/search', { params, cache: false });
export const getPerformerAccessProfile = (taskerId) => cachedGet(`/admin/performer-access/performers/${taskerId}`, { cache: false });
export const getPerformerScoreHistory = (taskerId, params) =>
    cachedGet(`/admin/performer-access/performers/${taskerId}/score-history`, { params, cache: false });
export const approvePerformerCategoryAccess = (taskerId, category, data) =>
    mutate(api.post(`/admin/performer-access/performers/${taskerId}/categories/${encodeURIComponent(category)}/approve`, data));
export const rejectPerformerCategoryAccess = (taskerId, category, data) =>
    mutate(api.post(`/admin/performer-access/performers/${taskerId}/categories/${encodeURIComponent(category)}/reject`, data));
export const waitlistPerformerCategoryAccess = (taskerId, category, data) =>
    mutate(api.post(`/admin/performer-access/performers/${taskerId}/categories/${encodeURIComponent(category)}/waitlist`, data));
export const suspendPerformerCategoryAccess = (taskerId, category, data) =>
    mutate(api.post(`/admin/performer-access/performers/${taskerId}/categories/${encodeURIComponent(category)}/suspend`, data));
export const listPerformerGrowthCapacities = () => cachedGet('/admin/performer-growth/capacities', { cache: false });
export const savePerformerGrowthCapacity = (data) => mutate(api.post('/admin/performer-growth/capacities', data));
export const listPerformerGrowthPlans = () => cachedGet('/admin/performer-growth/plans', { cache: false });
export const savePerformerGrowthPlan = (data) => mutate(api.post('/admin/performer-growth/plans', data));
export const updatePerformerGrowthPlan = (id, data) => mutate(api.patch(`/admin/performer-growth/plans/${id}`, data));
export const addPerformerGrowthMilestone = (planId, data) => mutate(api.post(`/admin/performer-growth/plans/${planId}/milestones`, data));
export const updatePerformerGrowthMilestone = (id, data) => mutate(api.patch(`/admin/performer-growth/milestones/${id}`, data));
export const completePerformerManualMilestone = (id, data) => mutate(api.post(`/admin/performer-growth/milestones/${id}/complete`, data));
export const listPerformerLearningResources = () => cachedGet('/admin/performer-growth/resources', { cache: false });
export const createPerformerLearningResource = (data) => mutate(api.post('/admin/performer-growth/resources', data));
export const updatePerformerLearningResource = (id, data) => mutate(api.patch(`/admin/performer-growth/resources/${id}`, data));
export const listPerformerCourseSubmissions = () => cachedGet('/admin/performer-growth/course-submissions', { cache: false });
export const reviewPerformerCourseSubmission = (id, data) => mutate(api.post(`/admin/performer-growth/course-submissions/${id}/review`, data));
export const listRecommendationCampaigns = () => cachedGet('/api/admin/recommendations', { cache: false });
export const listRecommendationAdvertisers = () => cachedGet('/api/admin/recommendations/advertisers', { cache: false });
export const createRecommendationAdvertiser = (data) => mutate(api.post('/api/admin/recommendations/advertisers', data));
export const createRecommendationCampaign = (data) => mutate(api.post('/api/admin/recommendations', data));
export const approveRecommendationCampaign = (id) => mutate(api.post(`/api/admin/recommendations/${id}/approve`));
export const pauseRecommendationCampaign = (id) => mutate(api.post(`/api/admin/recommendations/${id}/pause`));
export const activateRecommendationCampaign = (id) => mutate(api.post(`/api/admin/recommendations/${id}/activate`));
export const getRecommendationCampaignAnalytics = (id) => cachedGet(`/api/admin/recommendations/${id}/analytics`, { cache: false });
export const getPerformerScoringConfigAdmin = () =>
    cachedGet('/admin/settings/performer-scoring', { cache: false });
export const updatePerformerScoringConfigAdmin = (data) =>
    mutate(api.put('/admin/settings/performer-scoring', data));
export const backfillPerformerScoresAdmin = () =>
    mutate(api.post('/admin/settings/performer-scoring/backfill'));

// 2. Analytics
export const getAdminDashboardStats = () => cachedGet('/admin/analytics/dashboard');
export const getGrowthMetrics = (params) => cachedGet('/admin/analytics/growth', { params });
export const getUserAnalytics = () => cachedGet('/admin/analytics/users');
export const getTaskAnalytics = () => cachedGet('/admin/analytics/tasks');
export const getRevenueAnalytics = (params) => cachedGet('/admin/analytics/revenue', { params });

// 3. Finance
export const listTransactions = (params) => cachedGet('/admin/transactions', { params });
export const getTransactionById = (id) => cachedGet(`/admin/transactions/${id}`);
export const updateTransactionStatus = (id, data) => api.patch(`/admin/transactions/${id}/status`, data);
export const issueRefund = (data) => api.post('/admin/transactions/refund', data);
export const listWallets = (params) => cachedGet('/admin/wallets', { params });
export const getUserWallet = (userId) => cachedGet(`/admin/wallets/${userId}`);
export const adjustWallet = (userId, data) => api.patch(`/admin/wallets/${userId}/adjust`, data);
export const getFinanceStatistics = () => cachedGet('/admin/finance/statistics');
export const listCategoryCommissions = () => cachedGet('/admin/finance/commissions');
export const upsertCategoryCommission = (data) => api.post('/admin/finance/commissions', data);
export const listTaskSettlements = (params) => cachedGet('/admin/finance/settlements', { params });
export const listWithdrawals = (params) => cachedGet('/admin/finance/withdrawals', { params });
export const completeWithdrawal = (id, data) => api.patch(`/admin/finance/withdrawals/${id}/complete`, data);
export const rejectWithdrawal = (id, data) => api.patch(`/admin/finance/withdrawals/${id}/reject`, data);

// 4. Tasks
export const listTasksAdmin = (params) => cachedGet('/admin/tasks', { params });
export const getTaskByIdAdmin = (id) => cachedGet(`/admin/tasks/${id}`);
export const updateTaskStatusAdmin = (id, data) => api.patch(`/admin/tasks/${id}/status`, data);
export const repostTaskAdmin = (id, data) => mutate(api.post(`/admin/tasks/${id}/repost`, data));
export const listAssignmentsAdmin = (params) => cachedGet('/admin/tasks/assignments', { params });
export const resolveAssignmentAdmin = (id, data) => api.patch(`/admin/tasks/assignments/${id}/resolve`, data);
export const getTaskStatisticsAdmin = () => cachedGet('/admin/tasks/statistics');
export const listDisputesAdmin = (params) => cachedGet('/admin/tasks/disputes', { params });
export const getDisputeByIdAdmin = (id) => cachedGet(`/admin/tasks/disputes/${id}`);
export const resolveDisputeAdmin = (id, data) => api.patch(`/admin/tasks/disputes/${id}/resolve`, data);
export const resolveChecklistItemDisputeAdmin = (itemId, data) => api.put(`/tasks/checklist/items/${itemId}/resolve-dispute`, data);

// 4c. Admin typed search
export const searchAdminEntities = (params) => cachedGet('/admin/search', { params });

// 4b. Task Approvals
export const listTaskApprovalsAdmin = (params) => cachedGet('/admin/tasks/approvals', { params });
export const approveTaskAdmin = (id) => api.post(`/admin/tasks/${id}/approve`);
export const rejectTaskAdmin = (id, data) => api.post(`/admin/tasks/${id}/reject`, data);
export const listTaskCatalogDomainsAdmin = () => cachedGet('/admin/task-catalog/domains', { cache: { ttlMs: 5 * 60 * 1000 } });
export const listTaskCatalogServicesAdmin = () => cachedGet('/admin/task-catalog/services', { cache: { ttlMs: 60 * 1000 } });
export const createTaskCatalogServiceAdmin = (data) => mutate(api.post('/admin/task-catalog/services', data));
export const updateTaskCatalogServiceAdmin = (id, data) => mutate(api.patch(`/admin/task-catalog/services/${id}`, data));
export const getTaskCatalogServiceAuditAdmin = (id) => cachedGet(`/admin/task-catalog/services/${id}/audit`, { cache: false });

// 5. Users
export const listUsersAdmin = (params) => cachedGet('/admin/users', { params });
export const getUserByIdAdmin = (id) => cachedGet(`/admin/users/${id}`);
export const getUserActivityAdmin = (id) => cachedGet(`/admin/users/${id}/activity`);
export const blockUserAdmin = (id, data) => api.patch(`/admin/users/${id}/block`, data);
export const activateUserAdmin = (id, data) => api.patch(`/admin/users/${id}/activate`, data);
export const deleteUserAdmin = (id) => api.delete(`/admin/users/${id}`);

// 6. Moderation
export const listReviewsAdmin = (params) => cachedGet('/admin/reviews', { params });
export const deleteReviewAdmin = (id, data) => api.delete(`/admin/reviews/${id}`, { data });
export const moderateMessageAdmin = (id, data) => api.patch(`/admin/messages/${id}/moderate`, data);

// 7. Notifications (Admin)
export const listNotificationsAdmin = (params) => cachedGet('/admin/notifications', { params });
export const broadcastNotificationAdmin = (data) => api.post('/admin/notifications/broadcast', data);

export const listScheduledNotificationsAdmin = (params) =>
    cachedGet('/admin/notifications/scheduled', { params });
export const getScheduledNotificationAdmin = (id) => cachedGet(`/admin/notifications/scheduled/${id}`);
export const createScheduledNotificationAdmin = (data) => api.post('/admin/notifications/scheduled', data);
export const updateScheduledNotificationAdmin = (id, data) =>
    api.patch(`/admin/notifications/scheduled/${id}`, data);
export const cancelScheduledNotificationAdmin = (id) =>
    api.post(`/admin/notifications/scheduled/${id}/cancel`);
export const deleteScheduledNotificationAdmin = (id) =>
    api.delete(`/admin/notifications/scheduled/${id}`);

// 8. Support
export const listTicketsAdmin = (params) => cachedGet('/admin/support/tickets', { params });
export const getTicketByIdAdmin = (id) => cachedGet(`/admin/support/tickets/${id}`);
export const updateTicketStatusAdmin = (id, data) => api.patch(`/admin/support/tickets/${id}/status`, data);
export const addTicketMessageAdmin = (id, data) => api.post(`/admin/support/tickets/${id}/messages`, data);
export const getTicketStatisticsAdmin = () => cachedGet('/admin/support/statistics');
export const listFaqAdmin = (params) => cachedGet('/admin/support/faq', { params });
export const createFaqAdmin = (data) => api.post('/admin/support/faq', data);
export const updateFaqAdmin = (id, data) => api.patch(`/admin/support/faq/${id}`, data);
export const deleteFaqAdmin = (id) => api.delete(`/admin/support/faq/${id}`);

// 9. Settings
export const getSettingsAdmin = () => cachedGet('/admin/settings');
export const getSettingByKeyAdmin = (key) => cachedGet(`/admin/settings/${key}`);
export const upsertSettingAdmin = (key, data) => api.put(`/admin/settings/${key}`, data);
export const bulkUpsertSettingsAdmin = (data) => api.post('/admin/settings/bulk', data);
export const deleteSettingAdmin = (key) => api.delete(`/admin/settings/${key}`);
export const getPlatformFeesAdmin = () => cachedGet('/admin/settings/platform-fees', { cache: false });
export const updatePlatformFeesAdmin = (data) => mutate(api.put('/admin/settings/platform-fees', data));
export const getHomeContentAdmin = () => cachedGet('/admin/settings/home-content');
export const updateHomeContentAdmin = (data) => api.put('/admin/settings/home-content', data);
export const listCategoryTaskTemplatesAdmin = (params) =>
    cachedGet('/admin/settings/task-templates', { params });
export const createCategoryTaskTemplateAdmin = (category, data) =>
    api.post(`/admin/settings/categories/${encodeURIComponent(category)}/task-templates`, data);
export const updateCategoryTaskTemplateAdmin = (templateId, data) =>
    api.put(`/admin/settings/task-templates/${templateId}`, data);
export const deleteCategoryTaskTemplateAdmin = (templateId) =>
    api.delete(`/admin/settings/task-templates/${templateId}`);
export const getPresignedUrlAdmin = (data) => api.post('/uploads/presigned-url', data);
export const confirmUploadAdmin = (data) => api.post('/uploads/confirm', data);
export const uploadAdminCategoryIcon = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return mutate(api.post('/uploads/admin-category-icon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }));
};

// Homepage content (home:content)
export const getAdminHomeContent = () => cachedGet('/admin/settings/home-content');
export const updateAdminHomeContent = (data) => api.put('/admin/settings/home-content', data);

// 10. Work Verification
export const getPendingVerificationsAdmin = (params) => cachedGet('/admin/verification/pending', { params });
export const getVerificationDetailAdmin = (id) => cachedGet(`/admin/verification/${id}`);
export const approveVerificationAdmin = (id) => api.patch(`/admin/verification/${id}/approve`);
export const rejectVerificationAdmin = (id, data) => api.patch(`/admin/verification/${id}/reject`, data);
export const getVerificationStatisticsAdmin = () => cachedGet('/admin/verification/statistics');

// 11. Bulk Operations
export const bulkSuspendUsersAdmin = (data) => api.post('/admin/bulk/users/suspend', data);
export const bulkDeleteUsersAdmin = (data) => api.delete('/admin/bulk/users', { data });
export const bulkDeleteTasksAdmin = (data) => api.delete('/admin/bulk/tasks', { data });

// 12. Support Chat
export const listActiveChats = (params) => cachedGet('/admin/chats', { params });
export const getChatMessages = (chatId) => cachedGet(`/admin/messages/${chatId}`);
export const sendChatMessageAdmin = (data) => api.post('/admin/messages', data);

// 13. Referrals (legacy milestone system)
export const getReferralSummaryAdmin = () => cachedGet('/admin/referrals/summary');
export const listEligibleReferralsAdmin = (params) => cachedGet('/admin/referrals/eligible', { params });
export const listAllReferralsAdmin = (params) => cachedGet('/admin/referrals', { params });
export const claimReferralRewardAdmin = (providerId, data) => api.patch(`/admin/referrals/${providerId}/claim`, data);

// 13b. Referral Program (milestone + physical reward system)
export const getReferralConfig = () => cachedGet('/admin/referrals/config');
export const updateReferralConfig = (data) => api.patch('/admin/referrals/config', data);
export const getReferralStats = () => cachedGet('/admin/referrals/stats');
export const getAllReferralRedemptions = (params) => cachedGet('/admin/referrals/all-redemptions', { params });

// 13c. Referral Milestones CRUD
export const getReferralMilestones = () => cachedGet('/admin/referrals/milestones');
export const createReferralMilestone = (data) => api.post('/admin/referrals/milestones', data);
export const updateReferralMilestone = (id, data) => api.put(`/admin/referrals/milestones/${id}`, data);
export const deleteReferralMilestone = (id) => api.delete(`/admin/referrals/milestones/${id}`);

// 13d. Referral Fulfillment Queue
export const getReferralFulfillmentQueue = (params) => cachedGet('/admin/referrals/fulfillments', { params });
export const updateReferralFulfillment = (id, data) => api.patch(`/admin/referrals/fulfillments/${id}`, data);

// 14. Careers
export const listCareersAdmin = () => cachedGet('/admin/careers');
export const getCareerByIdAdmin = (id) => cachedGet(`/admin/careers/${id}`);
export const createCareerAdmin = (data) => api.post('/admin/careers', data);
export const updateCareerAdmin = (id, data) => api.put(`/admin/careers/${id}`, data);
export const deleteCareerAdmin = (id) => api.delete(`/admin/careers/${id}`);
export const listCareerApplicationsAdmin = (params) => cachedGet('/admin/careers/applications', { params });
export const updateCareerApplicationStatusAdmin = (id, data) =>
    api.patch(`/admin/careers/applications/${id}/status`, data);

// 15. Public Settings (Shared)
export const getPublicSettings = () => cachedGet('/settings/public');

// 16. Coupon Management (Admin)
export const listAdminCoupons = (params) => cachedGet('/admin/coupons', { params });
export const createAdminCoupon = (data) => api.post('/admin/coupons', data);
export const updateAdminCoupon = (id, data) => api.patch(`/admin/coupons/${id}`, data);
export const deleteAdminCoupon = (id) => api.delete(`/admin/coupons/${id}`);
export const getAdminCouponUsage = (id) => cachedGet(`/admin/coupons/${id}/usage`);
export const assignCouponUsers = (id, data) => api.post(`/admin/coupons/${id}/assign-users`, data);

// 16b. Coupon Trigger / Scenario Rules
export const listTriggerRules = () => cachedGet('/admin/coupons/trigger-rules');
export const createTriggerRule = (data) => api.post('/admin/coupons/trigger-rules', data);
export const updateTriggerRule = (id, data) => api.patch(`/admin/coupons/trigger-rules/${id}`, data);
export const deleteTriggerRule = (id) => api.delete(`/admin/coupons/trigger-rules/${id}`);
export const getTriggerRuleStats = (id) => cachedGet(`/admin/coupons/trigger-rules/${id}/stats`);

// 16c. Promotional Vouchers (Admin)
export const listPromotionalVoucherTemplates = (params) => cachedGet('/admin/promotional-vouchers', { params });
export const createPromotionalVoucherTemplate = (data) => api.post('/admin/promotional-vouchers', data);
export const updatePromotionalVoucherTemplate = (id, data) => api.patch(`/admin/promotional-vouchers/${id}`, data);
export const listPromotionalVoucherUnlocks = (params) => cachedGet('/admin/promotional-vouchers/unlocks', { params });
export const listPromotionalVoucherIssued = (params) => cachedGet('/admin/promotional-vouchers/issued', { params });
export const listVoucherAchievementRules = (params) => cachedGet('/admin/promotional-vouchers/achievement-rules', { params });
export const createVoucherAchievementRule = (data) => api.post('/admin/promotional-vouchers/achievement-rules', data);
export const updateVoucherAchievementRule = (id, data) => api.patch(`/admin/promotional-vouchers/achievement-rules/${id}`, data);
export const deleteVoucherAchievementRule = (id) => api.delete(`/admin/promotional-vouchers/achievement-rules/${id}`);
export const addVoucherAchievementOption = (id, data) => api.post(`/admin/promotional-vouchers/achievement-rules/${id}/options`, data);
export const removeVoucherAchievementOption = (id) => api.delete(`/admin/promotional-vouchers/achievement-options/${id}`);

// 16c. Content Pages Management (Admin)
export const getContentPagesAdmin = () => cachedGet('/admin/settings/content-pages');
export const getContentPageAdmin = (slug) => cachedGet(`/admin/settings/content-pages/${slug}`);
export const updateContentPageAdmin = (slug, data) => api.put(`/admin/settings/content-pages/${slug}`, data);

// 17. Email Monitoring & Dispatcher (Admin)
export const listAdminEmails = (params) => cachedGet('/admin/emails', { params });
export const sendAdminManualEmail = (data) => mutate(api.post('/admin/emails/send', data));

/**
 * Invoice PDFs are protected by the API's bearer-token guard. A browser
 * navigation cannot attach that token, so fetch the PDF with this client and
 * trigger the file download from the returned blob instead.
 */
export const downloadTaskInvoicePdf = async (taskId) => {
    if (!taskId) throw new Error('A task is required to download its invoice.');

    const pdf = await api.get(`/tasks/${taskId}/invoice/pdf`, {
        responseType: 'blob',
    });
    const blob = pdf instanceof Blob
        ? pdf
        : new Blob([pdf], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `onit-invoice-${taskId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
};

export default api;
