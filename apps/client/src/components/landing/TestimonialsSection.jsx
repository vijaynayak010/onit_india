import React from "react";

/* ── data ───────────────────────────────────────────────────────── */

const QUOTE_COLORS = [
  "#E7FBF1",
  "#E4F2FD",
  "#EDEDFF",
  "#FFEBF5",
  "rgba(255,219,0,0.12)",
  "#F1F5F9",
];

const ROW1 = [
  {
    name: "Arjun Nair",
    role: "Marketing Lead, Tarang",
    company: "TARANG",
    quote: "Finding dependable help for smaller digital jobs used to be the hardest part. With FirstDoer, it simply isn't anymore.",
    avatarGradient: "linear-gradient(135deg, #93C5FD 0%, #1D4ED8 100%)",
  },
  {
    name: "Priya Sharma",
    role: "Founder, Bloom",
    company: "BLOOM",
    quote: "We launched our entire brand identity through FirstDoer. The performers were professional, fast and exactly what we needed.",
    avatarGradient: "linear-gradient(135deg, #FCA5A5 0%, #B91C1C 100%)",
  },
  {
    name: "Ravi Kumar",
    role: "Product Manager, Nexus",
    company: "NEXUS",
    quote: "The milestone payment system gave us full control. We only paid when we were genuinely happy with the work.",
    avatarGradient: "linear-gradient(135deg, #6EE7B7 0%, #059669 100%)",
  },
  {
    name: "Neha Gupta",
    role: "CEO, Spark Labs",
    company: "SPARK",
    quote: "FirstDoer's AI brief builder cut our setup time in half. It understood exactly what we needed without back-and-forth.",
    avatarGradient: "linear-gradient(135deg, #FCD34D 0%, #D97706 100%)",
  },
  {
    name: "Siddharth Rao",
    role: "Content Lead, Wave",
    company: "WAVE",
    quote: "The performers here actually deliver. I've tried other freelance platforms — FirstDoer is in a completely different league.",
    avatarGradient: "linear-gradient(135deg, #C4B5FD 0%, #7C3AED 100%)",
  },
  {
    name: "Anita Verma",
    role: "Design Director, Crest",
    company: "CREST",
    quote: "Real-time chat and progress tracking meant no surprises. I always knew exactly where my project stood.",
    avatarGradient: "linear-gradient(135deg, #FDA4AF 0%, #BE185D 100%)",
  },
];

const ROW2 = [
  {
    name: "Vikram Bose",
    role: "CTO, Aleph Tech",
    company: "ALEPH",
    quote: "Escrow payments made the whole thing feel safe. We'd never hired this way before — now it's our default process.",
    avatarGradient: "linear-gradient(135deg, #6EE7B7 0%, #059669 100%)",
  },
  {
    name: "Meera Iyer",
    role: "Brand Manager, Lumen",
    company: "LUMEN",
    quote: "Every performer we worked with was verified with real project reviews. The quality bar on FirstDoer is noticeably higher.",
    avatarGradient: "linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)",
  },
  {
    name: "Karan Malhotra",
    role: "Founder, Spire",
    company: "SPIRE",
    quote: "We got a full website, pitch deck and social content done through FirstDoer in one week. Truly remarkable platform.",
    avatarGradient: "linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%)",
  },
  {
    name: "Divya Nambiar",
    role: "Marketing Head, Prism",
    company: "PRISM",
    quote: "I posted a task at 9am and had three verified performers with full proposals by noon. That speed is unmatched.",
    avatarGradient: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
  },
  {
    name: "Rohit Saxena",
    role: "Operations Lead, Apex",
    company: "APEX",
    quote: "The trust score system means you're never guessing who to hire. You pick someone with a real, proven track record.",
    avatarGradient: "linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 100%)",
  },
  {
    name: "Sunita Das",
    role: "Freelance Consultant",
    company: "INDIE",
    quote: "As a performer on FirstDoer, the brief quality from clients is so much better. Projects actually make complete sense.",
    avatarGradient: "linear-gradient(135deg, #FDA4AF 0%, #BE185D 100%)",
  },
];

const CARD_W = 329.33;
const CARD_GAP = 36;
const N = 6;
const TRACK_SHIFT = N * (CARD_W + CARD_GAP); // ~2191.98px — shift for one full set

/* ── quote icon ─────────────────────────────────────────────────── */
function QuoteDecor({ color }) {
  return (
    <svg
      width="124"
      height="124"
      viewBox="0 0 32 32"
      fill="none"
      style={{
        position: "absolute",
        left: 26,
        top: 2,
        zIndex: 2,
        pointerEvents: "none",
        flexShrink: 0,
      }}
    >
      {/* left quote blob */}
      <path
        fill={color}
        d="M13 6H7C5.895 6 5 6.895 5 8v7c0 1.105.895 2 2 2h6v3.5C13 22.433 11.433 24 9.5 24H8.5c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1H9.5C13.642 28 17 24.642 17 20.5V8c0-1.105-.895-2-2-2zM25 6h-6c-1.105 0-2 .895-2 2v7c0 1.105.895 2 2 2h6v3.5C25 22.433 23.433 24 21.5 24h-1c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1h1C25.642 28 29 24.642 29 20.5V8c0-1.105-.895-2-2-2z"
      />
    </svg>
  );
}

