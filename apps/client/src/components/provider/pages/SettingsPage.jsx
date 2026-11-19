import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";

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
  home: { label: "Account Overview", description: "Profile, wallet, tasks, and preferences in one place" },
  profile: { label: "Profile", description: "Identity, contact, and organization" },
  wallet: { label: "Wallet", description: "Balance, add money, and withdrawals" },
  banks: { label: "Bank Details", description: "Accounts for payouts and verification" },
  insights: { label: "Provider Insights", description: "Overview of your task activity and performance" },
  transactions: { label: "Payment History", description: "View your payment history" },
  subscription: { label: "Subscription Plan", description: "Manage your plan and billing" },
  ratings: { label: "Ratings Received", description: "All ratings from performers" },
  reviews: { label: "Reviews & Feedback", description: "Your reviews for performers" },
  refer: { label: "Refer & Earn", description: "Invite others and track rewards" },
  settings: { label: "Settings", description: "Notifications, support, and account actions" },
  all_tasks: { label: "Tasks", description: "View your complete task history" },
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
  const hidePageIntro = showOrgForm || showEditProfile || activeTab === "home" || isWalletOverlay;

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
        return (
          <ProviderAccountHubView
            onTabChange={goTab}
            onEditProfile={() => setShowEditProfile(true)}
          />
        );
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
    <div className="min-h-screen bg-[var(--dash-canvas)] pt-[80px] font-sans text-[var(--dash-text)]">
      <ProviderHeader activePage="home" />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {!hidePageIntro ? (
          <header className="mb-6 border-b border-[var(--dash-border)] pb-5">
            <button
              type="button"
              onClick={() => goTab("home")}
              className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--dash-text-secondary)] transition hover:text-[var(--dash-primary-800)]"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Back to Account Overview
            </button>
            <h1 className="dash-page-title text-[var(--dash-text)]">{meta.label}</h1>
            <p className="dash-secondary mt-1 max-w-2xl">{meta.description}</p>
          </header>
        ) : null}
        {renderContent()}
      </main>
    </div>
  );
};

export default SettingsPage;
