import React from "react";
import { Play, Film, Clock, CheckCircle } from "react-feather";
import ServiceLandingLayout from "./ServiceLandingLayout";

const BENEFITS = [
  {
    icon: Play,
    title: "Reels and Shorts editing",
    description: "Get short-form videos edited for Instagram Reels, YouTube Shorts, and other platforms. Cut, captions, and pacing to your brief.",
  },
  {
    icon: Film,
    title: "Captions, cuts, and music",
    description: "Add captions, trim to length, sync to music, and apply basic effects. Specify format and duration when you post.",
  },
  {
    icon: Clock,
    title: "Turnaround and batches",
    description: "Set deadlines per video or batch. One-off or recurring — pay per task when the final cut is approved.",
  },
  {
    icon: CheckCircle,
    title: "Review and revisions",
    description: "Review the edit, request changes, and approve. Payment released when you’re satisfied with the deliverable.",
  },
];

const EXAMPLES = [
  "Instagram Reels editing",
  "YouTube Shorts editing",
  "TikTok and short-form cuts",
  "Caption and subtitle addition",
  "Clip compilation and highlights",
  "Thumbnail and cover frame design",
];

const ShortFormVideoEditingServicesPage = () => (
  <ServiceLandingLayout
    title="Short-Form Video Editing Services (Reels / Shorts) | OnIT INDIA"
    description="Short-form video editing services by verified performers. Reels, Shorts, and TikTok edits. Captions, cuts, and music. Post a task, get edited videos delivered. OnIT INDIA."
    keywords="short-form video editing services, Reels editing, YouTube Shorts editing, video editing India, Reels editor, Shorts editor, OnIT INDIA"
    canonical="https://www.onitindia.com/services/short-form-video-editing-services"
    heroTitle="Short-Form Video Editing Services (Reels / Shorts)"
    heroSubtitle="Get Reels, Shorts, and short-form videos edited by verified performers. Captions, cuts, music, and format — post your raw footage and brief, pay when the edit is approved."
    ctaTitle="Need Reels or Shorts edited?"
    ctaSubtitle="Post your footage, duration, and style. Performers will edit and deliver for your approval."
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
        <h2 className="text-2xl md:text-3xl font-bold text-[#004d43] mb-4 text-center">Types of short-form editing you can post</h2>
        <p className="text-gray-600 text-center mb-8">Post tasks for any of these; performers deliver edited files to your specs.</p>
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

export default ShortFormVideoEditingServicesPage;
