# ONIT INDIA — PERFORMER NOTIFICATIONS: REMOVE BACK BUTTON IMPLEMENTATION PLAN

**Target Files:**  
1. [`apps/client/src/components/Performer/components/PerformerPageHeader.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerPageHeader.jsx)  
2. [`apps/client/src/components/Performer/pages/PerformerNotificationsPage.jsx`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerNotificationsPage.jsx)  

**Route:** `/performer/notifications`  
**Date:** October 2026  
**Status:** Completed & Autonomous Browser Verified (0 Build Errors)  

---

## 1. Rationale & Analysis

### Why the Back Button Needs to be Removed:
1. **Notifications is a Primary Top-Level Route**:  
   In the global navigation bar ([`PerformerHeader`](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/PerformerHeader.jsx)), Notifications (`/performer/notifications`) is a first-class primary section alongside `Home`, `My Tasks`, `Invitations`, `Messages`, and `Account`. It is also accessible directly from the top notification bell icon.
2. **Decoupled from Account Section**:  
   Notifications was previously removed from the Account Hub menu (`/performer/account`) because notifications is not a sub-setting of the Account section.
3. **Eliminates Unintended Navigation to Account**:  
   Having a `← Back to Account Hub` button on Notifications causes unexpected navigation behavior: a user clicking Notifications from the global left navigation or header bell should not be routed back to the Account section when clicking a header arrow.

---

## 2. Architecture & Design

### Current Header Layout:
```
┌────────────────────────────────────────────────────────────────────────┐
│  [ < ]  Notifications                                   [Mark all read]│
│         Task updates, messages, payments, and alerts                   │
└────────────────────────────────────────────────────────────────────────┘
```

### Proposed Top-Level Header Layout:
```
┌────────────────────────────────────────────────────────────────────────┐
│  Notifications                                          [Mark all read]│
│  Task updates, messages, payments, and alerts                          │
└────────────────────────────────────────────────────────────────────────┘
```
- No left circular chevron button.
- Title and subtitle align cleanly to the container edge.
- Right action button (`Mark all read`) remains fully functional.
- Global left sidebar highlights **Notifications** instead of **Account**.

---

## 3. Required Code Changes

### Step 1: Update `PerformerPageHeader.jsx` to Support `showBack`
Add an optional boolean prop `showBack = true` (defaulting to `true` to preserve backward compatibility for all child sections):
```diff
 export default function PerformerPageHeader({
   title,
   subtitle,
   backTo = "/performer/account",
   backLabel = "Back to Account",
   onBack,
   actions,
   className = "",
+  showBack = true,
 }) {
...
   return (
     <div className={`...`}>
       <div className="flex items-center gap-3 min-w-0">
-        <button
-          type="button"
-          onClick={handleBack}
-          ...
-        >
-          <ChevronLeft size={18} strokeWidth={2.5} />
-        </button>
+        {showBack && (
+          <button
+            type="button"
+            onClick={handleBack}
+            aria-label={resolvedBackLabel}
+            title={resolvedBackLabel}
+            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
+          >
+            <ChevronLeft size={18} strokeWidth={2.5} />
+          </button>
+        )}
         <div className="min-w-0 flex-1">
...
```

### Step 2: Update `PerformerNotificationsPage.jsx`
1. Pass `showBack={false}` to `PerformerPageHeader` and remove `backTo="/performer/account"`.
2. Fix `activePage` on `PerformerHeader`: change from `"account"` to `"notifications"`.

```diff
-      <PerformerHeader activePage="account" />
+      <PerformerHeader activePage="notifications" />

       <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
         <div className="mx-auto max-w-4xl">
           <PerformerPageHeader
             title="Notifications"
             subtitle="Task updates, messages, payments, and account alerts"
-            backTo="/performer/account"
+            showBack={false}
             actions={
               notifications.length > 0 && unreadCount > 0 ? (
...
```

---

## 4. Verification Plan

1. **Automated Build**:
   - Run `npm run build` to verify clean compilation with 0 syntax or bundling errors.
2. **Autonomous Browser Verification**:
   - Open `http://localhost:5173/performer/notifications`.
   - Verify the back button `[ < ]` is completely gone.
   - Verify that the title `Notifications`, subtitle, and action button (`Mark all read`) render with optimal spacing.
   - Verify that the **Notifications** item in the left sidebar is highlighted as active.
   - Capture before/after screenshots to confirm visual excellence.
