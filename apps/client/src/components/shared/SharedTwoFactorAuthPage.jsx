import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Shield } from "lucide-react";
import PerformerHeader from "../Performer/components/PerformerHeader";
import PerformerPageHeader from "../Performer/components/PerformerPageHeader";
import ProviderHeader from "../provider/components/ProviderHeader";

const SharedTwoFactorAuthPage = ({ backRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPerformer = location.pathname.startsWith("/performer");

  const resolvedBack = location.state?.from || backRoute || (isPerformer ? "/performer/account" : "/provider/dashboard");
  const backLabel = resolvedBack.includes("account") ? "Back to Account Hub" : resolvedBack.includes("settings") ? "Back to Settings" : "Back";

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      console.log("2FA Code submitted:", fullCode);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <div className={`min-h-screen bg-[var(--color-surface)] font-sans text-[var(--color-text)] ${isPerformer ? "pt-[93px]" : ""}`}>
      {isPerformer ? <PerformerHeader activePage="account" /> : <ProviderHeader activePage="settings" />}

      <main className={`pb-16 ${isPerformer ? "w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8" : "pt-[80px]"}`}>
        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">
          {isPerformer ? (
            <PerformerPageHeader
              title="Two-Factor Authentication"
              subtitle="Confirm it's you by entering the one-time code sent to your registered email or phone."
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
                <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Two-factor authentication</h1>
                <p className="mt-1 max-w-xl text-sm font-medium text-[var(--color-text-muted)]">
                  Confirm it&apos;s you by entering the one-time code we send to your registered email or phone.
                </p>
              </header>
            </>
          )}

          <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-start lg:gap-14 xl:gap-20">
            <div className="flex w-full flex-1 justify-center lg:justify-end">
              <img
                src="/assets/amico.png"
                alt="Illustration for two-factor authentication verification"
                className="w-full max-w-[400px] object-contain sm:max-w-[450px]"
              />
            </div>

            <div className="flex w-full flex-1 justify-center lg:justify-start">
              <div className="w-full max-w-md rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-md)] sm:p-10">
                <h2 className="mb-2 text-center text-lg font-medium text-[var(--color-text)] sm:text-xl">Enter verification code</h2>
                <p className="mb-8 text-center text-sm font-medium text-[var(--color-text-muted)]">Enter the 4-digit code sent to your email</p>

                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                  <div className="mb-4 flex justify-center gap-3 sm:gap-4">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="h-14 w-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center text-2xl font-medium text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 sm:h-[58px] sm:w-[52px]"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>

                  <p className="mb-8 text-center text-xs font-medium text-[var(--color-text-subtle)]">Code expires in 30 minutes.</p>

                  <button
                    type="submit"
                    disabled={!isCodeComplete}
                    className={`mb-4 w-full rounded-xl py-3.5 text-sm font-bold transition active:scale-[0.99] ${
                      isCodeComplete
                        ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-hover)]"
                        : "cursor-not-allowed bg-[var(--color-border-subtle)] text-[var(--color-text-subtle)]"
                    }`}
                  >
                    Continue
                  </button>

                  <div className="text-center">
                    {timeLeft > 0 ? (
                      <span className="text-xs font-medium text-[var(--color-text-subtle)]">Resend code in {timeLeft}s</span>
                    ) : (
                      <button type="button" onClick={() => setTimeLeft(30)} className="text-xs font-bold text-[var(--color-primary)] transition hover:underline">
                        Resend code
                      </button>
                    )}
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

export default SharedTwoFactorAuthPage;
