import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronLeft, Loader2, ArrowDownLeft, Wallet } from "lucide-react";
import { getTransactions } from "../../services/api";

const STATUS_STYLES = {
  COMPLETED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-sky-100 text-sky-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-violet-100 text-violet-800",
};

function formatAmount(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatWhen(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function groupByDate(transactions) {
  const groups = new Map();
  transactions.forEach((tx) => {
    const key = tx.processedAt || tx.createdAt || "Unknown";
    const label = formatWhen(key);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(tx);
  });
  return Array.from(groups.entries()).map(([date, items]) => ({ date, items }));
}

function txTitle(tx) {
  if (tx.relatedTask?.title) return tx.relatedTask.title;
  if (String(tx.externalReference || "").toLowerCase().includes("refund")) return "Task refund";
  if (tx.type === "CREDIT") return "Funds added";
  if (tx.type === "DEBIT") return "Wallet payment";
  return String(tx.type || "Transaction");
}

function txSubtitle(tx) {
  return (
    tx.externalReference ||
    tx.processorReference ||
    tx.providerUser?.email ||
    "Wallet ledger"
  );
}

const TransactionsView = ({ onBack }) => {
  const [subTab, setSubTab] = useState("all");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTransactions({ page: 1, limit: 100 });
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (!cancelled) setTransactions(list);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load transactions");
          setTransactions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((tx) => {
      const type = String(tx.type || "").toUpperCase();
      const matchesTab = subTab === "all" ||
        (subTab === "added" ? type === "CREDIT" : type === "DEBIT");
      if (!matchesTab) return false;
      const status = String(tx.status || "PENDING").toUpperCase();
      if (statusFilter !== "ALL" && status !== statusFilter) return false;
      if (dateFilter !== "ALL") {
        const when = new Date(tx.processedAt || tx.createdAt || 0).getTime();
        const days = dateFilter === "7D" ? 7 : dateFilter === "30D" ? 30 : 90;
        if (!when || Date.now() - when > days * 24 * 60 * 60 * 1000) return false;
      }
      if (!q) return true;
      const haystack = [
        tx.relatedTask?.title,
        tx.externalReference,
        tx.processorReference,
        tx.status,
        String(tx.amount),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [transactions, subTab, search, statusFilter, dateFilter]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text)] transition hover:bg-[var(--color-border-subtle)]"
          aria-label="Back to wallet"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Transactions</h2>
          <p className="text-sm font-semibold text-[var(--color-text-muted)]">Your wallet payments, credits, refunds, and withdrawals</p>
        </div>
      </div>

      <div className="flex gap-6 border-b border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => setSubTab("all")}
          className={`border-b-2 pb-3 text-sm font-bold transition ${
            subTab === "all"
              ? "border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          All activity
        </button>
        <button
          type="button"
          onClick={() => setSubTab("added")}
          className={`border-b-2 pb-3 text-sm font-bold transition ${
            subTab === "added"
              ? "border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Credits
        </button>
        <button
          type="button"
          onClick={() => setSubTab("withdrawn")}
          className={`border-b-2 pb-3 text-sm font-bold transition ${
            subTab === "withdrawn"
              ? "border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          Payments & withdrawals
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 shadow-[var(--shadow-xs)]">
          <Search size={16} className="shrink-0 text-[var(--color-text-subtle)]" strokeWidth={2} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search amount, task, or reference"
            className="min-w-0 flex-1 border-none bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((value) => !value)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition hover:bg-[var(--color-border-subtle)]"
          aria-label="Filters"
          title="Filters"
        >
          <SlidersHorizontal size={18} className="text-[var(--color-text-muted)]" strokeWidth={2} />
        </button>
      </div>

      {showFilters ? (
        <div className="grid gap-3 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="ALL">All statuses</option>
              {Object.keys(STATUS_STYLES).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Date range</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="ALL">All time</option>
              <option value="7D">Last 7 days</option>
              <option value="30D">Last 30 days</option>
              <option value="90D">Last 90 days</option>
            </select>
          </label>
        </div>
      ) : null}

      {loading ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-[var(--color-primary)]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest opacity-70">Loading ledger…</p>
        </div>
      ) : error ? (
        <div className="rounded-[var(--radius-2xl)] border border-red-100 bg-red-50 p-6 text-center text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] py-14 text-center text-sm font-semibold text-[var(--color-text-subtle)]">
          No {subTab === "all" ? "wallet activity" : subTab === "added" ? "credits" : "payments or withdrawals"} found.
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.date}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">
                {group.date}
              </p>
              <div className="space-y-3">
                {group.items.map((tx) => {
                  const isCredit = String(tx.type).toUpperCase() === "CREDIT";
                  const status = String(tx.status || "PENDING").toUpperCase();
                  return (
                    <div
                      key={tx.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-4 shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isCredit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                          }`}
                        >
                          {isCredit ? <ArrowDownLeft size={18} strokeWidth={2.5} /> : <Wallet size={18} strokeWidth={2.5} />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[var(--color-text)]">{txTitle(tx)}</p>
                          <p className="truncate text-xs font-semibold text-[var(--color-text-subtle)]">
                            {txSubtitle(tx)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            isCredit ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {isCredit ? "+ " : "− "}
                          {formatAmount(tx.amount)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsView;
