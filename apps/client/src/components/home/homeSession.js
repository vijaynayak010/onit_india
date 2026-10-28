const normalizeRole = (user) => String(user?.role || "").trim().toUpperCase();

export function getHomeSessionName(user) {
  const value =
    user?.displayName ||
    user?.name ||
    user?.username ||
    user?.provider?.username ||
    user?.taskers?.displayName ||
    user?.email?.split("@")[0] ||
    "your account";

  return String(value).trim().split(/\s+/)[0] || "your account";
}

export function getHomeDashboardPath(user) {
  const role = normalizeRole(user);
  if (role === "TASKER" || role === "PERFORMER") return "/performer/dashboard";
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin";
  if (role === "PROVIDER") return "/provider/dashboard";
  return "/auth";
}

export function getHomePrimaryAction(user) {
  const role = normalizeRole(user);
  if (role === "TASKER" || role === "PERFORMER") {
    return { label: "Find Tasks", path: "/performer/find-tasks" };
  }
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return { label: "Open Admin", path: "/admin" };
  }
  if (role === "PROVIDER") {
    return { label: "Post a Task", path: "/provider/post-task-selection" };
  }
  return { label: "Continue", path: "/auth" };
}
