# OnIT India — Frontend Fixes Log

A running log of every fix shipped in this session, with the **reasoning** behind each change so the next person can pick it up cold. Items are grouped by area; each entry links to the file path and quotes the bug → fix → why.

Last updated: 2026-05-16

---

## 0. Repo hygiene — `.env` files were leaking to GitHub

### What was wrong
`git ls-files | grep env` showed **five committed env files**:

```
admin-onit/.env.local
admin-onit/.env.production
client/.env
client/src/.env
server/.env
```

`.gitignore` rules already existed in places, but `.gitignore` is **not retroactive** — once a file is committed, adding it to `.gitignore` does nothing. The files kept getting re-pushed. `client/.env` contained an OpenAI API key + Auth0 credentials; `client/src/.env` contained a Mongo connection string + Cloudinary secret.

### Fix

1. Untracked every env file from the index without deleting it locally:

   ```bash
   git rm --cached client/.env client/src/.env server/.env \
                   admin-onit/.env.local admin-onit/.env.production
   ```

2. Rewrote `.gitignore` at three levels with a defensive pattern:

   ```gitignore
   .env
   .env.*
   **/.env
   **/.env.*
   !.env.example
   !.env.*.example
   ```

   The `**/.env` form catches stray nested env files (the `client/src/.env` that was the worst leak). The `!.env.example` allow-list ensures templates can still be committed.

3. Created `admin-onit/.gitignore` (didn't exist) so anything dropped in that folder is covered.

4. Added `client/.env.example` documenting the required keys with safe placeholder values so new contributors know what to set.

### Why this matters

`.env` files inlined into a Vite bundle (`VITE_*` prefix) are public anyway — they ship to the browser. But the leak also exposed an OpenAI key and Mongo URI that should never be on the client at all. Anything that was on `main` is permanently in the history of the production repo.

### Action required (manual, not automatable)

- **Rotate every secret that ever lived in these files.** Untracking removes them from new commits but they remain in the git history of `origin/main`.
- Suggested rotations: OpenAI API key, Auth0 SPA client (rotate or restrict callbacks), Mongo connection string, Cloudinary secret, any other server secret in `server/.env`.
- Optionally rewrite history with `git filter-repo` or BFG and force-push — only do this if you can coordinate with everyone holding clones.

---

## 1. Provider — CORS 500 on file upload

- File: `client/vite.config.js`
- Symptom: `POST /aws-api/uploads/presigned-url` returning 500 with `Origin not allowed by CORS policy` from the Lambda when uploading a task photo.
- Root cause: Vite's dev proxy with `changeOrigin: true` rewrites the `Host` header but **does not strip the browser `Origin` header**. The Lambda's prod CORS guard rejects `Origin: http://localhost:5173`. In production, Vercel rewrites are server-side so no `Origin` is forwarded — that's why it only broke in dev.
- Fix: Added a `configure` hook on every Lambda-targeting proxy entry that removes the `origin` header before forwarding:

  ```js
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => {
      proxyReq.removeHeader('origin');
    });
  },
  ```

  Applied to `/aws-api`, `/kyc-documents`, and `/candidate-resumes`.

---

## 2. Provider — phone number gate, draft visibility, active-task routing

### 2a. Phone number kept being asked even after saving
- Files: `client/src/components/provider/pages/PostTaskManualPage.jsx`
- Why it happened: the gate was navigating to a settings screen to capture the phone, losing the in-progress task. Then after returning, `user.phoneNumber` wasn't being re-read from the latest profile snapshot, so the gate fired again.
- Fix: Inline phone modal **on the preview page itself** — no navigation. `handleSavePhoneAndPost()` calls `updateProviderProfile({ phoneNumber })`, then immediately calls the extracted `doPublishTask()`. Reads both `user?.phoneNumber` and `user?.provider?.phoneNumber` to tolerate the nested provider shape.

### 2b. Drafts not showing on My Tasks
- File: `client/src/components/provider/pages/MyTasksPage.jsx`
- Fix: Split DRAFT rendering from PENDING_REVIEW. New `DraftTaskCard` with amber styling, "Publish Task" + "View" actions. Imported `publishTask` and wired it.

### 2c. Active Task click went to the wrong screen
- File: `client/src/components/provider/pages/MyTasksPage.jsx`
- Fix: `PUBLISHED` → `/provider/post-task-results?taskId=...` (so the provider lands on the applicant chooser). `IN_PROGRESS`/`CLAIMED` → `/provider/active-task/:id`. Stops the "Choose a Performer" empty-state confusion.

### 2d. Full UUID in task ID badge
- File: `client/src/components/provider/pages/ProviderActiveTaskExecutionPage.jsx`
- Fix: `#{(taskData?.id || id)?.substring(0, 8).toUpperCase()}` in both the breadcrumb and the header chip.

---

## 3. 30-day session — refresh tokens for both OTP and Google users

The Auth0 access token had a 15-minute lifetime and was never refreshed, so every quarter-hour users got dumped to `/auth`.

- File: `client/src/components/provider/services/api.js`
  - Module-level token refresh registry: `_tokenRefresher`, `_refreshPromise`, `setApiTokenRefresher(fn)`.
  - `isTokenExpired(token)` decodes the JWT and checks `exp` with a 30s buffer so we refresh *before* the request hits the server.
  - Request interceptor is now `async`. If the token is near expiry it calls `getRefreshedToken()` (which deduplicates concurrent callers via a shared promise) before attaching the header.
  - Response interceptor retries once on 401 with `_retried` flag to prevent loops. If the retry fails it wipes localStorage and redirects to `/auth`.

- File: `client/src/contexts/AuthContext.jsx`
  - Imports `useAuth0` (only safe because `AuthProvider` is rendered inside `Auth0Provider` in `App.jsx`).
  - `refreshToken` callback: primary path is `getAccessTokenSilently` with `authorizationParams: { audience, scope }`; if that fails (typical for OTP users who bypass the SDK), falls back to a raw `POST https://${VITE_AUTH0_DOMAIN}/oauth/token` with `grant_type=refresh_token` using `onit_refresh_token` from localStorage.
  - `useEffect` wires `setApiTokenRefresher(refreshToken)` on mount and clears on unmount.
  - `logout()` now also removes `onit_refresh_token`.

- File: `client/src/components/provider/pages/OtpPage.jsx`
  - OTP grant request now adds `offline_access` to the scope: `` `${import.meta.env.VITE_AUTH0_SCOPE} offline_access` ``.
  - After successful verification, stores `data.refresh_token` to `localStorage` as `onit_refresh_token` (only if Auth0 returned one).

- File: `client/src/components/provider/pages/AuthPage.jsx`
  - Google flow: `getAccessTokenSilently()` was called bare, so the resulting token had no audience and was rejected by the NestJS guard. Now passes `authorizationParams: { audience: VITE_AUTH0_AUDIENCE, scope: VITE_AUTH0_SCOPE }`.

### Why this design

- The api.js layer can't `useAuth0` (it isn't a React component), so we register the refresher from `AuthContext` instead — that keeps the React-hook dependency in the React tree.
- Dedup via `_refreshPromise` prevents the thundering-herd problem when many parallel API calls notice the token is stale at the same time.
- The 30s proactive buffer avoids the cliff where a request sent at T-100ms hits the server at T+100ms and gets a 401.

