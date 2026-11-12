import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Briefcase } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const CareersThankYouPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Application Received | FirstDoer Careers"
        description="Thank you for applying to FirstDoer. We have received your application and will review it. We will get in touch with shortlisted candidates."
        keywords="FirstDoer application received, job application submitted, careers confirmation"
        canonical="https://www.firstdoer.com/careers/thank-you"
        noindex
      />
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-5 sm:mb-6">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium text-[var(--color-primary)] mb-2 sm:mb-3">
            Application received
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
            Thank you for applying. We review all applications and will contact
            shortlisted candidates within 5–7 working days. For any questions,
            email{" "}
            <a
              href="mailto:support@firstdoer.com"
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              support@firstdoer.com
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px]"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/5 transition-colors min-h-[44px]"
            >
              <Briefcase size={18} />
              View other roles
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CareersThankYouPage;
