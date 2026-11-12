import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ProviderDataProvider, useProviderData } from './contexts/ProviderDataContext';
import { onboardUser, getUserProfile, getProviderProfile, createProviderProfile } from './services/api';
import { isTestModeEnabled } from '../../test-mode/testModeConfig';

import RequirePhoneVerification from '../RequirePhoneVerification';
import RequireProviderOnboarding from './components/RequireProviderOnboarding';

const AuthPage                      = lazy(() => import('./pages/AuthPage'));
const ForgotPasswordPage            = lazy(() => import('./pages/ForgotPasswordPage'));
const CheckEmailPage                = lazy(() => import('./pages/CheckEmailPage'));
const ChangePasswordPage            = lazy(() => import('./pages/ChangePasswordPage'));
const DashboardPage                 = lazy(() => import('./pages/DashboardPage'));
const TaskTemplatesPage             = lazy(() => import('./pages/TaskTemplatesPage'));
const TaskPerformersPage            = lazy(() => import('./pages/TaskPerformersPage'));
const SearchPage                    = lazy(() => import('./pages/SearchPage'));
const TaskPerformerProfilePage      = lazy(() => import('./pages/TaskPerformerProfilePage'));
const MyTasksPage                   = lazy(() => import('./pages/MyTasksPage'));
const BoostTaskPage                 = lazy(() => import('./pages/BoostTaskPage'));
const ChatsPage                     = lazy(() => import('./pages/ChatsPage'));
const PostTaskSelectionPage         = lazy(() => import('./pages/PostTaskSelectionPage'));
const PostTaskManualPage            = lazy(() => import('./pages/PostTaskManualPage'));
const PostTaskAIPage                = lazy(() => import('./pages/PostTaskAIPage'));
const PostTaskDetailsPage           = lazy(() => import('./pages/PostTaskDetailsPage'));
const PostTaskSearchResultsPage     = lazy(() => import('./pages/PostTaskSearchResultsPage'));
const TaskApplicantsPage            = lazy(() => import('./pages/TaskApplicantsPage'));
const TaskManagementPage            = lazy(() => import('./pages/TaskManagementPage'));
const ConfirmAndPayPage             = lazy(() => import('./pages/ConfirmAndPayPage'));
const PaymentSelectionPage          = lazy(() => import('./pages/PaymentSelectionPage'));
const PaymentSuccessPage            = lazy(() => import('./pages/PaymentSuccessPage'));
const AboutPage                     = lazy(() => import('./pages/AboutPage'));
const HowItWorksPage                = lazy(() => import('./pages/HowItWorksPage'));
const PricingPage                   = lazy(() => import('./pages/PricingPage'));
const FAQPage                       = lazy(() => import('./pages/FAQPage'));
const BlogPage                      = lazy(() => import('./pages/BlogPage'));
const CityLandingPage               = lazy(() => import('./pages/CityLandingPage'));
const CategoryLandingPage           = lazy(() => import('./pages/CategoryLandingPage'));
const SharedChangePasswordPage      = lazy(() => import('../shared/SharedChangePasswordPage'));
const SharedTwoFactorAuthPage       = lazy(() => import('../shared/SharedTwoFactorAuthPage'));
const ProviderActiveTaskExecutionPage = lazy(() => import('./pages/ProviderActiveTaskExecutionPage'));
const ProviderTaskSupportPage       = lazy(() => import('./pages/ProviderTaskSupportPage'));
const ProviderAgentSupportPage      = lazy(() => import('./pages/ProviderAgentSupportPage'));
const SettingsPage                  = lazy(() => import('./pages/SettingsPage'));
const SwitchToPerformerPage         = lazy(() => import('./pages/SwitchToPerformerPage'));
const SavedPerformersPage           = lazy(() => import('./pages/SavedPerformersPage'));
const DraftTasksPage                = lazy(() => import('./pages/DraftTasksPage'));
const TaskHistoryPage               = lazy(() => import('./pages/TaskHistoryPage'));
const ExploreTalentPage             = lazy(() => import('./pages/ExploreTalentPage'));
const TaskStatusPage                = lazy(() => import('./pages/TaskStatusPage'));
const TaskActivityPage              = lazy(() => import('./pages/TaskActivityPage'));
const DeleteAccountPage             = lazy(() => import('./pages/DeleteAccountPage'));
const RestoreAccountPage            = lazy(() => import('../shared/RestoreAccountPage'));
const ProviderOnboardingPage        = lazy(() => import('./pages/ProviderOnboardingPage'));

const ProviderDeleteAccountRoute = () => {
    const { stats } = useProviderData();
    const activeTasksCount =
        stats?.find((s) => s.label === "Active")?.value ||
        stats?.find((s) => s.label === "Applicants")?.value ||
        "0";
    return <DeleteAccountPage activeTasksCount={activeTasksCount} />;
};


