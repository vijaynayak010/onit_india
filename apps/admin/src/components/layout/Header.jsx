import React, { useState, useEffect } from 'react';
import { User, LogOut, Menu, Bell, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listDisputesAdmin, listNotificationsAdmin } from '../../services/api';

const Header = ({ isSidebarCollapsed }) => {
    const { user, logout } = useAuth();
    const [pendingDisputesCount, setPendingDisputesCount] = useState(0);

    useEffect(() => {
        const fetchPendingDisputes = async () => {
            if (!localStorage.getItem('admin_token')) return;
            try {
                const res = await listDisputesAdmin({ status: 'PENDING', limit: 1 });
                const count = res?.pagination?.total ?? res?.total ?? (Array.isArray(res?.data) ? res.data.length : 0);
                setPendingDisputesCount(count || 0);
            } catch (err) {
                // Silent catch
            }
        };
        fetchPendingDisputes();
        const interval = setInterval(fetchPendingDisputes, 30 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD';
    };

    return (
        <header className={`fixed top-0 right-0 transition-all duration-300 ${isSidebarCollapsed ? 'left-20' : 'left-64'} h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40`}>
            <div className="flex-1 flex items-center gap-4">

            </div>

            <div className="flex items-center gap-6">
                {/* Notification / Dispute Bell */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/disputes"
                        className="relative p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5"
                        title={pendingDisputesCount > 0 ? `${pendingDisputesCount} Pending Disputes` : 'Dispute Center'}
                    >
                        <Bell size={20} />
                        {pendingDisputesCount > 0 && (
                            <span className="flex items-center gap-1 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                <AlertTriangle size={10} /> {pendingDisputesCount} Dispute{pendingDisputesCount > 1 ? 's' : ''}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role?.replace('_', ' ') || 'Administrator'}</p>
                        </div>
                        <div className="h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-emerald-100 shadow-sm shadow-emerald-500/20">
                            {getInitials(user?.name)}
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
