import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight } from "react-feather";
import SEO from "../../components/seo/SEO";
import Footer from "../../components/layout/Footer";

const ContactPage = () => {
  const navigate = useNavigate();
  const contactEmail = "support@onitindia.com";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact OnIT INDIA",
    "url": "https://www.onitindia.com/contact",
    "description":
      "Get in touch with OnIT INDIA for platform queries, partnerships, and support around task execution and marketplace operations.",
    "mainEntity": {
      "@type": "Organization",
      "name": "OnIT INDIA",
      "email": contactEmail,
      "url": "https://www.onitindia.com",
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Contact OnIT INDIA | Talk to the Team"
        description="Contact OnIT INDIA for questions about the task execution platform, partnerships, support, or feedback. Reach the team and get a response on how we can help you execute work faster."
        keywords="OnIT INDIA contact, contact onitindia, OnIT INDIA support, OnIT INDIA email, task execution support, task marketplace contact, get in touch OnIT INDIA"
        canonical="https://www.onitindia.com/contact"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Contact OnIT INDIA",
          "description":
            "Contact the OnIT INDIA team for platform questions, support, and partnerships.",
          "url": "https://www.onitindia.com/contact",
        }}
        schema={contactSchema}
      />

      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <header className="border-b border-gray-200 pb-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-3">
              Contact OnIT INDIA
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              Reach out to the team building execution infrastructure for the
              modern work economy.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are a founder, operator, creator, or potential
              partner, we are always interested in conversations around faster
              task execution, marketplace operations, and collaboration
              opportunities.
            </p>
          </header>

          <div className="grid gap-10 md:grid-cols-[1.1fr_minmax(260px,0.9fr)] items-start">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-[#004d43] mb-3">
                  How we can help
                </h2>
                <p className="text-gray-600 mb-4">
                  Use this contact page if you want to:
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#004d43]" />
                    <span>
                      Understand how OnIT INDIA can support your execution
                      workflows and recurring tasks.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#004d43]" />
                    <span>
                      Explore partnerships, campus initiatives, or domain
                      expansions for task categories.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#004d43]" />
                    <span>
                      Share feedback about the product experience, reliability,
                      or new capabilities you want to see.
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#004d43] mb-3">
                  Write to us
                </h2>
                <p className="text-gray-600 mb-4">
                  For now, the fastest way to reach the team is over email.
                  Share a brief context on your question, what you are building,
                  or the kind of work you want to execute faster.
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-[#004d43] hover:text-green-600 font-semibold text-base"
                >
                  <Mail size={18} />
                  <span>{contactEmail}</span>
                  <ArrowRight size={16} className="mt-[1px]" />
                </a>
              </section>

              <section className="bg-[#004d43]/5 border border-[#004d43]/15 rounded-xl p-5 md:p-6">
                <h2 className="text-lg font-semibold text-[#004d43] mb-3">
                  Share a bit of context
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  You can also leave your details using this simple form. It
                  helps us understand how we can be most useful when we respond.
                </p>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
                      "Contact from OnIT INDIA website"
                    )}`;
                    window.location.href = mailto;
                    setTimeout(() => navigate("/contact/thank-you"), 800);
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004d43]/40 focus:border-[#004d43]"
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
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004d43]/40 focus:border-[#004d43]"
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
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#004d43]/40 focus:border-[#004d43]"
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
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004d43]/40 focus:border-[#004d43] min-h-[120px]"
                      placeholder="Share a short note on what you are looking to explore or solve."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#004d43] text-white text-sm font-semibold hover:bg-[#016b5c] transition-colors"
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
                <h2 className="text-base font-semibold text-[#004d43] mb-3">
                  Contact details
                </h2>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex gap-2">
                    <Mail size={16} className="mt-[2px] text-[#004d43]" />
                    <a
                      href={`mailto:${contactEmail}`}
                      className="hover:text-green-700 font-medium"
                    >
                      {contactEmail}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Phone size={16} className="mt-[2px] text-[#004d43]" />
                    <span className="text-gray-600">
                      Phone details are shared after an initial email exchange
                      where relevant.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={16} className="mt-[2px] text-[#004d43]" />
                    <span className="text-gray-600">
                      Currently operating remotely with a focus on India-first
                      task execution.
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#004d43]/15 bg-[#004d43]/5 p-5 text-sm text-gray-700">
                <h2 className="text-base font-semibold text-[#004d43] mb-2">
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

