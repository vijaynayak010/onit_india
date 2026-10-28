# OnIT India Platform — Frontend Project Architecture Audit

**Document Version:** 1.0.0  
**Target Environment:** Local Frontend-Only Manual Testing Clone  
**Audit Date:** October 2026  
**Audited Roots:** `apps/client`, `apps/admin`, `apps/server`

---

## 1. Executive Summary & Monorepo Topology

The OnIT India platform is structured as a monorepo containing two React SPAs and one Node.js Express Backend-for-Frontend (BFF) service:

```
onitindia1-main/
├── apps/
│   ├── client/                  # [Primary] Client & Marketplace SPA (Vite + React 18 + Tailwind v4)
│   │   ├── src/                 # Public marketing, Provider portal, Performer portal, Shared UI
│   │   ├── public/              # Static assets (images, icons, schemas)
│   │   ├── vite.config.js       # Vite dev server + proxy config (/api-onitindia, /api, /auth0)
│   │   └── package.json         # Client runtime dependencies & scripts
│   ├── admin/                   # [Isolated] Internal Admin Portal SPA (Vite + React 18)
│   │   ├── src/                 # Admin console, moderation, KYC, disputes, finance
│   │   ├── vite.config.js       # Admin dev proxy configuration
│   │   └── package.json         # Admin dependencies
│   └── server/                  # [BFF] Express proxy server (Port 5000)
│       ├── server.js            # Express server (AI task generator, S3 uploads, Google Apps Script)
│       └── package.json
├── docs/                        # Project architectural and testing specifications
└── package.json                 # Monorepo root scripts
```

> **Manual Testing Focus:** The primary user-facing target is `apps/client`, which houses the Public Website, Provider Sub-Application, Performer Sub-Application, and embedded Admin components.

---

## 2. Technology Stack & Framework Inventory

| Dimension | `apps/client` (Main App) | `apps/admin` (Admin App) | `apps/server` (BFF) |
| :--- | :--- | :--- | :--- |
| **Framework** | React 18.3.1 (SPA) | React 18.3.1 (SPA) | Express 5.1.0 (Node ESM) |
| **Bundler / Tooling** | Vite 7.x + `@vitejs/plugin-react` | Vite 7.x + `@vitejs/plugin-react` | Node 20+ runtime |
| **Styling** | TailwindCSS v4 (`@tailwindcss/vite`), Custom CSS variables | TailwindCSS v4 | N/A |
| **Routing** | `react-router-dom` v7 (`BrowserRouter`) | `react-router-dom` v7 (`BrowserRouter`) | Express Router |
| **Icons & Media** | `lucide-react`, `react-feather`, `react-icons`, Lottie | `lucide-react`, `react-feather` | Multer |
| **Animation** | `framer-motion` v12, `gsap` | `framer-motion` v12 | N/A |
| **Mapping & Charts** | `leaflet`, `react-leaflet`, `recharts` | `recharts` | N/A |
| **Auth Client** | `@auth0/auth0-react` v2.15, Custom JWT store | `@auth0/auth0-react` v2.15 | Cookie / Bearer checks |

---

## 3. Application Entry Points & Hierarchy

