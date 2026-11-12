import React, { useState, useEffect } from "react";
import { Plus, CreditCard, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getWalletBalance, getPayoutMethods, withdrawFunds } from "../../services/api";

const WithdrawView = ({ onCancel, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setInitLoading(true);
        const [walletRes, methodsRes] = await Promise.all([
          getWalletBalance(),
          getPayoutMethods()
        ]);
        setBalance(Number(walletRes?.availableBalance ?? walletRes?.balance) || 0);
        const methods = Array.isArray(methodsRes) ? methodsRes : [];
        setPayoutMethods(methods);
        if (methods.length > 0) {
          setSelectedMethodId(methods[0].id);
        }
      } catch (err) {
        console.error("Failed to init WithdrawView:", err);
      } finally {
        setInitLoading(false);
      }
    };
    init();
  }, []);

  const handleWithdraw = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (numericAmount > balance) {
      setError("Amount exceeds available balance");
      return;
    }
    if (!selectedMethodId) {
      setError("Please select a withdrawal destination");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await withdrawFunds({
        amount: numericAmount,
        payoutMethodId: selectedMethodId
      });
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else onCancel();
      }, 2000);
    } catch (err) {
      setError(err.message || "Withdrawal request failed");
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-[var(--color-primary)]">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest opacity-70">Fetching details...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-[#10605F]">
        <CheckCircle2 className="h-16 w-16" />
        <h3 className="text-xl font-medium">Request Submitted!</h3>
        <p className="max-w-xs text-center text-sm font-semibold text-[var(--color-text-muted)]">
          Your withdrawal request of ₹{amount} is being processed. It will be credited within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium text-[var(--color-text)]">Withdraw funds</h2>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="text-sm font-bold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)] disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Available balance</span>
        </div>
        <p className="text-3xl font-medium tabular-nums text-[var(--color-text)]">₹{balance.toLocaleString()}</p>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <label className="mt-6 block text-sm font-bold text-[var(--color-text)]">Amount</label>
        <div className="mt-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-border-subtle)]/40 px-4 py-3">
          <input
            type="text"
            inputMode="decimal"
            placeholder="₹0"
            value={amount ? `₹${amount}` : ""}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full border-none bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]">
          Withdrawals are typically credited within 24 hours.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full px-5 py-2.5 text-sm font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border-subtle)] disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={loading || !amount || payoutMethods.length === 0}
            className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Withdraw"}
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Choose destination</h3>
        {payoutMethods.length === 0 ? (
          <div className="rounded-[var(--radius-2xl)] border border-dashed border-[var(--color-border)] p-8 text-center">
            <p className="mb-4 text-sm font-semibold text-[var(--color-text-subtle)]">No payout method found.</p>
            <button
              onClick={() => { /* Navigate to bank details */ }}
              className="text-sm font-bold text-[var(--color-primary)] hover:underline"
            >
              Add bank account
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] divide-y divide-[var(--color-border)]">
            {payoutMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethodId(method.id)}
                className={`flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-[var(--color-border-subtle)]/50 ${selectedMethodId === method.id ? 'bg-[var(--color-primary-subtle)]/30' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text)]">
                      {method.details?.bankName || (method.type === "UPI" ? "UPI" : "Bank Account")}
                    </p>
                    <p className="text-xs font-semibold text-[var(--color-text-subtle)]">
                      {method.type === "UPI"
                        ? (method.details?.upiId || "UPI ID")
                        : method.details?.accountLast4
                          ? `•••• ${method.details.accountLast4}`
                          : "Linked account"}
                    </p>
                  </div>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 transition-all ${selectedMethodId === method.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)] shadow-[0_0_0_2px_white_inset]' : 'border-[var(--color-border)]'}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-primary-subtle)]/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">Wallet usage policy</p>
          <button type="button" className="shrink-0 text-sm font-bold text-[var(--color-primary)] hover:underline">
            Wallet FAQs
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawView;
