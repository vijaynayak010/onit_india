import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";
import CategoryCrossLinks from "../../components/landing/CategoryCrossLinks";
import { useCases } from "../../data/useCases";

const UseCasesIndexPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <SEO
        title="Use Cases | For Startups, Creators, Businesses & More | FirstDoer"
        description="FirstDoer for startups, creators, businesses, marketers, agencies, enterprises, researchers, and e‑commerce. Get tasks done on demand. Task execution platform India."
        keywords="FirstDoer use cases, for startups, for creators, for businesses, task execution India, task marketplace for startups, for marketers, for agencies"
        canonical="https://www.firstdoer.com/use-cases"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Use Cases | FirstDoer",
          "description": "Who uses FirstDoer: startups, creators, businesses, and more.",
          "url": "https://www.firstdoer.com/use-cases",
        }}
      />

      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[var(--color-primary)] mb-3 sm:mb-4 leading-tight font-heading">
            Who uses FirstDoer
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get research, design, content, and data tasks done on demand — whether you're a startup, creator, business, or team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
          <CategoryCrossLinks
            title="Explore more"
            links={[
              { to: "/tasks", label: "Task categories" },
              { to: "/#domain", label: "By domain" },
            ]}
            ctaPrimary={{ to: "/", label: "Post Your Task" }}
            ctaSecondary={{ to: "/task-performers", label: "Get Work Executed" }}
            variant="teal"
          />
        </div>

        <div className="max-w-4xl mx-auto grid gap-3.5 sm:gap-4 sm:grid-cols-2">
          {useCases.map((uc) => (
            <Link
              key={uc.slug}
              to={`/${uc.slug}`}
              className="group rounded-2xl border border-gray-200 bg-gray-50/50 p-4 sm:p-6 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 transition-all flex items-center justify-between gap-3 sm:gap-4 shadow-xs"
            >
              <div>
                <h2 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-[var(--color-primary)] font-heading">
                  {uc.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 leading-snug">{uc.headline}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-primary)] flex-shrink-0" />
            </Link>
          ))}
        </div>

        <p className="text-center mt-10 text-gray-600">
          <Link to="/for-providers" className="text-[var(--color-primary)] font-semibold hover:underline">
            Post tasks as a provider
          </Link>
          {" · "}
          <Link to="/for-performers" className="text-[var(--color-primary)] font-semibold hover:underline">
            Join as a performer
          </Link>
        </p>

        <div className="max-w-4xl mx-auto mt-10">
          <CategoryCrossLinks
            title="Explore more"
            links={[
              { to: "/tasks", label: "Task categories" },
              { to: "/#domain", label: "By domain" },
            ]}
            ctaPrimary={{ to: "/", label: "Post Your Task" }}
            ctaSecondary={{ to: "/task-performers", label: "Get Work Executed" }}
            variant="teal"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UseCasesIndexPage;
