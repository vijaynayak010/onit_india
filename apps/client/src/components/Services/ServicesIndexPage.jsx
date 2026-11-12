import React from "react";
import { Link } from "react-router-dom";
import { Clipboard, MapPin, Edit3, Search, Share2, FileText, Image, Play, ArrowRight, ArrowRightCircle } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";
import { domains } from "../../pages/domains/Domains";

// Add more services here. For each new service you also need to:
// 1. Create a new page in Services/ (e.g. NewServicePage.jsx) using ServiceLandingLayout
// 2. Add the route in App.jsx: <Route path="/services/your-slug" element={<NewServicePage />} />
// 3. Add an entry below (slug, title, description, icon from react-feather)
const SERVICES = [
  {
    slug: "retail-audit-services",
    title: "Retail Audit Services",
    description: "Store compliance, planogram audits, merchandising verification, and multi-location retail audits executed by verified field performers.",
    icon: Clipboard,
    keywords: "store audit, planogram, compliance",
  },
  {
    slug: "field-data-collection-services",
    title: "Field Data Collection Services",
    description: "On-the-ground data collection: store visits, surveys, location verification, and custom forms. Structured data and proof delivered on completion.",
    icon: MapPin,
    keywords: "field survey, store visit, data collection",
  },
  {
    slug: "content-marketing-task-execution",
    title: "Content Marketing Task Execution",
    description: "Content creation, social media posting, SEO updates, and campaign execution. Scale marketing tasks without full-time hires.",
    icon: Edit3,
    keywords: "content tasks, social media, SEO",
  },
  {
    slug: "market-research-assistance",
    title: "Market Research Assistance",
    description: "Market sizing, competitor research, consumer insights, surveys, and report execution. Post research tasks and pay when delivered.",
    icon: Search,
    keywords: "market research, competitor research, surveys",
  },
  {
    slug: "social-media-content-creation-services",
    title: "Social Media Content Creation Services",
    description: "Posts, captions, hashtags, and ad copy for Facebook, Instagram, LinkedIn, and more. Scale social content without a full-time team.",
    icon: Share2,
    keywords: "social media content, caption writing, post writing",
  },
  {
    slug: "blog-writing-services-for-startups",
    title: "Blog Writing Services for Startups",
    description: "Blog posts, articles, and website copy for startups. SEO-friendly content on demand. Post a task, get drafts delivered.",
    icon: FileText,
    keywords: "blog writing for startups, startup content, article writing",
  },
  {
    slug: "seo-keyword-research-services",
    title: "SEO Keyword Research Services",
    description: "Keyword lists, volume and difficulty, competitor and gap analysis. Get research delivered by verified performers.",
    icon: Search,
    keywords: "SEO keyword research, keyword research India",
  },
  {
    slug: "instagram-post-design-services",
    title: "Instagram Post Design Services",
    description: "Feed posts, carousels, stories, and Reels thumbnails. On-brand creatives on demand. Post a task, get designs delivered.",
    icon: Image,
    keywords: "Instagram design, feed post design, carousel design",
  },
  {
    slug: "short-form-video-editing-services",
    title: "Short-Form Video Editing Services (Reels / Shorts)",
    description: "Reels, Shorts, and TikTok edits. Captions, cuts, and music. Post your footage and brief, pay when the edit is approved.",
    icon: Play,
    keywords: "Reels editing, Shorts editing, video editing India",
  },
];

const ServicesIndexPage = () => (
  <div className="min-h-screen bg-white text-gray-800 font-sans">
    <SEO
      title="Services | Task Execution Services | FirstDoer"
      description="Retail audits, field data collection, content marketing execution, and market research assistance. Post tasks and get work done by verified performers across India. FirstDoer."
      keywords="task execution services, retail audit services, field data collection, content marketing tasks, market research assistance, FirstDoer services"
      canonical="https://www.firstdoer.com/services"
      webPageSchema={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Services | FirstDoer",
        "description": "Task execution services: retail audits, field data collection, content marketing, market research.",
        "url": "https://www.firstdoer.com/services",
      }}
    />

    <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[var(--color-primary)]/5 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[var(--color-primary)] mb-3 sm:mb-4 leading-tight font-heading">
          Services
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Get retail audits, field data collection, content and design services, and market research
          executed by verified performers. Post a task, set your price, pay when work is done.
        </p>
      </div>
    </section>

    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="group rounded-2xl border border-[var(--color-primary)]/15 bg-white p-4 sm:p-6 flex gap-3.5 sm:gap-4 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all shadow-xs"
            >
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                <service.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-[var(--color-primary)] mb-1 group-hover:underline text-base font-heading">
                  {service.title}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-snug">{service.description}</p>
                <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-medium text-xs sm:text-sm">
                  Learn more
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Domains — explore by category */}
    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-[var(--color-primary)] mb-2 text-center font-heading">
          Explore by domain
        </h2>
        <p className="text-gray-600 text-center mb-8 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Browse task categories by domain. Click any domain to see sub-domains and example work you can post.
        </p>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <Link
              key={domain.slug}
              to={`/domains/${domain.slug}`}
              className="group rounded-2xl bg-gradient-to-br from-[#e3eafc] via-[#D9EEE3] to-[#D9EEE3] border border-green-300 p-4 sm:p-5 md:p-6 flex flex-col hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-gray-900 text-base sm:text-lg leading-tight font-heading">
                  {domain.title}
                </h3>
                <ArrowRightCircle className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed flex-1">
                {domain.description}
              </p>
              <span className="inline-flex items-center gap-1 text-[var(--color-primary)] font-medium text-xs sm:text-sm mt-3">
                View task types
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default ServicesIndexPage;
