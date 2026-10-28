import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckSquare, FileText, BarChart2, MapPin, Edit3 } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

// Example completed tasks across categories. Replace with API or CMS when available.
const CATEGORY_ICONS = { FileText, BarChart2, MapPin, Edit3 };
const EXAMPLES = [
  {
    category: "Business Operations & Research",
    icon: "BarChart2",
    tasks: [
      { title: "Competitor pricing analysis for FMCG brand", outcome: "Delivered 12-page report with comparison matrix and recommendations." },
      { title: "Market sizing for ed-tech segment", outcome: "TAM/SAM/SOM analysis with sources and assumptions." },
      { title: "CRM data cleanup and lead enrichment", outcome: "500+ records cleaned and enriched; delivered in CSV." },
    ],
  },
  {
    category: "Content, Design & Marketing",
    icon: "Edit3",
    tasks: [
      { title: "10 LinkedIn posts for B2B startup", outcome: "Copy and suggested visuals delivered; 2 rounds of edits included." },
      { title: "Logo concepts for cafe launch", outcome: "3 concepts with source files; one selected and refined." },
      { title: "Blog post and meta description (SEO)", outcome: "1,200-word article + meta; published on client's CMS." },
    ],
  },
  {
    category: "On-Ground & Local Assistance",
    icon: "MapPin",
    tasks: [
      { title: "Store availability check (5 outlets)", outcome: "Photos and checklist submitted per store; same-day completion." },
      { title: "Mystery shopping visit and report", outcome: "Structured report with ratings and photos as per brief." },
      { title: "Local document collection and scan", outcome: "Documents collected, scanned, and shared securely." },
    ],
  },
  {
    category: "Tech, Data and Admin",
    icon: "FileText",
    tasks: [
      { title: "Data entry from PDF to spreadsheet", outcome: "200+ rows entered with validation; delivered in Google Sheet." },
      { title: "API documentation summary", outcome: "Concise doc with endpoints, params, and example responses." },
      { title: "Spreadsheet formatting and formulas", outcome: "Dashboard-style sheet with conditional formatting and checks." },
    ],
  },
];

const CompletedTasksExamplesPage = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Completed Tasks Examples | OnIT INDIA"
      description="Examples of tasks completed on OnIT INDIA — research, design, field work, content, and data. See the kind of work that gets done on the platform."
      keywords="OnIT INDIA completed tasks, task examples, research tasks, design tasks, field tasks India"
      canonical="https://www.onitindia.com/community/completed-tasks-examples"
    />
    <section className="pt-24 pb-16 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-[#004d43] font-medium text-sm mb-8 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Community
        </Link>
        <header className="border-b border-gray-200 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#004d43]/10 flex items-center justify-center">
              <CheckSquare size={24} className="text-[#004d43]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d43]">
              Completed Tasks Examples
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Real examples of tasks completed on OnIT INDIA. These show the range of work — research, design, field visits, content, and data — and typical outcomes.
          </p>
        </header>

        <div className="space-y-10">
          {EXAMPLES.map((group) => {
            const Icon = CATEGORY_ICONS[group.icon] || FileText;
            return (
              <section key={group.category}>
                <h2 className="text-lg font-bold text-[#004d43] mb-4 flex items-center gap-2">
                  <Icon size={20} />
                  {group.category}
                </h2>
                <ul className="space-y-4">
                  {group.tasks.map((task, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-[#004d43]/10 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <span className="font-medium text-gray-900">{task.title}</span>
                      <span className="text-gray-600 text-sm shrink-0">{task.outcome}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/for-providers"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#004d43] text-white font-semibold hover:bg-[#016b5c] transition-colors"
          >
            Post a task
          </Link>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default CompletedTasksExamplesPage;
