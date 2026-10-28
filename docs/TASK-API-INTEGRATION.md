# Task API Integration Map

All task endpoints call the NestJS backend via `/aws-api` (see `client/src/components/provider/services/api.js` and `client/src/components/Performer/services/api.js`).

**Pagination:** List endpoints accept `page` and `limit` query params (defaults: `page=1`, `limit=20`; feed default `limit=10`).

---

## Integration Summary

| # | Endpoint | API function | Where wired | Basis |
|---|----------|--------------|-------------|-------|
| 1 | `POST /tasks` | `createTask` | `PostTaskManualPage.jsx`, `PostTaskDetailsPage.jsx` | New task creation (draft or published) |
| 2 | `PUT /tasks/:id` | `updateTask` | `PostTaskManualPage.jsx` | Edit flow when `editTask.id` is passed from `TaskStatusPage` |
| 3 | `DELETE /tasks/:id` | `deleteTask` | `MyTasksPage.jsx` → `DraftTaskCard` | Provider deletes a draft permanently |
| 4 | `GET /tasks/:id` | `getTaskDetails` (performer) | `PerformerTaskDetailsPage.jsx`, `PerformerActiveTaskExecutionPage.jsx`, `PerformerClientProfilePage.jsx` | Tasker views shared task details |
| 5 | `GET /tasks/my-posted-tasks` | `listMyTasks` | `MyTasksPage.jsx`, `ProviderDataContext.jsx`, `TaskHistoryPage.jsx`, `DraftTasksPage.jsx`, `AllTasksView.jsx`, `ChatsPage.jsx`, `TaskPerformerProfilePage.jsx` | Provider task lists and dashboard cache |
| 6 | `GET /tasks/provider/:id` | `getTaskDetails` (provider) | `ProviderActiveTaskExecutionPage.jsx`, `TaskApplicantsPage.jsx`, `PostTaskSearchResultsPage.jsx`, `TaskPerformerProfilePage.jsx` | Provider-scoped task detail view |
| 7 | `GET /tasks/assigned-to-me` | `getAssignedTasks` | `PerformerDashboardPage.jsx`, `PerformerRatingsPage.jsx`, `PerformerClientProfilePage.jsx`, `PerformerAllTasksPage.jsx` | Legacy aggregate assigned list (dashboard / ratings) |
| 8 | `GET /tasks/search` | `searchTasks` | `PerformerSearchResultsPage.jsx` | Tasker search with filters (`page`, `limit`, keyword, etc.) |
| 9 | `GET /tasks/feed` | `getTasksFeed` | `PerformerDashboardPage.jsx`, `PerformerClientProfilePage.jsx` | Browse published tasks (`page`, `limit`) |
| 10 | `GET /tasks/my-interests` | `getMyInterests` | `PerformerMyTasksPage.jsx` (Pending tab), `PerformerAllTasksPage.jsx`, `PerformerClientProfilePage.jsx` | Tasks the tasker expressed interest in |
| 11 | `GET /tasks/my-work` | `getMyWork` | API only | Tabbed work view wrapper (`status`, `page`, `limit`) — available for future use |
| 12 | `GET /tasks/my-applied-tasks` | `getMyAppliedTasks` | API only | Applied tasks list — available for future use |
| 13 | `GET /tasks/my-active-tasks` | `getMyActiveTasks` | `PerformerMyTasksPage.jsx` (Active tab) | In-progress / assigned work |
| 14 | `GET /tasks/my-completed-tasks` | `getMyCompletedTasks` | `PerformerMyTasksPage.jsx` (Completed tab) | Approved / finished work |
| 15 | `POST /tasks/:id/assign` | `acceptTask` | API only | Direct assignment accept (KYC-guarded) — no UI flow yet |
| 16 | `POST /tasks/:assignmentId/submit` | `submitTask` | `PerformerActiveTaskExecutionPage.jsx` | Tasker submits completed work for review |
| 17 | `POST /tasks/:assignmentId/complete` | `completeTask` | `ProviderActiveTaskExecutionPage.jsx` | Provider marks non-submitted assignment complete |
| 18 | `POST /tasks/:assignmentId/approve` | `approveAssignment` | `ProviderActiveTaskExecutionPage.jsx` | Provider approves **submitted** work (`SUBMITTED` status) |
| 19 | `POST /tasks/:id/publish` | `publishTask` | `MyTasksPage.jsx` → `DraftTaskCard` | Publish draft from My Tasks |
| 20 | `POST /tasks/:id/cancel` | `cancelTask` | `MyTasksPage.jsx` → `InterestTaskCard` | Cancel published task (Applicants tab) |
| 21 | `POST /tasks/:assignmentId/reject` | `rejectAssignment` | `ProviderActiveTaskExecutionPage.jsx` → Request Revision | Send submitted work back for revision |
| 22 | `POST /tasks/:id/files` | `attachTaskFiles` | `PostTaskManualPage.jsx` | Link confirmed upload IDs after create/update |
| 23 | `POST /tasks/updates/:assignmentId` | `addTaskUpdate` | `PerformerActiveTaskExecutionPage.jsx` | Tasker posts progress updates |
| 24 | `GET /tasks/updates/:assignmentId` | `getTaskUpdates` | `ProviderActiveTaskExecutionPage.jsx`, `PerformerActiveTaskExecutionPage.jsx` | Load assignment progress timeline |
| 25 | `POST /tasks/:taskId/checklist` | `createChecklist` | `ProviderActiveTaskExecutionPage.jsx` | Provider saves checklist items (`{ items: [{ title, order? }] }` only) |
| 26 | `GET /tasks/:taskId/checklist` | `getChecklist` | Provider & performer active task pages, `PerformerMyTasksPage.jsx` | Load checklist for progress display |
| 27 | `PUT /tasks/checklist/items/:itemId/tick` | `tickChecklistItem` | Provider & performer active task pages | Toggle checklist item completion |
| 28 | `POST /tasks/:taskId/interest` | `expressInterest` | `PerformerDashboardPage.jsx`, `PerformerTaskDetailsPage.jsx` | Tasker applies / expresses interest |
| 29 | `GET /tasks/:taskId/interests` | `getTaskInterests` | `TaskApplicantsPage.jsx`, `PostTaskSearchResultsPage.jsx`, `TaskPerformerProfilePage.jsx` | Provider views applicants |
| 30 | `PUT /tasks/interests/:interestId/accept` | `acceptInterest` | `ConfirmAndPayPage.jsx` | Provider accepts applicant after payment flow |
| 31 | `PUT /tasks/interests/:interestId/reject` | `rejectInterest` | `TaskApplicantsPage.jsx` → Direct Applicants tab | Reject pending applicant interest |
| 32 | `POST /tasks/:taskId/reviews` | `createTaskReview` | `ProviderActiveTaskExecutionPage.jsx`, `PerformerActiveTaskExecutionPage.jsx` | Post-completion rating (1–5 + optional comment) |
| 33 | `GET /tasks/:taskId/reviews` | `getTaskReviews` | API only (both clients) | Paginated task reviews — use in ratings/history views when needed |

