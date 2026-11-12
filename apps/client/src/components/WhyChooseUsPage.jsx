import React from "react";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";
import WhyChooseUs from "./landing/WhyChooseUs";

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <SEO
        title="Why Choose firstDoer | Verified Performers & Safe Payments"
        description="Verified performers, protected escrow payments, and clear AI checklists—why businesses choose firstDoer."
        keywords="firstDoer, why choose firstDoer, task platform, verified performers, protected payments"
        canonical="https://www.firstdoer.com/why-choose-us"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Why Choose firstDoer",
          description:
            "Verified performers, protected escrow payments, and clear AI checklists—why businesses choose firstDoer.",
          url: "https://www.firstdoer.com/why-choose-us",
        }}
      />
      <main className="min-h-0">
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}
