import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ProviderHeader from '../components/ProviderHeader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Star,
    MapPin,
    Clock,
    DollarSign,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    User,
    Check,
    Loader2,
    AlertCircle,
    MessageCircle
} from 'lucide-react';
import { getTaskDetails, listTaskers, getTaskInterests } from '../services/api';


const PostTaskSearchResultsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId') || 'temp-id';
    const [activeTab, setActiveTab] = useState('applicants'); // 'applicants' or 'matches'
    const [performers, setPerformers] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [taskData, setTaskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(true);



    const fetchData = async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            setError(null);

            // 1. Fetch Task Details if not already present or if we need a full refresh
            const [task, interests] = await Promise.all([
                getTaskDetails(taskId).catch(() => null),
                getTaskInterests(taskId).catch(() => []),
            ]);
            if (task) setTaskData(task);

            // 2. Fetch Recommended Matches
            let mappedMatches = [];
            try {
                const matchesResponse = await listTaskers({ limit: 12, sortBy: 'rating_desc' });
                const list = interests?.interests || interests?.data || (Array.isArray(interests) ? interests : []);
                mappedMatches = (matchesResponse.taskers || matchesResponse || []).map(t => {
                    const matchingInterest = list.find(
                        (interest) => 
                            (interest.taskerId === t.id) || 
                            (interest.tasker?.id === t.id) ||
                            (interest.tasker?.userId === t.user?.id || interest.tasker?.userId === t.user?._id)
                    );
                    return {
                        id: t.id,
                        userId: t.user?.id || t.user?._id,
                        interestId: matchingInterest ? matchingInterest.id : undefined,
                        name: t.professional_title ,
                        person: t.displayName || t.user?.email?.split('@')[0] || "Anonymous",
                        rate: t.hourlyRate ? `₹${Number(t.hourlyRate).toLocaleString("en-IN")}/hr` : "",
                        rating: t.ratingAvg || 4.5,
                        tasks: `${t.completedTasksCount || 10}+ Tasks`,
                        tags: t.skills || ["Reliable", "Verified"],
                        avatar: t.user?.profilePicUrl || `https://ui-avatars.com/api/?name=${t.displayName || 'P'}`,
                        desc: t.bio || "Bringing excellence and experience to every task."
                    };
                });
            } catch (_) { /* listTaskers may fail if server is down */ }

            // 3. Map interests (applicants) from the dedicated endpoint
            const list = interests?.interests || interests?.data || (Array.isArray(interests) ? interests : []);
            const apps = list.map(interest => {
                const t = interest.tasker || {};
                return {
                    id: t.id || interest.taskerId,
                    userId: t.user?.id || t.user?._id,
                    interestId: interest.id,
                    name: t.professional_title || "Applicant",
                    person: t.displayName || t.user?.email?.split('@')[0] || "Anonymous",
                    rate: t.hourlyRate ? `₹${Number(t.hourlyRate).toLocaleString("en-IN")}/hr` : "",
                    rating: t.ratingAvg || t.user?.ratingAvg || 4.5,
                    tasks: `${t.completedTasksCount || 0} Tasks`,
                    tags: t.skills || [],
                    avatar: t.user?.profilePicUrl,
                    desc: t.bio || interest.message || "Interested in your task.",
                    status: interest.status || "PENDING",
                };
            });

            // 4. Sort arrays for deep equality check
            mappedMatches.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
            apps.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));

            setPerformers(prev => JSON.stringify(prev) === JSON.stringify(mappedMatches) ? prev : mappedMatches);
            setApplicants(prev => JSON.stringify(prev) === JSON.stringify(apps) ? prev : apps);

            if (!isSilent && isSearching) {
                setTimeout(() => setIsSearching(false), 1500);
            }
        } catch (err) {
            console.error("Failed to fetch search results:", err);
            if (!isSilent) setError("Something went wrong while scanning for talent.");
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll for new applicants and matches every 5 seconds
        const interval = setInterval(() => {
            fetchData(true); // Silent update
        }, 5000);
        return () => clearInterval(interval);
    }, [taskId]);


    const displayList = activeTab === 'matches' ? performers : applicants;


    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#DFF7F6]">
            <ProviderHeader activePage="my-tasks" />

            {/* Main Content */}
            <main className="pt-[110px] pb-20 px-10">
                <div className="max-w-7xl mx-auto bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm">
                    {/* Active Task Info */}
                    <div className="mb-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <div>
                                <div className="inline-flex items-center px-4 py-1.5 bg-[#10605F] text-white rounded-full text-[13px] font-black uppercase tracking-wider mb-4">
                                    Active Task
                                </div>
                                <h2 className="text-[36px] font-black text-slate-900 mb-2">
                                    {taskData?.title || (loading ? "Loading Task..." : "Untitled Task")}
                                </h2>
                                <p className="text-slate-400 font-bold text-lg">
                                    Posted {taskData?.createdAt ? new Date(taskData.createdAt).toLocaleDateString() : "just now"}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => fetchData()}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Clock size={20} className={loading ? "animate-spin" : ""} />
                                    Refresh Results
                                </button>
                                <button
                                    onClick={() => navigate(`/provider/active-task/${taskId}`)}
                                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                                >
                                    Skip and Manage Task
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <DollarSign className="text-[#29ADAC]" />,
                                    label: "Budget",
                                    value: taskData?.priceAmount ? `₹${taskData.priceAmount.toLocaleString()}` : "Dynamic Budget",
                                    bg: "bg-[#EFFBFB]"
                                },
                                {
                                    icon: <Clock className="text-blue-500" />,
                                    label: "Category",
                                    value: taskData?.category || "General Services",
                                    bg: "bg-blue-50"
                                },
                                {
                                    icon: <MapPin className="text-purple-500" />,
                                    label: "Location",
                                    value: taskData?.location || "Remote",
                                    bg: "bg-purple-50"
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6 p-2">
                                    <div className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-slate-400 mb-0.5">{item.label}</p>
                                        <p className="text-[18px] font-black text-slate-900 truncate max-w-[200px]">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="h-[1px] bg-slate-100 w-full mb-16" />

                    <AnimatePresence mode="wait">
                        {isSearching ? (
                            /* Searching Animation Section */
                            <motion.div
                                key="searching"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center justify-center py-10 mb-20"
                            >
                                <div className="relative mb-8">
                                    <motion.div
                                        animate={{
                                            boxShadow: ["0 0 0 0px rgba(59, 130, 246, 0)", "0 0 0 40px rgba(59, 130, 246, 0.1)", "0 0 0 0px rgba(59, 130, 246, 0)"]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 border-4 border-white shadow-lg relative z-10"
                                    >
                                        <Search size={44} strokeWidth={2.5} />
                                    </motion.div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-full h-full border-2 border-blue-400 rounded-full"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-[24px] font-black text-slate-900 mb-2">Searching for Talent....</h3>
                                <p className="text-slate-400 font-bold mb-8">Scanning our database of verified performers</p>

                                <div className="flex items-center gap-2">
                                    <motion.div 
                                        animate={{ width: [40, 10, 40] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-2 bg-blue-600 rounded-full" 
                                    />
                                    <div className="w-2 h-2 bg-slate-200 rounded-full" />
                                    <div className="w-2 h-2 bg-slate-200 rounded-full" />
                                    <div className="w-2 h-2 bg-slate-200 rounded-full" />
                                </div>
                            </motion.div>
                        ) : (
                            /* Performer Matches Section */
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Results Toolbar */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 pb-6 border-b border-slate-100">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full h-full gap-4">
                                        <div className="flex gap-4 p-1.5 bg-slate-100 rounded-2xl w-fit">
                                            <button
                                                onClick={() => setActiveTab('applicants')}
                                                className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all flex items-center gap-3 ${activeTab === 'applicants' ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:text-slate-900"}`}
                                            >
                                                Applicants
                                                <span className={`px-2 py-0.5 rounded-lg text-[11px] ${activeTab === 'applicants' ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                                                    {applicants.length}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('matches')}
                                                className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all flex items-center gap-3 ${activeTab === 'matches' ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:text-slate-900"}`}
                                            >
                                                Recommended
                                                <span className={`px-2 py-0.5 rounded-lg text-[11px] ${activeTab === 'matches' ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                                                    {performers.length}
                                                </span>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 text-[14px] hover:bg-slate-50 transition-all shadow-sm">
                                                <Filter size={18} />
                                                Advanced Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="min-h-[600px]">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'applicants' ? (
                                            <motion.div
                                                key="apps"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                            >
                                                {applicants.length > 0 ? (
                                                    applicants.map((performer, i) => (
                                                        <PerformerCard key={performer.id || i} performer={performer} type="applicant" taskId={taskId} taskData={taskData} navigate={navigate} />
                                                    ))
                                                ) : (
                                                    <div className="col-span-full py-40 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                                            <User className="w-10 h-10 text-slate-300" />
                                                        </div>
                                                        <h4 className="text-2xl font-black text-slate-900 mb-2">No Applicants Yet</h4>
                                                        <p className="text-slate-400 font-bold max-w-sm mx-auto">We're notifying top performers about your task. Refreshing every 5 seconds.</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="matches"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                            >
                                                {performers.map((performer, i) => (
                                                    <PerformerCard key={performer.id || i} performer={performer} type="match" taskId={taskId} taskData={taskData} navigate={navigate} />
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                                    <button className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 text-[15px] hover:bg-slate-50 transition-all shadow-sm">
                                        Load More Performers
                                    </button>
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[15px] cursor-pointer hover:text-slate-600 transition-colors">
                                        Scroll to see more <ChevronRight size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

// Reusable Performer Card Component
const PerformerCard = ({ performer, type, taskId, taskData, navigate }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -8 }}
        className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-[#10605F]/20 transition-all h-full flex flex-col relative overflow-hidden"
    >
        {/* Glow effect on hover */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#10605F]/5 blur-[80px] rounded-full group-hover:bg-[#10605F]/10 transition-colors" />

        <div className="flex gap-2 mb-8">
            <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${type === 'applicant' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${type === 'applicant' ? 'bg-amber-100' : 'bg-blue-100'}`}><Check size={10} strokeWidth={4} /></div> 
                {type === 'applicant' ? (performer.status === 'ACCEPTED' || performer.status === 'ASSIGNED' ? 'Contracted' : 'Interest Shown') : 'Recommended'}
            </span>
            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-[#EFFBFB] text-[#10605F] rounded-full text-[11px] font-black uppercase tracking-wider border border-[#29ADAC]/20">
                <div className="w-4 h-4 rounded-full bg-emerald-110 flex items-center justify-center"><Check size={10} strokeWidth={4} /></div> ID Verified
            </span>
        </div>

        <div className="flex items-start justify-between mb-8">
            <div className="flex gap-4">
                <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden shadow-md bg-slate-100 flex items-center justify-center border-2 border-white">
                    {performer.avatar ? (
                        <img src={performer.avatar} alt={performer.person} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xl">
                            {performer.person?.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <h5 className="text-[19px] font-black text-slate-900 leading-tight mb-1">{performer.person}</h5>
                    <p className="text-[14px] font-bold text-slate-400 mb-1.5 truncate max-w-[150px]">{performer.name}</p>

                    <div className="flex items-center gap-1">
                        <div className="flex text-amber-500 gap-0.5">
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} fill="currentColor" />
                            <Star size={12} className="text-slate-200" fill="currentColor" />
                        </div>
                        <span className="text-[12px] font-black text-slate-900 ml-1">{performer.rating}</span>
                        <span className="text-[12px] font-bold text-slate-300 ml-1">({performer.tasks})</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[20px] font-black text-slate-900">{performer.rate}</p>
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
            {(performer.tags || []).slice(0, 3).map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[11px] font-bold uppercase tracking-tight border border-slate-100">{tag}</span>
            ))}
        </div>

        <p className="text-[14px] font-medium text-slate-500 leading-relaxed mb-10 flex-grow line-clamp-3">
            {performer.desc}
        </p>

        <div className="flex items-center justify-between mt-auto gap-4 pt-6 border-t border-slate-50">
            <button
                onClick={() => navigate(`/provider/task-performer-profile/${performer.id}?taskId=${taskId}`, { state: { taskId, taskData, tasker: performer } })}
                className="text-[14px] font-black text-[#10605F] flex items-center gap-1.5 hover:text-[#083B3A] transition-colors"
            >
                View Profile <ExternalLink size={16} />
            </button>
            <div className="flex items-center gap-2">
                {performer.userId && (performer.status === 'ASSIGNED' || performer.status === 'ACCEPTED') && (
                    <button
                        onClick={() => navigate(`/provider/chats?userId=${performer.userId}&taskId=${taskId}`)}
                        className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-[#EFFBFB] hover:text-[#083B3A] transition-all active:scale-95"
                        title="Message performer"
                    >
                        <MessageCircle size={18} strokeWidth={2.5} />
                    </button>
                )}
                {performer.status === 'ASSIGNED' || performer.status === 'ACCEPTED' ? (
                    <button
                        onClick={() => navigate(`/provider/active-task/${taskId}`)}
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[14px] hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        Manage
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(`/provider/confirm-and-pay`, { state: { performer, taskData } })}
                        className="px-8 py-3 bg-[#16a34a] text-white rounded-2xl font-black text-[14px] hover:bg-green-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        Hire
                    </button>
                )}
            </div>
        </div>
    </motion.div>
);

export default PostTaskSearchResultsPage;
