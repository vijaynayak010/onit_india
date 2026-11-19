# FirstDoer — Phase 4: Complete Provider Page & Route Inventory

> **Scope:** Read-only audit of `apps/client/src/` (`ProviderApp.jsx`, `App.jsx`, `provider/pages/`, `provider/pages/settings/`, `shared/`).  
> **Counting Methodology:**
> - **Unique Provider page components** = distinct `.jsx` files representing full-page screens in `provider/pages/` (excluding modals, drawers, and sub-views embedded inside `SettingsPage.jsx`, which are counted separately under Query-Parameter Views).
> - **Route entries** = `<Route>` declarations in `ProviderApp.jsx` (51) plus direct Provider routes in `App.jsx` (3).
> - **Reused components** (e.g., `ProviderTaskSupportPage.jsx` used on 4 routes) are counted **once** as a unique component and **4 times** as route entries.

---

## 1. Exact Counts Summary

| Category | Count | Details |
|---|---|---|
| **1. Unique Provider page components** | **43 active** (+2 orphaned = **45** files) | 41 routed in `ProviderApp.jsx` + 2 routed in `App.jsx` (`AuthPage`, `WelcomePage`) + 2 orphaned (`RatingsPage`, `RatingsReceivedPage`); plus 14 active sub-views in `SettingsPage.jsx` and 5 stray root files in `client/src/components/provider/pages/` |
| **2. Provider route entries** | **51** (`ProviderApp.jsx`) + **3** (`App.jsx`) = **54** | 44 component routes + 5 `<Navigate>` aliases + 1 index redirect + 1 `*` catch-all in `ProviderApp.jsx` |
| **3. Dynamic Provider routes** | **4 patterns** (8 entries) | `active-task/:id` (+ 4 support sub-routes), `task-performer-profile/:name`, `city/:citySlug`, `category/:categorySlug` |
| **4. Query-parameter-based page views** | **6 pages** (16+ view states) | `SettingsPage` (`?tab=`, 12 tabs), `MyTasksPage` (`?tab=`, 4 tabs), `TaskApplicantsPage` (`?taskId=`, `?performerId=`), `TaskManagementPage` (`?taskId=`), `TaskStatusPage` (`?taskId=`), `TaskActivityPage` (`?taskId=`) |
| **5. Conditional workflow screens** | **5** | `PostTaskManualPage` (Step 1 Form / Step 2 Preview), `SettingsPage` (Wallet/AddFunds/Withdraw & Profile/Edit/AddOrg), `DeleteAccountPage` (3 steps), `ProviderOnboardingPage` (3 slides + referral) |
| **6. Modal & drawer workflows** | **10** | Hire Modal (`TaskPerformerProfilePage`), Phone Gate & Service Required Modals (`PostTaskManualPage`), Coupon & Razorpay Modals (`ConfirmAndPayPage`), `ReviewModal` & `RequestChangesModal` (`ProviderActiveTaskExecutionPage`), `AddJobDescriptionModal` (`ProfileView`), `NoTasksYetModal` (`ExploreTalentPage`), `ConfirmModal` (`MyTasksPage`), `ChatActionsMenu`/`ChatConfirmModal` (`ChatsPage`), Mobile Drawer (`ProviderHeader`) |
| **7. Shared pages used by Provider** | **3** (+1 cross-role) | `SharedChangePasswordPage`, `SharedTwoFactorAuthPage`, `RestoreAccountPage` (+ `ChatsPage` shared with Performer) |
| **8. Backend-data-dependent pages** | **26** | Pages/views requiring `services/api.js`, `ProviderDataContext`, or `taskId` / `taskerId` API responses |
| **9. Unreachable / orphaned pages** | **12 routed + 4 orphaned** (+5 stray) | Orphaned: `RatingsPage`, `RatingsReceivedPage`, `MyWorkView`, `TasksSettingsView`, + 5 root `client/` files. Routed with zero UI links: `AboutPage`, `HowItWorksPage`, `FAQPage`, `BlogPage`, `CityLandingPage`, `CategoryLandingPage`, `PaymentSelectionPage`, `PaymentSuccessPage`, `BoostTaskPage`, `PostTaskDetailsPage`, `PostTaskSearchResultsPage`, `ProviderAgentSupportPage` |
| **10. Linked but broken/missing** | **3 critical gaps** | No `/provider/task-agreement` page; no `/provider/invitations` page; `ConfirmAndPayPage:236` blocks `accepted_invitation` hires because `TaskPerformerProfilePage:308` omits `interestId` |

---

## 2. Complete Provider Page & Route Inventory

