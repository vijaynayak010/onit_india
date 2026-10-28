# Performer Account Page UI/UX & Scroll Architecture Audit

**Target URL:** `/performer/account`  
**Date:** October 2026  
**Auditor:** Senior Frontend Architect & UI/UX Specialist  
**Status:** Audit & Implementation Completed (Phases 1–5 Done, Ready for Manual Verification)

---

## 1. Executive Summary

This audit investigates the layout, component hierarchy, positioning, and scrolling behavior of the OnIT India **Performer Account Hub** page (`/performer/account`). 

Previously, on desktop screens, scrolling the page scrolled the entire document viewport (`window`/`body`). This caused the stationary elements—the middle Hero Profile Card and the Wallet Summary Card—to scroll off-screen along with the extensive right-hand menu options. Furthermore, layout discrepancies existed between the fixed header (`h-[93px]`) and the content top padding (`pt-[80px]`), the left navigation margin (`lg:ml-[220px]`), and the active navigation state (`activePage="settings"` vs `"account"`).

Phases 2, 3, and 4 have now been implemented directly into the existing codebase, establishing an independent right-panel scroll architecture, stationary middle cards, responsive column adapting, active sidebar tab detection, and refined UI styling.

---

## 2. Identified Component Hierarchy & File Paths

```
App.jsx (Client Root Router)
│
├── GatedRoute
│   └── PerformerApp.jsx (Performer Module Sub-Router)
│       └── RequirePhoneVerification
│           └── RequirePerformerOnboarding
│               └── Route "account" ──> PerformerAccountHubPage.jsx
│                   ├── PerformerHeader.jsx
│                   │   ├── <header> (Fixed Top Bar: Logo, Search, Notifications, User Menu)
│                   │   └── <aside> (Fixed Left Navigation: 6 Links + Profile Footer)
│                   └── <main> (Content Container)
│                       ├── Middle Summary Column (Hero Card + Wallet Card)
│                       │   ├── Hero Profile Card (Avatar, Name, Email, Ratings, Edit, Stats, Referral)
│                       │   └── WalletCard (Balance, Subtitle, Gradient)
│                       └── Right Account Panel (Sections & Menu Rows)
│                           ├── Section: Account (Profile, KYC, Notifications, Settings)
│                           ├── Section: Finance (Wallet & Withdrawals, Earnings, Bank Details, Transactions)
│                           ├── Section: Tasks (Active, Completed, Saved, Applications, All Tasks)
│                           ├── Section: Ratings & Growth (Ratings, Leaderboard, Growth)
│                           ├── Section: Refer & Rewards (Refer & Earn, Vouchers)
│                           └── Section: More (Change Password, Two-Factor Auth)
│
└── TestModeBadge.jsx (Fixed Bottom-Right Floating Overlay)
```

### Detailed File Mapping

| Component | File Path | Role |
| :--- | :--- | :--- |
| **Page Component** | `apps/client/src/components/Performer/pages/PerformerAccountHubPage.jsx` | Main account hub view, manages state (`profile`, `walletBalance`, `referralStats`, `analyticsSummary`), renders 2-column layout. |
| **Parent Router** | `apps/client/src/App.jsx` (`/performer/*`) | Routes `/performer/*` with `<GatedRoute>` to `<PerformerApp>`. |
| **Performer Router** | `apps/client/src/components/Performer/PerformerApp.jsx` (`/account`) | Sub-router configuring `/account` under phone and onboarding verification guards. |
| **Header & Left Nav** | `apps/client/src/components/Performer/components/PerformerHeader.jsx` | Fixed top header (93px) AND fixed left sidebar (220px on `lg:`). Shared across ~35 performer views. |
| **Test Mode Indicator** | `apps/client/src/test-mode/components/TestModeBadge.jsx` | Fixed bottom-right badge (`z-[999999]`), toggles mock role and inspects state. |
| **Global Styles** | `apps/client/src/index.css` | Tailwind v4 theme variables, smooth scrolling, base background gradients. |

---

## 3. Current Layout, Positioning & Styling Analysis

### A. Header & Left Navigation (`PerformerHeader.jsx`)
- **Top Header:** 
  - Classes: `fixed left-0 top-0 z-[100] h-[93px] w-full border-b border-[rgba(177,186,199,0.35)] bg-white`
  - Fixed height of **93px**.
