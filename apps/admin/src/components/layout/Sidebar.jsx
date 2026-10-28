 import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    ClipboardCheck,
    Wallet,
    ShieldCheck,
    MessageSquare,
    BarChart3,
    Briefcase,
    Bell,
    Settings,
    Search,
    LogOut,
    ChevronDown,
    ChevronRight,
    Headset,
    Gift,
    AlertTriangle,
    Home,
    FileText,
    Mail,
    Tags,
    UserCheck,
    BookOpen,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdminFeatureAccess } from '../../hooks/useAdminFeatureAccess';
import { ADMIN_FEATURES, hasAdminFeature } from '../../utils/adminFeatureAccess';
import {
    listTaskApprovalsAdmin,
    listDisputesAdmin,
    getPendingKyc,
    listTicketsAdmin,
} from '../../services/api';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const { logout } = useAuth();
    const { loading: accessLoading, features } = useAdminFeatureAccess();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState(['Support']);
    const [alertCounts, setAlertCounts] = useState({
        '/task-approvals': 0,
        '/disputes': 0,
        '/verify-performers': 0,
        '/support/tickets': 0,
    });

    useEffect(() => {
        const fetchAlertCounts = async () => {
            if (!localStorage.getItem('admin_token')) return;
            try {
                const [approvalsRes, disputesRes, kycRes, ticketsRes] = await Promise.allSettled([
                    listTaskApprovalsAdmin({ limit: 1 }),
                    listDisputesAdmin({ status: 'PENDING', limit: 1 }),
                    getPendingKyc({ limit: 1 }),
                    listTicketsAdmin({ status: 'OPEN', limit: 1 }),
                ]);

                const getCount = (res) => {
                    if (res.status !== 'fulfilled') return 0;
                    const val = res.value?.pagination?.total ?? res.value?.total ?? res.value?.data?.length ?? (Array.isArray(res.value) ? res.value.length : 0);
                    return val || 0;
                };

                setAlertCounts({
                    '/task-approvals': getCount(approvalsRes),
                    '/disputes': getCount(disputesRes),
                    '/verify-performers': getCount(kycRes),
                    '/support/tickets': getCount(ticketsRes),
                });
            } catch (err) {
                // Silent fail for polling
            }
        };

        fetchAlertCounts();
        const interval = setInterval(fetchAlertCounts, 30 * 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleMenu = (label) => {
        setOpenMenus(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const canAccess = (feature) => !feature || accessLoading || hasAdminFeature(features, feature);

    const menuItemsRaw = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Search size={20} />, label: 'Admin Search', path: '/search' },
        { icon: <Users size={20} />, label: 'User Management', path: '/users' },
        { icon: <ClipboardList size={20} />, label: 'Tasks', path: '/tasks', feature: ADMIN_FEATURES.TASKS },
        { icon: <ClipboardCheck size={20} />, label: 'Task Approvals', path: '/task-approvals', feature: ADMIN_FEATURES.TASKS },
        { icon: <Tags size={20} />, label: 'Service Pricing', path: '/service-pricing', feature: ADMIN_FEATURES.TASKS },
        { icon: <Wallet size={20} />, label: 'Finance', path: '/finance', feature: ADMIN_FEATURES.FINANCE },
        { icon: <ShieldCheck size={20} />, label: 'KYC', path: '/verify-performers', feature: ADMIN_FEATURES.KYC },
        { icon: <UserCheck size={20} />, label: 'Performer Access', path: '/performer-access', feature: ADMIN_FEATURES.KYC },
        { icon: <BookOpen size={20} />, label: 'Performer Growth', path: '/performer-growth', feature: ADMIN_FEATURES.KYC },
        { icon: <MessageSquare size={20} />, label: 'Moderation', path: '/moderation' },
        { icon: <AlertTriangle size={20} />, label: 'Disputes', path: '/disputes', feature: ADMIN_FEATURES.TASKS },
        {
            icon: <Headset size={20} />,
            label: 'Support',
            feature: ADMIN_FEATURES.SUPPORT,
            isDropdown: true,
            children: [
                { label: 'Tickets', path: '/support/tickets', feature: ADMIN_FEATURES.SUPPORT },
                { label: 'Live Chat', path: '/support/live-chat', feature: ADMIN_FEATURES.SUPPORT }
            ]
        },
        { icon: <BarChart3 size={20} />, label: 'Reports', path: '/reports' },
        { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
        { icon: <Mail size={20} />, label: 'Email Logs', path: '/email-monitoring' },
        { icon: <Home size={20} />, label: 'Home Dynamic', path: '/home-dynamic' },
        { icon: <FileText size={20} />, label: 'Content Pages', path: '/content-pages' },
        {
            icon: <Gift size={20} />,
            label: 'Promotions',
            isDropdown: true,
            children: [
                { label: 'Referral Program', path: '/promotions/referrals' },
                { label: 'Coupons', path: '/promotions/coupons' },
                { label: 'Promotional Vouchers', path: '/promotions/promotional-vouchers' },
            ]
        },
        {
            icon: <Briefcase size={20} />,
            label: 'Careers',
            isDropdown: true,
            children: [
                { label: 'Job Board', path: '/careers' },
                { label: 'Job Responses', path: '/careers/responses' }
            ]
        },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
        { icon: <ShieldCheck size={20} />, label: 'Admin Access', path: '/settings/access', feature: ADMIN_FEATURES.ACCESS_MANAGEMENT },
    ];

    const menuItems = menuItemsRaw
        .map((item) => {
            if (!item.children) return item;
            return {
                ...item,
                children: item.children.filter((child) => canAccess(child.feature)),
            };
        })
        .filter((item) => canAccess(item.feature) && (!item.children || item.children.length > 0));

    // Effect to auto-expand menus if a child is active
    React.useEffect(() => {
        if (isCollapsed) return;
        menuItems.forEach(item => {
            if (item.children?.some(child => location.pathname === child.path)) {
                if (!openMenus.includes(item.label)) {
                    setOpenMenus(prev => [...prev, item.label]);
                }
            }
        });
    }, [location.pathname, isCollapsed]);

    return (
        <aside className={`fixed left-0 top-0 h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-white text-slate-900 flex flex-col z-50 border-r border-slate-200 group/sidebar`}>
            {/* Premium Floating Border Toggle */}
            <button
                onClick={toggleSidebar}
                className={`absolute -right-3.5 top-12 h-7 w-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:border-emerald-400 hover:text-emerald-600 transition-all z-[60] group/toggle opacity-0 group-hover/sidebar:opacity-100`}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                <ChevronRight
                    size={14}
                    className={`transition-transform duration-500 ease-out ${isCollapsed ? '' : 'rotate-180'} group-hover/toggle:scale-110`}
                />
            </button>

            <div className={`transition-all duration-300 flex items-center ${isCollapsed ? 'p-6 justify-center' : 'p-8 gap-3'}`}>
                <div className={`h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center font-black text-lg text-white shadow-xl shadow-emerald-500/30 transform transition-transform duration-500 ${isCollapsed ? '' : 'hover:rotate-12'}`}>
                    O
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                            OnIT <span className="text-emerald-600">INDIA</span>
                        </h1>
                        <span className="text-[10px] font-bold text-emerald-600 tracking-widest mt-0.5">ADMIN</span>
                    </div>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
                {menuItems.map((item) => {
                    const isOpen = openMenus.includes(item.label);
                    const hasActiveChild = item.children?.some(child => location.pathname === child.path);
                    const alertCount = item.path && alertCounts[item.path]
                        ? alertCounts[item.path]
                        : (item.children ? item.children.reduce((acc, c) => acc + (alertCounts[c.path] || 0), 0) : 0);
                    const hasAlert = alertCount > 0;

                    if (isCollapsed) {
                        const isActive = location.pathname === item.path || hasActiveChild;
                        return (
                            <NavLink
                                key={item.label}
                                to={item.path || (item.children ? item.children[0].path : '#')}
                                className={`relative flex items-center justify-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-50'
                                    : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                                    }`}
                                title={item.label}
                            >
                                <span className={`${isActive ? 'text-white' : 'group-hover:text-emerald-600'} transition-transform duration-300 group-hover:scale-110`}>
                                    {item.icon}
                                </span>
                                {hasAlert && (
                                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                        {alertCount > 99 ? '99+' : alertCount}
                                    </span>
                                )}
                            </NavLink>
                        );
                    }

                    return (
                        <div key={item.label} className="space-y-1">
                            {item.isDropdown ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.label)}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isOpen || hasActiveChild ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`${isOpen || hasActiveChild ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'} transition-colors duration-300 relative`}>
                                                {item.icon}
                                            </span>
                                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasAlert && (
                                                <span className="bg-rose-500 text-white font-black text-[10px] h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                                    {alertCount > 99 ? '99+' : alertCount}
                                                </span>
                                            )}
                                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                                        </div>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'
                                        }`}>
                                        <div className="pl-11 space-y-1 border-l ml-6 border-slate-200">
                                            {item.children.map((child) => {
                                                const childCount = alertCounts[child.path] || 0;
                                                return (
                                                    <NavLink
                                                        key={child.path}
                                                        to={child.path}
                                                        className={({ isActive }) =>
                                                            `flex items-center justify-between py-2 text-sm font-bold transition-all duration-200 ${isActive
                                                                ? 'text-emerald-600'
                                                                : 'text-slate-500 hover:text-emerald-600'
                                                            }`
                                                        }
                                                    >
                                                        <span>{child.label}</span>
                                                        {childCount > 0 && (
                                                            <span className="bg-rose-500 text-white font-black text-[9px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm animate-pulse mr-2">
                                                                {childCount > 99 ? '99+' : childCount}
                                                            </span>
                                                        )}
                                                    </NavLink>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/dashboard'}
                                    className={({ isActive }) =>
                                        `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                            : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'} transition-transform duration-300 group-hover:scale-110`}>
                                                    {item.icon}
                                                </span>
                                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                            </div>
                                            {hasAlert && (
                                                <span className="bg-rose-500 text-white font-black text-[10px] h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                                    {alertCount > 99 ? '99+' : alertCount}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    onClick={logout}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 w-full text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group font-bold text-sm`}
                    title={isCollapsed ? "Sign Out" : ""}
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    {!isCollapsed && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
