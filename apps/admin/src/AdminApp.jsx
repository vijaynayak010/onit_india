import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import AdminGoogleAuth from './pages/AdminGoogleAuth.jsx';
import PrivateRoute from './components/common/PrivateRoute';
import AdminFeatureRoute from './components/common/AdminFeatureRoute.jsx';
import UsersPage from './pages/Users.jsx';
import TasksPage from './pages/Tasks.jsx';
import TaskApprovalsPage from './pages/TaskApprovals.jsx';
import AdminTaskDetail from './pages/AdminTaskDetail.jsx';
import FinancePage from './pages/Finance.jsx';
import PerformerVerificationPage from './pages/KYC.jsx';
import PerformerAccessPage from './pages/PerformerAccess.jsx';
import PerformerGrowthPage from './pages/PerformerGrowth.jsx';
import WorkVerificationPage from './pages/WorkVerification.jsx';
import NotificationsPage from './pages/Notifications.jsx';
import DisputesPage from './pages/Disputes.jsx';
import ModerationPage from './pages/Moderation.jsx';
import ReportsPage from './pages/Reports.jsx';
import SettingsPage from './pages/Settings.jsx';
import HomeDynamicPage from './pages/HomeDynamic.jsx';
import ContentPages from './pages/ContentPages.jsx';
import CareersPage from './pages/Careers.jsx';
import DeletionPage from './pages/DeletionPage.jsx';
import TicketsPage from './pages/support/Tickets.jsx';
import LiveChatPage from './pages/support/LiveChat.jsx';
import JobResponsesPage from './pages/JobResponses.jsx';
import ReferralManagement from './pages/ReferralManagement.jsx';
import CouponManagement from './pages/CouponManagement.jsx';
import PromotionalVouchers from './pages/PromotionalVouchers.jsx';
import EmailMonitoring from './pages/EmailMonitoring.jsx';
import VerifyInvoice from './pages/VerifyInvoice.jsx';
import AdminAccess from './pages/AdminAccess.jsx';
import AdminSearch from './pages/AdminSearch.jsx';
import ServicePricing from './pages/ServicePricing.jsx';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AdminDataProvider } from './contexts/AdminDataContext';
import { ADMIN_FEATURES } from './utils/adminFeatureAccess';
import './index.css';

const AdminApp = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    const location = useLocation();
    const navigate = useNavigate();

    // Master Redirect: If logged in via Auth0, never stay on the login page or root admin route
    useEffect(() => {
        const isRootOrLogin = location.pathname === '/' || location.pathname === '/login';
        if (isAuthenticated && isRootOrLogin) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, location.pathname, navigate]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse uppercase tracking-widest text-xs">
                Synchronizing Admin Portal...
            </div>
        );
    }

    return (
        <AuthProvider>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="verify-invoice" element={<VerifyInvoice />} />

                <Route element={<PrivateRoute />}>
                    <Route path="google-auth" element={<AdminGoogleAuth />} />
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Navigate to="login" replace />} />
                        <Route path="dashboard" element={<AdminDataProvider><Dashboard /></AdminDataProvider>} />
                        <Route path="search" element={<AdminSearch />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="users/:userId" element={<UsersPage />} />
                        <Route path="tasks" element={<AdminFeatureRoute feature={ADMIN_FEATURES.TASKS}><TasksPage /></AdminFeatureRoute>} />
                        <Route path="tasks/:taskId" element={<AdminFeatureRoute feature={ADMIN_FEATURES.TASKS}><AdminTaskDetail /></AdminFeatureRoute>} />
                        <Route path="task-approvals" element={<AdminFeatureRoute feature={ADMIN_FEATURES.TASKS}><TaskApprovalsPage /></AdminFeatureRoute>} />
                        <Route path="service-pricing" element={<AdminFeatureRoute feature={ADMIN_FEATURES.TASKS}><ServicePricing /></AdminFeatureRoute>} />
                        <Route path="finance" element={<AdminFeatureRoute feature={ADMIN_FEATURES.FINANCE}><FinancePage /></AdminFeatureRoute>} />
                        <Route path="verify-performers" element={<AdminFeatureRoute feature={ADMIN_FEATURES.KYC}><PerformerVerificationPage /></AdminFeatureRoute>} />
                        <Route path="performer-access" element={<AdminFeatureRoute feature={ADMIN_FEATURES.KYC}><PerformerAccessPage /></AdminFeatureRoute>} />
                        <Route path="performer-growth" element={<AdminFeatureRoute feature={ADMIN_FEATURES.KYC}><PerformerGrowthPage /></AdminFeatureRoute>} />
                        <Route path="verify-work" element={<AdminFeatureRoute feature={ADMIN_FEATURES.TASKS}><WorkVerificationPage /></AdminFeatureRoute>} />
                        <Route path="moderation" element={<ModerationPage />} />
                        <Route path="email-monitoring" element={<EmailMonitoring />} />
                        <Route path="disputes" element={<AdminFeatureRoute feature={ADMIN_FEATURES.TASKS}><DisputesPage /></AdminFeatureRoute>} />
                        <Route path="support">
                            <Route path="tickets" element={<AdminFeatureRoute feature={ADMIN_FEATURES.SUPPORT}><TicketsPage /></AdminFeatureRoute>} />
                            <Route path="live-chat" element={<AdminFeatureRoute feature={ADMIN_FEATURES.SUPPORT}><LiveChatPage /></AdminFeatureRoute>} />
                        </Route>
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="home-dynamic" element={<HomeDynamicPage />} />
                        <Route path="content-pages" element={<ContentPages />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="settings/access" element={<AdminFeatureRoute feature={ADMIN_FEATURES.ACCESS_MANAGEMENT}><AdminAccess /></AdminFeatureRoute>} />
                        <Route path="careers" element={<CareersPage />} />
                        <Route path="careers/responses" element={<JobResponsesPage />} />
                        <Route path="deletion" element={<DeletionPage />} />
                        <Route path="promotions">
                            <Route path="referrals" element={<ReferralManagement />} />
                            <Route path="coupons" element={<CouponManagement />} />
                            <Route path="promotional-vouchers" element={<PromotionalVouchers />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AuthProvider>
    );
};

export default AdminApp;
