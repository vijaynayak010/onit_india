import React from "react";
import { Share2, Edit3, Calendar, BarChart } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: Share2,
    title: "Multi-platform content",
    description: "Get posts, captions, and creatives for Facebook, LinkedIn, Twitter/X, and other channels. One brief, multiple formats.",
  },
  {
    icon: Edit3,
    title: "Copy and captions",
    description: "Engaging captions, hashtag sets, and ad copy written by performers who understand your audience and brand voice.",
  },
  {
    icon: Calendar,
    title: "Content calendars and batches",
    description: "Order weekly or monthly content batches. Clear deadlines and deliverables so you can plan ahead.",
  },
  {
    icon: BarChart,
    title: "Consistent output without full-time hire",
    description: "Scale social content on demand. Pay per task when you need it; no long-term commitment.",
  },
];

const EXAMPLES = [
  "Social media post copy and captions",
  "Carousel and feed post content",
  "Hashtag research and sets",
  "Ad copy for social campaigns",
  "Community and comment responses",
  "Content calendar and scheduling support",
];

const SocialMediaContentCreationServicesPage = () => (
  <ServiceLandingLayout
    title="Social Media Content Creation Services | FirstDoer"
    description="Social media content creation services by verified performers. Posts, captions, hashtags, and ad copy for Facebook, Instagram, LinkedIn, and more. Post a task, get content delivered. FirstDoer."
    keywords="social media content creation services, social media content, post writing, caption writing, social content India, content creation for startups, FirstDoer"
    canonical="https://www.firstdoer.com/services/social-media-content-creation-services"
    heroTitle="Social Media Content Creation Services"
    heroSubtitle="Get social media posts, captions, and creatives executed by verified performers. Scale your presence across platforms without a full-time content team — post a task, set your brief, pay when approved."
    ctaTitle="Need social media content?"
    ctaSubtitle="Post your content brief with platform, tone, and examples. Performers will create and deliver for your approval."
  >
    <section className="py-16 px-6 md:px-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-10 text-center">What we help you execute</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {BENEFITS.map((item) => (
            <div key={item.title} className="rounded-xl border border-[var(--color-primary)]/15 bg-white p-6 flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-primary)] mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="py-16 px-6 md:px-20 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4 text-center">Types of social content you can post</h2>
        <p className="text-gray-600 text-center mb-8">Post tasks for any of these; performers deliver ready-to-use content.</p>
        <ul className="space-y-3">
          {EXAMPLES.map((item) => (
            <li key={item} className="flex gap-3 items-center rounded-lg bg-white border border-gray-100 px-4 py-3 text-gray-700">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </ServiceLandingLayout>
);

export default SocialMediaContentCreationServicesPage;
