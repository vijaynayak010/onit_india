import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  MessageCircle,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  ExternalLink,
  LayoutGrid,
  ListTodo,
  Hash,
  AlertCircle,
  Trash2
} from "lucide-react";
import ProviderHeader from "../components/ProviderHeader";
import { getTaskDetails, createChecklist, getChecklist, approveChecklistItem, requestChecklistItemChange, approveChecklist, completeTask, approveAssignment, rejectAssignment, createTaskReview, getTaskUpdates, listConversations, getMessages, sendMessage as providerSendMessage, createConversation, getPresignedUrl, confirmUpload } from "../services/api";
import ReviewModal from "../../shared/ReviewModal";
import ActiveTaskChat from "../../shared/ActiveTaskChat";
import TaskDocumentRow from "../../shared/TaskDocumentRow";
import RequestChangesModal from "../../shared/RequestChangesModal";
import SubmissionChecklistItemCard from "../../shared/SubmissionChecklistItemCard";
import TaskProgressJourney from "../../shared/TaskProgressJourney";
import { mapChecklistItemsFromApi, isChecklistItemComplete, isChecklistItemInReview, isChecklistItemDisputed } from "../../../utils/checklistSubmission";
import { useAuth } from "../../../contexts/AuthContext";

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

const formatDeadline = (dueAt) => {
  if (!dueAt) return "No deadline";
  const due = new Date(dueAt);
  if (Number.isNaN(due.getTime())) return "No deadline";

  const diffMs = due.getTime() - Date.now();
  if (diffMs <= 0) return "Overdue";

  const hours = Math.ceil(diffMs / (1000 * 60 * 60));
  if (hours <= 24) {
    return `${hours}h Remaining`;
  }

  return `Due ${due.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

const getActiveAssignment = (task) => {
  if (!task) return null;

  const assignments = task.taskAssignments;
  if (assignments) {
    if (Array.isArray(assignments) && assignments.length > 0) {
      return assignments.find((assignment) =>
        ["ASSIGNED", "CLAIMED", "IN_PROGRESS", "ACCEPTED", "COMPLETED", "SUBMITTED"]
          .includes(String(assignment.status).toUpperCase())) || assignments[0];
    }
    if (typeof assignments === "object") return assignments;
  }

  const fields = ["taskAssignment", "tasker", "performer", "acceptedBy", "assignedTo", "hired_tasker"];
  for (const field of fields) {
    if (task[field]) return task[field];
  }

  return null;
};

const mapProviderTaskData = (task, updates = []) => {
  if (!task) return null;

  const activeAssignment = getActiveAssignment(task);
  const performer = activeAssignment?.tasker || activeAssignment;
  const latestLinkUpdate = updates.find((update) => update.link || extractLink(update.note));
  let evidenceLink = "No link provided";

  if (extractLink(activeAssignment?.notes)) {
    evidenceLink = extractLink(activeAssignment.notes);
  } else if (latestLinkUpdate) {
    evidenceLink = latestLinkUpdate.link || extractLink(latestLinkUpdate.note);
  }

  return {
    title: task.title || "Untitled Task",
    performer: typeof performer === "string"
      ? `ID: ${performer.substring(0, 8)}...`
      : (performer?.displayName || performer?.professional_title || performer?.user?.email?.split("@")[0] || "No Performer"),
    category: task.category || "General",
    timeRemaining: formatDeadline(task.dueAt),
    price: task.priceAmount || 0,
    id: task.id,
    submission: {
      description: activeAssignment?.notes || task.description || "No specific instructions provided.",
      link: evidenceLink,
      files: task.files?.length || 0,
    },
    status: task.status,
    assignmentStatus: String(activeAssignment?.status || "").toUpperCase(),
    files: task.files || [],
    assignmentId: activeAssignment?.id || task.taskAssignments?.[0]?.id || task.taskAssignment?.id,
    performerUserId: performer?.userId || performer?.user?.id || (typeof performer === "object" ? performer?.id : null),
    performerAvatar: performer?.profilePicUrl || performer?.user?.profilePicUrl || null,
    skills: task.skills || [],
    tier: task.priority === "HIGH" ? "Tier 1+" : "Standard",
    location: task.locationAddress || "Remote",
  };
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
        } catch (e) {
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

const uploadChecklistReviewFiles = async (files = []) => {
  const uploadedIds = [];

  for (const file of files) {
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const presigned = await getPresignedUrl({
      folder: "task-files",
      extension,
      contentType: file.type || "application/octet-stream",
    });
    const uploadUrl = presigned?.uploadUrl || presigned?.url;
    const s3Key = presigned?.s3Key || presigned?.key;
    if (!uploadUrl || !s3Key) throw new Error(`Could not prepare ${file.name} for upload.`);

    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type || "application/octet-stream" },
    });
    const confirmed = await confirmUpload({
      s3Key,
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      sizeBytes: file.size,
    });
    const fileId = confirmed?.id || confirmed?.data?.id;
    if (!fileId) throw new Error(`Could not save ${file.name}.`);
    uploadedIds.push(fileId);
  }

  return uploadedIds;
};

const ProviderActiveTaskExecutionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user, token } = useAuth();
  const routeTask = location.state?.task;
  const routeTaskMatches = routeTask && String(routeTask.id || routeTask._id) === String(id);
  const initialTaskPreview = routeTaskMatches ? mapProviderTaskData(routeTask) : null;
  const [activeTab, setActiveTab] = useState("details");
  const [newItemText, setNewItemText] = useState("");
  const [loading, setLoading] = useState(!initialTaskPreview);
  const [error, setError] = useState(null);

  const [checklistItems, setChecklistItems] = useState([]);
  const [checklistId, setChecklistId] = useState(null);
  const [checklistStatus, setChecklistStatus] = useState(null);
  const [checklistExistsOnServer, setChecklistExistsOnServer] = useState(false);
  const [hasChecklistChanges, setHasChecklistChanges] = useState(false);
  const [savingChecklist, setSavingChecklist] = useState(false);
  const [taskData, setTaskData] = useState(initialTaskPreview);
  const [approving, setApproving] = useState(false);
  const [taskUpdates, setTaskUpdates] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [requestChangesItem, setRequestChangesItem] = useState(null);
  const [approvingItemId, setApprovingItemId] = useState(null);
  const requestSequenceRef = useRef(0);

  const completedCount = checklistItems.filter((item) => isChecklistItemComplete(item.apiStatus)).length;
  const pendingReviewCount = checklistItems.filter((item) => isChecklistItemInReview(item.apiStatus)).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allItemsComplete = totalCount > 0 && completedCount === totalCount;
  const isChecklistApproved = String(checklistStatus || "").toUpperCase() === "APPROVED";

  const applyChecklist = (checklistPayload) => {
    setChecklistExistsOnServer(checklistPayload !== null && checklistPayload !== undefined);
    setChecklistId(checklistPayload?.id || null);
    setChecklistStatus(checklistPayload?.status || null);
    const mappedChecklist = mapChecklistItemsFromApi(checklistPayload?.items || []);
    setChecklistItems(mappedChecklist);
    if (mappedChecklist.some((item) => isChecklistItemInReview(item.apiStatus))) {
      setActiveTab("checklist");
    }
  };

  const fetchTaskDetails = async (previewTaskData = taskData) => {
    const requestSequence = ++requestSequenceRef.current;

    try {
      setLoading(!previewTaskData);
      setError(null);
      setHasChecklistChanges(false);
      setRequestChangesItem(null);
      console.log("[EXECUTION] Fetching details for task:", id);

      // Start secondary data at the same time as the primary task request. The
      // task workspace must not wait for checklist or timeline latency.
      const checklistRequest = getChecklist(id).catch(() => null);
      const data = await getTaskDetails(id);
      if (requestSequence !== requestSequenceRef.current) return;
      console.log("[EXECUTION] Task details received:", id, data);
      console.log("[CHECKLIST] Checklist structure:", data.checklist);

      if (!data) throw new Error("Task data not found");

      const activeAssignment = getActiveAssignment(data);

      // PUBLISHED tasks with no assignment belong on the performers selection page
      const taskStatus = String(data.status || "").toUpperCase();
      if (taskStatus === 'PUBLISHED' && !activeAssignment) {
        navigate(`/provider/task-applicants?taskId=${id}`, { replace: true });
        return;
      }

      // Render as soon as the primary task request resolves. List navigation
      // already supplies a preview, so most users see useful data immediately.
      setTaskData(mapProviderTaskData(data));
      setLoading(false);
      if (data.checklist) applyChecklist(data.checklist);

      void checklistRequest.then((freshChecklist) => {
        if (requestSequence !== requestSequenceRef.current || !freshChecklist) return;
        applyChecklist(freshChecklist);
      });

      if (activeAssignment?.id) {
        void getTaskUpdates(activeAssignment.id).then((updatesRes) => {
          if (requestSequence !== requestSequenceRef.current) return;
          const updates = updatesRes.data || updatesRes || [];
          setTaskUpdates(updates);
          setTaskData(mapProviderTaskData(data, updates));
        }).catch((updateErr) => {
          console.error("[EXECUTION] Error fetching updates:", updateErr);
        });
      }
    } catch (err) {
      console.error("[EXECUTION] Fetch error:", err);
      if (requestSequence === requestSequenceRef.current && !previewTaskData) {
        setError(err.message || "Failed to load task details");
      }
    } finally {
      if (requestSequence === requestSequenceRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const nextRouteTask = location.state?.task;
      const nextPreview = nextRouteTask && String(nextRouteTask.id || nextRouteTask._id) === String(id)
        ? mapProviderTaskData(nextRouteTask)
        : null;
      setActiveTab("details");
      setShowChatSidebar(false);
      setTaskData(nextPreview);
      setChecklistItems([]);
      setChecklistId(null);
      setChecklistStatus(null);
      setChecklistExistsOnServer(false);
      setTaskUpdates([]);
      fetchTaskDetails(nextPreview);
    }
  }, [id]);

  const syncChecklistItems = (items, idFromApi = null) => {
    setChecklistItems(mapChecklistItemsFromApi(items));
    if (idFromApi) setChecklistId(idFromApi);
    setHasChecklistChanges(false);
  };

  const refreshChecklist = async () => {
    const fresh = await getChecklist(id);
    setChecklistExistsOnServer(true);
    setChecklistId(fresh?.id || null);
    setChecklistStatus(fresh?.status || null);
    syncChecklistItems(fresh?.items || [], fresh?.id);
  };

  const handleApproveChecklistItem = async (item) => {
    try {
      setApprovingItemId(item.id);
      await approveChecklistItem(item.id);
      await refreshChecklist();
    } catch (apiErr) {
      console.error("[CHECKLIST] Approve failed:", apiErr);
      alert(apiErr?.message || "Failed to approve checklist item.");
    } finally {
      setApprovingItemId(null);
    }
  };

  const sendChangeRequestChatMessage = async (item, feedback) => {
    if (!taskData?.performerUserId) return;

    try {
      const response = await listConversations().catch(() => []);
      const conversations = Array.isArray(response)
        ? response
        : Array.isArray(response?.conversations)
          ? response.conversations
          : [];
      let conversation = conversations.find((entry) => String(entry.taskId) === String(id));
      if (!conversation) {
        const created = await createConversation({
          otherUserId: taskData.performerUserId,
          taskId: id,
        });
        conversation = created?.conversation || created?.data || created;
      }
      const conversationId = conversation?.id || conversation?._id;
      if (!conversationId) return;

      await providerSendMessage({
        conversationId,
        content: `Requested Changes on: ${item.text || item.title || "Checklist item"}\n\n${feedback}`,
      });
    } catch (chatError) {
      console.warn("[CHECKLIST] Change request saved, but chat notice failed:", chatError);
    }
  };

  const handleRequestChangesSubmit = async ({ item, feedback, files = [] }) => {
    const fileIds = await uploadChecklistReviewFiles(files);
    await requestChecklistItemChange(item.id, { reason: feedback, fileIds });
    await refreshChecklist();
    await sendChangeRequestChatMessage(item, feedback);
    if (taskData?.performerUserId) setShowChatSidebar(true);
    alert("Change request sent to the performer.");
  };

  const handleApproveFullChecklist = async () => {
    if (!checklistId) {
      alert("Checklist not found.");
      return;
    }
    if (!allItemsComplete) {
      alert("All checklist items must be approved first.");
      return;
    }
    if (!window.confirm("Approve the entire checklist?")) return;
    try {
      await approveChecklist(checklistId);
      setChecklistStatus("APPROVED");
      await refreshChecklist();
      alert("Checklist approved.");
    } catch (err) {
      alert(err?.message || "Failed to approve checklist.");
    }
  };

  const addChecklistItem = () => {
    if (!newItemText.trim()) return;
    if (checklistItems.length >= 10) {
      alert("You can add a maximum of 10 checklist items.");
      return;
    }
    const newItem = {
      id: `draft_${Date.now()}`,
      text: newItemText.trim(),
      note: "",
      apiStatus: "PENDING",
      status: "Pending",
      meta: "Pending",
      checked: false,
      color: "gray",
      isDraft: true,
      order: checklistItems.length,
    };
    setChecklistItems(prev => [...prev, newItem]);
    setNewItemText("");
    setHasChecklistChanges(true);
  };

  const deleteChecklistItem = (itemId) => {
    setChecklistItems(prev => prev.filter(item => item.id !== itemId));
    setHasChecklistChanges(true);
  };

  const saveChecklist = async () => {
    try {
      setSavingChecklist(true);
      const draftItems = checklistItems.filter(item => item.isDraft);
      if (draftItems.length > 0 && !checklistExistsOnServer) {
        const created = await createChecklist(id, {
          items: draftItems.map((item, index) => ({
            title: item.text,
            note: item.note || undefined,
            order: index,
          })),
        });
        setChecklistId(created?.id || null);
      } else if (draftItems.length > 0) {
        alert("Checklist already exists. New items cannot be added via create.");
        return;
      }
      setHasChecklistChanges(false);
      setChecklistExistsOnServer(true);
      await refreshChecklist();
    } catch (err) {
      alert("Failed to save checklist. " + (err.response?.data?.message || err.message));
    } finally {
      setSavingChecklist(false);
    }
  };

  const handleApproveTask = async () => {
    if (!taskData?.assignmentId) {
      alert("Missing assignment ID for this task.");
      return;
    }

    const isSubmitted = String(taskData?.assignmentStatus || "").toUpperCase() === "SUBMITTED";
    if (checklistExistsOnServer && !isChecklistApproved) {
      alert("Approve the checklist before marking the task complete.");
      return;
    }

    const confirmMsg = isSubmitted
      ? "Approve the submitted work and mark this task as completed?"
      : "Are you sure you want to approve this task and mark it as completed?";
    if (!window.confirm(confirmMsg)) return;

    const executeApprovalWithRetry = async (attempt = 1) => {
      try {
        setApproving(true);
        if (isSubmitted) {
          await approveAssignment(taskData.assignmentId);
        } else {
          await completeTask(taskData.assignmentId);
        }
        sessionStorage.removeItem("onit_provider_tasks_cache");
        sessionStorage.removeItem("onit_provider_tasks_cache_v2");
        sessionStorage.removeItem("onit_provider_dashboard_cache");
        // alert("Task approved successfully!");
        setShowReviewModal(true);
      } catch (err) {
        console.error(`[APPROVE TASK] Error (Attempt ${attempt}):`, err);

        let rawError = err.response?.data?.message || err.response?.data?.error || err.message || "";
        if (typeof rawError !== "string") {
          rawError = JSON.stringify(rawError);
        }

        const isTxError =
          rawError.toLowerCase().includes("transaction") ||
          rawError.toLowerCase().includes("prisma") ||
          rawError.toLowerCase().includes("closed") ||
          rawError.toLowerCase().includes("timeout") ||
          rawError.toLowerCase().includes("disconnect") ||
          rawError.toLowerCase().includes("tx.");

        if (isTxError && attempt < 3) {
          console.warn(`[APPROVE TASK] Database transaction timeout detected. Waking up database and retrying in 2 seconds... (Attempt ${attempt + 1})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return executeApprovalWithRetry(attempt + 1);
        }

        let friendlyMessage = rawError;
        if (isTxError) {
          friendlyMessage = "The secure payment transaction timed out on the database server due to high database wake-up latency. Please try clicking 'Approve & Mark Complete' again in a few seconds, and it will complete successfully!";
        }
        alert("Failed to approve task: " + friendlyMessage);
      } finally {
        setApproving(false);
      }
    };

    await executeApprovalWithRetry();
  };

  const handleRequestRevision = async () => {
    if (!taskData?.assignmentId) {
      alert("Missing assignment ID for this task.");
      return;
    }
    const reason = window.prompt("Reason for revision (optional):");
    if (reason === null) return;

    try {
      setApproving(true);
      await rejectAssignment(
        taskData.assignmentId,
        reason.trim() ? { reason: reason.trim() } : {}
      );
      sessionStorage.removeItem("onit_provider_tasks_cache");
      sessionStorage.removeItem("onit_provider_tasks_cache_v2");
      sessionStorage.removeItem("onit_provider_dashboard_cache");
      await fetchTaskDetails();
      alert("Revision requested. The performer has been notified.");
    } catch (err) {
      alert("Failed to request revision: " + (err.message || "Unknown error"));
    } finally {
      setApproving(false);
    }
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    try {
      await createTaskReview(id, { rating, comment });
      // Modal will handle success state and call onClose which we'll handle
    } catch (err) {
      console.error("Review failed:", err);
      throw err;
    }
  };

  const isCompleted = taskData?.status === "COMPLETED" || taskData?.assignmentStatus === "COMPLETED";

  const tabs = [
    { id: "details", label: "Task Details" },
    { id: "updates", label: "Execution Updates" },
    // Keep the checklist visible after completion so providers can audit the
    // submitted work and see the approval history.
    { id: "checklist", label: pendingReviewCount > 0 ? `Task Checklist (${pendingReviewCount})` : "Task Checklist" },
    { id: "files", label: "Files & Documents" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-28 pt-[80px] font-sans text-[var(--color-text)] antialiased">
      <ProviderHeader activePage="my-tasks" />

      {/* Chat Sidebar Overlay */}
      <AnimatePresence>
        {showChatSidebar && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 top-[100px] z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-3">
              <h2 className="text-base font-bold text-[var(--color-text)]">Task Chat</h2>
              <button
                onClick={() => setShowChatSidebar(false)}
                className="rounded-full p-1.5 hover:bg-[var(--color-border-subtle)] text-[var(--color-text-subtle)] transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ActiveTaskChat
                taskId={id}
                taskTitle={taskData?.title}
                otherUserId={taskData?.performerUserId}
                otherUserName={taskData?.performer}
                otherUserRole="Performer"
                otherUserAvatar={taskData?.performerAvatar}
                currentUser={user}
                token={token}
                appType="provider"
                listConversations={listConversations}
                getMessages={getMessages}
                sendMessage={async (convId, text, clientMessageId) => await providerSendMessage({ conversationId: convId, content: text, clientMessageId })}
                createConversation={createConversation}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-surface-elevated)] to-[var(--color-surface)]/90">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium sm:text-sm">
            <button
              type="button"
              onClick={() => navigate("/provider/my-tasks")}
              className="text-[var(--color-text-subtle)] transition hover:text-[var(--color-primary)]"
            >
              My tasks
            </button>
            <span className="text-[var(--color-border)]" aria-hidden>
              /
            </span>
            <span className="font-semibold text-[var(--color-text)]">Active task</span>
            <span className="rounded-full bg-[var(--color-border-subtle)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">
              #{(taskData?.id || id)?.substring(0, 8).toUpperCase()}
            </span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/provider/dashboard")}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/35 sm:text-sm"
            >
              <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2.25} />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate("/provider/my-tasks")}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/35 sm:text-sm"
            >
              <ListTodo className="h-3.5 w-3.5" strokeWidth={2.25} />
              All tasks
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary header */}
        <motion.div
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
                    Task #{(taskData?.id || id)?.substring(0, 8).toUpperCase()}
                  </div>
                  <h1 className="text-xl font-bold leading-snug tracking-tight text-[var(--color-text)] sm:text-2xl">
                    {taskData?.title || "Loading..."}
                  </h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pl-0 sm:pl-11">
                <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                  <Clock className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  <span>{taskData?.timeRemaining}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
                  <Info className="h-4 w-4 shrink-0 text-[var(--color-text-subtle)]" strokeWidth={2.25} />
                  <span>
                    Assigned to:{" "}
                    {taskData?.performer === "No Performer" ? (
                      <button
                        onClick={() => navigate(`/provider/task-applicants?taskId=${id}`)}
                        className="font-bold text-[#16a34a] hover:underline"
                      >
                        Choose a Performer
                      </button>
                    ) : (
                      <span className="font-bold text-[var(--color-primary)]">{taskData?.performer}</span>
                    )}
                  </span>
                </div>

              </div>
            </div>
            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
              <span className="inline-flex w-fit rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 text-xs font-bold text-[var(--color-text-muted)] shadow-[var(--shadow-xs)] sm:text-[13px]">
                {taskData?.category}
              </span>
              <div className="rounded-2xl bg-[var(--color-primary)] px-8 py-3 text-center shadow-[var(--shadow-glow)] sm:text-left">
                <span className="text-2xl font-black tracking-tight text-white">₹{taskData?.price || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <section className="rounded-[var(--radius-xl)] border border-[var(--color-primary)]/25 bg-[var(--color-primary)] p-5 text-white shadow-[var(--shadow-sm)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Next action</p>
                <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">
                  {pendingReviewCount > 0 || taskData?.assignmentStatus === "SUBMITTED" ? "Review the performer’s submission" : checklistExistsOnServer && !isChecklistApproved ? "Review the task checklist" : "Keep the task moving"}
                </h2>
                <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-white/80">
                  {pendingReviewCount > 0 || taskData?.assignmentStatus === "SUBMITTED" ? "Check the evidence, request changes, or approve the work when it meets your brief." : checklistExistsOnServer && !isChecklistApproved ? "Approve each completed step before marking the task complete." : "Use the timeline, files, and chat to keep delivery aligned."}
                </p>
              </div>
              <CheckCircle2 className="hidden h-8 w-8 shrink-0 text-white/80 sm:block" />
            </div>
            <button
              type="button"
              onClick={() => setActiveTab(pendingReviewCount > 0 || taskData?.assignmentStatus === "SUBMITTED" || (checklistExistsOnServer && !isChecklistApproved) ? "checklist" : "updates")}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-black text-[var(--color-primary)] transition hover:bg-white/90"
            >
              {pendingReviewCount > 0 || taskData?.assignmentStatus === "SUBMITTED" || (checklistExistsOnServer && !isChecklistApproved) ? "Open review" : "Open timeline"}
            </button>
          </section>

          <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-xs)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">Delivery overview</p>
                <p className="mt-2 text-lg font-black text-[var(--color-text)]">{completedCount} of {totalCount || 0} steps approved</p>
              </div>
              <span className="text-2xl font-black text-[var(--color-primary)]">{progressPercentage}%</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
              <div className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-[var(--color-surface)] p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-subtle)]">Budget</p><p className="mt-1 font-black text-[var(--color-text)]">₹{taskData?.price || 0}</p></div>
              <div className="rounded-xl bg-[var(--color-surface)] p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-subtle)]">Due</p><p className="mt-1 font-black text-[var(--color-text)]">{taskData?.timeRemaining}</p></div>
            </div>
          </section>
        </div>

        {/* Main panel */}
        <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-md)] ring-1 ring-black/[0.04]">
          <div className="flex flex-col gap-4 border-b border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
            <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-hide sm:gap-10 sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 pb-3 text-[15px] font-bold transition-colors sm:text-[16px] ${activeTab === tab.id
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]"
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="providerActiveTaskTab"
                      className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[var(--color-primary)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => navigate(`/provider/active-task/${id}/performer-issues`)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-red-600 transition hover:bg-red-100 font-bold text-sm border border-red-100 w-full sm:w-auto"
                title="Get Help from Support"
              >
                <AlertCircle className="h-4 w-4" />
                Report an issue
              </button>
              <button
                type="button"
                onClick={() => {
                  if (taskData?.performerUserId) {
                    setShowChatSidebar(true);
                  } else {
                    alert("No performer assigned to this task yet.");
                  }
                }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-subtle)] px-4 py-2.5 text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/15 font-bold text-sm w-full sm:w-auto"
                title="Go to Chat"
              >
                <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                Open Chat
              </button>
            </div>
          </div>


          <div className="p-6 sm:p-10 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-muted)] animate-pulse">
                <LayoutGrid className="h-12 w-12 mb-4 opacity-20" />
                <p className="font-bold text-lg">Loading task details...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-500">
                <AlertCircle className="h-12 w-12 mb-4" />
                <p className="font-bold text-lg">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-full font-bold shadow-md"
                >
                  Retry
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Task Summary Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Price", value: `₹${taskData?.price}`, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Deadline", value: taskData?.timeRemaining, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Tier", value: taskData?.tier, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Location", value: taskData?.location, color: "text-blue-600", bg: "bg-blue-50" },
                      ].map((stat, i) => (
                        <div key={i} className={`p-4 rounded-2xl border border-transparent shadow-sm ${stat.bg}`}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                          <p className={`text-[15px] font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
                      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">Full Task Details</h3>
                      <div className="prose prose-sm max-w-none prose-slate">
                        <p className="text-[15px] font-semibold leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                          {taskData?.submission?.description || "No specific details provided yet."}
                        </p>
                      </div>
                    </div>

                    {taskData?.skills && taskData.skills.length > 0 && (
                      <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {taskData.skills.map((skill, i) => (
                            <span key={i} className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[var(--color-text-muted)] border border-[var(--color-border)] shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "checklist" && (
                  <motion.div
                    key="checklist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <TaskProgressJourney
                      items={checklistItems}
                      nextActionableId={checklistItems.find((item) => !isChecklistItemComplete(item.apiStatus))?.id}
                      completedCount={completedCount}
                    />
                    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
                      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-xs)]">
                            <FileText className="h-5 w-5 text-[var(--color-text)]" strokeWidth={2.25} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold tracking-tight text-[var(--color-text)]">Submission Checklist</h3>
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                              {completedCount} of {totalCount} goals achieved
                            </p>
                          </div>
                        </div>
                        <span className="text-3xl font-black leading-none text-[var(--color-primary)]">{progressPercentage}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-700 ease-out"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {!checklistExistsOnServer && checklistItems.length < 10 ? (
                        <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/80 p-4 transition focus-within:border-[var(--color-primary)]/35 focus-within:bg-white sm:flex-row sm:items-center">
                          <input
                            type="text"
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
                            placeholder="Add a new requirement or milestone..."
                            className="min-w-0 flex-1 bg-transparent px-2 text-[15px] font-semibold text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none"
                          />
                          <button
                            type="button"
                            onClick={addChecklistItem}
                            className="rounded-xl border-2 border-[var(--color-border)] bg-white px-6 py-2.5 text-[13px] font-bold text-[var(--color-text)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-[0.98]"
                          >
                            Add Goal
                          </button>
                        </div>
                      ) : !checklistExistsOnServer ? (
                        <div className="rounded-[var(--radius-xl)] border border-amber-200 bg-amber-50/50 p-4 text-center text-xs font-bold text-amber-800">
                          Maximum limit of 10 checklist items reached.
                        </div>
                      ) : null}

                      {hasChecklistChanges && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end mt-2"
                        >
                          <button
                            type="button"
                            onClick={saveChecklist}
                            disabled={savingChecklist}
                            className="w-full sm:w-auto rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:bg-[var(--color-primary-hover)] transition active:scale-[0.98] disabled:opacity-50"
                          >
                            {savingChecklist ? "Saving Changes..." : "Save Checklist Changes"}
                          </button>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {checklistItems.map((item) =>
                        isChecklistItemInReview(item.apiStatus) ||
                        isChecklistItemComplete(item.apiStatus) ||
                        isChecklistItemDisputed(item.apiStatus) ||
                        String(item.apiStatus).toUpperCase() === "CHANGE_REQUESTED" ? (
                          <SubmissionChecklistItemCard
                            key={item.id}
                            item={item}
                            onRequestChanges={setRequestChangesItem}
                            onApprove={handleApproveChecklistItem}
                            approving={approvingItemId === item.id}
                          />
                        ) : (
                          <div
                            key={item.id}
                            className={`flex flex-col gap-4 rounded-[var(--radius-lg)] border-2 p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${item.checked
                              ? "border-[var(--color-border)] bg-white shadow-[var(--shadow-xs)]"
                              : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50"
                              }`}
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${item.checked ? "bg-[var(--color-primary)]" : "border-2 border-[var(--color-border)] bg-white"
                                  }`}
                                aria-label={`Status: ${item.text}`}
                              >
                                {item.checked && <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />}
                              </div>
                              <div className="min-w-0">
                                <h4
                                  className={`text-sm font-bold ${item.checked ? "text-[var(--color-text)]" : "text-[var(--color-text-subtle)]"
                                    }`}
                                >
                                  {item.text}
                                </h4>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
                                    Status: {item.status || 'Pending'}
                                  </span>
                                  <span className="h-1 w-1 rounded-full bg-[var(--color-border)]" />
                                  <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]">
                                    Added by Provider
                                  </span>
                                </div>
                              </div>
                            </div>
                            {!checklistExistsOnServer || item.isDraft ? (
                            <button
                              type="button"
                              onClick={() => deleteChecklistItem(item.id)}
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition duration-150 active:scale-95"
                              title="Delete requirement"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            ) : null}
                          </div>
                        )
                      )}
                    </div>

                    {allItemsComplete && checklistId ? (
                      <button
                        type="button"
                        onClick={handleApproveFullChecklist}
                        className="w-full rounded-full bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:bg-[var(--color-primary-hover)]"
                      >
                        Approve entire checklist
                      </button>
                    ) : null}
                  </motion.div>
                )}

                {activeTab === "updates" && (
                  <motion.div
                    key="updates"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="text-lg font-bold tracking-tight text-[var(--color-text)] sm:text-xl">
                          Performer&apos;s Update
                        </label>
                        <span className="rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                          New Submission
                        </span>
                      </div>
                      <div className="relative z-10 space-y-6">
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
                          <p className="pl-0 text-[15px] font-semibold leading-relaxed text-[var(--color-text-muted)] sm:pl-1 italic">
                            {taskData?.performer === "No Performer"
                              ? "Waiting for a performer to be assigned. Once assigned, their updates and submissions will appear here."
                              : "No progress updates posted by the performer yet."}
                          </p>
                        )}
                      </div>

                    </div>

                    <div className="space-y-4">
                      <label className="text-lg font-bold tracking-tight text-[var(--color-text)] sm:text-xl">Work Evidence Link</label>
                      {taskData?.submission?.link && taskData.submission.link !== "No link provided" && taskData.submission.link !== "No link" ? (
                        <a
                          href={taskData.submission.link.startsWith('http') ? taskData.submission.link : `https://${taskData.submission.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block cursor-pointer"
                        >
                          <div className="flex items-center gap-4 rounded-[var(--radius-xl)] border-2 border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/35">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] transition group-hover:text-[var(--color-primary)]">
                              <LinkIcon className="h-5 w-5" strokeWidth={2.25} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-[var(--color-primary)] group-hover:underline">
                                {taskData.submission.link}
                              </p>
                              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                                Live Production Link / Repository
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 shrink-0 text-[var(--color-text-subtle)] transition group-hover:text-[var(--color-primary)]" strokeWidth={2} />
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 rounded-[var(--radius-xl)] border-2 border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 p-5 shadow-[var(--shadow-xs)]">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-border-subtle)] text-[var(--color-text-subtle)]">
                            <LinkIcon className="h-5 w-5" strokeWidth={2.25} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[var(--color-text-subtle)]">
                              No link provided yet
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                              Live Production Link / Repository
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-5 rounded-[var(--radius-xl)] border-2 border-[var(--color-border)] bg-white p-6">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] shadow-[var(--shadow-xs)]">
                          <Upload className="h-6 w-6" strokeWidth={2.25} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-[var(--color-text)]">{taskData?.submission?.files || 0}</p>
                          <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                            Files Attached
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 rounded-[var(--radius-xl)] border-2 border-[var(--color-border)] bg-white p-6">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-[var(--shadow-xs)]">
                          <Clock className="h-6 w-6" strokeWidth={2.25} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-[var(--color-text)]">
                            {taskUpdates.length > 0
                              ? (() => {
                                const h = Math.floor((Date.now() - new Date(taskUpdates[0].createdAt).getTime()) / 3600000);
                                return h < 1 ? "< 1h ago" : `${h}h ago`;
                              })()
                              : "—"}
                          </p>
                          <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
                            Last Activity
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "files" && (() => {
                  const combinedFiles = getCombinedFiles(taskData.files, taskUpdates);
                  return (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="flex flex-col gap-3"
                    >
                      {combinedFiles && combinedFiles.length > 0 ? (
                        combinedFiles.map((file, i) => (
                          <TaskDocumentRow key={file.id || i} file={file} />
                        ))
                      ) : (
                        <div className="py-20 text-center">
                          <div className="mb-4 flex justify-center text-[var(--color-border)]">
                            <FileText className="h-12 w-12" />
                          </div>
                          <p className="font-bold text-[var(--color-text-subtle)]">No files shared yet.</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })()}

              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="rounded-full border-2 border-[var(--color-border)] bg-white px-8 py-3.5 text-[15px] font-bold text-[var(--color-text-muted)] shadow-[var(--shadow-xs)] transition hover:bg-[var(--color-border-subtle)] active:scale-[0.98]"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {(() => {
              const aStatus = taskData?.assignmentStatus;
              const canApprove = aStatus && ['ACCEPTED', 'IN_PROGRESS', 'ASSIGNED', 'CLAIMED', 'SUBMITTED', 'ACTIVE'].includes(aStatus);
              const checklistBlocksCompletion = checklistExistsOnServer && !isChecklistApproved;
              const alreadyDone = aStatus === 'COMPLETED';
              const showRevision = aStatus === 'SUBMITTED';

              let label = 'Approve & Mark Complete';
              if (approving) label = 'Approving...';
              else if (alreadyDone) label = 'Task Completed';
              else if (!taskData?.assignmentId) label = 'No assignment yet';
              else if (checklistBlocksCompletion) label = 'Approve checklist first';

              return (
                <>
                  {showRevision && (
                    <button
                      type="button"
                      disabled={approving}
                      onClick={handleRequestRevision}
                      className="rounded-full bg-amber-50 px-8 py-3.5 text-[15px] font-bold text-amber-800 transition hover:bg-amber-100 active:scale-[0.98] disabled:opacity-50"
                    >
                      Request Revision
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={approving || !canApprove || checklistBlocksCompletion}
                    onClick={handleApproveTask}
                    className="rounded-full bg-[var(--color-primary)] px-10 py-3.5 text-[15px] font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {label}
                  </button>
                </>
              );
            })()}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab(pendingReviewCount > 0 || taskData?.assignmentStatus === "SUBMITTED" || (checklistExistsOnServer && !isChecklistApproved) ? "checklist" : "updates")}
          className="fixed inset-x-4 bottom-4 z-40 inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(22,163,74,0.3)] transition active:scale-[0.98] lg:hidden"
        >
          {pendingReviewCount > 0 || taskData?.assignmentStatus === "SUBMITTED" ? "Review submission" : checklistExistsOnServer && !isChecklistApproved ? "Review checklist" : "Open task timeline"}
        </button>
      </main>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          fetchTaskDetails();
        }}
        onSubmit={handleReviewSubmit}
        targetName={taskData?.performer}
        role="provider"
      />

      <RequestChangesModal
        isOpen={Boolean(requestChangesItem)}
        item={requestChangesItem}
        onClose={() => setRequestChangesItem(null)}
        onSubmit={handleRequestChangesSubmit}
      />
    </div>
  );
};

export default ProviderActiveTaskExecutionPage;
