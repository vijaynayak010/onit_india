import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mic,
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  CircleDollarSign,
  Users,
  Hourglass,
  Wallet,
  Sparkles,
  Star,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Play,
  Calendar,
  PlusCircle,
  ListTodo,
  MessageSquare,
  TrendingUp,
  LayoutGrid,
  Palette,
  FileText,
  Video,
  Instagram,
  Globe,
  Megaphone,
  PieChart,
  Presentation,
  Database,
  FileUser,
  Paperclip,
  X,
  Briefcase,
  ShieldCheck,
  Zap,
  Bookmark,
  ArrowUpRight,
  Code2,
  Layers,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { useAuth } from "../../../contexts/AuthContext";
import { useProviderData } from "../contexts/ProviderDataContext";
import DashboardActionCarousel from "../components/dashboard/DashboardActionCarousel";
import PostFirstTaskBanner from "../components/dashboard/PostFirstTaskBanner";
import BrowseCategoryGrid from "../components/BrowseCategoryGrid";
import { useHomeContent } from "../../../services/homeContent";


const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

function SectionHeader({ eyebrow, title, description, action, divider = true }) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${divider ? "mb-5 sm:mb-6 border-b border-[var(--color-border)]/80 pb-4 sm:pb-5" : "mb-0"}`}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-medium tracking-tight text-[var(--color-text)]">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed text-[var(--color-text-muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function SectionCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/95 shadow-[var(--shadow-sm)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[var(--shadow-md)] ${className}`}
    >
      {children}
    </motion.div>
  );
}


