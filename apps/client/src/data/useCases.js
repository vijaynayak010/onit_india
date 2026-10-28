/**
 * Use case / audience landing pages for SEO and conversion.
 * Each slug becomes a route: /for-startups, /for-creators, etc.
 */
export const useCases = [
  {
    slug: "for-startups",
    title: "For Startups",
    headline: "Get tasks done without hiring full-time",
    description:
      "OnIT INDIA helps startups move fast: research, design, content, and data work on demand. Post a task, get matched with vetted performers, pay only when work is done. No long hiring cycles.",
    keywords:
      "OnIT INDIA for startups, task execution for startups, outsource tasks startup India, hire for tasks startup, research design content for startups, task marketplace India startup",
    benefits: [
      "Ship faster with research, design, and content on demand",
      "No full-time hires — scale tasks up or down as you grow",
      "Set your budget; performers work at your price",
      "Clear scope and payment only on completion",
    ],
    exampleTasks: [
      "Competitor research",
      "Landing page copy",
      "Social creatives",
      "Data entry and CRM updates",
      "Lead list building",
    ],
  },
  {
    slug: "for-creators",
    title: "For Creators",
    headline: "Scale your content without an in-house team",
    description:
      "Creators use OnIT INDIA for thumbnails, editing, captions, and design. Post tasks when you need them, get quality work from vetted performers, and keep creating without the overhead.",
    keywords:
      "OnIT INDIA for creators, content tasks for creators, thumbnail design, video editing tasks, social media content creators India, task marketplace for creators",
    benefits: [
      "Thumbnails, reels, captions, and graphics on demand",
      "No retainer or agency lock-in — pay per task",
      "Quick turnaround so you can stay on schedule",
      "Consistent quality from performers who get your niche",
    ],
    exampleTasks: [
      "Thumbnail design",
      "Short-form video editing",
      "Caption and hashtag research",
      "Carousel and story content",
      "Quote graphics and memes",
    ],
  },
  {
    slug: "for-businesses",
    title: "For Businesses",
    headline: "Execution support for everyday business operations",
    description:
      "Businesses use OnIT INDIA for market research, lead generation, data entry, reporting, and admin tasks. Get work done by vetted performers without adding headcount. Task-based and transparent.",
    keywords:
      "OnIT INDIA for businesses, business task execution India, market research tasks, lead generation outsourcing, data entry business India, task marketplace for business",
    benefits: [
      "Market research, lead lists, and CRM updates without hiring",
      "Clear pricing and scope — pay only when work is approved",
      "Use for one-off projects or recurring operational tasks",
      "Secure, tracked, and scalable",
    ],
    exampleTasks: [
      "Market and competitor research",
      "Lead list building",
      "Data entry and CRM updates",
      "Reports and dashboards",
      "SOP and process documentation",
    ],
  },
  {
    slug: "for-marketers",
    title: "For Marketers",
    headline: "Marketing tasks executed without the agency price tag",
    description:
      "Marketers use OnIT INDIA for SEO, content, ads, and campaigns. Get keyword research, blog posts, ad creatives, and social content done by vetted performers. Pay per task, scale as needed.",
    keywords:
      "OnIT INDIA for marketers, marketing task execution, SEO content tasks, ad creatives India, content marketing tasks, task marketplace for marketing",
    benefits: [
      "SEO research, content, and creatives without a full team",
      "Campaigns and one-off tasks — you set the brief and budget",
      "Faster than agencies, more controlled than freelancer platforms",
      "Clear deliverables and payment on completion",
    ],
    exampleTasks: [
      "SEO keyword research",
      "Blog and article writing",
      "Ad creatives and banners",
      "Email copy and sequences",
      "Social content calendars",
    ],
  },
  {
    slug: "for-agencies",
    title: "For Agencies",
    headline: "Delegate execution so your team can focus on strategy",
    description:
      "Agencies use OnIT INDIA to offload research, design, content, and field tasks. Scale delivery without scaling payroll. Post client work as tasks, get it done by vetted performers, keep quality and margins.",
    keywords:
      "OnIT INDIA for agencies, agency task outsourcing, white-label task execution, research design content for agencies, task marketplace India agencies",
    benefits: [
      "Handle overflow and niche tasks without hiring",
      "Research, design, content, and field checks on demand",
      "Clear handoffs and proof of work for clients",
      "Pay per task — no bench or fixed costs",
    ],
    exampleTasks: [
      "Client research and reports",
      "Design and creative production",
      "Content and copy for campaigns",
      "Field visits and verification",
      "Data cleanup and reporting",
    ],
  },
  {
    slug: "for-enterprises",
    title: "For Enterprises",
    headline: "Structured task execution for large teams",
    description:
      "Enterprises use OnIT INDIA for research, data, compliance checks, and operational tasks. Centralized posting, vetted performers, and clear audit trails. Scale execution without scaling full-time headcount.",
    keywords:
      "OnIT INDIA for enterprises, enterprise task execution, research data compliance India, task marketplace enterprise, large-scale task execution",
    benefits: [
      "Research, data, and compliance-related tasks at scale",
      "Controlled workflow and visibility",
      "Vetted performers and clear records",
      "Flexible volume — ramp up or down by need",
    ],
    exampleTasks: [
      "Market and regulatory research",
      "Data entry and validation",
      "Compliance and verification tasks",
      "Reporting and dashboards",
      "Documentation and process support",
    ],
  },
  {
    slug: "for-researchers",
    title: "For Researchers",
    headline: "Research support and data work on demand",
    description:
      "Researchers and insights teams use OnIT INDIA for secondary research, data collection, survey support, and reporting. Get tasks done by vetted performers so you can focus on analysis and strategy.",
    keywords:
      "OnIT INDIA for researchers, research task execution India, data collection tasks, survey support, market research outsourcing India",
    benefits: [
      "Secondary research, data scraping, and list building",
      "Survey design, distribution, and data compilation",
      "Clean data and summaries ready for analysis",
      "Pay per task — no long-term commitments",
    ],
    exampleTasks: [
      "Desk research and literature review",
      "Data collection and scraping",
      "Survey design and analysis support",
      "Competitor and market data",
      "Report compilation and summaries",
    ],
  },
  {
    slug: "for-ecommerce",
    title: "For E‑commerce & D2C Brands",
    headline: "Retail audits, content, and operations without the overhead",
    description:
      "E‑commerce and D2C brands use OnIT INDIA for retail audits, product listings, content, and local checks. Get shelf photos, pricing checks, and content tasks done by on-ground and remote performers.",
    keywords:
      "OnIT INDIA for ecommerce, D2C task execution, retail audit India, shelf photos, product listing tasks, ecommerce task marketplace India",
    benefits: [
      "Retail audits, shelf photos, and in-store checks",
      "Product listings, descriptions, and content",
      "Pricing and availability checks",
      "On-ground and remote tasks in one place",
    ],
    exampleTasks: [
      "Store visits and shelf photos",
      "Product listing and catalog updates",
      "Pricing and availability checks",
      "Content and creatives for product pages",
      "Local verification and proof of display",
    ],
  },
];

export function getUseCaseBySlug(slug) {
  return useCases.find((u) => u.slug === slug) ?? null;
}

export function getAllUseCaseSlugs() {
  return useCases.map((u) => u.slug);
}
