import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformerHeader from '../components/PerformerHeader';
import { searchTasks } from '../services/api';
import { Loader2 } from 'lucide-react';

const PerformerSearchResultsPage = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('Found Tasks');
    const [realTasks, setRealTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const filters = ['Found Tasks', 'High Priority', 'Local Tasks', 'Newest'];

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const res = await searchTasks({ page: 1, limit: 12 });
                // The backend returns an object { tasks: [], pagination: {} }
                if (res && res.tasks) {
                    setRealTasks(res.tasks);
                } else if (res && res.data) {
                    // Fallback to Admin-style structure
                    setRealTasks(res.data);
                } else if (Array.isArray(res)) {
                    setRealTasks(res);
                }
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const filteredTasks = realTasks.filter((rt) => {
        if (activeFilter === 'High Priority') return String(rt.priority || '').toUpperCase() === 'HIGH';
        if (activeFilter === 'Local Tasks') return String(rt.mode || rt.locationType || '').toUpperCase() === 'ON_GROUND' || Boolean(rt.locationCity);
        return true;
    });

    const sortedTasks = activeFilter === 'Newest'
        ? [...filteredTasks].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        : filteredTasks;

    const displayTasks = sortedTasks.map(rt => ({
        id: rt.id,
        title: rt.title || "Untitled Task",
        price: rt.priceAmount ? `₹${rt.priceAmount.toLocaleString("en-IN")}` : "Competitive",
        rating: 5.0,
        deadline: rt.dueAt ? new Date(rt.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No deadline",
        tags: [rt.category || "General"],
        urgent: rt.priority === 'HIGH'
    }));

    return (
        <div className="min-h-screen bg-[var(--color-surface)] flex flex-col font-sans lg:pl-[240px]">
            <PerformerHeader activePage="home" />
            
            <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-12 pt-28 sm:px-8 lg:px-10 lg:pt-32">
                <div className="mb-8">
                    <h1 className="dash-page-title text-[var(--dash-text)] mb-2">Search Results</h1>
                    <p className="text-[14px] font-normal text-[var(--color-text-muted)]">
                        We found <span className="font-medium text-[#10605F]">{displayTasks.length} tasks</span> matching your criteria
                    </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2.5 pb-4 mb-6">
                    {filters.map((f, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveFilter(f)}
                            className={`px-5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap border transition-all ${activeFilter === f
                                ? 'bg-[#EFFBFB] border-[#10605F] text-[#10605F] shadow-xs'
                                : 'bg-white border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[#29ADAC]/50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-20 text-[var(--color-primary)]">
                             <Loader2 size={36} className="animate-spin mb-3" />
                             <p className="text-sm font-normal text-[var(--color-text-muted)]">Searching for opportunities...</p>
                        </div>
                    ) : displayTasks.length > 0 ? (
                        displayTasks.map((task) => (
                            <div key={task.id} className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col">
                                <div className="flex justify-between items-start gap-2 mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {task.tags.map((tag, idx) => (
                                            <span key={idx} className="text-[11px] font-medium text-[#10605F] bg-[#EFFBFB] px-2.5 py-1 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {task.urgent && (
                                        <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                                            Urgent
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-start gap-3 mb-3">
                                    <h3 
                                        onClick={() => navigate(`/performer/task/${task.id}`)}
                                        className="text-[16px] font-medium text-[var(--color-text)] leading-snug group-hover:text-[#10605F] transition-colors cursor-pointer hover:underline"
                                    >
                                        {task.title}
                                    </h3>
                                    <div className="flex shrink-0 items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                        <span className="text-amber-500 text-[13px]">★</span>
                                        <span className="text-[12px] font-medium text-[var(--color-text)]">{task.rating}</span>
                                    </div>
                                </div>
                                
                                <p className="text-[20px] font-medium text-[var(--color-text)] mb-4">{task.price}</p>
                                
                                <div className="flex items-center gap-2 mb-6 text-[var(--color-text-muted)]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-[12px] font-normal">Deadline: {task.deadline}</span>
                                </div>
                                
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                                    <button 
                                        type="button"
                                        onClick={() => navigate(`/performer/task/${task.id}`)}
                                        className="text-[13px] font-medium text-[#10605F] flex items-center gap-1.5 hover:underline"
                                    >
                                        View Details <span>↗</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => navigate(`/performer/task/${task.id}`)}
                                        className="bg-[#10605F] text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-[#083B3A] transition-all shadow-xs"
                                    >
                                        Send Proposal
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-2xl bg-white">
                            <p className="text-[17px] font-medium text-[var(--color-text)] mb-1">No tasks found</p>
                            <p className="text-[13px] font-normal">Try adjusting your search filters or check back later.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PerformerSearchResultsPage;
