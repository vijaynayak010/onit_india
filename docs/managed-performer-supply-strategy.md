# Managed Performer Supply Strategy

## Executive Summary

OnIT should move from open performer onboarding to a managed, quality-controlled performer marketplace. Instead of allowing unlimited performers into every category, the platform should approve a limited number of verified performers per category, maintain a waitlist, and show providers only the best-matched performers for each task.

This approach improves trust, raises task completion quality, gives approved performers a meaningful chance to earn, and reduces decision fatigue for providers.

## Current Risk

If OnIT allows unlimited performer onboarding before provider demand is large enough, the marketplace can develop three problems:

1. Too many performers compete for too few tasks.
2. Providers see too many options and struggle to choose.
3. Quality becomes inconsistent because anyone can enter the supply pool.

This creates a weak marketplace loop:

```text
Low performer quality or too many options
-> Provider confusion or poor hiring decision
-> Lower task success rate
-> Lower provider trust
-> Fewer repeat tasks
-> Performers receive less work
```

The better model is controlled supply with clear quality gates.

## Strategic Recommendation

OnIT should introduce a performer approval system with category-level supply limits.

The platform should:

- Ask performers to submit proof of capability before approval.
- Approve performers category by category.
- Limit active performers in each category based on demand.
- Keep extra applicants on a waitlist.
- Show providers a small number of highly matched performers instead of a large generic list.

The key positioning should be:

> OnIT connects providers with verified, pre-screened performers who are matched to the task.

This is stronger than an open marketplace where providers have to manually filter quality.

## Performer Admission Model

Each performer should submit a structured application before becoming visible to providers.

Required information:

- Basic profile information.
- Skills and preferred categories.
- Two proof items, such as:
  - Portfolio links.
  - Personal projects.
  - Certificates.
  - Work samples.
  - GitHub, Behance, Dribbble, LinkedIn, Google Drive, or PDF links.
- Expected price range.
- Availability.
- Short work bio.

Admin should review the application and decide whether the performer is approved, rejected, or waitlisted.

## Category-Level Approval

Approval should not be global only. A performer may be strong in one category but not suitable for another.

Example:

```text
Performer: Rohit
Tech, Data and Admin: Approved
Content, Design and Marketing: Waitlisted
Academic Support: Rejected
```

This gives OnIT finer control over quality and supply.

## Recommended Performer States

The performer lifecycle should be explicit:

```text
DRAFT_PROFILE
-> SUBMITTED_FOR_REVIEW
-> APPROVED
-> WAITLISTED
-> REJECTED
-> SUSPENDED
```

Category application lifecycle:

```text
PENDING_REVIEW
-> APPROVED
-> WAITLISTED
-> REJECTED
```

Only approved performers in an approved category should appear in provider matching results.

## Category Supply Limits

A fixed limit like 500 performers per category is directionally useful, but the limit should be demand-driven.

Recommended starting point:

- Large categories: 100-150 approved performers.
- Specialized categories: 25-75 approved performers.
- On-ground categories: city-level limits instead of national limits.

The limit should expand when there is enough provider demand.

Supply expansion triggers:

- Approved performers in a category are receiving enough tasks.
- Provider demand is growing.
- Average response time is worsening.
- Completion rate remains healthy.
- Top performers are becoming overloaded.

Supply should not expand just because more people apply.

## Why Not Start With 500 Immediately?

Five hundred performers per category may be too much in the early stage unless task demand is already high.

If a category has 500 performers but only 50 tasks per month:

- Most performers will get no work.
- Performer motivation will drop.
- Response quality may decline.
- Providers may still see inconsistent quality.

A smaller verified pool creates a stronger early marketplace because every approved performer has a real chance to earn.

## Provider Experience

Providers should not be shown hundreds of performers.

Recommended provider experience:

- Show top 3 recommended performers first.
- Allow “View more” with a controlled list of 10-15 performers.
- Explain why each performer matched.

Example matching reasons:

- Skill match.
- Category match.
- Budget fit.
- High completion rate.
- Fast response time.
- Similar past work.
- Available for the deadline.

This makes the platform feel curated and intelligent.

## Matching System

The matching engine should rank performers using both profile data and platform behavior.

Important ranking signals:

- Category approval status.
- Skill match.
- Portfolio relevance.
- Rating.
- Task completion rate.
- Response speed.
- Current workload.
- Budget compatibility.
- Location, if the task is on-ground.
- Past similar task success.
- Admin quality score.

