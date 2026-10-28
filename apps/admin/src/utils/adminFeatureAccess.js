export const ADMIN_FEATURES = {
    SUPPORT: 'SUPPORT',
    FINANCE: 'FINANCE',
    TASKS: 'TASKS',
    KYC: 'KYC',
    ACCESS_MANAGEMENT: 'ACCESS_MANAGEMENT',
};

export const ADMIN_FEATURE_LABELS = {
    SUPPORT: 'Support',
    FINANCE: 'Finance',
    TASKS: 'Tasks',
    KYC: 'KYC',
    ACCESS_MANAGEMENT: 'Access Management',
};

export const hasAdminFeature = (features, featureKey) =>
    Array.isArray(features) && features.includes(featureKey);
