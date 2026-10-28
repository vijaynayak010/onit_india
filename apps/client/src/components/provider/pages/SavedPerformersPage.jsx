import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Star, Loader2, Users } from "lucide-react";
import ProviderAccountPageLayout from "../components/ProviderAccountPageLayout";
import { getSavedPerformers } from "../services/api";
import { getSavedPerformerIds, toggleSavedPerformer } from "../utils/savedPerformers";

const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const SavedPerformerCard = ({ performer, onRemove }) => {
  const navigate = useNavigate();
  const name = performer.displayName || performer.user?.email?.split("@")[0] || "Performer";
  const title = performer.profession || "Task Performer";
  const rating = performer.ratingAvg || performer.user?.ratingAvg || 0;
  const completed = performer.completedTasksCount || 0;
  const bio =
    performer.bio ||
    "Hi! An experienced top performer with a focus on quality.";
  const skills = (performer.skills || []).slice(0, 3);
  const avatar =
    performer.user?.profilePicUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;

  return (
    <article className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={() => onRemove(performer.id)}
        className="absolute right-5 top-5 text-emerald-500 transition hover:text-emerald-600"
        aria-label="Remove from saved"
      >
        <Bookmark size={20} fill="currentColor" strokeWidth={0} />
      </button>

      <div className="flex items-start gap-4 pr-8">
        {performer.user?.profilePicUrl ? (
          <img src={avatar} alt={name} className="h-14 w-14 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            {getInitials(name)}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-extrabold text-gray-900">{name}</h2>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-800">
              <Star size={14} className="fill-amber-400 text-amber-400" strokeWidth={0} />
              {Number(rating).toFixed(rating % 1 === 0 ? 0 : 1)}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-semibold text-gray-700">{title}</p>
          <p className="mt-0.5 text-xs font-medium text-gray-400">{completed} completed tasks</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-600">{bio}</p>

      {skills.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => navigate(`/provider/task-performer-profile/${performer.id}`)}
          className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={() => navigate("/provider/post-task-selection", { state: { performerId: performer.id } })}
          className="flex-1 rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
        >
          Assign Task
        </button>
      </div>
    </article>
  );
};

const SavedPerformersPage = () => {
  const navigate = useNavigate();
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSavedPerformers({ limit: 50 });
      const data = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
      const resolved = data.map((item) => item.tasker || item).filter(Boolean);
      setPerformers(resolved);
      // Sync localStorage with current API state
      const ids = resolved.map((p) => p.id).filter(Boolean);
      localStorage.setItem("onit_provider_saved_performers", JSON.stringify(ids));
    } catch (err) {
      console.error("[SavedPerformers] load error:", err);
      // Fallback: keep whatever was loaded
      setPerformers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const handleRemove = (id) => {
    toggleSavedPerformer(id);
    setPerformers((prev) => prev.filter((p) => p.id !== id));
  };

  const subtitle =
    performers.length === 1
      ? "1 saved profile"
      : `${performers.length} saved profiles`;

  return (
    <ProviderAccountPageLayout title="Saved Performers" subtitle={loading ? "Loading…" : subtitle}>
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : performers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <Users className="mb-4 h-12 w-12 text-gray-300" strokeWidth={1.5} />
          <p className="text-lg font-bold text-gray-700">No saved performers yet</p>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Bookmark performers while browsing to quickly assign them to future tasks.
          </p>
          <button
            type="button"
            onClick={() => navigate("/provider/task-performers")}
            className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            Browse Performers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {performers.map((performer) => (
            <SavedPerformerCard key={performer.id} performer={performer} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </ProviderAccountPageLayout>
  );
};

export default SavedPerformersPage;
