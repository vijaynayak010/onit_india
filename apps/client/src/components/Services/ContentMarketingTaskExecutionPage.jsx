import React from "react";
import { Edit3, Share2, Search, BarChart } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: Edit3,
    title: "Content creation & distribution",
    description: "Get blog posts, social content, captions, and copy written or adapted. Task out content uploads, scheduling, and distribution to match your calendar.",
  },
  {
    icon: Share2,
    title: "Social & campaign execution",
    description: "Execute social media tasks: posting, commenting, sharing, hashtag campaigns, and community management by vetted performers.",
  },
  {
    icon: Search,
    title: "SEO & listing updates",
    description: "Update business listings, meta descriptions, local SEO tasks, and directory submissions. Clear briefs and deliverables per task.",
  },
  {
    icon: BarChart,
    title: "Reporting & audits",
    description: "Get content audits, competitor content tracking, and simple performance reports executed as tasks so you can scale marketing ops without full-time hires.",
  },
];

const EXAMPLES = [
  "Blog and article writing or editing",
  "Social media posting and scheduling",
  "Caption and copywriting for campaigns",
  "Local SEO and directory listing updates",
  "Content upload and format conversion",
  "Influencer outreach and content coordination",
];

const ContentMarketingTaskExecutionPage = () => (
  <ServiceLandingLayout
    title="Content Marketing Task Execution | Content & Social Tasks | FirstDoer"
    description="Content marketing task execution by verified performers. Blog writing, social media posting, SEO updates, and campaign execution. Post content and marketing tasks — pay when work is done. FirstDoer."
    keywords="content marketing task execution, content marketing tasks, social media task execution, blog writing service, content creation tasks, marketing task outsourcing, SEO content tasks, campaign execution India, FirstDoer"
    canonical="https://www.firstdoer.com/services/content-marketing-task-execution"
    heroTitle="Content Marketing Task Execution"
    heroSubtitle="Get content and marketing tasks executed by verified performers. Writing, posting, SEO updates, and campaign execution — post a task, set your scope, and pay when deliverables are approved."
    ctaTitle="Need content or marketing tasks done?"
    ctaSubtitle="Post your content briefs, social tasks, or SEO updates. Performers with the right skills will execute and submit for your approval."
  >
    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-heading font-medium text-[var(--color-primary)] mb-8 sm:mb-10 text-center">
          What we help you execute
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--color-primary)]/15 bg-white p-4 sm:p-6 flex gap-3.5 sm:gap-4 items-start"
            >
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <item.icon size={22} />
              </div>
              <div>
                <h3 className="font-heading font-medium text-[var(--color-primary)] mb-1 text-base sm:text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-heading font-medium text-[var(--color-primary)] mb-3 sm:mb-4 text-center">
          Types of content marketing tasks you can post
        </h2>
        <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
          Scale content and marketing execution without hiring for every task.
        </p>
        <ul className="space-y-3">
          {EXAMPLES.map((item) => (
            <li
              key={item}
              className="flex gap-3 items-center rounded-lg bg-white border border-gray-100 px-4 py-3 text-sm sm:text-base text-gray-700"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </ServiceLandingLayout>
);

export default ContentMarketingTaskExecutionPage;
