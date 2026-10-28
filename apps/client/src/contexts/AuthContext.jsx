import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getMe, setApiTokenRefresher as setProviderApiTokenRefresher } from '../components/provider/services/api';
import { setApiTokenRefresher as setPerformerApiTokenRefresher } from '../components/Performer/services/api';
import { resolveAuth0AppFromPath } from '../config/auth0';
import { getApiUrl } from '../config/apiBase';
import { isTestModeEnabled, getTestRole, setTestRole } from '../test-mode/testModeConfig';
import { mockDb } from '../test-mode/mockDatabase';

const AuthContext = createContext(null);

/**
 * AuthProvider - Global authentication state manager.
 * Priority Roles: PROVIDER, TASKER (PERFORMER)
 */
export const AuthProvider = ({ children }) => {
    const { getAccessTokenSilently, logout: auth0Logout } = useAuth0();

    // Initialize state immediately from localStorage or Test Mode mock
    const [user, setUser] = useState(() => {
        if (isTestModeEnabled()) {
            const role = getTestRole();
            const mockUser = mockDb.getCurrentUser(role);
            if (mockUser) {
                localStorage.setItem('onit_user', JSON.stringify(mockUser));
                localStorage.setItem('userRole', mockUser.role);
                localStorage.setItem('onit_token', `mock_token_${mockUser.role.toLowerCase()}`);
                return mockUser;
            }
        }
        const storedUser = localStorage.getItem('onit_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const storedRole = localStorage.getItem('userRole');
                if (!parsedUser.role && storedRole) {
                    parsedUser.role = storedRole;
                }
                return parsedUser;
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const [token, setToken] = useState(() => {
        if (isTestModeEnabled()) {
            return localStorage.getItem('onit_token') || 'mock_token_test';
        }
        return localStorage.getItem('onit_token');
    });
    
    // Only block with a loading screen if we have no session
    const [loading, setLoading] = useState(() => {
        if (isTestModeEnabled()) return false;
        return !localStorage.getItem('onit_token');
    });

    useEffect(() => {
        // Listen to test-mode role and reset events
        const handleRoleChange = (e) => {
            const newRole = e.detail?.role || getTestRole();
            const newUser = mockDb.getCurrentUser(newRole);
            setUser(newUser);
            if (newUser) {
                const mockTok = `mock_token_${newUser.role.toLowerCase()}`;
                setToken(mockTok);
                localStorage.setItem('onit_user', JSON.stringify(newUser));
                localStorage.setItem('userRole', newUser.role);
                localStorage.setItem('onit_token', mockTok);
            } else {
                setToken(null);
                localStorage.removeItem('onit_user');
                localStorage.removeItem('userRole');
                localStorage.removeItem('onit_token');
            }
        };

        const handleDbReset = () => {
            const currentRole = getTestRole();
            const resetUser = mockDb.getCurrentUser(currentRole);
            setUser(resetUser);
            if (resetUser) {
                setToken(`mock_token_${resetUser.role.toLowerCase()}`);
            }
        };

        window.addEventListener('onit-test-role-change', handleRoleChange);
        window.addEventListener('onit-mock-db-reset', handleDbReset);

        // Background refresh/consistency check
        const loadSession = () => {
            if (isTestModeEnabled()) {
                setLoading(false);
                return;
            }
            const storedUser = localStorage.getItem('onit_user');
            const storedToken = localStorage.getItem('onit_token');

            if (storedUser && storedToken) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setToken(storedToken);
                } catch (error) {
                    console.error("Failed to parse stored user session", error);
                }
            }
            setLoading(false);
        };

        loadSession();

        return () => {
            window.removeEventListener('onit-test-role-change', handleRoleChange);
            window.removeEventListener('onit-mock-db-reset', handleDbReset);
        };
    }, []);

    const login = useCallback((userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        
        // Persist to localStorage for "session based" experience
        localStorage.setItem('onit_user', JSON.stringify(userData));
        localStorage.setItem('onit_token', authToken);
        if (userData.role) {
            localStorage.setItem('userRole', userData.role);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('onit_user');
        localStorage.removeItem('onit_token');
        localStorage.removeItem('onit_refresh_token');
        localStorage.removeItem('userRole');
        
        if (isTestModeEnabled()) {
            return;
        }

        try {
            auth0Logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        } catch (err) {
            console.error("[AUTH] Auth0 logout failed:", err?.message || err);
        }
    }, [auth0Logout]);

    const refreshToken = useCallback(async () => {
        if (isTestModeEnabled()) {
            return 'mock_token_test';
        }
        const storedRefresh = localStorage.getItem('onit_refresh_token');

        // Email OTP and phone authentication both persist refresh tokens, but
        // phone tokens are issued by our API rather than Auth0. Send either
        // type through the backend, which knows how to rotate both safely.
        if (storedRefresh) {
            const resp = await fetch(getApiUrl('/auth/refresh'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refreshToken: storedRefresh,
                    app: resolveAuth0AppFromPath(window.location.pathname),
                }),
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok) throw new Error(data.message || 'Refresh failed');

            const newAccessToken = data.accessToken || data.access_token;
            const newRefreshToken = data.refreshToken || data.refresh_token || storedRefresh;
            if (!newAccessToken) throw new Error('Refresh response did not include an access token');

            localStorage.setItem('onit_token', newAccessToken);
            localStorage.setItem('onit_refresh_token', newRefreshToken);
            setToken(newAccessToken);
            return newAccessToken;
        }

        try {
            const newToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    scope: import.meta.env.VITE_AUTH0_SCOPE,
                }
            });
            localStorage.setItem('onit_token', newToken);
            setToken(newToken);
            return newToken;
        } catch (error) {
            throw new Error(error?.message || 'No refresh session is available');
        }
    }, [getAccessTokenSilently]);

    useEffect(() => {
        setProviderApiTokenRefresher(refreshToken);
        setPerformerApiTokenRefresher(refreshToken);
        return () => {
            setProviderApiTokenRefresher(null);
            setPerformerApiTokenRefresher(null);
        };
    }, [refreshToken]);

    const updateUser = useCallback((updatedData) => {
        setUser(prev => {
            if (!prev) return null;
            
            // Robust merging: 
            // 1. Core user fields from updatedData
            // 2. Nested role specific fields (provider/tasker)
            // 3. Fallbacks for critical display fields like name/username
            const roleData = updatedData.provider || updatedData.taskers || {};
            const emailPrefix = (updatedData.email || prev?.email || "").split("@")[0];
            const newUser = { 
                ...prev, 
                ...updatedData, 
                ...roleData,
                username: updatedData.username || roleData.username || prev.username || emailPrefix || undefined,
                name:
                    updatedData.name ||
                    roleData.name ||
                    updatedData.displayName ||
                    roleData.displayName ||
                    prev.name ||
                    emailPrefix ||
                    undefined,
                displayName:
                    updatedData.displayName ||
                    roleData.displayName ||
                    prev.displayName ||
                    updatedData.name ||
                    roleData.name ||
                    emailPrefix ||
                    undefined,
                phoneNumber:
                    updatedData.phoneNumber ||
                    roleData.phoneNumber ||
                    prev.phoneNumber ||
                    updatedData.phone ||
                    prev.phone,
                // Preserve local email if backend returns null (Auth0 passwordless limitation)
                email: updatedData.email || prev.email
            };
            
            localStorage.setItem('onit_user', JSON.stringify(newUser));
            if (newUser.role) {
                localStorage.setItem('userRole', newUser.role);
            }
            return newUser;
        });
    }, []);

    const refreshProfile = useCallback(async () => {
        try {
            const fullProfile = await getMe();
            updateUser(fullProfile);
            return fullProfile;
        } catch (error) {
            console.error("[AUTH] Failed to refresh profile:", error);
            throw error;
        }
    }, [updateUser]);

    const hasPermission = useCallback((requiredRole) => {
        if (!user) return false;
        const currentRole = String(user.role).toUpperCase();
        const targetRole = String(requiredRole).toUpperCase();
        
        if (currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') return true;
        return currentRole === targetRole;
    }, [user]);

    const switchActiveRole = useCallback((newRole) => {
        if (!user) return;
        const roleStr = String(newRole).toUpperCase();
        setUser(prev => {
            const updatedUser = { ...prev, role: roleStr };
            localStorage.setItem('onit_user', JSON.stringify(updatedUser));
            localStorage.setItem('userRole', roleStr);
            return updatedUser;
        });
    }, [user]);

    const value = useMemo(() => ({
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        refreshProfile,
        hasPermission,
        switchActiveRole,
        isAuthenticated: !!token
    }), [user, token, loading, login, logout, updateUser, refreshProfile, hasPermission, switchActiveRole]);

    return (
        <AuthContext.Provider value={value}>
            {children}
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
