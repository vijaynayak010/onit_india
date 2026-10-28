import React from "react";
import SEO from "./seo/SEO";
import Footer from "./layout/Footer";
import WhyChooseUs from "./landing/WhyChooseUs";

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <SEO
        title="Why Choose OnIT INDIA | Fair, Simple, Local Trust"
        description="We built the platform we'd want to use—fair, simple, and built around real people and local trust. Low commission, verified community, and clear execution on OnIT INDIA."
        keywords="OnIT INDIA, why choose OnIT, task platform India, fair commission, verified performers, local tasks"
        canonical="https://www.onitindia.com/why-choose-us"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Why Choose OnIT INDIA",
          description:
            "Fair economics, verified community, and transparent task execution—why teams choose OnIT INDIA.",
          url: "https://www.onitindia.com/why-choose-us",
        }}
      />
      <main className="min-h-0">
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}
