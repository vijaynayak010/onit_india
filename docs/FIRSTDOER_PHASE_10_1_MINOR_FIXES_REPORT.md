# FIRSTDOER — PHASE 10.1: MINOR FIXES REPORT

**Date:** 2026-11-19  
**Test Environment:** Vite dev server (`http://localhost:5175`), Frontend Test Mode (`role=PERFORMER`).  
**Scope:** Frontend-only (`apps/client/**`).

---

## 1. REM-10-01 — Withdrawal Mock Balance Persistence (`/performer/wallet/withdraw`)

- **Root Cause:** `apps/client/src/test-mode/mockApiHandler.js` returned a static `{ success: true, withdrawalId, status: 'PROCESSING' }` for `/payout-methods/withdrawals` without validating balance, deducting `mockDb` wallet balance, or recording a `DEBIT` transaction in `localStorage`.
- **Files Modified:**
  - `apps/client/src/test-mode/mockDatabase.js` (`getWithdrawals`, `requestWithdrawal`)
  - `apps/client/src/test-mode/mockApiHandler.js` (`POST`/`GET /payout-methods/withdrawals`)
- **Changes Implemented:**
  - Added balance validation (`amount > 0` and `amount <= currentBalance`), idempotency key deduplication (`requestKey`), `localStorage` wallet balance deduction (`balance`, `available`, `availableBalance`), and `PROCESSING` `DEBIT` transaction persistence (`Withdrawal to UPI`).
- **Before vs. After & Verification:**
  - Before: `₹500` test withdrawal showed `Withdrawal initiated` without deducting `₹14,500` or adding a withdrawal record.
  - After: `₹0` and `₹20,000` remain disabled (`Enter an amount`); submitting `₹500` deducts balance to `₹14,000`, adds `Withdrawal to UPI · Processing · −₹500` across `/performer/wallet`, `/performer/wallet/transactions`, and `/performer/earnings` (`Pending ₹500`), and persists cleanly across page reloads with zero duplicate deductions (**PASS**, Test Mode only).

---

## 2. REM-10-02 — Agent Support Initial Scroll (`/performer/agent-support`)

- **Root Cause:** `PerformerAgentSupportPage.jsx` called `bottomRef.current?.scrollIntoView({ behavior: "smooth" })` on `[messages]` changes, which scrolled the outer `window` viewport downward on initial load and message send, pushing `h1` under the `80px` sticky header.
- **Files Modified:**
  - `apps/client/src/components/Performer/pages/PerformerAgentSupportPage.jsx`
- **Changes Implemented:**
  - Replaced `bottomRef.current?.scrollIntoView()` with internal container scrolling (`messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight`) guarded by `!loading`.
- **Before vs. After & Verification:**
  - Before: Initial load and message send pushed `h1` near/under `y = 80px`.
  - After: At `1440×900`, `h1` stays at `y = 201.17` on initial load and `y = 193.17` after sending a message; at `375×812`, initial `h1` stays at `y = 201.17` and sending via `Enter` causes `0px` window jump while scrolling the internal message list (**PASS**).

---

## 3. REM-10-03 — Profile `Professional Title` Font Weight (`/performer/profile`)

- **Root Cause:** The `Professional Title` `<label>` in `PerformerProfilePage.jsx:783` retained `font-medium` while adjacent form labels (`Full Name *`, `Location / City`) used `font-normal`.
- **Files Modified:**
  - `apps/client/src/components/Performer/pages/PerformerProfilePage.jsx`
- **Changes Implemented:**
  - Changed `<label className="text-xs font-medium text-slate-700">` to `text-xs font-normal text-slate-700`.
- **Before vs. After & Verification:**
  - Inspected at `1440×900` and `375×812`: `Professional Title`, `Full Name *`, and `Location / City` labels all share identical `text-xs font-normal text-slate-700` (`400` weight) with Poppins intact (**PASS**).
