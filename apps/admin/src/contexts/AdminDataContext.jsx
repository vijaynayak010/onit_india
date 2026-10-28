import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { clearAdminApiCache } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const AdminDataContext = createContext(null);
const DASHBOARD_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export const AdminDataProvider = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchAdminData = useCallback(async (force = false) => {
        // Only fetch if we don't have data, or if we're forcing a refresh
        if (stats && !force) return;

        // Don't hammer the API (and spam 401s) once the session token is gone —
        // the session-expired modal takes over from here.
        if (!localStorage.getItem('admin_token')) return;

        try {
            setLoading(true);
            setError(null);
            
            const [dashboardData, growthData] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getGrowthMetrics({ interval: 'daily' })
            ]);
            
            setStats(dashboardData);
            
            if (growthData?.transactionVolume) {
                const formatted = growthData.transactionVolume.map(item => ({
                    name: new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short' }),
                    revenue: item.volume
                }));
                setRevenueData(formatted);
            }
        } catch (err) {
            console.error("[AdminDataContext] Fetch Error:", err);
            setError(err.message || "Failed to fetch marketplace data");
        } finally {
            setLoading(false);
        }
    }, [stats]);

    // Initial fetch when user is available
    useEffect(() => {
        if (user) {
            fetchAdminData();

            // Auto-refresh when tab/window is refocused
            const onFocus = () => fetchAdminData(true);
            window.addEventListener('focus', onFocus);

            // Real-time refresh on push notification
            const onUpdate = () => fetchAdminData(true);
            window.addEventListener('onit-update', onUpdate);

            // Periodic sync every 10 minutes; users can still force refresh from the dashboard button.
            const interval = setInterval(() => fetchAdminData(true), DASHBOARD_REFRESH_INTERVAL_MS);

            return () => {
                window.removeEventListener('focus', onFocus);
                window.removeEventListener('onit-update', onUpdate);
                clearInterval(interval);
            };
        }
    }, [user, fetchAdminData]);

    return (
        <AdminDataContext.Provider value={{ 
            stats, 
            revenueData, 
            loading, 
            error, 
            refreshData: () => {
                clearAdminApiCache();
                return fetchAdminData(true);
            } 
        }}>
            {children}
        </AdminDataContext.Provider>
    );
};

export const useAdminData = () => {
    const context = useContext(AdminDataContext);
    if (!context) {
        throw new Error('useAdminData must be used within an AdminDataProvider');
    }
    return context;
};
