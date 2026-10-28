# Performer Growth and Recommendations — Backend and Frontend Changes

## Overview

This document records the implementation currently available across the OnIT backend and web frontend for the performer growth experience and useful recommendations. The work is additive: the existing performer dashboard route and existing backend routes remain available.

## Branches and commits

### Backend

- Repository: `OnIT-backend`
- Branch: `feature/performer-growth-foundations`
- Main commit: `f6273b7 Build performer growth APIs and recommendation safeguards`
- Base recommendation implementation: `df273eb feat(recommendations): add performer useful recommendations and contextual advertising layer (PRD v1.0)`

### Frontend

- Repository: `onitindia1`
- Experimental home commit: `b36a5a5 Add experimental performer growth home`
- Experimental route: `/performer/newHomePage`
- Existing `/performer/dashboard` remains the default route.

## Backend: performer growth foundations

The `performer-growth` NestJS module adds state-aware growth data, learning resources, quizzes, course evidence, capacity management, and trust-score summaries.

### Performer APIs

All performer endpoints are under `/performer/growth` and require an authenticated TASKER/performer.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/performer/growth/progress` | Returns the performer’s growth plan, milestones, completion state, points, and current stage. |
| GET | `/performer/growth/trust-score` | Returns trust-score summary and quality/reliability signals. |
| GET | `/performer/growth/task-preview` | Shows task examples or earning opportunities without changing task eligibility. |
| GET | `/performer/growth/earnings-benchmark` | Returns category-level earning benchmarks. |
| GET | `/performer/growth/resources` | Lists active learning resources and quizzes. |
| POST | `/performer/growth/resources/:resourceId/quiz-attempts` | Submits quiz answers and records the result/reward. |
| POST | `/performer/growth/resources/:resourceId/course-submissions` | Submits course completion evidence for review. |

### Admin growth APIs

All admin growth endpoints are under `/admin/performer-growth` and require ADMIN access.

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/admin/performer-growth/capacities` | List or configure category active-slot capacity. |
| GET/POST | `/admin/performer-growth/plans` | List or create category growth plans. |
| PATCH | `/admin/performer-growth/plans/:planId` | Update a growth plan. |
| POST | `/admin/performer-growth/plans/:planId/milestones` | Add a milestone to a plan. |
| PATCH | `/admin/performer-growth/milestones/:milestoneId` | Update milestone copy, order, requirement, quiz threshold, or reward. |
| POST | `/admin/performer-growth/milestones/:milestoneId/complete` | Manually complete a milestone with performer ID and evidence note. |
| GET/POST | `/admin/performer-growth/resources` | List or create courses, quizzes, and other learning resources. |
| PATCH | `/admin/performer-growth/resources/:resourceId` | Update a learning resource. |
| GET | `/admin/performer-growth/course-submissions` | List course evidence submissions. |
| POST | `/admin/performer-growth/course-submissions/:submissionId/review` | Approve or reject a submission with an optional note. |

### Growth data and rules

- Category capacity supports the “top slots full / waitlisted” state.
- Growth plans contain configurable intro and earning messages.
- Milestones can be profile, KYC, learning, quiz, course, or manual actions.
- Milestones support ordering, required flags, reward points, action URLs, and minimum quiz scores.
- Learning resources support content URLs, quiz questions, passing scores, daily attempt limits, and active/inactive state.
- Quiz attempts and course submissions are persisted and can drive milestone completion.
- Trust score is exposed as a summary; the design intent is that quality, deadline performance, and reliability grow it after real work.
- Growth actions do not grant or remove task eligibility by themselves; slot/capacity and approval rules remain controlled by the existing performer access flow.

## Backend: sponsored recommendations

The `recommendations` module adds controlled sponsored or OnIT-owned content delivery. Recommendation visibility must never affect task matching, approval, or eligibility.

### Performer recommendation APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/performer/recommendations?limit=1..3` | Returns up to three eligible recommendations for the authenticated performer. |
| POST | `/api/performer/recommendations/:id/impression` | Records a card impression. Request IDs make repeated deliveries idempotent. |
| POST | `/api/performer/recommendations/:id/click` | Records a click and destination tracking data. |

Selection applies the following safeguards:

1. Only approved, active, date-valid campaigns are considered.
2. Audience/category/skill rules are matched against the performer.
3. Relevance and priority are calculated before delivery.
4. Frequency caps prevent overexposure to one performer.
5. Impression and click limits are enforced.
6. Equal-priority campaigns can rotate.
7. OnIT-owned fallback resources can be returned when no paid campaign matches.

### Admin recommendation APIs

