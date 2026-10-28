import { parseAuthError, AUTH_ERROR_CODES } from "./authErrorCatalog";

export { parseAuthError, AUTH_ERROR_CODES, getJwtDebugSnapshot, getAuthSessionSnapshot } from "./authErrorCatalog";

export const IDENTITY_CONFLICT_CODE = AUTH_ERROR_CODES.IDENTITY_CONFLICT;

const IDENTITY_CONFLICT_SNIPPET = "already linked to another local user";

export function isIdentityConflictError(err) {
  return (
    err?.code === IDENTITY_CONFLICT_CODE ||
    (err?.status === 409 &&
      String(err?.message || "").toLowerCase().includes(IDENTITY_CONFLICT_SNIPPET))
  );
}

export function getIdentityConflictMessage(selectedRole) {
  return parseAuthError(
    { status: 409, message: IDENTITY_CONFLICT_SNIPPET, code: IDENTITY_CONFLICT_CODE },
    { selectedRole }
  ).userMessage;
}

export function clearAuthSession() {
  localStorage.removeItem("onit_token");
  localStorage.removeItem("onit_refresh_token");
  localStorage.removeItem("onit_user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("onit_auth0_client_id");
  sessionStorage.removeItem("onit_auth_app");

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("@@auth0spajs@@")) {
      localStorage.removeItem(key);
    }
  });
}

export function formatAuthApiError(err, selectedRole, context = {}) {
  return parseAuthError(err, { selectedRole, ...context }).userMessage;
}

export function handleIdentityConflict(err, selectedRole, setError) {
  if (!isIdentityConflictError(err)) return false;
  clearAuthSession();
  if (typeof setError === "function") {
    setError(parseAuthError(err, { selectedRole, phase: "getUserProfile" }));
  }
  return true;
}

/** Normalize axios interceptor or fetch errors for parseAuthError */
export function normalizeApiError(err, requestUrl) {
  if (!err) return { message: "Unknown error" };
  return {
    message: err.message,
    status: err.status,
    statusCode: err.statusCode,
    error: err.error,
    code: err.code,
    raw: err.raw,
    requestUrl: requestUrl || err.requestUrl,
  };
}
