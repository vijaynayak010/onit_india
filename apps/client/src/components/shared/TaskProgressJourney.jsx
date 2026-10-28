import React from "react";
import { Check, Flag, Lock, Sparkles } from "lucide-react";

/** Shared, read-only view of the checklist journey. Actions stay in parent screens. */
const TaskProgressJourney = ({ items = [], nextActionableId, completedCount = 0 }) => {
    if (!items.length) return null;

    const total = items.length;
    const progress = Math.round((completedCount / total) * 100);

    return (
        <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20 bg-gradient-to-br from-emerald-50 via-white to-white p-4 sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--color-primary)]">
                        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                        Task journey
                    </div>
                    <h3 className="mt-1 text-lg font-bold tracking-tight text-[var(--color-text)]">
                        {completedCount === total ? "Journey complete!" : `${completedCount} of ${total} checkpoints cleared`}
                    </h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--color-primary)] shadow-[var(--shadow-xs)] ring-1 ring-[var(--color-primary)]/15">
                    {progress}% complete
                </span>
            </div>

            <div className="mb-5 h-2 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>

            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => {
                    const complete = Boolean(item.checked);
                    const current = !complete && item.id === nextActionableId;
                    const stateLabel = complete ? "Cleared" : current ? "Ready to submit" : "After previous step";

                    return (
                        <li key={item.id || `${item.text}-${index}`} className="relative min-w-0">
                            <div className={`flex min-h-[84px] gap-3 rounded-2xl border p-3 transition ${
                                complete
                                    ? "border-emerald-200 bg-emerald-50/70"
                                    : current
                                      ? "border-[var(--color-primary)]/45 bg-white shadow-[var(--shadow-sm)]"
                                      : "border-[var(--color-border)] bg-white/70"
                            }`}>
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                    complete ? "bg-[var(--color-primary)] text-white" : current ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10" : "bg-[var(--color-border-subtle)] text-[var(--color-text-subtle)]"
                                }`}>
                                    {complete ? <Check className="h-5 w-5" strokeWidth={3} /> : index + 1}
                                </div>
                                <div className="min-w-0 pt-0.5">
                                    <p className="line-clamp-2 text-sm font-bold leading-snug text-[var(--color-text)]">{item.text || item.title}</p>
                                    <div className={`mt-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${
                                        complete ? "text-emerald-700" : current ? "text-[var(--color-primary)]" : "text-[var(--color-text-subtle)]"
                                    }`}>
                                        {complete ? <Check className="h-3 w-3" strokeWidth={3} /> : current ? <Flag className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                        {stateLabel}
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};

export default TaskProgressJourney;
