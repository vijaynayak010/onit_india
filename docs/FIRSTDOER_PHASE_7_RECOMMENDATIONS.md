# FIRSTDOER — PHASE 7 RECOMMENDATIONS & APPROVAL GATE

> **Approval Gate:** Phase 6 audit is complete. **Do not begin Phase 7** until the project owner reviews these 6 reports and grants explicit approval.

---

## 1. Overall Readiness Summary

- **Provider Routes:** `54` route entries (`45` component routes, `9` redirect/index/catch-all routes, `43` unique mounted page components, `44` files in `provider/pages/`).
- **Performer Routes:** `51` route entries (`46` component routes, `5` redirect/index routes, `47` unique mounted page components).
- **Browser-Verified Routes (Test Mode):** `24` Provider routes/views tested across `1440x900`/`375x812` and `8` core routes verified across the full `9`-viewport matrix (`72/72` checks PASS, `0` horizontal overflow).
- **Untested in Browser:** Static SEO pages (`7`), auth/account-mutation pages (`onboarding`, `restore-account`, `forgot-password`, `check-email`, `change-password`, `two-factor-auth`, `delete-account`, `switch-to-performer`), `agent-support`, `boost-task`, `payment-selection`, `draft-tasks`, `task-history`, `explore-talent`, `search`, and legacy `post-task-details` / `post-task-results`.
- **Live-Backend Verified Journeys:** `0` (all browser tests ran in Frontend Test Mode; live `apps/server`, Auth0, and Razorpay integration remain pending).

---

## 2. Recommended Phase 7 Implementation Order

1. **P0 — Staging Backend, Auth0 & Razorpay E2E Verification:**
   - Connect `apps/client` to staging `apps/server`, configure `.env` Auth0 & Razorpay sandbox keys, and execute the full 22-step Provider-to-Performer lifecycle with live API responses and file uploads.
2. **P1 — Fix React Hooks & Repo-Wide ESLint Errors:**
   - Fix `react-hooks/rules-of-hooks` violations in `GatedRoute.jsx` and `RequirePerformerOnboarding.jsx`.
   - Clean up remaining unused imports/vars and `exhaustive-deps` warnings in `ProviderActiveTaskExecutionPage.jsx`, `TaskApplicantsPage.jsx`, `TaskTemplatesPage.jsx`, `PostTaskSearchResultsPage.jsx`, and `PerformerTaskAgreementPage.jsx`.
3. **P2 — UI & Accessibility Polish:**
   - Add `<main>` landmarks to `TaskPerformersPage.jsx` and `ChatsPage.jsx`.
   - Auto-load all active templates on `/provider/task-templates` initial mount and wire or remove the decorative `<Mic />` button.
   - Offset the Test Mode floating pill above the chat composer on `/provider/chats`.
4. **P3 — Backend-Coordinated Enhancements (If Prioritized by Product):**
   - Cross-task `/provider/invitations` endpoint & view.
   - Provider-authored custom templates CRUD (`TaskTemplatesPage.jsx`).
   - `BoostTaskPage.jsx` promotion API.
   - Deprecate/archive confirmed unused legacy files (`RatingsPage.jsx`, `RatingsReceivedPage.jsx`, `PostTaskDetailsPage.jsx`, `PostTaskSearchResultsPage.jsx`) after owner approval.
