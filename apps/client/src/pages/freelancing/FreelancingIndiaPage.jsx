import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, CheckCircle, DollarSign, Search, Shield, Users } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import { SITE_URL } from "../../config/seo";

const benefits = [
  {
    icon: Search,
    title: "Find clearly defined freelance work",
    copy: "Browse task-based opportunities in writing, design, research, data, marketing, technology, administration, and local field work.",
  },
  {
    icon: Briefcase,
    title: "Build proof through completed tasks",
    copy: "Use real deliverables, ratings, and a reliable completion history to strengthen your professional profile over time.",
  },
  {
    icon: DollarSign,
    title: "Work with transparent task scope",
    copy: "Understand the expected outcome, deadline, and payment before you start instead of relying on open-ended project discussions.",
  },
  {
    icon: Shield,
    title: "Use one structured workflow",
    copy: "Keep task communication, progress, proof of work, completion, and payments connected in one execution flow.",
  },
];

const categories = [
  ["Content writing and editing", "/domains/content-design-marketing"],
  ["Graphic design and social media", "/services/social-media-content-creation-services"],
  ["Video editing", "/services/short-form-video-editing-services"],
  ["Market and business research", "/domains/business-operations-research"],
  ["Data, technology, and admin", "/domains/tech-data-admin"],
  ["Academic support", "/domains/academic-knowledge-support"],
  ["Retail audits and field work", "/services/retail-audit-services"],
  ["Local verification tasks", "/domains/on-ground-local-assistance"],
];

const faqs = [
  {
    question: "What is freelancing?",
    answer: "Freelancing is independent work completed for clients without becoming their full-time employee. The work may be a long project, a recurring engagement, or a single clearly defined task.",
  },
  {
    question: "How is task-based work different from traditional freelancing?",
    answer: "Traditional freelancing often involves proposals, negotiation, and projects lasting weeks or months. Task-based work focuses on a specific outcome with a clearer scope and shorter execution cycle. Many independent professionals use both models.",
  },
  {
    question: "Can beginners find freelance work on OnIT INDIA?",
    answer: "OnIT INDIA includes task categories that suit different experience levels. Beginners should complete their profile accurately, choose work that matches their current skills, communicate clearly, and build a reliable record one task at a time.",
  },
  {
    question: "What freelance services can businesses hire for?",
    answer: "Businesses can use OnIT INDIA for content, design, research, data operations, administration, marketing support, technology tasks, field verification, retail audits, and other clearly defined work.",
  },
  {
    question: "How should I write a good freelance task brief?",
    answer: "State the outcome you need, relevant background, required format, deadline, examples, and acceptance criteria. A precise brief helps performers estimate the work and reduces revisions.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Freelancing in India",
      item: `${SITE_URL}/freelancing`,
    },
  ],
};

