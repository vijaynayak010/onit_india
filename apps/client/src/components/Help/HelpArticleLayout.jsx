import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

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
    <section className="pt-24 pb-8 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/help"
          className="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium text-sm mb-6 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Help
        </Link>
        {children}
      </div>
    </section>
    <Footer />
  </div>
);

export default HelpArticleLayout;
