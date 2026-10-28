import { ACCOUNT_DEACTIVATED_MESSAGE, getAuth0ClientIdForRole } from "../config/auth0";

/** @typedef {'frontend'|'auth0'|'backend'|'database'} AuthErrorLayer */

/**
 * Backend-aligned auth error definitions (Hybrid model + deletion flow).
 * @see backend doc/api_documentation.md
 */
export const AUTH_ERROR_CODES = {
  IDENTITY_CONFLICT: "IDENTITY_CONFLICT",
  ACCOUNT_DEACTIVATED: "ACCOUNT_DEACTIVATED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
  NO_BACKEND_USER: "NO_BACKEND_USER",
  SIGNUP_ACCOUNT_EXISTS: "SIGNUP_ACCOUNT_EXISTS",
  SIGNUP_EMAIL_EXISTS: "SIGNUP_EMAIL_EXISTS",
  ONBOARD_FAILED: "ONBOARD_FAILED",
  ONBOARD_INCOMPLETE: "ONBOARD_INCOMPLETE",
  WRONG_AUTH0_CLIENT: "WRONG_AUTH0_CLIENT",
  DELETION_ALREADY_PENDING: "DELETION_ALREADY_PENDING",
  DATABASE_ERROR: "DATABASE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  AUTH0_OTP_INVALID: "AUTH0_OTP_INVALID",
  PROFILE_FETCH_FAILED: "PROFILE_FETCH_FAILED",
  MSG91_ERROR: "MSG91_ERROR",
  MSG91_MOBILE_BLOCKED: "MSG91_MOBILE_BLOCKED",
  MSG91_SUBSCRIPTION_NOT_FOUND: "MSG91_SUBSCRIPTION_NOT_FOUND",
  MSG91_CAPTCHA_REQUIRED: "MSG91_CAPTCHA_REQUIRED",
  PHONE_LINK_FAILED: "PHONE_LINK_FAILED",
  GOOGLE_AUTH_FAILED: "GOOGLE_AUTH_FAILED",
  UNKNOWN: "UNKNOWN",
};

export function getJwtDebugSnapshot() {
  const token = localStorage.getItem("onit_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    const providerId = getAuth0ClientIdForRole("PROVIDER");
    const taskerId = getAuth0ClientIdForRole("TASKER");
    let inferredApp = "unknown";
    if (payload.azp === providerId) inferredApp = "provider";
    else if (payload.azp === taskerId) inferredApp = "tasker";

    return {
      azp: payload.azp,
      inferredApp,
      expectedProviderClientId: providerId,
      expectedTaskerClientId: taskerId,
      azpMatchesRole:
        inferredApp === "provider" || inferredApp === "tasker"
          ? inferredApp
          : "mismatch",
      sub: payload.sub,
      email: payload.email,
      aud: payload.aud,
      exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
    };
  } catch {
    return { parseError: true };
  }
}

export function getAuthSessionSnapshot(selectedRole) {
  return {
    selectedRole: selectedRole || localStorage.getItem("userRole"),
    authApp: sessionStorage.getItem("onit_auth_app"),
    storedClientId: localStorage.getItem("onit_auth0_client_id"),
    hasToken: Boolean(localStorage.getItem("onit_token")),
    jwt: getJwtDebugSnapshot(),
  };
}

const IDENTITY_SNIPPET = "already linked to another local user";

