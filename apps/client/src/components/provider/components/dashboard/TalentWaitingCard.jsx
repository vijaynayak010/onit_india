import React from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { AnimatedReveal, GradientActionButton, LiveChip } from "./DashboardAnimatedCard";

const TalentWaitingCard = ({ performers = [], availableCount, embedded = false }) => {
  const navigate = useNavigate();
  const count = availableCount ?? performers.length ?? 0;
  const avatars = performers.slice(0, 4);

  const content = (
    <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
                <Users className="h-4.5 w-4.5" strokeWidth={2.25} />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-[var(--color-text)]">
                Talent waiting for new tasks
              </h2>
              <LiveChip label="Open" />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              {count > 0 ? `${count}+ active performers available.` : "Discover performers ready for your next task."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {["UI/UX", "Graphic Design", "Video Editing"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {avatars.length > 0 ? (
                <div className="flex -space-x-2">
                  {avatars.map((p, i) => (
                    <img
                      key={p.id || i}
                      src={
                        p.avatar ||
                        p.user?.profilePicUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(p.person || p.displayName || "P")}&background=059669&color=fff&size=64`
                      }
                      alt=""
                      className="h-8 w-8 rounded-full border-2 border-white object-cover ring-1 ring-[var(--color-border)]"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <GradientActionButton
            actionType="explore"
            onClick={() => navigate("/provider/explore-talent")}
          />
        </div>
      </section>
  );

  if (embedded) return content;

  return <AnimatedReveal>{content}</AnimatedReveal>;
};

export default TalentWaitingCard;
