// ExploreCategoriesSection — two-column layout, app-style gradient cards
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const S3 = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing";

const CARDS = [
  {
    title: "Grow &\nMarketing",
    img: `${S3}/category-growth.png`,
    to: "/domains/content-design-marketing",
  },
  {
    title: "Design &\nCreative",
    img: `${S3}/category-design.png`,
    to: "/domains/content-design-marketing",
  },
  {
    title: "Build &\nDevelopment",
    img: `${S3}/category-build.png`,
    to: "/domains/tech-data-admin",
  },
];

function CategoryCard({ title, img, to, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      style={{ flex: 1, minWidth: 0 }}
    >
      <Link
        to={to}
        style={{
          display: "block",
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: 290,
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(175deg, #5BAD8E 0%, #9BD3B8 46%, #E5F4EE 100%)",
          textDecoration: "none",
        }}
      >
        {/* Title top-left */}
        <p
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 16,
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(17px, 1.6vw, 22px)",
            lineHeight: 1.25,
            color: "#FFFFFF",
            margin: 0,
            zIndex: 2,
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </p>

        {/* Image anchored to bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "62%",
            overflow: "hidden",
          }}
        >
          <img
            src={img}
            alt={title.replace("\n", " ")}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function ExploreCategoriesSection() {
  return (
    <section
      style={{
        padding: "clamp(56px, 7vw, 108px) 0",
        background: "#FFFFFF",
      }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 1176 }}>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "clamp(28px, 5vw, 72px)",
            flexWrap: "wrap",
          }}
        >

          {/* ── Left: copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              width: "clamp(200px, 28%, 340px)",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingBottom: 4,
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#EBF5EF",
                borderRadius: 100,
                padding: "5px 12px",
                marginBottom: 18,
                alignSelf: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#009966",
                  lineHeight: 1,
                }}
              >
                Categories
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "Outfit, sans-serif",
                fontWeight: 600,
                fontSize: "clamp(26px, 2.8vw, 40px)",
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
                color: "#0B1110",
                margin: "0 0 14px",
              }}
            >
              Browse By{" "}
              <span style={{ color: "#009966" }}>Category</span>
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(13px, 1.3vw, 15px)",
                lineHeight: 1.65,
                color: "#68726F",
                margin: "0 0 30px",
              }}
            >
              Find the right expert for your project — marketing, design, or development.
            </p>

            {/* See all */}
            <Link
              to="/domains/content-design-marketing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "Manrope, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "#009966",
                textDecoration: "none",
                alignSelf: "flex-start",
              }}
            >
              See all categories
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5"
                  stroke="#009966"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>

          {/* ── Right: three cards ── */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              gap: 10,
              minHeight: 290,
            }}
          >
            {CARDS.map((card, i) => (
              <CategoryCard key={card.title} {...card} delay={0.08 + i * 0.08} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