---

## 4. Interest cards — direct chat with performer

- File: `client/src/components/provider/pages/PostTaskSearchResultsPage.jsx`
- Symptom: Providers had no way to message an applicant without going through Hire → Pay → Active Task → Chat.
- Root cause #1: The applicant/match mapping never captured a `userId` field, so even if we'd added a button there'd be nothing to pass to `createConversation({ otherUserId })`.
- Root cause #2: No "Message" button on `PerformerCard`.
- Fix:
  - Both mappings now extract `userId: t.user?.id || t.user?._id`.
  - `PerformerCard` now has a `MessageCircle` icon button next to Hire/Manage. Only renders if `performer.userId` is truthy (guards against incomplete data). Navigates to `/provider/chats?userId=...&taskId=...` — `ChatsPage` already knew how to consume those query params.

---

## 5. Performer — submit task button was disabled silently

- File: `client/src/components/Performer/pages/PerformerActiveTaskExecutionPage.jsx`
- Symptom: "Complete Task" button visible but disabled; clicking did nothing.
- Root cause: Backend returns `taskAssignments` sometimes as a singular object and sometimes as an array (Prisma include shape). The old mapping was `const assignment = task.taskAssignments || task.taskAssignment;` — if the value was an array `assignment.id` is `undefined`, so the button's `disabled={!assignmentId}` guard kept it disabled and the user couldn't see why.
- Fix: Use the same robust resolver the provider page uses:

  ```js
  const rawAssignment = task.taskAssignments ?? task.taskAssignment;
  const assignment = Array.isArray(rawAssignment)
    ? (rawAssignment.find(a => ['ACCEPTED','IN_PROGRESS','SUBMITTED']
        .includes(String(a.status).toUpperCase())) || rawAssignment[0])
    : rawAssignment;
  ```

  Also corrected `performerUserId` to read `assignment?.tasker?.userId` (the actual user id) instead of `assignment?.taskerId` (the tasker profile id) so chat navigation lands on the right user.

