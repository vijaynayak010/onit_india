import React, { useState, useEffect } from 'react';
import {
    HelpCircle,
    Search,
    BookOpen,
    ShieldCheck,
    CreditCard,
    Plus,
    FileText,
    ExternalLink,
    Star,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Save,
    X
} from 'lucide-react';
import Toast from '../../components/common/Toast.jsx';
import {
    listFaqAdmin,
    createFaqAdmin,
    updateFaqAdmin,
    deleteFaqAdmin
} from '../../services/api';


const HelpCenterPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        question: '',
        answer: '',
        category: 'General',
        order: 0,
        isActive: true
    });

    const categories = ['General', 'Payment', 'Account', 'Tasks', 'Security'];

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await listFaqAdmin();
            setFaqs(res || []);
        } catch (error) {
            setToast({ message: 'Failed to fetch FAQs.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFaq) {
                await updateFaqAdmin(editingFaq.id, form);
                setToast({ message: 'FAQ updated successfully.', type: 'success' });
            } else {
                await createFaqAdmin(form);
                setToast({ message: 'FAQ created successfully.', type: 'success' });
            }
            setIsModalOpen(false);
            setEditingFaq(null);
            setForm({ question: '', answer: '', category: 'General', order: 0, isActive: true });
            fetchData();
        } catch (error) {
            setToast({ message: 'Operation failed.', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            await deleteFaqAdmin(id);
            setToast({ message: 'FAQ deleted.', type: 'success' });
            fetchData();
        } catch (error) {
            setToast({ message: 'Delete failed.', type: 'error' });
        }
    };

    const toggleActive = async (faq) => {
        try {
            await updateFaqAdmin(faq.id, { isActive: !faq.isActive });
            setToast({ message: `FAQ ${faq.isActive ? 'deactivated' : 'activated'}.`, type: 'success' });
            fetchData();
        } catch (error) {
            setToast({ message: 'Toggle failed.', type: 'error' });
        }
    };

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Grouping for the list view
    const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
        if (!acc[faq.category]) acc[faq.category] = [];
        acc[faq.category].push(faq);
        return acc;
    }, {});

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <HelpCircle className="text-accent" /> FAQ Management
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Create and manage help articles for users.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingFaq(null);
                        setForm({ question: '', answer: '', category: 'General', order: 0, isActive: true });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2 px-8 py-3.5 shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
                >
                    <Plus size={20} />
                    <span>Add New Article</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['All', ...categories].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-accent/5 transition-all"
                    />
                </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-12">
                {Object.keys(groupedFaqs).length > 0 ? (
                    Object.entries(groupedFaqs).map(([category, items]) => (
                        <div key={category} className="space-y-6">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="h-px bg-slate-100 flex-1" />
                                {category}
                                <span className="h-px bg-slate-100 flex-1" />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {items.sort((a, b) => a.order - b.order).map((faq) => (
                                    <div key={faq.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${faq.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {faq.isActive ? 'Active' : 'Inactive'}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingFaq(faq);
                                                            setForm({ ...faq });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(faq.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 mb-3">{faq.question}</h4>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed italic line-clamp-3">"{faq.answer}"</p>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Order: {faq.order}</span>
                                            <button
                                                onClick={() => toggleActive(faq)}
                                                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${faq.isActive ? 'text-orange-500' : 'text-emerald-500'
                                                    }`}
                                            >
                                                {faq.isActive ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                                {faq.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="font-bold text-lg">No FAQs found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-2xl font-black text-slate-900">{editingFaq ? 'Edit FAQ Item' : 'Create New FAQ'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Display Order</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all"
                                        value={form.order}
                                        onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Question</label>
                                <input
                                    required
                                    placeholder="Enter common user question..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all"
                                    value={form.question}
                                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Answer</label>
                                <textarea
                                    required
                                    rows="5"
                                    placeholder="Provide a detailed and helpful response..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all resize-none"
                                    value={form.answer}
                                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="w-5 h-5 accent-accent"
                                    checked={form.isActive}
                                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-sm font-black text-slate-700 select-none">Make this FAQ visible to users immediately</label>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-slate-900/20"
                                >
                                    <Save size={18} />
                                    {editingFaq ? 'Save Updates' : 'Publish Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};


export default HelpCenterPage;
