# FIRSTDOER — BACKEND DEPENDENCY AND BLOCKERS

> **Rule:** Frontend-only audit. No backend endpoints were invented or modified.

---

## 1. Live Backend Verification Blockers (Requires Staging/Live `apps/server`)

| Severity | Feature / Route | Service Method(s) & File | Expected Backend Support | Test Mode Behavior | Live Verified? | Requires Backend Team? |
|---|---|---|---|---|---|---|
| **Critical** | Auth0 & Role Sync (`ProviderApp.jsx`, `AuthContext.jsx`) | `refreshProfile`, `onboardUser`, `createProviderProfile` | Auth0 `VITE_AUTH0_CLIENT_ID_PROVIDER` + `POST /providers/onboard` | Bypassed when `isTestModeEnabled()` is true | **No** | Yes (env + live API) |
| **Critical** | Razorpay Checkout & Escrow (`ConfirmAndPayPage.jsx`) | `previewTaskPayment`, `createRazorpayOrder`, `verifyRazorpayPayment`, `acceptInterest`, `directHireTasker` | `POST /payments/tasks/:id/preview`, `POST /payments/create-order`, `POST /payments/verify-payment` | Simulated via `paymentRequired: false` mock | **No** | Yes (Razorpay keys + webhooks) |
| **High** | File & Deliverable Uploads (`ProviderActiveTaskExecutionPage.jsx`, `PostTaskManualPage.jsx`) | `getPresignedUrl`, `confirmUpload`, `attachTaskFiles` | S3 presigned URL generation & upload confirmation | Simulated URLs in mock | **No** | Yes |
| **High** | Account Lifecycle (`Onboarding`, `DeleteAccount`, `RestoreAccount`, `SwitchToPerformer`, `2FA`, `ChangePassword`) | `deleteAccount`, `restoreAccount`, `changePassword`, `toggle2FA` | Dedicated auth/account mutation endpoints | Partially mocked / untested in browser | **No** | Yes |

---

## 2. Missing Backend Endpoints (Feature Gaps)

| Severity | Feature | Route / Component | Current Frontend Behavior | Missing Backend Dependency | Requires Backend Team? |
|---|---|---|---|---|---|
| **Medium** | Provider Invitations List (`/provider/invitations`) | `TaskPerformerProfilePage.jsx` (per-task only) | Invitations can only be sent (`sendTaskInvitation`) or checked per-task (`getTaskInvitations`). | Cross-task `GET /providers/me/invitations` endpoint. | **Yes** |
| **Medium** | Provider Custom Saved Templates CRUD | `TaskTemplatesPage.jsx` | Reads admin/catalog templates from `useHomeContent()`. No Provider save/edit/delete template capability. | `GET/POST/PUT/DELETE /providers/me/task-templates` endpoints. | **Yes** |
| **Medium** | Per-Task Performer Shortlist | `SavedPerformersPage.jsx` | Global `saved-taskers` bookmarking synced with `localStorage`. | `POST/DELETE /tasks/:id/shortlist/:taskerId` if per-task shortlisting is desired. | **Yes** |
| **Medium** | Boost Task (`/provider/boost-task`) | `BoostTaskPage.jsx` | UI options rendered; no live promotion/payment endpoint. | Boost pricing & promotion API. | **Yes** |
| **Low** | Provider-Side Task Agreement PDF / Contract Review | None (Performer-only at `/performer/task-agreement/:id`) | Performer accepts/declines offer; Provider proceeds from `Check & pay` to `Confirm & Pay`. | Contract generation / legal PDF endpoint if required by business. | **Yes** |