/* ── single card ─────────────────────────────────────────────────── */
function TestiCard({ t, qColor }) {
  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        minWidth: CARD_W,
        height: 298.6,
        flexShrink: 0,
        padding: "125px 34px 28px",
        background: "#FFFFFF",
        border: "0.8px solid rgba(20,55,44,0.08)",
        boxShadow: "0px 10px 30px rgba(9,30,23,0.043)",
        borderRadius: 14,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        isolation: "isolate",
      }}
    >
      {/* Large decorative quote icon */}
      <QuoteDecor color={qColor} />

      {/* Quote text (absolutely positioned over spacer zone) */}
      <p
        style={{
          position: "absolute",
          left: 34.5,
          top: 126,
          width: 260,
          margin: 0,
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "24px",
          color: "#0B1110",
          zIndex: 3,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        "{t.quote}"
      </p>

      {/* Spacer — reserves space for absolute quote text zone */}
      <div style={{ height: 100, flexShrink: 0 }} />

      {/* Author row */}
      <div style={{ position: "relative", height: 43, flexShrink: 0, zIndex: 1 }}>
        {/* Avatar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0.55,
            width: 42,
            height: 42,
            borderRadius: 21,
            background: t.avatarGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "rgba(255,255,255,0.85)",
              userSelect: "none",
            }}
          >
            {t.name[0]}
          </span>
        </div>

        {/* Name + role */}
        <div style={{ position: "absolute", left: 53, top: -0.45 }}>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              lineHeight: "22px",
              color: "#0B1110",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {t.name}
          </p>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 10.4,
              lineHeight: "16px",
              color: "#68726F",
              margin: "5px 0 0",
              whiteSpace: "nowrap",
            }}
          >
            {t.role}
          </p>
        </div>

        {/* Company label */}
        {t.company && (
          <div style={{ position: "absolute", left: 196.48, top: 9.55 }}>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: "-0.48px",
                color: "#0B1110",
                whiteSpace: "nowrap",
              }}
            >
              {t.company}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── main section ────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "clamp(64px, 9vw, 120px) 0 clamp(64px, 9vw, 130px)",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${TRACK_SHIFT}px); }
        }
        @keyframes marqueeRight {
          0%   { transform: translateX(-${TRACK_SHIFT}px); }
          100% { transform: translateX(0); }
        }
        .marquee-wrap:hover .marquee-inner {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── Heading ─────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: 72, padding: "0 8px" }}>
        <p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            lineHeight: "16px",
            letterSpacing: 1.1,
            color: "#009966",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Testimonials
        </p>

        <div style={{ position: "relative", display: "inline-block", marginTop: 18 }}>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(28px, 4vw, 47.808px)",
              lineHeight: "clamp(34px, 5vw, 55px)",
              letterSpacing: "-2.63px",
              color: "#0B1110",
              margin: 0,
            }}
          >
            What people are saying
          </h2>
          {/* Green rotated dot */}
          <span
            style={{
              position: "absolute",
              top: 7,
              right: -18,
              width: 8,
              height: 8,
              background: "#009966",
              borderRadius: 2,
              transform: "rotate(18deg)",
              display: "inline-block",
            }}
          />
        </div>
      </div>

      {/* ── Row 1: left scroll ───────────────────────────────────── */}
      <div className="marquee-wrap" style={{ width: "100%" }}>
        <div
          className="marquee-inner"
          style={{
            display: "flex",
            gap: CARD_GAP,
            width: "max-content",
            animation: `marqueeLeft 38s linear infinite`,
          }}
        >
          {[...ROW1, ...ROW1].map((t, i) => (
            <TestiCard key={i} t={t} qColor={QUOTE_COLORS[i % QUOTE_COLORS.length]} />
          ))}
        </div>
      </div>

      {/* ── Row 2: right scroll ──────────────────────────────────── */}
      <div className="marquee-wrap" style={{ width: "100%", marginTop: 36 }}>
        <div
          className="marquee-inner"
          style={{
            display: "flex",
            gap: CARD_GAP,
            width: "max-content",
            animation: `marqueeRight 42s linear infinite`,
          }}
        >
          {[...ROW2, ...ROW2].map((t, i) => (
            <TestiCard key={i} t={t} qColor={QUOTE_COLORS[i % QUOTE_COLORS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}
