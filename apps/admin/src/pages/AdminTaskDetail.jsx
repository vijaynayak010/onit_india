import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, CheckCircle, Clock, FileText, MessageSquare, 
  DollarSign, XCircle, User, Star, List, Link as LinkIcon, RefreshCw, AlertTriangle, Shield, Check, X, Loader
} from "react-feather";
import { 
  getTaskByIdAdmin, 
  updateTaskStatusAdmin, 
  resolveAssignmentAdmin, 
  repostTaskAdmin,
  resolveChecklistItemDisputeAdmin,
  downloadTaskInvoicePdf,
} from '../services/api';

export default function AdminTaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [resolvingItemId, setResolvingItemId] = useState(null);
  const [invoiceDownloadError, setInvoiceDownloadError] = useState(null);

  const fetchTaskDetails = async (isSilent = false) => {
    try {
      if (!task && !isSilent) setLoading(true);
      const response = await getTaskByIdAdmin(taskId);
      setTask(response.data || response);
    } catch (err) {
      console.error("Failed to fetch task details:", err);
      if (!task) setError("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) fetchTaskDetails();
  }, [taskId]);

  const handleStatusChange = async (newStatus) => {
    const reason = window.prompt(`Change task status to ${newStatus}? Provide a reason:`, 'Administrative action');
    if (!reason || !reason.trim()) return;

    setActionLoading(true);
    try {
      const currentAssignment = Array.isArray(task?.taskAssignments)
        ? task.taskAssignments[0]
        : task?.taskAssignments;

      if (currentAssignment && ['COMPLETED', 'CANCELED'].includes(newStatus)) {
        await resolveAssignmentAdmin(currentAssignment.id, {
          status: newStatus,
          notes: reason.trim(),
        });
      } else {
        await updateTaskStatusAdmin(taskId, { status: newStatus, reason: reason.trim() });
      }
      fetchTaskDetails();
    } catch (err) {
      alert('Action failed: ' + (err.message || 'Unknown error.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRepostTask = async () => {
    const reason = window.prompt(
      'Refund provider wallet and repost this task for new performers? Add an admin reason:',
      'Current performer issue. Reposting task for new performers.'
    );
    if (!reason || !reason.trim()) return;

    setActionLoading(true);
    try {
      const response = await repostTaskAdmin(taskId, { reason: reason.trim() });
      const result = response?.data || response;
      const newTaskId = result?.newTask?.id;
      alert(`Task reposted successfully.${newTaskId ? ` New task: ${newTaskId.split('-')[0]}` : ''}`);
      if (newTaskId) {
        navigate(`/tasks/${newTaskId}`);
      } else {
        fetchTaskDetails();
      }
    } catch (err) {
      alert('Repost failed: ' + (err.message || 'Unknown error.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleOverrideChecklistItem = async (itemId, approve) => {
    const feedback = window.prompt(
      approve
        ? 'Enter admin notes for approving this checklist item:'
        : 'Enter admin notes for rejecting this checklist item:',
      approve ? 'Admin override: Approved after reviewing evidence.' : 'Admin override: Rejected submission.'
    );
    if (feedback === null) return;
    setResolvingItemId(itemId);
    try {
      await resolveChecklistItemDisputeAdmin(itemId, {
        status: approve ? 'APPROVED' : 'REJECTED',
        providerFeedback: feedback,
      });
      alert('Checklist item dispute resolved successfully!');
      fetchTaskDetails();
    } catch (err) {
      alert(err.message || 'Failed to resolve checklist item dispute');
    } finally {
      setResolvingItemId(null);
    }
  };

  const handleInvoiceDownload = async () => {
    setInvoiceDownloadError(null);
    try {
      await downloadTaskInvoicePdf(taskId);
    } catch (err) {
      console.error('Failed to download task invoice:', err);
      setInvoiceDownloadError(err.message || 'Unable to download the invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Neue Montreal']">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-3"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Task Details...</p>
        </div>
      </div>
    );
  }

  if (!task) return <div className="p-10 text-center text-slate-500 font-bold">Task not found</div>;

  const mainAssignment = Array.isArray(task.taskAssignments) ? task.taskAssignments[0] : task.taskAssignments;
  const displayStatus = task.effectiveStatus || task.status || 'UNKNOWN';
  const tasker = mainAssignment?.tasker;
  const checklistItems = Array.isArray(task.checklist) ? task.checklist : (task.checklist?.items || []);
  const disputedChecklistItems = task.disputedChecklistItems || checklistItems.filter(i => i.isDisputed || i.status === 'DISPUTED' || (i.rejectionCount >= 3));
  const workUpdates = Array.isArray(task.workUpdates) ? task.workUpdates : (mainAssignment?.updates || []);
  const deliverables = Array.isArray(task.deliverables) ? task.deliverables : [];
  const activeDispute = task.activeDispute || (task.disputes?.find(d => d.status === 'PENDING' || d.status === 'INVESTIGATING'));
  const allDisputes = task.disputes || [];
  const timeline = task.timeline || [];

  return (
    <div className="pb-24 animate-in fade-in duration-500 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm active:scale-95"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Overview</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                displayStatus === 'DISPUTED' ? 'bg-rose-500 text-white animate-pulse' :
                displayStatus === 'COMPLETED' ? 'bg-emerald-500 text-white' :
                displayStatus === 'IN_PROGRESS' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {displayStatus.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {task.id}</p>
          </div>
        </div>
      </div>

      {/* DISPUTE ALERT BANNER (If active or historic dispute exists) */}
      {allDisputes.length > 0 && (
        <div className={`p-5 rounded-2xl border shadow-lg space-y-3 relative overflow-hidden ${
          activeDispute ? 'bg-rose-950 text-white border-rose-800' : 'bg-amber-950 text-amber-100 border-amber-800'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${activeDispute ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'}`}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                  {activeDispute ? '⚠️ ACTIVE DISPUTE RAISED ON THIS TASK' : 'RESOLUTION HISTORY'}
                </span>
                <h3 className="text-lg font-black">{activeDispute?.reason || allDisputes[0]?.reason || 'DISPUTED'}</h3>
              </div>
            </div>
            <Link
              to="/disputes"
              className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-md"
            >
              Open Dispute Center →
            </Link>
          </div>
          {(activeDispute?.explanation || allDisputes[0]?.explanation) && (
            <p className="text-xs bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 italic">
              "{activeDispute?.explanation || allDisputes[0]?.explanation}"
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Details & Tracking */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Task Summary */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wider mb-2">
                  {task.category || "General"}
                </span>
                <h2 className="text-2xl font-black text-slate-900">{task.title || "Untitled Task"}</h2>
                {task.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Task Price</p>
                <p className="font-black text-slate-900 text-lg">₹{task.priceAmount || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Created Date</p>
                <p className="font-bold text-slate-800 text-xs mt-1">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Escrow Status</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 font-black rounded text-[10px] uppercase">
                  {task.settlement?.status || 'PENDING'}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Checklist Disputed</p>
                <p className={`font-black text-sm mt-0.5 ${disputedChecklistItems.length > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                  {disputedChecklistItems.length} Items
                </p>
              </div>
            </div>
          </section>

          {/* 2. Provider & Performer Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={16} className="text-slate-700"/> Task Provider
              </h3>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-10 w-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {(task.provider?.email || 'P')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-sm truncate">{task.provider?.email || "Unknown Provider"}</p>
                  {task.provider?.phoneNumber && (
                    <p className="text-xs text-slate-500 font-mono">{task.provider.phoneNumber}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>
                    {task.provider?.ratingAvg != null ? task.provider.ratingAvg.toFixed(1) : "New"} Rating
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {task.provider?.email && (
                    <a
                      href={`mailto:${task.provider.email}`}
                      className="px-2.5 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                      title="Click to Email Provider"
                    >
                      ✉️ Email
                    </a>
                  )}
                  {task.provider?.phoneNumber && (
                    <a
                      href={`tel:${task.provider.phoneNumber}`}
                      className="px-2.5 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                      title="Click to Call Provider"
                    >
                      📞 Call
                    </a>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={16} className="text-emerald-600"/> Task Performer
              </h3>
              {tasker ? (
                <>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-10 w-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {(tasker.user?.email || tasker.displayName || 'T')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {tasker.user?.email || tasker.displayName}
                      </p>
                      {(tasker.user?.phoneNumber || tasker.phoneNumber) && (
                        <p className="text-xs text-slate-500 font-mono">{tasker.user?.phoneNumber || tasker.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span>{tasker.ratingAvg != null ? tasker.ratingAvg.toFixed(1) : "New"} Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(tasker.user?.email || tasker.email) && (
                        <a
                          href={`mailto:${tasker.user?.email || tasker.email}`}
                          className="px-2.5 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                          title="Click to Email Performer"
                        >
                          ✉️ Email
                        </a>
                      )}
                      {(tasker.user?.phoneNumber || tasker.phoneNumber) && (
                        <a
                          href={`tel:${tasker.user?.phoneNumber || tasker.phoneNumber}`}
                          className="px-2.5 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                          title="Click to Call Performer"
                        >
                          📞 Call
                        </a>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-slate-400 text-xs italic">No performer assigned to this task yet.</div>
              )}
            </section>
          </div>

          {/* 3. CHECKLIST & DELIVERABLE INSPECTOR WITH DISPUTE OVERRIDES */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <List size={16} className="text-indigo-600"/> Deliverable Checklist ({checklistItems.length})
              </h3>
              {disputedChecklistItems.length > 0 && (
                <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase rounded-full tracking-wider animate-pulse">
                  ⚠️ {disputedChecklistItems.length} DISPUTED ITEMS
                </span>
              )}
            </div>

            <div className="space-y-4">
              {checklistItems.length > 0 ? (
                checklistItems.map((item, idx) => {
                  const isItemDisputed = item.isDisputed || item.status === 'DISPUTED' || (item.rejectionCount >= 3);
                  const latestSub = item.submissions?.[item.submissions.length - 1];

                  return (
                    <div
                      key={item.id || idx}
                      className={`p-4 rounded-2xl border space-y-3 transition-all ${
                        isItemDisputed
                          ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-200'
                          : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Item #{idx + 1}</span>
                          <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                          {item.note && <p className="text-xs text-slate-500">{item.note}</p>}
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          item.status === 'COMPLETED' || item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          isItemDisputed ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isItemDisputed ? 'DISPUTED (3x REJECT)' : item.status}
                        </span>
                      </div>

                      {/* Rejection count & Provider Feedback */}
                      {item.rejectionCount > 0 && (
                        <div className="bg-white p-3 rounded-xl border border-rose-100 text-xs space-y-1">
                          <p className="font-bold text-rose-700 text-[10px] uppercase">
                            Rejection Count: {item.rejectionCount} / 3
                          </p>
                          {item.providerFeedback && (
                            <p className="text-slate-700 italic">"Provider Feedback: {item.providerFeedback}"</p>
                          )}
                        </div>
                      )}

                      {/* All Submission Versions Breakdown (v1, v2, v3...) */}
                      {Array.isArray(item.submissions) && item.submissions.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Submission History ({item.submissions.length} Version{item.submissions.length > 1 ? 's' : ''})
                          </p>
                          <div className="space-y-2">
                            {item.submissions.map((sub, sIdx) => (
                              <div key={sub.id || sIdx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-800 text-[10px] uppercase bg-slate-100 px-2 py-0.5 rounded">
                                    Version #{sub.version || sIdx + 1}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                      sub.reviewStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                      sub.reviewStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {sub.reviewStatus || 'SUBMITTED'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : ''}</span>
                                  </div>
                                </div>
                                {sub.notes && <p className="text-slate-600 mt-1"><strong className="text-slate-700">Tasker Notes:</strong> {sub.notes}</p>}
                                {sub.providerFeedback && <p className="text-rose-600 italic text-[11px]"><strong className="text-rose-700 font-bold">Provider Feedback:</strong> "{sub.providerFeedback}"</p>}
                                {sub.fileUrl && (
                                  <a
                                    href={sub.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-1 text-blue-600 font-bold text-xs underline hover:text-blue-800"
                                  >
                                    View Submission Attachment (v{sub.version || sIdx + 1}) 🔗
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ADMIN OVERRIDE BUTTONS FOR DISPUTED ITEMS */}
                      {isItemDisputed && (
                        <div className="pt-2 flex gap-2">
                          <button
                            disabled={resolvingItemId === item.id}
                            onClick={() => handleOverrideChecklistItem(item.id, true)}
                            className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center justify-center gap-1 shadow-sm"
                          >
                            {resolvingItemId === item.id ? <Loader size={14} className="animate-spin" /> : 'Override: Approve Item'}
                          </button>
                          <button
                            disabled={resolvingItemId === item.id}
                            onClick={() => handleOverrideChecklistItem(item.id, false)}
                            className="flex-1 bg-rose-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-700 transition-all flex items-center justify-center gap-1 shadow-sm"
                          >
                            {resolvingItemId === item.id ? <Loader size={14} className="animate-spin" /> : 'Override: Reject Item'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
                  No checklist items defined for this task.
                </div>
              )}
            </div>
          </section>

          {/* Chat Monitoring */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600"/> Provider & Performer Chat Monitoring
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 h-64 overflow-y-auto space-y-3 flex flex-col">
              {(task.chatMessages || []).length > 0 ? (
                task.chatMessages.map((msg) => {
                  const isPerformer = msg.senderType === 'PERFORMER';

                  return (
                    <div key={msg.id} className={`flex flex-col ${isPerformer ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {isPerformer ? 'Performer' : 'Provider'}
                        </span>
                        <span className="text-[9px] text-slate-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className={`px-3.5 py-2 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                        isPerformer ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <MessageSquare size={32} className="text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 font-bold">No chat history recorded.</p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Real Chronological Timeline & Financial Audit */}
        <div className="space-y-8">
          
          {/* 4. REAL CHRONOLOGICAL TIMELINE EVENTS */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-blue-600"/> Real Event History ({timeline.length})
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timeline.length > 0 ? timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ring-4 ring-slate-50 ${
                    event.type?.includes('DISPUTE') ? 'bg-rose-500' :
                    event.type?.includes('COMPLETED') || event.type?.includes('ACCEPTED') ? 'bg-emerald-500' :
                    event.type?.includes('REJECTED') ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{event.label}</span>
                      <span className="text-[9px] font-bold text-slate-400">{new Date(event.at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{event.description}</p>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-slate-400 italic">No events recorded.</div>
              )}
            </div>
          </section>

          {/* 5. Deliverables Vault */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <LinkIcon size={16} className="text-emerald-600"/> Deliverables Vault ({deliverables.length})
            </h3>
            <div className="space-y-2">
              {deliverables.length > 0 ? deliverables.map((del, idx) => (
                <a 
                  key={idx} 
                  href={/^https?:\/\//i.test(del.url) ? del.url : '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between p-3 bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 transition border border-slate-200 text-xs font-bold"
                >
                  <span className="truncate">{del.filename || del.type || 'Deliverable file'}</span>
                  <span className="text-blue-600 underline">Open 🔗</span>
                </a>
              )) : (
                <p className="text-xs text-slate-400 italic">No deliverable files uploaded.</p>
              )}
            </div>
          </section>

          {/* 6. Payment & Escrow Audit */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-600"/> Escrow & Financial Audit
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Total Task Price</span>
                <span className="font-black text-slate-900">₹{task.priceAmount || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Platform Commission (10%)</span>
                <span className="font-bold text-emerald-600">₹{Math.round((task.priceAmount || 0) * 0.1)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Net Performer Payout</span>
                <span className="font-bold text-slate-900">₹{Math.round((task.priceAmount || 0) * 0.9)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Escrow Status</span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded uppercase">
                  {task.settlement?.status || 'HELD'}
                </span>
              </div>
            </div>
          </section>

          {/* 7. Official Tax Invoice & Digital Ledger Audit */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-700 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-emerald-400">
                <FileText size={16} /> Task Invoice & Digital Ledger
              </h3>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black rounded-full uppercase">
                ✓ Signed by OnIT
              </span>
            </div>
            
            <div className="bg-white/5 backdrop-blur p-4 rounded-xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Invoice Number:</span>
                <span className="font-mono font-bold text-white">
                  INV-{new Date(task.createdAt || Date.now()).toISOString().slice(0, 10).replace(/-/g, '')}-{task.id.split('-')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Status:</span>
                <span className="font-bold text-emerald-400">{task.status === 'COMPLETED' ? 'PAID & SETTLED' : (task.status || 'PENDING')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Amount:</span>
                <span className="font-bold text-white font-mono">₹{task.priceAmount || 0}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleInvoiceDownload}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase rounded-xl transition shadow-md"
              >
                <FileText size={14} /> Download PDF
              </button>
              <a
                href={`https://www.onitindia.com/verify-invoice?taskId=${task.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl border border-slate-600 transition"
              >
                <Shield size={14} /> Verify QR Page
              </a>
            </div>
            {invoiceDownloadError ? (
              <p className="text-xs font-medium text-rose-300" role="alert">{invoiceDownloadError}</p>
            ) : null}
          </section>

        </div>
      </div>

      {/* Admin Actions Bar */}
      <div className="mt-8 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-4 hidden md:block">Admin Actions:</span>
          
          <button
            type="button"
            onClick={handleInvoiceDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition text-xs shadow-md"
          >
            <FileText size={14} /> View PDF Invoice
          </button>

          <button 
            onClick={() => handleStatusChange('CANCELED')}
            disabled={actionLoading || displayStatus === 'CANCELED'}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold transition text-xs disabled:opacity-50"
          >
            <DollarSign size={14} /> Cancel & Refund Provider
          </button>
          
          <button 
            onClick={() => handleStatusChange('COMPLETED')}
            disabled={actionLoading || displayStatus === 'COMPLETED'}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition text-xs shadow-md disabled:opacity-50"
          >
            <CheckCircle size={14} /> Approve & Complete Task
          </button>

          <button
            onClick={handleRepostTask}
            disabled={actionLoading || displayStatus === 'COMPLETED'}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-xl font-bold transition text-xs disabled:opacity-50"
          >
            <RefreshCw size={14} /> Refund + Repost Task
          </button>
        </div>
      </div>

    </div>
  );
}
