import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import PerformerPageHeader from "../PerformerPageHeader";
import PayoutAccountCard from "./PayoutAccountCard";
import TransactionListItem from "./TransactionListItem";
import { formatINR } from "./walletUtils";
import { getWalletBalance, getTransactions, getPayoutMethods } from "../../services/api";

const StatCard = ({ label, amount, tone }) => {
  const tones = {
    available: "bg-[#EFFBFB] text-[#10605F]",
    pending: "bg-orange-50 text-orange-700",
    lifetime: "bg-sky-50 text-sky-700",
  };
  return (
    <div className={`flex flex-1 flex-col rounded-2xl px-4 py-3.5 ${tones[tone]}`}>
      <span className="text-[11px] font-bold uppercase tracking-wide opacity-80">{label}</span>
      <span className="mt-1 text-[17px] font-black tabular-nums">₹{formatINR(amount)}</span>
    </div>
  );
};

const DEFAULT_PATHS = {
  withdraw: "/performer/wallet/withdraw",
  transactions: "/performer/wallet/transactions",
  transactionDetail: (id) => `/performer/transactions/${id}`,
  banks: "/performer/banks",
};

const PerformerWalletEarningsView = ({ paths = DEFAULT_PATHS, title = "Wallet" }) => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0, pending: 0, totalEarned: 0 });
  const [transactions, setTransactions] = useState([]);
  const [payoutMethod, setPayoutMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [walletRes, transRes, methodsRes] = await Promise.all([
          getWalletBalance(),
          getTransactions({ limit: 50 }).catch(() => ({ data: [] })),
          getPayoutMethods().catch(() => []),
        ]);

        const txList = Array.isArray(transRes?.data) ? transRes.data : [];
        const totalEarned = txList
          .filter((t) => t.type === "CREDIT" && t.status === "COMPLETED")
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const pending = txList
          .filter((t) => t.status === "PENDING")
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        if (walletRes) {
          setWallet({
            balance: Number(walletRes.availableBalance ?? walletRes.balance) || 0,
            pending: Number(walletRes.pendingEarnings ?? walletRes.pendingBalance ?? pending) || 0,
            totalEarned: Number(walletRes.lifetimeEarnings ?? walletRes.totalEarned ?? totalEarned) || 0,
          });
        }

        setTransactions(txList);
        const methods = Array.isArray(methodsRes) ? methodsRes : [];
        setPayoutMethod(methods.find((m) => m.isVerified) || methods[0] || null);
      } catch (err) {
        console.error("Failed to fetch wallet data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentActivity = transactions.slice(0, 5);

  return (
    <>
      <PerformerPageHeader
        title={title}
        subtitle="Balance, payouts, and recent wallet activity"
        backTo="/performer/account"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#10605F]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="mt-3 text-sm font-semibold text-gray-400">Loading wallet…</p>
        </div>
      ) : (
        <>
          <section className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Available balance
                </p>
                <p className="mt-1 text-4xl font-black tabular-nums leading-none text-gray-900">
                  ₹{formatINR(wallet.balance)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(paths.withdraw)}
                className="shrink-0 rounded-full bg-[#10605F] px-5 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:bg-[#00925f]"
              >
                Withdraw Funds
              </button>
            </div>
          </section>

          <section className="mb-8 flex gap-2.5">
            <StatCard label="Available" amount={wallet.balance} tone="available" />
            <StatCard label="Pending" amount={wallet.pending} tone="pending" />
            <StatCard label="Lifetime" amount={wallet.totalEarned} tone="lifetime" />
          </section>

          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-gray-900">Payout account</h2>
              <button
                type="button"
                onClick={() => navigate(paths.banks)}
                className="text-[13px] font-bold text-[#10605F] hover:text-[#083B3A]"
              >
                Change
              </button>
            </div>
            <PayoutAccountCard method={payoutMethod} showChange={false} />
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-gray-900">Recent activity</h2>
              <button
                type="button"
                onClick={() => navigate(paths.transactions)}
                className="inline-flex items-center gap-0.5 text-[13px] font-bold text-[#10605F] hover:text-[#083B3A]"
              >
                View all
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-gray-100 px-4">
                  {recentActivity.map((tx) => (
                    <TransactionListItem
                      key={tx.id}
                      tx={tx}
                      compact
                      onClick={() => navigate(paths.transactionDetail(tx.id))}
                    />
                  ))}
                </div>
              ) : (
                <p className="px-4 py-10 text-center text-sm font-medium text-gray-400">
                  No recent activity yet.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default PerformerWalletEarningsView;
