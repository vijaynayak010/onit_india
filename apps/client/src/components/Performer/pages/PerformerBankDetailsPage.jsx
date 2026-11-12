import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Landmark,
    CreditCard,
    Banknote,
    Plus,
    ChevronRight,
    ChevronLeft,
    Trash2,
    Wallet
} from 'lucide-react';
import PerformerHeader from '../components/PerformerHeader';
import PerformerPageHeader from '../components/PerformerPageHeader';
import { getPayoutMethods, addPayoutMethod, deletePayoutMethod } from '../services/api';

const PerformerBankDetailsPage = () => {
    const navigate = useNavigate();
    const [isAddingUpi, setIsAddingUpi] = useState(false);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [isAddingNetbanking, setIsAddingNetbanking] = useState(false);
    const [isAddingWallet, setIsAddingWallet] = useState(false);
    const [isAddingCredPay, setIsAddingCredPay] = useState(false);
    const [verificationType, setVerificationType] = useState('upi'); // 'upi', 'card', 'bank', 'wallet', 'credpay'

    const [payoutMethods, setPayoutMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    const [upiIdInput, setUpiIdInput] = useState('');
    const [cardData, setCardData] = useState({ number: '', expiryMonth: '', expiryYear: '', cvv: '', name: '' });
    const [bankData, setBankData] = useState({ name: '', holderName: '', accountNumber: '', ifsc: '' });
    const [walletData, setWalletData] = useState({ provider: 'Paytm', phoneNumber: '' });
    const [credPayData, setCredPayData] = useState({ phoneNumber: '' });

    useEffect(() => {
        fetchPayoutMethods();
    }, []);

    const fetchPayoutMethods = async () => {
        try {
            setLoading(true);
            const methods = await getPayoutMethods();
            setPayoutMethods(methods || []);
        } catch (err) {
            console.error("Failed to fetch payout methods", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMethod = async () => {
        try {
            let payload = { type: verificationType.toUpperCase() };
            if (verificationType === 'upi') {
                payload.type = 'UPI';
                payload.details = { upiId: upiIdInput };
            } else if (verificationType === 'bank') {
                payload.type = 'BANK_ACCOUNT';
                payload.details = { 
                    bankName: bankData.name, 
                    accountNumber: bankData.accountNumber, 
                    ifscCode: bankData.ifsc, 
                    accountHolder: bankData.holderName 
                };
            } else if (verificationType === 'card') {
                payload.type = 'CARD';
                payload.details = { 
                    cardNumber: cardData.number, 
                    expiryMonth: cardData.expiryMonth,
                    expiryYear: cardData.expiryYear,
                    holderName: cardData.name 
                };
            } else if (verificationType === 'wallet') {
                payload.type = 'WALLET';
                payload.details = { 
                    provider: walletData.provider, 
                    phoneNumber: walletData.phoneNumber 
                };
            } else if (verificationType === 'credpay') {
                payload.type = 'CRED_PAY';
                payload.details = { 
                    phoneNumber: credPayData.phoneNumber 
                };
            }

            await addPayoutMethod(payload);
            await fetchPayoutMethods();
            
            // Close all modals
            setIsAddingUpi(false);
            setIsAddingCard(false);
            setIsAddingNetbanking(false);
            setIsAddingWallet(false);
            setIsAddingCredPay(false);
            
            // Reset forms
            setUpiIdInput('');
            setCardData({ number: '', expiryMonth: '', expiryYear: '', cvv: '', name: '' });
            setBankData({ name: '', holderName: '', accountNumber: '', ifsc: '' });
            setWalletData({ provider: 'Paytm', phoneNumber: '' });
            setCredPayData({ phoneNumber: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add payout method");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this payout method?")) return;
        try {
            await deletePayoutMethod(id);
            setPayoutMethods(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            alert("Failed to delete payout method");
        }
    };

    const isAnyModalOpen = isAddingUpi || isAddingCard || isAddingNetbanking || isAddingWallet || isAddingCredPay;

    return (
        <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
            <PerformerHeader activePage="account" />

            <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
                <div className="mx-auto w-full max-w-5xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isAddingUpi ? 'add-upi' : isAddingCard ? 'add-card' : isAddingNetbanking ? 'add-bank' : isAddingWallet ? 'add-wallet' : isAddingCredPay ? 'add-cred' : 'banks'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mx-auto flex w-full max-w-6xl flex-col gap-6"
                        >
                            {isAddingUpi ? (
                                <div className="min-h-[500px] rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                                    <button onClick={() => setIsAddingUpi(false)} className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 group">
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-[14px] font-bold">Back to Banks Details</span>
                                    </button>
                                    <h2 className="text-[17px] font-medium text-gray-900 mb-4">Enter your UPI ID</h2>
                                    <div className="relative mb-2">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <div className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wider">UPI</div>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter your UPI ID"
                                            value={upiIdInput}
                                            onChange={(e) => setUpiIdInput(e.target.value)}
                                            className="w-full pl-14 pr-12 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all"
                                        />
                                        <button onClick={() => setUpiIdInput('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} strokeWidth={2} />
                                        </button>
                                    </div>
                                    <p className="text-[12px] font-medium text-gray-400 mb-6 ml-1">Example: yourname@okaxis or mobile@paytm</p>
                                    <button
                                        onClick={() => { setVerificationType('upi'); handleAddMethod(); }}
                                        className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all text-white font-bold text-[15px] rounded-full mb-10 shadow-sm"
                                    >Link UPI ID</button>
                                </div>
                            ) : isAddingCard ? (
                                <div className="min-h-[500px] rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-sm)]">
                                    <button onClick={() => setIsAddingCard(false)} className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 group">
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-[14px] font-bold">Back to Banks Details</span>
                                    </button>
                                    <h2 className="text-[20px] font-medium text-gray-900 mb-8">Enter Card Details</h2>
                                    <div className="space-y-6 max-w-[700px]">
                                        <div>
                                            <label className="text-[13px] font-bold text-gray-400 mb-2 block">Card Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <CreditCard size={20} className="text-[var(--color-primary)]" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your Card Number"
                                                    value={cardData.number}
                                                    onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                                    className="w-full pl-12 pr-12 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[13px] font-bold text-gray-400 mb-2 block">Month</label>
                                                    <input type="text" placeholder="MM" maxLength={2} value={cardData.expiryMonth} onChange={(e) => setCardData({...cardData, expiryMonth: e.target.value})} className="w-full px-4 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                                </div>
                                                <div>
                                                    <label className="text-[13px] font-bold text-gray-400 mb-2 block">Year</label>
                                                    <input type="text" placeholder="YY" maxLength={2} value={cardData.expiryYear} onChange={(e) => setCardData({...cardData, expiryYear: e.target.value})} className="w-full px-4 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[13px] font-bold text-gray-400 mb-2 block">CVV</label>
                                                <input type="password" placeholder="***" maxLength={3} value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value})} className="w-full pl-4 pr-12 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[13px] font-medium text-gray-400 mb-2 block">Card Holder's Name</label>
                                            <input type="text" placeholder="Priyanka Fabyani" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value})} className="w-full pl-4 pr-12 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                        </div>
                                        <button onClick={() => { setVerificationType('card'); handleAddMethod(); }} className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all text-white font-bold text-[16px] rounded-[14px] mt-4 shadow-sm">Add Card</button>
                                    </div>
                                </div>
                            ) : isAddingNetbanking ? (
                                <div className="min-h-[500px] rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-sm)]">
                                    <button onClick={() => setIsAddingNetbanking(false)} className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 group">
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-[14px] font-bold">Back to Banks Details</span>
                                    </button>
                                    <h2 className="text-[20px] font-medium text-gray-900 mb-8">Enter Bank Details</h2>
                                    <div className="space-y-6 max-w-[700px]">
                                        <div>
                                            <label className="text-[13px] font-medium text-gray-400 mb-2 block">Account Holder Name</label>
                                            <input type="text" placeholder="Enter name as per bank record" value={bankData.holderName} onChange={(e) => setBankData({...bankData, holderName: e.target.value})} className="w-full pl-4 pr-12 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[13px] font-medium text-gray-400 mb-2 block">Bank Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Landmark size={20} className="text-[var(--color-primary)]" />
                                                </div>
                                                <input type="text" placeholder="Enter Bank Name" value={bankData.name} onChange={(e) => setBankData({...bankData, name: e.target.value})} className="w-full pl-12 pr-12 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[13px] font-bold text-gray-400 mb-2 block">Account Number</label>
                                                <input type="text" placeholder="Enter Account Number" value={bankData.accountNumber} onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})} className="w-full pl-4 pr-4 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-[13px] font-bold text-gray-400 mb-2 block">IFSC Code</label>
                                                <input type="text" placeholder="Enter IFSC Code" value={bankData.ifsc} onChange={(e) => setBankData({...bankData, ifsc: e.target.value})} className="w-full pl-4 pr-4 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                            </div>
                                        </div>
                                        <button onClick={() => { setVerificationType('bank'); handleAddMethod(); }} className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all text-white font-bold text-[16px] rounded-[14px] mt-4 shadow-sm">Add Bank Account</button>
                                    </div>
                                </div>
                            ) : isAddingWallet ? (
                                <div className="min-h-[500px] rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-sm)]">
                                    <button onClick={() => setIsAddingWallet(false)} className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 group">
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-[14px] font-bold">Back to Banks Details</span>
                                    </button>
                                    <h2 className="text-[20px] font-medium text-gray-900 mb-8">Link Digital Wallet</h2>
                                    <div className="space-y-6 max-w-[700px]">
                                        <div>
                                            <label className="text-[13px] font-bold text-gray-400 mb-2 block">Select Provider</label>
                                            <select value={walletData.provider} onChange={(e) => setWalletData({...walletData, provider: e.target.value})} className="w-full px-4 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[var(--color-primary)] transition-all bg-white">
                                                <option>Paytm</option>
                                                <option>PhonePe</option>
                                                <option>Amazon Pay</option>
                                                <option>MobiKwik</option>
                                                <option>Freecharge</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[13px] font-bold text-gray-400 mb-2 block">Wallet Linked Phone Number</label>
                                            <input type="text" placeholder="Enter 10-digit mobile number" value={walletData.phoneNumber} onChange={(e) => setWalletData({...walletData, phoneNumber: e.target.value})} className="w-full px-4 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all" />
                                        </div>
                                        <button onClick={() => { setVerificationType('wallet'); handleAddMethod(); }} className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all text-white font-bold text-[16px] rounded-[14px] mt-4 shadow-sm">Link Wallet</button>
                                    </div>
                                </div>
                            ) : isAddingCredPay ? (
                                <div className="min-h-[500px] rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-sm)]">
                                    <button onClick={() => setIsAddingCredPay(false)} className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 group">
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-[14px] font-bold">Back to Banks Details</span>
                                    </button>
                                    <div className="flex flex-col items-center text-center mb-8">
                                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4">
                                            <div className="text-white font-black text-xs">CRED</div>
                                        </div>
                                        <h2 className="text-[20px] font-medium text-gray-900">Link CRED pay</h2>
                                        <p className="text-sm text-gray-500 mt-2">Win cashback on every withdrawal through CRED</p>
                                    </div>
                                    <div className="space-y-6 max-w-[500px] mx-auto">
                                        <div>
                                            <label className="text-[13px] font-bold text-gray-400 mb-2 block">CRED Linked Phone Number</label>
                                            <input type="text" placeholder="Enter mobile number" value={credPayData.phoneNumber} onChange={(e) => setCredPayData({...credPayData, phoneNumber: e.target.value})} className="w-full px-4 py-3.5 border border-[var(--color-border)] rounded-[12px] text-[15px] font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all text-center" />
                                        </div>
                                        <button onClick={() => { setVerificationType('credpay'); handleAddMethod(); }} className="w-full py-4 bg-black hover:bg-gray-900 active:scale-[0.99] transition-all text-white font-bold text-[16px] rounded-[14px] mt-4 shadow-sm">Link CRED Account</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <PerformerPageHeader
                                        title="Bank Details"
                                        subtitle="Manage UPI, cards, and bank accounts for withdrawals"
                                        backTo="/performer/account"
                                        backLabel="Back to Account Hub"
                                    />

                                    <div className="flex flex-col md:flex-row gap-6 w-full">
                                        <div className="flex flex-1 flex-col rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                                            <h3 className="text-[17px] font-medium text-gray-900 mb-4">UPI Links</h3>
                                            <div className="space-y-3 mb-5">
                                                {payoutMethods.filter(m => m.type === 'UPI').length > 0 ? (
                                                    payoutMethods.filter(m => m.type === 'UPI').map(method => (
                                                        <div key={method.id} className="flex items-center justify-between p-3 bg-[var(--color-primary-subtle)]/50 rounded-[16px]">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                                                                    <div className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wider">UPI</div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[14px] font-bold text-gray-900">{method.details?.upiId}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => handleDelete(method.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-8 text-center text-sm text-gray-400">No UPI linked yet</div>
                                                )}
                                            </div>
                                            <button onClick={() => setIsAddingUpi(true)} className="w-full flex items-center justify-center gap-2 py-3.5 border border-[var(--color-primary)]/30 rounded-[14px] text-[var(--color-primary)] font-bold text-[14px] hover:bg-[var(--color-primary-subtle)]/60 transition-colors mt-auto">
                                                <Plus size={16} strokeWidth={2.5} /> Add UPI
                                            </button>
                                        </div>

                                        <div className="flex flex-1 flex-col rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                                            <h3 className="text-[17px] font-medium text-gray-900 mb-4">More Payment Options</h3>
                                            <div className="space-y-3 mb-5">
                                                <div onClick={() => setIsAddingWallet(true)} className="flex items-center justify-between p-3.5 bg-[var(--color-primary-subtle)]/50 rounded-[16px] group cursor-pointer hover:bg-[var(--color-primary-subtle)]/70 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <Wallet size={24} className="text-gray-800" strokeWidth={1.5} />
                                                        <div>
                                                            <p className="text-[14px] font-bold text-gray-900">Wallets</p>
                                                            <p className="text-[12px] font-medium text-gray-400 mt-0.5">Add & link e-wallets & more</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                                                </div>
                                                <div onClick={() => setIsAddingNetbanking(true)} className="flex items-center justify-between p-3.5 bg-[var(--color-primary-subtle)]/50 rounded-[16px] group cursor-pointer hover:bg-[var(--color-primary-subtle)]/70 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <Landmark size={24} className="text-gray-800" strokeWidth={1.5} />
                                                        <div>
                                                            <p className="text-[14px] font-bold text-gray-900">Bank Details</p>
                                                            <p className="text-[12px] font-medium text-gray-400 mt-0.5">Add & link bank details</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                                                </div>
                                                <div onClick={() => setIsAddingCredPay(true)} className="flex items-center justify-between p-3.5 bg-[var(--color-primary-subtle)]/50 rounded-[16px] group cursor-pointer hover:bg-[var(--color-primary-subtle)]/70 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <CreditCard size={24} className="text-gray-800" strokeWidth={1.5} />
                                                        <div>
                                                            <p className="text-[14px] font-bold text-gray-900">CRED pay</p>
                                                            <p className="text-[12px] font-medium text-gray-400 mt-0.5">Link CRED pay</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                                                </div>
                                            </div>
                                            <button onClick={() => setIsAddingCard(true)} className="w-full flex items-center justify-center gap-2 py-3.5 border border-[var(--color-primary)]/30 rounded-[14px] text-[var(--color-primary)] font-bold text-[14px] hover:bg-[var(--color-primary-subtle)]/60 transition-colors mt-auto">
                                                <Plus size={16} strokeWidth={2.5} /> Add Cards
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                                        <h3 className="text-[16.5px] font-medium text-gray-900 mb-2">Secure Payment Methods</h3>
                                        <p className="text-[13px] font-medium text-gray-500">All your payment information is encrypted and secure. You can add or remove payment methods at any time.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
                                        <div className="relative h-[120px] overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary-subtle)] to-[#DFF7F6]/80 p-6 shadow-[var(--shadow-sm)]">
                                            <div className="relative z-10 flex h-full flex-col justify-between">
                                                <h4 className="text-[13px] font-medium text-[var(--color-text-muted)]">Total linked methods</h4>
                                                <p className="text-[36px] font-medium tabular-nums text-[var(--color-text)]">{payoutMethods.length}</p>
                                            </div>
                                            <CreditCard size={26} className="absolute right-6 top-6 text-[var(--color-primary)]" strokeWidth={1.5} />
                                        </div>
                                        <div className="relative h-[120px] overflow-hidden rounded-2xl border border-[var(--color-primary)]/25 bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                                            <div className="relative z-10 flex h-full flex-col justify-between text-left">
                                                <h4 className="text-[13px] font-medium text-[var(--color-text-muted)]">UPI accounts</h4>
                                                <p className="text-[36px] font-medium tabular-nums text-[var(--color-text)]">{payoutMethods.filter(m => m.type === 'UPI').length}</p>
                                            </div>
                                            <div className="absolute right-6 top-6 rounded border-2 border-[var(--color-primary)] px-1.5 py-0.5 text-[9px] font-black tracking-wide text-[var(--color-primary)]">UPI</div>
                                        </div>
                                        <div className="relative h-[120px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#EFFBFB] to-slate-100 p-6 shadow-[var(--shadow-sm)]">
                                            <div className="relative z-10 flex h-full flex-col justify-between">
                                                <h4 className="text-[13px] font-medium text-[var(--color-text-muted)]">Primary method</h4>
                                                <p className="text-lg font-medium leading-tight text-[var(--color-text)]">
                                                    {payoutMethods.length > 0 ? (payoutMethods[0].type === 'UPI' ? payoutMethods[0].details?.upiId : payoutMethods[0].type) : 'None'}
                                                </p>
                                            </div>
                                            <Banknote size={26} className="absolute right-6 top-6 text-[var(--color-primary)]" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default PerformerBankDetailsPage;
