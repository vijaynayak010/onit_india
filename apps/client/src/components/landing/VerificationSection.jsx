import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    icon: "⌾",
    title: "Complete profile",
    desc: "Full details, skills and work history.",
  },
  {
    num: "02",
    icon: "□",
    title: "Add projects",
    desc: "Real past work that shows quality.",
  },
  {
    num: "03",
    icon: "◇",
    title: "FirstDoer approval",
    desc: "Our team reviews every project.",
  },
  {
    num: "04",
    icon: "♙",
    title: "Earn ranking",
    desc: "Ranking grows with delivered tasks.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  viewport: { once: true, margin: "-80px" },
});

export default function VerificationSection() {
  return (
    <section
      style={{
        background: "#FFFFFF",
        padding:
          "clamp(56px, 8vw, 110px) 0 clamp(56px, 8vw, 105px)",
      }}
    >
      <div className="mx-auto px-3" style={{ maxWidth: 1200 }}>

        {/* ── Heading ─────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0)}>
          <div style={{ display: "inline" }}>
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "clamp(28px, 3.5vw, 41.832px)",
                lineHeight: "clamp(34px, 4.5vw, 48px)",
                letterSpacing: "-2.3px",
                color: "#0B1110",
                margin: 0,
                display: "inline",
              }}
            >
              Only the{" "}
              <span
                className="relative inline-block"
                style={{ color: "#009966" }}
              >
                best
                {/* underline accent */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    left: 1.81,
                    width: 71,
                    height: 3,
                    background: "#009966",
                    opacity: 0.18,
                    borderRadius: 999,
                    transform: "rotate(-1deg)",
                  }}
                />
              </span>{" "}
              get in.
            </h2>
            {/* decorative green square */}
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                background: "#009966",
                borderRadius: 2,
                transform: "rotate(18deg)",
                marginLeft: 6,
                verticalAlign: "text-top",
                marginTop: 6,
              }}
            />
          </div>

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
            FirstDoer isn't an open marketplace. Every performer earns their place.
          </p>
        </motion.div>

        {/* ── Steps + Ananya card ──────────────────────────────────── */}
        <div
          className="flex flex-col md:flex-row md:items-start"
          style={{ marginTop: 62, gap: 24 }}
        >
          {/* 4 steps — 2×2 on mobile, single row on desktop */}
          <div
            className="grid grid-cols-2 md:flex md:flex-row"
            style={{ gap: 24, flex: 1 }}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                {...fadeUp(i * 0.07)}
                style={{ display: "flex", flexDirection: "column", flex: "1 1 0" }}
              >
                {/* Icon + number row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      border: "0.8px solid #E3E9E6",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 16,
                        lineHeight: "24px",
                        color: "#009966",
                      }}
                    >
                      {step.icon}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: 12.8,
                      lineHeight: "19px",
                      color: "#67716E",
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: "22px",
                    color: "#0B1110",
                    margin: "18px 0 0",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: 13,
                    lineHeight: "21px",
                    color: "#68726F",
                    margin: "8px 0 0",
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Ananya verified card */}
          <motion.div
            {...fadeUp(0.28)}
            style={{
              width: 250,
              flexShrink: 0,
              background:
                "radial-gradient(113.27% 212.91% at 100% 0%, rgba(0,168,115,0.08) 0%, rgba(0,168,115,0) 40%), #FFFFFF",
              border: "0.8px solid rgba(20,55,44,0.1)",
              boxShadow:
                "0px 1px 2px rgba(9,30,23,0.03), 0px 12px 34px rgba(9,30,23,0.055)",
              borderRadius: 18,
              padding: 22.8,
              alignSelf: "center",
            }}
          >
            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(145deg, #F7C5A6 6.17%, #9EC9C5 93.83%)",
                  boxShadow:
                    "0 0 0 3px #FFFFFF, 0 0 0 4px rgba(0,168,115,0.16), 0px 8px 20px rgba(9,30,23,0.13)",
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
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#FFFFFF",
                  }}
                >
                  A
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    lineHeight: "20px",
                    color: "#0B1110",
                    margin: 0,
                  }}
                >
                  Ananya
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: 11,
                    lineHeight: "16px",
                    color: "#79817F",
                    margin: "4px 0 0",
                  }}
                >
                  UI/UX Design
                </p>
              </div>
            </div>

            {/* FirstDoer Verified badge */}
            <div
              style={{
                marginTop: 14,
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 12px",
                background: "#009966",
                borderRadius: 999,
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  lineHeight: "16px",
                  color: "#FFFFFF",
                }}
              >
                FirstDoer Verified ✓
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Footer note ─────────────────────────────────────────── */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "20px",
            color: "#68726F",
            margin: "58px 0 0",
          }}
        >
          Only the top 15% of applicants are approved.
        </motion.p>

      </div>
    </section>
  );
}
