import React, { useEffect, useRef, useState } from "react";
import { Share2, Copy, Check, Link2 } from "lucide-react";
import {
  copyDocumentLink,
  getDocumentShareTargets,
  openShareTarget,
  shareDocumentNative,
} from "../../utils/shareDocument";

const ShareFileMenu = ({ fileUrl, fileName, className = "" }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleNativeShare = async () => {
    try {
      setSharing(true);
      const shared = await shareDocumentNative(fileUrl, fileName);
      if (shared) {
        setOpen(false);
        return;
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Native share failed:", err);
      }
    } finally {
      setSharing(false);
    }
    setOpen(true);
  };

  const handleCopy = async () => {
    try {
      await copyDocumentLink(fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy link failed:", err);
    }
  };

  const shareTargets = getDocumentShareTargets(fileUrl, fileName);
  const canNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          if (canNativeShare && !open) {
            handleNativeShare();
          } else {
            setOpen((prev) => !prev);
          }
        }}
        aria-label={`Share ${fileName || "file"}`}
        aria-expanded={open}
        className="rounded-lg p-2 text-[var(--color-text-subtle)] transition hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-primary)]"
      >
        <Share2 className="h-5 w-5" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white py-1 shadow-[var(--shadow-lg)] ring-1 ring-black/[0.04]">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)]">
            Share file
          </p>
          {canNativeShare && (
            <button
              type="button"
              disabled={sharing}
              onClick={handleNativeShare}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-border-subtle)] disabled:opacity-60"
            >
              <Share2 className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2} />
              {sharing ? "Opening…" : "Share via device"}
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-border-subtle)]"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2.5} />
            ) : (
              <Copy className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2} />
            )}
            {copied ? "Link copied" : "Copy link"}
          </button>
          <div className="my-1 border-t border-[var(--color-border)]" />
          {shareTargets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => {
                openShareTarget(target.id, fileUrl, fileName);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-border-subtle)]"
            >
              <Link2 className="h-4 w-4 text-[var(--color-text-subtle)]" strokeWidth={2} />
              {target.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareFileMenu;