- **Left Navigation (`<aside>`):**
  - Classes: `fixed left-0 top-[93px] z-[90] hidden h-[calc(100vh-93px)] w-[220px] flex-col bg-[#fafafa] px-4 py-7 lg:flex`
  - Fixed width of **220px**, docked below header from `top: 93px`, full viewport remainder height `calc(100vh - 93px)`.
  - Visible only on `lg` breakpoint (`>= 1024px`).
  - Active check: `activePage === link.key`.
  - **Issue identified:** `PerformerAccountHubPage` passes `activePage="settings"`. The navigation link for Account has `key: "account"`. Consequently, "Account" in the left navigation is NOT highlighted as active!

### B. Page Outer Container (`PerformerAccountHubPage.jsx`)
- **Outer Wrapper:**
  - Classes: `min-h-screen bg-[var(--color-surface)] pt-[80px] font-sans text-[var(--color-text)]`
  - **Issue 1:** `pt-[80px]` is 13px smaller than the header height (`93px`). The top of the page content actually sits 13px *behind* the fixed header!
  - **Issue 2:** The outer wrapper has no height limit (`min-h-screen`), allowing unrestricted document-level height growth.
- **Main Container:**
  - Classes: `mx-auto w-full max-w-5xl px-4 pb-16 pt-4`
  - **Issue 3:** Does not offset for the 220px fixed left sidebar. Pages like `PerformerNewHomePage.jsx` use `lg:ml-[220px] lg:w-[calc(100%-220px)]`. On screens between 1024px and 1280px, `mx-auto max-w-5xl` collides with or sits uncomfortably close to the fixed sidebar.

### C. Column Structure & Scrolling Behavior
- **Flex Container:**
  - Classes: `flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6`
  - Switches to row layout only at `xl` breakpoint (`>= 1280px`).
- **Middle Column (Profile & Wallet Cards):**
  - Classes: `w-full xl:w-[380px] xl:shrink-0`
  - Static flow; moves vertically when document scrolls.
- **Right Column (Account Settings Panel):**
  - Classes: `min-w-0 flex-1`
  - Contains 6 multi-item sections (over 20 menu items).
  - Has **no** `overflow-y: auto`, **no** bounded height, and **no** flex shrink styling (`min-h-0`).
  - Because it expands to its natural content height (over 1200px), it forces the entire browser window to scroll.

### D. Test Mode Badge (`TestModeBadge.jsx`)
- **Positioning:**
  - Classes: `fixed bottom-4 right-4 z-[999999]`
  - Sits on top of the bottom-right corner.
  - If the right-hand panel content scrolls to the bottom, the floating badge can obscure the last action row (e.g., "Two-Factor Auth") unless adequate padding (`pb-20` / `pb-24`) is maintained.

---

## 4. Root Causes of the Scrolling Problem

1. **Absence of Viewport Boundary:**
   Neither the page wrapper nor the right content panel defines an explicit container height relative to the viewport (e.g., `calc(100vh - 93px)`).
2. **Document-Level Window Scrolling:**
   Because all containers have auto/unconstrained heights, standard browser document scrolling handles the entire page.
3. **Coupled Middle and Right Panels:**
   In standard document flow, the middle column (Hero Profile and Wallet) and the right column share the same scroll container (the window). When scrolling down to view Finance or Tasks, the user loses visibility of their Profile summary, ratings, and Wallet balance.
4. **Lack of Scroll Isolation Architecture:**
   CSS Flex/Grid inner scrolling requires three ingredients which are currently missing:
   - A constrained parent container (`h-[calc(100vh-93px)] overflow-hidden`).
   - A non-scrolling stationary middle column (`shrink-0`, optionally sticky or natural height).
   - A scrollable right column with `overflow-y: auto`, `min-height: 0`, and custom smooth scroll styling.

---

## 5. UI/UX Audit Findings

### Header
- Compact, clean branding.
- Search bar input operates correctly on Enter.
- Spacing between Search, NotificationBell, and Profile Dropdown is good.
- **Top border / height offset:** Page content needs exact alignment with the 93px header bottom.

### Left Navigation
- **Active state bug:** `PerformerAccountHubPage` calls `<PerformerHeader activePage="settings" />` instead of `activePage="account"`. As a result, the "Account" item in the sidebar lacks active background and text styling.
- **Hover & Focus:** Clear hover states exist (`hover:bg-white hover:text-slate-900`), but active styling can be made more prominent and consistent with brand tokens.

