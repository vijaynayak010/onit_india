# Spec-Driven Execution Plan (`PLAN.md`)
## Scoped Refactor: Provider Dashboard & Performer Dashboard (`apps/client`)

---

## 1. Scope & Guardrails

### In-Scope Targets
Exclusively the **Provider Dashboard**, **Performer Dashboard**, and their direct dashboard sub-components inside `apps/client`:
- **Design Tokens:** `apps/client/src/index.css` (CSS variables & `@theme` tokens; no `tailwind.config.*` exists — Tailwind v4 CSS-first config is used).
- **Dashboard Shared Primitives (New):** `apps/client/src/components/shared/dashboard/` (`DashboardCard.jsx`, `StatCard.jsx`, `StatusBadge.jsx`, `SearchPill.jsx`, `EmptyState.jsx`, `DashboardShell.jsx`).
- **Performer Dashboard (`/performer/dashboard`):**
  - `apps/client/src/components/Performer/pages/PerformerDashboardPage.jsx`
  - `apps/client/src/components/Performer/components/PerformerHeader.jsx` (sidebar & mobile drawer styling/width when on dashboard)
  - `apps/client/src/components/Performer/components/PerformerDashboardHomeSections.jsx` (if referenced)
- **Provider Dashboard (`/provider/dashboard`):**
  - `apps/client/src/components/provider/pages/DashboardPage.jsx`
  - `apps/client/src/components/provider/components/ProviderHeader.jsx`
  - `apps/client/src/components/provider/components/dashboard/DashboardActionCarousel.jsx`
  - `apps/client/src/components/provider/components/dashboard/PostFirstTaskBanner.jsx`
  - `apps/client/src/components/provider/components/dashboard/TalentWaitingCard.jsx`
  - `apps/client/src/components/provider/components/dashboard/TaskSpotlightCard.jsx`
  - `apps/client/src/components/provider/components/dashboard/DashboardAnimatedCard.jsx`
  - `apps/client/src/components/provider/components/BrowseCategoryGrid.jsx` (conditional rendering guard in `DashboardPage.jsx` so empty category data does not render a blank container)

### Strict Exclusions (DO NOT MODIFY)
- `apps/admin` — Untouched.
- Public landing page files (`apps/client/src/components/landing/Landingpage.jsx`, `apps/client/src/components/landing/firstdoer.css`, and all `components/landing/*`) — Read-only reference only for border radii, shadows, and Poppins typography.
- API calls, Auth0/Google authentication (`AuthContext.jsx`, `services/api.js`), routing (`App.jsx`), and business logic — Untouched.

### Typography & Brand Color Specification
- **Font:** `Poppins` across all dashboard text, with `font-variant-numeric: tabular-nums` (`tabular-nums`) enforced on all KPI counts, percentages, rankings, and `₹` payouts.
- **Brand Palette:**
  - `Primary 400`: `#7EDEDD`
  - `Primary 500`: `#4CCDDC`
  - `Primary 600`: `#29ADAC`
  - `Primary 700`: `#1B8887` (Primary CTAs & active navigation)
  - `Primary 800`: `#10605F`
  - `Primary 900`: `#083B3A`
  - `Primary 950`: `#032120`
  - `Dashboard Canvas`: `#F5FAFA`
  - `Card Surface`: `#FFFFFF`
  - `Main Text`: `#172B2B`
  - `Secondary Text`: `#647575`
  - `Borders`: `#E5EEEE`

---

## 2. Milestones & Verifiable Tasks

### Milestone 1: Design Tokens & Landing Reference Audit — [x] COMPLETED
**Goal:** Establish centralized CSS custom properties and Tailwind v4 `@theme` tokens in `apps/client/src/index.css` aligned with the Official Brand Color Palette and `firstdoer.css` radii/shadows, without altering any landing page markup or landing styles.

1. **Audit Landing Reference (`firstdoer.css`, `index.css`):**
   - Confirm Poppins font loading, layered teal shadow patterns (`--shadow-sm`, `--shadow-md`), and rounded surface radii (`--radius-lg` / `1rem`, `--radius-xl` / `1.25rem`, `--radius-2xl` / `1.5rem`).
