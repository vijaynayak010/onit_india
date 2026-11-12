import React from "react";
import { Link } from "react-router-dom";

import photo1 from "../../assets/home/avatars/evan-clay.jpg";
import photo2 from "../../assets/home/avatars/alex-suprun.jpg";
import photo3 from "../../assets/home/avatars/joel-mott.jpg";

function IconEdit() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M12.5 2.5L15.5 5.5L6.5 14.5H3.5V11.5L12.5 2.5Z"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.5 4.5L13.5 7.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6.5" stroke="#6B7280" strokeWidth="1.5" />
      <path d="M9 5.5V9.5L11.5 11.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M10 2L4.5 10H8.5L8 16L13.5 8H9.5L10 2Z"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "0.8px solid #F3F4F6",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          background: "#F3F4F6",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 14,
          lineHeight: "19px",
          color: "#101828",
          marginTop: 12,
        }}
      >
        {title}
      </div>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "20px",
          color: "#99A1AF",
          margin: "8px 0 0",
        }}
      >
        {desc}
      </p>
    </div>
  );
}

export default function WhateverYouNeedSection() {
  return (
    <section className="w-full bg-white" style={{ overflow: "hidden" }}>
      <div className="relative mx-auto" style={{ maxWidth: 1440, minHeight: 804 }}>

        {/* ── Soft mint blur ellipse ── */}
        <div
          style={{
            position: "absolute",
            width: 915,
            height: 418,
            left: "calc(50% - 457.5px)",
            top: "calc(50% - 209px)",
            background: "#E1F4E9",
            filter: "blur(250px)",
            borderRadius: 99999,
            pointerEvents: "none",
          }}
        />

        {/* ── Centered headline + CTAs ── */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(50% - 165px)",
            transform: "translateX(-50%)",
            width: "min(1058px, 92vw)",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Line 1 */}
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(36px, 5.7vw, 82px)",
              lineHeight: 1.26,
              color: "#000000",
            }}
          >
            Whatever you need done,
          </div>
          {/* Line 2 */}
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(36px, 5.7vw, 82px)",
              lineHeight: 1.26,
            }}
          >
            <span style={{ color: "#000000" }}>there's </span>
            <span style={{ color: "#009966" }}>someone</span>
            <span style={{ color: "#000000" }}> for it.</span>
          </div>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: "clamp(48px, 9vw, 120px)",
            }}
          >
            <Link
              to="/auth"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#101828",
                color: "#FFFFFF",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "20px",
                padding: "12px 28px",
                borderRadius: 9999,
                textDecoration: "none",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
                whiteSpace: "nowrap",
              }}
            >
              Post Task
            </Link>
            <Link
              to="/how-it-works"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                color: "#4A5565",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "20px",
                padding: "11.2px 24px",
                borderRadius: 9999,
                border: "0.8px solid #E5E7EB",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              How it Works
            </Link>
          </div>
        </div>

        {/* ── Floating: SET YOUR BUDGET card (top-left) ── */}
        <div className="hidden lg:block" style={{ position: "absolute", left: 300, top: 40, width: 220, zIndex: 2 }}>
          <FeatureCard
            icon={<IconEdit />}
            title="SET YOUR BUDGET"
            desc="Choose a budget that works for your task before you get started."
          />
        </div>

        {/* ── Floating: person photo (top-right) ── */}
        <div
          className="hidden lg:block"
          style={{
            position: "absolute",
            left: 949,
            top: 72,
            width: 88.8,
            height: 90,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
            zIndex: 2,
          }}
        >
          <img
            src={photo1}
            alt="Performer"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
          />
        </div>

        {/* ── Floating: Rate Experience card (top-right) ── */}
        <div className="hidden lg:block" style={{ position: "absolute", left: 1068, top: 20, width: 220, zIndex: 2 }}>
          <FeatureCard
            icon={<IconClock />}
            title="FirstDoer Lets You Rate The Experience"
            desc="Share your feedback and review your performer after the task is complete."
          />
        </div>

        {/* ── Floating: GET IT DONE card (bottom-right) ── */}
        <div className="hidden lg:block" style={{ position: "absolute", left: 946, top: 540, width: 200, zIndex: 2 }}>
          <FeatureCard
            icon={<IconBolt />}
            title="GET IT DONE"
            desc="From a simple idea to a completed task, FirstDoer helps you get the work done."
          />
        </div>

        {/* ── Floating: stacked avatar bubbles (below GET IT DONE) ── */}
        <div
          className="hidden lg:flex"
          style={{ position: "absolute", left: 946, top: 730, flexDirection: "row", zIndex: 2 }}
        >
          {[photo2, photo3, photo1].map((src, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 36,
                borderRadius: 9999,
                border: "1.6px solid #FFFFFF",
                boxShadow: "0px 4px 6px -4px rgba(0,0,0,0.1)",
                overflow: "hidden",
                marginLeft: i > 0 ? -10 : 0,
                flexShrink: 0,
              }}
            >
              <img
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
          ))}
        </div>

        {/* ── Bottom gradient fade ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 151,
            background: "linear-gradient(0deg, #F9FAFB 0%, rgba(249,250,251,0) 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      </div>
    </section>
  );
}
