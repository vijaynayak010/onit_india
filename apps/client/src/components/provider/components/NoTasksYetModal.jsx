import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoTasksYetModal = ({ open, onClose, performer, onPostTask }) => {
  const navigate = useNavigate();

  const name = performer?.displayName || performer?.person || performer?.name || "this performer";
  const profession = performer?.profession || performer?.name || "Performer";
  const rating = performer?.ratingAvg ?? performer?.rating ?? "4.9";
  const avatar =
    performer?.user?.profilePicUrl ||
    performer?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff&size=128`;

  const handlePostTask = () => {
    onClose?.();
    if (onPostTask) {
      onPostTask();
      return;
    }
    navigate("/provider/post-task-selection");
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close modal backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="no-tasks-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--color-text-subtle)] transition hover:bg-gray-100 hover:text-[var(--color-text)]"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 id="no-tasks-modal-title" className="pr-8 text-xl font-extrabold text-[var(--color-text)]">
              No Tasks Yet
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
              You haven&apos;t posted any task yet. Please post a task to invite{" "}
              <span className="font-bold text-[var(--color-text)]">{name}</span> as a performer.
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[var(--color-text)]">{name}</p>
                <p className="truncate text-xs font-medium text-[var(--color-text-muted)]">{profession}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                <Star className="h-3 w-3 fill-current" strokeWidth={0} />
                {rating}
              </div>
            </div>

            <button
              type="button"
              onClick={handlePostTask}
              className="mt-6 w-full rounded-full bg-[var(--color-primary)] py-3.5 text-[15px] font-bold text-white shadow-[0_4px_16px_-4px_rgba(16,96,95,0.45)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
            >
              Post a Task
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default NoTasksYetModal;
