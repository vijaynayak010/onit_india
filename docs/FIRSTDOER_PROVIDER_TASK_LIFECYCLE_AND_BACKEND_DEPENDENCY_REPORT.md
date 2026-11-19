# FIRSTDOER — PROVIDER TASK LIFECYCLE AND BACKEND DEPENDENCY REPORT

---

## 1. Complete Performer-to-Task Lifecycle (Route-by-Route)

| # | Lifecycle Step | Page & Route | Component | Entry / Primary Action -> Next | API / Service Dependency | Status |
|---|---|---|---|---|---|---|
| 1 | Open Task Performers | `/provider/task-performers` | `TaskPerformersPage.jsx` | Dashboard `View all` / Header search -> filter by category, skill, rating, experience | `getTaskerRankings` | **Implemented & Browser-Verified** |
| 2 | View Performer Card & Profile | `/provider/task-performer-profile/:name` | `TaskPerformerProfilePage.jsx` | Click card -> inspect bio, skills, experience, ratings, completed tasks, bookmark | `getTaskerProfile`, `getTaskerReviewsList`, `savePerformer` | **Implemented & Browser-Verified** |
| 3 | Review Applicants | `/provider/task-applicants?taskId=` | `TaskApplicantsPage.jsx` | Dashboard KPI / `MyTasksPage` -> inspect applicant cards, `View Profile`, `Reject`, or `Hire` | `getTaskDetails`, `getTaskInterests`, `rejectInterest` | **Implemented & Browser-Verified** |
| 4 | Invite / Assign Performer | `/provider/task-performer-profile/:name` | `TaskPerformerProfilePage.jsx` | `Assign task` modal -> select task -> `sendTaskInvitation(taskId, taskerId)` | `sendTaskInvitation`, `getTaskInvitations` | **Implemented & Browser-Verified** |
| 5 | Agreement / Offer Acceptance *(Cross-Role)* | `/performer/task-agreement/:id` & `/performer/invitation/:id` | `PerformerTaskAgreementPage.jsx`, `PerformerTaskInvitationPage.jsx` | Performer accepts/declines offer; Provider clicks `Check & pay` on profile | `acceptOffer`, `declineOffer` (Performer); `getTaskInvitations` (Provider) | **Implemented on Performer Side (Code-Audited)** |
| 6 | Confirm & Pay | `/provider/confirm-and-pay` | `ConfirmAndPayPage.jsx` | Review task, performer, fee breakdown, vouchers, wallet toggle -> `Pay ₹...` | `previewTaskPayment`, `listMyVouchers`, `createRazorpayOrder`, `verifyRazorpayPayment`, `acceptInterest`, `directHireTasker` | **Implemented & Browser-Verified (Test Mode bypasses live Razorpay)** |
| 7 | Payment Success & Assignment | Inline overlay + `/provider/payment-success` | `ConfirmAndPayPage.jsx`, `PaymentSuccessPage.jsx` | Displays verified payment receipt & auto-redirects to active task (with safe fallback on direct visit) | Order/payment verification state | **Implemented & Browser-Verified** |
| 8 | Active Task Execution | `/provider/active-task/:id` | `ProviderActiveTaskExecutionPage.jsx` | Review `Task Details`, `Execution Updates`, `Task Checklist`, `Files & Documents`, `Open Chat` | `getTaskDetails`, `getChecklist`, `getTaskUpdates`, `listConversations`, `getMessages`, `sendMessage` | **Implemented & Browser-Verified** |
| 9 | Handle Issues / Revisions | `RequestChangesModal` & `/provider/active-task/:id/performer-issues` | `ProviderActiveTaskExecutionPage.jsx`, `ProviderTaskSupportPage.jsx` | `Request Changes` on checklist item / `Request Revision` / `Report an issue` | `requestChecklistItemChange`, `rejectAssignment`, `createTaskDispute` | **Implemented (Checklist & Support)** |
| 10 | Approve Deliverables & Complete | `/provider/active-task/:id` | `ProviderActiveTaskExecutionPage.jsx` | Approve checklist items -> `Approve entire checklist` -> `Approve & Mark Complete` | `approveChecklistItem`, `approveChecklist`, `approveAssignment`, `completeTask` | **Implemented & Browser-Verified** |
| 11 | Review Performer | `/provider/active-task/:id` (`ReviewModal`) | `ProviderActiveTaskExecutionPage.jsx` | Auto-opens on completion -> submit rating & comment | `createTaskReview` | **Implemented & Browser-Verified** |

---

## 2. Task Agreement & Payment Relationship

- **Does a dedicated Provider Task Agreement screen exist?** **No.**
- **Actual Implementation:** Agreement acceptance is handled on the **Performer side** (`PerformerTaskAgreementPage.jsx` at `/performer/task-agreement/:id` using `PUT /tasks/assignments/:assignmentId/accept-offer`). On the Provider side, `TaskPerformerProfilePage.jsx` polls `getTaskInvitations` (`Check & pay`) and transitions directly to `ConfirmAndPayPage.jsx` (`/provider/confirm-and-pay`) once accepted.
- **Status Classification:**
  - Performer-side agreement screen: **Implemented** (code-audited).
  - Provider-side dedicated agreement/contract PDF screen: **Missing / Not Implemented** (no backend endpoint exists).
  - Confirm & Pay & Payment Success: **Implemented** (live Razorpay signature verification is **Backend-Dependent**).

---

## 3. Backend Dependency Audit

| Feature | Frontend Service Method(s) | Live Endpoint Referenced | Test Mode Support | Live Verification | Missing / Notes |
|---|---|---|---|---|---|
| Task Catalog & Templates | `listTaskCatalogDomains`, `listTaskCatalogServices`, `useHomeContent()` | `GET /task-catalog/*`, CMS/home content | Yes | No | Custom Provider-saved templates CRUD does not exist |
| Performer Discovery & Profile | `getTaskerRankings`, `getTaskerProfile`, `getTaskerReviewsList` | `GET /taskers/rankings`, `GET /taskers/:id`, `GET /providers/:id/reviews` | Yes | No | — |
| Saved Performers | `getSavedPerformers`, `savePerformer`, `unsavePerformer` | `GET /providers/saved-taskers` | Yes | No | No per-task shortlist endpoint |
| Invitations | `sendTaskInvitation`, `getTaskInvitations` | `POST /tasks/:id/invitations/:taskerId`, `GET /tasks/:id/invitations` | Yes | No | No cross-task `GET /providers/me/invitations` list endpoint |
| Payment & Escrow | `previewTaskPayment`, `createRazorpayOrder`, `verifyRazorpayPayment`, `acceptInterest`, `directHireTasker` | `POST /payments/tasks/:id/preview`, `POST /payments/create-order`, `POST /payments/verify-payment` | Yes (`paymentRequired: false` mock) | No | Live Razorpay gateway & webhook settlement require `apps/server` |
| Task Execution & Disputes | `getChecklist`, `approveChecklist`, `approveAssignment`, `completeTask`, `createTaskDispute`, `createTaskReview` | `/tasks/:id/checklist`, `/tasks/:assignmentId/approve`, `/tasks/disputes`, `/tasks/:id/reviews` | Yes | No | File presigned uploads (`getPresignedUrl`) require live S3/server |
| Boost Task | None | None | UI-Only | No | No backend boost/promotion API exists |
