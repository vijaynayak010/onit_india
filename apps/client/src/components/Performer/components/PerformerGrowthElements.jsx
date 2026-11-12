import React, { useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { submitGrowthCourse, submitGrowthQuiz } from "../services/api";

const ACCESS_COPY = {
  APPROVED: { title: "You're ready to apply", detail: "You have an active place in this category. Explore tasks and apply when one fits your skills.", tone: "emerald" },
  PENDING_REVIEW: { title: "Your place is being reviewed", detail: "You can explore tasks now. Applications open when your category review is approved.", tone: "amber" },
  WAITLISTED: { title: "You're on the category waitlist", detail: "Places are currently full. Keep improving your profile and skills while you wait for a place to open.", tone: "amber" },
  REJECTED: { title: "You're not approved yet", detail: "Review your feedback and complete the steps below. Improvement does not guarantee a place, but it helps your next review.", tone: "rose" },
  SUSPENDED: { title: "Applications are paused", detail: "You can still view your growth plan. Contact support if you need help with this decision.", tone: "rose" },
};

export function PerformerAccessCard({ access, onBrowse }) {
  if (!access) return null;
  const enabled = access.status === "APPROVED" && access.visibilityEnabled;
  const copy = access.status === "APPROVED" && !access.visibilityEnabled
    ? { title: "Applications are paused", detail: "Your category approval is on file, but task access is not active. Contact support for help.", tone: "amber" }
    : ACCESS_COPY[access.status] || ACCESS_COPY.PENDING_REVIEW;
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm" aria-label={`${access.category} access status`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Your place · {access.category}</p>
          <h2 className="mt-2 text-xl font-medium text-gray-950">{copy.title}</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${copy.tone === "emerald" ? "bg-[#EFFBFB] text-[#10605F]" : copy.tone === "rose" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
          {enabled ? "Active" : (access.status || "Pending").replaceAll("_", " ").toLowerCase()}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-600">{copy.detail}</p>
      {access.rejectionReason && !enabled && <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">Feedback: {access.rejectionReason}</p>}
      <button type="button" onClick={onBrowse} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#10605F]">
        {enabled ? "Explore tasks" : "Preview tasks"} <ArrowRight size={16} />
      </button>
      {!enabled && <p className="mt-2 text-xs text-gray-500">You cannot apply until access is approved. Courses and quizzes do not automatically unlock a seat.</p>}
    </section>
  );
}

export function PerformerTaskPreview({ preview, onOpenTask }) {
  if (!preview) return null;
  return <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm" aria-label="Task preview">
    <p className="text-xs font-semibold uppercase tracking-widest text-[#10605F]">Real tasks · {preview.category}</p>
    <h2 className="mt-2 text-xl font-medium text-gray-950">What you could work on</h2>
    <p className="mt-2 text-sm text-gray-600">{preview.message}</p>
    {preview.tasks?.length ? <div className="mt-4 space-y-2">{preview.tasks.map((task) => <div key={task.id} className="flex items-start justify-between gap-3 rounded-2xl border border-gray-100 p-3"><div className="min-w-0"><p className="font-medium text-gray-900">{task.title}</p><p className="mt-1 text-xs text-gray-500">{task.priceAmount ? `₹${Number(task.priceAmount).toLocaleString("en-IN")}` : "Budget to be confirmed"}{task.dueAt ? ` · Due ${new Date(task.dueAt).toLocaleDateString("en-IN")}` : ""}</p></div>{preview.canApply ? <button type="button" onClick={() => onOpenTask?.(task.id)} className="shrink-0 text-sm font-semibold text-[#10605F]">View</button> : <LockKeyhole size={18} className="mt-1 shrink-0 text-gray-400" aria-label="Applications locked" />}</div>)}</div> : <p className="mt-4 text-sm text-gray-500">No published tasks in this category right now. Check back later.</p>}
    {!preview.canApply && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Tasks are visible for motivation and planning only. Finishing learning steps does not guarantee approval or an open place.</p>}
  </section>;
}

export function PerformerGrowthSteps({ plan, onAction }) {
  if (!plan) return null;
  const milestones = plan.milestones || [];
  const done = milestones.filter((item) => item.progress?.status === "COMPLETED").length;
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm" aria-label={`${plan.category} growth plan`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#10605F]">Your next steps</p>
          <h2 className="mt-2 text-xl font-medium text-gray-950">{plan.title}</h2>
          {plan.introMessage && <p className="mt-2 text-sm leading-6 text-gray-600">{plan.introMessage}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{done}/{milestones.length}</span>
      </div>
      <div className="mt-5 space-y-3">
        {milestones.map((item) => {
          const complete = item.progress?.status === "COMPLETED";
          return (
            <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-gray-100 p-3">
              {complete ? <CheckCircle2 className="mt-0.5 shrink-0 text-[#10605F]" size={20} /> : <Clock3 className="mt-0.5 shrink-0 text-gray-400" size={20} />}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
                {item.rewardPoints > 0 && <p className="mt-1 text-xs font-semibold text-[#10605F]">{item.rewardPoints} points after verification</p>}
              </div>
              {!complete && item.actionUrl && <button type="button" onClick={() => onAction?.(item.actionUrl)} className="text-sm font-semibold text-[#10605F]">Start</button>}
            </div>
          );
        })}
      </div>
      {plan.earningMessage && <p className="mt-4 text-xs leading-5 text-gray-500">{plan.earningMessage}</p>}
    </section>
  );
}

export function PerformerTrustCard({ trust }) {
  if (!trust) return null;
  return (
    <section className="rounded-3xl bg-gray-950 p-5 text-white" aria-label="Trust Score">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#7EDEDD]"><ShieldCheck size={18} /> Trust Score</div>
      {trust.active ? <>
        <div className="mt-3 flex items-baseline gap-1"><span className="text-5xl font-medium">{trust.score}</span><span className="text-gray-400">/{trust.maxScore}</span></div>
        <p className="mt-2 text-sm leading-6 text-gray-300">Built from verified work, quality, deadlines, reliability, and profile strength.</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {Object.entries(trust.breakdown || {}).map(([key, value]) => <div key={key} className="rounded-xl bg-white/10 p-3"><span className="capitalize text-gray-300">{key.replace(/([A-Z])/g, " $1")}</span><strong className="block mt-1 text-base text-white">{value}</strong></div>)}
        </div>
      </> : <>
        <LockKeyhole className="mt-5 text-[#7EDEDD]" size={28} />
        <h2 className="mt-3 text-xl font-medium">Your score starts with real work</h2>
        <p className="mt-2 text-sm leading-6 text-gray-300">{trust.message}</p>
      </>}
    </section>
  );
}

export function PerformerEarningsCard({ benchmark }) {
  if (!benchmark) return null;
  return <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm" aria-label="Category earnings benchmark">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Real earnings · last {benchmark.periodDays} days</p>
    <h2 className="mt-2 text-xl font-medium text-gray-950">{benchmark.category}</h2>
    {benchmark.available ? <>
      <p className="mt-3 text-3xl font-medium text-[#10605F]">₹{Number(benchmark.medianEarningsInr).toLocaleString("en-IN")}</p>
      <p className="mt-1 text-sm text-gray-600">Median earned by {benchmark.performerCount} active performers in this category.</p>
    </> : <p className="mt-3 text-sm text-gray-600">Not enough completed, paid work yet for a reliable comparison.</p>}
    <p className="mt-3 text-xs leading-5 text-gray-500">{benchmark.disclaimer}</p>
  </section>;
}

export function PerformerLearningCard({ resource, onUpdated }) {
  const [answers, setAnswers] = useState([]);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const questions = Array.isArray(resource.questionsJson) ? resource.questionsJson : [];
  const isQuiz = resource.type === "QUIZ";

  const submit = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = isQuiz
        ? await submitGrowthQuiz(resource.id, answers)
        : await submitGrowthCourse(resource.id, evidenceUrl.trim());
      setMessage(isQuiz ? `Score: ${response.data.score}%. ${response.data.passed ? "Passed — well done." : "Keep practicing and try again."}` : "Evidence sent for review. We'll update your progress after approval.");
      onUpdated?.();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm" aria-label={resource.title}>
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#10605F]">{isQuiz ? <Sparkles size={16} /> : <BookOpen size={16} />}{isQuiz ? "Quiz" : "Course"} · {resource.category}</div>
    <h3 className="mt-2 text-lg font-medium text-gray-950">{resource.title}</h3>
    {resource.description && <p className="mt-2 text-sm leading-6 text-gray-600">{resource.description}</p>}
    {isQuiz ? <div className="mt-4 space-y-5">{questions.map((question, index) => <fieldset key={index} className="space-y-2"><legend className="text-sm font-semibold text-gray-900">{index + 1}. {question.prompt}</legend>{question.choices.map((choice, choiceIndex) => <label key={choiceIndex} className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-100 px-3 py-2 text-sm text-gray-700"><input type="radio" name={`${resource.id}-${index}`} checked={answers[index] === choiceIndex} onChange={() => setAnswers((old) => { const next = [...old]; next[index] = choiceIndex; return next; })} />{choice}</label>)}</fieldset>)}</div>
      : <div className="mt-4 space-y-3">{resource.contentUrl && <a href={resource.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#10605F]">Open course <ArrowRight size={15} /></a>}<label className="block text-sm font-semibold text-gray-900">Completion evidence URL<input type="url" value={evidenceUrl} onChange={(event) => setEvidenceUrl(event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 font-normal outline-none focus:border-[#10605F]" /></label></div>}
    <button type="button" onClick={submit} disabled={busy || (isQuiz ? answers.filter(Number.isInteger).length !== questions.length : !evidenceUrl.trim())} className="mt-4 rounded-xl bg-[#10605F] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Submitting…" : isQuiz ? "Submit answers" : "Submit evidence"}</button>
    {message && <p role="status" className="mt-3 text-sm text-gray-700">{message}</p>}
  </section>;
}
