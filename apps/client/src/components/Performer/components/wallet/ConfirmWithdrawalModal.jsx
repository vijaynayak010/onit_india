import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react";
import { formatINR } from "./walletUtils";

const ConfirmWithdrawalModal = ({
  open,
  onClose,
  amount,
  destination,
  remainingBalance,
  onConfirm,
  loading,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[201] mx-auto max-w-lg rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-withdrawal-title"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="confirm-withdrawal-title" className="text-[18px] font-medium text-gray-900">
                Confirm withdrawal
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-4">
              <Row label="Amount" value={`₹${formatINR(amount)}`} valueClass="text-[#10605F] font-bold" />
              <Row label="To" value={destination} />
              <Row label="Remaining balance" value={`₹${formatINR(remainingBalance)}`} />
              <Row label="Processing time" value="Within 24 hours" />
              <Row label="Fee" value="Free" />
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 px-3.5 py-3">
              <Info size={16} className="mt-0.5 shrink-0 text-amber-600" strokeWidth={2.5} />
              <p className="text-[12px] font-medium leading-relaxed text-amber-800">
                Funds usually arrive within 24 hours. Delays may occur on bank holidays.
              </p>
            </div>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-[#10605F] py-4 text-[15px] font-medium text-white shadow-md transition hover:bg-[#00925f] disabled:opacity-60"
            >
              {loading ? "Processing…" : "Confirm withdrawal"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function Row({ label, value, valueClass = "font-semibold text-gray-900" }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[14px]">
      <span className="font-medium text-gray-500">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export default ConfirmWithdrawalModal;
