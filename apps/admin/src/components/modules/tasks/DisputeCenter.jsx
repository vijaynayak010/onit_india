import React from 'react';
import { AlertTriangle, User, MessageSquare, History, CheckCircle, XCircle } from 'lucide-react';

const DisputeCenter = () => {
    const disputes = [
        {
            id: 'DIS-902',
            task: 'Home Interior Painting',
            plaintiff: 'Rahul Sharma (Provider)',
            defendant: 'Amit Patel (Performer)',
            reason: 'Payment delayed after 90% completion',
            status: 'Open',
            timeline: [
                { time: '10:00 AM', event: 'Dispute opened by Rahul Sharma', type: 'open' },
                { time: '11:30 AM', event: 'Evidence uploaded by Performer', type: 'info' },
                { time: '02:15 PM', event: 'Admin (Avi) assigned to case', type: 'admin' },
            ]
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" size={24} />
                    Dispute Resolution Center
                </h2>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                    3 Active Cases
                </span>
            </div>

            {disputes.map((dispute) => (
                <div key={dispute.id} className="card overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{dispute.task}</h3>
                                <p className="text-sm text-slate-500">Case ID: {dispute.id} • {dispute.reason}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                View Evidence
                            </button>
                            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-blue-500/10">
                                Intervene
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        {/* Involved Parties */}
                        <div className="p-6 space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parties Involved</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">Plaintiff</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900">{dispute.plaintiff.split(' (')[0]}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">Defendant</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900">{dispute.defendant.split(' (')[0]}</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 border border-blue-100 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all">
                                <MessageSquare size={14} />
                                Open Group Chat
                            </button>
                        </div>

                        {/* Case Timeline */}
                        <div className="p-6 col-span-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <History size={14} /> Case Timeline
                            </h4>
                            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                {dispute.timeline.map((event, idx) => (
                                    <div key={idx} className="relative">
                                        <div className={`absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white ring-4 ring-slate-50 ${event.type === 'open' ? 'bg-orange-500' :
                                            event.type === 'admin' ? 'bg-blue-500' : 'bg-slate-300'
                                            }`} />
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-slate-400 w-16 uppercase">{event.time}</span>
                                            <p className="text-sm font-medium text-slate-700">{event.event}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DisputeCenter;
