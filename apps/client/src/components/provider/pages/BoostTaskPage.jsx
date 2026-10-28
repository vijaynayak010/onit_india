import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderHeader from '../components/ProviderHeader';

const BoostTaskPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen bg-[#f8fbfa] overflow-hidden font-sans">
            <ProviderHeader activePage="my-tasks" />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-10 py-10">
                <div className="max-w-4xl mx-auto flex flex-col gap-8">

                    {/* Main Bordered Container */}
                    <div className="w-full border-[1.2px] border-[#ccf2d9] rounded-[2rem] bg-white p-10 flex flex-col gap-8">

                        {/* Status Header */}
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[22px] font-black text-black">Post Task is Paused & Performer Dismissed</h2>
                            <p className="text-gray-500 font-bold text-[13px] leading-relaxed">
                                Boost your post to find a new performer to complete the task.<br />
                                You've dismissed the previous performer for not responding.
                            </p>
                        </div>

                        {/* Task Card Section */}
                        <div className="w-full border-[1.2px] border-[#ccf2d9] rounded-[1.2rem] bg-white p-6 flex flex-col gap-5">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-6">
                                    {/* Performer Image */}
                                    <div className="w-[100px] h-[100px] rounded-[1rem] overflow-hidden flex-shrink-0">
                                        <img
                                            src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                            alt="Anu Reddy"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Task Info */}
                                    <div className="flex flex-col pt-1">
                                        <h3 className="text-[20px] font-black text-black mb-0.5">Web Design</h3>
                                        <p className="text-gray-500 font-bold text-[14px] mb-2.5">Anu Reddy</p>
                                        <div className="text-[#ef4444] font-bold text-[13px]">
                                            Previous Performer: Access Revoked
                                        </div>
                                    </div>
                                </div>

                                {/* Shared Price */}
                                <div className="text-[13px] font-bold text-gray-700 pt-1">
                                    ₹ 2,000
                                </div>
                            </div>

                            {/* Deadline and Status Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5 text-black font-bold text-[18px]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Deadline: 25/04/2025
                                    <svg className="w-5 h-5 text-[#facc15] fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="bg-[#fff1f2] text-[#ef4444] px-7 py-2 rounded-[0.8rem] font-black text-[15px]">
                                    Paused
                                </div>
                            </div>
                        </div>

                        {/* Budget Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[16px] font-black text-black">Budget</h3>
                            <div className="w-full border-[1.2px] border-[#ccf2d9] rounded-[1.2rem] bg-white p-6 flex flex-col gap-2">
                                <div className="text-[34px] font-black text-black">₹ 2,000</div>
                                <p className="text-gray-500 font-bold text-[15px] mb-1">Want to change your budget?</p>
                                <div className="flex items-center justify-between">
                                    <button className="border-[1.5px] border-[#ccf2d9] text-[#16a34a] px-6 py-2 rounded-full font-black text-[13px] bg-white hover:bg-gray-50">
                                        Edit Budget
                                    </button>
                                    <button className="bg-[#16a34a] text-white px-7 py-2.5 rounded-[0.8rem] font-black text-[13px] hover:bg-green-700 transition-colors">
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Deadline Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[16px] font-black text-black">Deadline</h3>
                            <div className="w-full border-[1.2px] border-[#ccf2d9] rounded-[1.2rem] bg-white p-6 flex flex-col gap-2">
                                <div className="flex items-center gap-2.5 text-black font-bold text-[18px]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Deadline: 25/04/2025
                                    <svg className="w-5 h-5 text-[#facc15] fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-bold text-[15px] mb-1">Continue with existing Deadline?</p>
                                <div className="flex items-center justify-between">
                                    <button className="border-[1.5px] border-[#ccf2d9] text-[#16a34a] px-6 py-2 rounded-full font-black text-[13px] bg-white hover:bg-gray-50">
                                        Edit Budget
                                    </button>
                                    <button className="bg-[#16a34a] text-white px-7 py-2.5 rounded-[0.8rem] font-black text-[13px] hover:bg-green-700 transition-colors">
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pb-10">
                        <button
                            onClick={() => navigate('/provider/my-tasks')}
                            className="border-[1.5px] border-[#ccf2d9] text-[#16a34a] px-14 py-3.5 rounded-[1.2rem] font-black text-[15px] bg-white hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button className="bg-[#16a34a] text-white px-14 py-3.5 rounded-[1.2rem] font-black text-[15px] hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                            Boost Task
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BoostTaskPage;
