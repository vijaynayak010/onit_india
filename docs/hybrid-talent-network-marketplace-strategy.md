# Hybrid Talent Network And Curated Marketplace Strategy

## Executive Summary

OnIT should not choose between fully open performer onboarding and a strictly limited performer marketplace. The strongest business model is a hybrid:

```text
Open Talent Network
-> Learning, profile building, portfolio submission, assessments
-> Verification and ranking
-> Curated Performer Marketplace
-> Provider task matching
```

This allows OnIT to collect valuable talent data, build a large future supply base, create education and partnership opportunities, and still protect provider experience by showing only verified, high-quality performers for paid work.

## Core Recommendation

Let everyone join OnIT, but do not let everyone compete for provider tasks immediately.

The platform should have two layers:

1. **Talent Network**
   - Open to students, freelancers, early professionals, and aspiring performers.
   - Users can build profiles, upload projects, attend learning sessions, complete assessments, and improve ranking.

2. **Verified Marketplace**
   - Only approved or verified performers can receive paid task matches.
   - Providers see a small, curated list of best-matched performers.

This gives OnIT scale without sacrificing quality.

## Why This Is Better Than A Pure Cap

A strict cap, such as only 500 performers per category, protects quality but may limit long-term growth.

An open marketplace gives OnIT more users and data, but if everyone is visible to providers, quality and trust can fall.

The hybrid model solves both:

- Everyone can join the ecosystem.
- Only qualified performers enter the live task marketplace.
- OnIT builds a long-term talent pipeline.
- Providers still get a curated, trusted experience.

## Business Logic

Marketplaces fail when either side is unhappy.

For providers:

- Too many options create confusion.
- Low-quality performers reduce trust.
- Failed tasks reduce repeat usage.

For performers:

- Too many performers competing for too few tasks creates frustration.
- No clear path to earning causes drop-off.
- Lack of feedback makes people inactive.

The hybrid model gives each side a better experience:

- Providers get verified, relevant performers.
- Performers get a path to become eligible for work.
- OnIT gets data, community, learning revenue, and marketplace control.

## Proposed Platform Structure

### 1. Open Talent Network

Anyone can join OnIT as an aspiring performer.

They can:

- Create a profile.
- Select skills and categories.
- Upload portfolio/projects/certificates.
- Attend free or paid learning sessions.
- Complete assessments.
- Receive a readiness score.
- Apply for verified performer status.

They cannot automatically receive paid provider task matches until verified.

### 2. Learning And Certification Layer

OnIT can partner with learning institutes, colleges, bootcamps, creators, or trainers.

Possible offerings:

- Free orientation sessions.
- Paid category-specific lectures.
- Skill bootcamps.
- Portfolio-building workshops.
- Certification tests.
- Internship-style simulated tasks.
- OnIT verified badges.

This helps OnIT improve performer quality before they enter the marketplace.

### 3. Verification Layer

Performers become eligible for paid tasks after passing verification.

Verification can include:

- Profile completion.
- Two proof items.
- Category-specific assessment.
- Portfolio review.
- Admin approval.
- Learning module completion.
- Trial or sandbox task.

Final outcome:

```text
Not Started
-> Learning
-> Submitted For Verification
-> Verified
-> Waitlisted
-> Rejected
```

### 4. Curated Marketplace

Only verified performers should appear to providers.

For each provider task, OnIT should show:

- Top 3 recommended performers.
- Option to view 10-15 additional matches.
- Match reasons such as skill fit, category fit, budget fit, availability, and past success.

The provider should not browse hundreds of random profiles.

## Data Advantage

The open talent network creates valuable data that can become a long-term business asset.

Data OnIT can collect:

- Skills people claim.
- Skill gaps by city and category.
- Portfolio quality.
- Certificate sources.
- Learning module completion.
- Assessment scores.
- Pricing expectations.
- Availability patterns.
- Category interest.
- Drop-off points in performer journey.
- Demand/supply gaps.

