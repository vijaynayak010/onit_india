import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuth0 } from '@auth0/auth0-react';
import { clearAdminGoogleVerification, isAdminGoogleVerified } from '../../utils/adminGoogleVerification';
import { clearAdminAuthFlowStarted, hasRecentAdminAuthFlow } from '../../utils/adminAuthFlow';
import { clearAdminFeatureAccessCache } from '../../hooks/useAdminFeatureAccess';

const PrivateRoute = ({ requiredRole }) => {
    const { user: localUser, loading: localLoading, hasPermission } = useAuth();
    const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
    const location = useLocation();

    const loading = localLoading || auth0Loading;

    if (loading) {
        return (
            <div className="h-screen w-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse uppercase tracking-widest text-xs">
                Synchronizing Admin Authorization...
            </div>
        );
    }

    // Let them through if they are Auth0 authenticated OR locally authenticated
    if (isAuthenticated || localUser) {
        if (location.pathname === '/google-auth') {
            if (!isAdminGoogleVerified() && !hasRecentAdminAuthFlow()) {
                clearAdminGoogleVerification();
                clearAdminAuthFlowStarted();
                clearAdminFeatureAccessCache();
                return <Navigate to="/login" state={{ from: location, forceLogin: true }} replace />;
            }

            return <Outlet />;
        }

        if (!isAdminGoogleVerified()) {
            if (!hasRecentAdminAuthFlow()) {
                localStorage.setItem(
                    'admin_auth_redirect_return_to',
                    `${location.pathname}${location.search || ''}`
                );
                return <Navigate to="/login" state={{ from: location, forceLogin: true }} replace />;
            }

            localStorage.setItem(
                'admin_google_redirect_return_to',
                `${location.pathname}${location.search || ''}`
            );
            return <Navigate to="/google-auth" state={{ from: location }} replace />;
        }

        return <Outlet />;
    }

    // Otherwise, send to login;
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