### Middle Profile Card
- **Visuals:** High-quality soft emerald gradient and ring blobs.
- **Hierarchy:** Clear differentiation between Avatar, Name, Email, RatingBadge, and Edit button.
- **Spacing:** Stat chips (`Completed`, `Earned`, `Referrals`) are clear; referral code pill is functional.
- **Stationary requirement:** On desktop, this card must stay fixed in view so the performer always sees their identity, rating, and balance.

### Wallet Card
- **Branding:** Strong emerald green gradient with subtle white background circles.
- **Actionability:** Clear click target to `/performer/wallet`.
- **Stationary requirement:** Must stay anchored beneath the Profile card in the stationary middle column.

### Right Account Panel
- **Categorization:** Logical groupings (Account, Finance, Tasks, Ratings & Growth, Refer & Rewards, More).
- **Row Styling:** Good icon backgrounds and labels, but separators and row padding can be tightened for better scannability.
- **Scroll Bar:** Must have a styled, unobtrusive scrollbar that doesn't overlap chevrons or text.
- **Padding:** Needs bottom clearance (`pb-24`) so the floating `TestModeBadge` never covers any item.

---

## 6. Proposed Technical Solution (Phase 2 & 3 Architecture)

### 3-Column Desktop Layout
On desktop (`lg:` / `xl:` >= 1024px/1280px):
1. **Left Column (220px):** Stationary `<aside>` rendered by `PerformerHeader`, anchored at `top: 93px`, `height: calc(100vh - 93px)`.
2. **Middle Column (360px - 380px):** Stationary profile hero card and wallet card. Placed in a non-scrolling flex/grid column, fitting neatly within viewport height.
3. **Right Column (Flex 1):** Independent vertical scroll container with `overflow-y: auto`, `min-h-0`, `h-full`, styled slim scrollbar, and `pb-24` bottom spacing.
4. **Root Desktop Viewport:** `h-[calc(100vh-93px)] overflow-hidden` under desktop breakpoints to prevent document-level scroll bouncing.

### Responsive Behavior Matrix
- **Desktop (>= 1280px / xl):** 
  - Left navigation: Stationary (220px fixed).
  - Middle profile & wallet: Stationary (380px fixed width).
  - Right settings panel: Independent vertical scroll with custom scrollbar.
  - Page document scroll: Disabled (`overflow: hidden`).
- **Tablet (1024px - 1279px / lg):**
  - Left navigation: Stationary (220px fixed).
  - Middle profile & wallet: Balanced 340px width.
  - Right settings panel: Independent scroll container.
  - No horizontal clipping; proper margin offset `lg:ml-[220px]`.
- **Mobile / Small Tablet (< 1024px):**
  - Left navigation: Hidden (standard mobile pattern).
  - Layout: Single natural column (`flex-col`).
  - Scrolling: Natural window document scrolling (`overflow-y: auto`, no trapped inner scroll containers).
  - Middle summary: Flows at the top of the page.
  - Right panel: Follows naturally below the wallet card.

---

## 7. Manual Verification Checklist (For Subsequent Phases)

| Item | Description | Status |
| :--- | :--- | :--- |
| **TC-01** | Header remains fixed at top with correct 93px height and no overlap. | NOT TESTED |
| **TC-02** | Left navigation is stationary on desktop and highlights "Account" as active. | NOT TESTED |
| **TC-03** | Middle column (Hero Card + Wallet Card) stays completely stationary during scroll. | NOT TESTED |
| **TC-04** | Right panel scrolls independently with mouse wheel and trackpad. | NOT TESTED |
| **TC-05** | All 6 sections (Account, Finance, Tasks, Ratings, Rewards, More) are reachable in right panel. | NOT TESTED |
| **TC-06** | Scrollbar in right panel does not obscure chevrons or text. | NOT TESTED |
| **TC-07** | Floating Test Mode Badge does not occlude the bottom-most menu item. | NOT TESTED |
| **TC-08** | All navigation links inside right panel (e.g. KYC, Wallet, Tasks) route correctly. | NOT TESTED |
| **TC-09** | Tablet viewport (1024px) retains sidebar and balanced column widths without overflow. | NOT TESTED |
| **TC-10** | Mobile viewport (< 1024px) seamlessly switches to single-column natural document scroll. | NOT TESTED |
