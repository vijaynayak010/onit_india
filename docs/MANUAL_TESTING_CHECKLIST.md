# OnIT India Platform — Manual Testing Checklist

**Document Version:** 1.0.0  
**Testing Methodology:** 100% Manual Human Verification Only  
**Automated Testing Notice:** No automated tests (Playwright, Cypress, Vitest, Jest, etc.) are executed for this audit. All statuses must be manually reviewed and toggled by the human tester.

---

## Instructions for Tester

For each page in this checklist, verify:
1. **Render & Layout:** Page loads correctly with expected typography, styling, spacing, and brand colors.
2. **Navigation & Chrome:** Header, footer, breadcrumbs, sidebar, and back buttons function smoothly.
3. **Interactive Elements:** Buttons, tabs, dropdowns, tooltips, modals, and accordions respond to clicks.
4. **Forms & Input Validation:** Inputs accept text, trigger validation messages on invalid format, and submit in mock mode.
5. **Data Feeds & Tables:** Filters, search bars, category tags, and pagination operate without console exceptions.
6. **State Transitions:** Simulates loading spinners, empty states, and error alerts gracefully.
7. **Responsiveness:** Test on Desktop (1440px), Tablet (768px), and Mobile (375px).

### Permitted Statuses
- `NOT TESTED` (Default)
- `PASS` (Verified working as intended)
- `FAIL` (Defect or broken interaction observed)
- `BLOCKED` (Cannot proceed due to missing dependency or blocking error)

---

## 1. Public Marketing & Content Pages

