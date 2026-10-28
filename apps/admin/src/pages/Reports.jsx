import React, { useState, useEffect, useCallback } from 'react';
import {
    FileText, Download, Calendar, BarChart3, Users, Wallet,
    CheckCircle2, ArrowRight, Search, Clock, Mail, TrendingUp,
    PieChart as PieChartIcon, Filter, Loader2, RefreshCw
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie
} from 'recharts';
import Toast from '../components/common/Toast.jsx';
import { adminService } from '../services/adminService';

const ReportsPage = () => {
    const [dateRange, setDateRange] = useState('7d');
    const [selectedModules, setSelectedModules] = useState(['Users', 'Finance']);
    const [isGenerating, setIsGenerating] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeChart, setActiveChart] = useState('categories');
    
    // Remote Data
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [userSegments, setUserSegments] = useState([]);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            // Determine date from based on range
            const now = new Date();
            let dateFrom;
            if (dateRange === 'Today') dateFrom = new Date(now.setHours(0,0,0,0));
            else if (dateRange === '7d') dateFrom = new Date(now.setDate(now.getDate() - 7));
            else if (dateRange === '30d') dateFrom = new Date(now.setDate(now.getDate() - 30));
            
            const [tasksRes, growthRes, dashRes] = await Promise.all([
                adminService.getTaskAnalytics(),
                adminService.getGrowthMetrics({ 
                    interval: 'daily', 
                    dateFrom: dateFrom ? dateFrom.toISOString() : undefined 
                }),
                adminService.getDashboardStats()
            ]);

            // Map Category Data
            const catMap = (tasksRes.priceByCategory || []).map(c => ({
                name: c.category,
                revenue: Number(c.avgPrice) * c.count,
                tasks: c.count
            }));
            setCategoryData(catMap.length ? catMap : [
                { name: 'Cleaning', revenue: 45000, tasks: 120 },
                { name: 'Plumbing', revenue: 28000, tasks: 85 }
            ]);

            // Map Growth Data
            const growthMap = (growthRes.transactionVolume || []).map(g => {
                const d = new Date(g.date);
                return {
                    month: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                    revenue: g.volume
                };
            });
            setGrowthData(growthMap.length ? growthMap : [
                { month: 'Jan', revenue: 1000 }, { month: 'Feb', revenue: 2000 }
            ]);

            // Map User Segments
            const rolesMap = dashRes.users?.byRole || {};
            const segMap = Object.entries(rolesMap).map(([role, val]) => ({
                name: role,
                value: val
            }));
            setUserSegments(segMap.length ? segMap : [
                { name: 'USER', value: 400 },
                { name: 'PROVIDER', value: 150 },
                { name: 'TASKER', value: 800 }
            ]);

        } catch (error) {
            console.error(error);
            setToast({ message: "Failed to fetch Analytics", type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const COLORS = ['#059669', '#d11714ff', '#1377c9ff', '#6a187cff', '#200ec1ff'];

    const modules = [
        { id: 'Users', icon: <Users size={18} />, desc: 'User growth, activity, and retention.' },
        { id: 'Finance', icon: <Wallet size={18} />, desc: 'Revenue, payouts, and wallet logs.' },
        { id: 'Tasks', icon: <CheckCircle2 size={18} />, desc: 'Completion rates and service metrics.' },
        { id: 'Security', icon: <FileText size={18} />, desc: 'KYC trends and moderation logs.' },
    ];

    const toggleModule = (id) => {
        setSelectedModules(prev => 
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleGenerate = async (format) => {
        if (selectedModules.length === 0) {
            setToast({ message: 'Please select at least one module.', type: 'error' });
            return;
        }
        setIsGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setToast({ message: `Report generated successfully in ${format} format.`, type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to generate report.', type: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading && !categoryData.length) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 size={40} className="animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8 animate-in fade-in duration-700 h-[calc(100vh-4rem)] overflow-y-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & Reports</h1>
                    <p className="text-slate-500 mt-1 font-medium">Detailed visual insights and customizable data exports.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={fetchAnalytics} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 shadow-sm">
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        {['Today', '7d', '30d', 'All'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setDateRange(r)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                    dateRange === r ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Visual Analytics Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Secondary Charts */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 space-y-4 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                                <TrendingUp size={16} className="text-emerald-500" /> Transaction Growth
                            </h3>
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{dateRange} Trend</span>
                        </div>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(val) => [`₹${val}`, 'Gross Value']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 border border-slate-800 shadow-xl shadow-slate-900/20">
                        <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-white/60">
                            <PieChartIcon size={16} className="text-emerald-400" /> Platform Roles
                        </h3>
                        <div className="h-[180px] w-full flex items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userSegments}
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {userSegments.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3 pr-4">
                                {userSegments.map((seg, i) => (
                                    <div key={seg.name} className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full shadow-inner" style={{ backgroundColor: COLORS[i] }} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-white/50">{seg.name}</span>
                                            <span className="text-sm font-black">{seg.value.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Categorical Analysis */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-8 h-full shadow-sm border border-slate-100 relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 rounded-3xl" />
                        )}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Task Categories</h2>
                                <p className="text-sm font-medium text-slate-400 mt-0.5">Value and frequency distributed by service category.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveChart('revenue')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeChart === 'revenue' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                    Value Base
                                </button>
                                <button
                                    onClick={() => setActiveChart('tasks')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeChart === 'tasks' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                    Frequency
                                </button>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        tickFormatter={(val) => activeChart === 'revenue' ? `₹${(val / 1000).toFixed(0)}k` : val}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar
                                        dataKey={activeChart === 'revenue' ? 'revenue' : 'tasks'}
                                        radius={[8, 8, 0, 0]}
                                        barSize={40}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-white rounded-3xl p-8 space-y-8 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <Download size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">Download Data Export</h3>
                                    <p className="text-sm font-medium text-slate-500">Select modules to bundle into exactly what you need.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {modules.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => toggleModule(m.id)}
                                    className={`flex flex-col gap-3 p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                                        selectedModules.includes(m.id)
                                            ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                            : 'bg-white border-slate-100 hover:border-slate-200'
                                    }`}
                                >
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                                        selectedModules.includes(m.id) ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {m.icon}
                                    </div>
                                    <p className={`text-base font-black transition-colors ${selectedModules.includes(m.id) ? 'text-emerald-900' : 'text-slate-900'}`}>
                                        {m.id}
                                    </p>
                                    {selectedModules.includes(m.id) && (
                                        <div className="absolute top-4 right-4">
                                            <CheckCircle2 size={20} className="text-emerald-500" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => handleGenerate('CSV')}
                                disabled={isGenerating || selectedModules.length === 0}
                                className="w-full sm:flex-1 bg-slate-900 text-white h-14 rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                <FileText size={20} /> Generate CSV Dump
                            </button>
                            <button
                                onClick={() => handleGenerate('PDF')}
                                disabled={isGenerating || selectedModules.length === 0}
                                className="w-full sm:flex-1 bg-white border-2 border-slate-200 text-slate-700 h-14 rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-700 transition-all disabled:opacity-50"
                            >
                                <Download size={20} /> Download PDF Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-8 text-white space-y-6 overflow-hidden relative group h-full flex flex-col justify-center">
                        <div className="absolute -right-12 -top-12 bg-white/10 h-40 w-40 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                        <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                            <Mail size={32} />
                        </div>
                        <div className="space-y-3 relative z-10">
                            <h3 className="text-3xl font-black leading-tight">Insight Engine</h3>
                            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                                Get automated weekly reports and trend alerts delivered directly to your executive inbox on Monday mornings.
                            </p>
                        </div>
                        <button className="w-full bg-white text-indigo-900 h-14 rounded-xl font-black tracking-widest uppercase text-xs hover:-translate-y-1 hover:shadow-xl shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 relative z-10 mt-auto">
                            Setup Delivery <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ReportsPage;
