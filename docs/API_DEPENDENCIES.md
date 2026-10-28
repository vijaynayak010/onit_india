# OnIT India Platform — API Dependencies & Backend Specifications

**Document Version:** 1.0.0  
**Environment:** Frontend-Only Manual Testing Clone  
**Audit Scope:** All backend HTTP endpoints, WebSocket channels, and third-party SaaS APIs called by the frontend.

---

## 1. Monorepo Backend Service Topography

The frontend communicates with three separate backend endpoints:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              apps/client                               │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. NestJS / Lambda │ 2. Express BFF     │ 3. External SaaS Providers   │
│    (/api-onitindia)│    (/api)          │    (Auth0, MSG91, AWS WS)    │
│    Core Marketplace│    Port 5000       │    Identity, OTP, WebSockets │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

---

## 2. Main Marketplace API (`/api-onitindia`)

All requests are dispatched using either `apiFetch(path, options)` or Axios instances configured with `getApiBaseUrl()`.

### 2.1 Identity, Authentication & Profile

| HTTP Method & Endpoint | Caller Service / File | Purpose | Mock Payload Schema |
| :--- | :--- | :--- | :--- |
| `GET /users/me` | `AuthContext.jsx`, `api.js` | Retrieves active user identity, role, and nested profile data | `{ id: "usr_mock_1", email: "test@onitindia.com", name: "Alex Morgan", role: "PROVIDER", phoneNumber: "+919876543210", provider: { ... }, taskers: { ... } }` |
| `PUT /users/me` | `api.js` | Updates user display name, phone, bio, notification preferences | `{ success: true, user: { ...updatedUser } }` |
| `POST /auth/check-email` | `api.js`, `AuthPage.jsx` | Checks if an email is registered | `{ exists: true, provider: "auth0" }` |
| `POST /auth/check-account` | `api.js`, `AuthPage.jsx` | Checks whether user has an active Provider or Tasker account | `{ exists: true, role: "PROVIDER" }` |
| `POST /auth/refresh` | `AuthContext.jsx`, `apiInterceptors.js` | Rotates expired access token using refresh token | `{ accessToken: "mock_jwt_token_valid", refreshToken: "mock_refresh_token_valid" }` |
| `POST /auth/logout` | `AuthContext.jsx`, `api.js` | Invalidates active user session | `{ success: true }` |
| `POST /users/onboard` | `ProviderApp.jsx`, `PerformerApp.jsx` | Assigns initial role (`PROVIDER` or `TASKER`) | `{ success: true, role: "PROVIDER" }` |
| `POST /users/me/deletion-request` | `DeleteAccountPage.jsx` | Initiates 30-day account deletion grace period | `{ scheduledDate: "2026-11-27T00:00:00.000Z", status: "PENDING" }` |
| `GET /users/me/deletion-request` | `DeleteAccountPage.jsx` | Checks status of existing deletion request | `{ hasPendingRequest: false }` |
| `POST /users/me/deletion-request/cancel` | `RestoreAccountPage.jsx`| Cancels pending deletion and restores access | `{ success: true, restored: true }` |
| `POST /auth/profile-phone/verify-access-token` | `RequirePhoneVerification.jsx` | Finalizes phone linkage via MSG91 token | `{ verified: true, phoneNumber: "+919876543210" }` |

---

### 2.2 Provider Sub-System Endpoints

| HTTP Method & Endpoint | Caller Service / File | Purpose | Mock Payload Schema |
| :--- | :--- | :--- | :--- |
| `GET /providers/me` | `api.js`, `ProviderDataContext.jsx` | Provider business details, company, industry | `{ id: "prov_101", companyName: "Nexus Labs", industry: "Technology", verified: true }` |
| `GET /providers/me/onboarding-status` | `RequireProviderOnboarding.jsx` | Verifies if provider onboarding wizard is finished | `{ onboardingComplete: true, step: 3 }` |
| `POST /providers` | `ProviderApp.jsx` | Creates initial provider database profile | `{ id: "prov_101", onboardingComplete: true }` |
| `PUT /providers/me` | `SettingsPage.jsx` | Updates provider company profile and invoices | `{ success: true, provider: { ... } }` |
| `GET /providers/me/saved-taskers` | `SavedPerformersPage.jsx` | Returns list of bookmarked performers | `[ { id: "tasker_1", displayName: "Rahul Sharma", rating: 4.9, skills: ["UI Design"] } ]` |

