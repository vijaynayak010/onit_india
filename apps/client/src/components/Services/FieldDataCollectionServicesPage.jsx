import React from "react";
import { MapPin, Database, Camera, FileText } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: MapPin,
    title: "Hyperlocal field execution",
    description: "Get data collected on the ground — store visits, location checks, surveys, and site verification — by performers in your target areas.",
  },
  {
    icon: Database,
    title: "Structured data delivery",
    description: "Receive clean, formatted data: spreadsheets, forms, or custom formats. Specify your fields and validation rules when you post the task.",
  },
  {
    icon: Camera,
    title: "Photos & proof",
    description: "Request photos, geo-tags, and timestamps as part of the deliverable so you have evidence and audit trails for every submission.",
  },
  {
    icon: FileText,
    title: "Surveys & forms",
    description: "Run field surveys, KYC checks, lead verification, or custom form-based collection with clear deadlines and quality criteria.",
  },
];

const EXAMPLES = [
  "Store visit and availability checks",
  "Field surveys and questionnaire execution",
  "Location verification and geo-tagged photos",
  "Lead verification and KYC data collection",
  "Competitor pricing and display audits",
  "Asset verification and inventory checks",
];

const FieldDataCollectionServicesPage = () => (
  <ServiceLandingLayout
    title="Field Data Collection Services | On-Site Data Collection | FirstDoer"
    description="Field data collection services by verified performers across India. Store visits, surveys, location verification, and on-ground data collection. Post your task and pay when work is done. FirstDoer."
    keywords="field data collection services, on-site data collection, field survey, store visit, location verification, ground data collection India, field research, survey execution, data collection agency, FirstDoer"
    canonical="https://www.firstdoer.com/services/field-data-collection-services"
    heroTitle="Field Data Collection Services"
    heroSubtitle="Get on-the-ground data collection executed by verified performers. Store visits, surveys, location checks, and custom forms — specify what you need and receive structured data and proof."
    ctaTitle="Need field data collected?"
    ctaSubtitle="Post your data collection task with clear instructions and deliverables. Performers in your target locations will execute and submit verified data."
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
          Types of field data collection you can post
        </h2>
        <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
          From one-off visits to recurring surveys, post tasks that match your scope and geography.
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

export default FieldDataCollectionServicesPage;
