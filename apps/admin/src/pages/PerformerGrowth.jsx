import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ClipboardCheck, Megaphone, Plus, RefreshCw, Save, ShieldCheck, XCircle } from 'lucide-react';
import PerformerCampaigns from './PerformerCampaigns';
import {
  addPerformerGrowthMilestone,
  completePerformerManualMilestone,
  createPerformerLearningResource,
  listPerformerCourseSubmissions,
  listPerformerGrowthPlans,
  listPerformerLearningResources,
  reviewPerformerCourseSubmission,
  savePerformerGrowthPlan,
  updatePerformerGrowthMilestone,
  updatePerformerGrowthPlan,
  updatePerformerLearningResource,
} from '../services/api';

const field = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500';
const button = 'inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50';
const secondary = 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-50';
const blankQuestion = () => ({ prompt: '', choices: ['', ''], correctIndex: 0 });

const tabs = [
  { id: 'plans', label: 'Growth plans', icon: ClipboardCheck },
  { id: 'learning', label: 'Learning library', icon: BookOpen },
  { id: 'reviews', label: 'Course reviews', icon: ShieldCheck },
  { id: 'campaigns', label: 'Recommendations', icon: Megaphone },
];

function MilestoneRow({ milestone, resources, onSave, onComplete, busy }) {
  const [draft, setDraft] = useState(milestone);
  const [taskerId, setTaskerId] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  useEffect(() => setDraft(milestone), [milestone]);

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-600">{milestone.type.replaceAll('_', ' ')}</span>
        <button disabled={busy} onClick={() => onSave(milestone.id, {
          title: draft.title,
          description: draft.description || '',
          actionUrl: draft.actionUrl || '',
          position: Number(draft.position || 0),
          isRequired: Boolean(draft.isRequired),
          rewardPoints: Number(draft.rewardPoints || 0),
          ...(draft.type === 'QUIZ' ? { minimumQuizScore: draft.minimumQuizScore === '' ? undefined : Number(draft.minimumQuizScore) } : {}),
        })} className={secondary}><Save size={15} /> Save step</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input className={field} value={draft.title || ''} onChange={(event) => update('title', event.target.value)} aria-label="Step title" />
        <input className={field} value={draft.description || ''} onChange={(event) => update('description', event.target.value)} placeholder="Why this step matters" aria-label="Step description" />
        <input className={field} value={draft.actionUrl || ''} onChange={(event) => update('actionUrl', event.target.value)} placeholder="Action URL, optional" aria-label="Action URL" />
        <div className="grid grid-cols-3 gap-2">
          <label className="text-xs text-slate-500">Order<input type="number" min="0" className={field} value={draft.position ?? 0} onChange={(event) => update('position', event.target.value)} /></label>
          <label className="text-xs text-slate-500">Points<input type="number" min="0" className={field} value={draft.rewardPoints ?? 0} onChange={(event) => update('rewardPoints', event.target.value)} /></label>
          <label className="text-xs text-slate-500">Required<select className={field} value={String(Boolean(draft.isRequired))} onChange={(event) => update('isRequired', event.target.value === 'true')}><option value="true">Yes</option><option value="false">No</option></select></label>
        </div>
      </div>
      {draft.type === 'QUIZ' && <p className="text-xs text-slate-500">Quiz: {resources.find((resource) => resource.id === milestone.learningResourceId)?.title || 'Missing resource'} · Minimum score <input type="number" min="0" max="100" className="ml-1 w-16 rounded border p-1" value={draft.minimumQuizScore ?? ''} onChange={(event) => update('minimumQuizScore', event.target.value)} />%</p>}
      {draft.type === 'COURSE' && <p className="text-xs text-slate-500">Course: {resources.find((resource) => resource.id === milestone.learningResourceId)?.title || 'Missing resource'}</p>}
      {draft.type === 'MANUAL_REVIEW' && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          <input className={`${field} max-w-[260px]`} value={taskerId} onChange={(event) => setTaskerId(event.target.value)} placeholder="Performer tasker ID" />
          <input className={`${field} max-w-[260px]`} value={evidenceNote} onChange={(event) => setEvidenceNote(event.target.value)} placeholder="Review note" />
          <button className={secondary} disabled={busy || !taskerId.trim()} onClick={() => onComplete(milestone.id, { taskerId: taskerId.trim(), evidenceNote })}><CheckCircle2 size={15} /> Verify completion</button>
        </div>
      )}
    </div>
  );
}

