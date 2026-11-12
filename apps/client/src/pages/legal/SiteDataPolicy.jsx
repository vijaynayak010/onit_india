import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const SiteDataPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 relative z-10">
      <SEO
        title="Cookie Policy | FirstDoer"
        description="How FirstDoer uses cookies and similar technologies. Information about analytics, preferences, and your choices. Read our cookie policy for the task execution platform."
        keywords="FirstDoer cookie policy, cookies policy, site data, analytics cookies, FirstDoer privacy, browser cookies, task marketplace India data"
        canonical="https://www.firstdoer.com/cookie-policy"
      />
      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>

          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
              Cookie Policy
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              <strong>Effective Date:</strong> March 2026
            </p>
            <p className="text-gray-600 text-sm md:text-base mt-4">
              This Cookie Policy explains how FirstDoer ("we", "us", "our") uses
              cookies and similar technologies when you use our website and
              platform. It should be read together with our{" "}
              <Link to="/privacy-policy" className="text-[var(--color-primary)] font-medium hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </header>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                1. What are cookies?
              </h2>
              <p>
                Cookies are small text files that are stored on your device
                (computer, tablet, or mobile) when you visit a website. They are
                widely used to make websites work more efficiently, remember
                your preferences, and provide information to the site owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                2. How we use cookies
              </h2>
              <p className="mb-3">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essential:</strong> Required for the website to
                  function (e.g. authentication, security, load balancing).
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how visitors use
                  our site (e.g. Google Analytics). This helps us improve
                  content and experience.
                </li>
                <li>
                  <strong>Preferences:</strong> To remember your settings and
                  choices where applicable.
                </li>
                <li>
                  <strong>Performance:</strong> To measure and improve site
                  performance and reliability.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                3. Third-party cookies
              </h2>
              <p>
                We may use services that set their own cookies, for example
                Google Analytics (gtag) for traffic and usage analysis. These
                third parties have their own privacy and cookie policies. We
                do not control the use of cookies by third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                4. Your choices
              </h2>
              <p className="mb-3">
                You can control or delete cookies through your browser settings.
                Blocking or deleting cookies may affect how the website works
                and your experience (e.g. you may need to log in again or some
                features may not work).
              </p>
              <p>
                For Google Analytics, you can use the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] font-medium hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>{" "}
                to prevent your data from being used by Google Analytics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                5. Updates
              </h2>
              <p>
                We may update this Cookie Policy from time to time. The
                effective date at the top will reflect the latest version. We
                encourage you to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                6. Contact
              </h2>
              <p>
                For questions about our use of cookies or this policy, contact
                us at{" "}
                <a
                  href="mailto:support@firstdoer.com"
                  className="text-[var(--color-primary)] font-medium hover:underline"
                >
                  support@firstdoer.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SiteDataPolicy;
