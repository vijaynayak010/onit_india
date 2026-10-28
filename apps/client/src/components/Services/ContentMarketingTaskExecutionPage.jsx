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
    title="Content Marketing Task Execution | Content & Social Tasks | OnIT INDIA"
    description="Content marketing task execution by verified performers. Blog writing, social media posting, SEO updates, and campaign execution. Post content and marketing tasks — pay when work is done. OnIT INDIA."
    keywords="content marketing task execution, content marketing tasks, social media task execution, blog writing service, content creation tasks, marketing task outsourcing, SEO content tasks, campaign execution India, OnIT INDIA"
    canonical="https://www.onitindia.com/services/content-marketing-task-execution"
    heroTitle="Content Marketing Task Execution"
    heroSubtitle="Get content and marketing tasks executed by verified performers. Writing, posting, SEO updates, and campaign execution — post a task, set your scope, and pay when deliverables are approved."
    ctaTitle="Need content or marketing tasks done?"
    ctaSubtitle="Post your content briefs, social tasks, or SEO updates. Performers with the right skills will execute and submit for your approval."
  >
    <section className="py-16 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-10 text-center">
          What we help you execute
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#004d43]/15 bg-white p-6 flex gap-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#004d43]/10 text-[#004d43] flex items-center justify-center">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[#004d43] mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 px-6 md:px-20 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4 text-center">
          Types of content marketing tasks you can post
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Scale content and marketing execution without hiring for every task.
        </p>
        <ul className="space-y-3">
          {EXAMPLES.map((item) => (
            <li
              key={item}
              className="flex gap-3 items-center rounded-lg bg-white border border-gray-100 px-4 py-3 text-gray-700"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#004d43]/20 text-[#004d43] flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </ServiceLandingLayout>
);

export default ContentMarketingTaskExecutionPage;
