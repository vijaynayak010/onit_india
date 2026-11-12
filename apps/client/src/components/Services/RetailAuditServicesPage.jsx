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
    title="Retail Audit Services | Store Audits & Compliance | FirstDoer"
    description="Get retail audit services and store compliance checks executed by verified field auditors. Planogram audits, shelf share, merchandising verification, and multi-location retail audits across India. Post a task on FirstDoer."
    keywords="retail audit services, store audit, planogram compliance, merchandising audit, shelf share audit, retail compliance, field audit India, store verification, retail data collection, FirstDoer"
    canonical="https://www.firstdoer.com/services/retail-audit-services"
    heroTitle="Retail Audit Services"
    heroSubtitle="Get store compliance, merchandising, and planogram audits executed by verified performers. Scale audits across locations and receive structured data and photos — pay only when work is done."
    ctaTitle="Need retail audits executed?"
    ctaSubtitle="Post your audit requirements, set your budget, and get matched with performers who can visit stores and deliver verified audit data."
  >
    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-[var(--color-primary)] mb-8 sm:mb-10 text-center font-heading">
          What we help you execute
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--color-primary)]/15 bg-white p-4 sm:p-6 flex gap-3.5 sm:gap-4 shadow-xs"
            >
              <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <item.icon size={22} />
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-primary)] mb-1 font-heading text-base">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-[var(--color-primary)] mb-3 sm:mb-4 text-center font-heading">
          Types of retail audits you can post
        </h2>
        <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
          Post tasks for any of these retail audit needs; our performers execute on the ground and deliver results.
        </p>
        <ul className="space-y-2.5 sm:space-y-3">
          {EXAMPLES.map((item) => (
            <li
              key={item}
              className="flex gap-3 items-center rounded-xl bg-white border border-gray-100 px-4 py-3 text-gray-700 text-xs sm:text-sm shadow-xs"
            >
              <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </ServiceLandingLayout>
);

export default RetailAuditServicesPage;
