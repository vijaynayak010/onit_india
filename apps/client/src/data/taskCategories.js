import {
  Briefcase,
  Image,
  Cpu,
  FileText,
  PenTool,
  Calendar,
} from "react-feather";

export const taskCategories = [
  {
    id: "business",
    title: "Business Operations",
    description:
      "Keep your business running smoothly without hiring full-time. Get qualified help for lead generation, market research, CRM updates, and data entry so you can focus on strategy and growth.",
    icon: Briefcase,
    examples: [
      "Lead generation",
      "Market research",
      "CRM updates",
      "Data entry",
      "Competitor analysis",
      "List building",
    ],
  },
  {
    id: "content",
    title: "Content & Design",
    description:
      "From logos to reels—get professional-quality creative work without the agency price tag. Perfect for brands, creators, and small teams who need design and content that converts.",
    icon: Image,
    examples: [
      "Graphic design",
      "Video editing",
      "Thumbnails",
      "Social media posts",
      "Logo & branding",
      "Infographics",
    ],
  },
  {
    id: "tech",
    title: "Tech & Data",
    description:
      "Technical tasks that don't need a full-time developer. Set up automation, fix websites, scrape or organize data, and get spreadsheet work done by vetted performers.",
    icon: Cpu,
    examples: [
      "Automation setup",
      "Website fixes",
      "Scraping",
      "Spreadsheet work",
      "API integration",
      "Data cleaning",
    ],
  },
  {
    id: "admin",
    title: "Admin Support",
    description:
      "Document formatting, presentations, and research—done quickly and to a high standard. Ideal when you need an extra pair of hands without adding to the payroll.",
    icon: FileText,
    examples: [
      "Document formatting",
      "Presentation creation",
      "Research assistance",
      "Email drafting",
      "Scheduling & coordination",
      "Report compilation",
    ],
  },
  {
    id: "creative",
    title: "Creative & Writing",
    description:
      "Copy, blogs, proofreading, and translation from people who write for a living. Scale your content pipeline or polish one-off pieces without the back-and-forth.",
    icon: PenTool,
    examples: [
      "Copywriting",
      "Blog posts & articles",
      "Proofreading & editing",
      "Translation",
      "Scripts & captions",
      "Product descriptions",
    ],
  },
  {
    id: "events",
    title: "Events & Outreach",
    description:
      "Event coordination, email campaigns, and cold outreach executed by detail-oriented performers. Great for launches, webinars, and demand generation.",
    icon: Calendar,
    examples: [
      "Event coordination",
      "Email campaigns",
      "Cold outreach",
      "Guest list management",
      "Follow-up sequences",
      "Survey design & analysis",
    ],
  },
];

export function getTaskCategoryBySlug(slug) {
  return taskCategories.find((c) => c.id === slug) ?? null;
}

/** Returns unique examples for a category (no duplicates). */
export function getUniqueExamples(category) {
  if (!category?.examples?.length) return [];
  return [...new Set(category.examples)];
}