---

## 6. Chat profile not showing after task acceptance

- File: `client/src/components/provider/pages/ChatsPage.jsx`
- This was the highest-impact bug. The whole chat list was always empty.
- Root cause #1: backend `/conversations` returns a **raw array** of normalized conversation objects. The frontend was reading `response.conversations`, which doesn't exist on the response — so the list was always `[]`.
- Root cause #2: backend returns `id`, `otherUser.displayName`, `otherUser.profilePicUrl`, etc. The frontend was reading `_id`, `name`, `avatar`, `role` — none of which exist on the API shape.
- Root cause #3: even if the data flowed, the active-chat header rendered `<img>` only when `activeChatData?.avatar` was truthy and `:null` otherwise — leaving an empty bordered box.
- Fix:
  - Added a `normalizeConversation(c)` helper that maps backend fields to the UI shape (`_id`, `id`, `name`, `role: c.taskId ? 'Task chat' : 'Direct message'`, `avatar`, `lastMessage`, `unreadCount`, `updatedAt`, `otherUser`).
  - Response parsing tolerates both raw-array and `{conversations:[]}` shapes.
  - Existing-conversation check now uses `c.otherUser?.id === targetUserId` (matches the real API shape).
  - After `createConversation`, the page re-fetches the list so the newly created entry comes back with full `otherUser` metadata before being activated.
  - Active-chat header now renders an initial-letter fallback when there's no avatar URL; `onError` hides broken images.

---

## 7. Performer earnings — double-unwrap bug

- File: `client/src/components/Performer/pages/PerformerEarningsPage.jsx`
- Symptom: Balance always showed ₹0 even when there were transactions.
- Root cause: the axios response interceptor in `Performer/services/api.js` already returns `response.data`. The page then did `walletRes.data.balance`, expecting another layer of wrapping that doesn't exist. `walletRes.data` was `undefined`, so the `if (walletRes && walletRes.data)` guard silently skipped the state update.
- Fix:
  - Wallet: read `walletRes.balance` directly. Backend only returns `{ balance, currency }`, so `pending` and `totalEarned` are derived from the transactions array as a sensible fallback.
  - Transactions: backend returns `{ data: [...], pagination }`, so `transRes.data` is correct there — kept as-is.

---

## 8. Provider — "Mark as Complete" produced a backend error

- File: `client/src/components/provider/pages/ProviderActiveTaskExecutionPage.jsx`
- Symptom: clicking Approve Task → backend 400 "Can only complete a submitted assignment."
- Root cause: backend requires `assignment.status === 'SUBMITTED'` before it accepts a complete call. The frontend let the provider click Approve regardless of state, then showed the backend error.
- Fix: capture `assignmentStatus` in `taskData`. Button label and `disabled` state now reflect the workflow:
  - `SUBMITTED` → "Approve & Mark Complete" (enabled)
  - `ACCEPTED` / `IN_PROGRESS` / `ASSIGNED` / `CLAIMED` → "Waiting for Performer Submission" (disabled, with tooltip)
  - `COMPLETED` → "Task Completed" (disabled)
  - No assignment → "No assignment yet"
  Request Revision button is only rendered when an approval is actually possible.

---

## 9. Notifications — fetch, list, bell dropdown

### Before
- `NotificationContext.jsx` only handled socket toasts; no persistent list, no bell UI, no API integration. Bell icon in the header was a static red dot.

### Added
- `client/src/components/provider/services/api.js` and `client/src/components/Performer/services/api.js`:
  - `getNotifications(params)` → `GET /notifications`
  - `markNotificationRead(id)` → `PUT /notifications/:id/read`
  - `markAllNotificationsRead()` → `PUT /notifications/read-all`
  - `deleteNotification(id)` → `DELETE /notifications/:id`

