import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderHeader from '../components/ProviderHeader';
import { 
    CheckCircle2, 
    Monitor, 
    Check, 
    MessageSquare, 
    ExternalLink, 
    TrendingUp,
    Star,
    ShieldCheck
} from 'lucide-react';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fcfdfd] font-sans text-slate-900">
            <ProviderHeader activePage="my-tasks" />

            <main className="max-w-3xl mx-auto px-6 py-16">
                
                {/* Success Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="w-16 h-16 bg-[#16a34a] rounded-full flex items-center justify-center text-white mb-6 animate-in zoom-in duration-500">
                        <Check size={36} strokeWidth={3} />
                    </div>
                    <h1 className="text-[34px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Payment Successful</h1>
                    <p className="text-[#16a34a] font-bold text-[17px]">₹350 Paid successfully</p>
                </div>

                {/* Content Stack */}
                <div className="flex flex-col gap-6">
                    
                    {/* Task Brief Card */}
                    <div className="bg-white border border-[#f1f5f9] rounded-[2rem] p-8 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-[19px] font-bold text-[#0f172a] mb-1">Hiring a Web Designer</h3>
                            <p className="text-[14px] font-medium text-[#64748b] mb-3">Website redesign • UI/UX improvements</p>
                            <div className="flex items-center gap-2 text-[13px] font-bold text-[#94a3b8]">
                                <span>Estimated Delivery:</span>
                                <span className="text-[#0f172a]">3 – 4 Days</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-[#f0fdf4] rounded-2xl flex items-center justify-center text-[#16a34a]">
                            <Monitor size={28} />
                        </div>
                    </div>

                    {/* What Happens Next Card */}
                    <div className="bg-white border border-[#f1f5f9] rounded-[2rem] p-8 shadow-sm">
                        <h4 className="text-[16px] font-bold text-[#0f172a] mb-8">Here's What happens next:</h4>
                        <div className="space-y-6">
                            {[
                                "Payment Securely held by our platform",
                                "Performer has been notified",
                                "Work will start shortly",
                                "Amount Will be Released after your approval"
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 bg-[#16a34a] rounded-full flex items-center justify-center text-white flex-shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-[15px] font-bold text-[#0f172a]">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performer Status Card */}
                    <div className="bg-white border border-[#f1f5f9] rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#f1f5f9]">
                                    <img 
                                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
                                        alt="Ananya" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="pt-1">
                                    <h5 className="text-[17px] font-bold text-[#0f172a]">Ananya</h5>
                                    <p className="text-[14px] font-semibold text-[#16a34a] mb-2">Web Designer</p>
                                    <p className="text-[12px] font-medium text-[#94a3b8]">Avg Response Time: 2hrs</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1">
                                <Star size={14} className="text-amber-400 fill-current" />
                                <span className="text-[14px] font-bold text-[#0f172a]">4.7/5</span>
                                <span className="text-[12px] font-medium text-[#94a3b8]">76 reviews</span>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] rounded-2xl p-6 border border-[#f1f5f9] mb-8">
                            <p className="text-[14px] font-bold text-[#0f172a] mb-1">Performer Reviewing your task details</p>
                            <p className="text-[12px] font-medium text-[#94a3b8]">You'll be notified once work starts</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => navigate('/provider/chats')}
                                className="flex items-center justify-center gap-2 border border-[#16a34a] text-[#16a34a] py-4 rounded-full text-[15px] font-bold hover:bg-green-50 transition-all"
                            >
                                <MessageSquare size={18} /> Chat With Performer
                            </button>
                            <button 
                                onClick={() => navigate('/provider/my-tasks')}
                                className="flex items-center justify-center gap-2 bg-[#16a34a] text-white py-4 rounded-full text-[15px] font-bold hover:bg-[#15803d] transition-all shadow-lg shadow-green-500/10"
                            >
                                <TrendingUp size={18} /> Track Task Progress
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-12 text-center">
                    <div className="bg-[#eff6ff] inline-flex items-center px-10 py-3 rounded-xl border border-[#dbeafe]">
                        <p className="text-[13px] font-medium text-[#2563eb]">
                            Need help? Contact our <span className="font-bold">24/7 support team</span> anytime
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentSuccessPage;
