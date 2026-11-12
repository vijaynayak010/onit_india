import React from "react";
import { Link } from "react-router-dom";
import { Users, Briefcase, BookOpen, ArrowRight } from "react-feather";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";

const PARTNER_TYPES = [
  {
    icon: BookOpen,
    title: "Campus & institutions",
    description: "Colleges, universities, and student bodies. Bring task-based creative and tech opportunities to your student network.",
  },
  {
    icon: Briefcase,
    title: "Enterprises & agencies",
    description: "Companies and digital agencies needing recurring marketing, design, and dev execution with verified performers.",
  },
  {
    icon: Users,
    title: "Creator communities & hubs",
    description: "Creator networks and developer communities that want to source or provide task execution through firstDoer.",
  },
];

const PartnerWithUsPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SEO
        title="Partner With Us | firstDoer"
        description="Partner with firstDoer — enterprise task execution, agency partnerships, and verified performer programs."
        keywords="firstDoer partners, enterprise tasks, firstDoer collaboration, task marketplace partners, partner with firstDoer"
        canonical="https://www.firstdoer.com/partner-with-us"
      />
      <section className="pt-5 sm:pt-6 md:pt-7 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-[#10605F] hover:text-[#083B3A] font-medium text-sm mb-8"
          >
            ← Back to Home
          </Link>
          <header className="border-b border-gray-200 pb-8 mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10605F]/10 text-[#10605F] mb-4">
              <Users size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#10605F] mb-4">
              Partner with us
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We work with agencies, enterprises, and communities to power scalable, verified task execution. If you want to collaborate on high-volume delivery, talent pipelines, or institutional programs, we’d love to connect.
            </p>
          </header>

          <div className="space-y-8 mb-12">
            <h2 className="text-xl font-semibold text-[#10605F]">
              Who we partner with
            </h2>
            <div className="grid gap-6 md:grid-cols-1">
              {PARTNER_TYPES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#10605F]/15 bg-[#10605F]/5 p-5 flex gap-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-[#10605F] text-white flex items-center justify-center">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#10605F] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0D1210] text-white p-8 md:p-10 border border-[#10605F]/30">
            <h2 className="text-xl font-bold mb-3">Get in touch</h2>
            <p className="text-[#C6F0F0] mb-6 max-w-xl">
              Tell us about your organisation and partnership goals. Our team will get back to you promptly to explore how we can collaborate.
            </p>
            <Link
              to="/contact?topic=partnerships"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#7EDEDD] text-[#032120] font-semibold hover:bg-[#A2E7E7] transition-colors"
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
