# FirstDoer — Phase 0: Existing Website Audit

> **Status:** Read-only inspection complete. No source code modified.  
> **Scope:** `apps/client` (Provider, Performer, Shared, Public/Landing), `apps/admin`, `apps/server`, and root/stray directories.

---

## 1. Monorepo & Architecture Discovery

| Layer | Location | Purpose / Stack | Notes |
|---|---|---|---|
| **Root** | `package.json`, `vercel.json` | Orchestrates `apps/client` build + Vercel rewrites | Rewrites `/api-onitindia/*` → AWS Lambda, `/auth0/*` → Auth0, `/api/*` → `apps/server/server.js` |
| **Client App** | `apps/client/` | React 18.2, Vite 7.1, React Router v7.9, Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion 12, Lucide React | Prerenders 86 public SEO routes via `scripts/prerender.cjs` (`puppeteer-core` + `@sparticuz/chromium`) |
| **Admin App** | `apps/admin/` | Standalone React + Vite admin portal (`AdminApp.jsx`, 33 pages) | Also a separate minimal `AdminApp.jsx` inside `apps/client/src/components/Admin/` (5 routes) |
| **Backend Server** | `apps/server/` | Express 5 (`server.js`), OpenAI service, Multer + Cloudinary, task validator | Handles `/api/*` routes; core marketplace APIs live on AWS Lambda (`/api-onitindia/*`) |
| **Stray / Orphaned** | `client/src/components/provider/pages/` | 5 legacy Provider support JSX files outside `apps/client/` | Not imported by `apps/client`; superseded by `ProviderTaskSupportPage.jsx` & `ProviderAgentSupportPage.jsx` |

### Key Architectural Findings (`apps/client`)
- **Authentication:** `apps/client/src/contexts/AuthContext.jsx` + `@auth0/auth0-react` (`AppAuth0Provider.jsx`) + MSG91 OTP (`msg91Loader.js`) + `localStorage` (`onit_user`, `onit_token`, `userRole`) + Test Mode mock DB (`src/test-mode/`).
- **API Integration:** `apps/client/src/config/apiBase.js` enforces same-origin `/api-onitindia` proxy. Provider (`provider/services/api.js`, 311 lines) and Performer (`Performer/services/api.js`, 260 lines) maintain separate Axios service modules.
- **State Management:** React `useState`/`useEffect`, `AuthContext`, `NotificationContext`, `ProviderDataContext` (sessionStorage cache `onit_provider_dashboard_cache_v2`, 20-min TTL), and `performerDataCache.js`. No Redux/Zustand/React Query.
- **Forms & Validation:** **Zero form/validation libraries** (`react-hook-form`, `zod`, `yup`, `formik` are absent). All forms use manual `useState` + inline checks + `window.alert()`/`window.confirm()`.

---

## 2. Critical & High-Severity Issues (Verified)

### A. Systemic Layout & Responsive Bugs
1. **Performer 20px Fixed-Sidebar Overlap (30+ files):**  
   - `PerformerHeader.jsx:224` renders `<aside>` at `w-[240px]` on `lg+`, while `PerformerPageLayout.jsx:105`, `PerformerSettingsPage.jsx:98`, `PerformerAccountHubPage.jsx:211`, `PerformerMyTasksPage.jsx:357`, `PerformerFindTasksPage.jsx:171`, `PerformerProfilePage.jsx:565`, `PerformerNotificationsPage.jsx:69`, `SharedChangePasswordPage.jsx:29`, `SharedTwoFactorAuthPage.jsx:60`, and `ChatsPage.jsx:2513` offset main content by only `lg:ml-[220px]` / `padding-left: 220px`.  
   - **Impact:** 20px of the left edge of Performer pages is clipped behind the fixed sidebar at `1024px`, `1280px`, `1440px`, `1600px`, and `1920px`.
2. **`BoostTaskPage.jsx` Header Overlap:**  
   - `BoostTaskPage.jsx:9` uses `flex flex-col h-screen` without `pt-[80px]` for fixed `ProviderHeader`, clipping the top of the page under the header.
3. **`ChatsPage.jsx` Tablet Split-Panel Squeeze (`768px–1023px`):**  
   - `ChatsPage.jsx:2553` forces `.chat-list-panel { width: 360px !important; }` at `min-width: 768px`, leaving only `408px` for the active thread on 768px tablets.

