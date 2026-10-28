import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { onboardUser } from '../provider/services/api';
import { createTaskerProfile } from './services/api';
import { isTestModeEnabled } from '../../test-mode/testModeConfig';

import RequirePhoneVerification from '../RequirePhoneVerification';
import RequirePerformerOnboarding from './components/RequirePerformerOnboarding';

const PerformerDashboardPage                  = lazy(() => import('./pages/PerformerDashboardPage'));
const PerformerNewHomePage                    = lazy(() => import('./pages/PerformerNewHomePage'));
const PerformerGrowthPage                     = lazy(() => import('./pages/PerformerGrowthPage'));
const PerformerDailyQuizPage                  = lazy(() => import('./pages/PerformerDailyQuizPage'));
const PerformerSearchLoadingPage              = lazy(() => import('./pages/PerformerSearchLoadingPage'));
const PerformerSearchResultsPage              = lazy(() => import('./pages/PerformerSearchResultsPage'));
const PerformerLeaderboardPage                = lazy(() => import('./pages/PerformerLeaderboardPage'));
const PerformerVouchersPage                   = lazy(() => import('./pages/PerformerVouchersPage'));
const PerformerEarningsPage                   = lazy(() => import('./pages/PerformerEarningsPage'));
const PerformerTransactionsPage               = lazy(() => import('./pages/PerformerTransactionsPage'));
const PerformerTaskDetailsPage                = lazy(() => import('./pages/PerformerTaskDetailsPage'));
const PerformerClientProfilePage              = lazy(() => import('./pages/PerformerClientProfilePage'));
const PerformerTaskAcceptedPage               = lazy(() => import('./pages/PerformerTaskAcceptedPage'));
const PerformerTaskInvitationPage             = lazy(() => import('./pages/PerformerTaskInvitationPage'));
const PerformerMyTasksPage                    = lazy(() => import('./pages/PerformerMyTasksPage'));
const PerformerSettingsPage                   = lazy(() => import('./pages/PerformerSettingsPage'));
const PerformerAccountHubPage                 = lazy(() => import('./pages/PerformerAccountHubPage'));
const PerformerSwitchToProviderPage           = lazy(() => import('./pages/PerformerSwitchToProviderPage'));
const PerformerFindTasksPage                  = lazy(() => import('./pages/PerformerFindTasksPage'));
const PerformerAllTasksPage                   = lazy(() => import('./pages/PerformerAllTasksPage'));
const PerformerProfilePage                    = lazy(() => import('./pages/PerformerProfilePage'));
const PerformerBankDetailsPage                = lazy(() => import('./pages/PerformerBankDetailsPage'));
const PerformerEarningsTransactionDetailsPage = lazy(() => import('./pages/PerformerEarningsTransactionDetailsPage'));
const PerformerActiveTaskExecutionPage        = lazy(() => import('./pages/PerformerActiveTaskExecutionPage'));
const PerformerKycPage                        = lazy(() => import('./pages/PerformerKycPage'));
const PerformerRatingsPage                    = lazy(() => import('./pages/PerformerRatingsPage'));
const PerformerReferPage                      = lazy(() => import('./pages/PerformerReferPage'));
const PerformerActiveTasksPage                = lazy(() => import('./pages/PerformerActiveTasksPage'));
const PerformerCompletedTasksPage             = lazy(() => import('./pages/PerformerCompletedTasksPage'));
const PerformerSavedTasksPage                 = lazy(() => import('./pages/PerformerSavedTasksPage'));
const PerformerApplicationsPage               = lazy(() => import('./pages/PerformerApplicationsPage'));
const PerformerNotificationsPage              = lazy(() => import('./pages/PerformerNotificationsPage'));
const PerformerWalletPage                     = lazy(() => import('./pages/PerformerWalletPage'));
const PerformerWalletWithdrawPage             = lazy(() => import('./pages/PerformerWalletWithdrawPage'));
const PerformerWalletTransactionsPage         = lazy(() => import('./pages/PerformerWalletTransactionsPage'));
const PerformerWithdrawPage                   = lazy(() => import('./pages/PerformerWithdrawPage'));
const PerformerOnboardingPage                 = lazy(() => import('./pages/PerformerOnboardingPage'));
const ChatsPage                               = lazy(() => import('../provider/pages/ChatsPage'));
const DeleteAccountPage                       = lazy(() => import('../provider/pages/DeleteAccountPage'));
const PerformerTaskAgreementPage              = lazy(() => import('./pages/PerformerTaskAgreementPage'));
const PerformerAgentSupportPage               = lazy(() => import('./pages/PerformerAgentSupportPage'));
const PerformerTaskSupportPage                = lazy(() => import('./pages/PerformerTaskSupportPage'));
const PerformerInvitationsPage                = lazy(() => import('./pages/PerformerInvitationsPage'));
const SharedChangePasswordPage                = lazy(() => import('../shared/SharedChangePasswordPage'));
const SharedTwoFactorAuthPage                 = lazy(() => import('../shared/SharedTwoFactorAuthPage'));
const RestoreAccountPage                      = lazy(() => import('../shared/RestoreAccountPage'));

