import React from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, CheckSquare, ArrowRight } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

const COMMUNITY_LINKS = [
  {
    slug: "success-stories",
    title: "Success Stories & Case Studies",
    description: "How task providers and performers use FirstDoer. Real outcomes from research, design, field work, and more.",
    icon: BookOpen,
  },
  {
    slug: "top-performers",
    title: "Top Performers Leaderboard",
    description: "Recognising performers with high ratings and completed tasks. See who's delivering great work on the platform.",
    icon: Award,
  },
  {
    slug: "completed-tasks-examples",
    title: "Completed Tasks Examples",
    description: "Examples of tasks completed on FirstDoer — categories, outcomes, and the kind of work that gets done.",
    icon: CheckSquare,
  },
];

const CommunityIndexPage = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Community | Success Stories, Leaderboard & Examples | FirstDoer"
      description="Success stories, top performers leaderboard, and completed task examples. See real platform activity and how people use FirstDoer."
      keywords="FirstDoer community, success stories, case studies, top performers, leaderboard, completed tasks examples, task marketplace India"
      canonical="https://www.firstdoer.com/community"
      webPageSchema={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Community | FirstDoer",
        "description": "Success stories, leaderboard, and completed task examples.",
        "url": "https://www.firstdoer.com/community",
      }}
    />

    <section className="pt-24 pb-16 px-6 md:px-20 bg-gradient-to-b from-[var(--color-primary)]/5 to-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-primary)] mb-4 leading-tight">
          Community &amp; Growth
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Success stories, top performers, and examples of completed tasks. Real activity from the FirstDoer platform.
        </p>
      </div>
    </section>

    <section className="py-16 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-1">
          {COMMUNITY_LINKS.map((item) => (
            <Link
              key={item.slug}
              to={`/community/${item.slug}`}
              className="group flex gap-4 rounded-xl border border-[var(--color-primary)]/15 bg-white p-6 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                <item.icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-[var(--color-primary)] mb-1 group-hover:underline text-lg">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-medium text-sm mt-2">
                  View
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default CommunityIndexPage;
