import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    ChevronRight,
    Search,
    SlidersHorizontal,
    Star,
    Bookmark,
    Sparkles,
    ShieldCheck,
    Briefcase,
    Zap,
    Filter,
    X,
    Check,
    PlusCircle,
    ArrowRight,
    Users,
    FileText,
    Clock,
    Palette,
    Video,
    Instagram,
    Globe,
    Megaphone,
    PieChart,
    Presentation,
    Database,
    FileUser,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { listTaskers, searchTaskers } from "../services/api";
import { useProviderData } from "../contexts/ProviderDataContext";
import { TASK_TEMPLATES } from "../../../data/taskTemplates";

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Context for Live Tasks
    const { activities, loading: contextLoading } = useProviderData();

    // Check for incoming query from Dashboard search state
    const incomingQuery = location.state?.query || "";

    const [searchQuery, setSearchQuery] = useState(incomingQuery);
    const [searchType, setSearchType] = useState("performers"); // 'performers' | 'templates' | 'tasks'
    const [activeTab, setActiveTab] = useState("All");
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [taskers, setTaskers] = useState([]);
    const [isLoadingTaskers, setIsLoadingTaskers] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [minRating, setMinRating] = useState(0);
    const [experienceFilter, setExperienceFilter] = useState("All");

    useEffect(() => {
        if (typeof location.state?.query === "string") {
            setSearchQuery(location.state.query);
        }
    }, [location.state?.query]);

    // Persistent filters: Category tab and selected skill pill now persist when switching tabs to synchronize filters globally
    // We removed the reset effect so filters stay active across Performers, Templates, and Live Tasks

    // Fetch performers from backend
    const fetchPerformers = async () => {
        setIsLoadingTaskers(true);
        try {
            const params = {
                limit: 100,
                page: 1,
                ...(minRating > 0 ? { minRating } : {}),
                ...(searchQuery.trim() ? { keyword: searchQuery.trim() } : {}),
            };
            const response = searchQuery.trim()
                ? await searchTaskers(params)
                : await listTaskers(params);
            const data = response?.taskers || response?.data || response || [];
            setTaskers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("[FirstDoer] Error fetching taskers for search page:", err);
            setTaskers([]);
        } finally {
            setIsLoadingTaskers(false);
        }
    };

    useEffect(() => {
        fetchPerformers();
    }, [searchQuery, minRating]);

    useEffect(() => {
        if (location.state?.query !== undefined) {
            setSearchQuery(location.state.query || "");
        }
    }, [location.state]);

    // Helper classifiers
    const getTaskerCategoryTab = (t) => {
        const domain = (t.domain || "").toLowerCase();
        const bio = (t.bio || "").toLowerCase();
        
        if (
            domain.includes("general") || 
            domain.includes("basic") || 
            bio.includes("data entry") || 
            bio.includes("copy paste") || 
            (t.hourlyRate && t.hourlyRate <= 400)
        ) {
            return "General";
        }
        return "Professional Services";
    };

    const getTemplateCategoryTab = (t) => {
        const cat = String(t.category || "").toLowerCase();
        if (cat.includes("data entry") || cat.includes("resume") || cat.includes("admin")) {
            return "General";
        }
        return "Professional Services";
    };

    const getTaskCategoryTab = (t) => {
        const cat = String(t.category || "").toLowerCase();
        if (cat.includes("general") || cat.includes("data entry") || cat.includes("admin") || cat.includes("basic")) {
            return "General";
        }
        return "Professional Services";
    };

    // Category Icons configuration for Templates mapping
    const categoryIcons = {
        "Design Projects": Palette,
        "Content Writing": FileText,
        "Video Editing": Video,
        "Social Media Management": Instagram,
        "Web & App Development": Globe,
        "Marketing & Ads": Megaphone,
        "Research & Analysis": PieChart,
        "Presentation & PPT": Presentation,
        "Data Entry & Admin Tasks": Database,
        "Resume & Portfolio Building": FileUser,
    };

    const templateColors = ["#059669", "#0ea5e9", "#8b5cf6", "#f97316", "#ec4899", "#3b82f6", "#10b981", "#6366f1"];

    const taskTemplates = useMemo(() => {
        return TASK_TEMPLATES.map((t, i) => ({
            ...t,
            color: templateColors[i % templateColors.length],
            Icon: categoryIcons[t.category] || Sparkles,
            taskers: t.usageCount ? `${t.usageCount} taskers` : "250+ taskers"
        }));
    }, []);

    // Live Posted Tasks from provider context
    const liveTasks = useMemo(() => {
        return activities.filter(a => String(a.status).toUpperCase() === 'PUBLISHED');
    }, [activities]);

    // High-level Domain categories for quick filter pills
    const curatedSkillPills = [
        "Tech & Coding",
        "Marketing & Growth",
        "Design & Creative",
        "Writing & Content",
        "Business & Ops"
    ];

    // Expand special search queries from dashboard suggestions
    const expandQueryFilters = (q) => {
        const queryLower = q.toLowerCase().trim();
        if (!queryLower) return null;
        
        if (queryLower === "tech & coding") {
            return {
                performers: ["tech", "data", "it", "engineering", "coding", "developer", "development", "web", "app"],
                templates: ["Web & App Development"],
                tasks: ["web", "app", "dev", "code", "website"]
            };
        }
        if (queryLower === "marketing & growth") {
            return {
                performers: ["marketing", "ads", "social", "seo", "growth", "instagram", "facebook"],
                templates: ["Marketing & Ads", "Social Media Management"],
                tasks: ["marketing", "ads", "social", "media", "seo"]
            };
        }
        if (queryLower === "design & creative") {
            return {
                performers: ["design", "creative", "creative & design", "ui", "ux", "graphics", "video", "editing"],
                templates: ["Design Projects", "Video Editing", "Presentation & PPT"],
                tasks: ["design", "logo", "video", "edit", "banner", "presentation", "ppt"]
            };
        }
        if (queryLower === "writing & content") {
            return {
                performers: ["writing", "content", "creative & writing", "resume", "cv", "blog", "copywriter"],
                templates: ["Content Writing", "Resume & Portfolio Building"],
                tasks: ["write", "content", "blog", "copy", "resume"]
            };
        }
        if (queryLower === "business & ops") {
            return {
                performers: ["business", "operations", "admin", "research", "data entry", "excel", "sheets"],
                templates: ["Research & Analysis", "Data Entry & Admin Tasks"],
                tasks: ["research", "analysis", "data", "sheet", "excel", "entry", "admin"]
            };
        }
        return null;
    };

    // Helper to check if a tasker, template, or task matches the selected domain category filter pill
    const checkMatchSkill = (item, skill, type) => {
        if (!skill) return true;
        const expanded = expandQueryFilters(skill);
        
        if (type === "performer") {
            if (expanded) {
                return expanded.performers.some(word =>
                    item.displayName?.toLowerCase().includes(word) ||
                    item.profession?.toLowerCase().includes(word) ||
                    item.bio?.toLowerCase().includes(word) ||
                    item.domain?.toLowerCase().includes(word) ||
                    (Array.isArray(item.skills) && item.skills.some(s => s.toLowerCase().includes(word)))
                );
            }
            return (Array.isArray(item.skills) && item.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) ||
                   (item.profession || "").toLowerCase().includes(skill.toLowerCase());
        }
        
        if (type === "template") {
            if (expanded) {
                return expanded.templates.some(cat => String(item.category).toLowerCase() === cat.toLowerCase());
            }
            return String(item.title || "").toLowerCase().includes(skill.toLowerCase()) ||
                   String(item.category || "").toLowerCase().includes(skill.toLowerCase()) ||
                   String(item.description || "").toLowerCase().includes(skill.toLowerCase()) ||
                   (Array.isArray(item.skills) && item.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
        }
        
        if (type === "task") {
            if (expanded) {
                return expanded.tasks.some(word =>
                    String(item.task || "").toLowerCase().includes(word) ||
                    String(item.category || "").toLowerCase().includes(word) ||
                    String(item.description || "").toLowerCase().includes(word)
                );
            }
            return String(item.task || "").toLowerCase().includes(skill.toLowerCase()) ||
                   String(item.category || "").toLowerCase().includes(skill.toLowerCase()) ||
                   String(item.description || "").toLowerCase().includes(skill.toLowerCase());
        }
        return true;
    };

    // Real-time filters implementation
    const filteredPerformers = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        const expanded = expandQueryFilters(searchQuery);

        return taskers.filter(t => {
            const matchesText = expanded
                ? expanded.performers.some(word =>
                    t.displayName?.toLowerCase().includes(word) ||
                    t.profession?.toLowerCase().includes(word) ||
                    t.bio?.toLowerCase().includes(word) ||
                    t.domain?.toLowerCase().includes(word) ||
                    (Array.isArray(t.skills) && t.skills.some(s => s.toLowerCase().includes(word)))
                  )
                : (!query ||
                    t.displayName?.toLowerCase().includes(query) ||
                    t.profession?.toLowerCase().includes(query) ||
                    t.bio?.toLowerCase().includes(query) ||
                    t.domain?.toLowerCase().includes(query) ||
                    (Array.isArray(t.skills) && t.skills.some(s => s.toLowerCase().includes(query)))
                  );

            const tabName = getTaskerCategoryTab(t);
            const matchesTab = activeTab === "All" || tabName === activeTab;

            const matchesSkill = checkMatchSkill(t, selectedSkill, "performer");

            const matchesRating = !minRating || (t.ratingAvg || 0) >= minRating;

            const matchesExp = experienceFilter === "All" || t.experienceLevel === experienceFilter;

            return matchesText && matchesTab && matchesSkill && matchesRating && matchesExp;
        });
    }, [taskers, searchQuery, activeTab, selectedSkill, minRating, experienceFilter]);

    const filteredTemplates = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        const expanded = expandQueryFilters(searchQuery);

        return taskTemplates.filter(t => {
            const matchesText = expanded
                ? expanded.templates.some(cat => String(t.category).toLowerCase() === cat.toLowerCase())
                : (!query ||
                    String(t.title || "").toLowerCase().includes(query) ||
                    String(t.category || "").toLowerCase().includes(query) ||
                    String(t.description || "").toLowerCase().includes(query) ||
                    (Array.isArray(t.skills) && t.skills.some(s => String(s).toLowerCase().includes(query)))
                  );

            const tabName = getTemplateCategoryTab(t);
            const matchesTab = activeTab === "All" || tabName === activeTab;

            const matchesSkill = checkMatchSkill(t, selectedSkill, "template");

            return matchesText && matchesTab && matchesSkill;
        });
    }, [taskTemplates, searchQuery, activeTab, selectedSkill]);

    const filteredLiveTasks = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        const expanded = expandQueryFilters(searchQuery);

        return liveTasks.filter(t => {
            const matchesText = expanded
                ? expanded.tasks.some(word =>
                    String(t.task || "").toLowerCase().includes(word) ||
                    String(t.category || "").toLowerCase().includes(word) ||
                    String(t.description || "").toLowerCase().includes(word)
                  )
                : (!query ||
                    String(t.task || "").toLowerCase().includes(query) ||
                    String(t.category || "").toLowerCase().includes(query) ||
                    String(t.description || "").toLowerCase().includes(query)
                  );

            const tabName = getTaskCategoryTab(t);
            const matchesTab = activeTab === "All" || tabName === activeTab;

            const matchesSkill = checkMatchSkill(t, selectedSkill, "task");

            return matchesText && matchesTab && matchesSkill;
        });
    }, [liveTasks, searchQuery, activeTab, selectedSkill]);

    // Calculate dynamic counts based on selected search view type and current search filters
    const categoryCounts = useMemo(() => {
        let generalCount = 0;
        let professionalCount = 0;
        let totalCount = 0;

        const query = searchQuery.toLowerCase().trim();
        const expanded = expandQueryFilters(searchQuery);

        if (searchType === "performers") {
            taskers.forEach(t => {
                const matchesText = expanded
                    ? expanded.performers.some(word =>
                        t.displayName?.toLowerCase().includes(word) ||
                        t.profession?.toLowerCase().includes(word) ||
                        t.bio?.toLowerCase().includes(word) ||
                        t.domain?.toLowerCase().includes(word) ||
                        (Array.isArray(t.skills) && t.skills.some(s => s.toLowerCase().includes(word)))
                      )
                    : (!query ||
                        t.displayName?.toLowerCase().includes(query) ||
                        t.profession?.toLowerCase().includes(query) ||
                        t.bio?.toLowerCase().includes(query) ||
                        t.domain?.toLowerCase().includes(query) ||
                        (Array.isArray(t.skills) && t.skills.some(s => s.toLowerCase().includes(query)))
                      );

                const matchesSkill = checkMatchSkill(t, selectedSkill, "performer");

                const matchesRating = !minRating || (t.ratingAvg || 0) >= minRating;

                const matchesExp = experienceFilter === "All" || t.experienceLevel === experienceFilter;

                if (matchesText && matchesSkill && matchesRating && matchesExp) {
                    const tabName = getTaskerCategoryTab(t);
                    if (tabName === "General") generalCount++;
                    else professionalCount++;
                    totalCount++;
                }
            });
            return { All: totalCount, General: generalCount, ProfessionalServices: professionalCount };
        } else if (searchType === "templates") {
            taskTemplates.forEach(t => {
                const matchesText = expanded
                    ? expanded.templates.some(cat => String(t.category).toLowerCase() === cat.toLowerCase())
                    : (!query ||
                        String(t.title || "").toLowerCase().includes(query) ||
                        String(t.category || "").toLowerCase().includes(query) ||
                        String(t.description || "").toLowerCase().includes(query) ||
                        (Array.isArray(t.skills) && t.skills.some(s => String(s).toLowerCase().includes(query)))
                      );

                const matchesSkill = checkMatchSkill(t, selectedSkill, "template");

                if (matchesText && matchesSkill) {
                    const tabName = getTemplateCategoryTab(t);
                    if (tabName === "General") generalCount++;
                    else professionalCount++;
                    totalCount++;
                }
            });
            return { All: totalCount, General: generalCount, ProfessionalServices: professionalCount };
        } else {
            liveTasks.forEach(t => {
                const matchesText = expanded
                    ? expanded.tasks.some(word =>
                        String(t.task || "").toLowerCase().includes(word) ||
                        String(t.category || "").toLowerCase().includes(word) ||
                        String(t.description || "").toLowerCase().includes(word)
                      )
                    : (!query ||
                        String(t.task || "").toLowerCase().includes(query) ||
                        String(t.category || "").toLowerCase().includes(query) ||
                        String(t.description || "").toLowerCase().includes(query)
                      );

                const matchesSkill = checkMatchSkill(t, selectedSkill, "task");

                if (matchesText && matchesSkill) {
                    const tabName = getTaskCategoryTab(t);
                    if (tabName === "General") generalCount++;
                    else professionalCount++;
                    totalCount++;
                }
            });
            return { All: totalCount, General: generalCount, ProfessionalServices: professionalCount };
        }
    }, [searchType, taskers, taskTemplates, liveTasks, searchQuery, selectedSkill, minRating, experienceFilter]);

    // Skeleton loaders
    const SkeletonCard = () => (
        <div className="flex w-full flex-col rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] animate-pulse">
            <div className="flex gap-4">
                <div className="h-16 w-16 rounded-[16px] bg-[var(--color-border-subtle)]" />
                <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 rounded bg-[var(--color-border-subtle)]" />
                    <div className="h-3 w-1/2 rounded bg-[var(--color-border-subtle)]" />
                </div>
            </div>
            <div className="mt-5 space-y-2">
                <div className="h-3.5 w-full rounded bg-[var(--color-border-subtle)]" />
                <div className="h-3.5 w-4/5 rounded bg-[var(--color-border-subtle)]" />
            </div>
            <div className="mt-6 flex h-11 w-full rounded-full bg-[var(--color-border-subtle)]" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-surface)] pb-28 pt-[80px] font-sans antialiased text-[var(--color-text)] selection:bg-[#DFF7F6]">
            <ProviderHeader activePage="home" />

            {/* Premium visual gradients background */}
            <div
                className="pointer-events-none fixed inset-0 -z-10 opacity-70"
                aria-hidden
                style={{
                    background:
                        "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(0, 153, 102, 0.08), transparent 50%), radial-gradient(ellipse 40% 30% at 90% 20%, rgba(0, 153, 102, 0.03), transparent 40%)",
                }}
            />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Keep homepage search text visible on results */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                            navigate("/provider/search", { state: { query: searchQuery.trim() } });
                        }
                    }}
                    className="relative mb-6"
                >
                    <Search
                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-subtle)]"
                        strokeWidth={2.25}
                    />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search performers, skills, templates..."
                        className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-3.5 pl-12 pr-4 text-sm font-semibold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                    />
                </form>

                {/* Visual Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div />
                    {searchType === "performers" && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold transition shadow-sm ${
                                showFilters
                                    ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                                    : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text)]"
                            }`}
                        >
                            <Filter className="h-4 w-4" />
                            Advanced Filters
                            {(minRating > 0 || experienceFilter !== "All") && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white">
                                    !
                                </span>
                            )}
                        </button>
                    )}
                </div>
                {/* Premium Search Content Type Switcher */}
                <div className="mb-8 flex gap-4 p-1.5 bg-slate-100 rounded-2xl w-fit shadow-[var(--shadow-xs)]">
                    <button
                        onClick={() => setSearchType("performers")}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                            searchType === "performers" ? "bg-white text-[var(--color-text)] shadow-sm" : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        <Users size={14} className="text-[var(--color-primary)]" />
                        Taskers & Performers
                        <span className="px-1.5 py-0.5 rounded-lg text-[9px] bg-slate-200 text-slate-600 font-bold">
                            {filteredPerformers.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setSearchType("templates")}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                            searchType === "templates" ? "bg-white text-[var(--color-text)] shadow-sm" : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        <Sparkles size={14} className="text-[#29ADAC]" />
                        Task Templates
                        <span className="px-1.5 py-0.5 rounded-lg text-[9px] bg-slate-200 text-slate-600 font-bold">
                            {filteredTemplates.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setSearchType("tasks")}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                            searchType === "tasks" ? "bg-white text-[var(--color-text)] shadow-sm" : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        <Clock size={14} className="text-blue-500" />
                        My Live Tasks
                        <span className="px-1.5 py-0.5 rounded-lg text-[9px] bg-slate-200 text-slate-600 font-bold">
                            {filteredLiveTasks.length}
                        </span>
                    </button>
                </div>

                {/* Global Filters Panel - Category Tabs & Skill Pills (Matches screenshot) */}
                <div className="mb-6 flex items-center gap-3 overflow-hidden">
                    <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide flex-1">
                        {[
                            { name: "All", count: categoryCounts.All },
                            { name: "General", count: categoryCounts.General },
                            { name: "Professional Services", count: categoryCounts.ProfessionalServices },
                        ].map((tab) => (
                            <button
                                key={tab.name}
                                type="button"
                                onClick={() => setActiveTab(tab.name)}
                                className={`shrink-0 rounded-full border px-5 py-2.5 text-xs font-bold transition whitespace-nowrap shadow-sm ${
                                    activeTab === tab.name
                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md"
                                        : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/35 hover:text-[var(--color-text)]"
                                }`}
                            >
                                {tab.name}{" "}
                                <span
                                    className={`ml-1 text-[10px] font-bold ${
                                        activeTab === tab.name ? "text-[#EFFBFB]" : "text-[var(--color-text-subtle)]"
                                    }`}
                                >
                                    ({tab.count})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8 flex flex-wrap gap-2">
                    {curatedSkillPills.map((skill) => {
                        const isSelected = selectedSkill === skill;
                        return (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => setSelectedSkill(isSelected ? null : skill)}
                                className={`rounded-full px-4 py-1.5 text-[10.5px] font-bold transition flex items-center gap-1.5 border shadow-[var(--shadow-xs)] ${
                                    isSelected
                                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                                        : "bg-white border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-text)]"
                                }`}
                            >
                                {skill}
                                {isSelected && <X className="h-3 w-3 shrink-0" strokeWidth={2.5} />}
                            </button>
                        );
                    })}
                </div>

                {/* Switcher Display Layouts */}
                <AnimatePresence mode="wait">
                    {searchType === "performers" && (
                        <motion.div
                            key="performers-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Advanced filters panel */}
                            <AnimatePresence>
                                {showFilters && (
                                    <div className="overflow-hidden mb-6">
                                        <div className="flex flex-wrap gap-4 rounded-3xl bg-[var(--color-primary-subtle)]/30 border border-[var(--color-primary)]/10 p-5 backdrop-blur-md">
                                            <div className="space-y-2 flex-1 min-w-[200px]">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-subtle)]">
                                                    Experience Level
                                                </label>
                                                <select
                                                    value={experienceFilter}
                                                    onChange={(e) => setExperienceFilter(e.target.value)}
                                                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] shadow-sm"
                                                >
                                                    <option value="All">All Levels</option>
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Expert">Expert</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2 flex-1 min-w-[200px]">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-subtle)]">
                                                    Minimum Rating
                                                </label>
                                                <div className="flex gap-2">
                                                    {[0, 3, 4, 4.5].map((r) => (
                                                        <button
                                                            key={r}
                                                            type="button"
                                                            onClick={() => setMinRating(r)}
                                                            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition border ${
                                                                minRating === r
                                                                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-sm"
                                                                    : "bg-white border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/30"
                                                            }`}
                                                        >
                                                            {r === 0 ? "Any" : `${r} ★+`}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMinRating(0);
                                                        setExperienceFilter("All");
                                                        setSelectedSkill(null);
                                                    }}
                                                    className="text-xs font-black text-red-500 hover:text-red-600 hover:underline px-2 py-3"
                                                >
                                                    Reset Filters
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Performers Card Grid */}
                            {isLoadingTaskers ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <SkeletonCard key={i} />
                                    ))}
                                </div>
                            ) : filteredPerformers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-[var(--color-border)] shadow-sm">
                                    <div className="h-20 w-20 rounded-[24px] bg-[#EFFBFB] flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-inner ring-1 ring-emerald-100">
                                        <Search className="h-9 w-9" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-text)]">No Performers Match</h3>
                                    <p className="text-[var(--color-text-muted)] text-sm mt-1.5 max-w-sm mx-auto font-medium">
                                        Try relaxing your search terms or clearing your selected category filter tags.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredPerformers.map((p, idx) => (
                                        <motion.article
                                            key={p.id || idx}
                                            whileHover={{ y: -5 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="group relative flex flex-col rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-lg)] transition-shadow duration-300"
                                        >
                                            <div className="flex gap-2 mb-4">
                                                {p.isAvailable !== false ? (
                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EFFBFB] text-[#10605F] rounded-full text-[10px] font-black uppercase tracking-wider border border-[#29ADAC]/20">
                                                        <span className="relative flex h-2 w-2 shrink-0">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10605F]"></span>
                                                        </span>
                                                        Online
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-100">
                                                        Offline
                                                    </span>
                                                )}
                                                {p.kycStatus === "VERIFIED" && (
                                                    <span className="flex items-center gap-1 px-2.5 py-1 bg-[var(--color-primary-subtle)] text-[var(--color-primary)] rounded-full text-[10px] font-black uppercase tracking-wider border border-[var(--color-primary)]/10">
                                                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Verified ID
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex min-w-0 gap-3.5">
                                                    <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm bg-slate-50">
                                                        <img
                                                            src={
                                                                p.user?.profilePicUrl ||
                                                                p.avatar ||
                                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                    p.displayName || p.name || p.person || "P"
                                                                )}&background=009966&color=fff&size=128`
                                                            }
                                                            alt={p.displayName || p.name || "Performer"}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-[16px] font-black leading-tight text-[var(--color-text)] truncate">
                                                            {p.displayName || p.name || p.person || "Anonymous Performer"}
                                                        </h3>
                                                        <p className="mt-0.5 text-xs font-semibold text-[var(--color-text-subtle)] truncate">
                                                            {p.profession || p.name || "Expert Tasker"}
                                                        </p>
                                                        <div className="mt-1.5 flex items-center gap-1">
                                                            <Star className="h-3.5 w-3.5 fill-current text-amber-500" strokeWidth={0} />
                                                            <span className="text-xs font-black text-[var(--color-text)]">
                                                                {(p.rating || p.ratingAvg || 4.5).toFixed(1)}
                                                            </span>
                                                            <span className="text-[10px] font-semibold text-[var(--color-text-subtle)]">
                                                                ({p.ratingCount || (Array.isArray(p.reviews) ? p.reviews.length : 0)} reviews)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="mb-4 text-xs font-medium leading-relaxed text-[var(--color-text-muted)] line-clamp-3 min-h-[54px]">
                                                {p.bio || "Proven expertise in producing exceptional deliverables with rapid iteration cycles."}
                                            </p>

                                            <div className="mb-5 flex flex-wrap gap-1.5 overflow-hidden h-[24px]">
                                                {(p.skills || []).slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 bg-[var(--color-primary-subtle)] text-[var(--color-primary)] rounded-md text-[10px] font-extrabold uppercase tracking-tight border border-[var(--color-primary)]/[0.06]"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)]/70 pt-4">
                                                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--color-primary)]">
                                                    <Zap className="h-3.5 w-3.5" />
                                                    <span>{p.completedTasksCount || p.tasks?.split(" ")[0] || 0} finished</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[16px] font-black text-[var(--color-text)]">
                                                        {p.hourlyRate ? `₹${Number(p.hourlyRate).toLocaleString("en-IN")}/hr` : ""}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/provider/task-performer-profile/${p.id || p.userId}`, { state: { tasker: p } })}
                                                    className="flex-1 rounded-full bg-[var(--color-primary)] py-2.5 text-xs font-bold text-white shadow-[var(--shadow-xs)] hover:bg-[var(--color-primary-hover)] transition active:scale-95 text-center"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {searchType === "templates" && (
                        <motion.div
                            key="templates-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredTemplates.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-[var(--color-border)] shadow-sm">
                                    <div className="h-20 w-20 rounded-[24px] bg-[#EFFBFB] flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-inner ring-1 ring-emerald-100">
                                        <Sparkles className="h-9 w-9" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-text)]">No Templates Match</h3>
                                    <p className="text-[var(--color-text-muted)] text-sm mt-1.5 max-w-sm mx-auto font-medium">
                                        No quick-start formats match your active filters. Try relaxing your selected tags.
                                    </p>
                                </div>
                            ) : (
                                filteredTemplates.map((t, i) => (
                                    <div
                                        key={t.id || i}
                                        onClick={() => navigate("/provider/post-task-manual", {
                                            state: {
                                                templateData: {
                                                    title: t.title,
                                                    description: t.description,
                                                    category: t.category,
                                                    budget: t.budget,
                                                    skills: t.skills,
                                                    taskType: t.taskType
                                                }
                                            }
                                        })}
                                        className="group relative flex flex-col cursor-pointer overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-lg)]"
                                    >
                                        <div className="mb-4 flex items-start justify-between">
                                            <div
                                                className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/[0.05]"
                                                style={{
                                                    backgroundColor: `${t.color}15`,
                                                    color: t.color
                                                }}
                                            >
                                                <t.Icon className="h-6 w-6" strokeWidth={2.25} />
                                            </div>
                                            <span className="rounded-full bg-[var(--color-primary-subtle)] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[var(--color-primary)] shadow-sm">
                                                Quick Start
                                            </span>
                                        </div>

                                        <h3 className="mb-2 line-clamp-2 min-h-[40px] text-[15px] font-bold leading-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
                                            {t.title}
                                        </h3>

                                        <p className="mb-4 text-xs font-medium leading-relaxed text-[var(--color-text-muted)] line-clamp-2 min-h-[32px]">
                                            {t.description}
                                        </p>

                                        <div className="mb-5 flex flex-wrap gap-1.5">
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-[var(--color-text-subtle)]">
                                                {t.category}
                                            </span>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)]/60 pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">Starts from</span>
                                                <span className="text-[13px] font-black text-[var(--color-text)]">{t.budget.split('-')[0].trim()}</span>
                                            </div>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-sm transition-transform group-hover:translate-x-1">
                                                <ArrowRight className="h-4 w-4" strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {searchType === "tasks" && (
                        <motion.div
                            key="tasks-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {contextLoading ? (
                                [1, 2, 3].map(i => <SkeletonCard key={i} />)
                            ) : filteredLiveTasks.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-[var(--color-border)] shadow-sm">
                                    <div className="h-20 w-20 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-500 mb-6 shadow-inner ring-1 ring-blue-100">
                                        <PlusCircle className="h-9 w-9" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-text)]">No Live Tasks Match</h3>
                                    <p className="text-[var(--color-text-muted)] text-sm mt-1.5 max-w-sm mx-auto font-medium">
                                        We couldn't find any of your posted live tasks matching this search keyword or filter.
                                    </p>
                                    <button
                                        onClick={() => navigate("/provider/post-task-selection")}
                                        className="mt-6 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-105 transition"
                                    >
                                        Post New Task Now
                                    </button>
                                </div>
                            ) : (
                                filteredLiveTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => navigate(`/provider/task-applicants?taskId=${task.id}`)}
                                        className="group relative flex flex-col cursor-pointer overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-lg)]"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="rounded-full bg-[var(--color-primary-subtle)] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[var(--color-primary)] shadow-sm">
                                                {task.category}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFFBFB]/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#10605F] border border-[#29ADAC]/20/50">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#10605F] animate-pulse"></span>
                                                Live
                                            </span>
                                        </div>

                                        <h3 className="mb-4 line-clamp-2 min-h-[44px] text-lg font-black leading-tight text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
                                            {task.task}
                                        </h3>

                                        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
                                            <span>Deadline: {task.deadline}</span>
                                            <span>•</span>
                                            <span className="text-[#10605F] font-extrabold flex items-center gap-1">
                                                {task.applicantsCount || 0} interested
                                            </span>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)]/60 pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">Budget</span>
                                                <span className="text-lg font-black text-[var(--color-text)]">{task.budget}</span>
                                            </div>
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-sm transition-transform group-hover:translate-x-1">
                                                <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SearchPage;
