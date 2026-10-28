import React, { useCallback, useEffect, useState } from "react";
import { Camera, Edit2, Plus, Pencil, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import AddJobDescriptionModal from "./AddJobDescriptionModal";
import {
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../services/api";
import {
  buildTemplatePayload,
  mapTemplateFromApi,
  parseTemplatesListResponse,
} from "../../utils/templateHelpers";

const FieldCard = ({ label, value, onEdit }) => (
  <div className="relative rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]">
    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">{label}</label>
    <p className="pr-12 text-base font-bold text-[var(--color-text)]">{value || "Not provided"}</p>
    <button
      type="button"
      onClick={onEdit}
      className="absolute right-5 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[var(--color-text-subtle)] transition hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-primary)]"
      aria-label={`Edit ${label}`}
    >
      <Edit2 size={20} strokeWidth={2} />
    </button>
  </div>
);

const ProfileView = ({ onEditClick, onAddOrgClick }) => {
  const { user } = useAuth();
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    setLoadError("");
    try {
      const response = await listTemplates({ page: 1, limit: 50 });
      const { data: items } = parseTemplatesListResponse(response);
      setJobDescriptions(items.map(mapTemplateFromApi));
    } catch (err) {
      console.error("[ProfileView] Failed to load templates:", err);
      const message =
        err?.status === 401
          ? "Please sign in again as a provider to load job descriptions."
          : err?.message || "Failed to load job descriptions.";
      setLoadError(message);
      setJobDescriptions([]);
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const openAddModal = () => {
    setEditingJob(null);
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const handleSaveJob = async (formData) => {
    setSaving(true);
    try {
      const payload = buildTemplatePayload(formData);

      if (editingJob?.id) {
        const updated = await updateTemplate(editingJob.id, payload);
        const mapped = mapTemplateFromApi(updated);
        setJobDescriptions((prev) => prev.map((job) => (job.id === editingJob.id ? mapped : job)));
      } else {
        const created = await createTemplate(payload);
        const mapped = mapTemplateFromApi(created);
        setJobDescriptions((prev) => [mapped, ...prev]);
      }

      setModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Delete "${job.title}"?`)) return;

    try {
      await deleteTemplate(job.id);
      setJobDescriptions((prev) => prev.filter((item) => item.id !== job.id));
    } catch (err) {
      alert(err?.message || "Failed to delete job description.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-[var(--shadow-md)]">
              <img
                src={user?.profilePicUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                alt="Provider profile photo"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)]"
              aria-label="Change photo"
            >
              <Camera size={20} strokeWidth={2} />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Profile photo</p>
            <p className="mt-1 text-lg font-bold text-[var(--color-text)]">
              {user?.username || user?.name || (user?.email ? user.email.split('@')[0] : "Provider")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FieldCard label="Name" value={user?.username || user?.name || (user?.email ? user.email.split('@')[0] : '')} onEdit={onEditClick} />
        <FieldCard label="Phone" value={user?.phoneNumber || user?.phone} onEdit={onEditClick} />
        <FieldCard label="Email" value={user?.email} onEdit={onEditClick} />
        <FieldCard label="Location" value={user?.locationCity} onEdit={onEditClick} />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">Organization details</h2>
        <div className="flex flex-col gap-6 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <div className="flex h-24 w-28 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]/50 p-4">
              <img
                src="https://images.vexels.com/media/users/3/151871/isolated/preview/26e32bc00b74176378411b058133503c-flat-computer-tower-icon.png"
                alt="Organization placeholder icon"
                className="h-full w-full object-contain opacity-60 grayscale"
              />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-[var(--color-text)]">
                {user?.organization || "No organization added yet"}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">
                {user?.organization
                  ? "Manage your company settings and team."
                  : "Add an organization to post tasks on behalf of a company."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddOrgClick}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary-subtle)] px-6 py-3 text-sm font-bold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]/50"
          >
            <Plus size={18} strokeWidth={2.5} />
            {user?.organization ? "Edit details" : "Add organization"}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-bold text-[var(--color-text)]">Job Descriptions for Tasks</h3>

          {loadingTemplates ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
              {loadError}
              <button type="button" onClick={fetchTemplates} className="ml-2 underline">
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {jobDescriptions.map((job) => (
                <article
                  key={job.id}
                  className="relative rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:shadow-md"
                >
                  <div className="absolute right-3 top-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(job)}
                      className="rounded-md p-1 text-sky-500 transition hover:bg-sky-50"
                      aria-label={`Edit ${job.title}`}
                    >
                      <Pencil size={14} strokeWidth={2.25} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job)}
                      className="rounded-md p-1 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${job.title}`}
                    >
                      <Trash2 size={14} strokeWidth={2.25} />
                    </button>
                  </div>
                  <h4 className="pr-16 text-sm font-extrabold text-gray-900">{job.title}</h4>
                  {job.category ? (
                    <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">{job.category}</p>
                  ) : null}
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                    {job.description || "No description provided."}
                  </p>
                  {(job.skills?.length > 0 || job.priceAmount || job.duration) && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.duration ? (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                          {job.duration}
                        </span>
                      ) : null}
                      {job.priceAmount ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          ₹{Number(job.priceAmount).toLocaleString("en-IN")}
                        </span>
                      ) : null}
                      {(job.skills || []).slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}

              <button
                type="button"
                onClick={openAddModal}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-4 py-5 transition hover:border-sky-300 hover:bg-sky-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-sky-100">
                  <Plus size={16} className="text-[var(--color-primary)]" strokeWidth={2.5} />
                </span>
                <span className="text-xs font-bold text-gray-700">Add Job Description</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <AddJobDescriptionModal
        isOpen={modalOpen}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveJob}
        initialData={editingJob}
        saving={saving}
      />
    </div>
  );
};

export default ProfileView;