# FirstDoer — Phase 4: Provider API Dependency Audit

> **Source of Truth:** `apps/client/src/components/provider/services/api.js` (NestJS Lambda proxy `/api-onitindia` + Express AI micro-server `/api`).  
> **Note:** No backend code was modified. Integration status reflects verified frontend code + Test Mode (`mockApiHandler.js`) behavior.

---

## 1. Lifecycle API Matrix

| Stage | Function (`provider/services/api.js`) | Method & Endpoint | Caller Page(s) | Status Classification |
|---|---|---|---|---|
| **1. Discover Performers** | `listTaskers`, `searchTaskers`, `getTaskerRankings`, `getTaskerProfile`, `savePerformer`, `unsavePerformer`, `getSavedPerformers` | `GET /taskers`, `GET /taskers/search`, `GET /taskers/rankings`, `GET /taskers/:id`, `POST/DELETE/GET /providers/saved-taskers` | `DashboardPage`, `ExploreTalentPage`, `TaskPerformersPage`, `SearchPage`, `TaskPerformerProfilePage`, `SavedPerformersPage` | **1. Frontend + API exist** (mostly mocked in `mockApiHandler.js`) |
| **2. Post a Task** | `listTaskCatalogDomains`, `listTaskCatalogServices`, `createTask`, `updateTask`, `publishTask`, `getPresignedUrl`, `confirmUpload`, `attachTaskFiles`, `generateAITask`, `sendAiTaskMessage` | `GET /task-catalog/domains`, `GET /task-catalog/services`, `POST /tasks`, `PUT /tasks/:id`, `POST /tasks/:id/publish`, `POST /uploads/*`, `POST /api/ai-task`, `POST /ai/chat` | `PostTaskManualPage`, `PostTaskAIPage`, `MyTasksPage` | **1. Frontend + API exist** (`/task-catalog/services` missing from Test Mode mock!) |
| **3. Applications** | `getTaskInterests`, `acceptInterest`, `rejectInterest` | `GET /tasks/:taskId/interests`, `PUT /tasks/interests/:id/accept`, `PUT /tasks/interests/:id/reject` | `TaskApplicantsPage`, `TaskPerformerProfilePage`, `ConfirmAndPayPage` | **1. Frontend + API exist** (Comparison/Shortlist: **5. Not implemented**) |
| **4. Invitations** | `sendTaskInvitation`, `getTaskInvitations` | `POST /tasks/:taskId/invitations/:taskerId`, `GET /tasks/:taskId/invitations` | `TaskPerformerProfilePage` (Hire Modal) | **3. API exists, dedicated Provider page missing** (embedded in profile) |
| **5. Task Agreement** | *(Performer only: `acceptOffer` / `declineOffer` in `Performer/services/api.js`)* | `PUT /tasks/assignments/:assignmentId/accept-offer` | `PerformerTaskAgreementPage` (Performer); **None on Provider** | **5. Missing Provider Agreement UI**; **4. Broken nav** (`accepted_invitation` blocked by `ConfirmAndPayPage:236`) |
| **6. Hire & Payment** | `previewTaskPayment`, `createRazorpayOrder`, `verifyRazorpayPayment`, `directHireTasker`, `listMyVouchers` | `POST /payments/tasks/:id/preview`, `POST /payments/create-order`, `POST /payments/verify-payment`, `POST /tasks/:id/direct-hire`, `GET /coupons/my-vouchers` | `ConfirmAndPayPage` | **1. Frontend + API exist** (Razorpay + backend dependent) |
| **7. Execution** | `getTaskDetails`, `getChecklist`, `getTaskUpdates`, `listConversations`, `getMessages`, `sendMessage`, `createSupportTicket`, `createTaskDispute` | `GET /tasks/provider/:id`, `GET /tasks/:id/checklist`, `GET /tasks/updates/:assignmentId`, `GET/POST /conversations/*`, `POST /support/tickets`, `POST /tasks/disputes` | `ProviderActiveTaskExecutionPage`, `ProviderTaskSupportPage`, `ChatsPage` | **1. Frontend + API exist** |
| **8. Review & Revision** | `approveChecklistItem`, `requestChecklistItemChange`, `approveChecklist`, `approveAssignment`, `completeTask`, `rejectAssignment` | `POST /tasks/checklist/items/:id/review`, `PUT /tasks/checklist/:id/approve`, `POST /tasks/:assignmentId/{approve,complete,reject}` | `ProviderActiveTaskExecutionPage` | **1. Frontend + API exist** |
| **9. Closure & Finance** | `createTaskReview`, `getWalletBalance`, `getTransactions`, `getPaymentHistory`, `getPayoutMethods`, `addPayoutMethod`, `withdrawFunds` | `POST /tasks/:id/reviews`, `GET /wallet`, `GET /wallet/transactions`, `GET /payments/history`, `GET/POST/DELETE /payout-methods`, `POST /payout-methods/withdrawals` | `ProviderActiveTaskExecutionPage`, `SettingsPage` (`WalletView`, `TransactionsView`, `BanksDetailsView`, `WithdrawView`) | **1. Frontend + API exist** |
| **10. Broken / UI-Only** | — | — | `BoostTaskPage`, `SharedChangePasswordPage`, `SharedTwoFactorAuthPage`, `TasksSettingsView` | **2. Frontend exists, backend integration missing** |

---

## 2. Key Integration & Test Mode Gaps

1. **Test Mode `/task-catalog/services` Gap:** `apps/client/src/test-mode/mockApiHandler.js` mocks `/task-catalog/domains` (line 287) but not `/task-catalog/services`, disabling Category & Approved Service selection on `PostTaskManualPage.jsx` in Test Mode.
2. **`ConfirmAndPayPage.jsx:236` Accepted-Invitation Guard Bug:** `if (!performer?.interestId)` rejects `hireType === 'accepted_invitation'` from `TaskPerformerProfilePage.jsx:306-318` even though `finalizeHire()` at line 155 explicitly handles `performer.hireType === 'accepted_invitation'`.
3. **Unimplemented UI-Only Screens:** `BoostTaskPage.jsx` (static mock), `SharedChangePasswordPage.jsx` (`console.log`), `SharedTwoFactorAuthPage.jsx` (`console.log`), `TasksSettingsView.jsx` (local state only).
