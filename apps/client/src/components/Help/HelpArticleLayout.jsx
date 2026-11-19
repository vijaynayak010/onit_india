import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import SEO from "../seo/SEO";

/**
 * Wraps a help article with back link, SEO, and footer.
 * Pass slug for canonical URL (e.g. "getting-started").
 */
const HelpArticleLayout = ({ title, description, slug, children }) => (
  <div className="min-h-screen bg-white text-gray-800">
    <SEO
      title={title}
      description={description}
      canonical={slug ? `https://www.firstdoer.com/help/${slug}` : undefined}
    />
    <section className="pt-6 sm:pt-10 pb-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/help"
          className="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium text-sm mb-6 hover:underline min-h-[44px]"
        >
          <ArrowLeft size={16} />
          Back to Help
        </Link>
        {children}
      </div>
    </section>
  </div>
);

export default HelpArticleLayout;
