import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Home,
    ChevronRight,
    LayoutGrid,
    ListTodo,
    Calendar,
    IndianRupee,
    Tag,
    Sparkles,
    Loader2,
    Paperclip,
    Plus,
    X,
    Phone,
    ChevronDown,
    ChevronUp,
    GripVertical,
    CheckCircle2,
    FileText,
    MapPin,
    PencilLine,
    Send,
    ShieldCheck,
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { createTask, updateTask, attachTaskFiles, getPresignedUrl, confirmUpload, listTaskCatalogDomains, listTaskCatalogServices, updateUserMe, generateAITask } from "../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";

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

const normalizeCategoryText = (value = "") => String(value).trim().toLowerCase();

const getSkillPresetKey = (category = "") => {
    const normalized = normalizeCategoryText(category);
    if (!normalized) return "other";
    if (PREDEFINED_SKILLS[category]) return category;
    if (normalized.includes("business") || normalized.includes("operations")) return "data";
    if (normalized.includes("content") || normalized.includes("writing")) return "content";
    if (normalized.includes("design") || normalized.includes("ui") || normalized.includes("ux")) return "ui-ux";
    if (normalized.includes("marketing")) return "marketing";
    if (normalized.includes("tech") || normalized.includes("data") || normalized.includes("admin") || normalized.includes("development") || normalized.includes("web") || normalized.includes("app")) return "web-design";
    if (normalized.includes("academic") || normalized.includes("knowledge") || normalized.includes("research")) return "data";
    if (normalized.includes("ground") || normalized.includes("local")) return "other";
    return "other";
};

const checklistFrom = (source) => {
    const details = source?.details && typeof source.details === "object" ? source.details : {};
    const values = details.checklist || details.checklists || source?.checklist || source?.checklists || source?.milestones || source?.executionChecklist || source?.execution_checklist || [];
    return (Array.isArray(values) ? values : [])
        .map((item, index) => ({
            title: String(typeof item === "object" ? item?.title || item?.name || "" : item || "").trim(),
            note: String(typeof item === "object" ? item?.note || item?.description || "" : "").trim(),
            order: index,
        }))
        .filter((item) => item.title);
};

const conditionsFrom = (source) => {
    const details = source?.details && typeof source.details === "object" ? source.details : {};
    const values = details.conditions || source?.conditions || [];
    return (Array.isArray(values) ? values : []).map((item) => String(item || "").trim()).filter(Boolean);
};

const PostTaskManualPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);
    const budgetInputRef = useRef(null);
    const aiData = location.state?.aiGeneratedData;
    const templateData = location.state?.templateData;
    const editTask = location.state?.editTask;
    const { user, refreshProfile } = useAuth();

    const isDraftTask = String(editTask?.status || "").toUpperCase() === "DRAFT";
    // Drafts must reopen in the form, not a read-only preview. This also lets
    // older drafts gain the now-required submission checklist before publish.
    const [isPreview, setIsPreview] = useState(Boolean(editTask) && !isDraftTask);
    const [isProcessing, setIsProcessing] = useState(false);

    // Phone number gate
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");
    const [savingPhone, setSavingPhone] = useState(false);
    const [showServiceRequiredModal, setShowServiceRequiredModal] = useState(false);
    const [catalogDomains, setCatalogDomains] = useState([]);
    const [domainsLoading, setDomainsLoading] = useState(true);
    const [domainsError, setDomainsError] = useState("");
    const [catalogServices, setCatalogServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [servicesError, setServicesError] = useState("");
    const [budgetError, setBudgetError] = useState("");

    // Initial skills from AI or empty
    const [skills, setSkills] = useState(editTask?.skills || templateData?.skills || aiData?.required_skills || aiData?.skills || []);
    const [skillInput, setSkillInput] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]); // Display names
    const [fileIds, setFileIds] = useState([]); // Real backend IDs
    const [isUploading, setIsUploading] = useState(false);

    // Conditions State
    const [conditions, setConditions] = useState(() => conditionsFrom(editTask || templateData || aiData));
    const [conditionInput, setConditionInput] = useState("");
    const [checklist, setChecklist] = useState(() => checklistFrom(editTask || templateData || aiData));
    const [checklistInput, setChecklistInput] = useState("");
    const [draggedChecklistIndex, setDraggedChecklistIndex] = useState(null);
    const [selectedChecklistIndex, setSelectedChecklistIndex] = useState(0);
    const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);

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

    const addChecklistItem = () => {
        const title = checklistInput.trim();
        if (!title) return;
        if (checklist.length >= 10) {
            alert("A task journey can have up to 10 checkpoints.");
            return;
        }
        if (checklist.some((item) => item.title.toLowerCase() === title.toLowerCase())) {
            setChecklistInput("");
            return;
        }
        setChecklist((items) => [...items, { title, note: "", order: items.length }]);
        setSelectedChecklistIndex(checklist.length);
        setChecklistInput("");
    };

    const removeChecklistItem = (indexToRemove) => {
        setChecklist((items) => items
            .filter((_, index) => index !== indexToRemove)
            .map((item, index) => ({ ...item, order: index })));
        setSelectedChecklistIndex((selectedIndex) => Math.max(0, Math.min(
            selectedIndex > indexToRemove ? selectedIndex - 1 : selectedIndex,
            Math.max(0, checklist.length - 2),
        )));
    };

    const moveChecklistItem = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= checklist.length || fromIndex === toIndex) return;
        setChecklist((items) => {
            const next = [...items];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next.map((item, index) => ({ ...item, order: index }));
        });
        setSelectedChecklistIndex((selectedIndex) => {
            if (selectedIndex === fromIndex) return toIndex;
            if (fromIndex < selectedIndex && toIndex >= selectedIndex) return selectedIndex - 1;
            if (fromIndex > selectedIndex && toIndex <= selectedIndex) return selectedIndex + 1;
            return selectedIndex;
        });
    };

    const updateChecklistItem = (indexToUpdate, field, value) => {
        setChecklist((items) => items.map((item, index) => (
            index === indexToUpdate ? { ...item, [field]: value } : item
        )));
    };

    const handleGenerateChecklist = async () => {
        if (!formData.title.trim()) {
            alert("Add a task title first — the AI uses it to generate relevant checkpoints.");
            return;
        }
        setIsGeneratingChecklist(true);
        try {
            const prompt = [formData.title, formData.description].filter(Boolean).join("\n\n");
            const res = await generateAITask(prompt);
            const task = res?.data || res;
            const generated = checklistFrom(task);
            if (!generated.length) {
                alert("Couldn't generate checkpoints for this task. Try adding more detail to the title or description.");
                return;
            }
            setChecklist(generated);
            setSelectedChecklistIndex(0);
        } catch (err) {
            console.error("AI checklist generation failed:", err);
            alert("AI generation failed. Please try again.");
        } finally {
            setIsGeneratingChecklist(false);
        }
    };

    // Helper to extract budget amount from string
    const parseBudgetAmount = (str) => {
        if (!str) return "";
        const cleanStr = String(str).replace(/[₹,Rs.]/g, "");
        const match = cleanStr.match(/\d+/);
        return match ? match[0] : "";
    };

    // Helper to map AI categories to local options
    const mapCategory = (cat) => {
        if (!cat) return "";
        const normalized = normalizeCategoryText(cat);
        const map = {
            // AI mapping
            "Development": "Tech, Data & Admin",
            "Design": "Content, Design & Marketing",
            "Marketing": "Content, Design & Marketing",
            "Content": "Content, Design & Marketing",
            "Data": "Tech, Data & Admin",
            "Video": "Content, Design & Marketing",
            "development": "Tech, Data & Admin",
            "design": "Content, Design & Marketing",
            // Template mapping
            "Design Projects": "Content, Design & Marketing",
            "Content Writing": "Content, Design & Marketing",
            "Video Editing": "Content, Design & Marketing",
            "Social Media Management": "Content, Design & Marketing",
            "Web & App Development": "Tech, Data & Admin",
            "Marketing & Ads": "Content, Design & Marketing",
            "Research & Analysis": "Academic & Knowledge Support",
            "Presentation & PPT": "Academic & Knowledge Support",
            "Data Entry & Admin Tasks": "Business Operations & Research",
            "Resume & Portfolio Building": "Content, Design & Marketing",
            "web-design": "Tech, Data & Admin",
            "mobile-app": "Tech, Data & Admin",
            "ui-ux": "Content, Design & Marketing",
            "content": "Content, Design & Marketing",
            "marketing": "Content, Design & Marketing",
            "data": "Tech, Data & Admin",
            "video": "Content, Design & Marketing",
            "other": "Other"
        };
        return map[cat] || map[normalized] || cat;
    };

    const minDateStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const [formData, setFormData] = useState({
        title: editTask?.title || templateData?.title || aiData?.title || "",
        description: editTask?.description || templateData?.description || aiData?.description || "",
        additionalDetails: editTask?.details?.additionalDetails || "",
        category: mapCategory(editTask?.category || templateData?.category || aiData?.category),
        serviceId: editTask?.service?.id || editTask?.serviceId || aiData?.serviceId || aiData?.service_id || "",
        budget: parseBudgetAmount(editTask?.priceAmount || editTask?.budget || templateData?.budget || aiData?.budget),
        budgetType: editTask?.details?.budgetType || editTask?.taskType || templateData?.taskType || "Fixed",
        deadline: editTask?.dueAt ? String(editTask.dueAt).slice(0, 10) : editTask?.deadline || aiData?.deadline || "",
        taskType: editTask?.details?.taskType || editTask?.taskType || templateData?.taskType || "Remote",
    });

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            listTaskCatalogDomains({ launchOnly: true }),
            listTaskCatalogServices({ launchOnly: true }),
        ])
            .then(([domainsResponse, servicesResponse]) => {
                if (cancelled) return;
                const domains = domainsResponse?.data || domainsResponse;
                const services = servicesResponse?.data || servicesResponse;
                setCatalogDomains(Array.isArray(domains) ? domains : []);
                setCatalogServices(Array.isArray(services) ? services : []);
            })
            .catch((err) => {
                if (cancelled) return;
                const message = err?.message || "Unable to load approved task categories and services.";
                setCatalogDomains([]);
                setCatalogServices([]);
                setDomainsError(message);
                setServicesError(message);
            })
            .finally(() => {
                if (!cancelled) {
                    setDomainsLoading(false);
                    setServicesLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const availableCatalogDomains = useMemo(() => {
        const activeServices = catalogServices.filter(
            (service) => service?.isActive !== false && service?.isLaunchVisible !== false
        );

        return catalogDomains.filter((domain) => {
            if (domain?.isActive === false || domain?.isLaunchVisible === false) return false;

            return activeServices.some((service) => (
                String(service?.domainId || service?.domain?.id || "") === String(domain?.id || "")
                || normalizeCategoryText(
                    service?.domain?.name
                    || service?.domain?.title
                    || service?.domainName
                    || service?.category?.name
                    || service?.category
                ) === normalizeCategoryText(domain?.name)
            ));
        });
    }, [catalogDomains, catalogServices]);

    const categoryOptions = useMemo(() => {
        const domains = availableCatalogDomains.map((domain) => ({ value: domain.name, label: domain.name }));
        return [
            {
                value: "",
                label: domainsLoading || servicesLoading ? "Loading categories..." : "Select a category",
            },
            ...domains,
        ];
    }, [availableCatalogDomains, domainsLoading, servicesLoading]);

    const selectedCategoryLabel = useMemo(() => (
        categoryOptions.find((category) => category.value === formData.category)?.label || formData.category || "Other"
    ), [categoryOptions, formData.category]);

    const serviceOptions = useMemo(() => {
        const selectedCategory = normalizeCategoryText(formData.category);
        if (!selectedCategory) return [];
        return catalogServices.filter((service) => {
            const serviceCategory = normalizeCategoryText(
                service?.domain?.name
                || service?.domain?.title
                || service?.domainName
                || service?.category?.name
                || service?.category
            );
            return service?.isActive !== false && service?.isLaunchVisible !== false && serviceCategory === selectedCategory;
        });
    }, [catalogServices, formData.category]);

    const selectedService = useMemo(() => (
        catalogServices.find((service) => service?.id === formData.serviceId) || null
    ), [catalogServices, formData.serviceId]);
    const selectedServiceMinPrice = Number(selectedService?.minPrice ?? 0);

    useEffect(() => {
        if (domainsLoading || servicesLoading || !formData.category) return;
        const matchingDomain = availableCatalogDomains.find(
            (domain) => normalizeCategoryText(domain?.name) === normalizeCategoryText(formData.category)
        );
        if (matchingDomain) {
            if (matchingDomain.name !== formData.category) {
                setFormData((prev) => ({ ...prev, category: matchingDomain.name }));
            }
            return;
        }
        setFormData((prev) => ({ ...prev, category: "", serviceId: "" }));
    }, [availableCatalogDomains, domainsLoading, formData.category, servicesLoading]);

    const selectedServiceLabel = useMemo(() => (
        serviceOptions.find((service) => service?.id === formData.serviceId)?.name
        || catalogServices.find((service) => service?.id === formData.serviceId)?.name
        || ""
    ), [catalogServices, formData.serviceId, serviceOptions]);

    const suggestedSkills = useMemo(() => (
        PREDEFINED_SKILLS[getSkillPresetKey(formData.category)] || PREDEFINED_SKILLS.other
    ), [formData.category]);

    const fieldBase =
        "w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[15px] font-semibold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)]/50 focus:ring-2 focus:ring-[var(--color-primary)]/15 h-12";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "category" || name === "serviceId") setBudgetError("");
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "category" ? { serviceId: "" } : {}),
        }));
    };

    const handleBudgetChange = (e) => {
        const { name, value } = e.target;
        const digits = value.replace(/\D/g, "");
        setFormData((prev) => ({ ...prev, [name]: digits }));
        if (!selectedService || Number(digits || 0) >= selectedServiceMinPrice) {
            setBudgetError("");
        }
    };

    const showBudgetMinimumError = () => {
        const message = `Minimum budget for ${selectedService.name} is ₹${selectedServiceMinPrice.toLocaleString("en-IN")}.`;
        setBudgetError(message);
        setIsPreview(false);

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                budgetInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                budgetInputRef.current?.focus();
            });
        });
    };

    const addSkill = (skillToAdd = null) => {
        const val = (skillToAdd || skillInput).trim();
        if (val !== "" && !skills.includes(val)) {
            setSkills([...skills, val]);
            if (!skillToAdd) setSkillInput("");
        }
    };

    const removeSkill = (indexToRemove) => {
        setSkills(skills.filter((_, index) => index !== indexToRemove));
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            for (const file of files) {
                const ext = file.name.split('.').pop();
                const { uploadUrl, s3Key } = await getPresignedUrl({
                    folder: 'task-files',
                    extension: ext,
                    contentType: file.type
                });

                await axios.put(uploadUrl, file, {
                    headers: { 'Content-Type': file.type }
                });

                const confirmed = await confirmUpload({
                    s3Key,
                    filename: file.name,
                    contentType: file.type,
                    sizeBytes: file.size
                });

                setFileIds(prev => [...prev, confirmed.id]);
                setAttachedFiles((prev) => [...prev, file.name]);
            }
        } catch (err) {
            console.error("Task file upload failed:", err);
            alert("Failed to upload one or more files. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeFile = (indexToRemove) => {
        setAttachedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
        setFileIds((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleNext = (e) => {
        if (e) e.preventDefault();

        // Validation
        const requiredFields = [
            ['title', 'title'],
            ['description', 'description'],
            ['category', 'category'],
            ['serviceId', 'approved service'],
            ['budget', 'budget'],
            ['deadline', 'deadline'],
        ];
        const missingFields = requiredFields
            .filter(([field]) => !String(formData[field]).trim())
            .map(([, label]) => label);

        if (missingFields.length > 0) {
            alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
            return;
        }

        const budget = Number(formData.budget || 0);
        if (selectedService && budget < selectedServiceMinPrice) {
            showBudgetMinimumError();
            return;
        }

        if (checklist.length === 0) {
            alert("Please add at least one checklist item. Performers use it to track and submit their work.");
            return;
        }

        if (checklist.some((item) => !item.title.trim())) {
            alert("Every checkpoint needs a title before you continue.");
            return;
        }

        setIsPreview(true);
    };

    const handleConfirmPost = async (status = "PUBLISHED") => {
        if (status === "DRAFT") {
            await doPublishTask("DRAFT");
            return;
        }
        // Gate: phone number is required to publish
        const phone = user?.phoneNumber || user?.provider?.phoneNumber;
        if (!phone) {
            setPhoneInput("");
            setShowPhoneModal(true);
            return;
        }
        await doPublishTask("PUBLISHED");
    };

    const handleSavePhoneAndPost = async () => {
        if (!phoneInput.trim()) return;
        setSavingPhone(true);
        try {
            await updateUserMe({ phoneNumber: phoneInput.trim() });
            await refreshProfile();
            setShowPhoneModal(false);

            await doPublishTask("PUBLISHED");
        } catch {
            alert("Failed to save phone number. Please try again.");
        } finally {
            setSavingPhone(false);
        }
    };

    const doPublishTask = async (status = "PUBLISHED") => {
        const budget = Number(formData.budget || 0);
        if (selectedService && budget < selectedServiceMinPrice) {
            showBudgetMinimumError();
            return;
        }
        setIsProcessing(true);
        try {
            const amt = formData.budget ? parseInt(formData.budget, 10) : 0;

            const taskData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                serviceId: formData.serviceId,
                skills: skills,
                priceAmount: amt || 1,
                priceCurrency: "INR",
                ...(formData.deadline ? { dueAt: formData.deadline } : {}),
                status: status,
                fileIds: fileIds,
                // The mobile client sends checklist items with task creation. Keep the
                // same contract so the assigned performer receives them immediately.
                checklist: checklist.map((item) => ({
                    title: item.title,
                    note: item.note || "",
                })),
                details: {
                    additionalDescription: formData.description,
                    additionalDetails: formData.additionalDetails,
                    budgetMin: amt,
                    budgetMax: amt,
                    budgetType: formData.budgetType,
                    taskType: formData.taskType,
                    filesCount: fileIds.length,
                    conditions: conditions,
                }
            };

            const response = editTask?.id
                ? await updateTask(editTask.id, taskData)
                : await createTask(taskData);
            const taskId = editTask?.id || response?.id || response?.data?.id;

            if (!taskId) {
                throw new Error("Task was saved, but the server did not return a task ID. Please refresh My Tasks before posting again.");
            }

            if (taskId && fileIds.length > 0) {
                try {
                    await attachTaskFiles(taskId, { fileIds });
                } catch (attachErr) {
                    console.warn("Task file attach failed (files may already be linked):", attachErr);
                }
            }

            // Clear tasks cache
            sessionStorage.removeItem("onit_provider_tasks_cache");
            sessionStorage.removeItem("onit_provider_tasks_cache_v2");
            sessionStorage.removeItem("onit_provider_dashboard_cache");

            if (status === "DRAFT") {
                navigate("/provider/my-tasks", { replace: true, state: { tab: "Draft" } });
            } else {
                navigate(`/provider/task-status?taskId=${taskId}`, {
                    replace: true,
                    state: {
                        justPosted: true,
                        // The create endpoint has already returned the saved task.
                        // Keep it through navigation so the status page never has to
                        // render an empty state while its detail request starts.
                        postedTask: response?.data || response,
                    },
                });
            }
        } catch (err) {
            console.error("Task creation failed:", err);
            const errorMessage = err?.response?.data?.message || err?.message || "";
            if (/select an approved service before publishing/i.test(errorMessage)) {
                setShowServiceRequiredModal(true);
            } else {
                alert(errorMessage || "Failed to create task. Please try again.");
            }
        } finally {
            setIsProcessing(false);
        }
    };


    if (isPreview) {
        return (
            <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#f7f9f8] pb-16 pt-[80px] font-sans text-[var(--color-text)] antialiased">
                <ProviderHeader activePage="my-tasks" />
                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                    <header className="mb-7 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                <CheckCircle2 size={15} strokeWidth={2.4} />
                                Ready to publish
                            </div>
                            <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">Review your task</h1>
                            <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">Check the brief, work journey, and payment before making the task visible to performers.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPreview(false)}
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 active:scale-[0.98] sm:self-auto"
                        >
                            <PencilLine size={16} strokeWidth={2.2} />
                            Edit task
                        </button>
                    </header>

                    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
                            <div className="border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-8">
                                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-700">
                                    <span className="rounded-full bg-emerald-50 px-3 py-1.5">{selectedCategoryLabel}</span>
                                    <span className="text-slate-300">/</span>
                                    <span className="text-slate-500">{selectedServiceLabel}</span>
                                </div>
                                <h2 className="mt-5 max-w-3xl text-2xl font-black leading-tight tracking-[-0.025em] text-slate-950 sm:text-3xl">{formData.title}</h2>
                                <p className="mt-4 max-w-3xl whitespace-pre-wrap text-[15px] font-medium leading-7 text-slate-600">{formData.description}</p>

                                {formData.additionalDetails ? (
                                    <div className="mt-6 rounded-xl bg-slate-50 p-4 sm:p-5">
                                        <h3 className="text-sm font-extrabold text-slate-900">Additional details</h3>
                                        <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-600">{formData.additionalDetails}</p>
                                    </div>
                                ) : null}

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {skills.length > 0 ? skills.map((skill) => (
                                        <span key={skill} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">{skill}</span>
                                    )) : (
                                        <span className="text-sm font-medium text-slate-400">No specific skills listed</span>
                                    )}
                                </div>
                            </div>

                            <section className="px-5 py-7 sm:px-8 sm:py-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight text-slate-950">Work journey</h3>
                                        <p className="mt-1 text-sm font-medium text-slate-500">The performer completes these checkpoints in order.</p>
                                    </div>
                                    <span className="shrink-0 text-sm font-black tabular-nums text-emerald-700">{checklist.length} {checklist.length === 1 ? "step" : "steps"}</span>
                                </div>

                                <ol className="mt-6 space-y-4">
                                    {checklist.map((item, index) => (
                                        <li key={`${item.title}-${index}`} className="relative flex gap-4 pl-1">
                                            {index < checklist.length - 1 ? <span className="absolute left-[18px] top-10 h-[calc(100%+8px)] w-px bg-emerald-100" aria-hidden /> : null}
                                            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white shadow-[0_5px_14px_rgba(5,150,105,0.2)]">{index + 1}</span>
                                            <div className="min-w-0 pb-2 pt-1">
                                                <p className="text-sm font-extrabold text-slate-900">{item.title}</p>
                                                {item.note ? <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{item.note}</p> : <p className="mt-1 text-xs font-medium text-slate-400">No additional requirement</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            {conditions.length > 0 ? (
                                <section className="border-t border-slate-100 px-5 py-7 sm:px-8">
                                    <h3 className="text-lg font-black tracking-tight text-slate-950">Rules to follow</h3>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {conditions.map((item) => (
                                            <div key={item} className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" strokeWidth={2.3} />
                                                <p className="text-sm font-semibold leading-5 text-slate-700">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ) : null}

                            {attachedFiles.length > 0 ? (
                                <section className="border-t border-slate-100 px-5 py-7 sm:px-8">
                                    <h3 className="text-lg font-black tracking-tight text-slate-950">Attachments</h3>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {attachedFiles.map((file) => (
                                            <div key={file} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                <FileText className="h-5 w-5 shrink-0 text-emerald-700" strokeWidth={2.1} />
                                                <span className="truncate text-sm font-bold text-slate-700">{file}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ) : null}
                        </article>

                        <aside className="space-y-4 lg:sticky lg:top-[104px]">
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
                                <div className="bg-emerald-700 px-6 py-6 text-white">
                                    <p className="text-xs font-bold text-emerald-100">Task budget</p>
                                    <p className="mt-1 text-3xl font-black tracking-tight">₹{Number(formData.budget || 0).toLocaleString("en-IN")}</p>
                                    <p className="mt-1 text-xs font-semibold text-emerald-100">{formData.budgetType} payment</p>
                                </div>
                                <div className="space-y-5 p-6">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" strokeWidth={2.1} />
                                        <div><p className="text-xs font-semibold text-slate-400">Deadline</p><p className="mt-0.5 text-sm font-extrabold text-slate-900">{formData.deadline || "As soon as possible"}</p></div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" strokeWidth={2.1} />
                                        <div><p className="text-xs font-semibold text-slate-400">Work type</p><p className="mt-0.5 text-sm font-extrabold text-slate-900">{formData.taskType}</p></div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Tag className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" strokeWidth={2.1} />
                                        <div><p className="text-xs font-semibold text-slate-400">Service</p><p className="mt-0.5 text-sm font-extrabold leading-5 text-slate-900">{selectedServiceLabel}</p></div>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" strokeWidth={2.2} />
                                            <p className="text-xs font-semibold leading-5 text-slate-600">Publishing makes this task visible to eligible performers. You can still manage it from My Tasks.</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleConfirmPost("PUBLISHED")}
                                        disabled={isProcessing}
                                        className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-emerald-700 px-5 text-sm font-black text-white shadow-[0_8px_20px_rgba(4,120,87,0.22)] transition hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-wait disabled:opacity-65"
                                    >
                                        {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Send size={17} strokeWidth={2.3} />}
                                        {isProcessing ? "Publishing..." : "Publish task"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleConfirmPost("DRAFT")}
                                        disabled={isProcessing}
                                        className="h-11 w-full whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 active:scale-[0.98] disabled:opacity-60"
                                    >
                                        Save draft
                                    </button>
                                </div>
                            </section>
                        </aside>
                    </div>
                </main>

                {/* Phone number gate shown once if the user has no phone. */}
                {showPhoneModal && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center p-4">
                        <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface-elevated)] p-8 shadow-2xl ring-1 ring-black/[0.06]">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                                <Phone size={22} strokeWidth={2.25} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)]">One last step</h2>
                            <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
                                Add your phone number so performers can reach you. We only ask once.
                            </p>
                            <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 focus-within:border-[var(--color-primary)]/60 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/15 transition-all">
                                <input
                                    type="tel"
                                    placeholder="+91 00000 00000"
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSavePhoneAndPost()}
                                    autoFocus
                                    className="w-full bg-transparent text-[15px] font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
                                />
                            </div>
                            <div className="mt-5 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPhoneModal(false)}
                                    className="flex-1 rounded-full border-2 border-[var(--color-border)] py-3 text-[14px] font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSavePhoneAndPost}
                                    disabled={savingPhone || !phoneInput.trim()}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-3 text-[14px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
                                >
                                    {savingPhone && <Loader2 className="animate-spin" size={16} />}
                                    {savingPhone ? "Saving..." : "Save & Publish"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showServiceRequiredModal && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="service-required-title">
                        <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface-elevated)] p-8 shadow-2xl ring-1 ring-black/[0.06]">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                                <Tag size={22} strokeWidth={2.25} />
                            </div>
                            <h2 id="service-required-title" className="text-xl font-bold tracking-tight text-[var(--color-text)]">Choose an approved service</h2>
                            <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
                                This task needs an approved service before it can be published. Go back to task editing to select one.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowServiceRequiredModal(false)}
                                    className="flex-1 rounded-full border-2 border-[var(--color-border)] py-3 text-[14px] font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)]"
                                >
                                    Stay here
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowServiceRequiredModal(false);
                                        setIsPreview(false);
                                    }}
                                    className="flex-1 rounded-full bg-[var(--color-primary)] py-3 text-[14px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)]"
                                >
                                    Go to task edit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-16 pt-[80px] font-sans text-[var(--color-text)] antialiased">
            <ProviderHeader activePage="my-tasks" />

            <div
                className="pointer-events-none fixed inset-0 -z-10 opacity-90"
                aria-hidden
                style={{
                    background:
                        "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5, 150, 105, 0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 100% 20%, rgba(5, 150, 105, 0.05), transparent 45%)",
                }}
            />

            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 text-center sm:text-left">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Manual posting
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-[32px]">Post a task in minutes</h1>
                    <p className="mt-2 max-w-2xl text-[15px] font-medium text-[var(--color-text-muted)]">
                        Add the details below so we can match you with the right performers.
                    </p>
                </div>

                <form
                    onSubmit={handleNext}
                    className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-md)] ring-1 ring-black/[0.04]"
                >
                    <div className="border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/50 px-6 py-5 sm:px-8">
                        <h2 className="text-lg font-bold text-[var(--color-text)]">Task details</h2>
                        <p className="mt-1 text-sm font-medium text-[var(--color-text-subtle)]">
                            Required fields must be completed before you can continue.
                        </p>
                    </div>

                    <div className="space-y-6 p-6 sm:p-8">
                        <div className="space-y-1.5">
                            <label htmlFor="title" className="text-sm font-bold text-[var(--color-text)]">
                                Task title
                            </label>
                            <input
                                id="title"
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Responsive landing page for a product launch"
                                className={fieldBase}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="description" className="text-sm font-bold text-[var(--color-text)]">
                                Task description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Provide a detailed description of the task, requirements, and context for performers."
                                className={`${fieldBase} h-auto min-h-[120px] resize-y py-3`}
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="space-y-1.5">
                                <label htmlFor="category" className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
                                    <Tag className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2.25} />
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        required
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        disabled={domainsLoading || servicesLoading || availableCatalogDomains.length === 0}
                                        className={`${fieldBase} cursor-pointer appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-60`}
                                    >
                                        {categoryOptions.map((opt) => (
                                            <option key={opt.value || "placeholder"} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronRight
                                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[var(--color-text-subtle)]"
                                        aria-hidden
                                    />
                                </div>
                                {domainsError ? (
                                    <p className="text-xs font-medium text-red-600">{domainsError}</p>
                                ) : !domainsLoading && !servicesLoading && availableCatalogDomains.length === 0 ? (
                                    <p className="text-xs font-medium text-amber-700">No categories with approved services are available right now.</p>
                                ) : null}
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="serviceId" className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
                                    <Sparkles className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2.25} />
                                    Approved service
                                </label>
                                <div className="relative">
                                    <select
                                        id="serviceId"
                                        required
                                        name="serviceId"
                                        value={formData.serviceId}
                                        onChange={handleInputChange}
                                        disabled={!formData.category || servicesLoading || serviceOptions.length === 0}
                                        className={`${fieldBase} cursor-pointer appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-60`}
                                    >
                                        <option value="">
                                            {servicesLoading
                                                ? "Loading services..."
                                                : !formData.category
                                                    ? "Select a category first"
                                                    : serviceOptions.length === 0
                                                        ? "No approved services available"
                                                        : "Select an approved service"}
                                        </option>
                                        {serviceOptions.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronRight
                                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[var(--color-text-subtle)]"
                                        aria-hidden
                                    />
                                </div>
                                {servicesError ? (
                                    <p className="text-xs font-medium text-red-600">{servicesError}</p>
                                ) : formData.category && !servicesLoading && serviceOptions.length === 0 ? (
                                    <p className="text-xs font-medium text-amber-700">No approved services are available for this category yet.</p>
                                ) : (
                                    <p className="text-xs font-medium text-[var(--color-text-subtle)]">Choose the service that best matches this task.</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-[var(--color-text)]">Task Location</label>
                                <div className="flex gap-2">
                                    {["Remote", "On-site"].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, taskType: type }))}
                                            className={`flex-1 py-3 h-12 rounded-[var(--radius-sm)] border font-bold text-sm transition-all ${formData.taskType === type ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40"}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
                                    <IndianRupee className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2.25} />
                                    Budget (₹)
                                </label>
                                <input
                                    ref={budgetInputRef}
                                    required
                                    type="text"
                                    inputMode="numeric"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleBudgetChange}
                                    placeholder="Enter budget amount"
                                    aria-invalid={Boolean(budgetError)}
                                    aria-describedby={budgetError ? "budget-error" : undefined}
                                    className={`${fieldBase} ${budgetError ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}`}
                                    autoComplete="off"
                                />
                                {budgetError ? (
                                    <p id="budget-error" role="alert" className="text-xs font-semibold text-red-600">
                                        {budgetError}
                                    </p>
                                ) : null}
                                {selectedService ? (
                                    <p className="text-xs font-medium text-[var(--color-text-subtle)]">
                                        Minimum budget for {selectedService.name}: ₹{selectedServiceMinPrice.toLocaleString("en-IN")}
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-[var(--color-text)]">Budget Type</label>
                                <div className="flex gap-2">
                                    {["Fixed", "Hourly"].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, budgetType: type }))}
                                            className={`flex-1 py-3 h-12 rounded-[var(--radius-sm)] border font-bold text-sm transition-all ${formData.budgetType === type ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40"}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="deadline" className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
                                    <Calendar className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2.25} />
                                    Deadline
                                </label>
                                <input
                                    id="deadline"
                                    required
                                    type="date"
                                    name="deadline"
                                    min={minDateStr}
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    className={`${fieldBase} cursor-pointer [color-scheme:light]`}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-[var(--color-text)]">Skills required</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {suggestedSkills.map(skill => (
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
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                    placeholder="Type custom skill..."
                                    className="flex-1 bg-transparent py-1 text-xs font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-[var(--color-text)] flex items-center justify-between">
                                <span>Rules to follow</span>
                                <span className="text-[10px] text-[var(--color-text-subtle)] font-bold">{conditions.length}/20</span>
                            </label>
                            <p className="text-[12px] font-medium text-[var(--color-text-subtle)] -mt-2 mb-2">Add non-negotiable rules the performer must follow while completing the journey.</p>

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
                                    className="flex-1 px-4 py-3 h-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[14px] font-semibold focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={addCondition}
                                    className="h-12 px-6 rounded-[var(--radius-sm)] bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-bold text-sm transition hover:bg-[var(--color-primary)] hover:text-white"
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
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200 flex-shrink-0">
                                                ✓
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

                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <label className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-text)]">
                                        <Sparkles className="h-4 w-4 text-[var(--color-primary)]" /> Task journey <span className="text-red-500">*</span>
                                    </label>
                                    <p className="mt-1 text-[12px] font-medium text-[var(--color-text-subtle)]">Build the work path, then select any checkpoint to add the full requirement. The performer completes these in order.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGenerateChecklist}
                                    disabled={isGeneratingChecklist}
                                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary-subtle)] px-3.5 py-2 text-[12px] font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-wait disabled:opacity-60"
                                >
                                    {isGeneratingChecklist
                                        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                                        : <><Sparkles className="h-3.5 w-3.5" /> Generate with AI</>
                                    }
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={checklistInput}
                                    onChange={(e) => setChecklistInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addChecklistItem();
                                        }
                                    }}
                                    placeholder="e.g. Share the first design draft"
                                    className="flex-1 h-12 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[14px] font-semibold outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                                />
                                <button type="button" onClick={addChecklistItem} className="h-12 rounded-[var(--radius-sm)] bg-[var(--color-primary-subtle)] px-6 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white">Add</button>
                            </div>
                            {checklist.length > 0 ? (
                                <div className="grid overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
                                    <div className="min-w-0 border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-subtle)]/65 via-white to-white p-5 sm:p-7 lg:border-b-0 lg:border-r">
                                        <div className="mb-6 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-primary)]">Editing checkpoint</p>
                                                <h4 className="mt-1 text-xl font-black tracking-tight text-[var(--color-text)]">Step {selectedChecklistIndex + 1}</h4>
                                            </div>
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-black text-white shadow-[var(--shadow-glow)]">{selectedChecklistIndex + 1}</span>
                                        </div>
                                        <div className="space-y-5">
                                            <label className="block">
                                                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-[var(--color-text-subtle)]">Checkpoint title</span>
                                                <input
                                                    value={checklist[selectedChecklistIndex]?.title || ""}
                                                    onChange={(event) => updateChecklistItem(selectedChecklistIndex, "title", event.target.value)}
                                                    placeholder="e.g. Share the first design draft"
                                                    className="h-[52px] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-base font-bold text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-[var(--color-text-subtle)]">Requirement / description <span className="normal-case tracking-normal font-semibold">(optional)</span></span>
                                                <textarea
                                                    value={checklist[selectedChecklistIndex]?.note || ""}
                                                    onChange={(event) => updateChecklistItem(selectedChecklistIndex, "note", event.target.value)}
                                                    placeholder="Explain exactly what needs to be submitted, the format, acceptance criteria, or useful links."
                                                    rows={6}
                                                    className="w-full resize-y rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium leading-relaxed text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
                                                />
                                            </label>
                                            <p className="rounded-xl border border-[var(--color-primary)]/15 bg-white/70 px-3 py-2 text-xs font-medium leading-relaxed text-[var(--color-text-muted)]">This description is saved as the step note and shown to the performer when they submit this checkpoint.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/80 p-4 sm:p-5">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-wider text-[var(--color-text-subtle)]">Journey order</p>
                                                <p className="mt-0.5 text-[11px] font-semibold text-[var(--color-text-muted)]">Select, drag, or use arrows to reorder</p>
                                            </div>
                                            <span className="rounded-full bg-[var(--color-primary-subtle)] px-2.5 py-1 text-[10px] font-black text-[var(--color-primary)]">{checklist.length}/10</span>
                                        </div>
                                        <ol className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                                            {checklist.map((item, index) => (
                                                <li key={`${item.title}-${index}`} className="relative pl-5 last:before:hidden before:absolute before:left-[9px] before:top-9 before:h-[calc(100%+8px)] before:w-px before:bg-[var(--color-primary)]/25">
                                                    <button
                                                        type="button"
                                                        draggable
                                                        onClick={() => setSelectedChecklistIndex(index)}
                                                        onDragStart={() => setDraggedChecklistIndex(index)}
                                                        onDragOver={(event) => event.preventDefault()}
                                                        onDrop={() => {
                                                            if (draggedChecklistIndex !== null) moveChecklistItem(draggedChecklistIndex, index);
                                                            setDraggedChecklistIndex(null);
                                                        }}
                                                        onDragEnd={() => setDraggedChecklistIndex(null)}
                                                        className={`relative flex w-full items-center gap-3 rounded-2xl border p-3 pr-20 text-left transition ${draggedChecklistIndex === index ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] opacity-60" : selectedChecklistIndex === index ? "border-[var(--color-primary)] bg-[var(--color-primary-subtle)] shadow-[var(--shadow-xs)]" : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/35"}`}
                                                    >
                                                        <span className={`absolute -left-5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${selectedChecklistIndex === index ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-text-subtle)] ring-1 ring-[var(--color-border)]"}`}>{index + 1}</span>
                                                        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-[var(--color-text-subtle)] active:cursor-grabbing" aria-hidden />
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block truncate text-sm font-bold text-[var(--color-text)]">{item.title}</span>
                                                            {item.note ? <span className="mt-0.5 block truncate text-[11px] font-medium text-[var(--color-text-muted)]">{item.note}</span> : <span className="mt-0.5 block text-[11px] font-medium text-[var(--color-text-subtle)]">Add description</span>}
                                                        </span>
                                                    </button>
                                                    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center rounded-lg bg-white/90 shadow-[var(--shadow-xs)]">
                                                        <button type="button" onClick={() => moveChecklistItem(index, index - 1)} disabled={index === 0} aria-label={`Move ${item.title} earlier`} className="p-1 text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] disabled:opacity-30"><ChevronUp size={14} /></button>
                                                        <button type="button" onClick={() => moveChecklistItem(index, index + 1)} disabled={index === checklist.length - 1} aria-label={`Move ${item.title} later`} className="p-1 text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] disabled:opacity-30"><ChevronDown size={14} /></button>
                                                        <button type="button" onClick={() => removeChecklistItem(index)} aria-label={`Remove ${item.title}`} className="p-1 text-[var(--color-text-subtle)] hover:text-red-500"><X size={14} /></button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-[var(--radius-sm)] border-2 border-dashed border-amber-200 bg-amber-50/40 py-6 text-center">
                                    <p className="text-xs font-bold text-amber-800">Add the first checkpoint to create the task journey.</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-[var(--color-text)]">Attachments</label>
                            <div className="flex flex-wrap gap-3">
                                {attachedFiles.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700 border border-emerald-100"
                                    >
                                        <Paperclip size={14} />
                                        {file}
                                        <button type="button" onClick={() => removeFile(idx)} className="ml-1 text-emerald-400 hover:text-emerald-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 rounded-[var(--radius-sm)] border-2 border-dashed border-[var(--color-border)] px-4 py-3 text-[13px] font-bold text-[var(--color-text-subtle)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all"
                                >
                                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                    {isUploading ? "Uploading..." : "Add files"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-border-subtle)]/30 px-6 py-6 sm:px-8">
                        <span className="text-xs font-bold text-[var(--color-text-subtle)]">Confirm details in next step</span>
                        <button
                            type="submit"
                            className="rounded-full bg-[var(--color-primary)] px-12 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
                        >
                            Review & Preview
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default PostTaskManualPage;
