import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    User,
    Wallet,
    Building2,
    ClipboardList,
    Star,
    Gift,
    Settings,
    LogOut,
    ArrowLeft,
    FileText,
    ChevronRight
} from 'lucide-react';
import PerformerHeader from '../components/PerformerHeader';
import PerformerPageHeader from '../components/PerformerPageHeader';

const PerformerWalletTransactionDetailsPage = () => {
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

            {/* Main Content Area */}
            <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8 bg-[#FAFAFA] md:bg-white custom-scrollbar">
                <div className="mx-auto w-full max-w-4xl">
                        
                        <PerformerPageHeader
                            title="Transaction Details"
                            subtitle={`Reference ${transaction.referenceId} · ${transaction.date}`}
                            backTo="/performer/wallet/transactions"
                            backLabel="Back to Transactions"
                        />

                        <div className="space-y-6">
                            {/* Main Amount Card */}
                            <div className="bg-[#F4FDF8] border border-[#2BA960]/20 rounded-[16px] p-6">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2BA960] shadow-sm">
                                        <Wallet size={16} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-[32px] font-bold text-[#2BA960] leading-none tracking-tight">₹{transaction.amount}</h2>
                                </div>
                                <p className="text-[15px] font-bold text-[#4B5563] mb-6 pl-11">{transaction.type}</p>

                                <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-4 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <img src={transaction.from.avatar} alt={transaction.from.name ? `Sender: ${transaction.from.name}` : "Sender"} className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]" />
                                        <div>
                                            <p className="text-[14px] font-bold text-[#1F2937] leading-tight">{transaction.from.name}</p>
                                            <p className="text-[11px] font-medium text-[#6B7280] mt-0.5">{transaction.from.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-center gap-2 max-w-[200px] text-[#9CA3AF]">
                                        <div className="h-[1.5px] bg-[#D1D5DB] flex-1 rounded-full relative">
                                            <ChevronRight size={14} className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-[#D1D5DB]" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[14px] font-bold text-[#1F2937] leading-tight">{transaction.to.name}</p>
                                            <p className="text-[11px] font-medium text-[#6B7280] mt-0.5">{transaction.to.role}</p>
                                        </div>
                                        <img src={transaction.to.avatar} alt={transaction.to.name ? `Recipient: ${transaction.to.name}` : "Recipient"} className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]" />
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Transaction Info */}
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#1F2937] mb-3">Transaction info</h3>
                                    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-4 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] font-medium text-[#6B7280]">Date & Time</span>
                                            <span className="text-[13px] font-semibold text-[#1F2937]">{transaction.date}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] font-medium text-[#6B7280]">Reference ID</span>
                                            <span className="text-[13px] font-semibold text-[#1F2937]">{transaction.referenceId}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] font-medium text-[#6B7280]">Status</span>
                                            <span className="bg-[#D1FAE5] text-[#059669] px-3 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-tight">
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Task & Reason */}
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#1F2937] mb-3">Task & Reason</h3>
                                    <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 space-y-4 shadow-sm h-[134px]">
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="text-[13px] font-bold text-[#1F2937] min-w-[50px]">Task</span>
                                            <span className="text-[13px] font-medium text-[#4B5563] text-right">{transaction.taskTitle}</span>
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="text-[13px] font-bold text-[#1F2937] min-w-[50px]">Reason</span>
                                            <span className="text-[11px] font-medium text-[#6B7280] text-right leading-relaxed line-clamp-3">
                                                {transaction.reason}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Details */}
                            <div>
                                <h3 className="text-[16px] font-bold text-[#1F2937] mb-3">Payment Method</h3>
                                <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet size={16} strokeWidth={2.5} className="text-[#4B5563]" />
                                        <span className="text-[16px] font-bold text-[#1F2937]">₹ {transaction.amount}</span>
                                    </div>
                                    <p className="text-[13px] font-medium text-[#6B7280]">
                                        Refunded <span className="font-bold text-[#2BA960]">₹{transaction.amount}</span> to your wallet balance
                                    </p>
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <h3 className="text-[16px] font-bold text-[#1F2937] mb-3">Comments</h3>
                                <div className="bg-[#F4FDF8] rounded-[12px] p-5 border border-[#2BA960]/10">
                                    <p className="text-[13px] font-medium text-[#1F2937] whitespace-pre-line leading-relaxed">
                                        {transaction.comments}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Export Button */}
                            <div className="flex justify-center pt-8 pb-4">
                                <button className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[#4B5563] font-bold text-[14px] hover:bg-gray-50 transition-colors shadow-sm bg-white">
                                    <FileText size={16} strokeWidth={2.5} />
                                    Export Statement
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
        </div>
    );
};

export default PerformerWalletTransactionDetailsPage;
