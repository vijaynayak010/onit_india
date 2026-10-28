import React, { useState, useEffect, useCallback } from 'react';
import { 
    Briefcase, Plus, Search, Filter, Loader2, AlertCircle, 
    RefreshCw, Edit2, Trash2, Calendar, MapPin, Clock, 
    MoreHorizontal, X, Layout, FileText, List, CheckCircle2
} from 'lucide-react';
import { 
    listCareersAdmin, 
    createCareerAdmin, 
    updateCareerAdmin, 
    deleteCareerAdmin 
} from '../services/api';
import DataTable from '../components/common/DataTable.jsx';

const CareersPage = () => {
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCareer, setEditingCareer] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        type: 'Full-time',
        location: 'Remote',
        description: '',
        responsibilities: '',
        requirements: '',
        applicationProcess: '',
        deadline: ''
    });

    const fetchCareers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await listCareersAdmin();
            // The backend might return { data: [...] } or just [...]
            setCareers(Array.isArray(res) ? res : (res.data || []));
        } catch (err) {
            setError(err.message || 'Failed to load careers');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCareers();
    }, [fetchCareers]);

    const handleOpenModal = (career = null) => {
        if (career) {
            setEditingCareer(career);
            setFormData({
                title: career.title || '',
                department: career.department || '',
                type: career.type || 'Full-time',
                location: career.location || 'Remote',
                description: career.description || '',
                responsibilities: Array.isArray(career.responsibilities) ? career.responsibilities.join('\n') : (career.responsibilities || ''),
                requirements: Array.isArray(career.requirements) ? career.requirements.join('\n') : (career.requirements || ''),
                applicationProcess: Array.isArray(career.applicationProcess) ? career.applicationProcess.join('\n') : (career.applicationProcess || ''),
                deadline: career.deadline ? new Date(career.deadline).toISOString().split('T')[0] : ''
            });
        } else {
            setEditingCareer(null);
            setFormData({
                title: '',
                department: '',
                type: 'Full-time',
                location: 'Remote',
                description: '',
                responsibilities: '',
                requirements: '',
                applicationProcess: '',
                deadline: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCareer(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this career post?')) return;
        try {
            await deleteCareerAdmin(id);
            fetchCareers();
        } catch (err) {
            alert('Deletion failed: ' + (err.message || 'Unknown error'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const payload = {
                ...formData,
                responsibilities: formData.responsibilities.split('\n').filter(line => line.trim() !== ''),
                requirements: formData.requirements.split('\n').filter(line => line.trim() !== ''),
                applicationProcess: formData.applicationProcess.split('\n').filter(line => line.trim() !== ''),
            };

            if (editingCareer) {
                await updateCareerAdmin(editingCareer.id, payload);
            } else {
                await createCareerAdmin(payload);
            }
            
            handleCloseModal();
            fetchCareers();
        } catch (err) {
            alert('Operation failed: ' + (err.message || 'Unknown error'));
        } finally {
            setFormLoading(false);
        }
    };

    const columns = [
        {
            header: 'JOB TITLE',
            key: 'title',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                        <Briefcase size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 leading-tight">{val}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{row.department}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'TYPE',
            key: 'type',
            render: (val) => (
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    val === 'Full-time' ? 'bg-emerald-100 text-emerald-700' : 
                    val === 'Internship' ? 'bg-violet-100 text-violet-700' : 
                    'bg-amber-100 text-amber-700'
                }`}>
                    {val}
                </span>
            )
        },
        {
            header: 'LOCATION',
            key: 'location',
            render: (val) => (
                <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={14} />
                    <span className="text-xs font-bold">{val}</span>
                </div>
            )
        },
        {
            header: 'DEADLINE',
            key: 'deadline',
            render: (val) => (
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{val ? new Date(val).toLocaleDateString() : 'No deadline'}</span>
                </div>
            )
        },
        {
            header: 'STATUS',
            key: 'isActive',
            render: (val) => (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${val !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${val !== false ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-wider">{val !== false ? 'Active' : 'Closed'}</span>
                </div>
            )
        },
        {
            header: 'ACTIONS',
            key: 'id',
            render: (id, row) => (
                <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100"
                        title="Edit Post"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(id)}
                        className="p-1.5 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all border border-slate-100"
                        title="Delete Post"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Careers Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        {loading ? 'Synchronizing job board…' : `Managing ${careers.length} open positions`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchCareers}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Sync
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        Post New Job
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                {loading && !careers.length && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Careers...</p>
                    </div>
                )}
                
                {error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Connection Failed</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-1 mb-6 text-sm">{error}</p>
                        <button onClick={fetchCareers} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider">
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && careers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                        <Briefcase size={48} className="text-slate-200 mb-4" />
                        <p className="font-bold text-slate-700">No career posts yet</p>
                        <p className="text-sm mb-6">Click the button above to create your first job posting.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
                        >
                            Quick Post
                        </button>
                    </div>
                ) : !error && (
                    <DataTable 
                        columns={columns} 
                        data={careers}
                        onRowClick={handleOpenModal}
                    />
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-none">
                                    {editingCareer ? 'Edit Career Post' : 'Post New Job'}
                                </h2>
                                <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Job Details & Requirements</p>
                            </div>
                            <button 
                                onClick={handleCloseModal}
                                className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Job Title *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Senior Frontend Engineer"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all"
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Department *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Engineering"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all"
                                        value={formData.department}
                                        onChange={e => setFormData({...formData, department: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Job Type *</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Location *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Bengaluru (Remote)"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all"
                                        value={formData.location}
                                        onChange={e => setFormData({...formData, location: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Deadline</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all"
                                        value={formData.deadline}
                                        onChange={e => setFormData({...formData, deadline: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Job Description *</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Provide a high-level overview of the role..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between pr-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Key Responsibilities</label>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">One per line</span>
                                </div>
                                <textarea
                                    rows={4}
                                    placeholder="Enter responsibilities, one per line..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all resize-none"
                                    value={formData.responsibilities}
                                    onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between pr-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Requirements</label>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">One per line</span>
                                </div>
                                <textarea
                                    rows={4}
                                    placeholder="Enter requirements, one per line..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all resize-none"
                                    value={formData.requirements}
                                    onChange={e => setFormData({...formData, requirements: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between pr-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Application Process</label>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">One per line</span>
                                </div>
                                <textarea
                                    rows={4}
                                    placeholder="e.g. 1. HR Screening&#10;2. Technical Round..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all resize-none"
                                    value={formData.applicationProcess}
                                    onChange={e => setFormData({...formData, applicationProcess: e.target.value})}
                                />
                            </div>
                        </form>

                        <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50 sticky bottom-0">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={formLoading}
                                className="flex items-center gap-2 bg-slate-900 text-white h-11 px-8 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50"
                            >
                                {formLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                {editingCareer ? 'Update Posting' : 'Publish Posting'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareersPage;
