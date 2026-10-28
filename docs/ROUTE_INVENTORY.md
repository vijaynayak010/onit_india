# OnIT India Platform — Route Inventory & Parameter Directory

**Document Version:** 1.0.0  
**Environment:** Frontend-Only Manual Testing Clone  
**Audit Coverage:** 100% of discovered static, nested, and dynamic route declarations across `apps/client` and `apps/admin`.

---

## 1. Public Marketing & Content Routes (`apps/client`)

| Route Path | Module / Feature | Applicable Role | Dynamic Parameters | Valid Sample URL | Backend Dependency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Landing / Hero / Overview | Public | None | `/` | Static Content / Home dynamic config |
| `/home` | Landing alias | Public | None | `/home` | Static Content |
| `/about` | About OnIT India | Public | None | `/about` | Static Content |
| `/what-is-onit-india` | Platform explainer | Public | None | `/what-is-onit-india` | Static Content |
| `/how-it-works` | Operational workflow | Public | None | `/how-it-works` | Static Content |
| `/execution-infrastructure` | Infrastructure deep-dive | Public | None | `/execution-infrastructure` | Static Content |
| `/why-choose-us` | Value proposition | Public | None | `/why-choose-us` | Static Content |
| `/for-providers` | Provider audience landing | Public | None | `/for-providers` | Static Content |
| `/for-performers` | Performer audience landing | Public | None | `/for-performers` | Static Content |
| `/freelancing` | Freelancing India overview | Public | None | `/freelancing` | Static Content |
| `/pricing` | Public pricing calculator | Public | None | `/pricing` | Static Content / Pricing models |
| `/contact` | Contact us & Inquiry form | Public | None | `/contact` | Contact API / Google Sheets |
| `/contact/thank-you` | Contact confirmation page | Public | None | `/contact/thank-you` | None |
| `/careers` | Job openings & application | Public | None | `/careers` | Careers API / Resume upload |
| `/careers/thank-you` | Career confirmation page | Public | None | `/careers/thank-you` | None |
| `/partner-with-us` | Partnership registration | Public | None | `/partner-with-us` | Partner API |
| `/campus-detail` | Campus Ambassador program | Public | None | `/campus-detail` | Static Content |
| `/task-performers` | Performers showcase | Public | None | `/task-performers` | Public performer highlights |
| `/performers-directory` | Searchable talent directory | Public | Search query | `/performers-directory` | Performer listing & ratings API |
| `/tasks` | Task categories index | Public | None | `/tasks` | Task catalog domains API |
| `/tasks/:categorySlug` | Category detail page | Public | `:categorySlug` (`business`, `content`, `tech`, `admin`, `creative`, `events`) | `/tasks/business` | Task templates & category data |
| `/domains/:slug` | Domain showcase | Public | `:slug` (`business-operations-research`, `content-design-marketing`, `tech-data-admin`, `academic-knowledge-support`, `on-ground-local-assistance`) | `/domains/business-operations-research` | Domain taxonomy data |
| `/domains/:slug/:subDomainSlug` | Sub-domain SEO page | Public | `:slug`, `:subDomainSlug` | `/domains/business-operations-research/market-research` | Sub-domain directory |
| `/use-cases` | Use cases index | Public | None | `/use-cases` | Use cases catalog |
| `/for-startups` | Startup use case landing | Public | None | `/for-startups` | Static Content |
| `/for-creators` | Creator use case landing | Public | None | `/for-creators` | Static Content |
| `/for-businesses` | Business use case landing | Public | None | `/for-businesses` | Static Content |
| `/for-marketers` | Marketer use case landing | Public | None | `/for-marketers` | Static Content |
| `/for-agencies` | Agency use case landing | Public | None | `/for-agencies` | Static Content |
| `/for-enterprises` | Enterprise use case landing| Public | None | `/for-enterprises` | Static Content |
| `/for-researchers` | Researcher use case landing| Public | None | `/for-researchers` | Static Content |
| `/for-ecommerce` | E-commerce use case landing| Public | None | `/for-ecommerce` | Static Content |
| `/services` | Services hub | Public | None | `/services` | Services catalog |
| `/services/retail-audit-services` | Specialized service page | Public | None | `/services/retail-audit-services` | Static Content |
| `/services/field-data-collection-services` | Specialized service page | Public | None | `/services/field-data-collection-services` | Static Content |
| `/services/content-marketing-task-execution` | Specialized service page | Public | None | `/services/content-marketing-task-execution` | Static Content |
| `/services/market-research-assistance` | Specialized service page | Public | None | `/services/market-research-assistance` | Static Content |
| `/services/social-media-content-creation-services` | Specialized service page | Public | None | `/services/social-media-content-creation-services` | Static Content |
| `/services/blog-writing-services-for-startups` | Specialized service page | Public | None | `/services/blog-writing-services-for-startups` | Static Content |
| `/services/seo-keyword-research-services` | Specialized service page | Public | None | `/services/seo-keyword-research-services` | Static Content |
| `/services/instagram-post-design-services` | Specialized service page | Public | None | `/services/instagram-post-design-services` | Static Content |
| `/services/short-form-video-editing-services` | Specialized service page | Public | None | `/services/short-form-video-editing-services` | Static Content |
| `/community` | Community hub | Public | None | `/community` | Community stats |
| `/community/success-stories` | Success stories index | Public | None | `/community/success-stories` | Static Stories |
| `/community/top-performers` | Performer spotlight | Public | None | `/community/top-performers` | Performer rankings API |
| `/community/completed-tasks-examples` | Examples of completed work | Public | None | `/community/completed-tasks-examples` | Completed tasks feed |
| `/help` | Help center index | Public | None | `/help` | Static Content |
| `/help/getting-started` | Getting started guide | Public | None | `/help/getting-started` | Static Content |
| `/help/posting-your-first-task` | Provider guide | Public | None | `/help/posting-your-first-task` | Static Content |
| `/help/completing-your-first-task` | Performer guide | Public | None | `/help/completing-your-first-task` | Static Content |
| `/faqs` | Frequently asked questions | Public | None | `/faqs` | FAQs content |
| `/trust-safety` | Trust & Safety standards | Public | None | `/trust-safety` | Static Content |
| `/privacy-policy` | Privacy policy legal | Public | None | `/privacy-policy` | Legal markdown |
| `/terms-and-conditions` | Terms & Conditions | Public | None | `/terms-and-conditions` | Legal markdown |
| `/refund-policy` | Refund & cancellation | Public | None | `/refund-policy` | Legal markdown |
| `/cookie-policy` | Cookie & site data policy | Public | None | `/cookie-policy` | Legal markdown |
| `/task-guidelines` | Task submission guidelines | Public | None | `/task-guidelines` | Legal markdown |
| `/dispute-resolution-policy` | Dispute policy | Public | None | `/dispute-resolution-policy` | Legal markdown |
| `/payment-payout-policy` | Payment & payout rules | Public | None | `/payment-payout-policy` | Legal markdown |
| `/prohibited-tasks-policy` | Prohibited task catalog | Public | None | `/prohibited-tasks-policy` | Legal markdown |
| `/task-completion-proof-policy` | Proof standards policy | Public | None | `/task-completion-proof-policy` | Legal markdown |
| `/performer-verification-onboarding` | KYC & onboarding guide | Public | None | `/performer-verification-onboarding` | Legal markdown |
| `/policies/:slug` | Dynamic policy page | Public | `:slug` (e.g. `community-guidelines`) | `/policies/community-guidelines` | `GET /settings/content-pages/:slug` |
| `/blog` | Blog posts feed | Public | None | `/blog` | Static Blog List (`blogs.js`) |
| `/blog/:id` | Blog post reader | Public | `:id` (`1` through `18`) | `/blog/18` | Blog article payload |
| `/s/:code` | Public Task/Profile Share | Public | `:code` (alphanumeric hash) | `/s/TASK-10293` | `GET /public/share/:code` |
| `/verify-invoice` | Public Invoice Verification | Public | Query: `?inv=INV-9921` | `/verify-invoice?inv=INV-9921` | `GET /public/invoices/verify` |

