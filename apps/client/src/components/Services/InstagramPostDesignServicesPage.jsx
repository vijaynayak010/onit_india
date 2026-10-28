import React from "react";
import { Image, Grid, Edit3, CheckCircle } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: Image,
    title: "Feed posts and carousels",
    description: "Get Instagram-ready visuals: single posts, carousel slides, and quote graphics. Provide copy and references; performers deliver designs.",
  },
  {
    icon: Grid,
    title: "Stories and templates",
    description: "Story templates, announcement graphics, and reusable layouts. Consistent look without an in-house designer.",
  },
  {
    icon: Edit3,
    title: "Brand-aligned creatives",
    description: "Share your brand colours, fonts, and style. Performers create on-brand assets for your approval.",
  },
  {
    icon: CheckCircle,
    title: "Revisions and formats",
    description: "Request changes and get final files in the formats you need (e.g. square, story, Reels thumbnail). Pay when approved.",
  },
];

const EXAMPLES = [
  "Instagram feed post designs",
  "Carousel and multi-slide graphics",
  "Story and highlight graphics",
  "Quote and text-over-image posts",
  "Reels and Shorts thumbnails",
  "Promotional and campaign creatives",
];

const InstagramPostDesignServicesPage = () => (
  <ServiceLandingLayout
    title="Instagram Post Design Services | OnIT INDIA"
    description="Instagram post design services by verified performers. Feed posts, carousels, stories, and Reels thumbnails. On-brand creatives on demand. Post a task on OnIT INDIA."
    keywords="Instagram post design services, Instagram design India, feed post design, carousel design, Instagram creatives, social media design, OnIT INDIA"
    canonical="https://www.onitindia.com/services/instagram-post-design-services"
    heroTitle="Instagram Post Design Services"
    heroSubtitle="Get Instagram post and story designs executed by verified performers. Feed posts, carousels, and thumbnails — share your brief and brand; pay when the design is approved."
    ctaTitle="Need Instagram designs?"
    ctaSubtitle="Post your brief, copy, and brand guidelines. Performers will deliver ready-to-post creatives for your approval."
  >
    <section className="py-16 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-10 text-center">What we help you execute</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div key={item.title} className="rounded-xl border border-[#004d43]/15 bg-white p-6 flex gap-4">
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
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4 text-center">Types of Instagram design you can post</h2>
        <p className="text-gray-600 text-center mb-8">Post tasks for any of these; performers deliver source files and exports.</p>
        <ul className="space-y-3">
          {EXAMPLES.map((item) => (
            <li key={item} className="flex gap-3 items-center rounded-lg bg-white border border-gray-100 px-4 py-3 text-gray-700">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#004d43]/20 text-[#004d43] flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </ServiceLandingLayout>
);

export default InstagramPostDesignServicesPage;
