import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import SEO from "../../components/seo/SEO";
import CategoryCrossLinks from "../../components/landing/CategoryCrossLinks";
import { getDomainSubDomainItem } from "../../data/domainSubDomains";
import { domains } from "./Domains";

const DomainSubDomainPage = () => {
  const { slug: domainSlug, subDomainSlug } = useParams();
  const item = getDomainSubDomainItem(domainSlug, subDomainSlug);
  const domain = domains.find((d) => d.slug === domainSlug);

  if (!item || !domain) {
    return <Navigate to={domain ? `/domains/${domainSlug}` : "/#domain"} replace />;
  }

  const { domainLabel, blockTitle, itemName } = item;
  const canonical = `https://www.firstdoer.com/domains/${domainSlug}/${subDomainSlug}`;
  const title = `${itemName} | ${domainLabel} | FirstDoer`;
  const description = `Get ${itemName.toLowerCase()} done on FirstDoer. Part of ${blockTitle} under ${domainLabel}. Post your task, get matched with vetted performers. Task marketplace India.`;
  const keywords = [
    itemName,
    domainLabel,
    blockTitle,
    "FirstDoer",
    "onitindia",
    "task marketplace India",
    "post task",
    "task execution",
  ].join(", ");

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-12 lg:px-20 font-sans">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        canonical={canonical}
        noindex
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": canonical,
        }}
      />
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/domains/${domainSlug}`}
          className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {domain.title}
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8 md:p-10">
          <p className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold mb-1">
            {domainLabel} · {blockTitle}
          </p>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-3 font-heading leading-tight">
            {itemName}
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
            Get <strong>{itemName.toLowerCase()}</strong> done on FirstDoer. Post your task in this category,
            get matched with vetted performers who specialize in {blockTitle.toLowerCase()}, and manage everything from your dashboard.
          </p>

          <div className="rounded-2xl bg-[var(--color-primary-muted)] border border-[var(--color-primary-subtle)] p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2 font-heading">What you can do</h2>
            <ul className="text-gray-700 text-sm sm:text-base space-y-1.5 list-disc list-inside">
              <li>Post a task for {itemName.toLowerCase()}</li>
              <li>Receive offers from qualified performers</li>
              <li>Collaborate and pay securely on the platform</li>
              <li>Scale to ongoing work if needed</li>
            </ul>
          </div>

          <Link
            to="/auth"
            className="block text-center w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            Post a task for {itemName.toLowerCase()}
          </Link>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to={`/domains/${domainSlug}`} className="text-[var(--color-primary)] hover:underline font-medium">
              View all sub-domains under {domain.title}
            </Link>
          </p>

          <div className="mt-8">
            <CategoryCrossLinks
              title="Explore other domains"
              links={domains.map((d) => ({ to: `/domains/${d.slug}`, label: d.title }))}
              ctaPrimary={{ to: "/", label: "Post Your Task" }}
              ctaSecondary={{ to: "/task-performers", label: "Get Work Executed" }}
              variant="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainSubDomainPage;