### B. Broken / UI-Only / Not Implemented Interactions (Verified)
1. **Provider `SettingsView.jsx:60` (`Sign Out`):** Calls `alert("Sign Out clicked!")` instead of `logout()` (**BROKEN**).
2. **Provider `SettingsView.jsx:68` (`Notification Settings`):** `onClick={() => {}}` no-op (**NOT IMPLEMENTED**).
3. **Provider `SettingsView.jsx:89-91` (Legal Links):** Privacy Policy & Terms route to `/provider/about`; Refund Policy routes to `/provider/pricing` instead of `/privacy-policy`, `/terms-and-conditions`, `/refund-policy` (**BROKEN**).
4. **Provider `TasksSettingsView.jsx`:** Local `useState` toggles only, no API persistence, and not wired into `SettingsPage.jsx` `VALID_TABS` (**UI ONLY / UNREACHABLE**).
5. **Shared `SharedChangePasswordPage.jsx:20-23`:** `handleSubmit` only runs `console.log("Password change submitted")` (**NOT IMPLEMENTED**).
6. **Performer `PerformerApp.jsx:190` (`forgotPasswordRoute`):** Passes `/performer/forgot-password`, which does not exist in `PerformerApp.jsx` (falls through to `*` → `/performer/dashboard`) (**BROKEN**).
7. **Shared `SharedTwoFactorAuthPage.jsx:46-52, 139`:** `handleSubmit` only runs `console.log("2FA Code submitted:", fullCode)`; `Resend code` only resets local countdown (**NOT IMPLEMENTED**).
8. **Provider `BoostTaskPage.jsx`:** 100% static hardcoded mock (`"Web Design"`, `"Anu Reddy"`, `"₹ 2,000"`, `"25/04/2025"`). "Edit Budget" (duplicated on Deadline card), "Proceed", and "Boost Task" buttons have no `onClick` handlers (**UI ONLY / NOT IMPLEMENTED**).
9. **Performer `PerformerDashboardPage.jsx:239` (Bookmark icon):** Bookmark button on task cards calls `onOpen` (navigates to task details) instead of saving/bookmarking (**PARTIALLY WORKING / MISLEADING**).
10. **Performer `PerformerHeader.jsx:81` (Profile Pill Avatar):** Renders an empty `<span className="h-6 w-6 rounded-full bg-[var(--color-primary)]" />` with no initials or image (**VISUAL BUG**).

### C. Hardcoded Mock Data & Legacy Branding Leaks
- `PerformerDashboardPage.jsx:46-74`: Falls back to `fallbackTasks` (`Growthify Ventures`, `TravelDesk India`, `Nimbus Co.`) when open tasks are empty.
- `PerformerGrowthPage.jsx:38-46`: Falls back to `{ score: 92, status: "High Trust", badge: "Gold Performer" }` on API error.
- `RatingsReceivedPage.jsx`: 100% hardcoded mock data (`Priya Sharma`, `Rahul Mehta`, etc.); orphaned from `ProviderApp.jsx`.
- Legacy `"Onit"` / `"onit buddy"` strings in `ChatsPage.jsx:2491` and `PerformerSettingsSidebar.jsx:83-84`.

---

## 3. Code Quality, Duplicates & Performance Issues

### Monolithic Files (>800 lines)
| File | Lines | Concern |
|---|---|---|
| `provider/pages/ChatsPage.jsx` | 2,664 | Shared by Provider & Performer; inline `<style>` tag; mixes UI, realtime, support tickets, and ratings |
| `provider/pages/AuthPage.jsx` | 1,706 | Auth0, email, phone OTP, role selection in one file |
| `provider/pages/PostTaskManualPage.jsx` | 1,362 | Complex multi-section form, file upload, AI checkpoint generation, `alert()` validation |
| `provider/pages/ProviderActiveTaskExecutionPage.jsx` | 1,331 | Execution, checklist, chat, modals in one component |
| `Performer/pages/PerformerProfilePage.jsx` | 1,296 | Profile, skills, portfolio, avatar upload |
| `provider/pages/MyTasksPage.jsx` | 1,156 | Tabs, filtering, caching, modals |
| `Performer/pages/PerformerActiveTaskExecutionPage.jsx` | 1,151 | Execution, checklist, file upload, `alert()` feedback |

### Duplicate / Overlapping Components & Pages
- **Performer Home/Task Discovery:** `PerformerDashboardPage.jsx` (`/performer/dashboard`) vs `PerformerNewHomePage.jsx` (`/performer/newHomePage`, also named `PerformerDashboardPage` internally); `PerformerFindTasksPage.jsx` (`/performer/find-tasks`) vs `PerformerAllTasksPage.jsx` (`/performer/all-tasks`) vs `PerformerSearchResultsPage.jsx` (`/performer/search-results`).
- **Orphaned / Dead Files:** `RatingsPage.jsx`, `RatingsReceivedPage.jsx`, `PerformerWalletTransactionDetailsPage.jsx`, `PerformerSettingsSidebar.jsx`, and the 5 files in root `client/src/components/provider/pages/`.

### Large Unoptimized Assets (`apps/client`)
- `public/hero-bg.png`: **20.97 MB**
- `src/assets/icons/t3.png` (**5.55 MB**), `t1.png` (**4.18 MB**), `t2.png` (**3.39 MB**), `t6.png` (**2.45 MB**), `t5.png` (**1.65 MB**), `t4.png` (**1.29 MB**)
- `public/explore/content-marketing.png` (**2.53 MB**), `build-develop.png` (**2.52 MB**), `design-creative.png` (**2.32 MB**)
