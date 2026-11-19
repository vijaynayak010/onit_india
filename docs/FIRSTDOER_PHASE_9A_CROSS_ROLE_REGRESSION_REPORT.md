# FIRSTDOER — PHASE 9A: CROSS-ROLE REGRESSION REPORT

**Date:** 2026-11-18  
**Environment:** Frontend Test Mode (`http://localhost:5175`), Provider (`Alex Morgan`) <-> Performer (`Rahul Sharma`).

---

## 1. Newly-Created Task Full Lifecycle E2E (`Phase 9A Checklist Fix Verification`, `₹1,200`)

| Step | Actor | Action & Route | Result | Observed Evidence |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Provider | Create & publish task with 1 checkpoint on `/provider/post-task-manual` | **PASS** | Created `task-1795018798407` (`₹1,200`, 1 checklist goal `"Deliver verified audit report"`). |
| 2 | Performer | Discover on `/performer/find-tasks`, open `/performer/task/:id`, click `Send Interest` | **PASS** | Application persisted; `Interest sent` remained after reload. |
| 3 | Provider | Check `/provider/my-tasks` & `/provider/task-applicants` | **PASS** | Task card showed `1 performer applied` and `Interested Candidates` incremented. |
| 4 | Provider | Hire Rahul Sharma & pay via Wallet on `/provider/confirm-and-pay` | **PASS** | Task funded and moved to `IN_PROGRESS`. |
| 5 | Performer | Post update & submit checklist item on `/performer/active-task/:id` | **PASS** | Execution update persisted with note + link; checklist item transitioned to `In Review`. |
| 6 | Provider | Click `Request Changes` on checklist item with feedback `"Please add executive summary section."` | **PASS** | Checklist item transitioned to `Revision Required` (`CHANGE_REQUESTED`). |
| 7 | Performer | Resubmit checklist item & task deliverables on `/performer/active-task/:id` | **PASS** | Feedback displayed cleanly; resubmitted item transitioned back to `In Review`. |
| 8 | Provider | Approve checklist item, `Approve entire checklist`, and `Approve & Mark Complete` | **PASS** | Task marked `COMPLETED`; Provider `/provider/my-tasks?tab=completed` and `Total Paid` updated. |
| 9 | Performer | Check `/performer/my-tasks?tab=completed` and `/performer/wallet` | **PASS (Tasks & Balance)** / **PARTIAL (Tx row)** | Performer `/performer/my-tasks?tab=completed` immediately displayed the newly completed task (`Completed: 3`, `Earnings total: ₹8,700` alongside `Phase 9A E2E Verification Audit` ₹2,500) without manual cache clearing. `/performer/wallet` Available Balance increased `+₹1,200` (`₹14,500` -> `₹15,700`). |

---

## 2. Direct Invitation Lifecycle E2E (`Invitation Flow Test Task`, `₹1,500`)

| Step | Actor | Action & Route | Result | Observed Evidence |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Provider | Create task & send direct invitation to Rahul Sharma from `/provider/task-performer-profile/usr_performer_mock_2` | **PASS** | Invitation created (`task-1795018506245`). |
| 2 | Performer | Open `/performer/invitations` | **PASS** | `Invitation Flow Test Task` listed with `Pending` status and `View Invitation →`. |
| 3 | Performer | Open `/performer/task/task-1795018506245` and click `Accept Invitation` | **PASS** | Transitioned to `"You're In! Waiting for provider payment"`, and `/performer/invitations` updated status to `Accepted`. |
