import React from "react";
import { Clipboard, ShoppingBag, BarChart2, CheckCircle } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: Clipboard,
    title: "Store compliance & merchandising audits",
    description: "Verify planogram compliance, shelf share, product availability, and POS placement across retail locations.",
  },
  {
    icon: ShoppingBag,
    title: "Multi-location coverage",
    description: "Scale retail audits across cities and regions with a network of trained field auditors and task performers.",
  },
  {
    icon: BarChart2,
    title: "Structured data & reporting",
    description: "Get standardized checklists, photos, and data delivered in your preferred format for analysis and action.",
  },
  {
    icon: CheckCircle,
    title: "Quality checks & verification",
    description: "Ensure audit quality with verification steps, clear deliverables, and pay-on-completion so you only pay for verified work.",
  },
];

const EXAMPLES = [
  "Planogram compliance audits",
  "Shelf share and availability checks",
  "Pricing and promotion verification",
  "Competitor product placement audits",
  "Store condition and display audits",
  "Mystery shopping and customer experience audits",
];

const RetailAuditServicesPage = () => (
  <ServiceLandingLayout
    title="Retail Audit Services | Store Audits & Compliance | OnIT INDIA"
    description="Get retail audit services and store compliance checks executed by verified field auditors. Planogram audits, shelf share, merchandising verification, and multi-location retail audits across India. Post a task on OnIT INDIA."
    keywords="retail audit services, store audit, planogram compliance, merchandising audit, shelf share audit, retail compliance, field audit India, store verification, retail data collection, OnIT INDIA"
    canonical="https://www.onitindia.com/services/retail-audit-services"
    heroTitle="Retail Audit Services"
    heroSubtitle="Get store compliance, merchandising, and planogram audits executed by verified performers. Scale audits across locations and receive structured data and photos — pay only when work is done."
    ctaTitle="Need retail audits executed?"
    ctaSubtitle="Post your audit requirements, set your budget, and get matched with performers who can visit stores and deliver verified audit data."
  >
    <section className="py-16 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-10 text-center">
          What we help you execute
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#004d43]/15 bg-white p-6 flex gap-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#004d43]/10 text-[#004d43] flex items-center justify-center">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[#004d43] mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 px-6 md:px-20 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4 text-center">
          Types of retail audits you can post
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Post tasks for any of these retail audit needs; our performers execute on the ground and deliver results.
        </p>
        <ul className="space-y-3">
          {EXAMPLES.map((item) => (
            <li
              key={item}
              className="flex gap-3 items-center rounded-lg bg-white border border-gray-100 px-4 py-3 text-gray-700"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#004d43]/20 text-[#004d43] flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </ServiceLandingLayout>
);

export default RetailAuditServicesPage;
