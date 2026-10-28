import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import {
  cancelAccountDeletionRequest,
  getAccountDeletionRequest,
} from "../provider/services/api";
import { useAuth } from "../../contexts/AuthContext";

const RestoreAccountPage = ({ appLabel = "Provider", dashboardPath = "/provider/dashboard" }) => {
  const navigate = useNavigate();
  const { refreshProfile, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [deletionRequest, setDeletionRequest] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getAccountDeletionRequest();
        if (active) setDeletionRequest(data || null);
      } catch (err) {
        if (active) setError(err?.message || "Could not load account status.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleRestore = async () => {
    setRestoring(true);
    setError("");
    try {
      await cancelAccountDeletionRequest();
      await refreshProfile();
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to restore account. Please try again.");
    } finally {
      setRestoring(false);
    }
  };

  const scheduledDate = deletionRequest?.scheduledDeletionAt
    ? new Date(deletionRequest.scheduledDeletionAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4 py-16">
      <div className="w-full max-w-lg rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-lg)] sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)]">
          <ShieldCheck className="h-8 w-8 text-[var(--color-primary)]" strokeWidth={2} />
        </div>

        <h1 className="text-center text-2xl font-black text-[var(--color-text)]">
          Restore your account
        </h1>
        <p className="mt-3 text-center text-sm font-medium leading-relaxed text-[var(--color-text-muted)]">
          Your {appLabel} account is deactivated and scheduled for deletion.
          {scheduledDate
            ? ` You can restore it anytime before ${scheduledDate}.`
            : " You can restore it within the 30-day cooling-off period."}
        </p>

        {loading ? (
          <div className="mt-8 flex justify-center text-[var(--color-primary)]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {error ? (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleRestore}
              disabled={restoring}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
            >
              {restoring ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" strokeWidth={2.25} />
              )}
              {restoring ? "Restoring…" : "Restore My Account"}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="w-full rounded-full border border-[var(--color-border)] py-3.5 text-sm font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)]"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestoreAccountPage;
