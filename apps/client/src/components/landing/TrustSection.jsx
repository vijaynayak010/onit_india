import React from "react";
import { motion } from "framer-motion";

/* ── shared styles ─────────────────────────────────────────────────── */

const CARD_SHELL = {
  position: "relative",
  padding: "14px 14px 28px",
  background:
    "linear-gradient(155deg, #FFFFFF 8.49%, #FFFFFF 68.27%, #F9FCFA 91.51%)",
  border: "0.8px solid rgba(20,55,44,0.1)",
  boxShadow:
    "0px 1px 2px rgba(9,30,23,0.03), 0px 12px 34px rgba(9,30,23,0.055)",
  borderRadius: 22,
  display: "flex",
  flexDirection: "column",
  isolation: "isolate",
};

const PREVIEW_BG = {
  background:
    "linear-gradient(180deg, rgba(241,245,249,0.92) 38.94%, #F0FAF6 100%)",
  border: "0.8px solid rgba(20,55,44,0.067)",
  borderRadius: 16,
  padding: 22,
  display: "flex",
  flexDirection: "column",
};

const CARD_H3 = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 400,
  fontSize: 21,
  lineHeight: "32px",
  letterSpacing: "-0.735px",
  color: "#0B1110",
  margin: "25px 12px 0",
};

const CARD_P = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "20px",
  color: "#68726F",
  margin: "8px 12px 0",
};

const CHIP = (color = "#009966") => ({
  padding: "6px 9px",
  background: "rgba(255,255,255,0.9)",
  border: "0.8px solid rgba(20,55,44,0.07)",
  borderRadius: 999,
  fontFamily: "Poppins, sans-serif",
  fontWeight: 400,
  fontSize: 11,
  lineHeight: "16px",
  color,
});

const PREVIEW_HEADER = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 18,
};

const LABEL_BOLD = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 700,
  fontSize: 11,
  lineHeight: "16px",
  color: "#0B1110",
};

/* shimmer line at the very top of each card */
function Shimmer({ w = 400, l = 51 }) {
  return (
    <div
      style={{
        position: "absolute",
        left: l,
        top: 0.6,
        width: w,
        height: 1,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%)",
        zIndex: 0,
      }}
    />
  );
}