const PerformerApp = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const hasSynced = useRef(false);

    // Role Synchronization: Always verify backend role when entering Performer Module
    useEffect(() => {
        const verifyAndSyncRole = async () => {
            if (isTestModeEnabled()) return;
            if (!user) {
                return;
            }
            if (hasSynced.current) {
                return;
            }
            hasSynced.current = true;

            // 0. SECONDARY GUARD: If user is explicitly a PROVIDER/ADMIN, don't let them in here
            const currentRole = String(user.role).toUpperCase();
            const forbiddenRoles = ['PROVIDER', 'ADMIN', 'SUPER_ADMIN'];

            if (forbiddenRoles.includes(currentRole)) {
                console.warn("[ONIT PERF] ⛔ Redirecting Provider away from Performer module.");
                navigate('/provider/dashboard', { replace: true });
                return;
            }

            try {
                // 1. Sync full profile from backend (includes taskers data)
                console.log("[ONIT PERF] Syncing full performer profile from backend...");
                const fullProfile = await refreshProfile();

                // 2. Extra check: if backend says they are a Provider, redirect now
                const backendRole = String(fullProfile.role || 'TASKER').toUpperCase();
                if (forbiddenRoles.includes(backendRole)) {
                    navigate('/provider/dashboard', { replace: true });
                    return;
                }

                // 3. Ensure Tasker Profile record exists
                if (!fullProfile.taskers) {
                    console.log("[ONIT PERF] ⚠️ Tasker record missing. Initializing...");
                    const checkRole = String(fullProfile?.role || 'TASKER').toUpperCase();
                    if (checkRole === 'PROVIDER' || checkRole === 'ADMIN' || checkRole === 'SUPER_ADMIN') {
                        console.warn("[ONIT PERF] ⛔ Skipping Tasker profile creation for non-tasker role:", checkRole);
                        navigate('/provider/dashboard', { replace: true });
                    } else {
                        await onboardUser('TASKER');
                        await createTaskerProfile({});
                        await refreshProfile();
                    }
                }
            } catch (err) {
                console.error("[ONIT PERF] ❌ Failed to verify performer user role:", err);
            }
        };

        verifyAndSyncRole();
    }, [user, navigate, refreshProfile]);

    return (
        <Suspense fallback={null}>
        <Routes>
            <Route
                path="restore-account"
                element={
                    <RestoreAccountPage
                        appLabel="Performer"
                        dashboardPath="/performer/dashboard"
                    />
                }
            />
            <Route
                element={
                    <RequirePhoneVerification>
                        <Outlet />
                    </RequirePhoneVerification>
                }
            >
                <Route path="onboarding" element={<PerformerOnboardingPage />} />
                <Route element={<RequirePerformerOnboarding />}>
                <Route index element={<Navigate to="/performer/dashboard" replace />} />
                <Route path="dashboard" element={<PerformerDashboardPage />} />
                <Route path="newHomePage" element={<PerformerNewHomePage />} />
                <Route path="growth" element={<PerformerGrowthPage />} />
                <Route path="daily-quiz" element={<PerformerDailyQuizPage />} />
                <Route path="my-tasks" element={<PerformerMyTasksPage />} />
                <Route path="search-loading" element={<PerformerSearchLoadingPage />} />
                <Route path="search-results" element={<PerformerSearchResultsPage />} />
                <Route path="leaderboard" element={<PerformerLeaderboardPage />} />
                <Route path="vouchers" element={<PerformerVouchersPage />} />
                <Route path="earnings" element={<PerformerEarningsPage />} />
                <Route path="transactions" element={<PerformerTransactionsPage />} />
                <Route path="transactions/:id" element={<PerformerEarningsTransactionDetailsPage />} />
                <Route path="task/:id" element={<PerformerTaskDetailsPage />} />
                <Route path="active-task/:id" element={<PerformerActiveTaskExecutionPage />} />
                <Route path="client/:id" element={<PerformerClientProfilePage />} />
                <Route path="task-accepted/:id" element={<PerformerTaskAcceptedPage />} />
                <Route path="invitation/:id" element={<PerformerTaskInvitationPage />} />
                <Route path="task-agreement/:id" element={<PerformerTaskAgreementPage />} />
                <Route path="agent-support" element={<PerformerAgentSupportPage />} />
                <Route path="task-support/:id" element={<PerformerTaskSupportPage />} />
                <Route path="invitations" element={<PerformerInvitationsPage />} />
                <Route path="chats" element={<ChatsPage />} />
                <Route path="account" element={<PerformerAccountHubPage />} />
                <Route path="switch-to-provider" element={<PerformerSwitchToProviderPage />} />
                <Route path="settings" element={<PerformerSettingsPage />} />
                <Route path="notifications" element={<PerformerNotificationsPage />} />
                <Route
                    path="delete-account"
                    element={
                        <DeleteAccountPage
                            appType="performer"
                            settingsPath="/performer/settings"
                        />
                    }
                />
                <Route path="find-tasks" element={<PerformerFindTasksPage />} />
                <Route path="all-tasks" element={<PerformerAllTasksPage />} />
                <Route path="ratings" element={<PerformerRatingsPage />} />
                <Route path="refer" element={<PerformerReferPage />} />
                <Route path="kyc" element={<PerformerKycPage />} />
                <Route path="profile" element={<PerformerProfilePage />} />
                <Route path="banks" element={<PerformerBankDetailsPage />} />
                <Route path="active-tasks" element={<PerformerActiveTasksPage />} />
                <Route path="completed-tasks" element={<PerformerCompletedTasksPage />} />
                <Route path="saved-tasks" element={<PerformerSavedTasksPage />} />
                <Route path="applications" element={<PerformerApplicationsPage />} />
                <Route path="wallet" element={<PerformerWalletPage />} />
                <Route path="wallet/withdraw" element={<PerformerWalletWithdrawPage />} />
                <Route path="wallet/transactions" element={<PerformerWalletTransactionsPage />} />
                <Route path="withdraw" element={<PerformerWithdrawPage />} />
                <Route path="change-password" element={<SharedChangePasswordPage backRoute="/performer/account" forgotPasswordRoute="/performer/forgot-password" />} />
                <Route path="two-factor-auth" element={<SharedTwoFactorAuthPage backRoute="/performer/account" />} />
                <Route path="support" element={<Navigate to="/performer/settings" replace />} />
                <Route path="rewards" element={<Navigate to="/performer/refer" replace />} />
                <Route path="internships" element={<Navigate to="/performer/find-tasks" replace />} />
                <Route path="*" element={<Navigate to="/performer/dashboard" replace />} />
                </Route>
            </Route>
        </Routes>
        </Suspense>
    );
};

export default PerformerApp;
