# FIRSTDOER — PHASE 10.2: FUNCTIONAL REGRESSION REPORT

**Date:** 2026-11-19  
**Test Environment:** Vite dev server (`http://localhost:5175`), Frontend Test Mode (`role=PERFORMER`).

| Flow | Status | Observed Evidence |
|---|---|---|
| Hero Carousel (`/performer/dashboard`) | **PASS** | Auto-advanced Slide 1 -> Slide 2 (`"Guaranteed Milestone Payments"` / `"View Wallet"`), and dot 3 switched to Slide 3 (`"Boost Your Performer Rank"` / `"Explore Growth"`). |
| Save for Later & Express Interest (`/performer/task/task-105`) | **PASS** | Both persisted (`"Task saved"`, `"Your interest has been sent!"` -> `"Interest sent"`). |
| Withdrawal & Reload Persistence (`/performer/wallet/withdraw` -> `/performer/wallet` & `/performer/earnings`) | **PASS** | `₹500` withdrawal initiated (`wd-17950`), `₹14,000` balance persisted across reload, `Pending ₹500` reflected on Earnings. |
| Agent Support (`/performer/agent-support`) | **PASS** | Sent `"Hello, checking task status for verification."` and rendered in thread with clean layout. |
| Chats Deep Link (`/performer/chats?userId=usr_provider_mock_1&taskId=task-102`) | **PASS** | Auto-opened `"E-Commerce Short Video Reel Editing"` thread with `"Provider: Alex Morgan (Nexus Labs)"`. |
