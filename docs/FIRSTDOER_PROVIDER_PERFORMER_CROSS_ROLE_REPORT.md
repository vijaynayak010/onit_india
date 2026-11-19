# FIRSTDOER — PROVIDER–PERFORMER CROSS-ROLE CONSISTENCY REPORT

> **Test Task Used:** `"Performer Equal QA Task"` (`taskId=task-1795011837053`, `₹6,000`, `2026-12-30`, `Tech, Data & Admin` / `Web Development`, `React`) + seeded `task-101`, `task-102`, `task-103`, `task-104`.

## 1. Cross-Role E2E Trace (`"Performer Equal QA Task"`)

| Step | Role | Route | Expected | Actual | Status |
|---|---|---|---|---|---|
| 1 | `PROVIDER` | `/provider/post-task-manual` | Create & publish task | Published `task-1795011837053` *(spurious checkpoint toast appeared despite 1 checkpoint)* | **PASS** |
| 2 | `TASKER` | `/performer/find-tasks` -> `/performer/task/:id` | Discover task & `Send Interest` | Task discovered (`₹6,000`, `30 Dec 2026`); `Send Interest` modal appeared, **but did not persist on reload or in `Pending`** | **FAIL** |
| 3 | `PROVIDER` | `/provider/task-applicants?taskId=...` | See Rahul Sharma's application | Showed `Performers interested 0` even after `Refresh List` | **BLOCKED** |
| 4 | `PROVIDER` -> `TASKER` | `/provider/task-activity` -> `/performer/invitation/:id` | Provider sends invitation; Performer accepts | Provider sent invitation; Performer `/performer/invitations` showed `No invitations yet`; direct `/performer/invitation/:id` `Accept Invitation` failed with `"Could not find your invitation. Please try again."` | **FAIL / BLOCKED** |
| 5–7 | Both | Checkout -> Execution -> Revision -> Completion -> Earnings | Complete lifecycle & `+₹6,000` earnings | Unreachable due to Steps 2–4 Test Mode persistence blockers | **BLOCKED** |

## 2. Seeded Fixtures Cross-Role Consistency

- `task-101` (`₹3,500`), `task-102` (`₹4,200`), `task-103` (`₹7,500`), `task-104` (`₹5,000`): Task IDs, titles, budgets, and Provider (`Alex Morgan (Nexus Labs)`) match across Provider and Performer views, **except** `task-102` milestone progress shows `0 of 3` on `/performer/my-tasks` vs `1 of 3 (33%)` on `/performer/active-task/task-102`, and `/performer/account` shows `0 Completed / ₹0.0K Earned` vs `₹8,500` on `/performer/my-tasks`.
