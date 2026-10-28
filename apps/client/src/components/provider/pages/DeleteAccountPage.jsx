import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import ProviderSettingsSidebar from "../components/ProviderSettingsSidebar";
import PerformerHeader from "../../Performer/components/PerformerHeader";
import { accountMainClass, accountMainStyle } from "../../common/account/AccountFlatNav";
import { useAuth } from "../../../contexts/AuthContext";
import { requestAccountDeletion as requestProviderDeletion } from "../services/api";
import { requestAccountDeletion as requestPerformerDeletion } from "../../Performer/services/api";

const LEAVE_REASONS = [
  "Found a better platform",
  "Too many fees or costs",
  "Not enough task opportunities",
  "Privacy or security concerns",
  "Technical issues or bugs",
  "Taking a long break",
  "Other reason",
];

const WARNINGS = [
  "Your account will be deactivated immediately",
  "You have 30 days to restore before permanent deletion",
  "Active tasks may be cancelled during deactivation",
  "Your portfolio, reviews, and profile data will be removed after 30 days",
];

const DeleteAccountPage = ({
  appType = "provider",
  settingsPath = "/provider/settings?tab=settings",
  activeTasksCount = "0",
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isPerformer = appType === "performer";

  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const displayName = user?.displayName || user?.username || user?.name || (isPerformer ? "Performer" : "Provider");
  const email = user?.email || "";
  const roleLabel = isPerformer ? "Performer" : "Provider";
  const planLabel = user?.subscriptionPlan || user?.plan || (isPerformer ? "Performer" : "Pro Plan");
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "—";

  const activeTasks = isPerformer ? "0" : activeTasksCount;

  const warnings = useMemo(
    () => [
      WARNINGS[0],
      WARNINGS[1],
      isPerformer
        ? "Ongoing task applications may be withdrawn"
        : `All ${activeTasks} active tasks may be cancelled`,
      WARNINGS[3],
    ],
    [activeTasks, isPerformer]
  );

  const progress = (step / 3) * 100;
  const requestDeletion = isPerformer ? requestPerformerDeletion : requestProviderDeletion;

  const handleClose = () => navigate(settingsPath);

  const handleDelete = async () => {
    setSubmitting(true);
    setError("");
    try {
      await requestDeletion(reason ? { reason } : {});
      logout();
      navigate("/", {
        replace: true,
        state: {
          message:
            "Your account has been deactivated. You can restore it within 30 days by signing in again.",
        },
      });
    } catch (err) {
      setError(err?.message || "Failed to schedule account deletion. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="mx-auto w-full max-w-xl">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className={`px-5 sm:px-6 ${step === 2 ? "pt-1" : "pt-4"}`}>
          <div className={`flex items-center justify-between ${step === 2 ? "mb-2" : "mb-3"}`}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep((s) => s - 1);
                }}
                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <span className="w-8" />
            )}
            <p className="text-xs font-bold text-gray-400">Step {step} of 3</p>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-rose-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className={`px-5 sm:px-6 ${
            step === 2 ? "pb-6 pt-0 sm:pb-8" : "py-6 sm:py-8"
          }`}
        >
          {step === 1 ? (
            <>
              <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                Deactivate Your Account?
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Your account will be deactivated immediately and scheduled for permanent deletion
                after 30 days. You can restore it anytime during that period by signing in again.
              </p>
              <ul className="mt-5 space-y-2.5">
                {warnings.map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50/70 px-3.5 py-3 text-sm font-semibold text-rose-700"
                  >
                    <X size={16} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-xl bg-rose-600 py-3 text-sm font-bold text-white transition hover:bg-rose-700"
                >
                  I Understand, Continue
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary-subtle)] py-3 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/10"
                >
                  Keep My Account
                </button>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                Why are you leaving?
              </h1>
              <p className="mt-2 text-sm text-gray-500">Your feedback helps us improve.</p>
              <div className="mt-5 space-y-2">
                {LEAVE_REASONS.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                      reason === option
                        ? "border-rose-300 bg-rose-50"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="leave-reason"
                      value={option}
                      checked={reason === option}
                      onChange={() => setReason(option)}
                      className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm font-semibold text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                disabled={!reason}
                onClick={() => setStep(3)}
                className="mt-6 w-full rounded-xl bg-rose-600 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                Final Confirmation
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                After confirming, your account will be deactivated and permanently deleted in 30
                days unless you restore it.
              </p>
              <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                  Account to deactivate
                </p>
                <p className="mt-1 text-base font-extrabold text-gray-900">{displayName}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-600">
                  {email || "No email on file"} · {roleLabel} · {planLabel}
                </p>
                <p className="mt-2 text-xs font-semibold text-gray-500">
                  Member since {memberSince}
                </p>
              </div>
              {error ? (
                <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>
              ) : null}
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleDelete}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  Deactivate Account
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleClose}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (isPerformer) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--color-surface)] pt-[80px] font-sans text-[var(--color-text)]">
        <PerformerHeader activePage="settings" />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">{content}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)] pt-[80px] font-sans text-[var(--color-text)]">
      <ProviderHeader activePage="home" />
      <div className="relative flex flex-1">
        <ProviderSettingsSidebar />
        <main
          className={`${accountMainClass} ${step === 2 ? "pb-8 pt-0 lg:pb-10" : ""}`}
          style={accountMainStyle}
        >
          {content}
        </main>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
