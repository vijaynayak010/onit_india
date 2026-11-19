# FirstDoer — Recommended Implementation Plan (Post-Audit)

> **Prerequisite:** User approval of Phase 0 Audit before any code changes.  
> **Protected Areas (DO NOT MODIFY):** `apps/admin`, `apps/server`, public landing page components, `AuthContext.jsx`, `App.jsx`, backend services, API contracts, DB schemas, authentication, payment logic.

---

## Phase 1: Critical Layout & Broken-Link Fixes (Quick Wins, High Impact)
1. **Fix Performer 240px Sidebar Offset Across All Pages:**
   - Replace `lg:ml-[220px] lg:w-[calc(100%-220px)]` and `lg:pl-[220px]` with `lg:ml-[240px] lg:w-[calc(100%-240px)]` (or migrate pages to `DashboardShell` / `PerformerPageLayout`) across `PerformerPageLayout.jsx`, `ChatsPage.jsx`, `SharedChangePasswordPage.jsx`, `SharedTwoFactorAuthPage.jsx`, and all 25+ Performer pages.
2. **Fix `PerformerHeader.jsx` Profile Avatar Pill:**
   - Render `{initials}` (or `user.profilePicUrl`) inside the `h-6 w-6` circle in `PerformerHeader.jsx:81`.
3. **Fix Provider `SettingsView.jsx` Broken Actions:**
   - Wire `Sign Out` to `useAuth().logout()` + `navigate("/")` instead of `alert("Sign Out clicked!")`.
   - Fix legal links (`Privacy Policy` → `/privacy-policy`, `Terms & Conditions` → `/terms-and-conditions`, `Refund Policy` → `/refund-policy`).
   - Wire or remove the no-op `Notification Settings` row (`onClick={() => {}}`).
4. **Fix `BoostTaskPage.jsx` Header Overlap & Misplaced Copy:**
   - Add `pt-[80px]` for fixed `ProviderHeader`; either wire `BoostTaskPage` to real task boost APIs or mark/hide until backend support exists.
5. **Fix `PerformerDashboardPage.jsx` Bookmark Button:**
   - Wire the card bookmark button to the save-task API with `e.stopPropagation()` instead of navigating to task details.

## Phase 2: Design System Unification & Dead-Code Cleanup
1. **Unify Sidebar & Account Tokens:**
   - Update `ProviderSettingsSidebar.jsx` and `AccountFlatNav.jsx` from legacy emerald (`#d3f6e1`, `#2BA960`, `#E8F5EE`) to FirstDoer teal tokens (`--dash-active-bg`, `--dash-primary-700`, `--dash-border`).
2. **Remove / Archive Dead & Legacy Files (after verification):**
   - Orphaned `RatingsPage.jsx`, `RatingsReceivedPage.jsx`, `PerformerWalletTransactionDetailsPage.jsx`, `PerformerSettingsSidebar.jsx` (contains `"Onit Performer v2.4.1"`), and stray root `client/src/components/provider/pages/*`.
   - Remove `"onit buddy"` legacy string in `ChatsPage.jsx:2491`.
3. **Consolidate Duplicate Performer Pages:**
   - Evaluate deprecating `PerformerNewHomePage.jsx` (`/performer/newHomePage`) and consolidating `PerformerAllTasksPage.jsx` / `PerformerFindTasksPage.jsx`.

## Phase 3: UX Polish, Modularization & Asset Optimization
1. **Replace `window.alert()` / `window.confirm()`:**
   - Standardize on `shared/Toast.jsx` and accessible confirmation modals (`ConfirmModal`).
2. **Split Monolithic Components:**
   - Decompose `ChatsPage.jsx` (2,664 lines), `PostTaskManualPage.jsx` (1,362 lines), `ProviderActiveTaskExecutionPage.jsx` (1,331 lines), `PerformerProfilePage.jsx` (1,296 lines), `MyTasksPage.jsx` (1,156 lines), and `PerformerActiveTaskExecutionPage.jsx` (1,151 lines) into focused sub-components/hooks.
3. **Optimize Large Assets:**
   - Compress/convert `public/hero-bg.png` (20.97 MB), `src/assets/icons/t1–t6.png` (1.29–5.55 MB each), and `public/explore/*.png` (2.3–2.5 MB each) to WebP/AVIF.
4. **Security & Account Settings Completion:**
   - Coordinate with backend for `SharedChangePasswordPage.jsx`, `SharedTwoFactorAuthPage.jsx`, `TasksSettingsView.jsx`, and `/performer/forgot-password` (currently `UI ONLY` / `NOT IMPLEMENTED`).
