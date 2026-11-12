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
    <div className="min-h-screen bg-[#f3f4f6] pt-[100px] pb-16 px-4 sm:px-6 md:px-12 lg:px-24">
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
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {domain.title}
        </Link>

        <div className="bg-white rounded-3xl shadow-md border border-green-100 overflow-hidden p-6 sm:p-8 md:p-10">
          <p className="text-xs uppercase tracking-widest text-green-600 font-semibold mb-1">
            {domainLabel} · {blockTitle}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {itemName}
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            Get <strong>{itemName.toLowerCase()}</strong> done on FirstDoer. Post your task in this category,
            get matched with vetted performers who specialize in {blockTitle.toLowerCase()}, and manage everything from your dashboard.
          </p>

          <div className="rounded-2xl bg-green-50 border border-green-100 p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What you can do</h2>
            <ul className="text-gray-700 text-sm sm:text-base space-y-1 list-disc list-inside">
              <li>Post a task for {itemName.toLowerCase()}</li>
              <li>Receive offers from qualified performers</li>
              <li>Collaborate and pay securely on the platform</li>
              <li>Scale to ongoing work if needed</li>
            </ul>
          </div>

          <Link
            to="/auth"
            className="block text-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Post a task for {itemName.toLowerCase()}
          </Link>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to={`/domains/${domainSlug}`} className="text-green-600 hover:underline">
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