const CATALOG = {
  [AUTH_ERROR_CODES.IDENTITY_CONFLICT]: {
    title: "409 — Identity conflict (Hybrid model)",
    layer: "backend",
    cause:
      "Auth0 login succeeded, but GET /users/me could not link this JWT to a local user. Usually: wrong Provider vs Tasker client (azp), duplicate authIdentity row, or account created before hybrid split.",
    fixes: [
      "Clear site data → /auth → pick the correct role (Provider vs Performer) → login again.",
      "Same email can exist as TWO accounts (one Provider, one Tasker). Use the matching app.",
      "Backend: check users + auth_identities for this email/sub; remove stale identity from old single Auth0 client.",
      "Backend: AUTH0_PROVIDER_CLIENT_ID and AUTH0_TASKER_CLIENT_ID must match client/.env VITE_* values.",
    ],
    apis: ["GET /users/me"],
  },
  [AUTH_ERROR_CODES.ACCOUNT_DEACTIVATED]: {
    title: "401 — Account deactivated (30-day deletion)",
    layer: "backend",
    cause:
      "User requested account deletion. Backend blocks API access with ACCOUNT_DEACTIVATED_PENDING_DELETION until restore.",
    fixes: [
      "Redirect to /provider/restore-account or /performer/restore-account.",
      "Call POST /users/me/deletion-request/cancel to restore.",
    ],
    apis: ["Any authenticated route", "POST /users/me/deletion-request/cancel"],
  },
  [AUTH_ERROR_CODES.SESSION_EXPIRED]: {
    title: "401 — Session expired",
    layer: "frontend",
    cause: "Access token invalid or refresh failed.",
    fixes: ["Log in again.", "Clear localStorage if loop persists."],
    apis: ["GET /users/me"],
  },
  [AUTH_ERROR_CODES.NO_BACKEND_USER]: {
    title: "No backend account (PENDING)",
    layer: "backend",
    cause:
      "Auth0 token is valid but no onboarded user for this azp. Login mode hit a profile with role PENDING or missing.",
    fixes: [
      "Switch to Sign up and complete profile.",
      "Call POST /users/onboard { role: PROVIDER | TASKER } then create provider/tasker profile.",
    ],
    apis: ["GET /users/me", "POST /users/onboard"],
  },
  [AUTH_ERROR_CODES.SIGNUP_EMAIL_EXISTS]: {
    title: "Account already exists",
    layer: "backend",
    cause: "Sign-up attempted but GET /users/me returned an existing non-PENDING user.",
    fixes: ["Switch to Login instead of Sign up."],
    apis: ["GET /users/me"],
  },
  [AUTH_ERROR_CODES.SIGNUP_ACCOUNT_EXISTS]: {
    title: "Account already exists",
    layer: "frontend",
    cause: "Sign-up attempted with an email or phone that is already registered.",
    fixes: ["Continue with Login instead of Sign up."],
    apis: ["POST /auth/check-account"],
  },
  [AUTH_ERROR_CODES.ONBOARD_FAILED]: {
    title: "Onboarding failed",
    layer: "backend",
    cause: "POST /users/onboard failed after Auth0 login. Body must use role TASKER or PROVIDER (not PERFORMER), and JWT azp must match that app.",
    fixes: [
      "Retry login; check backend logs for onboard.",
      "Ensure azp matches Provider or Tasker client ID before calling /users/onboard.",
    ],
    apis: ["POST /users/onboard"],
  },
  [AUTH_ERROR_CODES.ONBOARD_INCOMPLETE]: {
    title: "Onboarding incomplete",
    layer: "backend",
    cause: "Onboard ran but role still PENDING or profile refresh failed.",
    fixes: ["Refresh and try again.", "Check POST /providers or POST /taskers after onboard."],
    apis: ["POST /users/onboard", "GET /users/me"],
  },
  [AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT]: {
    title: "Wrong Auth0 client for selected role",
    layer: "frontend",
    cause:
      "JWT azp does not match VITE_AUTH0_CLIENT_ID_PROVIDER or VITE_AUTH0_CLIENT_ID_TASKER for the role you selected.",
    fixes: [
      "Go back to role selection, pick Provider or Performer again, then login.",
      "Restart dev server after .env changes.",
    ],
    apis: ["Auth0 /oauth/token", "GET /users/me"],
  },
  [AUTH_ERROR_CODES.DELETION_ALREADY_PENDING]: {
    title: "400 — Deletion already requested",
    layer: "backend",
    cause: "POST /users/me/deletion-request called when a pending request already exists.",
    fixes: ["Use restore flow or wait for scheduled deletion."],
    apis: ["POST /users/me/deletion-request"],
  },
  [AUTH_ERROR_CODES.DATABASE_ERROR]: {
    title: "500 — Database / Prisma error",
    layer: "database",
    cause:
      "Backend DB schema missing or migration not run (e.g. public.users, authIdentity table).",
    fixes: ["Backend team: run Prisma migrations on Lambda/Neon DB.", "Not fixable from React alone."],
    apis: ["GET /users/me"],
  },
  [AUTH_ERROR_CODES.NETWORK_ERROR]: {
    title: "Network / CORS error",
    layer: "frontend",
    cause: "Cannot reach api.onitindia.com or proxy failed.",
    fixes: [
      "Check VITE_API_URL (https://api.onitindia.com).",
      "Restart npm run dev after vite.config change.",
    ],
    apis: [],
  },
  [AUTH_ERROR_CODES.AUTH0_OTP_INVALID]: {
    title: "Auth0 OTP invalid",
    layer: "auth0",
    cause: "Wrong or expired OTP, or wrong client_id on passwordless token exchange.",
    fixes: ["Request new code.", "Confirm client_id matches selected role."],
    apis: ["Auth0 POST /oauth/token"],
  },
  [AUTH_ERROR_CODES.PROFILE_FETCH_FAILED]: {
    title: "Profile load failed after login",
    layer: "backend",
    cause:
      "Auth0 login succeeded (token stored) but GET /users/me failed. Often CORS/proxy misconfiguration, backend 500, or identity not yet created.",
    fixes: [
      "Use VITE_API_URL=https://api.onitindia.com — not a raw Lambda URL.",
      "Restart npm run dev after changing vite.config.js.",
      "If signing up, continue to complete profile — backend may not have a user row yet.",
      "Check backend logs for GET /users/me with this JWT sub/azp.",
    ],
    apis: ["GET /users/me"],
  },
  [AUTH_ERROR_CODES.MSG91_ERROR]: {
    title: "MSG91 phone OTP error",
    layer: "frontend",
    cause: "SMS OTP send/verify failed via MSG91 widget.",
    fixes: ["Check VITE_MSG91_WIDGET_ID and VITE_MSG91_WIDGET_TOKEN.", "Disable captcha in MSG91 OTP widget settings if SMS fails."],
    apis: ["MSG91 widget", "POST /auth/profile-phone/verify-access-token"],
  },
  [AUTH_ERROR_CODES.MSG91_MOBILE_BLOCKED]: {
    title: "MSG91 — mobile requests not allowed",
    layer: "frontend",
    cause:
      "Web now uses the same MSG91 SDK path as Flutter. This widget must have Mobile Integration enabled (same as the Flutter app widget).",
    fixes: [
      "Confirm .env uses the Flutter widget id/token (36626a6c4d53313232383836).",
      "MSG91 → that OTP Widget → Mobile Integration ON.",
      "Restart Vite after changing .env (env is baked at startup).",
      "Until fixed, use email OTP login.",
    ],
    apis: ["MSG91 OTP widget settings"],
  },
  [AUTH_ERROR_CODES.MSG91_SUBSCRIPTION_NOT_FOUND]: {
    title: "MSG91 — no active SMS subscription",
    layer: "frontend",
    cause:
      "MSG91 account has no active OTP/SMS plan for this widget, or widget ID and token belong to different accounts.",
    fixes: [
      "MSG91 dashboard → Billing / Subscriptions → activate OTP or SMS plan.",
      "Confirm widget ID and widget token are from the same MSG91 account.",
      "Contact MSG91 support if the plan is active but error persists.",
      "Use email OTP login until SMS is activated.",
    ],
    apis: ["MSG91 OTP widget", "MSG91 billing"],
  },
  [AUTH_ERROR_CODES.MSG91_CAPTCHA_REQUIRED]: {
    title: "MSG91 captcha is blocking SMS",
    layer: "frontend",
    cause:
      "OTP Widget still has captcha enabled. On localhost, hCaptcha often fails and SMS is never sent.",
    fixes: [
      "MSG91 dashboard → OTP Widget → turn Captcha OFF.",
      "Enable Web requests and whitelist localhost + production domain.",
      "Retry Send OTP after saving widget settings.",
      "Until then, use email OTP login.",
    ],
    apis: ["MSG91 OTP widget settings"],
  },
  [AUTH_ERROR_CODES.PHONE_LINK_FAILED]: {
    title: "Phone link to Auth0 identity failed",
    layer: "backend",
    cause: "Backend rejected MSG91 token when linking phone to user profile.",
    fixes: ["Check Authorization Bearer token is valid.", "Verify ownerType PROVIDER vs TASKER."],
    apis: ["POST /auth/profile-phone/verify-access-token"],
  },
  [AUTH_ERROR_CODES.UNAUTHORIZED]: {
    title: "401 — Unauthorized",
    layer: "auth0",
    cause: "Access token missing, expired, or rejected by Auth0 or the API.",
    fixes: ["Log in again.", "Clear site data and retry.", "Confirm Auth0 callback URLs match your app origin."],
    apis: ["Auth0 /oauth/token", "GET /users/me"],
  },
  [AUTH_ERROR_CODES.GOOGLE_AUTH_FAILED]: {
    title: "Google sign-in failed",
    layer: "auth0",
    cause:
      "Auth0 rejected the Google login (400). Usually callback URL mismatch, wrong client_id for role, or Google connection not enabled on the SPA app.",
    fixes: [
      "Auth0 → Application → Allowed Callback URLs: add http://localhost:5173 and your Vercel domain (no path).",
      "Auth0 → Allowed Web Origins: same origins.",
      "Enable Google connection on both Provider and Tasker SPA apps.",
      "Pick Provider or Performer before clicking Google sign-in.",
    ],
    apis: ["Auth0 loginWithPopup", "Auth0 GET /oauth/token"],
  },
  [AUTH_ERROR_CODES.UNKNOWN]: {
    title: "Sign-in error",
    layer: "frontend",
    cause: "An unexpected error occurred during authentication.",
    fixes: ["Retry login.", "Check browser console and Auth0 dashboard settings."],
    apis: [],
  },
};

