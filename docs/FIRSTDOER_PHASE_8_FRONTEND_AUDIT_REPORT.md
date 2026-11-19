# FIRSTDOER — PHASE 8: FRONTEND AUDIT REPORT (STAGE 1)

> **Scope:** Frontend-only audit of `apps/client/**` (Provider + Performer portals + shared components) prior to Phase 8 enhancements. Protected files (`apps/server/**`, `apps/admin/**`, `AuthContext.jsx`, `App.jsx`, public landing pages) remain untouched.

---

## 1. Audited Routes & Components

- **Provider Portal (`ProviderApp.jsx`, 54 route entries / 43 unique mounted components):**
  - Core workspace: `DashboardPage.jsx`, `MyTasksPage.jsx`, `ChatsPage.jsx`, `SettingsPage.jsx` (`ProviderAccountHubView.jsx` + 11 subviews)
  - Task creation: `PostTaskSelectionPage.jsx`, `PostTaskManualPage.jsx`, `PostTaskAIPage.jsx`, `TaskTemplatesPage.jsx`, `TaskStatusPage.jsx`, `TaskManagementPage.jsx`, `TaskActivityPage.jsx`
  - Discovery & hiring: `TaskPerformersPage.jsx`, `TaskPerformerProfilePage.jsx`, `SavedPerformersPage.jsx`, `TaskApplicantsPage.jsx`, `ConfirmAndPayPage.jsx`, `PaymentSuccessPage.jsx`
  - Execution & support: `ProviderActiveTaskExecutionPage.jsx`, `ProviderTaskSupportPage.jsx`, `ProviderAgentSupportPage.jsx`
- **Performer Portal (`PerformerApp.jsx`, 51 route entries / 47 unique mounted components):**
  - Core workspace: `PerformerDashboardPage.jsx`, `PerformerNewHomePage.jsx`, `PerformerMyTasksPage.jsx`, `PerformerFindTasksPage.jsx`, `PerformerAllTasksPage.jsx`
  - Lifecycle: `PerformerInvitationsPage.jsx`, `PerformerTaskInvitationPage.jsx`, `PerformerTaskAgreementPage.jsx`, `PerformerTaskDetailsPage.jsx`, `PerformerActiveTaskExecutionPage.jsx`, `PerformerTaskAcceptedPage.jsx`
  - Account & finance: `PerformerAccountHubPage.jsx`, `PerformerProfilePage.jsx`, `PerformerEarningsPage.jsx`, `PerformerWalletPage.jsx`, `PerformerBankDetailsPage.jsx`, `PerformerRatingsPage.jsx`, `PerformerReferPage.jsx`, `PerformerSettingsPage.jsx`, `PerformerKycPage.jsx`

---

## 2. Prioritized Issue Backlog (P0–P3)

### P0 — Broken Functionality / Data Accuracy
1. **`PerformerMyTasksPage.jsx` (`Completed` tab `Earnings total` KPI):** Hardcoded `completedTasks.length * 1000` instead of summing actual `task.price` values (`₹2,000` displayed for `₹3,500 + ₹5,000 = ₹8,500`).
2. **`PerformerMyTasksPage.jsx` (`Pending` tab `Interests Sent`):** Completed/active tasks (`task-101`) remained listed under `Interests Sent -> Applied` after assignment/completion.

### P1 — Important UX & Navigation Issues
1. **`PostTaskManualPage.jsx` (`Use template` prefill):** Selecting a template from `TaskTemplatesPage.jsx` populated Title, Description, Budget, and Skills, but failed to map `templateData.category` (`"Development"`) to a matching catalog domain/service when catalog options loaded, leaving Category/Service unselected.
2. **`PerformerMyTasksPage.jsx` (`location` unused var):** Unused `location` variable flagged by ESLint.

### P2 — Visual Consistency & Typography Refinement
1. **Excessive `font-black` / `font-extrabold` across Provider & Performer portals:**
   - Provider: `MyTasksPage.jsx` (applicant counters/labels), `ConfirmAndPayPage.jsx`, `PostTaskManualPage.jsx`, `DraftTasksPage.jsx`.
   - Performer: `PerformerAccountHubPage.jsx`, `PerformerActiveTaskExecutionPage.jsx`, `PerformerReferPage.jsx`, `PerformerRatingsPage.jsx`, `PerformerProfilePage.jsx`.
2. **Focus & Accessibility Polish:** Ensure visible `focus-visible:ring-2` states on interactive buttons/cards and clean `<main>` landmarks across Performer & Provider workspaces.

### P3 — Minor Polish & Backend-Blocked Items (Documented Only)
1. **Backend-Blocked (Do Not Fake):** Cross-task `/provider/invitations`, Provider custom templates CRUD, per-task shortlist API, `BoostTaskPage` promotion API, Provider contract PDF, live Auth0/Razorpay/S3 verification.
2. **Legacy ESLint Cleanup:** Untouched public/blog/admin pages (`BlogList.jsx`, `BlogPost.jsx`, `About.jsx`, etc.) remain out of Phase 8 scope to avoid mass refactoring unrelated legacy modules.
