import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Image,
  Cpu,
  BookOpen,
  MapPin,
  ChevronDown,
  Send,
  Users,
  CheckCircle,
  CreditCard,
  ArrowRight,
  Star,
} from "react-feather";

/**
 * Task types you can post in each domain — aligned with Domains.jsx.
 * Plus a clear "flow" from post to payment.
 */
const DOMAINS_WITH_TASKS = [
  {
    id: "business",
    title: "Business Operations & Research",
    tagline: "Strategic and operational tasks that keep your business moving.",
    taskTypes: [
      "Lead generation & list building",
      "Market & competitor research",
      "CRM updates & data entry",
      "Business reports & summaries",
      "Vendor or partner outreach",
      "Survey design & analysis",
      "Process documentation",
    ],
    example: "e.g. “Research 20 B2B leads in ed-tech and add to my sheet”",
    icon: Briefcase,
  },
  {
    id: "content",
    title: "Content, Design & Marketing",
    tagline: "Creative and marketing tasks—from one-off assets to full campaigns.",
    taskTypes: [
      "Logo & branding",
      "Social posts & thumbnails",
      "Video editing & reels",
      "Infographics & presentations",
      "Ad copy & creatives",
      "Email campaigns",
      "Landing page copy",
    ],
    example: "e.g. “Design 5 Instagram carousel posts for my product launch”",
    icon: Image,
  },
  {
    id: "tech",
    title: "Tech, Data and Admin",
    tagline: "Technical and administrative tasks without hiring full-time.",
    taskTypes: [
      "Spreadsheets & formulas",
      "Web scraping & data cleaning",
      "Automation setup (Zapier, etc.)",
      "Website fixes & small dev tasks",
      "API or tool integration",
      "Document formatting & templates",
      "Scheduling & coordination",
    ],
    example: "e.g. “Build a tracker sheet with formulas and conditional formatting”",
    icon: Cpu,
  },
  {
    id: "academic",
    title: "Academic & Knowledge Support",
    tagline: "Learning, research, and knowledge tasks for students and professionals.",
    taskTypes: [
      "Assignments & problem sets",
      "Presentations & slide decks",
      "Literature review & citations",
      "Study notes & summaries",
      "Tutoring or doubt-solving",
      "Research compilation",
      "Proofreading & editing",
    ],
    example: "e.g. “Create a 15-slide presentation on renewable energy with references”",
    icon: BookOpen,
  },
  {
    id: "onground",
    title: "On-Ground & Local Assistance",
    tagline: "Real-world tasks that need someone at a location.",
    taskTypes: [
      "Store or site visits",
      "Document pickup & delivery",
      "Audits & verification",
      "Event day support",
      "Local surveys & feedback",
      "Queue or appointment handling",
      "Photo or video from location",
    ],
    example: "e.g. “Visit 5 stores and verify product display and click photos”",
    icon: MapPin,
  },
];

const FLOW_STEPS = [
  {
    step: 1,
    title: "Post your task",
    description: "Pick a domain, describe what you need, and set your budget. No lengthy briefs—just clear outcomes.",
    icon: Send,
  },
  {
    step: 2,
    title: "Get matched",
    description: "Relevant performers see your task. You review profiles and offers, then confirm who does it.",
    icon: Users,
  },
  {
    step: 3,
    title: "Work gets done",
    description: "The performer completes the task. You can communicate and track progress in one place.",
    icon: CheckCircle,
  },
  {
    step: 4,
    title: "Review & pay",
    description: "Approve the work, leave feedback, and payment is released. Secure and simple.",
    icon: CreditCard,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function DomainTaskTypes() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-subtle)] text-[var(--color-primary)] px-4 py-1.5 text-sm font-semibold mb-4">
            <Star size={16} aria-hidden />
            Tasks by domain & the flow
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[var(--color-text)] font-sans mb-3">
            What you can post in each domain
          </h2>
          <p className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Every domain supports different kinds of tasks. Choose the one that fits, post clearly, and get it executed—here’s how it works end to end.
          </p>
        </motion.header>

        {/* Domain cards with task types */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="space-y-3 mb-14 md:mb-18"
        >
          {DOMAINS_WITH_TASKS.map((domain) => {
            const Icon = domain.icon;
            const isExpanded = expandedId === domain.id;

            return (
              <motion.div
                key={domain.id}
                variants={itemVariants}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : domain.id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-2xl"
                  aria-expanded={isExpanded}
                  aria-controls={`domain-tasks-${domain.id}`}
                  id={`domain-toggle-${domain.id}`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center">
                      <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={2} aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-[var(--color-text)]">
                        {domain.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                        {domain.tagline}
                      </p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
                    {isExpanded ? "Hide task types" : "See task types"}
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`domain-tasks-${domain.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                      aria-labelledby={`domain-toggle-${domain.id}`}
                    >
                      <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-0 border-t border-[var(--color-border-subtle)]">
                        <p className="text-xs sm:text-sm text-[var(--color-text-subtle)] mb-3 font-medium">
                          Task types you can post:
                        </p>
                        <ul className="flex flex-wrap gap-2 mb-3">
                          {domain.taskTypes.map((task) => (
                            <li key={task}>
                              <span className="inline-block px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] text-sm text-[var(--color-text)]">
                                {task}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] italic">
                          {domain.example}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* The flow */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--color-text)] font-sans mb-2">
              The flow: from post to done
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
              One clear path—post, match, execute, and pay. No back-and-forth chaos.
            </p>
          </div>

          {/* Flow steps: horizontal on desktop, vertical on mobile */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
              {FLOW_STEPS.map((item, index) => {
                const StepIcon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg mb-4">
                      <StepIcon size={28} strokeWidth={2} aria-hidden />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-text)] text-white text-xs font-bold flex items-center justify-center">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-medium text-[var(--color-text)] text-base sm:text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {item.description}
                    </p>
                    {index < FLOW_STEPS.length - 1 && (
                      <div className="md:hidden flex justify-center mt-3">
                        <ArrowRight size={20} className="text-[var(--color-primary)] rotate-90" aria-hidden />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 text-sm text-[var(--color-text-subtle)]"
          >
            Payment is secured when you confirm a performer; it’s released only when you mark the task complete. That protects both sides.
          </motion.p>
        </motion.section>
      </div>
    </div>
  );
}

export default DomainTaskTypes;
