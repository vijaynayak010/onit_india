
import React, { useEffect, useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import {
  mapHomeCategoryToBrowseItem,
  useHomeContent,
} from "../../../services/homeContent";
import { getMyTaskerRanking } from "../services/api";
import { formatRankLabel, mapRankedTasker } from "../../../utils/taskerRankings";

const MORE_ITEM = {
  id: "more",
  label: "More",
  icon: LayoutGrid,
  iconBg: "bg-gray-100",
  iconColor: "text-gray-500",
};

const SKILL_ACCENTS = [
  { iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  { iconBg: "bg-fuchsia-100", iconColor: "text-fuchsia-600" },
  { iconBg: "bg-sky-100", iconColor: "text-sky-600" },
  { iconBg: "bg-rose-100", iconColor: "text-rose-600" },
  { iconBg: "bg-[#DFF7F6]", iconColor: "text-[#10605F]" },
  { iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { iconBg: "bg-teal-100", iconColor: "text-teal-600" },
  { iconBg: "bg-orange-100", iconColor: "text-orange-600" },
];

export function FindWorkBySkills({ onSkillSelect }) {
  const { categories, loading } = useHomeContent();

  const skills = useMemo(() => {
    const mapped = categories.map((cat, index) => {
      const item = mapHomeCategoryToBrowseItem(cat, index);
      const accent = SKILL_ACCENTS[index % SKILL_ACCENTS.length];
      return {
        ...item,
        iconBg: accent.iconBg,
        iconColor: accent.iconColor,
      };
    });
    if (!mapped.length) return [];
    return [...mapped, MORE_ITEM];
  }, [categories]);

  if (!loading && !skills.length) return null;
  return (
    <section aria-labelledby="find-work-by-skills">
      <h2
        id="find-work-by-skills"
        className="mb-4 text-[17px] font-bold tracking-tight text-gray-900"
      >
        Find Work By Skills
      </h2>

      {loading ? (
        <div className="-mx-1 flex gap-3 overflow-hidden px-1 pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex w-[108px] shrink-0 animate-pulse flex-col items-center rounded-2xl border border-gray-100 bg-white px-3 py-4 shadow-sm"
            >
              <div className="mb-3 h-11 w-11 rounded-xl bg-gray-100" />
              <div className="h-3 w-16 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1 scrollbar-hide">
          <div className="flex flex-nowrap gap-3">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => onSkillSelect?.(skill)}
                  className="flex w-[108px] shrink-0 flex-col items-center rounded-2xl border border-gray-100 bg-white px-3 py-4 shadow-sm transition hover:border-[#29ADAC]/30 hover:shadow-md active:scale-[0.98]"
                >
                  {skill.imageUrl && skill.id !== "more" ? (
                    <div className="mb-3 h-11 w-11 overflow-hidden rounded-xl">
                      <img
                        src={skill.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${skill.iconBg} ${skill.iconColor}`}
                    >
                      <Icon size={22} strokeWidth={2} />
                    </div>
                  )}
                  <span className="text-center text-[12px] font-bold leading-tight text-gray-800">
                    {skill.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export function PerformanceRankingCard({ onViewRanking }) {
  const [rankLabel, setRankLabel] = useState(null);
  const [category, setCategory] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyTaskerRanking({ limit: 1 })
      .then((res) => {
        if (cancelled) return;
        const me = res?.data ? mapRankedTasker(res.data) : null;
        setRankLabel(formatRankLabel(me?.rank));
        setCategory(res?.category || null);
        setScore(me?.rankingScore ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setRankLabel(null);
          setCategory(null);
          setScore(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <section aria-labelledby="performance-ranking">
      <h2
        id="performance-ranking"
        className="mb-4 text-[17px] font-bold tracking-tight text-gray-900"
      >
        Performance Ranking
      </h2>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="px-5 py-5">
          <h3 className="text-[16px] font-bold text-slate-800">
            {loading ? "Loading…" : rankLabel && rankLabel !== "Unranked" ? rankLabel : "Build Your Reputation"}
          </h3>
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-gray-500">
            {loading
              ? "Fetching your live ranking…"
              : rankLabel && rankLabel !== "Unranked"
                ? `${category || "Overall"} · score ${score ?? 0}. Keep completing tasks to climb higher.`
                : "Complete your first task and start building your presence on FirstDoer."}
          </p>
        </div>
        <div className="border-t border-gray-100 px-5 py-3.5">
          <button
            type="button"
            onClick={onViewRanking}
            className="text-[14px] font-bold text-[#10605F] transition hover:text-[#00925f]"
          >
            Current Ranking
          </button>
        </div>
      </div>
    </section>
  );
}
