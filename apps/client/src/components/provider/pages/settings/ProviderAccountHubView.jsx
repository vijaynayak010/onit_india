import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Wallet,
  Star,
  Gift,
  TrendingUp,
  FileText,
  ShieldCheck,
  CreditCard,
  Settings,
  ChevronRight,
  BarChart3,
  ClipboardList,
  ReceiptText,
  BadgeCheck,
  Bookmark,
  Layers,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  getProviderProfile,
  getWalletBalance,
  getMyReferralStats,
  listMyTasks,
} from "../../services/api";
import { DashboardCard, LoadingSkeleton, SecondaryButton } from "../../../shared/dashboard";

function StatChip({ label, value, icon: IconComponent }) {
  return (
    <div className="flex flex-1 min-w-0 flex-col items-center gap-1 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-2 py-3">
      {IconComponent ? (
        <IconComponent size={15} strokeWidth={2} className="text-[var(--dash-primary-700)]" aria-hidden="true" />
      ) : null}
      <p className="dash-num truncate text-[16px] font-bold text-[var(--dash-text)]">{value}</p>
      <p className="truncate text-[11px] font-medium text-[var(--dash-text-secondary)]">{label}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-2.5">
      <h2 className="dash-section-title px-0.5 text-[var(--dash-text)]">{title}</h2>
      <DashboardCard className="overflow-hidden">{children}</DashboardCard>
    </section>
  );
}

function MenuRow({
  icon,
  label,
  sublabel,
  badge,
  onClick,
  danger = false,
}) {
  const IconComponent = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 border-b border-[var(--dash-border)] px-4 py-3.5 text-left last:border-b-0 transition hover:bg-[var(--dash-canvas)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--dash-primary-700)]"
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          danger
            ? "bg-rose-50 text-rose-600"
            : "bg-[var(--dash-active-bg)] text-[var(--dash-primary-700)]"
        }`}
      >
        <IconComponent size={17} strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[14px] font-semibold ${danger ? "text-rose-600" : "text-[var(--dash-text)]"}`}>
          {label}
        </p>
        {sublabel ? (
          <p className="mt-0.5 truncate text-[12px] text-[var(--dash-text-secondary)]">{sublabel}</p>
        ) : null}
      </div>
      {badge ? (
        <span className="dash-num shrink-0 rounded-full bg-[var(--dash-primary-700)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
      <ChevronRight
        size={15}
        className="shrink-0 text-[var(--dash-text-secondary)] transition group-hover:translate-x-0.5 group-hover:text-[var(--dash-primary-700)]"
        aria-hidden="true"
      />
    </button>
  );
};

function WalletCard({ balance, onTabChange }) {
  return (
    <button
      type="button"
      onClick={() => onTabChange("wallet")}
      className="group w-full rounded-2xl border border-[var(--dash-primary-800)]/20 bg-gradient-to-br from-[#083B3A] via-[#10605F] to-[#1B8887] p-5 text-left shadow-[var(--shadow-sm)] transition hover:brightness-[1.03] active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)] focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={16} strokeWidth={2} className="text-[#7EDEDD]" aria-hidden="true" />
          <p className="dash-overline text-[#7EDEDD]">Wallet Balance</p>
        </div>
        <ChevronRight
          size={16}
          className="text-[#7EDEDD] transition group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
      <p className="dash-kpi mt-2 text-white">
        ₹{(balance || 0).toLocaleString("en-IN")}
      </p>
      <p className="mt-1 text-[12px] font-medium text-white/80">
        Add funds, withdraw, or view payment history
      </p>
    </button>
  );
}

function RatingBadge({ rating, total }) {
  const stars = Math.round((rating || 0) * 2) / 2;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          strokeWidth={1.8}
          style={{
            fill: s <= stars ? "#F59E0B" : "none",
            color: s <= stars ? "#F59E0B" : "var(--dash-border)",
          }}
          aria-hidden="true"
        />
      ))}
      <span className="dash-num ml-1 text-[12px] font-semibold text-[var(--dash-text-secondary)]">
        {rating ? rating.toFixed(1) : "—"}
      </span>
      {total > 0 ? (
        <span className="dash-num text-[11px] text-[var(--dash-text-secondary)]">({total})</span>
      ) : null}
    </div>
  );
}

