# FirstDoer — Complete Route Inventory

> **Source of truth:** `apps/client/src/App.jsx`, `ProviderApp.jsx`, `PerformerApp.jsx`, `AdminApp.jsx`, `data/useCases.js`.  
> **Total route entries:** 195 across 4 router files (84 in `App.jsx`, 51 in `ProviderApp.jsx`, 55 in `PerformerApp.jsx`, 5 in `AdminApp.jsx`).

---

## 1. Root & Public Routes (`apps/client/src/App.jsx`)

- **Landing & Auth:** `/` (`Landingpage`), `/home` (`Landingpage`), `/auth` (`AuthPage`), `/signup` (`AuthPage`), `/register` (`AuthPage`), `/otp` (redirect → `/auth`), `/providerlogin` (`AuthRoleRedirect`), `/performerlogin` (`AuthRoleRedirect`), `/provider/welcome` (`WelcomePage`), `/dev/*` (`AccessUnlockPage`).
- **Public Share & Verification:** `/s/:code` (`PublicSharePage`), `/verify-invoice` (`InvoiceVerificationPage`), `/test-explorer` (`ManualPageExplorer`).
- **Core Marketing & Info:** `/about`, `/what-is-onit-india`, `/what-is-firstdoer`, `/why-choose-us`, `/how-it-works`, `/execution-infrastructure`, `/for-providers`, `/for-performers`, `/freelancing`, `/pricing`, `/partner-with-us`, `/careers`, `/careers/thank-you`, `/contact`, `/contact/thank-you`, `/campus-detail`.
- **Tasks, Domains & Performers:** `/tasks`, `/tasks/:categorySlug`, `/task-guidelines`, `/task-performers`, `/performers-directory`, `/performer-verification-onboarding`, `/domains/:slug`, `/domains/:slug/:subDomainSlug`.
- **Use Cases (Dynamic from `useCases.js`):** `/use-cases` + 8 dynamic slugs (`/for-startups`, `/for-creators`, `/for-businesses`, `/for-marketers`, `/for-agencies`, `/for-enterprises`, `/for-researchers`, `/for-ecommerce`).
- **Services (10):** `/services` + 9 service landing pages (`retail-audit-services`, `field-data-collection-services`, `content-marketing-task-execution`, `market-research-assistance`, `social-media-content-creation-services`, `blog-writing-services-for-startups`, `seo-keyword-research-services`, `instagram-post-design-services`, `short-form-video-editing-services`).
- **Community (4) & Help (4):** `/community`, `/community/success-stories`, `/community/top-performers`, `/community/completed-tasks-examples`, `/help`, `/help/getting-started`, `/help/posting-your-first-task`, `/help/completing-your-first-task`.
- **Blog & Legacy Admin:** `/blog`, `/blog/:id`, `/admin-login`, `/admin-dashboard`, `/add-post`.
- **Legal (10):** `/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/faqs`, `/trust-safety`, `/policies/:slug`, `/cookie-policy`, `/dispute-resolution-policy`, `/payment-payout-policy`, `/prohibited-tasks-policy`, `/task-completion-proof-policy`.
- **Portal Mounts & Fallbacks:** `/provider` (redirect → `/provider/dashboard`), `/provider/*` (`GatedRoute > ProviderApp`), `/performer/*` (`GatedRoute > PerformerApp`), `/admin/*` (`GatedRoute > AdminApp`), `/deletion` (redirect → `/`), `*` (`NotFoundPage`).

---

## 2. Provider Portal Routes (`apps/client/src/components/provider/ProviderApp.jsx`)

All routes inside `<RequirePhoneVerification>` → `<ProviderDataProvider>` → `<RequireProviderOnboarding>` (except `restore-account` and `onboarding`).

