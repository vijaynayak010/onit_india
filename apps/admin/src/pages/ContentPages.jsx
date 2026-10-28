import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    Check, 
    Save, 
    RefreshCw, 
    Mail, 
    Loader2, 
    AlertCircle 
} from 'lucide-react';
import { 
    getContentPagesAdmin, 
    getContentPageAdmin, 
    updateContentPageAdmin 
} from '../services/api';

const ContentPages = () => {
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const [content, setContent] = useState('');
    const [sendEmail, setSendEmail] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        try {
            const data = await getContentPagesAdmin();
            setPages(data);
            if (data.length > 0) {
                // If a page was already selected, keep it, otherwise select the first one
                const currentSlug = selectedPage?.slug || data[0].slug;
                const page = data.find(p => p.slug === currentSlug) || data[0];
                handleSelectPage(page);
            }
        } catch (err) {
            console.error("Failed to load content pages:", err);
            setErrorMsg("Failed to load policy pages. Please check if backend service is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPage = async (page) => {
        setSelectedPage(page);
        setSaveStatus('idle');
        setSendEmail(false);
        try {
            const details = await getContentPageAdmin(page.slug);
            setContent(details.content?.en || '');
        } catch (err) {
            console.error("Failed to load page details:", err);
            setContent('');
        }
    };

    const handleContentChange = (val) => {
        setContent(val);
        if (saveStatus === 'saved') {
            setSaveStatus('idle');
        }
    };

    const handleSave = async () => {
        if (!selectedPage) return;
        setSaveStatus('saving');
        try {
            await updateContentPageAdmin(selectedPage.slug, {
                content: { en: content },
                sendEmailNotification: sendEmail
            });
            setSaveStatus('saved');
            setSendEmail(false);
            // Refresh pages list to update timestamps
            loadPages();
        } catch (err) {
            console.error("Failed to save changes:", err);
            setSaveStatus('error');
        }
    };

    if (loading && pages.length === 0) {
        return (
            <div className="flex h-[calc(100vh-120px)] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    <p className="text-slate-500 font-bold text-sm tracking-wider uppercase">Loading Content Pages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-6 py-4">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Content Pages</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage system policies, legal pages, and user guides dynamically.</p>
                </div>
                <button 
                    onClick={loadPages}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                    <RefreshCw size={13} /> Refresh
                </button>
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs font-semibold">
                    <AlertCircle size={18} /> {errorMsg}
                </div>
            )}

            {/* Top horizontally scrolling page cards (as in mock screen) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pages.map((p) => {
                    const isSelected = selectedPage?.slug === p.slug;
                    return (
                        <button
                            key={p.slug}
                            onClick={() => handleSelectPage(p)}
                            className={`flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 ${
                                isSelected 
                                    ? 'bg-emerald-50/50 border-emerald-500 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500' 
                                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    <FileText size={14} />
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 leading-snug">{p.title}</h3>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                                Last Updated: {new Date(p.updatedAt).toLocaleDateString()}
                            </p>
                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                                {p.description || `Manage dynamic content values for ${p.title}.`}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Editor Workspace Panel */}
            {selectedPage && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Workspace Header */}
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                                <FileText size={18} />
                            </div>
                            <div>
                                <h2 className="font-bold text-base text-slate-900 leading-snug">{selectedPage.title}</h2>
                                <p className="text-slate-500 text-xs mt-0.5">{selectedPage.description}</p>
                            </div>
                        </div>

                        {/* Save status badge */}
                        <div>
                            {saveStatus === 'saving' && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                    <Loader2 size={13} className="animate-spin" /> Saving Changes...
                                </div>
                            )}
                            {saveStatus === 'saved' && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                                    <Check size={13} /> Saved
                                </div>
                            )}
                            {saveStatus === 'error' && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                    <AlertCircle size={13} /> Save Failed
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editor Help */}
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/10">
                        <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                            Content
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                            Use markdown syntax for rich headings and links
                        </span>
                    </div>

                    {/* Editor Textarea */}
                    <div className="p-5">
                        <textarea
                            value={content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            className="w-full h-96 p-4 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                            placeholder="Enter policy details..."
                        />
                        <div className="mt-1 flex justify-end">
                            <span className="text-[10px] text-slate-400 font-bold">
                                {content?.length || 0} characters
                            </span>
                        </div>
                    </div>

                    {/* Footer Actions Panel */}
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Email check trigger */}
                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                            <input
                                type="checkbox"
                                checked={sendEmail}
                                onChange={(e) => setSendEmail(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="flex items-center gap-1.5">
                                <Mail size={15} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                                <span className="text-slate-700 text-xs font-semibold">
                                    Broadcast policy update email to all registered users
                                </span>
                            </div>
                        </label>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saveStatus === 'saving'}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/10 hover:shadow-lg"
                        >
                            <Save size={14} /> Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentPages;