- `client/src/contexts/NotificationContext.jsx`: rewritten.
  - Fetches the list via `apiGetNotifications` on mount and on window `focus`.
  - Tracks `items`, `unreadCount`, `loading` plus the existing transient `toasts` queue.
  - Socket subscriber prepends incoming `notification.new` to `items` and bumps unread count.
  - Exposes `markAsRead(id)`, `markAllAsRead()`, `refresh()` to consumers.

- `client/src/components/shared/NotificationBell.jsx` (new): wrapper around `useNotifications()`. Bell icon with unread badge (9+ cap), dropdown with list/loading/empty states, click-outside dismiss, "Mark all read" action, time-ago formatting. Wired into both `ProviderHeader` and `PerformerHeader`.

### Why a single shared component
Both roles need the same UX. Putting it in `components/shared/` and reading state from `NotificationContext` means the bell stays in sync with toasts and any future real-time hooks without duplicating logic.

---

## 10. Provider — Settings screens removed

- Files: `client/src/components/provider/components/ProviderHeader.jsx`, `client/src/components/provider/ProviderApp.jsx`, `client/src/components/provider/pages/DashboardPage.jsx`
- Removed both "Account Dashboard" and "Settings" entries from the account dropdown. Replaced with a compact user info block + Logout.
- Dropped `SettingsPage` import and `/provider/settings` route.
- Repointed `SharedChangePasswordPage` and `SharedTwoFactorAuthPage` `backRoute` from `/provider/settings` to `/provider/dashboard`.
- DashboardPage's "See profile" CTA was the last lingering reference — changed to "View my tasks" → `/provider/my-tasks`.

`SettingsPage.jsx` is left on disk but unreferenced; can be deleted in a follow-up cleanup if desired.

---

## 11. Admin — sidebar branding "ONIT" → "OnIT INDIA"

- File: `client/src/components/Admin/components/layout/Sidebar.jsx`
- Two-word wordmark with the INDIA half tinted emerald to match the marketing site.

---

## 12. Admin — support tickets reply / status updates

- File: `client/src/components/Admin/pages/support/Tickets.jsx` (rewritten)
- Symptoms: replies didn't surface, status changes felt stale, ticket list ignored backend response shape.
- Fixes:
  - List response tolerates both `{data: [...]}` and raw arrays.
  - On row click, fetches the full ticket via `getTicketByIdAdmin(id)` so the drawer shows the complete message thread instead of stale list data.
  - After every reply or status change, the *same* detail call is re-issued, so the UI reflects the server snapshot — no more "I clicked Resolve but it still says Open".
  - Status actions are context-aware: Mark in-progress / Resolve / Close depending on current state.
  - Reply on Enter (Shift+Enter for newline).
  - Conversation renders all `messages[]` with admin vs user styling, sender email, and timestamps.

---

## 13. Admin — live chat rewritten on real backend

- File: `client/src/components/Admin/pages/support/LiveChat.jsx` (rewritten)
- Old version called `/admin/chats`, `/admin/messages` — endpoints that don't exist on the backend.
- Real backend: `admin-support.gateway.ts` exposes a Socket.io flow with `support.join`, `support.message`, `support.new`, `support.notification` events scoped to ticket rooms.
- New page:
  - Loads OPEN + IN_PROGRESS tickets via `listTicketsAdmin` and merges sorted by `updatedAt`.
  - Connects to the support socket; reflects connection status in the input footer ("Live channel" / "Buffered (REST fallback)").
  - On ticket select, emits `support.join` and renders the response from `support.joined`. Listens for `support.new` to append messages.
  - `support.notification` triggers a list refresh so new tickets land in the sidebar instantly.
  - Send path: prefers `socket.emit('support.message', ...)`; falls back to `addTicketMessageAdmin` REST when the socket is down — so admin replies are never lost.

---

## 14. Admin — task monitoring sections + dispute resolver

