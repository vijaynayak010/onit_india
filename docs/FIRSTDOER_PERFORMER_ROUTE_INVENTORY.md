# FIRSTDOER — COMPLETE PERFORMER ROUTE INVENTORY

> **Source Inspected:** `apps/client/src/components/Performer/PerformerApp.jsx` (direct code inspection).
> **Counts:** **51** `<Route>` entries (`46` component routes + `5` index/redirect/catch-all routes) mapping to **47** unique page components (`42` in `Performer/pages/` + `ChatsPage`, `DeleteAccountPage` + `3` `shared/` pages).

| # | Route (`/performer/...`) | Component | Page Purpose | Entry Points | Lifecycle Stage | Status | Test Coverage (Phase 8 Equal QA) |
|---|---|---|---|---|---|---|---|
| 1 | `index` | `<Navigate to="/performer/dashboard" />` | Default redirect | `/performer` | Entry | Redirect | PASS |
| 2 | `dashboard` | `PerformerDashboardPage.jsx` | Performer home, KPIs, recommended tasks, skill categories | Header/Sidebar `Home` | Discovery | Functional | **PASS** (defects logged) |
| 3 | `newHomePage` | `PerformerNewHomePage.jsx` | Alternate Performer home view | Direct URL | Discovery | Functional | NOT TESTED |
| 4 | `find-tasks` | `PerformerFindTasksPage.jsx` | Browse, search & filter open tasks | Dashboard, Sidebar | Discovery | Functional | **PASS** |
| 5 | `search-loading` | `PerformerSearchLoadingPage.jsx` | Search transition loader | Search flow | Discovery | UI-Only | NOT TESTED |
| 6 | `search-results` | `PerformerSearchResultsPage.jsx` | Search results listing | Search flow | Discovery | Functional | NOT TESTED |
| 7 | `task/:id` | `PerformerTaskDetailsPage.jsx` | Task details, save, express interest | `Find Tasks`, `Dashboard` | Interest | Partial (Test Mode interest persistence bug) | **PASS (with defects)** |
| 8 | `saved-tasks` | `PerformerSavedTasksPage.jsx` | Bookmarked tasks & unsave | Account / Sidebar | Discovery | Functional | **PASS** |
| 9 | `task-accepted/:id` | `PerformerTaskAcceptedPage.jsx` | Interest sent confirmation | `PerformerTaskDetailsPage` | Interest | Functional | **PASS** |
| 10 | `invitations` | `PerformerInvitationsPage.jsx` | Received invitations list | Sidebar `Invitations` | Invitation | Partial (Test Mode `/taskers/me/invitations` gap) | **PASS (empty state)** |
| 11 | `invitation/:id` | `PerformerTaskInvitationPage.jsx` | View & accept/decline invitation | Notifications / Invitations | Invitation | Partial (Test Mode accept error on new task) | **PASS / FAIL on new task** |
| 12 | `task-agreement/:id` | `PerformerTaskAgreementPage.jsx` | Review terms & `Accept & Start` / `Decline` | Invitation flow | Agreement | Functional | **PASS** |
| 13 | `my-tasks` | `PerformerMyTasksPage.jsx` | `Active`, `Pending`, `Completed` task tabs & earnings | Sidebar `My Tasks` | Execution / Completion | Functional | **PASS (milestone sync note)** |
| 14 | `all-tasks` | `PerformerAllTasksPage.jsx` | Full task history | Account Hub | Execution | Functional | NOT TESTED |
| 15 | `active-tasks` | `PerformerActiveTasksPage.jsx` | Active tasks shortcut | Direct URL | Execution | Functional | NOT TESTED |
| 16 | `completed-tasks` | `PerformerCompletedTasksPage.jsx` | Redirect/view completed tasks | Account Hub | Completion | Functional | **PASS (via `/performer/my-tasks`)** |
| 17 | `applications` | `PerformerApplicationsPage.jsx` | Applications list | Account Hub | Interest | Functional | NOT TESTED |
| 18 | `active-task/:id` | `PerformerActiveTaskExecutionPage.jsx` | Task details, updates, checklist submission, files, chat | `My Tasks` -> `View details` | Execution | **FAIL** (checklist/update submit & mobile/tablet bugs) | **FAIL** |
| 19 | `task-support/:id` | `PerformerTaskSupportPage.jsx` | Report issue / support for task | Active Task `Report an issue` | Dispute | Functional | **PASS (navigated)** |
| 20 | `client/:id` | `PerformerClientProfilePage.jsx` | View Provider profile | Task Details | Discovery | Functional | NOT TESTED |
| 21 | `chats` | `ChatsPage.jsx` (shared) | Performer–Provider & Support messaging | Sidebar `Messages`, `Open Chat` | Execution | **FAIL** (mobile thread overflow & deep-link) | **FAIL** |
| 22 | `account` | `PerformerAccountHubPage.jsx` | Account overview hub | Header Avatar / Sidebar `Account` | Account | **PASS (visual ring overlap)** | **PASS (with visual defect)** |
| 23 | `profile` | `PerformerProfilePage.jsx` | Edit personal details, skills, portfolio | Account Hub | Account | Functional | **PASS** |
| 24 | `earnings` | `PerformerEarningsPage.jsx` | Earnings overview & filters | Account Hub | Finance | Functional | **PASS** |
| 25 | `transactions` | `PerformerTransactionsPage.jsx` | Transaction ledger | Account Hub | Finance | Functional | **PASS** |
| 26 | `transactions/:id` | `PerformerEarningsTransactionDetailsPage.jsx` | Single transaction details | Transactions | Finance | Functional | NOT TESTED |
| 27 | `wallet` | `PerformerWalletPage.jsx` | Wallet balance & actions | Account Hub | Finance | Functional | **PASS** |
| 28 | `wallet/withdraw`, `withdraw` | `PerformerWalletWithdrawPage.jsx`, `PerformerWithdrawPage.jsx` | Withdraw funds | Wallet | Finance | Backend-Dependent | NOT TESTED |
| 29 | `wallet/transactions` | `PerformerWalletTransactionsPage.jsx` | Wallet transactions | Wallet | Finance | Functional | NOT TESTED |
| 30 | `banks` | `PerformerBankDetailsPage.jsx` | Bank & UPI payout accounts | Account Hub | Finance | **PASS (empty UPI label)** | **PASS (with defect)** |
| 31 | `kyc` | `PerformerKycPage.jsx` | Identity & selfie KYC verification | Account Hub | Verification | Backend-Dependent | **PASS (raw dev string)** |
| 32 | `ratings` | `PerformerRatingsPage.jsx` | Ratings received | Account Hub | Reputation | Functional | **PASS** |
| 33 | `refer` | `PerformerReferPage.jsx` | Referral code & rewards | Account Hub | Referrals | Functional | **PASS** |
| 34 | `growth` | `PerformerGrowthPage.jsx` | Performer growth & learning | Account Hub | Growth | Functional | **PASS** |
| 35 | `daily-quiz` | `PerformerDailyQuizPage.jsx` | Daily skill quiz | Growth | Growth | Functional | **PASS** |
| 36 | `leaderboard` | `PerformerLeaderboardPage.jsx` | Performer rankings | Growth | Growth | Functional | **PASS** |
| 37 | `vouchers` | `PerformerVouchersPage.jsx` | Earned vouchers | Account Hub | Rewards | Functional | **PASS** |
| 38 | `notifications` | `PerformerNotificationsPage.jsx` | Notification center & `Mark all read` | Header Bell / Sidebar | Account | **PASS (Provider notif leak)** | **PASS (with defect)** |
| 39 | `settings` | `PerformerSettingsPage.jsx` | Preferences & account actions | Account Hub | Account | Functional | **PASS** |
| 40–47 | `agent-support`, `switch-to-provider`, `delete-account`, `restore-account`, `onboarding`, `change-password`, `two-factor-auth`, + 4 redirects (`support`, `rewards`, `internships`, `*`) | Various / Shared / `<Navigate />` | Support, role switch, auth, redirects | Settings / Auth | Account / Auth | Backend-Dependent / Redirects | NOT TESTED |
