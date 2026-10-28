import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    CreditCard,
    Activity,
    ArrowUpRight,
    UserCheck,
    CheckCircle2,
    XCircle,
    UserPlus,
    Filter,
    ChevronDown,
    Loader2,
    Clock, 
    ArrowDownRight, 
    AlertCircle,
    RefreshCw 
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import RevenueChart from '../components/modules/dashboard/RevenueChart';
import { useAdminData } from '../contexts/AdminDataContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { stats, revenueData, loading, error, refreshData } = useAdminData();
    const [performerLevel, setPerformerLevel] = useState('L1');

    if (loading && !stats) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-emerald-600 mx-auto" size={48} />
                    <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Marketplace Data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-4">
                <div className="p-4 bg-red-50 rounded-full text-red-600">
                    <AlertCircle size={40} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Dashboard API Error</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm">
                        {error.message || 'Failed to load dashboard metrics (500 Internal Server Error).'} 
                        <br/><br/>
                        The backend Lambda is currently failing to process these metrics. Waiting for backend fix.
                    </p>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={() => refreshData()}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all font-bold text-sm"
                    >
                        <RefreshCw size={18} /> Retry Connection
                    </button>
                    <button
                        onClick={() => setFetchError(null)} // dismiss error to see empty dashboard
                        className="mt-4 block mx-auto text-xs text-slate-400 font-bold hover:text-slate-600 underline"
                    >
                        View empty dashboard anyway
                    </button>
                </div>
            </div>
        );
    }

    const activityList = [
        { text: 'New task posted for "Web Development"', time: '2 mins ago', type: 'task' },
        { text: 'Completed verification for "Cinematic Edit"', time: '15 mins ago', type: 'verification' },
        { text: 'Payout of ₹4,500 processed for "Alice"', time: '1 hour ago', type: 'finance' },
        { text: 'New service listing: "Plumbing"', time: '2 hours ago', type: 'service' },
        { text: '12 user flags resolved by Moderator', time: '5 hours ago', type: 'moderation' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Overview of marketplace</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all">
                        Today: {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </button>
                    <button 
                        onClick={() => refreshData()}
                        disabled={loading}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />} 
                        {loading ? 'Refreshing...' : 'Refresh Stats'}
                    </button>
                </div>
            </div>

            {/* Core Stats Section */}
            <div className="space-y-6">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Primary Operations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Task Providers"
                        value={stats?.users?.byRole?.PROVIDER || 0}
                        trend="+12%"
                        icon={<UserPlus size={24} />}
                        color="green"
                        onClick={() => navigate('/users')}
                    />
                    <StatCard
                        label="Task Performers"
                        value={stats?.users?.byRole?.TASKER || 0}
                        trend="+8%"
                        icon={<Users size={24} />}
                        color="purple"
                        onClick={() => navigate('/users')}
                    />
                    <StatCard
                        label="KYC Pending"
                        value={stats?.kyc?.pendingCount || 0}
                        icon={<UserCheck size={24} />}
                        color="green"
                        onClick={() => navigate('/verify-performers')}
                    />
                    <StatCard
                        label="Total Revenue"
                        value={`₹${((stats?.revenue?.totalFees || 0) / 1000).toFixed(1)}k`}
                        trend="+18%"
                        icon={<CreditCard size={24} />}
                        color="orange"
                        onClick={() => navigate('/finance')}
                    />
                </div>
            </div>

            {/* Task Lifecycle Section */}
            <div className="space-y-6">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Task Lifecycle</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Active Tasks"
                        value={stats?.tasks?.byStatus?.PUBLISHED || 0}
                        trend="+5.2%"
                        icon={<ShoppingBag size={24} />}
                        color="green"
                        onClick={() => navigate('/tasks')}
                    />
                    <StatCard
                        label="Completed Tasks"
                        value={stats?.tasks?.byStatus?.COMPLETED || 0}
                        trend="+2%"
                        icon={<CheckCircle2 size={24} />}
                        color="green"
                        onClick={() => navigate('/tasks')}
                    />
                    <StatCard
                        label="In Progress"
                        value={stats?.tasks?.byStatus?.IN_PROGRESS || 0}
                        trend="-1%"
                        icon={<Activity size={24} />}
                        color="blue"
                        onClick={() => navigate('/tasks')}
                    />
                </div>
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card p-8 shadow-xl shadow-slate-200/40 border-none">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Revenue Trajectory</h3>
                            <p className="text-sm text-slate-500 font-medium">Daily transaction volume across all platform services.</p>
                        </div>
                        <div className="relative">
                            <select className="appearance-none bg-slate-50 border border-slate-100 text-xs font-black uppercase tracking-wider rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 cursor-pointer">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                    <RevenueChart data={revenueData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
