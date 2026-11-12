import React from "react";
import { FileText, Edit3, Search, CheckCircle } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: FileText,
    title: "Blog posts and articles",
    description: "Get long-form blog posts, how-to articles, and thought leadership pieces written to your brief and word count.",
  },
  {
    icon: Edit3,
    title: "Startup-friendly tone and SEO",
    description: "Content that fits startup audiences: clear, engaging, and optimised for search where you need it.",
  },
  {
    icon: Search,
    title: "Topic research and outlines",
    description: "Task out research and outlines first, then full drafts. Or get full posts in one go — you set the scope.",
  },
  {
    icon: CheckCircle,
    title: "Edits and revisions",
    description: "Request one or two rounds of edits per task. Pay when the final draft is approved.",
  },
];

const EXAMPLES = [
  "Product and feature blog posts",
  "How-to and guide articles",
  "Founder and company story pieces",
  "Industry and trend commentary",
  "Landing page and website copy",
  "Newsletter and email content",
];

const BlogWritingServicesForStartupsPage = () => (
  <ServiceLandingLayout
    title="Blog Writing Services for Startups | FirstDoer"
    description="Blog writing services for startups by verified performers. Blog posts, articles, and website copy. SEO-friendly content on demand. Post a task, get drafts delivered. FirstDoer."
    keywords="blog writing services for startups, startup blog writing, blog post writing India, content writing for startups, article writing, FirstDoer"
    canonical="https://www.firstdoer.com/services/blog-writing-services-for-startups"
    heroTitle="Blog Writing Services for Startups"
    heroSubtitle="Get blog posts, articles, and website copy written by verified performers. Startup-friendly tone, clear briefs, and pay when the draft is approved. No retainer — task by task."
    ctaTitle="Need blog content?"
    ctaSubtitle="Post your topic, word count, and tone. Performers will research and deliver drafts for your approval."
  >
    <section className="py-16 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-10 text-center">What we help you execute</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div key={item.title} className="rounded-xl border border-[var(--color-primary)]/15 bg-white p-6 flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-primary)] mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="py-16 px-6 md:px-20 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4 text-center">Types of blog and copy you can post</h2>
        <p className="text-gray-600 text-center mb-8">From single posts to ongoing batches — post what you need.</p>
        <ul className="space-y-3">
          {EXAMPLES.map((item) => (
            <li key={item} className="flex gap-3 items-center rounded-lg bg-white border border-gray-100 px-4 py-3 text-gray-700">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </ServiceLandingLayout>
);

export default BlogWritingServicesForStartupsPage;
