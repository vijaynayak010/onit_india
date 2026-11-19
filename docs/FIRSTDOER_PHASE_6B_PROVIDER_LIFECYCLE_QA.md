# FIRSTDOER — PHASE 6B: PROVIDER LIFECYCLE QA REPORT

> **Environment:** `http://localhost:5175` in **Frontend Test Mode** (`PROVIDER` role, clean reset via Test Mode Control Panel).

---

## 1. End-to-End 24-Step Lifecycle Verification

| Step | Stage | Route / Component | Trigger Action | Data Verified & ID Retention | Next Action / Back Behavior | Status |
|---|---|---|---|---|---|---|
| 1 | Provider Dashboard | `/provider/dashboard` (`DashboardPage.jsx`) | Initial login / `Home` nav | Shows KPIs, active tasks, categories, verified performers | Clicks navigate cleanly; `goBack()` returns directly | **Verified in Browser** |
| 2 | Post Task Entry | `/provider/post-task-selection` (`PostTaskSelectionPage.jsx`) | Header `Post Task` / Dashboard CTA | Offers AI Assistant vs Manual Form | `Start Manual Form` -> `/provider/post-task-manual`; Back -> Dashboard | **Verified in Browser** |
| 3 | AI or Manual Creation | `/provider/post-task-ai` & `/provider/post-task-manual` | Mode selection | AI chat starter prompts & manual form fields | Submits/previews; Back -> Selection | **Verified in Browser** |
| 4 | Task Details & Preview | `/provider/post-task-manual` | Fill fields -> Preview | Title, category, budget, deadline, checklist | Publish -> `/provider/task-status` | **Verified in Browser** |
| 5–7 | Publish & Status | `/provider/task-status` (`TaskStatusPage.jsx`) | Publish CTA | Displays published task status | Links to `/provider/my-tasks` & `/provider/task-applicants` | **Implemented / Code-Audited** |
| 8–9 | Task Applicants & Review | `/provider/task-applicants?taskId=task-101` (`TaskApplicantsPage.jsx`) | `Applicants` KPI / Task CTA | Retains `taskId=task-101`; Rahul Sharma & Sneha Reddy cards non-overlapping | `View Profile` / `Hire` / `Reject` | **Verified in Browser** |
| 10–11 | Performer Profile | `/provider/task-performer-profile/usr_tasker_1` (`TaskPerformerProfilePage.jsx`) | Click Aarav Patel card | Bio, skills (`Full Stack`, `Operations`, `Market Research`), `4.98` rating, `64` completed | `Assign task` / `Save` / Back | **Verified in Browser** |
| 12 | Shortlist / Save Performer | `/provider/saved-performers` (`SavedPerformersPage.jsx`) | Bookmark icon / Account `Saved Performers` | Saves globally via `getSavedPerformers` + `localStorage` | Opens profile; no per-task shortlist API | **Verified in Browser** |
| 13–14 | Send Invitation & Check Status | `/provider/task-performer-profile/usr_tasker_1` | `Assign task` -> select `task-101` -> `Send request` | `inv-501` (`ACCEPTED` for `task-101` / `usr_tasker_1`); `Check & pay` banner appears | `Check & pay` -> `/provider/confirm-and-pay` | **Verified in Browser** |
| 15 | Performer Agreement *(Cross-Role)* | `/performer/task-agreement/:id` (`PerformerTaskAgreementPage.jsx`) | Performer accepts/declines offer | Handled on Performer side via `acceptOffer` / `declineOffer` | Redirects Performer to active task | **Code-Audited (Cross-Role)** |
| 16 | Confirm & Pay | `/provider/confirm-and-pay` (`ConfirmAndPayPage.jsx`) | `Check & pay` / `Hire` | Retains `task-101` & `usr_tasker_1`; total `₹3,899`; zero React render-update warnings | `Pay ₹3,899` -> `Payment Successful!` | **Verified in Browser** |
| 17 | Payment Success | Inline overlay + `/provider/payment-success` (`PaymentSuccessPage.jsx`) | Verified Test Mode payment | Countdown redirects to `/provider/active-task/task-101`; direct visit shows safe fallback | Auto-redirect to active task | **Verified in Browser** |
| 18–19 | Active Task Workspace | `/provider/active-task/task-101` (`ProviderActiveTaskExecutionPage.jsx`) | Redirect / `My Tasks` | Shows `Task Details`, `Execution Updates`, `Task Checklist`, `Files & Documents`, `Open Chat` | Tabs switch cleanly without page reload | **Verified in Browser** |
| 20 | Request Changes / Report Issue | `RequestChangesModal` & `/provider/active-task/:id/performer-issues` | `Request Changes` / `Report an issue` | `task-102` checklist item 2 (`Brand captions & motion hooks`) shows `In Review` with `Request Changes` / `Approve` | Submits revision or dispute | **Verified in Browser** |
| 21–23 | Approve Deliverables & Complete | `/provider/active-task/task-101` | Approve checklist item (1/2 -> 2/2, 100%) -> `Approve entire checklist` -> `Approve & Mark Complete` | Task status updates to `COMPLETED` in Test Mode | Automatically opens `ReviewModal` | **Verified in Browser** |
| 24 | Provider Rating & Review | `ReviewModal.jsx` inside `/provider/active-task/task-101` | Submit 5-star review | Displays `"Thank You! Your feedback has been shared."` | Stays on completed task summary | **Verified in Browser** |

---

## 2. Missing Workflow Pages & Backend Dependencies

1. **No Dedicated `/provider/invitations` List Page:**
   - **Finding:** `provider/services/api.js` exposes `sendTaskInvitation(taskId, taskerId)` and per-task `getTaskInvitations(taskId)`, but no cross-task `GET /providers/me/invitations` endpoint exists.
   - **Recommendation:** Add `GET /providers/me/invitations` on `apps/server` if a global sent-invitations tracker is desired in a future phase.
2. **No Dedicated `/provider/task-agreement` Page:**
   - **Finding:** Agreement acceptance/decline is intentionally handled by the Performer-side workflow (`PerformerTaskAgreementPage.jsx` via `PUT /tasks/assignments/:assignmentId/accept-offer` and `decline-offer`). No Provider-side contract PDF or term-negotiation endpoint exists.
3. **No Per-Task Shortlist API:**
   - **Finding:** `SavedPerformersPage.jsx` persists global performer bookmarks (`GET /providers/saved-taskers` + `localStorage`), not per-task shortlists.

---

## 3. Known Lifecycle Fixes Verified in Phase 6B

- **`MyTasksPage.jsx` Single-Back Navigation:** Fixed `setSearchParams({ tab: location.state.tab.toLowerCase() }, { replace: true })` so clicking Dashboard `Applicants` KPI -> `/provider/my-tasks?tab=applicants` -> **one** browser Back returns directly to `/provider/dashboard`.
- **`ConfirmAndPayPage.jsx` Clean Redirect:** Removed `navigate()` from inside `setRedirectSeconds((prev) => ...)` state updater; verified **zero** React state-update-during-render console warnings during `Confirm & Pay` -> `Payment Successful` -> `/provider/active-task/task-101`.
