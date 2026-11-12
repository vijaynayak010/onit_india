import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Megaphone,
  Database,
  Code2,
  Video,
  GraduationCap,
  MoreHorizontal,
  Clock,
  Briefcase,
  Laptop,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import SelectCard from "../components/onboarding/SelectCard";
import { markPerformerOnboardingComplete } from "../utils/performerOnboardingStorage";
import {
  createTaskerProfile,
  listTaskCatalogDomains,
  updateTaskerProfile,
  applyReferralCode,
} from "../services/api";

const MotionDiv = motion.div;

const ROLES = [
  {
    id: "student",
    label: "Student",
    sublabel: "Currently studying",
    gradient: "from-sky-100 via-blue-50 to-indigo-100",
    Icon: GraduationCap,
  },
  {
    id: "freelancer",
    label: "Freelancer",
    sublabel: "Self-employed",
    gradient: "from-[#DFF7F6] via-teal-50 to-green-100",
    Icon: Laptop,
  },
  {
    id: "professional",
    label: "Professional",
    sublabel: "Employed full-time",
    gradient: "from-amber-100 via-orange-50 to-yellow-100",
    Icon: Briefcase,
  },
];

const TASK_OPTIONS = [
  { id: "design", value: "Design", label: "Design", icon: Palette },
  { id: "development", value: "Development", label: "Development", icon: Code2 },
  { id: "content-marketing", value: "Content & Marketing", label: "Content & Marketing", icon: Megaphone },
];

const AVAILABILITY_OPTIONS = [
  { id: "lt1", label: "Less than 1 hour" },
  { id: "1-3", label: "1 - 3 hours" },
  { id: "3-5", label: "3 - 5 hours" },
  { id: "gt5", label: "More than 5 hours" },
  { id: "other-time", label: "Other" },
];

const STEPS = {
  ROLE: "role",
  TASKS: "tasks",
  AVAILABILITY: "availability",
  REFERRAL: "referral",
};

const DOMAIN_ICON_MATCHERS = [
  { pattern: /design|ui|ux|graphic|brand/i, icon: Palette },
  { pattern: /content|writing|copy|marketing|social/i, icon: Megaphone },
  { pattern: /data|research|admin|operation|business/i, icon: Database },
  { pattern: /web|app|tech|development|software|api/i, icon: Code2 },
  { pattern: /video|editing|media/i, icon: Video },
  { pattern: /academic|teaching|tutor|knowledge|education/i, icon: GraduationCap },
];

const getDomainIcon = (label) =>
  DOMAIN_ICON_MATCHERS.find(({ pattern }) => pattern.test(label))?.icon || MoreHorizontal;

const normalizeDomainOptions = (domains) =>
  (Array.isArray(domains) ? domains : [])
    .map((domain) => {
      const label = String(domain?.name || domain?.title || domain?.label || domain || "").trim();
      if (!label) return null;
      return {
        id: domain?.slug || label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        value: label,
        label,
        icon: getDomainIcon(label),
      };
    })
    .filter(Boolean);

