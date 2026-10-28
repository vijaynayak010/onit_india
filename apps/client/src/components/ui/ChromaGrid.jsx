/**
 * Chroma Grid – matches React Bits design exactly
 * https://reactbits.dev/components/chroma-grid
 * - Global cursor-follow spotlight (rest of grid dimmed/grayscale)
 * - Per-card: hover border + radial glow at mouse
 */
import "./ChromaGrid.css";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const defaultItems = [
  {
    image: "https://i.pravatar.cc/300?img=8",
    title: "Alex Rivera",
    subtitle: "Full Stack Developer",
    handle: "@alexrivera",
    borderColor: "#4F46E5",
    gradient: "linear-gradient(145deg,#4F46E5,#000)",
    url: "https://github.com/",
  },
  {
    image: "https://i.pravatar.cc/300?img=11",
    title: "Jordan Chen",
    subtitle: "DevOps Engineer",
    handle: "@jordanchen",
    borderColor: "#10B981",
    gradient: "linear-gradient(210deg,#10B981,#000)",
    url: "https://linkedin.com/in/",
  },
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Morgan Blake",
    subtitle: "UI/UX Designer",
    handle: "@morganblake",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(165deg,#F59E0B,#000)",
    url: "https://dribbble.com/",
  },
];

export default function ChromaGrid({
  items = defaultItems,
  className = "",
  radius = 220,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  compact = false,
  gridCols = 3,
}) {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const data = items?.length ? items : defaultItems;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const rect = el.getBoundingClientRect();
    pos.current = { x: rect.width / 2, y: rect.height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCardMove = (e) => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`chroma-grid-root relative grid w-full justify-center gap-2 sm:gap-3 p-4 sm:p-6 ${compact ? "chroma-grid-compact" : ""} ${className}`.trim()}
      style={{
        "--r": `${radius}px`,
        gridTemplateColumns: compact ? `repeat(${gridCols}, 1fr)` : "repeat(auto-fit, minmax(280px, 1fr))",
      }}
    >
      {/* Overlay: dimmed/grayscale everywhere except circle at cursor */}
      <div className="chroma-overlay" aria-hidden />
      {/* Fade: dimmed circle at cursor; fades out on move so spotlight shows */}
      <div ref={fadeRef} className="chroma-fade" aria-hidden />

      {data.map((c, i) => (
        <button
          key={c.handle || i}
          type="button"
          onClick={() => handleCardClick(c.url)}
          onMouseMove={handleCardMove}
          className={`chroma-card relative flex flex-col w-full overflow-hidden border border-[#333] transition-colors duration-300 cursor-pointer text-left min-w-0 ${compact ? "chroma-card-compact rounded-[14px]" : "rounded-[20px]"}`.trim()}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
          }}
        >
          <div className="chroma-img-wrapper aspect-[4/5] w-full">
            <img src={c.image} alt={c.title} />
          </div>
          <div className="chroma-info">
            <span className="font-semibold text-white">{c.title}</span>
            {c.handle && <span className="handle text-sm">{c.handle}</span>}
            {c.subtitle && (
              <span className="text-sm text-white/80 col-span-2">
                {c.subtitle}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
