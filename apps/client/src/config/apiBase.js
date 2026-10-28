/**
 * Browser-facing API URL — NEVER the raw Lambda URL.
 *
 * Flutter uses Lambda directly in the mobile app. Web uses a same-origin proxy:
 *   Network tab:  http://localhost:5173/api-onitindia/users/me
 *   Vercel/prod:  https://your-domain/api-onitindia/users/me  (or api.onitindia.com)
 *   Actual backend: ONIT_BACKEND_API_URL in vite.config / vercel.json only (not in bundle)
 */

/** Public brand URL once DNS is live. */
export const API_PUBLIC_ORIGIN = "https://api.onitindia.com";

/** Same-origin proxy path — Vite dev + Vercel rewrite → Lambda. */
export const API_PROXY_PATH = "/api-onitindia";

function isLambdaUrl(value) {
  return /lambda-url\.[a-z0-9-]+\.on\.aws/i.test(String(value || ""));
}

/**
 * What the browser calls. Lambda must never appear here or in the Network tab.
 */
export function getApiBaseUrl() {
  const configured = String(import.meta.env.VITE_API_URL ?? "")
    .trim()
    .replace(/\/$/, "");

  if (configured && isLambdaUrl(configured)) {
    if (import.meta.env.DEV) {
      console.warn(
        "[API] VITE_API_URL must not be a Lambda URL in the browser. Using /api-onitindia proxy."
      );
    }
    return API_PROXY_PATH;
  }

  // Dev: always same-origin proxy (Vite → ONIT_BACKEND_API_URL)
  if (import.meta.env.DEV) {
    return API_PROXY_PATH;
  }

  // Prod: relative proxy on Vercel, or api.onitindia.com when DNS exists
  if (configured.startsWith("/")) {
    return configured;
  }

  if (configured && !isLambdaUrl(configured)) {
    return configured;
  }

  return API_PROXY_PATH;
}

export function getApiUrl(path = "") {
  const base = getApiBaseUrl();
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
