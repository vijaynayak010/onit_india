import React from "react";
import ProviderHeader from "./ProviderHeader";
import ProviderSettingsSidebar from "./ProviderSettingsSidebar";
import { accountMainClass, accountMainStyle } from "../../common/account/AccountFlatNav";

const ProviderAccountPageLayout = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen flex-col bg-[var(--color-surface)] pt-[80px] font-sans text-[var(--color-text)]">
    <ProviderHeader activePage="home" />

    <div className="relative flex flex-1">
      <ProviderSettingsSidebar />

      <main className={accountMainClass} style={accountMainStyle}>
        <div className="mx-auto w-full max-w-5xl">
          <header className="mb-6 border-b border-[var(--color-border)] pb-4 sm:mb-8 sm:pb-6">
            <h1 className="text-2xl font-heading font-medium tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm font-medium text-gray-500">{subtitle}</p>
            ) : null}
          </header>
          {children}
        </div>
      </main>
    </div>
  </div>
);

export default ProviderAccountPageLayout;
