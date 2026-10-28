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
  ctaSubtitle = "Post your task on OnIT INDIA and connect with verified performers who can deliver.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-800">
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
      <section className="pt-24 pb-16 px-6 md:px-20 bg-gradient-to-b from-[#004d43]/5 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004d43] mb-4 leading-tight">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/provider/post-task-selection")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#004d43] text-white font-semibold hover:bg-[#016b5c] transition-colors text-base"
            >
              Post a task
              <ArrowRight size={20} />
            </button>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[#004d43] text-[#004d43] font-semibold hover:bg-[#004d43]/5 transition-colors text-base"
            >
              Sign up / Log in
            </Link>
          </div>
        </div>
      </section>

      {children}

      {/* CTA */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-2xl bg-[#004d43] text-white p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-bold mb-3">{ctaTitle}</h2>
            <p className="text-white/90 mb-6">{ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/auth", { state: { authMode: "signup" } })}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-[#004d43] font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign up
                <ArrowRight size={18} />
              </button>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-colors"
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
