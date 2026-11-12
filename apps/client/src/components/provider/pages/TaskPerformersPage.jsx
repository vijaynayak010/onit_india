import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    ChevronRight,
    LayoutGrid,
    ListTodo,
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
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { listTaskers } from "../services/api";
import { getSavedPerformerIds, toggleSavedPerformer } from "../utils/savedPerformers";

const normalizeDomain = (tasker) =>
    String(tasker?.domain || tasker?.professionCategory || tasker?.category || "Professional Services").trim() || "Professional Services";

const getTaskerSkills = (tasker) => {
    if (Array.isArray(tasker?.skills)) return tasker.skills.filter(Boolean);
    if (Array.isArray(tasker?.skillTags)) return tasker.skillTags.filter(Boolean);
    return [];
};

const getTaskerAvatar = (tasker) =>
    tasker?.profilePicUrl ||
    tasker?.avatar ||
    tasker?.photoUrl ||
    tasker?.user?.profilePicUrl ||
    tasker?.user?.avatar ||
    "";

const getCompletedCount = (tasker) =>
    tasker?.completedTasksCount ??
    tasker?.completedTasks ??
    tasker?.tasksCompleted ??
    tasker?.totalCompletedTasks ??
    tasker?.stats?.completedTasks ??
    tasker?._count?.completedTasks ??
    tasker?._count?.taskAssignments ??
    0;

const getRateLabel = (tasker) => {
    const rate = tasker?.hourlyRate ?? tasker?.ratePerHour ?? tasker?.pricing?.hourlyRate;
    if (!rate) return "";
    return `₹${Number(rate).toLocaleString("en-IN")}/hr`;
};