const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { stats: cachedStats, activities, performers, loading, refreshData } = useProviderData();
  const { slides: homeSlides } = useHomeContent();
  
  const [searchQuery, setSearchQuery] = useState(() => location.state?.query || "");

  useEffect(() => {
    if (location.state?.query !== undefined) {
      setSearchQuery(location.state.query || "");
    }
  }, [location.state]);

  // Domain Explorer State Variables
  const [selectedDomain, setSelectedDomain] = useState(null);

  const handleOpenDomain = (domain) => {
    if (selectedDomain?.id === domain.id) {
      setSelectedDomain(null);
    } else {
      setSelectedDomain(domain);
    }
  };

  // Default stats structure for initial render
  const defaultStats = [
    { label: "Applicants", value: "0", change: "Published tasks", Icon: Users, accent: "text-sky-600", iconBg: "bg-sky-50", trend: "up" },
    { label: "Active", value: "0", change: "In execution", Icon: Clock, accent: "text-violet-600", iconBg: "bg-violet-50", trend: "up" },
    { label: "Completed", value: "0", change: "Successfully completed", Icon: CheckCircle2, accent: "text-[var(--color-primary)]", iconBg: "bg-[var(--color-primary-subtle)]", trend: "up" },
    { label: "Drafts", value: "0", change: "Preparing tasks", Icon: FileText, accent: "text-amber-600", iconBg: "bg-amber-50", trend: null }
  ];

  // Merge cached stats with the UI metadata (Icons, Colors)
  const stats = cachedStats ? cachedStats.map((s, i) => {
    const base = defaultStats.find(d => d.label === s.label) || defaultStats[i] || {};
    return {
      ...base,
      value: s.value,
      change: s.available !== undefined ? `₹${s.available} available` : (base.change || "")
    };
  }).filter(s => s.label) : defaultStats;

  const totalCount = activities.length;


  // Data is now managed globally by ProviderDataContext

  const SkeletonStats = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
          <div className="mb-4 h-11 w-11 rounded-xl bg-[var(--color-border-subtle)]" />
          <div className="mb-2 h-3 w-1/3 rounded bg-[var(--color-border-subtle)]" />
          <div className="h-8 w-1/2 rounded bg-[var(--color-border-subtle)]" />
        </div>
      ))}
    </div>
  );

  const SkeletonActivityRow = () => (
    <tr className="animate-pulse border-b border-[var(--color-border-subtle)]">
      <td className="px-6 py-6 sm:px-8">
        <div className="mb-2 h-4 w-3/4 rounded bg-[var(--color-border-subtle)]" />
        <div className="h-3 w-1/4 rounded bg-[var(--color-border-subtle)]" />
      </td>
      <td className="px-6 py-6 sm:px-8">
        <div className="h-4 w-1/2 rounded bg-[var(--color-border-subtle)]" />
      </td>
      <td className="px-6 py-6 sm:px-8">
        <div className="h-8 w-24 rounded-full bg-[var(--color-border-subtle)]" />
      </td>
    </tr>
  );

  const SkeletonPerformerCard = () => (
    <div className="min-w-[288px] max-w-[288px] animate-pulse rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <div className="mb-4 flex gap-3.5">
        <div className="h-12 w-12 rounded-xl bg-[var(--color-border-subtle)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-[var(--color-border-subtle)]" />
          <div className="h-3 w-1/2 rounded bg-[var(--color-border-subtle)]" />
        </div>
      </div>
      <div className="mb-4 h-4 w-full rounded bg-[var(--color-border-subtle)]" />
      <div className="mb-4 h-4 w-2/3 rounded bg-[var(--color-border-subtle)]" />
      <div className="flex justify-between border-t border-[var(--color-border)]/80 pt-4">
        <div className="h-6 w-16 rounded-full bg-[var(--color-border-subtle)]" />
        <div className="h-8 w-24 rounded-full bg-[var(--color-border-subtle)]" />
      </div>
    </div>
  );

  const liveTasks = activities.filter(a => String(a.status).toUpperCase() === 'PUBLISHED');
  const filteredLiveTasks = liveTasks.filter(task => {
    if (selectedDomain) {
      const title = String(task.task || "").toLowerCase();
      const cat = String(task.category || "").toLowerCase();
      const desc = String(task.description || "").toLowerCase();
      const isDomainMatch = selectedDomain.taskFilters.some(filter =>
        title.includes(filter.toLowerCase()) ||
        cat.includes(filter.toLowerCase()) ||
        desc.includes(filter.toLowerCase())
      );
      if (!isDomainMatch) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      String(task.task || "").toLowerCase().includes(q) ||
      String(task.category || "").toLowerCase().includes(q) ||
      String(task.description || "").toLowerCase().includes(q)
    );
  });

  const filteredPerformers = performers.filter(p => {
    if (selectedDomain) {
      const pProfession = String(p.name || "").toLowerCase();
      const pSkills = (p.skills || []).map(s => String(s).toLowerCase());
      const pBio = String(p.bio || "").toLowerCase();
      const isDomainMatch = selectedDomain.peerFilters.some(filter =>
        pProfession.includes(filter.toLowerCase()) ||
        pBio.includes(filter.toLowerCase())
      );
      const isSkillMatch = selectedDomain.taskFilters.some(filter =>
        pSkills.some(skill => skill.includes(filter.toLowerCase()))
      );
      if (!isDomainMatch && !isSkillMatch) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const skillsMatch = Array.isArray(p.skills) && p.skills.some(s => String(s).toLowerCase().includes(q));
    return (
      String(p.person || "").toLowerCase().includes(q) ||
      String(p.name || "").toLowerCase().includes(q) ||
      String(p.bio || "").toLowerCase().includes(q) ||
      skillsMatch
    );
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-surface)] pt-[80px] font-sans antialiased">
      <ProviderHeader activePage="home" />

      <div className="custom-scrollbar flex-1 overflow-y-auto">


        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          {/* Active Category Filter Pill Banner */}
          <AnimatePresence>
            {selectedDomain && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-center justify-between rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/[0.03] p-4 shadow-sm backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${selectedDomain.gradient} text-white shadow-sm`}>
                    <selectedDomain.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="inline-flex rounded bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--color-primary)]">
                      Active Category Filter
                    </span>
                    <h4 className="text-sm font-medium text-[var(--color-text)] mt-0.5">
                      {selectedDomain.title}
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDomain(null)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--color-text-muted)] hover:border-red-200 hover:text-red-500 transition-all shadow-xs"
                >
                  Clear filter
                  <X size={12} strokeWidth={2.5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>



          <div className="space-y-8">
            {!loading && activities.length === 0 && (
              <PostFirstTaskBanner dynamicSlides={homeSlides} />
            )}

            <DashboardActionCarousel
              activities={activities}
              performers={performers}
              performerCount={performers.length || 120}
              onViewApplicants={(task) => navigate(`/provider/task-applicants?taskId=${task.id}`)}
              onTaskAction={(task, actionType) => {
                if (actionType === "review" || actionType === "active") {
                  navigate(`/provider/active-task/${task.id}`);
                  return;
                }
                navigate(`/provider/task-applicants?taskId=${task.id}`);
              }}
            />

            
            

            <section aria-labelledby="dash-stats-heading">
              <div className="mb-3 sm:mb-4 flex items-center justify-between gap-3">
                <h2 id="dash-stats-heading" className="text-xs sm:text-sm font-heading font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Key metrics
                </h2>
                <span className="text-[11px] sm:text-xs font-medium text-[var(--color-text-subtle)]">Last 30 days context</span>
              </div>

              {loading && !cachedStats ? (
                <SkeletonStats />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 lg:gap-5">
                  {stats.map((s, i) => {
                    const Icon = s.Icon;
                    return (
                      <motion.div
                        key={i}
                        {...fadeUp}
                        transition={{ duration: 0.35, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--color-primary)]/25 hover:shadow-[var(--shadow-md)]"
                      >
                        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[var(--color-primary)]/[0.04] transition group-hover:bg-[var(--color-primary)]/[0.08]" />
                        <div
                          className={`relative mb-3 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${s.iconBg} ${s.accent}`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                        </div>
                        <p className="relative mb-1 text-[11px] sm:text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                          {s.label}
                        </p>
                        <p className="relative mb-1 text-2xl sm:text-3xl font-heading font-medium tracking-tight text-[var(--color-text)]">{s.value}</p>
                        {s.change ? (
                          <p className="relative flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)]">
                            {s.trend === "up" ? (
                              <TrendingUp className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                            ) : null}
                            {s.change}
                          </p>
                        ) : null}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>

            <SectionCard className="p-5 sm:p-6 md:p-7" delay={0.14}>
              <BrowseCategoryGrid
                showHeader
                onSelectCategory={(item) =>
                  navigate("/provider/task-templates", {
                    state: { category: item.category || item.label || item.slug },
                  })
                }
                onMoreClick={() => navigate("/provider/task-templates")}
              />
            </SectionCard>

            <SectionCard className="p-6 sm:p-8" delay={0.16}>
              <SectionHeader
                eyebrow="Network"
                title="Task performers"
                description="Preview profiles that match common provider needs."
                action={
                  <button
                    type="button"
                    onClick={() => navigate("/provider/task-performers")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-subtle)] px-4 py-2 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/15"
                  >
                    View all
                    <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                }
              />
              <h3 id="dash-performers-heading" className="sr-only">
                Task performers carousel
              </h3>
              <div className="relative pt-1">
                <div className="flex gap-4 overflow-x-auto overscroll-x-contain py-2 pb-3 scrollbar-hide">
                  {loading && !performers.length ? (
                    [1, 2, 3, 4].map(i => <SkeletonPerformerCard key={i} />)
                  ) : filteredPerformers.length > 0 ? (
                    filteredPerformers.map((p, i) => (
                      <article
                        key={p.id || i}
                        className="min-w-[260px] sm:min-w-[288px] max-w-[288px] shrink-0 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-[var(--shadow-sm)] ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:shadow-[var(--shadow-lg)]"
                      >
                        <div className="mb-3.5 sm:mb-4 flex gap-3 sm:gap-3.5">
                          <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border-subtle)] ring-1 ring-black/[0.04]">
                            <img
                              src={p.avatar || `https://ui-avatars.com/api/?name=${p.person}&background=random`}
                              alt={p.person}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="line-clamp-1 text-sm font-heading font-medium text-[var(--color-text)]">{p.person}</h3>
                            <p className="line-clamp-1 text-xs font-medium text-[var(--color-text-subtle)]">{p.name}</p>
                            <div className="mt-1 flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${star <= Math.round(p.rating) ? "fill-current" : "text-slate-200"}`}
                                  strokeWidth={0}
                                  fill="currentColor"
                                />
                              ))}
                              <span className="ml-1 text-[11px] font-bold text-[var(--color-text-subtle)]">
                                {p.rating ? p.rating.toFixed(1) : "0.0"}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="mb-3 sm:mb-4 line-clamp-2 text-xs font-medium leading-relaxed text-[var(--color-text-muted)] h-[32px]">
                          {p.bio}
                        </p>
                        <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2 h-[20px] overflow-hidden">
                          {(p.skills || []).slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="rounded-full bg-[var(--color-border-subtle)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-tight text-[var(--color-text-muted)]">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)]/80 pt-3.5 sm:pt-4">
                          <span className="rounded-full bg-[var(--color-primary-subtle)] px-2.5 sm:px-3 py-1 text-[10px] font-medium text-[var(--color-primary)]">
                            {p.tasks}
                          </span>
                          <button
                            type="button"
                            onClick={() => navigate(`/provider/task-performer-profile/${p.id}`, { state: { tasker: p } })}
                            className="rounded-full bg-[var(--color-primary)] px-3.5 sm:px-4 py-2 text-[11px] font-medium text-white shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-primary-hover)] whitespace-nowrap min-h-[36px]"
                          >
                            View Profile
                          </button>
                        </div>
                      </article>
                    ))) : (
                    <div className="flex w-full flex-col items-center justify-center py-8 text-center">
                      <p className="text-xs font-medium text-[var(--color-text-muted)]">
                        No performers found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* <SectionCard className="p-6 sm:p-8" delay={0.18}>
              <SectionHeader
                eyebrow="Resources"
                title="Learning hub"
                description="Short guides to post clearer tasks and get better matches."
                action={
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-subtle)] px-4 py-2 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/15"
                  >
                    View all
                    <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                }
              />
              <h3 id="dash-learning-heading" className="sr-only">
                Learning hub videos
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="group min-w-[192px] shrink-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:shadow-[var(--shadow-md)]"
                  >
                    <div className="relative h-[108px] w-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-[#EFFBFB]/50">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100">
                        <div className="flex h-11 w-11 scale-90 items-center justify-center rounded-full bg-white text-[var(--color-text)] opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100">
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        </div>
                      </div>
                      <BookOpen className="absolute bottom-3 left-3 h-6 w-6 text-[var(--color-primary)]/40" strokeWidth={1.5} aria-hidden />
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-[12px] font-medium leading-snug text-[var(--color-text)]">
                        tips to create the perfect
                        <br />
                        task
                      </h3>
                      <div className="mt-2.5 h-1 w-12 rounded-full bg-gradient-to-r from-[var(--color-primary)]/40 to-[var(--color-primary)]/10" />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard> */}
          </div>
        </main>
      </div>


    </div>
  );
};

