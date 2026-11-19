# FIRSTDOER — PHASE 6B: TEST MODE DEMO DATA REPORT

> **Files Audited & Updated:** `apps/client/src/test-mode/mockData.js`, `apps/client/src/test-mode/mockDatabase.js`.
> **Isolation:** All mock data and API handlers remain strictly gated behind `isTestModeEnabled()` and never execute in production mode.

---

## 1. Consistent Record Relationships Verified

| Entity | IDs | Details & Cross-View Consistency |
|---|---|---|
| **Provider** | `usr_provider_mock_1` (`prov_101`) | Alex Morgan (`alex.morgan@nexuslabs.co`), Nexus Labs Innovations |
| **Tasks** | `task-101` (`PUBLISHED`, `₹3,500`), `task-102` (`IN_PROGRESS`, `₹4,200`), `task-103` (`SUBMITTED`, `₹7,500`), `task-104` (`COMPLETED`, `₹5,000`), `task-105` (`DRAFT`, `₹2,800`) | `task-101` `applicantsCount` aligned to `2` to match `MOCK_APPLICATIONS`; `task-104` `assignedTo` aligned to `usr_performer_mock_2` |
| **Performers** | `usr_performer_mock_2` (Rahul Sharma), `usr_tasker_1` (Aarav Patel), `usr_tasker_4` (Sneha Reddy), `usr_tasker_3` (Vikram Sengupta) | Consistent names, avatars, skills, hourly rates, ratings, and completed counts across Dashboard, Performers, Applicants, and Active Task |
| **Applications** | `app-301` (`task-101`, Rahul Sharma), `app-302` (`task-101`, Sneha Reddy) | Both `PENDING` on `task-101` |
| **Invitations** | `inv-501` (`ACCEPTED`, `task-101`, `usr_tasker_1`), `inv-502` (`PENDING`, `task-101`, `usr_tasker_3`), `inv-503` (`DECLINED`, `task-101`, `usr_tasker_4`), `inv-504` (`EXPIRED`, `task-105`, `usr_tasker_3`) | Added `PENDING`, `DECLINED`, and `EXPIRED` examples alongside `ACCEPTED` (`inv-501`) |
| **Checklists & Revisions** | `chk-101`, `chk-102`, `chk-103` | `chk-101` (1 `SUBMITTED`, 1 `APPROVED`), `chk-102` (1 `APPROVED`, 1 `SUBMITTED`, 1 `CHANGES_REQUESTED` with `revisionNote`), `chk-103` (1 `SUBMITTED`, 1 `APPROVED`) |
| **Execution Updates** | `upd-102-1` (`assign-102`), `upd-103-1` (`assign-103`) | Includes deliverable proof URL (`https://github.com/onitindia/pull/42`) |
| **Reviews & Transactions** | `rev-104-1` (`task-104`, 5 stars), `tx-901` (`-4200` `ESCROW_LOCK`), `tx-902` (`5000` `PAYOUT_RELEASE`), `tx-903` (`15000` `WALLET_DEPOSIT`) | Transactions render valid dates and single minus signs in `TransactionsView.jsx` |

---

## 2. Test Mode Limitations

1. Live Razorpay signature verification, backend escrow locks, and real-time WebSocket chat broadcasts are simulated in-memory/`localStorage` via `mockDatabase.js` and `mockApiHandler.js`.
2. `mockDatabase.js` normalizes unrecognized checklist item statuses to `Pending` when rendering if the server enum differs from `CHANGES_REQUESTED` (observed on `task-102` item 3 rendering as `Status: Pending`, while item 2 renders `Status: In Review` with `Request Changes` / `Approve` controls).
3. Two expected Auth0 missing-env console errors (`VITE_AUTH0_CLIENT_ID_PROVIDER is missing`, `[AUTH0] Missing clientId or domain`) appear at startup when `.env` Auth0 credentials are absent in Test Mode.
