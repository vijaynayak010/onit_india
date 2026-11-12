import React from "react";

const PROVIDER_APP_LINK =
  "https://play.google.com/store/apps/details?id=com.onitapp.india&pcampaignid=web_share";
const PERFORMER_APP_LINK =
  "https://play.google.com/store/apps/details?id=com.onitconsumer.india";

function GooglePlayBadge({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        width: 123,
        height: 36,
        border: "1.8px solid rgba(255,255,255,0.8)",
        borderRadius: 24,
        padding: "0 12px 0 11px",
        boxSizing: "border-box",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      {/* Play triangle */}
      <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
        <path d="M1 1.2L12 7.5L1 13.8V1.2Z" fill="white" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: 7,
            lineHeight: "10px",
            color: "rgba(255,255,255,0.72)",
            letterSpacing: 0.4,
          }}
        >
          GET IT ON
        </span>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            lineHeight: "14px",
            color: "#FFFFFF",
          }}
        >
          Google Play
        </span>
      </div>
    </a>
  );
}

function AppRow({ title, subtitle, href, borderBottom = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "11px 12px 11px 15px",
        borderTop: "0.8px solid #2D3A36",
        ...(borderBottom ? { borderBottom: "0.8px solid #2D3A36" } : {}),
        minHeight: 72,
        boxSizing: "border-box",
        gap: 14,
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            lineHeight: "16px",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: 8,
            lineHeight: "12px",
            color: "#82908A",
            margin: "4px 0 0",
          }}
        >
          {subtitle}
        </p>
      </div>
      <GooglePlayBadge href={href} />
    </div>
  );
}

export default function FinalCtaSection() {
  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "24px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="mx-3 md:mx-6"
        style={{
          maxWidth: 1200,
          width: "100%",
          background:
            "radial-gradient(95.69% 195.97% at 85% 10%, rgba(0,168,115,0.16) 0%, rgba(0,168,115,0) 30%), #07110D",
          border: "0.8px solid #18231F",
          boxShadow: "0px 30px 70px rgba(7,20,15,0.14)",
          borderRadius: 30,
          padding: "clamp(40px, 6vw, 68px) clamp(24px, 5vw, 67px)",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "clamp(40px, 6vw, 80px)",
          boxSizing: "border-box",
        }}
      >
        {/* ── Left: text + CTAs ── */}
        <div style={{ flex: "1 1 340px", minWidth: 0 }}>
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 9,
              lineHeight: "14px",
              letterSpacing: 1.08,
              color: "#A6ECC2",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Ready when you are
          </p>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 4.5vw, 54.98px)",
              lineHeight: "clamp(38px, 5vw, 57px)",
              letterSpacing: "-3.3px",
              color: "#FFFFFF",
              margin: "20px 0 0",
            }}
          >
            Ship your next task{" "}
            <span style={{ color: "#009966" }}>today.</span>
          </h2>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "22px",
              color: "#AEBBB6",
              margin: "13px 0 0",
              maxWidth: 358,
            }}
          >
            Post free and get matched with a verified performer.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/post-task"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 22px",
                background: "#009966",
                borderRadius: 999,
                textDecoration: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                lineHeight: "20px",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Post a Task
            </a>
            <a
              href="/become-a-performer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "13px 21px",
                border: "0.8px solid #40504A",
                borderRadius: 999,
                textDecoration: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 12,
                lineHeight: "18px",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Become a Performer
            </a>
          </div>
        </div>

        {/* ── Right: App download card ── */}
        <div
          style={{
            flexShrink: 0,
            width: "clamp(300px, 38%, 385px)",
            background: "rgba(255,255,255,0.043)",
            border: "0.8px solid #26342F",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: 20,
            padding: 30,
            boxSizing: "border-box",
          }}
        >
          {/* Card header */}
          <div>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 9,
                lineHeight: "14px",
                letterSpacing: 1.08,
                color: "#A6ECC2",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              FirstDoer Apps
            </p>
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 27,
                lineHeight: "40px",
                letterSpacing: "-1.08px",
                color: "#FFFFFF",
                margin: "10px 0 0",
              }}
            >
              Take FirstDoer with you.
            </h3>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 11,
                lineHeight: "16px",
                color: "#93A09B",
                margin: "6px 0 0",
              }}
            >
              Post tasks or complete them, wherever work happens.
            </p>
          </div>

          {/* App rows */}
          <div style={{ marginTop: 25 }}>
            <AppRow title="Task Provider" subtitle="For businesses" href={PROVIDER_APP_LINK} />
            <AppRow title="Task Performer" subtitle="For professionals" href={PERFORMER_APP_LINK} borderBottom />
          </div>
        </div>
      </div>
    </section>
  );
}
