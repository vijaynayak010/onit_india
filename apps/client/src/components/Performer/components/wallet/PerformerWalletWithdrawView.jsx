import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, Loader2 } from "lucide-react";
import PerformerPageHeader from "../PerformerPageHeader";
import PayoutAccountCard from "./PayoutAccountCard";
import ConfirmWithdrawalModal from "./ConfirmWithdrawalModal";
import { formatINR, getWithdrawDestinationLabel } from "./walletUtils";
import { getWalletBalance, getPayoutMethods, withdrawFunds } from "../../services/api";

const QUICK_AMOUNTS = [500, 1000, 2000];

const DEFAULT_PATHS = {
  back: "/performer/wallet",
  transactions: "/performer/wallet/transactions",
  banks: "/performer/banks",
};

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
      <span className="text-[13px] font-medium text-gray-500">{label}</span>
      <span className={`text-[14px] ${highlight ? "font-bold text-[#10605F]" : "font-semibold text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

const PerformerWalletWithdrawView = ({ paths = DEFAULT_PATHS }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [walletRes, methodsRes] = await Promise.all([
          getWalletBalance(),
          getPayoutMethods().catch(() => []),
        ]);
        setBalance(Number(walletRes?.availableBalance ?? walletRes?.balance) || 0);
        const methods = Array.isArray(methodsRes) ? methodsRes : [];
        const preferred = methods.filter((m) => m.isVerified !== false);
        setPayoutMethod(preferred[0] || methods[0] || null);
      } catch (err) {
        console.error("Failed to load withdraw data", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const numericAmount = parseFloat(amount) || 0;
  const isValidAmount = numericAmount > 0 && numericAmount <= balance;
  const remainingBalance = Math.max(0, balance - numericAmount);

  const handleAmountChange = (e) => {
    setAmount(e.target.value.replace(/[^0-9]/g, ""));
    setError(null);
  };

  const handleQuickSelect = (val) => {
    setAmount(val === "all" ? String(balance) : String(val));
    setError(null);
  };

  const handleContinue = () => {
    if (!isValidAmount) {
      setError("Enter a valid amount within your available balance");
      return;
    }
    if (!payoutMethod) {
      setError("Please add a payout account first");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await withdrawFunds({ amount: numericAmount, payoutMethodId: payoutMethod.id });
      setShowConfirm(false);
      setStep("success");
    } catch (err) {
      setError(err.message || "Withdrawal request failed");
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DFF7F6] text-[#10605F]">
          <CheckCircle2 size={40} strokeWidth={2} />
        </div>
        <h1 className="text-[22px] font-bold text-gray-900">Withdrawal initiated</h1>
        <p className="mx-auto mt-2 max-w-xs text-[14px] font-medium text-gray-500">
          Your withdrawal request has been submitted successfully.
        </p>
        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/60 px-5 py-5 text-left">
          <DetailRow label="Amount" value={`₹${formatINR(numericAmount)}`} highlight />
          <DetailRow
            label="Status"
            value={
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[12px] font-bold text-amber-700">
                Processing
              </span>
            }
          />
          <DetailRow label="Destination" value={getWithdrawDestinationLabel(payoutMethod)} />
          <DetailRow label="Expected arrival" value="Within 24 hours" />
          <DetailRow label="Fee" value="Free" />
        </div>
        <button
          type="button"
          onClick={() => navigate(paths.transactions)}
          className="mt-8 w-full rounded-2xl bg-[#10605F] py-4 text-[15px] font-bold text-white shadow-md hover:bg-[#00925f]"
        >
          View transaction history
        </button>
        <button
          type="button"
          onClick={() => navigate(paths.back)}
          className="mt-4 text-[14px] font-bold text-gray-500 hover:text-gray-700"
        >
          Maybe Later
        </button>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <PerformerPageHeader
        title="Withdraw Funds"
        subtitle="Transfer your earnings to your linked bank account or UPI"
        backTo={paths.back}
        backLabel="Back to Wallet"
        actions={
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500">Available to withdraw</span>
            <div className="text-lg font-black text-[#10605F]">₹{formatINR(balance)}</div>
          </div>
        }
      />

      {loading ? (
        <div className="flex flex-col items-center py-20 text-[#10605F]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <section className="mb-6">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Enter amount</p>
            <div className="border-b-2 border-[#10605F] pb-2">
              <input
                type="text"
                inputMode="numeric"
                value={amount ? `₹ ${formatINR(amount)}` : "₹ 0"}
                onChange={handleAmountChange}
                className="w-full max-w-md bg-transparent text-[32px] font-bold text-gray-900 outline-none"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickSelect(val)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-bold transition ${
                    numericAmount === val
                      ? "border-[#10605F] bg-[#EFFBFB] text-[#10605F]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#29ADAC]/40"
                  }`}
                >
                  ₹{formatINR(val)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickSelect("all")}
                className={`rounded-full border px-4 py-2 text-[13px] font-bold transition ${
                  numericAmount === balance
                    ? "border-[#10605F] bg-[#EFFBFB] text-[#10605F]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#29ADAC]/40"
                }`}
              >
                All (₹{formatINR(balance)})
              </button>
            </div>
          </section>

          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Withdraw to</p>
              <button
                type="button"
                onClick={() => navigate(paths.banks)}
                className="text-[13px] font-bold text-[#10605F]"
              >
                Change
              </button>
            </div>
            <PayoutAccountCard method={payoutMethod} showChange={false} />
          </section>

          <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-amber-50 px-3.5 py-3">
            <Clock size={16} className="mt-0.5 shrink-0 text-amber-600" strokeWidth={2.5} />
            <p className="text-[12px] font-medium leading-relaxed text-amber-800">
              Withdrawals are typically processed within 1–2 business days.
            </p>
          </div>

          {error && <p className="mb-4 text-center text-[13px] font-semibold text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!isValidAmount}
            className={`w-full max-w-md rounded-2xl py-4 text-[15px] font-bold transition ${
              isValidAmount
                ? "bg-[#10605F] text-white shadow-md hover:bg-[#00925f]"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {isValidAmount ? "Continue" : "Enter an amount"}
          </button>
        </>
      )}

      <ConfirmWithdrawalModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        amount={numericAmount}
        destination={getWithdrawDestinationLabel(payoutMethod)}
        remainingBalance={remainingBalance}
        onConfirm={handleConfirm}
        loading={submitting}
      />
    </div>
  );
};

export default PerformerWalletWithdrawView;
