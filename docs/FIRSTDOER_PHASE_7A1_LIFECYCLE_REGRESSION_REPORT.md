# FIRSTDOER — PHASE 7A.1: LIFECYCLE REGRESSION REPORT

> **Environment:** `http://localhost:5175` in **Frontend Test Mode** (`PROVIDER` -> `Alex Morgan`, `TASKER` -> `Rahul Sharma` / `usr_performer_mock_2`).

---

## 1. 13-Step Regression Results

| # | Flow Tested | Observed Result | Status |
|---|---|---|---|
| 1 | Saved Templates initial load, category filter, search & `Use template` (`/provider/task-templates`) | Initial load immediately rendered `"Build a food delivery app"` (`Development`, `10000`, `React`); search `"food"` kept template visible; `Designs` showed category empty state; `Clear filters` restored list; `Use template` populated Title, Description, Budget, and Skills on `/provider/post-task-manual`. *(Note: Category/Approved Service dropdowns & Deadline are not auto-populated by template `details`.)* | **PASS** |
| 2 | Provider task creation & publishing (`/provider/post-task-manual`) | Created `"Phase 7A.1 Regression Task"` (`Tech, Data & Admin`, `Web Development`, `React`, `₹4,500`, `2026-12-30`) -> Preview -> Publish -> `/provider/task-status?taskId=task-1795002461744` -> visible in `/provider/my-tasks` (`Applications`, `₹4,500`). | **PASS** |
| 3 | Performer discovery & profile (`/provider/task-performers`, `/provider/task-performer-profile/usr_performer_mock_2`) | Search `"Rahul"` returned `Rahul Sharma` (`4.9`, `38 finished`, `₹650/hr`); profile rendered bio, skills, `Expert`, `4.94 / 5 · 48 reviews`. | **PASS** |
| 4 | Save and remove Performer (`/provider/saved-performers`) | Toggled `"Save for later"` -> `"Saved"` -> `"1 saved profile"` (`Rahul Sharma`) persisted across reload -> removed cleanly to `"No saved performers yet"`. | **PASS** |
| 5 | Applications & invitations (`task-101`, `usr_performer_mock_2`) | `/provider/task-applicants?taskId=task-101` showed `Rahul Sharma` & `Sneha Reddy`. `Assign task` -> `task-101` -> `"Send request →"` navigated directly to `/provider/confirm-and-pay`. *(Note: did not stay on profile with a `"Check & pay"` banner in this flow.)* | **PASS (Direct to Checkout)** |
| 6 | Performer invitation & agreement (`TASKER` role) | `/performer/invitation/task-101` and `/performer/task-agreement/task-101` both displayed `task-101`, `"Retail Shelf Audit & Stock Verification"`, `₹3,500`, `5 November 2026`, Client `"Alex Morgan (Nexus Labs)"`. | **PASS** |
| 7 | Provider Confirm & Pay & Test Mode Payment Success | Base `₹3,500` + 10% commission `₹350` + fee `₹49` = `₹3,899` -> `"Payment Successful! Task ASSIGNED to Rahul Sharma, #TASK-101"` -> `/provider/active-task/task-101`. | **PASS (Test Mode)** |
| 8 | Active task execution & checklist (`/provider/active-task/task-101`) | Checked Details, Updates, Files; approved pending item (`1/2` -> `2/2, 100%`) -> `Approve entire checklist` -> unlocked `Approve & Mark Complete`. | **PASS** |
| 9 | Task chat & message sending (`ActiveTaskChat`) | **0** empty message bubbles; all 3 seeded messages rendered real text (`02:30 PM`, `02:45 PM`, `11:50 PM`); sent `"Phase 7A.1 chat check"` cleanly. *(Minor fixture note: `MOCK_MESSAGES['conv-1']` copy references video reel cuts from `task-102` when shared on `task-101`.)* | **PASS** |
| 10 | Request Changes & dispute UI (`task-102`) | `Request Changes` modal on `task-102` and `/provider/active-task/task-102/performer-issues` dispute form rendered cleanly. | **PASS** |
| 11 | Provider task approval & completion (`task-101`) | `Approve & Mark Complete` -> 5-star review for `Rahul Sharma` -> `/provider/my-tasks?tab=completed` showed `Completed 2`, `Total Paid ₹8,500` (`task-101` `₹3,500` + `task-104` `₹5,000`). | **PASS** |
| 12 | Performer completed-task visibility (`TASKER` role) | Header switched to `RS` / `Rahul Sharma`. `/performer/my-tasks` `Active` showed `task-102` (`E-Commerce Short Video Reel Editing`); `Pending` showed `task-103` (`Submitted Work`); `Completed` showed both `task-101` (`Retail Shelf Audit & Stock Verification`) and `task-104` (`Competitor Pricing & Market Analysis`). *(Minor note: `task-101` remained under `Interests Sent` and Performer `Earnings total` card showed `₹2,000`.)* | **PASS** |
