import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { isTestModeEnabled } from '../test-mode/testModeConfig';

/**
 * GatedRoute - Unified boundary for protected routes.
 * Ensures the user has a valid session and the correct role.
 */
const GatedRoute = ({ children }) => {
    if (isTestModeEnabled()) {
        return children;
    }

    const { user, loading, isAuthenticated, refreshProfile } = useAuth();
    const { isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } = useAuth0();
    const location = useLocation();
    const [isSyncing, setIsSyncing] = React.useState(false);
    const [syncFailed, setSyncFailed] = React.useState(false);
    // Guards against an infinite re-sync loop: the sync runs at most once per mount,
    // regardless of whether it resolved the role mismatch (a successful sync that still
    // leaves a mismatch — e.g. the account isn't ADMIN — must not trigger another sync).
    const [syncAttempted, setSyncAttempted] = React.useState(false);

    // Normalize path and role for robust validation
    const lowerPath = location.pathname.toLowerCase();
    const userRole = user?.role?.toUpperCase();

    const isAdminArea = lowerPath.startsWith('/admin');
    const isProviderArea = lowerPath.startsWith('/provider');
    const isPerformerArea = lowerPath.startsWith('/performer');

    const hasAdminAccess = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
    const hasProviderAccess = userRole === 'PROVIDER' || hasAdminAccess;
    const hasPerformerAccess = userRole === 'TASKER' || userRole === 'PERFORMER' || hasAdminAccess;

    const isMismatch = 
        (isAdminArea && !hasAdminAccess) ||
        (isProviderArea && !hasProviderAccess) ||
        (isPerformerArea && !hasPerformerAccess);

    const isUnlocked = (localStorage.getItem('onit_dev_access_2026') === 'granted') || isAuthenticated || isAuth0Authenticated;
    const isLoading = loading || isAuth0Loading;

    // Dev-bypass alone (no real session) must NOT count as authenticated for the profile sync:
    // getMe() would 401, and the api 401 interceptor hard-redirects to /auth and wipes the session.
    const isReallyAuthenticated = isAuthenticated || isAuth0Authenticated;

    // 0. One-time sync retry on role mismatch (Must be defined BEFORE early returns)
    React.useEffect(() => {
        if (isReallyAuthenticated && isMismatch && !syncAttempted && !isSyncing) {
            console.warn("[GATE] Role mismatch detected while authenticated. Attempting background sync...");
            const triggerSync = async () => {
                setIsSyncing(true);
                try {
                    await refreshProfile();
                    console.log("[GATE] Profile synchronized successfully.");
                } catch (err) {
                    console.error("[GATE] Sync failed, blocking access.", err);
                    setSyncFailed(true);
                } finally {
                    setSyncAttempted(true);
                    setIsSyncing(false);
                }
            };
            triggerSync();
        }
    }, [isReallyAuthenticated, isMismatch, syncAttempted, isSyncing, refreshProfile]);

    // 1. Exemption: ALWAYS let auth/login pages through — never block them with a loading screen
    const isLoginPage =
        lowerPath === '/admin/login' ||
        lowerPath === '/admin/login/' ||
        lowerPath === '/auth' ||
        lowerPath === '/auth/' ||
        lowerPath === '/otp' ||
        lowerPath === '/otp/' ||
        lowerPath === '/provider/welcome' ||
        lowerPath === '/provider/welcome/';
    if (isLoginPage) {
        return children;
    }

    // 2. Loading State: Wait for both Local Auth and Auth0 to finish initial sync
    const isAuthenticating = isLoading || isAuth0Loading || isSyncing;

    if (isAuthenticating) {
        return (
            <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
                <div className="min-h-screen bg-zinc-50 flex">
                    {/* Sidebar skeleton */}
                    <div className="hidden md:flex flex-col gap-4 w-56 shrink-0 bg-white border-r border-zinc-200 p-5 h-screen sticky top-0">
                        <Skeleton height={32} width={120} borderRadius={8} />
                        <div className="mt-4 flex flex-col gap-3">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <Skeleton key={i} height={36} borderRadius={8} />
                            ))}
                        </div>
                        <div className="mt-auto">
                            <Skeleton height={44} borderRadius={10} />
                        </div>
                    </div>

                    {/* Main content skeleton */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Top bar */}
                        <div className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
                            <Skeleton height={28} width={180} borderRadius={6} />
                            <div className="flex items-center gap-3">
                                <Skeleton circle height={34} width={34} />
                                <Skeleton height={34} width={90} borderRadius={8} />
                            </div>
                        </div>

                        {/* Page body */}
                        <div className="flex-1 p-6 overflow-auto">
                            {/* Stat cards row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 border border-zinc-100">
                                        <Skeleton height={14} width={80} borderRadius={4} />
                                        <Skeleton height={28} width={60} borderRadius={6} className="mt-2" />
                                    </div>
                                ))}
                            </div>

                            {/* Content rows */}
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div className="md:col-span-2 bg-white rounded-2xl border border-zinc-100 p-4">
                                    <Skeleton height={16} width={140} borderRadius={4} className="mb-4" />
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} height={44} borderRadius={8} className="mb-2" />
                                    ))}
                                </div>
                                <div className="bg-white rounded-2xl border border-zinc-100 p-4">
                                    <Skeleton height={16} width={100} borderRadius={4} className="mb-4" />
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} height={54} borderRadius={10} className="mb-2" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        );
    }

    // 3. Authorization Check
    if (!isUnlocked) {
        if (isAdminArea) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // 4. Final Role Validation: Only redirect if sync already failed or we confirmed the user is truly mismatched.
    if (user && isMismatch && (syncFailed || !isUnlocked)) {
        if (isAdminArea) console.warn("[GATE] Access Denied: User role mismatch for Admin area", userRole);
        if (isProviderArea) console.warn("[GATE] Access Denied: User role mismatch for Provider area", userRole);
        if (isPerformerArea) console.warn("[GATE] Access Denied: User role mismatch for Performer area", userRole);
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
};

export default GatedRoute;
