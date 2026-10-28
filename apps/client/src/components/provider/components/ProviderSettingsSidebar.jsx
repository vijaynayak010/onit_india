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
import { ACCOUNT_SIDEBAR_WIDTH } from "../../common/account/AccountFlatNav";

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
        className={`flex h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition ${
          active ? "bg-[#d3f6e1] text-black font-bold" : "text-black hover:bg-[#f1fbf5] font-semibold"
        }`}
      >
        <Icon size={20} strokeWidth={2.1} className="shrink-0" />
        <span className="truncate text-[15px] leading-none">{item.label}</span>
      </button>
    );
  };

  return (
    <aside
      className="fixed left-0 top-[80px] z-40 hidden h-[calc(100vh-80px)] flex-col justify-between border-r border-[#d8e5de] bg-white px-5 py-7 shadow-[0_4px_12px_rgba(0,0,0,0.14)] lg:flex"
      style={{ width: ACCOUNT_SIDEBAR_WIDTH }}
    >
      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left font-semibold text-black transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={20} strokeWidth={2.1} className="shrink-0" />
        <span className="truncate text-[15px] leading-none">Logout</span>
      </button>
    </aside>
  );
};

export default ProviderSettingsSidebar;
