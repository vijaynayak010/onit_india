# FIRSTDOER — PHASE 6: COMPLETE PROVIDER UI AUDIT

## 1. Reconciled Provider Page & Route Counts

Inspected `apps/client/src/components/provider/ProviderApp.jsx`, `apps/client/src/App.jsx`, `apps/client/src/components/provider/pages/`, `apps/client/src/components/provider/pages/settings/`, and `apps/client/src/components/shared/`:

| Metric | Reconciled Count | Details |
|---|---|---|
| **Unique Provider page components** | **43 active** (+2 orphaned = **45** `.jsx` files in `provider/pages/`) | 41 routed in `ProviderApp.jsx` + 2 in `App.jsx` (`AuthPage`, `WelcomePage`) + 2 orphaned (`RatingsPage`, `RatingsReceivedPage`); plus 19 sub-view/modal files in `provider/pages/settings/` |
| **Provider route entries** | **54 total** (`51` in `ProviderApp.jsx` + `3` in `App.jsx`) | 44 component routes + 5 `<Navigate>` aliases + 1 index redirect + 1 `*` catch-all in `ProviderApp.jsx`; `/auth`, `/signup`, `/register` in `App.jsx` |
| **Dynamic routes** | **4 patterns (8 route entries)** | `active-task/:id` (+ 4 support sub-routes), `task-performer-profile/:name`, `city/:citySlug`, `category/:categorySlug` |
| **Query-parameter views** | **6 pages (16+ states)** | `SettingsPage` (`?tab=`, 12 tabs), `MyTasksPage` (`?tab=`, 4 tabs), `TaskApplicantsPage` (`?taskId=`), `TaskManagementPage` (`?taskId=`), `TaskStatusPage` (`?taskId=`), `TaskActivityPage` (`?taskId=`) |
| **Conditional workflow screens** | **5** | `PostTaskManualPage` (Form / Preview), `SettingsPage` (Wallet / AddFunds / Withdraw & Profile / Edit / AddOrg), `DeleteAccountPage` (3 steps), `ProviderOnboardingPage` (slides + referral) |
| **Modal & drawer workflows** | **10** | Hire Modal (`TaskPerformerProfilePage`), Phone Gate & Service Required (`PostTaskManualPage`), Coupon & Razorpay (`ConfirmAndPayPage`), `ReviewModal` & `RequestChangesModal` (`ProviderActiveTaskExecutionPage`), `AddJobDescriptionModal` (`ProfileView`), `NoTasksYetModal` (`ExploreTalentPage`), `ConfirmModal` (`MyTasksPage`), `ChatActionsMenu` / `ChatConfirmModal` (`ChatsPage`), Mobile Drawer (`ProviderHeader`) |
| **Shared pages used by Provider** | **3 (+1 cross-role)** | `SharedChangePasswordPage`, `SharedTwoFactorAuthPage`, `RestoreAccountPage` (+ `ChatsPage` shared with Performer) |
| **Unreachable / orphaned pages** | **12 routed + 2 orphaned** | Orphaned: `RatingsPage`, `RatingsReceivedPage`. Routed with no main nav link: `AboutPage`, `HowItWorksPage`, `FAQPage`, `BlogPage`, `CityLandingPage`, `CategoryLandingPage`, `PaymentSelectionPage`, `PaymentSuccessPage` (fallback), `BoostTaskPage`, `PostTaskDetailsPage`, `PostTaskSearchResultsPage`, `ProviderAgentSupportPage` |
| **Broken / missing destinations** | **2 backend-dependent gaps** | No `/provider/task-agreement` page; no `/provider/invitations` list page (handled per-task/per-performer via `TaskPerformerProfilePage`) |

---

## 2. Complete Provider Page Audit & Classification

### A. Dashboard & Discovery
| Page | Route | Layout | Classification | Findings & Improvements |
|---|---|---|---|---|
| `DashboardPage.jsx` | `/provider/dashboard` | `ProviderHeader` | **Minor improvement** | `BrowseCategoryGrid` `h2` overridden to 36px by unlayered `index.css`; Test Mode `/taskers/rankings` shows `0.0/5` / `0 Tasks` / `No bio available` due to missing `ratingAvg` / `completedTasksCount` / `bio` fields in mock rankings |
| `ExploreTalentPage.jsx` | `/provider/explore-talent` | `ProviderHeader` / Flow | **Minor improvement** | Align heading scale and card typography to `.dash-*` tokens |
| `SearchPage.jsx` | `/provider/search` | `ProviderHeader` | **Minor improvement** | 16 oversized/heavy typography occurrences (`text-3xl`, `font-black`); standardize to `.dash-page-title` & `#F5FAFA` canvas |

