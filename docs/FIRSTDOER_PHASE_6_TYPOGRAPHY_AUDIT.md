# FIRSTDOER — PHASE 6: COMPLETE TYPOGRAPHY AUDIT

## 1. Root Cause Analysis

Inspection of `apps/client/src/index.css` (lines 240–266) revealed **unlayered** element selectors in Tailwind CSS v4:

```css
h1 { font-size: clamp(1.875rem, 1.25rem + 2.5vw, 3rem); font-weight: 500; line-height: 1.15; }
h2 { font-size: clamp(1.5rem, 1.15rem + 1.5vw, 2.25rem); font-weight: 500; line-height: 1.25; }
h3 { font-size: clamp(1.125rem, 1rem + 0.6vw, 1.5rem); font-weight: 500; line-height: 1.35; }
```

In Tailwind CSS v4, unlayered rules override `@layer utilities` (`text-sm`, `text-base`, `text-xl`, `text-2xl`, etc.). As a result:
- `BrowseCategoryGrid.jsx` (`<h2>` with `text-sm sm:text-base`, intended `14–16px`) was forced to **36px** on desktop.
- `TaskPerformersPage.jsx` (`<h1>` with `text-xl sm:text-2xl`, intended `20–24px`) was forced to **48px** on desktop.
- Every `<h1>` and `<h2>` across Provider and Performer dashboards was forced to marketing-landing-page dimensions (`30–48px` / `24–36px`) unless explicitly overridden by another unlayered class.

Additionally, component-level audits found widespread use of `font-black` (`900`), `font-extrabold` (`800`), and `text-3xl` (`30px`) / `text-[34px]` inside dashboard cards, search pages, task management pages, and Performer pages.

---

## 2. Centralized FirstDoer Typography Tokens (`apps/client/src/index.css`)

Standardized under existing `.dash-*` tokens (no duplicate design system):

| Token Class | Mobile | Tablet | Desktop | Weight | Line Height | Usage |
|---|---|---|---|---|---|---|
| `.dash-page-title` | `20px` | `22px` | `24px` | `600` | `1.25` | Primary page `<h1>` titles |
| `.dash-section-title` | `18px` | `18px` | `20px` | `600` | `1.3` | Major section `<h2>` headings |
| `.dash-subsection-title` | `16px` | `16px` | `16px` | `600` | `1.35` | Subsection headings |
| `.dash-card-title` | `15px` | `15px` | `15px` | `600` | `1.4` | Card titles |
| `.dash-body` | `14px` | `14px` | `14px` | `400` | `1.55` | Standard body text |
| `.dash-body-compact` | `13px` | `13px` | `13px` | `400` | `1.5` | Compact UI / table body |
| `.dash-label` | `12px` | `12px` | `12px` | `500` | `1.4` | Form labels & metadata |
| `.dash-caption` | `12px` | `12px` | `12px` | `400` | `1.4` | Helper & muted metadata |
| `.dash-overline` | `11px` | `11px` | `11px` | `600` | `1.4` | Uppercase eyebrow labels (`letter-spacing: 0.08em`) |
| `.dash-kpi` | `28px` | `28px` | `28px` | `700` | `1.2` | Tabular KPI metrics |

*Verified after implementation:*
- `Provider`: `DashboardPage` (`Browse by category` rendered height `26px`, compact `dash-section-title`), `TaskPerformersPage` (`Find the right performer` `<h1>` rendered height `26.98px` via `dash-page-title`), `TaskApplicantsPage`, `ConfirmAndPayPage`, `TaskPerformerProfilePage`, `PostTaskManualPage`, `MyTasksPage`, `BoostTaskPage`, and `settings/*` (`AddFundsView`, `EditProfileForm`, `ProviderInsightsView`) all use `.dash-*` tokens cleanly.
- `Performer`: `PerformerFindTasksPage` (`Find Tasks` `<h1>` rendered height `26.98px` via `dash-page-title`), `PerformerNewHomePage`, `PerformerSearchResultsPage`, `PerformerSearchLoadingPage`, `PerformerTaskAcceptedPage`, `PerformerAgentSupportPage`, `PerformerSwitchToProviderPage` updated to `.dash-page-title` / `.dash-section-title` without altering Performer layouts.

---

## 3. Codebase Audit Summary (Pre-Implementation)

### Provider Pages Flagged for Oversized Headings / Heavy Weights (`text-3xl+`, `text-[28px+]`, `font-black`, `font-extrabold`)
- `SearchPage.jsx` (16 occurrences), `TaskApplicantsPage.jsx` (13), `PostTaskManualPage.jsx` (12), `PostTaskSearchResultsPage.jsx` (11), `ConfirmAndPayPage.jsx` (9), `ProviderActiveTaskExecutionPage.jsx` (8), `BoostTaskPage.jsx` (8), `TaskPerformerProfilePage.jsx` (8), `AiPostingChatFlow.jsx` (8), `MyTasksPage.jsx` (7), `TaskManagementPage.jsx` (4), `TaskActivityPage.jsx` (3), `TaskPerformersPage.jsx` (2 + unlayered `h1`), `BrowseCategoryGrid.jsx` (unlayered `h2`).

### Performer Pages Flagged for Oversized Headings / Heavy Weights
- `PerformerReferPage.jsx` (12), `PerformerActiveTaskExecutionPage.jsx` (11), `PerformerEarningsTransactionDetailsPage.jsx` (8), `PerformerNewHomePage.jsx` (5), `PerformerSearchResultsPage.jsx` (5), `PerformerRatingsPage.jsx` (5), `PerformerBankDetailsPage.jsx` (4), `PerformerLeaderboardPage.jsx` (3), `PerformerTaskDetailsPage.jsx` (3), `PerformerTaskAcceptedPage.jsx` (3), `PerformerKycPage.jsx` (3), `PerformerEarningsPage.jsx` (3), `PerformerAccountHubPage.jsx` (3), `PerformerDailyQuizPage.jsx` (2), `PerformerFindTasksPage.jsx` (1), `PerformerSettingsPage.jsx` (1), `PerformerProfilePage.jsx` (1).
