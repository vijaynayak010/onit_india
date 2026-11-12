import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import ananyaImg  from "../../assets/home/avatars/evan-clay.jpg";
import karanImg   from "../../assets/home/avatars/nicolas-horn.jpg";
import devImg     from "../../ree.png";
import priyaImg   from "../../assets/home/avatars/joel-mott.jpg";

const CDN = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing/testimonials";
const rohitImg  = `${CDN}/re4.webp`;
const vikramImg = `${CDN}/re5.webp`;

const CARD_W   = 300;
const CARD_GAP = 24;

const TESTIMONIALS = [
  {
    img: ananyaImg,
    quote:
      "FirstDoer has helped me find consistent freelance work while studying. The platform is trustworthy and the payments are always on time.",
    name: "Ananya S.",
    role: "Performer",
  },
  {
    img: rohitImg,
    quote:
      "Posting a design task on FirstDoer was so fast and easy. I got multiple qualified performers within minutes and completed my project ahead of time.",
    name: "Rohit Verma",
    role: "Provider",
  },
  {
    img: karanImg,
    quote:
      "The variety of skilled professionals on FirstDoer is incredible. I found exactly the right developer for my project within hours of posting.",
    name: "Karan M.",
    role: "Provider",
  },
  {
    img: devImg,
    quote:
      "I've been performing tasks on FirstDoer for six months and it has completely transformed my freelancing career. Highly recommended!",
    name: "Dev Kumar",
    role: "Performer",
  },
  {
    img: priyaImg,
    quote:
      "Managing tasks on FirstDoer is seamless. The communication tools and secure payments make it the best platform I've ever used.",
    name: "Priya R.",
    role: "Performer",
  },
  {
    img: vikramImg,
    quote:
      "As a business owner, FirstDoer has been invaluable. The quality of performers is consistently high and turnaround times are impressive.",
    name: "Vikram S.",
    role: "Provider",
  },
];

function ArrowIcon({ dir = "next" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: dir === "prev" ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M9 18l6-6-6-6"
        stroke="#078749"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TestimonialCard({ t }) {
  return (
    <div
      style={{
        width: CARD_W,
        height: 384,
        flexShrink: 0,
        background: "white",
        borderRadius: 12,
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Photo – fills top of card, slightly wider, top flush */}
      <div
        style={{
          position: "absolute",
          width: CARD_W + 21,
          height: 190,
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
          borderRadius: "12px 12px 0 0",
          overflow: "hidden",
        }}
      >
        <img
          src={t.img}
          alt={t.name}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
      </div>

      {/* Small green quote badge – sits at photo/text junction */}
      <div
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          left: 22,
          top: 154,
          background: "#DDF8E8",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 38,
            lineHeight: 1,
            color: "#079149",
            marginTop: 10,
            display: "block",
            userSelect: "none",
          }}
        >
          &#x201C;
        </span>
      </div>

      {/* Text area */}
      <div
        style={{
          position: "absolute",
          width: 253,
          left: "50%",
          transform: "translateX(-50%)",
          top: 220,
          display: "flex",
          flexDirection: "column",
          gap: 13,
        }}
      >
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "20px",
            color: "#202A32",
            margin: 0,
          }}
        >
          "{t.quote}"
        </p>
        <div>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              lineHeight: "21px",
              color: "#071827",
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "18px",
              color: "#48554E",
            }}
          >
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HearFromUsersSection() {
  const [active, setActive] = useState(0);
  const maxActive = TESTIMONIALS.length - 1;
  const canPrev = active > 0;
  const canNext = active < maxActive;

  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div
        className="mx-auto max-w-[1440px]"
        style={{
          position: "relative",
          paddingLeft: "clamp(16px, 7.5vw, 108px)",
          paddingRight: "clamp(16px, 7.5vw, 108px)",
        }}
      >
        {/* Large quote circle – overhangs above the green card */}
        <div
          style={{
            position: "absolute",
            top: -70,
            left: "calc(117px + clamp(16px, 7.5vw, 108px))",
            width: 192,
            height: 192,
            borderRadius: "50%",
            background: "#D8F6E4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 160,
              lineHeight: 1,
              color: "#079149",
              marginTop: 75,
              display: "block",
              userSelect: "none",
            }}
          >
            &#x201C;
          </span>
        </div>

        {/* Green card */}
        <div
          style={{
            background: "#E7FBF1",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            minHeight: 539,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* ── Left column ── */}
          <div
            style={{
              width: "clamp(280px, 33vw, 475px)",
              flexShrink: 0,
              padding: "80px clamp(20px, 3.5vw, 52px) 48px clamp(20px, 4.5vw, 72px)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 3.2vw, 44px)",
                lineHeight: "115%",
                color: "#071827",
                marginBottom: 16,
              }}
            >
              Hear from
              <br />
              our{" "}
              <span style={{ color: "#079149" }}>USERS</span>
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(13px, 1.4vw, 16px)",
                lineHeight: "1.65",
                color: "#48554E",
                marginBottom: 36,
                maxWidth: 320,
              }}
            >
              Real people. Real opportunities. See how providers and performers
              are achieving more with FirstDoer.
            </p>

            <Link
              to="/auth"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#071827",
                color: "white",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 40,
                padding: "14px 32px",
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#079149")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#071827")}
            >
              Join FirstDoer
            </Link>
          </div>

          {/* ── Right column – carousel ── */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Sliding track */}
            <motion.div
              style={{
                display: "flex",
                gap: CARD_GAP,
                paddingTop: 40,
                paddingBottom: 8,
                paddingLeft: 8,
              }}
              animate={{ x: -active * (CARD_W + CARD_GAP) }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              {TESTIMONIALS.map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </motion.div>

            {/* Navigation arrows */}
            <div
              style={{
                display: "flex",
                gap: 14,
                padding: "20px 8px 32px",
              }}
            >
              <button
                onClick={() => canPrev && setActive((a) => a - 1)}
                aria-label="Previous testimonial"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  background: "#E0F7EA",
                  border: "none",
                  cursor: canPrev ? "pointer" : "default",
                  opacity: canPrev ? 1 : 0.45,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <ArrowIcon dir="prev" />
              </button>

              <button
                onClick={() => canNext && setActive((a) => a + 1)}
                aria-label="Next testimonial"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  background: "#E0F7EA",
                  border: "none",
                  cursor: canNext ? "pointer" : "default",
                  opacity: canNext ? 1 : 0.45,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <ArrowIcon dir="next" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
