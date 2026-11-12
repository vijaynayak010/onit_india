import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";

const ProviderFlowLayout = ({
  title,
  subtitle,
  children,
  backTo = "/provider/dashboard",
  onBack,
  maxWidth = "max-w-3xl",
  headerRight,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(backTo);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)] pt-[80px] font-sans text-[var(--color-text)]">
      <ProviderHeader activePage="home" />

      <main className={`mx-auto w-full flex-1 ${maxWidth} px-4 py-8 sm:px-6 lg:px-10 lg:py-10`}>
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
              Back
            </button>
            <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text)] sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1.5 max-w-2xl text-sm font-medium text-[var(--color-text-muted)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
        </div>
        {children}
      </main>
    </div>
  );
};

export default ProviderFlowLayout;
