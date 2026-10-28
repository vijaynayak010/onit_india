import React, { useState } from "react";
import { Bell, Clock, ListTodo, MessageSquare, ToggleLeft } from "lucide-react";

const Toggle = ({ checked, onChange, id }) => (
  <button
    type="button"
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

const Row = ({ icon: Icon, title, description, checked, onChange }) => (
  <div className="flex flex-col gap-4 border-b border-[var(--color-border)]/80 py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-[var(--color-text)]">{title}</p>
        <p className="mt-0.5 text-sm font-semibold text-[var(--color-text-muted)]">{description}</p>
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const TasksSettingsView = () => {
  const [notifyNew, setNotifyNew] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <div className="mb-6 flex items-center gap-3 border-b border-[var(--color-border)] pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]">
            <ListTodo size={22} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Task preferences</h3>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Control how you are notified about task activity.</p>
          </div>
        </div>

        <Row
          icon={Bell}
          title="New applications & proposals"
          description="Get notified when performers respond to your open tasks."
          checked={notifyNew}
          onChange={setNotifyNew}
        />
        <Row
          icon={MessageSquare}
          title="Messages on active tasks"
          description="Alerts for chat messages from assigned performers."
          checked={notifyMessages}
          onChange={setNotifyMessages}
        />
        <Row
          icon={Clock}
          title="Deadline reminders"
          description="Reminders before task due dates you set when posting."
          checked={deadlineReminders}
          onChange={setDeadlineReminders}
        />
        <Row
          icon={ToggleLeft}
          title="Weekly summary email"
          description="A single digest of task status instead of individual emails."
          checked={digest}
          onChange={setDigest}
        />
      </div>

      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm font-semibold text-[var(--color-text-muted)]">
        Default budgets, categories, and templates are managed from{" "}
        <span className="font-bold text-[var(--color-text)]">Post task</span> and{" "}
        <span className="font-bold text-[var(--color-text)]">Task templates</span> in the main navigation.
      </div>
    </div>
  );
};

export default TasksSettingsView;
