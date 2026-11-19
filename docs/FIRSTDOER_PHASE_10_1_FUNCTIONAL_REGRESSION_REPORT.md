# FIRSTDOER — PHASE 10.1: FUNCTIONAL REGRESSION REPORT

**Date:** 2026-11-19  
**Test Environment:** Vite dev server (`http://localhost:5175`), Frontend Test Mode (`role=PERFORMER`).

---

## Functional Regression Matrix

| Area | Routes / Flows Tested | Status | Observed Evidence |
|---|---|---|---|
| **Wallet & Withdrawal** | `/performer/wallet/withdraw`, `/performer/wallet`, `/performer/wallet/transactions`, `/performer/earnings` | **PASS** | Validation rejects `₹0` and `₹20,000` (> `₹14,500`); `₹500` withdrawal deducts balance to `₹14,000`, creates `Withdrawal to UPI` (`Processing`, `−₹500`), updates `Pending ₹500` on Earnings, and persists across reload with zero duplicates. |
| **Account, Profile & Settings** | `/performer/account`, `/performer/profile`, `/performer/settings`, `/performer/kyc`, `/performer/banks` | **PASS** | Clean rendering, normal-weight (`font-normal`) Account/Profile/Settings typography (`Professional Title` aligned), `rahulsharma@okhdfcbank` shown on Banks, zero errors. |
| **Agent Support** | `/performer/agent-support` | **PASS** | Initial `h1` (`y = 201.17`) remains below `80px` sticky header; sending message updates chat list cleanly without jumping page scroll. |
| **Task Execution & Queue** | `/performer/active-task/task-102`, `/performer/my-tasks` | **PASS** | `E-Commerce Short Video Reel Editing` and `My Tasks` (`Active tasks 1`, `Total queue 3`) render & operate cleanly. |
| **Chat & Notifications** | `/performer/chats?userId=usr_provider_mock_1&taskId=task-102`, `/performer/notifications` | **PASS** | Deep-linked chat (`Alex Morgan`) and role-filtered Performer notifications load cleanly with zero new console errors. |
