import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Wallet,
  Star,
  Gift,
  TrendingUp,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CreditCard,
  Bell,
  Settings,
  ChevronRight,
  Zap,
  BarChart3,
  Ticket,
  ClipboardList,
  PlusCircle,
  ReceiptText,
  Building2,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  getProviderProfile,
  getWalletBalance,
  getMyReferralStats,
  listMyTasks,
} from "../../services/api";

// ─── Small stat chip ────────────────────────────────────────────────────────
function StatChip({ label, value, icon: Icon }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-white/60 py-3 px-2">
      {Icon && (
        <Icon size={15} strokeWidth={2.2} className="text-[#10605F]" />
      )}
      <p className="text-[15px] font-black text-gray-900">
        {value}
      </p>
      <p
        className="text-[10px] font-semibold"
        style={{ color: "rgba(0,100,60,0.6)" }}
      >
        {label}
      </p>
    </div>
  );
}

// ─── Section container ───────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="px-1 text-[11px] font-black uppercase tracking-widest text-[var(--color-text-subtle)]">
        {title}
      </p>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
        {children}
      </div>
    </div>
  );
}

// ─── Menu row ────────────────────────────────────────────────────────────────
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
      className="group flex w-full items-center gap-3 border-b border-[var(--color-border)] px-4 py-3.5 text-left last:border-b-0 transition hover:bg-[var(--color-border-subtle)]/40 active:scale-[0.99]"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: danger ? "#FEF2F2" : iconBg }}
      >
        <Icon size={17} strokeWidth={2.1} style={{ color: danger ? "#EF4444" : iconColor }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[14px] font-bold ${danger ? "text-red-500" : "text-[var(--color-text)]"}`}>
          {label}
        </p>
        {sublabel && (
          <p className="mt-0.5 truncate text-[11px] font-medium text-[var(--color-text-subtle)]">
            {sublabel}
          </p>
        )}
      </div>
      {badge && (
        <span className="shrink-0 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-black text-white">
          {badge}
        </span>
      )}
      <ChevronRight
        size={15}
        className="shrink-0 text-[var(--color-text-subtle)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-text-muted)]"
      />
    </button>
  );
}

// ─── Wallet balance card ─────────────────────────────────────────────────────
function WalletCard({ balance, onTabChange }) {
  return (
    <button
      type="button"
      onClick={() => onTabChange("wallet")}
      className="group relative w-full overflow-hidden rounded-2xl p-5 text-left transition active:scale-[0.99]"
      style={{ background: "linear-gradient(135deg, #10605F 0%, #007A50 100%)" }}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-10 bg-white" />
      <div className="pointer-events-none absolute -bottom-8 -right-4 h-36 w-36 rounded-full opacity-[0.07] bg-white" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={16} strokeWidth={2.2} className="text-[#7EDEDD]" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#7EDEDD]">
              Wallet Balance
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[#7EDEDD] transition group-hover:translate-x-0.5"
          />
        </div>
        <p className="mt-2 text-3xl font-black text-white">
          ₹{(balance || 0).toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-[#7EDEDD]">
          Tap to add funds, withdraw, or view history
        </p>
      </div>
    </button>
  );
}

// ─── Rating badge ─────────────────────────────────────────────────────────────
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
      {total > 0 && (
        <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
          ({total})
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
const ProviderAccountHubView = ({ onTabChange: _onTabChange }) => {
  const navigate = useNavigate();

  const goTab = (tab) => {
    if (_onTabChange) _onTabChange(tab);
    else navigate(`/provider/settings?tab=${tab}`);
  };

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [referralStats, setReferralStats] = useState(null);
  const [taskCounts, setTaskCounts] = useState({ total: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const displayName =
    user?.name || user?.displayName || user?.username || user?.email?.split("@")[0] || "Provider";
  const email = user?.email || "";
  const avatar = user?.avatar || user?.profilePicUrl || null;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [profileRes, walletRes, referralRes, tasksRes] = await Promise.allSettled([
          getProviderProfile(),
          getWalletBalance(),
          getMyReferralStats(),
          listMyTasks({ limit: 1 }),
        ]);
        if (cancelled) return;
        if (profileRes.status === "fulfilled")
          setProfile(profileRes.value?.data || profileRes.value);
        if (walletRes.status === "fulfilled") {
          const w = walletRes.value?.data || walletRes.value;
          setWalletBalance(Number(w?.balance ?? w?.availableBalance ?? 0));
        }
        if (referralRes.status === "fulfilled")
          setReferralStats(referralRes.value?.data || referralRes.value);
        if (tasksRes.status === "fulfilled") {
          const t = tasksRes.value?.data || tasksRes.value;
          const items = Array.isArray(t) ? t : (t?.tasks ?? t?.data ?? []);
          const meta = t?.meta ?? t?.pagination ?? {};
          setTaskCounts({
            total: meta?.total ?? items.length,
            active: items.filter((x) => x.status === "active" || x.status === "open").length,
            completed: items.filter((x) => x.status === "completed").length,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rating = profile?.averageRating ?? profile?.rating ?? 0;
  const reviewCount = profile?.totalReviews ?? profile?.reviewCount ?? 0;
  const referralCount = referralStats?.totalReferrals ?? referralStats?.referralCount ?? 0;
  const referralCode = referralStats?.code ?? referralStats?.referralCode ?? "";
  const totalPosted = taskCounts.total;
  const totalSpent = profile?.totalSpent ?? 0;
  const isVerified = profile?.isVerified ?? profile?.kycVerified ?? false;

  return (
    <div className="w-full font-sans text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-5xl pb-16 pt-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
        {/* ── Left column: hero + wallet ── */}
        <div className="w-full xl:w-[380px] xl:shrink-0">
        {/* ── Hero profile card ── */}
        <div
          className="relative mb-4 overflow-hidden rounded-3xl px-5 pb-5 pt-7"
          style={{ background: "linear-gradient(160deg, #F0FDF7 0%, #D1FAE5 100%)" }}
        >
          {/* decorative rings */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#29ADAC]/30/60" />
          <div className="pointer-events-none absolute -bottom-12 left-0 h-36 w-36 rounded-full border border-[#29ADAC]/20/50" />

          {/* avatar + name */}
          <div className="relative flex items-center gap-4">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#29ADAC]/30"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DFF7F6] text-xl font-black text-[#10605F] ring-2 ring-[#29ADAC]/30">
                  {initials}
                </div>
              )}
              {isVerified && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#10605F] ring-2 ring-white">
                  <BadgeCheck size={11} className="text-white" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-black text-gray-900">{displayName}</p>
              <p className="truncate text-[12px] font-medium text-[#10605F]/70">{email}</p>
              <div className="mt-1.5">
                <RatingBadge rating={rating} total={reviewCount} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => goTab("profile")}
              className="shrink-0 rounded-xl bg-[#10605F] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#083B3A]"
            >
              Edit
            </button>
          </div>

          {/* stats row */}
          {loading ? (
            <div className="mt-5 flex justify-center">
              <Loader2 size={18} className="animate-spin text-[#29ADAC]" />
            </div>
          ) : (
            <div className="mt-5 flex gap-2">
              <StatChip label="Posted" value={totalPosted} icon={ClipboardList} />
              <StatChip
                label="Spent"
                value={`₹${(totalSpent / 1000).toFixed(1)}K`}
                icon={TrendingUp}
              />
              <StatChip label="Referrals" value={referralCount} icon={Gift} />
            </div>
          )}

          {/* referral code pill */}
          {referralCode && (
            <button
              type="button"
              onClick={() => goTab("refer")}
              className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#DFF7F6]/80 px-4 py-2.5 transition hover:bg-[#DFF7F6]"
            >
              <div className="flex items-center gap-2">
                <Gift size={14} className="text-[#10605F]" />
                <span className="text-[11px] font-semibold text-[#10605F]">Your referral code</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="font-mono text-[13px] font-black tracking-widest text-gray-900">
                  {referralCode}
                </code>
                <ChevronRight size={13} className="text-[#29ADAC]" />
              </div>
            </button>
          )}
        </div>

        {/* ── Wallet card ── */}
        <div className="mb-4">
          <WalletCard balance={walletBalance} onTabChange={goTab} />
        </div>
        </div>{/* end left column */}

        {/* ── Right column: menu sections ── */}
        <div className="min-w-0 flex-1">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* ── Account ── */}
            <Section title="Account">
              <MenuRow
                icon={User}
                label="My Profile"
                sublabel="Name, company, contact details"
                onClick={() => goTab("profile")}
              />
              <MenuRow
                icon={Building2}
                label="Organization"
                sublabel="Company name and details"
                iconBg="#EFF6FF"
                iconColor="#3B82F6"
                onClick={() => goTab("profile")}
              />
              <MenuRow
                icon={Bell}
                label="Notifications"
                sublabel="Alerts for tasks, payments, reviews"
                iconBg="#FFF7ED"
                iconColor="#F97316"
                onClick={() => goTab("settings")}
              />
              <MenuRow
                icon={Settings}
                label="Settings"
                sublabel="Security, preferences, account"
                iconBg="#F5F3FF"
                iconColor="#8B5CF6"
                onClick={() => goTab("settings")}
              />
            </Section>

            {/* ── Finance ── */}
            <Section title="Finance">
              <MenuRow
                icon={Wallet}
                label="Wallet"
                sublabel="Balance and add funds"
                onClick={() => goTab("wallet")}
              />
              <MenuRow
                icon={BarChart3}
                label="Transaction History"
                sublabel="All payments and credits"
                iconBg="#F0FDF4"
                iconColor="#16A34A"
                onClick={() => goTab("transactions")}
              />
              <MenuRow
                icon={CreditCard}
                label="Bank Details"
                sublabel="Linked payout accounts"
                iconBg="#EFF6FF"
                iconColor="#3B82F6"
                onClick={() => goTab("banks")}
              />
              <MenuRow
                icon={ReceiptText}
                label="Subscription Plan"
                sublabel="Manage your plan and billing"
                iconBg="#FDF4FF"
                iconColor="#A855F7"
                onClick={() => goTab("subscription")}
              />
            </Section>

            {/* ── Tasks ── */}
            <Section title="Tasks">
              <MenuRow
                icon={PlusCircle}
                label="Post a Task"
                sublabel="Create a new task for performers"
                iconBg="#ECFDF5"
                iconColor="#059669"
                onClick={() => navigate("/provider/post-task")}
              />
              <MenuRow
                icon={Zap}
                label="Active Tasks"
                sublabel="Tasks currently in progress"
                iconBg="#FFFBEB"
                iconColor="#D97706"
                onClick={() => goTab("all_tasks")}
              />
              <MenuRow
                icon={CheckCircle2}
                label="Completed Tasks"
                sublabel="Finished and closed tasks"
                onClick={() => goTab("all_tasks")}
              />
              <MenuRow
                icon={FileText}
                label="All Tasks"
                sublabel="Complete task history"
                iconBg="#EFF6FF"
                iconColor="#3B82F6"
                onClick={() => goTab("all_tasks")}
              />
            </Section>

            {/* ── Ratings & Insights ── */}
            <Section title="Ratings & Insights">
              <MenuRow
                icon={Star}
                label="Ratings Received"
                sublabel={
                  reviewCount > 0
                    ? `${reviewCount} reviews · ${rating.toFixed(1)} avg`
                    : "No reviews yet"
                }
                iconBg="#FFFBEB"
                iconColor="#F59E0B"
                onClick={() => goTab("ratings")}
              />
              <MenuRow
                icon={ShieldCheck}
                label="Reviews Given"
                sublabel="Feedback you left for performers"
                iconBg="#EFF6FF"
                iconColor="#3B82F6"
                onClick={() => goTab("reviews")}
              />
              <MenuRow
                icon={TrendingUp}
                label="Provider Insights"
                sublabel="Task activity and performance"
                iconBg="#F0FDF4"
                iconColor="#16A34A"
                onClick={() => goTab("insights")}
              />
            </Section>

            {/* ── Refer & Rewards ── */}
            <Section title="Refer & Rewards">
              <MenuRow
                icon={Gift}
                label="Refer & Earn"
                sublabel={
                  referralCount > 0
                    ? `${referralCount} referrals made`
                    : "Invite friends, earn rewards"
                }
                badge={referralCount > 0 ? String(referralCount) : undefined}
                iconBg="#ECFDF5"
                iconColor="#059669"
                onClick={() => goTab("refer")}
              />
              <MenuRow
                icon={Ticket}
                label="My Vouchers"
                sublabel="Discount codes and offers"
                iconBg="#FDF4FF"
                iconColor="#A855F7"
                onClick={() => goTab("wallet")}
              />
            </Section>
          </div>
        )}
        </div>{/* end right column */}
        </div>{/* end flex row */}
      </div>
    </div>
  );
};

export default ProviderAccountHubView;