| Route (`/provider/...`) | Component | Layout | Status / Notes |
|---|---|---|---|
| `restore-account` | `RestoreAccountPage` | Standalone | Working |
| `onboarding` | `ProviderOnboardingPage` | Standalone | Working |
| `index` / `*` | `Navigate` → `dashboard` | — | Catch-all |
| `dashboard` | `DashboardPage` | `ProviderHeader` (top nav) | Working; uses `ProviderDataContext` |
| `my-tasks` | `MyTasksPage` | `ProviderHeader` | Working (1,156 lines; uses `alert()`) |
| `task-details` | `TaskManagementPage` | `ProviderFlowLayout` | Working (expects `?taskId=`) |
| `task-applicants` | `TaskApplicantsPage` | `ProviderHeader` | Working (`?taskId=`; uses `window.confirm`) |
| `task-status` | `TaskStatusPage` | `ProviderHeader` | Working |
| `task-activity` | `TaskActivityPage` | `ProviderHeader` | Working |
| `active-task/:id` | `ProviderActiveTaskExecutionPage` | `ProviderHeader` | Working (1,331 lines; `alert()`) |
| `active-task/:id/need-help` (+3 kinds) | `ProviderTaskSupportPage` | `ProviderHeader` | Working (`need-help`, `extend-deadline`, `task-changes`, `performer-issues`) |
| `agent-support` | `ProviderAgentSupportPage` | `ProviderHeader` | Working |
| `post-task-selection` | `PostTaskSelectionPage` | `ProviderHeader` | Working |
| `post-task-manual` | `PostTaskManualPage` | `ProviderHeader` | Working (1,362 lines; `alert()`) |
| `post-task-ai` | `PostTaskAIPage` | `ProviderHeader` | Working (`AiPostingChatFlow`) |
| `post-task-details` | `PostTaskDetailsPage` | `ProviderHeader` | Working |
| `post-task-results` | `PostTaskSearchResultsPage` | `ProviderHeader` | Working |
| `boost-task` | `BoostTaskPage` | `ProviderHeader` | **UI ONLY / BROKEN** (hardcoded mock, no handlers, header overlap) |
| `explore-talent` | `ExploreTalentPage` | `ProviderFlowLayout` | Working |
| `task-performers` | `TaskPerformersPage` | `ProviderHeader` | Working |
| `search` | `SearchPage` | `ProviderHeader` | Working (952 lines) |
| `task-performer-profile/:name` | `TaskPerformerProfilePage` | `ProviderHeader` | Working (908 lines) |
| `saved-performers` | `SavedPerformersPage` | `ProviderHeader` | Working |
| `task-templates` | `TaskTemplatesPage` | `ProviderHeader` | Working |
| `draft-tasks` | `DraftTasksPage` | `ProviderHeader` | Working |
| `task-history` | `TaskHistoryPage` | `ProviderHeader` | Working |
| `chats` | `ChatsPage` | `ProviderHeader` | Working (2,664 lines; `"onit buddy"` leak) |
| `confirm-and-pay` | `ConfirmAndPayPage` | `ProviderHeader` | Working (Razorpay; `alert()`) |
| `payment-selection` / `payment-success` | `PaymentSelectionPage` / `PaymentSuccessPage` | `ProviderHeader` | Working |
| `settings` | `SettingsPage` | `ProviderHeader` + `ProviderSettingsSidebar` | **PARTIAL** (`SettingsView` has broken Sign Out `alert`, no-op Notification Settings, wrong policy links) |
| `switch-to-performer` | `SwitchToPerformerPage` | `ProviderHeader` | Working |
| `delete-account` | `DeleteAccountPage` | `ProviderHeader` | Working |
| `change-password` / `two-factor-auth` | `SharedChangePasswordPage` / `SharedTwoFactorAuthPage` | `ProviderHeader` | **NOT IMPLEMENTED** (`console.log` only) |
| `forgot-password` / `check-email` | `ForgotPasswordPage` / `CheckEmailPage` | Standalone | Email auth flows |
| `about`, `how-it-works`, `pricing`, `faq`, `blog`, `city/:citySlug`, `category/:categorySlug` | Portal info pages | `ProviderHeader` | Static/SEO wrappers inside portal |
| `profile`, `wallet`, `support`, `rewards`, `kyc`, `internships` | `Navigate` redirects | — | Redirects to `settings?tab=...` or `explore-talent` |

---

## 3. Performer Portal Routes (`apps/client/src/components/Performer/PerformerApp.jsx`)

All routes inside `<RequirePhoneVerification>` → `<RequirePerformerOnboarding>` (except `restore-account` and `onboarding`).

