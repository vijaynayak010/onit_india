import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProviderHeader from "../components/ProviderHeader";
import ProviderSettingsSidebar from "../components/ProviderSettingsSidebar";
import { accountMainClass, accountMainStyle } from "../../common/account/AccountFlatNav";

import ProfileView from "./settings/ProfileView";
import EditProfileForm from "./settings/EditProfileForm";
import SettingsView from "./settings/SettingsView";
import AllTasksView from "./settings/AllTasksView";
import AddOrgForm from "./settings/AddOrgForm";
import RatingsView from "./settings/RatingsView";
import ReferEarnView from "./settings/ReferEarnView";
import TransactionsView from "./settings/TransactionsView";
import ReviewsView from "./settings/ReviewsView";
import ProviderInsightsView from "./settings/ProviderInsightsView";
import SubscriptionPlanView from "./settings/SubscriptionPlanView";
import ProviderAccountHubView from "./settings/ProviderAccountHubView";
import WalletView from "./settings/WalletView";
import AddFundsView from "./settings/AddFundsView";
import WithdrawView from "./settings/WithdrawView";
import BanksDetailsView from "./settings/BanksDetailsView";

const VALID_TABS = [
  "home",
  "profile",
  "wallet",
  "banks",
  "insights",
  "transactions",
  "subscription",
  "ratings",
  "reviews",
  "refer",
  "settings",
  "all_tasks",
];

const TAB_META = {
  home: { label: "Profile", description: "Account overview" },
  profile: { label: "Profile", description: "Identity, contact, and organization" },
  wallet: { label: "Wallet", description: "Balance, add money, and withdrawals" },
  banks: { label: "Bank details", description: "Accounts for payouts and verification" },
  insights: { label: "Provider insights", description: "Overview of your task activity and performance" },
  transactions: { label: "Payment History", description: "View your payment history" },
  subscription: { label: "Subscription Plan", description: "Manage your plan and billing" },
  ratings: { label: "Ratings Received", description: "All ratings from your clients" },
  reviews: { label: "Reviews & Feedback", description: "Your reviews for performers" },
  refer: { label: "Refer & earn", description: "Invite others and track rewards" },
  settings: { label: "Settings", description: "Notifications, support, and account actions" },
  all_tasks: { label: "Task", description: "View your complete task history" },
};

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab = useMemo(() => (VALID_TABS.includes(tabParam) ? tabParam : "home"), [tabParam]);

  const [showOrgForm, setShowOrgForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [walletRefreshKey, setWalletRefreshKey] = useState(0);

  useEffect(() => {
    if (tabParam === "feedback") {
      setSearchParams({ tab: "reviews" }, { replace: true });
      return;
    }
    if (tabParam && !VALID_TABS.includes(tabParam)) {
      setSearchParams({ tab: "home" }, { replace: true });
    }
  }, [tabParam, setSearchParams]);

  const goTab = (id) => {
    setShowOrgForm(false);
    setShowEditProfile(false);
    setShowAddFunds(false);
    setShowWithdraw(false);
    setSearchParams({ tab: id });
  };

  const meta = TAB_META[activeTab];
  const isWalletOverlay = showAddFunds || showWithdraw;
  const hidePageIntro =
    showOrgForm || showEditProfile || activeTab === "home" || isWalletOverlay;

  const handleWalletSuccess = () => {
    setShowAddFunds(false);
    setShowWithdraw(false);
    setWalletRefreshKey((key) => key + 1);
  };

  const renderContent = () => {
    if (showOrgForm) return <AddOrgForm onSave={() => setShowOrgForm(false)} onCancel={() => setShowOrgForm(false)} />;
    if (showEditProfile) return <EditProfileForm onSave={() => setShowEditProfile(false)} onCancel={() => setShowEditProfile(false)} />;

    if (showAddFunds && activeTab === "wallet") {
      return (
        <AddFundsView
          onCancel={() => setShowAddFunds(false)}
          onSuccess={handleWalletSuccess}
        />
      );
    }

    if (showWithdraw && activeTab === "wallet") {
      return (
        <WithdrawView
          onCancel={() => setShowWithdraw(false)}
          onSuccess={handleWalletSuccess}
        />
      );
    }

    switch (activeTab) {
      case "home":
        return <ProviderAccountHubView onTabChange={goTab} />;
      case "insights":
        return <ProviderInsightsView />;
      case "settings":
        return <SettingsView />;
      case "all_tasks":
        return <AllTasksView />;
      case "ratings":
        return <RatingsView />;
      case "reviews":
        return <ReviewsView />;
      case "refer":
        return <ReferEarnView />;
      case "transactions":
        return <TransactionsView onBack={() => goTab("wallet")} />;
      case "subscription":
        return <SubscriptionPlanView />;
      case "wallet":
        return (
          <WalletView
            key={walletRefreshKey}
            onAddMoney={() => setShowAddFunds(true)}
            onWithdraw={() => setShowWithdraw(true)}
            onViewTransactions={() => goTab("transactions")}
          />
        );
      case "banks":
        return <BanksDetailsView />;
      case "profile":
      default:
        return (
          <ProfileView onEditClick={() => setShowEditProfile(true)} onAddOrgClick={() => setShowOrgForm(true)} />
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)] pt-[80px] font-sans text-[var(--color-text)]">
      <ProviderHeader activePage="home" />

      <div className="relative flex flex-1">
        <ProviderSettingsSidebar onTabChange={goTab} />

        <main className={accountMainClass} style={accountMainStyle}>
          <div className={`w-full ${activeTab === "ratings" || activeTab === "reviews" ? "max-w-5xl" : "mx-auto max-w-6xl"}`}>
            {!hidePageIntro ? (
              <header className="mb-8 border-b border-[var(--color-border)] pb-8">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{meta.label}</h1>
                <p className="mt-1 max-w-2xl text-sm font-medium text-[var(--color-text-muted)]">{meta.description}</p>
              </header>
            ) : null}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
