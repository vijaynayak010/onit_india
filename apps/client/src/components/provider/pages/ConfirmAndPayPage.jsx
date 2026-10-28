import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProviderHeader from '../components/ProviderHeader';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
    Check,
    Star,
    ChevronDown,
    CreditCard,
    ShieldCheck,
    Clock,
    CircleDollarSign,
    Layout,
    ChevronRight,
    Lock,
    Loader2,
    FileText,
    Paperclip,
    Tag,
    Copy,
    X
} from 'lucide-react';
import { acceptInterest, createRazorpayOrder, verifyRazorpayPayment, getProviderProfile, directHireTasker, previewTaskPayment, listMyVouchers } from '../services/api';
import { loadRazorpay } from '../../../utils/loadRazorpay';

const parseAmount = (value) => {
    if (typeof value === "number") return value;
    const digits = String(value || "").replace(/[^\d.]/g, "");
    return digits ? Number(digits) : 0;
};

const ConfirmAndPayPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const taskData = location.state?.taskData;
    const performer = location.state?.performer;
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [provider, setProvider] = useState(null);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCouponCode, setAppliedCouponCode] = useState("");
    const [couponMessage, setCouponMessage] = useState("");
    const [couponError, setCouponError] = useState("");
    const [pricingLoading, setPricingLoading] = useState(true);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponsLoading, setCouponsLoading] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [copiedCouponCode, setCopiedCouponCode] = useState("");
    const [useWallet, setUseWallet] = useState(false);

    // Task amount is fixed; commission is resolved server-side from CategoryCommission.
    const basePrice = parseAmount(taskData?.priceAmount ?? taskData?.budget ?? taskData?.price);
    const [breakdown, setBreakdown] = useState(null);
    const commissionAmount = Number(breakdown?.commissionAmount ?? 0);
    const commissionRate = Number(breakdown?.commissionRate ?? 0);
    const platformFeeAmount = Number(breakdown?.platformFeeAmount ?? 0);
    const couponDiscount = Number(breakdown?.couponDiscountAmount ?? 0);
    const totalAmount = Number(breakdown?.totalProviderPaid ?? 0);
    const grossProviderAmount = Number(breakdown?.grossProviderAmount ?? basePrice + commissionAmount + platformFeeAmount);
    const taskId = taskData?.id || taskData?._id;

    useEffect(() => {
        // Fetch provider for Razorpay prefill
        getProviderProfile().then(setProvider).catch(() => { });
    }, []);

    useEffect(() => {
        if (!taskId) {
            setPricingLoading(false);
            return;
        }

        let cancelled = false;
        setPricingLoading(true);
        previewTaskPayment(taskId, {
            useWallet,
            ...(appliedCouponCode ? { couponCode: appliedCouponCode } : {}),
        })
            .then((preview) => {
                if (cancelled) return;
                setBreakdown(preview);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("Failed to preview payment:", err);
                setCouponError(err?.message || "Could not load payment summary.");
            })
            .finally(() => {
                if (!cancelled) setPricingLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [taskId, useWallet, appliedCouponCode]);

    useEffect(() => {
        let cancelled = false;
        setCouponsLoading(true);

        listMyVouchers({ status: "available", limit: 10 })
            .then((response) => {
                if (cancelled) return;
                const items = response?.data || response?.items || [];
                setAvailableCoupons(Array.isArray(items) ? items : []);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("Failed to load available coupons:", err);
                setAvailableCoupons([]);
            })
            .finally(() => {
                if (!cancelled) setCouponsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const formatMoney = (value) =>
        Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

    const couponDiscountLabel = (coupon) => {
        if (!coupon) return "";
        if (coupon.discountType === "PERCENT") {
            return `${formatMoney(coupon.discountAmount)}% off`;
        }
        return `₹${formatMoney(coupon.discountAmount)} off`;
    };

    const couponTitleLabel = (coupon) => {
        if (!coupon) return "";
        if (coupon.discountType === "PERCENT") {
            return `${formatMoney(coupon.discountAmount)}% OFF`;
        }
        return `Flat ₹${formatMoney(coupon.discountAmount)} OFF`;
    };

    const couponTermsLabel = (coupon) => {
        if (!coupon) return "";
        if (coupon.minOrderValue > 0) {
            return `Valid on tasks above ₹${formatMoney(coupon.minOrderValue)}`;
        }
        return coupon.description || "Applicable on eligible task payments.";
    };

    const applicableCoupons = availableCoupons.filter((voucher) => {
        const coupon = voucher?.coupon;
        if (!coupon) return false;
        return !coupon.minOrderValue || Number(coupon.minOrderValue) <= grossProviderAmount;
    });

    const finalizeHire = async () => {
        if (performer.hireType === 'accepted_invitation') {
            // The performer already accepted the invitation. Payment verifies
            // and funds the existing assignment; do not create another one.
        } else if (performer.interestId === 'direct_hire') {
            await directHireTasker(taskId, performer.taskerId);
        } else {
            await acceptInterest(performer.interestId);
        }

        sessionStorage.removeItem("onit_provider_tasks_cache");
        sessionStorage.removeItem("onit_provider_dashboard_cache");
        setIsProcessing(false);
        setIsSuccess(true);

        setTimeout(() => {
            navigate(`/provider/active-task/${taskId}`);
        }, 4000);
    };

    const handleApplyCoupon = async (selectedCode) => {
        const code = (selectedCode || couponCode).trim();
        if (!code) {
            setCouponError("Enter a coupon code.");
            setCouponMessage("");
            return;
        }
        if (!taskId) {
            setCouponError("Missing task. Go back and try again.");
            setCouponMessage("");
            return;
        }

        try {
            setPricingLoading(true);
            setCouponError("");
            setCouponMessage("");
            const preview = await previewTaskPayment(taskId, { couponCode: code, useWallet });
            setBreakdown(preview);
            const appliedCode = preview?.coupon?.code || code;
            setCouponCode(appliedCode);
            setAppliedCouponCode(appliedCode);
            setCouponMessage(`${appliedCode} Applied Successfully`);
        } catch (err) {
            setAppliedCouponCode("");
            setCouponError(err?.message || "Could not apply this coupon.");
        } finally {
            setPricingLoading(false);
        }
    };

    const handleRemoveCoupon = async () => {
        try {
            setPricingLoading(true);
            setAppliedCouponCode("");
            setCouponCode("");
            setCouponMessage("");
            setCouponError("");
            const preview = await previewTaskPayment(taskId, { useWallet });
            setBreakdown(preview);
        } catch (err) {
            setCouponError(err?.message || "Could not remove coupon.");
        } finally {
            setPricingLoading(false);
        }
    };

    const handleCopyCoupon = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCouponCode(code);
            setTimeout(() => setCopiedCouponCode(""), 1800);
        } catch {
            setCouponError("Could not copy coupon code.");
        }
    };

    const handlePayment = async () => {
        if (!taskId) {
            alert("Missing task. Go back and try again.");
            return;
        }
        if (!performer?.interestId) {
            alert("This performer must express interest in your task first before you can hire them.");
            return;
        }

        if (basePrice <= 0) {
            alert("Invalid task amount.");
            return;
        }

        try {
            setIsProcessing(true);
            const Razorpay = await loadRazorpay();

            // Task funding: amount, commission, and coupon are computed by the API.
            const order = await createRazorpayOrder({
                taskId,
                ...(appliedCouponCode ? { couponCode: appliedCouponCode } : {}),
                ...(useWallet ? { useWallet: true } : {}),
            });
            if (order?.breakdown) setBreakdown(order.breakdown);

            if (order?.paymentRequired === false || Number(order?.amount || 0) === 0) {
                await finalizeHire();
                return;
            }

            // 2. Open Razorpay Modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency || "INR",
                name: "OnIT India",
                description: `Hiring ${performer.person || 'Performer'} for "${taskData.title}"`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        setIsProcessing(true);
                        // 3. Verify Payment
                        await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            taskId,
                        });

                        // 4. Accept the Interest (Finalize Assignment)
                        await finalizeHire();
                    } catch (err) {
                        console.error("Payment verification/Hiring failed:", err);
                        alert(err?.message || "Failed to finalize hiring after payment. Please contact support.");
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: provider?.organization || "Provider",
                    email: provider?.user?.email || "",
                    contact: provider?.phoneNumber || ""
                },
                theme: {
                    color: "#16a34a"
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', (response) => {
                alert(`Payment failed: ${response.error.description}`);
                setIsProcessing(false);
            });
            rzp.open();

        } catch (err) {
            console.error("Failed to initiate payment flow:", err);
            alert(err?.message || "Failed to initiate payment. Please try again.");
            setIsProcessing(false);
        }
    };

    const title = taskData?.title || "Task";
    const description = taskData?.description || "";
    const category = taskData?.category || "General";
    const deadline = taskData?.deadline || "To be discussed";
    const walletBalance = Number(breakdown?.walletBalance ?? 0);
    const walletAppliedAmount = Number(breakdown?.walletAppliedAmount ?? 0);
    const gatewayPaidAmount = Number(breakdown?.gatewayPaidAmount ?? totalAmount);

    return (
        <div className="min-h-screen mt-30 bg-white font-sans text-slate-900">
            <ProviderHeader activePage="my-tasks" />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-[34px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Confirm & Pay</h1>
                    <p className="text-[#64748b] font-medium text-[16px]">Review your hiring details and complete payment.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Performer Card */}
                        <div className="bg-white border border-[#f1f5f9] rounded-[2rem] p-8 shadow-sm">
                            <p className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-[0.1em] mb-6">PERFORMER</p>
                            <div className="flex items-start justify-between">
                                <div className="flex gap-6">
                                    <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                                        {performer?.avatar ? (
                                            <img
                                                src={performer.avatar}
                                                alt={performer.person}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl font-bold text-slate-300">{performer?.person?.charAt(0) || 'P'}</span>
                                        )}
                                    </div>
                                    <div className="pt-1">
                                        <h2 className="text-[24px] font-bold text-[#0f172a] mb-0.5">{performer?.person || "Ananya"}</h2>
                                        <p className="text-[15px] font-semibold text-[#16a34a] mb-2.5">{performer?.name || "Web Designer"}</p>
                                        <div className="flex items-center gap-1.5 mb-4">
                                            <div className="flex text-amber-400 gap-0.5">
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                            </div>
                                            <span className="text-[14px] font-bold text-[#0f172a] ml-1">{performer?.rating || "4.7"}/5</span>
                                            <span className="text-[14px] font-medium text-[#94a3b8] ml-0.5">({performer?.tasks || "0 Tasks"})</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eff6ff] text-[#2563eb] rounded-full text-[12px] font-bold border border-[#dbeafe]">
                                                <Check size={12} strokeWidth={3} /> Verified
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f0fdf4] text-[#16a34a] rounded-full text-[12px] font-bold border border-[#dcfce7]">
                                                <Check size={12} strokeWidth={3} /> ID Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right pt-1">
                                    {performer?.rate ? (
                                        <p className="text-[24px] font-bold text-[#0f172a]">{performer.rate}</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Task Details Card */}
                        <div className="bg-white border border-[#f1f5f9] rounded-[2rem] p-8 shadow-sm">
                            <p className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-[0.1em] mb-6">TASK DETAILS</p>
                            <h3 className="text-[24px] font-bold text-[#0f172a] mb-3">{title}</h3>
                            <p className="text-[16px] font-medium text-[#64748b] leading-relaxed mb-10">
                                {description}
                            </p>

                            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                <div>
                                    <p className="text-[13px] font-bold text-[#94a3b8] mb-1.5">Task Budget</p>
                                    <p className="text-[16px] font-bold text-[#0f172a]">₹{basePrice}</p>
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#94a3b8] mb-1.5">Estimated Delivery</p>
                                    <p className="text-[16px] font-bold text-[#0f172a]">{deadline}</p>
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#94a3b8] mb-1.5">Category</p>
                                    <p className="text-[16px] font-bold text-[#0f172a]">{category}</p>
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#94a3b8] mb-1.5">Service Tier</p>
                                    <p className="text-[16px] font-bold text-[#16a34a]">OnIT Verified</p>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            {taskData?.files && taskData.files.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-[#f1f5f9]">
                                    <p className="text-[13px] font-bold text-[#94a3b8] mb-4 uppercase tracking-[0.05em]">ATTACHMENTS ({taskData.files.length})</p>
                                    <div className="flex flex-wrap gap-3">
                                        {taskData.files.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
                                                <Paperclip size={14} className="text-[#64748b]" />
                                                <span className="text-[13px] font-bold text-[#475569]">{file.filename}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Payment Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white border border-[#f1f5f9] rounded-[2rem] p-8 shadow-sm sticky top-24">
                            <p className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-[0.1em] mb-8">PAYMENT SUMMARY</p>

                            <div className="space-y-6 mb-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Layout size={18} className="text-[#64748b]" />
                                        <span className="text-[16px] font-bold text-[#0f172a]">Base Task Fee</span>
                                    </div>
                                    <span className="text-[16px] font-bold text-[#0f172a]">₹ {basePrice}</span>
                                </div>

                                <div className="pl-8 space-y-4">
                                    {(pricingLoading || commissionAmount > 0) && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-[1.5px] h-4 bg-[#e2e8f0]" />
                                                <span className="text-[15px] font-medium text-[#64748b]">
                                                    Service commission {commissionRate ? `(${commissionRate}%)` : ""}
                                                </span>
                                            </div>
                                            <span className="text-[15px] font-bold text-[#0f172a]">
                                                {pricingLoading ? "Calculating..." : `₹ ${formatMoney(commissionAmount)}`}
                                            </span>
                                        </div>
                                    )}
                                    {(pricingLoading || platformFeeAmount > 0) && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-[1.5px] h-4 bg-[#e2e8f0]" />
                                                <span className="text-[15px] font-medium text-[#64748b]">
                                                    Platform fee
                                                </span>
                                            </div>
                                            <span className="text-[15px] font-bold text-[#0f172a]">
                                                {pricingLoading ? "Calculating..." : `₹ ${formatMoney(platformFeeAmount)}`}
                                            </span>
                                        </div>
                                    )}
                                    {couponDiscount > 0 && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-[1.5px] h-4 bg-[#dcfce7]" />
                                                <span className="text-[15px] font-medium text-[#16a34a]">
                                                    Coupon discount
                                                </span>
                                            </div>
                                            <span className="text-[15px] font-bold text-[#16a34a]">- ₹ {formatMoney(couponDiscount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                                    <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#64748b]">Coupon Code</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                                            placeholder="Enter coupon"
                                            className="min-w-0 flex-1 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-[14px] font-bold uppercase tracking-wide text-[#0f172a] outline-none transition focus:border-[#16a34a]"
                                            disabled={pricingLoading || isProcessing}
                                        />
                                        {appliedCouponCode ? (
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-[13px] font-black text-[#64748b]"
                                                disabled={pricingLoading || isProcessing}
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleApplyCoupon()}
                                                className="rounded-xl bg-[#16a34a] px-4 py-2.5 text-[13px] font-black text-white disabled:opacity-50"
                                                disabled={pricingLoading || isProcessing}
                                            >
                                                Apply
                                            </button>
                                        )}
                                    </div>
                                    {couponMessage && (
                                        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-[#ecfdf5] px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#16a34a] text-[#16a34a]">
                                                    <Check size={15} strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-black text-[#15803d]">{couponMessage}</p>
                                                    {couponDiscount > 0 && (
                                                        <p className="text-[12px] font-semibold text-[#16a34a]">You saved ₹{formatMoney(couponDiscount)}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="text-[13px] font-bold text-red-600 underline decoration-red-600 underline-offset-2"
                                                disabled={pricingLoading || isProcessing}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    {couponError && <p className="mt-2 text-[12px] font-bold text-red-500">{couponError}</p>}

                                    <button
                                        type="button"
                                        onClick={() => setShowCouponModal(true)}
                                        className="mt-4 flex w-full items-center justify-between rounded-2xl border border-[#dcfce7] bg-white px-4 py-3 text-left transition hover:border-[#16a34a] hover:bg-[#f8fffb]"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
                                                <Tag size={16} />
                                            </span>
                                            <span>
                                                <span className="block text-[13px] font-black text-[#0f172a]">
                                                    View available offers
                                                </span>
                                                <span className="text-[12px] font-semibold text-[#64748b]">
                                                    {couponsLoading ? "Loading coupons..." : `${applicableCoupons.length} coupon${applicableCoupons.length === 1 ? "" : "s"} available`}
                                                </span>
                                            </span>
                                        </span>
                                        <ChevronRight size={18} className="text-[#94a3b8]" />
                                    </button>
                                </div>

                                <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${useWallet ? "border-[#86efac] bg-[#f0fdf4]" : "border-[#e2e8f0] bg-white hover:border-[#bbf7d0]"}`}>
                                    <input
                                        type="checkbox"
                                        checked={useWallet}
                                        onChange={(event) => setUseWallet(event.target.checked)}
                                        disabled={pricingLoading || isProcessing || walletBalance <= 0}
                                        className="mt-1 h-4 w-4 accent-[#16a34a]"
                                    />
                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-2 text-[15px] font-black text-[#0f172a]">
                                            <CircleDollarSign size={18} className="text-[#16a34a]" />
                                            Pay using wallet
                                        </span>
                                        <span className="mt-1 block text-[12px] font-semibold text-[#64748b]">
                                            Available balance: ₹ {formatMoney(walletBalance)}
                                        </span>
                                        {useWallet && !pricingLoading ? (
                                            <span className="mt-1 block text-[12px] font-bold text-[#15803d]">
                                                ₹ {formatMoney(walletAppliedAmount)} will be applied from your wallet.
                                            </span>
                                        ) : null}
                                    </span>
                                </label>

                                <div className="pt-6 border-t border-[#f1f5f9]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[17px] font-black text-[#0f172a]">Total Amount</span>
                                        <span className="text-[20px] font-black text-[#16a34a]">
                                            {pricingLoading ? "Calculating..." : `₹ ${formatMoney(totalAmount)}`}
                                        </span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <p className="mt-1 text-right text-[12px] font-semibold text-[#94a3b8]">
                                            Before discount: ₹ {formatMoney(grossProviderAmount)}
                                        </p>
                                    )}
                                    {useWallet && walletAppliedAmount > 0 && (
                                        <div className="mt-3 flex items-center justify-between text-[14px] font-bold text-[#15803d]">
                                            <span>Paid from wallet</span>
                                            <span>- ₹ {formatMoney(walletAppliedAmount)}</span>
                                        </div>
                                    )}
                                    {useWallet && !pricingLoading && gatewayPaidAmount > 0 && (
                                        <p className="mt-1 text-right text-[12px] font-semibold text-[#64748b]">
                                            Remaining to pay by Razorpay: ₹ {formatMoney(gatewayPaidAmount)}
                                        </p>
                                    )}
                                </div>
                            </div>



                            <button
                                className={`w-full ${isProcessing ? 'bg-slate-100 text-slate-400' : 'bg-[#16a34a] hover:bg-[#15803d] text-white'} py-5 rounded-full text-[19px] font-black transition-all shadow-lg active:scale-[0.98] mb-6 flex items-center justify-center gap-3`}
                                onClick={handlePayment}
                                disabled={isProcessing || pricingLoading || !breakdown}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={22} />
                                        Securing Payment...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        {useWallet && gatewayPaidAmount === 0
                                            ? "Pay with Wallet"
                                            : `Pay ₹${formatMoney(useWallet ? gatewayPaidAmount : totalAmount)}`}
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-[#94a3b8] font-medium text-[13px]">
                                Secure payment • Money-back guarantee
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[#2563eb] font-semibold text-[14px] leading-relaxed">
                        Secure 256-bit SSL Encrypted Payment<br />Money is held in Escrow until task completion.
                    </p>
                </div>
            </main>

            <AnimatePresence>
                {showCouponModal && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm"
                        onClick={() => setShowCouponModal(false)}
                    >
                        <Motion.div
                            initial={{ y: 24, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 16, opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="max-h-[86vh] w-full max-w-[560px] overflow-hidden rounded-[2rem] bg-[#f3f6fb] shadow-2xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-white/70 px-6 py-5">
                                <div>
                                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">Available Offers</p>
                                    <p className="mt-1 text-[14px] font-semibold text-[#64748b]">Apply a coupon to reduce this payment.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowCouponModal(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#64748b] shadow-sm transition hover:text-[#0f172a]"
                                    aria-label="Close offers"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="max-h-[calc(86vh-94px)] overflow-y-auto px-6 py-6">
                                <div className="mb-6 flex gap-3">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                                        placeholder="Enter coupon code"
                                        className="min-w-0 flex-1 rounded-2xl border border-transparent bg-white px-5 py-4 text-[15px] font-bold uppercase tracking-wide text-[#0f172a] outline-none shadow-sm transition focus:border-[#16a34a]"
                                        disabled={pricingLoading || isProcessing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleApplyCoupon()}
                                        className="rounded-2xl bg-[#16a34a] px-6 py-4 text-[15px] font-black text-white shadow-sm transition hover:bg-[#15803d] disabled:opacity-50"
                                        disabled={pricingLoading || isProcessing || !couponCode.trim()}
                                    >
                                        Apply
                                    </button>
                                </div>

                                {couponMessage && (
                                    <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-[#e7f8ef] px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#16a34a] text-[#16a34a]">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-black text-[#15803d]">{couponMessage}</p>
                                                {couponDiscount > 0 && (
                                                    <p className="text-[13px] font-semibold text-[#16a34a]">You saved ₹{formatMoney(couponDiscount)}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-[14px] font-bold text-red-600 underline decoration-red-600 underline-offset-2"
                                            disabled={pricingLoading || isProcessing}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                {couponError && <p className="mb-4 text-[13px] font-bold text-red-500">{couponError}</p>}

                                {couponsLoading ? (
                                    <div className="flex items-center justify-center gap-3 rounded-[1.75rem] bg-white px-6 py-10 text-[#64748b]">
                                        <Loader2 size={20} className="animate-spin" />
                                        <span className="text-[14px] font-bold">Loading offers...</span>
                                    </div>
                                ) : applicableCoupons.length === 0 ? (
                                    <div className="rounded-[1.75rem] bg-white px-6 py-10 text-center shadow-sm">
                                        <p className="text-[16px] font-black text-[#0f172a]">No coupons available</p>
                                        <p className="mt-2 text-[14px] font-semibold text-[#64748b]">
                                            New offers will show here when they are available for this payment.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {applicableCoupons.map((voucher) => {
                                            const coupon = voucher.coupon;
                                            const isApplied = appliedCouponCode === coupon.code;
                                            const isCopied = copiedCouponCode === coupon.code;

                                            return (
                                                <div
                                                    key={voucher.id || coupon.id}
                                                    className={`rounded-[1.75rem] bg-white p-6 shadow-sm transition ${
                                                        isApplied ? "ring-2 ring-[#16a34a]" : ""
                                                    }`}
                                                >
                                                    <div className="mb-4 flex flex-wrap items-center gap-3">
                                                        <span className="rounded-xl border-2 border-dashed border-[#16a34a] px-3 py-1.5 text-[15px] font-black uppercase tracking-wide text-[#15803d]">
                                                            {coupon.code}
                                                        </span>
                                                        <span className="text-[15px] font-black text-[#16a34a]">
                                                            {couponDiscountLabel(coupon)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-[20px] font-black text-[#273244]">{couponTitleLabel(coupon)}</h3>
                                                    <p className="mt-2 text-[15px] font-semibold text-[#64748b]">
                                                        {couponTermsLabel(coupon)}
                                                    </p>
                                                    {coupon.description && coupon.minOrderValue > 0 && (
                                                        <p className="mt-1 text-[13px] font-medium text-[#94a3b8]">{coupon.description}</p>
                                                    )}

                                                    <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApplyCoupon(coupon.code)}
                                                            disabled={pricingLoading || isProcessing || isApplied}
                                                            className={`rounded-full px-6 py-4 text-[16px] font-black transition ${
                                                                isApplied
                                                                    ? "bg-[#eef2f7] text-[#64748b]"
                                                                    : "bg-[#16a34a] text-white hover:bg-[#15803d]"
                                                            } disabled:cursor-default`}
                                                        >
                                                            {isApplied ? "Applied" : "Apply"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyCoupon(coupon.code)}
                                                            className="flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-5 py-4 text-[15px] font-black text-[#273244] transition hover:border-[#16a34a]"
                                                        >
                                                            <Copy size={17} />
                                                            {isCopied ? "Copied" : "Copy"}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Premium Loading & Success Overlay */}
            <AnimatePresence>
                {(isProcessing || isSuccess) && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/90 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 text-center"
                    >
                        {!isSuccess ? (
                            <>
                                <div className="relative mb-10">
                                    <Motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="w-24 h-24 border-4 border-slate-100 border-t-[#16a34a] rounded-full"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ShieldCheck size={40} className="text-[#16a34a]" />
                                    </div>
                                </div>
                                <h2 className="text-[28px] font-black text-slate-900 mb-2">Processing Secure Payment</h2>
                                <p className="text-slate-400 font-bold max-w-[320px]">Verifying transaction and assigning performer. Please stay on this page.</p>
                            </>
                        ) : (
                            <>
                                <Motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="w-28 h-28 bg-[#16a34a] rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-green-500/30"
                                >
                                    <Check size={52} className="text-white" strokeWidth={4} />
                                </Motion.div>
                                <h2 className="text-[34px] font-black text-slate-900 mb-3 tracking-tight">Payment Successful!</h2>
                                <div className="flex flex-col items-center gap-2 mb-12">
                                    <p className="text-[19px] font-bold text-slate-600">
                                        Task <span className="text-emerald-600">ASSIGNED</span> to {performer?.person}
                                    </p>
                                    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[12px] font-black uppercase tracking-wider">
                                        Task in Progress
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/provider/active-task/${taskData.id || taskData._id}`)}
                                    className="px-10 py-4.5 bg-slate-900 text-white rounded-full font-black text-[17px] hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center gap-3"
                                >
                                    Manage Task Execution <ChevronRight size={20} />
                                </button>
                                <p className="mt-8 text-slate-400 font-bold text-[14px]">Redirecting in 3 seconds...</p>
                            </>
                        )}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ConfirmAndPayPage;
