import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderHeader from '../components/ProviderHeader';
import { 
    ChevronRight, 
    Plus, 
    ShieldCheck, 
    Trash2, 
    Wallet, 
    Building2, 
    CreditCard, 
    ArrowRight,
    Zap
} from 'lucide-react';

const PaymentSelectionPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <ProviderHeader activePage="my-tasks" />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-[32px] font-extrabold text-[#0f172a] mb-1.5 tracking-tight">Payment</h1>
                    <p className="text-[#64748b] font-medium text-[15px]">Choose your preferred payment method</p>
                </div>

                {/* Offer Banner */}
                <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-4 flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#16a34a] p-1 rounded-md">
                            <Zap size={16} className="text-white fill-current" />
                        </div>
                        <span className="text-[#16a34a] font-bold text-[15px]">Save more with payment offers</span>
                    </div>
                    <ChevronRight size={18} className="text-[#16a34a]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Payment Methods */}
                    <div className="lg:col-span-8 flex flex-col gap-10">
                        
                        {/* UPI Section */}
                        <section>
                            <h2 className="text-[20px] font-bold text-[#0f172a] mb-6">UPI Links</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: "Google Pay", bank: "Bank of B...", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" },
                                    { name: "Paytm UPI", bank: "Bank of B...", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" },
                                    { name: "PhonePay", bank: "Bank of B...", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" }
                                ].map((upi, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 border border-[#f1f5f9] rounded-2xl hover:border-[#16a34a]/30 hover:bg-slate-50/50 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 border border-[#f1f5f9] rounded-xl flex items-center justify-center p-1.5 bg-white shadow-sm">
                                                <img src={upi.icon} alt={upi.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-bold text-[#0f172a]">{upi.name}</p>
                                                <p className="text-[12px] font-medium text-[#94a3b8]">Linked to {upi.bank}</p>
                                            </div>
                                        </div>
                                        <button className="text-[#94a3b8] hover:text-red-500 p-1 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 p-5 border border-[#f1f5f9] rounded-2xl text-[#16a34a] font-bold text-[14px] hover:bg-green-50/50 cursor-pointer transition-colors border-dashed">
                                    <div className="w-6 h-6 rounded-full border border-[#16a34a] flex items-center justify-center">
                                        <Plus size={14} />
                                    </div>
                                    Add UPI
                                </div>
                            </div>
                        </section>

                        {/* Card Payment Section */}
                        <section>
                            <h2 className="text-[20px] font-bold text-[#0f172a] mb-6">Card Payment:</h2>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-6 group hover:shadow-sm transition-all shadow-[#16a34a]/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-white border border-[#e2e8f0] rounded-md flex items-center justify-center p-1.5">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-bold text-[#0f172a]">RBL Credit Card <span className="text-[#94a3b8] font-medium ml-1">| . . 6213</span></p>
                                            <p className="text-[12px] font-medium text-[#94a3b8]">CVV is not needed for MASTERCARD cards saved as per RBI Guidelines</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/provider/payment-success')}
                                        className="bg-[#16a34a] text-white px-6 py-2 rounded-full text-[14px] font-bold hover:bg-[#15803d] transition-all"
                                    >
                                        Pay ₹280
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-6 border border-[#f1f5f9] rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-white border border-[#f1f5f9] rounded-md flex items-center justify-center p-1.5">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-bold text-[#0f172a]">VISA Card <span className="text-[#94a3b8] font-medium ml-1">| . . 1234</span></p>
                                            <p className="text-[12px] font-medium text-[#94a3b8]">Credit card | . . 1234</p>
                                        </div>
                                    </div>
                                    <button className="text-[#94a3b8] hover:text-red-500 p-1 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 p-5 text-[#16a34a] font-bold text-[15px] hover:translate-x-1 cursor-pointer transition-all">
                                    <div className="w-6 h-6 rounded-full border border-[#16a34a] flex items-center justify-center">
                                        <Plus size={14} />
                                    </div>
                                    Add UPI
                                </div>
                            </div>
                        </section>

                        {/* More Payment Options */}
                        <section>
                            <h2 className="text-[20px] font-bold text-[#0f172a] mb-6">More Payment Options:</h2>
                            <div className="flex flex-col border border-[#f1f5f9] rounded-[1.5rem] divide-y divide-[#f1f5f9] overflow-hidden">
                                {[
                                    { name: "Wallets", sub: "Amazon, PhonePe & more", icon: <Wallet size={20} className="text-[#64748b]" /> },
                                    { name: "Netbanking", sub: "Select from a list of banks", icon: <Building2 size={20} className="text-[#64748b]" /> },
                                    { name: "CRED pay", sub: "", icon: <CreditCard size={20} className="text-[#64748b]" /> }
                                ].map((opt, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 border border-[#f1f5f9] rounded-xl flex items-center justify-center bg-white shadow-sm group-hover:bg-slate-50 transition-colors">
                                                {opt.icon}
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-bold text-[#0f172a]">{opt.name}</p>
                                                {opt.sub && <p className="text-[12px] font-medium text-[#94a3b8]">{opt.sub}</p>}
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-[#94a3b8] group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 p-5 text-[#16a34a] font-bold text-[15px] hover:translate-x-1 cursor-pointer transition-all">
                                <div className="w-6 h-6 rounded-full border border-[#16a34a] flex items-center justify-center">
                                    <Plus size={14} />
                                </div>
                                Add UPI
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Checkout Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 flex flex-col gap-6">
                            
                            {/* Task Details Card */}
                            <div className="bg-white border border-[#f1f5f9] rounded-[2rem] p-6 shadow-sm">
                                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.1em] mb-4">TASK DETAILS</p>
                                <h3 className="text-[17px] font-extrabold text-[#0f172a] mb-1.5">Hiring a Web Designer</h3>
                                <p className="text-[13px] font-medium text-[#64748b] mb-4">Website Redesign • UX/UI Improvements</p>
                                <div className="flex items-center justify-between text-[13px] font-bold">
                                    <span className="text-[#94a3b8]">Estimated Delivery</span>
                                    <span className="text-[#0f172a]">3-4 Days</span>
                                </div>
                            </div>

                            {/* Payment Summary Dash */}
                            <div className="bg-white border border-[#f1f5f9] rounded-[2rem] p-6 shadow-sm">
                                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.1em] mb-6">PAYMENT SUMMARY</p>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between font-medium text-[15px] text-[#64748b]">
                                        <span>Task Amount</span>
                                        <span className="text-[#0f172a] font-bold">₹300</span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium text-[15px] text-[#64748b]">
                                        <span>Service Fee</span>
                                        <span className="text-[#0f172a] font-bold">₹60</span>
                                    </div>
                                    <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between text-[18px] font-extrabold text-[#0f172a]">
                                        <span>Total Amount</span>
                                        <span className="text-[#16a34a]">₹360</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate('/provider/payment-success')}
                                    className="w-full bg-[#16a34a] text-white py-4 rounded-2xl text-[17px] font-bold hover:bg-[#15803d] transition-all active:scale-[0.98] mb-4"
                                >
                                    Pay ₹360
                                </button>
                                <p className="text-[11px] font-medium text-[#94a3b8] text-center">100% refund available if terms are not met</p>
                            </div>

                            {/* Secure Note */}
                            <div className="bg-[#eff6ff] rounded-[1.5rem] p-5 flex items-start gap-4 border border-[#dbeafe]">
                                <div className="bg-[#2563eb] p-2 rounded-xl text-white">
                                    <ShieldCheck size={20} className="fill-current" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-[#2563eb] mb-0.5">Secure Payment</p>
                                    <p className="text-[12px] font-medium text-[#3b82f6] leading-relaxed">
                                        Your card details are encrypted and secure. We never store your CVV.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentSelectionPage;
