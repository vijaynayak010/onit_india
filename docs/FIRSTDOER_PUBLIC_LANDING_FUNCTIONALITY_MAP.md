# FirstDoer — Public Landing Website Functionality Map

**Audit Type:** Inspection & Documentation Only (no code, route, or UI modifications made)  
**Scope:** Public-facing website routes, layouts, navigation, user journeys, interactive controls, and external dependencies prior to entering the Provider (`/provider/*`), Performer (`/performer/*`), or Admin (`/admin/*`) portals.

---

## 1. Landing Website Architecture

The public landing website lives inside the main React SPA (`apps/client/`) rather than a separate repository or Next.js app.

| Layer | File / Location | Details |
| :--- | :--- | :--- |
| **Root Directory** | `apps/client/` | Monorepo Vite + React 18 SPA (`apps/client/package.json`) |
| **Framework & Tech** | `apps/client/package.json` | React `^18.2.0`, Vite, React Router DOM `^7.9.5`, Tailwind CSS, Framer Motion `^12.23.24`, GSAP `^3.13.0`, React Leaflet `^4.2.1` + Leaflet `^1.9.4`, `@auth0/auth0-react` `^2.15.1`, `@msg91comm/sendotp-sdk` `^1.0.1`, `@microsoft/clarity` `^1.0.2`, `react-feather` / `lucide-react` |
| **Main Entry Point** | `apps/client/src/main.jsx` | Hydrates/mounts `<App />` inside `ErrorBoundary` + `Suspense`; `npm run build` runs `vite build` followed by `postbuild` (`node scripts/prerender.cjs`) for static SEO pre-rendering of public routes |
| **Main App & Router** | `apps/client/src/App.jsx` | Wraps `BrowserRouter` -> `AppAuth0Provider` -> `AuthProvider` -> `NotificationProvider` -> `ScrollToTop`, `MainContent`, `TestModeBadge`; initializes Microsoft Clarity in production |
| **Public Chrome / Layout** | `apps/client/src/App.jsx` | Uses `showGlobalChrome = !isHomePage && !isFullPagePath && !isPerformerDirectoryPage` |
| **Homepage Chrome** | `apps/client/src/components/landing/Landingpage.jsx` | Renders its own inline `<header>`, `<section>` blocks, and inline light `#DFF7F6` `<footer>` (`isHomePage = true` hides global `ScrollingInfo` + `Navbar` + `SplashCursor`) |
| **Subpage Chrome** | `apps/client/src/components/ui/ScrollingInfo.jsx`, `apps/client/src/components/layout/Navbar.jsx`, `apps/client/src/components/ui/SplashCursor.jsx` | Mounted automatically by `App.jsx` (`pt-28 md:pt-32`) on standard public pages; `PerformerDirectory.jsx` mounts them manually (`isPerformerDirectoryPage = true`). `showDomainsNav = false` in `App.jsx` disables `DomainsNavBar.jsx` |
| **Shared Subpage Footer** | `apps/client/src/components/layout/Footer.jsx` | Dark `#0D1210` footer imported individually by most public subpages (not globally mounted in `App.jsx`) |
| **Legacy / Unused Chrome** | `apps/client/src/components/landing/LandingFooter.jsx`, `apps/client/src/components/landing/Landingpage.backup.jsx` | Legacy landing footer and backup homepage; not mounted on active routes |
| **Styling & Theme** | `apps/client/src/components/landing/firstdoer.css`, `apps/client/src/pages/public/publicPages.css`, `apps/client/src/index.css` | Homepage uses `firstdoer.css` + inline styles; public subpages use Tailwind + CSS variables (`--color-primary`, etc.) + `publicPages.css` |

---

## 2. Complete Public Page Inventory

### 2.1 Fully Implemented & Mounted Public Pages

