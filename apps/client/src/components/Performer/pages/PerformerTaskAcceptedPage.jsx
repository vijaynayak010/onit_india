import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Clock, 
    ChevronRight,
    Info,
    Bell
} from "lucide-react";
import PerformerHeader from '../components/PerformerHeader';

const PerformerTaskAcceptedPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-[#F0F4FF] font-sans text-gray-900 pb-20 lg:pl-[220px]">
            <PerformerHeader activePage="home" />

            <main className="max-w-[900px] mx-auto px-6 py-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100 border border-indigo-50 overflow-hidden"
                >
                    {/* Success Header Card */}
                    <div className="bg-gradient-to-br from-[#4F46E5] to-[#4338CA] p-12 text-center relative overflow-hidden">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mx-auto mb-6 flex items-center justify-center border border-white/30"
                        >
                            <Bell size={40} className="text-white" />
                        </motion.div>
                        <h1 className="text-[32px] sm:text-[36px] font-medium text-white mb-2 tracking-tight leading-tight">Task Provider Notified</h1>
                        <p className="text-white/80 font-bold text-[15px] sm:text-[16px]">Your interest has been successfully shared with the client</p>
                        
                        {/* Decorative background elements */}
                        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="p-12 space-y-12">
                        {/* Status List */}
                        <div className="space-y-8">
                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-100">
                                    <Bell size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[18px] font-medium text-gray-900">Task Provider Notified</h3>
                                    <p className="text-[14px] font-bold text-gray-400">The task provider has been notified that you are interested in this task.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100 animate-pulse">
                                    <Clock size={24} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[18px] font-medium text-gray-900 font-sans">Waiting for Provider's Confirmation</h3>
                                        <span className="bg-amber-50 text-amber-500 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-amber-100">Pending</span>
                                    </div>
                                    <p className="text-[14px] font-bold text-gray-400">Please wait for the provider (client) to confirm the task details before final commencement.</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button 
                                onClick={() => navigate(`/performer/active-task/${id || '1'}`)}
                                className="w-[320px] py-4 bg-[#4F46E5] text-white rounded-full font-black text-[15px] hover:bg-[#4338CA] transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
                            >
                                <Info size={18} />
                                View Task Details (Preview)
                            </button>
                        </div>
                    </div>

                    {/* How it works Box */}
                    <div className="bg-indigo-50/50 p-8 border-t border-indigo-50">
                        <div className="flex items-start gap-3">
                            <Info size={18} className="text-indigo-500 mt-0.5" />
                            <div className="space-y-3">
                                <h4 className="text-[14px] font-medium text-indigo-900 uppercase tracking-widest">How it works</h4>
                                <ul className="space-y-2">
                                    {[
                                        "The provider reviews your profile and interest",
                                        "The provider confirms the task and processes payment",
                                        "You receive a notification to begin the work"
                                    ].map((step, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-indigo-600/80">
                                            <div className="w-1 h-1 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate('/performer/dashboard')}
                        className="text-indigo-600 font-bold text-[14px] hover:underline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PerformerTaskAcceptedPage;
