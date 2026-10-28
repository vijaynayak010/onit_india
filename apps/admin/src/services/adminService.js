import * as adminApi from './api.js';

export const adminService = {
    // KYC
    getPendingKyc: async (params) => {
        return await adminApi.getPendingKyc(params);
    },
    verifyKycDocument: async (id, data) => {
        return await adminApi.verifyKycDocument(id, data);
    },
    getKycStatistics: async () => {
        return await adminApi.getKycStatistics();
    },

    // Analytics
    getDashboardStats: async () => {
        return await adminApi.getAdminDashboardStats();
    },
    getGrowthMetrics: async (params) => {
        return await adminApi.getGrowthMetrics(params);
    },
    getUserAnalytics: async () => {
        return await adminApi.getUserAnalytics();
    },
    getTaskAnalytics: async () => {
        return await adminApi.getTaskAnalytics();
    },
    getRevenueAnalytics: async (params) => {
        return await adminApi.getRevenueAnalytics(params);
    },

    // Finance
    listTransactions: async (params) => {
        return await adminApi.listTransactions(params);
    },
    adjustWallet: async (userId, data) => {
        return await adminApi.adjustWallet(userId, data);
    },
    getFinanceStats: async () => {
        return await adminApi.getFinanceStatistics();
    },

    // Tasks
    listTasks: async (params) => {
        return await adminApi.listTasksAdmin(params);
    },
    updateTaskStatus: async (id, data) => {
        return await adminApi.updateTaskStatusAdmin(id, data);
    },

    // Users
    listUsers: async (params) => {
        return await adminApi.listUsersAdmin(params);
    },
    blockUser: async (id, data) => {
        return await adminApi.blockUserAdmin(id, data);
    },

    // Moderation
    listReviews: async (params) => {
        return await adminApi.listReviewsAdmin(params);
    },
    deleteReview: async (id, data) => {
        return await adminApi.deleteReviewAdmin(id, data);
    }
};