| # | Page Name | Route Path | Role | Manual Status | Notes / Issues |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1.1 | Homepage / Landing Page | `/` | Public | `NOT TESTED` | |
| 1.2 | About Us | `/about` | Public | `NOT TESTED` | |
| 1.3 | What is OnIT India | `/what-is-onit-india` | Public | `NOT TESTED` | |
| 1.4 | How It Works | `/how-it-works` | Public | `NOT TESTED` | |
| 1.5 | Execution Infrastructure | `/execution-infrastructure` | Public | `NOT TESTED` | |
| 1.6 | Why Choose Us | `/why-choose-us` | Public | `NOT TESTED` | |
| 1.7 | For Providers (Audience) | `/for-providers` | Public | `NOT TESTED` | |
| 1.8 | For Performers (Audience) | `/for-performers` | Public | `NOT TESTED` | |
| 1.9 | Freelancing in India | `/freelancing` | Public | `NOT TESTED` | |
| 1.10 | Public Pricing Calculator | `/pricing` | Public | `NOT TESTED` | |
| 1.11 | Contact Us | `/contact` | Public | `NOT TESTED` | |
| 1.12 | Contact Thank You | `/contact/thank-you` | Public | `NOT TESTED` | |
| 1.13 | Careers Page | `/careers` | Public | `NOT TESTED` | |
| 1.14 | Careers Thank You | `/careers/thank-you` | Public | `NOT TESTED` | |
| 1.15 | Partner With Us | `/partner-with-us` | Public | `NOT TESTED` | |
| 1.16 | Campus Ambassador Program | `/campus-detail` | Public | `NOT TESTED` | |
| 1.17 | Task Performers Showcase | `/task-performers` | Public | `NOT TESTED` | |
| 1.18 | Talent Directory | `/performers-directory` | Public | `NOT TESTED` | |
| 1.19 | Task Categories Directory | `/tasks` | Public | `NOT TESTED` | |
| 1.20 | Task Category: Business | `/tasks/business` | Public | `NOT TESTED` | |
| 1.21 | Task Category: Content | `/tasks/content` | Public | `NOT TESTED` | |
| 1.22 | Task Category: Tech | `/tasks/tech` | Public | `NOT TESTED` | |
| 1.23 | Task Category: Admin | `/tasks/admin` | Public | `NOT TESTED` | |
| 1.24 | Task Category: Creative | `/tasks/creative` | Public | `NOT TESTED` | |
| 1.25 | Task Category: Events | `/tasks/events` | Public | `NOT TESTED` | |
| 1.26 | Domain: Business Research | `/domains/business-operations-research` | Public | `NOT TESTED` | |
| 1.27 | Domain: Content & Marketing | `/domains/content-design-marketing` | Public | `NOT TESTED` | |
| 1.28 | Domain: Tech & Data | `/domains/tech-data-admin` | Public | `NOT TESTED` | |
| 1.29 | Domain: Academic Support | `/domains/academic-knowledge-support` | Public | `NOT TESTED` | |
| 1.30 | Domain: On-Ground Assistance | `/domains/on-ground-local-assistance` | Public | `NOT TESTED` | |
| 1.31 | Sub-Domain: Market Research | `/domains/business-operations-research/market-research` | Public | `NOT TESTED` | |
| 1.32 | Use Cases Index | `/use-cases` | Public | `NOT TESTED` | |
| 1.33 | Use Case: For Startups | `/for-startups` | Public | `NOT TESTED` | |
| 1.34 | Use Case: For Creators | `/for-creators` | Public | `NOT TESTED` | |
| 1.35 | Use Case: For Businesses | `/for-businesses` | Public | `NOT TESTED` | |
| 1.36 | Use Case: For Marketers | `/for-marketers` | Public | `NOT TESTED` | |
| 1.37 | Use Case: For Agencies | `/for-agencies` | Public | `NOT TESTED` | |
| 1.38 | Use Case: For Enterprises | `/for-enterprises` | Public | `NOT TESTED` | |
| 1.39 | Use Case: For Researchers | `/for-researchers` | Public | `NOT TESTED` | |
| 1.40 | Use Case: For E-Commerce | `/for-ecommerce` | Public | `NOT TESTED` | |
| 1.41 | Services Index | `/services` | Public | `NOT TESTED` | |
| 1.42 | Service: Retail Audit | `/services/retail-audit-services` | Public | `NOT TESTED` | |
| 1.43 | Service: Field Data Collection | `/services/field-data-collection-services` | Public | `NOT TESTED` | |
| 1.44 | Service: Content Marketing | `/services/content-marketing-task-execution` | Public | `NOT TESTED` | |
| 1.45 | Service: Market Research | `/services/market-research-assistance` | Public | `NOT TESTED` | |
| 1.46 | Service: Social Media Design | `/services/social-media-content-creation-services` | Public | `NOT TESTED` | |
| 1.47 | Service: Blog Writing | `/services/blog-writing-services-for-startups` | Public | `NOT TESTED` | |
| 1.48 | Service: SEO Keyword Research | `/services/seo-keyword-research-services` | Public | `NOT TESTED` | |
| 1.49 | Service: Instagram Post Design | `/services/instagram-post-design-services` | Public | `NOT TESTED` | |
| 1.50 | Service: Short Video Editing | `/services/short-form-video-editing-services` | Public | `NOT TESTED` | |
| 1.51 | Community Index | `/community` | Public | `NOT TESTED` | |
| 1.52 | Success Stories | `/community/success-stories` | Public | `NOT TESTED` | |
| 1.53 | Top Performers Leaderboard | `/community/top-performers` | Public | `NOT TESTED` | |
| 1.54 | Completed Tasks Examples | `/community/completed-tasks-examples` | Public | `NOT TESTED` | |
| 1.55 | Help Center Index | `/help` | Public | `NOT TESTED` | |
| 1.56 | Help: Getting Started Guide | `/help/getting-started` | Public | `NOT TESTED` | |
| 1.57 | Help: Posting First Task | `/help/posting-your-first-task` | Public | `NOT TESTED` | |
| 1.58 | Help: Completing First Task | `/help/completing-your-first-task` | Public | `NOT TESTED` | |
| 1.59 | Frequently Asked Questions | `/faqs` | Public | `NOT TESTED` | |
| 1.60 | Trust & Safety Standards | `/trust-safety` | Public | `NOT TESTED` | |
| 1.61 | Privacy Policy | `/privacy-policy` | Public | `NOT TESTED` | |
| 1.62 | Terms and Conditions | `/terms-and-conditions` | Public | `NOT TESTED` | |
| 1.63 | Refund Policy | `/refund-policy` | Public | `NOT TESTED` | |
| 1.64 | Cookie Policy | `/cookie-policy` | Public | `NOT TESTED` | |
| 1.65 | Task Guidelines | `/task-guidelines` | Public | `NOT TESTED` | |
| 1.66 | Dispute Resolution Policy | `/dispute-resolution-policy` | Public | `NOT TESTED` | |
| 1.67 | Payment & Payout Policy | `/payment-payout-policy` | Public | `NOT TESTED` | |
| 1.68 | Prohibited Tasks Policy | `/prohibited-tasks-policy` | Public | `NOT TESTED` | |
| 1.69 | Proof of Completion Policy | `/task-completion-proof-policy` | Public | `NOT TESTED` | |
| 1.70 | Performer Verification Guide | `/performer-verification-onboarding` | Public | `NOT TESTED` | |
| 1.71 | Dynamic Policy Reader | `/policies/community-safety` | Public | `NOT TESTED` | |
| 1.72 | Blog Articles Feed | `/blog` | Public | `NOT TESTED` | |
| 1.73 | Blog Article Reader (#18) | `/blog/18` | Public | `NOT TESTED` | |
| 1.74 | Public Card Share View | `/s/TASK-10293` | Public | `NOT TESTED` | |
| 1.75 | Public Invoice Authenticator | `/verify-invoice?inv=ONIT-2026-9921` | Public | `NOT TESTED` | |

---

## 2. Authentication & Onboarding Screens

| # | Page Name | Route Path | Role | Manual Status | Notes / Issues |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2.1 | Unified Login / Auth Page | `/auth` | Guest | `NOT TESTED` | |
| 2.2 | Sign Up Mode | `/signup` | Guest | `NOT TESTED` | |
| 2.3 | Register Mode | `/register` | Guest | `NOT TESTED` | |
| 2.4 | Provider Auth Gateway | `/providerlogin` | Guest | `NOT TESTED` | |
| 2.5 | Performer Auth Gateway | `/performerlogin` | Guest | `NOT TESTED` | |
| 2.6 | Provider Welcome Screen | `/provider/welcome` | Provider | `NOT TESTED` | |
| 2.7 | Provider Account Restore | `/provider/restore-account` | Provider | `NOT TESTED` | |
| 2.8 | Performer Account Restore | `/performer/restore-account` | Performer | `NOT TESTED` | |
| 2.9 | Provider Onboarding Wizard | `/provider/onboarding` | Provider | `NOT TESTED` | |
| 2.10 | Performer Onboarding Wizard | `/performer/onboarding` | Performer | `NOT TESTED` | |
| 2.11 | Legacy Admin Login | `/admin-login` | Admin | `NOT TESTED` | |
| 2.12 | Legacy Blog Dashboard | `/admin-dashboard` | Admin | `NOT TESTED` | |
| 2.13 | Legacy Blog Creator | `/add-post` | Admin | `NOT TESTED` | |
| 2.14 | Developer Access Unlock | `/dev/access` | Public | `NOT TESTED` | |

---

## 3. Provider Portal Pages (`/provider/*`)

| # | Page Name | Route Path | Role | Manual Status | Notes / Issues |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 3.1 | Provider Dashboard | `/provider/dashboard` | Provider | `NOT TESTED` | |
| 3.2 | Post Task Selection Mode | `/provider/post-task-selection` | Provider | `NOT TESTED` | |
| 3.3 | Post Task Manual Wizard | `/provider/post-task-manual` | Provider | `NOT TESTED` | |
| 3.4 | Post Task AI Generator | `/provider/post-task-ai` | Provider | `NOT TESTED` | |
| 3.5 | Post Task Scope & Budget | `/provider/post-task-details` | Provider | `NOT TESTED` | |
| 3.6 | Post Task Talent Matches | `/provider/post-task-results` | Provider | `NOT TESTED` | |
| 3.7 | My Tasks Management | `/provider/my-tasks` | Provider | `NOT TESTED` | |
| 3.8 | Single Task Details | `/provider/task-details` | Provider | `NOT TESTED` | |
| 3.9 | Task Applicants Review | `/provider/task-applicants` | Provider | `NOT TESTED` | |
| 3.10 | Active Task Workroom | `/provider/active-task/task-101` | Provider | `NOT TESTED` | |
| 3.11 | Task Support: Need Help | `/provider/active-task/task-101/need-help` | Provider | `NOT TESTED` | |
| 3.12 | Task Support: Extend Deadline | `/provider/active-task/task-101/extend-deadline` | Provider | `NOT TESTED` | |
| 3.13 | Task Support: Task Changes | `/provider/active-task/task-101/task-changes` | Provider | `NOT TESTED` | |
| 3.14 | Task Support: Performer Issues | `/provider/active-task/task-101/performer-issues` | Provider | `NOT TESTED` | |
| 3.15 | Concierge Agent Support | `/provider/agent-support` | Provider | `NOT TESTED` | |
| 3.16 | Explore Talent & Search | `/provider/explore-talent` | Provider | `NOT TESTED` | |
| 3.17 | Filtered Talent Search | `/provider/search?q=design` | Provider | `NOT TESTED` | |
| 3.18 | Task Templates Directory | `/provider/task-templates` | Provider | `NOT TESTED` | |
| 3.19 | Talent Directory (Provider) | `/provider/task-performers` | Provider | `NOT TESTED` | |
| 3.20 | Performer Portfolio View | `/provider/task-performer-profile/rahul-sharma` | Provider | `NOT TESTED` | |
| 3.21 | Saved Performers Bookmarks | `/provider/saved-performers` | Provider | `NOT TESTED` | |
| 3.22 | Draft Tasks Drawer | `/provider/draft-tasks` | Provider | `NOT TESTED` | |
| 3.23 | Historical Completed Archive| `/provider/task-history` | Provider | `NOT TESTED` | |
| 3.24 | Milestone & Status Tracker | `/provider/task-status` | Provider | `NOT TESTED` | |
| 3.25 | Activity Feed & Audit Log | `/provider/task-activity` | Provider | `NOT TESTED` | |
| 3.26 | Boost & Urgency Accelerator | `/provider/boost-task` | Provider | `NOT TESTED` | |
| 3.27 | Provider Messaging Center | `/provider/chats` | Provider | `NOT TESTED` | |
| 3.28 | Confirm & Deposit Escrow | `/provider/confirm-and-pay` | Provider | `NOT TESTED` | |
| 3.29 | Payment Method Selection | `/provider/payment-selection` | Provider | `NOT TESTED` | |
| 3.30 | Payment Success Receipt | `/provider/payment-success` | Provider | `NOT TESTED` | |
| 3.31 | Provider Settings: Profile | `/provider/settings?tab=profile` | Provider | `NOT TESTED` | |
| 3.32 | Provider Settings: Wallet | `/provider/settings?tab=wallet` | Provider | `NOT TESTED` | |
| 3.33 | Provider Settings: Referrals | `/provider/settings?tab=refer` | Provider | `NOT TESTED` | |
| 3.34 | Switch to Performer Role | `/provider/switch-to-performer` | Provider | `NOT TESTED` | |
| 3.35 | Delete Provider Account | `/provider/delete-account` | Provider | `NOT TESTED` | |
| 3.36 | Forgot Password Form | `/provider/forgot-password` | Provider | `NOT TESTED` | |
| 3.37 | Check Email Confirmation | `/provider/check-email` | Provider | `NOT TESTED` | |
| 3.38 | Change Password Form | `/provider/change-password` | Provider | `NOT TESTED` | |
| 3.39 | Two-Factor Auth Settings | `/provider/two-factor-auth` | Provider | `NOT TESTED` | |

---

## 4. Performer Portal Pages (`/performer/*`)

| # | Page Name | Route Path | Role | Manual Status | Notes / Issues |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 4.1 | Performer Workroom Dashboard| `/performer/dashboard` | Performer | `NOT TESTED` | |
| 4.2 | Performer Modern Home View | `/performer/newHomePage` | Performer | `NOT TESTED` | |
| 4.3 | Growth Academy & Metrics | `/performer/growth` | Performer | `NOT TESTED` | |
| 4.4 | Daily Skill Quiz & Trivia | `/performer/daily-quiz` | Performer | `NOT TESTED` | |
| 4.5 | Browse Open Gigs | `/performer/find-tasks` | Performer | `NOT TESTED` | |
| 4.6 | All Gigs Feed | `/performer/all-tasks` | Performer | `NOT TESTED` | |
| 4.7 | Task Brief & Bid Modal | `/performer/task/task-101` | Performer | `NOT TESTED` | |
| 4.8 | Active In-Progress Gigs | `/performer/active-tasks` | Performer | `NOT TESTED` | |
| 4.9 | Deliverable Workroom | `/performer/active-task/task-101` | Performer | `NOT TESTED` | |
| 4.10 | Completed Tasks & Reviews | `/performer/completed-tasks` | Performer | `NOT TESTED` | |
| 4.11 | Bookmarked Gigs | `/performer/saved-tasks` | Performer | `NOT TESTED` | |
| 4.12 | My Bids & Proposals | `/performer/applications` | Performer | `NOT TESTED` | |
| 4.13 | My Assigned Tasks | `/performer/my-tasks` | Performer | `NOT TESTED` | |
| 4.14 | Search Loading Simulation | `/performer/search-loading` | Performer | `NOT TESTED` | |
| 4.15 | Search Results Grid | `/performer/search-results?q=react` | Performer | `NOT TESTED` | |
| 4.16 | Client Profile & Trust Score| `/performer/client/provider-201` | Performer | `NOT TESTED` | |
| 4.17 | Proposal Accepted Modal | `/performer/task-accepted/task-101` | Performer | `NOT TESTED` | |
| 4.18 | Direct Client Invitation | `/performer/invitation/inv-505` | Performer | `NOT TESTED` | |
| 4.19 | Invitations Inbox | `/performer/invitations` | Performer | `NOT TESTED` | |
| 4.20 | Legal Gig Agreement | `/performer/task-agreement/task-101` | Performer | `NOT TESTED` | |
| 4.21 | Task Dispute & Support | `/performer/task-support/task-101` | Performer | `NOT TESTED` | |
| 4.22 | Performer Concierge Support | `/performer/agent-support` | Performer | `NOT TESTED` | |
| 4.23 | Performer Leaderboard | `/performer/leaderboard` | Performer | `NOT TESTED` | |
| 4.24 | Reward Vouchers & Coupons | `/performer/vouchers` | Performer | `NOT TESTED` | |
| 4.25 | Monthly Income Analytics | `/performer/earnings` | Performer | `NOT TESTED` | |
| 4.26 | Payout Statement | `/performer/transactions` | Performer | `NOT TESTED` | |
| 4.27 | Transaction Receipt | `/performer/transactions/tx-901` | Performer | `NOT TESTED` | |
| 4.28 | Performer Wallet | `/performer/wallet` | Performer | `NOT TESTED` | |
| 4.29 | Wallet Withdrawal Form | `/performer/wallet/withdraw` | Performer | `NOT TESTED` | |
| 4.30 | Wallet Passbook Log | `/performer/wallet/transactions` | Performer | `NOT TESTED` | |
| 4.31 | Direct Bank Payout Initiator| `/performer/withdraw` | Performer | `NOT TESTED` | |
| 4.32 | Bank Account & UPI Setup | `/performer/banks` | Performer | `NOT TESTED` | |
| 4.33 | KYC Verification (ID/Selfie)| `/performer/kyc` | Performer | `NOT TESTED` | |
| 4.34 | Ratings, Badges & Reviews | `/performer/ratings` | Performer | `NOT TESTED` | |
| 4.35 | Referral Program Hub | `/performer/refer` | Performer | `NOT TESTED` | |
| 4.36 | Public Portfolio Profile | `/performer/profile` | Performer | `NOT TESTED` | |
| 4.37 | Performer Chat Console | `/performer/chats` | Performer | `NOT TESTED` | |
| 4.38 | Account Management Hub | `/performer/account` | Performer | `NOT TESTED` | |
| 4.39 | Preferences & Security | `/performer/settings` | Performer | `NOT TESTED` | |
| 4.40 | Notifications Inbox | `/performer/notifications` | Performer | `NOT TESTED` | |
| 4.41 | Switch to Hiring Mode | `/performer/switch-to-provider` | Performer | `NOT TESTED` | |
| 4.42 | Delete Performer Account | `/performer/delete-account` | Performer | `NOT TESTED` | |
| 4.43 | Change Password | `/performer/change-password` | Performer | `NOT TESTED` | |
| 4.44 | 2FA Configuration | `/performer/two-factor-auth` | Performer | `NOT TESTED` | |

---

## 5. Admin Portal Pages (`/admin/*`)

| # | Page Name | Route Path | Role | Manual Status | Notes / Issues |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 5.1 | Client Admin: Quiz Manager | `/admin/performer-growth/daily-quizzes` | Admin | `NOT TESTED` | |
| 5.2 | Client Admin: Quiz Alias | `/admin/daily-quizzes` | Admin | `NOT TESTED` | |
| 5.3 | Admin Core Dashboard | `[Admin App] /dashboard` | Admin | `NOT TESTED` | |
| 5.4 | Global Search | `[Admin App] /search` | Admin | `NOT TESTED` | |
| 5.5 | User Management | `[Admin App] /users` | Admin | `NOT TESTED` | |
| 5.6 | User Detail Profile | `[Admin App] /users/usr-101` | Admin | `NOT TESTED` | |
| 5.7 | Task Moderation Directory | `[Admin App] /tasks` | Admin | `NOT TESTED` | |
| 5.8 | Task Detail Inspection | `[Admin App] /tasks/task-101` | Admin | `NOT TESTED` | |
| 5.9 | Task Approval Queue | `[Admin App] /task-approvals` | Admin | `NOT TESTED` | |
| 5.10 | Service Pricing Matrix | `[Admin App] /service-pricing` | Admin | `NOT TESTED` | |
| 5.11 | Finance & Escrow Overview | `[Admin App] /finance` | Admin | `NOT TESTED` | |
| 5.12 | KYC Performer Approvals | `[Admin App] /verify-performers` | Admin | `NOT TESTED` | |
| 5.13 | Performer Access Tiers | `[Admin App] /performer-access` | Admin | `NOT TESTED` | |
| 5.14 | Performer Growth & Badges | `[Admin App] /performer-growth` | Admin | `NOT TESTED` | |
| 5.15 | Work Proof Review Desk | `[Admin App] /verify-work` | Admin | `NOT TESTED` | |
| 5.16 | Content & Chat Moderation | `[Admin App] /moderation` | Admin | `NOT TESTED` | |
| 5.17 | Dispute Arbitration Tribunal | `[Admin App] /disputes` | Admin | `NOT TESTED` | |
| 5.18 | Support Tickets Management | `[Admin App] /support/tickets` | Admin | `NOT TESTED` | |
| 5.19 | Live Chat Console | `[Admin App] /support/live-chat` | Admin | `NOT TESTED` | |
| 5.20 | System Reports & Logs | `[Admin App] /reports` | Admin | `NOT TESTED` | |
| 5.21 | System Broadcast Alerts | `[Admin App] /notifications` | Admin | `NOT TESTED` | |
| 5.22 | Dynamic Homepage CMS | `[Admin App] /home-dynamic` | Admin | `NOT TESTED` | |
| 5.23 | Policy & Content Pages CMS | `[Admin App] /content-pages` | Admin | `NOT TESTED` | |
| 5.24 | Internal Admin Roles | `[Admin App] /settings/access` | Admin | `NOT TESTED` | |
| 5.25 | Careers Job Postings | `[Admin App] /careers` | Admin | `NOT TESTED` | |
| 5.26 | Job Candidate Submissions | `[Admin App] /careers/responses` | Admin | `NOT TESTED` | |
| 5.27 | User Account Deletions | `[Admin App] /deletion` | Admin | `NOT TESTED` | |
| 5.28 | Referral Program Rules | `[Admin App] /promotions/referrals` | Admin | `NOT TESTED` | |
| 5.29 | Promo Codes & Discounts | `[Admin App] /promotions/coupons` | Admin | `NOT TESTED` | |
| 5.30 | Promotional Vouchers | `[Admin App] /promotions/promotional-vouchers` | Admin | `NOT TESTED` | |
