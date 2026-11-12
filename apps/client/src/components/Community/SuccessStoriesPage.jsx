import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

// Example success stories / case studies. Replace with real data or API when available.
const STORIES = [
  {
    id: 1,
    type: "Task Provider",
    title: "Startup got branding and research done within budget",
    quote: "We needed competitor research and logo concepts without hiring full-time. FirstDoer let us post clear tasks, get multiple options, and pay only when we approved. Turnaround was faster than we expected.",
    outcome: "Delivered: 3 logo concepts, competitor landscape doc. One performer is now our go-to for ongoing design tasks.",
    category: "Content, Design & Marketing",
  },
  {
    id: 2,
    type: "Task Performer",
    title: "Researcher turned part-time tasks into steady side income",
    quote: "I joined as a performer and started with market research tasks. Good ratings led to repeat providers. Now I complete a few tasks every week alongside my day job.",
    outcome: "50+ tasks completed, 4.9 average rating. Regular clients for industry reports and data cleanup.",
    category: "Business Operations & Research",
  },
  {
    id: 3,
    type: "Task Provider",
    title: "Cafe owner found local help for menu design and content",
    quote: "I needed a menu redesign and short videos for social. I posted two tasks, got local performers, and had everything done in under two weeks. No agency fees.",
    outcome: "New menu design and 5 short-form videos. Same performer now helps with monthly content.",
    category: "Content, Design & Marketing",
  },
  {
    id: 4,
    type: "Task Performer",
    title: "Student earned while building a portfolio in design",
    quote: "I wanted real client work for my portfolio. FirstDoer gave me small design and editing tasks. I built a profile, got reviews, and now get invited to more projects.",
    outcome: "30+ tasks completed. Portfolio updated with real deliverables; considering freelancing full-time after graduation.",
    category: "Content, Design & Marketing",
  },
];

const SuccessStoriesPage = () => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title="Success Stories & Case Studies | FirstDoer"
      description="Success stories and case studies from task providers and performers on FirstDoer. Real outcomes from research, design, field work, and content tasks."
      keywords="FirstDoer success stories, case studies, task provider stories, task performer stories, task marketplace India"
      canonical="https://www.firstdoer.com/community/success-stories"
    />
    <section className="pt-24 pb-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium text-sm mb-8 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Community
        </Link>
        <header className="border-b border-gray-200 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
            Success Stories &amp; Case Studies
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            How task providers and performers use FirstDoer. Real outcomes — research, design, field work, and more.
          </p>
        </header>

        <div className="space-y-10">
          {STORIES.map((story) => (
            <article
              key={story.id}
              className="rounded-xl border border-[var(--color-primary)]/15 bg-white p-6 md:p-8"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                {story.type}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{story.title}</h2>
              <div className="flex gap-2 text-gray-600 mb-4">
                <span className="text-2xl font-serif text-[var(--color-primary)]/60 leading-none shrink-0">&ldquo;</span>
                <p className="italic">{story.quote}</p>
              </div>
              <p className="text-gray-700 text-sm border-l-2 border-[var(--color-primary)]/30 pl-4">
                <strong>Outcome:</strong> {story.outcome}
              </p>
              <p className="text-gray-500 text-xs mt-3">{story.category}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default SuccessStoriesPage;
