import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Mail } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const ContactThankYouPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Message Received | OnIT INDIA"
        description="Thank you for contacting OnIT INDIA. We have received your message and will get back to you soon. Task execution platform support."
        keywords="OnIT INDIA contact received, message sent, contact confirmation, OnIT INDIA support"
        canonical="https://www.onitindia.com/contact/thank-you"
        noindex
      />
      <section className="pt-24 pb-16 px-6 md:px-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-[#004d43] mb-6">
            <CheckCircle size={36} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-3">
            Thank you for reaching out
          </h1>
          <p className="text-gray-600 mb-8">
            We’ve received your message and will get back to you as soon as we
            can. If your query is urgent, please mention it in a follow-up
            email to{" "}
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
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-[#004d43] text-[#004d43] font-semibold hover:bg-[#004d43]/5 transition-colors"
            >
              <Mail size={18} />
              Send another message
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactThankYouPage;
