import React, { useCallback, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Splash Cursor – click ripples at cursor position (React Bits style).
 * Theme: green (#059669) with light opacity for light theme.
 */
const SPLASH_COLOR = "rgba(5, 150, 105, 0.35)";
const SPLASH_COLOR_INNER = "rgba(5, 150, 105, 0.2)";
const MAX_SPLASHES = 8;
const DURATION_MS = 800;

function Splash({ x, y, id, onEnd }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(onEnd, DURATION_MS);
    return () => clearTimeout(t);
  }, [onEnd]);

  return (
    <div
      ref={ref}
      className="splash-cursor-ripple"
      style={{
        "--splash-x": `${x}px`,
        "--splash-y": `${y}px`,
        "--splash-duration": `${DURATION_MS}ms`,
        "--splash-color": SPLASH_COLOR,
        "--splash-color-inner": SPLASH_COLOR_INNER,
      }}
      aria-hidden
    />
  );
}

export default function SplashCursor() {
  const [splashes, setSplashes] = useState([]);
  const idRef = useRef(0);

  const removeSplash = useCallback((id) => {
    setSplashes((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleClick = useCallback((e) => {
    const x = e.clientX;
    const y = e.clientY;
    const id = ++idRef.current;
    setSplashes((prev) => {
      const next = [...prev, { id, x, y }];
      return next.slice(-MAX_SPLASHES);
    });
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  const markup = (
    <div
      id="splash-cursor-root"
      className="splash-cursor-container"
      aria-hidden
    >
      {splashes.map(({ id, x, y }) => (
        <Splash
          key={id}
          id={id}
          x={x}
          y={y}
          onEnd={() => removeSplash(id)}
        />
      ))}
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(markup, document.body);
}