### 3.1 `apps/client` Root Hierarchy
1. **HTML Shell**: [`apps/client/index.html`](file:///d:/Onitindia/onitindia1-main/apps/client/index.html)
2. **React Root**: [`apps/client/src/main.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/main.jsx)
   - Mounts React 18 root.
   - Encloses application within `HelmetProvider` for SEO tags.
3. **App Architecture Shell**: [`apps/client/src/App.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/App.jsx)
   ```jsx
   <Router>
     <AppAuth0Provider>       {/* Auth0 multi-client context wrapper */}
       <AuthProvider>         {/* User session, role, token state */}
         <NotificationProvider> {/* WebSocket + toast notification hub */}
           <ScrollToTop />
           <SiteGate>         {/* Development access barrier & maintenance gate */}
             <MainContent />  {/* Global Chrome (Navbar, ScrollingInfo) + Routes */}
           </SiteGate>
         </NotificationProvider>
       </AuthProvider>
     </AppAuth0Provider>
   </Router>
   ```

### 3.2 Layout & Chrome Management
Global chrome components are conditionally rendered based on the active route in `MainContent` (`App.jsx`):
- **`ScrollingInfo`**: Top ticker banner with real-time updates and announcements.
- **`Navbar`**: Main public navigation bar with search, category links, role switcher, and Auth CTA.
- **`SplashCursor`**: Interactive liquid canvas effect.
- **`Footer`**: Platform links, legal policies, domain links, newsletter sign-up, and brand badges.
- **Chrome Suppression**: Chrome is suppressed for all full-page app paths:
  - `/provider/*` (Provider app renders its own header, navigation, and sidebar)
  - `/performer/*` (Performer app renders its own bottom nav / sidebar / header)
  - `/admin/*` (Admin console renders full-width layout)
  - `/auth`, `/signup`, `/register`, `/providerlogin`, `/performerlogin`
  - `/s/:code` (Public task/profile card share page)
  - `/verify-invoice` (Isolated invoice authenticity verifier)
  - `/performers-directory` (Mounts customized internal chrome)

---

## 4. Role-Based Sub-Applications

The client repository functions as a tri-portal application based on user roles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        apps/client (Vite Dev Server)                   │
├────────────────────────────────┬───────────────────────────────────────┤
│ Surface                        │ Sub-Application Root & Description   │
├────────────────────────────────┼───────────────────────────────────────┤
│ 1. Public Marketing & Content  │ Root Routes in App.jsx (No auth)      │
│ 2. Provider Portal             │ components/provider/ProviderApp.jsx   │
│ 3. Performer Portal            │ components/Performer/PerformerApp.jsx │
│ 4. Admin Sub-Module (Client)   │ components/Admin/AdminApp.jsx         │
└────────────────────────────────┴───────────────────────────────────────┘
```

### 4.1 Provider Portal (`/provider/*`)
- **Root Component:** [`apps/client/src/components/provider/ProviderApp.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/provider/ProviderApp.jsx)
- **State Context:** `ProviderDataProvider` (`ProviderDataContext.jsx`) managing dashboard metrics, task stats (Active, Applicants, Completed, Drafts), and performer highlights.
- **Guards:**
  - `GatedRoute`: Verifies authenticated session (`onit_token` or Auth0) and role (`PROVIDER` or `ADMIN`).
  - `RequirePhoneVerification`: Enforces mobile number verification via MSG91 OTP widget before continuing.
  - `RequireProviderOnboarding`: Checks onboarding status (`/providers/me/onboarding-status`) and directs incomplete users to `/provider/onboarding`.
- **Primary Modules:**
  - Dashboard & Active Task Execution monitoring
  - AI & Manual Task Creation Wizards (`/provider/post-task-selection`, `/provider/post-task-manual`, `/provider/post-task-ai`)
  - Performer Discovery, Talent Search & Filter (`/provider/explore-talent`, `/provider/search`)
  - Task Applicants review, Applicant hiring & payment release
  - Wallet, Payment Checkout, Payout method management, Invoices
  - Real-time Messaging & Support ticketing

### 4.2 Performer Portal (`/performer/*`)
- **Root Component:** [`apps/client/src/components/Performer/PerformerApp.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/PerformerApp.jsx)
- **Guards:**
  - `GatedRoute`: Verifies authenticated session and role (`TASKER`, `PERFORMER`, or `ADMIN`).
  - `RequirePhoneVerification`: Enforces phone validation.
  - `RequirePerformerOnboarding`: Checks onboarding status (`/taskers/me/onboarding-status`) and directs to `/performer/onboarding`.
- **Primary Modules:**
  - Task Discovery & Feed (`/performer/find-tasks`, `/performer/all-tasks`)
  - Application Submission & Proposal management
  - Active Task Execution Workroom (`/performer/active-task/:id`) with proof uploads
  - Daily Quiz & Growth Academy (`/performer/daily-quiz`, `/performer/growth`)
  - Earnings, Transactions, Bank Account linking (`/performer/banks`)
  - KYC Document & Selfie Verification (`/performer/kyc`)
  - Reputation, Ratings, Reviews, and Leaderboard (`/performer/leaderboard`)

### 4.3 Admin Module (`/admin/*`)
- **Client Route:** Handled by [`apps/client/src/components/Admin/AdminApp.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Admin/AdminApp.jsx) (Daily Quiz management) and legacy blog admin (`/admin-login`, `/admin-dashboard`, `/add-post`).
- **Dedicated Admin Portal App:** [`apps/admin`](file:///d:/Onitindia/onitindia1-main/apps/admin) containing complete back-office controls (User moderation, KYC approval, Task approval, Disputes, Financial disbursements).

---

## 5. Authentication, Authorization & Session Management

### 5.1 Storage Tokens & Identifiers
The frontend persists session state in `localStorage` and `sessionStorage`:
- `onit_token`: JWT Bearer authentication token passed in `Authorization: Bearer <token>`.
- `onit_refresh_token`: Refresh token used for silent session extension.
- `onit_user`: Serialized JSON representation of user profile (`id`, `email`, `role`, `phoneNumber`, `name`, `displayName`, `provider`, `taskers`).
- `userRole`: Quick-access role string (`PROVIDER`, `TASKER`, `ADMIN`, `SUPER_ADMIN`).
- `onit_dev_access_2026`: Dev gate bypass key (`granted`).
- `provider_onboarding_session_v1_<userId>`: Session marker indicating onboarding completed.
- `performer_onboarding_session_v1_<userId>`: Session marker indicating performer onboarding completed.

### 5.2 Network Interceptors & 401 Auto-Redirect
- Implemented in [`apps/client/src/utils/apiInterceptors.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/utils/apiInterceptors.js).
- If any Axios API request returns an HTTP `401 Unauthorized` and silent token refresh fails:
  ```javascript
  localStorage.removeItem("onit_token");
  localStorage.removeItem("onit_refresh_token");
  localStorage.removeItem("onit_user");
  localStorage.removeItem("userRole");
  window.location.href = "/auth";
  ```
- **Local Test Mode Implication:** In frontend-only testing mode, live network requests must never hit unreachable backend endpoints with missing or expired tokens, otherwise the 401 interceptor will forcibly wipe the mock session and kick the tester back to `/auth`.

---

## 6. Environment Configurations

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | Frontend (`import.meta.env`) | Relative proxy prefix (`/api-onitindia`). Never points to raw Lambda in browser. |
| `ONIT_BACKEND_API_URL` | Server / Vite Proxy only | Live AWS Lambda backend target URL. |
| `VITE_WS_URL` | Frontend (`import.meta.env`) | AWS API Gateway WebSocket URL for chat & notifications. |
| `VITE_AUTH0_DOMAIN` | Frontend (`import.meta.env`) | Auth0 tenant domain. |
| `VITE_AUTH0_CLIENT_ID` | Frontend (`import.meta.env`) | Default Auth0 client ID. |
| `VITE_AUTH0_CLIENT_ID_PROVIDER` | Frontend (`import.meta.env`) | Provider portal Auth0 client ID. |
| `VITE_AUTH0_CLIENT_ID_TASKER` | Frontend (`import.meta.env`) | Performer portal Auth0 client ID. |
| `VITE_MSG91_WIDGET_ID` | Frontend (`import.meta.env`) | MSG91 OTP widget identifier. |
| `VITE_MSG91_WIDGET_TOKEN` | Frontend (`import.meta.env`) | MSG91 OTP widget authentication token. |