export default function FreelancingIndiaPage() {
  const canonical = `${SITE_URL}/freelancing`;
  const description = "Explore freelancing in India with OnIT INDIA. Find task-based freelance work or hire skilled performers for writing, design, research, data, tech, and local tasks.";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEO
        title="Freelancing in India: Find Work & Hire Skilled Talent"
        description={description}
        canonical={canonical}
        keywords="freelancing India, freelance jobs India, freelance work online, hire freelancers India, freelance marketplace India, task-based work, gig work India"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${canonical}#webpage`,
          name: "Freelancing in India",
          description,
          url: canonical,
          inLanguage: "en-IN",
          isPartOf: { "@id": `${SITE_URL}/#website` },
        }}
        additionalSchemas={[breadcrumbSchema, faqSchema]}
      />

      <main>
        <section className="border-b border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_52%,#eff6ff_100%)] px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
              <Link to="/" className="hover:text-emerald-700">Home</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span>Freelancing in India</span>
            </nav>
            <div className="max-w-4xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Freelance and task-based work
              </p>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Freelancing in India, built around work that gets completed
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
                OnIT INDIA connects people and businesses that need work done with independent performers ready to execute it. Find freelance tasks that match your skills, or hire talent for a clear outcome without a long recruitment cycle.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/for-performers" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800">
                  Find freelance work <ArrowRight size={18} />
                </Link>
                <Link to="/for-providers" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-900 transition hover:border-emerald-600 hover:text-emerald-700">
                  Hire skilled performers <Users size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">A practical route into independent work</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Freelancing gives people the freedom to work independently, choose the skills they offer, and collaborate with different clients. It also gives businesses flexible access to talent without creating a permanent role for every need. The difficult part is often not the work itself; it is finding the right match, agreeing on scope, coordinating delivery, and verifying completion.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                OnIT INDIA is designed for that execution gap. A provider posts a defined task, performers respond or are matched based on relevant skills, and the work moves through a structured completion process. This model works especially well for short freelance assignments, recurring operational tasks, and outcomes that can be clearly described and reviewed.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {benefits.map((benefit) => (
                <article key={benefit.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    {React.createElement(benefit.icon, { size: 22 })}
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{benefit.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-6 py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-400">For freelancers and performers</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Turn useful skills into completed work</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Create an accurate profile, select the categories you can deliver confidently, and focus on clear communication and dependable execution. Each successful task can help you build experience, proof of work, and a stronger reputation.
              </p>
              <ul className="mt-6 space-y-3 text-slate-200">
                {["Choose work aligned with your real skills", "Review scope and deadlines before accepting", "Keep progress and delivery evidence organized", "Use ratings and completed work to build credibility"].map((item) => (
                  <li key={item} className="flex gap-3"><CheckCircle className="mt-0.5 shrink-0 text-emerald-400" size={20} />{item}</li>
                ))}
              </ul>
              <Link to="/task-performers" className="mt-8 inline-flex items-center gap-2 font-bold text-emerald-400 hover:text-emerald-300">
                Learn how task performers work <ArrowRight size={18} />
              </Link>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">For clients and businesses</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Hire for the outcome you need</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Use freelance talent when a task needs specialist attention, extra capacity, or fast execution. A good brief explains the result, context, format, deadline, and quality standard so performers can respond accurately.
              </p>
              <ul className="mt-6 space-y-3 text-slate-200">
                {["Post one-off or recurring work", "Compare relevant performer profiles", "Coordinate against a defined deliverable", "Review completion before closing the task"].map((item) => (
                  <li key={item} className="flex gap-3"><CheckCircle className="mt-0.5 shrink-0 text-blue-400" size={20} />{item}</li>
                ))}
              </ul>
              <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-2 font-bold text-blue-400 hover:text-blue-300">
                See how OnIT INDIA works <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Popular freelance and task categories</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              Explore focused service and domain pages to understand the kinds of outcomes you can request or deliver.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map(([label, to]) => (
                <Link key={label} to={to} className="group flex min-h-28 items-end justify-between rounded-2xl border border-slate-200 p-5 font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-lg">
                  <span>{label}</span>
                  <ArrowRight className="shrink-0 text-emerald-700 transition group-hover:translate-x-1" size={19} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Freelancing questions</h2>
            <div className="mt-8 space-y-4">
              {faqs.map(({ question, answer }) => (
                <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm">
                  <summary className="cursor-pointer list-none pr-8 text-lg font-bold marker:content-none">{question}</summary>
                  <p className="mt-3 leading-7 text-slate-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-3xl rounded-3xl bg-emerald-700 px-6 py-12 text-white sm:px-12">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Ready to move from intent to execution?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-emerald-50">
              Join as a performer to find task-based freelance opportunities, or post the work you need and connect with skilled talent.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/auth" className="rounded-full bg-white px-6 py-3 font-bold text-emerald-800 hover:bg-emerald-50">Get started</Link>
              <Link to="/services" className="rounded-full border border-emerald-300 px-6 py-3 font-bold text-white hover:bg-emerald-800">Explore services</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
