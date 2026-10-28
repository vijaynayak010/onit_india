/**
 * Light Rays background – React Bits style
 * https://reactbits.dev/backgrounds/light-rays
 * Volumetric light rays from a configurable origin. CSS-based (no WebGL).
 */
import "./LightRays.css";
import { useRef } from "react";

function hexToRgba(hex, alpha = 0.25) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(255, 255, 255, ${alpha})`;
  return `rgba(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}, ${alpha})`;
}

const ORIGINS = {
  "top-center": { x: "50%", y: "0%", angleStart: -45, angleEnd: 45 },
  "top-left": { x: "0%", y: "0%", angleStart: -20, angleEnd: 70 },
  "top-right": { x: "100%", y: "0%", angleStart: -70, angleEnd: 20 },
  "bottom-center": { x: "50%", y: "100%", angleStart: 135, angleEnd: 225 },
  "bottom-left": { x: "0%", y: "100%", angleStart: 110, angleEnd: 200 },
  "bottom-right": { x: "100%", y: "100%", angleStart: 160, angleEnd: 250 },
  left: { x: "0%", y: "50%", angleStart: 0, angleEnd: 90 },
  right: { x: "100%", y: "50%", angleStart: 90, angleEnd: 180 },
};

export default function LightRays({
  raysOrigin = "top-center",
  raysColor = "#ffffff",
  rayCount = 7,
  rayLength = "70vh",
  lightSpread = 1,
  raysSpeed = 1,
  pulsating = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const origin = ORIGINS[raysOrigin] || ORIGINS["top-center"];
  const step = (origin.angleEnd - origin.angleStart) / (rayCount - 1 || 1);

  return (
    <div
      ref={containerRef}
      className={`light-rays-container ${pulsating ? "light-rays-pulsating" : ""} ${className}`.trim()}
      style={{
        "--rays-origin-x": origin.x,
        "--rays-origin-y": origin.y,
        "--rays-color": typeof raysColor === "string" && raysColor.startsWith("rgba")
          ? raysColor
          : hexToRgba(raysColor, 0.22),
        "--ray-length": typeof rayLength === "number" ? `${rayLength}px` : rayLength,
        "--rays-speed": raysSpeed,
      }}
      aria-hidden
    >
      {Array.from({ length: rayCount }, (_, i) => {
        const angle = origin.angleStart + step * i;
        return (
          <div
            key={i}
            className="light-ray"
            style={{
              "--ray-angle": `${angle}deg`,
              "--ray-spread": lightSpread,
            }}
          />
        );
      })}
    </div>
  );
}
