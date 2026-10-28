import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import { domains } from "./Domains";
import { motion } from "framer-motion";
import SEO from "../../components/seo/SEO";
import CategoryCrossLinks from "../../components/landing/CategoryCrossLinks";
import { domainSubDomainMap, slugifyItem } from "../../data/domainSubDomains";

const DomainDetail = () => {
  const { slug } = useParams();
  const domain = domains.find((d) => d.slug === slug);
  const subDomainConfig = domainSubDomainMap[slug || ""];

  if (!domain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-semibold mb-4">Domain not found</h1>
          <Link
            to="/#domain"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore Domains
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = `${domain.title} – Domain Details`;
  const pageDescription = `${domain.description} Explore structured sub-domains and example work you can delegate in this area on OnIT INDIA.`;
  const pageKeywords = [
    domain.title,
    "OnIT INDIA",
    "task execution",
    "task marketplace",
    "domains",
    "sub-domains",
  ].join(", ");
  const canonicalPath = `/domains/${slug}`;

  return (
    <div className="min-h-screen bg-[#f3f4f6] pt-[100px] pb-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonical={`https://www.onitindia.com${canonicalPath}`}
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: pageTitle,
          description: pageDescription,
          url: `https://www.onitindia.com${canonicalPath}`,
        }}
      />
      <div className="max-w-5xl mx-auto">
        <Link
          to="/#domain"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore Domains
        </Link>

        <div className="bg-white rounded-3xl shadow-md border border-green-100 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {domain.title}
              </h1>
              <p className="text-gray-700 text-base sm:text-lg mb-6">
                {domain.description}
              </p>

              <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                <p className="font-semibold text-gray-900">
                  What you can get done in this domain:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Post specific tasks related to {domain.title.toLowerCase()}.</li>
                  <li>Connect with vetted performers who specialize in this area.</li>
                  <li>Track progress and manage communication from your dashboard.</li>
                  <li>Scale from one-off tasks to ongoing work as needed.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden bg-slate-100 border border-green-100">
                {domain.animation ? (
                  <div className="w-full h-56 sm:h-64 bg-white flex items-center justify-center">
                    <iframe
                      src={domain.animation}
                      className="w-full h-full border-0 scale-110"
                      title={`${domain.title} animation`}
                    />
                  </div>
                ) : domain.video ? (
                  <video
                    src={domain.video}
                    className="w-full h-56 sm:h-64 object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={domain.image || domain.img}
                    alt={domain.title}
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                )}
              </div>

              <Link
                to="/auth"
                className="block text-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Start a task in this domain
              </Link>
            </div>
          </div>
        </div>

        {subDomainConfig && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 sm:mt-12 md:mt-14"
          >
            <div className="bg-white rounded-3xl shadow-md border border-slate-100 px-5 sm:px-7 md:px-10 py-6 sm:py-8 md:py-10">
              <div className="max-w-3xl mb-6 sm:mb-8">
                <p className="text-xs uppercase tracking-widest text-green-600 font-semibold mb-1">
                  {subDomainConfig.label}
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  Complete sub-domain coverage
                </h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  The work in this domain is organized into clear sub-domains. Each section below
                  represents a well-defined scope of work you can delegate to OnIT INDIA.
                </p>
              </div>

              <div className="grid gap-5 md:gap-6 sm:grid-cols-2">
                {subDomainConfig.subDomains.map((block, index) => (
                  <motion.div
                    key={block.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: (index % 4) * 0.05 }}
                    className="h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-green-600 text-white text-xs font-semibold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                          {block.title}
                        </h3>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/70 pt-3 mt-1">
                      <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                        Typical work covered
                      </p>
                      <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {block.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                            <Link
                              to={`/domains/${slug}/${slugifyItem(item)}`}
                              className="text-green-700 hover:text-green-800 hover:underline"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        <div className="mt-10">
          <CategoryCrossLinks
            title="Explore other domains"
            links={domains.filter((d) => d.slug !== slug).map((d) => ({ to: `/domains/${d.slug}`, label: d.title }))}
            ctaPrimary={{ to: "/", label: "Post Your Task" }}
            ctaSecondary={{ to: "/task-performers", label: "Get Work Executed" }}
            variant="green"
          />
        </div>
      </div>
    </div>
  );
};

export default DomainDetail;

