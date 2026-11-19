# FIRSTDOER — PHASE 9B: WALLET TRANSACTION FIX REPORT

**Date:** 2026-11-19  
**Test Environment:** Vite dev server (`http://localhost:5175`), Frontend Test Mode (`role=PERFORMER`, `Rahul Sharma` / `usr_performer_mock_2`).  
**Scope:** Frontend-only (`apps/client/**`). Production backend behavior is not claimed from Test Mode.

---

## 1. Root Cause & Fix

- **Root Cause:** `apps/client/src/components/Performer/services/api.js` unwraps `res.data` via Axios interceptors, so `getTransactions()` in Test Mode returns a direct array (`[...]`). `PerformerWalletEarningsView.jsx` (`transRes?.data`), `PerformerWalletTransactionsView.jsx` (`response?.data`), and `PerformerEarningsPage.jsx` (`transRes?.data`) expected `{ data: [...] }`, causing valid transactions to be discarded and rendering `"No recent activity yet."` / `"No transactions found."` even after `approveAssignment()` credited the wallet and recorded a `CREDIT` payout transaction. Additionally, negative withdrawal amounts in mock data produced a double-minus (`−₹-4,200`) when formatted with `−₹${formatINR(tx.amount)}`, and `getPayoutMethodInfo()` omitted `method.handle` / `method.upiId` fallbacks.
- **Fix Applied:**
  - Added `extractTransactionList(response)` in [walletUtils.js](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/walletUtils.js) supporting direct arrays `[...]` and `{ data: [...] }`, `{ transactions: [...] }`, and `{ data: { transactions: [...] } }` envelopes, with `id`-based deduplication.
  - Added `method.handle || method.upiId` fallback for UPI payout labels in `getPayoutMethodInfo()`.
  - Updated [PerformerWalletEarningsView.jsx](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletEarningsView.jsx), [PerformerWalletTransactionsView.jsx](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/PerformerWalletTransactionsView.jsx), and [PerformerEarningsPage.jsx](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerEarningsPage.jsx) to use `extractTransactionList`.
  - Used `Math.abs(Number(tx.amount) || 0)` in [TransactionListItem.jsx](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/components/wallet/TransactionListItem.jsx) and [PerformerEarningsPage.jsx](file:///d:/Onitindia/onitindia1-main/apps/client/src/components/Performer/pages/PerformerEarningsPage.jsx) so withdrawals render cleanly as `−₹4,200`.

---

## 2. Actual Observed Results

| Route & Component | Status | Observed Result |
| :--- | :--- | :--- |
| `/performer/wallet` (`PerformerWalletEarningsView.jsx`) | **PASS** | Available balance increased from `₹14,500` to `₹15,700` after completing `Phase 9B Wallet Payout Audit` (`₹1,200`); `Recent activity` lists `Task Payout: Phase 9B Wallet Payout Audit` (`19 Nov • Completed`, `+₹1,200`); UPI shows `rahulsharma@okhdfcbank Verified`; withdrawal renders `−₹4,200`. |
| `/performer/wallet/transactions` (`PerformerWalletTransactionsView.jsx`) | **PASS** | Lists `Task Payout: Phase 9B Wallet Payout Audit` (`+₹1,200`) + 3 seeded withdrawals (`−₹4,200`), zero duplicates, persists across page reload. |
| `/performer/earnings` (`PerformerEarningsPage.jsx`) | **PASS** | Available Balance `₹15,700`, `This Month ₹1,200`, `Transaction History` lists `Task Payout: Phase 9B Wallet Payout Audit` (`+₹1,200`), zero duplicates, persists across reload. *(Double-minus on Earnings table withdrawal row was fixed post-browser-run via `Math.abs`.)* |

---

## 3. Known Limitations

- Verified in Frontend Test Mode against `mockDb`; live production backend transaction payloads depend on `GET /wallet/transactions` returning an array or one of the supported envelope shapes.
