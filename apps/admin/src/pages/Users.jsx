import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    UserPlus, UserX, Search, Mail, Phone, Calendar,
    Filter, Loader2, AlertCircle, RefreshCw, ShieldCheck,
    ShieldOff, Star, CheckCircle2, Clock, XCircle, Wallet,
    Globe, Landmark, CreditCard as BankIcon, Eye, User
} from 'lucide-react';
import { 
    listUsersAdmin, 
    blockUserAdmin, 
    activateUserAdmin,
    getUserByIdAdmin,
} from '../services/api';
import DataTable from '../components/common/DataTable.jsx';

// ─── helpers ─────────────────────────────────────────────────────────────────

const getRoleColor = (role) => {
    if (role === 'PROVIDER') return 'bg-emerald-100 text-emerald-700';
    if (role === 'TASKER') return 'bg-violet-100 text-violet-700';
    return 'bg-amber-100 text-amber-700'; // ADMIN
};

const getStatusInfo = (user) => {
    if (user.isBlocked) return { label: 'Blocked', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' };
    if (!user.isActive) return { label: 'Inactive', color: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50' };
    return { label: 'Active', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
};

const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const displayName = (user) =>
    user.taskers?.displayName || user.providers?.displayName || user.email?.split('@')[0] || 'Unknown';

// ─── main component ───────────────────────────────────────────────────────────

const UsersPage = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // filters
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRole, setActiveRole] = useState('all');
    const [activeTab, setActiveTab] = useState('all'); // all | blocked | inactive
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 20;

    const tabs = [
        { id: 'all', label: 'All Accounts' },
        { id: 'blocked', label: 'Blocked' },
        { id: 'inactive', label: 'Inactive' }
    ];

    // ── fetch ──────────────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
            };
            if (activeRole !== 'all') params.role = activeRole.toUpperCase();
            if (activeTab === 'blocked') params.isBlocked = true;
            if (activeTab === 'inactive') params.isActive = false;
            if (searchTerm.trim()) params.search = searchTerm.trim();

            const res = await listUsersAdmin(params);
            setUsers(res.data ?? []);
            setTotal(res.pagination?.total ?? 0);
        } catch (err) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [page, activeRole, activeTab, searchTerm]);

    useEffect(() => { fetchUsers(); }, [page, activeRole, activeTab]);

    // debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            if (page !== 0) {
                setPage(0);
            } else {
                fetchUsers();
            }
        }, 450);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    // ── actions ────────────────────────────────────────────────────────────────
    const handleBlock = async (user) => {
        if (!window.confirm(`${user.isBlocked ? 'Unblock' : 'Block'} ${displayName(user)}?`)) return;
        setActionLoading(true);
        try {
            await blockUserAdmin(user.id, { isBlocked: !user.isBlocked, reason: 'Admin action' });
            fetchUsers();
            setSelectedUser(null);
        } catch (err) {
            alert('Action failed: ' + (err.message || 'Unknown error'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleActivate = async (user) => {
        setActionLoading(true);
        try {
            await activateUserAdmin(user.id, { isActive: !user.isActive });
            fetchUsers();
            setSelectedUser(null);
        } catch (err) {
            alert('Action failed: ' + (err.message || 'Unknown error'));
        } finally {
            setActionLoading(false);
        }
    };
 
    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setLoadingDetail(true);
        try {
            const detailRes = await getUserByIdAdmin(user.id);
            const detail = detailRes.data || detailRes;
            setSelectedUser(prev => ({ ...prev, ...detail }));
        } catch (err) {
            console.error('Failed to fetch user details:', err);
        } finally {
            setLoadingDetail(false);
        }
    };

    useEffect(() => {
        if (!userId) return;

        let isMounted = true;
        const fetchUserDetail = async () => {
            setLoadingDetail(true);
            try {
                const detailRes = await getUserByIdAdmin(userId);
                const detail = detailRes.data || detailRes;
                if (isMounted) setSelectedUser(detail);
            } catch (err) {
                console.error('Failed to fetch user details:', err);
                if (isMounted) alert('Failed to load user detail: ' + (err.message || 'Unknown error'));
            } finally {
                if (isMounted) setLoadingDetail(false);
            }
        };

        fetchUserDetail();
        return () => { isMounted = false; };
    }, [userId]);

    const closeUserDetail = () => {
        setSelectedUser(null);
        if (userId) navigate('/users');
    };

    // columns
    const usersColumns = [
        {
            header: 'USER',
            key: 'email',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm flex-shrink-0 overflow-hidden">
                        {row.profilePicUrl ? <img src={row.profilePicUrl} alt="" className="h-full w-full object-cover" /> : (val?.charAt(0) || displayName(row)?.charAt(0) || '?').toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 leading-tight">{row.taskers?.displayName || row.providers?.displayName || val?.split('@')[0] || 'Unknown'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{val || 'No email provided'}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'ROLE',
            key: 'role',
            render: (val) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getRoleColor(val)}`}>
                    {val}
                </span>
            )
        },
        {
            header: 'STATUS',
            key: 'isActive',
            render: (val, row) => {
                const s = getStatusInfo(row);
                return (
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${s.bg}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${s.text}`}>{s.label}</span>
                    </div>
                );
            }
        },
        {
            header: 'KYC',
            key: 'kycStatus',
            render: (val) => (
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                    val === 'VERIFIED' ? 'text-emerald-500' :
                    val === 'PENDING' ? 'text-orange-500' :
                    'text-slate-300'
                }`}>
                    {val || 'NONE'}
                </span>
            )
        },
        {
            header: 'TASKS',
            key: 'tasks',
            render: (_, row) => <span className="font-bold text-slate-700">{row._count?.tasks ?? row.taskers?.completedTasksCount ?? '—'}</span>
        },
        {
            header: 'WALLET',
            key: 'wallet',
            render: (_, row) => <span className="font-bold text-slate-700">{row.wallets?.balanceAmount != null ? `₹${row.wallets.balanceAmount.toLocaleString('en-IN')}` : '—'}</span>
        },
        {
            header: 'ACTION',
            key: 'actions',
            render: (_, row) => (
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => handleSelectUser(row)}
                        className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all border border-slate-100"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleBlock(row)}
                        className={`p-1.5 rounded-lg transition-all ${row.isBlocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-400 hover:bg-red-50'}`}
                        title={row.isBlocked ? 'Unblock' : 'Block'}
                    >
                        {row.isBlocked ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                    </button>
                </div>
            )
        }
    ];

    if (error && !users.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
                <div className="p-4 bg-red-50 rounded-full text-red-500"><AlertCircle size={36} /></div>
                <p className="font-bold text-slate-800">{error}</p>
                <button onClick={fetchUsers} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">
                    <RefreshCw size={16} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        {loading ? 'Loading…' : `${total.toLocaleString()} total users`}
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-px gap-4">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setPage(0); }}
                                className={`relative pb-4 px-1 text-sm font-black whitespace-nowrap transition-all ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        {['all', 'provider', 'tasker'].map(r => (
                            <button
                                key={r}
                                onClick={() => { setActiveRole(r); setPage(0); }}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeRole === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {r === 'all' ? 'All Roles' : r === 'provider' ? 'Providers' : 'Taskers'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by email..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                {loading && !users.length && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                    </div>
                )}
                
                {users.length > 0 ? (
                    <DataTable 
                        columns={usersColumns} 
                        data={users} 
                        onRowClick={handleSelectUser}
                    />
                ) : !loading && (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                        <User size={48} className="text-slate-200 mb-4" />
                        <p className="font-bold text-slate-700">No users found!</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {selectedUser && (() => {
                const u = selectedUser;
                const status = getStatusInfo(u);
                const name = displayName(u);
                const isTasker = u.role === 'TASKER';
                const isProvider = u.role === 'PROVIDER';

                return (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-300">
                        <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-400">
                            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-black text-slate-900">User Details</h2>
                                    {loadingDetail && <Loader2 size={16} className="animate-spin text-emerald-500" />}
                                </div>
                                <button onClick={closeUserDetail} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">✕</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-7 space-y-8 custom-scrollbar">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative group">
                                        <div className="h-24 w-24 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-black mb-3 border-4 border-white shadow-lg overflow-hidden capitalize">
                                            {u.profilePicUrl ? <img src={u.profilePicUrl} alt={name} className="w-full h-full object-cover" /> : name[0]}
                                        </div>
                                        {u.emailVerified && (
                                            <div className="absolute bottom-4 right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Email">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{name}</h3>
                                    <p className="text-slate-400 text-sm font-medium mt-1">{u.email}</p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getRoleColor(u.role)}`}>{u.role}</span>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.text}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${status.color}`} />
                                            {status.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: <CheckCircle2 size={14} />, label: 'Tasks', value: u._count?.tasks ?? u.taskers?.completedTasksCount ?? '0' },
                                        { icon: <Star size={14} />, label: 'Rating', value: u.taskers?.ratingAvg ? u.taskers.ratingAvg.toFixed(1) : (u.ratingAvg ? u.ratingAvg.toFixed(1) : '—') },
                                        { icon: <Wallet size={14} />, label: 'Balance', value: u.wallets?.balanceAmount != null ? `₹${u.wallets.balanceAmount.toLocaleString('en-IN')}` : '₹0' },
                                    ].map(s => (
                                        <div key={s.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100/50">
                                            <div className="flex justify-center text-emerald-600 mb-1.5 opacity-70">{s.icon}</div>
                                            <p className="text-base font-black text-slate-900">{s.value}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {(isTasker && (u.taskers?.bio || u.taskers?.profession || u.taskers?.skills?.length > 0)) && (
                                    <div className="space-y-4 pt-2">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <span className="h-px bg-slate-100 flex-1" />
                                            Performer Profile
                                            <span className="h-px bg-slate-100 flex-1" />
                                        </h4>
                                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                            {u.taskers?.profession && (
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Profession</p>
                                                    <p className="text-sm font-bold text-slate-800">{u.taskers.profession}</p>
                                                </div>
                                            )}
                                            {u.taskers?.bio && (
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">About</p>
                                                    <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{u.taskers.bio}"</p>
                                                </div>
                                            )}
                                            {u.taskers?.skills?.length > 0 && (
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Skills</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {u.taskers.skills.map(s => (
                                                            <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {(isProvider && (u.provider?.organization || u.provider?.locationCity)) && (
                                    <div className="space-y-4 pt-2">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <span className="h-px bg-slate-100 flex-1" />
                                            Provider Identity
                                            <span className="h-px bg-slate-100 flex-1" />
                                        </h4>
                                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                            {u.provider?.organization && (
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Organization</p>
                                                    <p className="text-sm font-black text-emerald-700">{u.provider.organization}</p>
                                                </div>
                                            )}
                                            {u.provider?.username && (
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Public Handle</p>
                                                    <p className="text-sm font-bold text-slate-800">@{u.provider.username}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 pt-2">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                        <span className="h-px bg-slate-100 flex-1" />
                                        Performance & Metadata
                                        <span className="h-px bg-slate-100 flex-1" />
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Lifetime Earnings</p>
                                            <p className="text-lg font-black text-slate-900">₹{(u.taskers?.totalEarnings ?? 0).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Referral Count</p>
                                            <p className="text-lg font-black text-slate-900">{u.provider?.referralCount ?? 0}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-slate-50/30 p-4 rounded-2xl border border-slate-50">
                                        <div className="flex items-center gap-3 text-xs">
                                            <Mail size={14} className="text-slate-300 flex-shrink-0" />
                                            <span className="font-bold text-slate-700">{u.email}</span>
                                            {u.emailVerified ? <span className="text-[9px] font-black text-blue-500 uppercase ml-auto">Verified</span> : <span className="text-[9px] font-black text-red-400 uppercase ml-auto">Unverified</span>}
                                        </div>
                                        {(u.taskers?.phoneNumber || u.provider?.phoneNumber) && (
                                            <div className="flex items-center gap-3 text-xs">
                                                <Phone size={14} className="text-slate-300 flex-shrink-0" />
                                                <span className="font-bold text-slate-700">{u.taskers?.phoneNumber || u.provider?.phoneNumber}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-xs">
                                            <Calendar size={14} className="text-slate-300 flex-shrink-0" />
                                            <span className="font-bold text-slate-700">Joined {formatDate(u.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                            <Clock size={14} className="text-slate-300 flex-shrink-0" />
                                            <span className="font-bold text-slate-700">Last Active: {formatDate(u.updatedAt)}</span>
                                        </div>
                                        {(u.taskers?.locationCity || u.provider?.locationCity) && (
                                            <div className="flex items-center gap-3 text-xs">
                                                <Globe size={14} className="text-slate-300 flex-shrink-0" />
                                                <span className="font-bold text-slate-700">{u.taskers?.locationCity || u.provider?.locationCity}</span>
                                            </div>
                                        )}
                                    </div>

                                {(u.payoutMethods?.length > 0 || isTasker || isProvider) && (
                                    <div className="space-y-4 pt-2">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <span className="h-px bg-slate-100 flex-1" />
                                            Registered Bank Accounts
                                            <span className="h-px bg-slate-100 flex-1" />
                                        </h4>
                                        
                                        <div className="space-y-3">
                                            {u.payoutMethods?.map((method, idx) => {
                                                const details = method.details || {};
                                                const isUpi = method.type === 'UPI';
                                                
                                                return (
                                                    <div key={method.id || idx} className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/50 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-white rounded-lg border border-emerald-100 text-emerald-600 shadow-sm font-black text-[10px]">
                                                                    {isUpi ? 'UPI' : <BankIcon size={18} />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                        {isUpi ? 'UPI Provider' : 'Bank Name'}
                                                                    </p>
                                                                    <p className="text-sm font-black text-slate-800">
                                                                        {isUpi 
                                                                            ? (details.upiId?.split('@')[1]?.toUpperCase() || 'UPI LIB')
                                                                            : (details.bankName || 'Standard Bank')
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {method.isVerified && (
                                                                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-tighter rounded-full">Verified</span>
                                                            )}
                                                        </div>

                                                        {isUpi ? (
                                                            <div className="bg-white/50 p-3 rounded-xl border border-emerald-100/20">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-tighter">UPI ID</p>
                                                                <p className="text-sm font-black text-slate-800 tracking-tight">{details.upiId || '—'}</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="grid grid-cols-2 gap-4 bg-white/50 p-3 rounded-xl border border-emerald-100/20">
                                                                    <div>
                                                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-tighter">Acc. Holder</p>
                                                                        <p className="text-[11px] font-bold text-slate-700 truncate">{details.holderName || details.accountHolder || 'N/A'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-tighter">IFSC Code</p>
                                                                        <p className="text-[11px] font-bold text-slate-700">{details.ifscCode || '—'}</p>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-tighter">Account Number</p>
                                                                    <p className="text-sm font-black text-slate-800 tracking-widest">
                                                                        {details.accountNumber ? `•••• •••• ${String(details.accountNumber).slice(-4)}` : '•••• ••••'}
                                                                    </p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {(!u.payoutMethods || u.payoutMethods.length === 0) && (
                                                <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-200 text-center">
                                                    <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 mb-3 border border-slate-100 shadow-sm">
                                                        <BankIcon size={24} />
                                                    </div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">No Bank Details</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">User has not added any payout methods yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                </div>
                            </div>

                            <div className="p-7 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleBlock(u)}
                                    disabled={actionLoading}
                                    className={`py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 ${u.isBlocked
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/10'
                                            : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                                        }`}
                                >
                                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : u.isBlocked ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                                    {u.isBlocked ? 'Unblock' : 'Block User'}
                                </button>
                                <button
                                    onClick={() => handleActivate(u)}
                                    disabled={actionLoading}
                                    className={`py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 ${u.isActive
                                            ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {u.isActive ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                    {u.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default UsersPage;