This data can power:

- Better matching.
- Performer ranking.
- Course recommendations.
- Category demand forecasting.
- Institute partnerships.
- Talent quality analytics.
- Future B2B talent insights.

## Revenue Opportunities

### Marketplace Revenue

OnIT earns from task commissions, platform fees, or subscription models.

### Learning Revenue

OnIT can earn from:

- Paid workshops.
- Certification fees.
- Institute partnerships.
- Premium profile review.
- Category readiness programs.

### Institute Partnerships

Institutes benefit because OnIT gives them:

- Real marketplace connection.
- Student outcome story.
- Placement-style credibility.
- Demand insights by category.

OnIT benefits because institutes provide:

- Trained supply.
- User acquisition.
- Education revenue.
- Quality improvement.

### Premium Talent Programs

Advanced performers can pay or qualify for:

- Featured profile review.
- Portfolio audit.
- Interview/task-readiness coaching.
- Higher visibility after verification.

This should be handled carefully so quality is not replaced by pay-to-rank.

## Performer Segmentation

Suggested performer tiers:

### Community Member

Joined OnIT but not task eligible.

### Learner

Taking courses, attending sessions, improving profile.

### Verification Candidate

Submitted proof and waiting for review.

### Verified Performer

Eligible for paid task matching.

### Top Performer

High rating, strong completion history, faster matching.

### Waitlisted Performer

Qualified but category supply is full.

## Provider Experience

The provider should experience OnIT as a trusted execution platform, not a directory.

Provider flow:

```text
Post task
-> OnIT understands task
-> OnIT recommends top performers
-> Provider selects from a small curated list
-> Task starts
```

This is better than:

```text
Post task
-> Browse hundreds of profiles
-> Compare manually
-> Risk choosing wrong performer
```

## Performer Experience

Performers should clearly understand how to move from joining to earning.

Recommended journey:

```text
Join OnIT
-> Build profile
-> Add proof of work
-> Complete learning or assessment
-> Apply for verification
-> Get approved or receive improvement feedback
-> Become eligible for paid tasks
```

This gives aspiring performers hope and structure, even if they are not immediately task eligible.

## Why This Helps Early-Stage Marketplace Growth

In the early stage, provider demand may be limited. If too many performers are directly exposed to tasks, most will not earn.

The hybrid model lets OnIT still grow user base without overloading the marketplace.

It creates three pools:

1. Active verified supply.
2. Qualified waitlist.
3. Learning/community supply.

This gives the business flexibility.

## Product Requirements

### Performer Product

- Profile creation.
- Category selection.
- Skill selection.
- Portfolio/project upload.
- Certificate upload.
- Learning dashboard.
- Verification status.
- Feedback after rejection or waitlist.

### Admin Product

- Review performer applications.
- View portfolio/certificates.
- Approve, reject, or waitlist.
- Assign category-level approval.
- Add notes and quality score.
- Monitor category capacity.

### Provider Product

- Show verified performers only.
- Show top matched performers.
- Show why a performer matched.
- Keep result list limited.
- Allow “view more” but avoid overwhelming choices.

## Technical Requirements

Suggested entities:

```text
talent_profiles
talent_portfolio_items
talent_learning_progress
talent_assessments
performer_verification_applications
performer_category_approvals
category_supply_limits
performer_quality_scores
```

Important statuses:

```text
COMMUNITY_MEMBER
LEARNER
SUBMITTED_FOR_VERIFICATION
VERIFIED
WAITLISTED
REJECTED
SUSPENDED
```

## Matching Logic

Only verified performers should be eligible for task matching.

Ranking should consider:

- Category approval.
- Skill match.
- Portfolio relevance.
- Assessment score.
- Rating.
- Completion rate.
- Response speed.
- Budget fit.
- Availability.
- Current workload.
- Location for on-ground tasks.

