import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS = [
  {
    num: "01",
    title: "Content & Marketing",
    desc: "Create content and campaigns that help your brand connect with the right audience.",
    img: "/explore/design-creative.webp",
    imgFallback: "/explore/design-creative.png",
  },
  {
    num: "02",
    title: "Design & Creative",
    desc: "Bring your ideas to life with engaging visuals, interfaces, and creative experiences.",
    img: "/explore/content-marketing.webp",
    imgFallback: "/explore/content-marketing.png",
  },
  {
    num: "03",
    title: "Build & Develop",
    desc: "Turn your ideas into digital products with reliable websites, apps, and solutions.",
    img: "/explore/build-develop.webp",
    imgFallback: "/explore/build-develop.png",
  },
];

const INTERVAL = 3800;

export default function ExplorePossibilities() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % ITEMS.length);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, INTERVAL);
  }, [advance]);

  useEffect(() => {
    timerRef.current = setInterval(advance, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [advance]);

  const handleClick = (i) => {
    setActive(i);
    resetTimer();
  };

  return (
    <section className="w-full bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 mb-16 lg:mb-20">
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 4.5vw, 56px)",
              lineHeight: "105%",
              color: "#111111",
              maxWidth: 680,
            }}
          >
            Explore Your<br />
            <span style={{ color: "#009966" }}>Possibilities</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(16px, 1.9vw, 24px)",
              lineHeight: "155%",
              color: "#6E6D68",
              maxWidth: 522,
              textAlign: "right",
              paddingTop: 12,
            }}
            className="hidden lg:block"
          >
            From everyday household chores to specialized professional
            work&nbsp;– post anything and find the right executor.
          </p>
          {/* mobile version left-aligned */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "155%",
              color: "#6E6D68",
            }}
            className="lg:hidden"
          >
            From everyday household chores to specialized professional
            work&nbsp;– post anything and find the right executor.
          </p>
        </div>

        {/* Body: accordion left + image right */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">

          {/* Accordion */}
          <div className="w-full lg:w-[459px] lg:shrink-0 pt-0 lg:pt-[48px]">
            {ITEMS.map((item, i) => {
              const isActive = active === i;
              return (
                <button
                  key={item.num}
                  onClick={() => handleClick(i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    borderRadius: isActive ? 24 : 0,
                    background: isActive ? "#E7FBF1" : "transparent",
                    borderTop: "0.8px solid #F1F2F3",
                    padding: "22px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 16,
                    cursor: "pointer",
                    transition: "background 0.3s ease, border-radius 0.3s ease",
                    outline: "none",
                  }}
                >
                  {/* Number */}
                  <span
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 400,
                      fontSize: 24,
                      lineHeight: "30px",
                      color: "#009966",
                      width: 40,
                      flexShrink: 0,
                    }}
                  >
                    {item.num}
                  </span>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: isActive ? 600 : 400,
                          fontSize: 28,
                          lineHeight: "29px",
                          letterSpacing: "-1.26px",
                          color: isActive ? "#172734" : "#8A9099",
                          transition: "color 0.3s ease, font-weight 0.2s ease",
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: 17,
                          color: "#172734",
                          marginLeft: 12,
                          flexShrink: 0,
                          opacity: isActive ? 1 : 0.4,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        →
                      </span>
                    </div>

                    {/* Description – animates open on active */}
                    <div
                      style={{
                        overflow: "hidden",
                        maxHeight: isActive ? 80 : 0,
                        opacity: isActive ? 1 : 0,
                        transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
                        paddingTop: isActive ? 12.8 : 0,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 400,
                          fontSize: 14.08,
                          lineHeight: "22px",
                          color: "#777D86",
                          margin: 0,
                          maxWidth: 326,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Image panel */}
          <div className="relative w-full lg:flex-1 overflow-hidden rounded-[24px]" style={{ aspectRatio: "4/3" }}>
            <AnimatePresence mode="wait">
              <motion.picture
                key={active}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
              >
                <source srcSet={ITEMS[active].img} type="image/webp" />
                <img
                  src={ITEMS[active].imgFallback}
                  alt={ITEMS[active].title}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 24 }}
                />
              </motion.picture>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
