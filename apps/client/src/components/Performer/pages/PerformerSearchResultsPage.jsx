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

    const displayTasks = realTasks.map(rt => ({
        id: rt.id,
        title: rt.title || "Untitled Task",
        price: rt.priceAmount ? `₹${rt.priceAmount.toLocaleString()}` : "Competitive",
        rating: 5.0,
        deadline: rt.dueAt ? new Date(rt.dueAt).toLocaleDateString() : "No deadline",
        tags: [rt.category || "General"],
        urgent: rt.priority === 'HIGH'
    }));

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans lg:pl-[220px]">
            <PerformerHeader activePage="home" />
            
            <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-12 pt-32 sm:px-8 lg:px-10 lg:pt-36">
                <div className="mb-10">
                    <h1 className="text-[28px] font-medium text-gray-900 mb-2">Search Results</h1>
                    <p className="text-[14px] font-bold text-gray-400">We found <span className="text-[#16a34a]">{displayTasks.length} tasks</span> matching your criteria</p>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mb-8">
                    {filters.map((f, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveFilter(f)}
                            className={`px-8 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap border-2 transition-all ${activeFilter === f
                                ? 'bg-white border-[#16a34a] text-[#16a34a] shadow-sm'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-20 text-gray-400">
                             <Loader2 size={40} className="animate-spin mb-4" />
                             <p className="font-bold">Searching for opportunities...</p>
                        </div>
                    ) : displayTasks.length > 0 ? (
                        displayTasks.map((task) => (
                            <div key={task.id} className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {task.tags.map((tag, idx) => (
                                            <span key={idx} className="text-[9px] font-black text-[#16a34a] bg-green-50 tracking-widest px-3 py-1.5 rounded-md uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {task.urgent && (
                                        <span className="text-[9px] font-black text-[#f87171] bg-red-50 tracking-widest px-3 py-1.5 rounded-md uppercase">
                                            URGENT
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-center mb-3">
                                    <h3 
                                        onClick={() => navigate(`/performer/task/${task.id}`)}
                                        className="text-[18px] font-medium text-gray-900 leading-tight group-hover:text-[#16a34a] transition-colors cursor-pointer hover:underline"
                                    >
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                        <span className="text-yellow-400 text-[14px]">★</span>
                                        <span className="text-[11px] font-black text-gray-900">{task.rating}</span>
                                    </div>
                                </div>
                                
                                <p className="text-[24px] font-medium text-gray-900 mb-6">{task.price}</p>
                                
                                <div className="flex items-center gap-2 mb-8 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Deadline: {task.deadline}</span>
                                </div>
                                
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <button 
                                        onClick={() => navigate(`/performer/task/${task.id}`)}
                                        className="text-[13px] font-black text-[#16a34a] flex items-center gap-2 hover:underline decoration-2"
                                    >
                                        View Details <span>↗</span>
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/performer/task/${task.id}`)}
                                        className="bg-[#16a34a] text-white px-8 py-3 rounded-[20px] text-[13px] font-bold hover:bg-green-700 transition-all shadow-sm"
                                    >
                                        Send Proposal
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-[40px]">
                            <p className="text-[18px] font-medium mb-2">No tasks found</p>
                            <p className="text-[14px]">Try adjusting your search filters or check back later.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PerformerSearchResultsPage;
