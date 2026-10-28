# API Guard — Implementation Guide

> **Last updated:** July 2026  
> **Scope:** Why API guards are needed in OnIT India, current gaps, and a concrete plan to implement them in this repo.  
> **Audience:** Backend + frontend engineers working on provider, performer, admin, and local Express routes.

---

## 1. Why API guards are needed

OnIT India has **two separate API surfaces**. Route guards in React (`GatedRoute`, `PrivateRoute`) only protect **what the user sees in the browser**. They do **not** protect HTTP endpoints. Anyone with curl, Postman, or a script can call an unguarded API directly.

Without server-side guards, you get:

| Risk | Example in this repo |
|------|----------------------|
| **Cost abuse** | `POST /api/ai-task` and `POST /api/enhance-description` call OpenAI. Today they are public except for rate limiting (10 req/min). A bot can burn quota quickly. |
| **Data spam / abuse** | `POST /api/submit-task` forwards to Google Sheets with no identity check. |
| **Unauthorized uploads** | `POST /api/submit-career` accepts resume files and forwards to NestJS `/careers/applications` **without** a user JWT. |
| **Public file access** | `GET /uploads/*` serves uploaded files with no auth. |
| **Broken trust boundary** | Client sends `Authorization: Bearer …` on AI calls (`aiApi`), but `server/server.js` **ignores** the header. UI auth and API auth are out of sync. |
| **Role / ownership bypass** | If a NestJS endpoint is misconfigured, a provider token could hit performer-only routes (or vice versa). Guards enforce this at the server, not in localStorage. |

**Principle:** Authentication proves *who* is calling. Authorization (role/ownership guards) proves *what they are allowed to do*. Both must run **before** business logic.

React guards remain useful for UX (redirect to `/auth`, hide nav). **API guards are the security boundary.**

---

## 2. Architecture overview

```
Browser
   │
   ├─ /api-onitindia/*  ──► Vite/Vercel proxy ──► NestJS Lambda (business API)
   │                                              JWT + role guards (external repo)
   │
   └─ /api/*            ──► server/server.js (local Express)
                              AI helpers, careers, landing forms
                              ⚠ No JWT guard today
```

| Layer | Path | Code location | Auth today |
|-------|------|---------------|------------|
| **Business API** | `/api-onitindia` | External NestJS Lambda | Bearer JWT (Auth0), role guards documented in backend |
| **Local Express** | `/api` | `server/server.js` | CORS + helmet + rate limit only |
| **Client interceptors** | Both | `client/src/utils/apiInterceptors.js`, `admin-onit/src/services/api.js` | Attach token; retry on 401 |
| **Route guards (UI)** | `/provider/*`, `/performer/*`, admin | `GatedRoute.jsx`, `PrivateRoute.jsx` | Session + role check in React |

Proxy config:
- Dev: `client/vite.config.js`
- Prod: `vercel.json` — `/api-onitindia/:path*` → Lambda, `/api/:path*` → `server/server.js`

Client base URL helper: `client/src/config/apiBase.js` → always `/api-onitindia` in the browser (never raw Lambda URL).

---

## 3. Current protection map

### 3.1 NestJS Lambda (`/api-onitindia`) — external

Source is **not in this repo**. Client and docs assume:

- `Authorization: Bearer <Auth0 access token>`
- Audience: `VITE_AUTH0_AUDIENCE`
- Roles: `PROVIDER`, `TASKER`, `ADMIN`, `SUPER_ADMIN`
- Ownership checks on resource routes (e.g. templates → provider-only, see `docs/templates_api_doc.md`)

Client wiring:
- Provider / performer: `attachApiInterceptors()` in `client/src/utils/apiInterceptors.js`
- Token refresh via `AuthContext` → `setApiTokenRefresher()`
- Pre-flight role binding: `client/src/utils/authSession.js` (`validateTokenForRole`, `assertTokenMatchesRole`)

**Action in this repo:** Document expected backend behavior; add integration tests that assert 401/403 for protected routes. Guard **implementation** for NestJS belongs in the backend repository.

### 3.2 Local Express (`/api`) — in this repo

| Route | Method | Current protection | Recommended guard |
|-------|--------|-------------------|-------------------|
| `/api/ai-task` | POST | Rate limit | **Authenticated** (PROVIDER or TASKER) + rate limit |
| `/api/enhance-description` | POST | Rate limit | **Authenticated** (PROVIDER or TASKER) + rate limit |
| `/api/submit-task` | POST | CORS only | **Optional auth** or signed site key; at minimum strict rate limit + CAPTCHA |
| `/api/submit-career` | POST | CORS + file type/size | **Public** with rate limit + optional honeypot; or API key for server-to-server |
| `/uploads/*` | GET | Public static | **Do not expose PII**; prefer S3 presigned URLs; block direct listing |

---

## 4. Guard layers (recommended model)

Apply guards in order:

```
Request
  → 1. CORS / method allowlist     (already in server.js)
  → 2. Rate limit                  (already on AI routes)
  → 3. Authenticate (JWT verify)   ← ADD
  → 4. Authorize (role / scope)    ← ADD where needed
  → 5. Route handler
```

