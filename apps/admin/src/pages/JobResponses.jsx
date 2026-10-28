import React, { useState, useEffect, useCallback } from 'react';
import { 
    Users, Search, Filter, Loader2, AlertCircle, 
    RefreshCw, Mail, Phone, Calendar, Clock, 
    MoreHorizontal, X, FileText, CheckCircle2,
    Briefcase, ExternalLink, User
} from 'lucide-react';
import { 
    listCareerApplicationsAdmin, 
    updateCareerApplicationStatusAdmin 
} from '../services/api';
import DataTable from '../components/common/DataTable.jsx';

const JobResponsesPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Backend returns { data: [...], pagination: {...} } — the API helper unwraps `response.data`
            // so `res` is the object. Older deployments may return a raw array; handle both.
            const res = await listCareerApplicationsAdmin({ limit: 100 });
            const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
            setApplications(list);
        } catch (err) {
            setError(err?.message || 'Failed to load job applications. Confirm you are signed in as an admin.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleUpdateStatus = useCallback(async (id, newStatus) => {
        setUpdateLoading(true);
        try {
            await updateCareerApplicationStatusAdmin(id, { status: newStatus });
            // Local update for responsiveness
            setApplications(prev => prev.map(app => 
                app.id === id ? { ...app, status: newStatus } : app
            ));
            if (selectedApp && selectedApp.id === id) {
                setSelectedApp({ ...selectedApp, status: newStatus });
            }
        } catch (err) {
            alert('Status update failed: ' + (err.message || 'Unknown error'));
        } finally {
            setUpdateLoading(false);
        }
    }, [selectedApp]);

    const getStatusColor = (status) => {
        const s = String(status).toLowerCase();
        if (s.includes('hired') || s.includes('accepted')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s.includes('reject')) return 'bg-rose-100 text-rose-700 border-rose-200';
        if (s.includes('interview')) return 'bg-violet-100 text-violet-700 border-violet-200';
        if (s.includes('shortlist')) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-slate-100 text-slate-600 border-slate-200';
    };

    const columns = [
        {
            header: 'CANDIDATE',
            key: 'name',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm flex-shrink-0">
                        <User size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 leading-tight">{val}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'JOB TITLE',
            key: 'jobTitle',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">{val || 'General Application'}</span>
                </div>
            )
        },
        {
            header: 'APPLIED ON',
            key: 'createdAt',
            render: (val) => (
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">{new Date(val).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            header: 'STATUS',
            key: 'status',
            render: (val) => (
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusColor(val)}`}>
                    {val || 'Pending'}
                </span>
            )
        },
        {
            header: 'ACTIONS',
            key: 'id',
            render: (id, row) => (
                <div className="flex items-center justify-end" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => setSelectedApp(row)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100 text-[11px] font-bold uppercase tracking-wider"
                    >
                        View Details
                        <ExternalLink size={12} />
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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Responses</h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        {loading ? 'Fetching candidate data…' : `Managing ${applications.length} candidate applications`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchApplications}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Sync Apps
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200/60">
                {['ALL', 'NEW', 'SHORTLISTED', 'REVIEWING', 'HIRED', 'REJECTED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            filterStatus === status 
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        {status === 'REVIEWING' ? 'Interview' : status === 'ALL' ? 'Show All' : status}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                {loading && !applications.length && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Scanning Submissions...</p>
                    </div>
                )}
                
                {error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Sync Interrupted</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-1 mb-6 text-sm">{error}</p>
                        <button onClick={fetchApplications} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider">
                            Reconnect Now
                        </button>
                    </div>
                )}

                {!loading && !error && applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                        <Users size={48} className="text-slate-200 mb-4" />
                        <p className="font-bold text-slate-700">No applications yet</p>
                        <p className="text-sm">New job responses from the careers portal will appear here.</p>
                    </div>
                ) : !error && (
                    <DataTable
                        columns={columns}
                        data={applications.filter(app => {
                            if (filterStatus === 'ALL') return true;
                            // "NEW" maps to backend's null/empty status (applications without explicit triage state)
                            if (filterStatus === 'NEW') return !app.status || app.status === 'NEW';
                            return app.status === filterStatus;
                        })}
                        onRowClick={setSelectedApp}
                    />
                )}
            </div>

            {/* Application Detail Sidebar/Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-end animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                        <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-2xl shadow-inner uppercase">
                                    {selectedApp.name?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                        {selectedApp.name}
                                    </h2>
                                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1">
                                        Candidate Detail
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedApp(null)}
                                className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                        <Mail size={12} /> Email Address
                                    </p>
                                    <p className="text-sm font-bold text-slate-700 break-all">{selectedApp.email}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                        <Phone size={12} /> Phone Number
                                    </p>
                                    <p className="text-sm font-bold text-slate-700">{selectedApp.phone || selectedApp.phoneNumber || 'Not Provided'}</p>
                                </div>
                            </div>

                            {/* Job Info */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 border-b border-slate-100 pb-3">Application Intent</h3>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-slate-900">Applying for: {selectedApp.jobTitle || 'General Application'}</p>
                                        <p className="text-xs text-slate-400 mt-1">Applied on {new Date(selectedApp.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Note / Message */}
                            {(selectedApp.coverNote || selectedApp.note) && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 border-b border-slate-100 pb-3">Cover Note</h3>
                                    <div className="p-5 rounded-3xl bg-slate-50/50 border border-dashed border-slate-200 text-slate-600 text-sm leading-relaxed font-medium italic">
                                        &ldquo;{selectedApp.coverNote || selectedApp.note || 'No cover note provided.'}&rdquo;
                                    </div>
                                </div>
                            )}

                            {/* Resume Link */}
                            {(() => {
                                // The backend resolves portfolioUrl server-side using S3 env vars and a legacy uploads
                                // fallback. We prefer the backend-provided value first; only construct an S3 URL
                                // ourselves if the value looks like a bare filename (no slashes).
                                const raw = selectedApp.portfolioFileName?.trim();
                                const s3Bucket = 'onit-india-app-uploads';
                                const s3Region = 'ap-south-1';
                                let s3Fallback = null;
                                if (raw && !/^https?:\/\//i.test(raw)) {
                                    // If the value already contains a path segment, treat it as an S3 key.
                                    const key = raw.includes('/') ? raw : `candidate-resumes/careers/${raw}`;
                                    s3Fallback = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${encodeURI(key)}`;
                                } else if (raw) {
                                    s3Fallback = raw; // already an absolute URL
                                }
                                const finalUrl = selectedApp.portfolioUrl
                                    || selectedApp.portfolioFileUrl
                                    || selectedApp.resumeUrl
                                    || s3Fallback;

                                if (finalUrl) {
                                    return (
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 border-b border-slate-100 pb-3">Documents</h3>
                                            <a 
                                                href={finalUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 font-bold text-sm transition-all hover:bg-emerald-100 hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-600 text-white rounded-lg">
                                                        <FileText size={18} />
                                                    </div>
                                                    <span>View Resume / CV</span>
                                                </div>
                                                <ExternalLink size={16} />
                                            </a>
                                            {!selectedApp.portfolioFileUrl && !selectedApp.portfolioUrl && (
                                                <p className="text-[9px] text-slate-400 italic">Attempting cloud/relative recovery...</p>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 border-b border-slate-100 pb-3">Documents</h3>
                                        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 text-xs font-medium italic flex items-center gap-2">
                                            <div className="p-2 bg-slate-200 text-slate-500 rounded-lg">
                                                <FileText size={14} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-600 not-italic">Resume: Not uploaded</p>
                                                <p className="mt-0.5 text-[10px]">No file found in cloud storage. Please contact candidate.</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Status Management Footer */}
                        <div className="p-8 border-t border-slate-100 bg-slate-50/30 space-y-4">
                            <div className="flex items-center justify-between pr-1">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Update Application Status</p>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                    <Clock size={10} />
                                    Current: {selectedApp.status || 'Pending'}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Shortlist', status: 'SHORTLISTED', color: 'bg-amber-600' },
                                    { label: 'Interview', status: 'REVIEWING', color: 'bg-violet-600' },
                                    { label: 'Hire', status: 'HIRED', color: 'bg-emerald-600' },
                                    { label: 'Reject', status: 'REJECTED', color: 'bg-rose-600' }
                                ].map((btn) => (
                                    <button
                                        key={btn.status}
                                        onClick={() => handleUpdateStatus(selectedApp.id, btn.status)}
                                        disabled={updateLoading || selectedApp.status === btn.status}
                                        className={`h-11 rounded-xl text-white font-black text-[11px] uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${btn.color} ${selectedApp.status === btn.status ? 'ring-4 ring-offset-2 ring-slate-900/5 ring-slate-900 border-2 border-white' : 'shadow-black/5 hover:brightness-110'}`}
                                    >
                                        {updateLoading ? 'Applying...' : btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobResponsesPage;