export function resolveAuthErrorCode(err, context = {}) {
  const status = err?.status ?? err?.statusCode;
  const message = String(
    err?.message ||
      err?.error_description ||
      (typeof err?.error === "string" ? err.error : "") ||
      ""
  ).trim();
  const lower = message.toLowerCase();

  if (context?.phase === "google_auth") {
    return AUTH_ERROR_CODES.GOOGLE_AUTH_FAILED;
  }

  if (err?.code && CATALOG[err.code]) return err.code;

  if (
    status === 409 &&
    lower.includes(IDENTITY_SNIPPET)
  ) {
    return AUTH_ERROR_CODES.IDENTITY_CONFLICT;
  }

  if (
    message === ACCOUNT_DEACTIVATED_MESSAGE ||
    err?.code === ACCOUNT_DEACTIVATED_MESSAGE
  ) {
    return AUTH_ERROR_CODES.ACCOUNT_DEACTIVATED;
  }

  if (
    err?.code === AUTH_ERROR_CODES.SESSION_EXPIRED ||
    err?.code === "SESSION_EXPIRED" ||
    message.includes("Session expired")
  ) {
    return AUTH_ERROR_CODES.SESSION_EXPIRED;
  }

  if (err?.code === AUTH_ERROR_CODES.NO_BACKEND_USER || err?.code === "NO_BACKEND_USER") {
    return AUTH_ERROR_CODES.NO_BACKEND_USER;
  }

  if (err?.code === AUTH_ERROR_CODES.SIGNUP_EMAIL_EXISTS) {
    return AUTH_ERROR_CODES.SIGNUP_EMAIL_EXISTS;
  }

  if (err?.code === AUTH_ERROR_CODES.SIGNUP_ACCOUNT_EXISTS) {
    return AUTH_ERROR_CODES.SIGNUP_ACCOUNT_EXISTS;
  }

  if (err?.code === AUTH_ERROR_CODES.ONBOARD_INCOMPLETE) {
    return AUTH_ERROR_CODES.ONBOARD_INCOMPLETE;
  }

  if (err?.code === AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT) {
    return AUTH_ERROR_CODES.WRONG_AUTH0_CLIENT;
  }

  if (
    status === 400 &&
    lower.includes("deletion request already exists")
  ) {
    return AUTH_ERROR_CODES.DELETION_ALREADY_PENDING;
  }

  if (
    status === 500 ||
    lower.includes("prisma") ||
    lower.includes("does not exist") ||
    lower.includes("users")
  ) {
    return AUTH_ERROR_CODES.DATABASE_ERROR;
  }

  if (!navigator.onLine || lower.includes("network") || lower.includes("failed to fetch")) {
    return AUTH_ERROR_CODES.NETWORK_ERROR;
  }

  if (status === 401) {
    return AUTH_ERROR_CODES.UNAUTHORIZED;
  }

  const requestUrl = String(err?.requestUrl || context.requestUrl || "");
  const isProfileRequest =
    context?.phase === "getUserProfile" || requestUrl.includes("/users/me");

  if (isProfileRequest) {
    if (status === 404) return AUTH_ERROR_CODES.NO_BACKEND_USER;
    if (err?.code === AUTH_ERROR_CODES.NETWORK_ERROR) {
      return AUTH_ERROR_CODES.NETWORK_ERROR;
    }
    return AUTH_ERROR_CODES.PROFILE_FETCH_FAILED;
  }

  if (context?.phase === "auth0_otp" || lower.includes("invalid or expired code")) {
    return AUTH_ERROR_CODES.AUTH0_OTP_INVALID;
  }

  if (lower.includes("subscription not found")) {
    return AUTH_ERROR_CODES.MSG91_SUBSCRIPTION_NOT_FOUND;
  }

  if (lower.includes("mobile requests are not allowed") || lower.includes("web requests are not allowed")) {
    return AUTH_ERROR_CODES.MSG91_MOBILE_BLOCKED;
  }

  if (lower.includes("captcha") || lower.includes("hcaptcha") || lower.includes("recaptcha")) {
    return AUTH_ERROR_CODES.MSG91_CAPTCHA_REQUIRED;
  }

  if (
    context?.phase === "msg91" ||
    lower.includes("msg91") ||
    String(err?.code || "").startsWith("MSG91_")
  ) {
    return AUTH_ERROR_CODES.MSG91_ERROR;
  }

  if (context?.phase === "phone_link") {
    return AUTH_ERROR_CODES.PHONE_LINK_FAILED;
  }

  if (context?.phase === "onboard") {
    return AUTH_ERROR_CODES.ONBOARD_FAILED;
  }

  if (lower.includes("callback url mismatch") || lower.includes("redirect_uri")) {
    return AUTH_ERROR_CODES.GOOGLE_AUTH_FAILED;
  }

  return AUTH_ERROR_CODES.UNKNOWN;
}

