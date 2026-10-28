# ONIT INDIA — PERFORMER ACCOUNT ROUTE IMPLEMENTATION PLAN

**Target Module:** Performer Account Portal & Navigation  
**Reference Document:** [`docs/PERFORMER_ACCOUNT_ROUTE_AUDIT.md`](file:///d:/Onitindia/onitindia1-main/docs/PERFORMER_ACCOUNT_ROUTE_AUDIT.md)  
**Date:** October 2026  
**Author:** Senior Frontend Architect & Routing Specialist  
**Status:** Fully Executed & Verified (Phases 6–7)

---

## Overview

This implementation plan details the exact, phased sequence to eliminate duplicate routes, resolve the same-page redirect bug, deduplicate overlapping sidebars, and connect dead placeholder task pages to the live task manager.

---

## Priority 1: Correct Broken Navigation & Same-Page Redirects

### Goal
Ensure every menu entry and button in the Account navigation opens its intended destination without bouncing back to the Account Overview (`/performer/account`).

### Tasks & File Changes

1. **Fix "Profile" destination in `PerformerSettingsSidebar.jsx`:**
   - **File:** `apps/client/src/components/Performer/components/PerformerSettingsSidebar.jsx`
   - **Change:**
     - Change line 19:
       ```diff
       - { id: "profile", label: "Profile", icon: User, path: "/performer/account" },
       + { id: "profile", label: "Profile", icon: User, path: "/performer/profile" },
       ```
     - Change line 43-45:
       ```diff
       - if (item.id === "profile") {
       -   return currentPath === "/performer/profile" || currentPath === "/performer/account";
       - }
       + if (item.id === "profile") {
       +   return currentPath === "/performer/profile";
       + }
       ```
     - Change line 22 (Tasks link):
       ```diff
       - { id: "tasks", label: "Tasks", icon: CheckSquare, path: "/performer/all-tasks" },
       + { id: "tasks", label: "Tasks", icon: CheckSquare, path: "/performer/my-tasks" },
       ```

2. **Fix Task Section Destinations in `PerformerAccountHubPage.jsx`:**
   - **File:** `apps/client/src/components/Performer/pages/PerformerAccountHubPage.jsx`
   - **Change:**
     - Point "Active Tasks" to `/performer/my-tasks?tab=active`:
       ```diff
       - onClick={() => navigate("/performer/active-tasks")}
       + onClick={() => navigate("/performer/my-tasks?tab=active")}
       ```
     - Point "Completed Tasks" to `/performer/my-tasks?tab=completed`:
       ```diff
       - onClick={() => navigate("/performer/completed-tasks")}
       + onClick={() => navigate("/performer/my-tasks?tab=completed")}
       ```
     - Point "All Tasks" to `/performer/my-tasks`:
       ```diff
       - onClick={() => navigate("/performer/all-tasks")}
       + onClick={() => navigate("/performer/my-tasks")}
       ```

### Dependencies & Implementation Order
- Apply sidebar and hub route updates first to immediately restore expected navigation.
- **Risk:** Minimal. Uses existing paths and preserves backward compatibility.
- **Expected Outcome:** Clicking "Profile" in any settings menu opens the user's actual profile editor. Clicking "Active Tasks" or "Completed Tasks" opens the live task manager with the appropriate tab preselected.

---

## Priority 2: Resolve Dead Task Placeholders & Duplicate Routing

### Goal
Ensure direct URL access to `/performer/active-tasks` and `/performer/completed-tasks` displays real task data rather than static placeholder text.

### Tasks & File Changes

1. **Activate `PerformerActiveTasksPage.jsx`:**
   - **File:** `apps/client/src/components/Performer/pages/PerformerActiveTasksPage.jsx`
   - **Change:** Instead of rendering a static placeholder, render `PerformerMyTasksPage` with `defaultTab="active"`, or perform an immediate redirect to `/performer/my-tasks?tab=active`.

2. **Activate `PerformerCompletedTasksPage.jsx`:**
   - **File:** `apps/client/src/components/Performer/pages/PerformerCompletedTasksPage.jsx`
   - **Change:** Render `PerformerMyTasksPage` with `defaultTab="completed"`, or perform an immediate redirect to `/performer/my-tasks?tab=completed`.

3. **Preserve Legacy Aliases in `PerformerApp.jsx`:**
   - Keep `/performer/transactions` -> `/performer/wallet/transactions`.
   - Keep `/performer/withdraw` -> `/performer/wallet/withdraw`.
   - Keep `/performer/support` -> `/performer/settings`.
   - Keep `/performer/rewards` -> `/performer/refer`.

### Dependencies & Implementation Order
- Follows Priority 1.
- **Risk:** Zero risk of data loss.
- **Expected Outcome:** All task links and direct URLs load working task data with zero dead stubs.

---

## Priority 3: Correct Shared Layout Rendering (Sidebar Deduplication)

### Goal
Eliminate the dual-sidebar collision across all remaining Account subpages, aligning them with the unified standard established in `PerformerProfilePage`.

### Unified Layout Standard
```jsx
<div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
  <PerformerHeader activePage="account" />
  <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
    <div className="mx-auto w-full max-w-5xl">
      {/* Content */}
    </div>
  </main>
</div>
```

### Pages to Align
1. [`PerformerSettingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSettingsPage.jsx)
2. [`PerformerBankDetailsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerBankDetailsPage.jsx)
3. [`PerformerKycPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerKycPage.jsx)
4. [`PerformerRatingsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerRatingsPage.jsx)
5. [`PerformerReferPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerReferPage.jsx)
6. [`PerformerWalletLayout.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerWalletLayout.jsx) (standardizing `/performer/wallet`, `/performer/wallet/withdraw`, `/performer/wallet/transactions`)
7. [`PerformerEarningsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerEarningsPage.jsx)
8. [`PerformerSavedTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSavedTasksPage.jsx)
9. [`PerformerAllTasksPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerAllTasksPage.jsx)
10. [`PerformerSwitchToProviderPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerSwitchToProviderPage.jsx)

### Dependencies & Implementation Order
- Update layout wrapper in `PerformerWalletLayout.jsx` first (fixing 3 routes at once).
- Update subpages systematically.
- **Risk:** Minor CSS layout shift. Must maintain consistent padding and responsive classes.
- **Expected Outcome:** Single, unified left navigation across the entire portal with zero overlapping elements.

---

## Priority 4: Verify Fallback & Test-Mode Behavior

### Goal
Ensure protected routes, direct navigation, and browser refresh work without interception or unintended redirect loops.

### Verification Steps
1. Verify `apps/client/src/components/GatedRoute.jsx` safely permits test-mode bypass without compromising production auth.
2. Verify `RequirePhoneVerification.jsx` and `RequirePerformerOnboarding.jsx` do not block test navigation.
3. Verify `PerformerApp.jsx` wildcard `*` only catches non-existent subpaths.

---

## Priority 5: Manual Verification & Documentation

### Goal
Provide a comprehensive testing protocol for the user to execute manually in the browser.

### Deliverables
1. Updated route inventory with all statuses.
2. Step-by-step browser testing instructions at `http://localhost:5173/performer/account`.
3. Final implementation summary report.
