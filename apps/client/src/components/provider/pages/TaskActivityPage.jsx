import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight, Bookmark, CalendarDays, CheckCircle2, Clock3, Eye,
  LoaderCircle, RefreshCw, Send, ShieldCheck, Star, ThumbsUp, Users, XCircle,
} from "lucide-react";
import ProviderFlowLayout from "../layout/ProviderFlowLayout";
import { useProviderData } from "../contexts/ProviderDataContext";
import {
  getTaskDetails, getTaskerRankings, getTaskInterests,
  getTaskInvitations, sendTaskInvitation,
} from "../services/api";
import { getSavedPerformerIds, toggleSavedPerformer } from "../utils/savedPerformers";
import { mapRankedTasker, mapRankedTaskers } from "../../../utils/taskerRankings";

const asList = (response, preferredKey) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.[preferredKey])) return response[preferredKey];
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.[preferredKey])) return response.data[preferredKey];
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const formatDate = (value, fallback = "Not set") => {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatMoney = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "Flexible";
};

const invitationStatus = (value) => {
  const status = String(value || "PENDING").toUpperCase();
  if (status.includes("ACCEPT")) return {
    label: "Accepted",
    line: "Invitation accepted. This performer is ready for the next step.",
    icon: CheckCircle2,
    className: "border-[#29ADAC]/30 bg-[#EFFBFB] text-[#10605F]",
  };
  if (status.includes("DECLIN") || status.includes("REJECT")) return {
    label: "Declined",
    line: "Invitation declined. You can invite another performer.",
    icon: XCircle,
    className: "border-rose-200 bg-rose-50 text-rose-700",
  };
  if (status.includes("EXPIRE")) return {
    label: "Expired",
    line: "Invitation expired. Send a new invitation if needed.",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
  return {
    label: "Pending",
    line: "Invitation sent. Awaiting the performer response.",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  };
};

const normalizeInvitation = (invitation) => {
  const tasker = invitation?.tasker || invitation?.performer || {};
  const mappedTasker = mapRankedTasker({
    ...tasker,
    id: tasker.id || invitation?.taskerId || invitation?.performerId,
  });
  return {
    ...invitation,
    tasker: mappedTasker,
    taskerId: invitation?.taskerId || invitation?.performerId || mappedTasker.id,
  };
};

const ActivityRow = ({ icon: Icon, title, description, tone = "emerald" }) => {
  const ActivityIcon = Icon;
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-[#EFFBFB] text-[#10605F]",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <div className="flex min-h-[92px] items-center gap-4 rounded-2xl bg-[#EFFBFB]/40 px-4 py-4 sm:px-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tones[tone]}`}>
        <ActivityIcon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-[var(--color-text)]">{title}</p>
        <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">{description}</p>
      </div>
    </div>
  );
};

const InvitationCard = ({ invitation, onView }) => {
  const status = invitationStatus(invitation.status);
  const StatusIcon = status.icon;
  const tasker = invitation.tasker;
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-xs)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          <img src={tasker.avatar} alt={tasker.displayName} className="h-12 w-12 shrink-0 rounded-full border border-[var(--color-border)] object-cover" />
          <div className="min-w-0">
            <h4 className="truncate font-extrabold text-[var(--color-text)]">{tasker.displayName}</h4>
            <p className="mt-0.5 text-sm font-medium text-[var(--color-text-muted)]">{status.line}</p>
            <p className="mt-1 text-xs font-semibold text-[var(--color-text-subtle)]">Sent {formatDate(invitation.createdAt, "recently")}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}>
            <StatusIcon className="h-3.5 w-3.5" />{status.label}
          </span>
          <button type="button" onClick={() => onView(tasker)} className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-bold text-[var(--color-text)] transition hover:bg-gray-50">
            Track
          </button>
        </div>
      </div>
    </article>
  );
};

const SuggestedCard = ({ suggested, savedIds, setSavedIds, onInvite, onView, sending }) => (
  <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 gap-3">
        <img src={suggested.avatar} alt={suggested.displayName} className="h-14 w-14 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="truncate font-extrabold text-[var(--color-text)]">{suggested.displayName}</h4>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
              <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} />{Number(suggested.ratingAvg || 0).toFixed(1)}
            </span>
            {suggested.kycStatus === "VERIFIED" ? <ShieldCheck className="h-4 w-4 text-[#10605F]" /> : null}
          </div>
          <p className="mt-0.5 text-sm font-semibold text-[var(--color-text-muted)]">{suggested.profession}</p>
          <p className="mt-0.5 text-xs text-[var(--color-text-subtle)]">{suggested.completedTasksCount || 0} completed tasks</p>
        </div>
      </div>
      <button type="button" aria-label={`Save ${suggested.displayName}`} onClick={() => setSavedIds(toggleSavedPerformer(suggested.id))} className="rounded-lg p-2 text-[var(--color-text-subtle)] transition hover:bg-[#EFFBFB] hover:text-[#083B3A]">
        <Bookmark className="h-4 w-4" fill={savedIds.includes(suggested.id) ? "currentColor" : "none"} />
      </button>
    </div>
    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
      {suggested.bio || "This performer matches the skills and category needed for your task."}
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      {(suggested.skills || []).slice(0, 3).map((skill) => <span key={skill} className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-muted)]">{skill}</span>)}
    </div>
    <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
      <button type="button" onClick={() => onView(suggested)} className="flex-1 rounded-full border border-[var(--color-border)] py-2.5 text-sm font-bold text-[var(--color-text)] transition hover:bg-gray-50">View Profile</button>
      <button type="button" onClick={() => onInvite(suggested)} disabled={sending} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:opacity-60">
        {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{sending ? "Sending" : "Send Invitation"}
      </button>
    </div>
  </article>
);

const TaskActivityPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");
  const { activities } = useProviderData();
  const contextTask = useMemo(() => activities.find((item) => String(item.id) === String(taskId)), [activities, taskId]);
  const [taskDetails, setTaskDetails] = useState(null);
  const [interests, setInterests] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [savedIds, setSavedIds] = useState(() => getSavedPerformerIds());
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [invitationError, setInvitationError] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const task = taskDetails || contextTask;

  const loadPage = useCallback(async () => {
    if (!taskId) {
      setLoading(false);
      setPageError("This task link is incomplete.");
      return;
    }
    setLoading(true);
    setPageError("");
    setInvitationError("");
    const [detailsResult, interestsResult, invitationsResult] = await Promise.allSettled([
      getTaskDetails(taskId), getTaskInterests(taskId), getTaskInvitations(taskId),
    ]);
    const details = detailsResult.status === "fulfilled" ? detailsResult.value : null;
    if (details) setTaskDetails(details);
    if (!details) setPageError("We could not refresh this task. Please try again.");
    const freshInterests = interestsResult.status === "fulfilled" ? asList(interestsResult.value, "interests") : [];
    setInterests(freshInterests);
    if (invitationsResult.status === "fulfilled") {
      setInvitations(asList(invitationsResult.value, "invitations").map(normalizeInvitation));
    } else {
      setInvitationError("Invitation status is temporarily unavailable.");
    }
    // Primary data is ready — unblock the UI before the non-critical rankings call
    setLoading(false);
    const category = details?.category;
    try {
      const rankingParams = { limit: 8 };
      if (category) rankingParams.category = category;
      const rankingsResponse = await getTaskerRankings(rankingParams);
      setSuggested(mapRankedTaskers(asList(rankingsResponse, "taskers")));
    } catch {
      setSuggested([]);
    }
  }, [taskId]);

  useEffect(() => { loadPage(); }, [loadPage]);

  const invitedIds = useMemo(() => new Set(invitations.map((item) => String(item.taskerId)).filter(Boolean)), [invitations]);
  const availableSuggestions = suggested.filter((performer) => !invitedIds.has(String(performer.id)));
  const interestCount = interests.length || Number(task?._count?.interests ?? task?.applicantsCount ?? 0) || 0;
  const inviteCount = invitations.length || Number(task?._count?.invitations ?? 0) || 0;
  const viewsCount = Number(task?._count?.impressions ?? task?.matchingStats?.views ?? 0) || 0;
  const title = task?.title || task?.task || "Your task";

  const handleInvite = async (performer) => {
    if (!taskId || !performer?.id || sendingId) return;
    setSendingId(performer.id);
    setFeedback("");
    try {
      const savedInvitation = await sendTaskInvitation(taskId, performer.id);
      setInvitations((current) => [normalizeInvitation({ ...savedInvitation, tasker: performer, taskerId: performer.id }), ...current.filter((item) => String(item.taskerId) !== String(performer.id))]);
      setFeedback(`Invitation sent to ${performer.displayName}.`);
    } catch (error) {
      const message = String(error?.message || "");
      if (/already.*invit|duplicate/i.test(message)) {
        setFeedback(`${performer.displayName} has already been invited.`);
        await loadPage();
      } else setFeedback(message || "Could not send the invitation. Please try again.");
    } finally {
      setSendingId(null);
    }
  };

  const viewProfile = (performer) => navigate(`/provider/task-performer-profile/${performer.id}?taskId=${taskId}`, { state: { taskId, taskData: task, tasker: performer } });

  if (loading && !task) return (
    <ProviderFlowLayout title="Task Activity" backTo="/provider/my-tasks" maxWidth="max-w-5xl">
      <div className="space-y-5 animate-pulse">
        <div className="h-52 rounded-3xl bg-[var(--color-border-subtle)]" />
        <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-[var(--color-border-subtle)]" />)}</div>
      </div>
    </ProviderFlowLayout>
  );

  if (!task) return (
    <ProviderFlowLayout title="Task Activity" backTo="/provider/my-tasks" maxWidth="max-w-5xl">
      <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white px-6 py-16 text-center">
        <p className="font-bold text-[var(--color-text)]">{pageError || "Task not found."}</p>
        <button type="button" onClick={loadPage} className="mt-4 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white">Try again</button>
      </div>
    </ProviderFlowLayout>
  );

  return (
    <ProviderFlowLayout
      title="Task Activity"
      subtitle="See applications, invitation progress, and recommended performers in one place."
      backTo="/provider/my-tasks"
      maxWidth="max-w-5xl"
      headerRight={<button type="button" onClick={loadPage} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--color-text-muted)] shadow-sm transition hover:bg-gray-50 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>}
    >
      <div className="space-y-8">
        <section className="overflow-hidden rounded-3xl border border-[#29ADAC]/20 bg-white shadow-[var(--shadow-sm)]">
          <div className="border-l-4 border-[var(--color-primary)] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#29ADAC]/30 bg-[#EFFBFB] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#10605F]">{String(task.status || task.rawStatus || "Published").replaceAll("_", " ")}</span>
                  <span className="text-sm font-semibold text-[var(--color-text-muted)]">{task.category || "General"}</span>
                </div>
                <h2 className="mt-4 max-w-3xl text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">{title}</h2>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[var(--color-text-muted)]">
                  <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Deadline {formatDate(task.dueAt || task.deadline)}</span>
                  <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />{interestCount} application{interestCount === 1 ? "" : "s"}</span>
                  <span className="inline-flex items-center gap-2"><Send className="h-4 w-4" />{inviteCount} invitation{inviteCount === 1 ? "" : "s"}</span>
                </div>
              </div>
              <div className="flex min-w-[210px] flex-col gap-3 rounded-2xl bg-[#EFFBFB]/70 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#10605F]">Task budget</span>
                <strong className="text-2xl font-black text-[var(--color-text)]">{formatMoney(task.priceAmount)}</strong>
                <button type="button" onClick={() => navigate(`/provider/task-details?taskId=${taskId}`)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface-elevated)]"><Bookmark className="h-4 w-4" />View Task Details</button>
                {interestCount > 0 ? <button type="button" onClick={() => navigate(`/provider/task-applicants?taskId=${taskId}`, { state: { prefetchedInterests: interests, prefetchedTask: task } })} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]">Review Applications <ArrowRight className="h-4 w-4" /></button> : null}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4"><h3 className="text-xl font-black text-[var(--color-text)]">Activity</h3><p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">A quick view of how this task is performing.</p></div>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-[92px] rounded-2xl bg-[#EFFBFB]/40 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              <ActivityRow icon={Eye} tone="blue" title={`${viewsCount} performer view${viewsCount === 1 ? "" : "s"}`} description="Your task is visible to performers." />
              <ActivityRow icon={RefreshCw} tone="emerald" title={interestCount > 0 ? `${interestCount} application${interestCount === 1 ? "" : "s"}` : "Matching in progress"} description={interestCount > 0 ? "Review performers who want this task." : "Finding the best performers for you."} />
              <ActivityRow icon={ThumbsUp} tone="violet" title="Being recommended" description="Your task is shown to qualified performers." />
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div><h3 className="text-xl font-black text-[var(--color-text)]">Invited performers</h3><p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">Track every invitation and response clearly.</p></div>
            {invitations.length > 0 ? <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{invitations.length} sent</span> : null}
          </div>
          {invitationError ? <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800 sm:flex-row sm:items-center sm:justify-between"><span>{invitationError}</span><button type="button" onClick={loadPage} className="font-black">Retry</button></div>
            : loading ? <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 rounded-2xl bg-[var(--color-border-subtle)] animate-pulse" />)}</div>
              : invitations.length > 0 ? <div className="space-y-3">{invitations.map((invitation) => <InvitationCard key={invitation.id || invitation.taskerId} invitation={invitation} onView={viewProfile} />)}</div>
                : <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-5 py-8 text-center"><Send className="mx-auto h-6 w-6 text-[var(--color-text-subtle)]" /><p className="mt-3 font-bold text-[var(--color-text)]">No invitations sent yet</p><p className="mt-1 text-sm text-[var(--color-text-muted)]">Choose a recommended performer below to send the first invitation.</p></div>}
        </section>

        <section>
          <div className="mb-4"><h3 className="text-xl font-black text-[var(--color-text)]">Suggested performers</h3><p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">Recommended for {task.category || "this task"} based on skills and experience.</p></div>
          {feedback ? <div className="mb-4 rounded-2xl border border-[#29ADAC]/30 bg-[#EFFBFB] px-5 py-3 text-sm font-bold text-[#083B3A]">{feedback}</div> : null}
          {availableSuggestions.length > 0 ? <div className="grid gap-4 lg:grid-cols-2">{availableSuggestions.map((performer) => <SuggestedCard key={performer.id} suggested={performer} savedIds={savedIds} setSavedIds={setSavedIds} onInvite={handleInvite} onView={viewProfile} sending={sendingId === performer.id} />)}</div>
            : <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-5 py-10 text-center text-sm font-semibold text-[var(--color-text-muted)]">{suggested.length > 0 ? "All current recommendations have been invited." : "No recommendations are available right now."}</div>}
        </section>
      </div>
    </ProviderFlowLayout>
  );
};

export default TaskActivityPage;
