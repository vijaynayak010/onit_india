import React, { useState, useEffect } from "react";
import {
  Award,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Gift,
  HelpCircle,
  Info,
  Loader2,
  LockKeyhole,
  Share2,
  Users,
  Globe,
  Smartphone,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import { useAuth } from "../../../contexts/AuthContext";
import { getReferralDashboard, getWalletBalance } from "../services/api";

const PLAY_STORE_APP_LINK = "https://play.google.com/store/apps/details?id=com.onitapp.india&pcampaignid=web_share";

const formatRewardLabel = (reward) => {
  if (reward?.rewardLabel) return reward.rewardLabel;
  if (reward?.rewardItem) return reward.rewardItem;
  const amount = Number(reward?.rewardAmount || 0).toLocaleString("en-IN");
  return reward?.rewardType === "wallet_credit"
    ? `₹${amount} wallet credit`
    : `${amount} points`;
};

const titleCase = (value) => String(value || "")
  .split("_")
  .filter(Boolean)
  .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(" ");

const PerformerReferPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refUrlCopied, setRefUrlCopied] = useState(false);
  const [copiedApp, setCopiedApp] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchReferralDetails = async () => {
      try {
        setLoading(true);
        // Referral analytics and wallet balance are independent, so fetch them
        // together. The referral dashboard itself is one consolidated request.
        const [statsRes, walletResult] = await Promise.all([
          getReferralDashboard(),
          getWalletBalance().catch(() => null),
        ]);
        setStats(statsRes?.data || statsRes);

        const w = walletResult?.data || walletResult;
        if (w && (w.availableBalance !== undefined || w.balance !== undefined)) {
          setWalletBalance(Number(w.availableBalance ?? w.balance) || 0);
        }
      } catch (err) {
        console.error("Failed to load referral stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralDetails();
  }, []);

  const referralCode = stats?.code || stats?.referralCode || `FirstDoer-${user?.name?.slice(0, 3).toUpperCase() || "REF"}-${user?.id?.slice(-6).toUpperCase() || "PERF"}`;
  const websiteUrl = stats?.shareableLink || `https://www.firstdoer.com/signup?ref=${referralCode}`;
  const appLink = stats?.appLink || PLAY_STORE_APP_LINK;

  const getFullShareMessage = () => {
    return (
      `Join me on FirstDoer! Use my referral code: ${referralCode}\n\n` +
      `🌐 Sign up on Website:\n${websiteUrl}\n\n` +
      `📲 Download Android App:\n${appLink}`
    );
  };

  const handleShareAll = async () => {
    const text = getFullShareMessage();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join FirstDoer",
          text,
          url: websiteUrl,
        });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {}
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getFullShareMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const copyAppUrl = async () => {
    try {
      await navigator.clipboard.writeText(appLink);
      setCopiedApp(true);
      setTimeout(() => setCopiedApp(false), 2000);
    } catch {
      setCopiedApp(false);
    }
  };
  const summary = stats?.summary || {};
  const points = stats?.points || {};
  const totalReferrals = Number(summary.totalReferrals || 0);
  const successfulReferrals = Number(summary.successfulReferrals || 0);
  const pendingReferrals = Number(summary.pendingReferrals || 0);
  const totalEarned = Number(points.referralWorthInr || 0);
  const nextMilestone = stats?.nextMilestone;
  const unlockedRewards = Array.isArray(stats?.rewards?.unlocked) ? stats.rewards.unlocked : [];
  const lockedRewards = Array.isArray(stats?.rewards?.locked) ? stats.rewards.locked : [];
  const rewards = [...unlockedRewards, ...lockedRewards]
    .sort((a, b) => Number(a.referralCount || 0) - Number(b.referralCount || 0));
  const activity = Array.isArray(stats?.activity) ? stats.activity : [];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl);
      setRefUrlCopied(true);
      setTimeout(() => setRefUrlCopied(false), 2000);
    } catch {
      setRefUrlCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-[93px] font-sans text-[var(--color-text)]">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
            <PerformerPageHeader
              title="Refer & Earn"
              subtitle="Invite fellow performers to join FirstDoer and earn wallet credits when they start tasks"
              backTo="/performer/account"
            />

            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-[#10605F]">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-70">Loading referral stats...</p>
              </div>
            ) : (
              <div className="grid gap-5">

                {/* ── Hero banner ── */}
                <div
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
                  style={{ background: "linear-gradient(135deg, #10605F 0%, #007A50 100%)" }}
                >
                  {/* decorative blobs */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
                  <div className="pointer-events-none absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-white/[0.06]" />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                        <Gift size={20} strokeWidth={2.2} className="text-white" />
                      </div>
                      <h3 className="text-lg font-medium text-white">Invite & Earn</h3>
                    </div>
                    <p className="mb-6 text-[13px] font-medium text-[#EFFBFB]/80 max-w-lg">
                      When a friend you invite completes their first verified task, you both get wallet credit instantly.
                    </p>

                    {/* Quick Share Buttons */}
                    <div className="mb-5 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleShareAll}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-black text-[#083B3A] shadow-sm transition hover:bg-[#EFFBFB] active:scale-95"
                      >
                        {shareCopied ? <Check size={14} strokeWidth={3} /> : <Share2 size={14} strokeWidth={2.5} />}
                        {shareCopied ? "Invite Text Copied!" : "Share Invite"}
                      </button>
                      <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D1210]/40 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#0D1210]/60 active:scale-95"
                      >
                        <MessageCircle size={14} strokeWidth={2.5} />
                        Share on WhatsApp
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* Referral code */}
                      <div>
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-[#7EDEDD]">Your referral code</p>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 backdrop-blur-sm">
                          <code className="min-w-0 flex-1 truncate font-mono text-[14px] font-black tracking-widest text-white">{referralCode}</code>
                          <button
                            type="button"
                            onClick={copyCode}
                            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[#10605F] transition hover:bg-[#EFFBFB]"
                          >
                            {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.5} />}
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      {/* Website link */}
                      <div>
                        <div className="mb-1.5 flex items-center gap-1">
                          <Globe size={11} className="text-[#7EDEDD]" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#7EDEDD]">Website Link</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 backdrop-blur-sm">
                          <span className="min-w-0 flex-1 truncate font-mono text-[11px] font-semibold text-[#EFFBFB]/80">{websiteUrl}</span>
                          <button
                            type="button"
                            onClick={copyUrl}
                            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[#10605F] transition hover:bg-[#EFFBFB]"
                          >
                            {refUrlCopied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.5} />}
                            {refUrlCopied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      {/* Android App Link */}
                      <div>
                        <div className="mb-1.5 flex items-center gap-1">
                          <Smartphone size={11} className="text-[#7EDEDD]" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#7EDEDD]">Android App Link</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 backdrop-blur-sm">
                          <span className="min-w-0 flex-1 truncate font-mono text-[11px] font-semibold text-[#EFFBFB]/80">{appLink}</span>
                          <button
                            type="button"
                            onClick={copyAppUrl}
                            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[#10605F] transition hover:bg-[#EFFBFB]"
                          >
                            {copiedApp ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.5} />}
                            {copiedApp ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Stats strip ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    { icon: Users, color: "text-sky-500", bg: "bg-sky-50", value: totalReferrals, label: "Total" },
                    { icon: CheckCircle2, color: "text-[#10605F]", bg: "bg-[#EFFBFB]", value: successfulReferrals, label: "Successful" },
                    { icon: Clock3, color: "text-amber-500", bg: "bg-amber-50", value: pendingReferrals, label: "Pending" },
                    { icon: Gift, color: "text-[#10605F]", bg: "bg-[#EFFBFB]", value: `₹${totalEarned.toLocaleString()}`, label: "Earned" },
                    { icon: Award, color: "text-purple-500", bg: "bg-purple-50", value: `₹${walletBalance.toLocaleString()}`, label: "Wallet" },
                  ].map(({ icon: Icon, color, bg, value, label }) => (
                    <div key={label} className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                        <Icon size={16} strokeWidth={2.2} className={color} />
                      </div>
                      <p className="text-[22px] font-medium tabular-nums text-gray-900 leading-none">{value}</p>
                      <p className="text-[11px] font-semibold text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Next Milestone Tracking from live campaigns */}
                {nextMilestone && (
                  <div className="rounded-[var(--radius-2xl)] border border-dashed border-[#10605F]/30 bg-[#EFFBFB]/20 p-6 shadow-[var(--shadow-xs)]">
                    <div className="flex items-center gap-3">
                      <Award className="text-[#10605F]" size={20} />
                      <p className="text-sm font-bold text-gray-900">Next Campaign Milestone</p>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-600">
                      Refer <span className="font-bold text-[#10605F]">{nextMilestone.referralsNeeded} more</span> performer(s) to earn ₹{nextMilestone.milestone?.rewardAmount || 0} extra credit!
                    </p>
                  </div>
                )}

                {rewards.length > 0 && (
                  <section className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Referral Rewards</h3>
                        <p className="mt-1 text-xs font-semibold text-gray-500">Your milestone rewards and their current status.</p>
                      </div>
                      <div className="rounded-full bg-[#EFFBFB] px-3 py-1.5 text-xs font-bold text-[#10605F]">
                        {unlockedRewards.length} unlocked
                      </div>
                    </div>

                    <div className="mt-5 divide-y divide-gray-100">
                      {rewards.map((reward) => {
                        const unlocked = Boolean(reward.isUnlocked) || reward.status === "unlocked";
                        const fulfillmentStatus = titleCase(reward.fulfillment?.status);
                        return (
                          <div key={reward.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${unlocked ? "bg-[#EFFBFB] text-[#10605F]" : "bg-gray-100 text-gray-500"}`}>
                              {unlocked ? <CheckCircle2 size={20} /> : <LockKeyhole size={19} />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-gray-900">{formatRewardLabel(reward)}</p>
                              <p className="mt-1 text-xs font-semibold text-gray-500">
                                {unlocked
                                  ? `${fulfillmentStatus || "Unlocked"} · unlocked at ${reward.referralCount} successful referral${Number(reward.referralCount) === 1 ? "" : "s"}`
                                  : `${reward.referralsNeeded} more referral${Number(reward.referralsNeeded) === 1 ? "" : "s"} needed`}
                              </p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${unlocked ? "bg-[#EFFBFB] text-[#10605F]" : "bg-gray-100 text-gray-500"}`}>
                              {unlocked ? "UNLOCKED" : "LOCKED"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                <section className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Referral Activity</h3>
                      <p className="mt-1 text-xs font-semibold text-gray-500">Status of your most recent referrals.</p>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{activity.length} shown</span>
                  </div>

                  {activity.length > 0 ? (
                    <div className="mt-5 divide-y divide-gray-100">
                      {activity.map((item) => {
                        const completed = item.status === "success";
                        return (
                          <div key={item.id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black ${completed ? "bg-[#DFF7F6] text-[#10605F]" : "bg-amber-100 text-amber-700"}`}>
                              {item.initials || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">{item.name || item.email || "Referred user"}</p>
                              <p className="mt-0.5 text-xs font-semibold text-gray-500">{item.activityText || (completed ? "Completed first task" : "Waiting for first task")}</p>
                            </div>
                            {completed && Number(item.pointsEarned || 0) > 0 && (
                              <span className="text-xs font-bold text-[#10605F]">+{item.pointsEarned} pts</span>
                            )}
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${completed ? "bg-[#EFFBFB] text-[#10605F]" : "bg-amber-50 text-amber-700"}`}>
                              {item.statusLabel || (completed ? "Completed" : "Pending")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl bg-gray-50 px-4 py-8 text-center text-sm font-semibold text-gray-500">
                      No referrals yet. Share your code to start earning rewards.
                    </div>
                  )}
                </section>

                {/* Step Process Timeline */}
                <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
                  <h3 className="text-base font-medium text-gray-900 mb-6 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#10605F]" strokeWidth={2} />
                    How Referrals Work
                  </h3>
                  <div className="grid gap-6 md:grid-cols-3 relative">
                    {/* Step 1 */}
                    <div className="flex flex-col gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFF7F6] text-sm font-black text-[#10605F]">
                        1
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mt-2">Send Invitation</h4>
                      <p className="text-xs font-semibold leading-relaxed text-gray-500">
                        Share your custom code or link with other skilled performers (cleaning workers, repairers, technicians).
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFF7F6] text-sm font-black text-[#10605F]">
                        2
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mt-2">They Complete a Task</h4>
                      <p className="text-xs font-semibold leading-relaxed text-gray-500">
                        Once they register, pass KYC verification, and successfully complete their first customer booking.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFF7F6] text-sm font-black text-[#10605F]">
                        3
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mt-2">Get Paid Cash Credit</h4>
                      <p className="text-xs font-semibold leading-relaxed text-gray-500">
                        Milestone rewards are instantly credited to your wallet as claimable cash. No caps or limits on referrals!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campaign Fine Print */}
                <div className="rounded-[var(--radius-2xl)] border border-dashed border-gray-200 p-5 bg-gray-50/50 flex gap-3 items-start">
                  <Info size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="text-xs font-semibold leading-relaxed text-gray-400">
                    Referral earnings are subjected to FirstDoer's promotional terms. Referred accounts must be unique, verified tasker accounts. Artificial or fraudulent registrations will lead to immediate reward forfeiture and permanent account suspension.
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
    </div>
  );
};

export default PerformerReferPage;
