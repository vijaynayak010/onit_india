import React from 'react';
import { motion } from 'framer-motion';

const ComingSoonPage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans overflow-hidden px-6 relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-50 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
            </div>

            <main className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Logo Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="text-[42px] font-black text-black tracking-tighter leading-none">
                        On<span className="text-[#16a34a]">IT</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 tracking-[0.5em] uppercase mt-2">
                        HYPERLOCAL PLATFORM
                    </span>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-[54px] md:text-[72px] font-black text-gray-900 leading-none tracking-tighter mb-8 italic">
                        Something <span className="text-[#16a34a]">Big</span> is Coming.
                    </h1>
                    <p className="text-[18px] font-bold text-gray-400 mb-12 leading-relaxed">
                        We're building the future of micro-tasks and hyperlocal execution. 
                        Our team is working hard to bring you a premium experience. 
                        Stay tuned, we're almost there!
                    </p>

                    {/* Progress Indicator */}
                    <div className="max-w-md mx-auto mb-16 px-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Development Progress</span>
                            <span className="text-[12px] font-black text-[#16a34a]">85%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-[#16a34a] rounded-full shadow-lg shadow-green-100"
                            ></motion.div>
                        </div>
                    </div>

                    {/* Email Signup Mockup */}
                    <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 px-8 py-4 bg-gray-50 border border-gray-100 rounded-full text-[14px] font-bold focus:outline-none focus:ring-4 focus:ring-green-500/5 transition-all text-center md:text-left"
                        />
                        <button className="bg-black text-white px-10 py-4 rounded-full text-[14px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95 whitespace-nowrap">
                            Notify Me
                        </button>
                    </div>
                </motion.div>

                {/* Footer Links */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 pt-12 border-t border-gray-50 flex flex-wrap justify-center gap-x-12 gap-y-6 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]"
                >
                    <a href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy</a>
                    <a href="/terms-and-conditions" className="hover:text-gray-900 transition-colors">Terms</a>
                    <a href="/faqs" className="hover:text-gray-900 transition-colors">Support</a>
                </motion.div>
            </main>

            {/* Floating Element */}
            <motion.div 
                animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="absolute bottom-20 right-20 hidden lg:block"
            >
                <div className="w-24 h-24 bg-white rounded-[32px] border border-gray-100 shadow-2xl flex items-center justify-center text-[40px] rotate-[15deg] hover:rotate-0 transition-transform cursor-pointer">
                    🚀
                </div>
            </motion.div>
        </div>
    );
};

export default ComingSoonPage;
