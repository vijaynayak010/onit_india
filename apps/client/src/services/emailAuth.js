import { getAuth0ClientIdForRole, getAuth0BaseUrl } from "../config/auth0";
import { exchangeAuth0Token, getAuth0ScopeWithOffline } from "./auth0Token";

export { getAuth0BaseUrl };

/** Same scopes as Flutter: {'openid', 'profile', 'email', 'offline_access'} */
export const AUTH0_EMAIL_SCOPES = "openid profile email offline_access";

export function getAuth0Audience() {
  return String(import.meta.env.VITE_AUTH0_AUDIENCE ?? "").trim();
}

/** Send 6-digit email OTP via Auth0 (Flutter: passwordless/start before loginWithEmailCode). */
export async function sendEmailOtp(email, role) {
  const clientId = getAuth0ClientIdForRole(role);
  if (!clientId) {
    throw new Error(
      "Auth0 client_id is missing. Set VITE_AUTH0_CLIENT_ID_PROVIDER / VITE_AUTH0_CLIENT_ID_TASKER in client/.env and restart the dev server."
    );
  }

  const res = await fetch(`${getAuth0BaseUrl()}/passwordless/start`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      connection: "email",
      email: String(email || "").trim(),
      send: "code",
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.description || data.error_description || "Failed to send OTP."
    );
  }
  return true;
}

/**
 * Flutter parity:
 *   auth0.api.loginWithEmailCode(
 *     email: email,
 *     verificationCode: otp,
 *     audience: env.auth0Audience,
 *     scopes: {'openid', 'profile', 'email', 'offline_access'},
 *   )
 * → POST https://{auth0Domain}/oauth/token
 */
export async function loginWithEmailCode({
  email,
  verificationCode,
  role,
  audience = getAuth0Audience(),
  scopes = getAuth0ScopeWithOffline() || AUTH0_EMAIL_SCOPES,
}) {
  const body = {
    grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
    client_id: getAuth0ClientIdForRole(role),
    username: String(email || "").trim(),
    otp: String(verificationCode || "").trim(),
    realm: "email",
    scope: scopes,
  };

  if (!body.client_id) {
    throw new Error(
      "Auth0 client_id is missing. Set VITE_AUTH0_CLIENT_ID_PROVIDER / VITE_AUTH0_CLIENT_ID_TASKER in client/.env and restart the dev server."
    );
  }

  if (audience) {
    body.audience = audience;
  }

  const data = await exchangeAuth0Token(body);

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || null,
    idToken: data.id_token || null,
    expiresIn: data.expires_in,
  };
}

/** @alias loginWithEmailCode */
export async function verifyEmailOtp({ email, otp, role }) {
  return loginWithEmailCode({
    email,
    verificationCode: otp,
    role,
  });
}

export function persistAuthTokens({ accessToken, refreshToken }) {
  localStorage.setItem("onit_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("onit_refresh_token", refreshToken);
  }
}