---

### 2.3 Tasks, Applications & Execution Endpoints

| HTTP Method & Endpoint | Caller Service / File | Purpose | Mock Payload Schema |
| :--- | :--- | :--- | :--- |
| `GET /tasks/my-tasks` | `MyTasksPage.jsx`, `DashboardPage.jsx` | Provider list of posted tasks with filters | `{ data: [ { id: "tsk_1", title: "Audit Retail Shelf", status: "PUBLISHED", budget: 3500 } ], pagination: { total: 1 } }` |
| `GET /tasks` | `PerformerApp.jsx`, `FindTasksPage.jsx` | Marketplace feed of open gigs for performers | `{ tasks: [ { id: "tsk_1", title: "React Frontend Fix", budget: 5000, category: "tech" } ] }` |
| `GET /tasks/:id` | `TaskManagementPage.jsx`, `PerformerTaskDetailsPage.jsx` | Complete task brief, milestones, and scope | `{ id: "tsk_1", title: "React Frontend Fix", status: "IN_PROGRESS", budget: 5000, description: "Detailed task brief..." }` |
| `POST /tasks` | `PostTaskDetailsPage.jsx` | Posts new task or saves draft | `{ id: "tsk_new_1", status: "PUBLISHED", title: "New Task" }` |
| `PUT /tasks/:id` | `PostTaskDetailsPage.jsx` | Updates task specifications | `{ success: true, task: { id: "tsk_1" } }` |
| `DELETE /tasks/:id` | `MyTasksPage.jsx` | Cancels or removes draft task | `{ success: true, deletedId: "tsk_1" }` |
| `GET /tasks/:id/applications` | `TaskApplicantsPage.jsx` | List of performer applicants for a task | `[ { id: "app_1", tasker: { displayName: "Priya P." }, proposedAmount: 3200, pitch: "Experienced in retail" } ]` |
| `POST /tasks/:id/apply` | `PerformerTaskDetailsPage.jsx` | Performer submits proposal/application | `{ id: "app_new", status: "SUBMITTED" }` |
| `PATCH /tasks/:id/applications/:appId/accept` | `TaskApplicantsPage.jsx` | Provider hires performer and locks escrow | `{ success: true, taskId: "tsk_1", status: "ASSIGNED" }` |
| `POST /tasks/:id/submit-work` | `PerformerActiveTaskExecutionPage.jsx` | Performer submits final deliverable & proofs | `{ submissionId: "sub_1", status: "SUBMITTED", proofs: ["https://example.com/proof.pdf"] }` |
| `POST /tasks/:id/approve-work` | `ProviderActiveTaskExecutionPage.jsx` | Provider approves work and triggers payout | `{ status: "COMPLETED", payoutReleased: true }` |
| `GET /task-catalog/domains` | `PostTaskManualPage.jsx` | Master domain & category taxonomy tree | `[ { id: "business", label: "Business Operations", subdomains: [...] } ]` |

---

### 2.4 Performer & Growth Endpoints

