import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  UserRound,
  Wallet,
  Landmark,
  CheckSquare,
  Star,
  Gift,
  Settings,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  AccountFlatNavItem,
  AccountFlatSidebarShell,
} from "../../common/account/AccountFlatNav";

const NAV_ITEMS = [
  { id: "account", label: "Account Hub", icon: UserRound, path: "/performer/account" },
  { id: "profile", label: "My Profile", icon: User, path: "/performer/profile" },
  { id: "wallet", label: "My earnings", icon: Wallet, path: "/performer/earnings" },
  { id: "banks", label: "Bank Details", icon: Landmark, path: "/performer/banks" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, path: "/performer/my-tasks" },
  { id: "ratings", label: "Ratings", icon: Star, path: "/performer/ratings" },
  { id: "refer", label: "Refer & Earn", icon: Gift, path: "/performer/refer" },
  { id: "settings", label: "Settings", icon: Settings, path: "/performer/settings" },
];

const TASK_PATHS = [
  "/performer/my-tasks",
  "/performer/all-tasks",
  "/performer/active-tasks",
  "/performer/completed-tasks",
  "/performer/saved-tasks",
  "/performer/applications",
];

const PerformerSettingsSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (item) => {
    if (item.id === "account") {
      return currentPath === "/performer/account";
    }
    if (item.id === "profile") {
      return currentPath === "/performer/profile";
    }
    if (item.id === "tasks") {
      return TASK_PATHS.some((path) => currentPath === path || currentPath.startsWith(`${path}/`));
    }
    if (item.id === "wallet") {
      const walletPaths = [
        "/performer/wallet",
        "/performer/earnings",
        "/performer/wallet/withdraw",
        "/performer/wallet/transactions",
      ];
      return walletPaths.some((path) => currentPath === path || currentPath.startsWith(`${path}/`));
    }
    if (item.id === "banks") {
      return currentPath === "/performer/banks";
    }
    if (item.id === "ratings") {
      return currentPath === "/performer/ratings" || currentPath === "/performer/kyc";
    }
    return currentPath === item.path || currentPath.startsWith(`${item.path}/`);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <AccountFlatSidebarShell
      onLogout={handleLogout}
      footer={
        <div className="text-center pt-2">
          <p className="text-[10px] font-bold text-gray-400">Onit Performer · v2.4.1</p>
          <p className="text-[9px] font-medium text-gray-300 mt-0.5">© 2026 Onit Inc.</p>
        </div>
      }
    >
      {NAV_ITEMS.map((item) => (
        <AccountFlatNavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={isActive(item)}
          onClick={() => navigate(item.path)}
        />
      ))}
    </AccountFlatSidebarShell>
  );
};

export default PerformerSettingsSidebar;
