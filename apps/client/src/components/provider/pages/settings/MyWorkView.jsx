import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ClipboardList, FileClock, File, ChevronRight, BarChart2 } from 'lucide-react';

const SettingRow = ({ icon: Icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="group flex cursor-pointer items-center justify-between border-b border-[var(--color-border)] px-4 py-4 last:border-0 hover:bg-[var(--color-primary-subtle)]/40"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] transition group-hover:scale-105">
        <Icon size={20} strokeWidth={2} />
      </div>
      <span className="text-[14.5px] font-bold text-[var(--color-text)]">{label}</span>
    </div>
    <ChevronRight size={18} className="text-[var(--color-text-subtle)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]" />
  </div>
);

const MyWorkView = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)] transition hover:shadow-md">
      <SettingRow icon={BarChart2} label="Provider insights" onClick={() => navigate("/provider/settings?tab=insights")} />
      <SettingRow icon={File} label="Saved Templates" onClick={() => navigate("/provider/task-templates")} />
      <SettingRow icon={Bookmark} label="Saved Performers" onClick={() => navigate("/provider/saved-performers")} />
      <SettingRow icon={ClipboardList} label="Draft Tasks" onClick={() => navigate("/provider/draft-tasks")} />
      <SettingRow icon={FileClock} label="Posted Task History" onClick={() => navigate("/provider/task-history")} />
    </div>
  );
};

export default MyWorkView;