All admin recommendation endpoints are under `/api/admin/recommendations` and require ADMIN access.

| Method | Endpoint | Purpose |
|---|---|---|
| POST/GET | `/api/admin/recommendations/advertisers` | Create and list advertisers. |
| POST | `/api/admin/recommendations` | Create a campaign. |
| GET | `/api/admin/recommendations` | Search/filter campaigns by status, category, and text. |
| GET | `/api/admin/recommendations/:id` | Read campaign details. |
| PATCH | `/api/admin/recommendations/:id` | Edit campaign configuration. |
| POST | `/api/admin/recommendations/:id/approve` | Approve a draft campaign. |
| POST | `/api/admin/recommendations/:id/pause` | Stop delivery immediately. |
| POST | `/api/admin/recommendations/:id/activate` | Reactivate a campaign. |
| GET | `/api/admin/recommendations/:id/analytics` | Return impressions, clicks, CTR, unique reach, and spend metrics. |

### Scheduler

The recommendation scheduler runs periodically and:

- Activates approved campaigns when `startAt` is reached.
- Expires campaigns after `endAt`.
- Expires campaigns when impression or delivery limits are reached.

### Recommendation database models

The Prisma schema adds the following tables:

- `advertisers`
- `recommendation_campaigns`
- `recommendation_impressions`
- `recommendation_clicks`
- `performer_recommendation_state`
- `campaign_events`

Campaigns include advertiser, title/description, creative and destination URLs, category, skill tags, audience rules, priority, status, schedule, frequency caps, impression/click limits, budget, pricing model, tracking configuration, and disclosure text. Impression and click rows include performer, campaign, placement, request ID, timestamps, and metadata, with uniqueness constraints for duplicate prevention.

## Frontend: experimental performer home

The new page is intentionally isolated from the current experience:

- New component: `apps/client/src/components/Performer/pages/PerformerNewHomePage.jsx`
- New route: `/performer/newHomePage`
- Existing index route still redirects to `/performer/dashboard`.
- No existing backend route was replaced.

### Page behavior

The page composes existing performer APIs and optional growth/recommendation APIs. Optional sections fail soft so a missing growth/recommendation deployment does not prevent the rest of the page from rendering.

It includes:

- Personalized greeting using the performer profile.
- State-aware journey banner for setup, KYC/review, waitlist, rejection/suspension, or approved states.
- Active/assigned task cards and task previews.
- Applications and offers where available.
- Improvement-plan next step with a clear action.
- Earnings and wallet summary.
- Trust-score card.
- Daily quiz/learning resource card.
- Sponsored recommendation card with impression and click tracking.
- Existing categories and performer leaderboard content.
- Responsive desktop layout with a right-side rail and a mobile-first single-column layout.
- Empty, loading, and error fallbacks for API-backed sections.

### Frontend API additions

The performer API service adds wrappers for:

- `getGrowthProgress`
- `getGrowthTrustScore`
- `getGrowthResources`
- `getPerformerRecommendations`
- `recordRecommendationImpression`
- `recordRecommendationClick`

These wrappers are additive and do not alter the existing task, profile, wallet, or onboarding function signatures.

## Related frontend fixes already present

The frontend branch also contains adjacent fixes that support the performer workflow:

- Task notifications now route to the specific task using notification metadata (`e74c0f6`).
- Performer/provider avatars and task chat ordering were corrected (`d5caa01`).
- Provider “Need help” opens the support conversation from chat (`223f168`).

## Compatibility and rollout

- Existing users continue to land on `/performer/dashboard`.
- The new page can be deployed and tested independently at `/performer/newHomePage`.
- The backend additions are separate modules/controllers; existing routes were not intentionally changed for this feature.
- Admin controls are available for growth plans, capacity, learning content, advertiser campaigns, campaign status, and analytics.
- Production Auth0 configuration is independent of this feature. Local testing requires the existing production-compatible Auth0 environment values, but those local values are not part of the application commit.

## Verification completed

- Frontend `npm run build` passed.
- `git diff --check` passed.
- The experimental route responds from the Vite dev server.
- No `.env` or local runtime configuration was committed.

## Remaining work

The following are product/integration follow-ups rather than completed implementation:

- Add admin UI screens for growth plans, capacity, resources, course reviews, advertisers, campaigns, and analytics.
- Connect quiz/course actions to the final reward and seat-allocation policy.
- Confirm production API deployment and migrations are applied before enabling the new sections for all performers.
- Add automated end-to-end coverage for each performer stage and recommendation frequency caps.
- Decide the rollout mechanism (feature flag, cohort, or route promotion) after observing the experimental page.
