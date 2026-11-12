import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Wallet,
  Star,
  Gift,
  TrendingUp,
  CheckCircle2,
  Bookmark,
  FileText,
  ShieldCheck,
  CreditCard,
  Settings,
  ChevronRight,
  Trophy,
  Zap,
  BarChart3,
  Ticket,
  Loader2,
  Award,
  ClipboardList,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getMyTaskerProfile,
  getWalletBalance,
  getMyReferralStats,
  getMyAnalyticsSummary,
} from "../services/api";

// ─── Small stat chip ───────────────────────────────────────────────────────
function StatChip({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-1 min-w-0 flex-col items-center gap-0.5 rounded-2xl border border-[#29ADAC]/20 bg-white/70 py-3 px-2 transition hover:bg-white/90">
      {Icon && <Icon size={15} strokeWidth={2.2} className="shrink-0 text-[#10605F]" />}
      <p className="truncate text-[15px] font-medium text-gray-900">{value}</p>
      <p className="truncate text-[10px] font-semibold text-gray-500 whitespace-nowrap">{label}</p>
    </div>
  );
}

// ─── Section container ─────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="space-y-1.5">
      <p className="px-1 text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-subtle)]">
        {title}
      </p>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
        {children}
      </div>
    </div>
  );
}

// ─── Menu row ──────────────────────────────────────────────────────────────
function MenuRow({
  icon: Icon,
  label,
  sublabel,
  badge,
  onClick,
  iconBg = "#ECFDF5",
  iconColor = "#059669",
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 border-b border-[var(--color-border)] px-4 py-3.5 text-left last:border-b-0 transition duration-150 hover:bg-slate-50/80 active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-inset"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition duration-150 group-hover:scale-105"
        style={{ background: danger ? "#FEF2F2" : iconBg }}
      >
        <Icon size={17} strokeWidth={2.1} style={{ color: danger ? "#EF4444" : iconColor }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[13.5px] font-bold tracking-tight ${danger ? "text-red-500" : "text-[var(--color-text)]"}`}>
          {label}
        </p>
        {sublabel && (
          <p className="mt-0.5 truncate text-[11px] font-medium text-[var(--color-text-subtle)]">
            {sublabel}
          </p>
        )}
      </div>
      {badge && (
        <span className="shrink-0 rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 text-[10px] font-black text-white shadow-xs">
          {badge}
        </span>
      )}
      <ChevronRight
        size={15}
        className="shrink-0 text-[var(--color-text-subtle)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]"
      />
    </button>
  );
}

// ─── Wallet balance card ────────────────────────────────────────────────────
function WalletCard({ balance, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl p-5 text-left transition duration-200 hover:shadow-lg hover:brightness-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#29ADAC]"
      style={{ background: "linear-gradient(135deg, #10605F 0%, #007A50 100%)" }}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-10" style={{ background: "#fff" }} />
      <div className="pointer-events-none absolute -bottom-8 -right-4 h-36 w-36 rounded-full opacity-[0.07]" style={{ background: "#fff" }} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={16} strokeWidth={2.2} className="text-[#7EDEDD]" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#7EDEDD]">Wallet Balance</p>
          </div>
          <ChevronRight size={16} className="text-[#7EDEDD] transition group-hover:translate-x-0.5" />
        </div>
        <p className="mt-2 text-3xl font-medium text-white">
          ₹{(balance || 0).toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-[#7EDEDD]">Tap to view transactions & withdraw</p>
      </div>
    </button>
  );
}

// ─── Rating badge ───────────────────────────────────────────────────────────
function RatingBadge({ rating, total }) {
  const stars = Math.round((rating || 0) * 2) / 2;
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          strokeWidth={1.8}
          style={{
            fill: s <= stars ? "#F59E0B" : "none",
            color: s <= stars ? "#F59E0B" : "var(--color-border)",
          }}
        />
      ))}
      <span className="text-[12px] font-bold text-[var(--color-text-muted)]">
        {rating ? rating.toFixed(1) : "—"}
      </span>
      {total > 0 && <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">({total})</span>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
const PerformerAccountHubPage = () => {
  const navigate = useNavigate();
  const navigateFromAccount = (path) =>
    navigate(path, { state: { from: "/performer/account", fromLabel: "Back to Account" } });
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [referralStats, setReferralStats] = useState(null);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const displayName = user?.name || user?.displayName || "Performer";
  const email = user?.email || "";
  const avatar = user?.avatar || user?.profilePicture || null;
  const initials = displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [profileRes, walletRes, referralRes, analyticsRes] = await Promise.allSettled([
          getMyTaskerProfile(),
          getWalletBalance(),
          getMyReferralStats(),
          getMyAnalyticsSummary(),
        ]);
        if (cancelled) return;
        if (profileRes.status === "fulfilled") setProfile(profileRes.value?.data || profileRes.value);
        if (walletRes.status === "fulfilled") {
          const w = walletRes.value?.data || walletRes.value;
          setWalletBalance(Number(w?.balance ?? w?.availableBalance ?? 0));
        }
        if (referralRes.status === "fulfilled") setReferralStats(referralRes.value?.data || referralRes.value);
        if (analyticsRes.status === "fulfilled") setAnalyticsSummary(analyticsRes.value?.data || analyticsRes.value);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const rating = profile?.averageRating ?? profile?.rating ?? 0;
  const reviewCount = profile?.totalReviews ?? profile?.reviewCount ?? 0;
  const completedTasks = analyticsSummary?.completedTasks ?? profile?.completedTasksCount ?? 0;
  const totalEarnings = analyticsSummary?.totalEarnings ?? 0;
  const referralCount = referralStats?.totalReferrals ?? referralStats?.referralCount ?? 0;
  const referralCode = referralStats?.code ?? referralStats?.referralCode ?? "";

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)] lg:h-screen lg:overflow-hidden">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-4 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:h-[calc(100vh-93px)] lg:overflow-hidden lg:px-7 lg:py-6">
        <div className="mx-auto flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6 lg:h-full max-w-7xl">
          {/* ── Stationary Column: Hero Profile Card + Wallet Card ── */}
          <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 lg:h-full lg:overflow-y-auto lg:overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-4">
            {/* Hero Profile Card */}
            <div
              className="relative overflow-hidden rounded-3xl border border-[#29ADAC]/20 px-5 pb-5 pt-6 shadow-xs"
              style={{ background: "linear-gradient(160deg, #F0FDF7 0%, #E6FAF2 60%, #D1FAE5 100%)" }}
            >
              {/* decorative ring blobs */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border-[20px] border-[#29ADAC]/20/60" />
              <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full border-[16px] border-[#29ADAC]/20/40" />

              {/* avatar + name */}
              <div className="relative flex items-center gap-4">
                <div className="relative shrink-0">
                  {avatar ? (
                    <img src={avatar} alt={displayName} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white shadow-md" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10605F] text-xl font-medium text-white shadow-md ring-2 ring-white">
                      {initials}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#29ADAC] ring-2 ring-white shadow-xs">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] font-medium text-gray-900">{displayName}</p>
                  <p className="truncate text-[12px] font-medium text-gray-500">{email}</p>
                  <div className="mt-1.5">
                    <RatingBadge rating={rating} total={reviewCount} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigateFromAccount("/performer/profile")}
                  aria-label="Edit Performer Profile"
                  className="shrink-0 rounded-xl border border-[#29ADAC]/30 bg-white px-3 py-1.5 text-[11px] font-bold text-[#10605F] shadow-xs transition hover:bg-[#EFFBFB] hover:border-[#29ADAC]/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#29ADAC]"
                >
                  Edit
                </button>
              </div>

              {/* stats row */}
              {loading ? (
                <div className="mt-5 flex justify-center py-2">
                  <Loader2 size={18} className="animate-spin text-[#29ADAC]" />
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <StatChip label="Completed" value={completedTasks} icon={CheckCircle2} />
                  <StatChip label="Earned" value={`₹${(totalEarnings / 1000).toFixed(1)}K`} icon={TrendingUp} />
                  <StatChip label="Referrals" value={referralCount} icon={Gift} />
                </div>
              )}

              {/* referral code pill */}
              {referralCode && (
                <button
                  type="button"
                  onClick={() => navigateFromAccount("/performer/refer")}
                  className="mt-3.5 flex w-full items-center justify-between rounded-xl border border-[#29ADAC]/30 bg-white/70 px-4 py-2.5 transition hover:bg-white hover:border-[#29ADAC]/40 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#29ADAC]"
                >
                  <div className="flex items-center gap-2">
                    <Gift size={14} className="text-[#10605F]" />
                    <span className="text-[11px] font-semibold text-gray-600">Your referral code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-[13px] font-black tracking-widest text-gray-900">{referralCode}</code>
                    <ChevronRight size={13} className="text-[#29ADAC]" />
                  </div>
                </button>
              )}
            </div>

            {/* Wallet Card */}
            <div>
              <WalletCard balance={walletBalance} onClick={() => navigateFromAccount("/performer/wallet")} />
            </div>
          </div>

          {/* ── Scrollable Right Column: Menu Sections ── */}
          <div className="w-full min-w-0 flex-1 lg:h-full lg:overflow-y-auto lg:overflow-x-hidden pr-0 lg:pr-3 pb-24 lg:pb-32 [scrollbar-width:thin] [scrollbar-color:rgba(16,96,95,0.25)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-[#29ADAC]/40 [&::-webkit-scrollbar-thumb]:rounded-full">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* ── Account ── */}
                <Section title="Account">
                  <MenuRow
                    icon={User}
                    label="My Profile"
                    sublabel="Name, bio, skills, portfolio"
                    onClick={() => navigateFromAccount("/performer/profile")}
                  />
                  <MenuRow
                    icon={ShieldCheck}
                    label="KYC Verification"
                    sublabel="Identity documents & status"
                    iconBg="#EFF6FF"
                    iconColor="#3B82F6"
                    onClick={() => navigateFromAccount("/performer/kyc")}
                  />
                  <MenuRow
                    icon={Settings}
                    label="Settings"
                    sublabel="Password, security, preferences"
                    iconBg="#F5F3FF"
                    iconColor="#8B5CF6"
                    onClick={() => navigateFromAccount("/performer/settings")}
                  />
                </Section>

                {/* ── Finance ── */}
                <Section title="Finance">
                  <MenuRow
                    icon={Wallet}
                    label="Wallet & Withdrawals"
                    sublabel="Balance, payouts, history"
                    onClick={() => navigateFromAccount("/performer/wallet")}
                  />
                  <MenuRow
                    icon={TrendingUp}
                    label="Earnings"
                    sublabel="Income summary & analytics"
                    iconBg="#FFF7ED"
                    iconColor="#F97316"
                    onClick={() => navigateFromAccount("/performer/earnings")}
                  />
                  <MenuRow
                    icon={CreditCard}
                    label="Bank Details"
                    sublabel="Linked payout accounts"
                    iconBg="#EFF6FF"
                    iconColor="#3B82F6"
                    onClick={() => navigateFromAccount("/performer/banks")}
                  />
                  <MenuRow
                    icon={BarChart3}
                    label="Transaction History"
                    sublabel="All credits and debits"
                    iconBg="#F0FDF4"
                    iconColor="#16A34A"
                    onClick={() => navigateFromAccount("/performer/wallet/transactions")}
                  />
                </Section>

                {/* ── Tasks ── */}
                <Section title="Tasks">
                  <MenuRow
                    icon={Zap}
                    label="Active Tasks"
                    sublabel="In-progress work"
                    iconBg="#FFFBEB"
                    iconColor="#D97706"
                    onClick={() => navigateFromAccount("/performer/my-tasks?tab=active")}
                  />
                  <MenuRow
                    icon={CheckCircle2}
                    label="Completed Tasks"
                    sublabel="Your finished work"
                    onClick={() => navigateFromAccount("/performer/my-tasks?tab=completed")}
                  />
                  <MenuRow
                    icon={Bookmark}
                    label="Saved Tasks"
                    sublabel="Tasks bookmarked for later"
                    iconBg="#FDF4FF"
                    iconColor="#A855F7"
                    onClick={() => navigateFromAccount("/performer/saved-tasks")}
                  />
                  <MenuRow
                    icon={FileText}
                    label="Applications"
                    sublabel="Tasks you've applied for"
                    iconBg="#EFF6FF"
                    iconColor="#3B82F6"
                    onClick={() => navigateFromAccount("/performer/my-tasks?tab=pending")}
                  />
                  <MenuRow
                    icon={ClipboardList}
                    label="All Tasks"
                    sublabel="Complete history"
                    iconBg="#F0FDF4"
                    iconColor="#16A34A"
                    onClick={() => navigateFromAccount("/performer/all-tasks")}
                  />
                </Section>

                {/* ── Ratings & Growth ── */}
                <Section title="Ratings & Growth">
                  <MenuRow
                    icon={Star}
                    label="My Ratings"
                    sublabel={reviewCount > 0 ? `${reviewCount} reviews · ${rating.toFixed(1)} avg` : "No reviews yet"}
                    iconBg="#FFFBEB"
                    iconColor="#F59E0B"
                    onClick={() => navigateFromAccount("/performer/ratings")}
                  />
                  <MenuRow
                    icon={Trophy}
                    label="Leaderboard"
                    sublabel="See how you rank"
                    iconBg="#FFF7ED"
                    iconColor="#F97316"
                    onClick={() => navigateFromAccount("/performer/leaderboard")}
                  />
                  <MenuRow
                    icon={Award}
                    label="Growth"
                    sublabel="Skills, resources, daily quizzes"
                    iconBg="#F5F3FF"
                    iconColor="#8B5CF6"
                    onClick={() => navigateFromAccount("/performer/growth")}
                  />
                </Section>

                {/* ── Refer & Rewards ── */}
                <Section title="Refer & Rewards">
                  <MenuRow
                    icon={Gift}
                    label="Refer & Earn"
                    sublabel={referralCount > 0 ? `${referralCount} referrals made` : "Invite friends, earn rewards"}
                    badge={referralCount > 0 ? String(referralCount) : undefined}
                    iconBg="#ECFDF5"
                    iconColor="#059669"
                    onClick={() => navigateFromAccount("/performer/refer")}
                  />
                  <MenuRow
                    icon={Ticket}
                    label="My Vouchers"
                    sublabel="Discount codes and offers"
                    iconBg="#FDF4FF"
                    iconColor="#A855F7"
                    onClick={() => navigateFromAccount("/performer/vouchers")}
                  />
                </Section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformerAccountHubPage;
