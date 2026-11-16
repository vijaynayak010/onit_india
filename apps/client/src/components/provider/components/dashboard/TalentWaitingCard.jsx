import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { AnimatedReveal } from "./DashboardAnimatedCard";
import { StatusBadge } from "../../../shared/dashboard";

const TalentWaitingCard = ({ performers = [], availableCount, embedded = false }) => {
  const navigate = useNavigate();
  const count = availableCount ?? performers.length ?? 0;
  const avatars = performers.slice(0, 4);

  const content = (
    <section
      style={{ padding: "16px 24px" }}
      className="overflow-hidden rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] shadow-[var(--shadow-sm)]"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--dash-canvas)] text-[var(--dash-primary-700)]">
            <Users className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-heading font-medium tracking-tight text-[var(--dash-text)]">
                Talent waiting for new tasks
              </h2>
              <StatusBadge variant="live" dot>
                Open
              </StatusBadge>
            </div>
            <p className="dash-kpi tabular-nums text-xs font-medium text-[var(--dash-text-secondary)]">
              {count > 0
                ? `${count}+ active performers available.`
                : "Discover performers ready for your next task."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <div className="hidden flex-wrap gap-1.5 sm:flex">
            {["UI/UX", "Graphic Design", "Video Editing"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-2.5 py-1 text-[11px] font-medium text-[var(--dash-text-secondary)]"
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
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      p.person || p.displayName || "P",
                    )}&background=1B8887&color=fff&size=64`
                  }
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white object-cover ring-1 ring-[var(--dash-border)]"
                />
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => navigate("/provider/explore-talent")}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[var(--dash-primary-700)] px-4 text-xs font-medium text-white shadow-[var(--shadow-xs)] transition hover:bg-[var(--dash-primary-800)]"
          >
            <span>Explore</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );

  if (embedded) return content;

  return <AnimatedReveal>{content}</AnimatedReveal>;
};

export default TalentWaitingCard;
