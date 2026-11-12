import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "react-feather";
import SEO from "../seo/SEO";
import Footer from "../layout/Footer";

/**
 * Reusable layout for service landing pages (hero, sections, CTA).
 * Pass title, description, keywords, canonical, children (sections), and ctaTitle/ctaSubtitle.
 */
const ServiceLandingLayout = ({
  title,
  description,
  keywords,
  canonical,
  heroTitle,
  heroSubtitle,
  children,
  ctaTitle = "Ready to get started?",
  ctaSubtitle = "Post your task on FirstDoer and connect with verified performers who can deliver.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        canonical={canonical}
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": canonical,
        }}
      />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[var(--color-primary)]/5 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[var(--color-primary)] mb-3 sm:mb-4 leading-tight font-heading">
            {heroTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => navigate("/provider/post-task-selection")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all text-sm sm:text-base shadow-sm hover:shadow active:scale-[0.98] min-h-[44px]"
            >
              Post a task
              <ArrowRight size={20} />
            </button>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)]/5 transition-all text-sm sm:text-base min-h-[44px]"
            >
              Sign up / Log in
            </Link>
          </div>
        </div>
      </section>

      {children}

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-2xl bg-[var(--color-primary)] text-white p-6 sm:p-8 md:p-10 shadow-md">
            <h2 className="text-xl sm:text-2xl font-medium mb-3 font-heading">{ctaTitle}</h2>
            <p className="text-white/90 mb-6 text-sm sm:text-base leading-relaxed">{ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate("/auth", { state: { authMode: "signup" } })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[var(--color-primary)] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base min-h-[44px]"
              >
                Sign up
                <ArrowRight size={18} />
              </button>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base min-h-[44px]"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceLandingLayout;