export default function PerformerGrowth() {
  const [tab, setTab] = useState('plans');
  const [plans, setPlans] = useState([]);
  const [resources, setResources] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [newPlan, setNewPlan] = useState({ category: '', title: '', introMessage: '', earningMessage: '' });
  const [newStep, setNewStep] = useState({ type: 'PROFILE_COMPLETION', title: '', description: '', learningResourceId: '', rewardPoints: 0, minimumQuizScore: 70, position: 0 });
  const [newResource, setNewResource] = useState({ category: '', type: 'COURSE', title: '', description: '', contentUrl: '', passingScore: 70, dailyAttemptLimit: 3, questions: [blankQuestion()] });
  const [reviewNotes, setReviewNotes] = useState({});
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refresh = useCallback(async () => {
    const [nextPlans, nextResources, nextSubmissions] = await Promise.all([
      listPerformerGrowthPlans(), listPerformerLearningResources(), listPerformerCourseSubmissions(),
    ]);
    setPlans(nextPlans || []);
    setResources(nextResources || []);
    setSubmissions(nextSubmissions || []);
    setSelectedPlanId((current) => current || nextPlans?.[0]?.id || '');
  }, []);

  useEffect(() => {
    refresh().catch((err) => setError(err.message || 'Unable to load performer growth controls')).finally(() => setLoading(false));
  }, [refresh]);

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === selectedPlanId), [plans, selectedPlanId]);

  const perform = async (action, message) => {
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await action();
      await refresh();
      setSuccess(message);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to save changes');
    } finally {
      setBusy(false);
    }
  };

  const createPlan = (event) => {
    event.preventDefault();
    perform(async () => {
      const result = await savePerformerGrowthPlan(newPlan);
      setSelectedPlanId(result.id);
      setNewPlan({ category: '', title: '', introMessage: '', earningMessage: '' });
    }, 'Growth plan saved.');
  };

  const addStep = (event) => {
    event.preventDefault();
    perform(async () => {
      await addPerformerGrowthMilestone(selectedPlan.id, {
        ...newStep,
        position: Number(newStep.position),
        rewardPoints: Number(newStep.rewardPoints),
        minimumQuizScore: newStep.type === 'QUIZ' ? Number(newStep.minimumQuizScore) : undefined,
        learningResourceId: newStep.learningResourceId || undefined,
      });
      setNewStep({ type: 'PROFILE_COMPLETION', title: '', description: '', learningResourceId: '', rewardPoints: 0, minimumQuizScore: 70, position: selectedPlan.milestones.length + 1 });
    }, 'Growth step added.');
  };

  const updateQuestion = (index, key, value) => setNewResource((current) => ({
    ...current,
    questions: current.questions.map((question, position) => position === index ? { ...question, [key]: value } : question),
  }));

  const saveResource = (event) => {
    event.preventDefault();
    perform(async () => {
      await createPerformerLearningResource({
        ...newResource,
        passingScore: Number(newResource.passingScore),
        dailyAttemptLimit: Number(newResource.dailyAttemptLimit),
        questions: newResource.type === 'QUIZ' ? newResource.questions.map((question) => ({
          ...question, correctIndex: Number(question.correctIndex),
        })) : undefined,
        contentUrl: newResource.type === 'COURSE' ? newResource.contentUrl : undefined,
      });
      setNewResource({ category: '', type: 'COURSE', title: '', description: '', contentUrl: '', passingScore: 70, dailyAttemptLimit: 3, questions: [blankQuestion()] });
    }, 'Learning resource created.');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-3xl font-black tracking-tight text-slate-900">Performer Growth</h1><p className="mt-1 text-sm text-slate-500">Set clear improvement steps, publish learning, and verify completed courses.</p></div>
        <button className={secondary} disabled={loading || busy} onClick={() => perform(refresh, 'Updated.')}><RefreshCw size={16} /> Refresh</button>
      </div>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      {success && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{success}</div>}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${tab === id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}><Icon size={16} />{label}{id === 'reviews' && submissions.length > 0 ? ` (${submissions.length})` : ''}</button>)}</div>
      {loading ? <p className="text-sm text-slate-500">Loading controls…</p> : null}

      {!loading && tab === 'plans' && <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4"><h2 className="mb-3 font-black text-slate-900">Category plans</h2><div className="space-y-2">{plans.map((plan) => <button key={plan.id} onClick={() => setSelectedPlanId(plan.id)} className={`w-full rounded-xl border p-3 text-left ${plan.id === selectedPlanId ? 'border-emerald-300 bg-emerald-50' : 'border-slate-100 hover:bg-slate-50'}`}><span className="block font-bold text-slate-900">{plan.category}</span><span className="text-xs text-slate-500">{plan.milestones.length} steps · {plan.isActive ? 'Active' : 'Paused'}</span></button>)}{plans.length === 0 && <p className="text-sm text-slate-500">No plans yet.</p>}</div></div>
          <form onSubmit={createPlan} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4"><h2 className="font-black text-slate-900">Create or replace a plan</h2><input required className={field} placeholder="Category, e.g. Web Design" value={newPlan.category} onChange={(event) => setNewPlan({ ...newPlan, category: event.target.value })} /><input required className={field} placeholder="Plan title" value={newPlan.title} onChange={(event) => setNewPlan({ ...newPlan, title: event.target.value })} /><textarea className={field} placeholder="Intro message" value={newPlan.introMessage} onChange={(event) => setNewPlan({ ...newPlan, introMessage: event.target.value })} /><textarea className={field} placeholder="How they can earn" value={newPlan.earningMessage} onChange={(event) => setNewPlan({ ...newPlan, earningMessage: event.target.value })} /><button className={button} disabled={busy}><Plus size={15} /> Save plan</button></form>
        </div>
        <div className="space-y-5">
          {!selectedPlan ? <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-500">Choose or create a category plan.</div> : <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5"><div><h2 className="text-xl font-black text-slate-900">{selectedPlan.title}</h2><p className="text-sm text-slate-500">{selectedPlan.category} · {selectedPlan.introMessage || 'No intro message'}</p><p className="mt-1 text-sm text-emerald-700">{selectedPlan.earningMessage || 'No earning message'}</p></div><button disabled={busy} className={secondary} onClick={() => perform(() => updatePerformerGrowthPlan(selectedPlan.id, { isActive: !selectedPlan.isActive }), selectedPlan.isActive ? 'Plan paused.' : 'Plan activated.')}>{selectedPlan.isActive ? 'Pause plan' : 'Activate plan'}</button></div>
            <div className="space-y-3"><h3 className="font-black text-slate-900">Improvement steps</h3>{selectedPlan.milestones.map((milestone) => <MilestoneRow key={milestone.id} milestone={milestone} resources={resources} busy={busy} onSave={(id, data) => perform(() => updatePerformerGrowthMilestone(id, data), 'Step updated.')} onComplete={(id, data) => perform(() => completePerformerManualMilestone(id, data), 'Completion verified and points credited once.')} />)}{selectedPlan.milestones.length === 0 && <p className="rounded-xl border border-dashed p-4 text-sm text-slate-500">Add the first action a performer can take.</p>}</div>
            <form onSubmit={addStep} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5"><h3 className="font-black text-slate-900">Add a step</h3><div className="grid gap-3 sm:grid-cols-2"><select className={field} value={newStep.type} onChange={(event) => setNewStep({ ...newStep, type: event.target.value, learningResourceId: '', rewardPoints: 0 })}>{['PROFILE_COMPLETION', 'KYC_VERIFICATION', 'PORTFOLIO', 'AVAILABILITY', 'COURSE', 'QUIZ', 'MANUAL_REVIEW'].map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}</select><input required className={field} value={newStep.title} onChange={(event) => setNewStep({ ...newStep, title: event.target.value })} placeholder="Step title" /><input className={field} value={newStep.description} onChange={(event) => setNewStep({ ...newStep, description: event.target.value })} placeholder="What should the performer do?" />{['COURSE', 'QUIZ'].includes(newStep.type) && <select required className={field} value={newStep.learningResourceId} onChange={(event) => setNewStep({ ...newStep, learningResourceId: event.target.value })}><option value="">Choose {newStep.type.toLowerCase()}</option>{resources.filter((resource) => resource.type === newStep.type && resource.categoryKey === selectedPlan.categoryKey).map((resource) => <option key={resource.id} value={resource.id}>{resource.title}</option>)}</select>}{['COURSE', 'QUIZ', 'MANUAL_REVIEW'].includes(newStep.type) && <label className="text-xs text-slate-500">Reward points<input type="number" min="0" className={field} value={newStep.rewardPoints} onChange={(event) => setNewStep({ ...newStep, rewardPoints: event.target.value })} /></label>}{newStep.type === 'QUIZ' && <label className="text-xs text-slate-500">Minimum score %<input type="number" min="0" max="100" className={field} value={newStep.minimumQuizScore} onChange={(event) => setNewStep({ ...newStep, minimumQuizScore: event.target.value })} /></label>}</div><button className={button} disabled={busy}><Plus size={15} /> Add step</button></form>
          </>}
        </div>
      </div>}

      {!loading && tab === 'learning' && <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-3"><h2 className="font-black text-slate-900">Published resources</h2>{resources.map((resource) => <div key={resource.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"><div><p className="font-bold text-slate-900">{resource.title}</p><p className="text-xs text-slate-500">{resource.category} · {resource.type} {resource.type === 'QUIZ' ? `· ${resource.questionsJson?.length || 0} questions · pass ${resource.passingScore}%` : ''}</p></div><button disabled={busy} className={secondary} onClick={() => perform(() => updatePerformerLearningResource(resource.id, { isActive: !resource.isActive }), resource.isActive ? 'Resource paused.' : 'Resource activated.')}>{resource.isActive ? 'Pause' : 'Activate'}</button></div>)}{resources.length === 0 && <p className="text-sm text-slate-500">No learning resources yet.</p>}</div>
        <form onSubmit={saveResource} className="self-start space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-black text-slate-900">Create a course or quiz</h2><input required className={field} placeholder="Category" value={newResource.category} onChange={(event) => setNewResource({ ...newResource, category: event.target.value })} /><select className={field} value={newResource.type} onChange={(event) => setNewResource({ ...newResource, type: event.target.value })}><option value="COURSE">Course</option><option value="QUIZ">Quiz</option></select><input required className={field} placeholder="Title" value={newResource.title} onChange={(event) => setNewResource({ ...newResource, title: event.target.value })} /><textarea className={field} placeholder="Description" value={newResource.description} onChange={(event) => setNewResource({ ...newResource, description: event.target.value })} />
          {newResource.type === 'COURSE' ? <input required type="url" className={field} placeholder="Course URL" value={newResource.contentUrl} onChange={(event) => setNewResource({ ...newResource, contentUrl: event.target.value })} /> : <><div className="grid grid-cols-2 gap-2"><label className="text-xs text-slate-500">Passing score %<input type="number" min="1" max="100" className={field} value={newResource.passingScore} onChange={(event) => setNewResource({ ...newResource, passingScore: event.target.value })} /></label><label className="text-xs text-slate-500">Attempts per day<input type="number" min="1" max="10" className={field} value={newResource.dailyAttemptLimit} onChange={(event) => setNewResource({ ...newResource, dailyAttemptLimit: event.target.value })} /></label></div>{newResource.questions.map((question, index) => <div key={index} className="space-y-2 rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-500">Question {index + 1}</p><input required className={field} placeholder="Question" value={question.prompt} onChange={(event) => updateQuestion(index, 'prompt', event.target.value)} />{question.choices.map((choice, choiceIndex) => <input key={choiceIndex} required className={field} placeholder={`Answer ${choiceIndex + 1}`} value={choice} onChange={(event) => updateQuestion(index, 'choices', question.choices.map((item, position) => position === choiceIndex ? event.target.value : item))} />)}<button type="button" className="text-xs font-bold text-emerald-700" onClick={() => updateQuestion(index, 'choices', [...question.choices, ''])} disabled={question.choices.length >= 6}>Add answer</button><label className="block text-xs text-slate-500">Correct answer<select className={field} value={question.correctIndex} onChange={(event) => updateQuestion(index, 'correctIndex', Number(event.target.value))}>{question.choices.map((_, choiceIndex) => <option key={choiceIndex} value={choiceIndex}>Answer {choiceIndex + 1}</option>)}</select></label></div>)}<button type="button" className={secondary} onClick={() => setNewResource({ ...newResource, questions: [...newResource.questions, blankQuestion()] })}><Plus size={14} /> Add question</button></>}
          <button className={button} disabled={busy}><Save size={15} /> Create resource</button></form>
      </div>}

      {!loading && tab === 'reviews' && <div className="space-y-3"><h2 className="font-black text-slate-900">Pending course evidence</h2>{submissions.map((submission) => <div key={submission.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1fr_1fr_auto]"><div><p className="font-bold text-slate-900">{submission.tasker?.displayName || submission.taskerId}</p><p className="text-xs text-slate-500">{submission.resource?.title} · {submission.resource?.category}</p><a href={submission.evidenceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-emerald-700 underline">Review evidence</a></div><textarea className={field} placeholder="Review note" value={reviewNotes[submission.id] || ''} onChange={(event) => setReviewNotes({ ...reviewNotes, [submission.id]: event.target.value })} /><div className="flex items-start gap-2"><button disabled={busy} className={button} onClick={() => perform(() => reviewPerformerCourseSubmission(submission.id, { status: 'APPROVED', reviewNote: reviewNotes[submission.id] || '' }), 'Course approved; linked milestones and points updated.') }><CheckCircle2 size={15} /> Approve</button><button disabled={busy} className={secondary} onClick={() => perform(() => reviewPerformerCourseSubmission(submission.id, { status: 'REJECTED', reviewNote: reviewNotes[submission.id] || '' }), 'Course submission rejected.') }><XCircle size={15} /> Reject</button></div></div>)}{submissions.length === 0 && <p className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No course submissions awaiting review.</p>}</div>}
      {!loading && tab === 'campaigns' && <PerformerCampaigns />}
    </div>
  );
}