function RoleCard({ role, selected, onClick }) {
  const { label, sublabel, gradient, Icon } = role;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-1 flex-col overflow-hidden rounded-2xl border-2 bg-white transition ${
        selected
          ? "border-[#10605F] shadow-[0_0_0_1px_rgba(0,163,108,0.12)]"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {selected && (
        <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#10605F] text-white">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      <div className={`flex h-28 items-end justify-center bg-gradient-to-b ${gradient} px-2 pt-4`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm text-gray-700">
          <Icon size={28} strokeWidth={1.8} />
        </div>
      </div>
      <div className="px-2 py-3 text-center">
        <p className="text-[13px] font-bold text-gray-900">{label}</p>
        <p className={`mt-0.5 text-[10px] font-semibold ${selected ? "text-[#10605F]" : "text-gray-400"}`}>
          {sublabel}
        </p>
      </div>
    </button>
  );
}

const PerformerOnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || user?.sub;

  const [step, setStep] = useState(STEPS.ROLE);
  const [role, setRole] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [catalogOptions, setCatalogOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [referralCode, setReferralCode] = useState(() => localStorage.getItem("pending_referral_code") || "");
  const [referralStatus, setReferralStatus] = useState(null); // "success" | "error" | null
  const [referralMessage, setReferralMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    listTaskCatalogDomains({ launchOnly: false })
      .then((res) => {
        const options = normalizeDomainOptions(res?.data || res);
        if (mounted && options.length > 0) setCatalogOptions(options);
      })
      .catch((err) => {
        console.warn("[PerformerOnboarding] Failed to load task catalog domains:", err?.message || err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const taskOptions = useMemo(
    () => (catalogOptions.length > 0 ? catalogOptions : TASK_OPTIONS),
    [catalogOptions]
  );

  const finish = async () => {
    const selectedRole = ROLES.find((option) => option.id === role);
    const selectedAvailability = AVAILABILITY_OPTIONS.find((option) => option.id === availability);
    const preferredCategories = tasks.slice(0, 3);
    const payload = {
      profession: selectedRole?.label,
      dailyAvailability: selectedAvailability?.label,
      domain: preferredCategories[0],
      skills: preferredCategories,
      preferredCategories,
    };

    setSaving(true);
    try {
      await updateTaskerProfile(payload);
    } catch (err) {
      if (err?.status === 404 || err?.statusCode === 404) {
        try {
          await createTaskerProfile(payload);
        } catch (createErr) {
          setSaving(false);
          window.alert(createErr?.message || "Could not save onboarding details. Please try again.");
          return;
        }
      } else {
        setSaving(false);
        window.alert(err?.message || "Could not save onboarding details. Please try again.");
        return;
      }
    }
    markPerformerOnboardingComplete(userId);
    navigate("/performer/dashboard", { replace: true });
  };

  const handleApplyReferral = async () => {
    const code = referralCode.trim().toUpperCase();
    if (!code) return;
    setSaving(true);
    setReferralStatus(null);
    try {
      await applyReferralCode(code);
      try { localStorage.removeItem("pending_referral_code"); } catch {}
      setReferralStatus("success");
      setReferralMessage("Referral applied! Your friend will get credit for bringing you here.");
    } catch (err) {
      setReferralStatus("error");
      setReferralMessage(
        err?.response?.data?.message || err?.message || "Invalid or already used referral code."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    try { localStorage.removeItem("pending_referral_code"); } catch {}
    markPerformerOnboardingComplete(userId);
    navigate("/performer/dashboard", { replace: true });
  };

  const toggleTask = (value) => {
    setTasks((prev) => (prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]));
  };

  const canContinue =
    (step === STEPS.ROLE && role) ||
    (step === STEPS.TASKS && tasks.length > 0) ||
    (step === STEPS.AVAILABILITY && availability) ||
    step === STEPS.REFERRAL;

  const handleContinue = () => {
    if (saving) return;
    if (step === STEPS.ROLE) setStep(STEPS.TASKS);
    else if (step === STEPS.TASKS) setStep(STEPS.AVAILABILITY);
    else if (step === STEPS.AVAILABILITY) setStep(STEPS.REFERRAL);
    else if (step === STEPS.REFERRAL) finish();
  };

  const stepQuestion =
    step === STEPS.ROLE
      ? "Which best describes you?"
      : step === STEPS.TASKS
        ? "What kind of tasks can you do?"
        : step === STEPS.AVAILABILITY
          ? "How much time can you spend daily?"
          : "Got a referral code?";

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      {/* Skip */}
      <div className="px-5 pt-6">
        <button
          type="button"
          onClick={handleSkip}
          className="text-[14px] font-semibold text-gray-400 hover:text-gray-600"
        >
          Skip
        </button>
      </div>

      {/* Header */}
      <div className="px-5 pt-4 text-center">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">Tell us about yourself</h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] font-medium leading-relaxed text-gray-400">
          Answer a few quick questions to help us personalize your experience
        </p>
      </div>

      {/* Step content */}
      <div className="flex-1 px-5 py-8">
        <AnimatePresence mode="wait">
          <MotionDiv
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="mb-6 text-center text-[16px] font-bold text-gray-900">{stepQuestion}</h2>

            {step === STEPS.ROLE && (
              <div className="mx-auto flex max-w-md gap-2.5">
                {ROLES.map((r) => (
                  <RoleCard
                    key={r.id}
                    role={r}
                    selected={role === r.id}
                    onClick={() => setRole(r.id)}
                  />
                ))}
              </div>
            )}

            {step === STEPS.TASKS && (
              <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
                {taskOptions.map((opt) => {
                  const optionValue = opt.value ?? opt.label;
                  return (
                    <SelectCard
                      key={opt.id}
                      compact
                      selected={tasks.includes(optionValue)}
                      onClick={() => toggleTask(optionValue)}
                      icon={opt.icon}
                      label={opt.label}
                    />
                  );
                })}
              </div>
            )}

            {step === STEPS.AVAILABILITY && (
              <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <SelectCard
                    key={opt.id}
                    compact
                    selected={availability === opt.id}
                    onClick={() => setAvailability(opt.id)}
                    icon={Clock}
                    label={opt.label}
                  />
                ))}
              </div>
            )}

            {step === STEPS.REFERRAL && (
              <div className="mx-auto max-w-md space-y-5">
                {/* Illustration */}
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#EFFBFB] to-[#DFF7F6]">
                    <span className="text-4xl">🎁</span>
                  </div>
                </div>
                <p className="text-center text-[13px] font-medium leading-relaxed text-gray-400">
                  If someone referred you to FirstDoer, enter their code below. They'll earn a reward when you join!
                </p>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => {
                        setReferralCode(e.target.value.toUpperCase());
                        setReferralStatus(null);
                        setReferralMessage("");
                      }}
                      placeholder="e.g. FirstDoer-ABC-123456"
                      disabled={referralStatus === "success" || saving}
                      className="flex-1 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3.5 font-mono text-[15px] font-bold uppercase tracking-widest text-gray-900 outline-none transition focus:border-[#10605F] placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-300 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleApplyReferral}
                      disabled={!referralCode.trim() || referralStatus === "success" || saving}
                      className="rounded-2xl bg-[#10605F] px-5 py-3.5 text-[14px] font-bold text-white transition hover:bg-[#00925f] disabled:opacity-40"
                    >
                      {saving ? "…" : "Apply"}
                    </button>
                  </div>
                  {referralStatus === "success" && (
                    <div className="flex items-center gap-2 rounded-xl bg-[#EFFBFB] px-4 py-3 text-[13px] font-semibold text-[#10605F]">
                      <span>✓</span>
                      {referralMessage}
                    </div>
                  )}
                  {referralStatus === "error" && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
                      <span>✕</span>
                      {referralMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </MotionDiv>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <p className="mb-4 text-center text-[12px] font-medium text-gray-400">
          You can update this anytime.
        </p>
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || saving}
            className={`w-full rounded-full py-4 text-[15px] font-bold transition ${
              canContinue && !saving
                ? "bg-[#10605F] text-white shadow-md hover:bg-[#00925f]"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {saving ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>

    </div>
  );
};

export default PerformerOnboardingPage;
