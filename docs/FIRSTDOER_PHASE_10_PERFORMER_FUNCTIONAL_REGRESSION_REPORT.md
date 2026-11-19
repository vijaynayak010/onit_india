# FIRSTDOER — PHASE 10: PERFORMER FUNCTIONAL REGRESSION REPORT

**Date:** 2026-11-19  
**Environment:** Vite dev server (`http://localhost:5175`), Frontend Test Mode (`role=PERFORMER`).

---

## Functional Check Matrix

| Functional Area | Status | Observed Evidence |
| :--- | :--- | :--- |
| Wallet balance & transaction history consistency | **PASS** | `/performer/wallet`, `/performer/wallet/transactions`, and `/performer/earnings` consistently show `₹16,300` balance, `+₹1,800` payout (`Task Payout: Phase 10 Final Sign-Off Audit`), and clean single-minus withdrawals (`−₹4,200`). |
| Withdrawal form behavior & validation | **PASS** | `/performer/wallet/withdraw` quick-amount pills (`₹500`, `₹1,000`, `₹2,000`, `All`) work; `₹0` and `₹20,000` (> available balance) disable `Continue`; `₹500` submits to confirmation & `Withdrawal initiated`. *(Mock confirmation does not deduct localStorage balance.)* |
| Transaction detail information | **PASS** | `/performer/transactions/tx-1` renders `#2003456789`, `₹7,625`, `Refund Received`, back links, and survives reload. |
| Support form & navigation | **PASS** | `/performer/agent-support` disables submit on empty/whitespace input, posts messages, and preserves `Home` / `goBack()` navigation; `/performer/task-support/task-102` loads task support categories & live chat. |
| Task interest & saved-task persistence | **PASS** | Express Interest and Save for Later persist across page reloads and sync across `/performer/find-tasks`, `/performer/task/:id`, `/performer/saved-tasks`, and `/performer/my-tasks`. |
| Invitation acceptance | **PASS** | Verified in Phase 9A/9B (`/performer/invitations` -> `/performer/task/:id` -> `Accept Invitation`). |
| Active task checklist & revision flow | **PASS** | Sequential checklist submission, Provider `Request Changes`, Performer `Revision Required` feedback view, resubmission, and Provider approval all pass. |
| Chat deep links & controls | **PASS** | `/performer/chats?userId=usr_provider_mock_1&taskId=task-102` auto-opens Provider thread with clean header truncation (`8px` gap to `Pin chat`). |
| Notifications & account controls | **PASS** | Role-filtered Performer notifications only; `/performer/account`, `/performer/profile`, `/performer/settings`, `/performer/kyc`, and `/performer/banks` render and function cleanly. |
| Earnings & completed task updates | **PASS** | Newly completed task moves immediately to `/performer/my-tasks?tab=completed` and increments Earnings & Wallet history. |
