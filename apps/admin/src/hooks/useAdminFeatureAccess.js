import { useEffect, useState } from 'react';
import { getMyAdminFeatureAccess } from '../services/api';

let cachedAccess = null;
let inflight = null;

export const clearAdminFeatureAccessCache = () => {
    cachedAccess = null;
    inflight = null;
};

export const useAdminFeatureAccess = () => {
    const [state, setState] = useState(() => ({
        loading: !cachedAccess,
        googleEmail: cachedAccess?.googleEmail ?? null,
        features: cachedAccess?.features ?? [],
        error: '',
    }));

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (cachedAccess) {
                setState({
                    loading: false,
                    googleEmail: cachedAccess.googleEmail,
                    features: cachedAccess.features,
                    error: '',
                });
                return;
            }

            try {
                inflight = inflight || getMyAdminFeatureAccess();
                const access = await inflight;
                cachedAccess = {
                    googleEmail: access.googleEmail,
                    features: access.features ?? [],
                };

                if (!cancelled) {
                    setState({ loading: false, ...cachedAccess, error: '' });
                }
            } catch (error) {
                if (!cancelled) {
                    setState({
                        loading: false,
                        googleEmail: null,
                        features: [],
                        error: error.message || 'Failed to load admin access',
                    });
                }
            } finally {
                inflight = null;
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const refresh = async () => {
        cachedAccess = null;
        inflight = null;
        setState((prev) => ({ ...prev, loading: true }));
        const access = await getMyAdminFeatureAccess();
        cachedAccess = {
            googleEmail: access.googleEmail,
            features: access.features ?? [],
        };
        setState({ loading: false, ...cachedAccess, error: '' });
    };

    return { ...state, refresh };
};
