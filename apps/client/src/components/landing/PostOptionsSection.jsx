import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FEATURES = [
  {
    id: "conversation",
    label: "Stay on the same page",
    desc: "Chat with your performer directly. Share feedback, files, and notes — all in one place.",
  },
  {
    id: "progress",
    label: "Know where things stand",
    desc: "Track milestones and status updates as the task moves forward.",
  },
  {
    id: "deliverables",
    label: "Review the result",
    desc: "See the final submission, leave feedback, and approve when it's exactly right.",
  },
];

const TAB_LABELS = ["Conversation", "Progress", "Deliverables"];
const AUTO_CYCLE_MS = 4200;

// ── Shared sub-components ──────────────────────────────────────────────

function VideoAttachment({ label = "Reels_Draft_v1.mp4", duration = "0:47", height = 100 }) {
  return (
    <div
      style={{
        borderRadius: 10,
        overflow: "hidden",
        background: "linear-gradient(160deg, #0D1F1A 0%, #14312A 100%)",
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        border: "0.8px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Subtle grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 24px),repeating-linear-gradient(90deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 24px)",
      }} />
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
          <path d="M1.5 1.5L9.5 6.5L1.5 11.5V1.5Z" fill="#0B1110" />
        </svg>
      </div>
      <span
        style={{
          position: "absolute",
          bottom: 7,
          left: 10,
          fontFamily: "Manrope, sans-serif",
          fontWeight: 500,
          fontSize: 9.5,
          color: "rgba(255,255,255,0.6)",
          zIndex: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          position: "absolute",
          bottom: 7,
          right: 10,
          background: "rgba(0,0,0,0.55)",
          borderRadius: 4,
          padding: "2px 6px",
          fontFamily: "Manrope, sans-serif",
          fontWeight: 600,
          fontSize: 9.5,
          color: "#FFF",
          zIndex: 1,
        }}
      >
        {duration}
      </span>
    </div>
  );
}

// ── Panel: Conversation ────────────────────────────────────────────────

function Bubble({ initials, name, time, text, bg, textBg, color }) {
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 9,
        color, flexShrink: 0,
      }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 11.5, color: "#0B1110" }}>{name}</span>
          <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 10, color: "#A8B4B0" }}>{time}</span>
        </div>
        <div style={{
          background: textBg, borderRadius: "2px 8px 8px 8px",
          padding: "8px 12px",
          fontFamily: "Manrope, sans-serif", fontWeight: 400,
          fontSize: 12, lineHeight: "18px", color: "#0B1110",
        }}>{text}</div>
      </div>
    </div>
  );
}

function ConversationPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 14 }}>
        <Bubble initials="YO" name="You" time="2:14 PM"
          text="Here's the draft of the first 3 reels. Let me know if the pacing works for you!"
          bg="#E8F7F1" textBg="#F0FBF6" color="#009966"
        />
        <Bubble initials="AN" name="Ananya" time="2:18 PM"
          text="Looks great! Can you add a bit more energy to the cuts?"
          bg="#EEEFFF" textBg="#F5F5FF" color="#6B5BD6"
        />
        <Bubble initials="YO" name="You" time="2:21 PM"
          text="Sure, will send updated version by EOD."
          bg="#E8F7F1" textBg="#F0FBF6" color="#009966"
        />
      </div>
      <VideoAttachment height={88} />
      {/* Reply bar */}
      <div style={{
        marginTop: 12,
        display: "flex", alignItems: "center", gap: 8,
        background: "#F5F7F6", borderRadius: 10,
        border: "0.8px solid #E8EDEB",
        padding: "8px 12px",
      }}>
        <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#A8B4B0", flex: 1 }}>
          Reply to Ananya...
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", background: "#009966",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10.5 1.5L4.5 7.5M10.5 1.5L7 10.5L4.5 7.5L1 4L10.5 1.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Panel: Progress ────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { label: "Task started", time: "Oct 12, 9:00 AM", done: true },
  { label: "Brief confirmed", time: "Oct 12, 11:30 AM", done: true },
  { label: "First cut shared", time: "Oct 13, 3:45 PM", done: true },
  { label: "Your feedback pending", time: "", done: false },
  { label: "Final delivery", time: "", done: false },
];