/* ── animation helper ──────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  viewport: { once: true, margin: "-80px" },
});

/* ── Card 1: Verified performers ────────────────────────────────────── */
function VerifiedPerformersCard() {
  const VERIFY_ROWS = [
    { label: "Government ID", value: "Verified" },
    { label: "Projects reviewed", value: "Approved" },
    { label: "Performer ranking", value: "Top 5%" },
  ];
  return (
    <motion.div style={{ ...CARD_SHELL, flex: "1 1 0" }} {...fadeUp(0)}>
      <Shimmer />

      {/* Preview area */}
      <div style={{ ...PREVIEW_BG, minHeight: 274 }}>
        {/* Header */}
        <div style={PREVIEW_HEADER}>
          <span style={LABEL_BOLD}>Performer verification</span>
          <span style={CHIP("#009966")}>Approved ✓</span>
        </div>

        {/* Content row */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }}>
          {/* Performer profile card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 12,
              background: "#FFFFFF",
              border: "0.8px solid rgba(20,55,44,0.067)",
              boxShadow: "0px 8px 20px rgba(9,30,23,0.055)",
              borderRadius: 8,
              flexShrink: 0,
              width: 165,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F0C6A8 0%, #D4956A 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#7a4a2a",
              }}
            >
              A
            </div>
            <div>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 10,
                  lineHeight: "15px",
                  color: "#0B1110",
                  margin: 0,
                }}
              >
                Ananya ✓
              </p>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 8,
                  lineHeight: "12px",
                  color: "#68726F",
                  margin: "4px 0 0",
                }}
              >
                Web Design · Hyderabad
              </p>
            </div>
          </div>

          {/* Verification list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {VERIFY_ROWS.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 13px",
                  background: "#FFFFFF",
                  border: "0.8px solid rgba(20,55,44,0.067)",
                  boxShadow: "0px 8px 20px rgba(9,30,23,0.055)",
                  borderRadius: 7,
                }}
              >
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: 10,
                    lineHeight: "15px",
                    color: "#0B1110",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    lineHeight: "15px",
                    color: "#009966",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 style={CARD_H3}>Verified performers</h3>
      <p style={CARD_P}>
        Every performer is ID-checked and has their projects approved before
        they can take a task.
      </p>
    </motion.div>
  );
}

/* ── Card 2: Secure escrow payments ─────────────────────────────────── */
function EscrowCard() {
  return (
    <motion.div style={{ ...CARD_SHELL, flex: "1 1 0" }} {...fadeUp(0.1)}>
      <Shimmer />

      <div style={{ ...PREVIEW_BG, minHeight: 274, justifyContent: "space-between" }}>
        {/* Header */}
        <div style={PREVIEW_HEADER}>
          <span style={LABEL_BOLD}>Protected payment</span>
          <span style={CHIP("#7A8380")}>•••</span>
        </div>

        {/* Escrow content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 10,
              lineHeight: "15px",
              color: "#7A8380",
              margin: 0,
            }}
          >
            ♙ Held safely in escrow
          </p>

          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 46,
              lineHeight: "69px",
              letterSpacing: "-2.53px",
              color: "#0B1110",
              margin: 0,
            }}
          >
            ₹18,500
          </p>

          {/* Progress bar — 3 pill segments */}
          <div style={{ position: "relative", height: 5, marginBottom: 2 }}>
            {/* Seg 1: ~42% green */}
            <div style={{ position: "absolute", left: 0, top: 0, width: "42%", height: 5, background: "#009966", borderRadius: 999 }} />
            {/* Seg 2: ~32% green, gap 1.7% */}
            <div style={{ position: "absolute", left: "43.7%", top: 0, width: "32%", height: 5, background: "#009966", borderRadius: 999 }} />
            {/* Seg 3: ~22.6% gray, gap 1.7% */}
            <div style={{ position: "absolute", left: "77.4%", top: 0, width: "22.6%", height: 5, background: "#DCE4E0", borderRadius: 999 }} />
          </div>

          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 10,
              lineHeight: "15px",
              color: "#7A8380",
              margin: 0,
            }}
          >
            Funds release only when you approve the work
          </p>

          {/* Milestone row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 13,
              background: "#FFFFFF",
              border: "0.8px solid rgba(20,55,44,0.07)",
              borderRadius: 10,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 10,
                lineHeight: "15px",
                color: "#0B1110",
              }}
            >
              Milestone 2 of 3
            </span>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 10,
                lineHeight: "15px",
                color: "#7A8380",
              }}
            >
              On schedule
            </span>
          </div>
        </div>
      </div>

      <h3 style={CARD_H3}>Secure escrow payments</h3>
      <p style={CARD_P}>
        Funds are protected until the work is done right and every agreed
        milestone is approved.
      </p>
    </motion.div>
  );
}

/* ── Card 3: AI task breakdown ──────────────────────────────────────── */
function AITaskCard() {
  const STEPS = [
    "1 Wireframes & sitemap",
    "2 Build & responsive QA",
    "3 Launch & handover",
  ];
  return (
    <motion.div style={{ ...CARD_SHELL, flex: "1 1 0" }} {...fadeUp(0)}>
      <Shimmer w={261} l={33.5} />

      <div style={{ ...PREVIEW_BG, minHeight: 266 }}>
        {/* Header */}
        <div style={PREVIEW_HEADER}>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 10,
              lineHeight: "15px",
              color: "#009966",
            }}
          >
            AI task plan
          </span>
          <span
            style={{
              padding: "6px 9px",
              background: "rgba(255,255,255,0.9)",
              border: "0.8px solid rgba(20,55,44,0.067)",
              boxShadow: "0px 8px 20px rgba(9,30,23,0.055)",
              borderRadius: 999,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 11,
              lineHeight: "16px",
              color: "#009966",
            }}
          >
            3 steps
          </span>
        </div>

        {/* Ready to publish */}
        <p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: 10,
            lineHeight: "15px",
            color: "#009966",
            margin: "0 0 8px",
          }}
        >
          ✦ Ready to publish
        </p>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {STEPS.map((step) => (
            <div
              key={step}
              style={{
                padding: 12,
                background: "#FFFFFF",
                border: "0.8px solid rgba(20,55,44,0.067)",
                boxShadow: "0px 8px 20px rgba(9,30,23,0.055)",
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 10,
                  lineHeight: "15px",
                  color: "#0B1110",
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <h3 style={CARD_H3}>AI task breakdown</h3>
      <p style={CARD_P}>
        Clear scope and milestones, generated from one sentence.
      </p>
    </motion.div>
  );
}

/* ── Card 4: Real-time tracking & chat ──────────────────────────────── */
function TrackingChatCard() {
  return (
    <motion.div style={{ ...CARD_SHELL, flex: "1 1 0" }} {...fadeUp(0.1)}>
      <Shimmer w={261} l={33.5} />

      <div style={{ ...PREVIEW_BG, minHeight: 266, gap: 12 }}>
        {/* Header */}
        <div style={PREVIEW_HEADER}>
          <span style={LABEL_BOLD}>Project activity</span>
          <span style={CHIP("#78817E")}>Live</span>
        </div>

        {/* Active project row */}
        <div
          style={{
            padding: "8px 12px",
            background: "#FFFFFF",
            borderRadius: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#009966",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 10,
                lineHeight: "15px",
                color: "#0B1110",
              }}
            >
              Website build
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 10,
                lineHeight: "15px",
                color: "#78817E",
              }}
            >
              3 of 5 pages
            </span>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 8,
                lineHeight: "12px",
                color: "#78817E",
              }}
            >
              Due Friday
            </span>
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: 3,
              background: "#009966",
              borderRadius: 999,
              width: "56%",
              marginTop: 6,
            }}
          />
        </div>

        {/* Chat message */}
        <div
          style={{
            padding: 12,
            background: "#FFFFFF",
            border: "0.8px solid rgba(20,55,44,0.067)",
            boxShadow: "0px 8px 20px rgba(9,30,23,0.055)",
            borderRadius: 9,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 25,
              height: 25,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #A9CED0 0%, #7AABB0 100%)",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 9,
              lineHeight: "15px",
              color: "#0B1110",
              margin: 0,
            }}
          >
            About page is live on staging.{" "}
            <span style={{ color: "#009966" }}>
              Looks great — right on schedule.
            </span>
          </p>
        </div>
      </div>

      <h3 style={CARD_H3}>Real-time tracking & chat</h3>
      <p style={CARD_P}>
        Follow progress and talk to your performer in one thread.
      </p>
    </motion.div>
  );
}

