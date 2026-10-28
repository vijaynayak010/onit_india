import React, { useState } from "react";
import { motion } from "framer-motion";

import alexImg from "../../assets/home/avatars/alex-suprun.jpg";
import evanImg from "../../assets/home/avatars/evan-clay.jpg";
import abdulImg from "../../assets/home/avatars/abdul-quiyum.jpg";
import diegoImg from "../../assets/home/avatars/diego-hernandez.jpg";
import joelImg from "../../assets/home/avatars/joel-mott.jpg";
import nicolasImg from "../../assets/home/avatars/nicolas-horn.jpg";

const CARD_W = 400;
const IMG_H = Math.round(CARD_W * (335 / 386)); // ≈347px
const INFO_H = 74;
const REVIEW_H = Math.round(IMG_H * 0.7 + INFO_H); // ≈317px – covers bottom 70% of image + info

const PERFORMERS = [
  {
    id: 0,
    name: "Priya Mehta",
    role: "UI/UX Designer",
    bgColor: "#EFE8DF",
    img: evanImg,
    review: {
      text: '"Working with Priya was a game-changer for our product. I highly recommend her to anyone looking for a top-tier UI/UX designer!"',
      reviewer: "Arjun K.",
      company: "Founder of AppStudio",
    },
  },
  {
    id: 1,
    name: "Alex Suprun",
    role: "Full-Stack Dev",
    bgColor: "#E3EAF2",
    img: alexImg,
    review: {
      text: '"Alex built our entire platform in record time. Code quality was exceptional and the delivery was perfectly on schedule."',
      reviewer: "Sarah L.",
      company: "CTO, LaunchFast",
    },
  },
  {
    id: 2,
    name: "Nicolas Horn",
    role: "Brand Designer",
    bgColor: "#E3EEE6",
    img: nicolasImg,
    review: {
      text: '"Nicolas understood our brand vision immediately and delivered a stunning identity that our customers absolutely love."',
      reviewer: "Rahul T.",
      company: "CEO, GreenLeaf Co.",
    },
  },
  {
    id: 3,
    name: "Diego Hernandez",
    role: "Content Creator",
    bgColor: "#EEEAE3",
    img: diegoImg,
    review: {
      text: '"Diego\'s content strategy tripled our engagement in just two months. The ROI was incredible — would hire again in a heartbeat."',
      reviewer: "Meera P.",
      company: "Marketing Head, BrandBox",
    },
  },
  {
    id: 4,
    name: "Abdul Quiyum",
    role: "Mobile Developer",
    bgColor: "#EAE3EE",
    img: abdulImg,
    review: {
      text: '"Delivered a polished, fully functional mobile app ahead of schedule. Attention to detail and communication were outstanding."',
      reviewer: "Vijay R.",
      company: "Co-founder, MobiCraft",
    },
  },
  {
    id: 5,
    name: "Joel Mott",
    role: "Video Editor",
    bgColor: "#EEE3E3",
    img: joelImg,
    review: {
      text: '"Joel\'s editing brought our product launch video to life. The storytelling, pacing, and quality exceeded all our expectations."',
      reviewer: "Neha G.",
      company: "Product Lead, Visuals Inc.",
    },
  },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill="#F5A623">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#2B7FFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
        <path
          d="M1.5 6.5L5.5 11L14.5 1.5"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function PerformerCard({ performer }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ width: CARD_W, flexShrink: 0, position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image area ── */}
      <div
        style={{
          width: CARD_W,
          height: IMG_H,
          borderRadius: 23,
          background: performer.bgColor,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={performer.img}
          alt={performer.name}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />

        {/* Dark overlay on hover */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            pointerEvents: "none",
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.26 }}
        />

        {/* Performer name + role – visible on hover, at top of dark card */}
        <motion.div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            pointerEvents: "none",
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: hovered ? 0.06 : 0 }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "white",
              marginBottom: 5,
            }}
          >
            {performer.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00C950",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              {performer.role}
            </span>
          </div>
        </motion.div>

        {/* Verified badge */}
        <div style={{ position: "absolute", top: 18, right: 18 }}>
          <VerifiedBadge />
        </div>
      </div>

      {/* ── Info below image ── */}
      <div style={{ padding: "14px 4px 0", height: INFO_H }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: "#6B7280",
            }}
          >
            {performer.role}
          </span>
          <span style={{ color: "#D1D5DB", fontSize: 14, userSelect: "none" }}>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00C950",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Available
            </span>
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#101828",
          }}
        >
          {performer.name}
        </div>
      </div>

      {/* ── Review card – slides up + fades in on hover ── */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 10,
          right: -10,
          height: REVIEW_H,
          background: "rgba(16,24,40,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 20,
          padding: "22px 24px",
          rotate: -4,
          pointerEvents: hovered ? "auto" : "none",
        }}
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 20,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Stars />
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: "28px",
            color: "white",
            margin: "14px 0 16px",
          }}
        >
          {performer.review.text}
        </p>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "white",
            marginBottom: 2,
          }}
        >
          {performer.review.reviewer}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {performer.review.company}
        </div>
      </motion.div>
    </div>
  );
}

const TRACK_W = PERFORMERS.length * (CARD_W + 20); // single set width for animation

export default function FindTalentSection() {
  return (
    <section className="w-full bg-white py-20 lg:py-28">
      <style>{`
        @keyframes find-talent-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-${TRACK_W}px); }
        }
        .find-talent-row:hover .find-talent-track {
          animation-play-state: paused;
        }
        .find-talent-track {
          animation: find-talent-scroll ${PERFORMERS.length * 5}s linear infinite;
        }
      `}</style>

      {/* Title */}
      <div className="mx-auto max-w-[1240px] px-4 lg:px-6 mb-12">
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 4vw, 52px)",
            lineHeight: "110%",
            color: "#111111",
          }}
        >
          Find the{" "}
          <span style={{ color: "#009966" }}>perfect talent</span>
          {" "}in minutes.
        </h2>
      </div>

      {/* Marquee – overflow hidden clips the scrolling track */}
      <div
        className="find-talent-row"
        style={{ overflow: "hidden", paddingBottom: 32 }}
      >
        <div
          className="find-talent-track"
          style={{ display: "flex", gap: 20, width: "max-content" }}
        >
          {/* duplicate for seamless loop */}
          {[...PERFORMERS, ...PERFORMERS].map((p, i) => (
            <PerformerCard key={`${p.id}-${i}`} performer={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
