# FIRSTDOER — PROVIDER ROUTE AND PAGE INVENTORY

> **Source Files Inspected:** `apps/client/src/components/provider/ProviderApp.jsx`, `apps/client/src/components/Performer/PerformerApp.jsx`, `apps/client/src/App.jsx`, `apps/client/src/components/provider/pages/`, `apps/client/src/components/Performer/pages/`.

---

## 1. Route & Page Count Summary

| Module | Total `<Route>` Entries | Component Routes | Redirect / Index Routes | Unique Page Components Referenced | Page `.jsx` Files in Directory |
|---|---|---|---|---|---|
| **Provider (`ProviderApp.jsx`)** | **54** | 45 | 9 (1 index + 7 aliases + `*`) | **45** (40 Provider-specific + 2 dynamic/same-comp variants? Wait: 40 Provider + 3 Shared = **43** unique components across 45 routes, since `ProviderTaskSupportPage` serves 4 routes) | **44** files in `provider/pages/` (4 unused/legacy in router: `AuthPage`, `WelcomePage`, `RatingsPage`, `RatingsReceivedPage`) |
| **Performer (`PerformerApp.jsx`)** | **51** | 46 | 5 (1 index + 3 aliases + `*`) | **47** (42 Performer-only + 2 Provider-shared `ChatsPage`/`DeleteAccountPage` + 3 `shared/`) | **42** files in `Performer/pages/` |
| **Root / Public / Auth (`App.jsx`)** | **70+** (incl. `getAllUseCaseSlugs()` dynamic map, `/provider/*`, `/performer/*`, `/admin/*`, `/dev/*`, `/s/:code`, etc.) | — | 2 (`/otp`, `/deletion`, `/provider`) | — | — |

*(Note: In `ProviderApp.jsx`, `ProviderTaskSupportPage.jsx` is mounted on 4 sub-routes (`need-help`, `extend-deadline`, `task-changes`, `performer-issues`), so 45 component routes map to 43 unique page components; 4 additional `.jsx` files exist in `provider/pages/` (`AuthPage.jsx` and `WelcomePage.jsx` are mounted in `App.jsx`; `RatingsPage.jsx` and `RatingsReceivedPage.jsx` are orphaned/superseded by `SettingsPage` tabs).)*

---

## 2. Complete Provider Route Inventory (`ProviderApp.jsx` — 54 Entries)

