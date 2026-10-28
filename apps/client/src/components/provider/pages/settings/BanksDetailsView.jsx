import React, { useState, useEffect } from "react";
import { Building2, CheckCircle2, Landmark, Plus, Shield, Loader2, Trash2, X } from "lucide-react";
import { getPayoutMethods, addPayoutMethod, deletePayoutMethod } from "../../services/api";

const BanksDetailsView = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newBank, setNewBank] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    type: "Savings"
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getPayoutMethods();
      setAccounts(data || []);
    } catch (err) {
      console.error("Failed to fetch bank accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddBank = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addPayoutMethod({
        type: "BANK_ACCOUNT",
        details: {
          accountHolder: newBank.accountHolder,
          accountNumber: newBank.accountNumber,
          ifscCode: newBank.ifscCode,
          bankName: newBank.bankName,
        },
      });
      setShowAddForm(false);
      setNewBank({ bankName: "", accountHolder: "", accountNumber: "", ifscCode: "", type: "Savings" });
      fetchAccounts();
    } catch (err) {
      alert("Failed to add bank account. Please check details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this bank account?")) return;
    try {
      await deletePayoutMethod(id);
      fetchAccounts();
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-[var(--color-primary)]">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest opacity-70">Loading bank details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-primary-subtle)]/40 p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]">
            <Shield size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-[var(--color-text)]">Payout & verification</h3>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">
              Linked accounts are used for withdrawals and refunds. Keep at least one verified bank account active.
            </p>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="rounded-[var(--radius-2xl)] border border-[var(--color-primary)]/30 bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold">Add Bank Account</h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddBank} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Bank Name</label>
              <input
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
                placeholder="e.g. HDFC Bank"
                value={newBank.bankName}
                onChange={e => setNewBank({ ...newBank, bankName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Account Holder Name</label>
              <input
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
                placeholder="Name as per bank"
                value={newBank.accountHolder}
                onChange={e => setNewBank({ ...newBank, accountHolder: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">Account Number</label>
              <input
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
                placeholder="•••• •••• ••••"
                value={newBank.accountNumber}
                onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500">IFSC Code</label>
              <input
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
                placeholder="HDFC0001234"
                value={newBank.ifscCode}
                onChange={e => setNewBank({ ...newBank, ifscCode: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="md:col-span-2 mt-4">
              <button
                disabled={submitting}
                className="w-full rounded-full bg-[var(--color-primary)] py-3 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Linking account..." : "Link Bank Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-bold text-[var(--color-text)]">Saved bank accounts</h3>
          {!showAddForm && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--color-text)] shadow-[var(--shadow-xs)] transition hover:border-[var(--color-primary)]/35 hover:text-[var(--color-primary)]"
            >
              <Plus size={18} strokeWidth={2.25} />
              Add bank account
            </button>
          )}
        </div>

        <div className="space-y-3">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-border-subtle)] text-[var(--color-primary)]">
                    <Landmark size={22} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[var(--color-text)]">{a.details?.bankName || "Bank Account"}</p>
                      {a.isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          <CheckCircle2 size={12} strokeWidth={2.5} />
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Verification Pending
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">
                      {a.details?.accountHolder || a.details?.type || "Account"} · ••••{" "}
                      {a.details?.accountLast4 || a.details?.accountNumber?.slice(-4) || "XXXX"}
                    </p>
                    <p className="mt-2 font-mono text-xs font-semibold text-[var(--color-text-subtle)]">IFSC {a.details?.ifscCode || "N/A"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="shrink-0 flex items-center gap-1 text-xs font-bold text-red-500 transition hover:text-red-700"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))}
          {accounts.length === 0 && !showAddForm && (
            <div className="rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
              <Building2 className="mx-auto mb-3 text-[var(--color-text-subtle)]" size={32} strokeWidth={1.5} />
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                No bank accounts linked yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-primary-subtle)]/20 p-6 flex gap-4 items-start">
        <Shield size={20} className="text-[var(--color-primary)] shrink-0 mt-1" />
        <p className="text-xs font-semibold text-[var(--color-text-muted)] leading-relaxed">
          Your bank details are encrypted and stored following industry standards. We use them strictly for processing your payouts and verifying your identity.
        </p>
      </div>
    </div>
  );
};

export default BanksDetailsView;