- File: `client/src/components/Admin/pages/Tasks.jsx`
- Symptoms: Quick-stats only counted the visible page slice, "Assigned" missed several real states, no way to resolve disputed assignments.
- Fixes:
  - Fetches `getTaskStatisticsAdmin()` alongside the list and prefers platform-wide values, falling back to the page slice.
  - Stats grid expanded to **Platform Tasks · Assigned · Submitted · Completed · Canceled** (Submitted was missing before).
  - Filter tabs now cover the full workflow: `all · DRAFT · PUBLISHED · CLAIMED · IN_PROGRESS · SUBMITTED · COMPLETED · CANCELED`.
  - New "Issue Resolver" block in the detail drawer (only renders when there's an active assignment). Wires `resolveAssignmentAdmin(assignmentId, { status, notes })` with a required ≥10-char notes prompt for audit logging. Two paths: "Resolve in favor of tasker" (`COMPLETED`) and "Resolve in favor of provider" (`CANCELED`).
  - Status-change prompt now requires a non-empty reason — empty / cancelled prompts abort the action.

---

## 15. Admin — careers applicants & S3 resume links

- File: `client/src/components/Admin/pages/JobResponses.jsx`
- Symptoms: applicants list sometimes empty even when there were applications; resume links 404'd; "NEW" filter hid valid rows.
- Fixes:
  - Response parsing handles both `{data: [...], pagination}` and raw arrays.
  - "NEW" filter now matches rows whose `status` is `null`/missing/`"NEW"` (the default state on the backend).
  - Resume URL resolver: prefers the backend-resolved `portfolioUrl` (server applies S3 + legacy logic). Only constructs an S3 URL ourselves when the value is a bare filename; if it already contains a path segment we treat it as an S3 key. URI-encoded so filenames with spaces/special chars work and to avoid stray injection in `href`.
  - Better error copy when the request fails (likely an auth issue, not a missing-record one).

---

## 16. Admin — FAQs / Help Center removed

- Files: `client/src/components/Admin/components/layout/Sidebar.jsx`, `client/src/components/Admin/AdminApp.jsx`
- Removed "Help Center" from the Support submenu and its route. `HelpCenterPage` import dropped from `AdminApp.jsx`.
- The page file is left in place for now; can be deleted along with `SettingsPage.jsx` in a cleanup PR.

---

## 17. Notes on backend (no changes shipped)

Mid-session I attempted three backend additions to make broadcasts reach web users in real time:

- `pushRealtimeToUser` / `emitToConversation` helpers on `NotificationsService`
- A per-user socket emit loop inside `sendBulkNotification`
- A per-user socket emit loop inside the admin broadcast service
- A mirroring `message.new` emit at the end of `MessagesService.createMessage` so REST-sent chat messages also reached connected rooms

All four changes were **reverted** at the user's request because the backend is in production and this work session was scoped to the frontend. `git status` on `g:/OnIT-backend` is clean again. Re-applying these is a small backend PR if the live-broadcast experience needs to be addressed; until then:

- Mobile (FCM): broadcasts work as today.
- Web (`specific_users` audience): notifications surface on next focus / list refresh.
- Web (`all` / `providers` / `taskers` audience): same — refresh-based delivery, not realtime.

---

## File map of frontend changes

```
client/src/components/Admin/AdminApp.jsx
client/src/components/Admin/components/layout/Sidebar.jsx
client/src/components/Admin/pages/JobResponses.jsx
client/src/components/Admin/pages/Tasks.jsx
client/src/components/Admin/pages/support/LiveChat.jsx
client/src/components/Admin/pages/support/Tickets.jsx
client/src/components/Performer/components/PerformerHeader.jsx
client/src/components/Performer/pages/PerformerActiveTaskExecutionPage.jsx
client/src/components/Performer/pages/PerformerEarningsPage.jsx
client/src/components/Performer/services/api.js
client/src/components/provider/ProviderApp.jsx
client/src/components/provider/components/ProviderHeader.jsx
client/src/components/provider/pages/AuthPage.jsx
client/src/components/provider/pages/ChatsPage.jsx
client/src/components/provider/pages/DashboardPage.jsx
client/src/components/provider/pages/MyTasksPage.jsx
client/src/components/provider/pages/OtpPage.jsx
client/src/components/provider/pages/PostTaskManualPage.jsx
client/src/components/provider/pages/PostTaskSearchResultsPage.jsx
client/src/components/provider/pages/ProviderActiveTaskExecutionPage.jsx
client/src/components/provider/services/api.js
client/src/components/shared/NotificationBell.jsx   (NEW)
client/src/contexts/AuthContext.jsx
client/src/contexts/NotificationContext.jsx
client/vite.config.js
```

Repo-level files added or rewritten:

```
.gitignore                  (rewritten — broader env exclusion)
client/.gitignore           (rewritten — broader env exclusion)
admin-onit/.gitignore       (NEW)
client/.env.example         (NEW)
client/FIXES.md             (this file)
```

Plus `git rm --cached` on the five leaked env files.