### 4.1 Authenticate — verify JWT

Validate Auth0 access tokens using JWKS (same issuer/audience as the NestJS API).

**Env vars (mirror client Auth0 config):**

```env
AUTH0_DOMAIN=dev-jdesmpayywayutew.us.auth0.com
AUTH0_AUDIENCE=https://api.onitindia.com   # same as VITE_AUTH0_AUDIENCE
```

**Suggested dependency:** `jose` or `express-oauth2-jwt-bearer` (lightweight, no full Auth0 SDK required on server).

**Behavior:**

- Missing / invalid token → `401` with `{ message, code: "UNAUTHORIZED" }`
- Valid token → attach `req.auth = { sub, azp, roles, ... }` for downstream middleware

### 4.2 Authorize — role and route policy

After authentication, enforce role:

| Role claim source | Notes |
|-------------------|--------|
| Custom claim e.g. `https://onitindia.com/roles` | Match NestJS convention |
| Or `permissions` / `scope` | If Auth0 RBAC is enabled |

**Middleware examples:**

- `requireAuth` — any valid logged-in user
- `requireRole('PROVIDER')` — provider-only AI during post-task flow
- `requireRole('TASKER')` — performer-only if needed
- `requireAnyRole(['PROVIDER', 'TASKER'])` — shared AI endpoints

Align error shape with client catalog: `client/src/utils/authErrorCatalog.js` (`UNAUTHORIZED`, `FORBIDDEN`, etc.).

### 4.3 Optional — API key for truly public endpoints

For landing-page forms that must stay public (`submit-task`), use a separate guard:

- `X-OnIT-Site-Key` header from env (rotatable)
- Or Turnstile / reCAPTCHA verification middleware

Do **not** reuse user JWT for anonymous marketing forms unless you add a login step.

---

## 5. Implementation plan (local Express)

### Step 1 — Add middleware module

Create `server/middleware/authGuard.js`:

```js
// server/middleware/authGuard.js
import { createRemoteJWKSet, jwtVerify } from "jose";

const ISSUER = `https://${process.env.AUTH0_DOMAIN}/`;
const AUDIENCE = process.env.AUTH0_AUDIENCE;

let jwks;
function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${ISSUER}.well-known/jwks.json`));
  }
  return jwks;
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({ message: "Missing Bearer token", code: "UNAUTHORIZED" });
    }

    const { payload } = await jwtVerify(match[1], getJwks(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    req.auth = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", code: "UNAUTHORIZED" });
  }
}

export function requireRole(...allowedRoles) {
  const normalized = allowedRoles.map((r) => r.toUpperCase());
  return (req, res, next) => {
    const roles = extractRoles(req.auth);
    const ok = roles.some((r) => normalized.includes(r));
    if (!ok) {
      return res.status(403).json({ message: "Insufficient role", code: "FORBIDDEN" });
    }
    return next();
  };
}

function extractRoles(payload) {
  // Adjust to match NestJS / Auth0 action output
  const custom = payload["https://onitindia.com/roles"];
  if (Array.isArray(custom)) return custom.map((r) => String(r).toUpperCase());
  if (typeof custom === "string") return [custom.toUpperCase()];
  return [];
}
```

> **Important:** Confirm the exact role claim name with the NestJS backend team before shipping.

### Step 2 — Apply to routes in `server/server.js`

```js
import { requireAuth, requireRole } from "./middleware/authGuard.js";

const aiGuard = [requireAuth, requireRole("PROVIDER", "TASKER")];

app.post("/api/ai-task", aiTaskLimiter, ...aiGuard, async (req, res) => { /* ... */ });
app.post("/api/enhance-description", aiTaskLimiter, ...aiGuard, async (req, res) => { /* ... */ });
```

Keep `submit-task` / `submit-career` on a separate policy (public + rate limit, or API key).

### Step 3 — Client: no change required for AI calls

Provider and performer already attach `Authorization` via `aiApi` in `client/src/components/provider/services/api.js` (same pattern in performer `api.js`). Once the server validates JWT, the header becomes meaningful.

Ensure logged-out users cannot trigger AI calls from UI (disable buttons when `!isAuthenticated`).

### Step 4 — Admin Express routes (if any added later)

Use `admin_token` with the **admin Auth0 application** audience/client if admin hits local Express. Prefer keeping admin on NestJS only.

### Step 5 — Environment and deployment

Add to `server/.env.example`:

```env
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
# Optional for public form protection
ONIT_SITE_API_KEY=
```

Vercel: set the same vars on the `server/server.js` serverless function.

---

## 6. NestJS backend guards (external repo)

When implementing or auditing guards in the Lambda/NestJS codebase, use this checklist:

| Guard type | Purpose | Example routes |
|------------|---------|----------------|
| **JwtAuthGuard** | Reject missing/invalid tokens | `GET /users/me`, `POST /tasks` |
| **RolesGuard** | Enforce `PROVIDER` / `TASKER` / `ADMIN` | `POST /templates` → PROVIDER only |
| **OwnershipGuard** | Resource belongs to caller | `PUT /templates/:id`, `GET /tasks/:id` |
| **Public decorator** | Explicit allowlist | `GET /settings/public`, `GET /support/faq` |