| HTTP Method & Endpoint | Caller Service / File | Purpose | Mock Payload Schema |
| :--- | :--- | :--- | :--- |
| `GET /taskers/me` | `PerformerApp.jsx`, `PerformerProfilePage.jsx` | Performer profile, bio, skills, portfolio | `{ id: "tsk_usr_1", displayName: "Rahul Sharma", rating: 4.9, completedTasks: 42, trustScore: 94 }` |
| `GET /taskers/me/onboarding-status` | `RequirePerformerOnboarding.jsx` | Verifies performer onboarding step | `{ onboardingComplete: true, step: 4 }` |
| `POST /taskers` | `PerformerApp.jsx` | Initializes performer profile | `{ id: "tsk_usr_1", onboardingComplete: true }` |
| `PUT /taskers/me` | `PerformerProfilePage.jsx` | Updates bio, hourly rate, skills, links | `{ success: true, tasker: { ... } }` |
| `PATCH /taskers/me/availability/toggle` | `PerformerDashboardPage.jsx` | Switches online/offline availability | `{ isAvailable: true }` |
| `GET /taskers/rankings` | `PerformerLeaderboardPage.jsx` | Platform performer leaderboard | `[ { rank: 1, displayName: "Aarav Patel", score: 980 } ]` |
| `GET /taskers/me/kyc` | `PerformerKycPage.jsx` | Current KYC document approval status | `{ status: "APPROVED", idVerified: true, selfieVerified: true }` |
| `POST /taskers/me/kyc/id` | `PerformerKycPage.jsx` | Submits Aadhaar/PAN document | `{ success: true, status: "UNDER_REVIEW" }` |
| `POST /taskers/me/kyc/selfie` | `PerformerKycPage.jsx` | Submits liveness selfie verification | `{ success: true, status: "APPROVED" }` |
| `GET /taskers/me/bank-account` | `PerformerBankDetailsPage.jsx` | Saved bank account or UPI ID | `{ accountNumber: "****5678", ifsc: "HDFC0001234", upiId: "alex@okhdfcbank" }` |
| `PUT /taskers/me/bank-account` | `PerformerBankDetailsPage.jsx` | Updates payout bank details | `{ success: true, updated: true }` |
| `GET /performer/growth/daily-quiz` | `PerformerDailyQuizPage.jsx` | Today's skill quiz questions | `{ assignmentId: "quiz_101", questions: [ { id: "q1", question: "What is TAM?", options: [...] } ] }` |
| `POST /performer/growth/daily-quiz/:id/start` | `PerformerDailyQuizPage.jsx` | Starts quiz timer | `{ attemptId: "att_1", expiresAt: "2026-10-27T18:00:00Z" }` |
| `POST /performer/growth/daily-quiz/:id/attempt` | `PerformerDailyQuizPage.jsx` | Submits quiz answers & scores results | `{ score: 100, earnedPoints: 50, trustScoreDelta: +2 }` |

---

### 2.5 Wallet, Escrow & Payment Endpoints

| HTTP Method & Endpoint | Caller Service / File | Purpose | Mock Payload Schema |
| :--- | :--- | :--- | :--- |
| `GET /wallet` | `ProviderDataContext.jsx`, `PerformerWalletPage.jsx` | Available balance, in-escrow funds, currency | `{ balance: 14500, escrowBalance: 4000, currency: "INR" }` |
| `GET /wallet/transactions` | `TransactionsPage.jsx`, `SettingsPage.jsx` | Ledger statement of credits, debits, escrow | `[ { id: "tx_1", type: "TASK_PAYOUT", amount: 3500, date: "2026-10-25" } ]` |
| `GET /payout-methods` | `SettingsPage.jsx`, `PerformerWalletPage.jsx` | Linked payout destinations | `[ { id: "pm_1", type: "UPI", handle: "user@okhdfc" } ]` |
| `POST /payout-methods/withdrawals` | `PerformerWalletWithdrawPage.jsx` | Submits bank withdrawal request | `{ withdrawalId: "wd_101", amount: 5000, status: "PROCESSING" }` |

---

### 2.6 Chat & Real-Time Notifications

