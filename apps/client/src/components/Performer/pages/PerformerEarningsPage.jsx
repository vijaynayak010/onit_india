import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import PerformerHeader from "../components/PerformerHeader";
import PerformerPageHeader from "../components/PerformerPageHeader";
import PayoutAccountCard from "../components/wallet/PayoutAccountCard";
import { formatINR, formatTxDate, getTxTitle, normalizeStatus } from "../components/wallet/walletUtils";
import {
  getPayoutMethods,
  getTransactions,
  getWalletBalance,
} from "../services/api";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "withdrawal", label: "Withdrawal" },
];

const MetricCard = ({ label, value, helper, icon: Icon, tone = "emerald" }) => {
  const tones = {
    emerald: "bg-[#EFFBFB] text-[#10605F]",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-fuchsia-50 text-fuchsia-600",
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">{label}</p>
          <p className="mt-4 text-2xl font-black tabular-nums text-gray-900">{value}</p>
          {helper ? <p className="mt-2 text-xs font-medium text-gray-500">{helper}</p> : null}
        </div>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tones[tone]}`}>
          <Icon size={16} strokeWidth={2.4} />
        </span>
      </div>
    </section>
  );
};

const TransactionStatus = ({ status }) => {
  const normalized = normalizeStatus(status);
  const pending = normalized === "pending";
  const failed = normalized === "failed";
  const Icon = pending ? Clock3 : failed ? Clock3 : CheckCircle2;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-bold ${
        pending
          ? "bg-orange-50 text-orange-600"
          : failed
            ? "bg-rose-50 text-rose-600"
            : "bg-[#EFFBFB] text-[#10605F]"
      }`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {pending ? "Pending" : failed ? "Failed" : "Completed"}
    </span>
  );
};

const EmptyTransactions = () => (
  <div className="flex min-h-[240px] flex-col items-center justify-center px-4 py-12 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFFBFB] text-[#10605F]">
      <Wallet size={24} strokeWidth={2.3} />
    </div>
    <h3 className="mt-4 text-lg font-bold text-gray-900">No transactions found</h3>
    <p className="mt-1 max-w-sm text-sm font-medium text-gray-500">
      Earnings and withdrawals will appear here when payment activity starts.
    </p>
  </div>
);

