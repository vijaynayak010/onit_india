const AUTH_APP_STORAGE_KEY = "onit_auth_app";
const AUTH0_CLIENT_ID_STORAGE_KEY = "onit_auth0_client_id";

export const AUTH_APP_CHANGED_EVENT = "onit-auth-app-changed";

/** Exact backend message for accounts in the 30-day deletion window. */
export const ACCOUNT_DEACTIVATED_MESSAGE = "ACCOUNT_DEACTIVATED_PENDING_DELETION";

function sanitizeClientId(value) {
  const id = String(value || "").trim();
  if (!id || id === "undefined" || id === "null") return "";
  return id;
}

export function notifyAuthAppChanged() {
  window.dispatchEvent(new Event(AUTH_APP_CHANGED_EVENT));
}

export const resolveAuth0AppFromPath = (pathname = "") => {
  if (pathname.startsWith("/performer")) return "tasker";
  if (pathname.startsWith("/provider")) return "provider";

  const sessionApp = sessionStorage.getItem(AUTH_APP_STORAGE_KEY);
  if (sessionApp === "tasker" || sessionApp === "provider") return sessionApp;

  const storedRole = String(localStorage.getItem("userRole") || "").toUpperCase();
  if (storedRole === "TASKER" || storedRole === "PERFORMER") return "tasker";
  if (storedRole === "PROVIDER") return "provider";

  return "provider";
};

export const persistAuth0App = (app) => {
  if (app === "tasker" || app === "provider") {
    sessionStorage.setItem(AUTH_APP_STORAGE_KEY, app);
    notifyAuthAppChanged();
  }
};

export const persistAuth0AppFromRole = (role) => {
  const normalized = String(role || "").toUpperCase();
  if (normalized === "TASKER" || normalized === "PERFORMER") {
    persistAuth0App("tasker");
    return;
  }
  if (normalized === "PROVIDER") {
    persistAuth0App("provider");
  }
};

export const getAuth0ClientIdForApp = (app) => {
  if (app === "tasker") {
    const id = sanitizeClientId(import.meta.env.VITE_AUTH0_CLIENT_ID_TASKER);
    if (!id) console.error("CRITICAL: VITE_AUTH0_CLIENT_ID_TASKER is missing in environment variables!");
    return id;
  }
  const id = sanitizeClientId(import.meta.env.VITE_AUTH0_CLIENT_ID_PROVIDER);
  if (!id) console.error("CRITICAL: VITE_AUTH0_CLIENT_ID_PROVIDER is missing in environment variables!");
  return id;
};

export const getAuth0ClientIdForRole = (role) =>
  getAuth0ClientIdForApp(
    String(role || "").toUpperCase() === "TASKER" ||
      String(role || "").toUpperCase() === "PERFORMER"
      ? "tasker"
      : "provider"
  );

export const getAuth0ClientIdForPath = (pathname) =>
  getAuth0ClientIdForApp(resolveAuth0AppFromPath(pathname));

/** Auth routes: prefer explicit role from navigation state, then session, then path. */
export const resolveAuth0ClientIdForLocation = (pathname = "", locationState = null) => {
  const roleFromState = locationState?.role;
  if (roleFromState) {
    return getAuth0ClientIdForRole(String(roleFromState).toUpperCase());
  }
  if (pathname === "/performerlogin") {
    return getAuth0ClientIdForRole("TASKER");
  }
  if (pathname === "/providerlogin") {
    return getAuth0ClientIdForRole("PROVIDER");
  }
  const sessionApp = sessionStorage.getItem(AUTH_APP_STORAGE_KEY);
  if (sessionApp === "tasker" || sessionApp === "provider") {
    return getAuth0ClientIdForApp(sessionApp);
  }
  const storedClientId = sanitizeClientId(localStorage.getItem(AUTH0_CLIENT_ID_STORAGE_KEY));
  if (storedClientId) return storedClientId;
  return getAuth0ClientIdForPath(pathname);
};

export const persistAuth0ClientId = (clientId) => {
  const id = sanitizeClientId(clientId);
  if (id) {
    localStorage.setItem(AUTH0_CLIENT_ID_STORAGE_KEY, id);
  }
};

export const getStoredAuth0ClientId = () => {
  const stored = sanitizeClientId(localStorage.getItem(AUTH0_CLIENT_ID_STORAGE_KEY));
  if (stored) return stored;
  return getAuth0ClientIdForPath(
    typeof window !== "undefined" ? window.location.pathname : ""
  );
};

export const getRestoreAccountPath = (pathname = window.location.pathname) =>
  pathname.startsWith("/performer")
    ? "/performer/restore-account"
    : "/provider/restore-account";

/** Must exactly match an Allowed Callback URL in Auth0 (both Provider + Tasker SPAs). */
export function getAuth0RedirectUri() {
  const configured = String(import.meta.env.VITE_AUTH0_REDIRECT_URI ?? "").trim();
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    // Keep the login callback on the canonical production host. Auth0 treats
    // www and non-www as different callback URLs.
    if (window.location.hostname === "www.onitindia.com") {
      return "https://www.onitindia.com/auth";
    }
    return `${window.location.origin}/auth`;
  }
  return "";
}

/**
 * Auth0 passwordless / token base URL.
 * Uses your Auth0 tenant directly (not localhost /auth0 proxy).
 * Set VITE_AUTH0_USE_PROXY=true to fall back to same-origin /auth0 (Vite/Vercel proxy).
 */
export function getAuth0BaseUrl() {
  if (import.meta.env.VITE_AUTH0_USE_PROXY === "true") {
    return "/auth0";
  }
  const domain = String(import.meta.env.VITE_AUTH0_DOMAIN ?? "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  if (domain) return `https://${domain}`;
  return "/auth0";
}