| HTTP Method & Endpoint | Caller Service / File | Purpose | Mock Payload Schema |
| :--- | :--- | :--- | :--- |
| `GET /conversations` | `ChatsPage.jsx` | List of ongoing conversations with clients/performers | `[ { id: "conv_1", participant: { displayName: "Rahul S." }, lastMessage: "Done with draft", unread: 1 } ]` |
| `GET /conversations/:id/messages`| `ChatsPage.jsx` | Message history for active chat room | `[ { id: "msg_1", senderId: "usr_mock_1", text: "Hello! Here is the progress.", timestamp: "2026-10-27T10:00:00Z" } ]` |
| `POST /conversations/:id/messages`| `ChatsPage.jsx` | Sends chat message | `{ id: "msg_2", text: "Received!", timestamp: "2026-10-27T10:01:00Z" }` |
| `GET /notifications` | `NotificationContext.jsx` | Unread notifications feed | `[ { id: "notif_1", title: "Work Submitted", body: "Rahul submitted work for Task #101", isRead: false } ]` |
| `PATCH /notifications/:id/read` | `NotificationContext.jsx` | Marks notification as read | `{ success: true }` |

---

### 2.7 Public Share & Invoice Authenticator

| HTTP Method & Endpoint | Caller Service / File | Purpose | Mock Payload Schema |
| :--- | :--- | :--- | :--- |
| `GET /public/share/:code` | `PublicSharePage.jsx` | Unauthenticated public preview of shared task or talent card | `{ available: true, type: "TASK", task: { title: "Research Analyst Needed", budget: 4000 } }` |
| `POST /public/share/:code/open` | `PublicSharePage.jsx` | Records public share link open metric | `{ recorded: true }` |
| `GET /public/invoices/verify` | `InvoiceVerificationPage.jsx` | Validates digital signature and details of issued tax invoice | `{ result: "VERIFIED", invoice: { invoiceNumber: "ONIT-2026-9921", totalPaid: 4130, status: "PAID" } }` |
| `GET /settings/content-pages/:slug`| `PolicyPage.jsx` | Fetches custom markdown policy document | `{ title: "Community Standards", content: "# Community Standards\n\nBe respectful." }` |

---

## 3. Express BFF Micro-Service (`/api` on Port 5000)

| Endpoint | HTTP Method | Frontend Component | Purpose | Mock Handling |
| :--- | :--- | :--- | :--- | :--- |
| `/api/generate-task` | `POST` | `PostTaskAIPage.jsx` | Takes natural language prompt and returns structured task schema (title, category, scope, budget) | Return structured task mockup with delay |
| `/api/enhance-description` | `POST` | `PostTaskManualPage.jsx` | Rewrites draft description into professional task requirements | Return enhanced bulleted text with delay |
| `/api/submit-task` | `POST` | `ContactPage.jsx` / Landing | Submits quick task leads directly into Google Apps Script spreadsheet | Return `{ success: true, message: "Task lead recorded" }` |
| `/api/submit-career` | `POST` (Multer) | `Careers.jsx` | Receives job candidate application and PDF resume | Return `{ success: true, applicationId: "app_car_101" }` |
| `/api/subscribe` | `POST` | `Footer.jsx` | Subscribes user email to platform newsletter | Return `{ success: true, message: "Subscribed successfully" }` |

---

## 4. Third-Party External SaaS Integrations

| Provider | Integration Surface | Risk in Test Mode | Mocking Strategy |
| :--- | :--- | :--- | :--- |
| **Auth0** | `@auth0/auth0-react` (`AppAuth0Provider.jsx`) | Triggers login redirect if unauthenticated; blocks protected rendering | Mock Auth0 context hook returning `isAuthenticated: true` and mock user claims |
| **MSG91** | `sendotp-sdk` (`RequirePhoneVerification.jsx`) | Blocks phone number input and expects live SMS OTP | Force `PHONE_OTP_ENABLED = false` or provide pre-verified mock user |
| **AWS WebSocket** | `WebSocket` (`chatRealtime.js`) | Continuous reconnect loops / socket failure errors in console | Provide mock WebSocket client simulator emitting local events |
| **Razorpay / UPI** | Payment checkout modals (`ConfirmAndPayPage.jsx`) | Initiates real banking escrow transfers | Intercept checkout modal and simulate successful payment confirmation receipt |
