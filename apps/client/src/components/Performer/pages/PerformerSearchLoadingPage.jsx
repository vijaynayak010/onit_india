import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformerHeader from '../components/PerformerHeader';

const PerformerSearchLoadingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate a search delay
        const timer = setTimeout(() => {
            navigate('/performer/search-results');
        }, 3500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans lg:pl-[220px]">
            <PerformerHeader activePage="home" />
            
            <main className="flex-1 flex flex-col items-center justify-center p-10 mt-[-60px]">
                <div className="max-w-4xl w-full text-center">
                    <h1 className="text-[36px] font-medium text-gray-900 mb-12 tracking-tight">
                        Searching for the <span className="text-[#16a34a]">Tasks...</span>
                    </h1>

                    <div className="relative mx-auto w-[650px] h-[650px] mb-12">
                        {/* Custom Illustration Container */}
                        <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-1000">
                            <div className="relative group">
                                {/* Map Illustration */}
                                <img 
                                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" 
                                    alt="Searching map" 
                                    className="w-full h-full object-contain drop-shadow-2xl rounded-3xl"
                                />
                                
                                {/* Pulse Effect on central magnifying glass */}
                                <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#16a34a]/10 rounded-full animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce"></div>
                        </div>
                        <p className="text-[16px] font-medium text-gray-500 tracking-wide animate-pulse">
                            Finding the best matches for you...
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PerformerSearchLoadingPage;
