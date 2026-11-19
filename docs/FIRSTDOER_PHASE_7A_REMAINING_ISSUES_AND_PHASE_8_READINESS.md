# FIRSTDOER — PHASE 7A: REMAINING ISSUES AND PHASE 8 READINESS

> **Approval Gate:** Phase 7A is complete. **Do not start Phase 7B or Phase 8** until the project owner reviews these 5 reports and grants explicit approval.

---

## 1. Unresolved Frontend Issues

1. **`TaskTemplatesPage.jsx` Initial Category State (Medium):** When `useHomeContent()` categories nest templates inside individual category records, initial load shows `"No templates found"` until a category pill (e.g. `Development`) is clicked or unless `categories` is populated cleanly on mount.
2. **Pre-existing ESLint Debt (`249` problems: `228` errors, `21` warnings):** Unused `motion` imports and hook dependency warnings across `ChatsPage.jsx` (`4`), `ProviderActiveTaskExecutionPage.jsx` (`4`), `TaskApplicantsPage.jsx` (`4`), `PerformerTaskAgreementPage.jsx` (`1`), `Blog/*`, `Admin/*`, and `pages/*`.
3. **Test Mode Persona Alignment (`TASKER` vs `usr_tasker_1`) (Low):** Test Mode `TASKER` role logs in as Rahul Sharma (`usr_performer_mock_2`), whereas `task-101`'s accepted invitation (`inv-501`) is assigned to Aarav Patel (`usr_tasker_1`), so `task-101` does not appear under `TASKER` My Tasks when switching roles.
4. **Seeded Empty Chat Bubbles in `ActiveTaskChat` (Low):** `task-101` Task Chat displays 3 pre-existing seeded message bubbles with timestamps and empty text in Test Mode.

---

## 2. Backend-Dependent Blockers & Untested Live Flows (Not Production-Ready Without Backend Verification)

- **Auth0 Login & Role Sync (`AuthContext.jsx`, `GatedRoute.jsx`, `RequirePerformerOnboarding.jsx`):** Cannot be verified until `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID_*` are configured with a live backend.
- **Razorpay Live Checkout, Webhook Settlement & Escrow Release (`ConfirmAndPayPage.jsx`):** Test Mode uses `paymentRequired: false`; live Razorpay orders, signature verification, and payouts require staging `apps/server`.
- **S3 Presigned File Uploads (`ProviderActiveTaskExecutionPage.jsx`, `PostTaskManualPage.jsx`):** Live S3 upload/download requires `apps/server`.
- **Missing Backend APIs (Documented, Not Invented):** Cross-task `/provider/invitations` list (`GET /providers/me/invitations`), Provider custom templates CRUD, per-task shortlist API, `BoostTaskPage` promotion API, and Provider-side contract PDF/agreement review.

---

## 3. Recommendation for Next Phase

- **Ready for Owner Review & Phase 7B / Phase 8 Approval:** Prioritize live staging backend + Auth0 + Razorpay sandbox E2E testing, followed by optional cleanup of the remaining `249` pre-existing ESLint items and `TaskTemplatesPage` initial template display.