export function parseAuthError(err, context = {}) {
  const input =
    typeof err === "string" ? { message: err } : err || {};
  const code = resolveAuthErrorCode(input, context);
  const catalog =
    CATALOG[code] ||
    CATALOG[AUTH_ERROR_CODES.UNKNOWN] || {
      title: "Sign-in error",
      layer: "frontend",
      cause: "An unexpected error occurred.",
      fixes: ["Retry login."],
      apis: [],
    };
  const status = input.status ?? input.statusCode ?? null;
  const backendMessage = String(
    input.message ||
      input.error_description ||
      (typeof input.error === "string" ? input.error : "") ||
      ""
  ).trim();

  const jwt = getJwtDebugSnapshot();

  let userMessage = backendMessage || catalog.title;
  if (code === AUTH_ERROR_CODES.IDENTITY_CONFLICT) {
    const role = String(context.selectedRole || "PROVIDER").toUpperCase();
    userMessage =
      role === "TASKER" || role === "PERFORMER"
        ? "This email is linked to a Provider account. Choose Provider on the previous screen, or use a different email for Performer."
        : "This email is linked to a Performer account. Choose Performer on the previous screen, or use a different email for Provider.";
  }
  if (code === AUTH_ERROR_CODES.ACCOUNT_DEACTIVATED) {
    userMessage = "Your account is deactivated. You can restore it within 30 days from the restore screen.";
  }
  if (code === AUTH_ERROR_CODES.UNKNOWN && !backendMessage) {
    userMessage = "Something went wrong during sign-in. Expand debug info below.";
  }
  if (code === AUTH_ERROR_CODES.PROFILE_FETCH_FAILED && jwt?.azp) {
    userMessage =
      "Login succeeded but loading your profile failed. Check API URL (https://api.onitindia.com). See debug info.";
  }

  if (
    code === AUTH_ERROR_CODES.IDENTITY_CONFLICT &&
    jwt &&
    context.selectedRole
  ) {
    const role = String(context.selectedRole).toUpperCase();
    const expectedApp = role === "TASKER" || role === "PERFORMER" ? "tasker" : "provider";
    if (jwt.inferredApp !== "unknown" && jwt.inferredApp !== expectedApp) {
      userMessage = `You selected ${role} but Auth0 issued a token for ${jwt.inferredApp.toUpperCase()} client. Go back and pick the correct role, then log in again.`;
    }
  }

  return {
    code,
    status,
    title: catalog.title,
    layer: catalog.layer,
    userMessage,
    cause: catalog.cause,
    fixes: catalog.fixes,
    apis: catalog.apis,
    backendMessage: backendMessage || null,
    backendError: input.error || null,
    requestUrl: input.requestUrl || context.requestUrl || null,
    phase: context.phase || null,
    session: getAuthSessionSnapshot(context.selectedRole),
    raw: input.raw ?? null,
    timestamp: new Date().toISOString(),
  };
}
