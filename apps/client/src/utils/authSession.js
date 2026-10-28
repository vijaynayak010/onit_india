import {
  getAuth0ClientIdForRole,
  persistAuth0AppFromRole,
  persistAuth0ClientId,
} from "../config/auth0";
import { AUTH_ERROR_CODES } from "./authErrorCatalog";
import { clearAuthSession } from "./authErrors";

export function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    return JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
  } catch {
    return null;
  }
}

export function getTokenAzp(token = localStorage.getItem("onit_token")) {
  return decodeJwtPayload(token)?.azp || null;
}

export function normalizeAuthRole(role) {
  const value = String(role || "").toUpperCase();
  if (value === "TASKER" || value === "PERFORMER") return "TASKER";
  if (value === "PROVIDER") return "PROVIDER";
  return "";
}

/** Persist Auth0 app + client id without clearing tokens (after successful login). */
export function finalizeAuthSession(role) {
  const normalized = normalizeAuthRole(role);
  if (!normalized) return;
  persistAuth0AppFromRole(normalized);
  persistAuth0ClientId(getAuth0ClientIdForRole(normalized));
}

/**
 * Clear stale session and bind Auth0 app to the chosen role.
 * Call when user picks Provider vs Performer on /auth.
 */
export function prepareAuthForRole(role) {
  const normalized = normalizeAuthRole(role);
  if (!normalized) return;
  clearAuthSession();
  finalizeAuthSession(normalized);
}

export function validateTokenForRole(role, token = localStorage.getItem("onit_token")) {
  const normalized = normalizeAuthRole(role);
  const expectedClientId = getAuth0ClientIdForRole(normalized || "PROVIDER");

  if (!normalized) {
    return {
      ok: false,
      code: AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT,
      message: "Select Provider or Performer before signing in.",
    };
  }

  if (!token) {
    return {
      ok: false,
      code: AUTH_ERROR_CODES.UNAUTHORIZED,
      message: "No access token after login.",
    };
  }

  const payload = decodeJwtPayload(token);
  // Backend-issued local JWTs (issued by phone authentication) do not carry an Auth0 azp claim
  if (payload?.typ === "local_access" || (!payload?.azp && payload?.sub)) {
    return { ok: true, azp: null, expectedClientId, selectedRole: normalized };
  }

  const azp = getTokenAzp(token);
  if (azp !== expectedClientId) {
    return {
      ok: false,
      code: AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT,
      message: `Auth0 client mismatch: token azp (${azp || "missing"}) ≠ expected ${normalized} client (${expectedClientId}).`,
      azp,
      expectedClientId,
      selectedRole: normalized,
    };
  }

  return { ok: true, azp, expectedClientId, selectedRole: normalized };
}

/** Throws structured error if JWT azp does not match selected role's Auth0 client. */
export function assertTokenMatchesRole(role, token = localStorage.getItem("onit_token")) {
  const result = validateTokenForRole(role, token);
  if (!result.ok) {
    clearAuthSession();
    const err = new Error(result.message);
    err.code = result.code;
    err.status = 400;
    err.azp = result.azp;
    err.expectedClientId = result.expectedClientId;
    throw err;
  }
  return result;
}

/** Validate azp, then call GET /users/me — prevents 409 from wrong-client tokens. */
export async function fetchBackendProfile(role, getUserProfile) {
  assertTokenMatchesRole(role);
  finalizeAuthSession(role);
  try {
    return await getUserProfile();
  } catch (err) {
    // Brand-new Auth0 user — backend may 404 until POST /users/onboard
    if (err?.status === 404) {
      return { role: "PENDING" };
    }
    throw err;
  }
}

export function requireSelectedRole(role) {
  if (normalizeAuthRole(role)) return normalizeAuthRole(role);
  const err = new Error("Select Provider or Performer before continuing.");
  err.code = AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT;
  err.status = 400;
  throw err;
}

/** Role for POST /users/onboard — never send PERFORMER; backend enum is PROVIDER | TASKER. */
export function resolveOnboardRole(roleHint) {
  const fromHint = normalizeAuthRole(roleHint);
  if (fromHint) return fromHint;

  const fromStorage = normalizeAuthRole(localStorage.getItem("userRole"));
  if (fromStorage) return fromStorage;

  const sessionApp = sessionStorage.getItem("onit_auth_app");
  if (sessionApp === "tasker") return "TASKER";
  if (sessionApp === "provider") return "PROVIDER";

  return "PROVIDER";
}