const PerformerEarningsPage = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0, pending: 0, totalEarned: 0 });
  const [transactions, setTransactions] = useState([]);
  const [payoutMethod, setPayoutMethod] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const [walletRes, transRes, methodsRes] = await Promise.all([
          getWalletBalance().catch(() => null),
          getTransactions({ limit: 50 }).catch(() => ({ data: [] })),
          getPayoutMethods().catch(() => []),
        ]);

        if (cancelled) return;

        const txList = Array.isArray(transRes?.data) ? transRes.data : [];
        const completedCredits = txList
          .filter((tx) => tx.type === "CREDIT" && normalizeStatus(tx.status) === "completed")
          .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
        const pendingAmount = txList
          .filter((tx) => normalizeStatus(tx.status) === "pending")
          .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

        setWallet({
          balance: Number(walletRes?.availableBalance ?? walletRes?.balance) || 0,
          pending: Number(walletRes?.pendingEarnings ?? walletRes?.pendingBalance ?? pendingAmount) || 0,
          totalEarned: Number(walletRes?.lifetimeEarnings ?? walletRes?.totalEarned ?? completedCredits) || 0,
        });
        setTransactions(txList);

        const methods = Array.isArray(methodsRes) ? methodsRes : [];
        setPayoutMethod(methods.find((method) => method.isVerified) || methods[0] || null);
      } catch (err) {
        console.error("Failed to load performer earnings", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "withdrawal" ? tx.type === "DEBIT" : normalizeStatus(tx.status) === filter);
      if (!matchesFilter) return false;
      if (!needle) return true;
      const title = getTxTitle(tx).toLowerCase();
      const description = String(tx.description || "").toLowerCase();
      const client = String(tx.relatedTask?.provider?.displayName || tx.relatedTask?.provider?.user?.name || "").toLowerCase();
      return title.includes(needle) || description.includes(needle) || client.includes(needle);
    });
  }, [filter, query, transactions]);

  const pendingCount = transactions.filter((tx) => normalizeStatus(tx.status) === "pending").length;
  const thisMonthTotal = transactions
    .filter((tx) => {
      const created = tx.createdAt ? new Date(tx.createdAt) : null;
      const now = new Date();
      return (
        tx.type === "CREDIT" &&
        created &&
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F4F6F8] pt-[93px] font-sans text-gray-900">
      <PerformerHeader activePage="account" />

      <main className="w-full px-4 py-6 sm:px-6 lg:ml-[220px] lg:w-[calc(100%-220px)] lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
            <PerformerPageHeader
              title="Earnings"
              subtitle="Track your earnings, withdrawals and payout history"
              backTo="/performer/account"
              actions={
                <button
                  type="button"
                  onClick={() => navigate("/performer/wallet/withdraw")}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#10605F] px-8 text-sm font-bold text-white shadow-sm transition hover:bg-[#008f5f]"
                >
                  Withdraw Earnings
                </button>
              }
            />

            {loading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-[#10605F]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="mt-3 text-sm font-semibold text-gray-500">Loading earnings...</p>
              </div>
            ) : (
              <>
                <section className="mb-4 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFFBFB] text-[#10605F]">
                      <Wallet size={16} strokeWidth={2.4} />
                    </span>
                    Available Balance
                  </div>
                  <p className="mt-4 text-4xl font-black leading-none tracking-tight text-gray-900">
                    ₹{formatINR(wallet.balance)}
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10605F]" />
                    Ready to withdraw
                  </p>
                </section>

                <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <MetricCard
                    label="Pending"
                    value={`₹${formatINR(wallet.pending)}`}
                    helper={`${pendingCount} transaction${pendingCount === 1 ? "" : "s"} in review`}
                    icon={Clock3}
                    tone="orange"
                  />
                  <MetricCard
                    label="Lifetime Earnings"
                    value={`₹${formatINR(wallet.totalEarned)}`}
                    helper="Total completed earnings"
                    icon={TrendingUp}
                    tone="blue"
                  />
                  <MetricCard
                    label="This Month"
                    value={`₹${formatINR(thisMonthTotal)}`}
                    helper="Current calendar month"
                    icon={CalendarDays}
                    tone="violet"
                  />
                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_288px]">
                  <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h2 className="text-base font-bold text-gray-900">Transaction History</h2>
                        <p className="mt-0.5 text-sm font-medium text-gray-400">
                          {transactions.length} transaction{transactions.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 text-xs font-semibold text-gray-600 transition hover:border-[#29ADAC]/30 hover:text-[#083B3A]"
                      >
                        <Download size={14} strokeWidth={2.2} />
                        Export CSV
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 lg:flex-row lg:items-center">
                      <label className="relative block min-w-0 flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          className="h-9 w-full rounded-full bg-gray-100 pl-11 pr-4 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#EFFBFB]"
                          placeholder="Search transactions..."
                        />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {FILTERS.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setFilter(item.id)}
                            className={`h-9 rounded-full px-4 text-xs font-bold transition ${
                              filter === item.id
                                ? "bg-[#EFFBFB] text-[#10605F]"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredTransactions.length === 0 ? (
                      <EmptyTransactions />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] border-collapse text-left">
                          <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                              <th className="px-5 py-4">Transaction</th>
                              <th className="px-5 py-4">Client</th>
                              <th className="px-5 py-4">Date</th>
                              <th className="px-5 py-4">Status</th>
                              <th className="px-5 py-4 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTransactions.map((tx) => {
                              const isCredit = tx.type === "CREDIT";
                              const clientName =
                                tx.relatedTask?.provider?.displayName ||
                                tx.relatedTask?.provider?.user?.name ||
                                tx.relatedTask?.provider?.user?.email?.split("@")[0] ||
                                (isCredit ? "Provider" : "Payout account");
                              const initial = clientName.charAt(0).toUpperCase();

                              return (
                                <tr key={tx.id} className="border-b border-gray-100 last:border-b-0">
                                  <td className="px-5 py-5">
                                    <div className="flex items-center gap-4">
                                      <span
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                          isCredit ? "bg-[#EFFBFB] text-[#10605F]" : "bg-rose-50 text-rose-500"
                                        }`}
                                      >
                                        {isCredit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                                      </span>
                                      <div className="min-w-0">
                                        <p className="max-w-[180px] truncate text-sm font-bold text-gray-900">{getTxTitle(tx)}</p>
                                        <p className="text-xs font-medium text-gray-400">
                                          {tx.referenceId || tx.id?.slice(0, 8) || "TXN"}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-5">
                                    <div className="flex items-center gap-3">
                                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                                        {initial}
                                      </span>
                                      <span className="max-w-[150px] truncate text-sm font-semibold text-gray-900">{clientName}</span>
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 text-sm font-medium text-gray-500">{formatTxDate(tx.createdAt)}</td>
                                  <td className="px-5 py-5"><TransactionStatus status={tx.status} /></td>
                                  <td
                                    className={`px-5 py-5 text-right text-sm font-black tabular-nums ${
                                      isCredit ? "text-[#10605F]" : "text-rose-500"
                                    }`}
                                  >
                                    {isCredit ? "+" : "-"}₹{formatINR(tx.amount)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>

                  <aside className="space-y-4">
                    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <h2 className="text-base font-bold text-gray-900">Payout Account</h2>
                      <div className="mt-4">
                        <PayoutAccountCard method={payoutMethod} showChange={false} />
                      </div>
                      <div className="mt-4 grid gap-2">
                        <button
                          type="button"
                          onClick={() => navigate("/performer/banks")}
                          className="h-10 rounded-full border border-gray-200 text-sm font-semibold text-gray-900 transition hover:border-[#29ADAC]/30 hover:text-[#083B3A]"
                        >
                          Change Account
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/performer/banks")}
                          className="h-10 rounded-full border border-gray-200 text-sm font-semibold text-gray-900 transition hover:border-[#29ADAC]/30 hover:text-[#083B3A]"
                        >
                          Manage Banks
                        </button>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-700">
                      <div className="flex gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70">
                          <Clock3 size={15} strokeWidth={2.4} />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold">Processing Time</h3>
                          <p className="mt-1 text-xs font-medium leading-relaxed">
                            Withdrawals are usually processed within 1-2 business days.
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-[#29ADAC]/20 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFFBFB] text-[#10605F]">
                          <ShieldCheck size={17} strokeWidth={2.4} />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">Verified payouts</h3>
                          <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">
                            Keep your bank details verified to avoid withdrawal delays.
                          </p>
                        </div>
                      </div>
                    </section>
                  </aside>
                </div>
              </>
            )}
          </div>
        </main>
    </div>
  );
};

export default PerformerEarningsPage;