// Static Category Definitions for Unified Browsing
const DOMAIN_CATEGORIES = [
  {
    id: "tech",
    title: "Tech & Coding",
    description: "Website fixes, script automation, API integrations, and spreadsheet development.",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50/70",
    border: "border-blue-100/50 hover:border-blue-500/30",
    badgeColor: "bg-blue-500/10 text-blue-600",
    icon: Code2,
    templateFilters: ["Web & App Development"],
    taskFilters: ["tech", "development", "coding", "software", "api", "website", "bug"],
    peerFilters: ["Tech & Data", "IT & Tech", "Engineering"]
  },
  {
    id: "marketing",
    title: "Marketing & Growth",
    description: "Social media management, ads, SEO campaigns, and performance marketing.",
    gradient: "from-[#10605F] to-teal-600",
    lightBg: "bg-[#EFFBFB]/70",
    border: "border-[#29ADAC]/20/50 hover:border-[#10605F]/30",
    badgeColor: "bg-[#10605F]/10 text-[#10605F]",
    icon: Globe,
    templateFilters: ["Marketing & Ads", "Social Media Management"],
    taskFilters: ["marketing", "ads", "social", "instagram", "facebook", "seo", "growth"],
    peerFilters: ["Marketing & Ads", "Events & Outreach", "Social Media"]
  },
  {
    id: "design",
    title: "Design & Creative",
    description: "Brand logos, infographics, Canva posters, presentations, and video editing.",
    gradient: "from-purple-500 to-pink-600",
    lightBg: "bg-purple-50/70",
    border: "border-purple-100/50 hover:border-purple-500/30",
    badgeColor: "bg-purple-500/10 text-purple-600",
    icon: Layers,
    templateFilters: ["Design Projects", "Video Editing", "Presentation & PPT"],
    taskFilters: ["design", "logo", "video", "edit", "canva", "figma", "illustrator", "poster", "presentation", "ppt"],
    peerFilters: ["Content & Design", "Design & Creative", "Creative & Design"]
  },
  {
    id: "content",
    title: "Writing & Content",
    description: "SEO copywriting, blogs, translation, captions, scripts, and resume building.",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50/70",
    border: "border-amber-100/50 hover:border-amber-500/30",
    badgeColor: "bg-amber-500/10 text-amber-600",
    icon: BookOpen,
    templateFilters: ["Content Writing", "Resume & Portfolio Building"],
    taskFilters: ["write", "blog", "copy", "content", "resume", "cv", "proofread", "translate"],
    peerFilters: ["Creative & Writing", "Content & Writing", "Writing & Content"]
  },
  {
    id: "business",
    title: "Business & Ops",
    description: "Market research, competitor analysis, lead list building, and data entry support.",
    gradient: "from-sky-500 to-cyan-600",
    lightBg: "bg-sky-50/70",
    border: "border-sky-100/50 hover:border-sky-500/30",
    badgeColor: "bg-sky-500/10 text-sky-600",
    icon: Briefcase,
    templateFilters: ["Research & Analysis", "Data Entry & Admin Tasks"],
    taskFilters: ["research", "analysis", "data", "sheet", "excel", "competitor", "entry", "admin"],
    peerFilters: ["Business Operations", "Admin Support", "Business & Ops", "Research"]
  }
];

export default DashboardPage;