const TaskPerformersPage = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("All");
    const [taskers, setTaskers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Advanced Filter State
    const [minRating, setMinRating] = useState(0);
    const [experienceFilter, setExperienceFilter] = useState("All");
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [savedIds, setSavedIds] = useState(() => getSavedPerformerIds());

    const fetchTaskers = async () => {
        setIsLoading(true);
        try {
            const response = await listTaskers({ limit: 99 });
            const data = response?.taskers || response?.data?.taskers || response?.data || response || [];
            setTaskers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("[FirstDoer] Error fetching taskers:", err);
            setTaskers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTaskers();
    }, []);

    // Extract unique skills from all taskers for quick filtering
    const allSkills = useMemo(() => {
        const skillsSet = new Set();
        taskers.forEach(t => {
            getTaskerSkills(t).forEach(s => skillsSet.add(s));
        });
        return Array.from(skillsSet).slice(0, 15); // Show top 15 skills as quick filters
    }, [taskers]);

    // Helper: Group taskers by Domain with multi-filter logic
    const getGroupedData = () => {
        const query = searchQuery.toLowerCase();
        
        const filtered = taskers.filter(t => {
            const domain = normalizeDomain(t);
            const skills = getTaskerSkills(t);

            // Search Query (Name, Profession, Domain, Skills)
            const matchesSearch = !query || 
                t.displayName?.toLowerCase().includes(query) || 
                t.profession?.toLowerCase().includes(query) || 
                domain.toLowerCase().includes(query) ||
                skills.some((skill) => String(skill).toLowerCase().includes(query));
            
            // Rating Filter
            const matchesRating = !minRating || (t.ratingAvg || 0) >= minRating;
            
            // Experience Filter
            const matchesExp = experienceFilter === "All" || t.experienceLevel === experienceFilter;
            
            // Skill Filter
            const matchesSkill = !selectedSkill || skills.includes(selectedSkill);
            
            // Domain Tab Filter
            const matchesDomain = activeFilter === "All" || domain === activeFilter;

            return matchesSearch && matchesRating && matchesExp && matchesSkill && matchesDomain;
        });

        const groups = {};
        filtered.forEach(t => {
            const cat = normalizeDomain(t);
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(t);
        });

        return Object.entries(groups).map(([category, performers]) => ({
            category,
            performers,
            count: performers.length
        }));
    };

    const groupedSections = getGroupedData();

    // Categories with counts for the tab bar
    const categoryTabs = useMemo(() => {
        const domains = ["All"];
        const domainCounts = { "All": taskers.length };
        
        taskers.forEach(t => {
            const d = normalizeDomain(t);
            if (!domainCounts[d]) {
                domainCounts[d] = 0;
                domains.push(d);
            }
            domainCounts[d]++;
        });

        return domains.map(d => ({ name: d, count: domainCounts[d] }));
    }, [taskers]);

    const SkeletonCard = () => (
        <div className="flex min-w-0 animate-pulse flex-col rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
            <div className="mb-4 flex gap-3">
                <div className="h-14 w-14 rounded-xl bg-[var(--color-border-subtle)]" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-[var(--color-border-subtle)]" />
                    <div className="h-3 w-1/2 rounded bg-[var(--color-border-subtle)]" />
                </div>
            </div>
            <div className="h-4 w-full rounded bg-[var(--color-border-subtle)]" />
            <div className="mt-2 h-4 w-2/3 rounded bg-[var(--color-border-subtle)]" />
            <div className="mt-auto flex h-10 w-full rounded-full bg-[var(--color-border-subtle)]" />
        </div>
    );

    const PerformerCard = ({ p }) => {
        const skills = getTaskerSkills(p);
        const avatar = getTaskerAvatar(p);
        const completed = getCompletedCount(p);
        const rating = p.ratingAvg || p.averageRating || p.avgRating;
        const ratingCount = p.ratingCount ?? p.reviewCount ?? p.totalReviews ?? 0;
        const rateLabel = getRateLabel(p);

        return (
        <div className="flex min-w-0 flex-col rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] ring-1 ring-black/[0.03] transition hover:border-[var(--color-primary)]/25 hover:shadow-[var(--shadow-lg)]">
            <div className="mb-4 flex items-start justify-between gap-2">
                <div className="flex min-w-0 gap-3">
                    <div className="relative h-14 w-14 shrink-0">
                        <div className="h-full w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)] shadow-inner">
                            <img
                                src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.displayName || "User")}&background=059669&color=fff&size=128`}
                                alt={p.displayName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {p.isAvailable !== false && (
                            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#10605F]" title="Available now" />
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-[15px] font-medium leading-tight text-[var(--color-text)] truncate">{p.displayName || "User"}</h3>
                            {p.kycStatus === "VERIFIED" && (
                                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" strokeWidth={2.5} />
                            )}
                        </div>
                        <p className="mb-1 text-[12px] font-semibold text-[var(--color-text-subtle)] truncate">{p.profession || "Performer"}</p>
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-amber-500" strokeWidth={0} />
                            <span className="text-[10px] font-bold text-[var(--color-text)]">{rating || "New"}</span>
                            <span className="text-[10px] font-medium text-[var(--color-text-subtle)]">({ratingCount})</span>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setSavedIds(toggleSavedPerformer(p.id))}
                    className={`shrink-0 rounded-lg p-1.5 transition ${
                      savedIds.includes(p.id)
                        ? "text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]"
                        : "text-[var(--color-text-subtle)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)]"
                    }`}
                    aria-label={savedIds.includes(p.id) ? "Remove from saved" : "Save performer"}
                >
                    <Bookmark
                      className="h-4 w-4"
                      strokeWidth={2.25}
                      fill={savedIds.includes(p.id) ? "currentColor" : "none"}
                    />
                </button>
            </div>

            <p className="mb-4 line-clamp-2 text-[12px] font-medium leading-relaxed text-[var(--color-text-muted)] min-h-[36px]">
                {p.bio || "High-quality task performer focused on excellence and timely delivery."}
            </p>

            <div className="mb-5 flex flex-wrap gap-1.5 overflow-hidden h-[24px]">
                {(skills.length ? skills : ["Reliable"]).slice(0, 3).map(skill => (
                    <span key={skill} className="rounded-md bg-[#EFFBFB] px-2 py-0.5 text-[10px] font-bold text-[var(--color-primary)] border border-[#29ADAC]/20/50">
                        {skill}
                    </span>
                ))}
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-4">
                <div className="flex items-center gap-1.5 text-[var(--color-primary)]">
                    <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
                    <span className="text-[11px] font-black">{completed} finished</span>
                </div>
                <div className="text-right min-h-[20px]">
                    {rateLabel ? <p className="text-[14px] font-black text-[var(--color-text)]">{rateLabel}</p> : null}
                </div>

            </div>
            <div className="mt-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => navigate(`/provider/task-performer-profile/${p.id}`, { state: { tasker: p } })}
                    className="flex-1 rounded-full bg-[var(--color-primary)] py-2.5 text-[12px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
                >
                    View profile
                </button>
            </div>
        </div>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--color-surface)] pb-20 pt-[80px] font-sans text-[var(--color-text)] antialiased">
            <ProviderHeader activePage="home" />

            <div
                className="pointer-events-none fixed inset-0 -z-10 opacity-80"
                aria-hidden
                style={{
                    background:
                        "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(5, 150, 105, 0.07), transparent 50%), radial-gradient(ellipse 50% 35% at 100% 25%, rgba(5, 150, 105, 0.04), transparent 45%)",
                }}
            />

            <div className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-elevated)] to-[var(--color-surface)]/90">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
                        <button
                            type="button"
                            onClick={() => navigate("/provider/dashboard")}
                            className="inline-flex items-center gap-2 font-medium text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
                        >
                            <Home className="h-4 w-4" strokeWidth={2.25} />
                            Home
                        </button>
                        <ChevronRight className="h-4 w-4 text-[var(--color-border)]" aria-hidden />
                        <span className="font-bold text-[var(--color-primary)]">Task performers</span>
                    </nav>
                </div>
            </div>

            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/80 backdrop-blur-sm sticky top-[80px] z-20">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-subtle)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                                    <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                                    Talent marketplace
                                </span>
                            </div>
                            <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text)] sm:text-3xl">Find the right performer</h1>
                        </div>
                        <button 
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-[13px] font-bold transition ${showAdvancedFilters ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" : "border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)]/40"}`}
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                            {(minRating > 0 || experienceFilter !== "All" || selectedSkill) && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-white">!</span>
                            )}
                        </button>
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-subtle)]" strokeWidth={2.25} />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder='Search performers, categories, or skills...'
                                className="w-full rounded-2xl border-2 border-[var(--color-border)] bg-white py-4 pl-12 pr-14 text-[14px] font-semibold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/5 shadow-[var(--shadow-sm)]"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {showAdvancedFilters && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-6 flex flex-wrap gap-4 rounded-[var(--radius-xl)] bg-[#EFFBFB]/50 p-6 border border-[#29ADAC]/20/50">
                                    <div className="space-y-2 flex-1 min-w-[150px]">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Experience Level</label>
                                        <select 
                                            value={experienceFilter}
                                            onChange={(e) => setExperienceFilter(e.target.value)}
                                            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-[13px] font-bold outline-none focus:border-[var(--color-primary)]"
                                        >
                                            <option value="All">All Levels</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 flex-1 min-w-[150px]">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">Minimum Rating</label>
                                        <div className="flex items-center gap-3">
                                            {[0, 3, 4, 4.5].map(r => (
                                                <button 
                                                    key={r}
                                                    onClick={() => setMinRating(r)}
                                                    className={`rounded-lg px-3 py-2 text-[12px] font-bold transition ${minRating === r ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/30"}`}
                                                >
                                                    {r === 0 ? "Any" : `${r}+ ★`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <button 
                                            onClick={() => { setMinRating(0); setExperienceFilter("All"); setSelectedSkill(null); }}
                                            className="text-[12px] font-bold text-red-500 hover:underline px-2 py-2"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-6 flex items-center gap-3 overflow-hidden">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
                            {categoryTabs.map((filter) => (
                                <button
                                    key={filter.name}
                                    type="button"
                                    onClick={() => setActiveFilter(filter.name)}
                                    className={`shrink-0 rounded-xl border px-5 py-2.5 text-[13px] font-bold transition whitespace-nowrap ${
                                        activeFilter === filter.name
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-md)]"
                                            : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/35"
                                    }`}
                                >
                                    {filter.name} <span className={`ml-1 text-[10px] ${activeFilter === filter.name ? "text-[#EFFBFB]" : "text-[var(--color-text-subtle)]"}`}>({filter.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {allSkills.map(skill => (
                            <button
                                key={skill}
                                onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                                className={`rounded-full px-3 py-1 text-[10px] font-bold transition flex items-center gap-1.5 ${selectedSkill === skill ? "bg-[var(--color-primary)] text-white" : "bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[#EFFBFB]"}`}
                            >
                                {skill}
                                {selectedSkill === skill && <X className="h-2.5 w-2.5" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="space-y-10">
                        <div className="h-6 w-48 rounded bg-[var(--color-border-subtle)]" />
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                        </div>
                    </div>
                ) : groupedSections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-24 w-24 rounded-[var(--radius-3xl)] bg-[#EFFBFB] flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-inner ring-1 ring-emerald-100">
                            <Search className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-medium text-[var(--color-text)]">No matches found</h2>
                        <p className="text-[var(--color-text-muted)] mt-2 max-w-xs mx-auto font-medium">We couldn't find any performers matching your current filters. Try relaxing your search or category.</p>
                        <button onClick={() => { setActiveFilter("All"); setSearchQuery(""); setMinRating(0); setExperienceFilter("All"); setSelectedSkill(null); }} className="mt-8 px-8 py-3 rounded-full bg-[var(--color-primary)] font-bold text-white shadow-[var(--shadow-glow)] hover:bg-[var(--color-primary-hover)] transition">Clear everything</button>
                    </div>
                ) : (
                    groupedSections.map((section, sIdx) => (
                        <motion.section
                            key={section.category}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: sIdx * 0.05 }}
                            className="mb-14 last:mb-0"
                        >
                            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-medium text-[var(--color-text)] sm:text-2xl">{section.category}</h2>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">{section.count}</span>
                                    </div>
                                    <p className="mt-1 text-[13px] font-medium text-[var(--color-text-subtle)]">Top professionals in this category</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setActiveFilter(section.category); setExperienceFilter("All"); setMinRating(0); setSelectedSkill(null); setSearchQuery(""); }}
                                    className="inline-flex items-center gap-1 text-[13px] font-bold text-[var(--color-primary)] transition hover:underline"
                                >
                                    Browse all <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {section.performers.map((p, pIdx) => (
                                    <PerformerCard key={`${p.id}-${pIdx}`} p={p} />
                                ))}
                            </div>
                        </motion.section>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskPerformersPage;
