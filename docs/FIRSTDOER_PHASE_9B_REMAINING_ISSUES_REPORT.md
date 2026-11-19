# FIRSTDOER — PHASE 9B: REMAINING ISSUES REPORT

**Date:** 2026-11-19  
**Overall Status:** All P1 and P2 Phase 9B objectives resolved and verified (`PASS`).

---

## Remaining Minor / Informational Items

| ID | Area / Route | Severity | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
| **REM-9B-01** | `/performer/earnings` (`PerformerEarningsPage.jsx:345`) | **Low** | **Fixed (code/build)** | Withdrawal row in the Earnings table previously rendered `-₹-4,200` in the browser run; updated to `Math.abs(Number(tx.amount) || 0)` after the browser pass (verified via ESLint 0/0, `vitest` 58/58, and `vite build`). |
| **REM-9B-02** | `/performer/transactions/:id`, `/performer/earnings/transactions/:id`, `/performer/wallet/withdraw`, `/performer/support` | **Low** | **NOT TESTED** | Compiled and linted with 0 errors; not individually navigated during the Phase 9B browser pass. |
| **REM-9B-03** | Unfiltered `/provider/task-applicants` | **Low (Informational)** | **Informational** | Navigating to `/provider/task-applicants` without `?taskId=` shows 0 applicants; opening via `/provider/my-tasks` -> `Activity` -> `Review Applications` passes `?taskId=` and displays applicants cleanly. |
| **REM-9B-04** | Local dev Auth0 environment warnings | **Informational** | **Expected in Test Mode** | `VITE_AUTH0_CLIENT_ID_TASKER` and `VITE_AUTH0_CLIENT_ID_PROVIDER` missing warnings appear in local dev console; no production claims made from Test Mode. |