/* ── Card 5: Proof & protection ─────────────────────────────────────── */
const DELIVERY_IMGS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #f5e642 0%, #f5a623 60%, #e8873a 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)",
];

function ProofCard() {
  return (
    <motion.div style={{ ...CARD_SHELL, flex: "1 1 0" }} {...fadeUp(0.2)}>
      <Shimmer w={261} l={33.5} />

      <div style={{ ...PREVIEW_BG, minHeight: 266, overflow: "hidden" }}>
        {/* Header */}
        <div style={PREVIEW_HEADER}>
          <span style={LABEL_BOLD}>Final delivery</span>
          <span style={CHIP("#009966")}>Verified ✓</span>
        </div>

        {/* 3 delivery images */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flex: 1, minHeight: 0 }}>
          {DELIVERY_IMGS.map((bg, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                aspectRatio: "80 / 105",
                background: bg,
                border: "0.8px solid rgba(20,55,44,0.08)",
                boxShadow: "0px 8px 18px rgba(9,30,23,0.1)",
                borderRadius: 8,
              }}
            />
          ))}
        </div>

        {/* Tag row */}
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {["▣ Files", "◷ Timestamped"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "6px 8px",
                background: "#FFFFFF",
                borderRadius: 999,
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 8,
                  lineHeight: "12px",
                  color: "#0B1110",
                }}
              >
                {tag}
              </span>
            </div>
          ))}
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 8,
              lineHeight: "12px",
              color: "#009966",
              marginLeft: "auto",
            }}
          >
            Protected
          </span>
        </div>
      </div>

      <h3 style={CARD_H3}>Proof & protection</h3>
      <p style={CARD_P}>
        Verifiable delivery, version history and fair dispute support.
      </p>
    </motion.div>
  );
}

/* ── Main Section ────────────────────────────────────────────────────── */
export default function TrustSection() {
  return (
    <section
      style={{
        background: "rgba(255,255,255,0.5)",
        padding: "clamp(56px, 8vw, 110px) 0 clamp(60px, 9vw, 120px)",
      }}
    >
      <div className="mx-auto px-3" style={{ maxWidth: 1200 }}>

        {/* Heading */}
        <motion.div {...fadeUp(0)}>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(26px, 3.5vw, 41.832px)",
              lineHeight: "clamp(32px, 4.5vw, 48px)",
              letterSpacing: "-2.3px",
              color: "#0B1110",
              margin: 0,
            }}
          >
            Built for trust,{" "}
            <span style={{ color: "#009966" }}>end to end.</span>
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(14px, 1.6vw, 17px)",
              lineHeight: "26px",
              color: "#68726F",
              margin: "12px 0 0",
            }}
          >
            Everything you need to hand off work with confidence.
          </p>
        </motion.div>

        {/* Row 1: 2 wide cards */}
        <div
          className="flex flex-col md:flex-row"
          style={{ gap: 20, marginTop: 58 }}
        >
          <VerifiedPerformersCard />
          <EscrowCard />
        </div>

        {/* Row 2: 3 narrow cards */}
        <div
          className="flex flex-col md:flex-row"
          style={{ gap: 20, marginTop: 48 }}
        >
          <AITaskCard />
          <TrackingChatCard />
          <ProofCard />
        </div>

      </div>
    </section>
  );
}
