import { getAuth0BaseUrl } from "../config/auth0";

/**
 * POST /oauth/token with optional audience fallback when Auth0 returns 403
 * (SPA not yet authorized for the API audience in Auth0 dashboard).
 */
export async function exchangeAuth0Token(body) {
  const url = `${getAuth0BaseUrl()}/oauth/token`;
  const payload = { ...body };

  let res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  let data = await res.json().catch(() => ({}));

  if (res.status === 403 && payload.audience) {
    const { audience, ...withoutAudience } = payload;
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(withoutAudience),
    });
    data = await res.json().catch(() => ({}));
  }

  if (!res.ok) {
    const message =
      data.error_description ||
      data.description ||
      data.error ||
      `Auth0 token exchange failed (${res.status}).`;
    const err = new Error(message);
    err.status = res.status;
    err.code = data.error;
    err.error = data.error;
    err.error_description = data.error_description;
    throw err;
  }

  return data;
}

export function getAuth0ScopeWithOffline() {
  const base = String(import.meta.env.VITE_AUTH0_SCOPE || "openid profile email").trim();
  if (base.includes("offline_access")) return base;
  return `${base} offline_access`;
}

/** Flutter scopes set as a single OAuth scope string. */
export const AUTH0_FLUTTER_SCOPES = "openid profile email offline_access";
