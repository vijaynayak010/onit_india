import React from "react";
import { Landmark, CheckCircle2 } from "lucide-react";
import { getPayoutMethodInfo } from "./walletUtils";

const PayoutAccountCard = ({ method, onChange, showChange = true }) => {
  const info = getPayoutMethodInfo(method);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Landmark size={20} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-gray-900">{info.name}</p>
          <p className="text-[13px] font-medium text-gray-500">{info.detail}</p>
        </div>
        {info.verified && (
          <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-blue-600">
            <CheckCircle2 size={14} strokeWidth={2.5} />
            Verified
          </span>
        )}
      </div>
      {showChange && onChange && (
        <button
          type="button"
          onClick={onChange}
          className="mt-3 text-[13px] font-bold text-emerald-600 hover:text-emerald-700"
        >
          Change
        </button>
      )}
    </div>
  );
};

export default PayoutAccountCard;
