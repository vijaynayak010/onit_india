export const getAuth0ScopeWithOfflineAccess = () => {
    const scope = String(import.meta.env.VITE_AUTH0_SCOPE || 'openid profile email').trim();
    return scope.split(/\s+/).includes('offline_access')
        ? scope
        : `${scope} offline_access`;
};