## Recommended Phased Rollout

### Phase 1: Verification Gate

Build the core approval flow:

- Performer proof submission.
- Admin review.
- Verified/waitlisted/rejected states.
- Hide non-verified performers from provider matching.

### Phase 2: Talent Network

Allow open signups into non-task-eligible talent profiles:

- Skill profile.
- Portfolio upload.
- Learning interest.
- Verification readiness.

### Phase 3: Learning Partnerships

Launch institute-led learning tracks:

- Free intro sessions.
- Paid skill modules.
- Certification assessments.
- Partner dashboards later.

### Phase 4: Smart Matching

Build ranking and recommendations:

- Top 3 performers.
- Match explanations.
- View more option.

### Phase 5: Data Products

Use accumulated data for:

- Category demand reports.
- Talent quality reports.
- Institute outcome reports.
- Internal marketplace forecasting.

## Strategic Risks

### Risk: Users Join But Do Not Get Work

If OnIT allows open signup, some users may feel disappointed if they cannot access tasks.

Mitigation:

- Clearly communicate that verification is required.
- Show progress path.
- Provide learning and improvement options.

### Risk: Learning Becomes A Distraction

OnIT should not become only an education company.

Mitigation:

- Learning should support marketplace quality.
- The main business remains task execution.

### Risk: Pay-To-Learn Looks Like Pay-To-Get-Work

If paid courses are required for task access, users may distrust the platform.

Mitigation:

- Keep portfolio/project-based verification available.
- Paid learning should be optional, not mandatory.
- Verification should depend on capability, not payment.

### Risk: Admin Review Load Grows

Manual verification may become slow.

Mitigation:

- Start manual.
- Add templates and scoring.
- Later use AI-assisted summarization and pre-screening.

## Final Recommendation

The best business strategy is:

```text
Open entry, controlled earning access.
```

OnIT should let many people join the talent network, learn, build profiles, and submit proof. But only verified and matched performers should be shown to providers for paid work.

This gives OnIT:

- Marketplace quality.
- Provider trust.
- Performer development.
- Institute partnerships.
- Valuable talent data.
- Future revenue streams.

This is stronger than both fully open onboarding and a strict closed cap.

---

## Expanded Strategic Explanation

### The Core Business Question

The real question is not whether OnIT should allow many performers to join. The real question is:

> Who should be allowed to receive paid task visibility in front of providers?

These are different decisions.

OnIT can allow a large number of users to join the talent ecosystem while still keeping the paid task marketplace curated. This is the most balanced model because it protects provider trust while still allowing OnIT to build a large supply database.

The recommended rule is:

```text
Open entry into the talent network.
Controlled access to paid task matching.
```

This means:

- Anyone can create a performer profile.
- Anyone can learn, upload proof, improve, and apply.
- Not everyone is immediately shown to providers.
- Only verified and category-approved performers are eligible for paid tasks.

## Strategic Options Comparison

### Option 1: Fully Open Marketplace

In this model, anyone who signs up as a performer can immediately appear to providers.

Benefits:

- Fast user growth.
- Low onboarding friction.
- More supply on paper.
- More data from performer profiles.

Problems:

- Provider trust can fall quickly.
- Providers may see too many irrelevant options.
- Low-quality performers can damage task outcomes.
- Strong performers get lost in a noisy pool.
- Many performers will not get work and may become inactive.
- The platform becomes luck-based instead of merit-based.

This model is easier to launch but risky for brand quality.

### Option 2: Strict Closed Marketplace

In this model, OnIT allows only a fixed number of performers, for example 500 per category.

Benefits:

- Better quality control.
- Approved performers have a better chance of getting work.
- Providers see a more curated platform.
- Operations are easier to control.

Problems:

- OnIT loses a large talent funnel.
- Fewer users means less data.
- Harder to build learning/institute partnerships.
- Strong applicants may be rejected only because capacity is full.
- The fixed number may not match demand in every category or city.

