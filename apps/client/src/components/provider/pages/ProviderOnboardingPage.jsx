import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  markProviderOnboardingComplete,
  isProviderOnboardingComplete,
} from "../utils/providerOnboardingStorage";
import {
  PostTaskIllustration,
  BestMatchesIllustration,
  TrackPayIllustration,
} from "../components/onboarding/ProviderOnboardingIllustrations";
import { applyReferralCode } from "../services/api";

const SLIDES = [
  {
    id: "post-task",
    title: "Post Your Task",
    subtitle: "Tell us your need. We'll match the right people.",
    Illustration: PostTaskIllustration,
  },
  {
    id: "best-matches",
    title: "Get the Best Matches",
    subtitle: "Connect with trusted performers matched to your needs.",
    Illustration: BestMatchesIllustration,
  },
  {
    id: "track-pay",
    title: "Track & Pay Securely",
    subtitle:
      "Chat, review work, and release payment only when you're fully satisfied.",
    Illustration: TrackPayIllustration,
  },
];

const ProviderOnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || user?.sub;
  const [index, setIndex] = useState(0);
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState(() => localStorage.getItem("pending_referral_code") || "");
  const [isApplying, setIsApplying] = useState(false);
  const [referralError, setReferralError] = useState(null);
  const [referralSuccess, setReferralSuccess] = useState(false);

  useEffect(() => {
    if (isProviderOnboardingComplete(userId)) {
      navigate("/provider/dashboard", { replace: true });
    }
  }, [userId, navigate]);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  const { Illustration } = slide;

  const finish = () => {
    try { localStorage.removeItem("pending_referral_code"); } catch {}
    markProviderOnboardingComplete(userId);
    navigate("/provider/dashboard", { replace: true });
  };

  const goNext = () => {
    if (isLast) {
      setShowReferral(true);
      return;
    }
    setIndex((i) => i + 1);
  };

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) return;
    setIsApplying(true);
    setReferralError(null);
    try {
      await applyReferralCode(referralCode.trim());
      try { localStorage.removeItem("pending_referral_code"); } catch {}
      setReferralSuccess(true);
      setTimeout(finish, 800);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Invalid referral code.";
      setReferralError(msg);
    } finally {
      setIsApplying(false);
    }
  };

  const goBack = () => {
    if (index === 0) {
      navigate(-1);
      return;
    }
    setIndex((i) => i - 1);
  };

  if (showReferral) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F8] p-4 font-sans">
        <div className="relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] bg-white px-8 pb-10 pt-12 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] text-center">
          <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-gray-900">Have a referral code?</h1>
          <p className="mx-auto mt-3 max-w-[300px] text-[14px] font-medium leading-relaxed text-gray-500">
            Enter it to unlock rewards for you and the person who invited you.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => { setReferralCode(e.target.value.toUpperCase()); setReferralError(null); }}
              placeholder="Enter code e.g. ABCD1234"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm font-bold uppercase tracking-widest text-gray-800 outline-none focus:border-[#10605F] focus:ring-2 focus:ring-[#10605F]/20"
            />
            {referralError && <p className="text-xs font-semibold text-rose-600">{referralError}</p>}
            {referralSuccess && <p className="text-xs font-semibold text-[#10605F]">Code applied!</p>}
            <button
              type="button"
              onClick={handleApplyReferral}
              disabled={isApplying || !referralCode.trim() || referralSuccess}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10605F] py-3 text-sm font-bold text-white transition hover:bg-[#008f5d] disabled:opacity-50"
            >
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Apply Code
            </button>
            <button
              type="button"
              onClick={finish}
              className="mt-1 text-[14px] font-bold text-gray-500 transition hover:text-gray-700"
            >
              Skip, no code
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F6F8] p-4 font-sans">
      <div className="relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
        <button
          type="button"
          onClick={goBack}
          className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-[#10605F] transition hover:bg-white/80"
          aria-label="Go back"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col"
          >
            <Illustration />

            <div className="flex flex-1 flex-col px-8 pb-8 pt-6 text-center">
              <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-gray-900">
                {slide.title}
              </h1>
              <p className="mx-auto mt-3 max-w-[300px] text-[14px] font-medium leading-relaxed text-gray-500">
                {slide.subtitle}
              </p>

              <div className="mt-auto flex flex-col gap-8 pt-10">
                <div className="flex items-center justify-center gap-2">
                  {SLIDES.map((s, i) => (
                    <span
                      key={s.id}
                      className={`h-2 rounded-full transition-all ${
                        i === index
                          ? "w-5 bg-gray-900"
                          : "w-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={finish}
                    className="text-[15px] font-bold text-gray-800 transition hover:text-gray-600"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className={`inline-flex items-center gap-1 text-[15px] font-bold transition ${
                      isLast
                        ? "text-[#10605F] hover:text-[#008f5d]"
                        : "text-gray-900 hover:text-gray-700"
                    }`}
                  >
                    {isLast ? "Get Started" : "Next"}
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProviderOnboardingPage;
