import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "What kind of tasks can I post?",
    a: "Digital work in three categories: Growth & Marketing, Design & Creative, and Build & Develop. We do not support offline or local services.",
  },
  {
    q: "How much does it cost?",
    a: "Posting a task is free. You only pay the agreed project amount after selecting a performer.",
  },
  {
    q: "How are performers verified?",
    a: "We verify identity, review past projects and skills, and continuously rank performers based on delivered work.",
  },
  {
    q: "How do I become a performer?",
    a: "Apply with your profile and best projects. Our team reviews every application before approval.",
  },
  {
    q: "How do payments work?",
    a: "Payments are held securely in escrow and released when approved milestones are completed.",
  },
  {
    q: "What if I'm not satisfied?",
    a: "Our Trust & Safety team can review the task, delivery and messages to help resolve disputes fairly.",
  },
];

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <path d="M10 4v12M4 10h12" stroke="#0B1110" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 5l10 10M15 5L5 15" stroke="#0B1110" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.04)",
        borderRadius: 16,
        padding: "0 24px",
        overflow: "hidden",
      }}
    >
      {/* Question row */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "25px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 600,
            fontSize: "clamp(15px, 1.8vw, 20px)",
            lineHeight: "27px",
            color: "#0B1110",
          }}
        >
          {faq.q}
        </span>
        {isOpen ? <CrossIcon /> : <PlusIcon />}
      </button>

      {/* Answer — animated */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(14px, 1.6vw, 18px)",
                lineHeight: "25px",
                color: "#68726F",
                margin: "0 0 28px",
                maxWidth: 760,
              }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx((prev) => (prev === i ? null : i));

  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "clamp(56px, 8vw, 110px) 0 clamp(56px, 8vw, 100px)",
      }}
    >
      <div className="mx-auto px-3" style={{ maxWidth: 960 }}>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 42px)",
            lineHeight: "63px",
            letterSpacing: "-2.1px",
            color: "#0B1110",
            margin: "0 0 24px",
          }}
        >
          Questions.
        </h2>

        {/* Accordion items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              isOpen={openIdx === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