| Route (`/performer/...`) | Component | Layout | Status / Notes |
|---|---|---|---|
| `restore-account` | `RestoreAccountPage` | Standalone | Working |
| `onboarding` | `PerformerOnboardingPage` | Standalone | Working |
| `index` / `*` | `Navigate` → `dashboard` | — | Catch-all |
| `dashboard` | `PerformerDashboardPage` | `DashboardShell` + `PerformerHeader` | Working (has `fallbackTasks` mock & misleading Bookmark button) |
| `newHomePage` | `PerformerNewHomePage` | `PerformerHeader` (`ml-[220px]` bug) | **DUPLICATE** legacy dashboard |
| `find-tasks` / `all-tasks` | `PerformerFindTasksPage` / `PerformerAllTasksPage` | `PerformerHeader` (`ml-[220px]` bug) | Overlapping task discovery pages |
| `search-loading` / `search-results` | `PerformerSearchLoadingPage` / `PerformerSearchResultsPage` | `PerformerHeader` (`pl-[220px]` bug) | Search flow |
| `my-tasks` | `PerformerMyTasksPage` | `PerformerHeader` (`ml-[220px]` bug) | Working (737 lines) |
| `active-tasks`, `completed-tasks`, `applications` | Redirects → `my-tasks?tab=...` | — | Route aliases |
| `saved-tasks` | `PerformerSavedTasksPage` | `PerformerHeader` (`ml-[220px]` bug) | Working |
| `task/:id` | `PerformerTaskDetailsPage` | `PerformerHeader` | Working (874 lines) |
| `active-task/:id` | `PerformerActiveTaskExecutionPage` | `PerformerHeader` | Working (1,151 lines; `alert()`) |
| `task-accepted/:id`, `task-agreement/:id` | `PerformerTaskAcceptedPage`, `PerformerTaskAgreementPage` | `PerformerHeader` | Working |
| `invitations`, `invitation/:id` | `PerformerInvitationsPage`, `PerformerTaskInvitationPage` | `PerformerHeader` | Working |
| `client/:id` | `PerformerClientProfilePage` | `PerformerHeader` | Working (746 lines) |
| `chats` | `ChatsPage` | `PerformerHeader` (`pl: 220px` bug) | Working (2,664 lines) |
| `notifications` | `PerformerNotificationsPage` | `PerformerHeader` (`ml-[220px]` bug) | Working |
| `account` | `PerformerAccountHubPage` | `PerformerHeader` (`ml-[220px]` bug) | Working |
| `profile` | `PerformerProfilePage` | `PerformerHeader` (`ml-[220px]` bug) | Working (1,296 lines) |
| `kyc` | `PerformerKycPage` | `PerformerHeader` (`ml-[220px]` bug) | Working |
| `banks` | `PerformerBankDetailsPage` | `PerformerHeader` (`ml-[220px]` bug) | Working |
| `earnings`, `transactions`, `transactions/:id` | `PerformerEarningsPage`, `PerformerTransactionsPage`, `PerformerEarningsTransactionDetailsPage` | `PerformerHeader` (`ml-[220px]` bug) | Working |
| `wallet`, `wallet/withdraw`, `wallet/transactions`, `withdraw` | `PerformerWallet*` wrappers | `PerformerWalletLayout` | Working |
| `growth`, `daily-quiz`, `leaderboard`, `vouchers`, `ratings`, `refer` | Growth/engagement pages | `PerformerHeader` (`ml-[220px]` bug) | `PerformerGrowthPage` has mock fallback on error |
| `agent-support`, `task-support/:id` | `PerformerAgentSupportPage`, `PerformerTaskSupportPage` | `PerformerHeader` | Working |
| `settings`, `switch-to-provider`, `delete-account` | Settings & account actions | `PerformerHeader` (`ml-[220px]` bug) | Working |
| `change-password`, `two-factor-auth` | `SharedChangePasswordPage`, `SharedTwoFactorAuthPage` | `PerformerHeader` (`ml-[220px]` bug) | **NOT IMPLEMENTED** (`console.log` only); `/performer/forgot-password` missing |
| `support`, `rewards`, `internships` | `Navigate` redirects | — | Redirects to `settings`, `refer`, `find-tasks` |

---

## 4. Admin Routes (`apps/client/src/components/Admin/AdminApp.jsx`)

- `index` → redirect `performer-growth/daily-quizzes`
- `performer-growth` → redirect `/admin/performer-growth/daily-quizzes`
- `performer-growth/daily-quizzes` → `AdminDailyQuizPage`
- `daily-quizzes` → `AdminDailyQuizPage`
- `*` → redirect `performer-growth/daily-quizzes`
