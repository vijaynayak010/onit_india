# OnitIndia Platform — Codebase Documentation
> Branch: `restructure/production-folders` · Node ≥ 20.19.0

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [App: `apps/client` — Provider & Public Frontend](#3-app-appsclient--provider--public-frontend)
   - 3.1 [Entry Points](#31-entry-points)
   - 3.2 [Directory Layout](#32-directory-layout)
   - 3.3 [Routing Architecture](#33-routing-architecture)
   - 3.4 [Sub-Application: Provider (Client)](#34-sub-application-provider-client)
   - 3.5 [Sub-Application: Performer (Tasker)](#35-sub-application-performer-tasker)
   - 3.6 [Global Contexts](#36-global-contexts)
   - 3.7 [Shared Components](#37-shared-components)
   - 3.8 [Layout Components](#38-layout-components)
   - 3.9 [UI & Animation Components](#39-ui--animation-components)
   - 3.10 [Landing Components](#310-landing-components)
   - 3.11 [Public Pages](#311-public-pages)
   - 3.12 [Services Layer (Client)](#312-services-layer-client)
   - 3.13 [Utilities](#313-utilities)
   - 3.14 [Config](#314-config)
   - 3.15 [Data Layer](#315-data-layer)
   - 3.16 [Hooks](#316-hooks)
4. [App: `apps/admin` — Admin Portal](#4-app-appsadmin--admin-portal)
   - 4.1 [Entry Points](#41-entry-points)
   - 4.2 [Directory Layout](#42-directory-layout)
   - 4.3 [Admin Pages](#43-admin-pages)
   - 4.4 [Admin Components](#44-admin-components)
   - 4.5 [Admin Services & Contexts](#45-admin-services--contexts)
5. [App: `apps/server` — Express Backend (BFF)](#5-app-appsserver--express-backend-bff)
   - 5.1 [Entry Point & Middleware Stack](#51-entry-point--middleware-stack)
   - 5.2 [API Endpoints](#52-api-endpoints)
   - 5.3 [Services](#53-services)
   - 5.4 [Validators](#54-validators)
   - 5.5 [File Upload Architecture](#55-file-upload-architecture)
6. [Authentication Architecture](#6-authentication-architecture)
7. [API & Network Architecture](#7-api--network-architecture)
8. [Dependency Overview](#8-dependency-overview)
9. [Environment Variables](#9-environment-variables)
10. [Scripts & Build](#10-scripts--build)

---

## 1. Project Overview

**OnitIndia** is a task marketplace platform connecting **Providers** (clients who post tasks) with **Performers** (taskers who complete them). The platform has three distinct user-facing surfaces:

| Surface | Description |
|---------|-------------|
| **Public / Provider Web App** | Marketing site + authenticated Provider dashboard (`apps/client`) |
| **Performer Web App** | Authenticated Performer (tasker) dashboard, embedded in `apps/client` via role-based routing |
| **Admin Portal** | Internal ops tool for moderation, finance, KYC, disputes etc. (`apps/admin`) |
| **BFF Server** | Lightweight Express server acting as Backend-for-Frontend — proxies AI, careers, and Google Sheets calls (`apps/server`) |

The codebase lives in a **monorepo** under `onitindia1/`, with three independently deployable apps under `apps/`.

---

## 2. Monorepo Structure

```
onitindia1/                        ← Monorepo root
├── apps/
│   ├── client/                    ← Provider + Performer SPA (Vite + React 18)
│   ├── admin/                     ← Admin Portal SPA (Vite + React 18)
│   └── server/                    ← Express BFF server (Node ESM)
├── client/                        ← (Legacy/transitional dir — node_modules only)
├── docs/                          ← Project-level documentation
├── scripts/                       ← Root-level utility scripts
├── package.json                   ← Root workspace manifest
├── vercel.json                    ← Vercel deployment config (rewrites/routes)
├── .nvmrc                         ← Node version pin (≥ 20)
└── .gitignore
```

> [!NOTE]
> The `client/` at root is a transitional artifact from the pre-restructure layout. All active source code lives under `apps/`.

---

## 3. App: `apps/client` — Provider & Public Frontend

### 3.1 Entry Points

| File | Role |
|------|------|
| [`index.html`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/index.html) | HTML shell — Vite injects bundle here |
| [`src/main.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/main.jsx) | React root — wraps app in Auth0 + AuthProvider + NotificationProvider |
| [`src/App.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/App.jsx) | Top-level Router with all public + authenticated routes |
| [`vite.config.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/vite.config.js) | Vite config — dev proxy `/api-onitindia` → Lambda, TailwindCSS plugin |

### 3.2 Directory Layout

```
apps/client/src/
├── App.jsx                        ← Master router (403 routes)
├── main.jsx                       ← React root with providers
├── index.css                      ← Global CSS / Tailwind base
├── config.js                      ← Thin re-export of config helpers
├── components/
│   ├── auth/                      ← Auth role redirect logic
│   ├── Blog/                      ← Blog CRUD admin components (legacy)
│   ├── Community/                 ← Community section components
│   ├── Help/                      ← Help center components
│   ├── Services/                  ← Service landing pages (SEO)
│   ├── common/                    ← Captcha, account shared UI
│   ├── home/                      ← Home page sections
│   ├── landing/                   ← Landing page components (hero, FAQs, etc.)
│   ├── layout/                    ← Navbar, Footer, BackToTop
│   ├── Performer/                 ← Performer sub-app (self-contained)
│   ├── provider/                  ← Provider sub-app (self-contained)
│   ├── seo/                       ← SEO meta component
│   ├── shared/                    ← Components shared by Provider & Performer
│   └── ui/                        ← Animation/visual primitives
├── contexts/
│   ├── AuthContext.jsx            ← Global auth state (token, user, role)
│   └── NotificationContext.jsx    ← WebSocket notification state
├── config/
│   ├── apiBase.js                 ← Proxy URL resolution (never exposes Lambda)
│   ├── auth0.js                   ← Auth0 SDK config & helpers
│   └── authFeatures.js            ← Feature flags for auth flows
├── data/
│   ├── blogs.js                   ← Static blog post data
│   ├── domainSubDomains.js        ← Domain/subdomain taxonomy
│   ├── taskCategories.js          ← Task category definitions
│   ├── taskTemplates.js           ← Pre-built task templates
│   └── useCases.js                ← Use-case page content
├── hooks/
│   └── useAutoReload.js           ← Auto-reload hook for version freshness
├── pages/
│   ├── NotFoundPage.jsx           ← 404 page
│   ├── access/                    ← Access-control pages
│   ├── campus/                    ← Campus program pages
│   ├── careers/                   ← Careers + Thank You pages
│   ├── contact/                   ← Contact + Thank You pages
│   ├── domains/                   ← Domain landing pages
│   ├── legal/                     ← All policy pages (Privacy, ToS, Refund…)
│   ├── performers/                ← Performer discovery pages (public)
│   ├── pricing/                   ← Public pricing page
│   ├── tasks/                     ← Task browse/category pages (public)
│   └── use-cases/                 ← Use-case index + detail pages
├── services/
│   ├── adminService.js            ← Admin API calls from client
│   ├── auth0Token.js              ← Auth0 silent token getter
│   ├── emailAuth.js               ← OTP/email auth API calls
│   └── homeContent.js             ← Dynamic home content API
└── utils/
    ├── aiHelpers.js               ← AI prompt formatting helpers
    ├── apiFetch.js                ← Authenticated fetch() wrapper
    ├── apiInterceptors.js         ← Axios interceptors (token refresh)
    ├── authErrorCatalog.js        ← Mapping of auth error codes → messages
    ├── authErrors.js              ← Auth error handling utilities
    ├── authSession.js             ← Session persistence helpers
    ├── checklistSubmission.js     ← Task checklist submission logic
    ├── fileUpload.js              ← File upload helpers (compression)
    ├── msg91Loader.js             ← MSG91 OTP SDK lazy loader
    ├── phoneIdentifier.js         ← Country-code phone helper
    ├── recaptchaV3.js             ← Google reCAPTCHA v3 helper
    └── shareDocument.js           ← Document sharing utilities
```

---

### 3.3 Routing Architecture

`App.jsx` is the monolithic router. It renders:

1. **Public shell** — `Navbar` + `Footer` wrapper around all public routes
2. **Provider sub-app** — mounted at `/provider/*` via `<ProviderApp />`
3. **Performer sub-app** — mounted at `/performer/*` via `<PerformerApp />`
4. **Role redirect** — `<AuthRoleRedirect />` at `/` and `/auth/*` routes, which reads `user.role` from `AuthContext` and navigates accordingly

```
/                          → Landing page
/provider/*                → ProviderApp (authenticated)
/performer/*               → PerformerApp (authenticated)
/blog, /blog/:slug         → Blog pages
/domains/:domain           → Domain landing
/careers                   → Careers page
/contact                   → Contact page
/legal/*, /privacy-policy  → Legal pages
/use-cases/*               → Use case content pages
/campus/*                  → Campus program
/404                        → NotFoundPage
```

---

### 3.4 Sub-Application: Provider (Client)

**Location:** [`apps/client/src/components/provider/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/)

The Provider sub-app is a fully self-contained routing module mounted inside the top-level `<Router>`. It has its own pages, components, layouts, services, contexts, and utilities.

#### Entry Point
[`ProviderApp.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/ProviderApp.jsx) — wraps all provider routes in `<ProviderDataProvider>` and enforces:
- `<RequirePhoneVerification>` — blocks access if phone not verified
- `<RequireProviderOnboarding>` — redirects to onboarding if profile incomplete

#### Provider Pages (43 pages)

| Page | Route | Purpose |
|------|-------|---------|
| `AuthPage` | `/provider/auth` | Login / sign-up (Auth0 + OTP) |
| `DashboardPage` | `/provider/dashboard` | Main provider dashboard with task stats |
| `PostTaskSelectionPage` | `/provider/post-task` | Choose AI vs Manual task posting |
| `PostTaskManualPage` | `/provider/post-task/manual` | Full manual task creation form |
| `PostTaskAIPage` | `/provider/post-task/ai` | AI-assisted task creation |
| `PostTaskDetailsPage` | `/provider/post-task/details` | Task details refinement |
| `PostTaskSearchResultsPage` | `/provider/post-task/results` | Performer matching results |
| `SearchPage` | `/provider/search` | Browse/search performers |
| `TaskPerformersPage` | `/provider/task/:id/performers` | Performers for a task |
| `TaskApplicantsPage` | `/provider/task/:id/applicants` | Task application review |
| `TaskPerformerProfilePage` | `/provider/performer/:id` | View performer profile |
| `ConfirmAndPayPage` | `/provider/task/:id/pay` | Payment confirmation |
| `PaymentSelectionPage` | `/provider/payment/select` | Choose payment method |
| `PaymentSuccessPage` | `/provider/payment/success` | Payment confirmation screen |
| `ProviderActiveTaskExecutionPage` | `/provider/task/:id/active` | Live task monitoring |
| `MyTasksPage` | `/provider/tasks` | All posted tasks |
| `DraftTasksPage` | `/provider/tasks/drafts` | Saved draft tasks |
| `TaskHistoryPage` | `/provider/tasks/history` | Completed tasks |
| `TaskManagementPage` | `/provider/task/:id/manage` | Task management hub |
| `TaskStatusPage` | `/provider/task/:id/status` | Task progress status |
| `TaskActivityPage` | `/provider/task/:id/activity` | Activity timeline |
| `TaskTemplatesPage` | `/provider/templates` | Reusable task templates |
| `BoostTaskPage` | `/provider/task/:id/boost` | Task promotion |
| `ChatsPage` | `/provider/chats` | All conversations |
| `ExploreTalentPage` | `/provider/explore` | Talent discovery |
| `SavedPerformersPage` | `/provider/saved` | Bookmarked performers |
| `SettingsPage` | `/provider/settings` | Account settings hub |
| `ProviderOnboardingPage` | `/provider/onboarding` | New provider profile setup |
| `SwitchToPerformerPage` | `/provider/switch` | Role switch flow |
| `DeleteAccountPage` | `/provider/settings/delete` | Account deletion |
| `RatingsPage / RatingsReceivedPage` | `/provider/ratings` | Review management |
| `SharedChangePasswordPage` | `/provider/change-password` | Password update |
| `SharedTwoFactorAuthPage` | `/provider/2fa` | Two-factor auth setup |

#### Provider Components

| Component | Purpose |
|-----------|---------|
| [`ProviderHeader.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/ProviderHeader.jsx) | Authenticated top navbar for providers |
| [`ProviderSettingsSidebar.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/ProviderSettingsSidebar.jsx) | Settings navigation sidebar |
| [`ProviderAccountPageLayout.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/ProviderAccountPageLayout.jsx) | Two-column account page layout |
| [`AIChatTaskFlow.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/AIChatTaskFlow.jsx) | Conversational AI task creation interface (38 KB) |
| [`AITaskInput.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/AITaskInput.jsx) | AI prompt input field with validation |
| [`TaskMatchingFlow.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/TaskMatchingFlow.jsx) | Multi-step task-performer matching wizard |
| [`EnhancedTaskMatchingFlow.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/EnhancedTaskMatchingFlow.jsx) | Advanced matching flow with filters |
| [`BrowseCategoryGrid.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/BrowseCategoryGrid.jsx) | Category browse grid |
| [`TaskPreview.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/TaskPreview.jsx) | Structured task preview card |
| [`ClarityScore.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/ClarityScore.jsx) | AI-generated task clarity indicator |
| [`RequireProviderOnboarding.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/components/RequireProviderOnboarding.jsx) | Guards routes requiring completed onboarding |
| `Button.jsx`, `Input.jsx`, `Toggle.jsx`, `SocialButton.jsx` | Local primitive UI components |

#### Provider Context

[`ProviderDataContext.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/contexts/ProviderDataContext.jsx) — Provides provider-specific global data:
- Task stats (active, draft, applicants)
- Subscription/plan info
- Loaded on mount, cached in context

#### Provider Services

[`provider/services/api.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/provider/services/api.js) — All provider API calls:
- `getMe()` — fetch authenticated user profile
- `getUserProfile()`, `getProviderProfile()`, `createProviderProfile()`
- `onboardUser()` — complete onboarding
- `setApiTokenRefresher()` — inject token refresh callback from AuthContext
- Task CRUD, performer search, payment APIs

---

### 3.5 Sub-Application: Performer (Tasker)

**Location:** [`apps/client/src/components/Performer/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/)

> [!NOTE]
> The `Performer` directory is capitalized intentionally — it's an artifact from the original codebase structure. Convention is kept for consistency.

#### Entry Point

[`PerformerApp.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/PerformerApp.jsx) — mounts all performer routes. On entry:
1. Calls `verifyAndSyncRole()` — fetches backend profile to confirm role
2. If no tasker profile exists, calls `createTaskerProfile()` to auto-provision
3. Wraps protected routes in `<RequirePerformerOnboarding>` + `<RequirePhoneVerification>`

#### Performer Pages (32 pages)

| Page | Purpose |
|------|---------|
| `PerformerDashboardPage` | Main dashboard — earnings, stats, active tasks |
| `PerformerFindTasksPage` | Search/browse available tasks |
| `PerformerAllTasksPage` | Full task listing with filters |
| `PerformerTaskDetailsPage` | Single task details + apply |
| `PerformerActiveTasksPage` | Currently accepted/in-progress tasks |
| `PerformerActiveTaskExecutionPage` | Live task execution workspace (60 KB) |
| `PerformerMyTasksPage` | Personal task history |
| `PerformerCompletedTasksPage` | Completed task archive |
| `PerformerSavedTasksPage` | Bookmarked tasks |
| `PerformerApplicationsPage` | Submitted applications tracker |
| `PerformerProfilePage` | Public performer profile editor |
| `PerformerBankDetailsPage` | Bank account management (KYC adjacent, 37 KB) |
| `PerformerKycPage` | KYC document upload and status |
| `PerformerWalletPage` | Earnings wallet overview |
| `PerformerWalletTransactionsPage` | Wallet transaction history |
| `PerformerWalletTransactionDetailsPage` | Single transaction details |
| `PerformerWalletWithdrawPage` | Withdrawal flow |
| `PerformerWithdrawPage` | Alternative withdrawal page |
| `PerformerEarningsPage` | Earnings breakdown & analytics |
| `PerformerEarningsTransactionDetailsPage` | Earning transaction detail |
| `PerformerTransactionsPage` | All transactions |
| `PerformerRatingsPage` | Ratings received |
| `PerformerReferPage` | Referral program |
| `PerformerLeaderboardPage` | Platform-wide leaderboard |
| `PerformerVouchersPage` | Voucher/coupon management |
| `PerformerSettingsPage` | Account settings |
| `PerformerAccountHubPage` | Unified account hub |
| `PerformerOnboardingPage` | Initial performer profile setup |
| `PerformerClientProfilePage` | View a client's profile from performer side |
| `PerformerTaskAcceptedPage` | Task acceptance confirmation |
| `PerformerSearchLoadingPage` | Task search loading state |
| `PerformerSearchResultsPage` | Task search results |

#### Performer Components

| Component | Purpose |
|-----------|---------|
| [`PerformerHeader.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/components/PerformerHeader.jsx) | Authenticated top nav for performers |
| [`PerformerSettingsSidebar.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/components/PerformerSettingsSidebar.jsx) | Settings sidebar navigation |
| [`PerformerWalletLayout.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/components/PerformerWalletLayout.jsx) | Shared layout for wallet pages |
| [`PerformerDashboardHomeSections.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/components/PerformerDashboardHomeSections.jsx) | Dashboard section components |
| [`RequirePerformerOnboarding.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/components/RequirePerformerOnboarding.jsx) | Route guard for onboarding completion |
| `onboarding/` | Step-by-step performer onboarding flow |
| `tasks/` | Task-specific sub-components |
| `wallet/` | Wallet-specific sub-components |

#### Performer Services

[`Performer/services/api.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/services/api.js) — Performer-specific API calls:
- `getMyTaskerProfile()`, `createTaskerProfile()`
- Task search, apply, accept, submit
- Earnings, wallet, KYC, bank details APIs
- `setApiTokenRefresher()` — mirrors provider pattern

#### Performer Utils

| File | Purpose |
|------|---------|
| [`performerClientUtils.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/utils/performerClientUtils.js) | Client-side helpers (formatting, mapping) |
| [`performerOnboardingStorage.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/Performer/utils/performerOnboardingStorage.js) | LocalStorage helpers for onboarding state |

---

### 3.6 Global Contexts

**Location:** [`apps/client/src/contexts/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/contexts/)

#### [`AuthContext.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/contexts/AuthContext.jsx)

The central authentication state manager for the entire app.

**State:**
- `user` — full user object (persisted to `localStorage: onit_user`)
- `token` — JWT access token (persisted to `localStorage: onit_token`)
- `loading` — `false` if a stored session exists (instant load), `true` otherwise

**Exposed API:**

| Function | Description |
|----------|-------------|
| `login(userData, token)` | Store user + token after successful auth |
| `logout()` | Clear state + localStorage, call Auth0 logout |
| `updateUser(data)` | Deep-merge updated profile data into state |
| `refreshProfile()` | Re-fetch full profile from backend via `getMe()` |
| `refreshToken()` | Silent Auth0 token refresh; falls back to `refresh_token` grant for OTP users |
| `hasPermission(role)` | Check if current user has at least the given role |
| `switchActiveRole(role)` | Change the active role (Provider ↔ Performer) |
| `isAuthenticated` | `true` if token exists |

> [!IMPORTANT]
> **Dual auth fallback:** `refreshToken()` first tries `getAccessTokenSilently()` (Auth0 SDK). If that fails (e.g. OTP/phone users not in Auth0 session), it falls back to a raw `refresh_token` grant using the stored refresh token.

**Token injection:** After mount, `AuthContext` injects its `refreshToken` into both `provider/services/api.js` and `Performer/services/api.js` via `setApiTokenRefresher()`.

#### [`NotificationContext.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/contexts/NotificationContext.jsx)

Manages real-time notifications via WebSocket (Socket.IO). Provides:
- `notifications` array
- `unreadCount`
- `markAsRead()`, `markAllAsRead()`

---

### 3.7 Shared Components

**Location:** [`apps/client/src/components/shared/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/)

Components used by **both** Provider and Performer sub-apps:

| Component | Purpose |
|-----------|---------|
| [`ActiveTaskChat.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/ActiveTaskChat.jsx) | Real-time in-task chat widget (Socket.IO) |
| [`NotificationBell.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/NotificationBell.jsx) | Notification bell with dropdown |
| [`ReviewModal.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/ReviewModal.jsx) | Star rating + review submission modal |
| [`RequestChangesModal.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/RequestChangesModal.jsx) | Work revision request modal |
| [`ShareFileMenu.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/ShareFileMenu.jsx) | File sharing context menu |
| [`SubmissionChecklistItemCard.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/SubmissionChecklistItemCard.jsx) | Checklist item card for task submissions |
| [`TaskDocumentRow.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/TaskDocumentRow.jsx) | Document row in task detail views |
| [`Toast.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/Toast.jsx) | In-app toast notification |
| [`AppAuth0Provider.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/AppAuth0Provider.jsx) | Auth0 SDK provider wrapper |
| [`AuthErrorPanel.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/AuthErrorPanel.jsx) | Auth error display panel |
| [`SharedChangePasswordPage.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/SharedChangePasswordPage.jsx) | Change password flow (shared route) |
| [`SharedTwoFactorAuthPage.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/SharedTwoFactorAuthPage.jsx) | 2FA setup/verification (shared route) |
| [`RestoreAccountPage.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/shared/RestoreAccountPage.jsx) | Account restoration after deletion |

---

### 3.8 Layout Components

**Location:** [`apps/client/src/components/layout/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/layout/)

| Component | Purpose |
|-----------|---------|
| [`Navbar.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/layout/Navbar.jsx) | Public site top navigation (responsive, 14 KB) |
| [`Footer.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/layout/Footer.jsx) | Site footer with links and contact info |
| [`DomainsNavBar.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/layout/DomainsNavBar.jsx) | Secondary domain-specific navigation bar |
| [`BackToTopButton.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/layout/BackToTopButton.jsx) | Floating scroll-to-top button |

---

### 3.9 UI & Animation Components

**Location:** [`apps/client/src/components/ui/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/)

| Component | Purpose |
|-----------|---------|
| [`AnimatedSection.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/AnimatedSection.jsx) | Scroll-triggered reveal animation wrapper |
| [`AnimatedNumber.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/AnimatedNumber.jsx) | Count-up number animation |
| [`Marquee.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/Marquee.jsx) | Infinite scrolling marquee |
| [`ScrollingInfo.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/ScrollingInfo.jsx) | Horizontally scrolling info ticker |
| [`ScrollRevealSection.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/ScrollRevealSection.jsx) | Locomotive Scroll reveal section (10 KB) |
| [`SplashCursor.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/SplashCursor.jsx) | Custom interactive cursor effect |
| [`ChromaGrid.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/ChromaGrid.jsx) | WebGL-powered colorful grid background |
| [`LightRays.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/LightRays.jsx) | Animated light-ray background effect |
| [`Eyes.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/Eyes.jsx) | Interactive animated eyes |
| [`InfiniteMenu.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/ui/InfiniteMenu.jsx) | 3D infinite rotating menu (30 KB, WebGL/GSAP) |

---

### 3.10 Landing Components

**Location:** [`apps/client/src/components/landing/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/landing/)

| Component | Purpose |
|-----------|---------|
| [`Landingpage.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/landing/Landingpage.jsx) | Hero section + above-fold content (43 KB) |
| [`HowItWorks.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/landing/HowItWorks.jsx) | Step-by-step platform explainer (33 KB) |
| [`WhyChooseUs.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/landing/WhyChooseUs.jsx) | Value proposition section |
| [`FAQs.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/landing/FAQs.jsx) | Accordion FAQ section |
| [`Partner.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/landing/Partner.jsx) | Partner logos / trust signals |
| [`CategoryCrossLinks.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/components/landing/CategoryCrossLinks.jsx) | Internal SEO cross-linking |

---

### 3.11 Public Pages

**Location:** [`apps/client/src/pages/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/pages/)

| Directory | Pages |
|-----------|-------|
| `legal/` | PrivacyPolicy, TermsAndConditions, RefundPolicy, PolicyPage, SiteDataPolicy, DisputeResolutionPolicy, PaymentPayoutPolicy, ProhibitedTasksPolicy, TaskCompletionProofPolicy |
| `domains/` | Domains, DomainDetail, DomainSubDomainPage |
| `tasks/` | TaskCategories, TaskCategoryDetailPage, TaskPerformers, TaskGuidelinesPage |
| `performers/` | TaskSeeker, FindTaskerNearby, PerformerDirectory, PerformerVerificationOnboarding |
| `careers/` | Careers, CareersThankYouPage |
| `contact/` | ContactPage, ContactThankYouPage |
| `campus/` | Campus, CampusDetail |
| `pricing/` | PricingPagePublic |
| `use-cases/` | UseCasesIndexPage, UseCasePage |
| `access/` | Access-control/gating pages |

---

### 3.12 Services Layer (Client)

**Location:** [`apps/client/src/services/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/services/)

| File | Purpose |
|------|---------|
| [`adminService.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/services/adminService.js) | Admin API calls from the client app |
| [`auth0Token.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/services/auth0Token.js) | Gets Auth0 access token silently |
| [`emailAuth.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/services/emailAuth.js) | OTP/email authentication API calls |
| [`homeContent.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/services/homeContent.js) | Fetches dynamic home page content from backend |

---

### 3.13 Utilities

**Location:** [`apps/client/src/utils/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/)

| File | Purpose |
|------|---------|
| [`apiFetch.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/apiFetch.js) | Thin `fetch()` wrapper. Auto-attaches `Authorization: Bearer <token>` from `localStorage`. Routes all calls through `getApiUrl()` (never raw Lambda URL). |
| [`apiInterceptors.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/apiInterceptors.js) | Axios interceptors — on 401, calls token refresher then retries |
| [`authErrorCatalog.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/authErrorCatalog.js) | Large mapping of auth error codes to user-friendly messages (17 KB) |
| [`authSession.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/authSession.js) | Read/write session data in localStorage |
| [`msg91Loader.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/msg91Loader.js) | Lazy-loads MSG91 OTP SDK script on demand (10 KB) |
| [`recaptchaV3.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/recaptchaV3.js) | Google reCAPTCHA v3 helper — execute + get token |
| [`fileUpload.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/fileUpload.js) | Client-side image compression before upload |
| [`checklistSubmission.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/checklistSubmission.js) | Validates and submits task completion checklists |
| [`shareDocument.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/shareDocument.js) | Web Share API + clipboard fallback for task docs |
| [`aiHelpers.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/aiHelpers.js) | Formats AI task prompts for the backend |
| [`phoneIdentifier.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/utils/phoneIdentifier.js) | Strips country code for phone display |

---

### 3.14 Config

**Location:** [`apps/client/src/config/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/config/)

| File | Purpose |
|------|---------|
| [`apiBase.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/config/apiBase.js) | Resolves the correct API base URL per environment. **Lambda URLs are blocked from appearing in the browser bundle.** Dev → `/api-onitindia` proxy. Prod → `api.onitindia.com` or relative proxy path. |
| [`auth0.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/config/auth0.js) | Auth0 client ID, domain, audience, scope configuration. Supports dynamic client IDs for multi-tenancy. |
| [`authFeatures.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/config/authFeatures.js) | Feature flags: which auth flows are enabled (OTP, social, email) |

---

### 3.15 Data Layer

**Location:** [`apps/client/src/data/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/data/)

Static data modules (no API calls — bundled at build time):

| File | Contents |
|------|---------|
| [`blogs.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/data/blogs.js) | All blog post data (50 KB — large static dataset) |
| [`domainSubDomains.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/data/domainSubDomains.js) | Domain/subdomain taxonomy for routing & SEO (33 KB) |
| [`taskCategories.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/data/taskCategories.js) | Task category definitions with icons |
| [`taskTemplates.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/data/taskTemplates.js) | Pre-built task templates for quick posting |
| [`useCases.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/data/useCases.js) | Use case page content + slug registry |

---

### 3.16 Hooks

**Location:** [`apps/client/src/hooks/`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/hooks/)

| Hook | Purpose |
|------|---------|
| [`useAutoReload.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/client/src/hooks/useAutoReload.js) | Detects stale app version and triggers a soft reload |

---

## 4. App: `apps/admin` — Admin Portal

### 4.1 Entry Points

| File | Role |
|------|------|
| [`index.html`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/admin/index.html) | HTML shell |
| [`src/main.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/admin/src/main.jsx) | React root — wraps in Auth0Provider + Router |
| [`src/App.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/admin/src/App.jsx) | Thin shell that mounts `AdminApp` |
| [`src/AdminApp.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/admin/src/AdminApp.jsx) | Master admin router with Auth0 session guard |

### 4.2 Directory Layout

```
apps/admin/src/
├── AdminApp.jsx               ← Master admin router
├── App.jsx                    ← Root shell
├── main.jsx                   ← React root
├── index.css                  ← Admin-specific styles
├── components/
│   ├── common/                ← PrivateRoute, shared admin UI
│   ├── layout/                ← Admin sidebar/top nav
│   └── modules/
│       ├── dashboard/         ← Dashboard-specific components
│       └── tasks/             ← Task management components
├── contexts/
│   └── AdminDataContext.jsx   ← Global admin data (stats, user lists)
├── hooks/
│   └── useAuth.js             ← Admin auth hook (Auth0 wrapper)
├── layouts/
│   └── MainLayout.jsx         ← Sidebar + content shell layout
├── pages/                     ← All admin pages (23 pages)
└── services/
    ├── adminService.js        ← Admin-specific API utilities
    └── api.js                 ← Full admin API client (13 KB)
```

### 4.3 Admin Pages

| Page | Purpose |
|------|---------|
| `Login.jsx` | Auth0 login page for admin |
| `Dashboard.jsx` | Platform metrics overview |
| `Users.jsx` | User management (38 KB) |
| `Tasks.jsx` | Task management + filters (36 KB) |
| `TaskApprovals.jsx` | Task moderation queue |
| `AdminTaskDetail.jsx` | Single task deep-dive |
| `Finance.jsx` | Payment, payouts, revenue (42 KB) |
| `KYC.jsx` | Performer KYC verification queue (29 KB) |
| `WorkVerification.jsx` | Submitted work verification |
| `Disputes.jsx` | Dispute resolution center (30 KB) |
| `Moderation.jsx` | Content moderation |
| `Notifications.jsx` | Broadcast notifications manager (53 KB) |
| `Reports.jsx` | Platform analytics & reports |
| `Settings.jsx` | Platform-wide settings (23 KB) |
| `HomeDynamic.jsx` | Dynamic home content editor (21 KB) |
| `HomeContent.jsx` | Home page content management |
| `ContentPages.jsx` | CMS for static pages |
| `Careers.jsx` | Job listings + applications (24 KB) |
| `JobResponses.jsx` | Career application responses (22 KB) |
| `DeletionPage.jsx` | Account deletion requests (18 KB) |
| `ReferralManagement.jsx` | Referral program management (34 KB) |
| `CouponManagement.jsx` | Coupon/discount code management (54 KB) |
| `support/Tickets.jsx` | Support ticket management |
| `support/LiveChat.jsx` | Live support chat interface |

### 4.4 Admin Components

| Component | Purpose |
|-----------|---------|
| `PrivateRoute` | Route guard — redirects to `/login` if not Auth0-authenticated |
| `MainLayout` | Sidebar + top bar shell wrapping all admin pages |
| `modules/dashboard/` | Dashboard chart/stat components |
| `modules/tasks/` | Task list, filters, action components |

### 4.5 Admin Services & Contexts

| File | Purpose |
|------|---------|
| [`services/api.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/admin/src/services/api.js) | All backend API calls for admin operations (13 KB) — users, tasks, KYC, finance, disputes, notifications, settings |
| [`services/adminService.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/admin/src/services/adminService.js) | Admin-specific utility wrappers |
| [`contexts/AdminDataContext.jsx`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/admin/src/contexts/AdminDataContext.jsx) | Global admin state — loaded stats, session info |
| [`hooks/useAuth.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/admin/src/hooks/useAuth.js) | `AuthProvider` + `useAuth` wrapping Auth0 for admin |

---

## 5. App: `apps/server` — Express Backend (BFF)

> [!NOTE]
> This is a **Backend-for-Frontend** server. It is NOT the primary business logic backend (that is a separate Lambda-based service). This server handles: AI task generation, career applications, and Google Sheets submission — things that the main Lambda backend doesn't expose or that need special handling.

### 5.1 Entry Point & Middleware Stack

**File:** [`server.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/server/server.js) (514 lines)

**Middleware chain (in order):**

```
helmet()                   → Security headers (CSP, HSTS, etc.)
cookieParser()             → Parse cookies
Permissions-Policy header  → Disable geolocation, mic, camera
Method filter middleware   → Block TRACE, CONNECT, etc.
cors()                     → Whitelist-based CORS (dynamic, env-driven)
express.json(10mb)         → JSON body parsing
express.urlencoded(10mb)   → Form body parsing
/uploads (static)          → Serve local uploaded files (dev)
```

**CORS Origins (production):**
- `https://onitindia.com`, `https://www.onitindia.com`
- `https://onitindia-preview.vercel.app`
- `https://onitindia1-xi.vercel.app`
- `https://admin.onitindia.com`
- Additional origins from `CORS_ORIGINS` env var (comma-separated)

### 5.2 API Endpoints

| Method | Path | Rate Limit | Description |
|--------|------|-----------|-------------|
| `POST` | `/api/ai-task` | 10 req/min | Generate structured task from natural language prompt using OpenAI |
| `POST` | `/api/enhance-description` | 10 req/min | Enhance a project description using AI |
| `POST` | `/api/submit-task` | none | Submit task to Google Sheet (pre-auth landing flow) |
| `POST` | `/api/submit-career` | none | Submit career application — uploads resume to S3, persists to Lambda DB, writes to Google Sheet |

**AI Task Response Schema:**
```json
{
  "success": true,
  "data": {
    "title": "string (10-100 chars)",
    "description": "string (50-1000 chars)",
    "skills": ["string", "..."],
    "budget_range": "₹min-₹max",
    "estimated_time": "human-readable",
    "task_category": "Development|Design|Marketing|Research|Content|Admin|Local Assistance|Academic Support",
    "clarification_questions": ["string?", "..."]
  }
}
```

### 5.3 Services

**[`services/openaiService.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/server/services/openaiService.js)**

Class: `OpenAIService`

| Method | Description |
|--------|-------------|
| `buildSystemPrompt()` | Constructs the system prompt for task generation — enforces JSON output, Indian Rupee pricing, and category constraints |
| `parseAndCorrectJSON(text)` | Extracts JSON from response — handles raw JSON, markdown code blocks, embedded objects |
| `validateResponse(data)` | Ensures all 7 required fields are present |
| `generateTask(prompt)` | Main method — validates prompt → calls GPT → parses → validates → returns structured task |
| `enhanceDescription(description, productType)` | Uses GPT to improve a project description to 150-300 words |

**Model:** `process.env.OPENAI_MODEL` (default: `gpt-3.5-turbo`)  
**Response format:** `json_object` mode enforced for `generateTask`

### 5.4 Validators

**[`validators/taskValidator.js`](file:///a:/Aditya24035/Internship/InternProject/Onit-India/onitindia1/apps/server/validators/taskValidator.js)**

`TaskValidator` — server-side validation for AI-generated tasks:
- `validate(task)` → `{ isValid, errors, sanitizedData }`
- `sanitizePrompt(prompt)` → Trims, strips dangerous chars, enforces length ≤ 2000

### 5.5 File Upload Architecture

**Career resume uploads** support three storage modes, resolved at startup:

```
Environment         Storage Mode
─────────────────────────────────
Has S3 config?  →  Memory storage → upload to S3 (PutObjectCommand)
No S3 + Vercel? →  Memory storage (Vercel serverless — no disk)
Dev (no S3)?    →  Disk storage → /uploads/candidate-resumes/careers/
```

**Allowed file types:** PDF, DOC, DOCX, PNG, JPG, JPEG  
**Max file size:** 10 MB

**Career submission flow:**
1. Validate required fields (`name`, `email`, `phone`, file)
2. Upload resume to S3 (or local disk in dev)
3. `POST /careers/applications` to main Lambda backend (persists to DB)
4. `POST` to Google Apps Script (writes to Google Sheet — secondary, non-blocking)
5. Return success with `portfolioFileUrl`

---

## 6. Authentication Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Auth Flows                           │
│                                                          │
│  1. Email/Password  ──→  Auth0  ──→  JWT access token  │
│  2. Social (Google)  ──→  Auth0  ──→  JWT access token  │
│  3. OTP/Phone  ──→  MSG91  ──→  Custom JWT              │
└──────────────────────────────────────────────────────────┘
         │                    │
         └──── AuthContext ───┘
              (stores token in localStorage: onit_token)
              (stores user in localStorage: onit_user)
                    │
         ┌──────────┴──────────┐
         │                     │
  Provider API            Performer API
  (auto-refreshes via     (auto-refreshes via
  setApiTokenRefresher)   setApiTokenRefresher)
```

**Token refresh priority:**
1. Auth0 `getAccessTokenSilently()` (for email/social users)
2. Raw `refresh_token` grant against Auth0 `/oauth/token` (for OTP users)

**Roles:**
- `PROVIDER` — can post tasks, hire performers
- `TASKER` / `PERFORMER` — can find and complete tasks
- `ADMIN` / `SUPER_ADMIN` — full admin access

---

## 7. API & Network Architecture

```
Browser (Vite Dev / Vercel)
│
│  All requests: /api-onitindia/...
│           ↓
│     Same-origin Proxy
│  (Vite: proxy config / Vercel: rewrites)
│           ↓
│    Lambda Backend URL          ← Never exposed to browser bundle
│  (ONIT_BACKEND_API_URL env var)
│
│  AI / Career / Sheet calls:
│     /api/ai-task
│     /api/enhance-description   ─→  apps/server (Express BFF)
│     /api/submit-task
│     /api/submit-career
```

> [!IMPORTANT]
> Lambda URLs must **never** appear in the client bundle or Network tab. `apiBase.js` actively detects and blocks Lambda URL strings from being used as the API base.

---

## 8. Dependency Overview

### `apps/client` Key Dependencies

| Package | Version | Use |
|---------|---------|-----|
| `react` / `react-dom` | 18.2.0 | UI framework |
| `react-router-dom` | 7.9.5 | Client-side routing |
| `@auth0/auth0-react` | 2.15.1 | Auth0 SDK |
| `axios` | 1.13.5 | HTTP client (with interceptors) |
| `framer-motion` | 12.23.24 | Animations |
| `gsap` | 3.13.0 | GSAP animations (InfiniteMenu) |
| `locomotive-scroll` | 5.0.0-beta | Smooth scroll + parallax |
| `socket.io-client` | 4.8.3 | Real-time notifications & chat |
| `recharts` | 3.7.0 | Charts/analytics |
| `leaflet` / `react-leaflet` | 1.9.4 / 4.2.1 | Maps |
| `lucide-react` | 0.562.0 | Icons |
| `@lottiefiles/dotlottie-react` | 0.17.6 | Lottie animations |
| `realm-web` | 2.0.1 | MongoDB Realm web SDK |
| `tailwindcss` | 4.1.14 | Utility CSS |
| `@microsoft/clarity` | 1.0.2 | Microsoft Clarity analytics |

### `apps/admin` Key Dependencies

| Package | Version | Use |
|---------|---------|-----|
| `react` / `react-dom` | 18.2.0 | UI framework |
| `react-router-dom` | 7.9.5 | Routing |
| `@auth0/auth0-react` | 2.15.1 | Admin authentication |
| `recharts` | 3.7.0 | Dashboard charts |
| `socket.io-client` | 4.8.3 | Real-time updates |
| `framer-motion` | 12.23.24 | Animations |
| `tailwindcss` | 4.1.14 | Utility CSS |

### `apps/server` Key Dependencies

| Package | Version | Use |
|---------|---------|-----|
| `express` | 5.1.0 | HTTP server |
| `openai` | 6.27.0 | OpenAI SDK |
| `@aws-sdk/client-s3` | 3.913.0 | S3 resume uploads |
| `helmet` | 8.2.0 | Security headers |
| `express-rate-limit` | 8.3.1 | Rate limiting |
| `multer` | 2.0.2 | File upload handling |
| `joi` | 18.0.2 | Request validation |
| `mongoose` | 8.20.0 | MongoDB ODM (if used directly) |
| `cors` | 2.8.5 | CORS middleware |
| `cookie-parser` | 1.4.7 | Cookie handling |
| `dotenv` | 17.2.3 | Env var loading |
| `exceljs` | 4.4.0 | Excel export |

---

## 9. Environment Variables

### `apps/client` (`.env` → `VITE_*`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL override (must NOT be Lambda URL) |
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 client ID |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience |
| `VITE_AUTH0_SCOPE` | Auth0 scopes |

### `apps/server` (`.env`)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (required) |
| `OPENAI_MODEL` | Model override (default: `gpt-3.5-turbo`) |
| `ONIT_BACKEND_API_URL` | Lambda backend URL for career application forwarding |
| `GOOGLE_APPS_SCRIPT_URL` | Google Apps Script deployment URL |
| `CORS_ORIGINS` | Comma-separated additional allowed origins |
| `S3_BUCKET` | S3 bucket for resume uploads |
| `S3_REGION` | S3 region |
| `S3_ACCESS_KEY` | AWS access key ID |
| `S3_SECRET_KEY` | AWS secret key |
| `PUBLIC_BASE_URL` | Public URL for local file serving (dev) |
| `PORT` | Server port (default: 5000) |
| `VERCEL` / `VERCEL_ENV` | Auto-set by Vercel to indicate serverless runtime |

---

## 10. Scripts & Build

### Root (`onitindia1/`)

```bash
npm run install-client   # cd client && npm install (legacy)
npm run build-client     # cd client && npm run build (legacy)
npm run build            # install-client + build-client
```

### `apps/client`

```bash
npm run dev              # Vite dev server with API proxy
npm run build            # Production build to dist/
npm run preview          # Preview production build
npm run lint             # ESLint check
npm run generate-domain-sitemap   # Generate domain sitemap
```

### `apps/admin`

```bash
npm run dev              # Vite dev server
npm run build            # Production build to dist/
npm run preview          # Preview production build
npm run lint             # ESLint check
```

### `apps/server`

```bash
npm start                # node server.js (production)
npm run dev              # node server.js (development)
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         onitindia1/                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  apps/client  (Vite + React 18, TailwindCSS v4)          │   │
│  │                                                           │   │
│  │  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐  │   │
│  │  │  Public Site  │   │  ProviderApp │   │PerformerApp │  │   │
│  │  │  + Landing    │   │  /provider/* │   │ /performer/ │  │   │
│  │  └──────────────┘   └──────────────┘   └─────────────┘  │   │
│  │          └──────────────────┬───────────────┘            │   │
│  │                       AuthContext                         │   │
│  │                   NotificationContext                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────┐   ┌───────────────────────────────────┐   │
│  │  apps/admin      │   │  apps/server (Express BFF)        │   │
│  │  (Admin Portal)  │   │                                   │   │
│  │  Auth0-protected │   │  /api/ai-task         → OpenAI   │   │
│  │  23 pages        │   │  /api/enhance-desc    → OpenAI   │   │
│  │                  │   │  /api/submit-task     → Google   │   │
│  └──────────────────┘   │  /api/submit-career   → S3 + DB  │   │
│                          └───────────────────────────────────┘   │
│                                                                  │
│                    External: Lambda Backend (main API)            │
│                    External: Auth0 (identity)                    │
│                    External: MSG91 (OTP)                         │
└─────────────────────────────────────────────────────────────────┘
```
