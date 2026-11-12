import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import SelectCard from "./SelectCard";

const DomainSelectSheet = ({ open, options, selected, onChange, onClose, onDone }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const getOptionValue = (option) => option.value ?? option.id;

  const toggle = (id) => {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  };

  const canDone = selected.length > 0;

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
            className="fixed bottom-0 left-0 right-0 z-[201] mx-auto max-h-[85vh] max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="domain-sheet-title"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 id="domain-sheet-title" className="text-[17px] font-medium text-gray-900">
                Select Domains
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-[#10605F] hover:bg-[#EFFBFB]"
                aria-label="Close"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="px-5 pt-4">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search domains…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-[14px] font-medium text-gray-900 outline-none focus:border-[#10605F] focus:bg-white"
                />
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(85vh - 180px)" }}>
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((opt) => {
                  const optionValue = getOptionValue(opt);
                  return (
                    <SelectCard
                      key={opt.id}
                      compact
                      selected={selected.includes(optionValue)}
                      onClick={() => toggle(optionValue)}
                      icon={opt.icon}
                      label={opt.label}
                    />
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm font-medium text-gray-400">No domains found.</p>
              )}
            </div>

            <div className="border-t border-gray-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={onDone}
                disabled={!canDone}
                className={`w-full rounded-full py-4 text-[15px] font-medium transition ${
                  canDone
                    ? "bg-[#10605F] text-white shadow-md hover:bg-[#00925f]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DomainSelectSheet;
