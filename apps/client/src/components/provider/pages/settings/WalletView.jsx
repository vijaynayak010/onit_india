import React, { useState, useEffect } from "react";
import { Plus, Edit2, CreditCard, ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { getWalletBalance, getTransactions } from "../../services/api";

const WalletView = ({ onAddMoney, onWithdraw, onViewTransactions }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const [walletResponse, txResponse] = await Promise.all([
          getWalletBalance().catch(() => ({ balance: 0, currency: "INR" })),
          getTransactions({ limit: 5 }).catch(() => ({ data: [] })),
        ]);

        setBalance(Number(walletResponse?.availableBalance ?? walletResponse?.balance) || 0);
        setTransactions(Array.isArray(txResponse?.data) ? txResponse.data : []);
      } catch (err) {
        console.error("Failed to fetch wallet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-[var(--color-primary)]">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest opacity-70">Fetching wallet...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-subtle)] to-white p-6 shadow-[var(--shadow-md)] sm:p-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Available balance</span>
        </div>
        <p className="text-4xl font-bold tabular-nums tracking-tight text-[var(--color-text)]">₹{balance.toLocaleString()}</p>
        <p className="mt-1 text-xs font-semibold text-[var(--color-text-subtle)]">Last updated just now</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onAddMoney}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-3 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)]"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add money
          </button>
          <button
            type="button"
            onClick={onWithdraw}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-white py-3 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary-subtle)]"
          >
            <ArrowUpRight size={16} strokeWidth={2.5} />
            Withdraw
          </button>
        </div>
      </div>

      <section>
        <h3 className="text-base font-bold text-[var(--color-text)]">Linked payment methods</h3>
        <p className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">Your payment details are stored securely.</p>

        <div className="mt-4 overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]">
          {[
            { name: "Google Pay", sub: "Linked to Bank of Baroda", color: "#4285F4" },
            { name: "Paytm UPI", sub: "Linked to Bank of Baroda", color: "#00B9F1" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex cursor-pointer items-center justify-between border-b border-[var(--color-border)] px-4 py-4 transition last:border-0 hover:bg-[var(--color-border-subtle)]/40"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[10px] font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">{item.name}</p>
                  <p className="text-xs font-semibold text-[var(--color-text-subtle)]">{item.sub}</p>
                </div>
              </div>
              <Edit2 size={16} className="text-[var(--color-text-subtle)]" strokeWidth={2} />
            </div>
          ))}
          <div className="flex cursor-pointer items-center justify-between px-4 py-4 transition hover:bg-[var(--color-border-subtle)]/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eb001b] text-white">
                <CreditCard size={16} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-text)]">RBL Credit Card · · · 6213</p>
                <p className="text-xs font-semibold text-[var(--color-text-subtle)]">
                  CVV not required for saved cards per RBI guidelines.
                </p>
              </div>
            </div>
            <Edit2 size={16} className="text-[var(--color-text-subtle)]" strokeWidth={2} />
          </div>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] transition hover:gap-3"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-primary)]">
            <Plus size={12} strokeWidth={3} />
          </span>
          Add new UPI or card
        </button>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-[var(--color-text)]">Recent transactions</h3>
          <button
            type="button"
            onClick={onViewTransactions}
            className="text-sm font-bold text-[var(--color-primary)] transition hover:underline"
          >
            View all
          </button>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]">
          {transactions.map((tx, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-3.5 last:border-0"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {tx.type === "CREDIT" ? (
                  <ArrowDownLeft size={16} className="text-[#10605F]" strokeWidth={2.5} />
                ) : (
                  <ArrowUpRight size={16} className="text-red-500" strokeWidth={2.5} />
                )}
                <span
                  className={`text-sm font-bold tabular-nums ${tx.type === "CREDIT" ? "text-[#10605F]" : "text-red-500"}`}
                >
                  {tx.type === "CREDIT" ? "+" : "−"} ₹{tx.amount.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {tx.relatedTask?.title || tx.type.charAt(0) + tx.type.slice(1).toLowerCase()}
                </span>
              </div>
              <span className="text-xs font-semibold text-[var(--color-text-subtle)]">
                {new Date(tx.createdAt).toLocaleDateString([], { day: "numeric", month: "short" })} · {tx.externalReference || "Internal"}
              </span>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="p-8 text-center text-sm font-semibold text-[var(--color-text-subtle)]">No recent transactions found.</p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-primary-subtle)]/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold leading-relaxed text-[var(--color-text-muted)]">
            Wallet balance can be used for task payments and withdrawals per policy.
          </p>
          <button type="button" className="shrink-0 text-sm font-bold text-[var(--color-primary)] hover:underline">
            Wallet FAQs
          </button>
        </div>
      </section>
    </div>
  );
};

export default WalletView;