---

## Files Changed in This Integration

### API clients
- `client/src/components/provider/services/api.js` — added `updateTask`, `deleteTask`, `getTaskById`, `attachTaskFiles`, `rejectInterest`, `approveAssignment`, `rejectAssignment`, `addTaskUpdate`; pagination on `getTaskReviews`
- `client/src/components/Performer/services/api.js` — added `getMyWork`, `getMyAppliedTasks`, `getMyActiveTasks`, `getMyCompletedTasks`; pagination on `getTaskReviews`

### UI wiring
- `PostTaskManualPage.jsx` — edit uses `PUT /tasks/:id`; files linked via `POST /tasks/:id/files`
- `MyTasksPage.jsx` — cancel published tasks, delete drafts, `page`+`limit` on list
- `ProviderActiveTaskExecutionPage.jsx` — checklist payload fix; approve vs complete; request revision
- `TaskApplicantsPage.jsx` — reject applicant interest
- `PerformerMyTasksPage.jsx` — tab-specific endpoints (`my-active-tasks`, `my-interests`, `my-completed-tasks`)

---

## Provider approval flow

```
Tasker submits work → assignment status SUBMITTED
  → Provider clicks "Approve & Mark Complete" → POST /tasks/:assignmentId/approve
  → Provider clicks "Request Revision" → POST /tasks/:assignmentId/reject { reason? }

Non-submitted active assignment
  → Provider clicks "Approve & Mark Complete" → POST /tasks/:assignmentId/complete
```

---

## Endpoints available but not yet used in UI

| Endpoint | Function | Suggested use |
|----------|----------|---------------|
| `GET /tasks/my-work` | `getMyWork` | Single call with `status` param for performer task tabs |
| `GET /tasks/my-applied-tasks` | `getMyAppliedTasks` | Dedicated "Applied" list if separated from interests |
| `POST /tasks/:id/assign` | `acceptTask` | Direct hire / assignment accept without interest flow |
| `GET /tasks/:taskId/reviews` | `getTaskReviews` | Task detail ratings section |
| `GET /tasks/feed` (provider) | `getTasksFeed` in provider api | Provider browse feed if product requires it |
