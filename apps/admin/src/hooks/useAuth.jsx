import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ShieldAlert } from 'lucide-react';
import { clearAdminGoogleVerification } from '../utils/adminGoogleVerification';
import { clearAdminFeatureAccessCache } from './useAdminFeatureAccess';
import { clearAdminAuthFlowStarted } from '../utils/adminAuthFlow';
import { getAuth0ScopeWithOfflineAccess } from '../utils/auth0Scope';
import { setAdminApiTokenRefresher } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize user immediately from storage for instant "fast" login
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('admin_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Only block with a loading screen if we have no session AND Auth0 is still checking
    const [loading, setLoading] = useState(() => {
        const token = localStorage.getItem('admin_token');
        return !token;
    });

    // Set when the API reports the session/token is no longer valid (e.g. expired).
    // Drives the "session expired" popup instead of letting the app fail silently.
    const [sessionExpired, setSessionExpired] = useState(false);

    const { logout: auth0Logout, isAuthenticated, isLoading: isAuth0Loading, getAccessTokenSilently } = useAuth0();

    const refreshAccessToken = useCallback(async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                scope: getAuth0ScopeWithOfflineAccess(),
            },
        });

        localStorage.setItem('admin_token', token);
        localStorage.setItem('onit_token', token);
        return token;
    }, [getAccessTokenSilently]);

    useEffect(() => {
        setAdminApiTokenRefresher(refreshAccessToken);
        return () => setAdminApiTokenRefresher(null);
    }, [refreshAccessToken]);

    useEffect(() => {
        const onSessionExpired = () => {
            setUser(null);
            setSessionExpired(true);
        };
        window.addEventListener('onit-admin-session-expired', onSessionExpired);
        return () => window.removeEventListener('onit-admin-session-expired', onSessionExpired);
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            // Priority 1: Auth0 Session Bridge (Silent Background Sync)
            if (!isAuth0Loading && isAuthenticated) {
                try {
                    const token = await refreshAccessToken();
                    const adminData = { role: 'ADMIN', email: 'admin@onit.com' };
                    
                    // Sync all keys in background
                    localStorage.setItem('admin_token', token);
                    localStorage.setItem('onit_token', token);
                    localStorage.setItem('admin_user', JSON.stringify(adminData));
                    localStorage.setItem('onit_user', JSON.stringify(adminData));
                    localStorage.setItem('userRole', 'ADMIN');
                    localStorage.setItem('onit_dev_access_2026', 'granted');
                    
                    setUser(adminData);
                    setLoading(false);
                    return;
                } catch (err) {
                    console.error("[AuthProvider Background Sync] Auth0 Sync Failed:", err);
                }
            }

            // Fallback for when Auth0 says we are not authenticated (e.g. logged out)
            if (!isAuth0Loading && !isAuthenticated) {
                const token = localStorage.getItem('admin_token');
                // If we thought we were logged in but Auth0 says no, clear it (only if not a mock token)
                if (token && token !== "mock_admin_token") {
                    // We don't automatically logout to prevent flicker, but we stop loading
                }
            }
            
            // Stop loading once we've had a chance to check Auth0 (or if we already have a session)
            if (!isAuth0Loading) {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [isAuthenticated, isAuth0Loading, refreshAccessToken]);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        localStorage.setItem('admin_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('onit_dev_access_2026');
        clearAdminAuthFlowStarted();
        clearAdminGoogleVerification();
        clearAdminFeatureAccessCache();

        auth0Logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    };

    const hasPermission = (requiredRole) => {
        if (!user) return false;
        // Super Admin has all permissions
        if (user.role === 'super_admin') return true;
        return user.role === requiredRole;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
            <div className={sessionExpired ? 'pointer-events-none blur-sm select-none' : ''}>
                {children}
            </div>

            {sessionExpired && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">
                        <div className="mx-auto h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                            <ShieldAlert size={26} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Session expired</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                Your admin session has expired or is no longer valid. Please log in again to continue.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={logout}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors"
                        >
                            Log in again
                        </button>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
