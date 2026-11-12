import React from "react";
import { Link } from "react-router-dom";
import { Home, Mail, ArrowLeft } from "react-feather";
import SEO from "../components/seo/SEO";
import Footer from "../components/layout/Footer";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist or has been moved. Return to FirstDoer task execution platform homepage."
        noindex
      />
      <section className="flex-1 pt-32 pb-16 px-6 md:px-20 flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-6xl md:text-8xl font-black text-[var(--color-primary)]/10 mb-4">404</p>
          <h1 className="text-2xl md:text-3xl font-medium text-[var(--color-primary)] mb-3">
            Page not found
          </h1>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn’t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              <Mail size={18} />
              Contact Us
            </Link>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-8 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Return to homepage
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
