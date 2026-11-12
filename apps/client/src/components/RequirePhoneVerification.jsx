import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Loader, Phone, ShieldCheck } from "lucide-react";
import { apiFetch } from "../utils/apiFetch";
import {
    loadMsg91Widget,
    sendMsg91Otp,
    verifyMsg91Otp,
    extractMsg91AccessToken,
} from "../utils/msg91Loader";
import { getMsg91Identifier } from "../utils/phoneIdentifier";
import { PHONE_OTP_ENABLED } from "../config/authFeatures";
import { isTestModeEnabled } from "../test-mode/testModeConfig";

const OTP_LENGTH = 4;

const RequirePhoneVerification = ({ children }) => {
    if (!PHONE_OTP_ENABLED || isTestModeEnabled()) {
        return <>{children}</>;
    }
    const { user, refreshProfile, token } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [step, setStep] = useState("PHONE_ENTRY");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(20);
    const [msg91Active, setMsg91Active] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const otpRefs = useRef(Array.from({ length: OTP_LENGTH }, () => React.createRef()));

    useEffect(() => {
        refreshProfile()
            .catch((err) => console.error("[ONIT] Verification pre-check failed:", err))
            .finally(() => setIsChecking(false));
    }, [refreshProfile]);

    const needsVerification = !isChecking && user && (!user.phoneNumber && !user.phone);

    useEffect(() => {
        if (!needsVerification) {
            setMsg91Active(false);
            return undefined;
        }

        let cancelled = false;
        const timerId = setTimeout(() => {
            loadMsg91Widget().then((active) => {
                if (!cancelled) setMsg91Active(active);
            });
        }, 80);

        return () => {
            cancelled = true;
            clearTimeout(timerId);
        };
    }, [needsVerification]);

    useEffect(() => {
        let interval;
        if (step === "OTP_ENTRY" && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    useEffect(() => {
        if (step === "OTP_ENTRY") {
            setTimeout(() => otpRefs.current[0]?.current?.focus(), 100);
        }
    }, [step]);

    const handleSendOtp = async (e) => {
        e?.preventDefault();
        const cleaned = phoneNumber.replace(/\D/g, "");
        if (cleaned.length < 10) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            let active = msg91Active;
            if (!active) {
                active = await loadMsg91Widget();
                setMsg91Active(active);
            }
            if (!active) {
                throw new Error("Phone OTP could not load. Try again or reload the page.");
            }

            const sendRes = await sendMsg91Otp(getMsg91Identifier(phoneNumber));
            if (!sendRes?.reqId) {
                throw new Error("OTP was not queued by MSG91 (missing request id).");
            }
            setTimer(20);
            setOtp(Array(OTP_LENGTH).fill(""));
            setStep("OTP_ENTRY");
        } catch (err) {
            setError(err?.message || "Failed to send OTP. Please check your number.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        setError("");
        if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.current?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.current?.focus();
        if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.current?.focus();
        if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.current?.focus();
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((ch, i) => { next[i] = ch; });
        setOtp(next);
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        otpRefs.current[focusIdx]?.current?.focus();
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join("");
        if (fullOtp.length !== OTP_LENGTH) return;

        setIsSubmitting(true);
        setError("");

        try {
            const data = await verifyMsg91Otp(fullOtp);
            const msg91token = extractMsg91AccessToken(data);
            if (!msg91token) {
                throw new Error("Verification success but no token received.");
            }

            const ownerType = String(user.role).toUpperCase() === "PROVIDER" ? "PROVIDER" : "TASKER";
            await apiFetch(`/auth/profile-phone/verify-access-token?access-token=${msg91token}`, {
                method: "POST",
                body: JSON.stringify({ ownerType, accessToken: msg91token }),
            });

            await refreshProfile();
        } catch (err) {
            setError(err?.message || "Invalid OTP code. Please try again.");
            setOtp(Array(OTP_LENGTH).fill(""));
            otpRefs.current[0]?.current?.focus();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isChecking || !needsVerification) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-emerald-50/50 px-4 py-10 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200/60 bg-white shadow-[0_24px_54px_-12px_rgba(0,0,0,0.18)]"
                >
                    <div className="p-8">
                        <div className="w-14 h-14 bg-[var(--color-primary-subtle)] text-[var(--color-primary)] rounded-full flex items-center justify-center mb-6 border border-[var(--color-primary)]/20">
                            {step === "PHONE_ENTRY" ? <Phone className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                        </div>

                        <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">
                            {step === "PHONE_ENTRY" ? "Add Phone Number" : "Verify Phone Number"}
                        </h2>
                        <p className="text-[14px] text-zinc-500 mb-8 leading-relaxed font-medium">
                            {step === "PHONE_ENTRY"
                                ? "Link your phone number to continue using FirstDoer."
                                : `Enter the 4-digit code sent to +91 ${phoneNumber}.`}
                        </p>

                        {error && (
                            <div className="mb-6 p-3.5 bg-red-50 text-red-700 text-[13px] font-semibold rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {step === "PHONE_ENTRY" ? (
                                <motion.form key="phone-form" onSubmit={handleSendOtp} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                    <div className="mb-6">
                                        <label className="block text-[12px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                                            Mobile Number
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-zinc-500 font-semibold">+91</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={10}
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                                className="w-full h-14 pl-14 pr-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-900 font-bold text-lg focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none"
                                                placeholder="98765 43210"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || phoneNumber.length < 10}
                                        className="w-full h-14 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition hover:bg-[var(--color-primary)]/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[var(--color-primary)]/20"
                                    >
                                        {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : "Send Code"}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.form key="otp-form" onSubmit={handleVerifyOtp} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                    <div className="flex justify-center gap-3 mb-6" onPaste={handleOtpPaste}>
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={otpRefs.current[i]}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                disabled={isSubmitting}
                                                className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-2xl border-2 transition-all outline-none ${digit ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)]" : "border-zinc-200 bg-zinc-50 text-zinc-900"} focus:border-[var(--color-primary)] focus:bg-[var(--color-primary-subtle)] focus:ring-4 focus:ring-[var(--color-primary)]/10`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || otp.some((d) => !d)}
                                        className="w-full h-14 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition hover:bg-[var(--color-primary)]/90 active:scale-[0.98] shadow-md shadow-[var(--color-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed mb-5"
                                    >
                                        {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                                    </button>
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={timer > 0 || isSubmitting}
                                            className="text-[13px] font-bold text-zinc-500 hover:text-[var(--color-primary)] transition disabled:opacity-50"
                                        >
                                            {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive it? Resend"}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
        </div>
    );
};

export default RequirePhoneVerification;
