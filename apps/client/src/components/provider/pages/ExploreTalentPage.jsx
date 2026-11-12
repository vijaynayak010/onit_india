import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Bookmark, ShieldCheck } from "lucide-react";
import ProviderFlowLayout from "../layout/ProviderFlowLayout";
import NoTasksYetModal from "../components/NoTasksYetModal";
import { getTaskerRankings } from "../services/api";
import { useProviderData } from "../contexts/ProviderDataContext";
import { providerHasPostedTasks } from "../utils/taskSpotlight";
import { getSavedPerformerIds, toggleSavedPerformer } from "../utils/savedPerformers";
import { mapRankedTaskers } from "../../../utils/taskerRankings";

const FILTER_CHIPS = ["All", "Web Designer", "App Developer", "Research"];

const ExploreTalentPage = () => {
  const navigate = useNavigate();
  const { activities } = useProviderData();
  const [taskers, setTaskers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedIds, setSavedIds] = useState(() => getSavedPerformerIds());
  const [modalPerformer, setModalPerformer] = useState(null);

  const hasPostedTasks = providerHasPostedTasks(activities);

  useEffect(() => {
    getTaskerRankings({ limit: 50 })
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setTaskers(mapRankedTaskers(list));
      })
      .catch(() => setTaskers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return taskers.filter((p) => {
      const matchesSearch =
        !q ||
        p.displayName?.toLowerCase().includes(q) ||
        p.profession?.toLowerCase().includes(q) ||
        p.domain?.toLowerCase().includes(q) ||
        (p.skills || []).some((s) => String(s).toLowerCase().includes(q));

      const matchesFilter =
        activeFilter === "All" ||
        p.profession?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        p.domain?.toLowerCase().includes(activeFilter.toLowerCase()) ||
        (p.skills || []).some((s) => String(s).toLowerCase().includes(activeFilter.toLowerCase()));

      return matchesSearch && matchesFilter;
    });
  }, [taskers, searchQuery, activeFilter]);

  const handleAssignTask = (performer) => {
    if (!hasPostedTasks) {
      setModalPerformer(performer);
      return;
    }
    navigate(`/provider/task-applicants?performerId=${performer.id}`);
  };

  return (
    <ProviderFlowLayout title="Explore Talent" maxWidth="max-w-4xl">
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-subtle)]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search performers, skills, or roles..."
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-3.5 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setActiveFilter(chip)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              activeFilter === chip
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/30"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-[var(--color-text-muted)]">
            Loading performers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center text-sm font-semibold text-[var(--color-text-muted)]">
            No performers match your search.
          </div>
        ) : (
          filtered.map((p) => {
            const avatar =
              p.avatar ||
              p.user?.profilePicUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(p.displayName || "User")}&background=059669&color=fff&size=128`;

            return (
              <article
                key={p.id}
                className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <img src={avatar} alt={p.displayName} className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-gray-50" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-medium text-[var(--color-text)]">
                          {p.displayName || "Performer"}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                          <Star className="h-3 w-3 fill-current" strokeWidth={0} />
                          {p.ratingAvg || "5"}
                        </span>
                        {p.kycStatus === "VERIFIED" ? (
                          <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2.5} />
                        ) : null}
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                        {p.profession || p.domain || "Performer"}
                      </p>
                      <p className="text-xs font-medium text-[var(--color-text-subtle)]">
                        {p.rank != null ? `#${p.rank} · ` : ""}
                        {p.completedTasksCount || 0} completed tasks
                        {p.locationCity ? ` · ${p.locationCity}` : ""}
                        {p.rankingScore ? ` · score ${p.rankingScore}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSavedIds(toggleSavedPerformer(p.id))}
                    className="shrink-0 rounded-lg p-2 text-[var(--color-text-subtle)] transition hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)]"
                  >
                    <Bookmark
                      className="h-4 w-4"
                      fill={savedIds.includes(p.id) ? "currentColor" : "none"}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {p.bio || "Hi! An experienced top performer with a focus on quality."}
                </p>

                <div className="mb-5 flex flex-wrap gap-2">
                  {(p.skills || ["Product Design", "UI/UX", "Framer"]).slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-muted)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(`/provider/task-performer-profile/${p.id}`)}
                    className="flex-1 rounded-full border border-[var(--color-border)] bg-white py-3 text-sm font-bold text-[var(--color-text)] transition hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAssignTask(p)}
                    className="flex-1 rounded-full bg-[var(--color-primary)] py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
                  >
                    Assign Task
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <NoTasksYetModal
        open={Boolean(modalPerformer)}
        onClose={() => setModalPerformer(null)}
        performer={modalPerformer}
      />
    </ProviderFlowLayout>
  );
};

export default ExploreTalentPage;
