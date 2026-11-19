# FIRSTDOER — PROVIDER PAGE INVENTORY FINAL

> **Reconciled Directly Against:** `apps/client/src/components/provider/ProviderApp.jsx`, `apps/client/src/components/Performer/PerformerApp.jsx`, `apps/client/src/App.jsx`, and `apps/client/src/components/provider/pages/`.

---

## 1. Exact Route & Component Counts

- **Provider (`ProviderApp.jsx`):**
  - **Total `<Route>` entries:** **54**
  - **Component routes:** **45**
  - **Unique page components mounted:** **43** (`40` Provider-specific components + `3` shared components: `SharedChangePasswordPage`, `SharedTwoFactorAuthPage`, `RestoreAccountPage`; `ProviderTaskSupportPage` is reused across `4` sub-routes: `need-help`, `extend-deadline`, `task-changes`, `performer-issues`).
  - **Redirect / Index / Catch-all routes:** **9** (`index`, `profile`, `wallet`, `support`, `rewards`, `kyc`, `internships`, `*`, plus `ProviderDeleteAccountRoute` wrapper on `delete-account`).
  - **Dynamic routes:** **7** (`active-task/:id`, `active-task/:id/need-help`, `active-task/:id/extend-deadline`, `active-task/:id/task-changes`, `active-task/:id/performer-issues`, `task-performer-profile/:name`, `city/:citySlug`, `category/:categorySlug` -> **8** parameterized route patterns).
  - **Page files in `provider/pages/`:** **44** `.jsx` files (`40` mounted in `ProviderApp.jsx`, `2` mounted in `App.jsx` [`AuthPage.jsx`, `WelcomePage.jsx`], and `2` unmounted/orphaned [`RatingsPage.jsx`, `RatingsReceivedPage.jsx`]).
- **Performer (`PerformerApp.jsx`):** **51** `<Route>` entries (`46` component routes, `5` redirects/index) mapping to **47** unique page components (`42` in `Performer/pages/` + `ChatsPage`, `DeleteAccountPage`, and `3` `shared/` pages).
- **Browser QA Coverage Summary (Phase 6B + Pre-Phase 7):** **24** Provider routes/tabs browser-tested in Test Mode (`0` HTTP errors); remaining auth/account-mutation/static SEO routes (`forgot-password`, `check-email`, `change-password`, `two-factor-auth`, `onboarding`, `restore-account`, `delete-account`, `switch-to-performer`, `agent-support`, `boost-task`, `payment-selection`, `draft-tasks`, `task-history`, `explore-talent`, `search`, `post-task-details`, `post-task-results`, and `7` static info pages) are documented as **Not Browser-Tested** or **Backend-Dependent**.

---

## 2. Complete Provider Route Table (54 Entries)

| # | Route (`/provider/...`) | Component | Entry Point(s) | Dynamic Params | Status | Browser Tested? |
|---|---|---|---|---|---|---|
| 1 | `index` | `<Navigate to="/provider/dashboard" />` | `/provider` | — | Redirect | Yes |
| 2 | `dashboard` | `DashboardPage.jsx` | Header `Home`, login | — | Functional | **Yes (9 viewports)** |
| 3 | `settings` | `SettingsPage.jsx` (12 views) | Header Avatar | `?tab=` | Functional | **Yes (9 viewports + all rows)** |
| 4 | `my-tasks` | `MyTasksPage.jsx` | Header `My Tasks`, KPIs, Account | `?tab=` | Functional | **Yes (9 viewports)** |
| 5 | `chats` | `ChatsPage.jsx` | Header `Chats` | — | Functional | **Yes (9 viewports)** |
| 6 | `task-performers` | `TaskPerformersPage.jsx` | Header search, Dashboard `View all` | — | Functional | **Yes (9 viewports)** |
| 7 | `task-performer-profile/:name` | `TaskPerformerProfilePage.jsx` | Performers, Applicants, Dashboard | `:name` (ID/slug) | Functional | **Yes (9 viewports + hire)** |
| 8 | `saved-performers` | `SavedPerformersPage.jsx` | Account `Saved Performers` | — | Functional | **Yes (1440 & 375)** |
| 9 | `task-templates` | `TaskTemplatesPage.jsx` | Dashboard categories, Account `Saved Templates` | — | Functional | **Yes (1440 & 375)** |
| 10 | `post-task-selection` | `PostTaskSelectionPage.jsx` | Header `Post Task`, Dashboard CTA | — | Functional | **Yes (1440 & 375)** |
| 11 | `post-task-manual` | `PostTaskManualPage.jsx` | Selection, Templates | — | Functional | **Yes (1440 & 375)** |
| 12 | `post-task-ai` | `PostTaskAIPage.jsx` | Selection | — | Functional | **Yes (9 viewports)** |
| 13 | `task-applicants` | `TaskApplicantsPage.jsx` | KPI, `MyTasksPage`, `TaskStatusPage` | `?taskId=` | Functional | **Yes (9 viewports)** |
| 14 | `confirm-and-pay` | `ConfirmAndPayPage.jsx` | Applicants, Performer Profile | — | Functional | **Yes (1440 checkout)** |
| 15 | `payment-success` | `PaymentSuccessPage.jsx` | `ConfirmAndPayPage` | — | Functional | **Yes (fallback + flow)** |
| 16 | `active-task/:id` | `ProviderActiveTaskExecutionPage.jsx` | `MyTasksPage`, `ConfirmAndPayPage` | `:id` | Functional | **Yes (9 viewports + E2E)** |
| 17 | `active-task/:id/performer-issues` | `ProviderTaskSupportPage.jsx` | Active Task `Report an issue` | `:id` | Functional | **Yes (1440 & 375)** |
| 18 | `task-status` | `TaskStatusPage.jsx` | Post Task creation | `?taskId=` | Functional | **Yes (1440 & 375)** |
| 19 | `task-details` | `TaskManagementPage.jsx` | `MyTasksPage` | `?taskId=` | Functional | **Yes (1440 & 375)** |
| 20 | `task-activity` | `TaskActivityPage.jsx` | `TaskManagementPage` | `?taskId=` | Functional | **Yes (1440 & 375)** |
| 21–23 | `active-task/:id/{need-help,extend-deadline,task-changes}` | `ProviderTaskSupportPage.jsx` | Active Task support links | `:id` | UI-Only | No |
| 24–25 | `post-task-details`, `post-task-results` | `PostTaskDetailsPage.jsx`, `PostTaskSearchResultsPage.jsx` | Legacy post-task flow | — | Partially Functional | No |
| 26–30 | `search`, `explore-talent`, `draft-tasks`, `task-history`, `boost-task` | 5 dedicated pages | Search bar / MyTasks / direct | — | Functional / Boost Backend-Dependent | No |
| 31–38 | `onboarding`, `restore-account`, `forgot-password`, `check-email`, `change-password`, `two-factor-auth`, `switch-to-performer`, `delete-account`, `agent-support`, `payment-selection` | 10 Auth/Account/Legacy pages (incl. shared) | Auth / Settings | — | Backend-Dependent / UI-Only | No |
| 39–45 | `about`, `how-it-works`, `pricing`, `faq`, `blog`, `city/:citySlug`, `category/:categorySlug` | 7 static info/SEO pages | Deep links | `:citySlug`, `:categorySlug` | UI-Only | No |
| 46–54 | `profile`, `wallet`, `support`, `rewards`, `kyc`, `internships`, `*` | `<Navigate replace />` (7 aliases + `*`) | Legacy URLs | — | Redirect | No |