### B. Task Management
| Page | Route | Layout | Classification | Findings & Improvements |
|---|---|---|---|---|
| `MyTasksPage.jsx` | `/provider/my-tasks` | `ProviderHeader` | **Minor improvement** | Off-system `bg-[#f8fafc]` / `bg-emerald-*` and `font-black` weights; standardize to `#F5FAFA` & `#10605F` |
| `TaskApplicantsPage.jsx` | `/provider/task-applicants?taskId=` | `ProviderHeader` | **Minor improvement** | Uses `bg-[#f8fafc]` / `#16a34a` / `font-black` / `pt-[110px]`; standardize canvas, `pt-[80px]`, typography, and `#10605F` buttons |
| `TaskManagementPage.jsx` | `/provider/task-details?taskId=` | `ProviderHeader` | **Minor improvement** | Standardize heading scale and heavy font weights |
| `TaskStatusPage.jsx` | `/provider/task-status?taskId=` | `ProviderHeader` | **Minor improvement** | Standardize heading scale and button hierarchy |
| `TaskActivityPage.jsx` | `/provider/task-activity?taskId=` | `ProviderHeader` | **Minor improvement** | Standardize heading scale and heavy font weights |
| `DraftTasksPage.jsx` | `/provider/draft-tasks` | `ProviderHeader` | **Good — no redesign required** | Minor typography weight cleanup |
| `TaskHistoryPage.jsx` | `/provider/task-history` | `ProviderHeader` | **Good — no redesign required** | Minor typography weight cleanup |
| `BoostTaskPage.jsx` | `/provider/boost-task` | `ProviderHeader` | **Minor improvement (Backend-dependent)** | Static promotional UI; uses `bg-emerald-*` and oversized headings; standardize to `#F5FAFA` & `#10605F` |

### C. Talent Management
| Page | Route | Layout | Classification | Findings & Improvements |
|---|---|---|---|---|
| `TaskPerformersPage.jsx` | `/provider/task-performers` | `ProviderHeader` | **Minor improvement** | `<h1>` overridden to 48px by unlayered `index.css`; fix via `@layer base` + `.dash-page-title` |
| `TaskPerformerProfilePage.jsx` | `/provider/task-performer-profile/:name` | `ProviderHeader` | **Minor improvement** | Standardize `.dash-page-title` and reduce `font-black` / `font-extrabold` badges |
| `SavedPerformersPage.jsx` | `/provider/saved-performers` | `ProviderHeader` | **Good — no redesign required** | Verify card consistency & empty state |

### D. Task Creation
| Page | Route | Layout | Classification | Findings & Improvements |
|---|---|---|---|---|
| `PostTaskSelectionPage.jsx` | `/provider/post-task-selection` | `ProviderHeader` | **Good — no redesign required** | Verify heading scale under `@layer base` |
| `PostTaskAIPage.jsx` | `/provider/post-task-ai` | `ProviderHeader` | **Minor improvement** | `AiPostingChatFlow` / `AIChatTaskFlow` use `font-black` and oversized headings |
| `PostTaskManualPage.jsx` | `/provider/post-task-manual` | `ProviderHeader` | **Minor improvement** | 12 oversized/heavy typography instances (`text-3xl`, `font-black`) |
| `PostTaskDetailsPage.jsx` | `/provider/post-task-details` | `ProviderHeader` | **Minor improvement** | Direct-URL legacy page; align heading scale |
| `PostTaskSearchResultsPage.jsx` | `/provider/post-task-results` | `ProviderHeader` | **Minor improvement** | Direct-URL legacy page; align `#f8fafc` & typography |
| `TaskTemplatesPage.jsx` | `/provider/task-templates` | `ProviderHeader` | **Good — no redesign required** | Minor typography weight cleanup |

### E. Hiring, Payment & Execution
| Page | Route | Layout | Classification | Findings & Improvements |
|---|---|---|---|---|
| `ConfirmAndPayPage.jsx` | `/provider/confirm-and-pay` | `ProviderHeader` | **Minor improvement** | Replace remaining `#16a34a` / `#0f172a` / `#64748b` / `font-black` in card internals with FirstDoer `#10605F` / `#172B2B` / `#647575` & `.dash-page-title` |
| `PaymentSelectionPage.jsx` | `/provider/payment-selection` | `ProviderHeader` | **Minor improvement** | Uses `#16a34a` / `#fcfdfd`; align to `#F5FAFA` & `#10605F` |
| `PaymentSuccessPage.jsx` | `/provider/payment-success` | `ProviderHeader` | **Good — no redesign required** | Updated in Phase 5A; standardize heading to `.dash-page-title` |
| `ProviderActiveTaskExecutionPage.jsx` | `/provider/active-task/:id` | `ProviderHeader` | **Minor improvement** | Standardize `.dash-page-title` and reduce `font-black` labels |
| `ProviderTaskSupportPage.jsx` | `/provider/active-task/:id/*` | `ProviderHeader` | **Good — no redesign required** | Updated in Phase 5A/5B |

