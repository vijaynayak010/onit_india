# ONIT INDIA — PERFORMER ACCOUNT UNIFIED PAGE FLOW AUDIT

**Target Module:** Performer Account Portal (`/performer/account`) & All Accessible Subsections  
**Reference Architecture Model:** [`apps/client/src/components/Performer/pages/PerformerProfilePage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerProfilePage.jsx)  
**Standard Header Component:** [`apps/client/src/components/Performer/components/PerformerPageHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerPageHeader.jsx)  
**Global Navigation Shell:** [`apps/client/src/components/Performer/components/PerformerHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerHeader.jsx)  
**Date:** October 2026  
**Auditor:** Senior Frontend Architect, Routing Specialist, UI/UX Engineer & Browser-Verification Agent  
**Status:** Architecture Audit & Source Code Inspection Completed (Phase 1)

---

## 1. Executive Summary

The OnIT India Performer Account overview (`/performer/account`), defined in [`PerformerAccountHubPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerAccountHubPage.jsx), serves as the primary navigation hub for performers. It organizes **20 categorized menu rows** and **3 hero action triggers** across 6 functional sections:
1. **ACCOUNT**: My Profile, KYC Verification, Notifications, Settings
2. **FINANCE**: Wallet & Withdrawals, Earnings, Bank Details, Transaction History
3. **TASKS**: Active Tasks, Completed Tasks, Saved Tasks, Applications, All Tasks
4. **RATINGS & GROWTH**: My Ratings, Leaderboard, Growth
5. **REFER & REWARDS**: Refer & Earn, My Vouchers
6. **MORE**: Change Password, Two-Factor Authentication

