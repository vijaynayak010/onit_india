import React, { useState, useEffect } from "react";
import { Plus, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { getWalletBalance, getProviderProfile, createRazorpayOrder, verifyRazorpayPayment } from "../../services/api";
import { loadRazorpay } from "../../../../utils/loadRazorpay";

const AddFundsView = ({ onCancel, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [walletRes, profileRes] = await Promise.all([
          getWalletBalance(),
          getProviderProfile()
        ]);
        setBalance(Number(walletRes?.availableBalance ?? walletRes?.balance) || 0);
        setProfile(profileRes);
      } catch (err) {
        console.error("Failed to init AddFunds:", err);
      }
    };
    init();
  }, []);

  const handleQuickAdd = (value) => {
    setAmount(value.replace(/[^0-9]/g, ""));
  };

  const handleContinue = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 1) {
      setError("Please enter a valid amount (min ₹1)");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const Razorpay = await loadRazorpay();

      // Wallet top-up: pass amount only (mutually exclusive with taskId)
      const order = await createRazorpayOrder({ amount: numericAmount });

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "FirstDoer",
        description: "Add funds to wallet",
        order_id: order.id,
        handler: async (response) => {
          try {
            setLoading(true);
            // 3. Verify Payment on Backend
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            if (onSuccess) onSuccess();
            else onCancel();
          } catch (err) {
            setError(err.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: profile?.organization || "Provider",
          email: profile?.user?.email || "",
          contact: profile?.phoneNumber || ""
        },
        theme: {
          color: "#16a34a"
        }
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(response.error.description);
      });
      rzp.open();

    } catch (err) {
      setError(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium text-[var(--color-text)]">Add funds</h2>
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

        <div className="mt-4 flex flex-wrap gap-2">
          {["₹100", "₹500", "₹1,000"].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleQuickAdd(amt)}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary-subtle)]"
            >
              + {amt}
            </button>
          ))}
        </div>

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
            onClick={handleContinue}
            disabled={loading || !amount}
            className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
          </button>
        </div>
      </div>

      <div className="opacity-60 grayscale pointer-events-none">
        <h3 className="mb-3 text-sm font-medium text-[var(--color-text)]">Other payment methods</h3>
        <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] divide-y divide-[var(--color-border)]">
          {[
            { name: "Google Pay", sub: "Standard checkout", color: "#4285F4" },
            { name: "Paytm UPI", sub: "Standard checkout", color: "#00B9F1" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[10px] font-medium text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{item.name}</p>
                  <p className="text-xs font-semibold text-[var(--color-text-subtle)]">{item.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-primary-subtle)]/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">
          Payments are secured by Razorpay.
        </p>
        <button type="button" className="shrink-0 text-sm font-bold text-[var(--color-primary)] hover:underline">
          Payment Terms
        </button>
      </div>
    </div>
  );
};

export default AddFundsView;