The provider should see the best few matches, not the whole marketplace.

## Business Benefits

### Better Provider Trust

Providers are more likely to hire when they know OnIT has already screened performers.

### Better Performer Outcomes

Approved performers get a better chance of receiving work because the supply pool is not overcrowded.

### Higher Completion Quality

Admin-reviewed proof of work reduces low-quality onboarding.

### Stronger Brand Positioning

OnIT can position itself as a verified execution marketplace, not just a task listing platform.

### Better Marketplace Control

Category-level limits let the business control quality, supply, and demand balance.

## Product Requirements

### Performer Side

Add application flow:

- Select categories.
- Add skills.
- Upload or link two proof items.
- Add expected pricing.
- Add availability.
- Submit for review.

Show application status:

- Under review.
- Approved.
- Waitlisted.
- Rejected with reason.

### Admin Side

Add review dashboard:

- Pending performer applications.
- Portfolio/proof preview.
- Category requested.
- Approve, reject, waitlist actions.
- Admin notes.
- Quality score.
- Category capacity view.

### Provider Side

Update matching:

- Show only approved performers.
- Show best matches first.
- Limit initial options.
- Add match explanation.

## Technical Architecture

Suggested backend entities:

```text
performer_profiles
performer_portfolio_items
performer_category_applications
category_supply_limits
admin_review_notes
performer_quality_scores
```

Suggested fields for `performer_category_applications`:

```text
id
performer_id
category_id
status
submitted_at
reviewed_at
reviewed_by_admin_id
review_notes
quality_score
```

Suggested fields for `category_supply_limits`:

```text
id
category_id
city_id nullable
active_limit
approved_count
waitlisted_count
is_active
```

## Implementation Phases

### Phase 1: Manual Quality Gate

Goal: Stop uncontrolled performer onboarding.

Build:

- Performer application form.
- Two proof items requirement.
- Admin approval dashboard.
- Approved/waitlisted/rejected states.
- Hide unapproved performers from provider matching.

This phase can be mostly manual and should be shipped first.

### Phase 2: Category Supply Control

Goal: Control marketplace balance.

Build:

- Category-level limits.
- Waitlist handling.
- Admin view of approved vs capacity.
- Block approval when category is full unless admin overrides.

### Phase 3: Smart Matching

Goal: Improve provider hiring quality.

Build:

- Match scoring.
- Top 3 recommendations.
- Match explanation labels.
- View more option.

### Phase 4: Dynamic Supply Expansion

Goal: Scale category supply based on demand.

Build:

- Utilization dashboard.
- Demand/supply metrics.
- Automatic recommendations to increase category limit.
- Inactive performer demotion.

## Key Metrics To Track

Marketplace health:

- Tasks posted per category.
- Approved performers per category.
- Tasks per approved performer.
- Performer response time.
- Provider hire conversion.
- Task completion rate.
- Repeat provider rate.
- Dispute rate.
- Average performer utilization.

Approval quality:

- Application approval rate.
- Rejection reasons.
- Waitlist size.
- Approved performer rating after first 5 tasks.

Provider experience:

- Time to hire.
- Number of profiles viewed before hiring.
- Match-to-hire conversion.
- Provider satisfaction.

## Risks And Mitigations

### Risk: Too Few Performers

If supply is too restricted, providers may not find matches.

Mitigation:

- Start with a moderate cap.
- Track demand weekly.
- Use waitlist to quickly approve more performers.

### Risk: Admin Review Becomes Slow

Manual review can become operationally heavy.

Mitigation:

- Start manual.
- Add admin scoring templates.
- Later add AI-assisted review summaries.

### Risk: Good Performers Are Rejected Too Early

Some capable performers may not have formal certificates.

Mitigation:

- Accept projects and portfolios, not only certificates.
- Allow re-application after improvement.
- Use waitlist instead of hard rejection when unsure.

### Risk: Providers Want More Choice

Some providers may want to browse more.

Mitigation:

- Show top 3 first.
- Add “View more” for 10-15 additional options.
- Keep the full list hidden by default.

## Final Recommendation

OnIT should implement a managed supply model.

The best approach is:

1. Approve performers through proof-based review.
2. Limit active performers per category based on demand.
3. Keep additional applicants on a waitlist.
4. Show providers only the best-matched performers.
5. Expand supply only when category demand supports it.

This gives OnIT a stronger marketplace foundation than open onboarding. It improves provider trust, gives approved performers a better chance to earn, and gives the business control over quality and growth.