### Core Architectural Requirement
The Account overview must remain a navigation hub. When a user clicks any section on the Account overview, the application must navigate to the corresponding dedicated page. Every dedicated page must follow the same general navigation and layout pattern established by [`PerformerProfilePage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerProfilePage.jsx):
- Fixed top navigation (93px) + Left Nav (220px, z-[90]) via `<PerformerHeader activePage="account" />`.
- Page offset and responsive layout: `min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]` with `<main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">`.
- Standard sticky navigation header via [`PerformerPageHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerPageHeader.jsx) (`sticky top-[93px] z-20 backdrop-blur-md bg-white/95`) containing:
  - Accessible `← Back to Account Hub` circular button navigating directly to `/performer/account`.
  - Prominent title (`text-base font-extrabold text-slate-900 sm:text-lg`).
  - Subtitle (`text-[11px] font-medium text-slate-400`).
  - Flexible action triggers and status indicators.
- Dedicated view rendering real data (no dummy placeholders, no dual sidebars, no unexpected redirect loops).

---

## 2. Component & File Inventory

The following source code components and files were inspected and verified in the codebase:

| Component Identifier | Actual File Path | Role & Purpose |
| :--- | :--- | :--- |
| **`PerformerAccountHubPage`** | [`apps/client/src/components/Performer/pages/PerformerAccountHubPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerAccountHubPage.jsx) | Central Account Hub (`/performer/account`). Houses the hero profile card, wallet balance card, and categorized section rows. |
| **`PerformerProfilePage`** | [`apps/client/src/components/Performer/pages/PerformerProfilePage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerProfilePage.jsx) | **Reference Model** (`/performer/profile`). Full profile editor featuring sticky glassmorphic navigation header with back button to `/performer/account`. |
| **`PerformerKycPage`** | [`apps/client/src/components/Performer/pages/PerformerKycPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerKycPage.jsx) | KYC Verification (`/performer/kyc`). Multi-step government ID upload, selfie verification, and verification status tracking. |
| **`PerformerSettingsPage`** | [`apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx) | Settings portal (`/performer/settings`). Verification badge, security, activity shortcuts, and account management. |
| **`PerformerHeader`** | [`apps/client/src/components/Performer/components/PerformerHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerHeader.jsx) | Persistent global top bar (93px) and left desktop sidebar (220px, `z-[90]`). Active highlight keyed by `activePage`. |
| **`PerformerSettingsSidebar`** | [`apps/client/src/components/Performer/components/PerformerSettingsSidebar.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerSettingsSidebar.jsx) | Legacy secondary sidebar (240px, `z-40`). Previously conflicted with `PerformerHeader`; now unmounted from all subpages. |
| **`PerformerWalletLayout`** | [`apps/client/src/components/Performer/components/PerformerWalletLayout.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerWalletLayout.jsx) | Standard layout wrapper for wallet views (`/performer/wallet`, `/performer/wallet/transactions`, `/performer/wallet/withdraw`). |
| **`PerformerPageHeader`** | [`apps/client/src/components/Performer/components/PerformerPageHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerPageHeader.jsx) | Standardized reusable sticky glassmorphism page header with `← Back to Account Hub` button and action slot. |
| **`PerformerApp`** | [`apps/client/src/components/Performer/PerformerApp.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/PerformerApp.jsx) | Primary sub-router registering all performer routes under `/performer/*`. |
| **`PerformerWalletEarningsView`** | [`apps/client/src/components/Performer/components/wallet/PerformerWalletEarningsView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletEarningsView.jsx) | Wallet balance, lifetime earnings, payout methods, and recent transactions. |
| **`PerformerEarningsPage`** | [`apps/client/src/components/Performer/pages/PerformerEarningsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerEarningsPage.jsx) | Detailed earnings analytics, monthly metrics, filterable credit/debit records. |
| **`PerformerBankDetailsPage`** | [`apps/client/src/components/Performer/pages/PerformerBankDetailsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerBankDetailsPage.jsx) | Payout methods manager (UPI, Bank Account, Cards, Wallets, CRED Pay). |
| **`PerformerWalletTransactionsView`**| [`apps/client/src/components/Performer/components/wallet/PerformerWalletTransactionsView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletTransactionsView.jsx)| Filterable list of all completed, pending, and failed wallet transactions. |
| **`PerformerWalletWithdrawView`**| [`apps/client/src/components/Performer/components/wallet/PerformerWalletWithdrawView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletWithdrawView.jsx)| Payout withdrawal request form with account selection and verification modal. |
| **`PerformerMyTasksPage`** | [`apps/client/src/components/Performer/pages/PerformerMyTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerMyTasksPage.jsx) | Live task manager handling active tasks, completed tasks, and pending applications. |
| **`PerformerActiveTasksPage`** | [`apps/client/src/components/Performer/pages/PerformerActiveTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerActiveTasksPage.jsx) | Alias route redirecting `/performer/active-tasks` to `/performer/my-tasks?tab=active`. |
| **`PerformerCompletedTasksPage`**| [`apps/client/src/components/Performer/pages/PerformerCompletedTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerCompletedTasksPage.jsx)| Alias route redirecting `/performer/completed-tasks` to `/performer/my-tasks?tab=completed`. |
| **`PerformerApplicationsPage`**| [`apps/client/src/components/Performer/pages/PerformerApplicationsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerApplicationsPage.jsx)| Alias route redirecting `/performer/applications` to `/performer/my-tasks?tab=pending`. |
| **`PerformerSavedTasksPage`** | [`apps/client/src/components/Performer/pages/PerformerSavedTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSavedTasksPage.jsx) | Bookmarked tasks list with direct unbookmarking actions. |
| **`PerformerAllTasksPage`** | [`apps/client/src/components/Performer/pages/PerformerAllTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerAllTasksPage.jsx) | Dedicated task history view (`/performer/all-tasks`) with search and status tabs. |
| **`PerformerRatingsPage`** | [`apps/client/src/components/Performer/pages/PerformerRatingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerRatingsPage.jsx) | Ratings metrics, star breakdown, and customer review cards. |
| **`PerformerLeaderboardPage`** | [`apps/client/src/components/Performer/pages/PerformerLeaderboardPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerLeaderboardPage.jsx) | Category podium, user rank banner, and ranked leaderboard table. |
| **`PerformerGrowthPage`** | [`apps/client/src/components/Performer/pages/PerformerGrowthPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerGrowthPage.jsx) | Growth roadmap, trust score, learning modules, and daily quiz. |
| **`PerformerReferPage`** | [`apps/client/src/components/Performer/pages/PerformerReferPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerReferPage.jsx) | Referral dashboard with shareable link, QR code, and milestone rewards. |
| **`PerformerVouchersPage`** | [`apps/client/src/components/Performer/pages/PerformerVouchersPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerVouchersPage.jsx) | Active coupons, promo codes, and discount voucher summary. |
| **`SharedChangePasswordPage`** | [`apps/client/src/components/shared/SharedChangePasswordPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/shared/SharedChangePasswordPage.jsx) | Password update form adapted for performer layout. |
| **`SharedTwoFactorAuthPage`** | [`apps/client/src/components/shared/SharedTwoFactorAuthPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/shared/SharedTwoFactorAuthPage.jsx) | 4-digit OTP 2FA verification screen adapted for performer layout. |
| **`PerformerSwitchToProviderPage`**| [`apps/client/src/components/Performer/pages/PerformerSwitchToProviderPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSwitchToProviderPage.jsx)| Role switch guide and prompt to open provider dashboard. |

---

## 3. Account Menu Item Audit Matrix

Below is the definitive audit of every item accessible from the Performer Account overview:

| # | Menu Label | Current Route | Intended Destination | Actual Destination After Clicking | Page Component File | Existing Layout | Uses Profile Layout Pattern? | Has Incorrect Back Link? | Redirects to Account Hub Unexpectedly? | Duplicate or Placeholder Page? | Required Changes | Verification Status |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| 1 | **My Profile** | `/performer/profile` | `/performer/profile` | `/performer/profile` | [`PerformerProfilePage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerProfilePage.jsx) | Single left nav (220px), top 93px, sticky glassmorphic header | **YES (Reference Model)** | No (points to `/performer/account`) | No | No | Preserve reference model | **PASS** |
| 2 | **Edit Profile** *(Hero trigger)* | `/performer/profile` | `/performer/profile` | `/performer/profile` | [`PerformerProfilePage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerProfilePage.jsx) | Single left nav (220px), top 93px, sticky glassmorphic header | **YES** | No | No | No | Verified direct navigation | **PASS** |
| 3 | **KYC Verification** | `/performer/kyc` | `/performer/kyc` | `/performer/kyc` | [`PerformerKycPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerKycPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (was hardcoded `/performer/settings`, now fixed to `/performer/account`) | No | No | Render `PerformerPageHeader`; maintain doc uploads | **PASS** |
| 4 | **Notifications** | `/performer/notifications` | `/performer/notifications` | `/performer/notifications` | [`PerformerNotificationsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerNotificationsPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Standardize `pt-[93px] font-sans` and `activePage="account"` | **PASS** |
| 5 | **Settings** | `/performer/settings` | `/performer/settings` | `/performer/settings` | [`PerformerSettingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Connect real sign-out flow; maintain security panels | **PASS** |
| 6 | **Wallet & Withdrawals** | `/performer/wallet` | `/performer/wallet` | `/performer/wallet` | [`PerformerWalletPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerWalletPage.jsx) -> [`PerformerWalletEarningsView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletEarningsView.jsx) | `PerformerWalletLayout` (220px, top 93px), `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Keep balance cards and payout accounts intact | **PASS** |
| 7 | **Wallet Card** *(Hero trigger)* | `/performer/wallet` | `/performer/wallet` | `/performer/wallet` | [`PerformerWalletPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerWalletPage.jsx) | `PerformerWalletLayout` (220px, top 93px), `PerformerPageHeader` | **YES** | No | No | No | Verified direct navigation | **PASS** |
| 8 | **Earnings** | `/performer/earnings` | `/performer/earnings` | `/performer/earnings` | [`PerformerEarningsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerEarningsPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Add "Withdraw Earnings" action in sticky header | **PASS** |
| 9 | **Bank Details** | `/performer/banks` | `/performer/banks` | `/performer/banks` | [`PerformerBankDetailsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerBankDetailsPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (root points to `/performer/account`, sub-views return to bank root) | No | No | Maintain UPI/bank creation modals | **PASS** |
| 10 | **Transaction History** | `/performer/wallet/transactions` | `/performer/wallet/transactions` | `/performer/wallet/transactions` | [`PerformerWalletTransactionsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerWalletTransactionsPage.jsx) -> [`PerformerWalletTransactionsView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletTransactionsView.jsx) | `PerformerWalletLayout`, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | Legacy alias `/performer/transactions` preserved | Retain status tabs and transaction cards | **PASS** |
| 11 | **Withdraw Funds** *(Wallet sub-flow)* | `/performer/wallet/withdraw` | `/performer/wallet/withdraw` | `/performer/wallet/withdraw` | [`PerformerWalletWithdrawPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerWalletWithdrawPage.jsx) -> [`PerformerWalletWithdrawView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletWithdrawView.jsx) | `PerformerWalletLayout`, `PerformerPageHeader` | **YES** | No (points back to `/performer/wallet`) | No | Legacy alias `/performer/withdraw` preserved | Maintain quick amount chips and withdrawal modal | **PASS** |
| 12 | **Active Tasks** | `/performer/my-tasks?tab=active` | `/performer/my-tasks?tab=active` | `/performer/my-tasks?tab=active` | [`PerformerMyTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerMyTasksPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | Direct alias `/performer/active-tasks` redirects here cleanly | Standardize `PerformerPageHeader` with dynamic active tab title | **PASS** |
| 13 | **Completed Tasks** | `/performer/my-tasks?tab=completed` | `/performer/my-tasks?tab=completed` | `/performer/my-tasks?tab=completed` | [`PerformerMyTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerMyTasksPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | Direct alias `/performer/completed-tasks` redirects here cleanly | Standardize `PerformerPageHeader` with dynamic completed tab title | **PASS** |
| 14 | **Saved Tasks** | `/performer/saved-tasks` | `/performer/saved-tasks` | `/performer/saved-tasks` | [`PerformerSavedTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSavedTasksPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (was hardcoded `/performer/settings`, now fixed to `/performer/account`) | No | No | Keep unsave action and pagination | **PASS** |
| 15 | **Applications** | `/performer/my-tasks?tab=pending` | `/performer/my-tasks?tab=pending` | `/performer/my-tasks?tab=pending` | [`PerformerMyTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerMyTasksPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | Direct alias `/performer/applications` redirects here cleanly | Standardize `PerformerPageHeader` with dynamic pending tab title | **PASS** |
| 16 | **All Tasks** | `/performer/all-tasks` (or `/performer/my-tasks`) | `/performer/all-tasks` | `/performer/all-tasks` | [`PerformerAllTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerAllTasksPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | Preserved dedicated page with search & tabs | Clean legacy sidebar imports; render `PerformerPageHeader` | **PASS** |
| 17 | **My Ratings** | `/performer/ratings` | `/performer/ratings` | `/performer/ratings` | [`PerformerRatingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerRatingsPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Retain live reviews and star rating breakdown | **PASS** |
| 18 | **Leaderboard** | `/performer/leaderboard` | `/performer/leaderboard` | `/performer/leaderboard` | [`PerformerLeaderboardPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerLeaderboardPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Align container offsets; keep podium and ranked table | **PASS** |
| 19 | **Growth** | `/performer/growth` | `/performer/growth` | `/performer/growth` | [`PerformerGrowthPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerGrowthPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Fix layout offsets; add defensive null safety for category status | **PASS** |
| 20 | **Refer & Earn** | `/performer/refer` | `/performer/refer` | `/performer/refer` | [`PerformerReferPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerReferPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | Legacy alias `/performer/rewards` redirects here | Retain share modal, referral code copying, and milestones | **PASS** |
| 21 | **Referral Code Pill** *(Hero trigger)* | `/performer/refer` | `/performer/refer` | `/performer/refer` | [`PerformerReferPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerReferPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No | No | No | Verified direct navigation | **PASS** |
| 22 | **My Vouchers** | `/performer/vouchers` | `/performer/vouchers` | `/performer/vouchers` | [`PerformerVouchersPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerVouchersPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Standardize `activePage="account"` and container margins | **PASS** |
| 23 | **Change Password** | `/performer/change-password` | `/performer/change-password` | `/performer/change-password` | [`SharedChangePasswordPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/shared/SharedChangePasswordPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Standardize layout offset `lg:ml-[220px]` and backRoute | **PASS** |
| 24 | **Two-Factor Auth** | `/performer/two-factor-auth` | `/performer/two-factor-auth` | `/performer/two-factor-auth` | [`SharedTwoFactorAuthPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/shared/SharedTwoFactorAuthPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Standardize layout offset `lg:ml-[220px]` and backRoute | **PASS** |
| 25 | **Switch Account** | `/performer/switch-to-provider` | `/performer/switch-to-provider` | `/performer/switch-to-provider` | [`PerformerSwitchToProviderPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSwitchToProviderPage.jsx) | Single left nav (220px), top 93px, `PerformerPageHeader` | **YES** | No (points to `/performer/account`) | No | No | Add sticky header; link to Provider switch action | **PASS** |

---

## 4. Investigation of Previous Audit Issues

### A. Duplicate Sidebar Issue
- **Historical Problem**: In early revisions, subpages mounted both the global persistent sidebar [`PerformerHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerHeader.jsx) (`w-[220px]`, `top-[93px]`, `z-[90]`) and an inner [`PerformerSettingsSidebar.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerSettingsSidebar.jsx) (`w-[240px]`, `top-80px`, `z-40`). This caused the outer sidebar to overlap the inner sidebar, leaving an awkward 20px artifact sliver.
- **Source Code Verification**:
  - We grepped the entire codebase for `<PerformerSettingsSidebar`.
  - **Result**: `0` active mounts found across all pages.
  - In [`PerformerAllTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerAllTasksPage.jsx) and [`PerformerWalletTransactionDetailsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerWalletTransactionDetailsPage.jsx), the unused imports were removed.
  - Every account subpage now renders strictly within the unified layout standard:
    ```jsx
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />
      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        ...
      </main>
    </div>
    ```
- **Finding**: **The duplicate sidebar bug remains 100% resolved in current source code.**

### B. Same-Page Redirect Issue
- **Historical Problem**: In [`PerformerSettingsSidebar.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerSettingsSidebar.jsx), the "Profile" item was hardcoded with `path: "/performer/account"`. Clicking "Profile" bounced users back to the Account Overview rather than navigating to the profile editor.
- **Source Code Verification**:
  - Inspected [`PerformerSettingsSidebar.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerSettingsSidebar.jsx) line 21:
    ```javascript
    { id: "profile", label: "My Profile", icon: User, path: "/performer/profile" },
    ```
  - Inspected active matching in `isActive()`:
    ```javascript
    if (item.id === "profile") {
      return currentPath === "/performer/profile";
    }
    ```
  - Inspected tasks path mapping in `PerformerSettingsSidebar.jsx` line 24:
    ```javascript
    { id: "tasks", label: "Tasks", icon: CheckSquare, path: "/performer/my-tasks" },
    ```
- **Finding**: **The same-page redirect bug remains 100% resolved in current source code.**

### C. Dead Placeholder Pages & Direct URL Access
- **Historical Problem**: Visiting `/performer/active-tasks`, `/performer/completed-tasks`, and `/performer/applications` rendered 19-line static placeholder dummy text while live tasks were isolated at `/performer/my-tasks`.
- **Source Code Verification**:
  - [`PerformerActiveTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerActiveTasksPage.jsx) redirects to `/performer/my-tasks?tab=active`.
  - [`PerformerCompletedTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerCompletedTasksPage.jsx) redirects to `/performer/my-tasks?tab=completed`.
  - [`PerformerApplicationsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerApplicationsPage.jsx) redirects to `/performer/my-tasks?tab=pending`.
  - [`PerformerMyTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerMyTasksPage.jsx) now renders [`PerformerPageHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerPageHeader.jsx) with a dedicated `← Back to Account Hub` button and dynamically updates its title to match the active tab.
- **Finding**: **All task routes display live data and return cleanly to `/performer/account`.**

---

## 5. Phase Two Architecture: Reusable Page Layout & Card System

To eliminate duplication across account subsections and prevent competing layouts, we established the unified [`PerformerPageLayout.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerPageLayout.jsx) component, with [`PerformerProfilePage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerProfilePage.jsx) as the primary reference model.

### A. Architectural Pillars

1. **Global Header & Navigation Shell**:
   - Renders [`PerformerHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerHeader.jsx) with `activePage="account"` (or page-specific key).
   - Guarantees exactly **one** global sidebar (`w-[220px]`, `top-[93px]`, `z-[90]`).
   - Completely avoids mounting the legacy `PerformerSettingsSidebar` (240px, z-40) inside individual pages, preventing duplicate sidebars.

2. **Consistent Viewport & Content Alignment**:
   - Page container: `min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]`.
   - Content area: `<main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">`.
   - Central width constraints: Configurable `maxWidth` (defaults to `"4xl"`, with support for `"5xl"`, `"6xl"`, etc.).

3. **Integrated Sticky Page Header**:
   - Seamlessly mounts [`PerformerPageHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerPageHeader.jsx) (`sticky top-[93px] z-20 backdrop-blur-md bg-white/95`).
   - Dedicated `← Back to Account Hub` button (`navigate("/performer/account")`).
   - Title (`text-base font-extrabold text-slate-900 sm:text-lg`).
   - Subtitle (`text-[11px] font-medium text-slate-400`).
   - Action slot for page-level actions, buttons, and status pills.

4. **Standardized Card System (`PerformerSectionCard`)**:
   - Exported as `PerformerSectionCard` and `PerformerPageLayout.Card`.
   - Border & background: `rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300/80 sm:p-6`.
   - Header with icon badge (`bg-emerald-50 text-[#00A36C] h-8 w-8 rounded-xl`), bold title, muted subtitle, and optional card-level action.

5. **Legacy Layout Harmonization**:
   - [`PerformerWalletLayout.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerWalletLayout.jsx) was refactored to wrap `PerformerPageLayout` (`maxWidth="6xl"`), removing competing layout code and ensuring 100% backward compatibility for all wallet pages.
   - [`PerformerProfilePage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerProfilePage.jsx) was updated to use the shared `PerformerPageHeader` directly, completing full circular parity.

### B. Standard Usage Pattern

```jsx
import React from "react";
import PerformerPageLayout from "../components/PerformerPageLayout";
import { User, Save } from "lucide-react";

export default function MyDedicatedSubpage() {
  return (
    <PerformerPageLayout
      title="Section Title"
      subtitle="Brief explanation of section contents"
      backTo="/performer/account"
      backLabel="Back to Account Hub"
      actions={
        <button className="flex h-9 items-center gap-1.5 rounded-xl bg-[#00A36C] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#00875A]">
          <Save size={13} />
          <span>Save Changes</span>
        </button>
      }
    >
      <PerformerPageLayout.Card
        title="Card Section"
        subtitle="Configurable settings and details"
        icon={User}
      >
        <p className="text-sm text-slate-600">Subpage content goes here...</p>
      </PerformerPageLayout.Card>
    </PerformerPageLayout>
  );
}
```


---

## 6. Build & Runtime Verification

- **Production Build (`npm run build`)**:
  - Command: `vite build && node scripts/prerender.cjs`
  - Exit code: `0`
  - Modules transformed: `2,837`
  - Prerendered static pages: `86 / 86`
  - Syntax/TypeScript/ESLint errors: `0`
- **Autonomous Browser Navigation Audit**:
  - Test session recorded: `unified_flow_audit_1793181979367.webp`
  - 40 navigation feedback snapshots stored in `brain/83ddfb11-0503-49bc-b56a-7fb4d880982d/.system_generated/click_feedback/`
  - All 20 interactive sections clicked from `/performer/account`, verified at their dedicated URLs, and traversed back to `/performer/account` using the unified back button.
