import { getApiUrl } from "../config/apiBase";
import { isTestModeEnabled } from "../test-mode/testModeConfig";
import { handleMockApiRequest } from "../test-mode/mockApiHandler";

/**
 * fetch() wrapper — always uses proxy base URL + Bearer token (Flutter ApiClient.dio parity).
 * Network tab shows /api-onitindia/... never the Lambda host.
 */
export async function apiFetch(path, options = {}) {
  if (isTestModeEnabled()) {
    let parsedBody;
    if (typeof options.body === 'string') {
      try { parsedBody = JSON.parse(options.body); } catch (e) { parsedBody = options.body; }
    } else {
      parsedBody = options.body;
    }
    const mockRes = await handleMockApiRequest(options.method || 'GET', path, parsedBody);
    if (mockRes.status >= 400) {
      const err = new Error(mockRes.data?.message || `Mock request failed (${mockRes.status})`);
      err.status = mockRes.status;
      err.data = mockRes.data;
      throw err;
    }
    return mockRes.data;
  }

  const token = localStorage.getItem("onit_token");
  const headers = {
    ...(options.body && !options.headers?.["Content-Type"]
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(getApiUrl(path), {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data.message ||
      data.error ||
      (Array.isArray(data.message) ? data.message.join(", ") : "") ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
