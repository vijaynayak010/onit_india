# FIRSTDOER — PHASE 9A: REMAINING ISSUES REPORT

**Date:** 2026-11-18  
**Status:** Ready for Phase 9B / Polish Review (all Priority 1–4 critical Performer blockers resolved).

---

## Remaining Low/Medium Issues Identified During Phase 9A

| ID | Area / Route | Severity | Description | Recommended Next Step |
| :--- | :--- | :--- | :--- | :--- |
| **REM-9A-01** | `/performer/wallet`, `/performer/wallet/transactions`, `/performer/earnings` | **Medium** | While `/performer/wallet` Available Balance credits accurately (`+₹1,200`) on task completion, `/performer/wallet` (`PerformerWalletEarningsView.jsx`) and `/performer/wallet/transactions` displayed `"No recent activity yet."` / `"No transactions found."` in the browser run. `PerformerEarningsPage.jsx` transaction unwrapping was fixed post-browser-run (`Array.isArray(transRes)` support), but `PerformerWalletEarningsView.jsx` / `PerformerWalletTransactionsPage.jsx` still need matching response-shape normalization and browser confirmation. | Normalize `/wallet/transactions` array/envelope handling in `PerformerWalletEarningsView.jsx` (and `PerformerWalletTransactionsPage.jsx`) and verify in browser. |
| **REM-9A-02** | `/performer/chats?userId=...&taskId=...` (`375x812`) | **Low** | Inside an open chat thread on `375px` mobile, the header subtitle (`Provider: Alex Morgan...`) slightly touches the `Pin chat` icon button, though page-level `scrollWidth <= innerWidth` passes. | Add `min-w-0 flex-1 pr-2` / `truncate` spacing on the chat thread header title/subtitle container in `ChatsPage.jsx`. |
| **REM-9A-03** | Unmounted legacy route aliases (`/performer/saved`, `/performer/bank-details`, `/provider/post-task`) | **Low (Informational)** | Mounted routes are `/performer/saved-tasks`, `/performer/banks`, and `/provider/post-task-selection` / `/provider/post-task-manual`; navigating directly to `/performer/saved` or `/performer/bank-details` hits the catch-all redirect to `/performer/dashboard`. | Keep as-is unless backward-compatible redirect aliases are desired in `App.jsx` (outside Phase 9A scope). |
| **REM-9A-04** | Pre-existing ESLint `no-unused-vars` in 7 modified JSX files | **Low** | 17 pre-existing unused imports/variables (`Icon`, `motion`, `useRef`, `navigate`, etc.) and 2 hook dependency warnings remain in unchanged lines of modified files. | Clean up unused imports in Phase 9B code quality pass. |
