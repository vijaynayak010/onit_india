import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Gift,
  Share2,
  Users,
  Loader2,
  Award,
  Globe,
  Smartphone,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { getMyReferralStats } from "../../services/api";

const PLAY_STORE_APP_LINK =
  "https://play.google.com/store/apps/details?id=com.onitapp.india&pcampaignid=web_share";

const ReferEarnView = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWebsite, setCopiedWebsite] = useState(false);
  const [copiedApp, setCopiedApp] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getMyReferralStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch referral stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const code = stats?.referralCode || stats?.code || "NOTAVAIL";
  const websiteLink =
    stats?.shareableLink ||
    (code !== "NOTAVAIL"
      ? `https://www.firstdoer.com/signup?ref=${code}`
      : "https://www.firstdoer.com/signup");
  const appLink = stats?.appLink || PLAY_STORE_APP_LINK;

  const copyToClipboard = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      setter(false);
    }
  };

  const getFullShareMessage = () => {
    return (
      `Join me on FirstDoer! Use my referral code: ${code}\n\n` +
      `🌐 Sign up on Website:\n${websiteLink}\n\n` +
      `📲 Download Android App:\n${appLink}`
    );
  };

  const handleShareAll = async () => {
    const shareText = getFullShareMessage();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join FirstDoer",
          text: shareText,
          url: websiteLink,
        });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    // Fallback: copy entire message to clipboard
    await copyToClipboard(shareText, setShareCopied);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getFullShareMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-[var(--color-primary)]">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest opacity-70">
          Loading referral stats...
        </p>
      </div>
    );
  }

  const successfulReferrals = stats?.successfulReferrals ?? stats?.totalReferrals ?? 0;
  const totalEarned = stats?.totalEarned ?? stats?.points?.referralWorthInr ?? 0;
  const nextMilestone = stats?.nextMilestone;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 font-sans">
      {/* ── Main Hero Card ── */}
      <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-subtle)] via-white to-white shadow-[var(--shadow-md)]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]">
              <Gift size={28} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-medium text-[var(--color-text)]">Refer & Earn Rewards</h3>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                Share your referral links. When a referred user signs up and completes their first task, you both unlock milestone credits and wallet rewards.
              </p>
            </div>
          </div>

          {/* Master Share Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleShareAll}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-95"
            >
              {shareCopied ? <Check size={18} strokeWidth={2.5} /> : <Share2 size={18} strokeWidth={2} />}
              {shareCopied ? "Invite Text Copied!" : "Share Invite"}
            </button>
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-2 rounded-xl bg-[#10605F] px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[#083B3A] active:scale-95"
            >
              <MessageCircle size={18} strokeWidth={2} />
              Share on WhatsApp
            </button>
          </div>

          {/* ── Links & Codes Grid ── */}
          <div className="mt-8 grid gap-4">
            {/* Referral Code Row */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
                Your Referral Code
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <code className="font-mono text-xl font-medium tracking-widest text-[var(--color-primary)]">
                  {code}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(code, setCopiedCode)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
                >
                  {copiedCode ? <Check size={14} className="text-[#10605F]" /> : <Copy size={14} />}
                  {copiedCode ? "Copied" : "Copy Code"}
                </button>
              </div>
            </div>

            {/* Website Signup Link Row */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <Globe size={15} className="text-[var(--color-primary)]" />
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
                  Website Signup Link
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-gray-700">
                  {websiteLink}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(websiteLink, setCopiedWebsite)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
                  >
                    {copiedWebsite ? <Check size={14} className="text-[#10605F]" /> : <Copy size={14} />}
                    {copiedWebsite ? "Copied" : "Copy Link"}
                  </button>
                  <a
                    href={websiteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-[var(--color-primary-subtle)] px-2.5 py-1.5 text-xs font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
                    title="Open Signup Link"
                  >
                    <ExternalLink size={13} />
                    Open
                  </a>
                </div>
              </div>
            </div>

            {/* Android App Link Row */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <Smartphone size={15} className="text-[#10605F]" />
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
                  Android App (Play Store) Link
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-gray-700">
                  {appLink}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(appLink, setCopiedApp)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
                  >
                    {copiedApp ? <Check size={14} className="text-[#10605F]" /> : <Copy size={14} />}
                    {copiedApp ? "Copied" : "Copy Link"}
                  </button>
                  <a
                    href={appLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-[#EFFBFB] px-2.5 py-1.5 text-xs font-bold text-[#10605F] transition hover:bg-[#083B3A] hover:text-white"
                    title="Open in Google Play"
                  >
                    <ExternalLink size={13} />
                    Play Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
          <Users className="mb-3 text-[var(--color-primary)]" size={24} strokeWidth={2} />
          <p className="text-2xl font-medium tabular-nums text-[var(--color-text)]">
            {successfulReferrals}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">
            Successful Referrals
          </p>
        </div>
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
          <Gift className="mb-3 text-[var(--color-primary)]" size={24} strokeWidth={2} />
          <p className="text-2xl font-medium tabular-nums text-[var(--color-text)]">
            ₹{Number(totalEarned).toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">
            Total Rewards Credited
          </p>
        </div>
      </div>

      {/* ── Milestone Card ── */}
      {nextMilestone && (
        <div className="rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary-subtle)]/10 p-6">
          <div className="flex items-center gap-3">
            <Award className="text-[var(--color-primary)]" size={20} />
            <p className="text-sm font-bold text-[var(--color-text)]">Next Campaign Milestone</p>
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Refer{" "}
            <span className="font-bold text-[var(--color-primary)]">
              {nextMilestone.referralsNeeded} more
            </span>{" "}
            user(s) to unlock ₹{nextMilestone.milestone?.rewardAmount || 0} in milestone rewards!
          </p>
        </div>
      )}

      <p className="text-center text-xs font-semibold text-[var(--color-text-subtle)]">
        Rewards are credited to your FirstDoer wallet upon referee qualification. Terms & conditions apply.
      </p>
    </div>
  );
};

export default ReferEarnView;
