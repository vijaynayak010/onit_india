import React from "react";
import ProviderHeader from "./ProviderHeader";

const ProviderAccountPageLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-[var(--dash-canvas)] pt-[80px] font-sans text-[var(--dash-text)]">
    <ProviderHeader activePage="home" />

    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="mb-6 border-b border-[var(--dash-border)] pb-4 sm:mb-8 sm:pb-6">
        <h1 className="dash-page-title text-[var(--dash-text)]">{title}</h1>
        {subtitle ? (
          <p className="dash-secondary mt-1">{subtitle}</p>
        ) : null}
      </header>

      <div className="w-full min-w-0">{children}</div>
    </main>
  </div>
);

export default ProviderAccountPageLayout;
