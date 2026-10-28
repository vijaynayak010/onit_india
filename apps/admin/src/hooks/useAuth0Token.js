import { useAuth0 } from '@auth0/auth0-react';
import { getAuth0ScopeWithOfflineAccess } from '../utils/auth0Scope';

/**
 * useAuth0Token
 *
 * Centralises Auth0 access-token retrieval.
 * - First tries getAccessTokenSilently() for a always-fresh JWT from Auth0.
 * - Falls back to localStorage.getItem('admin_token') for the legacy API
 *   service bridge that Login.jsx writes after every successful login.
 *
 * Usage:
 *   const { getToken } = useAuth0Token();
 *   const token = await getToken();
 *   api.defaults.headers.Authorization = `Bearer ${token}`;
 */
export function useAuth0Token() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const getToken = async () => {
    if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: getAuth0ScopeWithOfflineAccess(),
          },
        });
        // Keep localStorage bridge in sync so api.js interceptor always has a fresh token
        localStorage.setItem('admin_token', token);
        return token;
      } catch (err) {
        console.warn('[useAuth0Token] Silent token refresh failed, falling back to localStorage:', err);
      }
    }
    // Fallback: use whatever Login.jsx stored after the last redirect login
    return localStorage.getItem('admin_token');
  };

  return { getToken };
}
