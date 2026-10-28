# ONIT INDIA — PERFORMER ACCOUNT UNIFIED FLOW IMPLEMENTATION PLAN

**Target Module:** Performer Account Portal & Navigation Subsections  
**Reference Document:** [`docs/PERFORMER_ACCOUNT_UNIFIED_FLOW_AUDIT.md`](file:///d:/Onitindia/onitindia1-main/docs/PERFORMER_ACCOUNT_UNIFIED_FLOW_AUDIT.md)  
**Reference Model:** [`apps/client/src/components/Performer/pages/PerformerProfilePage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerProfilePage.jsx)  
**Date:** October 2026  
**Author:** Senior Frontend Architect & Routing Specialist  
**Status:** Plan Approved for Execution  

---

## 1. Overview & Strategy

This implementation plan establishes a unified dedicated-page experience across every section accessible from the Performer Account Hub (`/performer/account`). 

Each dedicated section will follow the visual, architectural, and navigational standard established by `PerformerProfilePage`:
1. **Global Left Sidebar:** Fixed top (93px) + Left Nav (220px, z-[90]) via `<PerformerHeader activePage="account" />`.
2. **Page Offset & Responsive Container:** `pt-[93px] lg:ml-[220px] lg:w-[calc(100%-220px)] px-4 py-6 sm:px-6 lg:px-8`.
3. **Standardized Sticky Navigation Header:** Render [`PerformerPageHeader`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerPageHeader.jsx) with:
   - Consistent `← Back to Account` button (`navigate("/performer/account")`).
   - Standardized page title and subtitle.
   - Clean glassmorphism (`top-[93px] backdrop-blur-md`).
   - Page-specific action triggers and status badges.
4. **Preserved Business Logic:** All existing forms, document uploaders, payouts, tabs, and analytics will remain completely intact.

---

## 2. Phased File Implementation Roadmap

### Phase A: KYC Verification (`/performer/kyc`)
- **File:** [`apps/client/src/components/Performer/pages/PerformerKycPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerKycPage.jsx)
- **Modifications:**
  - Remove hardcoded `Back to Settings` button (`navigate('/performer/settings')`).
  - Import and mount `<PerformerPageHeader title="KYC Verification" subtitle="Upload government ID and selfie verification" backTo="/performer/account" />`.
  - Remove unused legacy imports (`AccountFlatNav`, `PerformerSettingsSidebar`).
  - Keep all KYC step handlers, presigned S3 uploaders, and document review status cards.

### Phase B: Settings (`/performer/settings`)
- **File:** [`apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx)
- **Modifications:**
  - Replace unstyled `<header>` with `<PerformerPageHeader title="Settings" subtitle="Account preferences, security, and verification" backTo="/performer/account" />`.
  - Clean up unused imports.

### Phase C: Bank Details (`/performer/banks`)
- **File:** [`apps/client/src/components/Performer/pages/PerformerBankDetailsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerBankDetailsPage.jsx)
- **Modifications:**
  - Add `<PerformerPageHeader title="Bank Details" subtitle="Manage UPI, bank accounts, and cards for withdrawals" backTo="/performer/account" />`.
  - In sub-views (e.g. `isAddingUpi`), support the internal return callback cleanly while maintaining the main back-to-account flow.

### Phase D: Wallet & Earnings (`/performer/wallet`, `/performer/earnings`)
- **Files:**
  - [`apps/client/src/components/Performer/components/wallet/PerformerWalletEarningsView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletEarningsView.jsx)
  - [`apps/client/src/components/Performer/pages/PerformerEarningsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerEarningsPage.jsx)
  - [`apps/client/src/components/Performer/components/wallet/PerformerWalletTransactionsView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletTransactionsView.jsx)
  - [`apps/client/src/components/Performer/components/wallet/PerformerWalletWithdrawView.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletWithdrawView.jsx)
- **Modifications:**
  - Add `<PerformerPageHeader>` to Wallet overview with "Withdraw" action button.
  - Add `<PerformerPageHeader>` to Earnings page with "Withdraw Earnings" action button.
  - Standardize Transaction History and Withdraw pages with unified back headers.

### Phase E: Tasks Subsections
- **Files:**
  - [`apps/client/src/components/Performer/pages/PerformerSavedTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSavedTasksPage.jsx)
  - [`apps/client/src/components/Performer/pages/PerformerMyTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerMyTasksPage.jsx)
- **Modifications:**
  - Replace `Back to Settings` in `PerformerSavedTasksPage.jsx` with `<PerformerPageHeader title="Saved Tasks" subtitle="Tasks bookmarked for future applications" backTo="/performer/account" />`.
  - In `PerformerMyTasksPage.jsx`, add a clean header navigation option returning to Account Hub when navigated from the account overview.

### Phase F: Ratings, Leaderboard, Growth, Referrals & Vouchers
- **Files:**
  - [`apps/client/src/components/Performer/pages/PerformerRatingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerRatingsPage.jsx)
  - [`apps/client/src/components/Performer/pages/PerformerLeaderboardPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerLeaderboardPage.jsx)
  - [`apps/client/src/components/Performer/pages/PerformerGrowthPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerGrowthPage.jsx)
  - [`apps/client/src/components/Performer/pages/PerformerReferPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerReferPage.jsx)
  - [`apps/client/src/components/Performer/pages/PerformerVouchersPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerVouchersPage.jsx)
- **Modifications:**
  - Mount `<PerformerPageHeader>` with back to `/performer/account`.
  - Align container padding, offsets, and set `activePage="account"`.

### Phase G: Security & Account Switch
- **Files:**
  - [`apps/client/src/components/Performer/PerformerApp.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/PerformerApp.jsx) (change `backRoute` for performer change-password and 2FA to `/performer/account`).
  - [`apps/client/src/components/shared/SharedChangePasswordPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/shared/SharedChangePasswordPage.jsx) (add `lg:ml-[220px]` offset for performer).
  - [`apps/client/src/components/shared/SharedTwoFactorAuthPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/shared/SharedTwoFactorAuthPage.jsx) (add `lg:ml-[220px]` offset for performer).
  - [`apps/client/src/components/Performer/pages/PerformerSwitchToProviderPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSwitchToProviderPage.jsx) (mount header with back button).

---

## 3. Verification Protocol

After implementation:
1. Run Playwright/Chromium browser automation to click through all 22 menu items and test the unified header and `← Back to Account` button.
2. Confirm that every subpage returns smoothly to `/performer/account`.
3. Check direct URL entry and refresh for every subpage.
4. Execute `npm run build` in `apps/client` to verify 100% clean production compilation and prerendering.
5. Create `docs/PERFORMER_ACCOUNT_UNIFIED_FLOW_VERIFICATION.md`.
