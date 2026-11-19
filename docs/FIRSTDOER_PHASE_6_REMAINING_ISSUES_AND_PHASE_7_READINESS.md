# FIRSTDOER — PHASE 6: REMAINING ISSUES AND PHASE 7 READINESS

> **Approval Gate:** Phase 6 audit is complete. Phase 7 has **NOT** started and awaits explicit project owner approval.

---

## 1. Prioritized Remaining Issues

### Critical Issues
- **None** in Frontend Test Mode for the core Provider lifecycle (`0` runtime crashes, `0` horizontal overflow across `72/72` viewport checks, `58/58` unit tests passing, `vite build` clean).
- *(Environment note: Live backend integration, Auth0 login, and Razorpay signature verification are untested until `apps/server` and `.env` credentials are connected.)*

### High-Priority Issues
1. **Repo-Wide ESLint Debt (`261` problems: `240` errors, `21` warnings):** Includes `react-hooks/rules-of-hooks` violations in `GatedRoute.jsx` and `RequirePerformerOnboarding.jsx`, plus unused imports/vars in `ProviderActiveTaskExecutionPage.jsx`, `TaskApplicantsPage.jsx`, `TaskTemplatesPage.jsx`, `PostTaskSearchResultsPage.jsx`, `PerformerTaskAgreementPage.jsx`, `Blog/*`, and `pages/*`.

### Medium-Priority Issues
1. **Missing Backend Endpoints for Optional Provider Features:**
   - Cross-task sent invitations list (`GET /providers/me/invitations`).
   - Provider-authored custom task templates CRUD (currently `TaskTemplatesPage.jsx` only displays admin/catalog templates from `useHomeContent()`).
   - Per-task shortlist API (`SavedPerformersPage.jsx` is global only).
   - Live `BoostTaskPage` promotion API.
2. **Test Mode Checklist Revision Display (`mockDatabase.js`):** `task-102` item 3 (`CHANGES_REQUESTED`) normalizes to `Status: Pending` in UI; item 2 (`SUBMITTED`) renders `In Review` with `Request Changes` / `Approve` buttons.
3. **Decorative Mic Button on `TaskTemplatesPage.jsx`:** Search bar renders a `<Mic />` icon button with no `onClick` handler.

### Low-Priority Issues
1. **Missing `<main>` Landmark:** `TaskPerformersPage.jsx` and `ChatsPage.jsx` wrap content in `<div>` instead of `<main>`.
2. **Orphaned Legacy Files:** `RatingsPage.jsx` and `RatingsReceivedPage.jsx` in `provider/pages/` are not routed in `ProviderApp.jsx` (superseded by `SettingsPage` tabs).
3. **Test Mode Pill Overlap on `/provider/chats`:** The floating bottom-right `FRONTEND TEST MODE` widget overlaps the chat send button area in Test Mode only.

---

## 2. Phase 7 Readiness Recommendation

- **Items Recommended Before / At Start of Phase 7:**
  1. Connect `apps/client` to staging `apps/server` + Auth0 + Razorpay sandbox to run live end-to-end verification of every API-dependent route.
  2. Clean up `react-hooks/rules-of-hooks` errors in `GatedRoute.jsx` and `RequirePerformerOnboarding.jsx` and remaining ESLint errors in Provider/Performer pages.
- **Items Safe to Schedule Later:**
  - Custom Provider-saved templates CRUD, cross-task `/provider/invitations` list, `BoostTaskPage` backend integration, and `<main>` landmark polish.
- **Readiness Verdict:** **Ready for Owner Review & Phase 7 Approval** (subject to live backend integration testing in Phase 7).