---

## 2. Authentication & Onboarding Routes

| Route Path | Module / Feature | Applicable Role | Dynamic Parameters | Valid Sample URL | Backend Dependency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/auth` | Unified Login / Signup | Public / Guest | None | `/auth` | Auth0 SPA / OTP API |
| `/signup` | Signup mode switch | Public / Guest | None | `/signup` | Auth0 SPA / OTP API |
| `/register` | Registration alias | Public / Guest | None | `/register` | Auth0 SPA / OTP API |
| `/otp` | Phone / Email OTP entry | Public / Guest | None | `/otp` | MSG91 / Auth0 |
| `/providerlogin` | Provider role gateway | Public / Guest | None | `/providerlogin` | Auth0 Client Provider |
| `/performerlogin` | Performer role gateway | Public / Guest | None | `/performerlogin` | Auth0 Client Tasker |
| `/provider/welcome` | Provider welcome screen | Provider | None | `/provider/welcome` | User profile setup |
| `/provider/restore-account` | Provider account recovery | Provider | None | `/provider/restore-account` | Deletion request cancel |
| `/performer/restore-account` | Performer account recovery | Performer | None | `/performer/restore-account` | Deletion request cancel |
| `/admin-login` | Legacy admin authentication | Admin | None | `/admin-login` | Admin credentials |
| `/admin-dashboard` | Legacy blog admin hub | Admin | None | `/admin-dashboard` | Blog CRUD API |
| `/add-post` | Legacy blog post creator | Admin | None | `/add-post` | Blog CRUD API |
| `/dev/*` | Developer access unlock | Public | None | `/dev/access` | LocalStorage key grant |

---

## 3. Provider Portal Routes (`/provider/*`)

All routes require `PROVIDER` or `ADMIN` role.

| Route Path | Module / Feature | Dynamic Parameters | Valid Sample URL | Backend Dependency |
| :--- | :--- | :--- | :--- | :--- |
| `/provider/dashboard` | Main Provider Dashboard | None | `/provider/dashboard` | `/wallet`, `/my-tasks`, `/taskers/rankings` |
| `/provider/onboarding` | 3-Step Provider Onboarding | None | `/provider/onboarding` | `/providers/me/onboarding-status`, `/providers` |
| `/provider/post-task-selection` | Creation Wizard: Mode Select | None | `/provider/post-task-selection` | Task Templates API |
| `/provider/post-task-manual` | Creation Wizard: Manual Entry | None | `/provider/post-task-manual` | `/tasks`, `/task-catalog/domains` |
| `/provider/post-task-ai` | Creation Wizard: AI Generator | None | `/provider/post-task-ai` | BFF: `POST /api/generate-task` |
| `/provider/post-task-details` | Creation Wizard: Review/Budget | None | `/provider/post-task-details` | `/tasks` draft storage |
| `/provider/post-task-results` | Creation Wizard: Recommendations | None | `/provider/post-task-results` | `/taskers/recommendations` |
| `/provider/my-tasks` | Task Management Hub | None | `/provider/my-tasks` | `/tasks/my-tasks` |
| `/provider/task-details` | Single Task Manager | None (state: taskId) | `/provider/task-details` | `/tasks/:id` |
| `/provider/task-applicants` | Applicant Review & Hiring | None (state: taskId) | `/provider/task-applicants` | `/tasks/:id/applications` |
| `/provider/active-task/:id` | Live Task Workroom | `:id` (e.g. `task-101`) | `/provider/active-task/task-101` | `/tasks/:id`, `/tasks/:id/submissions` |
| `/provider/active-task/:id/need-help` | Task Issue Support | `:id` | `/provider/active-task/task-101/need-help` | Support Tickets API |
| `/provider/active-task/:id/extend-deadline` | Deadline Extension Form | `:id` | `/provider/active-task/task-101/extend-deadline` | `/tasks/:id/extension` |
| `/provider/active-task/:id/task-changes` | Scope Modification Request | `:id` | `/provider/active-task/task-101/task-changes` | `/tasks/:id/scope-change` |
| `/provider/active-task/:id/performer-issues` | Dispute Performer Submission | `:id` | `/provider/active-task/task-101/performer-issues` | `/disputes` |
| `/provider/agent-support` | Concierge Agent Assistance | None | `/provider/agent-support` | `/support/concierge` |
| `/provider/explore-talent` | Talent Search & Discovery | None | `/provider/explore-talent` | `/taskers/rankings` |
| `/provider/search` | Global Search & Filter | None (query params) | `/provider/search?q=design` | `/search` |
| `/provider/task-templates` | Pre-built Task Templates | None | `/provider/task-templates` | `taskTemplates.js` / API |
| `/provider/task-performers` | Directory with Booking CTA | None | `/provider/task-performers` | `/taskers` listing |
| `/provider/task-performer-profile/:name` | Performer Public Portfolio | `:name` (slug/id) | `/provider/task-performer-profile/priya-patel` | `/taskers/:id/public` |
| `/provider/saved-performers` | Bookmarked Talent | None | `/provider/saved-performers` | `/providers/me/saved-taskers` |
| `/provider/draft-tasks` | Unfinished Task Drafts | None | `/provider/draft-tasks` | `/tasks/drafts` |
| `/provider/task-history` | Historical Completed Archive | None | `/provider/task-history` | `/tasks/history` |
| `/provider/task-status` | Milestone Tracker | None | `/provider/task-status` | `/tasks/summary` |
| `/provider/task-activity` | Activity Feed & Logs | None | `/provider/task-activity` | `/activity-logs` |
| `/provider/boost-task` | Task Promotion & Urgency | None | `/provider/boost-task` | `/tasks/boost` |
| `/provider/chats` | Direct Messaging Console | None | `/provider/chats` | `/conversations`, WebSocket |
| `/provider/confirm-and-pay` | Escrow Deposit Review | None | `/provider/confirm-and-pay` | `/payments/initialize` |
| `/provider/payment-selection` | Gateway Selector (UPI/Card) | None | `/provider/payment-selection` | Payment Gateway SDK |
| `/provider/payment-success` | Escrow Receipt & Confirmation| None | `/provider/payment-success` | `/payments/verify` |
| `/provider/settings` | Settings (Profile/Wallet/Sec) | Query: `?tab=wallet` | `/provider/settings?tab=wallet` | `/users/me`, `/wallet` |
| `/provider/switch-to-performer` | Role Switcher Screen | None | `/provider/switch-to-performer` | `/users/onboard` |
| `/provider/delete-account` | Account Deactivation | None | `/provider/delete-account` | `/users/me/deletion-request` |
| `/provider/forgot-password` | Password Reset Request | None | `/provider/forgot-password` | Auth0 password reset |
| `/provider/check-email` | Check Email Instructions | None | `/provider/check-email` | None |
| `/provider/change-password` | Update Password Form | None | `/provider/change-password` | Auth0 / API |
| `/provider/two-factor-auth` | 2FA Configuration | None | `/provider/two-factor-auth` | 2FA management |

---

## 4. Performer Portal Routes (`/performer/*`)

All routes require `TASKER`, `PERFORMER`, or `ADMIN` role.

| Route Path | Module / Feature | Dynamic Parameters | Valid Sample URL | Backend Dependency |
| :--- | :--- | :--- | :--- | :--- |
| `/performer/dashboard` | Main Performer Workroom | None | `/performer/dashboard` | `/taskers/me`, `/tasks/feed` |
| `/performer/onboarding` | Performer Onboarding Wizard | None | `/performer/onboarding` | `/taskers/me/onboarding-status` |
| `/performer/newHomePage` | Modernized Discovery View | None | `/performer/newHomePage` | Dynamic feed |
| `/performer/growth` | Growth & Skill Benchmark | None | `/performer/growth` | `/performer/growth/progress` |
| `/performer/daily-quiz` | Daily Trivia & Skill Test | None | `/performer/daily-quiz` | `/performer/growth/daily-quiz` |
| `/performer/find-tasks` | Task Marketplace Browser | None | `/performer/find-tasks` | `/tasks/browse` |
| `/performer/all-tasks` | All Open Gigs Feed | None | `/performer/all-tasks` | `/tasks` feed |
| `/performer/task/:id` | Task Brief & Apply Page | `:id` (e.g. `task-101`) | `/performer/task/task-101` | `/tasks/:id`, `/tasks/:id/apply` |
| `/performer/active-tasks` | In-Progress Tasks List | None | `/performer/active-tasks` | `/tasks/in-progress` |
| `/performer/active-task/:id` | Submission Workroom | `:id` | `/performer/active-task/task-101` | `/tasks/:id/submit-work` |
| `/performer/completed-tasks` | Completed Gigs & Ratings | None | `/performer/completed-tasks` | `/tasks/completed` |
| `/performer/saved-tasks` | Bookmarked Tasks | None | `/performer/saved-tasks` | `/taskers/me/saved-tasks` |
| `/performer/applications` | Active Bids & Status | None | `/performer/applications` | `/taskers/me/applications` |
| `/performer/my-tasks` | All Assigned Tasks | None | `/performer/my-tasks` | `/taskers/me/tasks` |
| `/performer/search-loading` | Search In-Flight Screen | None | `/performer/search-loading` | Search loading simulator |
| `/performer/search-results` | Search Results Grid | None (query params) | `/performer/search-results?q=react` | `/search` |
| `/performer/client/:id` | Provider Public Reputation | `:id` (e.g. `provider-201`)| `/performer/client/provider-201` | `/providers/:id/public` |
| `/performer/task-accepted/:id` | Application Accepted Splash | `:id` | `/performer/task-accepted/task-101` | `/tasks/:id` |
| `/performer/invitation/:id` | Direct Client Invite Brief | `:id` | `/performer/invitation/inv-505` | `/invitations/:id` |
| `/performer/invitations` | Incoming Invitations Inbox | None | `/performer/invitations` | `/invitations` |
| `/performer/task-agreement/:id` | Legal Gig Terms Signing | `:id` | `/performer/task-agreement/task-101` | Contract terms API |
| `/performer/task-support/:id` | Performer Workroom Support | `:id` | `/performer/task-support/task-101` | Dispute / Support ticket |
| `/performer/agent-support` | OnIT Concierge Chat | None | `/performer/agent-support` | Concierge API |
| `/performer/leaderboard` | Top Earners & Reviewers | None | `/performer/leaderboard` | `/taskers/rankings` |
| `/performer/vouchers` | Promotional Vouchers | None | `/performer/vouchers` | `/promotions/vouchers` |
| `/performer/earnings` | Monthly Income & Metrics | None | `/performer/earnings` | `/wallet/earnings-summary` |
| `/performer/transactions` | Full Statement History | None | `/performer/transactions` | `/wallet/transactions` |
| `/performer/transactions/:id`| Transaction Receipt | `:id` (e.g. `tx-901`) | `/performer/transactions/tx-901` | `/wallet/transactions/:id` |
| `/performer/wallet` | Performer Balance & Bank | None | `/performer/wallet` | `/wallet` |
| `/performer/wallet/withdraw` | Withdrawal Request Screen | None | `/performer/wallet/withdraw` | `/payout-methods/withdrawals` |
| `/performer/wallet/transactions` | Wallet Passbook | None | `/performer/wallet/transactions` | `/wallet/transactions` |
| `/performer/withdraw` | Direct Payout Initiator | None | `/performer/withdraw` | `/payout-methods/withdrawals` |
| `/performer/banks` | Bank Account / UPI Linking | None | `/performer/banks` | `/taskers/me/bank-account` |
| `/performer/kyc` | Aadhaar / PAN / Selfie Upload| None | `/performer/kyc` | `/taskers/me/kyc/id`, `/selfie` |
| `/performer/ratings` | Client Reviews & Feedback | None | `/performer/ratings` | `/taskers/me/reviews` |
| `/performer/refer` | Referral Program & Link | None | `/performer/refer` | `/referrals/my-code` |
| `/performer/profile` | Public Profile Editor | None | `/performer/profile` | `/taskers/me` |
| `/performer/chats` | Chat Conversations | None | `/performer/chats` | `/conversations`, WebSocket |
| `/performer/account` | Account Hub Overview | None | `/performer/account` | `/users/me` |
| `/performer/settings` | Notification & Privacy Settings | None | `/performer/settings` | User settings API |
| `/performer/notifications` | Notifications Feed | None | `/performer/notifications` | `/notifications` |
| `/performer/switch-to-provider`| Switch to Hiring Mode | None | `/performer/switch-to-provider` | `/users/onboard` |
| `/performer/delete-account` | Account Deactivation | None | `/performer/delete-account` | `/users/me/deletion-request` |
| `/performer/change-password` | Password Update Form | None | `/performer/change-password` | Auth0 / API |
| `/performer/two-factor-auth` | 2-Factor Authentication | None | `/performer/two-factor-auth` | 2FA management |

---

## 5. Admin Portal Routes (`apps/client` & `apps/admin`)

| Route Path | Module / Feature | Applicable Role | Dynamic Parameters | Valid Sample URL | Backend Dependency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/performer-growth/daily-quizzes` | Client Admin: Quiz Manager | Admin | None | `/admin/performer-growth/daily-quizzes` | `/admin/performer-growth/daily-quizzes` |
| `/admin/daily-quizzes` | Client Admin: Quiz Alias | Admin | None | `/admin/daily-quizzes` | `/admin/performer-growth/daily-quizzes` |
| `[Admin App] /dashboard` | Back-Office Core Dashboard | Admin | None | `/dashboard` | Admin analytics & KPIs |
| `[Admin App] /users` | User Moderation Directory | Admin | None | `/users` | `/admin/users` |
| `[Admin App] /users/:userId` | User Detail & Audit Record | Admin | `:userId` (`usr-101`) | `/users/usr-101` | `/admin/users/:id` |
| `[Admin App] /tasks` | All Platform Tasks Directory | Admin | None | `/tasks` | `/admin/tasks` |
| `[Admin App] /tasks/:taskId` | Task Inspection & Action | Admin | `:taskId` (`task-101`) | `/tasks/task-101` | `/admin/tasks/:id` |
| `[Admin App] /task-approvals` | Pending Task Approval Queue | Admin | None | `/task-approvals` | `/admin/tasks/pending-approval` |
| `[Admin App] /service-pricing` | Service Pricing Rates Matrix | Admin | None | `/service-pricing` | `/admin/pricing-matrix` |
| `[Admin App] /finance` | Escrow, Payouts & Commission | Admin | None | `/finance` | `/admin/finance/overview` |
| `[Admin App] /verify-performers`| KYC Document Verification | Admin | None | `/verify-performers` | `/admin/kyc/pending` |
| `[Admin App] /performer-access` | Performer Whitelist/Tiers | Admin | None | `/performer-access` | `/admin/performers/access` |
| `[Admin App] /verify-work` | Submitted Work Review | Admin | None | `/verify-work` | `/admin/work/verification` |
| `[Admin App] /moderation` | Content & Chat Moderation | Admin | None | `/moderation` | `/admin/moderation` |
| `[Admin App] /disputes` | Dispute Resolution Tribunal | Admin | None | `/disputes` | `/admin/disputes` |
| `[Admin App] /support/tickets` | Support Tickets Desk | Admin | None | `/support/tickets` | `/admin/support/tickets` |
| `[Admin App] /support/live-chat`| Real-time Support Chat | Admin | None | `/support/live-chat` | `/admin/support/chats` |
| `[Admin App] /reports` | Exportable Audit Reports | Admin | None | `/reports` | `/admin/reports` |
| `[Admin App] /notifications` | Broadcast Notification Tool | Admin | None | `/notifications` | `/admin/notifications/broadcast` |
| `[Admin App] /careers` | Job Openings Manager | Admin | None | `/careers` | `/admin/careers` |
| `[Admin App] /careers/responses`| Job Candidate Submissions | Admin | None | `/careers/responses` | `/admin/careers/applications` |
| `[Admin App] /promotions/referrals` | Referral Program Config | Admin | None | `/promotions/referrals` | `/admin/promotions/referrals` |
| `[Admin App] /promotions/coupons` | Promo Code Engine | Admin | None | `/promotions/coupons` | `/admin/promotions/coupons` |
| `[Admin App] /promotions/promotional-vouchers` | Voucher Allocation | Admin | None | `/promotions/promotional-vouchers` | `/admin/vouchers` |
