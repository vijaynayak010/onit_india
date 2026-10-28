export const API_PUBLIC_ORIGIN = "https://api.onitindia.com";
export const API_PROXY_PATH = "/api-onitindia";

function isLambdaUrl(value) {
  return /lambda-url\.[a-z0-9-]+\.on\.aws/i.test(String(value || ""));
}

export function getApiBaseUrl() {
  const configured = String(import.meta.env.VITE_API_URL ?? "").trim().replace(/\/$/, "");

  if (configured && isLambdaUrl(configured)) {
    if (import.meta.env.DEV) {
      console.warn("[Admin API] VITE_API_URL must not be a Lambda URL in the browser. Using /api-onitindia proxy.");
    }
    return API_PROXY_PATH;
  }

  if (import.meta.env.DEV) {
    return API_PROXY_PATH;
  }

  if (configured) {
    if (configured.startsWith("/")) {
      return configured;
    }
    return configured;
  }

  return API_PROXY_PATH;
}

export function getApiUrl(path = "") {
  const base = getApiBaseUrl();
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
