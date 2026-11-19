# FIRSTDOER — PHASE 8: REMAINING ISSUES AND NEXT PHASE READINESS

> **Approval Gate:** Phase 8 is complete. **STOP** — do not begin another phase or introduce additional features without explicit project owner approval.

---

## 1. Remaining Frontend & Backend-Dependent Items

1. **Live Backend, Auth0 & Razorpay Verification (Blocked on Backend/Env):**
   - All Phase 8 browser verification ran in Frontend Test Mode (`mockDatabase.js` / `mockApiHandler.js`). Live `apps/server` APIs, Auth0 OAuth (`VITE_AUTH0_CLIENT_ID_*`), Razorpay live checkout/webhooks, and S3 presigned uploads require staging environment integration.
2. **Pre-existing Repo-Wide ESLint Debt (Out of Phase 8 Scope):**
   - `248` pre-existing ESLint problems remain in untouched/legacy modules (`Blog/*`, `Admin/*`, `pages/*`, `ChatsPage.jsx` [`4` unused vars], `ProviderActiveTaskExecutionPage.jsx`, `TaskApplicantsPage.jsx`, `PerformerTaskAgreementPage.jsx`), intentionally left untouched to avoid mass refactoring unrelated legacy files.
3. **Documented Backend Feature Gaps (Do Not Fake in Frontend):**
   - Cross-task `/provider/invitations` list (`GET /providers/me/invitations`), Provider custom templates CRUD, per-task shortlist API, `BoostTaskPage` promotion API, and Provider-side contract PDF review.
4. **Minor UX Polish Item:**
   - `TaskTemplatesPage.jsx` -> `Use template` -> `PostTaskManualPage.jsx`: Category/Approved Service dropdowns wait for async catalog load (`listTaskCatalogDomains` / `listTaskCatalogServices`) and templates do not carry a default `serviceId` or `deadline`.

---

## 2. Readiness Verdict

- **Frontend Product Experience (Test Mode):** Verified and ready for project owner review.
- **Next Recommended Phase:** Live Staging Backend, Auth0 & Razorpay E2E Integration Testing (subject to explicit owner approval).
