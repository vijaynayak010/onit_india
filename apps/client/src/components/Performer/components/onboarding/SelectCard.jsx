import React from "react";
import { Check } from "lucide-react";

const SelectCard = ({
  selected,
  onClick,
  icon: Icon,
  label,
  sublabel,
  className = "",
  compact = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex flex-col items-center rounded-2xl border-2 bg-white text-center transition ${
      selected
        ? "border-[#00A36C] shadow-[0_0_0_1px_rgba(0,163,108,0.15)]"
        : "border-gray-200 hover:border-gray-300"
    } ${compact ? "px-3 py-4" : "px-3 py-5"} ${className}`}
  >
    {selected && (
      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#00A36C] text-white">
        <Check size={12} strokeWidth={3} />
      </span>
    )}
    {Icon && (
      <div
        className={`mb-3 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 ${
          compact ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <Icon size={compact ? 20 : 22} strokeWidth={2} />
      </div>
    )}
    <span className={`font-bold text-gray-900 ${compact ? "text-[13px] leading-snug" : "text-[14px]"}`}>
      {label}
    </span>
    {sublabel && (
      <span
        className={`mt-1 text-[11px] font-medium ${
          selected ? "text-[#00A36C]" : "text-gray-400"
        }`}
      >
        {sublabel}
      </span>
    )}
  </button>
);

export default SelectCard;
