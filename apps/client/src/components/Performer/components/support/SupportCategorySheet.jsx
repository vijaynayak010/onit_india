import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, MessageCircle } from "lucide-react";

/**
 * FAQ bottom sheet for a support help category.
 */
const SupportCategorySheet = ({ open, category, onClose, onChatSupport }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    if (open) setOpenFaqIndex(null);
  }, [open, category?.id]);

  if (!category) return null;

  const { Icon, title, subtitle, iconBg, iconColor, faqs } = category;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/45"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-[201] mx-auto flex max-h-[85vh] max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-category-title"
          >
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-gray-300" />

            <div className="flex items-start gap-3 px-5 pb-2 pt-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBg}`}
              >
                <Icon size={22} className={iconColor} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1 pr-8">
                <h2
                  id="support-category-title"
                  className="text-[18px] font-medium tracking-tight text-[var(--color-text)]"
                >
                  {title}
                </h2>
                <p className="mt-0.5 text-[13px] font-medium text-[var(--color-text-muted)]">
                  {subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-5 rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-[var(--color-border)]">
                {faqs.map((faq, index) => {
                  const expanded = openFaqIndex === index;
                  return (
                    <li key={faq.q}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqIndex(expanded ? null : index)
                        }
                        className="flex w-full items-start gap-3 py-4 text-left"
                        aria-expanded={expanded}
                      >
                        <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-[var(--color-text)]">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`mt-0.5 shrink-0 text-gray-400 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="pb-4 pr-8 text-[13px] font-medium leading-relaxed text-[var(--color-text-muted)]">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-primary-subtle)] px-5 py-4">
              <p className="text-[14px] font-bold text-[var(--color-text)]">
                Still need help?
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-[var(--color-text-muted)]">
                Our support team is available 24/7.
              </p>
              <button
                type="button"
                onClick={onChatSupport}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-[14px] font-bold text-white transition hover:bg-[var(--color-primary-hover)]"
              >
                <MessageCircle size={18} strokeWidth={2.4} />
                Chat with Support
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SupportCategorySheet;
