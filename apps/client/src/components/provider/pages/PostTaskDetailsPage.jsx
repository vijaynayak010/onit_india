import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProviderHeader from '../components/ProviderHeader';
import { Paperclip, X, Loader2, Plus, Tag, Calendar, IndianRupee, Sparkles, Home, ChevronRight } from 'lucide-react';
import { getPresignedUrl, confirmUpload, createTask } from '../services/api';
import axios from 'axios';

const PREDEFINED_SKILLS = {
    "web-design": ["React", "Node.js", "WordPress", "Tailwind", "Next.js", "Shopify"],
    "mobile-app": ["Flutter", "React Native", "Swift", "Kotlin", "Firebase", "Android Studio"],
    "ui-ux": ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Branding"],
    "content": ["SEO Writing", "Copywriting", "Creative Writing", "Blogging", "Editing", "Ghostwriting"],
    "marketing": ["SMM", "SEO", "PPC", "Email Marketing", "Brand Strategy", "Content Strategy"],
    "data": ["Excel", "SQL", "Python", "Tableau", "Data Scraping", "Machine Learning"],
    "video": ["Adobe Premiere", "After Effects", "Motion Graphics", "Color Grading", "2D Animation", "TikTok Edits"],
    "other": ["Customer Support", "Data Entry", "Virtual Assistant", "Logo Design", "Translator"]
};

const PostTaskDetailsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const aiData = location.state?.aiGeneratedData;
    const templateData = location.state?.templateData;

    // Helper to extract budget amount from string
    const parseBudgetAmount = (str) => {
        if (!str) return "";
        const cleanStr = String(str).replace(/[₹,Rs.]/g, "");
        const match = cleanStr.match(/\d+/);
        return match ? match[0] : "";
    };

    const [taskTitle, setTaskTitle] = useState(templateData?.title || aiData?.title || "");
    const [taskDescription, setTaskDescription] = useState(templateData?.description || aiData?.description || "I want a task description for Web designing.");
    const [budget, setBudget] = useState(parseBudgetAmount(templateData?.budget || aiData?.budget_range || ""));
    const [budgetType, setBudgetType] = useState(templateData?.taskType || "Fixed");
    const [deadline, setDeadline] = useState("");
    const [taskType, setTaskType] = useState("Remote");

    // Skills State
    const [skills, setSkills] = useState(templateData?.skills || aiData?.skills || []);
    const [skillInput, setSkillInput] = useState("");

    // Attachment State
    const [fileIds, setFileIds] = useState([]);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const fileInputRef = useRef(null);

    // Conditions State
    const [conditions, setConditions] = useState([]);
    const [conditionInput, setConditionInput] = useState("");

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            for (const file of files) {
                const ext = file.name.split('.').pop();
                const uploadData = await getPresignedUrl({
                    folder: 'task-files',
                    extension: ext,
                    contentType: file.type
                });

                const { uploadUrl, s3Key } = uploadData;
                await axios.put(uploadUrl, file, {
                    headers: { 'Content-Type': file.type }
                });

                const confirmedFile = await confirmUpload({
                    s3Key,
                    filename: file.name,
                    contentType: file.type,
                    sizeBytes: file.size
                });

                const newFile = {
                    id: confirmedFile.id,
                    name: file.name,
                    url: confirmedFile.url
                };

                setFileIds(prev => [...prev, confirmedFile.id]);
                setAttachedFiles(prev => [...prev, newFile]);
            }
        } catch (err) {
            console.error("[UPLOAD ERROR]", err);
            alert("Failed to upload file. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeFile = (id) => {
        setFileIds(prev => prev.filter(fid => fid !== id));
        setAttachedFiles(prev => prev.filter(f => f.id !== id));
    };

    const addSkill = (skill) => {
        if (skill && !skills.includes(skill)) {
            setSkills([...skills, skill]);
        }
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const addCondition = () => {
        const val = conditionInput.trim();
        if (val !== "" && !conditions.includes(val)) {
            if (conditions.length >= 20) {
                alert("You can add up to 20 conditions.");
                return;
            }
            setConditions([...conditions, val]);
            setConditionInput("");
        }
    };

    const removeCondition = (indexToRemove) => {
        setConditions(conditions.filter((_, index) => index !== indexToRemove));
    };

    const handleNext = () => {
        if (!taskTitle.trim() || !taskDescription.trim() || !budget.trim()) {
            alert("Please provide a title, description, and budget.");
            return;
        }
        setIsPreview(true);
    };

    const handlePost = async (status = "PUBLISHED") => {
        setIsProcessing(true);
        try {
            const amt = parseInt(budget, 10) || 0;
            const taskData = {
                title: taskTitle,
                description: taskDescription,
                priceAmount: amt,
                priceCurrency: "INR",
                dueAt: deadline === 'ASAP' ? new Date().toISOString() : 
                       deadline === 'Within a week' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() :
                       new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: status,
                fileIds: fileIds,
                category: templateData?.category || aiData?.category || "General",
                skills: skills,
                details: {
                    budgetRange: budget,
                    budgetMin: amt,
                    budgetMax: amt,
                    budgetType: budgetType,
                    deadlineType: deadline,
                    taskType: taskType,
                    source: aiData ? "AI" : "TEMPLATE",
                    filesCount: fileIds.length,
                    conditions: conditions,
                }
            };

            const response = await createTask(taskData);
            const taskId = response.id || response.data?.id;
            
            // Clear tasks cache
            sessionStorage.removeItem("onit_provider_tasks_cache");
            sessionStorage.removeItem("onit_provider_dashboard_cache");

            if (status === "DRAFT") {
                navigate("/provider/my-tasks", { state: { tab: "Draft" } });
            } else {
                navigate(`/provider/task-applicants?taskId=${taskId}`);
            }
        } catch (err) {
            console.error("Failed to create task", err);
            alert("Failed to create task. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isPreview) {
        return (
            <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-16 pt-[80px] font-sans text-[var(--color-text)] antialiased">
                <ProviderHeader activePage="my-tasks" />
                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-[32px]">Preview your summary</h1>
                        <p className="mt-2 text-[15px] font-medium text-[var(--color-text-muted)]">Check your details before publishing.</p>
                    </div>

                    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-md)]">
                        <div className="p-6 sm:p-8 space-y-8">
                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="md:col-span-2 space-y-6">
                                    <section>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)] mb-2">Task Title</h3>
                                        <p className="text-xl font-bold text-[var(--color-text)]">{taskTitle}</p>
                                    </section>
                                    <section>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)] mb-2">Description</h3>
                                        <p className="text-sm font-semibold leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">{taskDescription}</p>
                                    </section>
                                    {skills.length > 0 && (
                                        <section>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)] mb-2">Skills Required</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-[var(--color-border)] rounded-full text-[11px] font-bold text-[var(--color-text)]">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                                <div className="space-y-6 rounded-2xl bg-[var(--color-surface)] p-6 border border-[var(--color-border)]">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 border border-[var(--color-border)] rounded-xl bg-white flex items-center justify-center text-sky-600"><Calendar size={20} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-[var(--color-text-subtle)]">Deadline</p>
                                            <p className="text-sm font-bold">{deadline || "Flexible"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 border border-[var(--color-border)] rounded-xl bg-white flex items-center justify-center text-orange-600"><IndianRupee size={20} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-[var(--color-text-subtle)]">Budget</p>
                                            <p className="text-base font-bold text-[var(--color-text)]">₹{budget || "0"} ({budgetType})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 border border-[var(--color-border)] rounded-xl bg-white flex items-center justify-center text-violet-600"><Sparkles size={20} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-[var(--color-text-subtle)]">Work Type</p>
                                            <p className="text-sm font-bold">{taskType}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {conditions.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)] mb-3">Task Conditions</h3>
                                    <div className="space-y-2">
                                        {conditions.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-primary-subtle)] text-[11px] font-bold text-[var(--color-primary)] flex-shrink-0">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm font-bold text-[var(--color-text)]">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {attachedFiles.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-subtle)] mb-3">Attachments</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {attachedFiles.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-[11px] font-bold text-[var(--color-text-muted)] shadow-sm"><Paperclip size={14} />{f.name}</div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] bg-[var(--color-border-subtle)]/30 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            <button type="button" onClick={() => setIsPreview(false)} className="rounded-full border-2 border-[var(--color-border)] bg-white px-8 py-3 text-[15px] font-bold text-[var(--color-text-muted)] transition hover:bg-gray-50 active:scale-[0.98]">Edit details</button>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <button type="button" onClick={() => handlePost("DRAFT")} disabled={isProcessing} className="rounded-full border-2 border-[var(--color-border)] bg-white px-8 py-3 text-[15px] font-bold text-[var(--color-text-muted)] transition hover:bg-gray-50 active:scale-[0.98]">
                                    Save as Draft
                                </button>
                                <button type="button" onClick={() => handlePost("PUBLISHED")} disabled={isProcessing} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-10 py-3 text-[15px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-70">
                                    {isProcessing && <Loader2 className="animate-spin" size={18} />}
                                    {isProcessing ? "Publishing..." : "Publish Task Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-surface)] font-sans text-[var(--color-text)] antialiased">
            <ProviderHeader activePage="home" />

            <div className="flex items-center gap-2 px-6 sm:px-10 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                <div className="flex items-center gap-2 text-[var(--color-text-subtle)] text-[14px] font-semibold cursor-pointer hover:text-[var(--color-primary)] transition" onClick={() => navigate('/provider/dashboard')}>
                    <Home size={16} /> Home
                </div>
                <ChevronRight size={14} className="text-[var(--color-border)]" />
                <div className="flex items-center gap-2 text-[var(--color-text-subtle)] text-[14px] font-semibold cursor-pointer hover:text-[var(--color-primary)] transition" onClick={() => navigate('/provider/post-task-selection')}>
                    Post Task
                </div>
                <ChevronRight size={14} className="text-[var(--color-border)]" />
                <span className="text-[var(--color-primary)] text-[14px] font-bold">Refine Details</span>
            </div>

            <main className="flex-1 overflow-y-auto px-6 py-8 sm:py-12 flex flex-col items-center">
                <div className="w-full max-w-[800px]">
                    <div className="text-center mb-10">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                            <Sparkles size={14} /> AI-Assisted
                        </div>
                        <h1 className="text-[32px] sm:text-[42px] font-bold text-[var(--color-text)] mb-2">Almost done!</h1>
                        <p className="text-[18px] sm:text-[20px] text-[var(--color-text-muted)] font-medium">Refine These details to get the best matches.</p>
                    </div>

                    <div className="space-y-8 bg-white p-6 sm:p-10 rounded-[var(--radius-2xl)] border border-[var(--color-border)] shadow-sm">
                        <div className="flex flex-col gap-3">
                            <label className="text-[18px] font-bold text-[var(--color-text)]">Task Title</label>
                            <input
                                type="text"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder='Enter task title...'
                                className="w-full px-6 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[16px] font-semibold focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[18px] font-bold text-[var(--color-text)]">Task Description</label>
                            <textarea
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                placeholder='Detailed description...'
                                className="w-full h-40 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[16px] font-semibold focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <label className="text-[18px] font-bold text-[var(--color-text)]">Work Setting</label>
                                <div className="flex gap-2">
                                    {["Remote", "On-site"].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setTaskType(type)}
                                            className={`flex-1 py-4 rounded-[var(--radius-sm)] border-2 font-bold transition-all ${taskType === type ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40"}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[18px] font-bold text-[var(--color-text)]">Deadline</label>
                                <select
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full px-6 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[16px] font-semibold focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select timeline</option>
                                    <option>ASAP</option>
                                    <option>Within a week</option>
                                    <option>Flexible</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <label className="text-[18px] font-bold text-[var(--color-text)]">Budget Estimation (₹)</label>
                                <input
                                    type="text"
                                    placeholder="Enter budget amount"
                                    value={budget}
                                    onChange={(e) => {
                                        const digits = e.target.value.replace(/\D/g, "");
                                        setBudget(digits);
                                    }}
                                    className="w-full px-6 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[16px] font-semibold focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[18px] font-bold text-[var(--color-text)]">Budget Type</label>
                                <div className="flex gap-2">
                                    {["Fixed", "Hourly"].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setBudgetType(type)}
                                            className={`flex-1 py-4 rounded-[var(--radius-sm)] border-2 font-bold transition-all ${budgetType === type ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40"}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[18px] font-bold text-[var(--color-text)]">Skills Required</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(PREDEFINED_SKILLS[templateData?.category || aiData?.category] || PREDEFINED_SKILLS["other"]).map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => addSkill(skill)}
                                        className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${skills.includes(skill) ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)]"}`}
                                    >
                                        + {skill}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-gray-50/30 p-4">
                                {skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[var(--color-text)] border border-[var(--color-border)] shadow-sm"
                                    >
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(idx)} className="text-red-400 hover:text-red-600">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                {skills.length === 0 && <span className="text-xs font-semibold text-gray-400">No skills selected</span>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[18px] font-bold text-[var(--color-text)] flex items-center justify-between">
                                <span>Conditions to follow</span>
                                <span className="text-[10px] text-[var(--color-text-subtle)] font-bold">{conditions.length}/20</span>
                            </label>
                            <p className="text-[12px] font-medium text-[var(--color-text-subtle)] -mt-2 mb-2">Add conditions that the performer must follow when executing this task.</p>
                            
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={conditionInput}
                                    onChange={(e) => setConditionInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addCondition();
                                        }
                                    }}
                                    placeholder="e.g. Work must be submitted in Figma format"
                                    className="flex-1 px-6 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[16px] font-semibold focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={addCondition}
                                    className="h-14 px-6 rounded-[var(--radius-sm)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-bold text-sm transition hover:bg-[var(--color-primary)] hover:text-white"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="space-y-2">
                                {conditions.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-gray-50/50 px-4 py-3 transition hover:border-[var(--color-primary)]/30 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--color-primary-subtle)] text-[11px] font-bold text-[var(--color-primary)] flex-shrink-0">
                                                {idx + 1}
                                            </div>
                                            <span className="text-sm font-bold text-[var(--color-text)]">{item}</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeCondition(idx)} 
                                            className="text-[var(--color-text-subtle)] hover:text-red-500 transition-colors p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                {conditions.length === 0 && (
                                    <div className="text-center py-6 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-sm)] bg-gray-50/30">
                                        <p className="text-xs font-bold text-[var(--color-text-subtle)]">No conditions added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <label className="text-[18px] font-bold text-[var(--color-text)]">Attachments <span className="font-normal text-[var(--color-text-subtle)]">(optional)</span></label>
                            <div className="flex flex-wrap gap-3">
                                {attachedFiles.map((file) => (
                                    <div key={file.id} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-[var(--radius-sm)]">
                                        <Paperclip size={16} className="text-emerald-600" />
                                        <span className="text-[13px] font-bold text-slate-700 max-w-[150px] truncate">{file.name}</span>
                                        <button onClick={() => removeFile(file.id)} className="text-red-400 hover:text-red-600 transition-colors"><X size={14} /></button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 px-5 py-3 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-sm)] text-[14px] font-bold text-[var(--color-text-subtle)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all"
                                >
                                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                    {isUploading ? 'Uploading...' : 'Add Files'}
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <button 
                                onClick={handleNext}
                                className="w-full sm:flex-1 py-4 bg-[var(--color-primary)] text-white rounded-full text-[16px] font-bold hover:bg-[var(--color-primary-hover)] transition-all shadow-[var(--shadow-glow)]"
                            >
                                Review & Preview
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[14px] text-[var(--color-text-subtle)] font-medium mt-8 mb-10">
                        You can update these details anytime after posting.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default PostTaskDetailsPage;
