import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  HelpCircle,
  Shield,
  FileText,
  Trash2,
  SwitchCamera,
  LogOut,
  User,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import { getMyKycStatus } from "../services/api";
import { useAuth } from "../../../contexts/AuthContext";

const ChevronRight = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const SettingRow = ({ icon: Icon, label, sublabel, hasArrow, onClick }) => (
  <div
    onClick={onClick}
    className="group flex cursor-pointer items-center justify-between border-b border-[var(--color-border)] px-4 py-4 last:border-0 hover:bg-[var(--color-primary-subtle)]/40 transition"
  >
    <div className="flex items-center gap-4 min-w-0 pr-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] transition group-hover:scale-105">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <span className="text-[14.5px] font-bold text-[var(--color-text)] block truncate">{label}</span>
        {sublabel && (
          <span className="text-[12px] font-medium text-[var(--color-text-subtle)] block truncate mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
    {hasArrow && (
      <ChevronRight
        size={18}
        className="text-[var(--color-text-subtle)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)] shrink-0"
      />
    )}
  </div>
);

const SettingRowDanger = ({ icon: Icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="group flex cursor-pointer items-center justify-between border-b border-[var(--color-border)] px-4 py-4 last:border-0 hover:bg-rose-50/50 transition"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition group-hover:bg-rose-100 group-hover:scale-105">
        <Icon size={20} strokeWidth={2} />
      </div>
      <span className="text-[14.5px] font-bold text-rose-600">{label}</span>
    </div>
    <ChevronRight size={18} className="text-rose-300 transition group-hover:translate-x-0.5 group-hover:text-rose-500" />
  </div>
);

const PerformerSettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [kycStatus, setKycStatus] = useState("NOT_SUBMITTED");

  const displayName = user?.name || user?.displayName || "Performer";
  const email = user?.email || "";
  const avatar = user?.avatar || user?.profilePicture || null;
  const initials = displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  useEffect(() => {
    getMyKycStatus()
      .then((res) => setKycStatus(res.kycStatus))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <PerformerPageHeader
            title="Settings"
            subtitle="Security, support, and account controls — all in one place"
            backTo="/performer/account"
            backLabel="Back to Account Hub"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-10"
            >
              {/* Left Column - Profile & Verification Summary */}
              <div className="w-full lg:w-[360px] shrink-0 space-y-6">
                {/* Profile Summary Card */}
                <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] transition hover:shadow-md">
                  <div className="flex items-center gap-4">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={displayName}
                        className="h-14 w-14 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00A36C] text-lg font-black text-white shadow-sm">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-bold text-[var(--color-text)]">{displayName}</p>
                      <p className="truncate text-xs font-medium text-[var(--color-text-muted)]">{email}</p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        Active Performer
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/performer/profile", {
                        state: { from: "/performer/settings", fromLabel: "Back to Settings" },
                      })
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white py-2.5 text-xs font-bold text-[var(--color-text)] shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
                  >
                    <User size={15} className="text-[var(--color-primary)]" />
                    Edit Public Profile
                  </button>
                </div>

                {/* Account Verification Card */}
                <div>
                  <h2 className="mb-3 ml-1 text-base font-bold text-[var(--color-text)]">Account verification</h2>
                  <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] transition hover:shadow-md">
                    <div className="flex flex-col items-center text-center pb-6 border-b border-[var(--color-border)]/60">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] mb-4 shadow-inner">
                        <ShieldCheck size={32} strokeWidth={2} />
                      </div>
                      <h3 className="text-base font-extrabold text-[var(--color-text)]">Verification Status</h3>
                      <p
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wider ${
                          kycStatus === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : kycStatus === "PENDING"
                            ? "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse"
                            : kycStatus === "REJECTED"
                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                            : "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}
                      >
                        {kycStatus?.replace("_", " ") || "NOT SUBMITTED"}
                      </p>
                    </div>
                    <div className="pt-6">
                      <p className="text-xs text-[var(--color-text-muted)] font-medium leading-relaxed mb-5 text-center">
                        Verify your identity with secure KYC to claim priority tasks, higher payout limits, and boost your credibility score.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/performer/kyc", {
                            state: { from: "/performer/settings", fromLabel: "Back to Settings" },
                          })
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all text-white font-bold text-sm rounded-xl shadow-xs cursor-pointer"
                      >
                        Manage Verification
                        <ChevronRight size={14} className="text-white/80" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Dedicated Settings Categories */}
              <div className="flex-1 grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* 1. SECURITY & AUTHENTICATION */}
                <div className="md:col-span-2">
                  <h2 className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Security & Authentication
                  </h2>
                  <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:shadow-md">
                    <SettingRow
                      icon={Lock}
                      label="Change Password"
                      sublabel="Update your account password regularly for security"
                      hasArrow
                      onClick={() =>
                        navigate("/performer/change-password", {
                          state: { from: "/performer/settings", fromLabel: "Back to Settings" },
                        })
                      }
                    />
                    <SettingRow
                      icon={ShieldCheck}
                      label="Two-Factor Authentication (2FA)"
                      sublabel="Add extra protection with one-time verification codes"
                      hasArrow
                      onClick={() =>
                        navigate("/performer/two-factor-auth", {
                          state: { from: "/performer/settings", fromLabel: "Back to Settings" },
                        })
                      }
                    />
                  </div>
                </div>

                {/* 2. SUPPORT & POLICIES */}
                <div className="md:col-span-2">
                  <h2 className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Support & Policies
                  </h2>
                  <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:shadow-md">
                    <SettingRow
                      icon={HelpCircle}
                      label="Help Center & FAQs"
                      sublabel="Guides, platform rules, and support assistance"
                      hasArrow
                      onClick={() => navigate("/help")}
                    />
                    <SettingRow
                      icon={Shield}
                      label="Privacy Policy"
                      sublabel="How we protect your personal and payment data"
                      hasArrow
                      onClick={() => navigate("/privacy-policy")}
                    />
                    <SettingRow
                      icon={FileText}
                      label="Terms of Service"
                      sublabel="User agreement and platform service terms"
                      hasArrow
                      onClick={() => navigate("/terms-and-conditions")}
                    />
                  </div>
                </div>

                {/* 3. ACCOUNT ACTIONS (DANGER ZONE) */}
                <div className="md:col-span-2">
                  <h2 className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Account Actions
                  </h2>
                  <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:shadow-md">
                    <SettingRow
                      icon={SwitchCamera}
                      label="Switch to Provider Account"
                      sublabel="Post tasks and hire skilled performers as a client"
                      hasArrow
                      onClick={() =>
                        navigate("/performer/switch-to-provider", {
                          state: { from: "/performer/settings", fromLabel: "Back to Settings" },
                        })
                      }
                    />
                    <SettingRowDanger
                      icon={LogOut}
                      label="Sign Out"
                      onClick={async () => {
                        try {
                          await logout();
                        } finally {
                          navigate("/");
                        }
                      }}
                    />
                    <SettingRowDanger
                      icon={Trash2}
                      label="Delete Account"
                      onClick={() => navigate("/performer/delete-account")}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PerformerSettingsPage;
