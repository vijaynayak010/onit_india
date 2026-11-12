import React from "react";
import { CheckCircle2, FileText, ExternalLink } from "lucide-react";
import { formatUploadedDate } from "../../utils/shareDocument";
import { isChecklistItemInReview, isChecklistItemComplete, isChecklistItemDisputed, isImageUrl } from "../../utils/checklistSubmission";

const SubmissionChecklistItemCard = ({ item, onRequestChanges, onApprove, approving }) => {
  const { submission, text, description, meta, apiStatus, providerFeedback, githubLink } = item;
  const displayDescription =
    submission?.description || description || "The performer has submitted this step for your review.";
  const submissionFiles = Array.isArray(submission?.files) ? submission.files : [];
  const providerFiles = Array.isArray(submission?.providerFiles) ? submission.providerFiles : [];
  const inReview = isChecklistItemInReview(apiStatus);
  const completed = isChecklistItemComplete(apiStatus);
  const disputed = isChecklistItemDisputed(apiStatus) || item.isDisputed;
  const changeRequested = String(apiStatus || "").toUpperCase() === "CHANGE_REQUESTED";

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-xs)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-medium text-[var(--color-text)]">{text}</h4>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                completed
                  ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                  : disputed
                    ? "bg-red-50 text-red-700"
                    : changeRequested
                    ? "bg-amber-50 text-amber-700"
                    : "bg-sky-50 text-sky-700"
              }`}
            >
              Status: {meta || item.status || "In Review"}
            </span>
          </div>
        </div>
        {submission?.submittedAt && (
          <span className="shrink-0 text-xs font-semibold text-[var(--color-text-subtle)]">
            {formatUploadedDate(submission.submittedAt)}
          </span>
        )}
      </div>

      {displayDescription && (
        <p className="mb-4 text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
          {displayDescription}
        </p>
      )}

      {(githubLink || submission?.githubLink) && (
        <a
          href={(githubLink || submission.githubLink).startsWith("http") ? (githubLink || submission.githubLink) : `https://${githubLink || submission.githubLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Work link
        </a>
      )}
      {submissionFiles.length > 0 && (
        <div className="mb-5 space-y-3">
          {submissionFiles.map((file, index) => {
            const url = file?.url || file?.fileUrl || file?.documentUrl || file?.s3Url || "";
            const name = file?.filename || file?.name || `Submission file ${index + 1}`;
            if (!url) return null;
            return isImageUrl(url) ? (
              <a key={file?.id || url} href={url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-[var(--color-border)]">
                <img src={url} alt={name} className="max-h-64 w-full object-contain bg-[var(--color-surface)]" />
              </a>
            ) : (
              <div key={file?.id || url} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 px-4 py-3">
                <FileText className="h-5 w-5 shrink-0 text-[var(--color-primary)]" strokeWidth={2} />
                <a href={url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] hover:underline">
                  {name}
                </a>
              </div>
            );
          })}
        </div>
      )}

      {providerFeedback && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm font-medium text-amber-900">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">Your feedback</p>
          {providerFeedback}
          {providerFiles.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-amber-200 pt-3">
              {providerFiles.map((file, index) => {
                const url = file?.url || file?.fileUrl || file?.documentUrl || file?.s3Url || "";
                if (!url) return null;
                return (
                  <a
                    key={file?.id || url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-bold text-amber-800 hover:underline"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{file?.filename || file?.name || `Reference file ${index + 1}`}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}

      {inReview ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onRequestChanges(item)}
            className="flex-1 rounded-full border-2 border-amber-400 bg-white py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-50 active:scale-[0.98]"
          >
            Request Changes
          </button>
          <button
            type="button"
            onClick={() => onApprove(item)}
            disabled={approving}
            className="flex-1 rounded-full bg-[var(--color-primary)] py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-50"
          >
            {approving ? "Approving…" : "Approve"}
          </button>
        </div>
      ) : disputed ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          This submission is locked for admin review after repeated change requests.
          {item.disputeReason ? <p className="mt-1 text-xs font-medium">{item.disputeReason}</p> : null}
        </div>
      ) : changeRequested ? (
        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
          Revision Required — waiting for performer resubmit
        </span>
      ) : (
        <span className="inline-flex rounded-full bg-[var(--color-primary-subtle)] px-3 py-1.5 text-xs font-bold text-[var(--color-primary)]">
          Approved
        </span>
      )}
    </div>
  );
};

export default SubmissionChecklistItemCard;
