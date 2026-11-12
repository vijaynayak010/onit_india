import React from "react";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import {
  formatINR,
  formatTxDate,
  getTxTitle,
  normalizeStatus,
  statusLabel,
} from "./walletUtils";

const StatusBadge = ({ status }) => {
  const n = normalizeStatus(status);
  if (n === "completed") {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#10605F]">
        <CheckCircle2 size={12} strokeWidth={2.5} />
        {statusLabel(status)}
      </span>
    );
  }
  if (n === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-amber-600">
        <Clock size={12} strokeWidth={2.5} />
        {statusLabel(status)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-600">
      <XCircle size={12} strokeWidth={2.5} />
      {statusLabel(status)}
    </span>
  );
};

const TransactionListItem = ({ tx, onClick, compact = false }) => {
  const isCredit = tx.type === "CREDIT";
  const title = getTxTitle(tx);
  const dateStr = formatTxDate(tx.createdAt);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white text-left transition hover:border-gray-200 hover:shadow-sm ${
        compact ? "px-0 py-3 border-0 border-b border-gray-100 rounded-none hover:shadow-none" : "px-4 py-3.5"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isCredit ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
        }`}
      >
        {isCredit ? (
          <ArrowDownLeft size={18} strokeWidth={2.5} />
        ) : (
          <ArrowUpRight size={18} strokeWidth={2.5} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-gray-900">{title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-gray-400">
          <span>{dateStr}</span>
          <span>•</span>
          <StatusBadge status={tx.status} />
        </div>
      </div>
      <span
        className={`shrink-0 text-[15px] font-medium tabular-nums ${
          isCredit ? "text-[#10605F]" : "text-gray-900"
        }`}
      >
        {isCredit ? "+" : "−"}₹{formatINR(tx.amount)}
      </span>
    </button>
  );
};

export default TransactionListItem;
