import React, { useState } from "react";

const S3 = "https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/landing";

function PlayIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
      <path d="M2 2L20 13L2 24V2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function VideoSection({ videoUrl = "#" }) {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "clamp(48px, 7vw, 96px) 0 clamp(56px, 8vw, 112px)",
      }}
    >
      <div className="mx-auto px-3" style={{ maxWidth: 1200 }}>

        {/* Heading */}
        <div>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(26px, 3.5vw, 41.832px)",
              lineHeight: "clamp(32px, 4.5vw, 48px)",
              color: "#0B1110",
              margin: 0,
            }}
          >
            See FirstDoer in{" "}
            <span className="relative inline-block" style={{ color: "#009966" }}>
              60 seconds.
              {/* underline accent */}
              <span
                style={{
                  position: "absolute",
                  left: 1.81,
                  bottom: 4,
                  width: "clamp(100px, 15vw, 197px)",
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
              fontSize: "clamp(14px, 1.6vw, 17px)",
              lineHeight: "26px",
              color: "#68726F",
              maxWidth: 565,
              margin: "12px 0 0",
            }}
          >
            Take a quick look at how FirstDoer turns one clear idea into a structured
            brief, a trusted match, and work you can confidently approve.
          </p>
        </div>

        {/* Video container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1024 / 645",
            marginTop: 42,
            background: "#111111",
            borderRadius: 24,
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => {
            if (videoUrl && videoUrl !== "#") {
              window.open(videoUrl, "_blank", "noopener,noreferrer");
            }
          }}
        >
          {/* Thumbnail */}
          <img
            src={`${S3}/video-thumbnail.png`}
            alt="FirstDoer platform demo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />

          {/* Overlay to darken thumbnail slightly */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.18)",
            }}
          />

          {/* Play button */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 74,
              height: 74,
              background: "#009966",
              borderRadius: "50%",
              boxShadow: "0 0 0 12px rgba(255,255,255,0.17)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlayIcon />
          </div>

          {/* Watch 1:00 pill */}
          <div
            style={{
              position: "absolute",
              left: 18,
              bottom: 36,
              background: "#FFFFFF",
              borderRadius: 999,
              padding: "7px 12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 11,
                lineHeight: "16px",
                color: "#0B1110",
                whiteSpace: "nowrap",
              }}
            >
              Watch 1:00
            </span>
          </div>

          {/* Progress bar — 25% watched */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background:
                "linear-gradient(90deg, #00A873 0%, #00A873 25%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.5) 100%)",
            }}
          />
        </div>

      </div>
    </section>
  );
}
