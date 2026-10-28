import React from "react";
import { Upload } from "lucide-react";

const AddOrgForm = ({ onSave, onCancel }) => {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Add organization</h2>
        <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">
          Used when you post tasks on behalf of a business or brand.
        </p>
      </div>

      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-subtle)]">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4305/4305512.png"
              alt="Organization logo placeholder"
              className="h-14 w-14 object-contain opacity-60"
            />
          </div>
          <div>
            <p className="text-base font-bold text-[var(--color-text)]">Logo</p>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] transition hover:underline"
            >
              <Upload size={16} strokeWidth={2} />
              Upload logo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
            Organization name
          </label>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 py-3.5">
            <input
              type="text"
              placeholder="Acme Technologies Pvt Ltd"
              className="w-full border-none bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
            Incorporation / registration number
          </label>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 py-3.5">
            <input
              type="text"
              placeholder="U12345ABCDE6789F"
              className="w-full border-none bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Bio</label>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 py-3.5">
          <textarea
            rows={3}
            placeholder="Short description shown on your public organization profile."
            className="w-full resize-none border-none bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-[var(--color-text)]">Contact information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Contact number</label>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 py-3.5">
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full border-none bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Email</label>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 py-3.5">
              <input
                type="email"
                placeholder="billing@company.com"
                className="w-full border-none bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-full bg-[var(--color-primary)] px-10 py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
        >
          Save organization
        </button>
        <button
          type="button"
          onClick={onCancel ?? onSave}
          className="rounded-full border border-[var(--color-border)] px-8 py-3 text-sm font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddOrgForm;
