import React from "react";
import { Search, BarChart2, FileText, TrendingUp } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: Search,
    title: "Keyword lists and prioritisation",
    description: "Get keyword research delivered: search volume, difficulty, and opportunity. Sorted by priority for your niche or campaign.",
  },
  {
    icon: BarChart2,
    title: "Competitor and gap analysis",
    description: "See what keywords competitors rank for and where you have gaps. Use the output to plan content and SEO tasks.",
  },
  {
    icon: FileText,
    title: "Structured deliverables",
    description: "Receive spreadsheets or reports with keywords, metrics, and recommendations. Clear format agreed in the task brief.",
  },
  {
    icon: TrendingUp,
    title: "Ongoing or one-off",
    description: "Post a single keyword research task or batch multiple projects. Scale up when you need more data.",
  },
];

const EXAMPLES = [
  "Primary and long-tail keyword lists",
  "Keyword difficulty and volume research",
  "Competitor keyword analysis",
  "Content gap and opportunity reports",
  "Local and geo-specific keyword research",
  "Product and category keyword mapping",
];

const SEOKeywordResearchServicesPage = () => (
  <ServiceLandingLayout
    title="SEO Keyword Research Services | OnIT INDIA"
    description="SEO keyword research services by verified performers. Keyword lists, volume and difficulty, competitor analysis, and content gap research. Post a task, get data delivered. OnIT INDIA."
    keywords="SEO keyword research services, keyword research India, SEO keywords, keyword analysis, content gap research, OnIT INDIA"
    canonical="https://www.onitindia.com/services/seo-keyword-research-services"
    heroTitle="SEO Keyword Research Services"
    heroSubtitle="Get keyword research executed by verified performers. Keyword lists, search volume, difficulty, competitor and gap analysis — post a task, set your scope, pay when the deliverable is approved."
    ctaTitle="Need keyword research?"
    ctaSubtitle="Post your niche, competitors, or goals. Performers will deliver keyword lists and reports for your approval."
  >
    <section className="py-16 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-10 text-center">What we help you execute</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div key={item.title} className="rounded-xl border border-[#004d43]/15 bg-white p-6 flex gap-4">
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
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4 text-center">Types of keyword research you can post</h2>
        <p className="text-gray-600 text-center mb-8">From single lists to full audits — post what you need.</p>
        <ul className="space-y-3">
          {EXAMPLES.map((item) => (
            <li key={item} className="flex gap-3 items-center rounded-lg bg-white border border-gray-100 px-4 py-3 text-gray-700">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#004d43]/20 text-[#004d43] flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </ServiceLandingLayout>
);

export default SEOKeywordResearchServicesPage;
