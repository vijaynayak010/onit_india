import React, { useState } from 'react';
import {
    Trash2,
    Search,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Database
} from 'lucide-react';
import Toast from '../components/common/Toast.jsx';

import { 
    listUsersAdmin, 
    listTasksAdmin, 
    bulkDeleteUsersAdmin, 
    bulkDeleteTasksAdmin 
} from '../services/api.js';

const DeletionPage = () => {
    const [toast, setToast] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletionStatus, setDeletionStatus] = useState(null);
    const [itemType, setItemType] = useState('user');
    const [hardDelete, setHardDelete] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const filteredItems = items.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (
            item.name.toLowerCase().includes(searchLower) ||
            item.email.toLowerCase().includes(searchLower) ||
            item.type.toLowerCase().includes(searchLower)
        );
    });

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setToast({ message: 'Please enter a search query.', type: 'error' });
            return;
        }
        setIsSearching(true);
        try {
            let res;
            if (itemType === 'user') {
                res = await listUsersAdmin({ search: searchQuery, limit: 10 });
                setItems(res.data.map(u => ({
                    id: u.id,
                    name: u.email,
                    email: u.role,
                    status: u.isBlocked ? 'blocked' : 'active',
                    createdAt: new Date(u.createdAt).toLocaleDateString()
                })));
            } else if (itemType === 'task') {
                res = await listTasksAdmin({ search: searchQuery, limit: 10 });
                setItems(res.data.map(t => ({
                    id: t.id,
                    name: t.title,
                    email: `ID: ${t.id.split('-')[0]}...`,
                    status: t.status,
                    createdAt: new Date(t.createdAt).toLocaleDateString()
                })));
            } else {
                setToast({ message: 'Transaction search not yet implemented in backend.', type: 'warning' });
                setItems([]);
            }
            setDeletionStatus('pending');
        } catch (error) {
            setToast({ message: 'Search failed.', type: 'error' });
        } finally {
            setIsSearching(false);
        }
    };

    const handleDelete = async () => {
        const idsToDelete = selectedIds.length > 0 ? selectedIds : items.map(i => i.id);
        
        if (idsToDelete.length === 0) {
            setToast({ message: 'No items selected for deletion.', type: 'error' });
            return;
        }

        if (!window.confirm(`Are you sure you want to ${hardDelete ? 'PERMANENTLY DELETE' : 'Suspend/Cancel'} ${idsToDelete.length} items? This cannot be undone.`)) return;

        setIsDeleting(true);
        setDeletionStatus('processing');

        try {
            if (itemType === 'user') {
                await bulkDeleteUsersAdmin({ 
                    userIds: idsToDelete, 
                    reason: 'Admin Global Deletion Request',
                    hard: hardDelete 
                });
            } else if (itemType === 'task') {
                await bulkDeleteTasksAdmin({ 
                    taskIds: idsToDelete, 
                    reason: 'Admin Global Deletion Request' 
                });
            } else {
                throw new Error('Deletion for this type not supported yet.');
            }
            
            setItems(items.filter(item => !idsToDelete.includes(item.id)));
            setSelectedIds([]);
            setDeletionStatus('success');
            setToast({ message: `${idsToDelete.length} items processed successfully.`, type: 'success' });
            setSearchQuery('');
        } catch (error) {
            setDeletionStatus('error');
            setToast({ message: error.message || 'Deletion failed.', type: 'error' });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusCheck = () => {
        if (!searchQuery.trim()) {
            setToast({ message: 'Please enter an ID or name to check status.', type: 'error' });
            return;
        }
        setDeletionStatus('pending');
    };

    const resetStatus = () => {
        setDeletionStatus(null);
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Deletion</h1>
                    <p className="text-slate-500 mt-1 font-medium">Permanently remove data from the system.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                    <h3 className="px-4 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Item Type</h3>
                    {[
                        { id: 'user', label: 'Users', icon: <Search size={16} /> },
                        { id: 'task', label: 'Tasks', icon: <Database size={16} /> },
                        { id: 'transaction', label: 'Transactions', icon: <Database size={16} /> }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => { setItemType(type.id); resetStatus(); }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${itemType === type.id
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <span className={itemType === type.id ? 'text-emerald-500' : ''}>{type.icon}</span>
                            {type.label}
                        </button>
                    ))}
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="card p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                                <Trash2 size={18} />
                            </div>
                            <h3 className="font-black text-slate-900">Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Enter {itemType} ID or Name
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); resetStatus(); }}
                                    placeholder={`Enter ${itemType} ID or name to search...`}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:ring-4 focus:ring-red-500/5 focus:border-red-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-red-500" size={18} />
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Permanent Deletion</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Toggle for hard-delete (permanent) vs soft-delete (suspend).</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setHardDelete(!hardDelete)}
                                className={`w-12 h-6 rounded-full transition-all relative ${hardDelete ? 'bg-red-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hardDelete ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="flex-1 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                {isSearching ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                                {isSearching ? 'Searching...' : 'Search'}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting || (items.length === 0 && !searchQuery.trim())}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-black shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <RefreshCw className="animate-spin" size={18} />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                                {isDeleting ? 'Deleting...' : selectedIds.length > 0 ? `Delete (${selectedIds.length})` : 'Delete All'}
                            </button>
                        </div>
                    </div>

                    {deletionStatus && (
                        <div className={`card p-6 border-l-4 ${deletionStatus === 'success' ? 'border-l-emerald-500 bg-emerald-50' : deletionStatus === 'error' ? 'border-l-red-500 bg-red-50' : deletionStatus === 'processing' ? 'border-l-blue-500 bg-blue-50' : 'border-l-amber-500 bg-amber-50'}`}>
                            <div className="flex items-center gap-4">
                                {deletionStatus === 'pending' && (
                                    <>
                                        <AlertTriangle className="text-amber-500" size={24} />
                                        <div>
                                            <h4 className="font-black text-slate-900">Status: Pending</h4>
                                            <p className="text-sm text-slate-500">Item found. Ready for deletion.</p>
                                        </div>
                                    </>
                                )}
                                {deletionStatus === 'processing' && (
                                    <>
                                        <RefreshCw className="text-blue-500 animate-spin" size={24} />
                                        <div>
                                            <h4 className="font-black text-slate-900">Status: Processing</h4>
                                            <p className="text-sm text-slate-500">Deleting item from database...</p>
                                        </div>
                                    </>
                                )}
                                {deletionStatus === 'success' && (
                                    <>
                                        <CheckCircle className="text-emerald-500" size={24} />
                                        <div>
                                            <h4 className="font-black text-slate-900">Status: Success</h4>
                                            <p className="text-sm text-slate-500">Item has been permanently deleted.</p>
                                        </div>
                                    </>
                                )}
                                {deletionStatus === 'error' && (
                                    <>
                                        <XCircle className="text-red-500" size={24} />
                                        <div>
                                            <h4 className="font-black text-slate-900">Status: Error</h4>
                                            <p className="text-sm text-slate-500">Failed to delete item. Please try again.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {filteredItems.length > 0 && (
                        <div className="card p-6 space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                                    <Database size={18} />
                                </div>
                                <h3 className="font-black text-slate-900">Search Results</h3>
                            </div>

                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${selectedIds.includes(item.id) ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}
                                        onClick={() => {
                                            if (selectedIds.includes(item.id)) {
                                                setSelectedIds(selectedIds.filter(id => id !== item.id));
                                            } else {
                                                setSelectedIds([...selectedIds, item.id]);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shadow-sm transition-all ${selectedIds.includes(item.id) ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                                                {selectedIds.includes(item.id) ? <CheckCircle size={16} /> : <Trash2 size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'active' || item.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {item.status}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">{item.createdAt}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="card p-6 bg-red-900 border-none shadow-xl shadow-red-900/10">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-red-400">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm">Warning: Permanent Action</h4>
                                <p className="text-white/40 text-[11px] mt-0.5 font-medium">
                                    Deleted data cannot be recovered. Please ensure you have the correct ID before proceeding with deletion.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default DeletionPage;
