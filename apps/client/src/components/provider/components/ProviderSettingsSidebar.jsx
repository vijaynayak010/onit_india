import React from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Wallet,
  Landmark,
  CheckSquare,
  Star,
  Gift,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { ACCOUNT_SIDEBAR_WIDTH } from "../../common/account/accountNavConstants";

const NAV_ITEMS = [
  { id: "home", label: "Account", icon: LayoutDashboard, tab: "home" },
  { id: "profile", label: "Profile", icon: User, tab: "profile" },
  { id: "wallet", label: "Wallet", icon: Wallet, tab: "wallet" },
  { id: "banks", label: "Banks Details", icon: Landmark, tab: "banks" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, tab: "all_tasks" },
  { id: "ratings", label: "Ratings", icon: Star, tab: "ratings" },
  { id: "refer", label: "Refer & Earn", icon: Gift, tab: "refer" },
  { id: "settings", label: "Settings", icon: Settings, tab: "settings" },
];

const ProviderSettingsSidebar = ({ onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();

  const activeTab = searchParams.get("tab") || "home";
  const currentPath = location.pathname;

  const goTab = (tab) => {
    if (onTabChange) onTabChange(tab);
    navigate(`/provider/settings?tab=${tab}`);
  };

  const isActive = (item) => {
    if (item.id === "home") {
      return activeTab === "home" || !searchParams.get("tab");
    }
    if (item.id === "wallet") {
      return activeTab === "wallet" || activeTab === "transactions";
    }
    if (item.id === "tasks") {
      return (
        activeTab === "all_tasks" ||
        activeTab === "insights" ||
        ["/provider/draft-tasks", "/provider/task-history", "/provider/task-templates", "/provider/saved-performers"].includes(currentPath)
      );
    }
    if (item.id === "ratings") {
      return activeTab === "ratings" || activeTab === "reviews";
    }
    return activeTab === item.tab;
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const NavButton = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item);
    return (
      <button
        type="button"
        onClick={() => goTab(item.tab)}
        className={`flex h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-primary-700)] ${
          active
            ? "bg-[var(--dash-active-bg)] text-[var(--dash-primary-800)] font-semibold"
            : "text-[var(--dash-text-secondary)] hover:bg-[var(--dash-canvas)] hover:text-[var(--dash-text)] font-medium"
        }`}
      >
        <Icon
          size={19}
          strokeWidth={2}
          className={`shrink-0 ${active ? "text-[var(--dash-primary-700)]" : "text-[var(--dash-text-secondary)]"}`}
          aria-hidden="true"
        />
        <span className="truncate text-[14px] leading-none">{item.label}</span>
      </button>
    );
  };

  return (
    <aside
      className="fixed left-0 top-[80px] z-40 hidden h-[calc(100vh-80px)] flex-col justify-between border-r border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-6 lg:flex"
      style={{ width: ACCOUNT_SIDEBAR_WIDTH }}
    >
      <nav className="flex flex-col gap-1.5" aria-label="Provider account navigation">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left font-medium text-[var(--dash-text-secondary)] transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
      >
        <LogOut size={19} strokeWidth={2} className="shrink-0" aria-hidden="true" />
        <span className="truncate text-[14px] leading-none">Logout</span>
      </button>
    </aside>
  );
};

export default ProviderSettingsSidebar;
