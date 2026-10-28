import {
  ACCOUNT_DEACTIVATED_MESSAGE,
  getRestoreAccountPath,
} from "../config/auth0";
import { IDENTITY_CONFLICT_CODE, AUTH_ERROR_CODES } from "./authErrors";
import { isTestModeEnabled } from "../test-mode/testModeConfig";
import { handleMockApiRequest } from "../test-mode/mockApiHandler";

const IDENTITY_CONFLICT_SNIPPET = "already linked to another local user";

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return Date.now() >= payload.exp * 1000 - 30000;
  } catch {
    return true;
  }
}

export function attachApiInterceptors(api, getRefresher) {
  api.interceptors.request.use(async (config) => {
    if (isTestModeEnabled()) {
      config.adapter = async (cfg) => {
        const method = cfg.method || "GET";
        const url = cfg.url || "";
        let data = cfg.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch (e) {
            // keep raw data
          }
        }
        const mockRes = await handleMockApiRequest(method, url, data, cfg.params);
        if (mockRes.status >= 400) {
          const err = new Error(mockRes.data?.message || `Mock API error (${mockRes.status})`);
          err.response = { status: mockRes.status, data: mockRes.data };
          err.config = cfg;
          throw err;
        }
        return {
          data: mockRes.data,
          status: mockRes.status,
          statusText: "OK",
          headers: {},
          config: cfg,
          request: {},
        };
      };
    }

    let token = localStorage.getItem("onit_token");
    const refresher = typeof getRefresher === "function" ? getRefresher() : null;
    if (isTokenExpired(token) && refresher && !isTestModeEnabled()) {
      try {
        token = await refresher();
      } catch {
        /* fall through — let 401 handler run */
      }
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;
      const data = error.response?.data || {};
      const message = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || data.error || "";
      const status = error.response?.status;
      const requestUrl = originalRequest?.url || originalRequest?.baseURL;
      const refresher = typeof getRefresher === "function" ? getRefresher() : null;

      if (
        status === 401 &&
        message === ACCOUNT_DEACTIVATED_MESSAGE &&
        !window.location.pathname.includes("/restore-account")
      ) {
        window.location.href = getRestoreAccountPath();
        return Promise.reject({
          message,
          status: 401,
          code: ACCOUNT_DEACTIVATED_MESSAGE,
        });
      }

      if (status === 401 && !originalRequest._retried && refresher) {
        originalRequest._retried = true;
        try {
          const newToken = await refresher();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          if (!isTestModeEnabled()) {
            localStorage.removeItem("onit_token");
            localStorage.removeItem("onit_refresh_token");
            localStorage.removeItem("onit_user");
            localStorage.removeItem("userRole");
            window.location.href = "/auth";
          }
          return Promise.reject({
            message: "Session expired. Please log in again.",
            status: 401,
            code: AUTH_ERROR_CODES.SESSION_EXPIRED,
          });
        }
      }

      const isIdentityConflict =
        status === 409 &&
        String(message).toLowerCase().includes(IDENTITY_CONFLICT_SNIPPET);

      if (!error.response) {
        return Promise.reject({
          message:
            error.message ||
            "Network error — could not reach the API (check CORS or VITE_API_URL).",
          status: null,
          code: AUTH_ERROR_CODES.NETWORK_ERROR,
          requestUrl,
        });
      }

      return Promise.reject({
        message: message || "An unexpected error occurred",
        status,
        statusCode: data.statusCode ?? status,
        error: data.error,
        raw: import.meta.env.DEV ? data : undefined,
        requestUrl,
        ...(isIdentityConflict ? { code: IDENTITY_CONFLICT_CODE } : {}),
        ...(status === 401 && message === ACCOUNT_DEACTIVATED_MESSAGE
          ? { code: ACCOUNT_DEACTIVATED_MESSAGE }
          : {}),
      });
    }
  );
}