This model protects marketplace quality but limits ecosystem growth.

### Option 3: Hybrid Talent Network Plus Curated Marketplace

In this model, everyone can join the talent network, but only verified performers enter the paid marketplace.

Benefits:

- Large talent database.
- Better provider trust.
- Clear pathway for performers.
- Future supply stays warm.
- Learning partnerships become possible.
- Data improves matching and business planning.
- OnIT can expand supply category by category.

Problems:

- More operational complexity.
- Requires admin review workflows.
- Requires clear communication to performers.
- Requires product investment in statuses, reviews, and matching logic.

This is the recommended model because it gives OnIT both growth and quality.

## Why This Is A Stronger Business Model

OnIT should avoid becoming a generic freelance directory. A directory puts the burden of selection on the provider. The provider has to search, compare, filter, negotiate, and guess who is reliable.

OnIT should instead become a managed execution platform.

In a managed execution platform:

- OnIT verifies performers.
- OnIT understands the task.
- OnIT recommends the best matches.
- OnIT controls quality.
- OnIT protects both sides.

This gives OnIT a stronger brand promise:

> Providers do not need to find talent. OnIT finds the right verified performer for the task.

## The Marketplace Flywheel

The target flywheel should be:

```text
Better verified performers
-> Better task outcomes
-> Higher provider trust
-> More repeat providers
-> More task volume
-> More earning opportunities
-> Better performers want to join
-> More data for better matching
```

The wrong flywheel would be:

```text
Open unverified supply
-> Poor or inconsistent task quality
-> Provider dissatisfaction
-> Fewer repeat tasks
-> Performers receive less work
-> Performer inactivity
-> Marketplace quality declines
```

The hybrid model is designed to create the first flywheel and avoid the second.

## Why Not Make 500 The Immediate Rule?

The idea of 500 performers per category is useful as a long-term capacity concept, but it should not be the same number for every category from day one.

Different categories have different demand patterns.

Examples:

- Website development may have strong national demand.
- On-ground assistance must be city-specific.
- Academic support may be seasonal.
- Business operations may need fewer but more trusted performers.
- Design work needs portfolio-heavy verification.

The better rule is:

```text
Category capacity should grow only when category demand grows.
```

Suggested starting capacity:

- High-demand digital categories: 100-150 verified performers.
- Specialized categories: 25-75 verified performers.
- City-based on-ground categories: 20-50 per city.
- Experimental categories: 10-25 trusted performers.

Capacity should increase when:

- Providers are not receiving enough good matches.
- Top performers are overloaded.
- Response time is increasing.
- Task volume is growing.
- Completion quality remains high.
- Waitlist has high-quality applicants.

## Demand-Based Supply Formula

A simple formula can guide category capacity:

```text
Target active performers =
expected monthly tasks * desired redundancy / expected tasks per performer
```

Example:

```text
Expected monthly tasks in Website Development: 300
Desired redundancy: 3 performers available per task
Expected tasks per performer per month: 6

Target active performers = 300 * 3 / 6 = 150
```

This is better than choosing a random cap.

## Talent Network Layer

The Talent Network is open to everyone.

Purpose:

- Collect talent data.
- Build a future performer pipeline.
- Create community.
- Offer learning.
- Help users become task-ready.

Features:

- Profile creation.
- Skills selection.
- Category interest.
- Portfolio upload.
- Certificate upload.
- Availability.
- Expected pricing.
- Learning recommendations.
- Verification readiness score.
- Application status.

Important point:

> Talent Network membership should not mean paid task eligibility.

## Verified Marketplace Layer

The Verified Marketplace is restricted.

Only performers who pass verification should be eligible for task visibility.

Eligibility should depend on:

- Completed profile.
- Two proof items.
- Category-specific review.
- Admin approval.
- Assessment score or learning completion where relevant.
- Quality score.
- Availability.
- No suspension or policy issues.