| Page Name | Route URL(s) | Source File | Header | Footer |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage** | `/`, `/home` | `apps/client/src/components/landing/Landingpage.jsx` (via `Home` in `App.jsx`) | Inline `<header>` | Inline light `<footer>` |
| **For Providers** | `/for-providers` | `apps/client/src/components/ForProvidersPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **For Performers (New)** | `/for-performers` | `apps/client/src/components/ForPerformersPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **For Performers (Legacy/Nav)** | `/task-performers` | `apps/client/src/pages/tasks/TaskPerformers.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Performer Directory** | `/performers-directory` | `apps/client/src/pages/performers/PerformerDirectory.jsx` | Self-mounted `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Performer Verification** | `/performer-verification-onboarding` | `apps/client/src/pages/performers/PerformerVerificationOnboarding.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Auth / Login / Signup** | `/auth`, `/signup`, `/register` | `apps/client/src/components/provider/pages/AuthPage.jsx` | None (`isFullPagePath`) | None |
| **Role-Preset Auth Redirects** | `/providerlogin`, `/performerlogin` | `apps/client/src/components/auth/AuthRoleRedirect.jsx` | None (`isFullPagePath`) | None |
| **Pricing & Fees** | `/pricing` | `apps/client/src/pages/pricing/PricingPagePublic.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **About Us** | `/about` | `apps/client/src/components/AboutUs.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **How It Works** | `/how-it-works` | `apps/client/src/components/HowItWorksPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **What Is FirstDoer / OnIT** | `/what-is-onit-india`, `/what-is-firstdoer` | `apps/client/src/components/WhatIsOnITIndia.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Execution Infrastructure** | `/execution-infrastructure` | `apps/client/src/components/ExecutionInfrastructurePage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Why Choose Us** | `/why-choose-us` | `apps/client/src/components/WhyChooseUsPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Partner With Us** | `/partner-with-us` | `apps/client/src/components/PartnerWithUsPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Freelancing India** | `/freelancing` | `apps/client/src/pages/freelancing/FreelancingIndiaPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Campus Detail** | `/campus-detail` | `apps/client/src/pages/campus/CampusDetail.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Task Categories & Detail** | `/tasks`, `/tasks/:categorySlug` | `apps/client/src/pages/tasks/TaskCategories.jsx`, `TaskCategoryDetailPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Use Cases Index & Pages** | `/use-cases`, `/for-startups`, `/for-creators`, `/for-businesses`, `/for-marketers`, `/for-agencies`, `/for-enterprises`, `/for-researchers`, `/for-ecommerce` | `apps/client/src/pages/use-cases/UseCasesIndexPage.jsx`, `UseCasePage.jsx`, `apps/client/src/data/useCases.js` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Services Index & 9 Subpages** | `/services`, `/services/retail-audit-services`, `/services/field-data-collection-services`, `/services/content-marketing-task-execution`, `/services/market-research-assistance`, `/services/social-media-content-creation-services`, `/services/blog-writing-services-for-startups`, `/services/seo-keyword-research-services`, `/services/instagram-post-design-services`, `/services/short-form-video-editing-services` | `apps/client/src/components/Services/ServicesIndexPage.jsx` + 9 dedicated components | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Help Index & 3 Guides** | `/help`, `/help/getting-started`, `/help/posting-your-first-task`, `/help/completing-your-first-task` | `apps/client/src/components/Help/HelpIndexPage.jsx` + 3 guide pages | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Community Index & 3 Subpages** | `/community`, `/community/success-stories`, `/community/top-performers`, `/community/completed-tasks-examples` | `apps/client/src/components/Community/CommunityIndexPage.jsx` + 3 subpages | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **FAQs** | `/faqs` | `apps/client/src/components/landing/FAQs.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Contact & Thank You** | `/contact`, `/contact/thank-you` | `apps/client/src/pages/contact/ContactPage.jsx`, `ContactThankYouPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Careers & Thank You** | `/careers`, `/careers/thank-you` | `apps/client/src/pages/careers/Careers.jsx`, `CareersThankYouPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Blog List & Post** | `/blog`, `/blog/:id` | `apps/client/src/components/Blog/BlogList.jsx`, `BlogPost.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |
| **Legal & Policy Pages** | `/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/cookie-policy`, `/trust-safety`, `/task-guidelines`, `/dispute-resolution-policy`, `/payment-payout-policy`, `/prohibited-tasks-policy`, `/task-completion-proof-policy`, `/policies/:slug` | `apps/client/src/pages/legal/*`, `apps/client/src/components/TrustAndSafety.jsx`, `apps/client/src/pages/tasks/TaskGuidelinesPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` (note `PolicyPage` also imports `Navbar`) |
| **Public Share & Invoice Verify** | `/s/:code`, `/verify-invoice` | `apps/client/src/pages/public/PublicSharePage.jsx`, `InvoiceVerificationPage.jsx` | None (`isFullPagePath`) | None |
| **404 Not Found** | `*` | `apps/client/src/pages/NotFoundPage.jsx` | Global `Navbar` + `ScrollingInfo` | Shared `Footer.jsx` |

### 2.2 Partially Implemented / Static-Mock-Backed Pages

| Page Name | Route URL | Source File | Why Partial |
| :--- | :--- | :--- | :--- |
| **Performer Directory** | `/performers-directory` | `apps/client/src/pages/performers/PerformerDirectory.jsx` | Renders Leaflet map + city/domain/search filters, but uses static `sampleTaskers` imported from `FindTaskerNearby.jsx` rather than live backend performer data |
| **Domain Detail & Sub-Domain** | `/domains/:slug`, `/domains/:slug/:subDomainSlug` | `apps/client/src/pages/domains/DomainDetail.jsx`, `DomainSubDomainPage.jsx` | Functional detail views, but **omit `<Footer />`** and its not-found state links to broken hash `/#domain` |
| **Provider Welcome** | `/provider/welcome` | `apps/client/src/components/provider/pages/WelcomePage.jsx` | Mounted publicly outside `<GatedRoute>`, whereas `/provider/*` is gated |
| **Blog Admin Pages** | `/admin-login`, `/admin-dashboard`, `/add-post` | `apps/client/src/components/Blog/AdminLogin.jsx`, `AdminDashboard.jsx`, `AddPost.jsx` | Blog-specific admin screens mounted at top level alongside public blog routes |

### 2.3 Existing in Codebase but Inaccessible / Unmounted Routes

- **Unmounted Page Files in `apps/client/src/pages/`:**
  - `apps/client/src/pages/domains/Domains.jsx` (exports `domains` array used by `DomainDetail` and `DomainsNavBar`, default component unmounted)
  - `apps/client/src/pages/domains/DomainTaskTypes.jsx` (unmounted)
  - `apps/client/src/pages/performers/FindTaskerNearby.jsx` (exports `sampleTaskers` used by `PerformerDirectory`, component unmounted)
  - `apps/client/src/pages/performers/TaskSeeker.jsx` (unmounted)
  - `apps/client/src/pages/campus/Campus.jsx` (unmounted; `/campus-detail` mounts `CampusDetail.jsx`)
- **Legacy / Backup Components in `apps/client/src/components/landing/`:**
  - `Landingpage.backup.jsx`, `LandingFooter.jsx`, `VerificationSection.jsx`, `ExploreCategoriesSection.jsx`, `WhateverYouNeedSection.jsx`, `HearFromUsersSection.jsx`, `PostOptionsSection.jsx`, `FindTalentSection.jsx`, `TrustedBySection.jsx`, `TestimonialsSection.jsx`, `TrustSection.jsx`, `VideoSection.jsx`, `FinalCtaSection.jsx`, `ExplorePossibilities.jsx`, `HowItWorks.jsx`, `Partner.jsx`, `PerformersSection.jsx`, `WhyChooseUs.jsx`
- **Hidden / Utility Routes (Mounted, No Public Nav Links):**
  - `/dev/*` -> `AccessUnlockPage.jsx` (sets `localStorage.onit_dev_access_2026 = "granted"` and redirects)
  - `/test-explorer` -> `ManualPageExplorer.jsx`
  - `/otp` -> `<Navigate to="/auth" replace />`
  - `/deletion` -> `<Navigate to="/" replace />`

### 2.4 Referenced in Navigation / Links but Missing or Mismatched

- **Broken Hash Target in `Navbar.jsx`:** Clicking `Start Posting` while on `/` scrolls to `#hero-post-task`, which does not exist in `Landingpage.jsx` (the hero section uses `#top` / `#post`).
- **Broken Hash Target in `DomainDetail.jsx`:** Not-found fallback links to `/#domain`, which does not exist in `Landingpage.jsx` (`#categories` is used).
- **Broken Hash Target in `Navbar.jsx` (`OnitCampus`):** Navigates to `/campus-detail#campus` (check if `#campus` anchor exists on `CampusDetail.jsx`).
- **Legacy `LandingFooter.jsx` Dead Slugs:** Points to `/partner`, `/terms`, `/privacy`, `/refunds`, `/faq` — none of which exist in `App.jsx` (active routes are `/partner-with-us`, `/terms-and-conditions`, `/privacy-policy`, `/refund-policy`, `/faqs`), though `LandingFooter.jsx` itself is only used by `Landingpage.backup.jsx`.
- **Route Parameter Mismatch in `Landingpage.jsx` Footer:** `Dispute Resolution` links to `/policies/dispute-resolution` instead of `/dispute-resolution-policy` (resolved dynamically only if backend `/settings/content-pages/dispute-resolution` returns content in `PolicyPage.jsx`).

---

## 3. Page-by-Page Functionality Summary

- **Homepage (`/`):** Marketing overview + AI brief typing preview + interactive 5-tab hero demo + live tracking 3-tab simulator + 3-step sticky workflow + FAQ accordion + Provider task-posting entry (`handlePostTask`).
- **For Providers (`/for-providers`):** Value proposition, 4 benefit cards, 5-step process, CTAs to `/provider/post-task-selection` and `/providerlogin`.
- **For Performers (`/for-performers`):** Value proposition, 4 benefit cards, 5-step process, CTAs to `/task-performers` and `/performerlogin`.
- **Task Performers (`/task-performers`):** Performer benefits, 4-step onboarding summary, `FindTaskersNearbyTeaser`, and final CTA linking externally to a Google Form.
- **Performer Directory (`/performers-directory`):** Interactive city/domain/text filter + React Leaflet map of metro cities backed by static `sampleTaskers` mock data.
- **Auth (`AuthPage.jsx` via `/auth`, `/signup`, `/register`, `/providerlogin`, `/performerlogin`):** Unified role selector (`PROVIDER` / `TASKER`) + Auth0 Google login, Email OTP, and optional Phone OTP (MSG91), plus Test Mode shortcut (`isTestModeEnabled()`).
- **Domains & Categories (`/domains/:slug`, `/domains/:slug/:subDomainSlug`, `/tasks`, `/tasks/:categorySlug`):** SEO landing pages describing task scopes, sub-domains, and cross-links (`CategoryCrossLinks.jsx`).
- **Services (`/services`, `/services/*`), Use Cases (`/use-cases`, `/for-*`), Help (`/help`, `/help/*`), Community (`/community`, `/community/*`):** Static SEO/informational content pages with `Footer.jsx` and signup/post-task CTAs.
- **Blog (`/blog`, `/blog/:id`):** Static `data/blogs.js` articles with category filtering, search, and reading time calculation.
- **Careers (`/careers`, `/careers/thank-you`):** Role listings (`FALLBACK_POSITIONS` + live `GET /careers`) and application modal supporting S3 presigned resume uploads + `POST /careers/applications`.
- **Contact (`/contact`, `/contact/thank-you`):** Support info (`support@firstdoer.com`) and contact form redirecting to `/contact/thank-you`.
- **Legal & Dynamic Policy (`/privacy-policy`, `/terms-and-conditions`, `/refund-policy`, `/cookie-policy`, `/trust-safety`, `/task-guidelines`, `/dispute-resolution-policy`, `/payment-payout-policy`, `/prohibited-tasks-policy`, `/task-completion-proof-policy`, `/policies/:slug`):** Static legal pages plus `PolicyPage.jsx` which fetches markdown from `${API_BASE}/settings/content-pages/${slug}`.
- **Public Share & Invoice Verification (`/s/:code`, `/verify-invoice`):** Unchromed utility pages fetching `/public/share/:code` and `/public/invoices/verify`.

---

## 4. Homepage Section Breakdown (`Landingpage.jsx`)

1. **Inline Header (`<header>`):**
   - Brand logo (`#top`), anchor nav (`#categories`, `#how`, `#why`, `#steps`, `#faq`), `Login` button (`navigate("/auth")`), `Post a Task` CTA (`handlePostTask()`).
2. **Hero (`#top`):**
   - Headline: `"Post your task. Get it done."`
   - Inline task brief form (`#post`, `input#taskq` with animated typewriter placeholder, `"Post Task"` submit button -> `handlePostTask()`).
   - 5-tab interactive showcase (`htabs`: `Growth & Marketing`, `Design & Creative`, `Build & Develop`, `AI Checklist`, `Trust Score`), auto-cycling every 7 seconds and pausing on pointer hover.
   - Footer bar inside tabs triggers `handlePostTask(currentBrief.req)` or `handlePostTask()`.
3. **Trusted By Marquee (`aria-label="Trusted by growing businesses"`):**
   - Horizontal scrolling brand wordmark marquee (`logos`).
4. **Categories & Value Bento Grid (`#categories`):**
   - **Card A ("Whatever you need, get it done."):** 3 numbered category cards (`01 Growth & Marketing` -> `/domains/content-design-marketing`, `02 Design & Creative` -> `/domains/content-design-marketing`, `03 Build & Develop` -> `/domains/tech-data-admin`), scrolling skill pills, and `"Post a Task"` button (`handlePostTask()`).
   - **Card B ("See your task move, every day."):** Floating task-progress preview card (`Edit 10 reels for my brand`) with `#how` `"Open"` link.
   - **Card C ("Your money stays safe."):** Escrow card (`₹18,500`, Milestone 2 of 3) with `#how` `"Approve & release"` link.
   - **Card D ("The people behind your task."):** Dual-row performer chip marquee (`perfChips`, `perfChips2`); every chip links to `/performers-directory`.
   - **Card E ("Talk to your performer in one place."):** Auto-cycling chat preview (`convos`, 6s interval).
5. **Live Tracking Showcase (`#how`):**
   - Header card with `"Watch how it works · 1:00"` (`href="#how"` — no video modal).
   - Interactive 3-tab preview (`Conversation`, `Progress`, `Deliverables`) auto-cycling every 6 seconds; tab 2 includes non-navigating demo buttons (`Request changes`, `Approve & release payment`).
6. **Why FirstDoer Bento Grid (`#why`):**
   - 5 static feature cards: Verified performers, Escrow release, AI checklist, Live tracking, Timestamped proof.
7. **How It Works (`#steps`):**
   - 3 sticky scroll cards (`01 Post your task`, `02 Choose your performer`, `03 Pay & track`) with visual status panels.
8. **FAQ Accordion (`#faq`):**
   - 6 interactive accordion items (`faqDefs`) + `"Contact support"` link (`/contact`).
9. **Final CTA (`#apps`):**
   - `"Post your task"` button (`handlePostTask()`) + Google Play Store link (`com.onitapp.india`).
10. **Inline Footer (`<footer>`):**
    - 5 link columns (`footCols`: Categories, Platform, Company, Legal, Support), `mailto:support@firstdoer.com`, and generic social links (`https://instagram.com`, `https://facebook.com`, `https://linkedin.com`, `https://youtube.com`).

---

## 5. Provider User Journey (Public -> Portal)

1. **Entry from Homepage (`/`):**
   - User types a task brief in `#post` or clicks `"Post a Task"` / `"Post Task"`.
   - `handlePostTask()` runs:
     - **Unauthenticated:** Navigates to `/auth` with `{ state: { tab: "signup", taskData } }`.
     - **Authenticated `PROVIDER`:** Navigates directly to `/provider/post-task-manual` with `{ state: { aiGeneratedData } }`.
     - **Authenticated non-`PROVIDER`:** Navigates to `/auth`.
2. **Entry from Subpages (`Navbar` / `Footer` / `/for-providers`):**
   - `ForProvidersPage` (`Post a task`) and `Navbar` (`Start Posting` on subpages) navigate to `/provider/post-task-selection` (protected by `<GatedRoute>`, which redirects unauthenticated users to `/auth` / login).
   - `Footer` (`Post a Task`) and `ForProvidersPage` (`Sign up / Log in`) route to `/providerlogin` -> `AuthRoleRedirect` -> `/auth` with `{ state: { role: "PROVIDER", mode: "login" } }`.
3. **Authentication (`AuthPage.jsx`):**
   - Defaults to `PROVIDER` if `role` is preset or selectable on `ROLE_SELECTION`; supports Auth0 Google, Email OTP, or Test Mode -> lands in `/provider/dashboard` (or `/provider/post-task-manual` if `taskData` was carried over).

---

## 6. Performer User Journey (Public -> Portal)

1. **Entry from Homepage (`/`):**
   - **Gap:** Homepage header, hero, and `#apps` CTA have **no dedicated Performer signup/login button**. Performers only appear via showcase chips (`/performers-directory`) or footer link `Verified Performers` (`/performers-directory`).
2. **Entry from Subpages (`Navbar` / `Footer` / `/for-performers`):**
   - `Navbar` unauthenticated `"Join as Performer"` -> `/task-performers`.
   - `Footer` `"For Performers"` -> `/for-performers`; `"Performer Login"` -> `/performerlogin` -> `/auth` (`role: "TASKER"`).
   - `ForPerformersPage` `"Join as performer"` -> `/task-performers`; `"Sign up / Log in"` -> `/performerlogin`.
3. **Critical Conversion Dead-End on `/task-performers`:**
   - `TaskPerformers.jsx` final CTA (`"Start completing tasks"`) links externally to a Google Form (`https://docs.google.com/forms/...`) instead of `/performerlogin` or `/auth`.
4. **Authentication (`AuthPage.jsx`):**
   - Users arriving via `/performerlogin` or selecting **Performer** (`TASKER`) on `/auth` authenticate via Auth0 / Email OTP / Test Mode and enter `/performer/dashboard`.

---

## 7. Header Functionality Comparison

| Feature | Homepage Inline `<header>` (`Landingpage.jsx`) | Global Subpage `<Navbar />` (`Navbar.jsx`) |
| :--- | :--- | :--- |
| **Where Used** | `/`, `/home` | All other public pages (via `App.jsx` or `PerformerDirectory.jsx`), except `isFullPagePath` |
| **Brand Click** | Scrolls to `#top` | `navigate("/")` |
| **Primary Nav Links** | Section anchors: `Categories` (`#categories`), `Live Tracking` (`#how`), `Why firstDoer` (`#why`), `How it Works` (`#steps`), `FAQ` (`#faq`) | Page routes: `About Us` (`/about`), `Careers` (`/careers`), `Blog` (`/blog`), `Contact` (`/contact`), `Why Choose Us` (`/why-choose-us`), `Partner with us` (`/partner-with-us`) |
| **Performer CTA** | None | `Join as Performer` -> `/task-performers` (unauthenticated) / `Find Tasks` -> `/tasks` (authenticated) |
| **Auth / Login CTA** | `Login` -> `/auth` | `Login / Sign up` -> `/auth` (`authMode: "signin"`) |
| **Primary Action CTA** | `Post a Task` -> `handlePostTask()` | `Start Posting` -> `/provider/post-task-selection` (subpages) or broken scroll `#hero-post-task` (if on `/`) |
| **Authenticated State** | `handlePostTask` routes `PROVIDER` to `/provider/post-task-manual`, others to `/auth` | Replaces guest CTAs with `Post Task` / `Find Tasks` + `Dashboard` (`getDashboardLink()`) |

---

## 8. Footer Functionality Comparison

| Feature | Homepage Inline `<footer>` (`Landingpage.jsx`) | Shared Subpage `<Footer />` (`Footer.jsx`) | Legacy `LandingFooter.jsx` |
| :--- | :--- | :--- | :--- |
| **Where Used** | `/`, `/home` | 30+ public subpages (omitted on `DomainDetail` & `DomainSubDomainPage`) | `Landingpage.backup.jsx` only |
| **Columns** | 5 (`Categories`, `Platform`, `Company`, `Legal`, `Support`) | 5 (`Platform`, `Get Started`, `Company`, `Legal & Policies`, `Support`) | 5 (`Categories`, `Platform`, `Company`, `Legal`, `Support`) |
| **Social Links** | Generic root domains (`instagram.com`, `facebook.com`, `linkedin.com`, `youtube.com`) | Official FirstDoer/OnIT profiles (`linkedin.com/company/onitindia`, `instagram.com/onitindia`, `facebook.com/...`, `x.com/OnITIndia`, `youtube.com/@OnITIndia`) | Placeholder `href="#"` |
| **App Store Links** | Google Play Store (`com.onitapp.india`) in `#apps` | Two Google Play cards: Provider (`com.onitapp.india`) & Performer (`com.onitconsumer.india`) | None |
| **Newsletter** | None | Has unused `email` state & `handleSubmit` (`POST ${API_BASE}/api/subscribe`), but no `<form>` rendered in JSX | None |

---

## 9. Interactive Element Inventory

- **Homepage (`Landingpage.jsx`):**
  - Hero brief `<form id="post">` + `input#taskq` + `"Post Task"` submit button.
  - 5 hero tab buttons (`Growth & Marketing`, `Design & Creative`, `Build & Develop`, `AI Checklist`, `Trust Score`) + pointer-hover pause.
  - 3 Live Tracking tab buttons (`Conversation`, `Progress`, `Deliverables`).
  - 6 FAQ accordion toggle buttons (`aria-expanded`).
  - Note: `"Watch how it works · 1:00"` (`#how`), `"Request changes"`, and `"Approve & release payment"` inside the Live Tracking mockup are static/anchor demos with no modal or action.
- **Performer Directory (`PerformerDirectory.jsx`):**
  - Search input + button, metro city selector, domain filter, `"Use my location"` browser Geolocation button, interactive Leaflet map markers & popups.
- **Auth (`AuthPage.jsx`):**
  - Role cards (`Provider` / `Performer`), Google OAuth button, Email OTP input + verification flow, Phone OTP (when `PHONE_OTP_ENABLED`), Test Mode switcher.
- **Careers (`Careers.jsx`):**
  - Job detail modal, resume file upload (presigned S3), application submission form.
- **Contact (`ContactPage.jsx`):**
  - Contact form submission -> `/contact/thank-you`.
- **Blog (`BlogList.jsx`):**
  - Search input, category filter tabs, article cards -> `/blog/:id`.

---

## 10. Route & Navigation Relationship Map

### Issues Identified

| Issue Category | Source Location | Target / Behavior | Impact |
| :--- | :--- | :--- | :--- |
| **Broken Hash Anchor** | `Navbar.jsx` (`handleStartPosting` when on `/`) | Scrolls to `#hero-post-task` (does not exist; homepage uses `#top`/`#post`) | No-op if `Navbar` is triggered on `/` |
| **Broken Hash Anchor** | `DomainDetail.jsx` (not-found view) | `<Link to="/#domain">` (does not exist; homepage uses `#categories`) | Lands at top of `/` instead of categories |
| **Dead Conversion Link** | `TaskPerformers.jsx` final CTA | External Google Form (`docs.google.com/forms/...`) | Sends performers off-site instead of `/performerlogin` or `/auth` |
| **Duplicate Category Targets** | `Landingpage.jsx` (`categories` & `footCols`) | Both `Growth & Marketing` and `Design & Creative` point to `/domains/content-design-marketing` | Two distinct cards open the same domain page |
| **Policy Slug Mismatch** | `Landingpage.jsx` (`footCols`) | `/policies/dispute-resolution` instead of `/dispute-resolution-policy` | Relies on backend API slug match instead of static legal page |
| **Generic Social URLs** | `Landingpage.jsx` inline `<footer>` | Links to `https://instagram.com`, `https://facebook.com`, etc. | Does not open FirstDoer's official social pages |
| **Missing Footer** | `DomainDetail.jsx`, `DomainSubDomainPage.jsx` | `<Footer />` not imported or rendered | Dead-end page bottom without site navigation |
| **Duplicate Performer Entry Pages** | `App.jsx` + `Navbar.jsx` + `Footer.jsx` | `/for-performers` (`ForPerformersPage`) vs `/task-performers` (`TaskPerformers`) | Split performer messaging; `Navbar` uses `/task-performers`, `Footer` uses `/for-performers` |
| **Duplicate Routes** | `App.jsx` | `/` & `/home`; `/signup` & `/register`; `/what-is-onit-india` & `/what-is-firstdoer` | Minor route aliases |
| **Unconnected Routes** | `App.jsx` + `pages/` | `/dev/*`, `/test-explorer`, `/provider/welcome`, `/admin-login`, `/admin-dashboard`, `/add-post`; plus unmounted files `Domains.jsx`, `DomainTaskTypes.jsx`, `FindTaskerNearby.jsx`, `TaskSeeker.jsx`, `Campus.jsx` | Dead/legacy code or hidden utility routes |

---

## 11. Missing or Incomplete Pages

- **Dedicated Homepage Performer Onboarding Path:** Homepage has no direct Performer signup/CTA (`Join as Performer` / `Earn as a Performer`).
- **Live Backend-Backed Performer Directory:** `/performers-directory` relies on static `sampleTaskers` mock data instead of live verified performer profiles.
- **Functional Newsletter Subscription Form:** `Footer.jsx` defines `handleSubmit` for `POST ${API_BASE}/api/subscribe` with no rendered `<form>`.
- **Video / Interactive Demo Modal:** Homepage `"Watch how it works · 1:00"` simply links to `#how` rather than opening a walkthrough video.

---

## 12. Missing or Incorrect Connections

- `Landingpage.jsx` -> No link to `/for-performers` or `/performerlogin`.
- `TaskPerformers.jsx` -> Links to external Google Form instead of `/performerlogin` / `/auth`.
- `Landingpage.jsx` -> Inline `<footer>` social links point to generic domains instead of `Footer.jsx` official handles.
- `DomainDetail.jsx` & `DomainSubDomainPage.jsx` -> Missing `<Footer />` and broken `/#domain` back-link.

---

## 13. External Dependencies

- **Authentication & OTP:** Auth0 (`@auth0/auth0-react`), MSG91 OTP widget (`@msg91comm/sendotp-sdk`), Email OTP endpoints (`/auth/...`).
- **Backend API (`API_BASE` / `getApiUrl()`):**
  - `GET /careers`, `POST /uploads/presigned-url/career-resumes` (+ direct S3 PUT), `POST /careers/applications` (`Careers.jsx`)
  - `GET /settings/content-pages/:slug` (`PolicyPage.jsx`)
  - `GET /public/share/:code`, `POST /public/share/:code/open` (`PublicSharePage.jsx`)
  - `GET /public/invoices/verify` (`InvoiceVerificationPage.jsx`)
  - `POST /api/subscribe` (`Footer.jsx`, currently unrendered in JSX)
- **Third-Party Services & Assets:**
  - Google Play Store (`com.onitapp.india`, `com.onitconsumer.india`)
  - External Google Form (`docs.google.com/forms/...` in `TaskPerformers.jsx`)
  - OpenStreetMap / Leaflet tile servers (`PerformerDirectory.jsx`)
  - Microsoft Clarity (`Clarity.init("wjlutvpx00")` in production `App.jsx`)
  - Social platforms (LinkedIn, Instagram, Facebook, X, YouTube)

---

## 14. Recommended Implementation Priorities

1. **Fix Performer Conversion Funnel (High):** Add a clear Performer CTA (`Join as Performer` -> `/for-performers` or `/performerlogin`) on the homepage (`Landingpage.jsx`) and replace the external Google Form in `TaskPerformers.jsx` with `/performerlogin` (or `/auth` with `role: "TASKER"`).
2. **Fix Broken & Mismatched Links (High):** Update `Landingpage.jsx` footer social URLs to match `Footer.jsx`, point `Dispute Resolution` to `/dispute-resolution-policy`, fix `DomainDetail.jsx` `/#domain` -> `/tasks` or `/#categories`, and fix `Navbar.jsx` `#hero-post-task` -> `#post`.
3. **Add Missing Footers & Unify Performer Pages (Medium):** Render `<Footer />` on `DomainDetail.jsx` and `DomainSubDomainPage.jsx`, and consolidate `/task-performers` and `/for-performers` into one canonical Performer landing page.
4. **Replace Static Mocks & Remove Dead UI Hooks (Medium):** Connect `PerformerDirectory.jsx` to live API data (or clearly label as sample capacity), wire or remove the unused newsletter handler in `Footer.jsx`, and archive/remove unmounted legacy files (`Landingpage.backup.jsx`, `LandingFooter.jsx`, `FindTaskerNearby.jsx`, `TaskSeeker.jsx`, `Domains.jsx` view component).
