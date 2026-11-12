import React, { useRef } from "react";
import { motion } from "framer-motion";

const PERFORMERS = [
  {
    name: "Ananya",
    specialty: "UI/UX & Web Design",
    bio: "UI/UX & Web Design specialist focused on thoughtful, human-centered interfaces.",
    avatarGradient: "linear-gradient(145deg, #F7C5A6 6%, #9EC9C5 94%)",
    trustScore: 98,
    rating: "4.9",
    tasksDone: 126,
  },
  {
    name: "Kamala",
    specialty: "Content Writing",
    bio: "Content Writing specialist focused on thoughtful, compelling written narratives.",
    avatarGradient: "linear-gradient(145deg, #C4B5FD 6%, #7C3AED 94%)",
    trustScore: 97,
    rating: "4.9",
    tasksDone: 94,
  },
  {
    name: "Avi",
    specialty: "App Development",
    bio: "App Development specialist focused on thoughtful, scalable mobile solutions.",
    avatarGradient: "linear-gradient(145deg, #93C5FD 6%, #1D4ED8 94%)",
    trustScore: 96,
    rating: "4.8",
    tasksDone: 112,
  },
  {
    name: "Abhi",
    specialty: "Performance Marketing",
    bio: "Performance Marketing specialist focused on thoughtful, data-driven growth.",
    avatarGradient: "linear-gradient(145deg, #FCD34D 6%, #F59E0B 94%)",
    trustScore: 95,
    rating: "4.8",
    tasksDone: 87,
  },
  {
    name: "Avni",
    specialty: "Graphic Design",
    bio: "Graphic Design specialist focused on thoughtful, high-impact visual storytelling.",
    avatarGradient: "linear-gradient(145deg, #FDA4AF 6%, #BE185D 94%)",
    trustScore: 94,
    rating: "4.7",
    tasksDone: 103,
  },
];

const CARDS = [...PERFORMERS, ...PERFORMERS];
const CARD_W = 256;
const CARD_GAP = 18;
const STEP = CARD_W + CARD_GAP;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  viewport: { once: true, margin: "-80px" },
});

function ArrowIcon({ flip = false }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      style={flip ? { transform: "rotate(180deg)" } : {}}
    >
      <path
        d="M10.2 7.5L16.5 13L10.2 18.5"
        stroke="#009966"
        strokeWidth="2.167"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavBtn({ onClick, flip = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 60,
        height: 60,
        background: "#E0F7EA",
        opacity: disabled ? 0.5 : 1,
        borderRadius: 9999,
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        transition: "opacity 0.2s",
        flexShrink: 0,
      }}
    >
      <ArrowIcon flip={flip} />
    </button>
  );
}

function PerformerCard({ p }) {
  const STATS = [
    { val: p.trustScore, label: "Trust score" },
    { val: p.rating, label: "Ratings" },
    { val: p.tasksDone, label: "Tasks done" },
  ];

  return (
    <div
      style={{
        width: CARD_W,
        flexShrink: 0,
        background:
          "linear-gradient(155deg, #FFFFFF 8.49%, #FFFFFF 68.27%, #F9FCFA 91.51%)",
        border: "0.8px solid #F1F5F9",
        boxShadow:
          "0px 1px 2px rgba(9,30,23,0.2), 0px 12px 34px rgba(9,30,23,0.055)",
        borderRadius: 22,
        padding: "9px 9px 15px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Image / avatar area ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 205,
          background: p.avatarGradient,
          borderRadius: 17,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Big initial */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 72,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {p.name[0]}
          </span>
        </div>

        {/* Bottom gradient overlay */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 102,
            width: "100%",
            height: 103,
            background:
              "linear-gradient(180deg, rgba(5,17,12,0) 0%, rgba(5,17,12,0.18) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* ● Available pill */}
        <div
          style={{
            position: "absolute",
            right: 9,
            bottom: 10,
            padding: "5px 8px",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(8px)",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 7,
              lineHeight: "10px",
              color: "#1E4B3C",
              whiteSpace: "nowrap",
            }}
          >
            ● Available
          </span>
        </div>
      </div>

      {/* ── Name + verified badge ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "18px 11px 0",
        }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: "27px",
            color: "#0B1110",
          }}
        >
          {p.name}
        </span>
        <div
          style={{
            position: "relative",
            width: 14,
            height: 14,
            background: "#009966",
            borderRadius: 7,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 3.5,
              top: 1,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 8,
              lineHeight: "12px",
              color: "#FFFFFF",
            }}
          >
            ✓
          </span>
        </div>
      </div>

      {/* ── Bio ── */}
      <div style={{ padding: "7px 11px 0" }}>
        <p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: 10,
            lineHeight: "16px",
            color: "#68726F",
            margin: 0,
          }}
        >
          {p.bio}
        </p>
      </div>

      {/* ── Stats row ── */}
      <div style={{ padding: "18px 7px 0" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0 5px",
                borderRight: i < 2 ? "0.8px solid #E4E9E7" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  lineHeight: "18px",
                  color: "#0B1110",
                  textAlign: "center",
                }}
              >
                {s.val}
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 6,
                  lineHeight: "9px",
                  color: "#8A9390",
                  textAlign: "center",
                  paddingTop: 4,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PerformersSection() {
  const scrollRef = useRef(null);

  const scrollPrev = () =>
    scrollRef.current?.scrollBy({ left: -STEP, behavior: "smooth" });
  const scrollNext = () =>
    scrollRef.current?.scrollBy({ left: STEP, behavior: "smooth" });

  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "clamp(56px, 8vw, 105px) 0 clamp(60px, 9vw, 112px)",
        overflow: "hidden",
      }}
    >
      {/* ── Header — constrained to 1024px ── */}
      <div className="mx-auto px-3" style={{ maxWidth: 1200 }}>
        <motion.div
          {...fadeUp(0)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Left: heading + subtext */}
          <div>
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
              Meet our{" "}
              <span
                className="relative inline-block"
                style={{ color: "#009966" }}
              >
                performers.
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    left: 1.81,
                    width: "clamp(110px, 17vw, 197.31px)",
                    height: 3,
                    background: "#009966",
                    opacity: 0.18,
                    borderRadius: 999,
                    transform: "rotate(-1deg)",
                  }}
                />
              </span>
            </h2>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#0B1110",
                margin: "12px 0 0",
              }}
            >
              Approved, ranked and ready to work.
            </p>
          </div>

          {/* Right: nav buttons — desktop only */}
          <div
            className="hidden md:flex"
            style={{ gap: 24, alignItems: "center", flexShrink: 0 }}
          >
            <NavBtn onClick={scrollPrev} flip />
            <NavBtn onClick={scrollNext} />
          </div>
        </motion.div>
      </div>

      {/* ── Cards — full viewport width ── */}
      <motion.div {...fadeUp(0.1)} style={{ marginTop: 56 }}>
        <div
          ref={scrollRef}
          className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: CARD_GAP,
              width: "max-content",
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: "max(calc((100vw - 1200px) / 2 + 12px), 12px)",
              paddingRight: 48,
            }}
          >
            {CARDS.map((p, i) => (
              <PerformerCard key={i} p={p} />
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  );
}
