const ADMIN_AUTH_FLOW_STARTED_AT_KEY = 'admin_auth_flow_started_at';
const ADMIN_AUTH_FLOW_TTL_MS = 10 * 60 * 1000;

export const markAdminAuthFlowStarted = () => {
    localStorage.setItem(ADMIN_AUTH_FLOW_STARTED_AT_KEY, String(Date.now()));
};

export const clearAdminAuthFlowStarted = () => {
    localStorage.removeItem(ADMIN_AUTH_FLOW_STARTED_AT_KEY);
};

export const hasRecentAdminAuthFlow = () => {
    const rawStartedAt = localStorage.getItem(ADMIN_AUTH_FLOW_STARTED_AT_KEY);
    const startedAt = Number(rawStartedAt);

    if (!Number.isFinite(startedAt)) {
        clearAdminAuthFlowStarted();
        return false;
    }

    if (Date.now() - startedAt > ADMIN_AUTH_FLOW_TTL_MS) {
        clearAdminAuthFlowStarted();
        return false;
    }

    return true;
};

