import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Calendar, CheckCircle2, CircleDollarSign, FileText,
  MapPin, RefreshCw, Tag,
} from 'lucide-react';
import ProviderFlowLayout from '../layout/ProviderFlowLayout';
import { getTaskDetails } from '../services/api';

const formatMoney = (amount) =>
  amount != null ? `₹${Number(amount).toLocaleString('en-IN')}` : '—';

const formatDate = (value) => {
  if (!value) return 'Not set';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? 'Not set'
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Field = ({ label, children }) => (
  <div>
    <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--color-text-subtle)]">{label}</p>
    <div className="text-sm font-semibold text-[var(--color-text)]">{children}</div>
  </div>
);

const TaskManagementPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!taskId) { setLoading(false); setError('No task ID provided.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await getTaskDetails(taskId);
      setTask(data);
    } catch {
      setError('Could not load task details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => { load(); }, [load]);

  const checklist = task?.details?.checklist || task?.executionChecklist || task?.execution_checklist || [];
  const skills = Array.isArray(task?.skills) ? task.skills : [];
  const files = Array.isArray(task?.files) ? task.files : [];

  if (loading) {
    return (
      <ProviderFlowLayout title="Task Details" backTo="/provider/my-tasks" maxWidth="max-w-3xl">
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
        </div>
      </ProviderFlowLayout>
    );
  }

  if (error || !task) {
    return (
      <ProviderFlowLayout title="Task Details" backTo="/provider/my-tasks" maxWidth="max-w-3xl">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="font-bold text-red-700">{error || 'Task not found.'}</p>
          <button type="button" onClick={load} className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      </ProviderFlowLayout>
    );
  }

  return (
    <ProviderFlowLayout title="Task Details" backTo="/provider/my-tasks" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header card */}
        <section className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
          <div className="border-l-4 border-[var(--color-primary)] p-6 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#29ADAC]/30 bg-[#EFFBFB] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#10605F]">
                {String(task.status || 'Draft').replaceAll('_', ' ')}
              </span>
              {task.category && (
                <span className="rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[var(--color-primary)]">
                  {task.category}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">
              {task.title || 'Untitled Task'}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[var(--color-text-muted)]">
              <span className="inline-flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4" />
                {formatMoney(task.priceAmount)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due {formatDate(task.dueAt)}
              </span>
              {task.locationAddress && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {task.locationAddress}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        {task.description && (
          <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-xs)] sm:p-8">
            <h2 className="mb-4 text-base font-black text-[var(--color-text)]">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-muted)]">{task.description}</p>
          </section>
        )}

        {/* Checklist */}
        {checklist.length > 0 && (
          <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-xs)] sm:p-8">
            <h2 className="mb-5 text-base font-black text-[var(--color-text)]">Checklist</h2>
            <ul className="space-y-3">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" strokeWidth={2.5} />
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    {typeof item === 'string' ? item : item?.title || item?.task || String(item)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-xs)] sm:p-8">
            <h2 className="mb-4 text-base font-black text-[var(--color-text)]">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1.5 text-xs font-bold text-[var(--color-text-muted)]">
                  <Tag className="h-3 w-3" strokeWidth={2.5} />
                  {typeof s === 'string' ? s : s?.name || String(s)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Files */}
        {files.length > 0 && (
          <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-xs)] sm:p-8">
            <h2 className="mb-4 text-base font-black text-[var(--color-text)]">Attachments</h2>
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f.id}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    <FileText className="h-4 w-4" strokeWidth={2} />
                    {f.filename || 'Attachment'}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Action row */}
        <div className="flex flex-wrap gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate(`/provider/task-activity?taskId=${taskId}`)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
          >
            View Activity & Applicants
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface-elevated)] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back
          </button>
        </div>
      </div>
    </ProviderFlowLayout>
  );
};

export default TaskManagementPage;
