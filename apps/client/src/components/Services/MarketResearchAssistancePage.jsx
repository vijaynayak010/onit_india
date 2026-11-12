import React from "react";
import { Search, FileText, TrendingUp, Users } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: Search,
    title: "Primary & secondary research",
    description: "Get market sizing, competitor intel, consumer insights, and industry reports executed as tasks. Specify deliverables and format when you post.",
  },
  {
    icon: FileText,
    title: "Structured reports & summaries",
    description: "Receive clean summaries, comparison tables, and structured data. Use our performers for data gathering and synthesis without hiring in-house researchers.",
  },
  {
    icon: TrendingUp,
    title: "Trends & landscape mapping",
    description: "Task out trend reports, landscape mapping, and opportunity analyses. Scale research across segments or regions with clear scope per task.",
  },
  {
    icon: Users,
    title: "Surveys & feedback collection",
    description: "Run surveys, feedback collection, and voice-of-customer tasks. Get data collected, cleaned, and delivered in your preferred format.",
  },
];

const EXAMPLES = [
  "Market sizing and opportunity research",
  "Competitor and pricing research",
  "Consumer and customer insight research",
  "Industry and trend reports",
  "Survey design and execution",
  "Data cleaning and report preparation",
];

const MarketResearchAssistancePage = () => (
  <ServiceLandingLayout
    title="Market Research Assistance | Research Tasks & Reports | FirstDoer"
    description="Market research assistance by verified performers. Market sizing, competitor research, consumer insights, surveys, and report execution. Post research tasks and pay when delivered. FirstDoer."
    keywords="market research assistance, market research India, competitor research, consumer research, market sizing, survey execution, research report, industry research, data research tasks, FirstDoer"
    canonical="https://www.firstdoer.com/services/market-research-assistance"
    heroTitle="Market Research Assistance"
    heroSubtitle="Get market research tasks executed by verified performers. Sizing, competitor intel, consumer insights, and report preparation — post a task, define deliverables, and pay when you approve the work."
    ctaTitle="Need market research executed?"
    ctaSubtitle="Post your research brief with clear questions and deliverables. Performers with research experience will execute and submit reports or data."
  >
    <section className="py-16 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-10 text-center">
          What we help you execute
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--color-primary)]/15 bg-white p-6 flex gap-4"
            >
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
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4 text-center">
          Types of market research you can post
        </h2>
        <p className="text-gray-600 text-center mb-8">
          From one-off reports to ongoing research streams, post tasks that match your scope.
        </p>
        <ul className="space-y-3">
          {EXAMPLES.map((item) => (
            <li
              key={item}
              className="flex gap-3 items-center rounded-lg bg-white border border-gray-100 px-4 py-3 text-gray-700"
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

export default MarketResearchAssistancePage;
