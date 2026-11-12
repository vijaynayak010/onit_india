import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Mail } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const ContactThankYouPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Message Received | FirstDoer"
        description="Thank you for contacting FirstDoer. We have received your message and will get back to you soon. Task execution platform support."
        keywords="FirstDoer contact received, message sent, contact confirmation, FirstDoer support"
        canonical="https://www.firstdoer.com/contact/thank-you"
        noindex
      />
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-5 sm:mb-6">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium text-[var(--color-primary)] mb-2 sm:mb-3">
            Thank you for reaching out
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
            We’ve received your message and will get back to you as soon as we
            can. If your query is urgent, please mention it in a follow-up
            email to{" "}
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
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/5 transition-colors min-h-[44px]"
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