2. **Add Scoped Dashboard Tokens to `apps/client/src/index.css`:**
   - Define dashboard-specific CSS variables (prefixed `--dash-*` or mapped cleanly alongside existing `--color-*` tokens so landing/non-dashboard pages do not regress):
     - `--dash-primary-400: #7EDEDD`
     - `--dash-primary-500: #4CCDDC`
     - `--dash-primary-600: #29ADAC`
     - `--dash-primary-700: #1B8887`
     - `--dash-primary-800: #10605F`
     - `--dash-primary-900: #083B3A`
     - `--dash-primary-950: #032120`
     - `--dash-canvas: #F5FAFA`
     - `--dash-surface: #FFFFFF`
     - `--dash-text: #172B2B`
     - `--dash-text-secondary: #647575`
     - `--dash-border: #E5EEEE`
     - `--dash-active-bg: #EDF9FA`
     - `--dash-completed-bg: #E8F8F5`
   - Add a `.tabular-nums` / `.dash-kpi` utility rule if needed (`font-variant-numeric: tabular-nums; font-family: var(--font-sans);`).

**Milestone 1 Verification:**
- `apps/client/src/components/landing/*` has `0` diff lines.
- `index.css` compiles cleanly under Vite / Tailwind v4 with all new `--dash-*` tokens present.

---

### Milestone 2: Dashboard Shared Primitives — [x] COMPLETED
**Goal:** Create reusable, strictly dashboard-scoped UI primitives under `apps/client/src/components/shared/dashboard/` to eliminate duplicated card/badge/shell markup across Provider and Performer dashboards.

1. **`DashboardShell.jsx`:**
   - Provides `#F5FAFA` canvas background, `max-w-[1440px]` centered container support, optional `240px` fixed left sidebar slot, and responsive mobile drawer handling (`<1024px`).
2. **`DashboardCard.jsx`:**
   - Standardized `#FFFFFF` surface, `1px solid #E5EEEE` border, landing-aligned border radius (`16px`/`20px`) and subtle layered shadow, consistent internal padding.
3. **`StatCard.jsx`:**
   - Clean KPI card with `40x40px` `#F5FAFA` icon badge (`#1B8887` stroke), uppercase secondary label (`#647575`), large `tabular-nums` metric value (`#172B2B`), optional delta/trend line, and **zero corner decorative blob artifacts**.
4. **`StatusBadge.jsx`:**
   - Variants: `completed` (`#E8F8F5` bg / `#1B8887` text), `active` (`#EDF9FA` bg / `#1B8887` text), `live` (with `#4CCDDC` live dot), `neutral` (`#F5FAFA` bg / `#647575` text).
5. **`SearchPill.jsx`:**
   - Standardized rounded search input pill (`#FFFFFF` surface, `#E5EEEE` border, `#1B8887` focus ring, clear button) used in dashboard search/filter bars.
6. **`EmptyState.jsx`:**
   - Clean, compact empty-state card/bar (`#FFFFFF` or `#F5FAFA`, `#E5EEEE` dashed/solid border, `#1B8887` icon accent, `#172B2B` title, `#647575` subtitle, optional primary `#1B8887` action CTA).

**Milestone 2 Verification:**
- All 6 primitives exported from `apps/client/src/components/shared/dashboard/index.js`.
- Each component enforces `Poppins`, `#172B2B`/`#647575`/`#E5EEEE`/`#1B8887` tokens, and `tabular-nums` on numeric slots.

---

### Milestone 3: Performer Dashboard (`performer/dashboard`) — [x] COMPLETED
**Goal:** Refactor `PerformerDashboardPage.jsx` and its sidebar/navigation in `PerformerHeader.jsx` to fix layout imbalance, compact oversized sections, and apply the brand palette.

1. **Sidebar & Shell (`PerformerHeader.jsx` + `PerformerDashboardPage.jsx`):**
   - Standardize the desktop left sidebar to **`240px`** fixed width (`#FFFFFF` background, `1px solid #E5EEEE` right border).
   - Active navigation item: `#EDF9FA` background fill with `#1B8887` text and icon.
   - Collapsible mobile drawer for `<1024px` (`lg:hidden`) and main content offset `lg:ml-[240px] lg:w-[calc(100%-240px)]` over `#F5FAFA` canvas.
2. **Hero Banner ("Earn with Confidence"):**
   - Compact height from `min-h-[214px]` + external dots to **`~150px`** (`min-h-[150px]`) using `#083B3A` → `#1B8887` brand gradient.
   - Integrate pagination dot controls cleanly inside the bottom of the banner container instead of below it.
3. **Onboarding Card ("Get Started on FirstDoer"):**
   - Move `2/3 Done (67%)` progress indicator + compact progress bar into the card header alongside the title/subtitle.
   - Completed steps (`Complete Profile`, `Add Payment Method`): render with `#E8F8F5` background / `#1B8887` completed `StatusBadge` and `#1B8887` check icon.
   - Next action (`Start Verification`): highlight with a `#1B8887` primary CTA button (`hover:bg-[#10605F]`).