const ProviderApp = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const hasSynced = React.useRef(false);

    // Role Synchronization: Always verify backend role when entering Provider Module
    useEffect(() => {
        const verifyAndSyncRole = async () => {
            if (isTestModeEnabled()) return;
            if (!user || hasSynced.current) return;
            hasSynced.current = true;

            // 0. SECONDARY GUARD: If user is explicitly a TASKER, don't let them in here
            const currentRole = String(user.role).toUpperCase();
            if (currentRole === 'TASKER' || currentRole === 'PERFORMER') {
                console.warn("[FirstDoer] Redirecting Performer away from Provider module.");
                navigate('/performer/dashboard', { replace: true });
                return;
            }

            try {
                // 1. Sync full profile from backend
                console.log("[FirstDoer] Syncing full provider profile from backend...");
                const fullProfile = await refreshProfile();

                // 2. Extra check: if backend says they are a Tasker, redirect now
                const backendRole = String(fullProfile.role).toUpperCase();
                if (backendRole === 'TASKER' || backendRole === 'PERFORMER') {
                    navigate('/performer/dashboard', { replace: true });
                    return;
                }

                // 3. PENDING users haven't selected a role yet — send to auth
                if (backendRole === 'PENDING') {
                    navigate('/auth', { replace: true });
                    return;
                }

                // 4. Ensure the Provider Profile record exists in the database
                if (!fullProfile.provider) {
                    console.log("[FirstDoer] ⚠️ Provider record missing. Initializing...");
                    if (backendRole === 'PROVIDER' || backendRole === 'ADMIN' || backendRole === 'SUPER_ADMIN') {
                        await onboardUser('PROVIDER');
                        await createProviderProfile({});
                        await refreshProfile();
                    } else {
                        // Wrong area — redirect to the correct dashboard
                        navigate('/performer/dashboard', { replace: true });
                    }
                }
            } catch (err) {
                console.error("[FirstDoer]  Failed to verify user role:", err);
            }
        };

        verifyAndSyncRole();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Run when user changes, but protected by hasSynced

    return (
        <Suspense fallback={null}>
        <Routes>
            <Route
                path="restore-account"
                element={
                    <RestoreAccountPage
                        appLabel="Provider"
                        dashboardPath="/provider/dashboard"
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
                <Route path="onboarding" element={<ProviderOnboardingPage />} />
                <Route
                    element={
                        <ProviderDataProvider>
                            <RequireProviderOnboarding />
                        </ProviderDataProvider>
                    }
                >
                <Route index element={<Navigate to="/provider/dashboard" replace />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="check-email" element={<CheckEmailPage />} />
                <Route path="change-password" element={<SharedChangePasswordPage backRoute="/provider/dashboard" forgotPasswordRoute="/provider/forgot-password" />} />
                <Route path="two-factor-auth" element={<SharedTwoFactorAuthPage backRoute="/provider/dashboard" />} />
                <Route path="active-task/:id" element={<ProviderActiveTaskExecutionPage />} />
                <Route path="active-task/:id/need-help" element={<ProviderTaskSupportPage kind="need-help" />} />
                <Route path="active-task/:id/extend-deadline" element={<ProviderTaskSupportPage kind="extend-deadline" />} />
                <Route path="active-task/:id/task-changes" element={<ProviderTaskSupportPage kind="task-changes" />} />
                <Route path="active-task/:id/performer-issues" element={<ProviderTaskSupportPage kind="performer-issues" />} />
                <Route path="agent-support" element={<ProviderAgentSupportPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="switch-to-performer" element={<SwitchToPerformerPage />} />
                <Route path="explore-talent" element={<ExploreTalentPage />} />
                <Route path="task-status" element={<TaskStatusPage />} />
                <Route path="task-activity" element={<TaskActivityPage />} />
                <Route path="delete-account" element={<ProviderDeleteAccountRoute />} />
                <Route path="saved-performers" element={<SavedPerformersPage />} />
                <Route path="draft-tasks" element={<DraftTasksPage />} />
                <Route path="task-history" element={<TaskHistoryPage />} />
                <Route path="profile" element={<Navigate to="/provider/settings?tab=profile" replace />} />
                <Route path="task-templates" element={<TaskTemplatesPage />} />
                <Route path="task-performers" element={<TaskPerformersPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="task-performer-profile/:name" element={<TaskPerformerProfilePage />} />
                <Route path="my-tasks" element={<MyTasksPage />} />
                <Route path="boost-task" element={<BoostTaskPage />} />
                <Route path="chats" element={<ChatsPage />} />
                <Route path="post-task-selection" element={<PostTaskSelectionPage />} />
                <Route path="post-task-manual" element={<PostTaskManualPage />} />
                <Route path="post-task-ai" element={<PostTaskAIPage />} />
                <Route path="post-task-details" element={<PostTaskDetailsPage />} />
                <Route path="post-task-results" element={<PostTaskSearchResultsPage />} />
                <Route path="task-applicants" element={<TaskApplicantsPage />} />
                <Route path="task-details" element={<TaskManagementPage />} />
                <Route path="confirm-and-pay" element={<ConfirmAndPayPage />} />
                <Route path="payment-selection" element={<PaymentSelectionPage />} />
                <Route path="payment-success" element={<PaymentSuccessPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="how-it-works" element={<HowItWorksPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="city/:citySlug" element={<CityLandingPage />} />
                <Route path="category/:categorySlug" element={<CategoryLandingPage />} />
                <Route path="wallet" element={<Navigate to="/provider/settings?tab=wallet" replace />} />
                <Route path="support" element={<Navigate to="/provider/settings?tab=settings" replace />} />
                <Route path="rewards" element={<Navigate to="/provider/settings?tab=refer" replace />} />
                <Route path="kyc" element={<Navigate to="/provider/settings?tab=profile" replace />} />
                <Route path="internships" element={<Navigate to="/provider/explore-talent" replace />} />
                <Route path="*" element={<Navigate to="/provider/dashboard" replace />} />
                </Route>
            </Route>
        </Routes>
        </Suspense>
    );
};

export default ProviderApp;
