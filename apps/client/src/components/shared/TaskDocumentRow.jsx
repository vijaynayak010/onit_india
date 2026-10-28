import React from "react";
import { Eye, FileText } from "lucide-react";
import ShareFileMenu from "./ShareFileMenu";
import { formatFileSize, formatUploadedDate } from "../../utils/shareDocument";

const TaskDocumentRow = ({ file }) => {
  const fileName = file.filename || file.name || "Attachment";
  const fileUrl = file.url;

  const handleView = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-xs)] ring-1 ring-black/[0.03] transition hover:border-[var(--color-primary)]/25 hover:shadow-[var(--shadow-md)] sm:p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-14 sm:w-14 sm:rounded-2xl">
        <FileText className="h-6 w-6" strokeWidth={2.25} />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[15px] font-bold text-[var(--color-text)]">{fileName}</h4>
        <p className="mt-0.5 text-[13px] font-medium text-[var(--color-text-subtle)]">
          {formatFileSize(file.sizeBytes)}
          <span className="mx-1.5 text-[var(--color-border)]">•</span>
          Uploaded {formatUploadedDate(file.createdAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleView}
          disabled={!fileUrl}
          aria-label={`View ${fileName}`}
          className="rounded-lg p-2 text-[var(--color-text-subtle)] transition hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Eye className="h-5 w-5" strokeWidth={2} />
        </button>
        {fileUrl ? (
          <ShareFileMenu fileUrl={fileUrl} fileName={fileName} />
        ) : (
          <span className="inline-block w-9" aria-hidden />
        )}
      </div>
    </div>
  );
};

export default TaskDocumentRow;