### F. Communication, Account, Finance & Auth
| Page | Route | Layout | Classification | Findings & Improvements |
|---|---|---|---|---|
| `ChatsPage.jsx` | `/provider/chats` | `ProviderHeader` | **Good — no redesign required** | Verify mobile & desktop chat layout |
| `ProviderAgentSupportPage.jsx` | `/provider/agent-support` | `ProviderHeader` | **Good — no redesign required** | Breadcrumb removed in Phase 5A |
| `SettingsPage.jsx` (+ 19 `settings/*` views: `ProviderAccountHubView`, `ProfileView`, `EditProfileForm`, `AddOrgForm`, `WalletView`, `AddFundsView`, `WithdrawView`, `TransactionsView`, `BanksDetailsView`, `SubscriptionPlanView`, `AllTasksView`, `ProviderInsightsView`, `RatingsView`, `ReviewsView`, `ReferEarnView`, `SettingsView`) | `/provider/settings?tab=` (`home`, `profile`, `wallet`, `transactions`, `banks`, `subscription`, `all_tasks`, `insights`, `ratings`, `reviews`, `refer`, `settings`) | `ProviderHeader` (no secondary nav bar) | **Good — Redesigned in Phase 6** | Removed redundant second horizontal `ACCOUNT_NAV_TABS` bar, duplicate standalone Wallet card, and redundant `Post a Task` / `Notifications` / `Organization` cards from Account Overview; consolidated into `Account` (`My Profile` incl. Organization details, `Security & Settings`), `Finance` (`Wallet`, `Transaction History`, `Bank Details`, `Subscription Plan`), `Tasks & Performance` (`Active Tasks`, `Completed Tasks`, `All Tasks`, `Ratings Received`, `Reviews Given`, `Provider Insights`), and `Referrals` (`Refer & Earn`), with `Back to Account Overview` on all subpages |
| `SwitchToPerformerPage.jsx`, `DeleteAccountPage.jsx`, `ProviderOnboardingPage.jsx`, `WelcomePage.jsx` | Various | `ProviderHeader` / Standalone | **Good — no redesign required** | Minor heading scale alignment |
| `AuthPage.jsx`, `ForgotPasswordPage.jsx`, `CheckEmailPage.jsx`, `ChangePasswordPage.jsx`, `SharedChangePasswordPage.jsx`, `SharedTwoFactorAuthPage.jsx`, `RestoreAccountPage.jsx` | Auth / Security | Standalone / `ProviderHeader` | **Good — no redesign required** | Minor heading scale alignment |
| Portal Info Pages (`AboutPage`, `HowItWorksPage`, `PricingPage`, `FAQPage`, `BlogPage`, `CityLandingPage`, `CategoryLandingPage`) | `/provider/*` | `ProviderHeader` | **Good — no redesign required** | Static informational routes |
| Orphaned (`RatingsPage.jsx`, `RatingsReceivedPage.jsx`) | Unrouted | — | **Unreachable** | Do not delete; left untouched |

---

## 3. Prioritized Improvement List

1. **Priority 1 (Global Root Cause):** Wrap unlayered `h1–h6` and `button` rules in `apps/client/src/index.css` inside `@layer base { ... }` and standardize `.dash-page-title` (`20px–24px`), `.dash-section-title` (`18px–20px`), `.dash-subsection-title` (`16px`), `.dash-card-title` (`15px`), `.dash-body` (`14px`), `.dash-body-compact` (`13px`), `.dash-label` (`12px`), `.dash-caption` (`12px`), `.dash-overline` (`11px`).
2. **Priority 2 (Dashboard & Talent):** Fix `DashboardPage` Verified Performers Test Mode `/taskers/rankings` payload (`ratingAvg`, `completedTasksCount`, `bio`, `profession`) and verify `BrowseCategoryGrid` + `TaskPerformersPage` headings render at compact SaaS sizes (`14–16px` / `20–24px`).
3. **Priority 3 (Task Management & Creation):** Standardize `MyTasksPage`, `TaskApplicantsPage`, `SearchPage`, `BoostTaskPage`, `PostTaskManualPage`, `PostTaskAIPage`, `TaskManagementPage`, `TaskStatusPage`, `TaskActivityPage` to `#F5FAFA`, `#10605F`, `.dash-*` typography, and remove excessive `font-black` / `font-extrabold`.
4. **Priority 4 (Hiring, Payment & Account/Settings):** Finish `#16a34a` -> `#10605F` & typography cleanup in `ConfirmAndPayPage`, `PaymentSelectionPage`, `ProviderActiveTaskExecutionPage`, and `settings/*` views.
5. **Priority 5 (Performer Typography Consistency):** Apply `.dash-*` / compact heading scale & reduce oversized `text-3xl`/`font-black` in Performer pages without changing Performer layouts.