| Section | Page Name | Route (`/provider/...`) | Component | Status | Backend Dependency |
|---|---|---|---|---|---|
| Auth / Onboarding | Restore Account | `restore-account` | `RestoreAccountPage` (shared) | Backend-Dependent | `restoreAccount` |
| Auth / Onboarding | Provider Onboarding | `onboarding` | `ProviderOnboardingPage` | Backend-Dependent | `createProviderProfile`, `onboardUser` |
| Auth / Onboarding | Forgot Password | `forgot-password` | `ForgotPasswordPage` | Backend-Dependent | Auth reset API |
| Auth / Onboarding | Check Email | `check-email` | `CheckEmailPage` | UI-Only | None |
| Auth / Onboarding | Change Password | `change-password` | `SharedChangePasswordPage` | Backend-Dependent | `changePassword` |
| Auth / Onboarding | Two-Factor Auth | `two-factor-auth` | `SharedTwoFactorAuthPage` | Backend-Dependent | `toggle2FA` |
| Core Workspace | Index Redirect | `""` (`index`) | `<Navigate to="/provider/dashboard" />` | Redirect | None |
| Core Workspace | Provider Dashboard | `dashboard` | `DashboardPage` | Functional (Verified) | `listMyTasks`, `getTaskerRankings`, `getProviderProfile` |
| Core Workspace | My Tasks | `my-tasks` | `MyTasksPage` | Functional (Verified) | `listMyTasks`, `publishTask`, `deleteTask` |
| Core Workspace | Chats | `chats` | `ChatsPage` | Functional (Verified) | `listConversations`, `getMessages`, `sendMessage` |
| Core Workspace | Account & Settings | `settings` | `SettingsPage` (12 views incl. Hub) | Functional (Verified) | Profile, Wallet, Transactions, Banks, Referrals, Reviews, Insights APIs |
| Talent Discovery | Task Performers | `task-performers` | `TaskPerformersPage` | Functional (Verified) | `getTaskerRankings` |
| Talent Discovery | Performer Profile (Dynamic) | `task-performer-profile/:name` | `TaskPerformerProfilePage` | Functional (Verified) | `getTaskerProfile`, `getTaskerReviewsList`, `sendTaskInvitation`, `getTaskInvitations` |
| Talent Discovery | Search | `search` | `SearchPage` | Functional | `getTaskerRankings`, `listMyTasks` |
| Talent Discovery | Explore Talent | `explore-talent` | `ExploreTalentPage` | Functional | `getTaskerRankings` |
| Talent Discovery | Saved Performers | `saved-performers` | `SavedPerformersPage` | Functional (Verified) | `getSavedPerformers`, `savePerformer`, `unsavePerformer` |
| Task Creation | Post Task Selection | `post-task-selection` | `PostTaskSelectionPage` | Functional (Verified) | Static |
| Task Creation | Post Task Manual | `post-task-manual` | `PostTaskManualPage` | Functional (Verified) | `listTaskCatalogDomains`, `listTaskCatalogServices`, `createTask`, `publishTask` |
| Task Creation | Post Task AI | `post-task-ai` | `PostTaskAIPage` | Functional (Verified) | `sendAiTaskMessage`, `createTask`, `generateAITask` |
| Task Creation | Task Templates | `task-templates` | `TaskTemplatesPage` | Functional (Verified) | `useHomeContent()` (`taskTemplates`) |
| Task Creation | Post Task Details (Legacy) | `post-task-details` | `PostTaskDetailsPage` | Partially Functional | `createTask`, `updateTask` |
| Task Creation | Post Task Results (Legacy) | `post-task-results` | `PostTaskSearchResultsPage` | Partially Functional | `getTaskerRankings` |
| Task Management | Task Status | `task-status` | `TaskStatusPage` | Functional | `getTaskDetails` |
| Task Management | Task Details | `task-details` | `TaskManagementPage` | Functional | `getTaskDetails`, `updateTask`, `publishTask` |
| Task Management | Task Activity | `task-activity` | `TaskActivityPage` | Functional | `getTaskDetails`, `getTaskUpdates` |
| Task Management | Task Applicants | `task-applicants` | `TaskApplicantsPage` | Functional (Verified) | `getTaskDetails`, `getTaskInterests`, `rejectInterest` |
| Task Management | Draft Tasks | `draft-tasks` | `DraftTasksPage` | Functional | `listMyTasks`, `deleteTask` |
| Task Management | Task History | `task-history` | `TaskHistoryPage` | Functional | `listMyTasks` |
| Task Management | Boost Task | `boost-task` | `BoostTaskPage` | Backend-Dependent | No live boost endpoint |
| Payment & Checkout | Confirm & Pay | `confirm-and-pay` | `ConfirmAndPayPage` | Functional (Verified) | `previewTaskPayment`, `listMyVouchers`, `createRazorpayOrder`, `verifyRazorpayPayment`, `acceptInterest`, `directHireTasker` |
| Payment & Checkout | Payment Selection | `payment-selection` | `PaymentSelectionPage` | UI-Only / Legacy | None |
| Payment & Checkout | Payment Success | `payment-success` | `PaymentSuccessPage` | Functional (Verified) | `location.state` payment receipt |
| Execution & Support | Active Task Execution (Dynamic) | `active-task/:id` | `ProviderActiveTaskExecutionPage` | Functional (Verified) | `getTaskDetails`, `getChecklist`, `getTaskUpdates`, `approveChecklistItem`, `approveChecklist`, `approveAssignment`, `completeTask`, `createTaskReview` |
| Execution & Support | Need Help (Dynamic) | `active-task/:id/need-help` | `ProviderTaskSupportPage` | UI-Only | None |
| Execution & Support | Extend Deadline (Dynamic) | `active-task/:id/extend-deadline` | `ProviderTaskSupportPage` | UI-Only | None |
| Execution & Support | Task Changes (Dynamic) | `active-task/:id/task-changes` | `ProviderTaskSupportPage` | UI-Only | None |
| Execution & Support | Performer Issues (Dynamic) | `active-task/:id/performer-issues` | `ProviderTaskSupportPage` | Functional | `getTaskDetails`, `createTaskDispute` |
| Account Actions | Agent Support | `agent-support` | `ProviderAgentSupportPage` | Functional | Support chat API |
| Account Actions | Switch to Performer | `switch-to-performer` | `SwitchToPerformerPage` | Backend-Dependent | Role switch API |
| Account Actions | Delete Account | `delete-account` | `DeleteAccountPage` | Backend-Dependent | `deleteAccount` |
| Info / SEO (7) | About, How It Works, Pricing, FAQ, Blog, City (`city/:citySlug`), Category (`category/:categorySlug`) | `about`, `how-it-works`, `pricing`, `faq`, `blog`, `city/:citySlug`, `category/:categorySlug` | 7 static info pages | UI-Only | None |
| Redirect Aliases (7) | Profile, Wallet, Support, Rewards, KYC, Internships, Catch-all | `profile`, `wallet`, `support`, `rewards`, `kyc`, `internships`, `*` | `<Navigate replace />` | Redirect | None |

---

## 3. Orphaned / Alias / Journey Screen Findings

- **Orphaned in `provider/pages/` (not mounted in `ProviderApp.jsx`):** `RatingsPage.jsx`, `RatingsReceivedPage.jsx` (superseded by `SettingsPage?tab=ratings` / `?tab=reviews`), while `AuthPage.jsx` and `WelcomePage.jsx` are mounted at root `/auth` and `/provider/welcome` in `App.jsx`.
- **Duplicate/Alias Routes:** `profile`, `wallet`, `support`, `rewards`, `kyc` redirect to `settings?tab=...`; `internships` redirects to `explore-talent`.
- **Actual Provider Lifecycle Screen Count:** **11 core Provider screens** (`DashboardPage` -> `PostTaskSelectionPage` -> `PostTaskManualPage` / `PostTaskAIPage` -> `TaskStatusPage` -> `TaskPerformersPage` -> `TaskApplicantsPage` -> `TaskPerformerProfilePage` -> `ConfirmAndPayPage` -> `PaymentSuccessPage` -> `ProviderActiveTaskExecutionPage`, plus `ProviderTaskSupportPage` for disputes) + **1 cross-role Performer screen** (`PerformerTaskAgreementPage` / `PerformerTaskInvitationPage`).
