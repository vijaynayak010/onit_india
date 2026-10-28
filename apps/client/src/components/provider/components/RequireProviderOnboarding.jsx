import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getProviderOnboardingStatus } from "../services/api";
import { isProviderOnboardingComplete, markProviderOnboardingComplete } from "../utils/providerOnboardingStorage";
import { isTestModeEnabled } from "../../../test-mode/testModeConfig";

const EXEMPT_PATHS = ["/provider/onboarding", "/provider/restore-account"];

const SESSION_PREFIX = "provider_onboarding_session_v1";

function getSessionKey(userId) {
  return userId ? `${SESSION_PREFIX}_${userId}` : SESSION_PREFIX;
}

function isSessionComplete(userId) {
  try { return sessionStorage.getItem(getSessionKey(userId)) === "true"; } catch { return false; }
}

function markSessionComplete(userId) {
  try { sessionStorage.setItem(getSessionKey(userId), "true"); } catch { /* ignore */ }
}

const RequireProviderOnboarding = () => {
  if (isTestModeEnabled()) {
    return <Outlet />;
  }

  const { user } = useAuth();
  const location = useLocation();
  const userId = user?.id || user?.sub;
  const localComplete = isProviderOnboardingComplete(userId) || isSessionComplete(userId);
  const [profileCheck, setProfileCheck] = useState(localComplete ? "complete" : "checking");
  const path = location.pathname.toLowerCase();
  const isExempt = EXEMPT_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
  const isOnboarding = path === "/provider/onboarding" || path.startsWith("/provider/onboarding/");

  useEffect(() => {
    if (!userId || localComplete) {
      setProfileCheck(localComplete ? "complete" : "incomplete");
      return undefined;
    }

    let cancelled = false;
    setProfileCheck("checking");
    getProviderOnboardingStatus()
      .then((response) => {
        const complete = Boolean(response?.onboardingComplete);
        if (cancelled) return;
        if (complete) {
          markProviderOnboardingComplete(userId);
          markSessionComplete(userId);
        }
        setProfileCheck(complete ? "complete" : "incomplete");
      })
      .catch(() => {
        if (!cancelled) setProfileCheck("incomplete");
      });

    return () => { cancelled = true; };
  }, [userId, localComplete]);

  if (profileCheck === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="flex flex-col items-center gap-3 text-[var(--color-text-muted)]">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[var(--color-primary-subtle)] border-t-[var(--color-primary)]" />
          <p className="text-sm font-semibold">Setting up your workspace…</p>
        </div>
      </div>
    );
  }

  const complete = profileCheck === "complete";

  if (complete && isOnboarding) {
    return <Navigate to="/provider/dashboard" replace />;
  }

  if (!complete && !isExempt) {
    return <Navigate to="/provider/onboarding" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireProviderOnboarding;
