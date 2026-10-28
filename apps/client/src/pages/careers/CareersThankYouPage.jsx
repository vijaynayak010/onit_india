import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Briefcase } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const CareersThankYouPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Application Received | OnIT INDIA Careers"
        description="Thank you for applying to OnIT INDIA. We have received your application and will review it. We will get in touch with shortlisted candidates."
        keywords="OnIT INDIA application received, job application submitted, careers confirmation"
        canonical="https://www.onitindia.com/careers/thank-you"
        noindex
      />
      <section className="pt-24 pb-16 px-6 md:px-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-[#004d43] mb-6">
            <CheckCircle size={36} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-3">
            Application received
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for applying. We review all applications and will contact
            shortlisted candidates within 5–7 working days. For any questions,
            email{" "}
            <a
              href="mailto:support@onitindia.com"
              className="text-[#004d43] font-medium hover:underline"
            >
              support@onitindia.com
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#004d43] text-white font-semibold hover:bg-[#016b5c] transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-[#004d43] text-[#004d43] font-semibold hover:bg-[#004d43]/5 transition-colors"
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
