import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const ContactPage = () => {
  const navigate = useNavigate();
  const contactEmail = "support@firstdoer.com";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact FirstDoer",
    "url": "https://www.firstdoer.com/contact",
    "description":
      "Get in touch with FirstDoer for platform queries, partnerships, and support around task execution and marketplace operations.",
    "mainEntity": {
      "@type": "Organization",
      "name": "FirstDoer",
      "email": contactEmail,
      "url": "https://www.firstdoer.com",
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Contact FirstDoer | Talk to the Team"
        description="Contact FirstDoer for questions about the task execution platform, partnerships, support, or feedback. Reach the team and get a response on how we can help you execute work faster."
        keywords="FirstDoer contact, contact onitindia, FirstDoer support, FirstDoer email, task execution support, task marketplace contact, get in touch FirstDoer"
        canonical="https://www.firstdoer.com/contact"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Contact FirstDoer",
          "description":
            "Contact the FirstDoer team for platform questions, support, and partnerships.",
          "url": "https://www.firstdoer.com/contact",
        }}
        schema={contactSchema}
      />

      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <header className="border-b border-gray-200 pb-6 sm:pb-8 mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[var(--color-primary)] mb-3 tracking-tight">
              Contact FirstDoer
            </h1>
            <p className="text-lg sm:text-xl font-heading font-medium text-gray-700 mb-3 sm:mb-4">
              Reach out to the team building execution infrastructure for the
              modern work economy.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Whether you are a founder, operator, creator, or potential
              partner, we are always interested in conversations around faster
              task execution, marketplace operations, and collaboration
              opportunities.
            </p>
          </header>

          <div className="grid gap-8 sm:gap-10 md:grid-cols-[1.1fr_minmax(260px,0.9fr)] items-start">
            <div className="space-y-6 sm:space-y-8">
              <section>
                <h2 className="text-lg sm:text-xl font-heading font-medium text-[var(--color-primary)] mb-3">
                  How we can help
                </h2>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  Use this contact page if you want to:
                </p>
                <ul className="space-y-2.5 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                  <li className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                    <span>
                      Understand how FirstDoer can support your execution
                      workflows and recurring tasks.
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                    <span>
                      Explore partnerships, campus initiatives, or domain
                      expansions for task categories.
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                    <span>
                      Share feedback about the product experience, reliability,
                      or new capabilities you want to see.
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg sm:text-xl font-heading font-medium text-[var(--color-primary)] mb-3">
                  Write to us
                </h2>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  For now, the fastest way to reach the team is over email.
                  Share a brief context on your question, what you are building,
                  or the kind of work you want to execute faster.
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold text-base min-h-[44px]"
                >
                  <Mail size={18} />
                  <span>{contactEmail}</span>
                  <ArrowRight size={16} className="mt-[1px]" />
                </a>
              </section>

              <section className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/15 rounded-xl p-4 sm:p-5 md:p-6">
                <h2 className="text-base sm:text-lg font-heading font-medium text-[var(--color-primary)] mb-2 sm:mb-3">
                  Share a bit of context
                </h2>
                <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                  You can also leave your details using this simple form. It
                  helps us understand how we can be most useful when we respond.
                </p>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
                      "Contact from FirstDoer website"
                    )}`;
                    window.location.href = mailto;
                    setTimeout(() => navigate("/contact/thank-you"), 800);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] min-h-[44px]"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] min-h-[44px]"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      What do you want to discuss?
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] min-h-[44px]"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>
                      <option value="platform-questions">
                        Platform questions & product feedback
                      </option>
                      <option value="partnerships">
                        Partnerships & campus collaborations
                      </option>
                      <option value="enterprise">
                        Enterprise or recurring task volumes
                      </option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] min-h-[120px]"
                      placeholder="Share a short note on what you are looking to explore or solve."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors min-h-[44px] w-full sm:w-auto"
                  >
                    Send via email
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-[11px] text-gray-500 mt-1">
                    This opens your default email client with a pre-filled
                    subject so you can complete the message securely.
                  </p>
                </form>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
                <h2 className="text-base font-medium text-[var(--color-primary)] mb-3">
                  Contact details
                </h2>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex gap-2">
                    <Mail size={16} className="mt-[2px] text-[var(--color-primary)]" />
                    <a
                      href={`mailto:${contactEmail}`}
                      className="hover:text-green-700 font-medium"
                    >
                      {contactEmail}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Phone size={16} className="mt-[2px] text-[var(--color-primary)]" />
                    <span className="text-gray-600">
                      Phone details are shared after an initial email exchange
                      where relevant.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={16} className="mt-[2px] text-[var(--color-primary)]" />
                    <span className="text-gray-600">
                      Currently operating remotely with a focus on India-first
                      task execution.
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/5 p-5 text-sm text-gray-700">
                <h2 className="text-base font-medium text-[var(--color-primary)] mb-2">
                  Response expectations
                </h2>
                <p>
                  We try to respond to thoughtful emails that clearly outline
                  context and questions. If your note is time-sensitive, please
                  mention timelines in the subject line.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;

