import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    Wallet,
    FileText,
    ChevronRight
} from 'lucide-react';
import PerformerHeader from '../components/PerformerHeader';
import PerformerPageHeader from '../components/PerformerPageHeader';

const PerformerEarningsTransactionDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock data based on design
    const transaction = {
        amount: '7,625',
        type: 'Refund Received',
        date: 'Sunday, 08 Jan 11:21 AM',
        referenceId: '#2003456789',
        status: 'Refunded',
        taskTitle: 'Academic Research',
        reason: 'Performer did not accept the task in time. ncNKJSCNCNKNXB kznbskkhbvfvkjzcb kmSDcknsnDBSKDNBvsIjd',
        from: { name: 'Ananya', role: 'Web Designing Task', avatar: 'https://i.pravatar.cc/150?u=ananya' },
        to: { name: 'Anu Reddy', role: 'Web Designer', avatar: 'https://i.pravatar.cc/150?u=anu' },
        comments: 'Anu Reddy took too long to accept the task.\nAuto-Refunded as per policy'
    };

    return (
        <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
            <PerformerHeader activePage="account" />

            <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
                <div className="mx-auto w-full max-w-4xl">
                    <PerformerPageHeader
                        title="Transaction Details"
                        subtitle={`Reference ${transaction.referenceId} · ${transaction.date}`}
                        backTo="/performer/earnings"
                        backLabel="Back to Earnings"
                    />

                    {/* Main Content Card - Scaled for full width earnings layout */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden p-8">
                    
                    <div className="max-w-[850px] mx-auto space-y-8">
                        {/* Main Amount Card */}
                        <div className="bg-[#F4FDF8] border border-[#2BA960]/20 rounded-[20px] p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2BA960] shadow-sm">
                                    <Wallet size={20} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-[40px] font-medium text-[#2BA960] leading-none tracking-tight">₹{transaction.amount}</h2>
                            </div>
                            <p className="text-[18px] font-medium text-[#4B5563] mb-8 pl-13 ml-12">{transaction.type}</p>

                            <div className="bg-white rounded-[16px] border border-gray-100 p-5 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <img src={transaction.from.avatar} alt={transaction.from.name ? `Sender: ${transaction.from.name}` : "Sender"} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                                    <div>
                                        <p className="text-[15px] font-medium text-gray-900 leading-tight">{transaction.from.name}</p>
                                        <p className="text-[12px] font-bold text-gray-400 mt-0.5">{transaction.from.role}</p>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center gap-2 max-w-[250px] px-4">
                                    <div className="h-[2px] bg-gray-200 flex-1 rounded-full relative">
                                        <ChevronRight size={16} className="absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[15px] font-medium text-gray-900 leading-tight">{transaction.to.name}</p>
                                        <p className="text-[12px] font-bold text-gray-400 mt-0.5">{transaction.to.role}</p>
                                    </div>
                                    <img src={transaction.to.avatar} alt={transaction.to.name ? `Recipient: ${transaction.to.name}` : "Recipient"} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-8">
                            {/* Transaction Info */}
                            <div>
                                <h3 className="text-[18px] font-medium text-gray-900 mb-4">Transaction info</h3>
                                <div className="bg-white rounded-[16px] border border-gray-100 p-6 space-y-5 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[14px] font-bold text-gray-400">Date & Time</span>
                                        <span className="text-[14px] font-black text-gray-900">{transaction.date}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[14px] font-bold text-gray-400">Reference ID</span>
                                        <span className="text-[14px] font-black text-gray-900">{transaction.referenceId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[14px] font-bold text-gray-400">Status</span>
                                        <span className="bg-[#EFFBFB] text-[#10605F] px-3 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest">
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Task & Reason */}
                            <div>
                                <h3 className="text-[18px] font-medium text-gray-900 mb-4">Task & Reason</h3>
                                <div className="bg-white rounded-[16px] border border-gray-100 p-6 space-y-5 shadow-sm h-[158px]">
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="text-[14px] font-black text-gray-900 min-w-[60px]">Task</span>
                                        <span className="text-[14px] font-bold text-gray-600 text-right">{transaction.taskTitle}</span>
                                    </div>
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="text-[14px] font-black text-gray-900 min-w-[60px]">Reason</span>
                                        <span className="text-[12px] font-bold text-gray-400 text-right leading-relaxed line-clamp-3">
                                            {transaction.reason}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Details */}
                        <div>
                            <h3 className="text-[18px] font-medium text-gray-900 mb-4">Payment Method</h3>
                            <div className="bg-white rounded-[16px] border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <Wallet size={18} strokeWidth={2.5} className="text-gray-400" />
                                    <span className="text-[18px] font-medium text-gray-900">₹ {transaction.amount}</span>
                                </div>
                                <p className="text-[14px] font-bold text-gray-400">
                                    Refunded <span className="font-black text-[#2BA960]">₹{transaction.amount}</span> to your wallet balance
                                </p>
                            </div>
                        </div>

                        {/* Comments */}
                        <div>
                            <h3 className="text-[18px] font-medium text-gray-900 mb-4">Comments</h3>
                            <div className="bg-[#F4FDF8] rounded-[16px] p-6 border border-[#2BA960]/10">
                                <p className="text-[14px] font-bold text-gray-700 whitespace-pre-line leading-relaxed">
                                    {transaction.comments}
                                </p>
                            </div>
                        </div>
                        
                        {/* Export Button */}
                        <div className="flex justify-center pt-6">
                            <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-gray-100 text-gray-600 font-black text-[15px] hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm bg-white">
                                <FileText size={18} strokeWidth={2.5} />
                                Export Statement
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </main>
        </div>
    );
};

export default PerformerEarningsTransactionDetailsPage;
