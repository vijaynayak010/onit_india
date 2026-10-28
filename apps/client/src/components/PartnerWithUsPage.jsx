import React from "react";
import { Link } from "react-router-dom";
import { Users, Briefcase, BookOpen, ArrowRight } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const PARTNER_TYPES = [
  {
    icon: BookOpen,
    title: "Campus & institutions",
    description: "Colleges, universities, and student bodies. Bring task-based work and earning opportunities to your campus.",
  },
  {
    icon: Briefcase,
    title: "Enterprises & teams",
    description: "Companies that need recurring task execution, content, research, or operational support at scale.",
  },
  {
    icon: Users,
    title: "Communities & agencies",
    description: "Creator communities, agencies, and networks that want to offer or source task execution through OnIT INDIA.",
  },
];

const PartnerWithUsPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Partner With Us | OnIT INDIA"
        description="Partner with OnIT INDIA — campus collaborations, enterprise task execution, and community partnerships. Build execution infrastructure together. Campus partners, B2B partnerships."
        keywords="OnIT INDIA partners, campus partnership, enterprise tasks, OnIT INDIA collaboration, task marketplace partners, partner with OnIT INDIA, campus programs India"
        canonical="https://www.onitindia.com/partner-with-us"
      />
      {/* App shell already clears fixed marquee + nav — avoid stacking pt-24 here */}
      <section className="pt-5 sm:pt-6 md:pt-7 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[#004d43] hover:text-green-600 font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>
          <header className="border-b border-gray-200 pb-8 mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#004d43]/10 text-[#004d43] mb-4">
              <Users size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#004d43] mb-4">
              Partner with us
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We work with campuses, enterprises, and communities to extend
              task-based execution where it matters. If you want to collaborate
              on reach, volume, or new use cases, we’d like to hear from you.
            </p>
          </header>

          <div className="space-y-8 mb-12">
            <h2 className="text-xl font-semibold text-[#004d43]">
              Who we partner with
            </h2>
            <div className="grid gap-6 md:grid-cols-1">
              {PARTNER_TYPES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#004d43]/15 bg-[#004d43]/5 p-5 flex gap-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#004d43] text-white flex items-center justify-center">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#004d43] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#004d43] text-white p-8 md:p-10">
            <h2 className="text-xl font-bold mb-3">Get in touch</h2>
            <p className="text-white/90 mb-6 max-w-xl">
              Tell us about your organisation and what you’d like to achieve.
              We’ll respond and explore how we can work together.
            </p>
            <Link
              to="/contact?topic=partnerships"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#004d43] font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact us for partnerships
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PartnerWithUsPage;
