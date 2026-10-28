import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  FileText,
  Headphones,
  Loader2,
  MoreVertical,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import SupportCategorySheet from "../components/support/SupportCategorySheet";
import { SUPPORT_CATEGORIES } from "../utils/supportCategories";
import { getChecklist, getProviderProfile, getTaskDetails } from "../services/api";
import {
  resolveClientDisplayName,
  resolveProviderProfileId,
} from "../utils/performerClientUtils";

const PerformerTaskSupportPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [clientName, setClientName] = useState("Client");
  const [progressPct, setProgressPct] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id || id === ":id") {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [taskRes, checklistRes] = await Promise.all([
          getTaskDetails(id),
          getChecklist(id).catch(() => ({ items: [] })),
        ]);
        if (cancelled) return;

        const taskObj = taskRes?.data ?? taskRes;
        setTask(taskObj || null);

        const items = checklistRes?.items || checklistRes?.data?.items || [];
        const total = items.length;
        const done = items.filter((i) => i.isChecked || i.checked).length;
        setProgressPct(total > 0 ? Math.round((done / total) * 100) : 0);

        const providerProfileId = resolveProviderProfileId(taskObj);
        let providerProfile = null;
        if (providerProfileId) {
          try {
            const pRes = await getProviderProfile(providerProfileId);
            providerProfile = pRes?.data ?? pRes;
          } catch {
            /* optional */
          }
        }
        if (!cancelled) {
          setClientName(resolveClientDisplayName(taskObj, providerProfile));
        }
      } catch (err) {
        console.error("Failed to load support task context:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const activeCategory = useMemo(
    () => SUPPORT_CATEGORIES.find((c) => c.id === activeCategoryId) || null,
    [activeCategoryId]
  );

  const taskTitle = task?.title || "Your task";
  const taskRef = task?.id ? `Task #${String(task.id).slice(0, 8)}` : "Task";

  const goToSupportChat = () => {
    setActiveCategoryId(null);
    navigate("/performer/chats");
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-16 pt-[80px] font-sans text-[var(--color-text)] lg:pl-[220px]">
      <PerformerHeader activePage="my-tasks" />

      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(`/performer/active-task/${id}`)}
            className="flex items-center gap-1.5 text-[18px] font-bold text-[var(--color-text)] transition hover:opacity-80"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
            Support
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-[var(--color-text-muted)] transition hover:bg-gray-100"
            aria-label="More options"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--color-primary)]">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" />
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Loading support…
            </p>
          </div>
        ) : (
          <>
            <motion.article
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText size={22} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[15px] font-bold text-[var(--color-text)]">
                  {taskTitle}
                </h2>
                <p className="mt-0.5 truncate text-[12px] font-medium text-[var(--color-text-muted)]">
                  {clientName} · {taskRef}
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                      style={{ width: `${Math.min(100, progressPct)}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-[12px] font-bold text-[var(--color-primary)]">
                    {progressPct}% done
                  </span>
                </div>
              </div>
            </motion.article>

            <h3 className="mb-4 text-[17px] font-bold text-[var(--color-text)]">
              How can we help you?
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SUPPORT_CATEGORIES.map((cat) => {
                const { Icon } = cat;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 text-left shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-sm)]"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cat.iconBg}`}
                    >
                      <Icon size={22} className={cat.iconColor} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[var(--color-text)]">
                        {cat.title}
                      </p>
                      <p className="mt-0.5 text-[12px] font-medium leading-snug text-[var(--color-text-muted)]">
                        {cat.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Headphones size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[var(--color-text)]">
                    Live Chat Support
                  </p>
                  <p className="text-[12px] font-medium text-[var(--color-text-muted)]">
                    Avg. response — 2 mins
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={goToSupportChat}
                className="shrink-0 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
              >
                Chat Now
              </button>
            </div>
          </>
        )}
      </main>

      <SupportCategorySheet
        open={!!activeCategory}
        category={activeCategory}
        onClose={() => setActiveCategoryId(null)}
        onChatSupport={goToSupportChat}
      />
    </div>
  );
};

export default PerformerTaskSupportPage;