Document every **public** endpoint. Default should be **authenticated**.

Reference client expectations:
- 401 → interceptor refresh / redirect (`apiInterceptors.js`)
- 403 → show permission error; do not clear session
- 409 identity conflict → `IDENTITY_CONFLICT` handling in interceptor

---

## 7. Client-side guards vs API guards

| Concern | Client (React) | Server (API guard) |
|---------|----------------|-------------------|
| Redirect to `/auth` | ✅ `GatedRoute`, 401 interceptor | N/A |
| Hide UI for wrong role | ✅ `GatedRoute` | N/A |
| Block direct HTTP abuse | ❌ | ✅ |
| Enforce ownership | ❌ (can be tampered) | ✅ |
| Token refresh | ✅ `AuthContext` + interceptors | Validate on every request |

**Do not** treat these as interchangeable. Keep both:

1. **UI guards** — good experience, fast feedback  
2. **API guards** — actual security

---

## 8. Route classification template

Use this table when adding new endpoints:

| Endpoint | Public? | Auth | Roles | Ownership | Rate limit |
|----------|---------|------|-------|-----------|------------|
| `GET /settings/public` | Yes | No | — | — | Optional |
| `GET /users/me` | No | JWT | Any | Self | No |
| `POST /tasks` | No | JWT | PROVIDER | — | Optional |
| `POST /api/ai-task` | No | JWT | PROVIDER, TASKER | — | Yes |
| `POST /api/submit-task` | Yes* | Site key? | — | — | Yes |

\*Public = unauthenticated users on marketing site; still protect with rate limit and bot mitigation.

---

## 9. Testing checklist

### Local Express

- [ ] `POST /api/ai-task` without `Authorization` → 401  
- [ ] Valid provider token → 200  
- [ ] Valid token, wrong role (if restricted) → 403  
- [ ] Expired token → 401  
- [ ] Rate limit still applies after auth  
- [ ] CORS rejects unknown origins (existing behavior)

### Client regression

- [ ] Provider post-task AI flow works when logged in  
- [ ] Performer flows that use AI still work  
- [ ] Logged-out user sees friendly error, not silent failure  
- [ ] 401 still triggers refresh + redirect via `attachApiInterceptors`

### NestJS (backend repo)

- [ ] All non-public routes return 401 without token  
- [ ] Cross-role access returns 403  
- [ ] Template/task ownership returns 403 for other user's IDs  

---

## 10. Rollout strategy

1. **Phase 1 — Observability:** Log when AI routes are called without `Authorization` (no blocking). Measure traffic.  
2. **Phase 2 — Soft guard:** Validate JWT if present; allow anonymous with stricter rate limit (short window).  
3. **Phase 3 — Hard guard:** Require JWT on `/api/ai-task` and `/api/enhance-description`.  
4. **Phase 4 — Public forms:** Add site key or CAPTCHA on `submit-task` / `submit-career`.  
5. **Phase 5 — Uploads:** Remove public `/uploads` for sensitive files; use S3 private bucket + presigned URLs.

---

## 11. Key file references

| Area | Path |
|------|------|
| Local Express entry | `server/server.js` |
| Provider API + `aiApi` | `client/src/components/provider/services/api.js` |
| Performer API | `client/src/components/Performer/services/api.js` |
| Shared interceptors | `client/src/utils/apiInterceptors.js` |
| Admin API | `admin-onit/src/services/api.js` |
| Token / role validation | `client/src/utils/authSession.js` |
| Auth0 config | `client/src/config/auth0.js` |
| UI route guard | `client/src/components/GatedRoute.jsx` |
| Admin UI guard | `admin-onit/src/components/common/PrivateRoute.jsx` |
| Proxy (prod) | `vercel.json` |
| API base URL | `client/src/config/apiBase.js` |
| Auth error codes | `client/src/utils/authErrorCatalog.js` |
| E2E feature map | `docs/E2E-DYNAMIC-FEATURES.md` |
| NestJS templates auth example | `docs/templates_api_doc.md` |

---

## 12. Summary

| Question | Answer |
|----------|--------|
| **Do we need API guards?** | Yes. UI guards alone cannot stop direct HTTP access. |
| **Where is the biggest gap?** | Local Express `/api/*` — especially AI and upload routes. |
| **Where are guards already assumed?** | NestJS Lambda (`/api-onitindia`) — implement/audit in backend repo. |
| **What to build first in this repo?** | JWT `requireAuth` + role middleware in `server/middleware/`, apply to AI routes. |
| **Does the client already send tokens?** | Yes, for provider/performer via `attachApiInterceptors`; server must start validating them. |

---

## Related docs

- [E2E Dynamic Features](./E2E-DYNAMIC-FEATURES.md) — which flows hit which APIs  
- [Templates API](./templates_api_doc.md) — NestJS Bearer + PROVIDER + ownership pattern  
- [Task API Integration](./TASK-API-INTEGRATION.md) — task endpoint mapping  
- [Client auth fixes](../client/FIXES.md) — token refresh and JWT audience notes  