Only these performers should appear in provider recommendations.

## Performer Journey

Recommended journey:

```text
Join OnIT
-> Complete profile
-> Add portfolio, projects, certificates, or proof
-> Select categories
-> Receive readiness score
-> Take recommended learning or assessment
-> Submit for verification
-> Admin reviews
-> Approved, waitlisted, or rejected
-> Eligible for paid task matching if approved
```

This gives users a clear path instead of making the marketplace feel random.

## Provider Journey

Recommended journey:

```text
Provider posts task
-> OnIT formats and understands requirement
-> OnIT identifies relevant category and skills
-> OnIT recommends top verified performers
-> Provider reviews a small curated list
-> Provider hires
-> Task is completed
```

Provider should see fewer options, not more.

Suggested provider display:

- Top 3 performers first.
- "View more" for 10-15 additional matches.
- Match reason badges.
- Verified badge.
- Availability indicator.
- Similar work indicator.
- Budget fit indicator.

Example match explanation:

```text
Recommended because:
- Verified for Website Development
- Completed 8 similar tasks
- Budget matches your task
- Usually responds within 2 hours
```

## Learning Institute Partnership Model

The learning institute idea is strategically valuable.

OnIT can partner with:

- Colleges.
- Skill institutes.
- Coding bootcamps.
- Design institutes.
- Freelance trainers.
- Creator-led learning communities.

Institute benefits:

- Real-world marketplace connection.
- Better student outcome story.
- Employability positioning.
- Practical project/certificate pathway.
- Access to demand insights.

OnIT benefits:

- Lower-cost user acquisition.
- Better trained supply.
- More data.
- Possible education revenue.
- Stronger brand credibility.

Suggested institute pitch:

> Your students do not just learn. They build proof, get verified, and become eligible for real task opportunities through OnIT.

## Learning Products OnIT Can Offer

Possible learning tracks:

- Website Development Readiness.
- UI/UX Portfolio Readiness.
- Content And Marketing Execution.
- Business Research And Operations.
- Data Entry And Admin Work.
- Academic Support Standards.
- On-Ground Professionalism.
- Client Communication.
- Task Estimation And Pricing.
- Delivery Documentation.

Each learning track should include:

- Short lessons.
- Practical project.
- Assessment.
- Portfolio output.
- Verification recommendation.

## Important Monetization Guardrail

OnIT should be careful not to look like a company that charges users for false job hopes.

The rule should be:

```text
Paid learning can help preparation.
Paid learning cannot guarantee task access.
Verification depends on capability.
```

Performers should be able to qualify through strong portfolio/proof even without paid courses.

This protects trust.

## Revenue Opportunities

### Marketplace Revenue

Primary revenue should remain task execution.

Possible models:

- Provider platform fee.
- Commission on completed tasks.
- Business subscription for recurring providers.
- Premium support for urgent tasks.

### Learning Revenue

Secondary revenue can come from:

- Paid workshops.
- Certification assessments.
- Portfolio review.
- Category readiness programs.
- Institute-led bootcamps.

### Partnership Revenue

Possible institute models:

- Revenue share on courses.
- Institute-sponsored verification drives.
- Cohort-based training.
- Outcome-based partnership.
- Placement-readiness programs.

### Future Data Products

After scale, OnIT can build aggregate data products:

- Skill gap reports.
- Category demand reports.
- City-level talent supply reports.
- Institute outcome reports.
- Pricing benchmark reports.

These should use aggregated, privacy-safe data.

## Data Advantage

The open Talent Network gives OnIT data that a closed marketplace would not collect.

Useful data:

- Which skills users claim.
- Which categories attract talent.
- Which cities have strong supply.
- Which proof types predict success.
- Which institutes produce better performers.
- Which courses improve approval rates.
- Which categories have demand/supply gaps.
- What price ranges performers expect.
- How quickly performers respond.

This data can improve:

- Matching.
- Ranking.
- Category expansion.
- Learning recommendations.
- Institute partnerships.
- Provider pricing guidance.

## Data As A Competitive Moat

Competitors can copy a task posting form. They can copy profiles. They can copy a basic marketplace.

It is harder to copy:

- Verified talent history.
- Category-level approval data.
- Real task completion data.
- Provider satisfaction data.
- Learning-to-performance data.
- Institute quality data.

This becomes OnIT's long-term moat.

## Performer Segmentation

Recommended performer statuses:

```text
COMMUNITY_MEMBER
LEARNER
SUBMITTED_FOR_VERIFICATION
VERIFIED
WAITLISTED
REJECTED
SUSPENDED
TOP_PERFORMER
```

Meaning:

- `COMMUNITY_MEMBER`: joined but not task-ready.
- `LEARNER`: improving through learning or profile completion.
- `SUBMITTED_FOR_VERIFICATION`: waiting for admin review.
- `VERIFIED`: eligible for paid task matching.
- `WAITLISTED`: qualified but category capacity is full.
- `REJECTED`: not approved yet; can improve and reapply.
- `SUSPENDED`: temporarily removed from marketplace visibility.
- `TOP_PERFORMER`: high-performing verified user with stronger visibility.

## Category-Specific Approval

Approval should not be global only.

A performer may be verified for one category and rejected for another.

Example:

```text
Performer: Ananya
Content, Design and Marketing: Verified
Tech, Data and Admin: Waitlisted
Academic Support: Rejected
```

This gives OnIT better control and improves provider trust.

## Admin Review Rubric

Admin review should use a standard scoring model.

Suggested scoring:

```text
Profile completeness: 20%
Proof quality: 30%
Skill relevance: 20%
Communication clarity: 10%
Assessment or learning result: 10%
Availability and pricing fit: 10%
```

Possible admin decisions:

- Approve.
- Waitlist.
- Request more information.
- Reject.

Common rejection reasons:

- Insufficient proof.
- Low-quality portfolio.
- Category mismatch.
- Incomplete profile.
- Failed assessment.
- Category capacity full.

Structured rejection reasons help performers improve and reduce support questions.

## Product Requirements In Detail

### Performer Product

Required features:

- Talent profile.
- Category selection.
- Skill selection.
- Portfolio/project upload.
- Certificate upload.
- Expected pricing.
- Availability.
- Verification status.
- Feedback after review.
- Learning recommendations.
- Profile readiness score.

### Admin Product

Required features:

- Application review dashboard.
- Category filters.
- City filters.
- Proof preview.
- Approve/reject/waitlist actions.
- Review notes.
- Quality score.
- Category capacity view.
- Audit log.

### Provider Product

Required features:

- Show verified performers only.
- Top recommendations.
- Match explanation.
- Limited result list.
- View more option.
- Verified badge.
- Similar work signal.
- Availability signal.
- Budget fit signal.

## Technical Architecture

Suggested backend entities:

```text
talent_profiles
talent_portfolio_items
talent_learning_progress
talent_assessments
performer_verification_applications
performer_category_approvals
category_supply_limits
performer_quality_scores
```

### `talent_profiles`

Suggested fields:

```text
id
user_id
bio
primary_city
availability
expected_price_min
expected_price_max
readiness_score
status
created_at
updated_at
```

### `talent_portfolio_items`

Suggested fields:

```text
id
talent_profile_id
type
title
description
url
file_id
category_id
review_status
created_at
```

### `performer_category_approvals`

Suggested fields:

```text
id
talent_profile_id
category_id
city_id nullable
status
quality_score
reviewed_by
reviewed_at
review_notes
```

### `category_supply_limits`

Suggested fields:

```text
id
category_id
city_id nullable
active_limit
approved_count
waitlisted_count
is_active
updated_by
updated_at
```

## Matching Rules

Provider matching should include only performers where:

```text
profile_status = VERIFIED
category_approval_status = APPROVED
is_suspended = false
availability is compatible
```

Ranking signals:

- Skill match.
- Category approval.
- Portfolio relevance.
- Assessment score.
- Rating.
- Completion rate.
- Response speed.
- Budget fit.
- Availability.
- Workload.
- Location for on-ground tasks.

Simple scoring model:

```text
Skill match: 25 points
Portfolio relevance: 20 points
Past completion rate: 20 points
Rating: 15 points
Response speed: 10 points
Budget fit: 5 points
Availability: 5 points
```

This can start as rule-based and become more intelligent over time.

## Events To Track

Important events:

```text
profile_started
profile_completed
portfolio_item_added
learning_module_started
learning_module_completed
verification_submitted
verification_approved
verification_rejected
verification_waitlisted
performer_shown_to_provider
performer_hired
task_completed
provider_review_submitted
```

These events will power dashboards and future matching improvements.

## MVP Scope

The first version should not try to build everything.

MVP should include:

- Performer proof submission.
- Two proof items required.
- Category application.
- Admin approval dashboard.
- Approve/reject/waitlist.
- Hide unverified performers from provider matching.
- Basic category capacity count.

Avoid in MVP:

- Full learning platform.
- Partner dashboards.
- Complex AI scoring.
- Public data products.

## 30-60-90 Day Plan

### First 30 Days

- Define categories and approval rules.
- Build performer proof submission.
- Build admin review flow.
- Add verified/waitlisted/rejected statuses.
- Hide non-verified performers from provider matching.

### 60 Days

- Add category capacity limits.
- Add waitlist handling.
- Add profile readiness score.
- Add basic match reason labels.
- Start first learning or institute pilot.

### 90 Days

- Add performance-based ranking.
- Add category supply dashboard.
- Add verified performer badge.
- Track learning-to-approval conversion.
- Adjust category limits based on demand.

## Operating Model

This model requires weekly marketplace management.

Weekly review questions:

- Which categories have high demand?
- Which categories have too much supply?
- Which waitlisted performers should be approved?
- Which verified performers are inactive?
- Which performers have poor ratings or disputes?
- Which learning tracks improve approval rate?

Monthly review questions:

- Should category capacity increase?
- Are providers satisfied with recommendations?
- Are performers getting enough work?
- Are institutes producing quality candidates?
- Which categories should OnIT expand next?

## Key Metrics

### Supply Metrics

- Total talent network users.
- Verified performers.
- Waitlisted performers.
- Category approval rate.
- City-level supply.
- Active performer percentage.

### Demand Metrics

- Tasks posted.
- Tasks completed.
- Tasks cancelled.
- Hire conversion.
- Repeat provider rate.
- Average task value.

### Quality Metrics

- Task completion rate.
- Provider rating.
- Dispute rate.
- Rework rate.
- Average response time.

### Learning Metrics

- Course enrollments.
- Course completions.
- Assessment pass rate.
- Learning-to-verification conversion.
- Institute-wise approval rate.

### Marketplace Balance Metrics

- Tasks per verified performer.
- Provider demand per category.
- Supply utilization.
- Waitlist depth.
- Time to first task after verification.

## CEO Talking Points

- We should not block talent from joining OnIT.
- We should block unverified talent from paid task visibility.
- This lets us build a large talent database without harming provider experience.
- Learning partnerships can turn unready talent into future supply.
- Providers should see only curated, verified, best-matched performers.
- The long-term moat is verified talent data plus execution history.
- The model creates marketplace revenue today and learning/data opportunities later.

## Final Strategic Statement

OnIT should become a managed execution marketplace powered by an open talent network.

The company should welcome many people into the ecosystem, help them improve, collect talent data, and create learning partnerships. But it should protect provider trust by allowing only verified and well-matched performers to receive paid task visibility.

This model supports immediate trust and long-term scale.