const ProviderAccountHubView = ({ onTabChange: _onTabChange, onEditProfile }) => {
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
    <div className="w-full space-y-6 font-sans text-[var(--dash-text)]">
      {/* A. Page Heading */}
      <header className="border-b border-[var(--dash-border)] pb-4">
        <h1 className="dash-page-title text-[var(--dash-text)]">Account Overview</h1>
        <p className="dash-secondary mt-1">
          Manage your profile, organization, finances and preferences.
        </p>
      </header>

      {/* B. Compact Profile Summary Card */}
      <DashboardCard className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-14 w-14 rounded-2xl border border-[var(--dash-border)] object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--dash-active-bg)] text-lg font-semibold text-[var(--dash-primary-800)]">
                  {initials}
                </div>
              )}
              {isVerified ? (
                <span
                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--dash-primary-700)] ring-2 ring-white"
                  title="Verified Provider"
                >
                  <BadgeCheck size={11} className="text-white" aria-hidden="true" />
                </span>
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-[16px] font-semibold text-[var(--dash-text)]">{displayName}</p>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--dash-active-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--dash-primary-800)]">
                    Verified
                  </span>
                ) : null}
              </div>
              {email ? (
                <p className="truncate text-[13px] text-[var(--dash-text-secondary)]">{email}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {loading ? (
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-[58px] w-20 animate-pulse rounded-xl bg-[var(--dash-canvas)]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <StatChip label="Posted" value={totalPosted} icon={ClipboardList} />
                <StatChip
                  label="Total Spent"
                  value={`₹${Number(totalSpent || 0).toLocaleString("en-IN")}`}
                  icon={TrendingUp}
                />
                <StatChip label="Referrals" value={referralCount} icon={Gift} />
              </div>
            )}

            <SecondaryButton
              size="sm"
              onClick={() => (onEditProfile ? onEditProfile() : goTab("profile"))}
            >
              Edit Profile
            </SecondaryButton>
          </div>
        </div>
      </DashboardCard>

      {/* C. Balanced Two-Column Account Content */}
      {loading ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
            {/* Column 1: Account (2) + Finance (4) = 6 items */}
            <div className="space-y-6">
              <Section title="Account">
                <MenuRow
                  icon={User}
                  label="My Profile"
                  sublabel="Personal info, contact details, bio, and organization"
                  onClick={() => goTab("profile")}
                />
                <MenuRow
                  icon={Settings}
                  label="Security & Settings"
                  sublabel="Password, 2FA, notifications, and account preferences"
                  onClick={() => goTab("settings")}
                />
              </Section>

              <Section title="Finance">
                <MenuRow
                  icon={Wallet}
                  label="Wallet"
                  sublabel="Balance, add funds, and withdrawals"
                  badge={`₹${(walletBalance || 0).toLocaleString("en-IN")}`}
                  onClick={() => goTab("wallet")}
                />
                <MenuRow
                  icon={BarChart3}
                  label="Transaction History"
                  sublabel="All payments, escrow, and credits"
                  onClick={() => goTab("transactions")}
                />
                <MenuRow
                  icon={CreditCard}
                  label="Bank Details"
                  sublabel="Linked payout accounts"
                  onClick={() => goTab("banks")}
                />
                <MenuRow
                  icon={ReceiptText}
                  label="Subscription Plan"
                  sublabel="Manage your plan and billing"
                  onClick={() => goTab("subscription")}
                />
              </Section>

              <Section title="Referrals">
                <MenuRow
                  icon={Gift}
                  label="Refer & Earn"
                  sublabel={
                    referralCode
                      ? `Code: ${referralCode}${referralCount > 0 ? ` · ${referralCount} referrals` : ""}`
                      : referralCount > 0
                        ? `${referralCount} referrals made`
                        : "Invite colleagues and earn rewards"
                  }
                  badge={referralCount > 0 ? String(referralCount) : undefined}
                  onClick={() => goTab("refer")}
                />
              </Section>
            </div>

            {/* Column 2: Tasks & Performance = 6 items */}
            <div>
              <Section title="Tasks & Performance">
                <MenuRow
                  icon={FileText}
                  label="All Tasks"
                  sublabel="Active, completed, and complete task history"
                  onClick={() => navigate("/provider/my-tasks")}
                />
                <MenuRow
                  icon={Layers}
                  label="Saved Templates"
                  sublabel="Reusable task blueprints and categories"
                  onClick={() => navigate("/provider/task-templates")}
                />
                <MenuRow
                  icon={Bookmark}
                  label="Saved Performers"
                  sublabel="Bookmarked talent and shortlisted pros"
                  onClick={() => navigate("/provider/saved-performers")}
                />
                <MenuRow
                  icon={Star}
                  label="Ratings Received"
                  sublabel={
                    reviewCount > 0
                      ? `${reviewCount} reviews · ${rating.toFixed(1)} avg`
                      : "No reviews yet"
                  }
                  onClick={() => goTab("ratings")}
                />
                <MenuRow
                  icon={ShieldCheck}
                  label="Reviews Given"
                  sublabel="Feedback you left for performers"
                  onClick={() => goTab("reviews")}
                />
                <MenuRow
                  icon={TrendingUp}
                  label="Provider Insights"
                  sublabel="Task activity and performance"
                  onClick={() => goTab("insights")}
                />
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderAccountHubView;
