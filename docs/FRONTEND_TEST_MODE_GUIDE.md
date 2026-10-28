# Frontend-Only Manual Testing Environment Guide

This guide describes the frontend-only manual testing setup built for the **OnIT India** client application (`apps/client`). It enables complete manual verification of every page, component, form, and navigation workflow locally without requiring backend servers, active database connections, Auth0 credentials, or MSG91 OTP infrastructure.

---

## 1. Quick Start

### Starting the Local Development Server
The frontend runs via Vite on:
```bash
cd apps/client
npm run dev
```
URL: **`http://localhost:5173`**

### Opening the Manual Page Explorer
Navigate directly to:
👉 **`http://localhost:5173/test-explorer`**

From this dashboard, you can:
- View all 175+ cataloged routes categorized by module.
- Filter by Role (`PROVIDER`, `PERFORMER` / `TASKER`, `ADMIN`, `PUBLIC`).
- Filter by Manual Status (`NOT TESTED`, `PASS`, `FAIL`, `BLOCKED`).
- Click **"Test Route"** to immediately switch roles (if needed) and open that screen.
- Log your manual testing notes and observations directly in the UI (automatically saved to `localStorage`).
- Export your testing progress as a structured JSON report.

---

## 2. Floating Test Controller (`TestModeBadge`)

On every screen in local development, a floating **"Test Mode Active"** widget is fixed at the bottom right.

Clicking the badge opens a control panel with:
1. **Active Role Switcher**:
   - `PROVIDER` (Alex Morgan / TechCorp)
   - `TASKER` / `PERFORMER` (Rahul Sharma / Elite Performer)
   - `ADMIN` (Karan Mehta / Super Admin)
   - `GUEST` (Anonymous unauthenticated user)
   *Switching roles immediately updates `AuthContext` state without page reload.*

2. **Simulate Conditions**:
   - **Simulate Empty Data**: Intercepts queries to return empty arrays (`tasks: []`, `applications: []`, `notifications: []`) to test empty-state UI and illustrations.
   - **Simulate Slow Latency**: Adds artificial delay (~1200ms) to all mock API calls to test loading spinners, skeletons, and disabled button states.

3. **Reset Mock Data**:
   - Resets all local mutations (e.g. newly posted tasks, updated statuses, edited profile fields) back to clean initial demo data.

4. **Explorer Shortcut**:
   - Quick one-click jump back to `/test-explorer`.

5. **Test Mode Toggle**:
   - Allows switching test mode OFF to point the frontend back to live backends (`/api` or `/api-onitindia`).

---

## 3. Architecture & Network Interception

All test-mode logic resides cleanly in `apps/client/src/test-mode/`:

| File | Purpose |
|---|---|
| [`testModeConfig.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/test-mode/testModeConfig.js) | Host check (`localhost`, `127.0.0.1`), feature flags, role storage, and event dispatchers. Disabled by default in production builds. |
| [`mockData.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/test-mode/mockData.js) | Rich, realistic data payloads for Providers, Performers, Tasks (`PUBLISHED`, `IN_PROGRESS`, `SUBMITTED`, `COMPLETED`), Applications, Wallet, Invoices, and Quizzes. |
| [`mockDatabase.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/test-mode/mockDatabase.js) | Stateful in-browser storage (`localStorage` + memory) with CRUD methods (`createTask`, `updateTaskStatus`, `applyForTask`, etc.). |
| [`mockApiHandler.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/test-mode/mockApiHandler.js) | Matches incoming endpoints (`/api-onitindia/*`, `/api/*`) and dispatches to mock DB handlers with latency simulation. |
| [`routeCatalog.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/test-mode/routeCatalog.js) | Detailed inventory of 175+ routes with IDs, titles, required roles, dynamic parameter mappings, and status fields. |
| [`TestModeBadge.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/test-mode/components/TestModeBadge.jsx) | Floating UI component for role switching, resets, and environment simulation. |
| [`ManualPageExplorer.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/test-mode/components/ManualPageExplorer.jsx) | Full-screen interactive dashboard for manual testing workflow, search, and progress tracking. |

### Intercepted Layers:
- **`apiFetch` ([`src/utils/apiFetch.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/utils/apiFetch.js))**:
  When `isTestModeEnabled()`, all requests pass to `handleMockApiRequest(...)` and return standard `Response` objects.
- **Axios ([`src/utils/apiInterceptors.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/utils/apiInterceptors.js))**:
  Axios requests are routed through a custom test-mode adapter returning identical axios response structures. Destructive 401 response interceptors (which clear tokens and redirect to `/auth`) are bypassed in test mode.
- **AuthContext ([`src/contexts/AuthContext.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/contexts/AuthContext.jsx))**:
  Provides mock JWT tokens and user objects for the selected role without triggering Auth0 or server login handshakes.
- **WebSocket ([`src/services/chatRealtime.js`](file:///d:/Onitindia/onitindia1-main/apps/client/src/services/chatRealtime.js))**:
  Simulates a stable connected WebSocket channel in test mode, suppressing AWS WebSocket errors.

---

## 4. Bypassed Gates & Guards

In local test mode, all blocking gates allow direct navigation:
- **`SiteGate`**: Suppresses the coming-soon blocker and renders the full app.
- **`GatedRoute`**: Allows direct access to `/provider/*`, `/performer/*`, and `/admin/*`.
- **`RequirePhoneVerification`**: Bypasses MSG91 OTP verification.
- **`RequireProviderOnboarding` & `RequirePerformerOnboarding`**: Considers mock profiles as fully onboarded, allowing direct access to all dashboard sub-routes without forced redirects.

---

## 5. Manual Testing Protocol

1. **Start with `/test-explorer`**:
   Filter by module (e.g. `Provider Portal`).
2. **Open Route**:
   Click **"Test Route"** to load the view.
3. **Verify Functionality**:
   - Check layout, alignment, responsive behavior, typography.
   - Verify interactive components (tabs, filters, forms, modals).
   - Test empty states using the floating badge toggle ("Simulate Empty Data").
   - Test loading states using "Simulate Slow Latency".
4. **Mark Status**:
   Return to `/test-explorer` (or keep it in a split window) and set the status:
   - `NOT TESTED` (Default)
   - `PASS` (Verified functional)
   - `FAIL` (Issue discovered)
   - `BLOCKED` (Page has missing assets or errors)
5. **Add Notes**:
   Write specific defect details or observations in the route's notes field.
6. **Export Progress**:
   Use the **"Export Report"** button in `/test-explorer` to save your manual testing records.

---

## 6. How to Disable Test Mode

If you ever wish to connect the frontend back to a live or staging backend:
- Open the floating badge and switch **"Enable Frontend Test Mode"** to OFF.
- Or run in the browser console:
  ```javascript
  localStorage.setItem('onit_frontend_test_mode', 'false');
  window.location.reload();
  ```
- To re-enable:
  ```javascript
  localStorage.removeItem('onit_frontend_test_mode');
  window.location.reload();
  ```

---

## 7. Known Limitations of the Mock Environment

- **Payment Gateway**: Cashfree/Razorpay checkout popups are simulated with client-side success callbacks; actual bank gateway screens are not loaded.
- **SMS / WhatsApp**: MSG91 OTP messages are simulated; any 4- or 6-digit code or direct bypass is accepted in test mode.
- **Document OCR / Facial Match**: KYC verification mocks automatic instant approval without running remote AI OCR.
