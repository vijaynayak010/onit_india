# FirstDoer — QA & Verification Plan

---

## 1. Responsive Viewport Matrix
Test every Provider & Performer route at all 9 target widths:
- **Desktop:** `1920px`, `1600px`, `1440px`, `1280px`, `1024px`
  - Verify `PerformerHeader` 240px sidebar does **not** overlap `<main>` content (check `margin-left: 240px` at `1024px+`).
  - Verify `document.documentElement.scrollWidth <= window.innerWidth` (zero horizontal overflow).
- **Tablet:** `768px`
  - Verify `ChatsPage.jsx` list + detail panel fit cleanly without squeezing message bubbles.
  - Verify `ProviderHeader` & `PerformerHeader` mobile drawers open/close cleanly and don't clip.
- **Mobile:** `430px`, `390px`, `375px`
  - Verify KPI grids, task cards, modals, and tables scroll/stack without clipping or `TestModeBadge` / floating badge obstruction.

---

## 2. Functional Verification Checklist

### Provider Portal
- [ ] **Dashboard (`/provider/dashboard`):** KPI cards, `DashboardActionCarousel`, `BrowseCategoryGrid`, and Performer preview cards render; search bar routes to `/provider/search`.
- [ ] **Post Task (`/provider/post-task-selection`, `post-task-manual`, `post-task-ai`):** Form validation, file upload, AI checkpoint generation, draft save, publish flow.
- [ ] **My Tasks (`/provider/my-tasks`):** Tab switching (`Applicants`, `Active`, `Completed`, `Draft`), publish/cancel/delete actions.
- [ ] **Applicants & Hiring (`/provider/task-applicants`, `confirm-and-pay`):** Interest list, reject interest, Razorpay checkout flow.
- [ ] **Settings (`/provider/settings`):** All 12 tabs (`home`, `profile`, `wallet`, `banks`, `insights`, `transactions`, `subscription`, `ratings`, `reviews`, `refer`, `settings`, `all_tasks`); verify `Sign Out` logs out, legal links open correct pages.

### Performer Portal
- [ ] **Dashboard (`/performer/dashboard`):** Onboarding checklist, KPI/rank cards, recommended tasks, bookmark toggle, category cards.
- [ ] **Find & My Tasks (`/performer/find-tasks`, `my-tasks`, `saved-tasks`):** Search, filters, apply/withdraw, saved tasks sync.
- [ ] **Execution (`/performer/active-task/:id`):** Checklist submission, file upload, progress updates, chat.
- [ ] **Account, KYC & Wallet (`/performer/account`, `profile`, `kyc`, `banks`, `earnings`, `wallet`):** Profile edit, avatar upload, KYC submission, bank details, withdrawal flow.
- [ ] **Notifications & Messages (`/performer/notifications`, `chats`):** Mark read, mark all read, notification deep-link routing, realtime chat.

---

## 3. Regression & Build Checks
- Run `npm run lint` and `npm test` in `apps/client` after each phase.
- Run `npm run build` (including `scripts/prerender.cjs`) to verify zero broken imports or chunk regressions.
- Verify protected files (`AuthContext.jsx`, `App.jsx`, `apps/admin`, `apps/server`, landing components) remain untouched (`git diff`).