4. **Recommended Tasks & Browse Work by Skills:**
   - Convert `Recommended Tasks` grid to `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` with `tabular-nums` on `₹` payouts.
   - Replace the empty/plain grey `Browse Work by Skills` fallback bar with interactive skill filter chips (derived from available skills/categories or fallback skill pills) and a clean `EmptyState` if no categories exist.
5. **Performance Ranking & How FirstDoer Works:**
   - Re-balance `Performance Ranking` grid (`lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]` or balanced 12-col split) so `Current Rank` and the 3 step cards sit comfortably side-by-side without narrow vertical wrapping.
   - Make `How FirstDoer Works` compact and collapsible (default collapsed or compact toggle header) to reduce vertical scroll bloat.

**Milestone 3 Verification:**
- Desktop (`1440px`, `1280px`), tablet (`768px`), and mobile (`375px`) layouts render without horizontal overflow or narrow wrapped ranking cards.
- All `₹` payouts, percentages (`67%`), and rank numbers use `tabular-nums`.

---

### Milestone 4: Provider Dashboard (`provider/dashboard`) — [COMPLETED]
**Goal:** Refactor `DashboardPage.jsx` and its direct dashboard sub-components to fix visual artifacts, empty containers, and right-edge card clipping.

1. **Header & `1440px` Container Alignment (`ProviderHeader.jsx` & `DashboardPage.jsx`):**
   - Align top header and main dashboard wrapper to a unified `max-w-[1440px]` container grid over `#F5FAFA` canvas.
   - Ensure the primary `Post Task` CTA uses `#1B8887` (`hover:bg-[#10605F]`).
2. **Banner Carousel ("Find Top Performers" / `PostFirstTaskBanner.jsx` & `DashboardActionCarousel.jsx`):**
   - Compact banner/carousel height by ~30% (e.g., tighter vertical padding and `min-h` reduction).
   - Move `<` and `>` navigation arrows cleanly **inside** the banner container (eliminating protruding/overlapping outer arrows).
3. **Live Talent Status Bar (`TalentWaitingCard.jsx`):**
   - Tighten "Talent waiting for new tasks • Open" into a sleek horizontal status bar (`padding: 16px 24px`).
   - Include a `#4CCDDC` live indicator dot, compact skill pills, overlapping avatar stack, and `Explore →` CTA (`#1B8887`).
4. **`KEY METRICS` Cards (`DashboardPage.jsx` via `StatCard`):**
   - Remove the unstyled grey corner circle artifact (`absolute right-0 top-0 h-24 w-24 ...`).
   - Add `40x40px` (`h-10 w-10`) `#F5FAFA` icon badges with `#1B8887` stroke for `APPLICANTS`, `ACTIVE`, `COMPLETED`, `DRAFTS`.
   - Enforce `tabular-nums` on all metric values.
5. **Critical Layout Fixes (`DashboardPage.jsx`):**
   - **Remove Blank White Pill Container:** Guard the `BrowseCategoryGrid` `SectionCard` so when categories are empty/loading-empty or filtered out, no blank white container renders between `KEY METRICS` and `NETWORK / Task performers`.
   - **Fix `Task performers` 4-Column Grid Clipping:** Replace the horizontal `flex overflow-x-auto` (`min-w-[288px]`) strip with a responsive CSS Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`. This guarantees all 4 cards (including `Vikram Sengupta`) fit cleanly inside the `1440px` container without clipping off the right viewport edge.

**Milestone 4 Verification:**
- Zero blank white containers between `KEY METRICS` and `NETWORK / Task performers`.
- All 4 `Task performers` cards render cleanly inside the viewport at `1440px` and `1280px` with no right-edge clipping, and collapse to 2 columns (`sm`) and 1 column (mobile).
- Production build (`vite build`) passes with `0` errors.

---

## 3. Verification Strategy (Post-Approval Execution)
1. **Build Check:** Run `node --max-old-space-size=4096 ./node_modules/vite/bin/vite.js build` in `apps/client` after Milestone 4.
2. **Visual & Responsive Inspection:** Verify `/provider/dashboard` and `/performer/dashboard` across `1440px`, `1024px`, `768px`, and `375px` viewports.
3. **Regression Guard:** Confirm `git diff` touches zero files in `apps/admin`, `apps/client/src/components/landing/`, `AuthContext.jsx`, `App.jsx`, or backend `/api-onitindia`.