| Page Name | Route | File Path (`provider/pages/...` unless noted) | Parent Layout | How Users Reach It | Data / API Required | Browser-Tested (Ph 1A–3A) |
|---|---|---|---|---|---|---|
| **AuthPage** | `/auth`, `/signup`, `/register` | `AuthPage.jsx` | Standalone | Landing / `AuthRoleRedirect` | Auth0, OTP, `checkAccountExists` | Yes (Ph 1A) |
| **WelcomePage** | `/provider/welcome` | `WelcomePage.jsx` | Standalone | Post-login / `ChangePasswordPage` | `AuthContext` | No |
| **RestoreAccountPage** | `/provider/restore-account` | `shared/RestoreAccountPage.jsx` | Standalone | Deactivated account login | `cancelAccountDeletionRequest` | No |
| **ProviderOnboardingPage** | `/provider/onboarding` | `ProviderOnboardingPage.jsx` | Standalone | `RequireProviderOnboarding` | `applyReferralCode` | No |
| **DashboardPage** | `/provider/dashboard` | `DashboardPage.jsx` | `ProviderHeader` | Header Home / login redirect | `ProviderDataContext`, `useHomeContent` | Yes (Ph 2A, 3, 3A) |
| **MyTasksPage** | `/provider/my-tasks` | `MyTasksPage.jsx` | `ProviderHeader` | Header My Tasks / Dashboard KPIs | `listMyTasks`, `publishTask`, `cancelTask`, `deleteTask`, `deleteDraftTask` | No |
| **PostTaskSelectionPage** | `/provider/post-task-selection` | `PostTaskSelectionPage.jsx` | `ProviderHeader` | Header Post Task / Dashboard CTA | Static options | Yes (Ph 3, 3A) |
| **PostTaskManualPage** | `/provider/post-task-manual` | `PostTaskManualPage.jsx` | `ProviderHeader` | Selection page / Templates / Edit | `listTaskCatalogDomains`, `listTaskCatalogServices`, `createTask`, `updateTask`, `getPresignedUrl`, `confirmUpload`, `attachTaskFiles`, `generateAITask` | Yes (Ph 3, 3A — catalog services blocked in Test Mode) |
| **PostTaskAIPage** | `/provider/post-task-ai` | `PostTaskAIPage.jsx` | `ProviderHeader` | Selection page / Manual switch | `sendAiTaskMessage`, `listAiTaskConversations`, `postAiTaskConversation` | Yes (Ph 3, 3A) |
| **PostTaskDetailsPage** | `/provider/post-task-details` | `PostTaskDetailsPage.jsx` | `ProviderHeader` | Direct URL only (no UI link) | `createTask`, `getPresignedUrl` | No |
| **PostTaskSearchResultsPage** | `/provider/post-task-results` | `PostTaskSearchResultsPage.jsx` | `ProviderHeader` | Direct URL only (no UI link) | `listTaskers` / `searchTaskers` | No |
| **TaskManagementPage** | `/provider/task-details?taskId=` | `TaskManagementPage.jsx` | `ProviderFlowLayout` | `MyTasksPage` / `DashboardPage` | `getTaskDetails` | No |
| **TaskStatusPage** | `/provider/task-status?taskId=` | `TaskStatusPage.jsx` | `ProviderHeader` | Post-publish redirect | `getTaskDetails`, `getTaskInterests` | No |
| **TaskActivityPage** | `/provider/task-activity?taskId=` | `TaskActivityPage.jsx` | `ProviderFlowLayout` | `MyTasksPage` | `getTaskDetails`, `getTaskInterests` | No |
| **TaskApplicantsPage** | `/provider/task-applicants?taskId=` | `TaskApplicantsPage.jsx` | `ProviderHeader` | `DashboardActionCarousel` / `MyTasksPage` | `getTaskDetails`, `getTaskInterests`, `rejectInterest`, `getTaskerRankings` | No |
| **ExploreTalentPage** | `/provider/explore-talent` | `ExploreTalentPage.jsx` | `ProviderFlowLayout` | `TalentWaitingCard` | `getTaskerRankings` | Yes (Ph 2A) |
| **TaskPerformersPage** | `/provider/task-performers` | `TaskPerformersPage.jsx` | `ProviderHeader` | `DashboardPage` View All | `listTaskers`, `getTaskerRankings` | No |
| **SearchPage** | `/provider/search` | `SearchPage.jsx` | `ProviderHeader` | `ProviderHeader` search bar | `searchTaskers`, `listTaskers` | No |
| **TaskPerformerProfilePage** | `/provider/task-performer-profile/:name` | `TaskPerformerProfilePage.jsx` | `ProviderHeader` | Performer cards / `TaskApplicantsPage` | `getTaskerProfile`, `getTaskerReviewsList`, `listMyTasks`, `getTaskInterests`, `sendTaskInvitation`, `getTaskInvitations` | No |
| **SavedPerformersPage** | `/provider/saved-performers` | `SavedPerformersPage.jsx` | `ProviderHeader` | `MyWorkView` (unused) / direct | `getSavedPerformers`, `unsavePerformer` | No |
| **ConfirmAndPayPage** | `/provider/confirm-and-pay` | `ConfirmAndPayPage.jsx` | `ProviderHeader` | `TaskPerformerProfilePage` Hire | `previewTaskPayment`, `createRazorpayOrder`, `verifyRazorpayPayment`, `acceptInterest`, `directHireTasker`, `listMyVouchers` | No |
| **PaymentSelectionPage** | `/provider/payment-selection` | `PaymentSelectionPage.jsx` | `ProviderHeader` | Direct URL only | Static/state | No |
| **PaymentSuccessPage** | `/provider/payment-success` | `PaymentSuccessPage.jsx` | `ProviderHeader` | Direct URL only | Static/state | No |
| **ProviderActiveTaskExecutionPage** | `/provider/active-task/:id` | `ProviderActiveTaskExecutionPage.jsx` | `ProviderHeader` | `MyTasksPage` / `DashboardPage` / `ConfirmAndPayPage` | `getTaskDetails`, `getChecklist`, `approveChecklistItem`, `requestChecklistItemChange`, `approveChecklist`, `approveAssignment`, `completeTask`, `rejectAssignment`, `createTaskReview`, `getTaskUpdates`, `listConversations`, `sendMessage` | No |
| **ProviderTaskSupportPage** | `/provider/active-task/:id/{need-help,extend-deadline,task-changes,performer-issues}` | `ProviderTaskSupportPage.jsx` | `ProviderHeader` | `ProviderActiveTaskExecutionPage` | `createSupportTicket`, `createTaskDispute` | No |
| **ProviderAgentSupportPage** | `/provider/agent-support` | `ProviderAgentSupportPage.jsx` | `ProviderHeader` | Direct URL / notification | `listSupportTickets`, `createSupportTicket`, `addSupportMessage` | No |
| **BoostTaskPage** | `/provider/boost-task` | `BoostTaskPage.jsx` | `ProviderHeader` | Direct URL only (static UI) | None (mocked) | Yes (Ph 1A) |
| **TaskTemplatesPage** | `/provider/task-templates` | `TaskTemplatesPage.jsx` | `ProviderHeader` | `DashboardPage` BrowseCategoryGrid | `taskTemplates.js` | No |
| **DraftTasksPage** | `/provider/draft-tasks` | `DraftTasksPage.jsx` | `ProviderHeader` | Direct URL / `MyWorkView` | `listMyTasks` | No |
| **TaskHistoryPage** | `/provider/task-history` | `TaskHistoryPage.jsx` | `ProviderHeader` | Direct URL / `MyWorkView` | `listMyTasks` | No |
| **ChatsPage** | `/provider/chats` | `ChatsPage.jsx` | `ProviderHeader` | Header Chats | `listConversations`, `getMessages`, `sendMessage`, `markAsRead`, `createSupportTicket` | Yes (Ph 1A) |
| **SettingsPage** | `/provider/settings?tab=` | `SettingsPage.jsx` | `ProviderHeader` + Horizontal Tabs | Header Avatar Dropdown | `getProviderProfile`, `getWalletBalance`, `getTransactions`, `getPayoutMethods`, `listMyTasks`, `getMyReferralStats`, etc. | Yes (Ph 1A, 2A, 3A) |
| **SwitchToPerformerPage** | `/provider/switch-to-performer` | `SwitchToPerformerPage.jsx` | `ProviderHeader` | `SettingsView` | Static info | No |
| **DeleteAccountPage** | `/provider/delete-account` | `DeleteAccountPage.jsx` | `ProviderHeader` | `SettingsView` | `requestAccountDeletion` | No |
| **SharedChangePasswordPage** | `/provider/change-password` | `shared/SharedChangePasswordPage.jsx` | `ProviderHeader` | `CheckEmailPage` | None (`console.log` only) | No |
| **SharedTwoFactorAuthPage** | `/provider/two-factor-auth` | `shared/SharedTwoFactorAuthPage.jsx` | `ProviderHeader` | Direct URL only | None (`console.log` only) | No |
| **ForgotPasswordPage / CheckEmailPage** | `/provider/forgot-password`, `/provider/check-email` | `ForgotPasswordPage.jsx`, `CheckEmailPage.jsx` | Standalone | `ChangePasswordPage` / `SharedChangePasswordPage` | Static/email flow | No |
| **Portal Info Pages (6)** | `about`, `how-it-works`, `pricing`, `faq`, `blog`, `city/:citySlug`, `category/:categorySlug` | `AboutPage.jsx`, `HowItWorksPage.jsx`, `PricingPage.jsx`, `FAQPage.jsx`, `BlogPage.jsx`, `CityLandingPage.jsx`, `CategoryLandingPage.jsx` | `ProviderHeader` | `SubscriptionPlanView` → `/provider/pricing`; others direct URL only | Static | No |
| **Orphaned (2)** | — *(unrouted)* | `RatingsPage.jsx`, `RatingsReceivedPage.jsx` | — | Unreachable | None | No |
