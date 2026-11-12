import React, { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    Upload,
    CheckCircle2,
    Clock,
    FileText,
    LayoutGrid,
    ListTodo,
    Hash,
    Info,
    MessageCircle,
    ExternalLink,
    Loader2
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import { getTaskDetails, getChecklist, tickChecklistItem, getPresignedUrl, confirmUpload, submitTask, addTaskUpdate, getTaskUpdates, createTaskReview, getProviderProfile } from "../services/api";
import ChecklistSubmitModal from "../../shared/ChecklistSubmitModal";
import {
    mapChecklistItemsFromApi,
    getNextActionableItemId,
    canTaskerSubmitItem,
    isChecklistItemComplete,
} from "../../../utils/checklistSubmission";
import { resolveProviderProfileId, resolveClientDisplayName, resolveClientUserId } from "../utils/performerClientUtils";
import ReviewModal from "../../shared/ReviewModal";
import axios from "axios";
import TaskDocumentRow from "../../shared/TaskDocumentRow";
import TaskProgressJourney from "../../shared/TaskProgressJourney";
import {
    PERFORMER_DASHBOARD_CACHE_KEY,
    expirePerformerCache,
    getPerformerChecklistCacheKey,
    getPerformerTasksCacheKey,
} from "../utils/performerDataCache";

const extractLink = (text) => {
    if (!text) return null;
    // Match absolute urls starting with http://, https://, or www.
    const match = text.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
    if (match) {
        let url = match[0];
        url = url.replace(/[.,;:]+$/, '');
        return url;
    }
    // Try matching common domains like github.com, drive.google.com, etc.
    const commonMatch = text.match(/([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.[a-z]{2,6}[^\s]*)/i);
    if (commonMatch) {
        let url = commonMatch[0];
        url = url.replace(/[.,;:]+$/, '');
        return url;
    }
    return null;
};

const getProgressFromNote = (update) => {
    if (update?.progress !== undefined && update?.progress !== null) return Number(update.progress);
    const match = update?.note?.match(/^\[Progress:\s*(\d+)%\]/);
    return match ? parseInt(match[1], 10) : null;
};

const getCleanNote = (update) => {
    return update?.note?.replace(/^\[Progress:\s*\d+%\]\s*/, "") || "";
};

const getCombinedFiles = (taskFiles, updates, performerUserId = null) => {
    const list = [...(taskFiles || [])];
    const existingUrls = new Set(list.map(f => f.url?.toLowerCase()));

    (updates || []).forEach(update => {
        if (update.documentUrl && !existingUrls.has(update.documentUrl.toLowerCase())) {
            let filename = "Update Attachment";
            if (update.note && update.note.startsWith("Uploaded file: ")) {
                filename = update.note.replace("Uploaded file: ", "");
            } else {
                try {
                    const urlObj = new URL(update.documentUrl);
                    const pathname = urlObj.pathname;
                    const parts = pathname.split('/');
                    const lastPart = parts[parts.length - 1];
                    if (lastPart && lastPart.includes('.')) {
                        filename = decodeURIComponent(lastPart);
                    }
                } catch {
                    // Ignore URL parsing errors
                }
            }

            list.push({
                id: update.id,
                url: update.documentUrl,
                filename: filename,
                contentType: filename.split('.').pop()?.toUpperCase() || "Document",
                createdAt: update.createdAt,
                ownerUserId: performerUserId,
            });
            existingUrls.add(update.documentUrl.toLowerCase());
        }
    });

    return list;
};

const getPerformerAssignment = (task) => {
    const rawAssignment = task?.rawAssignment ?? task?.assignment ?? task?.taskAssignments ?? task?.taskAssignment;
    return Array.isArray(rawAssignment)
        ? (rawAssignment.find((assignment) =>
            ["ACCEPTED", "IN_PROGRESS", "SUBMITTED", "ASSIGNED", "COMPLETED"]
                .includes(String(assignment.status).toUpperCase())) || rawAssignment[0])
        : rawAssignment;
};

const mapPerformerTaskData = (taskLike, providerProfile = null, fallbackId = "...") => {
    if (!taskLike) return null;

    const task = taskLike.rawTask || taskLike;
    const assignment = taskLike.rawAssignment || taskLike.assignment || getPerformerAssignment(task);

    return {
        title: taskLike.company || task.title || "Untitled Task",
        client: taskLike.client || resolveClientDisplayName(task, providerProfile),
        category: taskLike.category || task.category || "General",
        timeRemaining: taskLike.deadline || (task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "No Deadline"),
        price: taskLike.price ?? task.priceAmount ?? "0",
        id: task.id || taskLike.id || fallbackId,
        assignmentId: assignment?.id || taskLike.assignmentId || null,
        status: assignment?.status || task.status || taskLike.status,
        performerUserId: assignment?.tasker?.userId || assignment?.taskerId || null,
        providerUserId: resolveClientUserId(task, providerProfile),
        description: taskLike.description || task.description || "No description provided.",
        skills: taskLike.skills || task.skills || [],
        tier: task.priority === "HIGH" ? "Tier 1+" : "Standard",
        location: taskLike.location || task.locationAddress || "Remote",
    };
};

const PerformerActiveTaskExecutionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const routeTask = location.state?.task;
    const routeTaskMatches = routeTask && String(routeTask.id || routeTask.rawTask?.id) === String(id);
    const initialTaskPreview = routeTaskMatches ? mapPerformerTaskData(routeTask, null, id) : null;
    const [activeTab, setActiveTab] = useState("details");
    const [showReviewModal, setShowReviewModal] = useState(false);

    const [checklistItems, setChecklistItems] = useState([]);
    const [submitItem, setSubmitItem] = useState(null);
    const [loading, setLoading] = useState(!initialTaskPreview);
    const [error, setError] = useState(null);
    const [taskData, setTaskData] = useState(initialTaskPreview || {
        title: "Loading...",
        client: "Loading...",
        category: "General",
        timeRemaining: "Calculating...",
        price: "0",
        id: id || "...",
    });
    const [files, setFiles] = useState([]);
    const [taskUpdates, setTaskUpdates] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submissionNotes, setSubmissionNotes] = useState("");
    const [workLink, setWorkLink] = useState("");
    const [progressVal, setProgressVal] = useState(0);
    const requestSequenceRef = useRef(0);

    const expireTaskListCaches = (includeAllTabs = false) => {
        expirePerformerCache(PERFORMER_DASHBOARD_CACHE_KEY);
        expirePerformerCache(getPerformerTasksCacheKey("active"));
        if (includeAllTabs) {
            expirePerformerCache(getPerformerTasksCacheKey("pending"));
            expirePerformerCache(getPerformerTasksCacheKey("completed"));
        }
        if (id) expirePerformerCache(getPerformerChecklistCacheKey(id));
    };

    const syncChecklistItems = (items) => {
        setChecklistItems(mapChecklistItemsFromApi(items));
    };

    const fetchData = async (previewTaskData = null) => {
        const requestSequence = ++requestSequenceRef.current;

        try {
            setLoading(!previewTaskData);
            setError(null);
            const checklistRequest = getChecklist(id).catch(() => null);
            const task = await getTaskDetails(id);
            if (requestSequence !== requestSequenceRef.current) return;

            console.log("[PERFORMER EXECUTION] Task Data fetched:", task);

            if (task) {
                const assignment = getPerformerAssignment(task);
                setTaskData(mapPerformerTaskData(task, null, id));
                setFiles(task.files || []);
                setLoading(false);

                let initialNotes = assignment?.notes || "";
                let foundLink = "";

                const linkSuffixMatch = initialNotes.match(/\n\nWork Evidence Link:\s*[^\s]+/i);
                if (linkSuffixMatch) {
                    foundLink = extractLink(linkSuffixMatch[0]) || "";
                    initialNotes = initialNotes.replace(/\n\nWork Evidence Link:\s*[^\s]+/i, '').trim();
                } else if (extractLink(initialNotes)) {
                    foundLink = extractLink(initialNotes) || "";
                }

                setSubmissionNotes(initialNotes);
                setWorkLink(foundLink);

                void checklistRequest.then((checklist) => {
                    if (requestSequence !== requestSequenceRef.current || !checklist) return;
                    syncChecklistItems(checklist.items || []);
                });

                const providerProfileId = resolveProviderProfileId(task);
                if (providerProfileId) {
                    void getProviderProfile(providerProfileId).then((providerRes) => {
                        if (requestSequence !== requestSequenceRef.current) return;
                        const providerProfile = providerRes?.data || providerRes;
                        setTaskData((current) => ({
                            ...current,
                            client: resolveClientDisplayName(task, providerProfile),
                            providerUserId: resolveClientUserId(task, providerProfile),
                        }));
                    }).catch((profileErr) => {
                        console.error("[PERFORMER EXECUTION] Provider profile fetch failed:", profileErr);
                    });
                }

                if (assignment?.id) {
                    void getTaskUpdates(assignment.id).then((updatesRes) => {
                        if (requestSequence !== requestSequenceRef.current) return;
                        const updatesList = updatesRes.data || updatesRes || [];
                        setTaskUpdates(updatesList);

                        if (!foundLink) {
                            const latestLinkUpdate = updatesList.find(u => u.link || extractLink(u.note));
                            if (latestLinkUpdate) {
                                foundLink = latestLinkUpdate.link || extractLink(latestLinkUpdate.note) || "";
                            }
                        }
                        if (foundLink) setWorkLink(foundLink);
                    }).catch((updateErr) => {
                        console.error("[PERFORMER EXECUTION] Error fetching updates:", updateErr);
                    });
                }
            }
        } catch (err) {
            console.error("[PERFORMER EXECUTION] Load failed:", err);
            if (requestSequence === requestSequenceRef.current && !previewTaskData) {
                setError(err.message || "Failed to load task details");
            }
        } finally {
            if (requestSequence === requestSequenceRef.current) setLoading(false);
        }
    };

    React.useEffect(() => {
        if (!id) return;

        const nextRouteTask = location.state?.task;
        const nextPreview = nextRouteTask && String(nextRouteTask.id || nextRouteTask.rawTask?.id) === String(id)
            ? mapPerformerTaskData(nextRouteTask, null, id)
            : null;
        setTaskData(nextPreview || {
            title: "Loading...",
            client: "Loading...",
            category: "General",
            timeRemaining: "Calculating...",
            price: "0",
            id,
        });
        setChecklistItems([]);
        setFiles([]);
        setTaskUpdates([]);
        setSubmissionNotes("");
        setWorkLink("");
        fetchData(nextPreview);
    }, [id]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            setUploadError("");
            const extension = file.name.split('.').pop();
            const res = await getPresignedUrl({
                folder: 'task-files',
                extension,
                contentType: file.type
            });

            const { uploadUrl, url, s3Key, key } = res.data || res;
            const finalUploadUrl = uploadUrl || url;
            const finalS3Key = s3Key || key;

            if (!finalUploadUrl) {
                throw new Error("Could not generate upload URL. Please try again.");
            }

            console.log("[DEBUG-FIX] handleFileUpload called - Uploading to S3...");
            const cleanAxios = axios.create();
            await cleanAxios.put(finalUploadUrl, file, {
                headers: { 'Content-Type': file.type }
            });

            const savedFile = await confirmUpload({
                s3Key: finalS3Key,
                filename: file.name,
                contentType: file.type,
                sizeBytes: file.size,
            });

            if (taskData?.assignmentId) {
                const newUpdate = await addTaskUpdate(taskData.assignmentId, {
                    note: `Uploaded file: ${file.name}`,
                    documentUrl: savedFile.url || savedFile.documentUrl
                });
                if (newUpdate) {
                    const rawUpdate = newUpdate.data || newUpdate;
                    setTaskUpdates(prev => [rawUpdate, ...prev]);
                }
            }

            setFiles(prev => [savedFile, ...prev]);
            alert("File uploaded successfully and recorded in task updates!");
        } catch (err) {
            console.error("[UPLOAD] Failed:", err);
            const isCors = !err.response && (err.request || String(err.message).toLowerCase().includes("network"));
            setUploadError(isCors
                ? "The file was prepared, but the storage upload was blocked by the server. Please try again, or share a work link while this is fixed."
                : (err.response?.data?.message || err.message || "Upload failed. Please try again."));
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleSubmitTask = async () => {
        if (!taskData?.assignmentId) {
            alert("No assignment associated with this task.");
            return;
        }

        if (!submissionNotes.trim()) {
            setActiveTab("updates");
            alert("Add a final summary in Execution Updates before submitting for review.");
            return;
        }

        try {
            setSubmitting(true);
            let notesWithLink = `[Progress: 100%] ${submissionNotes}`;
            if (workLink.trim()) {
                notesWithLink = `[Progress: 100%] ${submissionNotes}\n\nWork Evidence Link: ${workLink.trim()}`;
            }
            await submitTask(taskData.assignmentId, { notes: notesWithLink });
            expireTaskListCaches(true);
            alert("Task officially completed and submitted for provider review!");
            navigate("/performer/my-tasks");
        } catch (err) {
            console.error("[SUBMIT] Final submission failed:", err);
            alert("Failed to submit task: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handlePostUpdate = async () => {
        if (!taskData?.assignmentId) {
            alert("No assignment associated with this task.");
            return;
        }

        if (!submissionNotes.trim() && !workLink.trim()) {
            alert("Please describe your progress or paste a link first.");
            return;
        }

        try {
            setSubmitting(true);
            const updatePayload = {
                note: `[Progress: ${progressVal}%] ${submissionNotes}`,
                progress: progressVal
            };
            if (workLink.trim()) {
                updatePayload.link = workLink.trim();
            }
            const newUpdate = await addTaskUpdate(taskData.assignmentId, updatePayload);
            alert("Progress update posted successfully!");
            setSubmissionNotes("");
            setWorkLink("");
            setProgressVal(0); // Reset progress slider
            if (newUpdate) {
                const rawUpdate = newUpdate.data || newUpdate;
                setTaskUpdates(prev => [rawUpdate, ...prev]);
            }
        } catch (err) {
            console.error("[UPDATE] Failed to post update:", err);
            alert("Failed to post update: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const toggleChecklistItem = async (item) => {
        const nextId = getNextActionableItemId(checklistItems);
        if (!canTaskerSubmitItem(item.apiStatus)) {
            return;
        }
        if (item.id !== nextId) {
            alert("Complete the previous checklist item first. Submissions are sequential.");
            return;
        }
        setSubmitItem(item);
    };

    const handleChecklistSubmit = async ({ item, description, githubLink }) => {
        await tickChecklistItem(item.id, {
            taskerDescription: description,
            ...(githubLink ? { taskerLink: githubLink } : {}),
        });
        const checklist = await getChecklist(id);
        syncChecklistItems(checklist.items);
        expireTaskListCaches();
    };

    const handleReviewSubmit = async ({ rating, comment }) => {
        try {
            await createTaskReview(id, { rating, comment });
        } catch (err) {
            console.error("Performer review failed:", err);
            throw err;
        }
    };

    // Robust status check for restricted view
    const assignmentStatus = taskData.status?.toUpperCase();
    console.log("[PERFORMER EXECUTION] Status Check:", assignmentStatus);
    const isAssigned = ["ACCEPTED", "IN_PROGRESS", "ASSIGNED", "ACTIVE", "COMPLETED", "SUBMITTED"].includes(assignmentStatus);
    const isPendingConfirmation = !isAssigned;

    const tabs = isPendingConfirmation
        ? [{ id: "details", label: "Task Preview" }]
        : [
            { id: "details", label: "Task Details" },
            { id: "updates", label: "Execution Updates" },
            { id: "checklist", label: "Task Checklist" },
            { id: "files", label: "Files & Documents" }
        ];

    // Auto-switch to details tab if pending
    React.useEffect(() => {
        if (isPendingConfirmation) {
            setActiveTab("details");
        }
    }, [isPendingConfirmation]);

    const metaTone = (item) => {
        if (item.meta === "Approved" || item.color === "green") return "text-[var(--color-primary)]";
        if (item.meta === "Changes Requested" || item.color === "orange") return "text-amber-600";
        if (item.color === "red") return "text-red-600";
        return "text-[var(--color-text-subtle)]";
    };

    const totalCount = checklistItems.length;
    const completedCount = checklistItems.filter((item) => isChecklistItemComplete(item.apiStatus)).length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const nextActionableId = getNextActionableItemId(checklistItems);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] pt-[80px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">Loading task execution workspace...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] pt-[80px]">
                <div className="max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600 shadow-sm">
                    <h2 className="mb-2 text-xl font-medium">Failed to load task</h2>
                    <p className="mb-6 text-sm font-medium">{error}</p>
                    <button
                        onClick={() => navigate("/performer/my-tasks")}
                        className="rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                        Return to My Tasks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-surface)] pb-28 pt-[80px] font-sans text-[var(--color-text)] antialiased lg:pl-[220px]">
            <PerformerHeader activePage="my-tasks" />

            <div className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-elevated)] to-[var(--color-surface)]/90">
                <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium sm:text-sm">
                        <button
                            type="button"
                            onClick={() => navigate("/performer/my-tasks")}
                            className="text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
                        >
                            My tasks
                        </button>
                        <span className="text-[var(--color-border)]" aria-hidden>
                            /
                        </span>
                        <span className="font-semibold text-[var(--color-text)]">Active task</span>
                        <span className="rounded-full bg-[var(--color-border-subtle)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">
                            #{taskData.id}
                        </span>
                    </nav>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate("/performer/dashboard")}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/35 sm:text-sm"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2.25} />
                            Dashboard
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/performer/my-tasks")}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/35 sm:text-sm"
                        >
                            <ListTodo className="h-3.5 w-3.5" strokeWidth={2.25} />
                            All tasks
                        </button>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative mb-8 overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-primary)]/20 bg-gradient-to-br from-[var(--color-primary-subtle)]/90 to-white p-6 shadow-[var(--shadow-sm)] sm:p-8"
                >
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--color-primary)]/10 blur-3xl" aria-hidden />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex items-start gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="mt-1 shrink-0 rounded-full p-2 text-[var(--color-text-subtle)] transition hover:bg-white/80 hover:text-[var(--color-text)]"
                                    aria-label="Go back"
                                >
                                    <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                                </button>
                                <div className="min-w-0">
                                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/15">
                                        <Hash className="h-3 w-3" strokeWidth={2.5} />
                                        Task #{taskData.id}
                                    </div>
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-heading font-medium leading-snug tracking-tight text-[var(--color-text)]">
                                        {taskData.title}
                                    </h1>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pl-0 sm:pl-11">
                                <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                                    <Clock className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                                    <span>{taskData.timeRemaining}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
                                    <Info className="h-4 w-4 shrink-0 text-[var(--color-text-subtle)]" strokeWidth={2.25} />
                                    <span>
                                        Client:{" "}
                                        <span className="font-bold text-[var(--color-primary)]">{taskData.client}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
                            <span className="inline-flex w-fit rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 text-xs font-bold text-[var(--color-text-muted)] shadow-[var(--shadow-xs)] sm:text-[13px]">
                                {taskData.category}
                            </span>
                            <div className="rounded-2xl bg-[var(--color-primary)] px-8 py-3 text-center shadow-[var(--shadow-glow)] sm:text-left">
                                <span className="text-xl sm:text-2xl font-heading font-medium tracking-tight text-white">₹{taskData.price}</span>
                            </div>
                        </div>
                    </div>
                </Motion.div>

                {!isPendingConfirmation && (
                    <div className="mb-8 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
                        <section className="rounded-[var(--radius-xl)] border border-[var(--color-primary)]/25 bg-[var(--color-primary)] p-5 text-white shadow-[var(--shadow-sm)] sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Next action</p>
                                    <h2 className="mt-2 text-lg sm:text-xl md:text-2xl font-heading font-medium tracking-tight text-white">
                                        {nextActionableId ? "Submit your next checklist item" : taskData.status === "SUBMITTED" ? "Waiting for provider review" : "Keep your task moving"}
                                    </h2>
                                    <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-white/80">
                                        {nextActionableId ? "Add the evidence for the highlighted step so the provider can review it." : taskData.status === "SUBMITTED" ? "Your work is with the provider. We’ll notify you when they respond." : "Post an update or add evidence whenever you make progress."}
                                    </p>
                                </div>
                                <CheckCircle2 className="hidden h-8 w-8 shrink-0 text-white/80 sm:block" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveTab(nextActionableId ? "checklist" : "updates")}
                                className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-black text-[var(--color-primary)] transition hover:bg-white/90"
                            >
                                {nextActionableId ? "Open checklist" : "Open updates"}
                            </button>
                        </section>

                        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-xs)] sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Execution overview</p>
                                    <p className="mt-2 text-lg font-medium text-[var(--color-text)]">{completedCount} of {totalCount || 0} steps complete</p>
                                </div>
                                <span className="text-2xl font-medium text-[var(--color-primary)]">{progressPercentage}%</span>
                            </div>
                            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                                <div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                            </div>
                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-xl bg-[var(--color-surface)] p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-subtle)]">Payout</p><p className="mt-1 font-black text-[var(--color-text)]">₹{taskData.price}</p></div>
                                <div className="rounded-xl bg-[var(--color-surface)] p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-subtle)]">Due</p><p className="mt-1 font-black text-[var(--color-text)]">{taskData.timeRemaining}</p></div>
                            </div>
                        </section>
                    </div>
                )}

                {isPendingConfirmation && (
                    <Motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 rounded-[var(--radius-xl)] border border-amber-100 bg-amber-50 p-6 shadow-sm"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                    <Clock className="h-5 w-5" strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium text-amber-900">Waiting for Provider's Confirmation</h3>
                                    <p className="max-w-xl text-[13px] font-medium leading-relaxed text-amber-700/80">
                                        The client has been notified of your interest. Please wait for them to confirm the task terms and finalize payment before you start the execution.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <span className="inline-flex rounded-full bg-amber-200 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-800 ring-1 ring-amber-300">
                                    Pending Approval
                                </span>
                            </div>
                        </div>
                    </Motion.div>
                )}

                <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-md)] ring-1 ring-black/[0.04]">
                    <div className="flex flex-col gap-4 border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
                        <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-hide sm:gap-10 sm:pb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative shrink-0 pb-3 text-[15px] font-medium transition-colors sm:text-[16px] ${activeTab === tab.id
                                        ? "text-[var(--color-text)]"
                                        : "text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]"
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <Motion.div
                                            layoutId="performerActiveTaskTab"
                                            className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[var(--color-primary)]"
                                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        {!isPendingConfirmation && (
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/performer/task-support/${id}`)}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2.5 text-sm font-bold text-[var(--color-text-muted)] transition hover:border-rose-300 hover:text-rose-600"
                                    title="Report an issue"
                                >
                                    Report an issue
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/performer/chats?userId=${taskData.providerUserId}&taskId=${id}`)}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-subtle)] px-4 py-2.5 text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/15 font-bold text-sm"
                                    title="Go to Chat"
                                >
                                    <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                                    Open Chat
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 sm:p-10">
                        <AnimatePresence mode="wait">
                            {activeTab === "details" && (
                                <Motion.div
                                    key="details"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    {/* Task Summary Metrics */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: "Price", value: `₹${taskData.price}`, color: "text-indigo-600", bg: "bg-indigo-50" },
                                            { label: "Deadline", value: taskData.timeRemaining, color: "text-amber-600", bg: "bg-amber-50" },
                                            { label: "Tier", value: taskData.tier, color: "text-[#10605F]", bg: "bg-[#EFFBFB]" },
                                            { label: "Location", value: taskData.location, color: "text-blue-600", bg: "bg-blue-50" },
                                        ].map((stat, i) => (
                                            <div key={i} className={`p-4 rounded-2xl border border-transparent shadow-sm ${stat.bg}`}>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                                                <p className={`text-[15px] font-medium ${stat.color}`}>{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
                                        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-text-subtle)]">Full Task Details</h3>
                                        <div className="prose prose-sm max-w-none prose-slate">
                                            <p className="text-[15px] font-medium leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                                                {loading ? "Loading details..." : taskData.description || "No specific details provided yet."}
                                            </p>
                                        </div>
                                    </div>

                                    {taskData.skills && taskData.skills.length > 0 && (
                                        <div>
                                            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-text-subtle)]">Required Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {taskData.skills.map((skill, i) => (
                                                    <span key={i} className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[var(--color-text-muted)] border border-[var(--color-border)] shadow-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {isPendingConfirmation && (
                                        <div className="rounded-[var(--radius-xl)] border border-blue-100 bg-blue-50/50 p-6">
                                            <div className="flex items-start gap-4 text-blue-800">
                                                <Info className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2.25} />
                                                <div>
                                                    <h4 className="text-sm font-medium uppercase tracking-wider">Note to Performer</h4>
                                                    <p className="mt-1 text-[13px] font-medium leading-relaxed opacity-80">
                                                        Once the client confirms your proposal and finalizes the payment, you will gain access to the **Task Checklist** and **Execution Updates** areas to begin your work.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Motion.div>
                            )}

                            {activeTab === "checklist" && !isPendingConfirmation && (
                                <Motion.div
                                    key="checklist"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <TaskProgressJourney
                                        items={checklistItems}
                                        nextActionableId={nextActionableId}
                                        completedCount={completedCount}
                                    />
                                    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
                                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex gap-4">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-xs)]">
                                                    <FileText className="h-5 w-5 text-[var(--color-text)]" strokeWidth={2.25} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium tracking-tight text-[var(--color-text)]">Submission Checklist</h3>
                                                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                                                        {completedCount} of {totalCount} completed
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-3xl font-medium leading-none text-[var(--color-primary)]">{progressPercentage}%</span>
                                        </div>
                                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                                            <Motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercentage}%` }}
                                                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-700 ease-out"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {checklistItems.map((item) => {
                                            const canSubmit = item.id === nextActionableId && !isChecklistItemComplete(item.apiStatus) && !["REVIEW_REQUESTED"].includes(String(item.apiStatus || "").toUpperCase());
                                            return (
                                            <div
                                                key={item.id}
                                                onClick={() => canSubmit && toggleChecklistItem(item)}
                                                className={`flex flex-col gap-4 rounded-[var(--radius-lg)] border-2 p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                                                    item.checked
                                                    ? "border-[var(--color-border)] bg-white shadow-[var(--shadow-xs)]"
                                                    : canSubmit
                                                      ? "cursor-pointer border-[var(--color-primary)]/40 bg-white shadow-[var(--shadow-xs)]"
                                                      : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50"
                                                    }`}
                                                role={canSubmit ? "button" : undefined}
                                                tabIndex={canSubmit ? 0 : undefined}
                                            >
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <div
                                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${item.checked ? "bg-[var(--color-primary)]" : "border-2 border-[var(--color-border)] bg-white"
                                                            }`}
                                                    >
                                                        {item.checked && <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4
                                                            className={`text-sm font-medium ${item.checked ? "text-[var(--color-text)]" : "text-[var(--color-text-subtle)]"
                                                                }`}
                                                        >
                                                            {item.text}
                                                        </h4>
                                                        {item.note ? (
                                                            <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">{item.note}</p>
                                                        ) : null}
                                                        {item.providerFeedback ? (
                                                            <p className="mt-1 text-xs font-semibold text-amber-700">Feedback: {item.providerFeedback}</p>
                                                        ) : null}
                                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
                                                                Status: {canSubmit ? "Ready to submit" : item.status || 'Pending'}
                                                            </span>
                                                            <span className="h-1 w-1 rounded-full bg-[var(--color-border)]" />
                                                            <span className={`text-[11px] font-bold uppercase tracking-wide ${metaTone(item)}`}>
                                                                {item.meta}
                                                            </span>
                                                            {canSubmit ? (
                                                                <>
                                                                    <span className="h-1 w-1 rounded-full bg-[var(--color-border)]" />
                                                                    <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]">
                                                                        Tap to submit
                                                                    </span>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </Motion.div>
                            )}

                            {activeTab === "updates" && !isPendingConfirmation && (
                                <Motion.div
                                    key="updates"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-4">
                                        <label className="text-lg font-medium tracking-tight text-[var(--color-text)] sm:text-xl">What did you do?</label>
                                        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
                                            <textarea
                                                placeholder="Briefly describe the work you completed, tools used, and any important notes for the task provider."
                                                className="min-h-[140px] w-full resize-none bg-transparent p-6 text-[15px] font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none"
                                                value={submissionNotes}
                                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                            />
                                            <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-primary-subtle)]/40 px-6 py-3">
                                                <p className="text-[11px] font-semibold text-[var(--color-text-muted)]">Minimum 50 characters recommended</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Slider (0 to 100) */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-lg font-medium tracking-tight text-[var(--color-text)] sm:text-xl">Update Progress</label>
                                            <span className="rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-xs font-black uppercase tracking-wider text-[var(--color-primary)]">
                                                {progressVal}% Completed
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={progressVal}
                                                onChange={(e) => setProgressVal(Number(e.target.value))}
                                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--color-border-subtle)] accent-[var(--color-primary)] transition hover:accent-[var(--color-primary)]/80"
                                            />
                                            <span className="min-w-[45px] text-right font-black text-sm text-[var(--color-text)]">
                                                {progressVal}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-lg font-medium tracking-tight text-[var(--color-text)] sm:text-xl">Upload your work</label>
                                        <input
                                            type="text"
                                            placeholder="Paste live link/GitHub/Drive link"
                                            className="h-14 w-full rounded-[var(--radius-xl)] border-2 border-[var(--color-border)] bg-white px-6 text-[15px] font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none transition focus:border-[var(--color-primary)]/40"
                                            value={workLink}
                                            onChange={(e) => setWorkLink(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-lg font-medium tracking-tight text-[var(--color-text)] sm:text-xl">Upload documents</label>
                                        <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/80 p-12 transition hover:border-[var(--color-primary)]/35 hover:bg-white">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            <div className="flex items-center gap-3 text-[var(--color-text)]">
                                                {uploading ? (
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
                                                ) : (
                                                    <Upload className="h-5 w-5" strokeWidth={2.25} />
                                                )}
                                                <span className="text-[15px] font-medium">
                                                    {uploading ? "Uploading..." : "Upload files"}
                                                </span>
                                            </div>
                                        </label>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">Max size: 30MB • Multiple allowed</p>
                                        {uploadError ? <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold leading-relaxed text-red-700">{uploadError}</p> : null}
                                    </div>

                                    {/* Performer's Update History Log */}
                                    <div className="mt-12 space-y-6 border-t border-[var(--color-border)] pt-10">
                                        <h3 className="text-lg font-medium tracking-tight text-[var(--color-text)] sm:text-xl">
                                            Update History
                                        </h3>
                                        <div className="space-y-6">
                                            {taskUpdates.length > 0 ? (
                                                taskUpdates.map((update, idx) => (
                                                    <div key={update.id || idx} className="rounded-xl border border-[var(--color-border)] bg-white/50 p-4 shadow-sm group hover:border-[var(--color-primary)]/30 transition-colors">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-subtle)] flex items-center justify-center text-[var(--color-primary)]">
                                                                    <MessageCircle size={16} fill="currentColor" strokeWidth={0} />
                                                                </div>
                                                                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-text-subtle)]">
                                                                    Update #{taskUpdates.length - idx}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                                                                {new Date(update.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>

                                                        {(() => {
                                                            const progressVal = getProgressFromNote(update);
                                                            const cleanNote = getCleanNote(update);
                                                            return (
                                                                <div className="mb-3 space-y-2">
                                                                    {progressVal !== null && (
                                                                        <div className="flex flex-col gap-1 rounded-lg bg-[var(--color-primary-subtle)]/30 p-2.5">
                                                                            <div className="flex items-center justify-between text-xs font-bold text-[var(--color-primary)]">
                                                                                <span>Progress Achieved</span>
                                                                                <span>{progressVal}%</span>
                                                                            </div>
                                                                            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                                                                                <div
                                                                                    style={{ width: `${progressVal}%` }}
                                                                                    className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <p className="text-[14px] font-semibold text-[var(--color-text-muted)] leading-relaxed italic">
                                                                        "{cleanNote || "No note provided"}"
                                                                    </p>
                                                                </div>
                                                            );
                                                        })()}

                                                        <div className="flex flex-wrap gap-4">
                                                            {update.documentUrl && (
                                                                <a
                                                                    href={update.documentUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-primary)] hover:underline"
                                                                >
                                                                    <ExternalLink size={14} />
                                                                    View Attached Document
                                                                </a>
                                                            )}
                                                            {update.link && (
                                                                <a
                                                                    href={update.link.startsWith('http') ? update.link : `https://${update.link}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-primary)] hover:underline"
                                                                >
                                                                    <ExternalLink size={14} />
                                                                    View Work Evidence Link
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="pl-1 text-[14px] font-semibold text-[var(--color-text-muted)] italic">
                                                    No progress updates posted yet. Post your first update above!
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Motion.div>
                            )}

                            {activeTab === "files" && (() => {
                                const combinedFiles = getCombinedFiles(files, taskUpdates, taskData.performerUserId);
                                return (
                                    <Motion.div
                                        key="files"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="flex flex-col gap-3"
                                    >
                                        {combinedFiles.length === 0 ? (
                                            <div className="py-12 text-center">
                                                <div className="mb-4 flex justify-center text-[var(--color-border)]">
                                                    <FileText className="h-12 w-12" />
                                                </div>
                                                <p className="text-sm font-semibold text-[var(--color-text-subtle)]">No files uploaded yet.</p>
                                            </div>
                                        ) : (
                                            combinedFiles.map((file, i) => (
                                                <TaskDocumentRow key={file.id || i} file={file} />
                                            ))
                                        )}
                                    </Motion.div>
                                );
                            })()}


                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        className="rounded-full border-2 border-[var(--color-border)] bg-white px-8 py-3.5 text-[15px] font-medium text-[var(--color-text-muted)] shadow-[var(--shadow-xs)] transition hover:bg-var(--color-border-subtle) active:scale-[0.98]"
                        onClick={() => navigate(-1)}
                    >
                        Go back
                    </button>
                    <div className="flex flex-wrap gap-4">
                        {taskData.status === "COMPLETED" && (
                            <button
                                type="button"
                                onClick={() => setShowReviewModal(true)}
                                className="rounded-full border-2 border-amber-500 bg-white px-8 py-3.5 text-[15px] font-medium text-amber-600 shadow-sm transition hover:bg-amber-50 active:scale-[0.98]"
                            >
                                Review Client
                            </button>
                        )}
                        <button
                            type="button"
                            disabled={submitting || !taskData?.assignmentId || ["COMPLETED", "SUBMITTED"].includes(taskData.status?.toUpperCase()) || (totalCount > 0 && completedCount < totalCount)}
                            onClick={handlePostUpdate}
                            className="rounded-full border-2 border-[var(--color-primary)] bg-white px-8 py-3.5 text-[15px] font-medium text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--color-primary-subtle)]/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {submitting ? "Posting..." : "Post Update"}
                        </button>
                        <button
                            type="button"
                            disabled={submitting || !taskData?.assignmentId || ["COMPLETED", "SUBMITTED"].includes(taskData.status?.toUpperCase())}
                            onClick={handleSubmitTask}
                            className="rounded-full bg-[var(--color-primary)] px-10 py-3.5 text-[15px] font-medium text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : taskData.status === "SUBMITTED" ? "Submitted for review" : totalCount > 0 && completedCount < totalCount ? "Complete checklist first" : "Submit for review"}
                        </button>
                    </div>
                </div>

                {!isPendingConfirmation && (
                    <button
                        type="button"
                        onClick={() => setActiveTab(nextActionableId ? "checklist" : "updates")}
                        className="fixed inset-x-4 bottom-4 z-40 inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(22,163,74,0.3)] transition active:scale-[0.98] lg:hidden"
                    >
                        {nextActionableId ? "Submit next checklist item" : taskData.status === "SUBMITTED" ? "View submission status" : "Post progress update"}
                    </button>
                )}
            </main>

            <ChecklistSubmitModal
                isOpen={Boolean(submitItem)}
                item={submitItem}
                onClose={() => setSubmitItem(null)}
                onSubmit={handleChecklistSubmit}
            />

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => {
                    setShowReviewModal(false);
                    fetchData();
                }}
                onSubmit={handleReviewSubmit}
                targetName={taskData.client}
                role="performer"
            />
        </div>
    );
};

export default PerformerActiveTaskExecutionPage;