function ProgressPanel() {
  const pct = 60;
  return (
    <div>
      {/* Progress bar row */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 11, color: "#0B1110" }}>Overall progress</span>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 11, color: "#009966" }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: "#E8EDEB", borderRadius: 999, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ height: "100%", background: "#009966", borderRadius: 999 }}
          />
        </div>
      </div>

      <p style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 10, color: "#68726F", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 14px" }}>
        Task activity
      </p>
      {TIMELINE_STEPS.map((step, i) => (
        <div key={step.label} style={{ display: "flex", gap: 10, position: "relative", marginBottom: i < TIMELINE_STEPS.length - 1 ? 18 : 0 }}>
          {i < TIMELINE_STEPS.length - 1 && (
            <div style={{
              position: "absolute", left: 8, top: 20, width: 2, height: 18,
              background: step.done ? "#009966" : "#E8EDEB", borderRadius: 1,
            }} />
          )}
          <div style={{
            width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
            background: step.done ? "#009966" : "transparent",
            border: step.done ? "none" : "2px solid #D1DAD7",
            display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
          }}>
            {step.done && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div>
            <p style={{
              fontFamily: "Manrope, sans-serif", fontWeight: step.done ? 500 : 600,
              fontSize: 12, color: step.done ? "#0B1110" : "#009966", margin: 0, lineHeight: "18px",
            }}>{step.label}</p>
            {step.time && (
              <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 10, color: "#68726F", margin: "2px 0 0" }}>
                {step.time}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Panel: Deliverables ────────────────────────────────────────────────

function StarRating({ value = 0 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill={s <= value ? "#F59E0B" : "none"}>
          <path d="M7 1.5l1.545 3.13 3.455.5-2.5 2.437.59 3.433L7 9.25l-3.09 1.75.59-3.433L2 5.13l3.455-.5L7 1.5z"
            stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      ))}
    </div>
  );
}

function DeliverablesPanel() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 10, color: "#68726F", textTransform: "uppercase", letterSpacing: "0.6px", margin: 0 }}>
          Submitted work
        </p>
        <span style={{ fontFamily: "Manrope, sans-serif", fontSize: 10, color: "#009966", fontWeight: 600 }}>v3 · Final</span>
      </div>
      <VideoAttachment label="Final_Reels_v3.mp4" duration="1:22" height={116} />

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "12px 0 10px" }}>
        <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 500, fontSize: 12, color: "#0B1110" }}>Rate this delivery</span>
        <StarRating value={0} />
      </div>

      {/* Feedback textarea */}
      <div style={{
        background: "#F5F7F6", borderRadius: 10, border: "0.8px solid #E8EDEB",
        padding: "9px 12px",
        fontFamily: "Manrope, sans-serif", fontWeight: 400, fontSize: 12,
        color: "#A8B4B0", lineHeight: "18px",
      }}>
        Leave feedback for the performer...
      </div>

      {/* Approve button */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button style={{
          all: "unset", cursor: "pointer", flex: 1,
          background: "#009966", borderRadius: 10,
          padding: "10px 0", textAlign: "center",
          fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 12.5, color: "#FFF",
        }}>
          Approve & close task
        </button>
        <button style={{
          all: "unset", cursor: "pointer",
          padding: "10px 16px",
          border: "0.8px solid #E0E6E3", borderRadius: 10,
          fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 12, color: "#68726F",
        }}>
          Request revision
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────

export default function PostOptionsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    clearTimeout(timerRef.current);
    setActiveIdx(idx);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % FEATURES.length);
    }, AUTO_CYCLE_MS);
    return () => clearTimeout(timerRef.current);
  }, [activeIdx]);

  const activeFeature = FEATURES[activeIdx];

  return (
    <section
      style={{
        padding: "clamp(56px, 7vw, 96px) 0 clamp(64px, 8vw, 112px)",
        backgroundImage:
          "linear-gradient(228.24deg, rgba(255,255,255,0) 15.29%, rgba(255,255,255,0.75) 63.39%), url('/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto px-3" style={{ maxWidth: 1200 }}>
        <div
          style={{
            display: "flex",
            gap: "clamp(28px, 4vw, 52px)",
            alignItems: "stretch",
            flexWrap: "wrap",
          }}
        >
          {/* ── LEFT ── */}
          <div
            style={{
              flex: "0 0 auto",
              width: "clamp(260px, 35%, 360px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 600,
                fontSize: "clamp(28px, 3.5vw, 41.8px)",
                lineHeight: 1.15,
                color: "#0B1110",
                margin: "0 0 12px",
              }}
            >
              Keep your task{" "}
              <span style={{ color: "#009966" }}>moving.</span>
            </h2>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(13px, 1.4vw, 15px)",
                lineHeight: 1.7,
                color: "#68726F",
                margin: "0 0 28px",
              }}
            >
              From first message to final delivery — everything happens in one
              place.
            </p>

            {/* Feature cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FEATURES.map((f, i) => {
                const isActive = i === activeIdx;
                return (
                  <button
                    key={f.id}
                    onClick={() => goTo(i)}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "stretch",
                      borderRadius: 13,
                      overflow: "hidden",
                      background: isActive
                        ? "rgba(232,247,241,0.7)"
                        : "rgba(255,255,255,0.55)",
                      border: `0.8px solid ${isActive ? "#CFE9DF" : "#E0E6E3"}`,
                      transition: "background 0.25s, border-color 0.25s",
                    }}
                  >
                    {/* Green active bar */}
                    <div
                      style={{
                        width: isActive ? 3 : 0,
                        background: "#009966",
                        flexShrink: 0,
                        transition: "width 0.22s ease",
                      }}
                    />
                    <div style={{ padding: "14px 16px", flex: 1, textAlign: "left" }}>
                      <p
                        style={{
                          fontFamily: "Manrope, sans-serif",
                          fontWeight: 600,
                          fontSize: 13.5,
                          lineHeight: "20px",
                          color: isActive ? "#0B1110" : "#3D4D49",
                          margin: 0,
                        }}
                      >
                        {f.label}
                      </p>
                      <motion.div
                        initial={false}
                        animate={
                          isActive
                            ? { height: "auto", opacity: 1, marginTop: 5 }
                            : { height: 0, opacity: 0, marginTop: 0 }
                        }
                        transition={{ duration: 0.22 }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          style={{
                            fontFamily: "Manrope, sans-serif",
                            fontWeight: 400,
                            fontSize: 12,
                            lineHeight: "18px",
                            color: "#68726F",
                            margin: 0,
                          }}
                        >
                          {f.desc}
                        </p>
                      </motion.div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Workspace card ── */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.93)",
                border: "0.8px solid rgba(20,55,44,0.09)",
                boxShadow:
                  "0px 2px 4px rgba(9,30,23,0.03), 0px 20px 56px rgba(9,30,23,0.11)",
                borderRadius: 20,
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ── Card header ── */}
              <div style={{ padding: "20px 24px 0", borderBottom: "0.8px solid #F0F3F2" }}>
                {/* Title row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "Outfit, sans-serif",
                        fontWeight: 600,
                        fontSize: 17,
                        color: "#0B1110",
                        margin: "0 0 6px",
                        lineHeight: 1.3,
                      }}
                    >
                      Edit 10 reels for my brand
                    </h3>
                    {/* Assignee row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#EEEFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "Manrope, sans-serif",
                          fontWeight: 700,
                          fontSize: 8,
                          color: "#6B5BD6",
                        }}
                      >
                        AN
                      </div>
                      <span
                        style={{
                          fontFamily: "Manrope, sans-serif",
                          fontWeight: 500,
                          fontSize: 11.5,
                          color: "#68726F",
                        }}
                      >
                        Assigned to{" "}
                        <span style={{ color: "#0B1110", fontWeight: 600 }}>
                          Ananya Sharma
                        </span>
                      </span>
                      <span
                        style={{
                          marginLeft: 4,
                          fontFamily: "Manrope, sans-serif",
                          fontSize: 10.5,
                          color: "#A8B4B0",
                        }}
                      >
                        · 3 days left
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#E8F7F1",
                      color: "#009966",
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 600,
                      fontSize: 10.5,
                      padding: "4px 11px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    In progress
                  </span>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex" }}>
                  {TAB_LABELS.map((tab, i) => {
                    const isActive = i === activeIdx;
                    return (
                      <button
                        key={tab}
                        onClick={() => goTo(i)}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          padding: "0 2px 11px",
                          marginRight: 22,
                          fontFamily: "Manrope, sans-serif",
                          fontWeight: isActive ? 600 : 500,
                          fontSize: 13,
                          color: isActive ? "#009966" : "#68726F",
                          borderBottom: `2px solid ${
                            isActive ? "#009966" : "transparent"
                          }`,
                          transition: "color 0.2s, border-color 0.2s",
                        }}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Panel content ── */}
              <div
                style={{
                  padding: "18px 24px",
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: "100%" }}
                  >
                    {activeFeature.id === "conversation" && (
                      <ConversationPanel />
                    )}
                    {activeFeature.id === "progress" && <ProgressPanel />}
                    {activeFeature.id === "deliverables" && (
                      <DeliverablesPanel />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
