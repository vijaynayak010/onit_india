import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import PerformerHeader from "../Performer/components/PerformerHeader";
import PerformerPageHeader from "../Performer/components/PerformerPageHeader";
import ProviderHeader from "../provider/components/ProviderHeader";

const SharedChangePasswordPage = ({ backRoute, forgotPasswordRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPerformer = location.pathname.startsWith("/performer");

  const resolvedBack = location.state?.from || backRoute || (isPerformer ? "/performer/account" : "/provider/dashboard");
  const backLabel = resolvedBack.includes("account") ? "Back to Account Hub" : resolvedBack.includes("settings") ? "Back to Settings" : "Back";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password change submitted");
  };

  return (
    <div className={`min-h-screen bg-[var(--color-surface)] font-sans text-[var(--color-text)] ${isPerformer ? "pt-[93px]" : ""}`}>
      {isPerformer ? <PerformerHeader activePage="account" /> : <ProviderHeader activePage="settings" />}

      <main className={`pb-16 ${isPerformer ? "w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8" : "pt-[80px]"}`}>
        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">
          {isPerformer ? (
            <PerformerPageHeader
              title="Change Password"
              subtitle="Use a strong password you don't use elsewhere. You'll stay signed in on this device after updating."
              backTo={resolvedBack}
              backLabel={backLabel}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate(resolvedBack)}
                className="group mb-8 flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
              >
                <ChevronLeft className="h-5 w-5 transition group-hover:-translate-x-0.5" strokeWidth={2} />
                {backLabel}
              </button>

              <header className="mb-10 border-b border-[var(--color-border)] pb-8">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Change password</h1>
                <p className="mt-1 max-w-xl text-sm font-medium text-[var(--color-text-muted)]">
                  Use a strong password you don&apos;t use elsewhere. You&apos;ll stay signed in on this device after updating.
                </p>
              </header>
            </>
          )}

          <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-start lg:gap-14 xl:gap-20">
            <div className="flex w-full flex-1 justify-center lg:justify-end">
              <img
                src="/assets/chnage_pass.png"
                alt="Illustration for secure password change"
                className="w-full max-w-[380px] object-contain sm:max-w-[420px]"
              />
            </div>

            <div className="flex w-full flex-1 justify-center lg:justify-start">
              <div className="w-full max-w-md rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-md)] sm:p-8">
                <h2 className="mb-6 text-center text-lg font-bold text-[var(--color-text)] sm:text-xl">Update password</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="ml-0.5 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
                      Current password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="new-password" className="ml-0.5 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
                      New password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter a new password"
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="ml-0.5 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
                      Confirm new password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.99]"
                  >
                    Change password
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate(forgotPasswordRoute)}
                      className="text-xs font-bold text-[var(--color-primary)] transition hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedChangePasswordPage;
